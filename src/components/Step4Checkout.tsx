import { useState } from 'react';
import { Check, Edit3, Sparkles, Package, Truck, CreditCard } from 'lucide-react';
import { CharacterDesign } from '../App';
import { CharacterIllustration } from './CharacterIllustration';

interface Step4CheckoutProps {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  character: CharacterDesign;
  onComplete: () => void;
  onEdit: () => void;
}

const themeLabels = {
  love: 'Tình Yêu 💕',
  family: 'Gia Đình 👨‍👩‍👧',
  birthday: 'Sinh Nhật 🎂',
  friendship: 'Tình Bạn 🤝'
};

export function Step4Checkout({ theme, character, onComplete, onEdit }: Step4CheckoutProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOrder = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto shadow-2xl">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
            Đặt hàng thành công! 🎉
          </h2>
          <p className="text-xl text-gray-600">
            Cảm ơn bạn đã tin tưởng. Cuốn sách của bạn sẽ được in và giao trong vòng 3-5 ngày.
          </p>
          <div className="p-6 rounded-2xl bg-green-50 border border-green-200">
            <p className="text-green-800">
              📧 Chúng tôi đã gửi email xác nhận đến hộp thư của bạn
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
          Xác nhận đặt hàng
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Kiểm tra lại thông tin cuốn sách của bạn trước khi hoàn tất đơn hàng
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8 mt-12">
        {/* Left: Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Book Details */}
          <div className="rounded-3xl bg-white shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Thông tin sách
              </h3>
              <button
                onClick={onEdit}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition"
              >
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                <div className="w-24 h-32 rounded-xl overflow-hidden shadow-md">
                  <img
                    src="figma:asset/75f25ac90081e751c1ea46d382338eda718c305b.png"
                    alt="Book preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Em Yêu Anh</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📚 Chủ đề: <span className="font-medium text-gray-900">{themeLabels[theme]}</span></p>
                    <p>📄 Số trang: <span className="font-medium text-gray-900">40 trang</span></p>
                    <p>📏 Kích thước: <span className="font-medium text-gray-900">15×21 cm</span></p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <p className="text-sm font-semibold text-purple-900 mb-3">Nhân vật đã tạo:</p>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-32 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden shadow-lg p-2">
                    <CharacterIllustration character={character} size="sm" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {character.gender === 'male' ? 'Nam' : 'Nữ'} · 
                      Tóc {character.hairStyle === 'long' ? 'dài' : 'ngắn'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Màu {character.hairColor === 'black' ? 'đen' :
                           character.hairColor === 'brown' ? 'nâu' :
                           character.hairColor === 'red' ? 'đỏ' :
                           character.hairColor === 'blonde' ? 'vàng' : 'xám'} · 
                      {character.outfit === 'casual' ? ' Thoải mái' :
                       character.outfit === 'formal' ? ' Lịch sự' : ' Lãng mạn'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="rounded-3xl bg-white shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Truck className="w-6 h-6" />
              Thông tin giao hàng
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  rows={3}
                  placeholder="123 Đường ABC, Quận 1, TP.HCM"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Giao giờ hành chính"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-3xl bg-white shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              Phương thức thanh toán
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-400 cursor-pointer transition">
                <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Chuyển khoản ngân hàng</p>
                  <p className="text-sm text-gray-600">Thanh toán trước khi sản xuất</p>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-400 cursor-pointer transition">
                <input type="radio" name="payment" className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-sm text-gray-600">Trả tiền mặt khi nhận sách</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Price Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-8 sticky top-6 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Tóm tắt đơn hàng</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Giá sách</span>
                <span className="font-semibold">570,000₫</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-green-600">Miễn phí</span>
              </div>
              <div className="pt-3 border-t-2 border-purple-200">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-3xl font-bold text-gray-900">570,000₫</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOrder}
              className="w-full py-4 px-6 bg-black text-white rounded-full text-lg font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Đặt hàng ngay
            </button>

            <div className="space-y-3 pt-4 border-t border-purple-200">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span>Miễn phí vận chuyển toàn quốc</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                <span>Giao hàng trong 3-5 ngày</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-purple-600" />
                </div>
                <span>Hỗ trợ đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
