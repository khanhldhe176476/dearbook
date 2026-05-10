import { AlertCircle, RefreshCcw, ArrowLeft } from 'lucide-react';

interface Preview3DErrorProps {
  onRetry: () => void;
  onBackToEditor: () => void;
}

export function Preview3DError({ onRetry, onBackToEditor }: Preview3DErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-lg">
        {/* Error Icon */}
        <div className="relative w-32 h-32 mx-auto">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse blur-xl"></div>
          
          {/* Main icon container */}
          <div className="relative bg-gradient-to-br from-red-500 to-rose-600 rounded-full w-full h-full flex items-center justify-center shadow-2xl">
            <AlertCircle className="w-16 h-16 text-white animate-pulse" />
            
            {/* Alert indicators */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-red-900">!</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-900">
            Không thể tải Preview 3D
          </h2>
          <p className="text-lg text-gray-600">
            Đã xảy ra lỗi khi tạo bản xem trước 3D của cuốn sách.
          </p>
        </div>

        {/* Error Details */}
        <div className="card p-6 bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-red-900 mb-2">Có thể do:</p>
              <ul className="text-sm text-red-700 space-y-1.5">
                <li>• Kết nối internet không ổn định</li>
                <li>• Trình duyệt không hỗ trợ WebGL</li>
                <li>• File ảnh quá lớn hoặc bị lỗi</li>
                <li>• Hệ thống đang bảo trì</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onRetry}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Thử lại</span>
          </button>

          <button
            onClick={onBackToEditor}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại Editor</span>
          </button>
        </div>

        {/* Tips */}
        <div className="card p-6 bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="text-left">
              <p className="font-semibold text-blue-900 mb-2">Mẹo khắc phục:</p>
              <ul className="text-sm text-blue-700 space-y-1.5">
                <li>1. Kiểm tra kết nối internet</li>
                <li>2. Thử refresh trang (F5)</li>
                <li>3. Dùng Chrome/Edge mới nhất</li>
                <li>4. Liên hệ support nếu lỗi vẫn tiếp diễn</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
