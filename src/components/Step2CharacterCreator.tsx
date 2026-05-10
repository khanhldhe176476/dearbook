import { useState } from 'react';
import { User, Palette, Sparkles, ChevronRight } from 'lucide-react';
import { CharacterDesign } from '../App';
import { CharacterIllustration } from './CharacterIllustration';

interface Step2CharacterCreatorProps {
  initialCharacter: CharacterDesign;
  onComplete: (character: CharacterDesign) => void;
}

export function Step2CharacterCreator({ initialCharacter, onComplete }: Step2CharacterCreatorProps) {
  const [character, setCharacter] = useState<CharacterDesign>(initialCharacter);

  const updateCharacter = (updates: Partial<CharacterDesign>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  const handleContinue = () => {
    onComplete(character);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
          Tạo hình ảnh nhân vật của bạn
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tuỳ chỉnh nhân vật để tạo ra hình ảnh giống bạn hoặc người bạn yêu thương nhất
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-12 mt-12">
        {/* Left: Preview */}
        <div className="flex flex-col">
          <div className="rounded-3xl bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-12 flex items-center justify-center min-h-[600px] relative overflow-hidden">
            {/* Decorative Stars */}
            <div className="absolute top-8 left-8 text-yellow-300 opacity-50">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="absolute bottom-8 right-8 text-pink-300 opacity-50">
              <Sparkles className="w-10 h-10" />
            </div>
            <div className="absolute top-1/2 right-12 text-purple-300 opacity-30">
              <Sparkles className="w-6 h-6" />
            </div>

            {/* Character Illustration Preview */}
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl bg-white/50 backdrop-blur shadow-2xl overflow-hidden flex items-center justify-center p-8">
              {/* Live Character Illustration */}
              <CharacterIllustration character={character} size="xl" />
              
              {/* Character Info Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <User className="w-4 h-4" />
                    <span className="font-medium">
                      {character.gender === 'male' ? 'Nam' : 'Nữ'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Palette className="w-4 h-4" />
                    <span className="font-medium capitalize">
                      Tóc {character.hairStyle === 'long' ? 'dài' : 'ngắn'} - {
                        character.hairColor === 'black' ? 'Đen' :
                        character.hairColor === 'brown' ? 'Nâu' :
                        character.hairColor === 'red' ? 'Đỏ' :
                        character.hairColor === 'blonde' ? 'Vàng' : 'Xám'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              💡 Hình ảnh sẽ cập nhật ngay khi bạn thay đổi lựa chọn
            </p>
          </div>
        </div>

        {/* Right: Options */}
        <div className="space-y-8">
          {/* Gender Selection */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6" />
              Giới tính
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateCharacter({ gender: 'female' })}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  character.gender === 'female'
                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-pink-300'
                }`}
              >
                <div className="text-4xl mb-2">👩</div>
                <p className="font-bold text-gray-900">Nữ</p>
              </button>
              <button
                onClick={() => updateCharacter({ gender: 'male' })}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  character.gender === 'male'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="text-4xl mb-2">👨</div>
                <p className="font-bold text-gray-900">Nam</p>
              </button>
            </div>
          </div>

          {/* Hair Style */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Kiểu tóc</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateCharacter({ hairStyle: 'short' })}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  character.hairStyle === 'short'
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-2">💇‍♀️</div>
                <p className="font-bold text-gray-900">Tóc ngắn</p>
              </button>
              <button
                onClick={() => updateCharacter({ hairStyle: 'long' })}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  character.hairStyle === 'long'
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-2">👱‍♀️</div>
                <p className="font-bold text-gray-900">Tóc dài</p>
              </button>
            </div>
          </div>

          {/* Hair Color */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Palette className="w-6 h-6" />
              Màu tóc
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {[
                { id: 'black' as const, color: '#1a1a1a', label: 'Đen' },
                { id: 'brown' as const, color: '#8B4513', label: 'Nâu' },
                { id: 'red' as const, color: '#DC143C', label: 'Đỏ' },
                { id: 'blonde' as const, color: '#FFD700', label: 'Vàng' },
                { id: 'gray' as const, color: '#A9A9A9', label: 'Xám' }
              ].map((color) => (
                <button
                  key={color.id}
                  onClick={() => updateCharacter({ hairColor: color.id })}
                  className={`aspect-square rounded-2xl border-2 transition-all hover:scale-110 ${
                    character.hairColor === color.id
                      ? 'border-black shadow-xl ring-4 ring-black/10'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.label}
                >
                  {character.hairColor === color.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Tone */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Màu da</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'light' as const, color: '#FFE4D6', label: 'Sáng' },
                { id: 'medium' as const, color: '#F5D5C3', label: 'Vừa' },
                { id: 'tan' as const, color: '#E8C4B0', label: 'Rám' },
                { id: 'dark' as const, color: '#D4A078', label: 'Tối' }
              ].map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => updateCharacter({ skinTone: tone.id })}
                  className={`aspect-square rounded-2xl border-2 transition-all hover:scale-110 ${
                    character.skinTone === tone.id
                      ? 'border-black shadow-xl ring-4 ring-black/10'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: tone.color }}
                  title={tone.label}
                >
                  {character.skinTone === tone.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Outfit */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Trang phục</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'casual' as const, emoji: '👕', label: 'Thoải mái' },
                { id: 'formal' as const, emoji: '👔', label: 'Lịch sự' },
                { id: 'romantic' as const, emoji: '👗', label: 'Lãng mạn' }
              ].map((outfit) => (
                <button
                  key={outfit.id}
                  onClick={() => updateCharacter({ outfit: outfit.id })}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    character.outfit === outfit.id
                      ? 'border-pink-500 bg-pink-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-pink-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{outfit.emoji}</div>
                  <p className="font-bold text-gray-900 text-sm">{outfit.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-5 px-8 bg-black text-white rounded-full text-xl font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-3 group mt-8"
          >
            Tiếp tục
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
