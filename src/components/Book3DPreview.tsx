import { useState, Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber@8.18.0';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei@9.117.3';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, ShoppingCart,
  ZoomIn, ZoomOut, Eye, BookOpen, AlertCircle, Sparkles, FileQuestion
} from 'lucide-react';
import { MinimalBook } from './MinimalBook';
import { BookProject } from '../App';
import { Book3DPreviewError } from './Book3DPreviewError';
import { SceneLights } from './SceneLights';

interface Book3DPreviewProps {
  book: BookProject;
  onBack: () => void;
  onOrder: () => void;
}

type ViewMode = 'showcase' | 'flip' | 'read';
type ZoomLevel = 100 | 125 | 150;

export default function Book3DPreview({ book, onBack, onOrder }: Book3DPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('showcase');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(100);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({ x: 1.2, y: 0.8, z: 2.5 });
  const [cameraTarget, setCameraTarget] = useState({ x: 0, y: 0, z: 0 });

  // Debug logging
  useEffect(() => {
    console.log('🎨 Book3DPreview mounted', {
      bookId: book.id,
      bookTitle: book.title,
      pageCount: book.pages.length,
      hasBackgroundImage: !!book.coverPage.backgroundImage
    });

    // Check if book is empty
    if (!book.pages || book.pages.length === 0) {
      setIsEmpty(true);
      setIsLoading(false);
    }

    return () => {
      console.log('🎨 Book3DPreview unmounted');
    };
  }, []);

  const totalPages = book.pages?.length || 0;
  const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  // Camera configurations for each view mode
  const cameraConfigs = {
    showcase: {
      position: { x: 1.2, y: 0.8, z: 2.5 },
      target: { x: 0, y: 0, z: 0 },
      fov: 50,
      description: 'Xoay 360° để ngắm toàn bộ cuốn sách'
    },
    flip: {
      position: { x: 0, y: 1.2, z: 2.0 },
      target: { x: 0, y: 0, z: 0 },
      fov: 45,
      description: 'Góc nhìn từ trên để lật trang'
    },
    read: {
      position: { x: 0, y: 0, z: 1.6 },
      target: { x: 0, y: 0, z: 0 },
      fov: 40,
      description: 'Nhìn thẳng để đọc nội dung rõ nhất'
    }
  };

  // Update camera when view mode changes
  useEffect(() => {
    const config = cameraConfigs[viewMode];
    setCameraPosition(config.position);
    setCameraTarget(config.target);
    setAutoRotate(viewMode === 'showcase');
  }, [viewMode]);

  // Simulate loading
  useEffect(() => {
    if (isEmpty) return;
    
    const timer = setTimeout(() => {
      try {
        console.log('✅ 3D Preview ready');
        setIsLoading(false);
        setHasError(false);
      } catch (error) {
        console.error('❌ Error setting loading state:', error);
        setHasError(true);
        setIsLoading(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isEmpty]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const handleReset = () => {
    setCurrentPage(0);
    setViewMode('showcase');
    setZoomLevel(100);
    setAutoRotate(true);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => {
      if (prev === 100) return 125;
      if (prev === 125) return 150;
      return 150;
    });
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      if (prev === 150) return 125;
      if (prev === 125) return 100;
      return 100;
    });
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  // Memoize book data
  const bookData = useMemo(() => {
    return {
      title: book.title,
      coverFront: book.coverPage.backgroundImage || '',
      coverBack: '#ec4899',
      spineText: book.title,
      pages: book.pages.map((page, index) => ({
        id: page.id,
        imageUrl: page.backgroundImage || '',
        text: page.elements.find(e => e.type === 'text')?.content || '',
        pageNumber: index + 1
      })),
      thickness: Math.max(0.05, Math.min(0.15, book.pages.length * 0.008))
    };
  }, [book]);

  // ==================== STATES ====================

  // Empty State
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 flex items-center justify-center p-8">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-16 h-16 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Chưa có nội dung
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Cuốn sách này chưa có trang nào để xem trước. Hãy quay lại Editor và thêm nội dung vào sách của bạn.
          </p>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Quay lại Editor
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Error State
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 flex items-center justify-center p-8">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Không thể tải Preview 3D
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Đã xảy ra lỗi khi tải giao diện xem trước 3D. Vui lòng thử lại hoặc quay lại Editor.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Thử lại
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Quay lại Editor
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-purple-600 rounded-3xl animate-pulse opacity-50 blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-rose-500 to-purple-600 rounded-3xl w-full h-full flex items-center justify-center shadow-2xl animate-bounce">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-2">Đang tạo bản xem trước 3D...</p>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN UI ====================

  return (
    <Book3DPreviewError onReset={() => setHasError(false)}>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1920px] mx-auto px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-rose-600 transition-all duration-300 rounded-xl hover:bg-rose-50 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Quay lại</span>
                </button>
                
                <div className="h-8 w-px bg-gray-200"></div>
                
                <div>
                  <h1 className="text-xl font-bold text-gray-900">3D Preview</h1>
                  <p className="text-sm text-gray-500">{book.title}</p>
                </div>
              </div>

              <button 
                onClick={onOrder}
                className="group relative px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Đặt hàng ngay</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="max-w-[1920px] mx-auto p-8">
          <div className="grid grid-cols-12 gap-8">
            {/* LEFT: 3D Canvas - 70% */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
                {/* Canvas Area */}
                <div className="Canvas3D_Area relative bg-gradient-to-br from-gray-50 to-gray-100" style={{ aspectRatio: '16/10' }}>
                  <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                          <div className="w-12 h-12 bg-white rounded-full"></div>
                        </div>
                        <p className="text-gray-600 font-medium">Loading 3D...</p>
                      </div>
                    </div>
                  }>
                    <Canvas 
                      key={`book-canvas-${book.id}`}
                      shadows 
                      dpr={[1, 2]}
                      gl={{ 
                        antialias: true,
                        alpha: false,
                        powerPreference: 'high-performance'
                      }}
                      onCreated={(state) => {
                        console.log('🎨 Canvas created');
                        state.gl.setClearColor('#fafafa', 1);
                        state.gl.toneMappingExposure = 1.2;
                      }}
                    >
                      <PerspectiveCamera 
                        makeDefault 
                        position={[
                          cameraPosition.x * (zoomLevel / 100),
                          cameraPosition.y * (zoomLevel / 100),
                          cameraPosition.z / (zoomLevel / 100)
                        ]} 
                        fov={cameraConfigs[viewMode].fov} 
                      />
                      
                      <SceneLights />
                      
                      <MinimalBook bookData={bookData} currentPage={currentPage} />
                      
                      <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        rotateSpeed={0.5}
                        autoRotate={autoRotate}
                        autoRotateSpeed={1.5}
                        minDistance={1.2}
                        maxDistance={4}
                        target={[cameraTarget.x, cameraTarget.y, cameraTarget.z]}
                      />
                    </Canvas>
                  </Suspense>

                  {/* Page Badge */}
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50">
                    <p className="text-sm font-semibold text-gray-900">
                      {currentPage === 0 ? 'Bìa' : `Trang ${currentPage}`} / {totalPages}
                    </p>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900/80 backdrop-blur-md rounded-lg text-white text-sm">
                    Kéo để xoay • Lăn chuột để zoom
                  </div>

                  {/* Zoom Badge */}
                  {zoomLevel !== 100 && (
                    <div className="absolute top-6 right-6 px-4 py-2 bg-rose-500 text-white rounded-xl shadow-lg font-semibold">
                      {zoomLevel}%
                    </div>
                  )}
                </div>

                {/* Bottom Progress Bar */}
                <div className="px-8 py-4 bg-gradient-to-r from-rose-50 to-purple-50 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600">Tiến độ xem</p>
                    <p className="text-sm font-bold text-rose-600">{progress}%</p>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Control Panel - 30% */}
            <div className="col-span-12 lg:col-span-4 space-y-6 ControlPanel">
              {/* Title */}
              <div className="bg-gradient-to-r from-rose-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-xl font-bold">3D Preview Controls</h2>
                </div>
                <p className="text-white/80 text-sm">Điều khiển và xem trước cuốn sách của bạn</p>
              </div>

              {/* Group 1: Navigation */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-gray-900">Điều hướng trang</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Page Counter */}
                  <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Trang hiện tại</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                      {currentPage === 0 ? 'Bìa' : currentPage} / {totalPages}
                    </p>
                  </div>

                  {/* Prev/Next Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="PrevButton flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Prev</span>
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages - 1}
                      className="NextButton flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Group 2: View Mode */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Chế độ xem</h3>
                </div>
                
                {/* Segmented Control */}
                <div className="ModeSwitch p-1.5 bg-gray-100 rounded-xl mb-4">
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['showcase', 'flip', 'read'] as ViewMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          viewMode === mode
                            ? 'bg-white shadow-lg text-rose-600 scale-105'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {mode === 'showcase' && 'Showcase'}
                        {mode === 'flip' && 'Flip'}
                        {mode === 'read' && 'Read'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode Description */}
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200/50">
                  <p className="text-sm text-purple-800 leading-relaxed">
                    {cameraConfigs[viewMode].description}
                  </p>
                </div>
              </div>

              {/* Group 3: Camera Tools */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Camera Tools</h3>
                </div>
                
                <div className="space-y-3">
                  {/* Zoom Level Display */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Zoom Level</p>
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 text-sm font-bold rounded-lg">
                      {zoomLevel}%
                    </span>
                  </div>

                  {/* Zoom Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel === 100}
                      className="ZoomOut flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-medium text-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <ZoomOut className="w-4 h-4" />
                      <span>Zoom Out</span>
                    </button>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel === 150}
                      className="ZoomIn flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-medium text-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Zoom In</span>
                    </button>
                  </div>

                  {/* Reset View */}
                  <button
                    onClick={handleReset}
                    className="ResetView w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset View</span>
                  </button>

                  {/* Auto-rotate Toggle */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-700">Auto-rotate</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={autoRotate}
                        onChange={(e) => setAutoRotate(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-rose-500 peer-checked:to-pink-600"></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Group 4: Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50 space-y-3">
                <button 
                  onClick={onOrder}
                  className="PlaceOrder w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-90">Đặt in ngay</div>
                    <div className="text-lg">{(book.pageCount * 5000).toLocaleString('vi-VN')}đ</div>
                  </div>
                </button>

                <button
                  onClick={onBack}
                  className="BackToEditor w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại Editor</span>
                  </div>
                </button>
              </div>

              {/* Delivery Info */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
                <p className="text-sm text-green-800 text-center">
                  ⚡ <span className="font-bold">Miễn phí vận chuyển</span> • Giao hàng trong <span className="font-bold">3-7 ngày</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Book3DPreviewError>
  );
}
