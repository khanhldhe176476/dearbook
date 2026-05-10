import { useState, useEffect, useRef } from 'react';
import { Heart, BookOpen, Sparkles, Package, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import hanoiImg   from 'figma:asset/d7b475113023469e96cb19c4ee78d3ffb04dfa29.png';
import cinemaImg  from 'figma:asset/7d3114f86616dc8bd97952f37820bf5ae13ce4de.png';
import familyImg  from 'figma:asset/03ef3be4e5a9d3f6b0010356d756eeaf3c80bb4c.png';
import friendsImg from 'figma:asset/1463ab1e93bb2018a0697895e53bc29cfb8a8ea5.png';
import loveImg    from 'figma:asset/4f81f59175575b9ebba78ca1d45401cd109f1941.png';

interface HomePageProps {
  onGetStarted: () => void;
}

// ── Auto-cycling stacked photo carousel ─────────────────────────────────────
interface Photo { url: string; caption: string; }

function BookPhotoCarousel({ photos, interval = 3000 }: { photos: Photo[]; interval?: number }) {
  const [active, setActive]   = useState(0);
  const [prev,   setPrev]     = useState<number | null>(null);
  const [dir,    setDir]      = useState<1 | -1>(1);
  const [anim,   setAnim]     = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = photos?.length ?? 0;

  const go = (next: number, direction: 1 | -1) => {
    if (anim || total === 0) return;
    setPrev(active);
    setDir(direction);
    setActive(next);
    setAnim(true);
    setTimeout(() => { setPrev(null); setAnim(false); }, 480);
  };

  const goNext = () => go((active + 1) % total, 1);
  const goPrev = () => go((active - 1 + total) % total, -1);

  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(goNext, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, anim, interval, total]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (total > 1) timerRef.current = setInterval(goNext, interval);
  };

  const handlePrev = () => { resetTimer(); goPrev(); };
  const handleNext = () => { resetTimer(); goNext(); };

  // only show as many stack cards as there are OTHER photos
  const allOffsets = [
    { x: 8,  y: -8,  rot:  3, scale: 0.97 },
    { x: 16, y: -16, rot:  6, scale: 0.94 },
    { x: 22, y: -22, rot:  9, scale: 0.91 },
  ];
  const stackOffsets = total > 1 ? allOffsets.slice(0, Math.min(allOffsets.length, total - 1)) : [];

  if (total === 0 || !photos || !photos[active]) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 360 }}>
      {/* ── stacked cards (decorative) ── */}
      {total > 1 && stackOffsets.map((s, i) => {
        const photoIndex = (active + i + 1) % photos.length;
        const photo = photos[photoIndex];
        if (!photo) return null;
        return (
          <div
            key={i}
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg) scale(${s.scale})`,
              zIndex: stackOffsets.length - i,
              boxShadow: '0 4px 20px rgba(60,46,40,0.10)',
            }}
          >
            <img
              src={photo.url}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: `rgba(235,230,224,${0.55 + i * 0.15})` }} />
          </div>
        );
      })}

      {/* ── exiting photo ── */}
      {prev !== null && photos[prev] && (
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            zIndex: 20,
            transform: anim ? `translateX(${dir * -110}%) rotate(${dir * -5}deg)` : 'translateX(0)',
            opacity: anim ? 0 : 1,
            transition: 'transform 480ms cubic-bezier(0.4,0,0.2,1), opacity 480ms ease',
          }}
        >
          <img src={photos[prev].url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* ── active photo ── */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          zIndex: 25,
          transform: anim ? 'translateX(0) rotate(0deg)' : `translateX(${dir * 12}px)`,
          opacity: 1,
          transition: 'transform 480ms cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 12px 40px rgba(60,46,40,0.18)',
        }}
      >
        <img
          src={photos[active].url}
          alt={photos[active].caption}
          className="w-full h-full object-cover"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(to top, rgba(28,23,21,0.55) 0%, transparent 55%)' }} />
        {/* caption */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.92)' }}>
            {photos[active].caption}
          </p>
        </div>
      </div>

      {/* ── nav arrows (only show if multiple photos) ── */}
      {total > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)', top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: '#3A2E28' }} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)', top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: '#3A2E28' }} />
          </button>
        </>
      )}

      {/* ── dot indicators (only show if multiple photos) ── */}
      {total > 1 && (
        <div className="absolute bottom-4 right-5 z-30 flex items-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => { resetTimer(); go(i, i > active ? 1 : -1); }}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === active ? '18px' : '6px',
                height: '6px',
                background: i === active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
              }}
            />
          ))}
        </div>
      )}

      {/* ── photo count (only show if multiple photos) ── */}
      {total > 1 && (
        <div
          className="absolute top-4 right-4 z-30 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: 'rgba(28,23,21,0.45)', backdropFilter: 'blur(4px)', color: 'rgba(255,255,255,0.85)' }}
        >
          {active + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function HomePage({ onGetStarted }: HomePageProps) {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const navItems = [
    { id: 'museum',    label: 'MUSEUM of MEMORIES' },
    { id: 'photobook', label: 'Photobook' },
    { id: 'prints',    label: 'Ảnh thuận' },
    { id: 'frames',    label: 'Khung ảnh' },
    { id: 'products',  label: 'Sản phẩm lẻ' },
    { id: 'checkout',  label: 'Thanh toán' },
  ];

  const products = [
    {
      id: 1,
      price: '299k',
      title: 'Tier 3',
      pages: '10 trang + 2 trang bìa',
      size: '14x18cm',
      paper: 'Giấy Couche 160gsm',
      photos: [
        { url: familyImg, caption: 'Family — Gia đình là tất cả 👨‍👩‍👧‍👦' },
        { url: hanoiImg,  caption: 'Hanoi, Việt Nam 🇻🇳' },
        { url: friendsImg, caption: 'Friends — Những người bạn tuyệt vời 💛' },
      ],
    },
    {
      id: 2,
      price: '350k',
      title: 'Love book',
      subtitle: '18 trang',
      tierLabel: 'Tier 3',
      pages: '18 trang + 2 trang bìa',
      size: '14x18cm',
      paper: 'Giấy Couche 160gsm',
      photos: [
        { url: loveImg,    caption: 'My Love — Tình yêu của tôi 💕' },
        { url: cinemaImg,  caption: 'Chillbooth Cinema 🎬' },
        { url: familyImg,  caption: 'Family Moments — Khoảnh khắc gia đình 🏡' },
      ],
    },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FAFAF8 0%, #F5F2EE 50%, #EDE9E3 100%)' }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #DDD8D0 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Warm ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(200,175,155,0.18) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(180,160,140,0.14) 0%, transparent 70%)' }} />

      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="relative z-20 sticky top-0 border-b"
        style={{
          background: 'rgba(250,250,248,0.85)',
          backdropFilter: 'blur(16px)',
          borderColor: '#DDD8D0',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-xl font-bold tracking-widest"
            style={{ color: '#3A2E28', letterSpacing: '0.15em' }}
          >
            GIFT BOX
          </h1>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
                className="text-sm font-medium transition-all duration-200"
                style={{ color: hoveredNav === item.id ? '#3A2E28' : '#7A6F66' }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={onGetStarted}
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
            style={{ background: '#3A2E28', color: '#FAFAF8', border: '1px solid #3A2E28' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1C1715'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#3A2E28'; }}
          >
            Đăng nhập
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────── */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-14">

          {/* Title */}
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: '#EDE9E3', color: '#7A6F66', border: '1px solid #DDD8D0' }}
            >
              <Sparkles className="w-3 h-3" />
              Sách quà tặng cá nhân hóa
            </div>
            <h2
              className="font-handwriting text-6xl md:text-7xl mb-4"
              style={{ color: '#3A2E28' }}
            >
              DearBook
            </h2>
            <p className="text-lg" style={{ color: '#7A6F66', letterSpacing: '0.03em' }}>
              Tạo kỷ niệm thành cuốn sách đẹp · In chất lượng cao · Giao tận nơi
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <div
                  className="relative rounded-3xl p-8 border transition-all duration-300 hover:shadow-xl"
                  style={{
                    background: 'rgba(255,255,255,0.80)',
                    backdropFilter: 'blur(12px)',
                    borderColor: '#DDD8D0',
                    boxShadow: '0 4px 24px rgba(60,46,40,0.06)',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = '#9B9088')}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = '#DDD8D0')}
                >
                  {/* Price Badge */}
                  <div className="absolute -top-6 -left-6 z-10">
                    <div className="relative w-28 h-28">
                      <svg viewBox="0 0 200 200" className="w-full h-full"
                           style={{ filter: 'drop-shadow(0 4px 12px rgba(60,46,40,0.18))' }}>
                        <circle cx="100" cy="100" r="90" fill="#3A2E28" />
                        {[...Array(12)].map((_, i) => {
                          const angle = (i * 30 * Math.PI) / 180;
                          return (
                            <circle key={i}
                              cx={100 + 90 * Math.cos(angle)}
                              cy={100 + 90 * Math.sin(angle)}
                              r="15" fill="#1C1715" />
                          );
                        })}
                        <circle cx="100" cy="100" r="75" fill="#F5F2EE" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold" style={{ color: '#3A2E28' }}>
                          {product.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Photo Carousel ── */}
                  <div
                    className="relative mb-6 rounded-2xl overflow-visible"
                    style={{ height: '380px' }}
                  >
                    <BookPhotoCarousel photos={product.photos} interval={4500 + product.id * 500} />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    {product.subtitle ? (
                      <div className="flex items-center gap-3">
                        <h3 className="font-handwriting text-4xl" style={{ color: '#3A2E28' }}>
                          {product.title}
                        </h3>
                        <span style={{ color: '#9B9088' }}>{product.subtitle}</span>
                      </div>
                    ) : (
                      <h3 className="font-handwriting text-4xl" style={{ color: '#3A2E28' }}>
                        {product.title}
                      </h3>
                    )}

                    {product.tierLabel && (
                      <p className="text-sm" style={{ color: '#9B9088' }}>{product.tierLabel}</p>
                    )}

                    <div className="pt-4 space-y-1" style={{ borderTop: '1px solid #DDD8D0' }}>
                      <p className="text-sm" style={{ color: '#5A5049' }}>
                        {product.pages}, {product.size}
                      </p>
                      <p className="text-sm" style={{ color: '#9B9088' }}>{product.paper}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Package className="w-4 h-4" style={{ color: '#9B9088' }} />
                      <span className="text-xs" style={{ color: '#9B9088' }}>Kèm hộp đựng cao cấp</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mb-16">
            <button
              onClick={onGetStarted}
              className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-full transition-all duration-300 hover:-translate-y-1"
              style={{
                background: '#3A2E28',
                color: '#FAFAF8',
                boxShadow: '0 8px 32px rgba(60,46,40,0.22)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#1C1715';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(28,23,21,0.30)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#3A2E28';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(60,46,40,0.22)';
              }}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-lg font-semibold">Tạo sách của bạn ngay</span>
              <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
            <p className="mt-5 text-sm" style={{ color: '#9B9088' }}>
              Chỉ mất vài phút để tạo món quà ý nghĩa
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Heart,    title: '4 Chủ đề',    desc: 'Love · Family · Birthday · Friendship' },
              { icon: BookOpen, title: 'Dễ dàng tạo', desc: 'Chọn template và chỉnh sửa ngay' },
              { icon: Sparkles, title: 'Quà ý nghĩa', desc: 'In chất lượng cao, giao tận nơi' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  style={{
                    background: 'rgba(255,255,255,0.70)',
                    backdropFilter: 'blur(8px)',
                    borderColor: '#DDD8D0',
                    boxShadow: '0 2px 12px rgba(60,46,40,0.04)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: '#EDE9E3' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: '#7A6F66' }} />
                  </div>
                  <h3 className="mb-1" style={{ color: '#3A2E28', fontSize: '1rem', fontWeight: 600 }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: '#9B9088' }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Mobile CTA */}
      <button
        onClick={onGetStarted}
        className="md:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-4 rounded-full shadow-xl"
        style={{ background: '#3A2E28', color: '#FAFAF8' }}
      >
        <BookOpen className="w-5 h-5" />
        <span className="font-semibold">Bắt đầu</span>
      </button>

      {/* Footer */}
      <footer
        className="relative z-10 border-t mt-16"
        style={{
          background: 'rgba(245,242,238,0.80)',
          backdropFilter: 'blur(12px)',
          borderColor: '#DDD8D0',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm" style={{ color: '#9B9088' }}>
            © 2026 DearBook – Thiết kế sách cá nhân hóa với tình yêu
            <span style={{ color: '#8C6E5D' }}> ♥</span>
          </p>
        </div>
      </footer>
    </div>
  );
}