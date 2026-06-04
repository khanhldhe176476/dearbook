import { Instagram, Facebook, Mail, Phone, Clock, Send, Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('✨ Cảm ơn bạn đã đăng ký nhận bản tin từ dearmemories.!');
    setEmail('');
  };

  return (
    <footer 
      className="w-full relative overflow-hidden border-t border-[#e6e1da] py-16 md:py-24 mt-auto"
      style={{
        background: 'linear-gradient(180deg, #FFFDF9 0%, #F7F3EB 100%)',
      }}
    >
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
        }}
      />

      {/* Decorative top soft glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] rounded-full pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(232, 184, 155, 0.2) 0%, transparent 80%)',
          filter: 'blur(30px)'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pb-16">
          
          {/* Column 1: Brand section */}
          <div className="space-y-6 flex flex-col">
            <div className="flex flex-col">
              <span 
                className="text-[#3B2925] tracking-tight font-serif"
                style={{
                  fontFamily: '"Pinyon Script", "Great Vibes", cursive',
                  fontSize: '2.25rem',
                  lineHeight: 1.1
                }}
              >
                dearmemories.
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B9423A] font-semibold mt-1">
                Preserve the Unforgettable
              </span>
            </div>
            
            <p className="text-sm text-[#7A6F66] leading-relaxed font-serif italic pr-4">
              "Mỗi khoảnh khắc trôi qua đều là duy nhất. Chúng tôi giúp bạn đóng gói thanh xuân và gửi gắm yêu thương vào từng trang sách."
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="#instagram" 
                className="w-10 h-10 rounded-full border border-[#e6e1da] bg-white flex items-center justify-center text-[#7A6F66] hover:text-[#B9423A] hover:border-[#B9423A] hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a 
                href="#facebook" 
                className="w-10 h-10 rounded-full border border-[#e6e1da] bg-white flex items-center justify-center text-[#7A6F66] hover:text-[#B9423A] hover:border-[#B9423A] hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a 
                href="#email" 
                className="w-10 h-10 rounded-full border border-[#e6e1da] bg-white flex items-center justify-center text-[#7A6F66] hover:text-[#B9423A] hover:border-[#B9423A] hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                <Mail className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick navigation */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3B2925]">
              Khám Phá
            </h4>
            <ul className="space-y-3.5 text-sm text-[#7A6F66] font-serif">
              <li>
                <a href="#create" className="hover:text-[#B9423A] transition-colors flex items-center gap-1">
                  Tạo photobook
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-[#B9423A] transition-colors">
                  Mẫu thiết kế
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#B9423A] transition-colors">
                  Bảng giá dịch vụ
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-[#B9423A] transition-colors">
                  Blog truyền cảm hứng
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer support */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3B2925]">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-3.5 text-sm text-[#7A6F66] font-serif">
              <li>
                <a href="#shipping" className="hover:text-[#B9423A] transition-colors">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-[#B9423A] transition-colors">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#notes" className="hover:text-[#B9423A] transition-colors">
                  Lưu ý đặt photobook
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#B9423A] transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-[#B9423A] transition-colors">
                  Liên hệ hỗ trợ 24/7
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3B2925]">
              Kết Nối & Bản Tin
            </h4>
            
            <div className="space-y-3 text-xs text-[#7A6F66] font-serif">
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B9423A]" />
                <span>hello@dearmemories.vn</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B9423A]" />
                <span className="font-semibold text-[#3B2925]">Hotline: 1900 8888</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#B9423A]" />
                <span>Giờ làm việc: 8:00 - 21:00 hàng ngày</span>
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2 flex flex-col gap-2.5">
              <p className="text-[11px] text-[#7A6F66] leading-relaxed">
                Đăng ký nhận thông tin ưu đãi & cảm hứng thiết kế mới nhất.
              </p>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-full text-xs outline-none border border-[#e6e1da] bg-white/60 focus:bg-white focus:border-[#B9423A] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 w-9 h-9 rounded-full bg-[#3B2925] text-white flex items-center justify-center hover:bg-[#B9423A] transition-all duration-300"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-[#e6e1da] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#7A6F66] flex items-center gap-1 font-serif">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-sans font-semibold text-[#3B2925]">dearmemories.</span>
            <span>All rights reserved. Made with</span>
            <Heart className="w-3 h-3 text-[#B9423A] fill-[#B9423A]" />
          </p>
          
          <div className="flex items-center gap-6 text-xs text-[#7A6F66]">
            <a href="#privacy" className="hover:text-[#B9423A] transition-colors">
              Chính sách bảo mật
            </a>
            <span className="text-[#e6e1da]">|</span>
            <a href="#terms" className="hover:text-[#B9423A] transition-colors">
              Điều khoản dịch vụ
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
