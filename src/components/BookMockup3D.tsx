import { useState, useEffect, useRef } from 'react';

interface BookMockup3DProps {
  coverImage: string;
  coverText?: string;
  rotation?: number;
  showBox?: boolean;
  variant: 'tier3-10pages' | 'tier3-18pages';
  autoFlipDelay?: number;
  pages?: Array<{ type: 'photo', url: string, caption?: string }>;
}

//  Timing constants 
const FLIP_DURATION  = 680;   // ms  duration of one flip direction
const CASCADE_STEP   = 50;    // ms  stagger between each page strip
const NUM_STRIPS     = 8;
const MAX_CASCADE    = (NUM_STRIPS - 1) * CASCADE_STEP; // 350 ms
// All pages reach 180 at:
const ALL_FORWARD_MS = FLIP_DURATION + MAX_CASCADE;     // 1030 ms
// Swap photo while page is face-down (midpoint of hold)
const PHOTO_SWAP_MS  = ALL_FORWARD_MS + 60;             // 1090 ms
// Start flip-back after a brief pause
const FLIP_BACK_MS   = ALL_FORWARD_MS + 220;            // 1250 ms
// All pages back to 0 at:
const CYCLE_DONE_MS  = FLIP_BACK_MS + FLIP_DURATION + MAX_CASCADE; // 2280 ms
// 

