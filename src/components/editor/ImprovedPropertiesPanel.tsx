import { useState, useEffect, useRef, useCallback } from 'react';
import { PageElement, TextElement, ImageElement, ShapeElement } from '../../types/editor';
import {
  Settings, Type, Image, Square, Smile, Paintbrush,
  Move, RotateCw, Eye, Lock, Unlock, Copy, Trash2,
  ChevronDown, ChevronRight, Sliders
} from 'lucide-react';

//  Danh sch font ch phong ph 
const FONT_FAMILIES = [
  { value: 'Poppins', label: 'Poppins (Hin i)' },
  { value: 'Inter', label: 'Inter (Tinh gn)' },
  { value: 'Dancing Script', label: 'Dancing Script (Vit tay)' },
  { value: 'Playfair Display', label: 'Playfair Display (Thanh lch)' },
  { value: 'Merriweather', label: 'Merriweather (Trang trng)' },
  { value: 'Roboto', label: 'Roboto (Ph bin)' },
  { value: 'Open Sans', label: 'Open Sans (D c)' },
  { value: 'Lora', label: 'Lora (C in)' },
  { value: 'Montserrat', label: 'Montserrat (Mnh m)' },
  { value: 'Raleway', label: 'Raleway (Thanh mnh)' },
  { value: 'Pacifico', label: 'Pacifico (Vui ti)' },
  { value: 'Caveat', label: 'Caveat (T nhin)' },
  { value: 'Great Vibes', label: 'Great Vibes (Th php)' },
  { value: 'Comfortaa', label: 'Comfortaa (Trn tra)' },
  { value: 'Quicksand', label: 'Quicksand (Nh nhng)' },
  { value: 'Josefin Sans', label: 'Josefin Sans (Hnh hc)' },
  { value: 'Amatic SC', label: 'Amatic SC (Ngh thut)' },
  { value: 'Bebas Neue', label: 'Bebas Neue (Tiu )' },
  { value: 'Lobster', label: 'Lobster (Ni bt)' },
  { value: 'Nunito', label: 'Nunito (Thn thin)' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New (Mono)' },
];

//  Bng mu a dng 
const PRESET_COLORS = [
  // en trng c bn
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  //  - Hng
  '#FF0000', '#FF4444', '#FF6B6B', '#FF1493', '#E91E63', '#F06292',
  // Cam - Vng
  '#FF9800', '#FFA726', '#FFC107', '#FFD54F', '#FFEB3B', '#FFF176',
  // Xanh l
  '#4CAF50', '#66BB6A', '#81C784', '#2E7D32', '#00E676', '#69F0AE',
  // Xanh dng
  '#2196F3', '#42A5F5', '#64B5F6', '#1565C0', '#448AFF', '#82B1FF',
  // Tm
  '#9C27B0', '#AB47BC', '#CE93D8', '#7C4DFF', '#B388FF', '#E040FB',
  // Nu - Xm c bit
  '#795548', '#8D6E63', '#A1887F', '#607D8B', '#90A4AE', '#546E7A',
];

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

  //  Local text editing state  KHNG re-render canvas khi ang g 
  const [localTextContent, setLocalTextContent] = useState('');
  const textCommitRef = useRef<string | null>(null);

  // Sync local state khi chn element khc
  useEffect(() => {
    if (element?.type === 'text') {
      setLocalTextContent((element as TextElement).content || '');
    }
  }, [element?.id]);

  // Commit text content CH KHI BLUR  khng debounce, khng re-render gia chng
  const handleTextChange = useCallback((newContent: string) => {
    setLocalTextContent(newContent);
    textCommitRef.current = newContent;
  }, []);

  const handleTextBlur = useCallback(() => {
    if (textCommitRef.current !== null
        && element?.type === 'text'
        && textCommitRef.current !== (element as TextElement).content) {
      onUpdate({ content: textCommitRef.current });
    }
  }, [element, onUpdate]);

  // Commit khi unmount hoc chuyn sang element khc (trnh mt d liu)
  useEffect(() => {
    return () => {
      if (textCommitRef.current !== null
          && element?.type === 'text'
          && textCommitRef.current !== (element as TextElement).content) {
        onUpdate({ content: textCommitRef.current });
      }
    };
  }, [element?.id]);

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
          Cha chn phn t
        </h3>
        <p className="text-sm text-gray-500">
          Click vo mt phn t trn canvas  xem thuc tnh
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
            {element.type === 'text' && 'Vn bn'}
            {element.type === 'image' && 'Hnh nh'}
            {element.type === 'shape' && 'Hnh khi'}
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
            title={element.locked ? 'M kha' : 'Kha'}
          >
            {element.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span className="text-xs font-medium">
              {element.locked ? ' kha' : 'Kha'}
            </span>
          </button>

          <button
            onClick={() => onUpdate({ visible: !element.visible })}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              element.visible
                ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
            title={element.visible ? 'n' : 'Hin'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {element.visible ? 'Hin' : 'n'}
            </span>
          </button>

          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Nhn i"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              title="Xa"
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
          'V tr & Kch thc',
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
                  Y (dc)
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
                  Rng
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
                  {element.rotation}
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
                <span>0</span>
                <span>360</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Appearance Section */}
      <div className="border-b border-gray-200">
        {renderSectionHeader(
          <Sliders className="w-4 h-4 text-pink-600" />,
          'Giao din',
          'appearance'
        )}
        
        {isExpanded('appearance') && (
          <div className="p-4 space-y-4 bg-white">
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-2">
                <span> m</span>
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
            'Ni dung vn bn',
            'content'
          )}
          
          {isExpanded('content') && (
            <div className="p-4 space-y-4 bg-white">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Vn bn
                </label>
                <textarea
                  value={localTextContent}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onBlur={handleTextBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-y"
                  placeholder="Nhp ni dung..."
                  style={{ fontFamily: (element as TextElement).fontFamily }}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  G mt khng git  t ng lu khi click ra ngoi
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font ch
                </label>
                <select
                  value={(element as TextElement).fontFamily}
                  onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ fontFamily: (element as TextElement).fontFamily }}
                >
                  {FONT_FAMILIES.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    C ch
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
                    Mu ch
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(element as TextElement).color}
                      onChange={(e) => onUpdate({ color: e.target.value })}
                      className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={(element as TextElement).color}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(val)) onUpdate({ color: val });
                      }}
                      className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              {/* Preset Color Palette */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Bng mu nhanh
                </label>
                <div className="grid grid-cols-12 gap-1">
                  {PRESET_COLORS.map((presetColor) => (
                    <button
                      key={presetColor}
                      onClick={() => onUpdate({ color: presetColor })}
                      className={`w-6 h-6 rounded transition-transform hover:scale-125 ${
                        (element as TextElement).color === presetColor
                          ? 'ring-2 ring-offset-1 ring-blue-500 scale-110'
                          : 'hover:ring-1 hover:ring-gray-300'
                      }`}
                      style={{ backgroundColor: presetColor }}
                      title={presetColor}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cn chnh
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
                      {align === 'left' && 'Tri'}
                      {align === 'center' && 'Gia'}
                      {align === 'right' && 'Phi'}
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
            'Mu sc',
            'content'
          )}
          
          {isExpanded('content') && (
            <div className="p-4 space-y-4 bg-white">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Mu nn
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
            'Hnh nh',
            'content'
          )}
          
          {isExpanded('content') && (
            <div className="p-4 space-y-4 bg-white">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cch hin th
                </label>
                <select
                  value={(element as ImageElement).objectFit}
                  onChange={(e) => onUpdate({ objectFit: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="cover">Ph kn</option>
                  <option value="contain">Va khung</option>
                  <option value="fill">Ko gin</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
