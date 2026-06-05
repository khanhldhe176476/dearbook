import { useState, useRef } from 'react';
import { ArrowLeft, Package, CreditCard, CheckCircle, MapPin, Phone, Mail, User, Loader2, BookOpen, Layers, Ruler, AlertTriangle, Upload, FileText, X } from 'lucide-react';
import { BookData, User as UserData } from '../App';
import { orderApi } from '../lib/orderApi';
import { PageSelectionStep } from './PageSelectionStep';
import { toast } from 'sonner@2.0.3';

const MAX_PDF_SIZE = 500 * 1024 * 1024; // 500MB

// 63 tá»‰nh thÃ nh Viá»‡t Nam
const VIETNAM_PROVINCES = [
  'An Giang', 'BÃ  Rá»‹a - VÅ©ng TÃ u', 'Báº¡c LiÃªu', 'Báº¯c Giang', 'Báº¯c Káº¡n', 'Báº¯c Ninh',
  'Báº¿n Tre', 'BÃ¬nh DÆ°Æ¡ng', 'BÃ¬nh Äá»‹nh', 'BÃ¬nh PhÆ°á»›c', 'BÃ¬nh Thuáº­n', 'CÃ  Mau',
  'Cao Báº±ng', 'Cáº§n ThÆ¡', 'ÄÃ  Náºµng', 'Äáº¯k Láº¯k', 'Äáº¯k NÃ´ng', 'Äiá»‡n BiÃªn',
  'Äá»“ng Nai', 'Äá»“ng ThÃ¡p', 'Gia Lai', 'HÃ  Giang', 'HÃ  Nam', 'HÃ  Ná»™i',
  'HÃ  TÄ©nh', 'Háº£i DÆ°Æ¡ng', 'Háº£i PhÃ²ng', 'Háº­u Giang', 'HÃ²a BÃ¬nh', 'TP. Há»“ ChÃ­ Minh',
  'HÆ°ng YÃªn', 'KhÃ¡nh HÃ²a', 'KiÃªn Giang', 'Kon Tum', 'Lai ChÃ¢u', 'Láº¡ng SÆ¡n',
  'LÃ o Cai', 'LÃ¢m Äá»“ng', 'Long An', 'Nam Äá»‹nh', 'Nghá»‡ An', 'Ninh BÃ¬nh',
  'Ninh Thuáº­n', 'PhÃº Thá»', 'PhÃº YÃªn', 'Quáº£ng BÃ¬nh', 'Quáº£ng Nam', 'Quáº£ng NgÃ£i',
  'Quáº£ng Ninh', 'Quáº£ng Trá»‹', 'SÃ³c TrÄƒng', 'SÆ¡n La', 'TÃ¢y Ninh', 'ThÃ¡i BÃ¬nh',
  'ThÃ¡i NguyÃªn', 'Thanh HÃ³a', 'Thá»«a ThiÃªn Huáº¿', 'Tiá»n Giang', 'TrÃ  Vinh',
  'TuyÃªn Quang', 'VÄ©nh Long', 'VÄ©nh PhÃºc', 'YÃªn BÃ¡i',
];