export function BookMockup3D({
  coverImage,
  coverText = 'nine month\nwith you',
  rotation = -15,
  showBox = true,
  variant = 'tier3-10pages',
  autoFlipDelay = 3500,
  pages = [],
}: BookMockup3DProps) {
  const [isFlipping, setIsFlipping]           = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // refs so timeouts always read the latest value, never stale
  const indexRef       = useRef(0);
  const t1Ref          = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2Ref          = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFlippingRef  = useRef(false);

  const effectiveDelay = Math.max(autoFlipDelay, CYCLE_DONE_MS + 600);

  useEffect(() => {
    if (pages.length <= 1) return;

    const interval = setInterval(() => {
      // Guard  don't start a new flip if previous hasn't finished
      if (isFlippingRef.current) return;

      isFlippingRef.current = true;
      setIsFlipping(true);

      //  swap photo while all pages are face-down 
      t1Ref.current = setTimeout(() => {
        const next = (indexRef.current + 1) % pages.length;
        indexRef.current = next;
        setCurrentPhotoIndex(next);
      }, PHOTO_SWAP_MS);

      //  start flip-back 
      t2Ref.current = setTimeout(() => {
        isFlippingRef.current = false;
        setIsFlipping(false);
      }, FLIP_BACK_MS);
    }, effectiveDelay);

    return () => {
      clearInterval(interval);
      if (t1Ref.current) clearTimeout(t1Ref.current);
      if (t2Ref.current) clearTimeout(t2Ref.current);
    };
  }, [pages.length, effectiveDelay]);

  const currentPage = pages[currentPhotoIndex] ?? null;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      <div className="relative">
        {/*  Book body  */}
        <div
          className="relative bg-white shadow-2xl"
          style={{
            width: '280px',
            height: '360px',
            transform: `rotateY(${rotation}deg) rotateX(5deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Cover */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={coverImage}
              alt="Book cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />
            {coverText && (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <h3 className="font-handwriting text-5xl text-white drop-shadow-2xl text-center whitespace-pre-line">
                  {coverText}
                </h3>
              </div>
            )}
          </div>

          {/* Spine (left edge) */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-gray-800 to-gray-700"
            style={{
              width: '30px',
              transform: 'rotateY(-90deg)',
              transformOrigin: 'left center',
            }}
          />

          {/* Page edge (right) */}
          <div
            className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-gray-100 to-white"
            style={{
              width: '30px',
              transform: 'rotateY(90deg)',
              transformOrigin: 'right center',
            }}
          >
            <div className="h-full flex flex-col">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="flex-1 border-b border-gray-200/50" />
              ))}
            </div>
          </div>

          {/*  Static background pages (depth stack)  */}
          {[...Array(12)].map((_, index) => (
            <div
              key={`static-${index}`}
              className="absolute right-0 top-0 bottom-0 pointer-events-none bg-white border-r border-gray-200"
              style={{
                width: '48px',
                transform: `translateX(${index * 1.5}px) translateZ(${-index * 0.5}px)`,
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                zIndex: -index - 1,
                boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                opacity: Math.max(0.3, 1 - index * 0.05),
              }}
            >
              <div className="h-full w-full bg-gradient-to-r from-gray-50 to-white" />
            </div>
          ))}

          {/*  Flipping page strips  */}
          {[...Array(NUM_STRIPS)].map((_, index) => {
            const cascadeDelay = index * CASCADE_STEP;

            return (
              <div
                key={`flip-${index}`}
                className="absolute right-0 top-0 bottom-0 pointer-events-none"
                style={{
                  width: `${50 - index * 3}px`,
                  //  preserve-3d is REQUIRED for backfaceVisibility to work on children
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'left center',
                  //  NO overflow:hidden here  it collapses the 3D stacking context
                  transform: `rotateY(${isFlipping ? 180 : 0}deg) translateZ(${index * 2}px)`,
                  //  Delay baked into the shorthand so both forward AND back are staggered
                  transition: `transform ${FLIP_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) ${cascadeDelay}ms`,
                  zIndex: 20 - index,
                }}
              >
                {/*  Front face (visible at 0)  */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: '#fff',
                    borderRight: '2px solid #d1d5db',
                    boxShadow: '4px 0 16px rgba(0,0,0,0.18)',
                  }}
                >
                  {currentPage && index === 0 ? (
                    /*  Scrapbook photo  Polaroid layout  */
                    <div className="relative h-full w-full p-2 bg-gradient-to-br from-pink-50 via-white to-amber-50">
                      {/* Washi tape top */}
                      <div
                        className="absolute w-full h-3 bg-pink-200/70 z-10"
                        style={{ top: '12%', left: 0, transform: 'rotate(-2deg)' }}
                      />
                      {/* Polaroid frame */}
                      <div
                        className="absolute bg-white shadow-xl p-2"
                        style={{
                          width: '88%',
                          height: '76%',
                          top: '8%',
                          left: '6%',
                          transform: 'rotate(-1.5deg)',
                        }}
                      >
                        <img
                          src={currentPage.url}
                          alt="Memory"
                          className="w-full object-cover"
                          style={{ height: '85%' }}
                        />
                        {currentPage.caption && (
                          <p className="text-[6px] text-center mt-1 font-handwriting text-gray-700 truncate">
                            {currentPage.caption}
                          </p>
                        )}
                      </div>
                      {/* Corner stickers */}
                      <div className="absolute bottom-3 right-2 w-3 h-3 bg-yellow-300/80 rotate-12 rounded-sm" />
                      <div className="absolute bottom-5 left-3 w-2 h-2 bg-rose-300/80 -rotate-6 rounded-sm" />
                    </div>
                  ) : (
                    /*  Plain page  */
                    <div
                      className="h-full w-full bg-gradient-to-r from-gray-100 to-white"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.025) 10px, rgba(0,0,0,0.025) 11px)',
                      }}
                    />
                  )}
                </div>

                {/*  Back face (visible at 180)  */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    //  Must be rotated 180 so it faces the viewer when parent is at 180
                    transform: 'rotateY(180deg)',
                    background: '#f3f4f6',
                    borderLeft: '2px solid #d1d5db',
                    boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
                  }}
                >
                  <div
                    className="h-full w-full bg-gradient-to-l from-gray-300 to-gray-100"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 11px)',
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/*  Page curl shadow overlay (only while flipping)  */}
          {isFlipping && (
            <div
              className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none"
              style={{
                background: 'linear-gradient(to left, rgba(0,0,0,0.22), transparent)',
                zIndex: 15,
                animation: 'curlShadow 1.4s ease-in-out forwards',
              }}
            />
          )}
        </div>

        {/*  Decorative tape  */}
        <div
          className="absolute -bottom-4 -right-6 w-24 h-12 bg-gradient-to-br from-amber-100 to-amber-200 shadow-md"
          style={{
            transform: 'rotate(15deg)',
            clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-30 h-full flex justify-around items-center">
            <div className="w-px h-full bg-red-300" />
            <div className="w-px h-full bg-red-300" />
            <div className="w-px h-full bg-red-300" />
          </div>
        </div>

        {/*  Kraft box  */}
        {showBox && (
          <div
            className="absolute -bottom-8 -right-12 w-28 h-16 bg-gradient-to-br from-amber-700 to-amber-800 shadow-xl rounded-sm"
            style={{
              transform: 'rotateY(-20deg) rotateX(45deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="absolute inset-0 opacity-20 grid grid-cols-4 grid-rows-4 w-full h-full">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="border border-amber-900/30" />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-8 bg-white/80 rounded shadow-sm flex items-center justify-center">
                <span className="text-[8px] text-amber-900 font-bold">DEAR BOOK</span>
              </div>
            </div>
          </div>
        )}

        {/*  Top tape  */}
        <div
          className="absolute -top-6 -left-4 w-20 h-10 bg-gradient-to-br from-pink-100 to-rose-200 shadow-md"
          style={{
            transform: 'rotate(-25deg)',
            clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-30 h-full flex justify-around items-center">
            <div className="w-px h-full bg-rose-300" />
            <div className="w-px h-full bg-rose-300" />
          </div>
        </div>
      </div>

      {/*  Global keyframes  */}
      <style>{`
        @keyframes curlShadow {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
