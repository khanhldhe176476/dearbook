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
    { id: 'templates' as TabType, icon: Layout, label: 'Mu' },
    { id: 'text' as TabType, icon: Type, label: 'Vn bn' },
    { id: 'images' as TabType, icon: Image, label: 'Hnh nh' },
    { id: 'characters' as TabType, icon: User, label: 'Nhn vt' },
    { id: 'shapes' as TabType, icon: Shapes, label: 'Hnh dng' },
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
      { id: '1', name: 'Lng mn', preview: '', description: 'Giao din tnh yu' },
      { id: '2', name: 'n gin', preview: '', description: 'Thit k ti gin' },
    ],
    family: [
      { id: '1', name: 'Gia nh', preview: '', description: 'Giao din gia nh' },
      { id: '2', name: 'm p', preview: '', description: 'Thit k m cng' },
    ],
    birthday: [
      { id: '1', name: 'Sinh nht', preview: '', description: 'Giao din sinh nht' },
      { id: '2', name: 'Vui nhn', preview: '', description: 'Thit k rc r' },
    ],
    friendship: [
      { id: '1', name: 'Bn b', preview: '', description: 'Giao din tnh bn' },
      { id: '2', name: 'Nng ng', preview: '', description: 'Thit k si ng' },
    ],
  };

  const templates = themeTemplates[book.theme] || [];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Mu {book.theme}</h3>
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
    { content: 'Tiu ', fontSize: 32, fontFamily: 'Dancing Script', color: '#6B46C1' },
    { content: 'Tiu  ph', fontSize: 24, fontFamily: 'inherit', color: '#4A5568' },
    { content: 'on vn bn', fontSize: 16, fontFamily: 'inherit', color: '#4A5568' },
    { content: 'Ch thch', fontSize: 14, fontFamily: 'inherit', color: '#718096' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Thm vn bn</h3>
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
      <h3 className="font-semibold text-gray-800">Thm hnh nh</h3>
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
      <h3 className="font-semibold text-gray-800">Ty chnh nhn vt</h3>

      {/* Preview */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 flex justify-center">
        <CharacterIllustration character={book.character} size="md" />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gii tnh</label>
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
              {gender === 'male' ? ' Nam' : ' N'}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kiu tc</label>
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
              {style === 'short' ? 'Ngn' : 'Di'}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mu tc</label>
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
              {color === 'black' ? 'en' :
               color === 'brown' ? 'Nu' :
               color === 'blonde' ? 'Vng' :
               color === 'red' ? '' : 'Xm'}
            </button>
          ))}
        </div>
      </div>

      {/* Outfit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Trang phc</label>
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
              {outfit === 'casual' ? 'Thng' :
               outfit === 'formal' ? 'Lch s' : 'Lng mn'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShapesTab({ onAdd }: { onAdd: (shape: any) => void }) {
  const shapes = [
    { type: 'rectangle', color: '#E9D5FF', borderRadius: 8, label: 'Hnh ch nht' },
    { type: 'circle', color: '#FBCFE8', borderRadius: 999, label: 'Hnh trn' },
    { type: 'square', color: '#BFDBFE', borderRadius: 8, label: 'Hnh vung' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Thm hnh dng</h3>
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
