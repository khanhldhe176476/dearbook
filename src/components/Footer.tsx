import { Facebook, Mail, Phone, Clock, Send, Heart, Truck, X, RotateCcw, BookOpen, Image as ImageIcon, Palette, Package, RefreshCw, Tag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('✨ Cảm ơn bạn đã đăng ký nhận bản tin từ dearmemories.!');
    setEmail('');
  };

  return (
    <footer 
      className="w-full relative overflow-hidden border-t border-[#e6e1da] py-10 md:py-12 mt-auto"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1.2fr] gap-8 lg:gap-10 pb-8">
          
          {/* Column 1: Brand section */}
          <div className="space-y-4 flex flex-col">
            <div className="flex flex-col">
              <span 
                className="text-[#3B2925] tracking-tight font-serif"
                style={{
                  fontFamily: '"Pinyon Script", "Great Vibes", cursive',
                  fontSize: '1.75rem',
                  lineHeight: 1.1
                }}
              >
                dearmemories.
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B9423A] font-semibold mt-1">
                Preserve the Unforgettable
              </span>
            </div>
            
            <p className="text-[13px] text-[#7A6F66] leading-relaxed font-serif italic pr-4">
              "Mỗi khoảnh khắc trôi qua đều là duy nhất. Chúng tôi giúp bạn đóng gói thanh xuân và gửi gắm yêu thương vào từng trang sách."
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a 
                href="https://www.tiktok.com/@dearmemories2026?is_from_webapp=1&sender_device=pc" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#e6e1da] bg-white flex items-center justify-center text-[#7A6F66] hover:text-[#B9423A] hover:border-[#B9423A] hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              >
                <svg 
                  className="w-4 h-4" 
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
                className="w-8 h-8 rounded-full border border-[#e6e1da] bg-white flex items-center justify-center text-[#7A6F66] hover:text-[#B9423A] hover:border-[#B9423A] hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#email" 
                className="w-8 h-8 rounded-full border border-[#e6e1da] bg-white flex items-center justify-center text-[#7A6F66] hover:text-[#B9423A] hover:border-[#B9423A] hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3B2925]">
              Khám Phá
            </h4>
            <ul className="space-y-2 text-[13px] text-[#7A6F66] font-serif">
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
                <button
                  onClick={() => setIsPricingOpen(true)}
                  className="hover:text-[#B9423A] transition-colors text-left focus:outline-none"
                >
                  Bảng giá dịch vụ
                </button>
              </li>
              <li>
                <a href="#blog" className="hover:text-[#B9423A] transition-colors">
                  Blog truyền cảm hứng
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer support */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3B2925]">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-2 text-[13px] text-[#7A6F66] font-serif">
              <li>
                <button
                  onClick={() => setIsShippingOpen(true)}
                  className="hover:text-[#B9423A] transition-colors text-left focus:outline-none"
                >
                  Chính sách vận chuyển
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsReturnOpen(true)}
                  className="hover:text-[#B9423A] transition-colors text-left focus:outline-none"
                >
                  Chính sách đổi trả
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsNoticeOpen(true)}
                  className="hover:text-[#B9423A] transition-colors text-left focus:outline-none"
                >
                  Lưu ý đặt photobook
                </button>
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
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3B2925]">
              Kết Nối & Bản Tin
            </h4>
            
            <div className="space-y-3 text-[13px] text-[#7A6F66] font-serif">
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#B9423A] flex-shrink-0" />
                  <a href="mailto:dearmemories2026@gmail.com" className="hover:text-[#B9423A] transition-colors whitespace-nowrap">
                    dearmemories2026@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#B9423A] flex-shrink-0" />
                  <a href="tel:0961304858" className="font-semibold text-[#3B2925] hover:text-[#B9423A] transition-colors whitespace-nowrap">
                    Hotline: 0961 304 858
                  </a>
                </p>
                <p className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#B9423A] flex-shrink-0 mt-0.5" />
                  <span>Giờ làm việc: 8:00 - 21:00 hàng ngày</span>
                </p>
              </div>

              {/* Newsletter Subscription */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] text-[#7A6F66] leading-relaxed">
                  Đăng ký nhận thông tin ưu đãi & cảm hứng thiết kế mới nhất.
                </p>
                <form onSubmit={handleSubscribe} className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 rounded-full text-xs outline-none border border-[#e6e1da] bg-white/60 focus:bg-white focus:border-[#B9423A] transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#3B2925] text-white flex items-center justify-center hover:bg-[#B9423A] transition-all duration-300"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-5 border-t border-[#e6e1da] flex flex-col sm:flex-row items-center justify-between gap-4">
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

      <ShippingPolicyDialog isOpen={isShippingOpen} onClose={() => setIsShippingOpen(false)} />
      <ReturnPolicyDialog isOpen={isReturnOpen} onClose={() => setIsReturnOpen(false)} />
      <PhotobookNoticeFooterDialog isOpen={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} />
      <PricingDialog isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </footer>
  );
}

