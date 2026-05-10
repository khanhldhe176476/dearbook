import { Lock, BookOpen, Eye, Edit3, CheckCircle } from 'lucide-react';

export function FeatureShowcase() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-blue-200">
      <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        ✨ Tính năng DearBook
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Authentication */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Bảo mật & Đăng nhập</h3>
              <p className="text-xs text-gray-600">Chỉ sau khi đăng nhập</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Templates chỉ có trong Dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Phải đăng nhập để chỉnh sửa</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Dữ liệu lưu an toàn</span>
            </li>
          </ul>
        </div>

        {/* Templates */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Templates Đa dạng</h3>
              <p className="text-xs text-gray-600">4 chủ đề, nhiều mẫu</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Love, Family, Birthday, Friendship</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Nội dung mẫu sẵn có</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Ảnh Unsplash chất lượng cao</span>
            </li>
          </ul>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-pink-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Editor Mạnh mẽ</h3>
              <p className="text-xs text-gray-600">Drag-drop, upload ảnh</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Kéo thả elements tự do</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Chỉnh font, màu, kích thước</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Upload ảnh cá nhân</span>
            </li>
          </ul>
        </div>

        {/* 3D Preview */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">3D Preview Thực tế</h3>
              <p className="text-xs text-gray-600">Giống sách thật 100%</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Bìa trước, sau, gáy sách</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Xoay 360°, lật trang</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Hiển thị nội dung thật</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="mt-6 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 rounded-2xl p-6 text-center">
        <p className="text-white font-semibold text-lg mb-2">
          🎯 Dành cho người mới bắt đầu
        </p>
        <p className="text-white/90 text-sm">
          Giao diện đơn giản, hướng dẫn từng bước, không cần kinh nghiệm thiết kế
        </p>
      </div>
    </div>
  );
}
