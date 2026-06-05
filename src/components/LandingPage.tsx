import { useState } from 'react';
import hanoiImg from 'figma:asset/d7b475113023469e96cb19c4ee78d3ffb04dfa29.png';
import loveImg from 'figma:asset/4f81f59175575b9ebba78ca1d45401cd109f1941.png';
import familyImg from 'figma:asset/03ef3be4e5a9d3f6b0010356d756eeaf3c80bb4c.png';
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

interface LandingPageProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

export function LandingPage({ onLogin, onGetStarted }: LandingPageProps) {
  const [showAbout, setShowAbout] = useState(false);

  const handleNavClick = (targetId: string) => {
    setShowAbout(false);
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const photobookBoxItems = [
    {
      title: '1 quyển Photobook',
      description: 'Một cuốn photobook cá nhân hoá, lưu giữ ảnh và câu chuyện của bạn.',
      icon: <BookOpen className="w-7 h-7" />,
      emoji: '📖',
    },
    {
      title: '1 kẹo mút',
      description: 'Một món quà nhỏ dễ thương đi kèm để hộp quà thêm ngọt ngào.',
      icon: <Gift className="w-7 h-7" />,
      emoji: '🍭',
    },
    {
      title: '1 thư cảm ơn',
      description: 'Lá thư cảm ơn được đặt trong hộp, giúp món quà trở nên chỉn chu hơn.',
      icon: <Heart className="w-7 h-7" />,
      emoji: '💌',
    },
  ];

  const photobookCategories = [
    {
      id: 'hard-cover',
      title: 'Photobook bìa cứng',
      description: 'Cứng cáp, sang trọng, phù hợp làm quà kỷ niệm hoặc quà tặng đặc biệt.',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=700&fit=crop',
      badge: 'Sang trọng',
    },
    {
      id: 'soft-cover',
      title: 'Photobook bìa mềm',
      description: 'Nhẹ, dễ cầm, giá hợp lý, phù hợp cho các album ảnh nhỏ và quà tặng thân mật.',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=700&fit=crop',
      badge: 'Dễ chọn',
    },
    {
      id: 'layflat',
      title: 'Photobook bìa bồi liền mở phẳng',
      description: 'Mở phẳng đẹp mắt, xem ảnh toàn trang rõ hơn, phù hợp ảnh đôi và ảnh kỷ niệm lớn.',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=700&fit=crop',
      badge: 'Cao cấp',
    },
  ];

  const themes = [
    {
      id: 'family',
      title: 'Gia đình',
      description: 'Lưu giữ những khoảnh khắc ấm áp cùng người thân.',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-orange-400 to-rose-400',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
    },
    {
      id: 'friends',
      title: 'Bạn bè',
      description: 'Dành cho sinh nhật, tốt nghiệp và những chuyến đi cùng nhau.',
      icon: '🎉',
      color: 'from-cyan-400 to-blue-400',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
    },
    {
      id: 'love',
      title: 'Người yêu',
      description: 'Một món quà nhẹ nhàng cho các dịp kỷ niệm tình yêu.',
      icon: '💕',
      color: 'from-pink-400 to-rose-500',
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=400&fit=crop',
    },
    {
      id: 'memories',
      title: 'Kỷ niệm',
      description: 'Gom lại những bức ảnh đáng nhớ thành một cuốn sách riêng.',
      icon: '📸',
      color: 'from-purple-400 to-indigo-400',
      image: 'https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=600&h=400&fit=crop',
    },
  ];

  const features = [
    'Chọn loại Photobook phù hợp với nhu cầu',
    'Chỉnh sửa ảnh và nội dung dễ dàng',
    'Xem trước thiết kế trước khi in',
    'Đóng gói thành photobook box chỉn chu',
    'Có thư cảm ơn đi kèm',
    'Giao hàng toàn quốc',
  ];

  const pricingPlans = [
    {
      name: 'Bìa mềm',
      price: '149K',
      description: 'Phù hợp để tạo một cuốn Photobook nhỏ gọn, dễ tặng.',
      features: ['Chọn mẫu có sẵn', 'Tuỳ chỉnh nội dung', 'Upload ảnh', 'Xem trước bản thiết kế'],
      popular: false,
    },
    {
      name: 'Bìa cứng',
      price: '249K',
      description: 'Lựa chọn cân bằng cho sinh nhật, kỷ niệm và quà tặng đặc biệt.',
      features: ['Tất cả tính năng gói Bìa mềm', 'Bìa cứng chắc chắn', 'In chất lượng cao', 'Photobook box đầy đủ'],
      popular: true,
    },
    {
      name: 'Mở phẳng',
      price: '399K',
      description: 'Dành cho thành phẩm cao cấp, xem ảnh toàn trang đẹp hơn.',
      features: ['Tất cả tính năng gói Bìa cứng', 'Bìa bồi liền mở phẳng', 'Thiệp lời chúc riêng', 'Ưu tiên xử lý đơn hàng'],
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'Photobook box gồm những gì?',
      answer: 'Photobook box gồm 1 quyển Photobook, 1 kẹo mút và 1 thư cảm ơn được đóng gói chỉn chu.',
    },
    {
      question: 'Có những loại Photobook nào?',
      answer: 'Hiện có 3 loại chính: Photobook bìa cứng, Photobook bìa mềm và Photobook bìa bồi liền mở phẳng.',
    },
    {
      question: 'Tôi có được xem trước sách trước khi in không?',
      answer: 'Có. Bạn có thể xem trước thiết kế trước khi xác nhận đặt in.',
    },
    {
      question: 'Có giao hàng toàn quốc không?',
      answer: 'Có. DearMemories hỗ trợ giao sách đến nhiều tỉnh thành trên toàn quốc.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F1] text-[#3E2A25] scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFF8F1]/95 backdrop-blur-md border-b border-[#E7B8A8]">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setShowAbout(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-12 h-12 bg-[#B9423A] rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold font-handwriting text-[#B9423A]">dearmemories.</span>
            </div>

            <nav className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => {
                  setShowAbout(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className={`px-4 py-2 rounded-full text-[#5B4038] hover:bg-[#F7D9CF] hover:text-[#B9423A] font-semibold transition focus:outline-none ${showAbout ? 'text-[#B9423A] bg-[#F7D9CF]' : ''}`}
              >
                Giới thiệu
              </button>
              <button 
                onClick={() => handleNavClick('ptb-box')} 
                className="px-4 py-2 rounded-full text-[#5B4038] hover:bg-[#F7D9CF] hover:text-[#B9423A] font-semibold transition focus:outline-none"
              >
                Photobook Box
              </button>
              <button 
                onClick={() => handleNavClick('categories')} 
                className="px-4 py-2 rounded-full text-[#5B4038] hover:bg-[#F7D9CF] hover:text-[#B9423A] font-semibold transition focus:outline-none"
              >
                Danh mục
              </button>
              <button 
                onClick={() => handleNavClick('themes')} 
                className="px-4 py-2 rounded-full text-[#5B4038] hover:bg-[#F7D9CF] hover:text-[#B9423A] font-semibold transition focus:outline-none"
              >
                Chủ đề
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={onLogin}
                className="relative z-50 px-6 py-2.5 text-[#5B4038] hover:text-[#B9423A] hover:bg-[#F7D9CF] rounded-xl font-medium transition-all cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                Đăng nhập
              </button>
              <button onClick={onGetStarted} className="btn bg-[#B9423A] text-white hover:bg-[#96332E]">
                Tạo sách ngay
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showAbout && (
        <div 
          className="w-full min-h-[calc(100vh-180px)] py-16 px-4 md:px-8 relative overflow-hidden flex items-center justify-center"
          style={{
            background: 'linear-gradient(160deg, #FFF8F1 0%, #F7E2D4 40%, #FFF8F1 100%)',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-[-100px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #E6C7B8, transparent 70%)' }} />
          <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full opacity-8 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #B9423A, transparent 70%)' }} />
          <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(185, 66, 58, 0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

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
                  style={{ fontFamily: 'ui-serif, Georgia, serif' }}
                >
                  Every memory deserves a place to stay.
                </h3>
              </div>

              <div className="space-y-4 text-[#543A34] text-base leading-relaxed text-justify md:text-left" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
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
                  className="px-6 py-3 rounded-full text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition duration-300 shadow-md"
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
        {/* Section 1: Photobook Box */}
        <section id="ptb-box" className="section-padding relative overflow-hidden scroll-mt-24 bg-[#FFF8F1]">
        <div className="absolute inset-0 bg-[radial-gradient(#E9B7AA_1px,transparent_1px)] [background-size:24px_24px] opacity-45"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md mb-6 animate-fade-in">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-[#5B4038]">Photobook box dành cho những món quà kỷ niệm</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ fontFamily: '"Cooper BT", "Cooper Black", Georgia, serif' }}>
              <span style={{ whiteSpace: 'nowrap' }}>Photobook Box</span>
              <br />
              <span
                style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A', display: 'block', fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 1.1 }}
              >nhỏ xinh nhưng đầy cảm xúc</span>
            </h1>

            <p className="text-xl text-[#7A5C53] mb-8 max-w-2xl mx-auto animate-fade-in">
              Mỗi hộp quà gồm 1 quyển Photobook, 1 kẹo mút và 1 thư cảm ơn. Tất cả được chuẩn bị để người nhận cảm thấy món quà thật riêng và thật đáng nhớ.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <button onClick={onGetStarted} className="btn bg-[#B9423A] text-white hover:bg-[#96332E] btn-lg">
                Tạo Photobook của bạn
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => handleNavClick('categories')} className="btn border border-[#B9423A] text-[#B9423A] bg-white hover:bg-[#F7D9CF] btn-lg focus:outline-none">
                Xem danh mục Photobook
              </button>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {photobookBoxItems.map((item, index) => (
              <div key={index} className="card p-8 text-center card-hover relative overflow-hidden">
                <div className="absolute -top-8 -right-8 text-8xl opacity-10">{item.emoji}</div>
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#D86F62] to-[#B9423A] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  {item.icon}
                </div>
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-[#7A5C53] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Categories */}
      <section id="categories" className="section-padding bg-[#FFFDF9] scroll-mt-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Danh mục <span style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A' }}>loại Photobook</span>
            </h2>
            <p className="text-xl text-[#7A5C53] max-w-3xl mx-auto">
              Chọn kiểu photobook phù hợp với ngân sách, phong cách và mức độ chỉn chu bạn muốn dành cho món quà.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {photobookCategories.map((category) => (
              <div key={category.id} className="card card-hover overflow-hidden group cursor-pointer">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 rounded-full bg-white text-[#B9423A] text-sm font-semibold shadow-lg">
                      {category.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="text-sm text-white/90">{category.description}</p>
                  </div>
                </div>

                <div className="p-5">
                  <button onClick={onGetStarted} className="w-full btn border border-[#B9423A] text-[#B9423A] bg-white hover:bg-[#B9423A] hover:text-white">
                    Chọn loại này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Themes */}
      <section id="themes" className="section-padding bg-[#F7D9CF] scroll-mt-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Chọn <span style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A' }}>chủ đề phù hợp</span>
            </h2>
            <p className="text-xl text-[#7A5C53]">Mỗi chủ đề đều có cảm xúc, màu sắc và cách kể chuyện riêng</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {themes.map((theme) => (
              <div key={theme.id} className="card card-hover cursor-pointer overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={theme.image}
                    alt={theme.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${theme.color} opacity-60`}></div>
                  <div className="absolute top-4 left-4 text-4xl">{theme.icon}</div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{theme.title}</h3>
                  <p className="text-[#7A5C53] text-sm">{theme.description}</p>

                  <button onClick={onGetStarted} className="mt-4 w-full btn border border-[#B9423A] text-[#B9423A] bg-white hover:bg-[#B9423A] hover:text-white btn-sm">
                    Dùng chủ đề này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-[#FFFDF9]">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Mọi thứ bạn cần để tạo
                <span style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A', display: 'block', marginTop: '0.5rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}>một photobook box hoàn chỉnh</span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#5B4038]">{feature}</span>
                  </div>
                ))}
              </div>

              <button onClick={onGetStarted} className="btn bg-[#B9423A] text-white hover:bg-[#96332E] btn-lg">
                Bắt đầu ngay
                <Sparkles className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 to-purple-300 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop"
                alt="Photobook box"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding bg-[#FFF8F1]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Chọn gói <span style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A' }}>phù hợp với bạn</span>
            </h2>
            <p className="text-xl text-[#7A5C53]">Giá tham khảo theo loại PTB</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-8 relative card-hover ${plan.popular ? 'border-2 border-pink-400 shadow-2xl scale-[1.02]' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold shadow-lg">
                      Phổ biến nhất
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                <p className="text-[#7A5C53] mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-[#B9423A]">{plan.price}</span>
                  <span className="text-gray-500 ml-2">/ hộp</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[#5B4038]">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full btn ${plan.popular ? 'bg-[#B9423A] text-white hover:bg-[#96332E]' : 'border border-[#B9423A] text-[#B9423A] bg-white hover:bg-[#F7D9CF]'}`}
                >
                  Chọn gói này
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-[#FFFDF9]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-100 text-[#B9423A] mb-5">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Câu hỏi <span style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A' }}>thường gặp</span>
            </h2>
            <p className="text-xl text-[#7A5C53]">Một vài thông tin quan trọng trước khi bạn bắt đầu tạo Photobook</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-[#7A5C53] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#B9423A] text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sẵn sàng tạo photobook box của bạn?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Biến những kỷ niệm đẹp thành một hộp quà có thể cầm trên tay.
          </p>

          <button onClick={onGetStarted} className="btn bg-white text-[#B9423A] hover:bg-gray-50 btn-lg shadow-xl">
            Tạo sách ngay
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </section>

      </div>

      {/* Footer */}
      <footer className="bg-[#3E2A25] text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div 
                className="flex items-center gap-2 mb-4 cursor-pointer"
                onClick={() => {
                  setShowAbout(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#D86F62] to-[#B9423A] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold font-handwriting">dearmemories.</span>
              </div>
              <p className="text-[#E8D7CF]">
                Tạo photobook box cá nhân hoá với tình yêu thương.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-[#E8D7CF] flex flex-col items-start">
                <li><button onClick={() => handleNavClick('ptb-box')} className="hover:text-white transition focus:outline-none text-left">Photobook Box</button></li>
                <li><button onClick={() => handleNavClick('categories')} className="hover:text-white transition focus:outline-none text-left">Danh mục</button></li>
                <li><button onClick={() => handleNavClick('themes')} className="hover:text-white transition focus:outline-none text-left">Chủ đề</button></li>
                <li><button onClick={() => {
                  setShowAbout(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} className="hover:text-white transition focus:outline-none text-left">Giới thiệu</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Danh mục Photobook</h3>
              <ul className="space-y-2 text-[#E8D7CF] flex flex-col items-start">
                <li><button onClick={() => handleNavClick('categories')} className="hover:text-white transition focus:outline-none text-left">Bìa cứng</button></li>
                <li><button onClick={() => handleNavClick('categories')} className="hover:text-white transition focus:outline-none text-left">Bìa mềm</button></li>
                <li><button onClick={() => handleNavClick('categories')} className="hover:text-white transition focus:outline-none text-left">Bìa bồi liền mở phẳng</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-[#E8D7CF] flex flex-col items-start">
                <li><button onClick={() => handleNavClick('ptb-box')} className="hover:text-white transition focus:outline-none text-left">Trong hộp có gì?</button></li>
                <li><button onClick={() => handleNavClick('themes')} className="hover:text-white transition focus:outline-none text-left">Chọn chủ đề</button></li>
                <li><button onClick={() => handleNavClick('categories')} className="hover:text-white transition focus:outline-none text-left">Chọn loại Photobook</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#6B4A40] mt-8 pt-8 text-center text-[#E8D7CF]">
            <p>© 2026 DearMemories. All rights reserved. Made with ❤️ in Vietnam</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
