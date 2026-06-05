import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, User } from 'lucide-react';
import { CharacterDesigner, CharacterData } from '../CharacterDesigner';
import { CharacterAvatar } from '../CharacterAvatar';

interface Step3CharacterCustomizationProps {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  character?: any; // Old character format from App.tsx
  onChange: (character: any) => void;
  onBack: () => void;
}

// Presets for quick selection
const CHARACTER_PRESETS: Array<{ id: string; name: string; character: CharacterData }> = [
  {
    id: 'cute-girl-1',
    name: 'C gi d thng',
    character: {
      skinTone: '#FFE4C4',
      hairStyle: 'long-straight',
      hairColor: '#8B4513',
      eyeStyle: 'anime',
      lipStyle: 'smile',
      outfit: 'dress-pink',
      accessories: ['flower']
    }
  },
  {
    id: 'elegant-lady',
    name: 'Qu c thanh lch',
    character: {
      skinTone: '#F5D5C5',
      hairStyle: 'bun',
      hairColor: '#2C1810',
      eyeStyle: 'cat',
      lipStyle: 'natural',
      outfit: 'dress-purple',
      accessories: ['earrings', 'necklace']
    }
  },
  {
    id: 'sweet-girl',
    name: 'C gi ngt ngo',
    character: {
      skinTone: '#E8B898',
      hairStyle: 'ponytail',
      hairColor: '#D2691E',
      eyeStyle: 'round',
      lipStyle: 'pouty',
      outfit: 'dress-pink',
      accessories: ['bow', 'earrings']
    }
  },
  {
    id: 'modern-girl',
    name: 'C gi hin i',
    character: {
      skinTone: '#F5D5C5',
      hairStyle: 'bob',
      hairColor: '#FF69B4',
      eyeStyle: 'anime',
      lipStyle: 'smile',
      outfit: 'shirt-white',
      accessories: ['glasses']
    }
  },
  {
    id: 'cool-girl',
    name: 'C gi c tnh',
    character: {
      skinTone: '#D4A574',
      hairStyle: 'short-messy',
      hairColor: '#87CEEB',
      eyeStyle: 'cat',
      lipStyle: 'natural',
      outfit: 'hoodie-blue',
      accessories: ['earrings']
    }
  },
  {
    id: 'romantic-girl',
    name: 'C gi lng mn',
    character: {
      skinTone: '#FFE4C4',
      hairStyle: 'wavy',
      hairColor: '#CD853F',
      eyeStyle: 'round',
      lipStyle: 'smile',
      outfit: 'dress-purple',
      accessories: ['flower', 'necklace']
    }
  }
];

export function Step3CharacterCustomization({
  theme,
  character,
  onChange,
  onBack,
}: Step3CharacterCustomizationProps) {
  // Convert old character format to new format if exists
  const getInitialCharacter = (): CharacterData | null => {
    if (character && 'skinTone' in character) {
      return character as CharacterData;
    }
    return null;
  };

  const [localCharacter, setLocalCharacter] = useState<CharacterData | null>(
    getInitialCharacter()
  );
  const [showDesigner, setShowDesigner] = useState(false);

  const handleSelectPreset = (preset: CharacterData) => {
    setLocalCharacter(preset);
  };

  const handleCustomize = () => {
    setShowDesigner(true);
  };

  const handleApplyCharacter = (newCharacter: CharacterData) => {
    setLocalCharacter(newCharacter);
    setShowDesigner(false);
  };

  const handleContinue = () => {
    if (localCharacter) {
      onChange(localCharacter);
    }
  };

  const themeColors = {
    love: { from: 'from-pink-500', to: 'to-rose-500', bg: 'bg-pink-50' },
    family: { from: 'from-blue-500', to: 'to-cyan-500', bg: 'bg-blue-50' },
    birthday: { from: 'from-purple-500', to: 'to-pink-500', bg: 'bg-purple-50' },
    friendship: { from: 'from-green-500', to: 'to-teal-500', bg: 'bg-green-50' }
  };

  const colors = themeColors[theme];

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 rounded-xl transition-all text-gray-700"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay li chn mu</span>
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
           To nhn vt ca bn
        </h2>
        <p className="text-lg text-gray-600">
          Nhn vt ny s xut hin trong cun sch ca bn
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Quick Presets */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-orange-100/50">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-gray-800 text-lg">Chn nhanh t mu c sn</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CHARACTER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.character)}
                className={`p-4 rounded-2xl transition-all hover:scale-105 ${
                  JSON.stringify(localCharacter) === JSON.stringify(preset.character)
                    ? `bg-gradient-to-br ${colors.from} ${colors.to} text-white shadow-xl ring-4 ring-pink-300`
                    : 'bg-white hover:bg-gray-50 ring-2 ring-gray-200'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <CharacterAvatar character={preset.character} size="small" />
                </div>
                <p className="text-xs font-medium text-center mt-2">
                  {preset.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Current Character Preview */}
        {localCharacter && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md border border-orange-100/50">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Character Preview */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8">
                    <CharacterAvatar character={localCharacter} size="large" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-2 bg-white rounded-full shadow-lg border-2 border-pink-200">
                      <p className="text-sm font-semibold text-gray-700">Nhn vt ca bn</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customize Button */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Hi lng vi nhn vt ny?
                  </h3>
                  <p className="text-gray-600">
                    Bn c th tu chnh chi tit hn nh mu da, kiu tc, mt, mi, trang phc v ph kin
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCustomize}
                    className={`flex-1 py-3 px-6 rounded-xl bg-gradient-to-r ${colors.from} ${colors.to} text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2`}
                  >
                    <User className="w-5 h-5" />
                    Ty chnh chi tit
                  </button>

                  <button
                    onClick={handleContinue}
                    className="flex-1 py-3 px-6 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Tip tc vi nhn vt ny
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Character Selected */}
        {!localCharacter && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-md border border-orange-100/50 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <User className="w-10 h-10 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Cha chn nhn vt
                </h3>
                <p className="text-gray-600">
                  Chn mt nhn vt mu  trn hoc to nhn vt hon ton mi
                </p>
              </div>
              <button
                onClick={handleCustomize}
                className={`py-3 px-8 rounded-xl bg-gradient-to-r ${colors.from} ${colors.to} text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all inline-flex items-center gap-2`}
              >
                <Sparkles className="w-5 h-5" />
                To nhn vt mi
              </button>
            </div>
          </div>
        )}

        {/* Continue Button (when character selected) */}
        {localCharacter && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleContinue}
              className={`py-4 px-12 rounded-2xl bg-gradient-to-r ${colors.from} ${colors.to} text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center gap-3`}
            >
              Tip tc chnh sa ni dung
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Character Designer Modal */}
      {showDesigner && (
        <CharacterDesigner
          onClose={() => setShowDesigner(false)}
          onApplyToBook={handleApplyCharacter}
          initialCharacter={localCharacter || undefined}
        />
      )}
    </div>
  );
}