const products = [
  {
    id: 'softcover' as const,
    name: 'Softcover Photobook',
    nameVi: 'SÃ¡ch áº£nh BÃ¬a Má»m',
    sizes: [
      { label: 'A4 (21x30cm)', value: 'A4' as const, price: 245000 },
      { label: '20x20cm', value: '20x20' as const, price: 245000 },
    ],
    pagesLimit: 40,
    pagesLabel: '40 trang = 20 tá» (cáº£ bÃ¬a)',
    paperType: 'BÃ¬a: Giáº¥y C300 Â· Trang trong: Giáº¥y C150',
    extraPageCost: 6000, // 6.000Ä‘ / trang = 12.000Ä‘ / tá» (Giáº¥y C150)
    extraSheetCost: 12000,
  },
  {
    id: 'hardcover' as const,
    name: 'Hardcover Photobook',
    nameVi: 'SÃ¡ch áº£nh BÃ¬a Cá»©ng',
    sizes: [
      { label: 'A4 (21x30cm)', value: 'A4' as const, price: 375000 },
      { label: '20x20cm', value: '20x20' as const, price: 375000 },
    ],
    pagesLimit: 40,
    pagesLabel: '40 trang = 20 tá» (cáº£ bÃ¬a)',
    paperType: 'BÃ¬a: BÃ¬a carton cá»©ng Â· Trang trong: Giáº¥y C150',
    extraPageCost: 6000, // 6.000Ä‘ / trang = 12.000Ä‘ / tá» (Giáº¥y C150)
    extraSheetCost: 12000,
  },
  {
    id: 'layflat' as const,
    name: 'Lay-flat Hardcover Photobook',
    nameVi: 'SÃ¡ch áº£nh BÃ¬a Cá»©ng Má»Ÿ Pháº³ng',
    sizes: [
      { label: '20x20cm', value: '20x20' as const, price: 399000 },
    ],
    pagesLimit: 14,
    pagesLabel: '14 trang = 7 tá» (cáº£ bÃ¬a)',
    paperType: 'BÃ¬a carton cá»©ng cÃ¡ng má», hiá»‡u á»©ng má»Ÿ pháº³ng liá»n máº¡ch khi má»Ÿ 2 trang Ä‘á»‘i diá»‡n',
    extraPageCost: 15000, // 15.000Ä‘ / trang = 30.000Ä‘ / tá»
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

  // Phone validation
  const [phoneError, setPhoneError] = useState('');
  const validatePhone = (phone: string): boolean => {
    if (!phone) { setPhoneError(''); return false; }
    if (!/^0\d{9}$/.test(phone)) {
      setPhoneError('Sá»‘ Ä‘iá»‡n thoáº¡i pháº£i gá»“m 10 chá»¯ sá»‘ vÃ  báº¯t Ä‘áº§u báº±ng 0');
      return false;
    }
    setPhoneError('');
    return true;
  };

  // PDF file upload state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

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

    // Block progression if selected page count is below the product's minimum
    if (isBelowMinimum) {
      if (compatibleProducts.length > 0) {
        toast.error(
          `KhÃ´ng Ä‘á»§ ${currentProduct.pagesLimit} trang tá»‘i thiá»ƒu cho ${currentProduct.nameVi}. Vui lÃ²ng chá»n: ${compatibleProducts.map(p => p.nameVi).join(' hoáº·c ')}.`,
          { duration: 6000 }
        );
      } else {
        toast.error(
          `Cáº§n tá»‘i thiá»ƒu ${currentProduct.pagesLimit} trang. Vui lÃ²ng quay láº¡i bÆ°á»›c chá»n trang Ä‘á»ƒ thÃªm Ã­t nháº¥t ${currentProduct.pagesLimit - selectedPageCount} trang ná»¯a.`,
          { duration: 6000 }
        );
      }
      return;
    }

    // Validate required fields
    if (!shippingInfo.fullName.trim()) {
      toast.error('Vui lÃ²ng nháº­p há» vÃ  tÃªn.');
      return;
    }
    if (!shippingInfo.phone.trim()) {
      toast.error('Vui lÃ²ng nháº­p sá»‘ Ä‘iá»‡n thoáº¡i.');
      return;
    }
    if (!validatePhone(shippingInfo.phone)) {
      toast.error(phoneError || 'Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng há»£p lá»‡.');
      return;
    }
    if (!shippingInfo.email.trim()) {
      toast.error('Vui lÃ²ng nháº­p email.');
      return;
    }
    if (!shippingInfo.city) {
      toast.error('Vui lÃ²ng chá»n tá»‰nh/thÃ nh phá»‘.');
      return;
    }
    if (!shippingInfo.district.trim()) {
      toast.error('Vui lÃ²ng nháº­p quáº­n/huyá»‡n.');
      return;
    }
    if (!shippingInfo.address.trim()) {
      toast.error('Vui lÃ²ng nháº­p Ä‘á»‹a chá»‰ chi tiáº¿t.');
      return;
    }

    setStep('payment');
  };

  // PDF upload handler with size validation
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Vui lÃ²ng chá»n file PDF há»£p lá»‡.');
      // Reset input
      if (pdfInputRef.current) pdfInputRef.current.value = '';
      return;
    }

    // Validate file size (max 500MB)
    if (file.size > MAX_PDF_SIZE) {
      toast.error(`File quÃ¡ lá»›n (${(file.size / 1024 / 1024).toFixed(1)}MB). Vui lÃ²ng chá»n file PDF dÆ°á»›i 500MB.`);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
      return;
    }

    setPdfFile(file);
    toast.success(`ÄÃ£ táº£i lÃªn: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };

  const handlePaymentSubmit = async () => {
    try {
      setLoading(true);
      console.log('[OrderFlow] 1ï¸âƒ£ Báº¯t Ä‘áº§u gá»­i Ä‘Æ¡n hÃ ng...');

      // Collect the actual designed pages data
      const allPages = book.pages || [];
      const designPages = allPages.filter((p, i) => {
        const id = p?.id || p?.templatePageId || `page-${i}`;
        return selectedPageIds.includes(id);
      });
      console.log('[OrderFlow] 2ï¸âƒ£ Design pages:', designPages.length, 'items');

      // CHá»ˆ gá»­i tÃªn file PDF, KHÃ”NG gá»­i ná»™i dung Ä‘á»ƒ trÃ¡nh Connection Reset (100MB+ payload)
      const pdfFileName = pdfFile ? pdfFile.name : null;
      const pdfFileSize = pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(1)}MB` : null;
      console.log('[OrderFlow] 3ï¸âƒ£ PDF file:', pdfFileName, pdfFileSize || '(khÃ´ng cÃ³)');

      const orderData = {
        userBookId: book.id,
        customerName: shippingInfo.fullName,
        recipientName: shippingInfo.fullName,
        phone: shippingInfo.phone,
        email: shippingInfo.email,
        address: shippingInfo.address,
        city: shippingInfo.city,
        district: shippingInfo.district,
        note: shippingInfo.notes || null,

        note: [
          shippingInfo.notes,
          pdfFileName ? `[PDF Ä‘Ã­nh kÃ¨m: ${pdfFileName} - ${pdfFileSize}]` : null,
        ].filter(Boolean).join(' | '),
        collectionName: book.title || book.templateName || 'Photobook',
        productType: selectedProduct,
        productSize: selectedSize,
        quantity: 1,
        customPages: selectedPageCount,
        paymentMethod: paymentMethod.toUpperCase(),
        designPages: designPages,
        pdfFileName: pdfFileName,
        pdfFileData: null, // KhÃ´ng gá»­i binary data Ä‘á»ƒ trÃ¡nh payload quÃ¡ lá»›n
      };
      console.log('[OrderFlow] 4ï¸âƒ£ OrderData prepared, designPages:', designPages.length);

      // Kiá»ƒm tra JSON.stringify khÃ´ng lá»—i trÆ°á»›c khi gá»­i
      try {
        const testJson = JSON.stringify(orderData);
        console.log('[OrderFlow] 5ï¸âƒ£ JSON.stringify OK, size:', (testJson.length / 1024).toFixed(0), 'KB');
      } catch (jsonErr) {
        console.error('[OrderFlow] 5ï¸âƒ£âŒ JSON.stringify FAILED:', jsonErr);
        throw new Error('Dá»¯ liá»‡u Ä‘Æ¡n hÃ ng quÃ¡ lá»›n hoáº·c chá»©a ná»™i dung khÃ´ng há»£p lá»‡. Vui lÃ²ng thá»­ láº¡i.');
      }

      console.log('[OrderFlow] 6ï¸âƒ£ Gá»i API placeOrder...');
      const response = await orderApi.placeOrder(userId, orderData);
      console.log('[OrderFlow] 7ï¸âƒ£âœ… API thÃ nh cÃ´ng:', response);

      if (pdfFile) {
        toast.info('â³ Äang táº£i file PDF thiáº¿t káº¿ lÃªn há»‡ thá»‘ng...');
        await orderApi.uploadPdf(response.id, userId, pdfFile);
        console.log('[OrderFlow] 8ï¸âƒ£âœ… Táº£i file PDF thÃ nh cÃ´ng');
      }

      setOrderId(response.id);
      setStep('confirmation');
      toast.success('ðŸŽ‰ Äáº·t hÃ ng thÃ nh cÃ´ng!');
    } catch (err: any) {
      console.error('[OrderFlow] âŒ Äáº·t hÃ ng tháº¥t báº¡i:', err);

      // TrÃ­ch xuáº¥t message lá»—i cá»¥ thá»ƒ Ä‘á»ƒ hiá»ƒn thá»‹ cho user
      let errorDetail = '';
      if (err?.message) {
        // Láº¥y pháº§n message sau "API error XXX: " náº¿u cÃ³
        const match = err.message.match(/API error \d+:\s*(.+)/);
        errorDetail = match ? match[1] : err.message;
        // Cáº¯t ngáº¯n náº¿u quÃ¡ dÃ i
        if (errorDetail.length > 200) errorDetail = errorDetail.substring(0, 200) + '...';
      }

      toast.error(
        `KhÃ´ng thá»ƒ gá»­i Ä‘Æ¡n hÃ ng.${errorDetail ? `\nLá»—i: ${errorDetail}` : ''}\nKiá»ƒm tra: Backend Ä‘Ã£ cháº¡y chÆ°a? (port 8080)`,
        { duration: 10000 }
      );
      // KhÃ´ng chuyá»ƒn sang confirmation â€” giá»¯ user á»Ÿ bÆ°á»›c payment Ä‘á»ƒ thá»­ láº¡i
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
              <span>Quay láº¡i</span>
            </button>

            <h1 className="text-lg font-bold" style={{ color: '#000000' }}>Äáº·t hÃ ng</h1>
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
              const isActive = step === s;
              const isCompleted = (s === 'pages' && (step === 'shipping' || step === 'payment' || step === 'confirmation')) ||
                (s === 'shipping' && (step === 'payment' || step === 'confirmation')) ||
                (s === 'payment' && step === 'confirmation');
              return (
                <div key={s} className="relative flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10"
                    style={{
                      background: isActive ? '#000000' : isCompleted ? '#EDE9E3' : '#EDE9E3',
                      color: isActive ? '#EDE9E3' : '#000000',
                      border: isCompleted && !isActive ? '2px solid #7A6F66' : isActive ? 'none' : '2px solid #DDD8D0',
                      boxShadow: isActive ? '0 4px 12px rgba(58,46,40,0.28)' : 'none',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {isCompleted ? 'âœ“' : index + 1}
                  </div>
                  <p className="text-xs font-medium" style={{ color: isActive ? '#000000' : '#9B9088' }}>
                    {s === 'pages' ? 'Chá»n trang' : s === 'shipping' ? 'Giao hÃ ng' : s === 'payment' ? 'Thanh toÃ¡n' : 'HoÃ n táº¥t'}
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
                {/* 1. Chá»n loáº¡i sÃ¡ch & cháº¥t liá»‡u giáº¥y */}
                <div className="rounded-2xl p-6 space-y-6 animate-in fade-in duration-300" style={{ background: 'white', border: '1.5px solid #DDD8D0' }}>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" style={{ color: '#7A6F66' }} />
                    <h2 className="text-lg font-bold" style={{ color: '#000000' }}>
                      Chá»n loáº¡i sÃ¡ch & cháº¥t liá»‡u giáº¥y
                    </h2>
                  </div>
                  <p className="text-xs -mt-4 text-[#7A6F66]">
                    Vui lÃ²ng chá»n 1 trong 3 loáº¡i photobook cao cáº¥p dÆ°á»›i Ä‘Ã¢y:
                  </p>

                  {/* Minimum page count warning for current product */}
                  {isBelowMinimum && (
                    <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-amber-200 bg-amber-50">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#92400e' }}>
                          KhÃ´ng Ä‘á»§ sá»‘ trang tá»‘i thiá»ƒu cho {currentProduct.nameVi}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#a16207' }}>
                          Báº¡n Ä‘Ã£ chá»n <span className="font-bold">{selectedPageCount} trang</span>, nhÆ°ng {currentProduct.nameVi} yÃªu cáº§u tá»‘i thiá»ƒu <span className="font-bold">{currentProduct.pagesLimit} trang</span>.
                          {compatibleProducts.length > 0 ? (
                            <span> Vui lÃ²ng chá»n loáº¡i sÃ¡ch khÃ¡c phÃ¹ há»£p hÆ¡n: <span className="font-bold text-green-700">{compatibleProducts.map(p => p.nameVi).join(', ')}</span>.</span>
                          ) : (
                            <span> Vui lÃ²ng quay láº¡i bÆ°á»›c chá»n trang Ä‘á»ƒ chá»n thÃªm Ã­t nháº¥t {currentProduct.pagesLimit - selectedPageCount} trang ná»¯a.</span>
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
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md relative overflow-hidden group ${isSelected
                            ? 'border-[#000000] bg-[#FAFAF8] shadow-sm'
                            : 'border-[#DDD8D0] bg-white hover:border-[#7A6F66]'
                            }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-8 h-8 bg-black flex items-center justify-center text-[#EDE9E3] rounded-bl-xl text-xs font-bold">
                              âœ“
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
                                    Cáº§n tá»‘i thiá»ƒu {prod.pagesLimit} trang
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
                                <Ruler className="w-2.5 h-2.5" /> KÃ­ch thÆ°á»›c:
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
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${isSizeSelected
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
                                GiÃ¡ cÆ¡ báº£n:
                              </p>
                              <p className="text-sm font-extrabold text-[#000000] mt-1">
                                {prod.sizes[0].price.toLocaleString('vi-VN')} â‚«
                                {prod.sizes.length > 1 && prod.sizes[0].price !== prod.sizes[1].price && ` - ${prod.sizes[1].price.toLocaleString('vi-VN')} â‚«`}
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
                          Sá»‘ trang Ä‘Ã£ chá»n Ä‘á»ƒ in
                        </h3>
                        <p className="text-xs text-[#7A6F66]">
                          Sá»‘ trang báº¡n Ä‘Ã£ chá»n á»Ÿ bÆ°á»›c trÆ°á»›c. Tá»‘i thiá»ƒu {currentProduct.pagesLimit} trang Ä‘Ã£ bao gá»“m trong giÃ¡ cÆ¡ báº£n.
                        </p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-lg font-bold text-[#000000] leading-none">{selectedPageCount} trang</p>
                        <p className="text-[10px] text-[#7A6F66] mt-1 font-semibold">{Math.ceil(selectedPageCount / 2)} tá»</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F5F2EE] text-xs text-[#7A6F66] flex flex-col gap-1.5 animate-in fade-in duration-300">
                      <p>
                        â€¢ Sá»‘ trang máº·c Ä‘á»‹nh Ä‘i kÃ¨m: <span className="font-semibold text-[#000000]">{currentProduct.pagesLimit} trang</span> (Ä‘Ã£ bao gá»“m trong giÃ¡ cÆ¡ báº£n).
                      </p>
                      {selectedPageCount > currentProduct.pagesLimit ? (
                        <p className="text-[#10b981] font-semibold">
                          â€¢ Báº¡n Ä‘ang in thÃªm: {(selectedPageCount - currentProduct.pagesLimit)} trang ({Math.ceil((selectedPageCount - currentProduct.pagesLimit) / 2)} tá»). Phá»¥ phÃ­: +{pagePrice.toLocaleString('vi-VN')} â‚«.
                          {currentProduct.id !== 'layflat' ? ' (12.000 â‚«/tá» C150)' : ' (30.000 â‚«/tá» Lay-flat)'}
                        </p>
                      ) : (
                        <p>â€¢ Sá»‘ trang trong giá»›i háº¡n tiÃªu chuáº©n, khÃ´ng phÃ¡t sinh phá»¥ phÃ­.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Upload file PDF thiáº¿t káº¿ */}
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '1.5px solid #DDD8D0' }}>
                  <h2 className="text-lg font-bold mb-1 flex items-center gap-2" style={{ color: '#000000' }}>
                    <FileText className="w-5 h-5" style={{ color: '#7A6F66' }} />
                    File thiáº¿t káº¿ PDF
                  </h2>
                  <p className="text-xs mb-4" style={{ color: '#7A6F66' }}>
                    Táº£i lÃªn file PDF báº¡n Ä‘Ã£ xuáº¥t tá»« bÆ°á»›c chá»n trang. File sáº½ Ä‘Æ°á»£c gá»­i kÃ¨m Ä‘Æ¡n hÃ ng Ä‘á»ƒ in áº¥n chÃ­nh xÃ¡c.
                  </p>

                  {/* Hidden file input */}
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfFileChange}
                    className="hidden"
                  />

                  {pdfFile ? (
                    /* Uploaded file display */
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-green-200 bg-green-50/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#000000] truncate">{pdfFile.name}</p>
                          <p className="text-xs text-green-700 font-medium">
                            âœ“ ÄÃ£ sáºµn sÃ ng Â· {(pdfFile.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePdf}
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0"
                        title="Gá»¡ file"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    /* Upload prompt */
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="w-full p-6 rounded-xl border-2 border-dashed border-[#C8C2BA] hover:border-[#7A6F66] bg-[#FAFAF8] hover:bg-[#F5F2EE] transition-all group"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-[#EDE9E3] flex items-center justify-center group-hover:bg-[#DDD8D0] transition-colors">
                          <Upload className="w-6 h-6" style={{ color: '#7A6F66' }} />
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: '#000000' }}>
                            Nháº¥n Ä‘á»ƒ táº£i lÃªn file PDF
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#9B9088' }}>
                            Há»— trá»£ file PDF Â· Tá»‘i Ä‘a 500MB
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                </div>

                {/* 3. ThÃ´ng tin giao hÃ ng */}
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '1.5px solid #DDD8D0' }}>
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#000000' }}>
                    <MapPin className="w-5 h-5" style={{ color: '#7A6F66' }} />
                    ThÃ´ng tin giao hÃ ng
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Há» vÃ  tÃªn *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9088' }} />
                        <input
                          type="text"
                          required
                          value={shippingInfo.fullName}
                          onChange={e => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                          placeholder="Nguyá»…n VÄƒn A"
                          className="w-full pl-10 pr-4 py-3 rounded-xl outline-none text-sm transition-all"
                          style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                          onFocus={e => ((e.target as HTMLElement).style.borderColor = '#7A6F66')}
                          onBlur={e => ((e.target as HTMLElement).style.borderColor = '#DDD8D0')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Sá»‘ Ä‘iá»‡n thoáº¡i *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9088' }} />
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setShippingInfo({ ...shippingInfo, phone: val });
                            if (val) validatePhone(val);
                          }}
                          onBlur={() => {
                            if (shippingInfo.phone) validatePhone(shippingInfo.phone);
                          }}
                          placeholder="0123456789"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl outline-none text-sm transition-all ${
                            phoneError ? 'border-red-400 focus:border-red-500' : ''
                          }`}
                          style={{
                            border: phoneError ? '2px solid #f87171' : '1.5px solid #DDD8D0',
                            color: '#000000',
                            background: '#FAFAF8',
                          }}
                          onFocus={e => {
                            (e.target as HTMLElement).style.borderColor = phoneError ? '#ef4444' : '#7A6F66';
                          }}
                          onBlur={e => {
                            (e.target as HTMLElement).style.borderColor = phoneError ? '#f87171' : '#DDD8D0';
                          }}
                        />
                      </div>
                      {phoneError && (
                        <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{phoneError}</p>
                      )}
                    </div>

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
                          onBlur={e => ((e.target as HTMLElement).style.borderColor = '#DDD8D0')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Tá»‰nh/ThÃ nh phá»‘ *</label>
                      <select
                        required value={shippingInfo.city}
                        onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                        style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                      >
                        <option value="">Chá»n tá»‰nh/thÃ nh phá»‘</option>
                        {VIETNAM_PROVINCES.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Quáº­n/Huyá»‡n *</label>
                      <input
                        type="text" required value={shippingInfo.district}
                        onChange={e => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                        style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                        onFocus={e => ((e.target as HTMLElement).style.borderColor = '#7A6F66')}
                        onBlur={e => ((e.target as HTMLElement).style.borderColor = '#DDD8D0')}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Äá»‹a chá»‰ chi tiáº¿t *</label>
                      <textarea
                        required value={shippingInfo.address}
                        onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        rows={3} placeholder="Sá»‘ nhÃ , tÃªn Ä‘Æ°á»ng..."
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all resize-none"
                        style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                        onFocus={e => ((e.target as HTMLElement).style.borderColor = '#7A6F66')}
                        onBlur={e => ((e.target as HTMLElement).style.borderColor = '#DDD8D0')}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Ghi chÃº (tÃ¹y chá»n)</label>
                      <textarea
                        value={shippingInfo.notes}
                        onChange={e => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                        rows={2} placeholder="Ghi chÃº cho ngÆ°á»i giao hÃ ng..."
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all resize-none"
                        style={{ border: '1.5px solid #DDD8D0', color: '#000000', background: '#FAFAF8' }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isBelowMinimum}
                  className="w-full py-4 px-6 rounded-2xl font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ background: '#000000', color: '#EDE9E3', boxShadow: '0 6px 20px rgba(58,46,40,0.22)' }}
                  onMouseEnter={e => { if (!isBelowMinimum) (e.currentTarget as HTMLElement).style.background = '#1a1a1a'; }}
                  onMouseLeave={e => { if (!isBelowMinimum) (e.currentTarget as HTMLElement).style.background = '#000000'; }}
                >
                  {isBelowMinimum
                    ? `Cáº§n tá»‘i thiá»ƒu ${currentProduct.pagesLimit} trang (hiá»‡n cÃ³: ${selectedPageCount})`
                    : 'Tiáº¿p tá»¥c thanh toÃ¡n'}
                </button>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '1.5px solid #DDD8D0' }}>
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#000000' }}>
                    <CreditCard className="w-5 h-5" style={{ color: '#7A6F66' }} />
                    PhÆ°Æ¡ng thá»©c thanh toÃ¡n
                  </h2>

                  <div className="space-y-3">
                    {[
                      { method: 'full', title: 'Thanh toÃ¡n trÆ°á»›c', sub: 'Thanh toÃ¡n trÆ°á»›c 100% giÃ¡ trá»‹ Ä‘Æ¡n hÃ ng qua VietQR' },
                      { method: 'deposit', title: 'Äáº·t cá»c 50% hÃ ng', sub: 'Äáº·t cá»c trÆ°á»›c 50%, thanh toÃ¡n 50% cÃ²n láº¡i khi nháº­n hÃ ng' },
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
                    Quay láº¡i
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
                    {loading ? 'Äang xá»­ lÃ½...' : 'XÃ¡c nháº­n Ä‘áº·t hÃ ng'}
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
                    Äáº·t hÃ ng thÃ nh cÃ´ng! ðŸŽ‰
                  </h2>
                  <p className="mb-6 text-sm" style={{ color: '#7A6F66' }}>
                    Cáº£m Æ¡n báº¡n Ä‘Ã£ tin tÆ°á»Ÿng DearMemories. Cuá»‘n sÃ¡ch cá»§a báº¡n Ä‘ang Ä‘Æ°á»£c xá»­ lÃ½ thiáº¿t káº¿ vÃ  in áº¥n!
                  </p>

                  {/* 1. QR Code Payment */}
                  <div className="p-6 rounded-2xl border border-[#DDD8D0] bg-[#FAFAF8] mb-6 text-center space-y-4 max-w-sm mx-auto">
                    <p className="font-bold text-sm text-[#000000]">
                      {paymentMethod === 'deposit' ? 'QuÃ©t mÃ£ Ä‘á»ƒ chuyá»ƒn khoáº£n Ä‘áº·t cá»c 50%:' : 'QuÃ©t mÃ£ Ä‘á»ƒ thanh toÃ¡n 100%:'}
                    </p>
                    <div className="w-48 h-48 mx-auto border-2 border-neutral-100 rounded-xl overflow-hidden shadow-sm p-1 bg-white">
                      <img
                        src="/Ngá»cQR.jpg"
                        alt="Payment QR Code"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 text-xs text-[#7A6F66]">
                      <p>
                        Sá»‘ tiá»n cáº§n chuyá»ƒn: <span className="font-extrabold text-base text-emerald-600">{totalPrice.toLocaleString('vi-VN')} â‚«</span>
                      </p>
                      <p>
                        Ná»™i dung chuyá»ƒn khoáº£n: <span className="font-mono font-bold text-[#000000]">BK{orderId || 'DEARBOOK'}</span>
                      </p>
                    </div>
                  </div>

                  {/* 2. Confirmation Form Link */}
                  <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50 text-left space-y-3 mb-6 max-w-md mx-auto">
                    <div className="flex items-center gap-2 text-amber-800">
                      <span className="text-lg">âš ï¸</span>
                      <p className="font-bold text-sm">
                        HoÃ n táº¥t chuyá»ƒn khoáº£n Ä‘Æ¡n hÃ ng
                      </p>
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Äá»ƒ xÃ¡c nháº­n chuyá»ƒn khoáº£n thÃ nh cÃ´ng vÃ  Ä‘áº©y nhanh sáº£n xuáº¥t, báº¡n vui lÃ²ng Ä‘iá»n thÃ´ng tin vÃ  táº£i áº£nh hÃ³a Ä‘Æ¡n giao dá»‹ch táº¡i Form xÃ¡c nháº­n sau:
                    </p>
                    <a
                      href="https://forms.gle/Svy4UUKsFnFUkW7u9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md text-center animate-pulse"
                    >
                      Click Ä‘iá»n Form xÃ¡c nháº­n chuyá»ƒn khoáº£n ðŸ“
                    </a>
                  </div>

                  {/* 3. Order Details Summary */}
                  <div
                    className="rounded-xl p-5 text-left space-y-2 mb-6"
                    style={{ background: '#F5F2EE' }}
                  >
                    <p className="font-semibold text-sm" style={{ color: '#000000' }}>ðŸ“¦ ThÃ´ng tin Ä‘Æ¡n hÃ ng:</p>
                    <div className="space-y-1.5 text-sm" style={{ color: '#7A6F66' }}>
                      <p>â€¢ MÃ£ Ä‘Æ¡n: <span className="font-mono font-bold text-[#000000]">#{orderId || `BK${Date.now()}`}</span></p>
                      <p>â€¢ Loáº¡i photobook: <span className="font-semibold text-[#000000]">{currentProduct.nameVi}</span></p>
                      <p>â€¢ KÃ­ch thÆ°á»›c: <span className="font-semibold text-[#000000]">{selectedSize}</span></p>
                      <p>â€¢ Sá»‘ trang: <span className="font-semibold text-[#000000]">{selectedPageCount} trang</span></p>
                      <p>â€¢ HÃ¬nh thá»©c thanh toÃ¡n: <span className="font-bold text-orange-600">{paymentMethod === 'deposit' ? 'Äáº·t cá»c trÆ°á»›c 50%' : 'Thanh toÃ¡n trÆ°á»›c 100%'}</span></p>
                      <p>â€¢ NgÆ°á»i nháº­n: <span className="font-semibold text-[#000000]">{shippingInfo.fullName}</span></p>
                      <p>â€¢ SÄT: <span className="font-semibold text-[#000000]">{shippingInfo.phone}</span></p>
                      <p>â€¢ Email: <span className="font-semibold text-[#000000]">{shippingInfo.email}</span></p>
                      <p>â€¢ Sá»‘ tiá»n cáº§n chuyá»ƒn khoáº£n: <span className="font-bold text-[#000000]">{totalPrice.toLocaleString('vi-VN')} â‚«</span></p>
                    </div>
                  </div>

                  <button
                    onClick={handleComplete}
                    className="w-full py-4 px-6 rounded-2xl font-bold transition-all hover:-translate-y-0.5"
                    style={{ background: '#000000', color: '#EDE9E3' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
                  >
                    Vá» trang chá»§
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
                ÄÆ¡n hÃ ng
              </h3>

              <div className="space-y-4 mb-5">
                <div className="flex gap-3">
                  <div
                    className="w-14 h-18 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl"
                    style={{ background: '#EDE9E3', minHeight: '72px' }}
                  >
                    ðŸ“–
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: '#000000' }}>
                      {book.title || 'Cuá»‘n sÃ¡ch cá»§a tÃ´i'}
                    </p>
                    <p className="text-xs mt-1 font-bold text-neutral-800">
                      {currentProduct.nameVi}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#7A6F66' }}>
                      KÃ­ch thÆ°á»›c: {selectedSize} Â· {selectedPageCount} trang
                    </p>
                    <p className="text-[10px] italic mt-0.5 leading-snug" style={{ color: '#9B9088' }}>
                      {currentProduct.paperType}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm pt-3" style={{ borderTop: '1px solid #EDE9E3' }}>
                  <div className="flex justify-between">
                    <span style={{ color: '#7A6F66' }}>GiÃ¡ cÆ¡ báº£n ({currentProduct.pagesLimit} trang)</span>
                    <span className="font-medium" style={{ color: '#000000' }}>{basePrice.toLocaleString('vi-VN')} â‚«</span>
                  </div>
                  {additionalPages > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: '#7A6F66' }}>Trang thÃªm ({additionalPages})</span>
                      <span className="font-medium" style={{ color: '#000000' }}>{pagePrice.toLocaleString('vi-VN')} â‚«</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: '#7A6F66' }}>PhÃ­ váº­n chuyá»ƒn</span>
                    <span className="font-medium" style={{ color: '#000000' }}>{shippingFee.toLocaleString('vi-VN')} â‚«</span>
                  </div>
                </div>

                <div className="pt-3" style={{ borderTop: '1px solid #EDE9E3' }}>
                  {paymentMethod === 'deposit' && (
                    <div className="flex justify-between text-xs text-[#7A6F66] mb-1.5 animate-in fade-in duration-300">
                      <span>ÄÃ£ bá»›t 50% Ä‘áº·t cá»c:</span>
                      <span className="font-semibold text-rose-500">-( {(totalOriginal * 0.5).toLocaleString('vi-VN')} â‚« )</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span style={{ color: '#000000' }}>{paymentMethod === 'deposit' ? 'Äáº·t cá»c 50%' : 'Tá»•ng cá»™ng'}</span>
                    <span style={{ color: '#000000' }}>{totalPrice.toLocaleString('vi-VN')} â‚«</span>
                  </div>
                </div>
              </div>

              <div
                className="p-4 rounded-xl text-xs space-y-1"
                style={{ background: '#F5F2EE' }}
              >
                <p className="font-semibold" style={{ color: '#5A5049' }}>ðŸ“ Cam káº¿t cháº¥t lÆ°á»£ng:</p>
                <p style={{ color: '#7A6F66' }}>âœ“ In áº¥n cao cáº¥p</p>
                <p style={{ color: '#7A6F66' }}>âœ“ HoÃ n tiá»n 100% náº¿u khÃ´ng hÃ i lÃ²ng</p>
                <p style={{ color: '#7A6F66' }}>âœ“ Giao hÃ ng Ä‘Ãºng háº¹n</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Äá»c File thÃ nh data URL (base64) */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
