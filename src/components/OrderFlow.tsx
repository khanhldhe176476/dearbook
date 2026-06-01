import { useState } from 'react';
import { ArrowLeft, Package, CreditCard, CheckCircle, MapPin, Phone, Mail, User, Loader2, BookOpen, Layers, Ruler, AlertTriangle } from 'lucide-react';
import { BookData, User as UserData } from '../App';
import { orderApi } from '../lib/orderApi';
import { PageSelectionStep } from './PageSelectionStep';
import { toast } from 'sonner@2.0.3';

const products = [
  {
    id: 'softcover' as const,
    name: 'Softcover Photobook',
    nameVi: 'Sách ảnh Bìa Mềm',
    sizes: [
      { label: 'A4 (21x30cm)', value: 'A4' as const, price: 245000 },
      { label: '20x20cm', value: '20x20' as const, price: 245000 },
    ],
    pagesLimit: 40,
    pagesLabel: '40 trang = 20 tờ (cả bìa)',
    paperType: 'Bìa: Giấy C300 · Trang trong: Giấy C150',
    extraPageCost: 6000, // 6.000đ / trang = 12.000đ / tờ (Giấy C150)
    extraSheetCost: 12000,
  },
  {
    id: 'hardcover' as const,
    name: 'Hardcover Photobook',
    nameVi: 'Sách ảnh Bìa Cứng',
    sizes: [
      { label: 'A4 (21x30cm)', value: 'A4' as const, price: 375000 },
      { label: '20x20cm', value: '20x20' as const, price: 375000 },
    ],
    pagesLimit: 40,
    pagesLabel: '40 trang = 20 tờ (cả bìa)',
    paperType: 'Bìa: Bìa carton cứng · Trang trong: Giấy C150',
    extraPageCost: 6000, // 6.000đ / trang = 12.000đ / tờ (Giấy C150)
    extraSheetCost: 12000,
  },
  {
    id: 'layflat' as const,
    name: 'Lay-flat Hardcover Photobook',
    nameVi: 'Sách ảnh Bìa Cứng Mở Phẳng',
    sizes: [
      { label: '20x20cm', value: '20x20' as const, price: 399000 },
    ],
    pagesLimit: 14,
    pagesLabel: '14 trang = 7 tờ (cả bìa)',
    paperType: 'Bìa carton cứng cáng mờ, hiệu ứng mở phẳng liền mạch khi mở 2 trang đối diện',
    extraPageCost: 15000, // 15.000đ / trang = 30.000đ / tờ
    extraSheetCost: 30000,
  }
];


interface OrderFlowProps {
  user: UserData;
  book: BookData;
  onBack: () => void;
  onComplete: () => void;
}

