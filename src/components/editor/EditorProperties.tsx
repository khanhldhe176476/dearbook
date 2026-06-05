import { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, Type, Palette, Layout, Move, Maximize2 } from 'lucide-react';
import { PageElement, BookPage, Book } from '../../App';

const FONT_FAMILIES = [
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Dancing Script', label: 'Dancing Script' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Pacifico', label: 'Pacifico' },
  { value: 'Caveat', label: 'Caveat' },
  { value: 'Great Vibes', label: 'Great Vibes' },
  { value: 'Lobster', label: 'Lobster' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'serif', label: 'Serif' },
  { value: 'monospace', label: 'Monospace' },
];

const PRESET_COLORS = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF4444', '#FF6B6B', '#FF1493', '#E91E63', '#F06292',
  '#FF9800', '#FFA726', '#FFC107', '#FFD54F', '#FFEB3B', '#FFF176',
  '#4CAF50', '#66BB6A', '#81C784', '#2E7D32', '#00E676', '#69F0AE',
  '#2196F3', '#42A5F5', '#64B5F6', '#1565C0', '#448AFF', '#82B1FF',
  '#9C27B0', '#AB47BC', '#CE93D8', '#7C4DFF', '#B388FF', '#E040FB',
  '#6B46C1', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
];

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
  //  Local text state  KHNG re-render canvas khi ang g 
  const [localTextContent, setLocalTextContent] = useState('');
  const textCommitRef = useRef<string | null>(null);

  useEffect(() => {
    if (selectedElement?.type === 'text') {
      setLocalTextContent(selectedElement.content || '');
    }
  }, [selectedElement?.id]);

  const handleTextChange = useCallback((newContent: string) => {
    setLocalTextContent(newContent);
    textCommitRef.current = newContent;
  }, []);

  const handleTextBlur = useCallback(() => {
    if (textCommitRef.current !== null
        && selectedElement
        && textCommitRef.current !== selectedElement.content) {
      onUpdateElement(selectedElement.id, { content: textCommitRef.current });
    }
  }, [selectedElement, onUpdateElement]);

  // Commit khi chuyn sang element khc (trnh mt d liu)
  useEffect(() => {
    return () => {
      if (textCommitRef.current !== null
          && selectedElement
          && textCommitRef.current !== selectedElement.content) {
        onUpdateElement(selectedElement.id, { content: textCommitRef.current });
      }
    };
  }, [selectedElement?.id]);
  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500 py-12">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Chn mt phn t  chnh sa</p>
        </div>

        {/* Page Settings */}
        <div className="mt-8 space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Ci t trang
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mu nn
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
          <h3 className="font-semibold text-gray-800 mb-1">Thuc tnh</h3>
          <p className="text-xs text-gray-500">
            {selectedElement.type === 'text' ? 'Vn bn' :
             selectedElement.type === 'image' ? 'Hnh nh' :
             selectedElement.type === 'shape' ? 'Hnh dng' : 'Nhn vt'}
          </p>
        </div>

        {/* Text Content */}
        {selectedElement.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Ni dung
            </label>
            <textarea
              value={localTextContent}
              onChange={(e) => handleTextChange(e.target.value)}
              onBlur={handleTextBlur}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
              rows={4}
              placeholder="Nhp ni dung..."
            />
            <p className="text-[10px] text-gray-400 mt-1">G mt khng git  t lu khi click ra ngoi</p>
          </div>
        )}

        {/* Font Family */}
        {selectedElement.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font ch
            </label>
            <select
              value={selectedElement.style.fontFamily || 'inherit'}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                style: { ...selectedElement.style, fontFamily: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              style={{ fontFamily: selectedElement.style.fontFamily || 'inherit' }}
            >
              <option value="inherit">Mc nh</option>
              {FONT_FAMILIES.map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Font Size */}
        {selectedElement.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kch thc: {selectedElement.style.fontSize}px
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
            Mu sc
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
              Mu nn
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
              Xa mu nn
            </button>
          </div>
        )}

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Move className="w-4 h-4" />
            V tr
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
            Kch thc
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Rng</label>
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
            Bo gc: {selectedElement.style.borderRadius || 0}px
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
             m: {Math.round((selectedElement.style.opacity || 1) * 100)}%
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
            Mu nhanh
          </label>
          <div className="grid grid-cols-8 gap-1.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onUpdateElement(selectedElement.id, {
                  style: { ...selectedElement.style, color }
                })}
                className={`w-full aspect-square rounded-lg border-2 transition-transform hover:scale-110 ${
                  selectedElement.style.color === color
                    ? 'border-purple-500 scale-110'
                    : 'border-gray-200 hover:border-purple-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
