import { CheckCircle, Package, Home, Printer } from 'lucide-react';
import { BookProject } from '../App';

interface PaymentSuccessProps {
  book: BookProject;
  onBackToDashboard: () => void;
}

export function PaymentSuccess({ book, onBackToDashboard }: PaymentSuccessProps) {
  const orderId = `BKF${Date.now().toString().slice(-8)}`;
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Đặt hàng thành công! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Cảm ơn bạn đã tin tưởng Bookify
          </p>
          
          <p className="text-gray-500">
            Chúng tôi đã nhận được đơn hàng và sẽ bắt đầu in ngay
          </p>
        </div>

        {/* Order Details Card */}
        <div className="card p-8 mb-6 animate-fade-in">
          {/* Order ID */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
                <p className="text-2xl font-bold gradient-text">{orderId}</p>
              </div>
              <Package className="w-12 h-12 text-pink-400" />
            </div>
          </div>

          {/* Book Info */}
          <div className="flex gap-4 pb-6 border-b mb-6">
            <img
              src={book.coverPage.backgroundImage || 'https://via.placeholder.com/100x140'}
              alt={book.title}
              className="w-24 h-32 object-cover rounded-xl shadow-lg"
            />
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">{book.title}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📖 {book.pageCount} trang</p>
                <p>🎨 Chủ đề: {book.theme}</p>
                <p>📅 Ngày đặt: {new Date().toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Trạng thái đơn hàng</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Đã nhận đơn</p>
                <p className="text-sm text-gray-600">Hôm nay, {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 opacity-60">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Đang in</p>
                <p className="text-sm text-gray-600">1-2 ngày</p>
              </div>
            </div>

            <div className="flex items-start gap-4 opacity-60">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Đang giao hàng</p>
                <p className="text-sm text-gray-600">3-5 ngày</p>
              </div>
            </div>

            <div className="flex items-start gap-4 opacity-60">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Đã giao</p>
                <p className="text-sm text-gray-600">Dự kiến: {estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💌</div>
              <div className="flex-1 text-sm">
                <p className="font-semibold text-blue-900 mb-1">
                  Chúng tôi sẽ gửi email xác nhận
                </p>
                <p className="text-blue-700">
                  Bạn sẽ nhận được email cập nhật về trạng thái đơn hàng. 
                  Vui lòng kiểm tra hộp thư!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
          <button
            onClick={onBackToDashboard}
            className="btn btn-primary btn-lg"
          >
            <Home className="w-5 h-5" />
            Về Dashboard
          </button>
          
          <button className="btn btn-outline btn-lg">
            <Package className="w-5 h-5" />
            Theo dõi đơn hàng
          </button>
        </div>

        {/* Share */}
        <div className="text-center mt-8 animate-fade-in">
          <p className="text-gray-600 mb-4">Chia sẻ niềm vui với bạn bè! 🎊</p>
          <div className="flex items-center justify-center gap-3">
            <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            
            <button className="w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
            </button>
            
            <button className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
