import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, ShoppingCart, Wand2, Sliders, Box } from 'lucide-react';
import { PageData, CharacterData, BookData, BookPage as BookPageType } from '../../App';
import { PageElement } from '../../types/editor';
import { AdvancedPageEditor } from '../editor/AdvancedPageEditor';
import { AdvancedPageEditorV2 } from '../editor/AdvancedPageEditorV2';
import { templates } from '../../data/templates';
import { FlipBookReader } from '../FlipBookReader';

interface Step4PageEditorAdvancedProps {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  templateId: string;
  pages: PageData[] | BookPageType[];
  character?: CharacterData;
  title?: string;
  onChange: (pages: any[], title: string) => void;
  onBack: () => void;
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
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [bookTitle, setBookTitle] = useState(title || 'Cuốn sách của tôi');
  const [localPages, setLocalPages] = useState(pages);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [show3DView, setShow3DView] = useState(false);

  // Convert PageData to Editor format
  const convertToEditorFormat = (): any[] => {
    // If pages are already in BookPage format (advanced), use them directly
    if (localPages && localPages.length > 0 && (localPages[0] as any).elements) {
      return localPages as BookPageType[];
    }

    const template = templates.find(t => t.id === templateId);
    
    if (!localPages || localPages.length === 0) {
      return [];
    }
    
    return localPages.map((page, idx) => {
      // Try to find the corresponding template page
      const templatePage = template?.pages[idx];
      
      // If template page exists, use its elements as base
      if (templatePage && templatePage.elements && Array.isArray(templatePage.elements)) {
        const elements: PageElement[] = templatePage.elements.map((el, elIdx) => {
          if (el.type === 'text') {
            return {
              ...el,
              id: el.id || `text-${elIdx}`,
              rotation: 0,
              opacity: 1,
              locked: false,
              visible: true,
              zIndex: elIdx,
              lineHeight: 1.5,
              letterSpacing: 0,
              textDecoration: 'none',
            } as PageElement;
          } else if (el.type === 'image') {
            return {
              ...el,
              id: el.id || `image-${elIdx}`,
              rotation: 0,
              opacity: 1,
              locked: false,
              visible: true,
              zIndex: elIdx,
              objectFit: 'cover',
            } as PageElement;
          } else if (el.type === 'sticker') {
            return {
              ...el,
              id: el.id || `sticker-${elIdx}`,
              type: 'text',
              rotation: 0,
              opacity: 1,
              locked: false,
              visible: true,
              zIndex: elIdx,
            } as PageElement;
          }
          return el as PageElement;
        });

        return {
          id: page.id,
          elements,
          background: templatePage.backgroundColor || getThemeBackground(),
          backgroundImage: templatePage.backgroundImage,
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
        background: getThemeBackground(),
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

  const handleEditorSave = () => {
    // Save is handled automatically
    console.log('Editor saved');
  };

  const handlePageUpdate = (pageIndex: number, elements: PageElement[], background?: string, backgroundImage?: string) => {
    // In advanced mode, we work with the full BookPage format to avoid data loss
    const editorFormat = convertToEditorFormat();
    
    if (!editorFormat || !editorFormat[pageIndex]) {
      console.error('Invalid page index or editor format');
      return;
    }
    
    const updatedPage = {
      ...editorFormat[pageIndex],
      elements: elements || [],
      background: background || editorFormat[pageIndex]?.background || '#FFFFFF',
      backgroundImage: backgroundImage || editorFormat[pageIndex].backgroundImage,
    };

    const newEditorPages = [...editorFormat];
    newEditorPages[pageIndex] = updatedPage;
    
    // In advanced mode, we save the full format
    if (mode === 'advanced') {
      setLocalPages(newEditorPages as any);
      onChange(newEditorPages, bookTitle);
    } else {
      // In simple mode, we convert back (some loss expected but usually okay for simple edits)
      const newPages = convertFromEditorFormat(newEditorPages);
      setLocalPages(newPages);
      onChange(newPages, bookTitle);
    }
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

    return (
      <>
        <div className="fixed inset-0 z-50" style={{ background: '#FAFAF8' }}>
          {/* New V2 Editor with all features */}
          <AdvancedPageEditorV2
            book={bookData}
            pages={convertToEditorFormat()}
            currentPageIndex={currentPageIndex}
            onPageChange={setCurrentPageIndex}
            onUpdatePage={handlePageUpdate}
            onSave={handleEditorSave}
            onPreview={() => setShow3DView(true)}
            onBack={() => setMode('simple')}
          />
        </div>
        
        {/* FlipBook Reader for Advanced Mode */}
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
      </>
    );
  }

  // Simple mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShow3DView(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold"
            style={{ background: '#3A2E28', color: '#FAFAF8' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#1C1715')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#3A2E28')}
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
            style={{ background: 'linear-gradient(135deg, #3A2E28 0%, #5A5049 100%)', color: '#FAFAF8', boxShadow: '0 4px 14px rgba(60,46,40,0.25)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #1C1715 0%, #3A2E28 100%)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #3A2E28 0%, #5A5049 100%)')}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Đặt hàng</span>
          </button>
        </div>
      </div>

      {/* Title Editor */}
      <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderColor: '#DDD8D0', boxShadow: '0 2px 10px rgba(60,46,40,0.06)' }}>
        <label className="block font-semibold mb-3" style={{ color: '#3A2E28' }}>
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
          style={{ borderColor: '#DDD8D0', color: '#3A2E28', background: '#FAFAF8' }}
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
            <h3 className="font-bold mb-4" style={{ color: '#3A2E28' }}>
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
                      style={{ borderColor: '#DDD8D0', color: '#3A2E28', background: '#FAFAF8' }}
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
                      style={{ borderColor: '#DDD8D0', color: '#3A2E28', background: '#FAFAF8' }}
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

      {/* Promotion for Advanced Mode - Canva Style */}
      <div 
        className="rounded-3xl p-8 border-2 relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl" 
        style={{ 
          background: 'linear-gradient(135deg, #3A2E28 0%, #1C1715 100%)', 
          borderColor: '#C8C2BA' 
        }}
        onClick={() => setMode('advanced')}
      >
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl group-hover:bg-rose-500/30 transition-all" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
            <Wand2 className="w-10 h-10 text-rose-300" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h3 className="text-2xl font-bold text-white">
                Thiết kế tự do như Canva
              </h3>
              <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                Pro Feature
              </span>
            </div>
            <p className="text-rose-100/80 text-lg mb-4 max-w-xl">
              Mở khóa trình chỉnh sửa chuyên nghiệp: Kéo thả linh hoạt, thêm Sticker, Icon, Hình khối và hàng trăm mẫu Layout độc đáo.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">✨ Kéo thả</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">🎨 Sticker & Icon</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">📝 Font chữ đẹp</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">📐 Bố cục mẫu</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              className="flex items-center gap-2 px-8 py-4 bg-white text-[#3A2E28] rounded-2xl font-bold text-lg hover:bg-rose-50 transition-all shadow-lg active:scale-95"
            >
              <Sliders className="w-5 h-5" />
              <span>Thử ngay</span>
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