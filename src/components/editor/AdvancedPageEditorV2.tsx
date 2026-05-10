import { useState, useRef, useEffect } from 'react';
import { PageElement, TextElement, ImageElement, ShapeElement, StickerElement, IconElement, FrameElement } from '../../types/editor';
import { AssetLibrary } from './AssetLibrary';
import { LayerPanel } from './LayerPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { RichTextToolbar } from './RichTextToolbar';
import { ImageUploader } from './ImageUploader';
import { SaveIndicator } from '../SaveIndicator';
import { ExportDownloadMenu } from '../ExportDownloadMenu';
import { CoverTemplateSelector } from './CoverTemplateSelector';
import { CoverGuide } from './CoverGuide';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { shapes } from '../../data/editorAssets';
import { BookData, BookPage } from '../../App';
import * as LucideIcons from 'lucide-react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Layers,
  Settings,
  Upload,
  Type,
  Image as ImageIcon,
  Save,
  Eye,
  X,
  Shapes,
  Palette,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdvancedPageEditorV2Props {
  book: BookData;
  pages: BookPage[];
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  onUpdatePage: (
    pageIndex: number,
    elements: PageElement[],
    background?: string,
    backgroundImage?: string
  ) => void;
  onSave: () => void;
  onPreview?: () => void;
  onBack?: () => void;
}

