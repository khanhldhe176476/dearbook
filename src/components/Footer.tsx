import { Facebook, Mail, Phone, Clock, Send, Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(' Cm n bn  ng k nhn bn tin t dearmemories.!');
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
              "Mi khonh khc tri qua u l duy nht. Chng ti gip bn ng gi thanh xun v gi gm yu thng vo tng trang sch."
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://www.tiktok.com/@dearmemories2026?is_from_webapp=1&sender_device=pc" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#e6e1da] bg-white flex items-center justify-center text-[#7A6F66] hover:text-[#B9423A] hover:border-[#B9423A] hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                <svg 
                  className="w-4.5 h-4.5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/share/1FRfXppSbc/?mibextid=wwXIfr" 
                target="_blank"
                rel="noopener noreferrer"
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
              Khm Ph
            </h4>
            <ul className="space-y-3.5 text-sm text-[#7A6F66] font-serif">
              <li>
                <a href="#create" className="hover:text-[#B9423A] transition-colors flex items-center gap-1">
                  To photobook
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-[#B9423A] transition-colors">
                  Mu thit k
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#B9423A] transition-colors">
                  Bng gi dch v
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-[#B9423A] transition-colors">
                  Blog truyn cm hng
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer support */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3B2925]">
              H Tr Khch Hng
            </h4>
            <ul className="space-y-3.5 text-sm text-[#7A6F66] font-serif">
              <li>
                <a href="#shipping" className="hover:text-[#B9423A] transition-colors">
                  Chnh sch vn chuyn
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-[#B9423A] transition-colors">
                  Chnh sch i tr
                </a>
              </li>
              <li>
                <a href="#notes" className="hover:text-[#B9423A] transition-colors">
                  Lu  t photobook
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#B9423A] transition-colors">
                  Cu hi thng gp (FAQ)
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-[#B9423A] transition-colors">
                  Lin h h tr 24/7
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3B2925]">
              Kt Ni & Bn Tin
            </h4>
            
            <div className="space-y-3.5 text-sm text-[#7A6F66] font-serif">
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B9423A] flex-shrink-0" />
                <a href="mailto:dearmemories2026@gmail.com" className="hover:text-[#B9423A] transition-colors whitespace-nowrap">
                  dearmemories2026@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B9423A] flex-shrink-0" />
                <a href="tel:0961304858" className="font-semibold text-[#3B2925] hover:text-[#B9423A] transition-colors whitespace-nowrap">
                  Hotline: 0961 304 858
                </a>
              </p>
              <p className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#B9423A] flex-shrink-0 mt-1" />
                <span>Gi lm vic: 8:00 - 21:00 hng ngy</span>
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2 flex flex-col gap-2.5">
              <p className="text-[11px] text-[#7A6F66] leading-relaxed">
                ng k nhn thng tin u i & cm hng thit k mi nht.
              </p>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Nhp email ca bn..."
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
            <span> {new Date().getFullYear()}</span>
            <span className="font-sans font-semibold text-[#3B2925]">dearmemories.</span>
            <span>All rights reserved. Made with</span>
            <Heart className="w-3 h-3 text-[#B9423A] fill-[#B9423A]" />
          </p>
          
          <div className="flex items-center gap-6 text-xs text-[#7A6F66]">
            <a href="#privacy" className="hover:text-[#B9423A] transition-colors">
              Chnh sch bo mt
            </a>
            <span className="text-[#e6e1da]">|</span>
            <a href="#terms" className="hover:text-[#B9423A] transition-colors">
              iu khon dch v
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
