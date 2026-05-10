import { useState, useEffect } from 'react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart,
  BookOpen, Eye, Sparkles, RotateCw, ZoomIn, ZoomOut
} from 'lucide-react';
import { BookProject } from '../App';

interface Book2DPreviewProps {
  book: BookProject;
  onBack: () => void;
  onOrder: () => void;
}

export default function Book2DPreview({ book, onBack, onOrder }: Book2DPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'cover' | 'pages'>('cover');
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  
  const totalPages = book.pages.length;

  // Generate sample content based on theme
  const getSampleContent = (pageNum: number) => {
    const themes: Record<string, string[]> = {
      'Kỷ niệm gia đình': [
        'Những khoảnh khắc đáng nhớ...',
        'Gia đình là nơi yêu thương...',
        'Kỷ niệm ngọt ngào bên nhau...',
        'Hạnh phúc giản đơn mỗi ngày...'
      ],
      'Tình yêu': [
        'Từ khi gặp em...',
        'Yêu thương không lời...',
        'Những ngày bên nhau...',
        'Mãi mãi bên em...'
      ],
      'Du lịch': [
        'Hành trình khám phá...',
        'Những nơi đã đến...',
        'Kỷ niệm du lịch...',
        'Thế giới rộng lớn...'
      ],
      'Tốt nghiệp': [
        'Kỷ niệm tuổi học trò...',
        'Những người bạn...',
        'Ước mơ tương lai...',
        'Khởi đầu mới...'
      ]
    };
    
    const content = themes[book.theme] || themes['Kỷ niệm gia đình'];
    return content[pageNum % content.length];
  };

  // Page flip animation
  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage > totalPages) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsFlipping(false);
    }, 300);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (viewMode !== 'pages') return;
      
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        handlePageChange(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, viewMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 text-center text-sm">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Đang sử dụng chế độ xem 2D tối ưu • Hỗ trợ xoay, zoom và lật trang mượt mà
        </span>
      </div>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay lại</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">{book.title}</h1>
            
            <button
              onClick={onOrder}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              Đặt hàng
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Main Preview Area */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
              {viewMode === 'cover' ? (
                // Book Cover Preview with 3D-like effect
                <div 
                  className="relative w-full max-w-md transition-transform duration-500 ease-out"
                  style={{ 
                    transform: `perspective(1200px) rotateY(${rotation}deg) scale(${zoom})`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Main book cover */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg shadow-2xl p-8 flex flex-col items-center justify-center text-white relative"
                    style={{
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Sparkles className="w-12 h-12 mb-4 opacity-80 animate-pulse" />
                    <h2 className="text-3xl font-bold text-center mb-2">{book.title}</h2>
                    <p className="text-white/80 text-center text-sm">{book.theme}</p>
                    
                    {/* Glossy effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg pointer-events-none"></div>
                  </div>
                  
                  {/* Book spine effect with depth */}
                  <div className="absolute -right-3 top-6 bottom-6 w-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-r-lg shadow-xl"
                    style={{
                      transform: 'rotateY(-15deg)',
                      transformOrigin: 'left center'
                    }}
                  ></div>
                  
                  {/* Pages effect */}
                  <div className="absolute -right-1 top-4 bottom-4 w-2 bg-white/90 rounded-r shadow-md"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px)'
                    }}
                  ></div>
                </div>
              ) : (
                // Pages Preview with flip animation
                <div 
                  className="relative w-full max-w-2xl transition-all duration-300"
                  style={{ 
                    transform: `scale(${zoom})`,
                    perspective: '1200px'
                  }}
                >
                  <div 
                    className={`aspect-[4/3] bg-white rounded-lg shadow-2xl p-12 flex items-center justify-center transition-all duration-300 ${
                      isFlipping ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}
                    style={{
                      boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {currentPage === 0 ? (
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                          <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h3>
                        <p className="text-gray-600 text-lg">{book.theme}</p>
                        <div className="mt-8 text-sm text-gray-400">Trang bìa</div>
                      </div>
                    ) : (
                      <div className="text-center space-y-6 w-full max-w-lg mx-auto px-8">
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full">
                          <p className="text-sm font-semibold text-gray-700">Trang {currentPage}</p>
                        </div>
                        
                        {/* Sample page content with theme-based text */}
                        <div className="space-y-4">
                          <h4 className="text-2xl font-bold text-gray-900">
                            {getSampleContent(currentPage)}
                          </h4>
                          
                          {/* Image placeholder */}
                          <div className="aspect-video bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-2 bg-white/50 rounded-full flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-pink-500" />
                              </div>
                              <p className="text-sm text-gray-600">Hình ảnh của bạn</p>
                            </div>
                          </div>
                          
                          {/* Sample text content */}
                          <p className="text-gray-700 leading-relaxed text-left">
                            Nội dung văn bản của bạn sẽ được hiển thị ở đây. Bạn có thể tùy chỉnh
                            hoàn toàn font chữ, màu sắc và bố cục theo ý muốn trong phần chỉnh sửa.
                          </p>
                        </div>
                        
                        {/* Page number at bottom */}
                        <div className="absolute bottom-6 left-0 right-0 text-center text-gray-400 text-xs">
                          {currentPage}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Page indicator */}
              {viewMode === 'pages' && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg">
                  <p className="text-sm font-semibold text-gray-900">
                    {currentPage === 0 ? 'Bìa' : `Trang ${currentPage}`} / {totalPages}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              {viewMode === 'pages' ? (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0 || isFlipping}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Trang trước</span>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      {currentPage} / {totalPages}
                    </span>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      (Dùng ← → để lật trang)
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages || isFlipping}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="hidden sm:inline">Trang sau</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                // Cover view controls
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setRotation(rotation - 15)}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-pink-300 transition-all"
                    title="Xoay trái"
                  >
                    <RotateCw className="w-5 h-5 transform -scale-x-100" />
                  </button>
                  
                  <button
                    onClick={() => setZoom(Math.max(0.8, zoom - 0.1))}
                    disabled={zoom <= 0.8}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Thu nhỏ"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  
                  <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  
                  <button
                    onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                    disabled={zoom >= 1.5}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Phóng to"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setRotation(rotation + 15)}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-pink-300 transition-all"
                    title="Xoay phải"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* View Mode Toggle */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-pink-500" />
                Chế độ xem
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setViewMode('cover');
                    setRotation(0);
                    setZoom(1);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    viewMode === 'cover'
                      ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-md scale-105'
                      : 'border-gray-200 hover:border-pink-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${viewMode === 'cover' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Bìa sách</span>
                </button>
                
                <button
                  onClick={() => {
                    setViewMode('pages');
                    setCurrentPage(0);
                    setZoom(1);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    viewMode === 'pages'
                      ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-md scale-105'
                      : 'border-gray-200 hover:border-pink-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${viewMode === 'pages' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Lật trang</span>
                </button>
              </div>
            </div>

            {/* Book Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" />
                Thông tin sách
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Chủ đề:</span>
                  <span className="font-semibold text-gray-900 text-sm">{book.theme}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Số trang:</span>
                  <span className="font-semibold text-gray-900 text-sm">{totalPages} trang</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Kích thước:</span>
                  <span className="font-semibold text-gray-900 text-sm">20x20cm</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Loại bìa:</span>
                  <span className="font-semibold text-gray-900 text-sm">Bìa cứng</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Chất liệu:</span>
                  <span className="font-semibold text-gray-900 text-sm">Giấy cao cấp</span>
                </div>
              </div>
            </div>
            
            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Mẹo nhỏ
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Dùng phím mũi tên ← → để lật trang nhanh</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Xoay và zoom bìa sách để xem chi tiết</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Preview 2D giúp xem nhanh trước khi đặt hàng</span>
                </li>
              </ul>
            </div>

            {/* Order CTA */}
            <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Sẵn sàng đặt hàng?</h3>
              <p className="text-white/80 text-sm mb-4">
                Cuốn sách của bạn sẽ được in chất lượng cao và giao tận nhà
              </p>
              <button
                onClick={onOrder}
                className="w-full bg-white text-pink-600 px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Đặt hàng ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
