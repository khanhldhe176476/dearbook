import { useState } from 'react';
import { Search, Heart, Sparkles, Camera, Flower, Gift, Image as ImageIcon, Type, Shapes, Frame, Palette, Layout } from 'lucide-react';
import { stickerCategories, iconCategories, shapes, frames, AssetItem, textCombinations, pageTemplates } from '../../data/editorAssets';
import * as LucideIcons from 'lucide-react';

interface AssetLibraryProps {
  onAddElement: (type: 'text' | 'image' | 'shape' | 'sticker' | 'icon' | 'frame', data: any) => void;
  onApplyTemplate: (template: any) => void;
  onAddTextCombination: (combination: any) => void;
}

type TabType = 'templates' | 'stickers' | 'icons' | 'shapes' | 'frames' | 'images';

export function AssetLibrary({ onAddElement, onApplyTemplate, onAddTextCombination }: AssetLibraryProps) {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tabs = [
    { id: 'templates' as TabType, label: 'Mẫu', icon: Layout },
    { id: 'stickers' as TabType, label: 'Sticker', icon: Sparkles },
    { id: 'icons' as TabType, label: 'Icon', icon: Heart },
    { id: 'shapes' as TabType, label: 'Hình', icon: Shapes },
    { id: 'frames' as TabType, label: 'Khung', icon: Frame },
    { id: 'images' as TabType, label: 'Ảnh', icon: ImageIcon },
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
    const filteredTemplates = pageTemplates.filter(t => 
      searchQuery === '' || t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredTextCombinations = textCombinations.filter(tc =>
      searchQuery === '' || tc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-8 pb-10">
        {/* Text Combinations Section */}
        {filteredTextCombinations.length > 0 && (
          <section className="space-y-3">
            <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Type className="w-3.5 h-3.5" />
              Tổ hợp chữ nghệ thuật
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {filteredTextCombinations.map(tc => (
                <button
                  key={tc.id}
                  onClick={() => onAddTextCombination(tc)}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-rose-50 rounded-xl border border-gray-100 hover:border-rose-200 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="text-sm font-bold text-gray-800 mb-1" style={{ fontFamily: tc.elements[0].fontFamily }}>
                    {tc.name}
                  </div>
                  <div className="text-[11px] text-gray-500 line-clamp-1 opacity-70">
                    {tc.elements.map(el => el.content).join(' • ')}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Page Templates Section */}
        {filteredTemplates.length > 0 && (
          <section className="space-y-3">
            <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Layout className="w-3.5 h-3.5" />
              Mẫu trang thiết kế
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => onApplyTemplate(template)}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-gray-100 hover:border-rose-500 transition-all hover:shadow-xl transform hover:-translate-y-1"
                >
                  <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs text-white font-bold leading-tight">{template.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
        
        {filteredTemplates.length === 0 && filteredTextCombinations.length === 0 && (
          <div className="text-center py-10 opacity-40">
            <Search className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">Không tìm thấy mẫu nào phù hợp</p>
          </div>
        )}
      </div>
    );
  };

  const renderStickerTab = () => {
    const categories = selectedCategory === 'all' 
      ? stickerCategories 
      : stickerCategories.filter(cat => cat.id === selectedCategory);

    return (
      <div className="space-y-4">
        {/* Category Filter */}
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

        {/* Sticker Grid */}
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
    const handleFileDragStart = (e: React.DragEvent, src: string) => {
      e.dataTransfer.setData('application/dearbook-image-src', src);
      e.dataTransfer.effectAllowed = 'copy';
    };

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
          <h4 className="text-sm font-semibold text-gray-700 mb-1">🎨 Ảnh minh họa</h4>
          <p className="text-xs text-gray-400 mb-3">
            💡 Kéo ảnh thả vào khung trên canvas để tự động fit
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { url: 'https://images.unsplash.com/photo-1626233563542-148409467765', name: 'Couple' },
              { url: 'https://images.unsplash.com/photo-1766808984213-4293f91d6a6f', name: 'Family' },
              { url: 'https://images.unsplash.com/photo-1638297166240-866903a7190c', name: 'Birthday' },
              { url: 'https://images.unsplash.com/photo-1764751024389-857d08396423', name: 'Friends' },
              { url: 'https://images.unsplash.com/photo-1767455281523-8caf432d2ecc', name: 'Heart' },
              { url: 'https://images.unsplash.com/photo-1759976910127-33085ece44b3', name: 'Flowers' },
            ].map((img, idx) => (
              <div
                key={idx}
                // ✅ Draggable: set dataTransfer so canvas can detect drop-into-frame
                draggable
                onDragStart={(e) => handleFileDragStart(e, img.url)}
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
                className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-rose-500 transition-all cursor-grab active:cursor-grabbing"
                title={`Kéo vào khung hoặc click để thêm: ${img.name}`}
              >
                <img src={img.url} alt={img.name} className="w-full h-full object-cover pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Add Text button */}
      <div className="p-4 border-b space-y-4 bg-gray-50/50">
        <button
          onClick={handleAddText}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-bold shadow-md transform hover:scale-[1.02] active:scale-95"
        >
          <Type className="w-5 h-5" />
          <span>Thêm văn bản rỗng</span>
        </button>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm mẫu, sticker..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-sm transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
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
              className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'stickers' && renderStickerTab()}
        {activeTab === 'icons' && renderIconTab()}
        {activeTab === 'shapes' && renderShapesTab()}
        {activeTab === 'frames' && renderFramesTab()}
        {activeTab === 'images' && renderImagesTab()}
      </div>
    </div>
  );
}
