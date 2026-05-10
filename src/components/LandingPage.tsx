import { Heart, BookOpen, Sparkles, Users, Star, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

export function LandingPage({ onLogin, onGetStarted }: LandingPageProps) {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const themes = [
    {
      id: 'family',
      title: 'Gia đình',
      description: 'Món quà ý nghĩa cho người thân yêu',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-orange-400 to-rose-400',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop'
    },
    {
      id: 'friends',
      title: 'Bạn bè',
      description: 'Kỷ niệm những khoảnh khắc đáng nhớ',
      icon: '🎉',
      color: 'from-cyan-400 to-blue-400',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop'
    },
    {
      id: 'love',
      title: 'Người yêu',
      description: 'Lời yêu thương chân thành nhất',
      icon: '💕',
      color: 'from-pink-400 to-rose-500',
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=400&fit=crop'
    },
    {
      id: 'memories',
      title: 'Kỷ niệm',
      description: 'Lưu giữ những ký ức đẹp',
      icon: '📸',
      color: 'from-purple-400 to-indigo-400',
      image: 'https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=600&h=400&fit=crop'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Chọn mẫu',
      description: 'Chọn một trong 20+ mẫu sách đẹp theo chủ đề',
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      number: '02',
      title: 'Thiết kế',
      description: 'Tuỳ chỉnh nội dung, ảnh, màu sắc theo ý bạn',
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      number: '03',
      title: 'Xem 3D & Đặt hàng',
      description: 'Xem trước 3D như sách thật và đặt in ngay',
      icon: <Heart className="w-6 h-6" />
    }
  ];

  const features = [
    'Hơn 20 mẫu thiết kế chuyên nghiệp',
    'Chỉnh sửa 100% nội dung',
    'Upload ảnh không giới hạn',
    'Xem trước 3D chân thực',
    'In chất lượng cao, giao tận nhà',
    'Hỗ trợ gói quà miễn phí'
  ];

  const templates = [
    {
      id: 1,
      name: 'Gia đình ấm áp',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=500&fit=crop',
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'Tình bạn mãi mãi',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop',
      badge: 'New'
    },
    {
      id: 3,
      name: 'Yêu thương vô bờ',
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=500&fit=crop',
      badge: 'Popular'
    },
    {
      id: 4,
      name: 'Kỷ niệm đáng nhớ',
      image: 'https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=400&h=500&fit=crop',
      badge: 'Bestseller'
    }
  ];

  const testimonials = [
    {
      name: 'Nguyễn Minh Anh',
      role: 'Quà tặng cho mẹ',
      content: 'Mẹ rất thích món quà này! Chất lượng in đẹp, nội dung cảm động. Cảm ơn Bookify!',
      avatar: 'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwc21pbGluZ3xlbnwxfHx8fDE3NjkxMzUzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5
    },
    {
      name: 'Trần Hoàng Long',
      role: 'Quà sinh nhật bạn thân',
      content: 'Giao diện dễ dùng, mẫu đẹp. Bạn mình cảm động đến khóc khi nhận quà.',
      avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjkwOTUxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5
    },
    {
      name: 'Lê Thị Hương',
      role: 'Quà kỷ niệm cho người yêu',
      content: 'Tốt nhất từ trước đến nay! Thiết kế 3D rất ấn tượng. Sẽ order thêm.',
      avatar: 'https://images.unsplash.com/photo-1617188017502-fc2882a4a09f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGFzaWFuJTIwd29tYW58ZW58MXx8fHwxNzY5MDUxNzg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-handwriting gradient-text">Bookify</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#templates" className="text-gray-700 hover:text-pink-600 font-medium transition">
                Templates
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-pink-600 font-medium transition">
                Cách thức
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-pink-600 font-medium transition">
                Giá cả
              </a>
              <a href="#faq" className="text-gray-700 hover:text-pink-600 font-medium transition">
                FAQ
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={onLogin} 
                className="relative z-50 px-6 py-2.5 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl font-medium transition-all cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                Đăng nhập
              </button>
              <button onClick={onGetStarted} className="btn btn-primary">
                Tạo sách ngay
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-30"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-6 animate-fade-in">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Được tin dùng bởi 10,000+ người</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Tạo một cuốn sách
              <br />
              <span className="font-handwriting gradient-text">dành riêng cho người bạn yêu thương</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
              Thiết kế sách quà tặng cá nhân hoá với hơn 20 mẫu đẹp, 
              chỉnh sửa dễ dàng, xem trước 3D và in chất lượng cao
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <button onClick={onGetStarted} className="btn btn-primary btn-lg">
                Bắt đầu miễn phí
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn btn-outline btn-lg">
                Xem mẫu sách
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Không cần thẻ tín dụng</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Dùng thử miễn phí</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Giao hàng toàn quốc</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-pink-200/50 to-transparent blur-3xl"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-4 max-w-5xl mx-auto overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=600&fit=crop"
                alt="Bookify Editor Preview"
                className="w-full rounded-2xl"
              />
              <div className="absolute top-8 right-8 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Dễ sử dụng</p>
                    <p className="text-sm text-gray-500">Như Canva</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Chỉ cần <span className="font-handwriting gradient-text">3 bước đơn giản</span>
            </h2>
            <p className="text-xl text-gray-600">Tạo cuốn sách của bạn trong vài phút</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="card p-8 text-center card-hover">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  
                  <div className="text-6xl font-bold text-pink-100 mb-4">{step.number}</div>
                  
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-pink-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="section-padding bg-gradient-pastel">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Chọn <span className="font-handwriting gradient-text">chủ đề phù hợp</span>
            </h2>
            <p className="text-xl text-gray-600">Mỗi chủ đề đều có nội dung và mẫu riêng</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className="card card-hover cursor-pointer overflow-hidden group"
                onMouseEnter={() => setActiveTheme(theme.id)}
                onMouseLeave={() => setActiveTheme(null)}
              >
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
                  <p className="text-gray-600 text-sm">{theme.description}</p>
                  
                  <button className="mt-4 w-full btn btn-outline btn-sm group-hover:btn-primary">
                    Xem mẫu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="font-handwriting gradient-text">Mẫu sách nổi bật</span>
            </h2>
            <p className="text-xl text-gray-600">Được thiết kế bởi chuyên gia, tuỳ chỉnh dễ dàng</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="card card-hover overflow-hidden group cursor-pointer">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`badge ${
                        template.badge === 'Bestseller'
                          ? 'badge-bestseller'
                          : template.badge === 'New'
                          ? 'badge-new'
                          : 'badge-popular'
                      }`}
                    >
                      {template.badge}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <button className="w-full btn btn-sm btn-outline group-hover:btn-primary">
                    Dùng mẫu này
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button onClick={onGetStarted} className="btn btn-primary btn-lg">
              Xem tất cả 20+ mẫu
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Mọi thứ bạn cần để tạo
                <span className="font-handwriting gradient-text block mt-2">cuốn sách hoàn hảo</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button onClick={onGetStarted} className="btn btn-primary btn-lg">
                Bắt đầu ngay
                <Sparkles className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 to-purple-300 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop"
                alt="Beautiful book"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Khách hàng <span className="font-handwriting gradient-text">yêu thích Bookify</span>
            </h2>
            <p className="text-xl text-gray-600">Hàng ngàn người đã tạo món quà ý nghĩa</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sẵn sàng tạo cuốn sách của bạn?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bắt đầu miễn phí, không cần thẻ tín dụng
          </p>
          
          <button onClick={onGetStarted} className="btn bg-white text-pink-600 hover:bg-gray-50 btn-lg shadow-xl">
            Tạo sách ngay
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold font-handwriting">Bookify</span>
              </div>
              <p className="text-gray-400">
                Tạo sách quà tặng cá nhân hoá với tình yêu thương
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Templates</a></li>
                <li><a href="#" className="hover:text-white transition">Editor</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Công ty</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Liên hệ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Pháp lý</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Chính sách</a></li>
                <li><a href="#" className="hover:text-white transition">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white transition">Bảo mật</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Bookify. All rights reserved. Made with ❤️ in Vietnam</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
