import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { BookData } from '../App';
import { motion, AnimatePresence } from 'motion/react';

interface Book3DViewerProps {
  book: BookData;
  onClose: () => void;
}

export function Book3DViewer({ book, onClose }: Book3DViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward' | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotateY, setRotateY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const totalPages = book.pages?.length || 0;
  const pageThickness = Math.max(20, totalPages * 2); // Book spine thickness

  const handleNextPage = () => {
    if (currentPage < totalPages && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('forward');
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 800);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('backward');
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 800);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setRotateY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      const deltaX = e.clientX - startX.current;
      setRotateY(prev => prev + deltaX * 0.2);
      startX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Get current page data
  const getCurrentPageData = () => {
    if (currentPage === 0) {
      return { left: null, right: book.cover };
    } else if (currentPage > 0 && currentPage <= totalPages) {
      const leftPageIndex = (currentPage - 1) * 2;
      const rightPageIndex = leftPageIndex + 1;
      return {
        left: book.pages?.[leftPageIndex] || null,
        right: book.pages?.[rightPageIndex] || null
      };
    }
    return { left: null, right: null };
  };

  const { left, right } = getCurrentPageData();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 overflow-hidden">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-all"
      >
        <Maximize2 className="w-6 h-6" />
      </button>

      {/* 3D Book Container */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center perspective-[2000px]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
      >
        <div
          className="relative preserve-3d transition-transform duration-300"
          style={{
            transform: `
              rotateY(${rotateY}deg)
              rotateX(-15deg)
              scale(${zoom})
            `,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Book */}
          <div
            className="relative preserve-3d"
            style={{
              width: '600px',
              height: '800px',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Book Spine (back) */}
            <div
              className="absolute top-0 left-1/2 bg-gradient-to-r from-gray-700 to-gray-600 shadow-2xl"
              style={{
                width: `${pageThickness}px`,
                height: '800px',
                transform: `translateX(-50%) translateZ(-${pageThickness / 2}px)`,
                borderRadius: '4px 0 0 4px'
              }}
            >
              <div className="h-full flex items-center justify-center">
                <p
                  className="text-white font-bold text-sm writing-vertical-rl rotate-180 px-2"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {book.title || 'My Book'}
                </p>
              </div>
            </div>

            {/* Left Page */}
            <AnimatePresence mode="wait">
              {left && (
                <motion.div
                  key={`left-${currentPage}`}
                  initial={{ rotateY: flipDirection === 'backward' ? -180 : 0 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: flipDirection === 'forward' ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="absolute top-0 left-0 bg-white shadow-2xl overflow-hidden"
                  style={{
                    width: '300px',
                    height: '800px',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'right center',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <PageContent page={left} side="left" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Page */}
            <AnimatePresence mode="wait">
              {right && (
                <motion.div
                  key={`right-${currentPage}`}
                  initial={{ rotateY: flipDirection === 'forward' ? 180 : 0 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: flipDirection === 'backward' ? -180 : 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="absolute top-0 right-0 bg-white shadow-2xl overflow-hidden"
                  style={{
                    width: '300px',
                    height: '800px',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'left center',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <PageContent page={right} side="right" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Page shadow effect */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: '2px',
                height: '800px',
                background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)',
                zIndex: 10
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0 || isFlipping}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="px-4 text-white font-semibold">
          {currentPage} / {totalPages}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || isFlipping}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Zoom & View Controls */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-6 h-6" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-6 h-6" />
        </button>
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-all"
          title="Reset View"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Page indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 text-white text-sm">
        {currentPage === 0 ? 'Cover' : `Page ${currentPage * 2 - 1}–${currentPage * 2}`}
      </div>
    </div>
  );
}

// Page Content Renderer
interface PageContentProps {
  page: any;
  side: 'left' | 'right';
}

function PageContent({ page, side }: PageContentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !page) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300 * 2; // Higher resolution
    canvas.height = 800 * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.fillStyle = page.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, 300, 800);

    // Render background image if exists
    if (page.backgroundImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 300, 800);
        renderElements();
      };
      img.src = page.backgroundImage;
    } else {
      renderElements();
    }

    function renderElements() {
      if (!ctx || !page.elements) return;

      page.elements.forEach((el: any) => {
        ctx.save();

        if (el.type === 'text') {
          // Render text
          ctx.fillStyle = el.color || '#000000';
          ctx.font = `${el.fontWeight || 'normal'} ${el.fontSize || 16}px ${el.fontFamily || 'Arial'}`;
          ctx.textAlign = (el.textAlign || 'left') as CanvasTextAlign;

          const lines = wrapText(ctx, el.content || '', el.width - 20);
          lines.forEach((line: string, i: number) => {
            ctx.fillText(
              line,
              el.x + (el.textAlign === 'center' ? el.width / 2 : 10),
              el.y + 30 + i * (el.fontSize + 10)
            );
          });
        } else if (el.type === 'image' && el.src) {
          // Render image
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.drawImage(img, el.x, el.y, el.width, el.height);
          };
          img.src = el.src;
        }

        ctx.restore();
      });
    }

    function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }
  }, [page]);

  if (!page) return null;

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '300px', height: '800px' }}
      />
    </div>
  );
}
