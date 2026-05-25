import { useState, useRef } from 'react';
import {
  Eye, EyeOff, Lock, Unlock, Copy, Trash2, Type, Image, Circle,
  Sparkles, GripVertical, LayoutTemplate,
} from 'lucide-react';
import { PageElement } from '../../types/editor';

interface LayerPanelProps {
  elements: PageElement[];
  selectedIds: string[];
  onSelectElement: (id: string, multiSelect?: boolean) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onReorderByIndex?: (fromIndex: number, toIndex: number) => void;
}

export function LayerPanel({
  elements,
  selectedIds,
  onSelectElement,
  onToggleVisibility,
  onToggleLock,
  onDuplicate,
  onDelete,
  onReorder,
  onReorderByIndex,
}: LayerPanelProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  // Sort by zIndex (highest = top of list = visually on top)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const isTemplateFrame = (el: PageElement) => el.id.startsWith('template-frame-');

  const getElementIcon = (element: PageElement) => {
    if (isTemplateFrame(element)) return <LayoutTemplate className="w-4 h-4 text-amber-600" />;
    switch (element.type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'shape': return <Circle className="w-4 h-4" />;
      case 'sticker': return <Sparkles className="w-4 h-4" />;
      case 'icon': return <Sparkles className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getElementLabel = (element: PageElement): string => {
    if (isTemplateFrame(element)) return '🖼 Template';
    switch (element.type) {
      case 'text':
        return (element as any).content?.substring(0, 22) + ((element as any).content?.length > 22 ? '…' : '') || 'Văn bản';
      case 'image': return 'Hình ảnh';
      case 'shape': return `Hình ${(element as any).shape || ''}`;
      case 'sticker': return (element as any).emoji || 'Sticker';
      case 'icon': return `Icon`;
      case 'frame': return 'Khung viền';
      default: return 'Phần tử';
    }
  };

  const getImageThumb = (element: PageElement): string | null => {
    if (element.type !== 'image') return null;
    const src = (element as any).src || '';
    if (!src) return null;
    if (src.startsWith('dearbook_image_')) {
      return localStorage.getItem(src) || null;
    }
    return src;
  };

  // ────────── Drag-and-drop handlers ──────────
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null || fromIndex === toIndex) {
      setDragOverIndex(null);
      return;
    }

    if (onReorderByIndex) {
      onReorderByIndex(fromIndex, toIndex);
    } else {
      // Fallback: use up/down direction multiple times
      const steps = toIndex - fromIndex;
      const direction = steps > 0 ? 'down' : 'up';
      const elementId = sortedElements[fromIndex].id;
      for (let i = 0; i < Math.abs(steps); i++) {
        onReorder(elementId, direction);
      }
    }
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="h-full flex flex-col bg-white select-none">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
        <p className="text-xs text-gray-500 mt-0.5">Kéo thả để sắp xếp thứ tự</p>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        {sortedElements.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Circle className="w-10 h-10 mx-auto mb-3 opacity-25" />
            <p className="text-sm">Chưa có phần tử nào</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sortedElements.map((element, index) => {
              const isSelected = selectedIds.includes(element.id);
              const isTemplate = isTemplateFrame(element);
              const thumb = getImageThumb(element);
              const isDropTarget = dragOverIndex === index;

              return (
                <div
                  key={element.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => onSelectElement(element.id, e.shiftKey)}
                  className={`
                    group relative flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all duration-150
                    ${isSelected
                      ? 'bg-indigo-50 ring-2 ring-indigo-400 shadow-sm'
                      : 'hover:bg-gray-50'
                    }
                    ${!element.visible ? 'opacity-40' : ''}
                    ${isDropTarget ? 'ring-2 ring-amber-400 bg-amber-50' : ''}
                  `}
                  style={{ userSelect: 'none' }}
                >
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  {/* Thumbnail or Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-md overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <span className={isSelected ? 'text-indigo-500' : 'text-gray-400'}>
                        {getElementIcon(element)}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold truncate ${isSelected ? 'text-indigo-700' : 'text-gray-800'}`}>
                      {getElementLabel(element)}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      {isTemplate && (
                        <span className="bg-amber-100 text-amber-700 px-1 rounded text-[9px] font-bold">TEMPLATE</span>
                      )}
                      {element.locked && <Lock className="w-2.5 h-2.5" />}
                      <span>z: {element.zIndex}</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons (shown on hover/select) */}
                  <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Visibility */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleVisibility(element.id); }}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                      title={element.visible ? 'Ẩn' : 'Hiện'}
                    >
                      {element.visible
                        ? <Eye className="w-3.5 h-3.5 text-gray-600" />
                        : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                    </button>

                    {/* Lock */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleLock(element.id); }}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                      title={element.locked ? 'Mở khoá' : 'Khoá'}
                    >
                      {element.locked
                        ? <Lock className="w-3.5 h-3.5 text-amber-600" />
                        : <Unlock className="w-3.5 h-3.5 text-gray-400" />}
                    </button>

                    {/* Duplicate (not for template) */}
                    {!isTemplate && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDuplicate(element.id); }}
                        className="p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Nhân bản"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    )}

                    {/* Delete (not for template) */}
                    {!isTemplate && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(element.id); }}
                        className="p-1 rounded hover:bg-red-100 transition-colors"
                        title="Xoá"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="p-3 border-t bg-gray-50 text-[11px] text-gray-500 space-y-1">
        <div>🖱 Kéo thả để đổi thứ tự lớp</div>
        <div>👁 Click 👁 để ẩn/hiện · 🔒 để khoá lớp</div>
        <div>⇧ + Click để chọn nhiều phần tử</div>
      </div>
    </div>
  );
}
