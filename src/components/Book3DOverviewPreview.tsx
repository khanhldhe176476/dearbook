import React, { useState, useRef, useEffect } from 'react';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Home, 
  BookOpen, 
  FileText, 
  Maximize2,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Add CSS animation keyframes
const styleTag = typeof document !== 'undefined' && (() => {
  const existingStyle = document.getElementById('book-3d-animations');
  if (existingStyle) return null;
  
  const style = document.createElement('style');
  style.id = 'book-3d-animations';
  style.textContent = `
    @keyframes bookShowcase {
      0% {
        transform: rotateX(-12deg) rotateY(30deg) scale(0.6);
        opacity: 0;
        filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
      }
      50% {
        transform: rotateX(-18deg) rotateY(45deg) scale(0.9);
        opacity: 1;
      }
      100% {
        transform: rotateX(-12deg) rotateY(30deg) scale(0.85);
        opacity: 1;
        filter: drop-shadow(0 40px 80px rgba(0,0,0,0.25)) drop-shadow(0 20px 40px rgba(0,0,0,0.15));
      }
    }
  `;
  document.head.appendChild(style);
  return style;
})();

type ViewMode = 'overview' | 'flip' | 'read';

interface Book3DOverviewPreviewProps {
  bookData?: {
    title?: string;
    theme?: string;
    coverColor?: string;
    coverPage?: any;
    pages?: any[];
  };
  onClose?: () => void;
}

