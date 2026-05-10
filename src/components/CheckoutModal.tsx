import { X, Package, Truck, CreditCard, Check } from 'lucide-react';
import { useState } from 'react';
import { BookDesign } from '../App';

interface CheckoutModalProps {
  bookDesign: BookDesign;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutModal({ bookDesign, onClose, onSuccess }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    note: '',
    quantity: 1,
    paperType: 'premium',
    coverType: 'hardcover'
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const pricing = {
    premium: { label: 'Giấy cao cấp', price: 350000 },
    standard: { label: 'Giấy tiêu chuẩn', price: 250000 }
  };

  const coverPricing = {
    hardcover: { label: 'Bìa cứng', price: 100000 },
    softcover: { label: 'Bìa mềm', price: 50000 }
  };

  const basePrice = pricing[formData.paperType as keyof typeof pricing].price;
  const coverPrice = coverPricing[formData.coverType as keyof typeof coverPricing].price;
  const pagePrice = bookDesign.pages.length * 15000;
  const totalPrice = (basePrice + coverPrice + pagePrice) * formData.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order processing
    setOrderPlaced(true);
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif text-gray-900 mb-4">Đặt hàng thành công!</h2>
          <p className="text-gray-600 mb-8">
            Chúng tôi đã nhận được đơn hàng của bạn. Sách sẽ được in và giao đến trong 5-7 ngày làm việc.
          </p>
          <button
            onClick={onSuccess}
            className="px-8 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif text-rose-900">Đặt in sách</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Order Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-rose-600" />
                    Chi tiết sản phẩm
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Loại giấy</label>
                      <select
                        value={formData.paperType}
                        onChange={(e) => setFormData({ ...formData, paperType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="premium">Giấy cao cấp - 350,000đ</option>
                        <option value="standard">Giấy tiêu chuẩn - 250,000đ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Loại bìa</label>
                      <select
                        value={formData.coverType}
                        onChange={(e) => setFormData({ ...formData, coverType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="hardcover">Bìa cứng - 100,000đ</option>
                        <option value="softcover">Bìa mềm - 50,000đ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Số lượng</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giá cơ bản</span>
                      <span>{basePrice.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bìa sách</span>
                      <span>{coverPrice.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số trang ({bookDesign.pages.length})</span>
                      <span>{pagePrice.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số lượng</span>
                      <span>×{formData.quantity}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium pt-2 border-t border-gray-200">
                      <span>Tổng cộng</span>
                      <span className="text-rose-600">{totalPrice.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Shipping Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-rose-600" />
                    Thông tin giao hàng
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Họ và tên *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Địa chỉ *</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Thành phố *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Ghi chú</label>
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Thanh toán
              </h3>
              <p className="text-sm text-gray-600">
                Thanh toán khi nhận hàng (COD). Nhân viên sẽ liên hệ xác nhận đơn hàng trong 24h.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition"
            >
              Xác nhận đặt hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
