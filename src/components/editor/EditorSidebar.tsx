import { useState } from 'react';
import { Layout, Type, Image, User, Shapes, Sparkles, Heart, Cake, Users as UsersIcon } from 'lucide-react';
import { Book, PageElement } from '../../App';
import { CharacterIllustration } from '../CharacterIllustration';

interface EditorSidebarProps {
  book: Book;
  onAddElement: (element: Partial<PageElement>) => void;
  onUpdateBook: (book: Book) => void;
}

type TabType = 'templates' | 'text' | 'images' | 'characters' | 'shapes';

export function EditorSidebar({ book, onAddElement, onUpdateBook }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('templates');

  const tabs = [
    { id: 'templates' as TabType, icon: Layout, label: 'Mẫu' },
    { id: 'text' as TabType, icon: Type, label: 'Văn bản' },
    { id: 'images' as TabType, icon: Image, label: 'Hình ảnh' },
    { id: 'characters' as TabType, icon: User, label: 'Nhân vật' },
    { id: 'shapes' as TabType, icon: Shapes, label: 'Hình dạng' },
  ];

  const handleAddText = (preset: any) => {
    onAddElement({
      type: 'text',
      content: preset.content,
      position: { x: 100, y: 100 },
      size: { width: 300, height: 100 },
      style: {
        fontSize: preset.fontSize,
        fontFamily: preset.fontFamily,
        color: preset.color,
      }
    });
  };

  const handleAddImage = (imageUrl: string) => {
    onAddElement({
      type: 'image',
      content: imageUrl,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
      style: {
        borderRadius: 8,
      }
    });
  };

  const handleAddShape = (shape: any) => {
    onAddElement({
      type: 'shape',
      content: shape.type,
      position: { x: 100, y: 100 },
      size: { width: 150, height: 150 },
      style: {
        backgroundColor: shape.color,
        borderRadius: shape.borderRadius,
        opacity: 1,
      }
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Tabs */}
      <div className="border-b border-gray-200 p-2 flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'templates' && <TemplatesTab book={book} />}
        {activeTab === 'text' && <TextTab onAdd={handleAddText} />}
        {activeTab === 'images' && <ImagesTab book={book} onAdd={handleAddImage} />}
        {activeTab === 'characters' && <CharactersTab book={book} onUpdateBook={onUpdateBook} />}
        {activeTab === 'shapes' && <ShapesTab onAdd={handleAddShape} />}
      </div>
    </div>
  );
}

function TemplatesTab({ book }: { book: Book }) {
  const themeTemplates = {
    love: [
      { id: '1', name: 'Lãng mạn', preview: '💕', description: 'Giao diện tình yêu' },
      { id: '2', name: 'Đơn giản', preview: '💝', description: 'Thiết kế tối giản' },
    ],
    family: [
      { id: '1', name: 'Gia đình', preview: '👨‍👩‍👧', description: 'Giao diện gia đình' },
      { id: '2', name: 'Ấm áp', preview: '🏠', description: 'Thiết kế ấm cúng' },
    ],
    birthday: [
      { id: '1', name: 'Sinh nhật', preview: '🎂', description: 'Giao diện sinh nhật' },
      { id: '2', name: 'Vui nhộn', preview: '🎈', description: 'Thiết kế rực rỡ' },
    ],
    friendship: [
      { id: '1', name: 'Bạn bè', preview: '🤝', description: 'Giao diện tình bạn' },
      { id: '2', name: 'Năng động', preview: '🌟', description: 'Thiết kế sôi động' },
    ],
  };

  const templates = themeTemplates[book.theme] || [];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Mẫu {book.theme}</h3>
      {templates.map((template) => (
        <button
          key={template.id}
          className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all text-left group"
        >
          <div className="text-4xl mb-2">{template.preview}</div>
          <h4 className="font-semibold text-gray-800">{template.name}</h4>
          <p className="text-xs text-gray-600">{template.description}</p>
        </button>
      ))}
    </div>
  );
}

