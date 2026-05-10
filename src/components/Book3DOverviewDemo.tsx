import { useState } from 'react';
import Book3DOverviewPreview from './Book3DOverviewPreview';
import { ArrowLeft } from 'lucide-react';

// Demo page to showcase the 3D Overview Preview
export default function Book3DOverviewDemo() {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedBook, setSelectedBook] = useState({
    title: "Our Love Story",
    theme: "love" as const,
    coverColor: "#f9a8d4",
    pages: []
  });

  const demoBooks = [
    {
      title: "Our Love Story",
      theme: "love" as const,
      coverColor: "#f9a8d4",
      description: "Cuốn sách tình yêu với màu hồng pastel"
    },
    {
      title: "Family Moments",
      theme: "family" as const,
      coverColor: "#a78bfa",
      description: "Kỷ niệm gia đình với màu tím nhạt"
    },
    {
      title: "Happy Birthday",
      theme: "birthday" as const,
      coverColor: "#fbbf24",
      description: "Sinh nhật vui vẻ với màu vàng ấm"
    },
    {
      title: "Best Friends Forever",
      theme: "friendship" as const,
      coverColor: "#6ee7b7",
      description: "Tình bạn đẹp với màu xanh mint"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {!showPreview ? (
        <div className="container-custom py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              3D Book Preview – Overview Mode
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chọn một cuốn sách để xem trước 3D với góc nhìn tổng thể.
              Bạn có thể xoay, zoom và chuyển đổi giữa các chế độ xem khác nhau.
            </p>
          </div>

          {/* Book Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {demoBooks.map((book, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedBook({
                    ...book,
                    pages: []
                  });
                  setShowPreview(true);
                }}
                className="card card-hover p-6 text-left group"
              >
                <div 
                  className="w-full h-48 rounded-xl mb-4 flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${book.coverColor} 0%, ${book.coverColor}99 100%)`
                  }}
                >
                  <div className="text-white text-center">
                    <div className="text-3xl mb-2">📖</div>
                    <div className="font-handwriting text-xl">{book.title}</div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {book.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-pink-600 font-medium">
                  <span>Xem 3D Preview</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Tính năng 3D Preview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white text-2xl mb-4">
                  👁️
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Overview Mode</h3>
                <p className="text-sm text-gray-600">
                  Nhìn thấy toàn bộ cuốn sách: bìa trước, gáy, bìa sau và độ dày trong một góc nhìn
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-md">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white text-2xl mb-4">
                  🔄
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Điều khiển linh hoạt</h3>
                <p className="text-sm text-gray-600">
                  Xoay 360°, zoom in/out, và reset view dễ dàng với chuột hoặc touch
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-md">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-2xl mb-4">
                  🎨
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Chất lượng cao</h3>
                <p className="text-sm text-gray-600">
                  Render 3D realistic với shadows, lighting và textures chuyên nghiệp
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Book3DOverviewPreview
            bookData={selectedBook}
            onClose={() => setShowPreview(false)}
          />
        </>
      )}
    </div>
  );
}
