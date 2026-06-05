import { useState } from 'react';
import { X, User, Sparkles, Check } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';

interface CharacterDesignerProps {
  onClose: () => void;
  onApplyToBook: (characterData: CharacterData) => void;
  initialCharacter?: CharacterData;
}

export interface CharacterData {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeStyle: string;
  lipStyle: string;
  outfit: string;
  accessories?: string[];
}

const SKIN_TONES = [
  { id: 'fair', name: 'Trng hng', color: '#FFE4C4' },
  { id: 'light', name: 'Trng', color: '#F5D5C5' },
  { id: 'medium', name: 'Vng da', color: '#E8B898' },
  { id: 'tan', name: 'Nu nht', color: '#D4A574' },
  { id: 'brown', name: 'Nu', color: '#B08860' },
  { id: 'dark', name: 'Nu m', color: '#8D5524' }
];

const HAIR_STYLES = [
  { id: 'long-straight', name: 'Tc di thng', icon: '' },
  { id: 'ponytail', name: 'ui nga', icon: '' },
  { id: 'bob', name: 'Tc bob', icon: '' },
  { id: 'bun', name: 'Bi cao', icon: '' },
  { id: 'short-messy', name: 'Tc ngn xon', icon: '' },
  { id: 'wavy', name: 'Tc xon sng', icon: '' }
];

const HAIR_COLORS = [
  { id: '#2C1810', name: 'en', color: '#2C1810' },
  { id: '#4A2511', name: 'Nu m', color: '#4A2511' },
  { id: '#8B4513', name: 'Nu', color: '#8B4513' },
  { id: '#D2691E', name: 'Ht d', color: '#D2691E' },
  { id: '#CD853F', name: 'Vng nu', color: '#CD853F' },
  { id: '#F4A460', name: 'Vng nh kim', color: '#F4A460' },
  { id: '#FF6347', name: '', color: '#FF6347' },
  { id: '#FF69B4', name: 'Hng', color: '#FF69B4' },
  { id: '#DDA0DD', name: 'Tm pastel', color: '#DDA0DD' },
  { id: '#87CEEB', name: 'Xanh pastel', color: '#87CEEB' }
];

const EYE_STYLES = [
  { id: 'round', name: 'Trn to', icon: '' },
  { id: 'cat', name: 'Mt mo', icon: '' },
  { id: 'anime', name: 'Anime', icon: '' }
];

const LIP_STYLES = [
  { id: 'smile', name: 'Ci ti', icon: '' },
  { id: 'natural', name: 'T nhin', icon: '' },
  { id: 'pouty', name: 'Mi tu', icon: '' }
];

const OUTFITS = [
  { id: 'dress-pink', name: 'Vy hng', color: '#FF69B4', icon: '' },
  { id: 'dress-purple', name: 'Vy tm', color: '#DDA0DD', icon: '' },
  { id: 'shirt-white', name: 'o s mi trng', color: '#FFFFFF', icon: '' },
  { id: 'hoodie-blue', name: 'o hoodie xanh', color: '#87CEEB', icon: '' }
];

const ACCESSORIES = [
  { id: 'flower', name: 'Hoa ci', icon: '' },
  { id: 'bow', name: 'N', icon: '' },
  { id: 'glasses', name: 'Knh', icon: '' },
  { id: 'earrings', name: 'Bng tai', icon: '' },
  { id: 'necklace', name: 'Vng c', icon: '' }
];

