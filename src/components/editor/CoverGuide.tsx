import { BookOpen, Sparkles, Edit3, Check } from 'lucide-react';

interface CoverGuideProps {
  onSelectCover: () => void;
  onDismiss: () => void;
}

export function CoverGuide({ onSelectCover, onDismiss }: CoverGuideProps) {
  return (
    <div className="fixed bottom-24 right-24 z-30 max-w-sm animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-1 rounded-2xl shadow-2xl">
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                💡 Trang bìa đẹp miễn phí!
              </h3>
              <p className="text-sm text-gray-600">
                Chọn ngay từ 12+ mẫu trang bìa chuyên nghiệp
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 text-purple-600" />
              </div>
              <span>Nhiều phong cách: Modern, Elegant, Minimal</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Edit3 className="w-3 h-3 text-pink-600" />
              </div>
              <span>Chỉnh sửa dễ dàng sau khi chọn</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-blue-600" />
              </div>
              <span>Phù hợp với theme của bạn</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onSelectCover}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 px-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Chọn trang bìa
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Để sau
            </button>
          </div>
        </div>
      </div>

      {/* Arrow pointer */}
      <div className="absolute -top-2 right-8 w-4 h-4 bg-purple-500 transform rotate-45" />
    </div>
  );
}
