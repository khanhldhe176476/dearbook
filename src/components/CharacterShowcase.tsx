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
          Thư viện nhân vật
        </h2>
        <p className="text-gray-600">
          {showcaseCharacters.length} nhân vật mẫu · Tổng {genders.length * hairStyles.length * hairColors.length * outfits.length} combinations có thể
        </p>
      </div>

      {/* Female Characters */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>👩</span> Nhân vật nữ
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
                    {character.hairStyle === 'long' ? 'Tóc dài' : 'Tóc ngắn'}
                  </p>
                  <p className="text-gray-600">
                    {character.hairColor === 'black' ? 'Đen' :
                     character.hairColor === 'brown' ? 'Nâu' :
                     character.hairColor === 'blonde' ? 'Vàng' :
                     character.hairColor === 'red' ? 'Đỏ' : 'Xám'}
                  </p>
                  <p className="text-gray-500">
                    {character.outfit === 'casual' ? 'Thường ngày' :
                     character.outfit === 'formal' ? 'Lịch sự' : 'Lãng mạn'}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Male Characters */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>👨</span> Nhân vật nam
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
                    {character.hairStyle === 'long' ? 'Tóc dài' : 'Tóc ngắn'}
                  </p>
                  <p className="text-gray-600">
                    {character.hairColor === 'black' ? 'Đen' :
                     character.hairColor === 'brown' ? 'Nâu' :
                     character.hairColor === 'blonde' ? 'Vàng' :
                     character.hairColor === 'red' ? 'Đỏ' : 'Xám'}
                  </p>
                  <p className="text-gray-500">
                    {character.outfit === 'casual' ? 'Thường ngày' :
                     character.outfit === 'formal' ? 'Lịch sự' : 'Lãng mạn'}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Info */}
      <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 border border-orange-200/50">
        <h4 className="font-bold text-gray-800 mb-3">💡 Về nhân vật</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-rose-500 font-bold">•</span>
            <span>Tất cả nhân vật được vẽ bằng <strong>SVG vector graphics</strong> - rõ nét ở mọi kích thước</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500 font-bold">•</span>
            <span>Có <strong>{genders.length * hairStyles.length * hairColors.length * outfits.length} combinations</strong> khác nhau: {genders.length} giới tính × {hairStyles.length} kiểu tóc × {hairColors.length} màu tóc × {outfits.length} trang phục</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500 font-bold">•</span>
            <span>Phong cách: <strong>2D illustration semi-realistic</strong> với màu sắc pastel ấm áp</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500 font-bold">•</span>
            <span>Nhân vật sẽ xuất hiện xuyên suốt trong cuốn sách của bạn</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
