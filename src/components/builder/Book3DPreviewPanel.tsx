import { useState } from 'react';
import { RotateCcw, Maximize2 } from 'lucide-react';
import { BookData } from '../../App';

interface Book3DPreviewPanelProps {
  book: BookData;
  className?: string;
}

export function Book3DPreviewPanel({ book, className = '' }: Book3DPreviewPanelProps) {
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`bg-white/80 backdrop-blur-sm p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Xem trước 3D</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setRotation(0)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              title="Reset góc nhìn"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              title="Toàn màn hình"
            >
              <Maximize2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 3D Preview (Placeholder) */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
          {/* Paper texture */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1711107759674-9161698e570d?w=400")',
              backgroundSize: 'cover',
            }}
          />

          {/* Book mockup */}
          <div
            className="relative"
            style={{
              transform: `rotateY(${rotation}deg) rotateX(-10deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s ease-out',
            }}
          >
            <div className="w-48 h-64 bg-white rounded-r-lg shadow-2xl relative">
              {/* Cover */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-400 to-amber-400 rounded-r-lg flex items-center justify-center p-6">
                <div className="text-center text-white">
                  <p className="text-sm font-bold">{book.title || 'Cuốn sách của tôi'}</p>
                  <p className="text-xs mt-2 opacity-90">{book.pages?.length || 0} trang</p>
                </div>
              </div>

              {/* Spine */}
              <div
                className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-b from-rose-500 to-amber-500"
                style={{
                  transform: 'translateX(-100%) rotateY(-90deg)',
                  transformOrigin: 'right',
                }}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-xs text-gray-600 bg-white/80 backdrop-blur-sm inline-block px-3 py-1 rounded-full">
              🖱️ Kéo để xoay
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Góc xoay</label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Info */}
        <div className="p-4 bg-gradient-to-br from-rose-50 to-amber-50 rounded-xl text-sm space-y-2">
          <p className="font-semibold text-gray-800">📚 Chi tiết sách</p>
          <div className="space-y-1 text-xs text-gray-700">
            <p>• Kích thước: 20×25cm</p>
            <p>• Số trang: {book.pages?.length || 0}</p>
            <p>• Chất liệu: Giấy cao cấp</p>
            <p>• Bìa: Cứng, bo góc</p>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-all"
          >
            ✕
          </button>

          <div className="max-w-4xl w-full aspect-square flex items-center justify-center">
            <div
              className="relative"
              style={{
                transform: `rotateY(${rotation}deg) rotateX(-10deg) scale(2)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.5s ease-out',
              }}
            >
              <div className="w-48 h-64 bg-white rounded-r-lg shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-400 to-amber-400 rounded-r-lg flex items-center justify-center p-6">
                  <div className="text-center text-white">
                    <p className="text-sm font-bold">{book.title || 'Cuốn sách của tôi'}</p>
                    <p className="text-xs mt-2 opacity-90">{book.pages?.length || 0} trang</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
