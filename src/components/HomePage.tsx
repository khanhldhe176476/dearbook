import { useState, useEffect } from 'react';
import hanoiImg from 'figma:asset/d7b475113023469e96cb19c4ee78d3ffb04dfa29.png';
import loveImg from 'figma:asset/4f81f59175575b9ebba78ca1d45401cd109f1941.png';
import familyImg from 'figma:asset/03ef3be4e5a9d3f6b0010356d756eeaf3c80bb4c.png';
import { InteractiveLogoutButton } from './InteractiveLogoutButton';

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
    0%, 100% { box-shadow: 0 0 20px rgba(175, 91, 106, 0.3); }
    50% { box-shadow: 0 0 40px rgba(175, 91, 106, 0.6); }
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
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
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
    box-shadow: 0 25px 60px -12px rgba(0,0,0,0.25), 0 0 30px rgba(175, 91, 106, 0.15);
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
    background: linear-gradient(90deg, #CD8F9A, #AF5B6A, #CD8F9A);
    transition: all 0.5s ease;
    transform: translateX(-50%);
    border-radius: 2px;
  }
  .tier-card:hover {
    transform: translateY(-16px);
    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.4), 0 0 40px rgba(175, 91, 106, 0.2);
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
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.35);
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
    background: linear-gradient(135deg, rgba(205,143,154,0.4), transparent, rgba(175,91,106,0.4));
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }
  .blind-box-card:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3);
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
    background: linear-gradient(90deg, #AF5B6A, #CD8F9A);
    transition: width 0.3s ease;
    border-radius: 1px;
  }
  .nav-link:hover {
    color: #AF5B6A;
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
    box-shadow: 0 10px 30px rgba(175, 91, 106, 0.4);
  }
  .cta-btn:hover::before {
    width: 300px; height: 300px;
  }

  /* ── Shimmer text ── */
  .shimmer-text {
    background: linear-gradient(90deg, #AF5B6A, #CD8F9A, #D4A5B0, #CD8F9A, #AF5B6A);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  /* ── Glassmorphism ── */
  .glass {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  /* ── Photo strip hover ── */
  .photo-strip {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .photo-strip:hover {
    transform: rotate(0deg) translateY(-8px) !important;
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2);
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
    background: linear-gradient(90deg, transparent, rgba(175, 91, 106, 0.3), transparent);
    height: 1px;
  }

  /* ── Decorative dot pattern ── */
  .dot-pattern {
    background-image: radial-gradient(circle, rgba(175, 91, 106, 0.08) 1px, transparent 1px);
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
      {/* Chỉ đổi hình dạng tag: từ tròn sang tag hoa giống mẫu */}
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

const ProductImage = ({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) => (
  <div className={`overflow-hidden ${className}`}>
    <img src={src} className="w-full h-full object-cover img-zoom" alt={alt} />
  </div>
);

const BlindBagCard = ({ imgUrl, title, subtitle }: { imgUrl: string; title: string; subtitle: string }) => (
  <div className="blind-box-card w-52 bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer group"
    style={{ border: '1px solid rgba(205,143,154,0.2)' }}>
    {/* Top stripe */}
    <div className="h-2" style={{ background: 'linear-gradient(90deg, #AF5B6A, #CD8F9A, #AF5B6A)' }} />

    <div className="p-4 flex flex-col items-center">
      <div className="w-full h-36 rounded-xl overflow-hidden mb-3 shadow-inner"
        style={{ border: '4px solid #F3E9D7' }}>
        <img src={imgUrl} className="w-full h-full object-cover img-zoom" alt="" />
      </div>

      <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">{subtitle}</p>
      <p className="font-handwriting text-2xl text-[#9A3540] text-center leading-tight">{title}</p>
    </div>

    {/* Bottom stripe */}
    <div className="h-2" style={{ background: 'linear-gradient(90deg, #AF5B6A, #CD8F9A, #AF5B6A)' }} />
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
      <p className="font-handwriting text-[#D498A7] text-xs">dear<br />memories</p>
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
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden font-primary" style={{ background: '#FAFAF8' }}>
      <style>{styles}</style>

      {/* ── Navigation ── */}
      <nav className="glass sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">
          <div className="flex items-center" style={{ height: '58px', overflow: 'visible' }}>
            <img
              src="/logo.png"
              alt="dearmemories"
              className="object-contain block"
              style={{ height: '175px', margin: '-58.5px 0' }}
            />
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#555] text-sm font-medium">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-medium text-[#555] text-sm">Chào, <strong className="text-[#333]">{user.name}</strong></span>
                <button onClick={onGetStarted}
                  className="cta-btn bg-[#333] text-white px-5 py-2.5 rounded-full font-medium text-sm relative z-10">
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
                  className="cta-btn bg-[#333] text-white px-5 py-2.5 rounded-full font-medium text-sm relative z-10">
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — Hero: Túi mù Keycard
          ══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[620px] overflow-hidden flex items-center"
        style={{
          background: 'linear-gradient(160deg, #FDFBFB 0%, #F6F0ED 40%, #F3E6E8 100%)',
        }}>
        {/* Decorative circles */}
        <div className="absolute top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #CD8F9A, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #AF5B6A, transparent 70%)' }} />

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-8 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left content */}
            <div className="flex-1 animate-slide-left" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(175, 91, 106, 0.1)', border: '1px solid rgba(175, 91, 106, 0.2)' }}>
                <span className="w-2 h-2 rounded-full bg-[#AF5B6A] animate-pulse" />
                <span className="text-sm font-medium text-[#AF5B6A]">Sản phẩm hot</span>
              </div>

              <h1 className="font-serif text-6xl lg:text-7xl leading-[0.95] mb-6">
                <span className="text-[#333] block">GIFT</span>
                <span
                  className="shimmer-text block mt-1"
                  style={{
                    fontFamily: '"Great Vibes", cursive',
                    fontSize: 'clamp(4rem, 9vw, 8rem)',
                    lineHeight: 1,
                    WebkitTextFillColor: 'unset',
                    color: 'transparent',
                  }}
                >
                  Box
                </span>
              </h1>

              <h2
                className="text-[#AF5B6A] mb-6 rotate-[-1deg]"
                style={{
                  fontFamily: '"Great Vibes", cursive',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                }}
              >
                Túi mù Keycard
              </h2>

              <div className="space-y-3 text-[#5A3B36] text-lg mb-8">
                <p className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#AF5B6A]/10 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#AF5B6A]" />
                  </span>
                  1 Túi mù rỗng
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#AF5B6A]/10 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#AF5B6A]" />
                  </span>
                  1 Keycard mica + 2 ảnh in
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#AF5B6A]/10 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#AF5B6A]" />
                  </span>
                  Hộp quà + postcard tặng kèm
                </p>
              </div>

              <button onClick={onGetStarted}
                className="cta-btn px-8 py-3.5 rounded-full text-white font-semibold text-lg relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #AF5B6A, #9A3540)',
                  boxShadow: '0 8px 30px rgba(175, 91, 106, 0.4)',
                }}>
                Đặt hàng ngay →
              </button>
            </div>

            {/* Right: Product showcase */}
            <div className="flex-1 flex items-center justify-center gap-6 animate-slide-right" style={{ animationDelay: '0.4s' }}>
              <div className="relative">
                <div className="absolute -top-10 -left-6 z-30">
                  <PriceTag price="78K" size="lg" />
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
          SECTION 2 — Museum Box
          ══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[650px] overflow-hidden flex items-center"
        style={{ background: 'linear-gradient(160deg, #FDF9F7 0%, #F8EEF0 50%, #F3DDE1 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-10"
          style={{ background: '#CD8F9A', filter: 'blur(30px)' }} />
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full opacity-10"
          style={{ background: '#AF5B6A', filter: 'blur(40px)' }} />
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-8 py-20 relative z-10">
          {/* Header */}
          <div className="reveal flex flex-col md:flex-row items-center justify-center gap-6 mb-14">
            <div className="text-center md:text-right">
              <h3 className="font-handwriting text-6xl lg:text-7xl text-[#AF5B6A] leading-none mb-2">Museum Box</h3>
              <p className="font-serif text-xl text-[#555]">(trị giá 253k)</p>
            </div>
            <PriceTag price="208k" size="lg" />
          </div>

          {/* Product cards row */}
          <div className="reveal flex flex-col md:flex-row gap-8 items-center justify-center">

            {/* Frame Box */}
            <div className="product-card w-64 h-80 bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center cursor-pointer group"
              style={{ border: '1px solid rgba(205,143,154,0.15)' }}>
              <div className="w-full flex-1 rounded-xl overflow-hidden shadow-inner relative"
                style={{ border: '3px solid #F3E9D7' }}>
                <img src={loveImg} className="w-full h-full object-cover img-zoom" alt="" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3">
                  <span className="text-white text-sm font-medium">Frame Box Basic</span>
                </div>
              </div>
              <p className="font-handwriting text-2xl mt-4 text-[#333] font-bold group-hover:text-[#AF5B6A] transition-colors duration-300">
                you're my world.
              </p>
            </div>

            {/* Photo Strips */}
            <div className="flex gap-3 relative group">
              <PhotoBoothStrip images={[hanoiImg, hanoiImg]} rotation={-8} />
              <PhotoBoothStrip images={[familyImg, loveImg]} rotation={5} />
            </div>

            {/* Love Badge Set */}
            <div className="product-card w-56 h-72 bg-white rounded-2xl shadow-xl p-5 relative cursor-pointer group"
              style={{ border: '1px solid rgba(205,143,154,0.15)' }}>
              <h4 className="font-handwriting text-3xl text-[#AF5B6A] text-center mb-1 group-hover:scale-110 transition-transform duration-300">
                Love Badge
              </h4>
              <p className="text-[8px] text-center tracking-widest text-gray-400 mb-4 uppercase">Button Pin Set</p>

              <div className="relative h-40">
                {/* Badge circles */}
                <div className="absolute top-0 left-4 w-20 h-20 rounded-full shadow-xl overflow-hidden z-10 group-hover:translate-x-[-5px] group-hover:translate-y-[-3px] transition-transform duration-500"
                  style={{ border: '4px solid #F3E9D7' }}>
                  <img src={familyImg} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="absolute top-12 right-4 w-24 h-24 rounded-full shadow-xl overflow-hidden z-20 group-hover:translate-x-[5px] group-hover:translate-y-[-3px] transition-transform duration-500"
                  style={{ border: '4px solid #DFA3B1' }}>
                  <img src={loveImg} className="w-full h-full object-cover" alt="" />
                </div>

                {/* Stars */}
                <div className="absolute top-2 right-2 text-[#DFA3B1] text-xl group-hover:rotate-[72deg] transition-transform duration-700">★</div>
                <div className="absolute bottom-2 left-2 text-[#DFA3B1] text-lg group-hover:rotate-[144deg] transition-transform duration-700">★</div>
                <div className="absolute bottom-8 right-10 text-[#DFA3B1] text-sm group-hover:rotate-[216deg] transition-transform duration-700">★</div>
              </div>
            </div>
          </div>

          {/* Includes list */}
          <div className="reveal mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3 text-[#5A3B36] text-base font-medium">
            {['1 Frame Box basic', '2 Photobooth 10x15cm', '1 set Love Badge', 'Hộp quà + postcard tặng kèm'].map((item, i) => (
              <p key={i} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#AF5B6A]/10 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#AF5B6A]" />
                </span>
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — Love Book Tiers
          ══════════════════════════════════════════════════════ */}
      <section className="w-full py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #2D2D2D 0%, #363636 30%, #3D3D3D 100%)' }}>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* Glow accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(205,143,154,0.5), transparent)' }} />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Section title */}
          <div className="reveal text-center mb-16">
            <p className="text-[#CD8F9A] text-sm tracking-[0.3em] uppercase mb-3 font-medium">Sách quà tặng</p>
            <h2 className="font-handwriting text-6xl text-white mb-3">Love Book Collection</h2>
            <p className="text-gray-400 text-lg">12 trang • Couche 160gsm • 14×18cm</p>
          </div>

          {/* Tier cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 1, title: 'Tier 1', color: '#F4E5E6', accent: '#D44646', img: loveImg, secondImg: hanoiImg },
              { id: 2, title: 'Tier 2', color: '#FFF', accent: '#333', img: hanoiImg, secondImg: familyImg },
              { id: 3, title: 'Tier 3', color: '#E8EDE7', accent: '#445D40', img: familyImg, secondImg: loveImg },
              { id: 4, title: 'Tier 4', color: '#F0E5E7', accent: '#742D35', img: loveImg, secondImg: hanoiImg },
            ].map((tier) => (
              <div key={tier.id}
                className="tier-card rounded-2xl overflow-hidden cursor-pointer group"
                onClick={onGetStarted}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                }}>
                {/* Price tag */}
                <div className="flex justify-between items-center p-4 pb-2">
                  <PriceTag price="128k" size="sm" />
                  <span className="text-white/40 text-xs font-mono tracking-widest">#{String(tier.id).padStart(2, '0')}</span>
                </div>

                {/* Book preview */}
                <div className="px-4 mb-4">
                  <div className="book-mockup flex rounded-lg overflow-hidden shadow-lg"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* Left page */}
                    <div className="w-1/2 h-44 overflow-hidden relative" style={{ backgroundColor: tier.color }}>
                      <img src={tier.img} className="w-full h-full object-cover img-zoom" alt="" />
                      <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/15 to-transparent" />
                    </div>
                    {/* Right page */}
                    <AutoFlipRightPage
                      bgColor={tier.id === 4 ? '#68252C' : '#FFF'}
                      pages={
                        tier.id === 1 ? [
                          <div className="p-4 h-full bg-white"><p className="font-handwriting text-3xl text-red-500 mb-2">i love you</p><img src={hanoiImg} className="w-full h-24 object-cover rounded shadow" alt="" /></div>,
                          <div className="p-4 h-full bg-white"><p className="font-handwriting text-2xl text-pink-500 mb-2">my everything</p><img src={loveImg} className="w-full h-24 object-cover rounded shadow" alt="" /></div>,
                        ] : tier.id === 2 ? [
                          <div className="grid grid-cols-2 gap-2 p-3 h-full bg-white"><img src={hanoiImg} className="w-full h-20 object-cover rounded" alt="" /><img src={familyImg} className="w-full h-20 object-cover rounded" alt="" /><img src={loveImg} className="w-full h-20 object-cover rounded" alt="" /><div className="w-full h-20 bg-gray-100 rounded" /></div>,
                          <div className="p-4 h-full bg-white flex items-center justify-center"><img src={familyImg} className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-gray-100" alt="" /></div>,
                        ] : tier.id === 3 ? [
                          <div className="w-full h-full bg-[#677761] p-4 flex items-end"><p className="font-handwriting text-3xl text-white">Forever</p></div>,
                          <div className="w-full h-full bg-[#677761] p-4"><p className="font-serif text-white text-sm mt-4">Together we make a family.</p></div>,
                        ] : [
                          <div className="p-5 h-full bg-[#68252C]"><div className="w-full h-full bg-[#E5D2BA] shadow-inner p-3 rounded"><p className="text-xs font-serif text-center">Nơi lưu giữ tình yêu...</p></div></div>,
                          <div className="p-5 h-full bg-[#68252C]"><div className="w-full h-full bg-[#E5D2BA] shadow-inner p-3 rounded flex justify-center items-center"><img src={loveImg} className="w-20 h-20 rounded-full border-2 border-white" alt="" /></div></div>,
                        ]
                      }
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 pt-0 text-center">
                  <h4 className="font-handwriting text-3xl text-white mb-1 group-hover:text-[#CD8F9A] transition-colors duration-300">
                    {tier.title}
                  </h4>
                  <p className="text-gray-400 text-xs">Nhận in mẫu riêng của khách</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — Blind Box & Phụ kiện
          ══════════════════════════════════════════════════════ */}
      <section className="w-full py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #3D3D3D 0%, #363636 50%, #2D2D2D 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Section title */}
          <div className="reveal text-center mb-16">
            <p className="text-[#CD8F9A] text-sm tracking-[0.3em] uppercase mb-3 font-medium">Sưu tầm & trang trí</p>
            <h2 className="font-handwriting text-6xl text-white mb-3">Blind Box</h2>
            <p className="text-gray-400 text-lg">9.5 × 7.5 × 6.2cm • Giấy Couche cao cấp</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

            {/* Blind Box 1 — Dark Red */}
            <div className="reveal flex flex-col items-center">
              <div className="relative mb-8 w-full max-w-sm">
                <div className="absolute -top-4 -left-4 z-20"><PriceTag price="38k" size="sm" /></div>

                <div className="product-card rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ background: '#5E1921', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="p-6 flex flex-col items-center text-center">
                    <p className="font-serif text-[10px] text-white/50 tracking-widest uppercase mb-2">anh & em</p>
                    <p className="font-serif text-sm text-white tracking-[0.2em] mb-1 uppercase">Happy</p>
                    <p className="font-handwriting text-3xl text-white mb-3">anniversary</p>

                    <div className="w-36 h-28 rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-500"
                      style={{ border: '3px solid rgba(255,255,255,0.2)' }}>
                      <img src={familyImg} className="w-full h-full object-cover img-zoom" alt="" />
                    </div>

                    <p className="font-handwriting text-2xl text-red-400 group-hover:text-red-300 transition-colors duration-300">
                      all we need is Love
                    </p>
                  </div>
                </div>
              </div>

              <ul className="text-white/70 font-serif space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#CD8F9A]" /> Nhận từ 2 hộp</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#CD8F9A]" /> 4 hộp: 150k gồm đế</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#CD8F9A]" /> Cán màng +5k/box</li>
              </ul>
            </div>

            {/* Blind Box 2 — Cream */}
            <div className="reveal flex flex-col items-center" style={{ animationDelay: '0.2s' }}>
              <div className="relative mb-8 w-full max-w-sm">
                <div className="absolute -top-4 -left-4 z-20"><PriceTag price="38k" size="sm" /></div>

                <div className="product-card rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ background: '#FFF5E6', border: '1px solid rgba(141,52,62,0.1)' }}>
                  <div className="p-6 flex flex-col items-center text-center">
                    <p className="font-handwriting text-3xl text-[#8D343E] leading-none mb-1">Happy</p>
                    <p className="font-serif text-[10px] uppercase text-[#8D343E] tracking-widest mb-4">Birthday</p>

                    <div className="w-36 h-28 rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-500"
                      style={{ border: '3px solid rgba(141,52,62,0.15)' }}>
                      <img src={loveImg} className="w-full h-full object-cover img-zoom" alt="" />
                    </div>

                    {/* Mini calendar */}
                    <div className="w-full px-4 text-[#8D343E] text-[9px] font-serif">
                      <div className="grid grid-cols-7 text-center gap-y-1.5 gap-x-1">
                        {Array.from({ length: 30 }, (_, i) => (
                          <span key={i} className={`${i + 1 === 24 ? 'bg-[#8D343E] text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto' : ''}`}>
                            {i + 1}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="text-white/70 font-serif space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#CD8F9A]" /> Nhận từ 2 hộp</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#CD8F9A]" /> 4 hộp: 150k gồm đế</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#CD8F9A]" /> Cán màng +5k/box</li>
              </ul>
            </div>

          </div>

          {/* ── Accessories Row ── */}
          <div className="reveal border-t border-white/10 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                <h3 className="font-handwriting text-5xl text-white">Keycard</h3>
                <p className="text-white/50 font-serif text-sm">10.5 × 6.8cm</p>
              </div>
              <PriceTag price="35k" size="sm" />
              <div className="flex items-center gap-6">
                <h3 className="font-handwriting text-5xl text-white text-right">Love badge</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════ */}
      <footer className="py-12" style={{ background: '#1a1a1a' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center" style={{ height: '40px', overflow: 'visible' }}>
              <img src="/logo.png" alt="dearmemories" className="object-contain block"
                style={{ height: '120px', margin: '-40px 0', filter: 'brightness(1.5)' }} />
            </div>
            <p className="text-gray-500 text-sm">© 2026 Dear Memories. Made with ❤️ in Vietnam</p>
            <div className="flex gap-6 text-gray-500 text-sm">
              <a href="#" className="nav-link hover:text-white transition-colors">Chính sách</a>
              <a href="#" className="nav-link hover:text-white transition-colors">Điều khoản</a>
              <a href="#" className="nav-link hover:text-white transition-colors">Liên hệ</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}