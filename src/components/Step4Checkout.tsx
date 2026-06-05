import { useState } from 'react';
import { Check, Edit3, Sparkles, Package, Truck, CreditCard } from 'lucide-react';
import { CharacterDesign } from '../App';
import { CharacterIllustration } from './CharacterIllustration';

interface Step4CheckoutProps {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  character: CharacterDesign;
  onComplete: () => void;
  onEdit: () => void;
}

const themeLabels = {
  love: 'Tnh Yu ',
  family: 'Gia nh ',
  birthday: 'Sinh Nht ',
  friendship: 'Tnh Bn '
};

export function Step4Checkout({ theme, character, onComplete, onEdit }: Step4CheckoutProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOrder = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto shadow-2xl">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
            t hng thnh cng! 
          </h2>
          <p className="text-xl text-gray-600">
            Cm n bn  tin tng. Cun sch ca bn s c in v giao trong vng 3-5 ngy.
          </p>
          <div className="p-6 rounded-2xl bg-green-50 border border-green-200">
            <p className="text-green-800">
               Chng ti  gi email xc nhn n hp th ca bn
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
          Xc nhn t hng
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Kim tra li thng tin cun sch ca bn trc khi hon tt n hng
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8 mt-12">
        {/* Left: Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Book Details */}
          <div className="rounded-3xl bg-white shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Thng tin sch
              </h3>
              <button
                onClick={onEdit}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition"
              >
                <Edit3 className="w-4 h-4" />
                Chnh sa
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                <div className="w-24 h-32 rounded-xl overflow-hidden shadow-md">
                  <img
                    src="figma:asset/75f25ac90081e751c1ea46d382338eda718c305b.png"
                    alt="Book preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Em Yu Anh</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p> Ch : <span className="font-medium text-gray-900">{themeLabels[theme]}</span></p>
                    <p> S trang: <span className="font-medium text-gray-900">40 trang</span></p>
                    <p> Kch thc: <span className="font-medium text-gray-900">1521 cm</span></p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <p className="text-sm font-semibold text-purple-900 mb-3">Nhn vt  to:</p>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-32 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden shadow-lg p-2">
                    <CharacterIllustration character={character} size="sm" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {character.gender === 'male' ? 'Nam' : 'N'}  
                      Tc {character.hairStyle === 'long' ? 'di' : 'ngn'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Mu {character.hairColor === 'black' ? 'en' :
                           character.hairColor === 'brown' ? 'nu' :
                           character.hairColor === 'red' ? '' :
                           character.hairColor === 'blonde' ? 'vng' : 'xm'}  
                      {character.outfit === 'casual' ? ' Thoi mi' :
                       character.outfit === 'formal' ? ' Lch s' : ' Lng mn'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="rounded-3xl bg-white shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Truck className="w-6 h-6" />
              Thng tin giao hng
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  H v tn
                </label>
                <input
                  type="text"
                  placeholder="Nguyn Vn A"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  S in thoi
                </label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  a ch
                </label>
                <textarea
                  rows={3}
                  placeholder="123 ng ABC, Qun 1, TP.HCM"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi ch (ty chn)
                </label>
                <input
                  type="text"
                  placeholder="Giao gi hnh chnh"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-3xl bg-white shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              Phng thc thanh ton
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-400 cursor-pointer transition">
                <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Chuyn khon ngn hng</p>
                  <p className="text-sm text-gray-600">Thanh ton trc khi sn xut</p>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-400 cursor-pointer transition">
                <input type="radio" name="payment" className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Thanh ton khi nhn hng (COD)</p>
                  <p className="text-sm text-gray-600">Tr tin mt khi nhn sch</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Price Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-8 sticky top-6 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Tm tt n hng</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Gi sch</span>
                <span className="font-semibold">570,000</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Ph vn chuyn</span>
                <span className="font-semibold text-green-600">Min ph</span>
              </div>
              <div className="pt-3 border-t-2 border-purple-200">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-900">Tng cng</span>
                  <span className="text-3xl font-bold text-gray-900">570,000</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOrder}
              className="w-full py-4 px-6 bg-black text-white rounded-full text-lg font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              t hng ngay
            </button>

            <div className="space-y-3 pt-4 border-t border-purple-200">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span>Min ph vn chuyn ton quc</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                <span>Giao hng trong 3-5 ngy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-purple-600" />
                </div>
                <span>H tr i tr trong 7 ngy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
