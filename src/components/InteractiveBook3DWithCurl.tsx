import { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, 
  X, Eye
} from 'lucide-react';
import { BookData } from '../App';

interface InteractiveBook3DWithCurlProps {
  book: BookData;
  onClose: () => void;
}

export function InteractiveBook3DWithCurl({ book, onClose }: InteractiveBook3DWithCurlProps) {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [zoom, setZoom] = useState(0.85);
  const [rotateY, setRotateY] = useState(-25);
  const [rotateX, setRotateX] = useState(-10);
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Page curl states
  const [isCurling, setIsCurling] = useState(false);
  const [curlAmount, setCurlAmount] = useState(0); // 0 to 1
  const [curlSide, setCurlSide] = useState<'left' | 'right' | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const curlStartX = useRef(0);

  const totalPages = (book.pages?.length || 0);
  const totalSpreads = Math.ceil(totalPages / 2);
  const spineThickness = Math.max(30, totalPages * 1.5);

  // Get pages for current spread
  const getSpreadPages = () => {
    const bookPages = book.pages || [];
    if (currentSpread === 0) {
      return {
        left: null,
        right: book.cover || { id: 'cover', backgroundColor: '#fff', elements: [] }
      };
    }
    
    const leftIndex = (currentSpread - 1) * 2;
    const rightIndex = leftIndex + 1;
    
    return {
      left: bookPages[leftIndex] || null,
      right: bookPages[rightIndex] || null
    };
  };

  const { left, right } = getSpreadPages();

  // Check if mouse is near page corner
  const isNearCorner = (e: React.MouseEvent, side: 'left' | 'right'): boolean => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cornerSize = 80; // Detection area
    
    if (side === 'right') {
      // Bottom-right corner
      return x > rect.width - cornerSize && y > rect.height - cornerSize;
    } else {
      // Bottom-left corner
      return x < cornerSize && y > rect.height - cornerSize;
    }
  };

  const handlePageMouseMove = (e: React.MouseEvent, side: 'left' | 'right') => {
    if (isCurling && curlSide === side) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePos({ x, y });
      
      // Calculate curl amount based on drag distance
      if (side === 'right') {
        const dragDistance = curlStartX.current - x;
        const maxDrag = rect.width * 0.8;
        const amount = Math.max(0, Math.min(1, dragDistance / maxDrag));
        setCurlAmount(amount);
      } else {
        const dragDistance = x - curlStartX.current;
        const maxDrag = rect.width * 0.8;
        const amount = Math.max(0, Math.min(1, dragDistance / maxDrag));
        setCurlAmount(amount);
      }
    }
  };

  const handlePageMouseDown = (e: React.MouseEvent, side: 'left' | 'right') => {
    if (isNearCorner(e, side) && !isFlipping) {
      e.stopPropagation();
      setIsCurling(true);
      setCurlSide(side);
      setCurlAmount(0);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      curlStartX.current = e.clientX - rect.left;
    }
  };

  const handlePageMouseUp = () => {
    if (isCurling) {
      // If curl amount > 50%, complete the flip
      if (curlAmount > 0.5) {
        setIsFlipping(true);
        setTimeout(() => {
          if (curlSide === 'right' && currentSpread < totalSpreads) {
            setCurrentSpread(prev => prev + 1);
          } else if (curlSide === 'left' && currentSpread > 0) {
            setCurrentSpread(prev => prev - 1);
          }
          setIsFlipping(false);
          setIsCurling(false);
          setCurlAmount(0);
          setCurlSide(null);
        }, 300);
      } else {
        // Snap back
        setIsCurling(false);
        setCurlAmount(0);
        setCurlSide(null);
      }
    }
  };

  const handleNext = () => {
    if (currentSpread < totalSpreads && !isFlipping && !isCurling) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const handlePrev = () => {
    if (currentSpread > 0 && !isFlipping && !isCurling) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const handleBookMouseDown = (e: React.MouseEvent) => {
    if (!isCurling) {
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
    }
  };

  const handleBookMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current && !isCurling) {
      const deltaX = e.clientX - lastMouseX.current;
      const deltaY = e.clientY - lastMouseY.current;
      
      setRotateY(prev => Math.max(-60, Math.min(60, prev + deltaX * 0.3)));
      setRotateX(prev => Math.max(-30, Math.min(10, prev - deltaY * 0.2)));
      
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    handlePageMouseUp();
  };

  const handleZoomIn = () => setZoom(prev => Math.min(1.2, prev + 0.1));
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.1));
  const handleReset = () => {
    setZoom(0.85);
    setRotateY(-25);
    setRotateX(-10);
  };

  // Calculate page curl transform
  const getPageCurlStyle = (side: 'left' | 'right') => {
    if (!isCurling || curlSide !== side || curlAmount === 0) {
      return {};
    }

    const angle = curlAmount * 180;
    
    if (side === 'right') {
      return {
        transform: `rotateY(${angle}deg)`,
        transformOrigin: 'left center'
      };
    } else {
      return {
        transform: `rotateY(-${angle}deg)`,
        transformOrigin: 'right center'
      };
    }
  };

  const getCursorStyle = (e: React.MouseEvent, side: 'left' | 'right') => {
    if (isCurling && curlSide === side) return 'grabbing';
    if (isNearCorner(e, side)) return 'grab';
    return 'default';
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 overflow-hidden"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Eye className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">{book.title || 'My Book'}</h2>
              <p className="text-sm text-gray-300">
                {currentSpread === 0 ? 'Cover' : `Pages ${(currentSpread - 1) * 2 + 1}${Math.min((currentSpread - 1) * 2 + 2, totalPages)}`}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D Book Scene */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center pt-20 pb-24"
        onMouseDown={handleBookMouseDown}
        onMouseMove={handleBookMouseMove}
        style={{
          perspective: '2500px',
          cursor: isDragging.current ? 'grabbing' : 'grab'
        }}
      >
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: `
              rotateX(${rotateX}deg)
              rotateY(${rotateY}deg)
              scale(${zoom})
            `,
            transformStyle: 'preserve-3d',
            width: '700px',
            height: '900px'
          }}
        >
          {/* Book Container */}
          <div
            className="relative"
            style={{
              transformStyle: 'preserve-3d',
              width: '700px',
              height: '900px'
            }}
          >
            {/* Spine */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 shadow-2xl"
              style={{
                width: `${spineThickness}px`,
                height: '900px',
                transform: `translateZ(-${spineThickness / 2}px)`,
                borderRadius: '6px 0 0 6px',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
              }}
            >
              <div className="h-full flex items-center justify-center px-2">
                <p className="text-white font-bold text-base" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                  {book.title || 'UNTITLED'}
                </p>
              </div>
            </div>

            {/* Left Page with Curl */}
            {left && (
              <div
                className="absolute top-0 left-0 bg-white shadow-2xl transition-all"
                style={{
                  width: '350px',
                  height: '900px',
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'right center',
                  borderRadius: '0 6px 6px 0',
                  boxShadow: '5px 5px 30px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  transitionDuration: isCurling ? '0ms' : '600ms',
                  ...getPageCurlStyle('left')
                }}
                onMouseMove={(e) => handlePageMouseMove(e, 'left')}
                onMouseDown={(e) => handlePageMouseDown(e, 'left')}
              >
                <PageRenderer page={left} />
                
                {/* Curl corner indicator */}
                {!isCurling && currentSpread > 0 && (
                  <div 
                    className="absolute bottom-0 left-0 w-20 h-20 cursor-grab group"
                    style={{
                      background: 'linear-gradient(135deg, transparent 0%, transparent 40%, rgba(0,0,0,0.05) 100%)',
                      pointerEvents: 'all'
                    }}
                  >
                    <div className="absolute bottom-2 left-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right Page with Curl */}
            {right && (
              <div
                className="absolute top-0 right-0 bg-white shadow-2xl transition-all"
                style={{
                  width: '350px',
                  height: '900px',
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'left center',
                  borderRadius: '6px 0 0 6px',
                  boxShadow: '-5px 5px 30px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  transitionDuration: isCurling ? '0ms' : '600ms',
                  ...getPageCurlStyle('right')
                }}
                onMouseMove={(e) => handlePageMouseMove(e, 'right')}
                onMouseDown={(e) => handlePageMouseDown(e, 'right')}
              >
                <PageRenderer page={right} />
                
                {/* Curl corner indicator */}
                {!isCurling && currentSpread < totalSpreads && (
                  <div 
                    className="absolute bottom-0 right-0 w-20 h-20 cursor-grab group"
                    style={{
                      background: 'linear-gradient(225deg, transparent 0%, transparent 40%, rgba(0,0,0,0.05) 100%)',
                      pointerEvents: 'all'
                    }}
                  >
                    <div className="absolute bottom-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Center Shadow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10"
              style={{
                width: '4px',
                height: '900px',
                background: 'linear-gradient(to right, rgba(0,0,0,0.2), transparent, rgba(0,0,0,0.2))',
                filter: 'blur(2px)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10">
        <button
          onClick={handlePrev}
          disabled={currentSpread === 0 || isFlipping || isCurling}
          className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="px-4 min-w-[100px] text-center">
          <p className="text-white font-bold">{currentSpread} / {totalSpreads}</p>
          <p className="text-xs text-gray-300">spreads</p>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSpread >= totalSpreads || isFlipping || isCurling}
          className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Right Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl hover:bg-black/50 flex items-center justify-center text-white transition-all border border-white/10"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl hover:bg-black/50 flex items-center justify-center text-white transition-all border border-white/10"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl hover:bg-black/50 flex items-center justify-center text-white transition-all border border-white/10"
          title="Reset View"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-xl rounded-2xl px-4 py-3 text-white text-sm border border-white/10">
        <p className="font-semibold mb-1"> Controls</p>
        <p className="text-xs text-gray-300"> Drag to rotate book</p>
        <p className="text-xs text-gray-300"> Drag page corner to flip</p>
        <p className="text-xs text-gray-300"> Arrows for quick flip</p>
      </div>
    </div>
  );
}

// Page Renderer Component
function PageRenderer({ page }: { page: any }) {
  if (!page) return null;

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        backgroundColor: page.backgroundColor || '#ffffff'
      }}
    >
      {/* Background Image */}
      {page.backgroundImage && (
        <img
          src={page.backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Elements */}
      <div className="relative w-full h-full p-6">
        {page.elements?.map((el: any, idx: number) => (
          <div
            key={el.id || idx}
            className="absolute"
            style={{
              left: `${el.x}px`,
              top: `${el.y}px`,
              width: `${el.width}px`,
              height: `${el.height}px`,
              transform: `rotate(${el.rotation || 0}deg)`,
              opacity: el.opacity || 1,
              zIndex: el.zIndex || idx
            }}
          >
            {el.type === 'text' && (
              <div
                style={{
                  fontFamily: el.fontFamily || 'Poppins',
                  fontSize: `${el.fontSize || 16}px`,
                  color: el.color || '#000',
                  fontWeight: el.fontWeight || 'normal',
                  fontStyle: el.fontStyle || 'normal',
                  textAlign: (el.textAlign || 'left') as any,
                  textDecoration: el.textDecoration || 'none',
                  lineHeight: el.lineHeight || 1.5,
                  textShadow: el.textShadow
                }}
                className="w-full h-full overflow-hidden"
              >
                {el.content}
              </div>
            )}

            {el.type === 'image' && el.src && (
              <img
                src={el.src}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                style={{
                  objectFit: el.objectFit || 'cover',
                  borderRadius: `${el.borderRadius || 0}px`,
                  filter: el.filter
                }}
              />
            )}

            {el.type === 'shape' && (
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: el.fill,
                  borderRadius: `${el.borderRadius || 0}px`,
                  border: el.stroke ? `${el.strokeWidth || 1}px solid ${el.stroke}` : 'none'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