function TextTab({ onAdd }: { onAdd: (preset: any) => void }) {
  const textPresets = [
    { content: 'Tiêu đề', fontSize: 32, fontFamily: 'Dancing Script', color: '#6B46C1' },
    { content: 'Tiêu đề phụ', fontSize: 24, fontFamily: 'inherit', color: '#4A5568' },
    { content: 'Đoạn văn bản', fontSize: 16, fontFamily: 'inherit', color: '#4A5568' },
    { content: 'Chú thích', fontSize: 14, fontFamily: 'inherit', color: '#718096' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Thêm văn bản</h3>
      {textPresets.map((preset, index) => (
        <button
          key={index}
          onClick={() => onAdd(preset)}
          className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all text-left"
          style={{
            fontSize: preset.fontSize / 2,
            fontFamily: preset.fontFamily,
            color: preset.color,
          }}
        >
          {preset.content}
        </button>
      ))}
    </div>
  );
}

function ImagesTab({ book, onAdd }: { book: Book; onAdd: (url: string) => void }) {
  const themeImages = {
    love: [
      'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400',
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400',
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400',
    ],
    family: [
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
      'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400',
      'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=400',
    ],
    birthday: [
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400',
      'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
    ],
    friendship: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
      'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400',
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400',
    ],
  };

  const images = themeImages[book.theme] || [];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Thêm hình ảnh</h3>
      <div className="grid grid-cols-2 gap-2">
        {images.map((url, index) => (
          <button
            key={index}
            onClick={() => onAdd(url)}
            className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all"
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function CharactersTab({ book, onUpdateBook }: { book: Book; onUpdateBook: (book: Book) => void }) {
  const handleUpdateCharacter = (updates: Partial<typeof book.character>) => {
    onUpdateBook({
      ...book,
      character: { ...book.character, ...updates }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">Tùy chỉnh nhân vật</h3>

      {/* Preview */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 flex justify-center">
        <CharacterIllustration character={book.character} size="md" />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
        <div className="grid grid-cols-2 gap-2">
          {(['male', 'female'] as const).map((gender) => (
            <button
              key={gender}
              onClick={() => handleUpdateCharacter({ gender })}
              className={`py-2 px-4 rounded-xl font-medium transition-all ${
                book.character.gender === gender
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {gender === 'male' ? '👨 Nam' : '👩 Nữ'}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kiểu tóc</label>
        <div className="grid grid-cols-2 gap-2">
          {(['short', 'long'] as const).map((style) => (
            <button
              key={style}
              onClick={() => handleUpdateCharacter({ hairStyle: style })}
              className={`py-2 px-4 rounded-xl font-medium transition-all ${
                book.character.hairStyle === style
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style === 'short' ? 'Ngắn' : 'Dài'}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Màu tóc</label>
        <div className="grid grid-cols-3 gap-2">
          {(['black', 'brown', 'blonde', 'red', 'gray'] as const).map((color) => (
            <button
              key={color}
              onClick={() => handleUpdateCharacter({ hairColor: color })}
              className={`py-2 px-3 rounded-xl font-medium text-sm transition-all ${
                book.character.hairColor === color
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {color === 'black' ? 'Đen' :
               color === 'brown' ? 'Nâu' :
               color === 'blonde' ? 'Vàng' :
               color === 'red' ? 'Đỏ' : 'Xám'}
            </button>
          ))}
        </div>
      </div>

      {/* Outfit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Trang phục</label>
        <div className="grid grid-cols-3 gap-2">
          {(['casual', 'formal', 'romantic'] as const).map((outfit) => (
            <button
              key={outfit}
              onClick={() => handleUpdateCharacter({ outfit })}
              className={`py-2 px-3 rounded-xl font-medium text-sm transition-all ${
                book.character.outfit === outfit
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {outfit === 'casual' ? 'Thường' :
               outfit === 'formal' ? 'Lịch sự' : 'Lãng mạn'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShapesTab({ onAdd }: { onAdd: (shape: any) => void }) {
  const shapes = [
    { type: 'rectangle', color: '#E9D5FF', borderRadius: 8, label: 'Hình chữ nhật' },
    { type: 'circle', color: '#FBCFE8', borderRadius: 999, label: 'Hình tròn' },
    { type: 'square', color: '#BFDBFE', borderRadius: 8, label: 'Hình vuông' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Thêm hình dạng</h3>
      <div className="grid grid-cols-2 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape.type}
            onClick={() => onAdd(shape)}
            className="aspect-square rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all flex items-center justify-center"
          >
            <div
              className="w-16 h-16"
              style={{
                backgroundColor: shape.color,
                borderRadius: shape.borderRadius,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