interface ShippingPolicyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function ShippingPolicyDialog({ isOpen, onClose }: ShippingPolicyDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn flex flex-col max-h-[85vh] z-10">
        {/* Header */}
        <div className="px-6 py-5 relative overflow-hidden flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #3B2925 0%, #2D1E1B 100%)',
          }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Truck className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Chính sách vận chuyển</h2>
                <p className="text-white/60 text-[11px] mt-0.5 font-medium">dearmemories. chính sách giao nhận & thanh toán</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 py-5 overflow-y-auto space-y-4 flex-1 text-sm text-gray-700 leading-relaxed font-sans">
          <p className="font-medium text-gray-800">
            <strong>dearmemories.</strong> cung cấp dịch vụ giao hàng trên toàn quốc đối với tất cả đơn đặt photobook và các sản phẩm lưu giữ kỷ niệm được đặt thông qua Website, Fanpage hoặc các kênh liên hệ chính thức của thương hiệu.
          </p>
          <p>
            Các đơn hàng sẽ được vận chuyển thông qua các đối tác giao nhận uy tín. Sau khi đơn hàng được bàn giao cho đơn vị vận chuyển, khách hàng sẽ nhận được mã vận đơn để theo dõi trạng thái giao hàng.
          </p>

          <div className="space-y-4 border-t pt-4 border-gray-100">
            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">1. Chính sách giá</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                <li>a. Giá sản phẩm niêm yết trên Website là giá đã bao gồm thuế VAT theo quy định hiện hành.</li>
                <li>b. Giá sản phẩm chưa bao gồm phí vận chuyển (nếu có) và các yêu cầu thiết kế hoặc đóng gói đặc biệt ngoài gói dịch vụ tiêu chuẩn.</li>
                <li>c. Mọi chi phí phát sinh sẽ được <strong>dearmemories.</strong> thông báo và xác nhận với khách hàng trước khi tiến hành sản xuất.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">2. Phí vận chuyển</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                <li>a. Miễn phí vận chuyển toàn quốc đối với đơn hàng từ <strong>999.000 VNĐ</strong>.</li>
                <li>b. Đối với đơn hàng dưới 999.000 VNĐ, phí vận chuyển được tính theo khu vực giao hàng và đơn vị vận chuyển.</li>
                <li>c. Một số khu vực đặc biệt hoặc hải đảo có thể phát sinh phụ phí vận chuyển. Dear Memories sẽ thông báo trước khi xác nhận đơn hàng.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">3. Thời gian sản xuất và giao hàng</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p className="font-semibold text-gray-800">Thời gian sản xuất</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Photobook tiêu chuẩn: 3–5 ngày làm việc.</li>
                  <li>Photobook thiết kế theo yêu cầu: 5–7 ngày làm việc.</li>
                  <li>Thời gian sản xuất có thể kéo dài hơn vào các dịp lễ, Tết hoặc mùa cao điểm.</li>
                </ul>
                <p className="font-semibold text-gray-800 mt-2">Thời gian giao hàng</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Nội thành Hà Nội: 1–2 ngày làm việc.</li>
                  <li>Ngoại thành Hà Nội: 1–3 ngày làm việc.</li>
                  <li>Các tỉnh, thành phố khác: 2–5 ngày làm việc.</li>
                  <li>Khu vực huyện, xã hoặc vùng xa: 3–7 ngày làm việc.</li>
                  <li>Thời gian giao hàng được tính sau khi sản phẩm hoàn tất quá trình sản xuất.</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">4. Quy trình giao nhận</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                <li>a. Trong trường hợp khách hàng không thể nhận hàng ở lần giao đầu tiên, đơn vị vận chuyển sẽ liên hệ để sắp xếp thời gian giao lại.</li>
                <li>b. Sau nhiều lần giao không thành công hoặc không thể liên hệ với khách hàng, đơn hàng có thể được hoàn về <strong>dearmemories.</strong></li>
                <li>c. Khi nhận hàng, khách hàng vui lòng kiểm tra tình trạng kiện hàng trước khi xác nhận nhận hàng.</li>
                <li>d. <strong>dearmemories.</strong> khuyến khích khách hàng quay video quá trình mở hộp để làm cơ sở hỗ trợ trong trường hợp phát sinh khiếu nại hoặc yêu cầu đổi trả.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">5. Đổi trả và bảo hành</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>dearmemories.</strong> hỗ trợ đổi mới hoặc sản xuất lại sản phẩm trong các trường hợp:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sản phẩm bị lỗi in ấn do quá trình sản xuất.</li>
                  <li>Sai nội dung, sai thiết kế so với bản đã xác nhận.</li>
                  <li>Hư hỏng trong quá trình vận chuyển.</li>
                </ul>
                <p><strong>dearmemories.</strong> không áp dụng đổi trả đối với:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sai sót từ hình ảnh hoặc nội dung khách hàng đã cung cấp và xác nhận trước khi in.</li>
                  <li>Hư hỏng do bảo quản hoặc sử dụng không đúng cách.</li>
                  <li>Yêu cầu thay đổi thiết kế sau khi sản phẩm đã được sản xuất.</li>
                </ul>
                <p className="italic text-rose-600">Khách hàng vui lòng liên hệ trong vòng 03 ngày kể từ ngày nhận sản phẩm để được hỗ trợ.</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">6. Thanh toán</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p>Để đảm bảo quá trình thiết kế và sản xuất được thực hiện nhanh chóng, <strong>dearmemories.</strong> áp dụng hình thức thanh toán trước 100% giá trị đơn hàng đối với tất cả các đơn đặt photobook và sản phẩm cá nhân hóa.</p>
                <p className="font-semibold text-gray-800">Hình thức thanh toán</p>
                <p>Khách hàng có thể thanh toán thông qua:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Chuyển khoản ngân hàng.</li>
                  <li>Ví điện tử (nếu được hỗ trợ).</li>
                  <li>Các cổng thanh toán trực tuyến trên website.</li>
                </ul>
                <p>Sau khi xác nhận thanh toán thành công, <strong>dearmemories.</strong> sẽ tiến hành thiết kế, xác nhận bản duyệt (nếu có) và đưa sản phẩm vào quy trình sản xuất.</p>
                <p className="font-semibold text-rose-600">Lưu ý:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dear Memories không áp dụng hình thức thanh toán khi nhận hàng (COD).</li>
                  <li>Các sản phẩm photobook được sản xuất riêng theo yêu cầu của từng khách hàng nên đơn hàng chỉ được xử lý sau khi hoàn tất thanh toán.</li>
                  <li>Khách hàng vui lòng kiểm tra kỹ thông tin đơn hàng trước khi thanh toán.</li>
                  <li>Sau khi sản phẩm đã được đưa vào quá trình sản xuất, việc hủy đơn hoặc thay đổi nội dung có thể không được áp dụng.</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">7. Thay đổi hoặc hủy đơn hàng</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                <li>Khách hàng có thể yêu cầu chỉnh sửa hoặc hủy đơn hàng trước khi <strong>dearmemories.</strong> tiến hành thiết kế hoặc sản xuất.</li>
                <li>Đối với các đơn hàng đã được xác nhận sản xuất, việc thay đổi hoặc hủy đơn có thể không được áp dụng hoặc phát sinh chi phí tương ứng.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">8. Thông tin liên hệ</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <p>Nếu cần hỗ trợ hoặc giải đáp thắc mắc, vui lòng liên hệ:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Email: <a href="mailto:dearmemories2026@gmail.com" className="text-amber-700 hover:underline">dearmemories2026@gmail.com</a></li>
                  <li>Hotline: <a href="tel:0961304858" className="text-amber-700 hover:underline">0961 304 858</a></li>
                  <li>Fanpage: Dear Memories</li>
                  <li>Thời gian hỗ trợ: 08:30 – 21:00 hằng ngày</li>
                </ul>
                <p className="mt-2 font-medium text-gray-800 italic">Dear Memories luôn mong muốn mang đến những sản phẩm chất lượng và trải nghiệm dịch vụ tốt nhất để lưu giữ những khoảnh khắc đáng nhớ của bạn.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#3B2925] text-white font-semibold rounded-xl hover:bg-[#B9423A] transition-all text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

