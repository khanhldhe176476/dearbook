import { BookX, ArrowLeft, Plus } from 'lucide-react';

interface Preview3DEmptyProps {
  onBackToEditor: () => void;
}

export function Preview3DEmpty({ onBackToEditor }: Preview3DEmptyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-lg">
        {/* Empty Icon */}
        <div className="relative w-32 h-32 mx-auto">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gray-300/30 rounded-full animate-pulse blur-xl"></div>
          
          {/* Main icon container */}
          <div className="relative bg-gradient-to-br from-gray-300 to-gray-400 rounded-full w-full h-full flex items-center justify-center shadow-2xl">
            <BookX className="w-16 h-16 text-white" />
            
            {/* Question mark */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-gray-900">?</span>
            </div>
          </div>
        </div>

        {/* Empty Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-900">
            Chưa có nội dung để xem
          </h2>
          <p className="text-lg text-gray-600">
            Cuốn sách của bạn chưa có trang nào. Hãy quay lại Editor để thêm nội dung!
          </p>
        </div>

        {/* Empty Illustration */}
        <div className="card p-12 bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <div className="flex flex-col items-center gap-6">
            {/* Empty pages illustration */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300"></div>
              <div className="w-16 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"></div>
              <div className="w-16 h-20 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300"></div>
            </div>
            
            <p className="text-sm text-gray-500">
              Không có trang nào để hiển thị
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onBackToEditor}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại Editor</span>
          </button>

          <p className="text-sm text-gray-500">
            Thêm trang và nội dung vào sách của bạn
          </p>
        </div>

        {/* Tips */}
        <div className="card p-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200/50">
          <div className="flex items-start gap-3">
            <div className="text-2xl">✨</div>
            <div className="text-left">
              <p className="font-semibold text-purple-900 mb-2">Gợi ý:</p>
              <ul className="text-sm text-purple-700 space-y-1.5">
                <li>• Thêm ít nhất 1 trang để xem Preview 3D</li>
                <li>• Sử dụng Editor để tạo nội dung</li>
                <li>• Thêm text, ảnh và sticker vào trang</li>
                <li>• Sau đó quay lại đây để xem 3D!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
