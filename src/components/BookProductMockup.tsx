import React from 'react';
import { X } from 'lucide-react';

interface PageElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: string;
  textAlign?: string;
}

interface Page {
  id: string;
  elements: PageElement[];
}

interface BookData {
  title: string;
  theme: string;
  coverColor?: string;
  pages: Page[];
}

interface BookProductMockupProps {
  bookData: BookData;
  onClose?: () => void;
}

export default function BookProductMockup({ bookData, onClose }: BookProductMockupProps) {
  const pages = bookData?.pages || [];
  const coverPage = pages[0];
  const mainColor = bookData?.coverColor || '#f4a6c4';

  // Helper function to darken color
  const darkenColor = (color: string, percent: number) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const darken = (val: number) => Math.max(0, Math.floor(val * (1 - percent / 100)));
    
    return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
  };

  const spineColor = darkenColor(mainColor, 25);
  const backColor = darkenColor(mainColor, 10);

  // Premium product mockup dimensions
  const bookWidth = 380;
  const bookHeight = 520;
  const pageThickness = 0.55;
  const totalPages = pages.length || 100;
  const bookDepth = Math.max(85, Math.min(130, totalPages * pageThickness));

  // Fixed product angle - optimized for portfolio/website
  const productRotation = { x: -10, y: 32 };

  // Render cover content
  const renderCoverContent = (scaleFactor: number = 0.88) => {
    const hasElements = coverPage && coverPage.elements && coverPage.elements.length > 0;

    if (!hasElements) {
      return (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          background: `linear-gradient(135deg, ${mainColor} 0%, ${darkenColor(mainColor, 15)} 100%)`,
        }}>
          <div style={{
            fontSize: `${42 * scaleFactor}px`,
            fontWeight: '700',
            color: 'white',
            textAlign: 'center',
            textShadow: '0 2px 20px rgba(0,0,0,0.15)',
            lineHeight: '1.2',
            fontFamily: 'Poppins, sans-serif'
          }}>
            {bookData?.title || 'Cuốn Sách Của Bạn'}
          </div>
        </div>
      );
    }

    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(135deg, ${mainColor} 0%, ${darkenColor(mainColor, 8)} 100%)`,
        overflow: 'hidden'
      }}>
        {coverPage.elements.map((element) => {
          if (element.type === 'text') {
            return (
              <div
                key={element.id}
                style={{
                  position: 'absolute',
                  left: `${element.x * scaleFactor}px`,
                  top: `${element.y * scaleFactor}px`,
                  width: `${element.width * scaleFactor}px`,
                  height: `${element.height * scaleFactor}px`,
                  fontSize: `${(element.fontSize || 16) * scaleFactor}px`,
                  fontFamily: element.fontFamily || 'Poppins, sans-serif',
                  color: element.color || '#ffffff',
                  fontWeight: element.fontWeight || 'normal',
                  textAlign: (element.textAlign as any) || 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: element.textAlign === 'center' ? 'center' : 'flex-start',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  textShadow: '0 2px 12px rgba(0,0,0,0.12)',
                }}
              >
                {element.content}
              </div>
            );
          } else if (element.type === 'image') {
            return (
              <img
                key={element.id}
                src={element.content}
                alt=""
                style={{
                  position: 'absolute',
                  left: `${element.x * scaleFactor}px`,
                  top: `${element.y * scaleFactor}px`,
                  width: `${element.width * scaleFactor}px`,
                  height: `${element.height * scaleFactor}px`,
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div 
      className="w-full h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        perspective: '5000px',
        perspectiveOrigin: '50% 50%',
        background: 'linear-gradient(150deg, #fafafa 0%, #f5f5f5 35%, #eeeeee 70%, #e8e8e8 100%)'
      }}
    >
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-50 p-4 bg-white/90 backdrop-blur-lg hover:bg-white rounded-full shadow-xl transition-all hover:scale-110 group"
        >
          <X className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
        </button>
      )}
      {/* Studio lighting effects */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        left: '-30%',
        width: '160%',
        height: '160%',
        background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.5) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-20%',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 80% 80%, rgba(0,0,0,0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* The Book 3D */}
      <div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `
            rotateX(${productRotation.x}deg) 
            rotateY(${productRotation.y}deg) 
            scale(0.82)
          `,
          transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: 'drop-shadow(0 50px 100px rgba(0,0,0,0.28)) drop-shadow(0 25px 50px rgba(0,0,0,0.18)) drop-shadow(0 10px 25px rgba(0,0,0,0.12))',
          zIndex: 1
        }}
      >
        {/* Front Cover */}
        <div
          style={{
            position: 'absolute',
            width: `${bookWidth}px`,
            height: `${bookHeight}px`,
            background: `linear-gradient(135deg, ${mainColor} 0%, ${darkenColor(mainColor, 8)} 100%)`,
            borderRadius: '0 8px 8px 0',
            transform: `translateZ(${bookDepth / 2}px)`,
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.4),
              inset 0 -2px 4px rgba(0,0,0,0.1),
              0 0 0 1px rgba(0,0,0,0.08)
            `,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {renderCoverContent()}
          
          {/* Glossy effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Spine */}
        <div
          style={{
            position: 'absolute',
            width: `${bookDepth}px`,
            height: `${bookHeight}px`,
            background: `linear-gradient(90deg, ${darkenColor(spineColor, 15)} 0%, ${spineColor} 50%, ${darkenColor(spineColor, 10)} 100%)`,
            transform: `translateX(-${bookDepth / 2}px) rotateY(-90deg)`,
            transformOrigin: 'left center',
            borderRadius: '8px 0 0 8px',
            boxShadow: `
              inset 2px 0 6px rgba(0,0,0,0.3),
              inset -2px 0 6px rgba(0,0,0,0.2),
              inset 0 2px 4px rgba(255,255,255,0.15)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Spine text */}
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'rgba(255,255,255,0.95)',
            textAlign: 'center',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            padding: '20px 0',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            fontFamily: 'Poppins, sans-serif',
            letterSpacing: '1px'
          }}>
            {bookData?.title || 'DEARMEMORIES'}
          </div>
        </div>

        {/* Back Cover */}
        <div
          style={{
            position: 'absolute',
            width: `${bookWidth}px`,
            height: `${bookHeight}px`,
            background: `linear-gradient(135deg, ${backColor} 0%, ${darkenColor(backColor, 12)} 100%)`,
            borderRadius: '8px 0 0 8px',
            transform: `translateZ(-${bookDepth / 2}px) rotateY(180deg)`,
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.3),
              inset 0 -2px 4px rgba(0,0,0,0.15),
              0 0 0 1px rgba(0,0,0,0.1)
            `,
            border: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          {/* Back cover subtle decoration */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            right: '30px',
            padding: '20px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
              fontFamily: 'Poppins, sans-serif',
              lineHeight: '1.6'
            }}>
              Tạo bởi DearMemories
              <br />
              <span style={{ fontSize: '11px', opacity: 0.7 }}>Thiết kế sách cá nhân hoá</span>
            </div>
          </div>
        </div>

        {/* Top Edge */}
        <div
          style={{
            position: 'absolute',
            width: `${bookWidth}px`,
            height: `${bookDepth}px`,
            background: `linear-gradient(180deg, ${darkenColor(mainColor, 18)} 0%, ${darkenColor(mainColor, 25)} 100%)`,
            transform: `translateY(-${bookDepth / 2}px) rotateX(90deg)`,
            transformOrigin: 'top center',
            borderRadius: '0 8px 0 0',
            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.2)'
          }}
        />

        {/* Bottom Edge */}
        <div
          style={{
            position: 'absolute',
            width: `${bookWidth}px`,
            height: `${bookDepth}px`,
            background: `linear-gradient(180deg, ${darkenColor(mainColor, 30)} 0%, ${darkenColor(mainColor, 35)} 100%)`,
            transform: `translateY(${bookHeight - bookDepth / 2}px) rotateX(90deg)`,
            transformOrigin: 'top center',
            borderRadius: '0 0 8px 0',
            boxShadow: 'inset 0 -1px 3px rgba(0,0,0,0.4)'
          }}
        />

        {/* Right Edge (visible from angle) */}
        <div
          style={{
            position: 'absolute',
            width: `${bookDepth}px`,
            height: `${bookHeight}px`,
            background: `linear-gradient(90deg, ${darkenColor(mainColor, 12)} 0%, ${darkenColor(mainColor, 18)} 100%)`,
            transform: `translateX(${bookWidth - bookDepth / 2}px) rotateY(90deg)`,
            transformOrigin: 'left center',
            borderRadius: '0 8px 8px 0',
            boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.2)'
          }}
        />

        {/* Pages stack effect - realistic paper edges */}
        <div
          style={{
            position: 'absolute',
            right: '0',
            top: '5px',
            bottom: '5px',
            width: `${bookDepth - 3}px`,
            background: 'linear-gradient(90deg, #fefefe 0%, #f8f8f8 50%, #f0f0f0 100%)',
            transform: `translateX(-1.5px) translateZ(${bookDepth / 2 - 1}px)`,
            boxShadow: `
              inset 2px 0 3px rgba(0,0,0,0.08),
              inset -1px 0 2px rgba(0,0,0,0.05)
            `,
            borderRadius: '0 4px 4px 0'
          }}
        >
          {/* Page lines for realism */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${(i + 1) * 11}%`,
                height: '1px',
                background: 'rgba(0,0,0,0.04)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Soft floor reflection */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, transparent 60%)',
        transform: 'rotateX(90deg) translateZ(-200px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
    </div>
  );
}