interface ReturnPolicyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function ReturnPolicyDialog({ isOpen, onClose }: ReturnPolicyDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn flex flex-col max-h-[85vh] z-10">
        {/* Header */}
        <div className="px-6 py-5 relative overflow-hidden flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #3B2925 0%, #2D1E1B 100%)',
          }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <RotateCcw className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Chính sách đổi trả</h2>
                <p className="text-white/60 text-[11px] mt-0.5 font-medium">dearmemories. chính sách đổi trả & hoàn tiền</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 py-5 overflow-y-auto space-y-4 flex-1 text-sm text-gray-700 leading-relaxed font-sans">
          <p className="font-medium text-gray-800">
            Tại <strong>dearmemories.</strong>, mỗi cuốn photobook đều được thiết kế và sản xuất riêng theo yêu cầu của từng khách hàng. Vì vậy, chúng tôi chỉ áp dụng đổi trả hoặc hoàn tiền trong các trường hợp được quy định dưới đây.
          </p>

          <div className="space-y-4 border-t pt-4 border-gray-100">
            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">1. Trường hợp được hỗ trợ đổi trả</h3>
              <p className="text-xs text-gray-600 mb-2">Khách hàng sẽ được hỗ trợ đổi mới hoặc sản xuất lại sản phẩm khi:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                <li>Sản phẩm bị lỗi in ấn, lỗi gia công hoặc lỗi kỹ thuật từ phía <strong>dearmemories.</strong></li>
                <li>Nội dung, hình ảnh hoặc thông tin trên sản phẩm không đúng với bản thiết kế cuối cùng đã được khách hàng xác nhận.</li>
                <li>Sản phẩm bị hư hỏng, rách, móp méo hoặc biến dạng trong quá trình vận chuyển.</li>
                <li>Khách hàng nhận sai sản phẩm hoặc sai số lượng so với đơn hàng đã đặt.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">2. Trường hợp không áp dụng đổi trả</h3>
              <p className="text-xs text-gray-600 mb-2"><strong>dearmemories.</strong> không hỗ trợ đổi trả hoặc hoàn tiền trong các trường hợp sau:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                <li>Khách hàng thay đổi sở thích hoặc không còn nhu cầu sử dụng sản phẩm.</li>
                <li>Sai sót về nội dung, hình ảnh hoặc thông tin do khách hàng cung cấp.</li>
                <li>Khách hàng đã xác nhận bản thiết kế cuối cùng trước khi sản xuất.</li>
                <li>Sản phẩm bị hư hỏng do sử dụng, bảo quản không đúng cách hoặc tác động từ bên ngoài sau khi nhận hàng.</li>
                <li>Màu sắc sản phẩm thực tế có chênh lệch nhỏ so với màu sắc hiển thị trên màn hình thiết bị điện tử.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">3. Thời gian yêu cầu đổi trả</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                <li>Khách hàng vui lòng liên hệ với <strong>dearmemories.</strong> trong vòng <strong>48 giờ</strong> kể từ thời điểm nhận hàng.</li>
                <li>Sau thời gian trên, <strong>dearmemories.</strong> có quyền từ chối tiếp nhận yêu cầu đổi trả.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">4. Quy trình xử lý đổi trả</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p><span className="font-semibold text-gray-800">Bước 1: Liên hệ hỗ trợ</span> - Khách hàng gửi thông tin bao gồm:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Mã đơn hàng.</li>
                  <li>Họ tên và số điện thoại đặt hàng.</li>
                  <li>Hình ảnh hoặc video thể hiện tình trạng sản phẩm.</li>
                  <li>Mô tả chi tiết vấn đề gặp phải.</li>
                </ul>
                <p><span className="font-semibold text-gray-800 mt-2 block">Bước 2: Xác minh</span></p>
                <p><strong>dearmemories.</strong> sẽ kiểm tra và phản hồi trong vòng 1–3 ngày làm việc kể từ khi nhận đủ thông tin.</p>
                <p><span className="font-semibold text-gray-800 mt-2 block">Bước 3: Xử lý</span></p>
                <p>Nếu yêu cầu hợp lệ, <strong>dearmemories.</strong> sẽ:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sản xuất lại sản phẩm mới; hoặc</li>
                  <li>Hoàn tiền theo từng trường hợp cụ thể.</li>
                </ul>
                <p className="italic text-gray-600 mt-1">Mọi chi phí vận chuyển phát sinh do lỗi từ <strong>dearmemories.</strong> sẽ do chúng tôi chi trả.</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">5. Chính sách hoàn tiền</h3>
              <p className="text-xs text-gray-600 mb-2">Việc hoàn tiền chỉ áp dụng khi:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                <li><strong>dearmemories.</strong> không thể sản xuất lại sản phẩm thay thế.</li>
                <li>Đơn hàng được xác nhận hủy trước khi bắt đầu thiết kế hoặc sản xuất.</li>
                <li>Thời gian hoàn tiền dự kiến từ 5-7 ngày làm việc tùy theo phương thức thanh toán của khách hàng.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#3B2925] text-base mb-1.5">6. Thông tin liên hệ</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <p>Nếu cần hỗ trợ về đổi trả hoặc khiếu nại sản phẩm, vui lòng liên hệ:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Email: <a href="mailto:dearmemories2026@gmail.com" className="text-amber-700 hover:underline">dearmemories2026@gmail.com</a></li>
                  <li>Hotline: <a href="tel:0961304858" className="text-amber-700 hover:underline">0961 304 858</a></li>
                  <li>Fanpage: Dear Memories</li>
                  <li>Thời gian hỗ trợ: 08:30 – 21:00 hằng ngày.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#3B2925] text-white font-semibold rounded-xl hover:bg-[#B9423A] transition-all text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

