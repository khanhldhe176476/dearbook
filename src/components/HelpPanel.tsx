import { useState } from 'react';
import { HelpCircle, X, BookOpen, Lock, Edit3, Eye, ShoppingCart } from 'lucide-react';

export function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Trợ giúp"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Help modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <BookOpen className="w-6 h-6" />
                <h2 className="text-xl font-bold">Hướng dẫn sử dụng DearBook</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                {/* Authentication */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-bold text-gray-800">🔐 Đăng nhập & Bảo mật</h3>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                    <p className="text-sm text-gray-700">
                      ✅ <strong>Templates chỉ khả dụng sau khi đăng nhập</strong> - Tất cả templates và công cụ chỉnh sửa chỉ có thể truy cập trong Dashboard sau khi đăng nhập.
                    </p>
                    <p className="text-sm text-gray-700">
                      ✅ <strong>Dữ liệu được lưu an toàn</strong> - Sách của bạn được lưu trong tài khoản cá nhân.
                    </p>
                    <p className="text-sm text-gray-700">
                      ✅ <strong>Đăng nhập nhanh với Google</strong> - Sử dụng tài khoản Google để đăng nhập an toàn.
                    </p>
                  </div>
                </section>

                {/* 4-step process */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-800">📝 Quy trình 4 bước</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Bước 1: Chọn chủ đề</h4>
                      <p className="text-sm text-gray-700">
                        Chọn chủ đề phù hợp: Tình yêu, Gia đình, Sinh nhật, hoặc Tình bạn. Mỗi chủ đề có nội dung và hình ảnh được thiết kế sẵn.
                      </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Bước 2: Chọn template</h4>
                      <p className="text-sm text-gray-700">
                        Duyệt qua các mẫu thiết kế đẹp. Mỗi mẫu đã có nội dung và bố cục hoàn chỉnh - bạn chỉ cần tùy chỉnh.
                      </p>
                    </div>

                    <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                      <h4 className="font-semibold text-pink-800 mb-2">Bước 3: Tùy chỉnh nhân vật</h4>
                      <p className="text-sm text-gray-700">
                        Chọn kiểu tóc, màu tóc, và trang phục cho nhân vật trong sách. Nhân vật này sẽ xuất hiện trong các trang.
                      </p>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                      <h4 className="font-semibold text-rose-800 mb-2">Bước 4: Chỉnh sửa nội dung</h4>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>Nhấn vào văn bản để chỉnh sửa</li>
                        <li>Kéo thả để di chuyển phần tử</li>
                        <li>Upload ảnh của bạn vào khung ảnh</li>
                        <li>Thay đổi font chữ, màu sắc, kích thước</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 3D Preview */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-800">👁️ Xem trước 3D</h3>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-2">
                    <p className="text-sm text-gray-700">
                      <strong>3D Book Preview hiển thị:</strong>
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-3">
                      <li>Bìa trước với ảnh và tiêu đề của bạn</li>
                      <li>Bìa sau với hình ảnh tùy chỉnh</li>
                      <li>Gáy sách với tên sách</li>
                      <li>Các trang bên trong khi lật trang</li>
                      <li>Xoay 360° để xem mọi góc độ</li>
                      <li>Lật trang giống sách thật</li>
                    </ul>
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Điều khiển:</strong> Click và kéo để xoay, scroll để zoom, nhấn nút mũi tên để lật trang.
                    </p>
                  </div>
                </section>

                {/* Tips for beginners */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-800">💡 Mẹo cho người mới</h3>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✅ <strong>Lưu tự động:</strong> Sách được lưu tự động khi bạn chỉnh sửa</li>
                      <li>✅ <strong>Có thể quay lại:</strong> Nhấn "Quay lại" ở mỗi bước để sửa lại</li>
                      <li>✅ <strong>Xem trước trước khi đặt:</strong> Luôn xem 3D preview trước khi thanh toán</li>
                      <li>✅ <strong>Upload ảnh chất lượng cao:</strong> Dùng ảnh rõ nét để in đẹp</li>
                      <li>✅ <strong>Thử nhiều mẫu:</strong> Đừng ngại thử các template khác nhau</li>
                    </ul>
                  </div>
                </section>

                {/* UI Features */}
                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">🎨 Tính năng giao diện</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✅ <strong>Beginner-friendly:</strong> Giao diện trực quan, dễ sử dụng</li>
                      <li>✅ <strong>Step-by-step guide:</strong> Hướng dẫn từng bước rõ ràng</li>
                      <li>✅ <strong>Real-time preview:</strong> Xem thay đổi ngay lập tức</li>
                      <li>✅ <strong>Mobile responsive:</strong> Sử dụng được trên mọi thiết bị</li>
                      <li>✅ <strong>Clean design:</strong> Giao diện sạch sẽ, không rối mắt</li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Đã hiểu, bắt đầu tạo sách!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
