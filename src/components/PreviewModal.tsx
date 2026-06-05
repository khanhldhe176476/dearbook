import { X, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { BookDesign } from '../App';

interface PreviewModalProps {
  bookDesign: BookDesign;
  onClose: () => void;
  onOrder: () => void;
}

export function PreviewModal({ bookDesign, onClose, onOrder }: PreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(-1); // -1 for cover, -2 for dedication, 0+ for pages

  const totalPages = bookDesign.pages.length + 2; // cover + dedication + pages

  const nextPage = () => {
    if (currentPage < bookDesign.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > -1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif text-rose-900">Xem trước sách của bạn</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Book Preview */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            {/* Cover */}
            {currentPage === -1 && (
              <div className="aspect-[3/4] bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-2xl flex flex-col items-center justify-center p-12 text-white relative overflow-hidden">
                {bookDesign.coverImage && (
                  <img
                    src={bookDesign.coverImage}
                    alt="Cover"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                )}
                <div className="relative z-10 text-center">
                  <h1 className="text-5xl font-serif mb-6">{bookDesign.title || 'Tiêu đề sách'}</h1>
                  {bookDesign.recipient && (
                    <p className="text-2xl italic">Dành tặng: {bookDesign.recipient}</p>
                  )}
                </div>
              </div>
            )}

            {/* Dedication Page */}
            {currentPage === -2 && (
              <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl shadow-2xl flex items-center justify-center p-16">
                <div className="text-center">
                  <p className="text-2xl italic text-gray-700 leading-relaxed">
                    {bookDesign.dedication || 'Lời tặng...'}
                  </p>
                </div>
              </div>
            )}

            {/* Content Pages */}
            {currentPage >= 0 && currentPage < bookDesign.pages.length && (
              <div className="aspect-[3/4] bg-white rounded-xl shadow-2xl overflow-hidden">
                {renderPage(bookDesign.pages[currentPage])}
              </div>
            )}

            {/* Page Counter */}
            <div className="text-center mt-6 text-gray-600">
              Trang {currentPage + 3} / {totalPages}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={prevPage}
            disabled={currentPage === -1}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Trang trước
          </button>

          <button
            onClick={onOrder}
            className="flex items-center gap-2 px-8 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            Đặt in sách này
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === bookDesign.pages.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang sau
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function renderPage(page: any) {
  if (page.layout === 'text-only') {
    return (
      <div className="h-full flex items-center justify-center p-16 bg-gradient-to-br from-amber-50 to-rose-50">
        <p className="text-xl text-gray-700 leading-relaxed text-center italic whitespace-pre-wrap">
          {page.content}
        </p>
      </div>
    );
  }

  if (page.layout === 'image-only') {
    return page.imageUrl ? (
      <img src={page.imageUrl} alt="Page" className="w-full h-full object-cover" />
    ) : (
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Chưa có hình ảnh</p>
      </div>
    );
  }

  if (page.layout === 'text-image') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 p-12 bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center">
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
            {page.content}
          </p>
        </div>
        {page.imageUrl && (
          <div className="h-1/2">
            <img src={page.imageUrl} alt="Page" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    );
  }

  if (page.layout === 'image-text') {
    return (
      <div className="h-full flex flex-col">
        {page.imageUrl && (
          <div className="h-1/2">
            <img src={page.imageUrl} alt="Page" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 p-12 bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center">
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
            {page.content}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
