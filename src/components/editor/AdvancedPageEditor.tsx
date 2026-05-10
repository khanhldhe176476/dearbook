import { useState, useRef, useEffect } from 'react';
import { PageElement, TextElement, ImageElement, ShapeElement, StickerElement, IconElement, FrameElement } from '../../types/editor';
import { AssetLibrary } from './AssetLibrary';
import { LayerPanel } from './LayerPanel';
import { PropertiesPanelAdvanced } from './PropertiesPanelAdvanced';
import { EditorToolbar } from './EditorToolbar';
import { shapes, frames } from '../../data/editorAssets';
import * as LucideIcons from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdvancedPageEditorProps {
  pages: {
    id: string;
    elements: PageElement[];
    background: string;
    backgroundImage?: string;
  }[];
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  onUpdatePage: (pageIndex: number, elements: PageElement[], background?: string, backgroundImage?: string) => void;
  onSave: () => void;
}

export function AdvancedPageEditor({
  pages,
  currentPageIndex,
  onPageChange,
  onUpdatePage,
  onSave,
}: AdvancedPageEditorProps) {
  const [elements, setElements] = useState<PageElement[]>(pages[currentPageIndex]?.elements || []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [gridVisible, setGridVisible] = useState(false);
  const [history, setHistory] = useState<PageElement[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [draggedElement, setDraggedElement] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [resizingElement, setResizingElement] = useState<{ id: string; handle: string; startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const PAGE_WIDTH = 400;
  const PAGE_HEIGHT = 600;

  // Sync elements when page changes
  useEffect(() => {
    setElements(pages[currentPageIndex]?.elements || []);
    setSelectedIds([]);
  }, [currentPageIndex]);

  // Auto-save when elements change
  useEffect(() => {
    const timeout = setTimeout(() => {
      onUpdatePage(currentPageIndex, elements, pages[currentPageIndex]?.background, pages[currentPageIndex]?.backgroundImage);
    }, 300);
    return () => clearTimeout(timeout);
  }, [elements]);

  const addToHistory = (newElements: PageElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleAddElement = (type: 'text' | 'image' | 'shape' | 'sticker' | 'icon' | 'frame', data: any) => {
    const baseElement = {
      id: `el-${Date.now()}-${Math.random()}`,
      type,
      x: data.x || 100,
      y: data.y || 100,
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
        newElement = {
          ...baseElement,
          type: 'image',
          src: data.src,
          objectFit: data.objectFit || 'cover',
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

      case 'frame':
        newElement = {
          ...baseElement,
          type: 'frame',
          frameStyle: data.frameStyle,
          color: data.color || '#000000',
          strokeWidth: data.strokeWidth || 2,
        } as FrameElement;
        break;

      default:
        return;
    }

    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedIds([newElement.id]);
  };

  const handleUpdateElement = (id: string, updates: Partial<PageElement>) => {
    const newElements = elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  const handleDeleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    addToHistory(newElements);
    setSelectedIds(selectedIds.filter(sid => sid !== id));
  };

  const handleSelectElement = (id: string, multiSelect?: boolean) => {
    if (multiSelect) {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const handleReorderElement = (id: string, direction: 'up' | 'down') => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const sortedByZ = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sortedByZ.findIndex(el => el.id === id);
    
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
  };

  const handleDuplicate = (id?: string) => {
    const targetIds = id ? [id] : selectedIds;
    const newElements = [...elements];
    
    targetIds.forEach(targetId => {
      const element = elements.find(el => el.id === targetId);
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
    addToHistory(newElements);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  const handleAlign = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedIds.length === 0) return;

    const newElements = elements.map(el => {
      if (!selectedIds.includes(el.id)) return el;

      switch (type) {
        case 'left':
          return { ...el, x: 50 };
        case 'center':
          return { ...el, x: (PAGE_WIDTH - el.width) / 2 };
        case 'right':
          return { ...el, x: PAGE_WIDTH - el.width - 50 };
        case 'top':
          return { ...el, y: 50 };
        case 'middle':
          return { ...el, y: (PAGE_HEIGHT - el.height) / 2 };
        case 'bottom':
          return { ...el, y: PAGE_HEIGHT - el.height - 50 };
        default:
          return el;
      }
    });

    setElements(newElements);
    addToHistory(newElements);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          handleUndo();
        } else if (e.key === 'y') {
          e.preventDefault();
          handleRedo();
        } else if (e.key === 's') {
          e.preventDefault();
          onSave();
        } else if (e.key === 'd') {
          e.preventDefault();
          handleDuplicate();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        selectedIds.forEach(id => handleDeleteElement(id));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, historyIndex]);

  // Mouse handlers for drag
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (e.button !== 0) return; // Only left click
    
    const element = elements.find(el => el.id === elementId);
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
    if (!draggedElement && !resizingElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (draggedElement) {
      const newX = (mouseX - draggedElement.offsetX) / zoom;
      const newY = (mouseY - draggedElement.offsetY) / zoom;
      handleUpdateElement(draggedElement.id, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
    setResizingElement(null);
  };

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
      pointerEvents: element.locked ? 'none' as const : 'auto' as const,
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
              textShadow: textEl.textShadow,
              background: textEl.background,
              padding: textEl.padding,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              cursor: 'move',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {textEl.content}
          </div>
        );
        break;

      case 'image':
        const imgEl = element as ImageElement;
        content = (
          <div
            style={commonStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            <img
              src={imgEl.src}
              alt={imgEl.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: imgEl.objectFit,
                filter: imgEl.filter,
                borderRadius: imgEl.borderRadius,
                border: imgEl.border,
              }}
              draggable={false}
            />
          </div>
        );
        break;

      case 'shape':
        const shapeEl = element as ShapeElement;
        const shapeData = shapes.find(s => s.id === shapeEl.shape);
        content = (
          <div
            style={commonStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {shapeData && (
              <svg viewBox={shapeData.viewBox} width="100%" height="100%">
                <g
                  dangerouslySetInnerHTML={{
                    __html: shapeData.svg
                      .replace(/currentColor/g, shapeEl.fill)
                      .replace(/fill="currentColor"/g, `fill="${shapeEl.fill}"${shapeEl.stroke ? ` stroke="${shapeEl.stroke}" stroke-width="${shapeEl.strokeWidth}"` : ''}`)
                  }}
                />
              </svg>
            )}
          </div>
        );
        break;

      case 'sticker':
        const stickerEl = element as StickerElement;
        content = (
          <div
            style={{
              ...commonStyle,
              fontSize: element.width * 0.8 * zoom,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: stickerEl.filter,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
            style={commonStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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

      case 'frame':
        const frameEl = element as FrameElement;
        const frameData = frames.find(f => f.id === frameEl.frameStyle);
        content = (
          <div
            style={commonStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {frameData && (
              <svg viewBox={frameData.viewBox} width="100%" height="100%">
                <g
                  dangerouslySetInnerHTML={{
                    __html: frameData.svg.replace(/currentColor/g, frameEl.color)
                  }}
                />
              </svg>
            )}
          </div>
        );
        break;
    }

    return (
      <div key={element.id}>
        {content}
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              left: element.x * zoom - 2,
              top: element.y * zoom - 2,
              width: element.width * zoom + 4,
              height: element.height * zoom + 4,
              border: '2px solid #F43F5E',
              pointerEvents: 'none',
              borderRadius: 4,
              transform: `rotate(${element.rotation}deg)`,
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <EditorToolbar
        zoom={zoom}
        onZoomIn={() => setZoom(Math.min(zoom + 0.1, 2))}
        onZoomOut={() => setZoom(Math.max(zoom - 0.1, 0.5))}
        onZoomFit={() => setZoom(1)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        hasSelection={selectedIds.length > 0}
        onAlignLeft={() => handleAlign('left')}
        onAlignCenter={() => handleAlign('center')}
        onAlignRight={() => handleAlign('right')}
        onAlignTop={() => handleAlign('top')}
        onAlignMiddle={() => handleAlign('middle')}
        onAlignBottom={() => handleAlign('bottom')}
        onDuplicate={() => handleDuplicate()}
        onDelete={() => selectedIds.forEach(id => handleDeleteElement(id))}
        onToggleGrid={() => setGridVisible(!gridVisible)}
        gridVisible={gridVisible}
        onSave={onSave}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Asset Library */}
        <div className="w-64 border-r overflow-hidden flex flex-col">
          <AssetLibrary onAddElement={handleAddElement} />
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Page Navigation */}
          <div className="bg-white border-b px-4 py-2 flex items-center justify-center gap-4">
            <button
              onClick={() => onPageChange(Math.max(0, currentPageIndex - 1))}
              disabled={currentPageIndex === 0}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">
              Trang {currentPageIndex + 1} / {pages.length}
            </span>
            <button
              onClick={() => onPageChange(Math.min(pages.length - 1, currentPageIndex + 1))}
              disabled={currentPageIndex === pages.length - 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Canvas */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-8"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              ref={canvasRef}
              className="relative bg-white shadow-2xl"
              style={{
                width: PAGE_WIDTH * zoom,
                height: PAGE_HEIGHT * zoom,
                backgroundColor: pages[currentPageIndex]?.background || '#FFFFFF',
                backgroundImage: pages[currentPageIndex]?.backgroundImage 
                  ? `url(${pages[currentPageIndex].backgroundImage})`
                  : gridVisible
                  ? 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)'
                  : undefined,
                backgroundSize: pages[currentPageIndex]?.backgroundImage ? 'cover' : gridVisible ? `${20 * zoom}px ${20 * zoom}px` : undefined,
                backgroundPosition: pages[currentPageIndex]?.backgroundImage ? 'center' : undefined,
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedIds([]);
                }
              }}
            >
              {elements
                .sort((a, b) => a.zIndex - b.zIndex)
                .map(element => renderElement(element))}
            </div>
          </div>
        </div>

        {/* Right Panels */}
        <div className="w-80 border-l flex flex-col overflow-hidden">
          <div className="h-1/2 overflow-y-auto border-b">
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
              onDuplicate={handleDuplicate}
              onDelete={handleDeleteElement}
              onReorder={handleReorderElement}
            />
          </div>
          <div className="h-1/2 overflow-y-auto">
            <PropertiesPanelAdvanced
              selectedElements={elements.filter(el => selectedIds.includes(el.id))}
              onUpdateElement={handleUpdateElement}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
