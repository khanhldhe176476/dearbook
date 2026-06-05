import { useState, useEffect } from 'react';
import hanoiImg from 'figma:asset/d7b475113023469e96cb19c4ee78d3ffb04dfa29.png';
import loveImg from 'figma:asset/4f81f59175575b9ebba78ca1d45401cd109f1941.png';
import familyImg from 'figma:asset/03ef3be4e5a9d3f6b0010356d756eeaf3c80bb4c.png';
import { InteractiveLogoutButton } from './InteractiveLogoutButton';
import {
  Heart,
  BookOpen,
  Sparkles,
  Star,
  ArrowRight,
  ArrowLeft,
  Check,
  Gift,
  HelpCircle,
} from 'lucide-react';

interface HomePageProps {
  user?: any;
  onGetStarted: () => void;
  onLogout?: () => void;
}

/* ═══════════════════════════════════════════════════════════
   CSS-in-JS styles for hover effects & animations
   ═══════════════════════════════════════════════════════════ */
const styles = `
  /* ── Keyframes ── */
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes floatMedium {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-8px) rotate(1deg); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(185, 66, 58, 0.3); }
    50% { box-shadow: 0 0 40px rgba(185, 66, 58, 0.6); }
  }
  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
  .animate-float-medium { animation: floatMedium 4s ease-in-out infinite; }
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
  .animate-slide-left { animation: slideInLeft 0.7s ease-out forwards; }
  .animate-slide-right { animation: slideInRight 0.7s ease-out forwards; }

  /* ── Product Card Hover ── */
  .product-card {
    transition: all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;
  }
  .product-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
    pointer-events: none;
  }
  .product-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 25px 60px -12px rgba(107, 75, 67, 0.15), 0 0 30px rgba(185, 66, 58, 0.15);
  }
  .product-card:hover::before {
    opacity: 1;
  }

  /* ── Image hover zoom ── */
  .img-zoom {
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.6s ease;
  }
  .group:hover .img-zoom {
    transform: scale(1.08);
    filter: brightness(1.05);
  }

  /* ── Badge pulse on hover ── */
  .price-badge {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .price-badge:hover {
    transform: scale(1.15) rotate(-3deg);
  }

  /* ── Tier card ── */
  .tier-card {
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
  }
  .tier-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%;
    width: 0; height: 3px;
    background: linear-gradient(90deg, #E6C7B8, #B9423A, #E6C7B8);
    transition: all 0.5s ease;
    transform: translateX(-50%);
    border-radius: 2px;
  }
  .tier-card:hover {
    transform: translateY(-16px);
    box-shadow: 0 30px 60px -15px rgba(107, 75, 67, 0.25), 0 0 40px rgba(185, 66, 58, 0.2);
  }
  .tier-card:hover::after {
    width: 80%;
  }

  /* ── Book mockup hover ── */
  .book-mockup {
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .book-mockup:hover {
    transform: translateY(-8px) rotate(-1deg);
    box-shadow: 0 20px 40px -10px rgba(107, 75, 67, 0.2);
  }

  /* ── Blind box hover ── */
  .blind-box-card {
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
  }
  .blind-box-card::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(230,199,184,0.4), transparent, rgba(185,66,58,0.4));
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }
  .blind-box-card:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 25px 50px -12px rgba(107, 75, 67, 0.2);
  }
  .blind-box-card:hover::after {
    opacity: 1;
  }

  /* ── Nav link underline effect ── */
  .nav-link {
    position: relative;
    transition: color 0.3s ease;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 2px;
    background: linear-gradient(90deg, #B9423A, #E6C7B8);
    transition: width 0.3s ease;
    border-radius: 1px;
  }
  .nav-link:hover {
    color: #B9423A;
  }
  .nav-link:hover::after {
    width: 100%;
  }

  /* ── CTA Button ── */
  .cta-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
  }
  .cta-btn::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    transition: width 0.6s ease, height 0.6s ease;
    transform: translate(-50%, -50%);
  }
  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(185, 66, 58, 0.4);
  }
  .cta-btn:hover::before {
    width: 300px; height: 300px;
  }

  /* ── Shimmer text ── */
  .shimmer-text {
    background: linear-gradient(90deg, #B9423A, #E6C7B8, #F7E2D4, #E6C7B8, #B9423A);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  /* ── Glassmorphism ── */
  .glass {
    background: rgba(255, 248, 241, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(230, 199, 184, 0.5);
  }

  /* ── Photo strip hover ── */
  .photo-strip {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .photo-strip:hover {
    transform: rotate(0deg) translateY(-8px) !important;
    box-shadow: 0 20px 40px -10px rgba(107, 75, 67, 0.15);
  }

  /* ── Scroll reveal ── */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Section divider ── */
  .section-divider {
    background: linear-gradient(90deg, transparent, rgba(185, 66, 58, 0.3), transparent);
    height: 1px;
  }

  /* ── Decorative dot pattern ── */
  .dot-pattern {
    background-image: radial-gradient(circle, rgba(185, 66, 58, 0.08) 1px, transparent 1px);
    background-size: 24px 24px;
  }
`;

