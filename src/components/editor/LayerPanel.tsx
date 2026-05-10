import { Eye, EyeOff, Lock, Unlock, Copy, Trash2, ChevronUp, ChevronDown, Type, Image, Circle, Sparkles, Frame } from 'lucide-react';
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
}: LayerPanelProps) {
  
  // Sort by zIndex (highest first)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementIcon = (element: PageElement) => {
    switch (element.type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'shape':
        return <Circle className="w-4 h-4" />;
      case 'sticker':
        return <Sparkles className="w-4 h-4" />;
      case 'icon':
        return <Sparkles className="w-4 h-4" />;
      case 'frame':
        return <Frame className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getElementLabel = (element: PageElement): string => {
    switch (element.type) {
      case 'text':
        return element.content.substring(0, 20) + (element.content.length > 20 ? '...' : '');
      case 'image':
        return 'Hình ảnh';
      case 'shape':
        return `Hình ${element.shape}`;
      case 'sticker':
        return element.emoji;
      case 'icon':
        return `Icon ${element.iconName}`;
      case 'frame':
        return 'Khung viền';
      default:
        return 'Element';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Lớp ({elements.length})</h3>
        <p className="text-xs text-gray-500 mt-1">Quản lý các thành phần</p>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        {sortedElements.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Circle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Chưa có thành phần nào</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sortedElements.map((element, index) => {
              const isSelected = selectedIds.includes(element.id);
              const isFirst = index === 0;
              const isLast = index === sortedElements.length - 1;

              return (
                <div
                  key={element.id}
                  onClick={(e) => onSelectElement(element.id, e.shiftKey)}
                  className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-rose-50 ring-2 ring-rose-500'
                      : 'hover:bg-gray-50'
                  } ${!element.visible ? 'opacity-50' : ''}`}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 ${isSelected ? 'text-rose-600' : 'text-gray-400'}`}>
                    {getElementIcon(element)}
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {getElementLabel(element)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {element.type}
                    </div>
                  </div>

                  {/* Actions (hidden by default, shown on hover) */}
                  <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Reorder */}
                    <div className="flex flex-col">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isFirst) onReorder(element.id, 'up');
                        }}
                        disabled={isFirst}
                        className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Di chuyển lên"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isLast) onReorder(element.id, 'down');
                        }}
                        disabled={isLast}
                        className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Di chuyển xuống"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Visibility */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(element.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title={element.visible ? 'Ẩn' : 'Hiện'}
                    >
                      {element.visible ? (
                        <Eye className="w-4 h-4 text-gray-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {/* Lock */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock(element.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title={element.locked ? 'Mở khóa' : 'Khóa'}
                    >
                      {element.locked ? (
                        <Lock className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Unlock className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(element.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Nhân bản"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(element.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-600 space-y-1">
        <div>💡 <strong>Tip:</strong> Shift + Click để chọn nhiều</div>
        <div>🔒 Khóa để tránh di chuy��n nhầm</div>
      </div>
    </div>
  );
}
