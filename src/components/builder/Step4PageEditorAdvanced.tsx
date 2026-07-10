import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Eye, ShoppingCart, Wand2, Sliders, Box } from 'lucide-react';
import { PageData, CharacterData, BookData } from '../../App';
import { PageElement } from '../../types/editor';
import { AdvancedPageEditor } from '../editor/AdvancedPageEditor';
import { AdvancedPageEditorV2 } from '../editor/AdvancedPageEditorV2';
import { templates } from '../../data/templates';
import autoData from '../../data/autoTemplates.json';
import { FlipBookReader } from '../FlipBookReader';

interface Step4PageEditorAdvancedProps {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  templateId: string;
  pages: PageData[];
  character?: CharacterData;
  title?: string;
  onChange: (pages: PageData[], title: string) => void;
  onBack?: () => void;
  onFinish: () => void;
}

export function Step4PageEditorAdvanced({
  theme,
  templateId,
  pages,
  character,
  title,
  onChange,
  onBack,
  onFinish,
}: Step4PageEditorAdvancedProps) {
  const [mode, setMode] = useState<'simple' | 'advanced'>('advanced');
  const [bookTitle, setBookTitle] = useState(title || 'Cuốn sách của tôi');
  const [localPages, setLocalPages] = useState(pages);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [show3DView, setShow3DView] = useState(false);

  // Đồng bộ localPages khi pages prop thay đổi (vd: khi load sách từ IndexedDB)
  useEffect(() => {
    if (pages && pages.length > 0) {
      setLocalPages(pages);
    }
  }, [pages]);


  // Canvas dimensions — sync with template aspectRatio (must match AdvancedPageEditorV2)
  const templateAspectRatio = useMemo(() => {
    if (templateId.startsWith('auto-template-') || templateId.startsWith('local-template-')) {
      const allTemplates = autoData.themes.flatMap(t => t.templates);
      const tpl = allTemplates.find(t => t.id === templateId);
      return (tpl as any)?.aspectRatio || '3/4';
    }
    return '3/4';
  }, [templateId]);
  const PAGE_W = templateAspectRatio === '1/1' ? 500 : 400;
  const PAGE_H = templateAspectRatio === '1/1' ? 500 : 600;

  // Scale a value from template coordinate space (up to ~800) to canvas space (400)
  const scaleX = (v: number, elW: number) => {
    if (v + elW <= PAGE_W * 1.1) return v; // already fits, keep as-is
    const ratio = PAGE_W / 800;
    return Math.round(v * ratio);
  };
  const scaleY = (v: number, elH: number) => {
    if (v + elH <= PAGE_H * 1.1) return v;
    const ratio = PAGE_H / 800;
    return Math.round(v * ratio);
  };
  const scaleW = (w: number) => Math.min(PAGE_W - 10, Math.round(w > PAGE_W ? w * (PAGE_W / 800) : w));
  const scaleH = (h: number) => Math.min(PAGE_H - 10, Math.round(h > PAGE_H ? h * (PAGE_H / 800) : h));

  // Convert PageData to Editor format
  const convertToEditorFormat = (): any[] => {
    if (!localPages || localPages.length === 0) {
      return [];
    }

    // ── LOCAL TEMPLATES & AUTO TEMPLATES ──────────────────────────────────
    // Các trang dùng ảnh template làm nền. Editor cho phép user thêm elements lên trên.
    if (templateId.startsWith('local-template-') || templateId.startsWith('auto-template-')) {
      return localPages.map((page) => {
        let elements = page.elements ? [...page.elements] : [];
        let background = page.background;

        // Lấy URL ảnh template từ nhiều nguồn khác nhau
        const templateImageUrl =
          (page as any).imageUrl ||                          // autoTemplates.json format
          page.images?.pageImage ||                          // PageData format
          (page as any).images?.pageImage ||                 // biến thể
          '';

        // Tìm template frame có sẵn trong elements (từ session trước)
        const existingFrame = elements.find(
          (el: any) => el.id && el.id.startsWith('template-frame-')
        );
        const frameImageUrl = (existingFrame as any)?.src || templateImageUrl;

        // TH1: Lần đầu convert - chưa có elements → tạo template frame + background
        if (!page.elements || page.elements.length === 0) {
          if (frameImageUrl) {
            const maxZ = elements.length > 0 ? Math.max(...elements.map((e: any) => e.zIndex || 0)) : 0;
            elements.push({
              id: `template-frame-${page.id}`,
              type: 'image',
              src: frameImageUrl,
              x: 0, y: 0,
              width: PAGE_W, height: PAGE_H,
              rotation: 0, opacity: 1,
              locked: true, visible: true,
              zIndex: maxZ + 10,
              objectFit: 'fill'
            });
          }
        }

        // TH2: Đã có elements nhưng background là màu trắng → lấy ảnh từ template frame làm background
        // (Xảy ra với sách đã lưu từ phiên bản cũ - background bị set thành màu trắng)
        if (background?.type !== 'image' && frameImageUrl) {
          background = { type: 'image', value: frameImageUrl };
        }

        return {
          id: page.id,
          elements,
          background: background || { type: 'color', value: '#FFFFFF' },
          width: PAGE_W,
          height: PAGE_H,
        };
      });
    }

    // Find the real template
    const template = templates.find(t => t.id === templateId);
    
    return localPages.map((page, idx) => {
      if (page.elements) return page; // Already in Editor format

      // Try to find the corresponding template page
      const templatePage = template?.pages[idx];
      
      // If template page exists, use its elements as base
      if (templatePage && templatePage.elements && Array.isArray(templatePage.elements)) {
        const elements: PageElement[] = templatePage.elements.map((el: any, elIdx: number) => {
          const rawW = (el as any).width || 100;
          const rawH = (el as any).height || 50;
          const rawX = (el as any).x || 0;
          const rawY = (el as any).y || 0;
          const w = scaleW(rawW);
          const h = scaleH(rawH);
          const x = Math.max(0, scaleX(rawX, rawW));
          const y = Math.max(0, scaleY(rawY, rawH));

          const base = {
            ...el,
            x, y, width: w, height: h,
            rotation: (el as any).rotation ?? 0,
            opacity: (el as any).opacity ?? 1,
            locked: false,
            visible: true,
            zIndex: (el as any).zIndex ?? elIdx,
          };

          if (el.type === 'text') {
            return {
              ...base,
              id: el.id || `text-${elIdx}`,
              lineHeight: (el as any).lineHeight || 1.5,
              letterSpacing: (el as any).letterSpacing || 0,
              textDecoration: (el as any).textDecoration || 'none',
              fontSize: Math.max(10, Math.round(((el as any).fontSize || 18) * (rawW > PAGE_W ? PAGE_W / 800 : 1))),
            } as PageElement;
          } else if (el.type === 'image') {
            return {
              ...base,
              id: el.id || `image-${elIdx}`,
              objectFit: (el as any).objectFit || 'cover',
            } as PageElement;
          } else if (el.type === 'sticker') {
            return {
              ...base,
              id: el.id || `sticker-${elIdx}`,
              type: 'sticker',
              emoji: (el as any).content || (el as any).emoji || '⭐',
            } as PageElement;
          }
          return { ...base, id: el.id || `el-${elIdx}` } as PageElement;
        });

        return {
          id: page.id,
          elements,
          background: {
            type: templatePage.backgroundImage ? 'image' : 'color',
            value: templatePage.backgroundImage || templatePage.backgroundColor || getThemeBackground()
          },
          width: PAGE_W,
          height: PAGE_H,
        };
      }

      // Fallback: convert from PageData (old format)
      const elements: PageElement[] = [];
      let zIndex = 0;

      // Convert texts to text elements
      if (page.texts && typeof page.texts === 'object') {
        Object.entries(page.texts).forEach(([key, value]) => {
        if (!value) return;

        let y = 50;
        let fontSize = 24;
        let fontWeight: 'normal' | 'bold' = 'normal';
        let fontFamily = 'Poppins';

        if (key === 'title') {
          y = 50;
          fontSize = 32;
          fontWeight = 'bold';
          fontFamily = 'Playfair Display';
        } else if (key === 'subtitle') {
          y = 100;
          fontSize = 18;
        } else if (key === 'heading') {
          y = 150;
          fontSize = 28;
          fontWeight = 'bold';
        } else if (key === 'content') {
          y = 200;
          fontSize = 16;
        } else if (key === 'message') {
          y = 500;
          fontSize = 20;
          fontFamily = 'Dancing Script';
        }

        elements.push({
          id: `text-${key}-${idx}`,
          type: 'text',
          content: value,
          x: 50,
          y,
          width: 300,
          height: 100,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: zIndex++,
          fontFamily,
          fontSize,
          fontWeight,
          fontStyle: 'normal',
          color: '#000000',
          textAlign: 'left',
          lineHeight: 1.5,
          letterSpacing: 0,
          textDecoration: 'none',
        });
        });
      }

      // Convert images to image elements
      if (page.images && typeof page.images === 'object') {
        Object.entries(page.images).forEach(([key, value]) => {
        if (!value) return;

        elements.push({
          id: `image-${key}-${idx}`,
          type: 'image',
          src: value,
          x: 50,
          y: 50,
          width: 300,
          height: 200,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: zIndex++,
          objectFit: 'cover',
        });
        });
      }

      return {
        id: page.id,
        elements,
        background: {
          type: 'color',
          value: getThemeBackground()
        },
        width: PAGE_W,
        height: PAGE_H,
      };
    });
  };

  const getThemeBackground = () => {
    const backgrounds = {
      love: '#FFE5E5',
      family: '#E3F2FD',
      birthday: '#F3E5F5',
      friendship: '#FFF3E0',
    };
    return backgrounds[theme];
  };

  // Convert Editor format back to PageData
  const convertFromEditorFormat = (editorPages: any[]) => {
    if (!editorPages || !Array.isArray(editorPages)) {
      return [];
    }
    
    return editorPages.map((editorPage, idx) => {
      const texts: { [key: string]: string } = {};
      const images: { [key: string]: string } = {};

      if (editorPage?.elements && Array.isArray(editorPage.elements)) {
        editorPage.elements.forEach((el: PageElement) => {
        if (el.type === 'text') {
          const textEl = el as any;
          // Try to determine the field key from ID
          const match = el.id.match(/text-(\w+)-/);
          const key = match ? match[1] : `text${Object.keys(texts).length}`;
          texts[key] = textEl.content;
        } else if (el.type === 'image') {
          const imageEl = el as any;
          const match = el.id.match(/image-(\w+)-/);
          const key = match ? match[1] : `img${Object.keys(images).length}`;
          images[key] = imageEl.src;
        }
        });
      }

      return {
        id: localPages[idx]?.id || `page-${idx}`,
        templatePageId: localPages[idx]?.templatePageId || '',
        texts,
        images,
      };
    });
  };

  // Memoize editor pages to prevent unnecessary re-renders and jitter
  const editorPages = useMemo(() => {
    return convertToEditorFormat();
  }, [localPages, theme, templateId]);

  const handleEditorSave = () => {
    // Save is handled automatically
    console.log('Editor saved');
  };

  const handlePageUpdate = (pageIndex: number, elements: PageElement[], background?: any, backgroundImage?: string) => {
    const editorFormat = convertToEditorFormat();
    if (editorFormat[pageIndex]) {
      editorFormat[pageIndex].elements = elements;
      if (background) {
        editorFormat[pageIndex].background = typeof background === 'string' 
          ? { type: 'color', value: background }
          : background;
      }
    }
    
    // Lưu thẳng định dạng EditorPage (chứa full elements) để không bị mất khi render lại
    setLocalPages(editorFormat);
    onChange(editorFormat, bookTitle);
  };

  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      templatePageId: '',
      texts: { content: 'Trang mới' },
      images: {}
    };
    const newPages = [...localPages, newPage];
    setLocalPages(newPages);
    setCurrentPageIndex(newPages.length - 1);
    onChange(newPages, bookTitle);
  };

  const handleDuplicatePage = (index: number) => {
    const pageToDup = localPages[index];
    const newPage = {
      ...JSON.parse(JSON.stringify(pageToDup)),
      id: `page-${Date.now()}`,
    };
    const newPages = [...localPages];
    newPages.splice(index + 1, 0, newPage);
    setLocalPages(newPages);
    setCurrentPageIndex(index + 1);
    onChange(newPages, bookTitle);
  };

  const handleDeletePage = (index: number) => {
    if (localPages.length <= 1) return;
    const newPages = localPages.filter((_, i) => i !== index);
    setLocalPages(newPages);
    setCurrentPageIndex(Math.min(currentPageIndex, newPages.length - 1));
    onChange(newPages, bookTitle);
  };

  const themeColors = {
    love:       'from-[#F5F2EE] to-[#EDE9E3]',
    family:     'from-[#F5F2EE] to-[#EDE9E3]',
    birthday:   'from-[#F5F2EE] to-[#EDE9E3]',
    friendship: 'from-[#F5F2EE] to-[#EDE9E3]',
  };

  if (mode === 'advanced') {
    // Create book data for V2 editor
    const bookData: BookData = {
      id: `book-${Date.now()}`,
      theme,
      templateId,
      pages: localPages,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: bookTitle,
    };

    return createPortal(
      <>
        <div className="fixed inset-0 z-[100]" style={{ background: '#FAFAF8' }}>
          {/* New V2 Editor with all features */}
          <AdvancedPageEditorV2
            book={bookData}
            pages={editorPages}
            currentPageIndex={currentPageIndex}
            onPageChange={setCurrentPageIndex}
            onUpdatePage={handlePageUpdate}
            onSave={handleEditorSave}
            onPreview={() => setShow3DView(true)}
            onBack={onBack ? () => {
              if (templateId.startsWith('local-template-') || templateId.startsWith('auto-template-') || templateId === 'youth-archive-memories') {
                onBack();
              } else {
                setMode('simple');
              }
            } : undefined}
            onAddPage={handleAddPage}
            onDeletePage={handleDeletePage}
            onDuplicatePage={handleDuplicatePage}
            onSaveOrder={onFinish}
            pageWidth={PAGE_W}
            pageHeight={PAGE_H}
          />
        </div>
        
        {/* FlipBook Reader for Advanced Mode */}
        {show3DView && (
          <div className="fixed inset-0 z-[110]">
            <FlipBookReader
              book={{
                id: templateId,
                title: bookTitle,
                theme,
                templateId,
                character,
                cover: templates.find(t => t.id === templateId)?.cover,
                pages: localPages,
                status: 'draft',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }}
              onClose={() => setShow3DView(false)}
            />
          </div>
        )}
      </>,
      document.body
    );
  }

  // Simple mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium"
          style={{ color: '#7A6F66' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Quay lại</span>
        </button>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShow3DView(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold"
            style={{ background: '#000000', color: '#FAFAF8' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
          >
            <Box className="w-4 h-4" />
            <span className="hidden sm:inline">Xem 3D</span>
          </button>
          <button
            onClick={() => setMode('advanced')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium border"
            style={{ background: '#EDE9E3', color: '#5A5049', borderColor: '#C8C2BA' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#DDD8D0')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Chế độ nâng cao</span>
            <Wand2 className="w-4 h-4" />
          </button>
          <button
            onClick={onFinish}
            className="flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-bold"
            style={{ background: 'linear-gradient(135deg, #000000 0%, #5A5049 100%)', color: '#FAFAF8', boxShadow: '0 4px 14px rgba(60,46,40,0.25)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #000000 0%, #000000 100%)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #000000 0%, #5A5049 100%)')}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Đặt hàng</span>
          </button>
        </div>
      </div>

      {/* Title Editor */}
      <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderColor: '#DDD8D0', boxShadow: '0 2px 10px rgba(60,46,40,0.06)' }}>
        <label className="block font-semibold mb-3" style={{ color: '#000000' }}>
          📖 Tên cuốn sách
        </label>
        <input
          type="text"
          value={bookTitle}
          onChange={(e) => {
            setBookTitle(e.target.value);
            onChange(localPages, e.target.value);
          }}
          className="w-full px-4 py-3 rounded-xl outline-none transition-all text-lg font-semibold border"
          style={{ borderColor: '#DDD8D0', color: '#000000', background: '#FAFAF8' }}
          placeholder="Nhập tên cuốn sách..."
          onFocus={e => { e.currentTarget.style.borderColor = '#7A6F66'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(122,111,102,0.12)'; }}
          onBlur={e  => { e.currentTarget.style.borderColor = '#DDD8D0'; e.currentTarget.style.boxShadow = 'none'; }}
        />
      </div>

      {/* Simple text editor for each page */}
      <div className="grid lg:grid-cols-2 gap-6">
        {localPages.map((page, pageIndex) => (
          <div
            key={page.id}
            className="rounded-2xl p-6 border"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderColor: '#DDD8D0', boxShadow: '0 2px 10px rgba(60,46,40,0.06)' }}
          >
            <h3 className="font-bold mb-4" style={{ color: '#000000' }}>
              Trang {pageIndex + 1}
            </h3>
            <div className="space-y-3">
              {page.texts && Object.entries(page.texts).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1 capitalize" style={{ color: '#7A6F66' }}>
                    {key}
                  </label>
                  {key === 'content' ? (
                    <textarea
                      value={value}
                      onChange={(e) => {
                        const updated = localPages.map((p, i) =>
                          i === pageIndex
                            ? { ...p, texts: { ...p.texts, [key]: e.target.value } }
                            : p
                        );
                        setLocalPages(updated);
                        onChange(updated, bookTitle);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg outline-none text-sm border transition-all"
                      style={{ borderColor: '#DDD8D0', color: '#000000', background: '#FAFAF8' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#7A6F66'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(122,111,102,0.12)'; }}
                      onBlur={e  => { e.currentTarget.style.borderColor = '#DDD8D0'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const updated = localPages.map((p, i) =>
                          i === pageIndex
                            ? { ...p, texts: { ...p.texts, [key]: e.target.value } }
                            : p
                        );
                        setLocalPages(updated);
                        onChange(updated, bookTitle);
                      }}
                      className="w-full px-3 py-2 rounded-lg outline-none text-sm border transition-all"
                      style={{ borderColor: '#DDD8D0', color: '#000000', background: '#FAFAF8' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#7A6F66'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(122,111,102,0.12)'; }}
                      onBlur={e  => { e.currentTarget.style.borderColor = '#DDD8D0'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Promotion for Advanced Mode */}
      <div className="rounded-2xl p-6 border-2" style={{ background: 'linear-gradient(135deg, #F5F2EE 0%, #EDE9E3 100%)', borderColor: '#C8C2BA' }}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#000000' }}>
            <Wand2 className="w-6 h-6" style={{ color: '#EDE9E3' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-2" style={{ color: '#000000' }}>
              🎨 Muốn thiết kế tự do hơn?
            </h3>
            <p className="mb-3" style={{ color: '#5A5049' }}>
              Sử dụng <strong>Chế độ nâng cao</strong> với editor chuyên nghiệp: drag & drop, thêm hình ảnh, icon, sticker, shapes và nhiều hiệu ứng đẹp mắt!
            </p>
            <button
              onClick={() => setMode('advanced')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium"
              style={{ background: '#000000', color: '#FAFAF8' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
            >
              <Sliders className="w-4 h-4" />
              <span>Mở chế độ nâng cao</span>
            </button>
          </div>
        </div>
      </div>

      {/* FlipBook Reader */}
      {show3DView && (
        <FlipBookReader
          book={{
            id: templateId,
            title: bookTitle,
            theme,
            templateId,
            character,
            cover: templates.find(t => t.id === templateId)?.cover || { id: 'cover', backgroundColor: '#fff', elements: [] },
            pages: localPages,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }}
          onClose={() => setShow3DView(false)}
        />
      )}
    </div>
  );
}