export function OrderFlow({ user, book, onBack, onComplete }: OrderFlowProps) {
  const [step, setStep] = useState<'pages' | 'shipping' | 'payment' | 'confirmation'>('pages');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user.name,
    phone: '',
    email: user.email,
    address: '',
    city: '',
    district: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'deposit'>('full');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Use the actual logged in user id or fallback
  const userId = user.id || '00000000-0000-0000-0000-000000000000';

  const [selectedProduct, setSelectedProduct] = useState<'softcover' | 'hardcover' | 'layflat'>('hardcover');
  const [selectedSize, setSelectedSize] = useState<'A4' | '20x20'>('A4');

  // Page selection state - initialized from book pages (all selected by default)
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>(() => {
    const allPages = book.pages || [];
    return allPages.map((p, i) => p?.id || p?.templatePageId || `page-${i}`);
  });
  const selectedPageCount = selectedPageIds.length;

  const currentProduct = products.find(p => p.id === selectedProduct) || products[1];
  const sizeConfig = currentProduct.sizes.find(s => s.value === selectedSize) || currentProduct.sizes[0];

  const basePrice = sizeConfig.price;
  const additionalPages = Math.max(0, selectedPageCount - currentProduct.pagesLimit);
  const pagePrice = additionalPages * currentProduct.extraPageCost;
  const shippingFee = 30000;
  const totalOriginal = basePrice + pagePrice + shippingFee;
  const totalPrice = paymentMethod === 'deposit' ? totalOriginal * 0.5 : totalOriginal;

  // Check if selected page count meets the current product's minimum
  const isBelowMinimum = selectedPageCount < currentProduct.pagesLimit;
  // Find which products are compatible with the selected page count
  const compatibleProducts = products.filter(p => selectedPageCount >= p.pagesLimit);

  const handleProductSelect = (productId: 'softcover' | 'hardcover' | 'layflat') => {
    setSelectedProduct(productId);
    const prod = products.find(p => p.id === productId)!;
    const sizeSupported = prod.sizes.some(s => s.value === selectedSize);
    if (!sizeSupported) {
      setSelectedSize(prod.sizes[0].value);
    }
  };

  const handlePagesSubmit = (pageIds: string[]) => {
    setSelectedPageIds(pageIds);
    setStep('shipping');
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        userBookId: book.id,
        recipientName: shippingInfo.fullName,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        paymentMethod: paymentMethod.toUpperCase(),
        selectedPageIds: selectedPageIds,
      };

      const response = await orderApi.placeOrder(userId, orderData);
      setOrderId(response.id);
      setStep('confirmation');
      toast.success('🎉 Đặt hàng thành công!');
    } catch (err) {
      console.warn('⚠️ Kết nối backend thất bại. Chuyển sang chế độ demo:', err);
      setOrderId(`BK${Date.now().toString().slice(-6)}`);
      setStep('confirmation');
      toast.success('🎉 Đặt hàng thành công! (Chế độ mô phỏng)');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(250,250,248,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #DDD8D0',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium"
              style={{ color: '#7A6F66' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>

            <h1 className="text-lg font-bold" style={{ color: '#000000' }}>Đặt hàng</h1>
            <div className="w-20" />
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <div className="flex items-center justify-between relative">
            <div
              className="absolute top-5 left-0 right-0 h-0.5 rounded-full"
              style={{ background: '#DDD8D0' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: step === 'pages' ? '0%' : step === 'shipping' ? '33%' : step === 'payment' ? '66%' : '100%',
                  background: '#000000',
                }}
              />
            </div>

            {['pages', 'shipping', 'payment', 'confirmation'].map((s, index) => {
              const isActive    = step === s;
              const isCompleted = (s === 'pages' && (step === 'shipping' || step === 'payment' || step === 'confirmation')) ||
                                  (s === 'shipping' && (step === 'payment' || step === 'confirmation')) ||
                                  (s === 'payment' && step === 'confirmation');
              return (
                <div key={s} className="relative flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10"
                    style={{
                      background:  isActive ? '#000000' : isCompleted ? '#EDE9E3' : '#EDE9E3',
                      color:       isActive ? '#EDE9E3' : '#000000',
                      border:      isCompleted && !isActive ? '2px solid #7A6F66' : isActive ? 'none' : '2px solid #DDD8D0',
                      boxShadow:   isActive ? '0 4px 12px rgba(58,46,40,0.28)' : 'none',
                      transform:   isActive ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <p className="text-xs font-medium" style={{ color: isActive ? '#000000' : '#9B9088' }}>
                    {s === 'pages' ? 'Chọn trang' : s === 'shipping' ? 'Giao hàng' : s === 'payment' ? 'Thanh toán' : 'Hoàn tất'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            {step === 'pages' && (
              <PageSelectionStep
                pages={book.pages || []}
                cover={book.cover}
                onNext={handlePagesSubmit}
                onBack={onBack}
              />
            )}

            {step === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                {/* 1. Chọn loại sách & chất liệu giấy */}
                <div className="rounded-2xl p-6 space-y-6 animate-in fade-in duration-300" style={{ background: 'white', border: '1.5px solid #DDD8D0' }}>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" style={{ color: '#7A6F66' }} />
                    <h2 className="text-lg font-bold" style={{ color: '#000000' }}>
                      Chọn loại sách & chất liệu giấy
                    </h2>
                  </div>
                  <p className="text-xs -mt-4 text-[#7A6F66]">
                    Vui lòng chọn 1 trong 3 loại photobook cao cấp dưới đây:
                  </p>

                  {/* Minimum page count warning for current product */}
                  {isBelowMinimum && (
                    <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-amber-200 bg-amber-50">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#92400e' }}>
                          Không đủ số trang tối thiểu cho {currentProduct.nameVi}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#a16207' }}>
                          Bạn đã chọn <span className="font-bold">{selectedPageCount} trang</span>, nhưng {currentProduct.nameVi} yêu cầu tối thiểu <span className="font-bold">{currentProduct.pagesLimit} trang</span>.
                          {compatibleProducts.length > 0 ? (
                            <span> Vui lòng chọn loại sách khác phù hợp hơn: <span className="font-bold text-green-700">{compatibleProducts.map(p => p.nameVi).join(', ')}</span>.</span>
                          ) : (
                            <span> Vui lòng quay lại bước chọn trang để chọn thêm ít nhất {currentProduct.pagesLimit - selectedPageCount} trang nữa.</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-3 gap-4">
                    {products.map((prod) => {
                      const isSelected = selectedProduct === prod.id;
                      const isProdBelowMin = selectedPageCount < prod.pagesLimit;
                      return (
                        <div
                          key={prod.id}
                          onClick={() => handleProductSelect(prod.id)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md relative overflow-hidden group ${
                            isSelected
                              ? 'border-[#000000] bg-[#FAFAF8] shadow-sm'
                              : 'border-[#DDD8D0] bg-white hover:border-[#7A6F66]'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-8 h-8 bg-black flex items-center justify-center text-[#EDE9E3] rounded-bl-xl text-xs font-bold">
                              ✓
                            </div>
                          )}

                          <div className="space-y-3">
                            <div>
                              <p className="font-bold text-sm text-[#000000] leading-snug">
                                {prod.nameVi}
                              </p>
                              <p className="text-[10px] font-semibold text-[#7A6F66] uppercase tracking-wider mt-0.5">
                                {prod.name}
                              </p>
                            </div>

                            <div className="space-y-1.5 text-xs text-[#5A5049]">
                              <p className="flex items-center gap-1.5 font-medium">
                                <BookOpen className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#7A6F66' }} />
                                <span>{prod.pagesLabel}</span>
                                {isProdBelowMin && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                    <AlertTriangle className="w-2.5 h-2.5" />
                                    Cần tối thiểu {prod.pagesLimit} trang
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] leading-relaxed text-[#7A6F66] border-t border-[#EDE9E3] pt-1.5 mt-1.5">
                                <Layers className="w-3.5 h-3.5 inline mr-1 flex-shrink-0" style={{ color: '#9B9088' }} />
                                {prod.paperType}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-[#EDE9E3] space-y-3">
                            {/* Sizes Selection within the Card */}
                            <div>
                              <p className="text-[9px] font-bold text-[#9B9088] uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Ruler className="w-2.5 h-2.5" /> Kích thước:
                              </p>
                              <div className="flex gap-1.5">
                                {prod.sizes.map((sz) => {
                                  const isSizeSelected = isSelected && selectedSize === sz.value;
                                  return (
                                    <button
                                      key={sz.value}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProduct(prod.id);
                                        setSelectedSize(sz.value);
                                      }}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                        isSizeSelected
                                          ? 'bg-black text-[#EDE9E3]'
                                          : isSelected
                                          ? 'bg-[#EDE9E3] text-[#5A5049] hover:bg-[#DDD8D0]'
                                          : 'bg-[#FAFAF8] text-[#9B9088] hover:bg-[#EDE9E3]'
                                      }`}
                                    >
                                      {sz.value}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Prices display */}
                            <div>
                              <p className="text-[9px] font-bold text-[#9B9088] uppercase tracking-wider leading-none">
                                Giá cơ bản:
                              </p>
                              <p className="text-sm font-extrabold text-[#000000] mt-1">
                                {prod.sizes[0].price.toLocaleString('vi-VN')} ₫
                                {prod.sizes.length > 1 && prod.sizes[0].price !== prod.sizes[1].price && ` - ${prod.sizes[1].price.toLocaleString('vi-VN')} ₫`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Page count info (derived from selection) */}
                  <div className="pt-6 border-t border-[#EDE9E3] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-[#000000] flex items-center gap-1.5">
                          Số trang đã chọn để in
                        </h3>
                        <p className="text-xs text-[#7A6F66]">
                          Số trang bạn đã chọn ở bước trước. Tối thiểu {currentProduct.pagesLimit} trang đã bao gồm trong giá cơ bản.
                        </p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-lg font-bold text-[#000000] leading-none">{selectedPageCount} trang</p>
                        <p className="text-[10px] text-[#7A6F66] mt-1 font-semibold">{Math.ceil(selectedPageCount / 2)} tờ</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F5F2EE] text-xs text-[#7A6F66] flex flex-col gap-1.5 animate-in fade-in duration-300">
                      <p>
                        • Số trang mặc định đi kèm: <span className="font-semibold text-[#000000]">{currentProduct.pagesLimit} trang</span> (đã bao gồm trong giá cơ bản).
                      </p>
                      {selectedPageCount > currentProduct.pagesLimit ? (
                        <p className="text-[#10b981] font-semibold">
                          • Bạn đang in thêm: {(selectedPageCount - currentProduct.pagesLimit)} trang ({Math.ceil((selectedPageCount - currentProduct.pagesLimit) / 2)} tờ). Phụ phí: +{pagePrice.toLocaleString('vi-VN')} ₫.
                          {currentProduct.id !== 'layflat' ? ' (12.000 ₫/tờ C150)' : ' (30.000 ₫/tờ Lay-flat)'}
                        </p>
                      ) : (
                        <p>• Số trang trong giới hạn tiêu chuẩn, không phát sinh phụ phí.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Thông tin giao hàng */}
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '1.5px solid #DDD8D0' }}>
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#000000' }}>
                    <MapPin className="w-5 h-5" style={{ color: '#7A6F66' }} />
                    Thông tin giao hàng
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Họ và tên *', type: 'text', key: 'fullName', icon: User, placeholder: '' },
                      { label: 'Số điện thoại *', type: 'tel', key: 'phone', icon: Phone, placeholder: '0123456789' },
                    ].map(({ label, type, key, icon: Icon, placeholder }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9088' }} />
                          <input
                            type={type}
                            required
                            value={(shippingInfo as any)[key]}
                            onChange={e => setShippingInfo({ ...shippingInfo, [key]: e.target.value })}
                            placeholder={placeholder}
                            className="w-full pl-10 pr-4 py-3 rounded-xl outline-none text-sm transition-all"
                            style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                            onFocus={e => ((e.target as HTMLElement).style.borderColor = '#7A6F66')}
                            onBlur={e  => ((e.target as HTMLElement).style.borderColor = '#DDD8D0')}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9088' }} />
                        <input
                          type="email" required value={shippingInfo.email}
                          onChange={e => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl outline-none text-sm transition-all"
                          style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                          onFocus={e => ((e.target as HTMLElement).style.borderColor = '#7A6F66')}
                          onBlur={e  => ((e.target as HTMLElement).style.borderColor = '#DDD8D0')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Thành phố *</label>
                      <select
                        required value={shippingInfo.city}
                        onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                        style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                      >
                        <option value="">Chọn thành phố</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Quận/Huyện *</label>
                      <input
                        type="text" required value={shippingInfo.district}
                        onChange={e => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                        style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                        onFocus={e => ((e.target as HTMLElement).style.borderColor = '#7A6F66')}
                        onBlur={e  => ((e.target as HTMLElement).style.borderColor = '#DDD8D0')}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Địa chỉ chi tiết *</label>
                      <textarea
                        required value={shippingInfo.address}
                        onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        rows={3} placeholder="Số nhà, tên đường..."
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all resize-none"
                        style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                        onFocus={e => ((e.target as HTMLElement).style.borderColor = '#7A6F66')}
                        onBlur={e  => ((e.target as HTMLElement).style.borderColor = '#DDD8D0')}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Ghi chú (tùy chọn)</label>
                      <textarea
                        value={shippingInfo.notes}
                        onChange={e => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                        rows={2} placeholder="Ghi chú cho người giao hàng..."
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all resize-none"
                        style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: '#000000', color: '#EDE9E3', boxShadow: '0 6px 20px rgba(58,46,40,0.22)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
                >
                  Tiếp tục thanh toán
                </button>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '1.5px solid #DDD8D0' }}>
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#000000' }}>
                    <CreditCard className="w-5 h-5" style={{ color: '#7A6F66' }} />
                    Phương thức thanh toán
                  </h2>

                  <div className="space-y-3">
                    {[
                      { method: 'full', title: 'Thanh toán trước', sub: 'Thanh toán trước 100% giá trị đơn hàng qua VietQR' },
                      { method: 'deposit', title: 'Đặt cọc 50% hàng', sub: 'Đặt cọc trước 50%, thanh toán 50% còn lại khi nhận hàng' },
                    ].map(({ method, title, sub }) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method as 'full' | 'deposit')}
                        className="w-full p-4 rounded-xl text-left transition-all"
                        style={{
                          border: paymentMethod === method ? '2px solid #000000' : '1.5px solid #DDD8D0',
                          background: paymentMethod === method ? '#F5F2EE' : '#FAFAF8',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{ borderColor: paymentMethod === method ? '#000000' : '#C8C2BA' }}
                          >
                            {paymentMethod === method && (
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#000000' }} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: '#000000' }}>{title}</p>
                            <p className="text-xs" style={{ color: '#7A6F66' }}>{sub}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('shipping')}
                    className="flex-1 py-4 px-6 rounded-2xl font-semibold transition-all"
                    style={{ background: '#EDE9E3', color: '#5A5049' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#DDD8D0')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={loading}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{ background: '#000000', color: '#EDE9E3', boxShadow: '0 6px 20px rgba(58,46,40,0.22)' }}
                    onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.background = '#000000')}
                    onMouseLeave={e => !loading && ((e.currentTarget as HTMLElement).style.background = '#000000')}
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                  </button>
                </div>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="rounded-2xl p-8 text-center" style={{ background: 'white', border: '1.5px solid #DDD8D0' }}>
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: '#EDE9E3' }}
                  >
                    <CheckCircle className="w-10 h-10" style={{ color: '#000000' }} />
                  </div>

                  <h2 className="text-2xl font-bold mb-3" style={{ color: '#000000' }}>
                    Đặt hàng thành công! 🎉
                  </h2>
                  <p className="mb-6 text-sm" style={{ color: '#7A6F66' }}>
                    Cảm ơn bạn đã tin tưởng DearMemories. Cuốn sách của bạn đang được xử lý thiết kế và in ấn!
                  </p>

                  {/* 1. QR Code Payment */}
                  <div className="p-6 rounded-2xl border border-[#DDD8D0] bg-[#FAFAF8] mb-6 text-center space-y-4 max-w-sm mx-auto">
                    <p className="font-bold text-sm text-[#000000]">
                      {paymentMethod === 'deposit' ? 'Quét mã để chuyển khoản đặt cọc 50%:' : 'Quét mã để thanh toán 100%:'}
                    </p>
                    <div className="w-48 h-48 mx-auto border-2 border-neutral-100 rounded-xl overflow-hidden shadow-sm p-1 bg-white">
                      <img
                        src="/NgocjQR.png"
                        alt="Payment QR Code"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 text-xs text-[#7A6F66]">
                      <p>
                        Số tiền cần chuyển: <span className="font-extrabold text-base text-emerald-600">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                      </p>
                      <p>
                        Nội dung chuyển khoản: <span className="font-mono font-bold text-[#000000]">BK{orderId || 'DEARBOOK'}</span>
                      </p>
                    </div>
                  </div>

                  {/* 2. Confirmation Form Link */}
                  <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50 text-left space-y-3 mb-6 max-w-md mx-auto">
                    <div className="flex items-center gap-2 text-amber-800">
                      <span className="text-lg">⚠️</span>
                      <p className="font-bold text-sm">
                        Hoàn tất chuyển khoản đơn hàng
                      </p>
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Để xác nhận chuyển khoản thành công và đẩy nhanh sản xuất, bạn vui lòng điền thông tin và tải ảnh hóa đơn giao dịch tại Form xác nhận sau:
                    </p>
                    <a
                      href="https://forms.gle/Svy4UUKsFnFUkW7u9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md text-center animate-pulse"
                    >
                      Click điền Form xác nhận chuyển khoản 📝
                    </a>
                  </div>

                  {/* 3. Order Details Summary */}
                  <div
                    className="rounded-xl p-5 text-left space-y-2 mb-6"
                    style={{ background: '#F5F2EE' }}
                  >
                    <p className="font-semibold text-sm" style={{ color: '#000000' }}>📦 Thông tin đơn hàng:</p>
                    <div className="space-y-1.5 text-sm" style={{ color: '#7A6F66' }}>
                      <p>• Mã đơn: <span className="font-mono font-bold text-[#000000]">#{orderId || `BK${Date.now()}`}</span></p>
                      <p>• Loại photobook: <span className="font-semibold text-[#000000]">{currentProduct.nameVi}</span></p>
                      <p>• Kích thước: <span className="font-semibold text-[#000000]">{selectedSize}</span></p>
                      <p>• Số trang: <span className="font-semibold text-[#000000]">{selectedPageCount} trang</span></p>
                      <p>• Hình thức thanh toán: <span className="font-bold text-orange-600">{paymentMethod === 'deposit' ? 'Đặt cọc trước 50%' : 'Thanh toán trước 100%'}</span></p>
                      <p>• Người nhận: <span className="font-semibold text-[#000000]">{shippingInfo.fullName}</span></p>
                      <p>• SĐT: <span className="font-semibold text-[#000000]">{shippingInfo.phone}</span></p>
                      <p>• Email: <span className="font-semibold text-[#000000]">{shippingInfo.email}</span></p>
                      <p>• Số tiền cần chuyển khoản: <span className="font-bold text-[#000000]">{totalPrice.toLocaleString('vi-VN')} ₫</span></p>
                    </div>
                  </div>

                  <button
                    onClick={handleComplete}
                    className="w-full py-4 px-6 rounded-2xl font-bold transition-all hover:-translate-y-0.5"
                    style={{ background: '#000000', color: '#EDE9E3' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl p-5 sticky top-24"
              style={{ background: 'white', border: '1.5px solid #DDD8D0' }}
            >
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#000000' }}>
                <Package className="w-4 h-4" style={{ color: '#7A6F66' }} />
                Đơn hàng
              </h3>

              <div className="space-y-4 mb-5">
                <div className="flex gap-3">
                  <div
                    className="w-14 h-18 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl"
                    style={{ background: '#EDE9E3', minHeight: '72px' }}
                  >
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: '#000000' }}>
                      {book.title || 'Cuốn sách của tôi'}
                    </p>
                    <p className="text-xs mt-1 font-bold text-neutral-800">
                      {currentProduct.nameVi}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#7A6F66' }}>
                      Kích thước: {selectedSize} · {selectedPageCount} trang
                    </p>
                    <p className="text-[10px] italic mt-0.5 leading-snug" style={{ color: '#9B9088' }}>
                      {currentProduct.paperType}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm pt-3" style={{ borderTop: '1px solid #EDE9E3' }}>
                  <div className="flex justify-between">
                    <span style={{ color: '#7A6F66' }}>Giá cơ bản ({currentProduct.pagesLimit} trang)</span>
                    <span className="font-medium" style={{ color: '#000000' }}>{basePrice.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  {additionalPages > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: '#7A6F66' }}>Trang thêm ({additionalPages})</span>
                      <span className="font-medium" style={{ color: '#000000' }}>{pagePrice.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: '#7A6F66' }}>Phí vận chuyển</span>
                    <span className="font-medium" style={{ color: '#000000' }}>{shippingFee.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>

                <div className="pt-3" style={{ borderTop: '1px solid #EDE9E3' }}>
                  {paymentMethod === 'deposit' && (
                    <div className="flex justify-between text-xs text-[#7A6F66] mb-1.5 animate-in fade-in duration-300">
                      <span>Đã bớt 50% đặt cọc:</span>
                      <span className="font-semibold text-rose-500">-( {(totalOriginal * 0.5).toLocaleString('vi-VN')} ₫ )</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span style={{ color: '#000000' }}>{paymentMethod === 'deposit' ? 'Đặt cọc 50%' : 'Tổng cộng'}</span>
                    <span style={{ color: '#000000' }}>{totalPrice.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>

              <div
                className="p-4 rounded-xl text-xs space-y-1"
                style={{ background: '#F5F2EE' }}
              >
                <p className="font-semibold" style={{ color: '#5A5049' }}>📝 Cam kết chất lượng:</p>
                <p style={{ color: '#7A6F66' }}>✓ In ấn cao cấp</p>
                <p style={{ color: '#7A6F66' }}>✓ Hoàn tiền 100% nếu không hài lòng</p>
                <p style={{ color: '#7A6F66' }}>✓ Giao hàng đúng hẹn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}