/* ═══════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════ */

const PriceTag = ({ price, size = 'md' }: { price: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: 'w-16 h-16 text-base',
    md: 'w-24 h-24 text-xl',
    lg: 'w-28 h-28 text-3xl',
  };

  return (
    <div
      className={`price-badge ${sizeMap[size]} relative flex items-center justify-center cursor-pointer`}
      style={{
        filter: 'drop-shadow(0 10px 18px rgba(84, 45, 25, 0.28))',
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="priceTagBrown" x1="20" y1="12" x2="82" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9A6848" />
            <stop offset="52%" stopColor="#7A472B" />
            <stop offset="100%" stopColor="#63361F" />
          </linearGradient>
        </defs>

        <path
          d="
            M50 8
            C58 8 62 18 65 26
            C72 21 84 17 90 24
            C96 31 88 42 80 48
            C90 52 98 62 94 71
            C90 80 77 78 68 73
            C67 83 60 94 50 94
            C40 94 33 83 32 73
            C23 78 10 80 6 71
            C2 62 10 52 20 48
            C12 42 4 31 10 24
            C16 17 28 21 35 26
            C38 18 42 8 50 8
            Z
          "
          fill="url(#priceTagBrown)"
          stroke="#E8B89B"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        <path
          d="
            M50 14
            C56 14 59 23 62 31
            C69 26 79 24 84 29
            C89 35 82 44 74 50
            C84 54 90 62 87 68
            C84 75 73 73 65 67
            C64 77 57 87 50 87
            C43 87 36 77 35 67
            C27 73 16 75 13 68
            C10 62 16 54 26 50
            C18 44 11 35 16 29
            C21 24 31 26 38 31
            C41 23 44 14 50 14
            Z
          "
          fill="none"
          stroke="rgba(255, 224, 204, 0.88)"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        <circle cx="50" cy="18" r="5.4" fill="#3A1E12" />
      </svg>

      <span
        className="absolute left-1/2 top-1/2 z-10 font-serif font-bold text-white leading-none whitespace-nowrap pointer-events-none"
        style={{
          fontSize: size === 'lg' ? '24px' : size === 'md' ? '20px' : '16px',
          transform: 'translate(-50%, -50%) translateY(8px)',
          textShadow: '0 2px 4px rgba(0,0,0,0.32)',
        }}
      >
        {price}
      </span>
    </div>
  );
};

const BlindBagCard = ({ imgUrl, title, subtitle }: { imgUrl: string; title: string; subtitle: string }) => (
  <div className="blind-box-card w-52 bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer group flex flex-col justify-between"
    style={{ border: '1px solid #E6C7B8' }}>
    <div>
      {/* Top stripe */}
      <div className="h-2 bg-[#B9423A]" />

      <div className="p-4 flex flex-col items-center">
        <div className="w-full h-36 rounded-xl overflow-hidden mb-3 shadow-inner relative"
          style={{ border: '4px solid #FFF8F1' }}>
          <img src={imgUrl} className="w-full h-full object-cover img-zoom" alt="" />
        </div>

        <p className="text-xs text-[#6B4B43] tracking-widest uppercase mb-1">{subtitle}</p>
        <p
          className="text-2xl text-[#B9423A] text-center leading-tight"
          style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', fontWeight: '400', fontSize: '1.6rem' }}
        >{title}</p>
      </div>
    </div>

    {/* Bottom stripe */}
    <div className="h-2 bg-[#B9423A]" />
  </div>
);

const PhotoBoothStrip = ({ images, rotation }: { images: string[]; rotation: number }) => (
  <div className="photo-strip bg-white p-2 pb-8 shadow-lg border border-gray-100 rounded-sm cursor-pointer"
    style={{ transform: `rotate(${rotation}deg)`, width: '100px' }}>
    <div className="space-y-2">
      {images.map((img: string, i: number) => (
        <div key={i} className="aspect-[3/2] bg-gray-200 overflow-hidden rounded-sm">
          <img src={img} className="w-full h-full object-cover img-zoom" alt="" />
        </div>
      ))}
    </div>
    <div className="text-center mt-4">
      <p
        style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A', fontSize: '1rem', lineHeight: 1.2 }}
      >dear<br />memories</p>
    </div>
  </div>
);

const AutoFlipRightPage = ({ pages, bgColor }: { pages: any[]; bgColor: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActiveIndex(i => (i + 1) % pages.length), 3000);
    return () => clearInterval(timer);
  }, [pages.length]);

  return (
    <div className="w-44 h-56 overflow-hidden relative rounded-r-lg" style={{ backgroundColor: bgColor }}>
      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 to-transparent z-20 pointer-events-none" />
      {pages.map((page, index) => (
        <div key={index}
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            opacity: activeIndex === index ? 1 : 0,
            transform: activeIndex === index ? 'translateX(0)' : 'translateX(10px)',
            zIndex: activeIndex === index ? 10 : 0,
          }}>
          {page}
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Main HomePage
   ═══════════════════════════════════════════════════════════ */

export function HomePage({ user, onGetStarted, onLogout }: HomePageProps) {
  const [showAbout, setShowAbout] = useState(false);

  // Intersection observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [showAbout]);

  const handleNavClick = (targetId: string) => {
    setShowAbout(false);
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#FFF8F1', fontFamily: '"Lora", ui-serif, Georgia, serif' }}>
      <style>{styles}</style>

      {/* ── Navigation ── */}
      <nav className="glass sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">
          <div 
            className="flex items-center cursor-pointer" 
            style={{ height: '58px', overflow: 'visible' }}
            onClick={() => {
              setShowAbout(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/logo.png"
              alt="dearmemories"
              className="object-contain block"
              style={{ height: '140px', margin: '-41px 0' }}
            />
          </div>

          <div className="hidden md:flex items-center gap-8 text-[#6B4B43] text-sm font-semibold">
            <button
              onClick={() => {
                setShowAbout(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`nav-link hover:text-[#B9423A] transition-colors focus:outline-none ${
                showAbout ? 'text-[#B9423A] font-bold' : ''
              }`}
            >
              Giới thiệu
            </button>
            <button
              onClick={() => handleNavClick('ptb-box')}
              className="nav-link hover:text-[#B9423A] transition-colors focus:outline-none"
            >
              Photobook Box
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="nav-link hover:text-[#B9423A] transition-colors focus:outline-none"
            >
              Danh mục
            </button>
            <button
              onClick={() => handleNavClick('themes')}
              className="nav-link hover:text-[#B9423A] transition-colors focus:outline-none"
            >
              Chủ đề
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[#6B4B43] text-sm font-medium">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-medium text-[#6B4B43] text-sm">Chào, <strong className="text-[#3B2925]">{user.name}</strong></span>
                <button onClick={onGetStarted}
                  className="cta-btn bg-[#B9423A] text-white px-5 py-2.5 rounded-full font-medium text-sm relative z-10 hover:bg-[#96332E]">
                  Thư viện của tôi
                </button>
                <InteractiveLogoutButton
                  onLogout={onLogout}
                  variant="ghost"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={onGetStarted}
                  className="cta-btn bg-[#B9423A] text-white px-5 py-2.5 rounded-full font-medium text-sm relative z-10 hover:bg-[#96332E]">
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showAbout && (
        <div 
          className="w-full min-h-[calc(100vh-180px)] py-16 px-4 md:px-8 relative overflow-hidden flex items-center justify-center animate-fade-in-up"
          style={{
            background: 'linear-gradient(160deg, #FFF8F1 0%, #F7E2D4 40%, #FFF8F1 100%)',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-[-100px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #E6C7B8, transparent 70%)' }} />
          <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full opacity-8 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #B9423A, transparent 70%)' }} />
          <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

          <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12 relative z-10">
            
            {/* Left: Beautiful stacked polaroids/photo cards */}
            <div className="flex-1 flex justify-center items-center relative min-h-[320px] md:min-h-[440px] md:-translate-x-12">
              <div className="relative w-96 h-[420px]">
                {/* Polaroid 1 (bottom layer) */}
                <div 
                  className="absolute top-0 left-0 bg-white p-4 pb-10 rounded shadow-md border border-[#E6C7B8]/30 transform -rotate-12 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 cursor-pointer"
                  style={{ width: '260px' }}
                >
                  <div className="aspect-square bg-[#FFF8F1] overflow-hidden rounded-sm">
                    <img src={loveImg} className="w-full h-full object-cover" alt="" />
                  </div>
                  <p className="text-center mt-4" style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A', fontSize: '1.7rem', lineHeight: 1 }}>love stories</p>
                </div>

                {/* Polaroid 2 (middle layer) */}
                <div 
                  className="absolute top-12 left-28 bg-white p-4 pb-10 rounded shadow-lg border border-[#E6C7B8]/30 transform rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 cursor-pointer"
                  style={{ width: '270px' }}
                >
                  <div className="aspect-square bg-[#FFF8F1] overflow-hidden rounded-sm">
                    <img src={familyImg} className="w-full h-full object-cover" alt="" />
                  </div>
                  <p className="text-center mt-4" style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A', fontSize: '1.7rem', lineHeight: 1 }}>family moments</p>
                </div>

                {/* Polaroid 3 (top layer) */}
                <div 
                  className="absolute top-24 left-6 bg-white p-4 pb-10 rounded shadow-xl border border-[#E6C7B8]/30 transform -rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 cursor-pointer"
                  style={{ width: '260px' }}
                >
                  <div className="aspect-square bg-[#FFF8F1] overflow-hidden rounded-sm">
                    <img src={hanoiImg} className="w-full h-full object-cover" alt="" />
                  </div>
                  <p className="text-center mt-4" style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A', fontSize: '1.7rem', lineHeight: 1 }}>dear memories</p>
                </div>
              </div>
            </div>

            {/* Right: Premium Glassmorphism content card */}
            <div className="flex-1 bg-white/70 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl border border-[#E6C7B8]/40">
              <div className="text-center md:text-left mb-6">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B9423A] block mb-2">Giới thiệu</span>

                <h3 
                  className="text-lg font-serif italic text-[#7A4A42] font-semibold mt-2"
                >
                  Every memory deserves a place to stay.
                </h3>
              </div>

              <div className="space-y-4 text-[#543A34] text-base leading-relaxed font-serif text-justify md:text-left">
                <p>
                  <strong className="text-[#B9423A] font-sans">dearmemories.</strong> là nền tảng photobook cá nhân hóa được tạo ra để giúp bạn lưu giữ những khoảnh khắc đáng nhớ theo cách riêng của mình. Chúng tôi tin rằng mỗi bức ảnh đều mang theo một câu chuyện và mỗi câu chuyện đều xứng đáng được lưu giữ lâu dài thay vì bị lãng quên trong thư viện ảnh của điện thoại.
                </p>
                <p>
                  Thông qua những mẫu thiết kế được chọn lọc sẵn cùng trải nghiệm tùy chỉnh đơn giản, <strong className="text-[#B9423A] font-sans">dearmemories.</strong> giúp bạn dễ dàng biến những kỷ niệm, cảm xúc và câu chuyện cá nhân thành một cuốn photobook mang dấu ấn riêng.
                </p>
              </div>

              <div className="mt-8 flex justify-center md:justify-start">
                <button
                  onClick={() => {
                    setShowAbout(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cta-btn px-6 py-3 rounded-full text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #B9423A, #96332E)',
                    boxShadow: '0 4px 15px rgba(185, 66, 58, 0.3)',
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại trang chủ
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className={showAbout ? 'hidden' : ''}>
        {/* ══════════════════════════════════════════════════════
            SECTION 1 — Hero: Photobook Box
            ══════════════════════════════════════════════════════ */}
        <section id="ptb-box" className="relative w-full min-h-[620px] overflow-hidden flex items-center scroll-mt-24"
        style={{
          background: 'linear-gradient(160deg, #FFF8F1 0%, #F7E2D4 40%, #FFF8F1 100%)',
        }}>
        {/* Decorative circles */}
        <div className="absolute top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #E6C7B8, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #B9423A, transparent 70%)' }} />

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-8 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left content */}
            <div className="flex-1 animate-slide-left" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(185, 66, 58, 0.1)', border: '1px solid rgba(185, 66, 58, 0.2)' }}>
                <span className="w-2 h-2 rounded-full bg-[#B9423A] animate-pulse" />
                <span className="text-sm font-semibold text-[#B9423A]">Photobook Box</span>
              </div>

              <h1 className="leading-[0.95] mb-6 inline-flex flex-col items-center">
                <span
                  className="block"
                  style={{
                    fontFamily: '"Cooper BT", "Cooper Black", "Cooper", Georgia, serif',
                    fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
                    fontWeight: '900',
                    lineHeight: 1.1,
                    color: '#3B2925',
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Photobook Box
                </span>
                <span
                  className="block mt-2"
                  style={{
                    fontFamily: '"Fraunces", "Cooper Black", "Cooper BT", Georgia, serif',
                    fontSize: 'clamp(1.15rem, 2.6vw, 1.7rem)',
                    lineHeight: 1.35,
                    color: '#7A4A42',
                    fontWeight: '400',
                    fontStyle: 'italic',
                    letterSpacing: '0.01em',
                    textAlign: 'center',
                  }}
                >
                  nhỏ xinh nhưng đầy cảm xúc
                </span>
              </h1>

              <div className="space-y-4 text-[#6B4B43] text-lg mb-8 font-serif">
                <p className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#B9423A]/10 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#B9423A]" />
                  </span>
                  1 quyển PTB
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#B9423A]/10 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#B9423A]" />
                  </span>
                  1 kẹo mút
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#B9423A]/10 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#B9423A]" />
                  </span>
                  1 thư cảm ơn
                </p>
              </div>

              <button onClick={onGetStarted}
                className="cta-btn px-8 py-3.5 rounded-full text-white font-semibold text-lg relative z-10 hover:opacity-90 animate-pulse-glow"
                style={{
                  background: 'linear-gradient(135deg, #B9423A, #96332E)',
                  boxShadow: '0 8px 30px rgba(185, 66, 58, 0.4)',
                }}>
                Tạo sách ngay →
              </button>
            </div>

            {/* Right: Product showcase */}
            <div className="flex-1 flex items-center justify-center gap-6 animate-slide-right" style={{ animationDelay: '0.4s' }}>
              <div className="relative">
                <div className="absolute -top-10 -left-6 z-30">
                  <PriceTag price="249K" size="lg" />
                </div>
                <div className="flex gap-5 items-end">
                  <div className="animate-float-slow" style={{ animationDelay: '0s' }}>
                    <BlindBagCard imgUrl={loveImg} title="Begin again" subtitle="You have the courage to" />
                  </div>
                  <div className="animate-float-slow" style={{ animationDelay: '1s' }}>
                    <BlindBagCard imgUrl={hanoiImg} title="Always Love" subtitle="Museum of memories" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — Danh mục loại PTB
          ══════════════════════════════════════════════════════ */}
      <section id="categories" className="w-full py-24 relative overflow-hidden scroll-mt-24" style={{ background: '#FFFDF9' }}>
        <div className="absolute inset-0 pointer-events-none opacity-5 dot-pattern" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Section title */}
          <div className="reveal text-center mb-16">
            <p className="text-[#B9423A] text-sm tracking-[0.3em] uppercase mb-3 font-semibold">Bộ sưu tập sách</p>
            <h2
              className="text-[#3B2925] mb-3"
              style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: '700', letterSpacing: '-0.01em' }}
            >Danh mục loại PTB</h2>
            <p className="text-[#6B4B43] text-lg">Nhiều lựa chọn phù hợp với nhu cầu và ngân sách của bạn</p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { id: 1, title: 'PTB bìa mềm', description: 'Nhẹ nhàng, mỏng nhẹ, tinh tế. Dành cho các album ảnh thường ngày.', price: '245K', color: '#FFF', img: loveImg, secondImg: hanoiImg },
              { id: 2, title: 'PTB bìa cứng', description: 'Bìa cứng cáp, bền bỉ, sang trọng. Phù hợp làm quà lưu niệm lâu dài.', price: '375K', color: '#F4E5E6', img: hanoiImg, secondImg: familyImg },
              { id: 3, title: 'PTB bìa bồi liền mở phẳng', description: 'Trải rộng 180 độ không gáy, in sắc nét. Trải nghiệm xem ảnh trọn vẹn.', price: '399K', color: '#F0E5E7', img: familyImg, secondImg: loveImg },
            ].map((category) => (
              <div key={category.id}
                className="tier-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                onClick={onGetStarted}
                style={{
                  background: '#FFF8F1',
                  border: '1px solid #E6C7B8',
                  boxShadow: '0 10px 30px rgba(107, 75, 67, 0.05)',
                }}>
                <div>
                  {/* Price tag */}
                  <div className="flex justify-between items-center p-5 pb-2">
                    <PriceTag price={category.price} size="sm" />
                    <span className="text-[#6B4B43]/50 text-xs font-mono tracking-widest">#{String(category.id).padStart(2, '0')}</span>
                  </div>

                  {/* Book preview */}
                  <div className="px-5 mb-4">
                    <div className="book-mockup flex rounded-lg overflow-hidden shadow-md"
                      style={{ border: '1px solid #E6C7B8' }}>
                      {/* Left page */}
                      <div className="w-1/2 h-44 overflow-hidden relative" style={{ backgroundColor: category.color }}>
                        <img src={category.img} className="w-full h-full object-cover img-zoom" alt="" />
                        <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/15 to-transparent" />
                      </div>
                      {/* Right page */}
                      <AutoFlipRightPage
                        bgColor={category.id === 3 ? '#68252C' : '#FFF'}
                        pages={
                          category.id === 1 ? [
                            <div className="p-4 h-full bg-white"><p className="font-handwriting text-3xl text-pink-500 mb-2">Begin again</p><img src={hanoiImg} className="w-full h-24 object-cover rounded shadow" alt="" /></div>,
                            <div className="p-4 h-full bg-white"><p className="font-handwriting text-2xl text-rose-500 mb-2">My story</p><img src={loveImg} className="w-full h-24 object-cover rounded shadow" alt="" /></div>,
                          ] : category.id === 2 ? [
                            <div className="grid grid-cols-2 gap-2 p-3 h-full bg-white"><img src={hanoiImg} className="w-full h-20 object-cover rounded" alt="" /><img src={familyImg} className="w-full h-20 object-cover rounded" alt="" /><img src={loveImg} className="w-full h-20 object-cover rounded" alt="" /><div className="w-full h-20 bg-gray-100 rounded" /></div>,
                            <div className="p-4 h-full bg-white flex items-center justify-center"><img src={familyImg} className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-gray-100" alt="" /></div>,
                          ] : [
                            <div className="p-5 h-full bg-[#68252C]"><div className="w-full h-full bg-[#E5D2BA] shadow-inner p-3 rounded"><p className="text-xs font-serif text-center text-[#E5D2BA]">Mở phẳng 180°...</p></div></div>,
                            <div className="p-5 h-full bg-[#68252C]"><div className="w-full h-full bg-[#E5D2BA] shadow-inner p-3 rounded flex justify-center items-center"><img src={loveImg} className="w-20 h-20 rounded-full border-2 border-white" alt="" /></div></div>,
                          ]
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 pt-0 text-center">
                  <h4 className="font-serif text-2xl text-[#3B2925] mb-2 group-hover:text-[#B9423A] transition-colors duration-300 font-bold">
                    {category.title}
                  </h4>
                  <p className="text-[#6B4B43] text-sm mb-4 leading-relaxed">{category.description}</p>
                  <button onClick={(e) => { e.stopPropagation(); onGetStarted(); }}
                    className="w-full py-2.5 rounded-xl border border-[#B9423A] text-[#B9423A] bg-white hover:bg-[#B9423A] hover:text-white font-semibold transition duration-300">
                    Chọn loại này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — Chủ đề
          ══════════════════════════════════════════════════════ */}
      <section id="themes" className="w-full py-24 relative overflow-hidden scroll-mt-24" style={{ background: '#F7E2D4' }}>
        <div className="absolute inset-0 pointer-events-none opacity-5 dot-pattern" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Section title */}
          <div className="reveal text-center mb-16">
            <p className="text-[#B9423A] text-sm tracking-[0.3em] uppercase mb-3 font-semibold">Chủ đề thiết kế</p>
            <h2
              className="text-[#3B2925] mb-3"
              style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: '700', letterSpacing: '-0.01em' }}
            >Chủ đề</h2>
            <p className="text-[#6B4B43] text-lg">Mỗi chủ đề đều mang một câu chuyện và xúc cảm trọn vẹn riêng biệt</p>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'love', title: 'Tình yêu', emoji: '💕', description: 'Hâm nóng tình cảm với câu chuyện lãng mạn.', color: 'from-pink-400 to-rose-500', image: loveImg },
              { id: 'friends', title: 'Bạn bè', emoji: '🎉', description: 'Lưu giữ kỷ niệm thanh xuân, bạn bè thân thương.', color: 'from-cyan-400 to-blue-400', image: hanoiImg },
              { id: 'family', title: 'Gia đình', emoji: '👨‍👩‍👧‍👦', description: 'Ấm áp tình thân, những khoảnh khắc sum vầy.', color: 'from-orange-400 to-rose-400', image: familyImg },
              { id: 'travel', title: 'Du lịch', emoji: '✈️', description: 'Ghi lại hành trình khám phá những vùng đất mới.', color: 'from-emerald-400 to-teal-500', image: hanoiImg },
              { id: 'graduation', title: 'Tốt nghiệp', emoji: '🎓', description: 'Kỷ niệm ngày tốt nghiệp, bạn bè và mái trường.', color: 'from-indigo-400 to-purple-500', image: familyImg },
              { id: 'birthday', title: 'Sinh nhật', emoji: '🎂', description: 'Món quà bất ngờ dành riêng cho ngày tuổi mới.', color: 'from-amber-400 to-orange-500', image: loveImg },
            ].map((theme) => (
              <div key={theme.id}
                className="blind-box-card bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                onClick={onGetStarted}
                style={{
                  border: '1px solid #E6C7B8',
                  transition: 'all 0.4s ease',
                }}>
                <div>
                  {/* Top stripe */}
                  <div className="h-2 bg-[#B9423A]" />

                  <div className="p-6">
                    <div className="w-full h-44 rounded-xl overflow-hidden mb-4 shadow-inner relative">
                      <img src={theme.image} className="w-full h-full object-cover img-zoom" alt={theme.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3B2925]/60 to-transparent flex items-end p-4">
                        <span className="text-4xl filter drop-shadow-md">{theme.emoji}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl text-[#3B2925] font-bold mb-2 group-hover:text-[#B9423A] transition-colors duration-300">
                      {theme.title}
                    </h3>
                    <p className="text-[#6B4B43] text-sm leading-relaxed">{theme.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button onClick={(e) => { e.stopPropagation(); onGetStarted(); }}
                    className="w-full py-2 rounded-xl bg-[#B9423A] text-white hover:bg-[#96332E] font-semibold transition duration-300 text-sm">
                    Dùng chủ đề này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider" />
      </div>

    </div>
  );
}