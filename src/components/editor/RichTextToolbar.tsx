import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette,
  Sparkles,
} from 'lucide-react';

interface RichTextToolbarProps {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
  color?: string;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: number) => void;
  onFontWeightChange: (value: string) => void;
  onFontStyleChange: (value: string) => void;
  onTextDecorationChange: (value: string) => void;
  onTextAlignChange: (value: string) => void;
  onColorChange: (value: string) => void;
  textShadow?: string;
  onTextShadowChange: (value: string) => void;
}

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
  { value: 'Comfortaa', label: 'Comfortaa' },
  { value: 'Quicksand', label: 'Quicksand' },
  { value: 'Josefin Sans', label: 'Josefin Sans' },
  { value: 'Amatic SC', label: 'Amatic SC' },
  { value: 'Bebas Neue', label: 'Bebas Neue' },
  { value: 'Lobster', label: 'Lobster' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];

const PRESET_COLORS = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF4444', '#FF6B6B', '#FF1493', '#E91E63', '#F06292',
  '#FF9800', '#FFA726', '#FFC107', '#FFD54F', '#FFEB3B', '#FFF176',
  '#4CAF50', '#66BB6A', '#81C784', '#2E7D32', '#00E676', '#69F0AE',
  '#2196F3', '#42A5F5', '#64B5F6', '#1565C0', '#448AFF', '#82B1FF',
  '#9C27B0', '#AB47BC', '#CE93D8', '#7C4DFF', '#B388FF', '#E040FB',
  '#795548', '#8D6E63', '#A1887F', '#607D8B', '#90A4AE', '#546E7A',
];

export function RichTextToolbar({
  fontFamily = 'Poppins',
  fontSize = 16,
  fontWeight = 'normal',
  fontStyle = 'normal',
  textDecoration = 'none',
  textAlign = 'left',
  color = '#000000',
  onFontFamilyChange,
  onFontSizeChange,
  onFontWeightChange,
  onFontStyleChange,
  onTextDecorationChange,
  onTextAlignChange,
  onColorChange,
  textShadow = 'none',
  onTextShadowChange,
}: RichTextToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEffects, setShowEffects] = useState(false);

  const toggleBold = () => {
    onFontWeightChange(fontWeight === 'bold' ? 'normal' : 'bold');
  };

  const toggleItalic = () => {
    onFontStyleChange(fontStyle === 'italic' ? 'normal' : 'italic');
  };

  const toggleUnderline = () => {
    onTextDecorationChange(textDecoration === 'underline' ? 'none' : 'underline');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Font Family */}
      <div className="flex items-center gap-1.5">
        <Type className="w-4 h-4 text-gray-500" />
        <select
          value={fontFamily}
          onChange={(e) => onFontFamilyChange(e.target.value)}
          className="px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors"
          style={{ fontFamily }}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Font Size */}
      <select
        value={fontSize}
        onChange={(e) => onFontSizeChange(Number(e.target.value))}
        className="px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors"
      >
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>

      <div className="w-px h-6 bg-gray-300" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleBold}
          className={`p-2 rounded-md transition-colors ${
            fontWeight === 'bold'
              ? 'bg-pink-100 text-pink-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleItalic}
          className={`p-2 rounded-md transition-colors ${
            fontStyle === 'italic'
              ? 'bg-pink-100 text-pink-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleUnderline}
          className={`p-2 rounded-md transition-colors ${
            textDecoration === 'underline'
              ? 'bg-pink-100 text-pink-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onTextAlignChange('left')}
          className={`p-2 rounded-md transition-colors ${
            textAlign === 'left'
              ? 'bg-pink-100 text-pink-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onTextAlignChange('center')}
          className={`p-2 rounded-md transition-colors ${
            textAlign === 'center'
              ? 'bg-pink-100 text-pink-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onTextAlignChange('right')}
          className={`p-2 rounded-md transition-colors ${
            textAlign === 'right'
              ? 'bg-pink-100 text-pink-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onTextAlignChange('justify')}
          className={`p-2 rounded-md transition-colors ${
            textAlign === 'justify'
              ? 'bg-pink-100 text-pink-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Color Picker */}
      <div className="relative">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          title="Text Color"
        >
          <Palette className="w-4 h-4 text-gray-700" />
          <div
            className="w-5 h-5 rounded border border-gray-300"
            style={{ backgroundColor: color }}
          />
        </button>

        {showColorPicker && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowColorPicker(false)}
            />
            <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-lg z-20">
              <div className="grid grid-cols-6 gap-2 mb-3">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onColorChange(presetColor);
                      setShowColorPicker(false);
                    }}
                    className={`w-8 h-8 rounded border-2 transition-transform hover:scale-110 ${
                      color === presetColor ? 'border-pink-500 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: presetColor }}
                    title={presetColor}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200" onMouseDown={(e) => e.stopPropagation()}>
                <label className="text-sm text-gray-600">Custom:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-20 h-8 rounded border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
