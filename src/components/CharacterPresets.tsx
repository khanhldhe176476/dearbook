import { CharacterData } from '../App';
import { CharacterIllustration } from './CharacterIllustration';

interface CharacterPresetsProps {
  onSelect: (character: CharacterData) => void;
  currentCharacter?: CharacterData;
}

export function CharacterPresets({ onSelect, currentCharacter }: CharacterPresetsProps) {
  const presets: CharacterData[] = [
    // Female presets
    {
      gender: 'female',
      hairStyle: 'long',
      hairColor: 'brown',
      outfit: 'romantic',
    },
    {
      gender: 'female',
      hairStyle: 'long',
      hairColor: 'black',
      outfit: 'casual',
    },
    {
      gender: 'female',
      hairStyle: 'short',
      hairColor: 'blonde',
      outfit: 'formal',
    },
    {
      gender: 'female',
      hairStyle: 'long',
      hairColor: 'red',
      outfit: 'romantic',
    },
    // Male presets
    {
      gender: 'male',
      hairStyle: 'short',
      hairColor: 'black',
      outfit: 'casual',
    },
    {
      gender: 'male',
      hairStyle: 'short',
      hairColor: 'brown',
      outfit: 'formal',
    },
    {
      gender: 'male',
      hairStyle: 'long',
      hairColor: 'blonde',
      outfit: 'casual',
    },
    {
      gender: 'male',
      hairStyle: 'short',
      hairColor: 'gray',
      outfit: 'formal',
    },
  ];

  const isSelected = (preset: CharacterData) => {
    if (!currentCharacter) return false;
    return (
      preset.gender === currentCharacter.gender &&
      preset.hairStyle === currentCharacter.hairStyle &&
      preset.hairColor === currentCharacter.hairColor &&
      preset.outfit === currentCharacter.outfit
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Chn nhanh nhn vt mu</h3>
        <p className="text-sm text-gray-600">
          Hoc ty chnh chi tit bn di
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => onSelect(preset)}
            className={`relative p-3 rounded-2xl border-2 transition-all hover:shadow-lg ${
              isSelected(preset)
                ? 'border-rose-500 bg-rose-50 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-rose-300'
            }`}
          >
            <CharacterIllustration character={preset} size="sm" />
            
            {isSelected(preset) && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-lg">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            <p className="text-xs text-gray-600 text-center mt-2">
              {preset.gender === 'female' ? 'N' : 'Nam'}  {' '}
              {preset.hairColor === 'black' ? 'en' :
               preset.hairColor === 'brown' ? 'Nu' :
               preset.hairColor === 'blonde' ? 'Vng' :
               preset.hairColor === 'red' ? '' : 'Xm'}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
