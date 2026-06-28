import { useState, useRef, useEffect } from 'react';
import { PageElement, TextElement, ImageElement, ShapeElement, StickerElement, IconElement } from '../../types/editor';
import { BookData, BookPage } from '../../App';
import { ImprovedEditorToolbar } from './ImprovedEditorToolbar';
import { ImprovedPropertiesPanel } from './ImprovedPropertiesPanel';
import { dbGetImageSync } from '../../utils/dbStorage';
import { AssetLibrary } from './AssetLibrary';
import { LayerPanel } from './LayerPanel';
import { ImageUploader } from './ImageUploader';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { shapes } from '../../data/editorAssets';
import * as LucideIcons from 'lucide-react';
import { 
  ChevronLeft, ChevronRight, Layers, Sparkles,
  X, Plus, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ImprovedAdvancedEditorProps {
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
  pageWidth?: number;
  pageHeight?: number;
}

export function ImprovedAdvancedEditor({
  book,
  pages,
  currentPageIndex,
  onPageChange,
  onUpdatePage,
  onSave,
  onPreview,
  onBack,
  pageWidth,
  pageHeight,
}: ImprovedAdvancedEditorProps) {
  const currentPage = pages[currentPageIndex];
  const isMobile = useIsMobile();

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Không tìm thấy trang</p>
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
    data: { 
      elements, 
      background: currentPage?.backgroundColor, 
      backgroundImage: currentPage?.backgroundImage 
    },
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
  const [gridVisible, setGridVisible] = useState(true);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [draggedElement, setDraggedElement] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const PAGE_WIDTH = pageWidth || 400;
  const PAGE_HEIGHT = pageHeight || 600;

  // Sync elements when page changes
  useEffect(() => {
    setElements(currentPage?.elements || []);
    setSelectedIds([]);
    clearHistory();
  }, [currentPageIndex]);

  const handleAddElement = (
    type: 'text' | 'image' | 'shape' | 'sticker' | 'icon',
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
          content: data.content || 'Nhập văn bản...',
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
        newElement = {
          ...baseElement,
          type: 'image',
          src: data.src,
          objectFit: data.objectFit || 'cover',
          width: data.width || 200,
          height: data.height || 200,
        } as ImageElement;
        break;

      case 'shape':
        newElement = {
          ...baseElement,
          type: 'shape',
          shape: data.shape,
          fill: data.fill || '#FF6B6B',
        } as ShapeElement;
        break;

      case 'sticker':
        newElement = {
          ...baseElement,
          type: 'sticker',
          emoji: data.emoji,
        } as StickerElement;
        break;

      case 'icon':
        newElement = {
          ...baseElement,
          type: 'icon',
          iconName: data.iconName,
          color: data.color || '#000000',
          strokeWidth: data.strokeWidth || 2,
        } as IconElement;
        break;

      default:
        return;
    }

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedIds([newElement.id]);
    toast.success('✨ Đã thêm phần tử mới');
  };

  const handleUpdateElement = (id: string, updates: Partial<PageElement>) => {
    const newElements = elements.map((el) =>
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
  };

  const handleDeleteElement = (id: string) => {
    const newElements = elements.filter((el) => el.id !== id);
    setElements(newElements);
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
    toast.info('🗑️ Đã xóa phần tử');
  };

  const handleSelectElement = (id: string, multiSelect?: boolean) => {
    if (multiSelect) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const handleDuplicate = () => {
    if (selectedIds.length === 0) return;

    const newElements = [...elements];
    selectedIds.forEach((targetId) => {
      const element = elements.find((el) => el.id === targetId);
      if (element) {
        const duplicate = {
          ...element,
          id: `el-${Date.now()}-${Math.random()}`,
          x: element.x + 20,
          y: element.y + 20,
          zIndex: elements.length + newElements.length,
        };
        newElements.push(duplicate);
      }
    });

    setElements(newElements);
    toast.success('✨ Đã nhân đôi phần tử');
  };

  const handleAlign = (type: 'left' | 'center' | 'right') => {
    if (selectedIds.length === 0) return;

    const newElements = elements.map((el) => {
      if (!selectedIds.includes(el.id)) return el;

      switch (type) {
        case 'left':
          return { ...el, x: 20 };
        case 'center':
          return { ...el, x: (PAGE_WIDTH - el.width) / 2 };
        case 'right':
          return { ...el, x: PAGE_WIDTH - el.width - 20 };
        default:
          return el;
      }
    });

    setElements(newElements);
    toast.success('📐 Đã căn chỉnh');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          forceSave();
          toast.success('💾 Đã lưu');
        } else if (e.key === 'd') {
          e.preventDefault();
          handleDuplicate();
        } else if (e.key === 'z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          e.preventDefault();
          selectedIds.forEach((id) => handleDeleteElement(id));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, forceSave, undo, redo]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (e.button !== 0) return;

    const element = elements.find((el) => el.id === elementId);
    if (!element || element.locked) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - element.x * zoom;
    const offsetY = e.clientY - rect.top - element.y * zoom;

    setDraggedElement({ id: elementId, offsetX, offsetY });

    if (!selectedIds.includes(elementId)) {
      handleSelectElement(elementId, e.shiftKey);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newX = (mouseX - draggedElement.offsetX) / zoom;
    let newY = (mouseY - draggedElement.offsetY) / zoom;

    // Snap to grid if enabled
    if (gridVisible) {
      newX = Math.round(newX / 20) * 20;
      newY = Math.round(newY / 20) * 20;
    }

    // Constrain to canvas
    newX = Math.max(0, Math.min(newX, PAGE_WIDTH));
    newY = Math.max(0, Math.min(newY, PAGE_HEIGHT));

    handleUpdateElement(draggedElement.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const selectedElement = selectedIds.length === 1 
    ? elements.find((el) => el.id === selectedIds[0]) 
    : null;

  const renderElement = (element: PageElement) => {
    const isSelected = selectedIds.includes(element.id);
    const transform = `translate(${element.x * zoom}px, ${element.y * zoom}px) rotate(${element.rotation}deg)`;

    const commonStyle = {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      width: element.width * zoom,
      height: element.height * zoom,
      transform,
      opacity: element.opacity,
      cursor: element.locked ? 'not-allowed' : 'move',
      display: element.visible ? 'block' : 'none',
      pointerEvents: element.locked ? ('none' as const) : ('auto' as const),
      border: isSelected ? '2px solid #9333EA' : 'none',
      boxShadow: isSelected ? '0 0 0 4px rgba(147, 51, 234, 0.2), 0 4px 12px rgba(147, 51, 234, 0.3)' : 'none',
      borderRadius: isSelected ? '4px' : '0',
    };

    let content;

    switch (element.type) {
      case 'text':
        const textEl = element as TextElement;
        content = (
          <div
            style={{
              ...commonStyle,
              fontFamily: textEl.fontFamily,
              fontSize: (textEl.fontSize || 24) * zoom,
              fontWeight: textEl.fontWeight,
              fontStyle: textEl.fontStyle,
              color: textEl.color,
              textAlign: textEl.textAlign,
              lineHeight: textEl.lineHeight,
              letterSpacing: (textEl.letterSpacing || 0) * zoom,
              textDecoration: textEl.textDecoration,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              userSelect: 'none',
              padding: '8px',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={() => handleSelectElement(element.id)}
          >
            {textEl.content}
          </div>
        );
        break;

      case 'image':
        const imgEl = element as ImageElement;
        const imgSrc = imgEl.src.startsWith('dearbook_image_')
          ? dbGetImageSync(imgEl.src) || imgEl.src
          : imgEl.src;
        content = (
          <div 
            style={commonStyle} 
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={() => handleSelectElement(element.id)}
          >
            <img
              src={imgSrc}
              alt={imgEl.alt || 'Image'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: imgEl.objectFit,
                pointerEvents: 'none',
                borderRadius: isSelected ? '4px' : '0',
              }}
            />
          </div>
        );
        break;

      case 'shape':
        const shapeEl = element as ShapeElement;
        const shapeData = shapes.find((s) => s.id === shapeEl.shape);
        content = (
          <div
            style={{
              ...commonStyle,
              backgroundColor: shapeEl.fill,
              borderRadius: shapeData?.borderRadius || 0,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={() => handleSelectElement(element.id)}
          />
        );
        break;

      case 'sticker':
        const stickerEl = element as StickerElement;
        content = (
          <div
            style={{
              ...commonStyle,
              fontSize: element.height * zoom * 0.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={() => handleSelectElement(element.id)}
          >
            {stickerEl.emoji}
          </div>
        );
        break;

      case 'icon':
        const iconEl = element as IconElement;
        const IconComponent = (LucideIcons as any)[iconEl.iconName];
        content = (
          <div
            style={{
              ...commonStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={() => handleSelectElement(element.id)}
          >
            {IconComponent && (
              <IconComponent
                style={{
                  width: '100%',
                  height: '100%',
                  color: iconEl.color,
                  strokeWidth: iconEl.strokeWidth,
                }}
              />
            )}
          </div>
        );
        break;

      default:
        content = null;
    }

    return <div key={element.id}>{content}</div>;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Left Sidebar - Asset Library */}
      {showAssetLibrary && !isMobile && (
        <div className="w-80 bg-white border-r border-gray-200 shadow-lg overflow-y-auto animate-in slide-in-from-left duration-300">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-600" />
                <h3 className="font-bold text-gray-900">Thư viện</h3>
              </div>
              <button
                onClick={() => setShowAssetLibrary(false)}
                className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Kéo thả để thêm phần tử vào trang
            </p>
          </div>
          <AssetLibrary onAddElement={handleAddElement} />
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Improved Toolbar */}
        {!isMobile && (
          <ImprovedEditorToolbar
            title={book.title || 'Chỉnh sửa trang'}
            zoom={zoom}
            canUndo={canUndo}
            canRedo={canRedo}
            gridVisible={gridVisible}
            saveStatus={saveStatus}
            onBack={onBack}
            onUndo={undo}
            onRedo={redo}
            onZoomIn={() => setZoom(Math.min(2, zoom + 0.1))}
            onZoomOut={() => setZoom(Math.max(0.5, zoom - 0.1))}
            onToggleGrid={() => setGridVisible(!gridVisible)}
            onPreview={onPreview}
            onSave={() => {
              forceSave();
              toast.success('💾 Đã lưu thành công');
            }}
            onAddText={() =>
              handleAddElement('text', {
                content: 'Nhập văn bản...',
                fontSize: 24,
              })
            }
            onAddImage={() => setShowImageUploader(true)}
            onShowAssets={() => setShowAssetLibrary(!showAssetLibrary)}
            onShowLayers={() => setShowLayersPanel(!showLayersPanel)}
            showAssets={showAssetLibrary}
            showLayers={showLayersPanel}
          />
        )}

        {/* Alignment Toolbar (when elements selected) */}
        {selectedIds.length > 0 && !isMobile && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">
                {selectedIds.length} phần tử được chọn
              </span>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => handleAlign('left')}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Căn trái"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAlign('center')}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Căn giữa"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAlign('right')}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Căn phải"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Canvas Area with Grid Background */}
        <div className="flex-1 flex items-center justify-center overflow-auto p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-2xl rounded-xl overflow-hidden ring-1 ring-gray-200"
            style={{
              width: PAGE_WIDTH * zoom,
              height: PAGE_HEIGHT * zoom,
              background: currentPage?.backgroundColor || '#FFFFFF',
              backgroundImage: currentPage?.backgroundImage
                ? `url(${currentPage.backgroundImage})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedIds([]);
              }
            }}
          >
            {/* Grid Overlay */}
            {gridVisible && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(147, 51, 234, 0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(147, 51, 234, 0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                }}
              />
            )}

            {/* Elements */}
            {elements && elements.length > 0 && elements
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((element) => renderElement(element))}

            {/* Empty State */}
            {(!elements || elements.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <Plus className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-medium">
                    Click "Text" hoặc "Ảnh" để bắt đầu
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Navigation */}
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between shadow-lg">
          <button
            onClick={() => onPageChange(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-400"
          >
            <ChevronLeft className="w-5 h-5" />
            {!isMobile && <span className="font-medium">Trước</span>}
          </button>

          <div className="flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <span className="font-bold text-gray-900">
              {currentPageIndex === 0 ? '📖 Trang bìa' : `Trang ${currentPageIndex + 1}`}
            </span>
            <span className="text-sm text-gray-500">/ {pages.length}</span>
          </div>

          <button
            onClick={() => onPageChange(Math.min(pages.length - 1, currentPageIndex + 1))}
            disabled={currentPageIndex === pages.length - 1}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-400"
          >
            {!isMobile && <span className="font-medium">Sau</span>}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right Sidebar - Layers & Properties */}
      {showLayersPanel && !isMobile && (
        <div className="w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
          {/* Layers Panel */}
          <div className="border-b border-gray-200">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Lớp</h3>
              </div>
              <p className="text-xs text-gray-600">
                {elements.length} phần tử trên trang
              </p>
            </div>
            <LayerPanel
              elements={elements}
              selectedIds={selectedIds}
              onSelectElement={handleSelectElement}
              onReorder={(id, direction) => {
                const element = elements.find((el) => el.id === id);
                if (!element) return;

                const sortedByZ = [...elements].sort((a, b) => a.zIndex - b.zIndex);
                const currentIndex = sortedByZ.findIndex((el) => el.id === id);

                if (direction === 'up' && currentIndex < sortedByZ.length - 1) {
                  const nextEl = sortedByZ[currentIndex + 1];
                  const temp = element.zIndex;
                  element.zIndex = nextEl.zIndex;
                  nextEl.zIndex = temp;
                } else if (direction === 'down' && currentIndex > 0) {
                  const prevEl = sortedByZ[currentIndex - 1];
                  const temp = element.zIndex;
                  element.zIndex = prevEl.zIndex;
                  prevEl.zIndex = temp;
                }

                setElements([...elements]);
              }}
              onDelete={handleDeleteElement}
              onToggleVisibility={(id) => {
                const element = elements.find((el) => el.id === id);
                if (element) {
                  handleUpdateElement(id, { visible: !element.visible });
                }
              }}
              onToggleLock={(id) => {
                const element = elements.find((el) => el.id === id);
                if (element) {
                  handleUpdateElement(id, { locked: !element.locked });
                }
              }}
            />
          </div>

          {/* Properties Panel */}
          <div className="flex-1">
            <ImprovedPropertiesPanel
              element={selectedElement}
              onUpdate={(updates) => {
                if (selectedElement) {
                  handleUpdateElement(selectedElement.id, updates);
                }
              }}
              onDuplicate={handleDuplicate}
              onDelete={() => {
                if (selectedElement) {
                  handleDeleteElement(selectedElement.id);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Thêm hình ảnh</h3>
              <button
                onClick={() => setShowImageUploader(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ImageUploader
              onImageSelect={(src) => {
                handleAddElement('image', { src });
                setShowImageUploader(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
