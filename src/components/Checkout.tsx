import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Gift, CreditCard } from 'lucide-react';
import { BookProject } from '../App';

interface CheckoutProps {
  book: BookProject;
  onComplete: () => void;
  onBack: () => void;
}

export function Checkout({ book, onComplete, onBack }: CheckoutProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    note: ''
  });

  const [bookSize, setBookSize] = useState<'A5' | 'A4'>('A5');
  const [coverType, setCoverType] = useState<'soft' | 'hard'>('soft');
  const [withGift, setWithGift] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const basePrice = book.pageCount * 5000;
  const sizePrice = bookSize === 'A4' ? 30000 : 0;
  const coverPrice = coverType === 'hard' ? 50000 : 0;
  const giftPrice = withGift ? 20000 : 0;
  const shippingPrice = 25000;
  
  const subtotal = basePrice + sizePrice + coverPrice + giftPrice;
  const total = subtotal + shippingPrice - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'bookify10') {
      setDiscount(subtotal * 0.1);
    } else {
      alert('M gim gi khng hp l');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.fullName || !formData.phone || !formData.email || !formData.address) {
      alert('Vui lng in y  thng tin');
      return;
    }

    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <ShoppingCart className="w-8 h-8 inline mr-2" />
            Thanh ton
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Info */}
              <div className="card p-8">
                <h2 className="text-xl font-bold mb-6">Thng tin ngi nhn</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      H v tn *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nguyn Vn A"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      S in thoi *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0987654321"
                      className="input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      a ch *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 ng ABC"
                      className="input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thnh ph *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Chn thnh ph</option>
                      <option value="hanoi">H Ni</option>
                      <option value="hcm">TP. H Ch Minh</option>
                      <option value="danang"> Nng</option>
                      <option value="other">Tnh thnh khc</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi ch (khng bt buc)
                    </label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Ghi ch v n hng..."
                      rows={3}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Book Options */}
              <div className="card p-8">
                <h2 className="text-xl font-bold mb-6">Ty chn sch</h2>

                <div className="space-y-6">
                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Kch thc
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setBookSize('A5')}
                        className={`p-4 rounded-xl border-2 transition ${
                          bookSize === 'A5'
                            ? 'border-pink-400 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-200'
                        }`}
                      >
                        <div className="font-semibold mb-1">A5 (14.8 x 21cm)</div>
                        <div className="text-sm text-gray-600">Ph hp mang theo</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookSize('A4')}
                        className={`p-4 rounded-xl border-2 transition ${
                          bookSize === 'A4'
                            ? 'border-pink-400 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-200'
                        }`}
                      >
                        <div className="font-semibold mb-1">A4 (21 x 29.7cm)</div>
                        <div className="text-sm text-gray-600">+30,000</div>
                      </button>
                    </div>
                  </div>

                  {/* Cover Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Loi ba
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setCoverType('soft')}
                        className={`p-4 rounded-xl border-2 transition ${
                          coverType === 'soft'
                            ? 'border-pink-400 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-200'
                        }`}
                      >
                        <div className="font-semibold mb-1">Ba mm</div>
                        <div className="text-sm text-gray-600">Gi chun</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCoverType('hard')}
                        className={`p-4 rounded-xl border-2 transition ${
                          coverType === 'hard'
                            ? 'border-pink-400 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-200'
                        }`}
                      >
                        <div className="font-semibold mb-1">Ba cng</div>
                        <div className="text-sm text-gray-600">+50,000</div>
                      </button>
                    </div>
                  </div>

                  {/* Gift Wrap */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-pink-200 transition">
                      <input
                        type="checkbox"
                        checked={withGift}
                        onChange={(e) => setWithGift(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <Gift className="w-5 h-5 text-pink-500" />
                      <div className="flex-1">
                        <div className="font-semibold">Gi qu min ph</div>
                        <div className="text-sm text-gray-600">Hp qu + thip chc mng (+20,000)</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full btn-lg">
                <CreditCard className="w-5 h-5" />
                Tip tc thanh ton
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">n hng</h2>

              {/* Book Info */}
              <div className="flex gap-4 pb-6 border-b mb-6">
                <img
                  src={book.coverPage.backgroundImage || 'https://via.placeholder.com/100x140'}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.pageCount} trang</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gi in ({book.pageCount} trang)</span>
                  <span className="font-medium">{basePrice.toLocaleString('vi-VN')}</span>
                </div>

                {sizePrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kch thc A4</span>
                    <span className="font-medium">{sizePrice.toLocaleString('vi-VN')}</span>
                  </div>
                )}

                {coverPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ba cng</span>
                    <span className="font-medium">{coverPrice.toLocaleString('vi-VN')}</span>
                  </div>
                )}

                {giftPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gi qu</span>
                    <span className="font-medium">{giftPrice.toLocaleString('vi-VN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Ph vn chuyn</span>
                  <span className="font-medium">{shippingPrice.toLocaleString('vi-VN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Gim gi</span>
                    <span className="font-medium">-{discount.toLocaleString('vi-VN')}</span>
                  </div>
                )}
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M gim gi
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhp m..."
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="btn btn-outline"
                  >
                    p dng
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Tng cng</span>
                  <span className="text-3xl font-bold gradient-text">
                    {total.toLocaleString('vi-VN')}
                  </span>
                </div>
                <p className="text-xs text-gray-500"> bao gm VAT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
