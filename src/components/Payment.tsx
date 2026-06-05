import { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { OrderData } from '../App';

interface PaymentProps {
  orderData: OrderData;
  onSuccess: () => void;
  onBack: () => void;
}

const paymentMethods = [
  {
    id: 'bank',
    name: 'Chuyn khon ngn hng',
    icon: Building2,
    desc: 'Chuyn khon qua Internet Banking'
  },
  {
    id: 'momo',
    name: 'V MoMo',
    icon: Smartphone,
    desc: 'Thanh ton qua v in t MoMo'
  },
  {
    id: 'card',
    name: 'Th tn dng/ghi n',
    icon: CreditCard,
    desc: 'Visa, Mastercard, JCB'
  },
  {
    id: 'cod',
    name: 'Thanh ton khi nhn hng',
    icon: CreditCard,
    desc: 'Thanh ton tin mt khi nhn sch'
  }
];

export function Payment({ orderData, onSuccess, onBack }: PaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = () => {
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // Generate order ID and save to localStorage
      const orderId = `BK${Date.now()}`;
      const order = {
        ...orderData,
        orderId,
        paymentMethod: selectedMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">t hng thnh cng!</h2>
          <p className="text-gray-600 mb-2">M n hng: <span className="font-mono font-bold">BK{Date.now()}</span></p>
          <p className="text-gray-600 mb-8">
            Chng ti s lin h xc nhn v bt u in sch ca bn trong 24h.
          </p>
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-700">
              Thng tin chi tit n hng  c gi qua email{' '}
              {orderData.customerInfo.email && (
                <span className="font-medium">{orderData.customerInfo.email}</span>
              )}
            </p>
          </div>
          <button
            onClick={onSuccess}
            className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition font-medium"
          >
            V trang ch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              disabled={processing}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay li</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Thanh ton</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Chn phng thc thanh ton</h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethod(method.id)}
                        disabled={processing}
                        className={`w-full p-4 rounded-xl border-2 transition text-left flex items-center gap-4 ${
                          selectedMethod === method.id
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-gray-200 hover:border-rose-300'
                        } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedMethod === method.id ? 'bg-rose-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            selectedMethod === method.id ? 'text-rose-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.desc}</p>
                        </div>
                        {selectedMethod === method.id && (
                          <div className="w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bank Transfer Info */}
                {selectedMethod === 'bank' && (
                  <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <h3 className="font-medium text-gray-900 mb-4">Thng tin chuyn khon</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Ngn hng:</span> <span className="font-medium">Vietcombank</span></p>
                      <p><span className="text-gray-600">S ti khon:</span> <span className="font-mono font-medium">0123456789</span></p>
                      <p><span className="text-gray-600">Ch ti khon:</span> <span className="font-medium">BOOKIFY CO., LTD</span></p>
                      <p><span className="text-gray-600">Ni dung:</span> <span className="font-mono font-medium">BK{Date.now()}</span></p>
                    </div>
                  </div>
                )}

                {/* MoMo Info */}
                {selectedMethod === 'momo' && (
                  <div className="mt-6 p-6 bg-pink-50 border border-pink-200 rounded-xl text-center">
                    <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <p className="text-gray-400">QR Code MoMo</p>
                    </div>
                    <p className="text-sm text-gray-600">Qut m QR  thanh ton</p>
                  </div>
                )}

                {/* COD Info */}
                {selectedMethod === 'cod' && (
                  <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-gray-700">
                       Bn s thanh ton tin mt khi nhn sch. Shipper s lin h trc khi giao hng.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
                <h3 className="font-bold text-gray-900 mb-4">Thng tin n hng</h3>
                
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngi nhn:</span>
                    <span className="font-medium text-gray-900">{orderData.customerInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ST:</span>
                    <span className="font-medium text-gray-900">{orderData.customerInfo.phone}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-600 mb-1">a ch:</p>
                    <p className="font-medium text-gray-900">{orderData.customerInfo.address}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kch thc:</span>
                      <span className="text-gray-900">{orderData.size}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-600">Loi ba:</span>
                      <span className="text-gray-900">{orderData.coverType === 'hard' ? 'Ba cng' : 'Ba mm'}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-600">S lng:</span>
                      <span className="text-gray-900">{orderData.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-gray-300 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Tng thanh ton</span>
                    <span className="text-rose-600">{orderData.totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      ang x l...
                    </span>
                  ) : (
                    'Xc nhn thanh ton'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
