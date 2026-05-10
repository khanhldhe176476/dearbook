import { useState, Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber@8.18.0';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei@9.117.3';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, ShoppingCart,
  ZoomIn, ZoomOut, Eye, BookOpen, Menu, X, Sparkles
} from 'lucide-react';
import { MinimalBook } from './MinimalBook';
import { BookProject } from '../App';
import { Book3DPreviewError } from './Book3DPreviewError';
import { SceneLights } from './SceneLights';

interface Book3DPreviewMobileProps {
  book: BookProject;
  onBack: () => void;
  onOrder: () => void;
}

type ViewMode = 'showcase' | 'flip' | 'read';
type ZoomLevel = 100 | 125 | 150;

export function Book3DPreviewMobile({ book, onBack, onOrder }: Book3DPreviewMobileProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('showcase');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(100);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({ x: 1.2, y: 0.8, z: 2.5 });
  const [cameraTarget, setCameraTarget] = useState({ x: 0, y: 0, z: 0 });

  const totalPages = book.pages?.length || 0;
  const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  // Camera configurations for each view mode
  const cameraConfigs = {
    showcase: {
      position: { x: 1.2, y: 0.8, z: 2.5 },
      target: { x: 0, y: 0, z: 0 },
      fov: 50,
      description: 'Xoay 360°'
    },
    flip: {
      position: { x: 0, y: 1.2, z: 2.0 },
      target: { x: 0, y: 0, z: 0 },
      fov: 45,
      description: 'Góc lật trang'
    },
    read: {
      position: { x: 0, y: 0, z: 1.6 },
      target: { x: 0, y: 0, z: 0 },
      fov: 40,
      description: 'Đọc nội dung'
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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(0, prev - 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  const handleReset = () => {
    setCurrentPage(0);
    setViewMode('showcase');
    setZoomLevel(100);
    setAutoRotate(true);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => prev === 100 ? 125 : prev === 125 ? 150 : 150);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => prev === 150 ? 125 : prev === 125 ? 100 : 100);
  };

  // Memoize book data
  const bookData = useMemo(() => ({
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
  }), [book]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-purple-600 rounded-3xl animate-pulse opacity-50 blur-xl"></div>
            <div className="relative bg-gradient-to-br from-rose-500 to-purple-600 rounded-3xl w-full h-full flex items-center justify-center shadow-2xl animate-bounce">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          <p className="text-xl font-bold text-gray-900">Đang tạo 3D Preview...</p>
        </div>
      </div>
    );
  }

  return (
    <Book3DPreviewError onReset={() => {}}>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 flex flex-col">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <div className="text-center flex-1">
              <h1 className="font-bold text-gray-900">3D Preview</h1>
              <p className="text-xs text-gray-500">{book.title}</p>
            </div>

            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showControls ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Canvas Area - Full Screen */}
        <div className="flex-1 relative">
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-spin">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          }>
            <Canvas 
              shadows 
              dpr={[1, 2]}
              gl={{ 
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance'
              }}
              onCreated={(state) => {
                state.gl.setClearColor('#fafafa', 1);
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
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-lg text-sm font-semibold text-gray-900">
            {currentPage === 0 ? 'Bìa' : `Trang ${currentPage}`} / {totalPages}
          </div>

          {/* Zoom Badge */}
          {zoomLevel !== 100 && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-rose-500 text-white rounded-lg text-sm font-bold">
              {zoomLevel}%
            </div>
          )}

          {/* Tooltip */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/80 backdrop-blur-md rounded-lg text-white text-xs">
            Kéo để xoay • Chạm 2 ngón để zoom
          </div>
        </div>

        {/* Bottom Navigation - Always Visible */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Prev</span>
            </button>

            <button
              onClick={onOrder}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Đặt hàng</span>
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bottom Sheet Controls */}
        {showControls && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowControls(false)}
            ></div>

            {/* Bottom Sheet */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 animate-slide-up max-h-[70vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Handle */}
                <div className="flex justify-center">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                {/* Title */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-rose-600" />
                    <h2 className="text-lg font-bold text-gray-900">Controls</h2>
                  </div>
                  <p className="text-sm text-gray-600">Điều khiển 3D Preview</p>
                </div>

                {/* View Mode */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-600" />
                    Chế độ xem
                  </h3>
                  <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-xl">
                    {(['showcase', 'flip', 'read'] as ViewMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          viewMode === mode
                            ? 'bg-white shadow-lg text-rose-600 scale-105'
                            : 'text-gray-600'
                        }`}
                      >
                        {mode === 'showcase' && 'Showcase'}
                        {mode === 'flip' && 'Flip'}
                        {mode === 'read' && 'Read'}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-purple-700 bg-purple-50 p-2 rounded-lg">
                    {cameraConfigs[viewMode].description}
                  </p>
                </div>

                {/* Camera Tools */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      Camera Tools
                    </h3>
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 text-sm font-bold rounded-lg">
                      {zoomLevel}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel === 100}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl font-semibold text-gray-700"
                    >
                      <ZoomOut className="w-4 h-4" />
                      <span>Zoom Out</span>
                    </button>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel === 150}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl font-semibold text-gray-700"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Zoom In</span>
                    </button>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset View</span>
                  </button>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer mt-3">
                    <span className="text-sm font-medium text-gray-700">Auto-rotate</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={autoRotate}
                        onChange={(e) => setAutoRotate(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-rose-500 peer-checked:to-pink-600"></div>
                    </div>
                  </label>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <button 
                    onClick={onOrder}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-xl"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-xs opacity-90">Đặt in ngay</div>
                      <div className="text-lg">{(book.pageCount * 5000).toLocaleString('vi-VN')}đ</div>
                    </div>
                  </button>

                  <button
                    onClick={onBack}
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl"
                  >
                    Quay lại Editor
                  </button>
                </div>

                {/* Delivery Info */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200/50">
                  <p className="text-xs text-green-800 text-center">
                    ⚡ <span className="font-bold">Miễn phí ship</span> • Giao trong <span className="font-bold">3-7 ngày</span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Book3DPreviewError>
  );
}
