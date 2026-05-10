import { Settings, Type, Palette, Layout, Move, Maximize2 } from 'lucide-react';
import { PageElement, BookPage, Book } from '../../App';

interface EditorPropertiesProps {
  selectedElement: PageElement | undefined;
  currentPage: BookPage;
  book: Book;
  onUpdateElement: (id: string, updates: any) => void;
  onUpdatePage: (updates: Partial<BookPage>) => void;
  onUpdateBook: (book: Book) => void;
}

export function EditorProperties({
  selectedElement,
  currentPage,
  book,
  onUpdateElement,
  onUpdatePage,
  onUpdateBook,
}: EditorPropertiesProps) {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500 py-12">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Chọn một phần tử để chỉnh sửa</p>
        </div>

        {/* Page Settings */}
        <div className="mt-8 space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Cài đặt trang
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Màu nền
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['#FFF1F2', '#F3E8FF', '#DBEAFE', '#D1FAE5', '#FEF3C7', '#FFFFFF'].map((color) => (
                <button
                  key={color}
                  onClick={() => {}}
                  className="w-full aspect-square rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">Thuộc tính</h3>
          <p className="text-xs text-gray-500">
            {selectedElement.type === 'text' ? 'Văn bản' :
             selectedElement.type === 'image' ? 'Hình ảnh' :
             selectedElement.type === 'shape' ? 'Hình dạng' : 'Nhân vật'}
          </p>
        </div>

        {/* Text Content */}
        {selectedElement.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Nội dung
            </label>
            <textarea
              value={selectedElement.content}
              onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
              rows={4}
            />
          </div>
        )}

        {/* Font Family */}
        {selectedElement.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font chữ
            </label>
            <select
              value={selectedElement.style.fontFamily || 'inherit'}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                style: { ...selectedElement.style, fontFamily: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            >
              <option value="inherit">Mặc định</option>
              <option value="Dancing Script">Dancing Script</option>
              <option value="Poppins">Poppins</option>
              <option value="Inter">Inter</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>
        )}

        {/* Font Size */}
        {selectedElement.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kích thước: {selectedElement.style.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="72"
              value={selectedElement.style.fontSize || 16}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                style: { ...selectedElement.style, fontSize: parseInt(e.target.value) }
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12px</span>
              <span>72px</span>
            </div>
          </div>
        )}

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Màu sắc
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedElement.style.color || '#000000'}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                style: { ...selectedElement.style, color: e.target.value }
              })}
              className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={selectedElement.style.color || '#000000'}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                style: { ...selectedElement.style, color: e.target.value }
              })}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-mono text-sm"
            />
          </div>
        </div>

        {/* Background Color */}
        {(selectedElement.type === 'shape' || selectedElement.type === 'text') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Màu nền
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedElement.style.backgroundColor || '#FFFFFF'}
                onChange={(e) => onUpdateElement(selectedElement.id, {
                  style: { ...selectedElement.style, backgroundColor: e.target.value }
                })}
                className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.style.backgroundColor || '#FFFFFF'}
                onChange={(e) => onUpdateElement(selectedElement.id, {
                  style: { ...selectedElement.style, backgroundColor: e.target.value }
                })}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-mono text-sm"
              />
            </div>
            <button
              onClick={() => onUpdateElement(selectedElement.id, {
                style: { ...selectedElement.style, backgroundColor: 'transparent' }
              })}
              className="mt-2 text-xs text-purple-600 hover:text-purple-700"
            >
              Xóa màu nền
            </button>
          </div>
        )}

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Move className="w-4 h-4" />
            Vị trí
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">X</label>
              <input
                type="number"
                value={Math.round(selectedElement.position.x)}
                onChange={(e) => onUpdateElement(selectedElement.id, {
                  position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Y</label>
              <input
                type="number"
                value={Math.round(selectedElement.position.y)}
                onChange={(e) => onUpdateElement(selectedElement.id, {
                  position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            Kích thước
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Rộng</label>
              <input
                type="number"
                value={Math.round(selectedElement.size.width)}
                onChange={(e) => onUpdateElement(selectedElement.id, {
                  size: { ...selectedElement.size, width: parseInt(e.target.value) || 100 }
                })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Cao</label>
              <input
                type="number"
                value={Math.round(selectedElement.size.height)}
                onChange={(e) => onUpdateElement(selectedElement.id, {
                  size: { ...selectedElement.size, height: parseInt(e.target.value) || 100 }
                })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bo góc: {selectedElement.style.borderRadius || 0}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={selectedElement.style.borderRadius || 0}
            onChange={(e) => onUpdateElement(selectedElement.id, {
              style: { ...selectedElement.style, borderRadius: parseInt(e.target.value) }
            })}
            className="w-full"
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Độ mờ: {Math.round((selectedElement.style.opacity || 1) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={(selectedElement.style.opacity || 1) * 100}
            onChange={(e) => onUpdateElement(selectedElement.id, {
              style: { ...selectedElement.style, opacity: parseInt(e.target.value) / 100 }
            })}
            className="w-full"
          />
        </div>

        {/* Quick Color Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Màu nhanh
          </label>
          <div className="grid grid-cols-6 gap-2">
            {['#6B46C1', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'].map((color) => (
              <button
                key={color}
                onClick={() => onUpdateElement(selectedElement.id, {
                  style: { ...selectedElement.style, color }
                })}
                className="w-full aspect-square rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-colors"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