interface PhotobookNoticeFooterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function PhotobookNoticeFooterDialog({ isOpen, onClose }: PhotobookNoticeFooterDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn flex flex-col max-h-[85vh] z-10">
        {/* Header */}
        <div className="px-6 py-5 relative overflow-hidden flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #3B2925 0%, #2D1E1B 100%)',
          }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <BookOpen className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Lưu ý khi đặt photobook</h2>
                <p className="text-white/60 text-[11px] mt-0.5 font-medium">Vui lòng đọc kỹ thông tin trước khi thiết kế</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 py-5 overflow-y-auto space-y-4 flex-1 text-sm text-gray-700 leading-relaxed font-sans">
          <p className="font-medium text-gray-800">
            Để cuốn photobook lưu giữ kỷ niệm của bạn được hoàn thiện với chất lượng tốt nhất, vui lòng lưu ý một số thông tin quan trọng dưới đây trước khi bắt đầu thiết kế và sản xuất.
          </p>

          <div className="space-y-4 border-t pt-4 border-gray-100">
            {/* 1. Chất lượng ảnh */}
            <div className="flex gap-4 p-3 rounded-2xl transition-colors hover:bg-gray-50/80">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500 border border-blue-100">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-gray-800">
                  📸 Chất lượng ảnh
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Để đảm bảo chất lượng in tốt nhất, vui lòng sử dụng ảnh có độ phân giải cao và hạn chế sử dụng ảnh bị mờ, vỡ hoặc ảnh chụp màn hình.
                </p>
              </div>
            </div>

            {/* 2. Màu sắc khi in */}
            <div className="flex gap-4 p-3 rounded-2xl transition-colors hover:bg-gray-50/80">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-500 border border-amber-100">
                <Palette className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-gray-800">
                  🎨 Màu sắc khi in
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Màu sắc thực tế của photobook có thể có sự chênh lệch nhỏ so với hình ảnh hiển thị trên màn hình do sự khác biệt giữa các thiết bị và công nghệ in ấn.
                </p>
              </div>
            </div>

            {/* 3. Thông tin nhận hàng */}
            <div className="flex gap-4 p-3 rounded-2xl transition-colors hover:bg-gray-50/80">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-500 border border-purple-100">
                <Package className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-gray-800">
                  📦 Thông tin nhận hàng
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Vui lòng kiểm tra kỹ họ tên, số điện thoại và địa chỉ nhận hàng trước khi xác nhận đơn đặt hàng.
                </p>
              </div>
            </div>

            {/* 4. Thời gian sản xuất */}
            <div className="flex gap-4 p-3 rounded-2xl transition-colors hover:bg-gray-50/80">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500 border border-orange-100">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-gray-800">
                  ⏳ Thời gian sản xuất
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Photobook là sản phẩm được cá nhân hóa theo từng đơn hàng. Thời gian hoàn thiện dự kiến từ 3–5 ngày làm việc (không bao gồm thời gian vận chuyển).
                </p>
              </div>
            </div>

            {/* 5. Chỉnh sửa & hỗ trợ sau khi nhận hàng */}
            <div className="flex gap-4 p-3 rounded-2xl transition-colors hover:bg-gray-50/80">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-500 border border-rose-100">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-gray-800">
                  🔄 Chỉnh sửa & hỗ trợ sau khi nhận hàng
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Sau khi đơn hàng được xác nhận và đưa vào sản xuất, nội dung thiết kế sẽ không thể chỉnh sửa. Nếu sản phẩm gặp lỗi từ phía sản xuất hoặc vận chuyển, vui lòng liên hệ <span className="font-semibold text-rose-600">dearmemories.</span> trong vòng 48 giờ kể từ khi nhận hàng để được hỗ trợ. Để đảm bảo quyền lợi, khách hàng vui lòng quay video quá trình mở hàng và cung cấp hình ảnh hoặc video sản phẩm khi gửi yêu cầu hỗ trợ.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#3B2925] text-white font-semibold rounded-xl hover:bg-[#B9423A] transition-all text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

