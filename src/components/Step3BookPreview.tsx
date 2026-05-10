import { ChevronRight, Sparkles, Heart } from 'lucide-react';
import { CharacterDesign } from '../App';
import { CharacterIllustration } from './CharacterIllustration';
import { CoupleIllustration } from './CoupleIllustration';

interface Step3BookPreviewProps {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  character: CharacterDesign;
  onContinue: () => void;
}

const themeContent = {
  love: {
    title: 'Tình Yêu',
    quote: '"Trong em, anh tìm thấy cả thế giới"',
    scene1: 'Khoảnh khắc đầu tiên gặp gỡ',
    scene2: 'Những ngày bên nhau',
    color: 'from-pink-400 to-rose-500'
  },
  family: {
    title: 'Gia Đình',
    quote: '"Gia đình là nơi tình yêu bắt đầu"',
    scene1: 'Những buổi sáng ấm áp',
    scene2: 'Kỷ niệm bên nhau',
    color: 'from-blue-400 to-indigo-500'
  },
  birthday: {
    title: 'Sinh Nhật',
    quote: '"Chúc mừng sinh nhật người thân yêu"',
    scene1: 'Ngày đặc biệt của bạn',
    scene2: 'Lời chúc từ trái tim',
    color: 'from-yellow-400 to-orange-500'
  },
  friendship: {
    title: 'Tình Bạn',
    quote: '"Bạn là món quà đẹp nhất cuộc đời"',
    scene1: 'Những kỷ niệm không quên',
    scene2: 'Bên nhau mãi mãi',
    color: 'from-green-400 to-emerald-500'
  }
};

export function Step3BookPreview({ theme, character, onContinue }: Step3BookPreviewProps) {
  const content = themeContent[theme];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-block px-6 py-2 bg-purple-100 rounded-full mb-2">
          <p className="text-purple-600 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Xem trước cuốn sách của bạn
          </p>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
          Đây là cuốn sách của bạn
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Nhân vật đã được tạo sẽ xuất hiện trong những trang sách với câu chuyện cảm động
        </p>
      </div>

      {/* Book Preview */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="relative">
          {/* Open Book Display */}
          <div className="grid md:grid-cols-2 gap-1 bg-gray-800 p-1 rounded-lg shadow-2xl">
            {/* Left Page */}
            <div className="aspect-[3/4] bg-gradient-to-br from-purple-50 via-white to-pink-50 p-12 flex flex-col justify-center items-center relative overflow-hidden rounded-l-lg">
              {/* Decorative stars */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-purple-400"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      fontSize: `${Math.random() * 20 + 10}px`
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>

              {/* Character Scene 1 */}
              <div className="relative z-10 w-full">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl mb-6 border-4 border-white bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
                  {/* User's Character in Scene - Show couple for Love theme, single for others */}
                  {theme === 'love' ? (
                    <div className="relative">
                      <CoupleIllustration character={character} theme={theme} size="lg" />
                      {/* Love decorations */}
                      <div className="absolute -top-2 -right-2 text-3xl animate-pulse">💕</div>
                      <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse delay-150">💖</div>
                      <div className="absolute top-1/4 -left-3 text-2xl animate-pulse delay-300">✨</div>
                      <div className="absolute top-3/4 -right-3 text-2xl animate-pulse">✨</div>
                    </div>
                  ) : (
                    <div className="relative">
                      <CharacterIllustration character={character} size="lg" />
                      {/* Scene decoration based on theme */}
                      {theme === 'family' && (
                        <>
                          <div className="absolute -top-4 -right-4 text-4xl animate-pulse">👨‍👩‍👧</div>
                          <div className="absolute -bottom-4 -left-4 text-3xl animate-pulse delay-150">🏠</div>
                        </>
                      )}
                      {theme === 'birthday' && (
                        <>
                          <div className="absolute -top-4 -right-4 text-4xl animate-pulse">🎂</div>
                          <div className="absolute -bottom-4 -left-4 text-3xl animate-pulse delay-150">🎈</div>
                        </>
                      )}
                      {theme === 'friendship' && (
                        <>
                          <div className="absolute -top-4 -right-4 text-4xl animate-pulse">🤝</div>
                          <div className="absolute -bottom-4 -left-4 text-3xl animate-pulse delay-150">🌟</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-center text-gray-700 font-serif italic text-lg">
                  {content.scene1}
                </p>
              </div>
            </div>

            {/* Right Page */}
            <div className="aspect-[3/4] bg-gradient-to-br from-pink-50 via-white to-purple-50 p-12 flex flex-col justify-between relative overflow-hidden rounded-r-lg">
              {/* Quote */}
              <div className="space-y-6">
                <div className={`inline-block p-4 rounded-2xl bg-gradient-to-r ${content.color} bg-opacity-10`}>
                  <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                </div>
                <blockquote className="text-2xl md:text-3xl font-serif text-gray-800 text-center leading-relaxed">
                  {content.quote}
                </blockquote>
              </div>

              {/* Character Info */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur shadow-md">
                  <p className="text-sm text-gray-600 mb-3">Nhân vật của bạn:</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-24 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                      <CharacterIllustration character={character} size="sm" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {character.gender === 'male' ? 'Nam' : 'Nữ'} · Tóc {character.hairStyle === 'long' ? 'dài' : 'ngắn'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {character.hairColor === 'black' ? 'Đen' :
                         character.hairColor === 'brown' ? 'Nâu' :
                         character.hairColor === 'red' ? 'Đỏ' :
                         character.hairColor === 'blonde' ? 'Vàng' : 'Xám'} · 
                        {character.outfit === 'casual' ? ' Thoải mái' :
                         character.outfit === 'formal' ? ' Lịch sự' : ' Lãng mạn'}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-700 font-serif italic">
                  {content.scene2}
                </p>
              </div>
            </div>
          </div>

          {/* Book Spine Shadow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[95%] bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 opacity-50 blur-sm z-10"></div>
        </div>

        {/* Additional Pages Preview */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { img: 'figma:asset/e3dc89887407aae40ed4987d3011cdc80ce07e59.png', label: 'Trang 1-2' },
            { img: 'figma:asset/6251f78ccca4af275f512353d2f3b01052f7f0e0.png', label: 'Trang 3-4' },
            { img: 'figma:asset/e3dc89887407aae40ed4987d3011cdc80ce07e59.png', label: 'Trang 5-6' },
            { img: 'figma:asset/6251f78ccca4af275f512353d2f3b01052f7f0e0.png', label: 'Trang 7-8' }
          ].map((page, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition border-2 border-gray-200 group-hover:border-purple-400">
                <img
                  src={page.img}
                  alt={page.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
              <p className="text-sm text-gray-600 text-center mt-2 font-medium">
                {page.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="max-w-3xl mx-auto mt-12 p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200">
        <p className="text-center text-gray-700 leading-relaxed">
          🎨 <strong>Quý khách hãy cứ thoải mái ngồi chỉnh sửa</strong>, đây là cuốn sách riêng khách, 
          và khách sẽ chỉ chốt đơn cho đến khi nào ưng thôi! 💕
        </p>
      </div>

      {/* Action Buttons */}
      <div className="max-w-2xl mx-auto flex gap-4">
        <button
          onClick={onContinue}
          className="flex-1 py-5 px-8 bg-black text-white rounded-full text-xl font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-3 group"
        >
          Đặt hàng ngay
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
