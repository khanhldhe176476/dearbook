import { useState } from 'react';
import { 
  Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Bold, Italic, Underline, Strikethrough,
  Palette, Image as ImageIcon, Settings, 
  ChevronDown, ChevronUp, Sparkles, Circle,
  Square, Triangle, Star, Heart, Minus, Plus
} from 'lucide-react';
import { PageElement, TextElement, ImageElement, ShapeElement, IconElement } from '../../types/editor';

interface PropertiesPanelAdvancedProps {
  selectedElements: PageElement[];
  onUpdateElement: (id: string, updates: Partial<PageElement>) => void;
}

export function PropertiesPanelAdvanced({
  selectedElements,
  onUpdateElement,
}: PropertiesPanelAdvancedProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['content', 'style']));

  if (!selectedElements || selectedElements.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center" style={{ background: '#FAFAF8', color: '#9B9088' }}>
        <Settings className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-sm">Chọn phần tử để chỉnh sửa</p>
      </div>
    );
  }

  const element = selectedElements[0];
  
  if (!element) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center" style={{ background: '#FAFAF8', color: '#9B9088' }}>
        <Settings className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-sm">Chọn phần tử để chỉnh sửa</p>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<PageElement>) => {
    onUpdateElement(element.id, updates);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const Section = ({ id, title, icon: Icon, children }: { id: string; title: string; icon: any; children: React.ReactNode }) => {
    const isExpanded = expandedSections.has(id);
    return (
      <div className="border-b" style={{ borderColor: '#DDD8D0' }}>
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-opacity-50 transition-colors"
          style={{ background: isExpanded ? '#F5F2EE' : 'transparent', color: '#3A2E28' }}
        >
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" style={{ color: '#7A6F66' }} />
            <span className="text-sm font-medium">{title}</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" style={{ color: '#7A6F66' }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#7A6F66' }} />}
        </button>
        {isExpanded && (
          <div className="px-4 py-4 space-y-4 animate-in slide-in-from-top duration-200" style={{ background: '#FAFAF8' }}>
            {children}
          </div>
        )}
      </div>
    );
  };

  const renderTextProperties = (textEl: TextElement) => {
    return (
      <>
        {/* Content Section */}
        <Section id="content" title="Nội dung" icon={Type}>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Văn bản</label>
            <textarea
              value={textEl.content || ''}
              onChange={(e) => handleUpdate({ content: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg resize-none transition-all"
              style={{ 
                borderColor: '#DDD8D0',
                background: '#FFFFFF',
                color: '#3A2E28'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8C6E5D'}
              onBlur={(e) => e.target.style.borderColor = '#DDD8D0'}
              rows={4}
              placeholder="Nhập nội dung..."
            />
          </div>
        </Section>

        {/* Style Section */}
        <Section id="style" title="Kiểu chữ" icon={Palette}>
          {/* Font Family */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Font</label>
            <select
              value={textEl.fontFamily || 'Poppins'}
              onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg transition-all"
              style={{ 
                borderColor: '#DDD8D0',
                background: '#FFFFFF',
                color: '#3A2E28'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8C6E5D'}
              onBlur={(e) => e.target.style.borderColor = '#DDD8D0'}
            >
              <option value="Poppins">Poppins</option>
              <option value="Inter">Inter</option>
              <option value="Dancing Script">Dancing Script</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Cormorant">Cormorant</option>
              <option value="Fredoka">Fredoka</option>
              <option value="Nunito">Nunito</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Caveat">Caveat</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: '#7A6F66' }}>Cỡ chữ</label>
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#EDE9E3', color: '#5A5049' }}>
                {textEl.fontSize || 16}px
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdate({ fontSize: Math.max(8, (textEl.fontSize || 16) - 2) })}
                className="p-2 border rounded-lg hover:bg-opacity-80 transition-all"
                style={{ borderColor: '#DDD8D0', background: '#FFFFFF' }}
              >
                <Minus className="w-3 h-3" style={{ color: '#7A6F66' }} />
              </button>
              <input
                type="range"
                min="8"
                max="120"
                value={textEl.fontSize || 16}
                onChange={(e) => handleUpdate({ fontSize: parseInt(e.target.value) })}
                className="flex-1"
                style={{
                  accentColor: '#8C6E5D'
                }}
              />
              <button
                onClick={() => handleUpdate({ fontSize: Math.min(120, (textEl.fontSize || 16) + 2) })}
                className="p-2 border rounded-lg hover:bg-opacity-80 transition-all"
                style={{ borderColor: '#DDD8D0', background: '#FFFFFF' }}
              >
                <Plus className="w-3 h-3" style={{ color: '#7A6F66' }} />
              </button>
            </div>
          </div>

          {/* Font Weight & Style */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Định dạng</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleUpdate({ fontWeight: (textEl.fontWeight || 'normal') === 'bold' ? 'normal' : 'bold' })}
                className="px-3 py-2 rounded-lg border transition-all flex items-center justify-center gap-1.5"
                style={{
                  borderColor: (textEl.fontWeight || 'normal') === 'bold' ? '#8C6E5D' : '#DDD8D0',
                  background: (textEl.fontWeight || 'normal') === 'bold' ? '#8C6E5D' : '#FFFFFF',
                  color: (textEl.fontWeight || 'normal') === 'bold' ? '#FAFAF8' : '#7A6F66',
                }}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdate({ fontStyle: (textEl.fontStyle || 'normal') === 'italic' ? 'normal' : 'italic' })}
                className="px-3 py-2 rounded-lg border transition-all flex items-center justify-center gap-1.5"
                style={{
                  borderColor: (textEl.fontStyle || 'normal') === 'italic' ? '#8C6E5D' : '#DDD8D0',
                  background: (textEl.fontStyle || 'normal') === 'italic' ? '#8C6E5D' : '#FFFFFF',
                  color: (textEl.fontStyle || 'normal') === 'italic' ? '#FAFAF8' : '#7A6F66',
                }}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdate({ textDecoration: (textEl.textDecoration || 'none') === 'underline' ? 'none' : 'underline' })}
                className="px-3 py-2 rounded-lg border transition-all flex items-center justify-center gap-1.5"
                style={{
                  borderColor: (textEl.textDecoration || 'none') === 'underline' ? '#8C6E5D' : '#DDD8D0',
                  background: (textEl.textDecoration || 'none') === 'underline' ? '#8C6E5D' : '#FFFFFF',
                  color: (textEl.textDecoration || 'none') === 'underline' ? '#FAFAF8' : '#7A6F66',
                }}
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Căn lề</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'left', icon: AlignLeft },
                { value: 'center', icon: AlignCenter },
                { value: 'right', icon: AlignRight },
                { value: 'justify', icon: AlignJustify },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleUpdate({ textAlign: value as any })}
                  className="px-3 py-2 rounded-lg border transition-all flex items-center justify-center"
                  style={{
                    borderColor: (textEl.textAlign || 'left') === value ? '#8C6E5D' : '#DDD8D0',
                    background: (textEl.textAlign || 'left') === value ? '#8C6E5D' : '#FFFFFF',
                    color: (textEl.textAlign || 'left') === value ? '#FAFAF8' : '#7A6F66',
                  }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Màu chữ</label>
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-10 h-10 rounded-lg border-2 cursor-pointer relative overflow-hidden"
                style={{ borderColor: '#DDD8D0' }}
              >
                <input
                  type="color"
                  value={textEl.color || '#000000'}
                  onChange={(e) => handleUpdate({ color: e.target.value })}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div 
                  className="absolute inset-0"
                  style={{ background: textEl.color || '#000000' }}
                />
              </div>
              <input
                type="text"
                value={textEl.color || '#000000'}
                onChange={(e) => handleUpdate({ color: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-lg text-xs font-mono transition-all"
                style={{ 
                  borderColor: '#DDD8D0',
                  background: '#FFFFFF',
                  color: '#3A2E28'
                }}
                placeholder="#000000"
              />
            </div>
            
            {/* Quick Color Palette */}
            <div className="grid grid-cols-6 gap-2">
              {['#3A2E28', '#7A6F66', '#8C6E5D', '#5A5049', '#1C1715', '#9B9088',
                '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
                '#FFFFFF', '#F5F2EE', '#EDE9E3', '#DDD8D0', '#000000', '#6B7280'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => handleUpdate({ color })}
                  className="w-full aspect-square rounded-lg border-2 hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: color,
                    borderColor: textEl.color === color ? '#8C6E5D' : '#DDD8D0',
                    boxShadow: textEl.color === color ? '0 0 0 2px rgba(140,110,93,0.3)' : 'none'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Line Height */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: '#7A6F66' }}>Khoảng cách dòng</label>
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#EDE9E3', color: '#5A5049' }}>
                {textEl.lineHeight || 1.4}
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.1"
              value={textEl.lineHeight || 1.4}
              onChange={(e) => handleUpdate({ lineHeight: parseFloat(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#8C6E5D' }}
            />
          </div>

          {/* Letter Spacing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: '#7A6F66' }}>Khoảng cách chữ</label>
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#EDE9E3', color: '#5A5049' }}>
                {textEl.letterSpacing || 0}px
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="20"
              step="0.5"
              value={textEl.letterSpacing || 0}
              onChange={(e) => handleUpdate({ letterSpacing: parseFloat(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#8C6E5D' }}
            />
          </div>
        </Section>

        {/* Position Section */}
        <Section id="position" title="Vị trí & Kích thước" icon={Settings}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>X</label>
              <input
                type="number"
                value={Math.round(textEl.x)}
                onChange={(e) => handleUpdate({ x: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg transition-all"
                style={{ 
                  borderColor: '#DDD8D0',
                  background: '#FFFFFF',
                  color: '#3A2E28'
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Y</label>
              <input
                type="number"
                value={Math.round(textEl.y)}
                onChange={(e) => handleUpdate({ y: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg transition-all"
                style={{ 
                  borderColor: '#DDD8D0',
                  background: '#FFFFFF',
                  color: '#3A2E28'
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Rộng</label>
              <input
                type="number"
                value={Math.round(textEl.width)}
                onChange={(e) => handleUpdate({ width: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg transition-all"
                style={{ 
                  borderColor: '#DDD8D0',
                  background: '#FFFFFF',
                  color: '#3A2E28'
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Cao</label>
              <input
                type="number"
                value={Math.round(textEl.height)}
                onChange={(e) => handleUpdate({ height: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg transition-all"
                style={{ 
                  borderColor: '#DDD8D0',
                  background: '#FFFFFF',
                  color: '#3A2E28'
                }}
              />
            </div>
          </div>

          {/* Rotation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: '#7A6F66' }}>Xoay</label>
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#EDE9E3', color: '#5A5049' }}>
                {textEl.rotation || 0}°
              </span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={textEl.rotation || 0}
              onChange={(e) => handleUpdate({ rotation: parseInt(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#8C6E5D' }}
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: '#7A6F66' }}>Độ mờ</label>
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#EDE9E3', color: '#5A5049' }}>
                {Math.round((textEl.opacity || 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={textEl.opacity || 1}
              onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#8C6E5D' }}
            />
          </div>
        </Section>
      </>
    );
  };

  const renderImageProperties = (imgEl: ImageElement) => {
    return (
      <>
        <Section id="image" title="Hình ảnh" icon={ImageIcon}>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Kiểu hiển thị</label>
            <select
              value={imgEl.objectFit || 'cover'}
              onChange={(e) => handleUpdate({ objectFit: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-lg transition-all"
              style={{ 
                borderColor: '#DDD8D0',
                background: '#FFFFFF',
                color: '#3A2E28'
              }}
            >
              <option value="cover">Lấp đầy</option>
              <option value="contain">Vừa khung</option>
              <option value="fill">Kéo giãn</option>
            </select>
          </div>
        </Section>

        <Section id="position" title="Vị trí & Kích thước" icon={Settings}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>X</label>
              <input
                type="number"
                value={Math.round(imgEl.x)}
                onChange={(e) => handleUpdate({ x: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Y</label>
              <input
                type="number"
                value={Math.round(imgEl.y)}
                onChange={(e) => handleUpdate({ y: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Rộng</label>
              <input
                type="number"
                value={Math.round(imgEl.width)}
                onChange={(e) => handleUpdate({ width: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Cao</label>
              <input
                type="number"
                value={Math.round(imgEl.height)}
                onChange={(e) => handleUpdate({ height: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: '#7A6F66' }}>Xoay</label>
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#EDE9E3', color: '#5A5049' }}>
                {imgEl.rotation || 0}°
              </span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={imgEl.rotation || 0}
              onChange={(e) => handleUpdate({ rotation: parseInt(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#8C6E5D' }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: '#7A6F66' }}>Độ mờ</label>
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#EDE9E3', color: '#5A5049' }}>
                {Math.round((imgEl.opacity || 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={imgEl.opacity || 1}
              onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#8C6E5D' }}
            />
          </div>
        </Section>
      </>
    );
  };

  const renderShapeProperties = (shapeEl: ShapeElement) => {
    return (
      <>
        <Section id="style" title="Màu sắc" icon={Palette}>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Màu nền</label>
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-10 h-10 rounded-lg border-2 cursor-pointer relative overflow-hidden"
                style={{ borderColor: '#DDD8D0' }}
              >
                <input
                  type="color"
                  value={shapeEl.fill || '#FF6B6B'}
                  onChange={(e) => handleUpdate({ fill: e.target.value })}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div 
                  className="absolute inset-0"
                  style={{ background: shapeEl.fill || '#FF6B6B' }}
                />
              </div>
              <input
                type="text"
                value={shapeEl.fill || '#FF6B6B'}
                onChange={(e) => handleUpdate({ fill: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-lg text-xs font-mono"
                style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }}
              />
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              {['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
                '#8C6E5D', '#7A6F66', '#5A5049', '#3A2E28', '#1C1715', '#9B9088'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => handleUpdate({ fill: color })}
                  className="w-full aspect-square rounded-lg border-2 hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: color,
                    borderColor: shapeEl.fill === color ? '#8C6E5D' : '#DDD8D0'
                  }}
                />
              ))}
            </div>
          </div>
        </Section>

        <Section id="position" title="Vị trí & Kích thước" icon={Settings}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>X</label>
              <input type="number" value={Math.round(shapeEl.x)} onChange={(e) => handleUpdate({ x: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Y</label>
              <input type="number" value={Math.round(shapeEl.y)} onChange={(e) => handleUpdate({ y: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Rộng</label>
              <input type="number" value={Math.round(shapeEl.width)} onChange={(e) => handleUpdate({ width: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Cao</label>
              <input type="number" value={Math.round(shapeEl.height)} onChange={(e) => handleUpdate({ height: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: '#7A6F66' }}>Độ mờ</label>
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#EDE9E3', color: '#5A5049' }}>
                {Math.round((shapeEl.opacity || 1) * 100)}%
              </span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={shapeEl.opacity || 1} onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })} className="w-full" style={{ accentColor: '#8C6E5D' }} />
          </div>
        </Section>
      </>
    );
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#FAFAF8' }}>
      {element.type === 'text' && renderTextProperties(element as TextElement)}
      {element.type === 'image' && renderImageProperties(element as ImageElement)}
      {element.type === 'shape' && renderShapeProperties(element as ShapeElement)}
      {(element.type === 'sticker' || element.type === 'icon' || element.type === 'frame') && (
        <Section id="position" title="Vị trí & Kích thước" icon={Settings}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>X</label><input type="number" value={Math.round(element.x)} onChange={(e) => handleUpdate({ x: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }} /></div>
            <div><label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Y</label><input type="number" value={Math.round(element.y)} onChange={(e) => handleUpdate({ y: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }} /></div>
            <div><label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Rộng</label><input type="number" value={Math.round(element.width)} onChange={(e) => handleUpdate({ width: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }} /></div>
            <div><label className="block text-xs font-medium mb-2" style={{ color: '#7A6F66' }}>Cao</label><input type="number" value={Math.round(element.height)} onChange={(e) => handleUpdate({ height: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: '#DDD8D0', background: '#FFFFFF', color: '#3A2E28' }} /></div>
          </div>
        </Section>
      )}
    </div>
  );
}