// Realistic 3D Book Component with prominent spine
function RealisticBook({ 
  viewMode, 
  title = "My Book",
  coverColor = "#f9a8d4",
  theme = "love",
  coverPage,
  rotation,
  scale,
  currentPageIndex,
  pages = [],
  isFlipping,
  flipDirection,
  isInitialLoad = false
}: { 
  viewMode: ViewMode;
  title?: string;
  coverColor?: string;
  theme?: string;
  coverPage?: any;
  rotation: { x: number; y: number };
  scale: number;
  currentPageIndex: number;
  pages?: any[];
  isFlipping: boolean;
  flipDirection: 'next' | 'prev' | null;
  isInitialLoad?: boolean;
}) {
  // Theme colors
  const themeColors: Record<string, string> = {
    love: "#f9a8d4",
    family: "#a78bfa",
    birthday: "#fbbf24",
    friendship: "#6ee7b7"
  };

  const mainColor = themeColors[theme] || coverColor;
  
  // Calculate darker shades
  const darkenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  };

  const spineColor = darkenColor(mainColor, 25);
  const backColor = darkenColor(mainColor, 10);

  // Realistic book dimensions (THICK BOOK for substantial presence)
  const bookWidth = 350;
  const bookHeight = 480;
  const pageThickness = 0.6; // INCREASED for chunky book appearance
  const totalPages = pages.length || 100;
  const bookDepth = Math.max(80, Math.min(140, totalPages * pageThickness)); // INCREASED from 60-100 to 80-140

  // View mode specific transforms
  const getViewTransform = () => {
    switch (viewMode) {
      case 'overview':
        return `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
      case 'flip':
        return `rotateX(-25deg) rotateY(0deg)`;
      case 'read':
        return 'none';
      default:
        return `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    }
  };

  // Render cover content - Beautiful book cover design
  const renderCoverContent = (scaleFactor: number = 0.85) => {
    const hasElements = coverPage && coverPage.elements && coverPage.elements.length > 0;
    
    // If user has custom cover page with elements, render those instead
    if (hasElements) {
      return (
        <div style={{ 
          position: 'absolute',
          inset: 0,
          padding: '2rem',
          overflow: 'hidden',
          zIndex: 10
        }}>
          {coverPage.elements.map((element: any, idx: number) => (
            <div
              key={element.id || idx}
              style={{
                position: 'absolute',
                left: `${element.x * scaleFactor}px`,
                top: `${element.y * scaleFactor}px`,
                width: element.width ? `${element.width * scaleFactor}px` : 'auto',
                height: element.height ? `${element.height * scaleFactor}px` : 'auto',
                fontSize: element.fontSize ? `${element.fontSize * scaleFactor}px` : undefined,
                fontFamily: element.fontFamily || "'Poppins', sans-serif",
                fontWeight: element.fontWeight,
                fontStyle: element.fontStyle,
                color: element.color || '#fff',
                textAlign: element.textAlign as any,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))'
              }}
            >
              {element.type === 'text' && element.content}
              {element.type === 'sticker' && element.content}
              {element.type === 'image' && element.src && (
                <img 
                  src={element.src} 
                  alt="" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    border: '3px solid rgba(255,255,255,0.3)'
                  }} 
                />
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // Default elegant cover design if no custom elements
    return (
      <div style={{ 
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        padding: '3rem 2.5rem'
      }}>
        {/* Decorative corner ornaments */}
        <div style={{
          position: 'absolute',
          top: '2.5rem',
          left: '2.5rem',
          width: '50px',
          height: '50px',
          borderTop: '2px solid rgba(255,255,255,0.4)',
          borderLeft: '2px solid rgba(255,255,255,0.4)',
          borderRadius: '6px 0 0 0'
        }} />
        <div style={{
          position: 'absolute',
          top: '2.5rem',
          right: '2.5rem',
          width: '50px',
          height: '50px',
          borderTop: '2px solid rgba(255,255,255,0.4)',
          borderRight: '2px solid rgba(255,255,255,0.4)',
          borderRadius: '0 6px 0 0'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '2.5rem',
          width: '50px',
          height: '50px',
          borderBottom: '2px solid rgba(255,255,255,0.4)',
          borderLeft: '2px solid rgba(255,255,255,0.4)',
          borderRadius: '0 0 0 6px'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2.5rem',
          width: '50px',
          height: '50px',
          borderBottom: '2px solid rgba(255,255,255,0.4)',
          borderRight: '2px solid rgba(255,255,255,0.4)',
          borderRadius: '0 0 6px 0'
        }} />
        
        {/* Top ornament */}
        <div style={{
          fontSize: '2.5rem',
          marginBottom: '2rem',
          color: 'rgba(255,255,255,0.9)',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}>
          ✦
        </div>

        {/* Main Title */}
        <div style={{ 
          fontSize: '3rem', 
          textAlign: 'center', 
          textShadow: '0 6px 20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
          fontFamily: "'Dancing Script', cursive",
          fontWeight: 700,
          letterSpacing: '2px',
          lineHeight: 1.2,
          marginBottom: '2rem',
          color: 'white',
          maxWidth: '90%'
        }}>
          {title}
        </div>
        
        {/* Decorative divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
          }} />
          <div style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.8)'
          }}>
            ❖
          </div>
          <div style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
          }} />
        </div>

        {/* Theme indicator with icon */}
        <div style={{
          fontSize: '1.1rem',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500,
          letterSpacing: '2px',
          color: 'rgba(255,255,255,0.9)',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          marginBottom: '2.5rem'
        }}>
          {theme === 'love' && '💝'}
          {theme === 'family' && '👨‍👩‍👧‍👦'}
          {theme === 'birthday' && '🎂'}
          {theme === 'friendship' && '🤝'}
        </div>
        
        {/* Bottom ornament */}
        <div style={{
          fontSize: '2rem',
          marginTop: 'auto',
          color: 'rgba(255,255,255,0.9)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          marginBottom: '1.5rem'
        }}>
          ✦
        </div>

        {/* DearBook brand */}
        <div style={{ 
          fontSize: '0.75rem', 
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          color: 'rgba(255,255,255,0.8)',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.25)',
          width: '120px',
          textAlign: 'center'
        }}>
          DEARMEMORIES
        </div>
      </div>
    );
  };

  // Helper to format page label
  const getPageLabel = (pageIndex: number) => {
    if (pageIndex === 0) return 'Bìa trước';
    if (pageIndex === totalPages - 1) return 'Bìa sau';
    return `${pageIndex}`;
  };

  // Render page content with proper scaling
  const renderPageContent = (page: any, pageNumber: number, isFront: boolean = true, scaleFactor: number = 0.8) => {
    if (!page) return null;
    
    const pageLabel = getPageLabel(pageNumber - 1);
    
    return (
      <div className="absolute inset-0 p-8 overflow-hidden" style={{ 
        backgroundColor: page.backgroundColor || '#fefefe',
        backgroundImage: page.backgroundImage ? `url(${page.backgroundImage})` : 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: isFront ? 'none' : 'rotateY(180deg)'
      }}>
        {page.elements?.map((element: any, idx: number) => (
          <div
            key={element.id || idx}
            style={{
              position: 'absolute',
              left: `${element.x * scaleFactor}px`,
              top: `${element.y * scaleFactor}px`,
              width: element.width ? `${element.width * scaleFactor}px` : 'auto',
              height: element.height ? `${element.height * scaleFactor}px` : 'auto',
              fontSize: element.fontSize ? `${element.fontSize * scaleFactor}px` : undefined,
              fontFamily: element.fontFamily || "'Poppins', sans-serif",
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              color: element.color || '#333',
              textAlign: element.textAlign as any,
            }}
          >
            {element.type === 'text' && element.content}
            {element.type === 'sticker' && element.content}
            {element.type === 'image' && element.content && (
              <img src={element.content} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
            )}
          </div>
        ))}
        
        {/* Page number */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '11px',
          color: '#999',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500
        }}>
          {pageLabel}
        </div>
        
        {/* Paper texture overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.01) 2px,
            rgba(0,0,0,0.01) 4px
          )`,
          pointerEvents: 'none',
          opacity: 0.4
        }} />
      </div>
    );
  };

  // READ MODE - Full page view
  if (viewMode === 'read') {
    const currentPage = pages[currentPageIndex];
    
    return (
      <div 
        className="book-scene"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
        }}
      >
        <div
          className="read-page-container"
          style={{
            width: '700px',
            height: '960px',
            position: 'relative',
            transform: `scale(${scale})`,
            transition: 'transform 0.3s ease',
            boxShadow: '0 20px 80px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: currentPage?.backgroundColor || '#ffffff',
            backgroundImage: currentPage?.backgroundImage ? `url(${currentPage.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Page content with full scale */}
          <div className="absolute inset-0 p-16 overflow-hidden">
            {currentPage?.elements?.map((element: any, idx: number) => (
              <div
                key={element.id || idx}
                style={{
                  position: 'absolute',
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: element.width ? `${element.width}px` : 'auto',
                  height: element.height ? `${element.height}px` : 'auto',
                  fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                  fontFamily: element.fontFamily || "'Poppins', sans-serif",
                  fontWeight: element.fontWeight,
                  fontStyle: element.fontStyle,
                  color: element.color || '#333',
                  textAlign: element.textAlign as any,
                  lineHeight: 1.6
                }}
              >
                {element.type === 'text' && element.content}
                {element.type === 'sticker' && (
                  <span style={{ fontSize: element.fontSize || '48px' }}>
                    {element.content}
                  </span>
                )}
                {element.type === 'image' && element.content && (
                  <img 
                    src={element.content} 
                    alt="" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                )}
              </div>
            ))}
            
            {/* Page number */}
            <div style={{
              position: 'absolute',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '14px',
              color: '#999',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>
              {currentPageIndex === 0 ? 'Bìa trước' : 
               currentPageIndex === totalPages - 1 ? 'Bìa sau' : 
               `Trang ${currentPageIndex} / ${totalPages - 2}`}
            </div>
          </div>

          {/* Paper texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.005) 2px,
              rgba(0,0,0,0.005) 4px
            )`,
            pointerEvents: 'none',
            opacity: 0.3
          }} />

          {/* Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.03) 100%)',
            pointerEvents: 'none'
          }} />
        </div>
      </div>
    );
  }
  
  if (viewMode === 'flip') {
    // Open book with realistic page flip
    const pagesOnLeft = currentPageIndex;
    const pagesOnRight = totalPages - currentPageIndex;

    return (
      <div 
        className="book-scene"
        style={{
          perspective: '4000px', // INCREASED from 2500px to reduce distortion
          perspectiveOrigin: '50% 50%',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          className="open-book-container"
          style={{
            width: bookWidth * 2 + bookDepth,
            height: bookHeight,
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `${getViewTransform()} scale(${scale})`,
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Left Page Stack */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: bookWidth,
              height: bookHeight,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Stack effect */}
            {Array.from({ length: Math.min(pagesOnLeft, 20) }).map((_, i) => {
              const depth = -(i * 0.5);
              const offsetX = i * 0.3;
              return (
                <div
                  key={`left-stack-${i}`}
                  style={{
                    position: 'absolute',
                    width: bookWidth,
                    height: bookHeight,
                    background: 'linear-gradient(90deg, #f8f8f8 0%, #ffffff 100%)',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px 0 0 12px',
                    transform: `translateZ(${depth}px) translateX(${-offsetX}px) rotateY(-1deg)`,
                    boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.08)',
                  }}
                />
              );
            })}

            {/* Current left page */}
            {currentPageIndex > 0 && (
              <div
                style={{
                  position: 'absolute',
                  width: bookWidth,
                  height: bookHeight,
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(1px) rotateY(-1deg)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px 0 0 12px',
                    boxShadow: `
                      inset -8px 0 20px -10px rgba(0,0,0,0.15),
                      -3px 0 8px rgba(0,0,0,0.08),
                      0 8px 40px rgba(0,0,0,0.12)
                    `,
                    overflow: 'hidden',
                    background: 'linear-gradient(90deg, #ffffff 0%, #ffffff 85%, #f5f5f5 100%)',
                  }}
                >
                  {renderPageContent(pages[currentPageIndex - 1], currentPageIndex)}
                </div>
              </div>
            )}
          </div>

          {/* Right Page Stack */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: bookWidth,
              height: bookHeight,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Stack effect */}
            {Array.from({ length: Math.min(pagesOnRight, 20) }).map((_, i) => {
              const depth = -(i * 0.5);
              const offsetX = i * 0.3;
              return (
                <div
                  key={`right-stack-${i}`}
                  style={{
                    position: 'absolute',
                    width: bookWidth,
                    height: bookHeight,
                    background: 'linear-gradient(90deg, #ffffff 0%, #f8f8f8 100%)',
                    border: '1px solid #e0e0e0',
                    borderRadius: '0 12px 12px 0',
                    transform: `translateZ(${depth}px) translateX(${offsetX}px) rotateY(1deg)`,
                    boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.08)',
                  }}
                />
              );
            })}

            {/* Current right page */}
            {currentPageIndex < pages.length && (
              <div
                style={{
                  position: 'absolute',
                  width: bookWidth,
                  height: bookHeight,
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(1px) rotateY(1deg)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '0 12px 12px 0',
                    boxShadow: `
                      inset 8px 0 20px -10px rgba(0,0,0,0.15),
                      3px 0 8px rgba(0,0,0,0.08),
                      0 8px 40px rgba(0,0,0,0.12)
                    `,
                    overflow: 'hidden',
                    background: 'linear-gradient(90deg, #f5f5f5 0%, #ffffff 15%, #ffffff 100%)',
                  }}
                >
                  {renderPageContent(pages[currentPageIndex], currentPageIndex + 1)}
                </div>
              </div>
            )}
          </div>

          {/* Flipping Animation */}
          {isFlipping && flipDirection && (
            <div
              style={{
                position: 'absolute',
                right: flipDirection === 'next' ? 0 : 'auto',
                left: flipDirection === 'prev' ? bookWidth : 'auto',
                top: 0,
                width: bookWidth,
                height: bookHeight,
                transformStyle: 'preserve-3d',
                transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                transform: `translateZ(2px) rotateY(${flipDirection === 'next' ? '180deg' : '-180deg'})`,
                transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 100,
              }}
            >
              {/* Front */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: '#ffffff',
                  border: '1px solid #d0d0d0',
                  borderRadius: flipDirection === 'next' ? '0 12px 12px 0' : '12px 0 0 12px',
                  boxShadow: `0 0 30px rgba(0,0,0,0.3)`,
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                }}
              >
                {flipDirection === 'next' && renderPageContent(pages[currentPageIndex - 1], currentPageIndex, true)}
                {flipDirection === 'prev' && renderPageContent(pages[currentPageIndex], currentPageIndex + 1, true)}
              </div>

              {/* Back */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: '#ffffff',
                  border: '1px solid #d0d0d0',
                  borderRadius: flipDirection === 'next' ? '12px 0 0 12px' : '0 12px 12px 0',
                  boxShadow: `0 0 30px rgba(0,0,0,0.3)`,
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                {flipDirection === 'next' && currentPageIndex >= 0 && pages[currentPageIndex - 1] && renderPageContent(pages[currentPageIndex - 2] || {}, currentPageIndex - 1, false)}
                {flipDirection === 'prev' && renderPageContent(pages[currentPageIndex + 1] || {}, currentPageIndex + 2, false)}
              </div>
            </div>
          )}

          {/* Center binding shadow */}
          <div style={{
            position: 'absolute',
            left: bookWidth,
            top: '5%',
            bottom: '5%',
            width: '30px',
            transform: 'translateX(-15px)',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 50,
            filter: 'blur(8px)'
          }} />

          {/* Spine visible when open */}
          <div style={{
            position: 'absolute',
            left: bookWidth,
            top: '3%',
            bottom: '3%',
            width: bookDepth,
            transform: `translateX(-${bookDepth/2}px) translateZ(-5px)`,
            background: `linear-gradient(180deg, ${darkenColor(mainColor, 35)} 0%, ${darkenColor(mainColor, 25)} 50%, ${darkenColor(mainColor, 35)} 100%)`,
            borderRadius: '3px',
            boxShadow: 'inset 0 0 25px rgba(0,0,0,0.5)',
            zIndex: 5
          }}>
            {/* Spine texture lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${(i + 1) * 11}%`,
                  height: '1px',
                  background: 'rgba(0,0,0,0.2)',
                }}
              />
            ))}
          </div>

          {/* Shadow */}
          <div style={{
            position: 'absolute',
            left: '5%',
            right: '5%',
            bottom: '-120px',
            height: '80px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
            transform: 'rotateX(90deg) translateZ(-100px)',
            pointerEvents: 'none'
          }} />
        </div>
      </div>
    );
  }

  // OVERVIEW MODE - PHOTOREALISTIC Closed book with PROMINENT SPINE
  return (
    <div 
      className="book-scene"
      style={{
        perspective: '4500px', // INCREASED from 3000px to reduce distortion
        perspectiveOrigin: '50% 50%',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 50%, #e8e8e8 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Soft ambient lighting overlay */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      {/* Reflection plane (like product photography) */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        right: '10%',
        height: '200px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.5) 100%)',
        transform: 'rotateX(90deg) translateZ(-200px)',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6
      }} />
      <div
        className="book-container"
        style={{
          width: bookWidth,
          height: bookHeight,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `${getViewTransform()} scale(${scale})`,
          transition: isInitialLoad 
            ? 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1), filter 1s ease-out' 
            : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.25)) drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
          animation: isInitialLoad ? 'bookShowcase 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
        }}
      >
        {/* Ambient Occlusion Shadow - Ground contact */}
        <div style={{
          position: 'absolute',
          left: '10%',
          right: '10%',
          bottom: '-140px',
          height: '120px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 30%, transparent 70%)',
          filter: 'blur(40px)',
          transform: 'rotateX(90deg) translateZ(-80px)',
          pointerEvents: 'none',
          zIndex: -1
        }} />
        
        {/* Soft reflection underneath */}
        <div style={{
          position: 'absolute',
          left: '5%',
          right: '5%',
          bottom: '-160px',
          height: '150px',
          background: `radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, transparent 60%)`,
          filter: 'blur(20px)',
          transform: 'rotateX(90deg) translateZ(-100px)',
          pointerEvents: 'none',
          zIndex: -2
        }} />
        {/* Front Cover - PHOTOREALISTIC */}
        <div
          className="book-face book-front"
          style={{
            position: 'absolute',
            width: bookWidth,
            height: bookHeight,
            background: coverPage?.backgroundColor || `linear-gradient(135deg, ${mainColor} 0%, ${darkenColor(mainColor, 8)} 100%)`,
            backgroundImage: coverPage?.backgroundImage ? `url(${coverPage.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: `4px solid ${darkenColor(mainColor, 20)}`,
            borderRadius: '16px 6px 6px 16px',
            transform: `translateZ(${bookDepth / 2}px)`,
            boxShadow: `
              inset 0 0 80px rgba(255,255,255,0.15),
              inset -8px 0 30px rgba(0,0,0,0.2),
              inset 0 -8px 30px rgba(0,0,0,0.12),
              inset 0 8px 30px rgba(255,255,255,0.08),
              0 25px 70px rgba(0,0,0,0.35),
              0 10px 30px rgba(0,0,0,0.25)
            `,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Glossy finish overlay with realistic reflection */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)',
            pointerEvents: 'none',
            zIndex: 5,
            mixBlendMode: 'overlay'
          }} />
          
          {/* Soft light reflection from top-left */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 4,
            filter: 'blur(30px)'
          }} />
          
          {/* Cover texture - fabric/leather */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px),
              repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)
            `,
            opacity: 0.7,
            pointerEvents: 'none',
            zIndex: 1
          }} />
          
          {/* Subtle embossed edge */}
          <div style={{
            position: 'absolute',
            inset: '15px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: 3
          }} />
          
          {/* Cover content */}
          {renderCoverContent(0.85)}
        </div>

        {/* Back Cover */}
        <div
          className="book-face book-back"
          style={{
            position: 'absolute',
            width: bookWidth,
            height: bookHeight,
            background: `linear-gradient(135deg, ${backColor} 0%, ${darkenColor(mainColor, 18)} 100%)`,
            border: `3px solid ${darkenColor(mainColor, 25)}`,
            borderRadius: '4px 12px 12px 4px',
            transform: `translateZ(${-bookDepth / 2}px) rotateY(180deg)`,
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '2rem',
            color: 'white',
            overflow: 'hidden'
          }}
        >
          {/* Back cover texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)`,
            opacity: 0.5
          }} />
          
          <div style={{ 
            fontSize: '0.9rem', 
            opacity: 0.8,
            fontFamily: "'Poppins', sans-serif",
            position: 'relative',
            zIndex: 2
          }}>
            DearMemories
          </div>
        </div>

        {/* SPINE - PHOTOREALISTIC WITH LIGHTING */}
        <div
          className="book-face book-spine"
          style={{
            position: 'absolute',
            width: bookDepth,
            height: bookHeight,
            background: `linear-gradient(90deg, 
              ${darkenColor(mainColor, 45)} 0%, 
              ${darkenColor(mainColor, 35)} 10%,
              ${darkenColor(mainColor, 28)} 25%,
              ${spineColor} 50%, 
              ${darkenColor(mainColor, 28)} 75%,
              ${darkenColor(mainColor, 35)} 90%,
              ${darkenColor(mainColor, 45)} 100%
            )`,
            border: `4px solid ${darkenColor(mainColor, 50)}`,
            borderLeft: `3px solid ${darkenColor(mainColor, 55)}`,
            borderRight: `3px solid ${darkenColor(mainColor, 40)}`,
            transform: `translateX(${-bookDepth / 2}px) rotateY(-90deg)`,
            transformOrigin: 'left',
            left: 0,
            boxShadow: `
              inset -10px 0 25px rgba(0,0,0,0.6),
              inset 10px 0 25px rgba(0,0,0,0.5),
              inset 0 12px 35px rgba(0,0,0,0.4),
              inset 0 -12px 35px rgba(0,0,0,0.4),
              inset 5px 0 15px rgba(255,255,255,0.08),
              -8px 0 20px rgba(0,0,0,0.5)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: "'Poppins', sans-serif",
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '5px',
            padding: '3rem 0',
            textShadow: `
              0 3px 12px rgba(0,0,0,0.8),
              0 -1px 3px rgba(255,255,255,0.15),
              2px 0 6px rgba(0,0,0,0.6),
              -2px 0 6px rgba(0,0,0,0.4)
            `,
            overflow: 'hidden'
          }}
        >
          {/* Highlight stripe on spine (catch light) */}
          <div style={{
            position: 'absolute',
            left: '45%',
            top: '8%',
            bottom: '8%',
            width: '12%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.15) 80%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1,
            filter: 'blur(2px)'
          }} />
          {/* Leather texture overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                transparent, 
                transparent 3px, 
                rgba(0,0,0,0.15) 3px, 
                rgba(0,0,0,0.15) 4px
              ),
              repeating-linear-gradient(90deg, 
                transparent, 
                transparent 1px, 
                rgba(0,0,0,0.08) 1px, 
                rgba(0,0,0,0.08) 2px
              )
            `,
            opacity: 0.7,
            pointerEvents: 'none'
          }} />
          
          {/* Spine ribbing (horizontal raised bands) */}
          {[15, 30, 50, 70, 85].map((pos, i) => (
            <div
              key={`rib-${i}`}
              style={{
                position: 'absolute',
                left: '-2px',
                right: '-2px',
                top: `${pos}%`,
                height: '8px',
                background: `linear-gradient(90deg, 
                  ${darkenColor(mainColor, 35)} 0%,
                  ${darkenColor(mainColor, 25)} 50%,
                  ${darkenColor(mainColor, 35)} 100%
                )`,
                boxShadow: `
                  inset 0 2px 4px rgba(255,255,255,0.1),
                  inset 0 -2px 4px rgba(0,0,0,0.3),
                  0 2px 6px rgba(0,0,0,0.3)
                `,
                zIndex: 1
              }}
            />
          ))}
          
          {/* Gold trim top */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }} />
          
          {/* Gold trim bottom */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)',
            boxShadow: '0 -1px 3px rgba(0,0,0,0.5)'
          }} />
          
          {/* Title text with embossed effect */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            textTransform: 'uppercase',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
          }}>
            {title}
          </div>
        </div>

        {/* Left Edge (opposite of spine) */}
        <div
          className="book-face book-left"
          style={{
            position: 'absolute',
            width: bookDepth,
            height: bookHeight,
            background: `linear-gradient(90deg, 
              ${darkenColor(mainColor, 25)} 0%, 
              ${darkenColor(mainColor, 15)} 50%, 
              ${darkenColor(mainColor, 20)} 100%
            )`,
            border: `2px solid ${darkenColor(mainColor, 30)}`,
            borderRadius: '4px 0 0 4px',
            transform: `translateX(${-bookDepth / 2}px) rotateY(90deg)`,
            transformOrigin: 'right',
            right: 0,
            boxShadow: `
              inset 5px 0 15px rgba(0,0,0,0.2),
              inset -5px 0 15px rgba(0,0,0,0.15),
              5px 0 10px rgba(0,0,0,0.2)
            `
          }}
        />

        {/* Top Edge */}
        <div
          className="book-face book-top"
          style={{
            position: 'absolute',
            width: bookWidth,
            height: bookDepth,
            background: 'linear-gradient(180deg, #f5f5f0 0%, #e8e8e3 50%, #dcdcd7 100%)',
            border: '1px solid #d0d0cb',
            borderRadius: '12px 12px 0 0',
            transform: `translateY(${-bookDepth / 2}px) rotateX(90deg)`,
            transformOrigin: 'top',
            top: 0,
            boxShadow: 'inset 0 -2px 8px rgba(0,0,0,0.15), 0 -2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {/* Page edge lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px)',
            opacity: 0.5
          }} />
        </div>

        {/* Bottom Edge */}
        <div
          className="book-face book-bottom"
          style={{
            position: 'absolute',
            width: bookWidth,
            height: bookDepth,
            background: 'linear-gradient(180deg, #e0e0db 0%, #d5d5d0 50%, #c5c5c0 100%)',
            border: '1px solid #c0c0bb',
            borderRadius: '0 0 12px 12px',
            transform: `translateY(${bookDepth / 2}px) rotateX(-90deg)`,
            transformOrigin: 'bottom',
            bottom: 0,
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          {/* Page edge lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px)',
            opacity: 0.5
          }} />
        </div>

        {/* Right Edge (Pages) - ULTRA REALISTIC LAYERED PAGES */}
        <div
          className="book-face book-right"
          style={{
            position: 'absolute',
            width: bookDepth,
            height: bookHeight,
            background: 'linear-gradient(90deg, #fffef8 0%, #faf9f2 15%, #f5f4ed 30%, #f0efe8 50%, #ebe9e2 70%, #e6e4dd 85%, #e0ded7 100%)',
            border: '1px solid #d5d3cc',
            borderRadius: '0 6px 6px 0',
            transform: `translateX(${bookDepth / 2}px) rotateY(90deg)`,
            transformOrigin: 'right',
            right: 0,
            boxShadow: `
              inset -6px 0 15px rgba(0,0,0,0.18),
              inset 0 12px 25px rgba(0,0,0,0.08),
              inset 0 -12px 25px rgba(0,0,0,0.08),
              6px 0 15px rgba(0,0,0,0.15)
            `,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Soft highlight on page edge */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: '10%',
            bottom: '10%',
            width: '2px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            pointerEvents: 'none'
          }} />
          {/* Page lines for realistic thickness */}
          {Array.from({ length: Math.min(totalPages, 120) }).map((_, i) => {
            const offset = Math.random() * 0.3;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${offset}px`,
                  right: 0,
                  top: `${(i / Math.min(totalPages, 120)) * 100}%`,
                  height: '1px',
                  background: `rgba(0,0,0,${0.08 + Math.random() * 0.06})`,
                }}
              />
            );
          })}
          
          {/* Gradient overlays */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 3%, transparent 97%, rgba(0,0,0,0.1) 100%),
              linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.1) 100%)
            `
          }} />
          
          {/* Subtle paper texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px)',
            opacity: 0.6
          }} />
        </div>
      </div>
    </div>
  );
}

// Loading Component
function LoadingView() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Loader2 className="w-16 h-16 text-pink-400 animate-spin mb-4" />
      <p className="text-gray-600 text-lg font-medium">Đang tạo bản xem trước 3D...</p>
      <p className="text-gray-400 text-sm mt-2">Vui lòng đợi trong giây lát</p>
    </div>
  );
}

// Empty State Component
function EmptyView() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
        <BookOpen className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">Chưa có nội dung</h3>
      <p className="text-gray-500">Hãy thêm nội dung vào cuốn sách của bạn</p>
    </div>
  );
}

// Main Component
export default function Book3DOverviewPreview({ 
  bookData,
  onClose 
}: Book3DOverviewPreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [isLoading] = useState(false);
  const [isEmpty] = useState(false);
  // Product-style camera angle (like Apple Books / Amazon Kindle) - Optimized for thick book
  const [rotation, setRotation] = useState({ x: -12, y: 30 }); // Slightly adjusted to show spine and thickness
  const [scale, setScale] = useState(0.85); // Reduced slightly to accommodate larger book
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build complete page list: Front Cover + Content Pages + Back Cover
  const contentPages = bookData?.pages || [];
  
  // Create front cover page
  const frontCoverPage = bookData?.coverPage || {
    id: 'front-cover',
    backgroundColor: bookData?.coverColor || '#f9a8d4',
    elements: []
  };
  
  // Create back cover page
  const backCoverPage = {
    id: 'back-cover',
    backgroundColor: bookData?.coverColor ? darkenColor(bookData.coverColor, 15) : '#e089b4',
    elements: [
      {
        id: 'back-text-1',
        type: 'text' as const,
        content: 'Tạo bởi DearMemories',
        x: 150,
        y: 450,
        width: 300,
        height: 50,
        fontSize: 18,
        fontFamily: 'Poppins',
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
        textAlign: 'center'
      },
      {
        id: 'back-text-2',
        type: 'text' as const,
        content: 'Thiết kế sách cá nhân hoá',
        x: 150,
        y: 485,
        width: 300,
        height: 30,
        fontSize: 13,
        fontFamily: 'Poppins',
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '400',
        textAlign: 'center'
      }
    ]
  };
  
  // Combine all pages: front cover + content + back cover
  const pages = [frontCoverPage, ...contentPages, backCoverPage];
  const totalPages = pages.length;
  
  // Helper function to darken color (needed early for back cover)
  function darkenColor(color: string, percent: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const darken = (val: number) => Math.max(0, Math.floor(val * (1 - percent / 100)));
    
    return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
  }

  // Smooth initial showcase animation
  useEffect(() => {
    if (isInitialLoad && viewMode === 'overview') {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [viewMode, isInitialLoad]);

  // Smooth mouse drag to rotate with momentum
  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== 'overview') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || viewMode !== 'overview') return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Smooth rotation with constraints for natural book viewing
    setRotation(prev => ({
      x: Math.max(-60, Math.min(30, prev.x - deltaY * 0.4)),
      y: prev.y + deltaX * 0.4
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  // Smooth zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setScale(prev => Math.max(0.5, Math.min(1.8, prev + delta)));
  };

  // Reset to product-style view
  const handleReset = () => {
    setViewMode('overview');
    setRotation({ x: -12, y: 30 }); // Product-style angle optimized for thick book
    setScale(0.85);
    setCurrentPageIndex(0);
  };

  // Page navigation
  const handlePrevPage = () => {
    if (currentPageIndex > 0 && !isFlipping) {
      if (viewMode === 'read') {
        setCurrentPageIndex(prev => prev - 1);
      } else {
        setIsFlipping(true);
        setFlipDirection('prev');
        setTimeout(() => {
          setCurrentPageIndex(prev => prev - 1);
          setTimeout(() => {
            setIsFlipping(false);
            setFlipDirection(null);
          }, 1200);
        }, 50);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1 && !isFlipping) {
      if (viewMode === 'read') {
        setCurrentPageIndex(prev => prev + 1);
      } else {
        setIsFlipping(true);
        setFlipDirection('next');
        setTimeout(() => {
          setCurrentPageIndex(prev => prev + 1);
          setTimeout(() => {
            setIsFlipping(false);
            setFlipDirection(null);
          }, 1200);
        }, 50);
      }
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(1.5, prev + 0.1));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.4, prev - 0.1));
  };

  if (isLoading) return <LoadingView />;
  if (isEmpty) return <EmptyView />;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50"
      style={{
        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 25%, #efefef 50%, #f8f8f8 75%, #fafafa 100%)',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(249, 168, 212, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(167, 139, 250, 0.03) 0%, transparent 50%),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px)
        `,
        cursor: viewMode === 'overview' ? (isDragging ? 'grabbing' : 'grab') : 'default'
      }}
      onWheel={handleWheel}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium text-gray-700"
          >
            ← Quay lại
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h2 className="text-lg font-semibold text-gray-800">
            {bookData?.title || 'Xem trước 3D'}
          </h2>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setViewMode('overview');
              setRotation({ x: -12, y: 30 });
            }}
            className={`px-4 py-2 rounded-md transition font-medium flex items-center gap-2 ${
              viewMode === 'overview'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Chế độ tổng quan"
          >
            <Maximize2 className="w-4 h-4" />
            Tổng quan
          </button>
          <button
            onClick={() => setViewMode('flip')}
            className={`px-4 py-2 rounded-md transition font-medium flex items-center gap-2 ${
              viewMode === 'flip'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Chế độ lật trang"
          >
            <BookOpen className="w-4 h-4" />
            Lật trang
          </button>
          <button
            onClick={() => setViewMode('read')}
            className={`px-4 py-2 rounded-md transition font-medium flex items-center gap-2 ${
              viewMode === 'read'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Chế độ đọc"
          >
            <FileText className="w-4 h-4" />
            Đọc
          </button>
        </div>
      </div>

      {/* 3D Book View - Product Showcase */}
      <div
        className="absolute inset-0 top-16"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ 
          cursor: viewMode === 'overview' ? (isDragging ? 'grabbing' : 'grab') : 'default',
          userSelect: 'none'
        }}
      >
        <RealisticBook
          viewMode={viewMode}
          title={bookData?.title}
          coverColor={bookData?.coverColor}
          theme={bookData?.theme}
          coverPage={bookData?.coverPage}
          rotation={rotation}
          scale={scale}
          currentPageIndex={currentPageIndex}
          pages={pages}
          isFlipping={isFlipping}
          flipDirection={flipDirection}
          isInitialLoad={isInitialLoad}
        />
      </div>

      {/* Enhanced Controls - Floating Toolbar */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-white/95 backdrop-blur-xl px-6 py-3.5 rounded-2xl shadow-2xl border border-gray-200/50">
        {/* Zoom controls */}
        {viewMode === 'overview' && (
          <>
            <button
              onClick={handleZoomOut}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-110 active:scale-95"
              title="Thu nhỏ (hoặc lăn chuột)"
            >
              <ZoomOut className="w-5 h-5 text-gray-700" />
            </button>
            <div className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg text-xs font-semibold text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </div>
            <button
              onClick={handleZoomIn}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-110 active:scale-95"
              title="Phóng to (hoặc lăn chuột)"
            >
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <button
              onClick={handleReset}
              className="p-2.5 hover:bg-rose-50 rounded-xl transition-all hover:scale-110 active:scale-95 group"
              title="Đặt lại góc nhìn sản phẩm"
            >
              <Home className="w-5 h-5 text-gray-700 group-hover:text-rose-600 transition-colors" />
            </button>
            <button
              onClick={() => {
                setRotation({ x: -30, y: 180 });
              }}
              className="p-2.5 hover:bg-purple-50 rounded-xl transition-all hover:scale-110 active:scale-95 group"
              title="Xoay 180° (xem bìa sau)"
            >
              <RotateCw className="w-5 h-5 text-gray-700 group-hover:text-purple-600 transition-colors" />
            </button>
          </>
        )}

        {/* Page navigation */}
        {(viewMode === 'flip' || viewMode === 'read') && (
          <>
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0 || isFlipping}
              className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="Trang trước"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
              {currentPageIndex === 0 ? 'Bìa trước' : 
               currentPageIndex === totalPages - 1 ? 'Bìa sau' : 
               `Trang ${currentPageIndex} / ${totalPages - 2}`}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPageIndex >= totalPages - 1 || isFlipping}
              className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="Trang sau"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <button
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Về đầu"
            >
              <Home className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Enhanced Info Badge */}
      {viewMode === 'overview' && (
        <div className="absolute top-24 left-6 bg-gradient-to-br from-white to-gray-50 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-xl border border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Maximize2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800 mb-0.5">Điều khiển 3D</p>
              <p className="text-xs text-gray-500">
                🖱️ Kéo để xoay • 🔍 Lăn để zoom
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Quality indicator badge */}
      <div className="absolute top-24 right-6 bg-gradient-to-br from-emerald-500 to-teal-600 backdrop-blur-xl px-4 py-2 rounded-xl shadow-xl border border-emerald-400/30">
        <p className="text-xs font-bold text-white tracking-wide">
          ✨ PHOTOREALISTIC 3D
        </p>
      </div>
    </div>
  );
}
