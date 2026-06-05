import { X, Image, Palette, Package, Clock, RefreshCw, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface PhotobookNoticeDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PhotobookNoticeDialog({ isOpen, onConfirm, onCancel }: PhotobookNoticeDialogProps) {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
      setIsChecked(false); // reset state for next time
    }
  };

  const handleCancelClick = () => {
    setIsChecked(false); // reset state
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn"
        onClick={handleCancelClick}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn flex flex-col max-h-[90vh] z-10">
        {/* Header */}
        <div className="px-6 py-5 relative overflow-hidden flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2520 60%, #3a2e26 100%)',
          }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <BookOpen className="w-6 h-6 text-amber-100 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">Lưu ý khi đặt photobook</h2>
                <p className="text-white/60 text-xs mt-0.5 font-medium">Vui lòng đọc kỹ thông tin trước khi thiết kế</p>
              </div>
            </div>
            
            <button
              onClick={handleCancelClick}
              className="text-white/60 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 py-5 overflow-y-auto space-y-4 flex-1">
          <h3 className="text-base font-bold text-gray-800 border-b pb-2 border-gray-100">
            Những lưu ý khi đặt photobook
          </h3>

          <div className="space-y-4">
            {/* 1. Chất lượng ảnh */}
            <div className="flex gap-3.5 p-3 rounded-2xl transition-colors hover:bg-gray-50/80">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500 border border-blue-100">
                <Image className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                  📸 Chất lượng ảnh
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Để đảm bảo chất lượng in tốt nhất, vui lòng sử dụng ảnh có độ phân giải cao và hạn chế sử dụng ảnh bị mờ, vỡ hoặc ảnh chụp màn hình.
                </p>
              </div>
            </div>

            {/* 2. Màu sắc khi in */}
            <div className="flex gap-3.5 p-3 rounded-2xl transition-colors hover:bg-gray-50/80">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-500 border border-amber-100">
                <Palette className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                  🎨 Màu sắc khi in
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Màu sắc thực tế của photobook có thể có sự chênh lệch nhỏ so với hình ảnh hiển thị trên màn hình do sự khác biệt giữa các thiết bị và công nghệ in ấn.
                </p>
              </div>
            </div>

            {/* 3. Thông tin nhận hàng */}
            <div className="flex gap-3.5 p-3 rounded-2xl transition-colors hover:bg-gray-50/80">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-500 border border-purple-100">
                <Package className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                  📦 Thông tin nhận hàng
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Vui lòng kiểm tra kỹ họ tên, số điện thoại và địa chỉ nhận hàng trước khi xác nhận đơn đặt hàng.
                </p>
              </div>
            </div>

            {/* 4. Thời gian sản xuất */}
            <div className="flex gap-3.5 p-3 rounded-2xl transition-colors hover:bg-gray-50/80">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500 border border-orange-100">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                  ⏳ Thời gian sản xuất
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Photobook là sản phẩm được cá nhân hóa theo từng đơn hàng. Thời gian hoàn thiện dự kiến từ 3–5 ngày làm việc (không bao gồm thời gian vận chuyển).
                </p>
              </div>
            </div>

            {/* 5. Chỉnh sửa & hỗ trợ sau khi nhận hàng */}
            <div className="flex gap-3.5 p-3 rounded-2xl transition-colors hover:bg-gray-50/80">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-500 border border-rose-100">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                  🔄 Chỉnh sửa & hỗ trợ sau khi nhận hàng
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Sau khi đơn hàng được xác nhận và đưa vào sản xuất, nội dung thiết kế sẽ không thể chỉnh sửa. Nếu sản phẩm gặp lỗi từ phía sản xuất hoặc vận chuyển, vui lòng liên hệ <span className="font-semibold text-rose-600">dearmemories.</span> trong vòng 48 giờ kể từ khi nhận hàng để được hỗ trợ. Để đảm bảo quyền lợi, khách hàng vui lòng quay video quá trình mở hàng và cung cấp hình ảnh hoặc video sản phẩm khi gửi yêu cầu hỗ trợ.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Checkbox & Actions */}
        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/80 flex-shrink-0 flex flex-col gap-4">
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-amber-600 border-gray-300 focus:ring-amber-500 cursor-pointer"
            />
            <span className="text-xs text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
              Tôi đã đọc và đồng ý với các lưu ý khi đặt photobook
            </span>
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleCancelClick}
              className="flex-1 px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-sm"
            >
              Hủy bỏ
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={!isChecked}
              className={`flex-1 px-5 py-3 font-semibold rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-1.5
                ${isChecked 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-600/25 cursor-pointer' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