export function AdvancedPageEditorV2({
  book,
  pages,
  currentPageIndex,
  onPageChange,
  onUpdatePage,
  onSave,
  onPreview,
  onBack,
}: AdvancedPageEditorV2Props) {
  const currentPage = pages[currentPageIndex];
  const isMobile = useIsMobile();

  // Sidebar State
  const [activeSideTab, setActiveSideTab] = useState<'templates' | 'elements' | 'text' | 'uploads' | 'layers' | 'styles' | null>('templates');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-gray-500 mb-4">Không tìm thấy trang dữ liệu</p>
          <button onClick={onBack} className="text-rose-600 font-bold hover:underline">Quay lại</button>
        </div>
      </div>
    );
  }

  // Undo/Redo
  const {
    state: elements,
    setState: setElements,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  } = useUndoRedo<PageElement[]>({
    initialState: currentPage?.elements || [],
    maxHistory: 50,
  });

  // Auto-save
  const { saveStatus, lastSavedAt, forceSave } = useAutoSave({
    data: { elements, background: currentPage?.backgroundColor, backgroundImage: currentPage?.backgroundImage },
    onSave: (data) => {
      onUpdatePage(
        currentPageIndex,
        data.elements,
        data.background,
        data.backgroundImage
      );
      onSave();
    },
    interval: 30000,
    debounceTime: 2000,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [gridVisible, setGridVisible] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showCoverSelector, setShowCoverSelector] = useState(false);
  const [showCoverGuide, setShowCoverGuide] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const isCoverPage = currentPageIndex === 0 || currentPage?.id === 'cover';

  useEffect(() => {
    setElements(currentPage?.elements || []);
    setSelectedIds([]);
    clearHistory();
  }, [currentPageIndex]);

  const handlePageChange = (index: number) => {
    // Force a save of the current elements before switching
    onUpdatePage(
      currentPageIndex,
      elements,
      currentPage?.backgroundColor,
      currentPage?.backgroundImage
    );
    onPageChange(index);
  };

  const canvasRef = useRef<HTMLDivElement>(null);
  const PAGE_WIDTH = 400;
  const PAGE_HEIGHT = 600;

  const handleAddElement = (
    type: 'text' | 'image' | 'shape' | 'sticker' | 'icon' | 'frame',
    data: any
  ) => {
    const baseElement = {
      id: `el-${Date.now()}-${Math.random()}`,
      type,
      x: data.x || PAGE_WIDTH / 2 - 50,
      y: data.y || PAGE_HEIGHT / 2 - 50,
      width: data.width || 100,
      height: data.height || 100,
      rotation: data.rotation || 0,
      opacity: data.opacity || 1,
      locked: false,
      visible: true,
      zIndex: elements.length,
    };

    let newElement: PageElement;

    switch (type) {
      case 'text':
        newElement = {
          ...baseElement,
          type: 'text',
          content: data.content || 'Nhập nội dung...',
          fontFamily: data.fontFamily || 'Poppins',
          fontSize: data.fontSize || 24,
          fontWeight: data.fontWeight || 'normal',
          fontStyle: data.fontStyle || 'normal',
          color: data.color || '#000000',
          textAlign: data.textAlign || 'left',
          lineHeight: data.lineHeight || 1.4,
          letterSpacing: data.letterSpacing || 0,
          textDecoration: data.textDecoration || 'none',
        } as TextElement;
        break;
      case 'image':
        newElement = { ...baseElement, type: 'image', src: data.src, objectFit: data.objectFit || 'cover', width: 200, height: 200 } as ImageElement;
        break;
      case 'shape':
        newElement = { ...baseElement, type: 'shape', shape: data.shape, fill: data.fill || '#FF6B6B' } as ShapeElement;
        break;
      case 'sticker':
        newElement = { ...baseElement, type: 'sticker', emoji: data.emoji } as StickerElement;
        break;
      case 'icon':
        newElement = { ...baseElement, type: 'icon', iconName: data.iconName, color: data.color || '#000000', strokeWidth: 2 } as IconElement;
        break;
      case 'frame':
        newElement = { ...baseElement, type: 'frame', frameStyle: data.frameStyle || 'simple', color: data.color || '#000000', strokeWidth: 4 } as FrameElement;
        break;
      default: return;
    }

    setElements([...elements, newElement]);
    setSelectedIds([newElement.id]);
    toast.success('Đã thêm thành phần');
  };

  const handleUpdateElement = (id: string, updates: Partial<PageElement>) => {
    setElements(elements.map((el) => el.id === id ? { ...el, ...updates } : el));
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
    toast.info('Đã xóa thành phần');
  };

  const handleSelectElement = (id: string, multiSelect?: boolean) => {
    setEditingTextId(null);
    if (multiSelect) {
      setSelectedIds((prev) => prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  const handleDuplicate = () => {
    if (selectedIds.length === 0) return;
    const newElements = [...elements];
    selectedIds.forEach((sid) => {
      const el = elements.find(e => e.id === sid);
      if (el) {
        newElements.push({ ...el, id: `el-${Date.now()}-${Math.random()}`, x: el.x + 20, y: el.y + 20, zIndex: newElements.length });
      }
    });
    setElements(newElements);
    toast.success('Đã nhân bản');
  };

  const handleReorderElement = (id: string, direction: 'up' | 'down') => {
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex(el => el.id === id);
    if (direction === 'up' && idx < sorted.length - 1) {
      const temp = sorted[idx].zIndex;
      sorted[idx].zIndex = sorted[idx + 1].zIndex;
      sorted[idx + 1].zIndex = temp;
    } else if (direction === 'down' && idx > 0) {
      const temp = sorted[idx].zIndex;
      sorted[idx].zIndex = sorted[idx - 1].zIndex;
      sorted[idx - 1].zIndex = temp;
    }
    setElements([...sorted]);
  };

  // Drag logic
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const el = elements.find(e => e.id === id);
    if (!el || el.locked) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDraggedElement({ id, offsetX: e.clientX - rect.left - el.x * zoom, offsetY: e.clientY - rect.top - el.y * zoom });
    if (!selectedIds.includes(id)) handleSelectElement(id, e.shiftKey);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - draggedElement.offsetX) / zoom;
    const y = (e.clientY - rect.top - draggedElement.offsetY) / zoom;
    handleUpdateElement(draggedElement.id, { x, y });
  };

  const handleMouseUp = () => setDraggedElement(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIds([]);
      setEditingTextId(null);
    }
  };

  const selectedElement = selectedIds.length === 1 ? elements.find(e => e.id === selectedIds[0]) : null;

  const renderElement = (element: PageElement) => {
    const isSelected = selectedIds.includes(element.id);
    const isEditing = editingTextId === element.id;
    
    const style = {
      position: 'absolute' as const,
      left: element.x * zoom,
      top: element.y * zoom,
      width: element.width * zoom,
      height: element.height * zoom,
      transform: `rotate(${element.rotation}deg)`,
      opacity: element.opacity,
      zIndex: element.zIndex,
      cursor: element.locked ? 'not-allowed' : 'move',
      display: element.visible ? 'block' : 'none',
      border: isSelected ? '2px solid #E11D48' : 'none',
      boxShadow: isSelected ? '0 0 15px rgba(225,29,72,0.4)' : 'none',
      pointerEvents: element.locked ? 'none' as const : 'auto' as const,
    };

    switch (element.type) {
      case 'text':
        const textEl = element as TextElement;
        return (
          <div
            key={element.id}
            contentEditable={isEditing}
            suppressContentEditableWarning
            style={{ 
              ...style, 
              fontFamily: textEl.fontFamily, 
              fontSize: textEl.fontSize * zoom, 
              color: textEl.color, 
              textAlign: textEl.textAlign, 
              fontWeight: textEl.fontWeight, 
              whiteSpace: 'pre-wrap', 
              padding: '4px',
              outline: 'none',
              cursor: isEditing ? 'text' : style.cursor
            }}
            onMouseDown={(e) => {
              if (!isEditing) {
                handleMouseDown(e, element.id);
              } else {
                e.stopPropagation();
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditingTextId(element.id);
            }}
            onBlur={(e) => {
              const newContent = e.currentTarget.textContent || '';
              if (newContent !== textEl.content) {
                handleUpdateElement(element.id, { content: newContent });
              }
              setEditingTextId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.blur();
              }
              if (e.key === 'Escape') {
                e.currentTarget.textContent = textEl.content;
                e.currentTarget.blur();
              }
            }}
          >
            {textEl.content}
          </div>
        );
      case 'image':
        const imgEl = element as ImageElement;
        return (
          <div key={element.id} style={style} onMouseDown={(e) => handleMouseDown(e, element.id)}>
            <img src={imgEl.src} alt="" className="w-full h-full" style={{ objectFit: imgEl.objectFit }} />
          </div>
        );
      case 'shape':
        const shapeEl = element as ShapeElement;
        return (
          <div key={element.id} style={{ ...style, backgroundColor: shapeEl.fill, borderRadius: shapeEl.shape === 'circle' ? '50%' : '0' }} onMouseDown={(e) => handleMouseDown(e, element.id)} />
        );
      case 'sticker':
        const stickerEl = element as StickerElement;
        return (
          <div key={element.id} style={{ ...style, fontSize: element.height * zoom * 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseDown={(e) => handleMouseDown(e, element.id)}>
            {stickerEl.emoji}
          </div>
        );
      case 'icon':
        const iconEl = element as IconElement;
        const IconComponent = (LucideIcons as any)[iconEl.iconName];
        return (
          <div key={element.id} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseDown={(e) => handleMouseDown(e, element.id)}>
            {IconComponent && <IconComponent style={{ width: '100%', height: '100%', color: iconEl.color, strokeWidth: iconEl.strokeWidth }} />}
          </div>
        );
      case 'frame':
        const frameEl = element as FrameElement;
        return (
          <div 
            key={element.id} 
            style={{ 
              ...style, 
              border: `${frameEl.strokeWidth * zoom}px solid ${frameEl.color}`,
              boxSizing: 'border-box',
              pointerEvents: 'none'
            }} 
          />
        );
      default: return null;
    }
  };

  const navItems = [
    { id: 'templates', label: 'Mẫu', icon: Grid3x3 },
    { id: 'elements', label: 'Thành phần', icon: Shapes },
    { id: 'text', label: 'Văn bản', icon: Type },
    { id: 'uploads', label: 'Tải lên', icon: Upload },
    { id: 'layers', label: 'Lớp', icon: Layers },
    { id: 'styles', label: 'Màu sắc', icon: Palette },
  ];

  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden">
      {/* Mini Sidebar */}
      <div className="w-[72px] bg-[#18191B] flex flex-col items-center py-6 gap-4 z-30">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveSideTab(item.id as any); setSidebarExpanded(true); }}
            className={`w-full flex flex-col items-center gap-1 transition-all ${activeSideTab === item.id ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
        <button onClick={onBack} className="mt-auto p-3 text-gray-500 hover:text-white"><ChevronLeft /></button>
      </div>

      {/* Expanded Sidebar */}
      {sidebarExpanded && activeSideTab && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl animate-in slide-in-from-left duration-300">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-lg capitalize">{navItems.find(i => i.id === activeSideTab)?.label}</h3>
            <button onClick={() => setSidebarExpanded(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeSideTab === 'layers' ? (
              <LayerPanel
                elements={elements}
                selectedIds={selectedIds}
                onSelectElement={handleSelectElement}
                onToggleVisibility={(id) => {
                  const el = elements.find(e => e.id === id);
                  if (el) handleUpdateElement(id, { visible: !el.visible });
                }}
                onToggleLock={(id) => {
                  const el = elements.find(e => e.id === id);
                  if (el) handleUpdateElement(id, { locked: !el.locked });
                }}
                onDuplicate={(id) => {
                  const el = elements.find(e => e.id === id);
                  if (el) {
                    setElements([...elements, { ...el, id: `el-${Date.now()}`, x: el.x + 20, y: el.y + 20, zIndex: elements.length }]);
                  }
                }}
                onDelete={handleDeleteElement}
                onReorder={handleReorderElement}
              />
            ) : (
              <AssetLibrary 
                activeTab={
                  activeSideTab === 'elements' ? 'stickers' : 
                  activeSideTab === 'uploads' ? 'images' : 
                  activeSideTab === 'styles' ? 'styles' : 
                  activeSideTab === 'templates' ? 'templates' : 
                  activeSideTab === 'text' ? 'text' : undefined
                }
                onAddElement={handleAddElement} 
                onApplyTemplate={(t) => { if(confirm('Áp dụng mẫu?')){ setElements(t.elements); onUpdatePage(currentPageIndex, t.elements, t.backgroundColor); }}}
                onUpdateBackground={(bg) => onUpdatePage(currentPageIndex, elements, bg)}
              />
            )}
          </div>
        </div>
      )}

      {/* Workspace */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-14 bg-white border-b flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-gray-800">{book.title}</h2>
            <SaveIndicator status={saveStatus} lastSaved={lastSavedAt} />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={undo} disabled={!canUndo} className="p-2 disabled:opacity-20"><Undo2 className="w-5 h-5" /></button>
            <button onClick={redo} disabled={!canRedo} className="p-2 disabled:opacity-20"><Redo2 className="w-5 h-5" /></button>
            <div className="w-[1px] h-6 bg-gray-200 mx-2" />
            <button onClick={onPreview} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-bold hover:bg-rose-100 transition-all"><Eye className="w-4 h-4" /> Xem 3D</button>
            <button onClick={() => setShowExportMenu(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all"><Download className="w-4 h-4" /> Xuất bản</button>
          </div>
        </header>

        {/* Property Bar (Floating) */}
        {selectedElement && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-white px-4 py-2 rounded-xl shadow-2xl border flex items-center gap-4 animate-in slide-in-from-top-4">
            {selectedElement.type === 'text' && (
              <RichTextToolbar
                fontFamily={(selectedElement as TextElement).fontFamily}
                fontSize={(selectedElement as TextElement).fontSize}
                fontWeight={(selectedElement as TextElement).fontWeight}
                fontStyle={(selectedElement as TextElement).fontStyle}
                textDecoration={(selectedElement as TextElement).textDecoration}
                textAlign={(selectedElement as TextElement).textAlign}
                color={(selectedElement as TextElement).color}
                onFontFamilyChange={(v) => handleUpdateElement(selectedElement.id, { fontFamily: v })}
                onFontSizeChange={(v) => handleUpdateElement(selectedElement.id, { fontSize: v })}
                onFontWeightChange={(v) => handleUpdateElement(selectedElement.id, { fontWeight: v })}
                onFontStyleChange={(v) => handleUpdateElement(selectedElement.id, { fontStyle: v })}
                onTextDecorationChange={(v) => handleUpdateElement(selectedElement.id, { textDecoration: v })}
                onTextAlignChange={(v) => handleUpdateElement(selectedElement.id, { textAlign: v })}
                onColorChange={(v) => handleUpdateElement(selectedElement.id, { color: v })}
              />
            )}
            <button onClick={() => handleDeleteElement(selectedElement.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
        )}

        {/* Canvas */}
        <main className="flex-1 bg-[#F0F2F5] p-12 overflow-auto flex items-center justify-center">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              width: PAGE_WIDTH * zoom,
              height: PAGE_HEIGHT * zoom,
              backgroundColor: currentPage?.backgroundColor || '#FFFFFF',
              backgroundImage: currentPage?.backgroundImage ? `url(${currentPage.backgroundImage})` : 'none',
              backgroundSize: 'cover'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={handleCanvasClick}
          >
            {gridVisible && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: `${20*zoom}px ${20*zoom}px` }} />}
            {elements.sort((a,b) => a.zIndex - b.zIndex).map(renderElement)}
          </div>
        </main>

        {/* Footer Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border flex items-center gap-6">
          <div className="flex items-center gap-2 border-r pr-6">
            <button onClick={() => handlePageChange(currentPageIndex - 1)} disabled={currentPageIndex === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-20"><ChevronLeft /></button>
            <div className="bg-rose-50 px-4 py-1 rounded-lg text-rose-600 font-bold text-sm">Trang {currentPageIndex + 1} <span className="text-gray-400 font-normal">/ {pages.length}</span></div>
            <button onClick={() => handlePageChange(currentPageIndex + 1)} disabled={currentPageIndex === pages.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-20"><ChevronRight /></button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setZoom(Math.max(0.2, zoom - 0.1))}><ZoomOut className="w-5 h-5" /></button>
            <span className="text-xs font-bold w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(2, zoom + 0.1))}><ZoomIn className="w-5 h-5" /></button>
          </div>
          <button onClick={() => setGridVisible(!gridVisible)} className={`p-2 rounded-lg transition-all ${gridVisible ? 'bg-rose-500 text-white' : 'hover:bg-gray-100'}`}><Grid3x3 className="w-4 h-4" /></button>
        </div>
      </div>

      {showExportMenu && <ExportDownloadMenu book={book} pages={pages} onClose={() => setShowExportMenu(false)} />}
      {showImageUploader && <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="flex justify-between mb-6"><h3 className="text-xl font-bold">Thêm ảnh</h3><button onClick={() => setShowImageUploader(false)}><X /></button></div>
          <ImageUploader onImageUpload={(src) => { handleAddElement('image', { src }); setShowImageUploader(false); }} enableCrop={true} />
        </div>
      </div>}
      {showCoverSelector && <CoverTemplateSelector theme={book.theme} onSelect={(c) => { onUpdatePage(0, c.elements, c.backgroundColor); setShowCoverSelector(false); }} onClose={() => setShowCoverSelector(false)} />}
    </div>
  );
}