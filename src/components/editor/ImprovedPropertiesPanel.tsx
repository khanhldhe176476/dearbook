import { useState } from 'react';
import { PageElement, TextElement, ImageElement, ShapeElement } from '../../types/editor';
import { 
  Settings, Type, Image, Square, Smile, Paintbrush,
  Move, RotateCw, Eye, Lock, Unlock, Copy, Trash2,
  ChevronDown, ChevronRight, Sliders
} from 'lucide-react';

interface ImprovedPropertiesPanelProps {
  element: PageElement | null;
  onUpdate: (updates: Partial<PageElement>) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function ImprovedPropertiesPanel({ 
  element, 
  onUpdate,
  onDuplicate,
  onDelete 
}: ImprovedPropertiesPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'transform', 'appearance', 'content'
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!element) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">
          Chưa chọn phần tử
        </h3>
        <p className="text-sm text-gray-500">
          Click vào một phần tử trên canvas để xem thuộc tính
        </p>
      </div>
    );
  }

  const isExpanded = (section: string) => expandedSections.includes(section);

  const renderSectionHeader = (
    icon: React.ReactNode,
    title: string,
    section: string
  ) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-gray-900 text-sm">{title}</span>
      </div>
      {isExpanded(section) ? (
        <ChevronDown className="w-4 h-4 text-gray-400" />
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Header with element type */}
      <div className="px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
        <div className="flex items-center gap-2 mb-3">
          {element.type === 'text' && <Type className="w-5 h-5 text-purple-600" />}
          {element.type === 'image' && <Image className="w-5 h-5 text-pink-600" />}
          {element.type === 'shape' && <Square className="w-5 h-5 text-blue-600" />}
          {element.type === 'sticker' && <Smile className="w-5 h-5 text-yellow-600" />}
          
          <span className="font-bold text-gray-900">
            {element.type === 'text' && 'Văn bản'}
            {element.type === 'image' && 'Hình ảnh'}
            {element.type === 'shape' && 'Hình khối'}
            {element.type === 'sticker' && 'Sticker'}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ locked: !element.locked })}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              element.locked
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title={element.locked ? 'Mở khóa' : 'Khóa'}
          >
            {element.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span className="text-xs font-medium">
              {element.locked ? 'Đã khóa' : 'Khóa'}
            </span>
          </button>

          <button
            onClick={() => onUpdate({ visible: !element.visible })}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              element.visible
                ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
            title={element.visible ? 'Ẩn' : 'Hiện'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {element.visible ? 'Hiện' : 'Ẩn'}
            </span>
          </button>

          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Nhân đôi"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              title="Xóa"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Transform Section */}
      <div className="border-b border-gray-200">
        {renderSectionHeader(
          <Move className="w-4 h-4 text-purple-600" />,
          'Vị trí & Kích thước',
          'transform'
        )}
        
        {isExpanded('transform') && (
          <div className="p-4 space-y-4 bg-white">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  X (ngang)
                </label>
                <input
                  type="number"
                  value={Math.round(element.x)}
                  onChange={(e) => onUpdate({ x: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Y (dọc)
                </label>
                <input
                  type="number"
                  value={Math.round(element.y)}
                  onChange={(e) => onUpdate({ y: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Rộng
                </label>
                <input
                  type="number"
                  value={Math.round(element.width)}
                  onChange={(e) => onUpdate({ width: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cao
                </label>
                <input
                  type="number"
                  value={Math.round(element.height)}
                  onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" />
                  Xoay
                </span>
                <span className="text-purple-600 font-semibold">
                  {element.rotation}°
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={element.rotation}
                onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0°</span>
                <span>360°</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Appearance Section */}
      <div className="border-b border-gray-200">
        {renderSectionHeader(
          <Sliders className="w-4 h-4 text-pink-600" />,
          'Giao diện',
          'appearance'
        )}
        
        {isExpanded('appearance') && (
          <div className="p-4 space-y-4 bg-white">
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-2">
                <span>Độ mờ</span>
                <span className="text-pink-600 font-semibold">
                  {Math.round(element.opacity * 100)}%
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={element.opacity}
                onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content-specific sections */}
      {element.type === 'text' && (
        <div className="border-b border-gray-200">
          {renderSectionHeader(
            <Type className="w-4 h-4 text-blue-600" />,
            'Nội dung văn bản',
            'content'
          )}
          
          {isExpanded('content') && (
            <div className="p-4 space-y-4 bg-white">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Văn bản
                </label>
                <textarea
                  value={(element as TextElement).content}
                  onChange={(e) => onUpdate({ content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-y"
                  placeholder="Nhập nội dung..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font chữ
                </label>
                <select
                  value={(element as TextElement).fontFamily}
                  onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Poppins">Poppins</option>
                  <option value="Inter">Inter</option>
                  <option value="Dancing Script">Dancing Script</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cỡ chữ
                  </label>
                  <input
                    type="number"
                    value={(element as TextElement).fontSize}
                    onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="8"
                    max="200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Màu chữ
                  </label>
                  <input
                    type="color"
                    value={(element as TextElement).color}
                    onChange={(e) => onUpdate({ color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Căn chỉnh
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['left', 'center', 'right'].map((align) => (
                    <button
                      key={align}
                      onClick={() => onUpdate({ textAlign: align as any })}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        (element as TextElement).textAlign === align
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {align === 'left' && 'Trái'}
                      {align === 'center' && 'Giữa'}
                      {align === 'right' && 'Phải'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {element.type === 'shape' && (
        <div className="border-b border-gray-200">
          {renderSectionHeader(
            <Paintbrush className="w-4 h-4 text-green-600" />,
            'Màu sắc',
            'content'
          )}
          
          {isExpanded('content') && (
            <div className="p-4 space-y-4 bg-white">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Màu nền
                </label>
                <input
                  type="color"
                  value={(element as ShapeElement).fill}
                  onChange={(e) => onUpdate({ fill: e.target.value })}
                  className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {element.type === 'image' && (
        <div className="border-b border-gray-200">
          {renderSectionHeader(
            <Image className="w-4 h-4 text-indigo-600" />,
            'Hình ảnh',
            'content'
          )}
          
          {isExpanded('content') && (
            <div className="p-4 space-y-4 bg-white">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cách hiển thị
                </label>
                <select
                  value={(element as ImageElement).objectFit}
                  onChange={(e) => onUpdate({ objectFit: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="cover">Phủ kín</option>
                  <option value="contain">Vừa khung</option>
                  <option value="fill">Kéo giãn</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