export function CharacterDesigner({ onClose, onApplyToBook, initialCharacter }: CharacterDesignerProps) {
  const [character, setCharacter] = useState<CharacterData>(
    initialCharacter || {
      skinTone: SKIN_TONES[1].color,
      hairStyle: HAIR_STYLES[0].id,
      hairColor: HAIR_COLORS[2].id,
      eyeStyle: EYE_STYLES[2].id,
      lipStyle: LIP_STYLES[0].id,
      outfit: OUTFITS[0].id,
      accessories: []
    }
  );

  const [activeTab, setActiveTab] = useState<'skin' | 'hair' | 'face' | 'outfit' | 'accessories'>('skin');

  const updateCharacter = (updates: Partial<CharacterData>) => {
    setCharacter({ ...character, ...updates });
  };

  const toggleAccessory = (accessoryId: string) => {
    const accessories = character.accessories || [];
    if (accessories.includes(accessoryId)) {
      updateCharacter({ accessories: accessories.filter(id => id !== accessoryId) });
    } else {
      updateCharacter({ accessories: [...accessories, accessoryId] });
    }
  };

  const handleApply = () => {
    onApplyToBook(character);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Thit k nhn vt</h2>
              <p className="text-xs text-gray-600">To avatar p cho sch ca bn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left: Preview */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-blue-50/50">
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-pink-200/30 blur-xl" />
                <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-purple-200/30 blur-xl" />
                <div className="absolute top-1/2 right-8 w-12 h-12 rounded-full bg-blue-200/30 blur-xl" />
              </div>

              {/* Character Preview */}
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <CharacterAvatar character={character} size="large" />
              </div>

              {/* Character name label */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-lg border-2 border-pink-200">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span className="font-semibold text-gray-700">Nhn vt ca bn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Options Panel */}
          <div className="w-full md:w-[420px] border-t md:border-t-0 md:border-l border-gray-200 flex flex-col bg-gray-50">
            {/* Tabs */}
            <div className="px-4 py-3 border-b border-gray-200 bg-white overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {[
                  { id: 'skin' as const, label: ' Da', short: '' },
                  { id: 'hair' as const, label: ' Tc', short: '' },
                  { id: 'face' as const, label: ' Mt', short: '' },
                  { id: 'outfit' as const, label: ' ', short: '' },
                  { id: 'accessories' as const, label: ' Ph kin', short: '' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.short}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Options Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'skin' && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 mb-3">Chn mu da</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => updateCharacter({ skinTone: tone.color })}
                        className={`aspect-square rounded-2xl transition-all hover:scale-105 ${
                          character.skinTone === tone.color
                            ? 'ring-4 ring-pink-500 shadow-xl scale-105'
                            : 'ring-2 ring-gray-200 hover:ring-pink-300'
                        }`}
                        style={{ backgroundColor: tone.color }}
                      >
                        {character.skinTone === tone.color && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                              <Check className="w-5 h-5 text-pink-500" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {SKIN_TONES.map((tone) => (
                      <div key={`${tone.id}-label`} className="text-center">
                        <p className="text-xs text-gray-600">{tone.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'hair' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Kiu tc</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {HAIR_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateCharacter({ hairStyle: style.id })}
                          className={`p-3 rounded-xl transition-all hover:scale-105 ${
                            character.hairStyle === style.id
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl ring-4 ring-pink-300'
                              : 'bg-white text-gray-700 hover:bg-gray-50 ring-2 ring-gray-200'
                          }`}
                        >
                          <div className="text-3xl mb-1">{style.icon}</div>
                          <div className="text-xs font-medium">{style.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Mu tc</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {HAIR_COLORS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => updateCharacter({ hairColor: color.id })}
                          className={`aspect-square rounded-xl transition-all hover:scale-105 ${
                            character.hairColor === color.id
                              ? 'ring-4 ring-pink-500 shadow-xl'
                              : 'ring-2 ring-gray-200'
                          }`}
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        >
                          {character.hairColor === color.id && (
                            <div className="w-full h-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'face' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Kiu mt</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {EYE_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateCharacter({ eyeStyle: style.id })}
                          className={`p-3 rounded-xl transition-all hover:scale-105 ${
                            character.eyeStyle === style.id
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl'
                              : 'bg-white text-gray-700 hover:bg-gray-50 ring-2 ring-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-1">{style.icon}</div>
                          <div className="text-xs font-medium">{style.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Kiu mi</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {LIP_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateCharacter({ lipStyle: style.id })}
                          className={`p-3 rounded-xl transition-all hover:scale-105 ${
                            character.lipStyle === style.id
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl'
                              : 'bg-white text-gray-700 hover:bg-gray-50 ring-2 ring-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-1">{style.icon}</div>
                          <div className="text-xs font-medium">{style.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'outfit' && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 mb-3">Trang phc</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {OUTFITS.map((outfit) => (
                      <button
                        key={outfit.id}
                        onClick={() => updateCharacter({ outfit: outfit.id })}
                        className={`p-4 rounded-xl transition-all hover:scale-105 ${
                          character.outfit === outfit.id
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl ring-4 ring-pink-300'
                            : 'bg-white text-gray-700 hover:bg-gray-50 ring-2 ring-gray-200'
                        }`}
                      >
                        <div className="text-3xl mb-2">{outfit.icon}</div>
                        <div className="text-sm font-medium">{outfit.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'accessories' && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 mb-3">Ph kin (chn nhiu)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {ACCESSORIES.map((accessory) => {
                      const isSelected = character.accessories?.includes(accessory.id);
                      return (
                        <button
                          key={accessory.id}
                          onClick={() => toggleAccessory(accessory.id)}
                          className={`p-4 rounded-xl transition-all hover:scale-105 ${
                            isSelected
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl ring-4 ring-pink-300'
                              : 'bg-white text-gray-700 hover:bg-gray-50 ring-2 ring-gray-200'
                          }`}
                        >
                          <div className="text-3xl mb-2">{accessory.icon}</div>
                          <div className="text-sm font-medium">{accessory.name}</div>
                          {isSelected && (
                            <div className="mt-2">
                              <Check className="w-5 h-5 mx-auto" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={handleApply}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                p dng nhn vt vo sch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
