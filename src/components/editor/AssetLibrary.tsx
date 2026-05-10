import { useState, useEffect } from 'react';
import { Search, Heart, Sparkles, Camera, Flower, Gift, Image as ImageIcon, Type, Shapes, Frame, Palette, Layout } from 'lucide-react';
import { stickerCategories, iconCategories, shapes, frames, AssetItem, colorPalettes, backgroundPatterns } from '../../data/editorAssets';
import { pageTemplates } from '../../data/pageTemplates';
import * as LucideIcons from 'lucide-react';

interface AssetLibraryProps {
  onAddElement: (type: 'text' | 'image' | 'shape' | 'sticker' | 'icon' | 'frame', data: any) => void;
  onApplyTemplate?: (template: any) => void;
  onUpdateBackground?: (background: string, isImage?: boolean) => void;
  activeTab?: TabType;
}

type TabType = 'templates' | 'stickers' | 'icons' | 'shapes' | 'frames' | 'images' | 'styles' | 'text';

export function AssetLibrary({ onAddElement, onApplyTemplate, onUpdateBackground, activeTab: externalActiveTab }: AssetLibraryProps) {
  const [activeTab, setActiveTab] = useState<TabType>(externalActiveTab || 'templates');

  // Sync with external tab changes
  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tabs = [
    { id: 'templates' as TabType, label: 'Mẫu', icon: Layout },
    { id: 'text' as TabType, label: 'Văn bản', icon: Type },
    { id: 'stickers' as TabType, label: 'Sticker', icon: Sparkles },
    { id: 'icons' as TabType, label: 'Icon', icon: Heart },
    { id: 'shapes' as TabType, label: 'Hình', icon: Shapes },
    { id: 'frames' as TabType, label: 'Khung', icon: Frame },
    { id: 'images' as TabType, label: 'Ảnh', icon: ImageIcon },
    { id: 'styles' as TabType, label: 'Phong cách', icon: Palette },
  ];

  const handleAddSticker = (emoji: string) => {
    onAddElement('sticker', {
      emoji,
      x: 100,
      y: 100,
      width: 80,
      height: 80,
      rotation: 0,
      opacity: 1,
    });
  };

  const handleAddIcon = (iconName: string) => {
    onAddElement('icon', {
      iconName,
      color: '#000000',
      strokeWidth: 2,
      x: 100,
      y: 100,
      width: 60,
      height: 60,
      rotation: 0,
      opacity: 1,
    });
  };

  const handleAddShape = (shapeId: string) => {
    onAddElement('shape', {
      shape: shapeId,
      fill: '#FF6B6B',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
    });
  };

  const handleAddFrame = (frameId: string) => {
    onAddElement('frame', {
      frameStyle: frameId,
      color: '#000000',
      strokeWidth: 2,
      x: 50,
      y: 50,
      width: 300,
      height: 400,
      rotation: 0,
      opacity: 1,
    });
  };

  const handleAddText = () => {
    onAddElement('text', {
      content: 'Nhập nội dung...',
      fontFamily: 'Poppins',
      fontSize: 24,
      fontWeight: 'normal',
      fontStyle: 'normal',
      color: '#000000',
      textAlign: 'left',
      lineHeight: 1.4,
      letterSpacing: 0,
      x: 100,
      y: 100,
      width: 300,
      height: 100,
      rotation: 0,
      opacity: 1,
    });
  };

  const filterItems = (items: AssetItem[]) => {
    return items.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  };

  const renderTemplatesTab = () => {
    return (
      <div className="grid grid-cols-1 gap-4">
        <p className="text-xs text-gray-500 mb-2">💡 Chọn một mẫu để thay đổi bố cục trang nhanh chóng.</p>
        {pageTemplates.map(template => (
          <button
            key={template.id}
            onClick={() => onApplyTemplate?.(template)}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-transparent hover:border-rose-500 transition-all shadow-sm hover:shadow-md"
          >
            <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-left">
              <h4 className="text-white text-sm font-bold">{template.name}</h4>
              <p className="text-white/80 text-[10px] line-clamp-1">{template.description}</p>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderStickerTab = () => {
    const categories = selectedCategory === 'all' 
      ? stickerCategories 
      : stickerCategories.filter(cat => cat.id === selectedCategory);

    return (
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-sm rounded-lg transition-all ${
              selectedCategory === 'all'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          {stickerCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-sm rounded-lg transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {categories.map(category => {
            const filtered = filterItems(category.items);
            if (filtered.length === 0) return null;

            return (
              <div key={category.id}>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{category.icon} {category.name}</h4>
                <div className="grid grid-cols-4 gap-2">
                  {filtered.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleAddSticker(item.data)}
                      className="aspect-square bg-gray-50 hover:bg-rose-50 rounded-lg flex items-center justify-center text-3xl transition-all hover:scale-110 hover:shadow-md"
                      title={item.name}
                    >
                      {item.data}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderIconTab = () => {
    return (
      <div className="space-y-4">
        {iconCategories.map(category => {
          const filtered = filterItems(category.items);
          if (filtered.length === 0) return null;

          return (
            <div key={category.id}>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{category.name}</h4>
              <div className="grid grid-cols-4 gap-2">
                {filtered.map(item => {
                  const IconComponent = (LucideIcons as any)[item.data];
                  if (!IconComponent) return null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleAddIcon(item.data)}
                      className="aspect-square bg-gray-50 hover:bg-rose-50 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-md"
                      title={item.name}
                    >
                      <IconComponent className="w-6 h-6" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderShapesTab = () => {
    return (
      <div className="grid grid-cols-3 gap-3">
        {shapes.map(shape => (
          <button
            key={shape.id}
            onClick={() => handleAddShape(shape.id)}
            className="aspect-square bg-gray-50 hover:bg-rose-50 rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-md"
          >
            <svg viewBox={shape.viewBox} className="w-12 h-12">
              <g dangerouslySetInnerHTML={{ __html: shape.svg.replace('currentColor', '#FF6B6B') }} />
            </svg>
            <span className="text-xs text-gray-600">{shape.name}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderFramesTab = () => {
    return (
      <div className="grid grid-cols-2 gap-3">
        {frames.map(frame => (
          <button
            key={frame.id}
            onClick={() => handleAddFrame(frame.id)}
            className="aspect-[3/4] bg-gray-50 hover:bg-rose-50 rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-md"
          >
            <svg viewBox={frame.viewBox} className="w-full h-full">
              <g dangerouslySetInnerHTML={{ __html: frame.svg.replace(/currentColor/g, '#000000') }} />
            </svg>
            <span className="text-xs text-gray-600">{frame.name}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderImagesTab = () => {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-4">Thêm ảnh từ máy tính hoặc URL</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      onAddElement('image', {
                        src: e.target?.result as string,
                        objectFit: 'cover',
                        x: 50,
                        y: 50,
                        width: 300,
                        height: 300,
                        rotation: 0,
                        opacity: 1,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
              className="w-full px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all"
            >
              📁 Chọn từ máy tính
            </button>
            <button
              onClick={() => {
                const url = prompt('Nhập URL ảnh:');
                if (url) {
                  onAddElement('image', {
                    src: url,
                    objectFit: 'cover',
                    x: 50,
                    y: 50,
                    width: 300,
                    height: 300,
                    rotation: 0,
                    opacity: 1,
                  });
                }
              }}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
            >
              🔗 Thêm từ URL
            </button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">🎨 Ảnh minh họa</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { url: 'https://images.unsplash.com/photo-1626233563542-148409467765', name: 'Couple' },
              { url: 'https://images.unsplash.com/photo-1766808984213-4293f91d6a6f', name: 'Family' },
              { url: 'https://images.unsplash.com/photo-1638297166240-866903a7190c', name: 'Birthday' },
              { url: 'https://images.unsplash.com/photo-1764751024389-857d08396423', name: 'Friends' },
              { url: 'https://images.unsplash.com/photo-1767455281523-8caf432d2ecc', name: 'Heart' },
              { url: 'https://images.unsplash.com/photo-1759976910127-33085ece44b3', name: 'Flowers' },
            ].map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onAddElement('image', {
                    src: img.url,
                    objectFit: 'cover',
                    x: 50,
                    y: 50,
                    width: 300,
                    height: 300,
                    rotation: 0,
                    opacity: 1,
                  });
                }}
                className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-rose-500 transition-all"
              >
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStylesTab = () => {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">🎨 Bảng màu</h4>
          <div className="space-y-3">
            {Object.entries(colorPalettes).map(([key, palette]) => (
              <div key={key} className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">{palette.name}</span>
                <div className="flex gap-1">
                  {palette.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => onUpdateBackground?.(color)}
                      className="w-8 h-8 rounded-md transition-all hover:scale-110 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">✨ Họa tiết nền</h4>
          <div className="grid grid-cols-2 gap-2">
            {backgroundPatterns.map(pattern => (
              <button
                key={pattern.id}
                onClick={() => {
                  // Apply pattern - this is a bit tricky as it returns a style object
                  // For now we'll just use a default color with the pattern
                  const style = pattern.style('#F5F2EE');
                  onUpdateBackground?.(style.background as string);
                }}
                className="p-3 rounded-lg border bg-white hover:bg-rose-50 transition-all text-xs text-gray-600 font-medium text-left flex flex-col gap-2"
              >
                <div 
                  className="w-full h-10 rounded border" 
                  style={pattern.style('#F5F2EE') as any}
                />
                {pattern.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTextTab = () => {
    return (
      <div className="space-y-6 p-2">
        <h4 className="text-sm font-semibold text-gray-700">Thêm văn bản</h4>
        <div className="space-y-3">
          <button
            onClick={() => onAddElement('text', { content: 'Thêm tiêu đề', fontSize: 40, fontWeight: 'bold' })}
            className="w-full text-left px-4 py-4 bg-gray-50 hover:bg-rose-50 rounded-xl transition-all group"
          >
            <span className="text-2xl font-bold text-gray-900 group-hover:text-rose-600">Thêm tiêu đề</span>
          </button>
          <button
            onClick={() => onAddElement('text', { content: 'Thêm tiêu đề phụ', fontSize: 24, fontWeight: 'semibold' })}
            className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-rose-50 rounded-xl transition-all group"
          >
            <span className="text-lg font-semibold text-gray-800 group-hover:text-rose-600">Thêm tiêu đề phụ</span>
          </button>
          <button
            onClick={() => onAddElement('text', { content: 'Thêm nội dung văn bản', fontSize: 16, fontWeight: 'normal' })}
            className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-rose-50 rounded-xl transition-all group"
          >
            <span className="text-base text-gray-700 group-hover:text-rose-600">Thêm nội dung văn bản</span>
          </button>
        </div>

        <div className="pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Phông chữ nghệ thuật</h4>
          <div className="grid grid-cols-1 gap-3">
            {[
              { name: 'Love Story', font: 'Dancing Script', color: '#E11D48' },
              { name: 'Modern Clean', font: 'Inter', color: '#1F2937' },
              { name: 'Classic Serif', font: 'Playfair Display', color: '#3A2E28' },
            ].map((style, idx) => (
              <button
                key={idx}
                onClick={() => onAddElement('text', { content: style.name, fontFamily: style.font, color: style.color, fontSize: 32 })}
                className="w-full p-4 border rounded-xl hover:border-rose-500 hover:bg-rose-50 transition-all text-center"
                style={{ fontFamily: style.font, color: style.color }}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex border-b overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className={`flex-1 min-w-[70px] flex flex-col items-center justify-center gap-1 px-1 py-3 text-[10px] font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'stickers' && renderStickerTab()}
        {activeTab === 'icons' && renderIconTab()}
        {activeTab === 'shapes' && renderShapesTab()}
        {activeTab === 'frames' && renderFramesTab()}
        {activeTab === 'images' && renderImagesTab()}
        {activeTab === 'styles' && renderStylesTab()}
        {activeTab === 'text' && renderTextTab()}
      </div>
    </div>
  );
}