interface PricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function PricingDialog({ isOpen, onClose }: PricingDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-scaleIn flex flex-col max-h-[85vh] z-10">
        {/* Header */}
        <div className="px-6 py-5 relative overflow-hidden flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #3B2925 0%, #2D1E1B 100%)',
          }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Tag className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Bảng giá dịch vụ</h2>
                <p className="text-white/60 text-[11px] mt-0.5 font-medium">dearmemories. bảng so sánh & bảng giá photobook</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 py-5 overflow-y-auto space-y-5 flex-1 text-sm text-gray-700 leading-relaxed font-sans">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden border border-[#e6e1da] rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#3B2925] text-white">
                  <th className="p-4 font-bold text-xs uppercase tracking-wider w-[16%]">Tiêu chí</th>
                  <th className="p-4 font-bold text-center text-xs uppercase tracking-wider w-[21%] border-l border-white/10">Đóng gáy Lò Xo<br/><span className="text-[10px] text-amber-200 lowercase italic">(spiral binding)</span></th>
                  <th className="p-4 font-bold text-center text-xs uppercase tracking-wider w-[21%] border-l border-white/10">Photobook Bìa Mềm<br/><span className="text-[10px] text-amber-200 lowercase italic">(softcover)</span></th>
                  <th className="p-4 font-bold text-center text-xs uppercase tracking-wider w-[21%] border-l border-white/10">Photobook Bìa Cứng<br/><span className="text-[10px] text-amber-200 lowercase italic">(hardcover)</span></th>
                  <th className="p-4 font-bold text-center text-xs uppercase tracking-wider w-[21%] border-l border-white/10">Bìa Cứng Mở Phẳng<br/><span className="text-[10px] text-amber-200 lowercase italic">(lay-flat hardcover)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e1da]">
                {/* Size */}
                <tr className="hover:bg-[#F7F3EB]/30 transition-colors">
                  <td className="p-4 font-semibold text-gray-800 bg-gray-50/50">Kích thước</td>
                  <td className="p-4 text-center border-l border-[#e6e1da]">
                    20 x 20 cm
                  </td>
                  <td className="p-4 text-center border-l border-[#e6e1da]">
                    A4 (21 x 30 cm)<br/>20 x 20 cm
                  </td>
                  <td className="p-4 text-center border-l border-[#e6e1da]">
                    A4 (21 x 30 cm)<br/>20 x 20 cm
                  </td>
                  <td className="p-4 text-center border-l border-[#e6e1da]">
                    20 x 20 cm
                  </td>
                </tr>

                {/* Page Count */}
                <tr className="hover:bg-[#F7F3EB]/30 transition-colors">
                  <td className="p-4 font-semibold text-gray-800 bg-gray-50/50">Số trang</td>
                  <td className="p-4 text-center border-l border-[#e6e1da]">
                    18 trang = 9 tờ<br/><span className="text-xs text-gray-500">(bao gồm bìa)</span>
                  </td>
                  <td className="p-4 text-center border-l border-[#e6e1da]">
                    40 trang = 20 tờ<br/><span className="text-xs text-gray-500">(bao gồm bìa)</span>
                  </td>
                  <td className="p-4 text-center border-l border-[#e6e1da]">
                    40 trang = 20 tờ<br/><span className="text-xs text-gray-500">(bao gồm bìa)</span>
                  </td>
                  <td className="p-4 text-center border-l border-[#e6e1da]">
                    14 trang = 7 tờ<br/><span className="text-xs text-gray-500">(bao gồm bìa)</span>
                  </td>
                </tr>

                {/* Material */}
                <tr className="hover:bg-[#F7F3EB]/30 transition-colors">
                  <td className="p-4 font-semibold text-gray-800 bg-gray-50/50">Chất liệu giấy</td>
                  <td className="p-4 border-l border-[#e6e1da] text-xs">
                    Giấy C250
                  </td>
                  <td className="p-4 border-l border-[#e6e1da] text-xs space-y-1">
                    <p>• Bìa: Giấy C300</p>
                    <p>• Trang ruột: Giấy C150</p>
                  </td>
                  <td className="p-4 border-l border-[#e6e1da] text-xs space-y-1">
                    <p>• Bìa carton cứng</p>
                    <p>• Trang ruột: Giấy C150</p>
                  </td>
                  <td className="p-4 border-l border-[#e6e1da] text-xs">
                    Bìa carton cứng cán mờ, tạo hiệu ứng mở phẳng liền mạch khi mở hai trang đối diện.
                  </td>
                </tr>

                {/* Price */}
                <tr className="bg-amber-50/30 hover:bg-amber-50/50 transition-colors">
                  <td className="p-4 font-semibold text-gray-800 bg-amber-50/20">Giá bán</td>
                  <td className="p-4 text-center border-l border-[#e6e1da] font-bold text-[#B9423A] text-base">
                    180.000đ
                  </td>
                  <td className="p-4 text-center border-l border-[#e6e1da] font-bold text-[#B9423A] text-base">
                    245.000đ
                  </td>
                  <td className="p-4 text-center border-l border-[#e6e1da] font-bold text-[#B9423A] text-base">
                    375.000đ
                  </td>
                  <td className="p-4 text-center border-l border-[#e6e1da] font-bold text-[#B9423A] text-base">
                    399.000đ
                  </td>
                </tr>

                {/* Box contents */}
                <tr>
                  <td className="p-4 font-semibold text-gray-800 bg-gray-50/50">Bên trong hộp gồm</td>
                  <td colSpan={4} className="p-4 border-l border-[#e6e1da] bg-gray-50/20">
                    <div className="flex flex-col sm:flex-row sm:gap-8 gap-2 text-xs text-gray-600">
                      <p><strong>• Sản phẩm chính:</strong> Photobook</p>
                      <p><strong>• Quà tặng kèm:</strong> + 1 thiệp cảm ơn</p>
                      <p><strong>• Quà tặng thêm:</strong> + 1 viên kẹo mút</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden space-y-4">

            {/* Card 1: Spiral Binding */}
            <div className="border border-[#e6e1da] rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="bg-[#3B2925] px-4 py-3 flex justify-between items-center text-white">
                <span className="font-bold text-xs uppercase tracking-wide">Đóng gáy Lò Xo (Spiral)</span>
                <span className="font-bold text-[#FFD166]">180.000đ</span>
              </div>
              <div className="p-4 space-y-2 text-xs">
                <div className="flex justify-between border-b pb-1.5 border-gray-100">
                  <span className="text-gray-400">Kích thước</span>
                  <span className="font-medium text-gray-700">20 x 20 cm</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 border-gray-100">
                  <span className="text-gray-400">Số trang</span>
                  <span className="font-medium text-gray-700">18 trang = 9 tờ (gồm bìa)</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 flex-shrink-0">Giấy in</span>
                  <span className="font-medium text-gray-700 text-right">Giấy C250</span>
                </div>
              </div>
            </div>
            
            {/* Card 2: Softcover */}
            <div className="border border-[#e6e1da] rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="bg-[#3B2925] px-4 py-3 flex justify-between items-center text-white">
                <span className="font-bold text-xs uppercase tracking-wide">Bìa Mềm (Softcover)</span>
                <span className="font-bold text-[#FFD166]">245.000đ</span>
              </div>
              <div className="p-4 space-y-2 text-xs">
                <div className="flex justify-between border-b pb-1.5 border-gray-100">
                  <span className="text-gray-400">Kích thước</span>
                  <span className="font-medium text-gray-700 text-right">A4 (21x30 cm) hoặc 20x20 cm</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 border-gray-100">
                  <span className="text-gray-400">Số trang</span>
                  <span className="font-medium text-gray-700">40 trang = 20 tờ (gồm bìa)</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 flex-shrink-0">Giấy in</span>
                  <span className="font-medium text-gray-700 text-right">Bìa Giấy C300, Ruột Giấy C150</span>
                </div>
              </div>
            </div>

            {/* Card 3: Hardcover */}
            <div className="border border-[#e6e1da] rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="bg-[#3B2925] px-4 py-3 flex justify-between items-center text-white">
                <span className="font-bold text-xs uppercase tracking-wide">Bìa Cứng (Hardcover)</span>
                <span className="font-bold text-[#FFD166]">375.000đ</span>
              </div>
              <div className="p-4 space-y-2 text-xs">
                <div className="flex justify-between border-b pb-1.5 border-gray-100">
                  <span className="text-gray-400">Kích thước</span>
                  <span className="font-medium text-gray-700 text-right">A4 (21x30 cm) hoặc 20x20 cm</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 border-gray-100">
                  <span className="text-gray-400">Số trang</span>
                  <span className="font-medium text-gray-700">40 trang = 20 tờ (gồm bìa)</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 flex-shrink-0">Giấy in</span>
                  <span className="font-medium text-gray-700 text-right">Bìa carton cứng, Ruột Giấy C150</span>
                </div>
              </div>
            </div>

            {/* Card 4: Lay-flat */}
            <div className="border border-[#e6e1da] rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="bg-[#3B2925] px-4 py-3 flex justify-between items-center text-white">
                <span className="font-bold text-xs uppercase tracking-wide text-amber-200">Mở Phẳng (Lay-flat)</span>
                <span className="font-bold text-[#FFD166]">399.000đ</span>
              </div>
              <div className="p-4 space-y-2 text-xs">
                <div className="flex justify-between border-b pb-1.5 border-gray-100">
                  <span className="text-gray-400">Kích thước</span>
                  <span className="font-medium text-gray-700">20 x 20 cm</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 border-gray-100">
                  <span className="text-gray-400">Số trang</span>
                  <span className="font-medium text-gray-700">14 trang = 7 tờ (gồm bìa)</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 flex-shrink-0">Giấy in</span>
                  <span className="font-medium text-gray-700 text-right">Bìa carton cứng cán mờ, mở phẳng liền mạch</span>
                </div>
              </div>
            </div>

            {/* Inside Box alert */}
            <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100 text-xs text-gray-600 space-y-1.5">
              <p className="font-bold text-gray-800">🎁 Bên trong mỗi hộp sản phẩm gồm:</p>
              <p>• <strong>Sản phẩm chính:</strong> 01 cuốn Photobook cao cấp</p>
              <p>• <strong>Quà tặng kèm:</strong> 01 thiệp cảm ơn xinh xắn</p>
              <p>• <strong>Quà tặng thêm:</strong> 01 viên kẹo mút ngọt ngào</p>
            </div>
            
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#3B2925] text-white font-semibold rounded-xl hover:bg-[#B9423A] transition-all text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
