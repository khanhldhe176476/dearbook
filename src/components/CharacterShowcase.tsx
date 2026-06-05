import { CharacterData } from '../App';
import { CharacterIllustration } from './CharacterIllustration';

export function CharacterShowcase() {
  const genders: CharacterData['gender'][] = ['female', 'male'];
  const hairStyles: CharacterData['hairStyle'][] = ['long', 'short'];
  const hairColors: CharacterData['hairColor'][] = ['black', 'brown', 'blonde', 'red', 'gray'];
  const outfits: CharacterData['outfit'][] = ['casual', 'formal', 'romantic'];

  // Generate a subset of interesting combinations
  const showcaseCharacters: CharacterData[] = [
    // Female variations
    { gender: 'female', hairStyle: 'long', hairColor: 'brown', outfit: 'romantic' },
    { gender: 'female', hairStyle: 'long', hairColor: 'black', outfit: 'casual' },
    { gender: 'female', hairStyle: 'long', hairColor: 'blonde', outfit: 'formal' },
    { gender: 'female', hairStyle: 'long', hairColor: 'red', outfit: 'romantic' },
    { gender: 'female', hairStyle: 'short', hairColor: 'brown', outfit: 'casual' },
    { gender: 'female', hairStyle: 'short', hairColor: 'black', outfit: 'formal' },
    { gender: 'female', hairStyle: 'short', hairColor: 'blonde', outfit: 'romantic' },
    { gender: 'female', hairStyle: 'short', hairColor: 'gray', outfit: 'formal' },
    
    // Male variations
    { gender: 'male', hairStyle: 'short', hairColor: 'black', outfit: 'casual' },
    { gender: 'male', hairStyle: 'short', hairColor: 'brown', outfit: 'formal' },
    { gender: 'male', hairStyle: 'short', hairColor: 'blonde', outfit: 'casual' },
    { gender: 'male', hairStyle: 'short', hairColor: 'gray', outfit: 'formal' },
    { gender: 'male', hairStyle: 'long', hairColor: 'brown', outfit: 'casual' },
    { gender: 'male', hairStyle: 'long', hairColor: 'black', outfit: 'romantic' },
    { gender: 'male', hairStyle: 'long', hairColor: 'blonde', outfit: 'casual' },
    { gender: 'male', hairStyle: 'long', hairColor: 'red', outfit: 'romantic' },
  ];

  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Th vin nhn vt
        </h2>
        <p className="text-gray-600">
          {showcaseCharacters.length} nhn vt mu  Tng {genders.length * hairStyles.length * hairColors.length * outfits.length} combinations c th
        </p>
      </div>

      {/* Female Characters */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span></span> Nhn vt n
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {showcaseCharacters
            .filter(c => c.gender === 'female')
            .map((character, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-xl transition-all border border-orange-100/50"
              >
                <CharacterIllustration character={character} size="sm" />
                <div className="mt-3 space-y-1 text-xs text-center">
                  <p className="font-semibold text-gray-800">
                    {character.hairStyle === 'long' ? 'Tc di' : 'Tc ngn'}
                  </p>
                  <p className="text-gray-600">
                    {character.hairColor === 'black' ? 'en' :
                     character.hairColor === 'brown' ? 'Nu' :
                     character.hairColor === 'blonde' ? 'Vng' :
                     character.hairColor === 'red' ? '' : 'Xm'}
                  </p>
                  <p className="text-gray-500">
                    {character.outfit === 'casual' ? 'Thng ngy' :
                     character.outfit === 'formal' ? 'Lch s' : 'Lng mn'}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Male Characters */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span></span> Nhn vt nam
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {showcaseCharacters
            .filter(c => c.gender === 'male')
            .map((character, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-xl transition-all border border-orange-100/50"
              >
                <CharacterIllustration character={character} size="sm" />
                <div className="mt-3 space-y-1 text-xs text-center">
                  <p className="font-semibold text-gray-800">
                    {character.hairStyle === 'long' ? 'Tc di' : 'Tc ngn'}
                  </p>
                  <p className="text-gray-600">
                    {character.hairColor === 'black' ? 'en' :
                     character.hairColor === 'brown' ? 'Nu' :
                     character.hairColor === 'blonde' ? 'Vng' :
                     character.hairColor === 'red' ? '' : 'Xm'}
                  </p>
                  <p className="text-gray-500">
                    {character.outfit === 'casual' ? 'Thng ngy' :
                     character.outfit === 'formal' ? 'Lch s' : 'Lng mn'}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Info */}
      <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 border border-orange-200/50">
        <h4 className="font-bold text-gray-800 mb-3"> V nhn vt</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-rose-500 font-bold"></span>
            <span>Tt c nhn vt c v bng <strong>SVG vector graphics</strong> - r nt  mi kch thc</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500 font-bold"></span>
            <span>C <strong>{genders.length * hairStyles.length * hairColors.length * outfits.length} combinations</strong> khc nhau: {genders.length} gii tnh  {hairStyles.length} kiu tc  {hairColors.length} mu tc  {outfits.length} trang phc</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500 font-bold"></span>
            <span>Phong cch: <strong>2D illustration semi-realistic</strong> vi mu sc pastel m p</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500 font-bold"></span>
            <span>Nhn vt s xut hin xuyn sut trong cun sch ca bn</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
