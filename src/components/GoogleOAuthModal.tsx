import { useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail: string;
  userName: string;
}

export function GoogleOAuthModal({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
  userName,
}: GoogleOAuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsLoading(true);
    // Simulate OAuth processing
    setTimeout(() => {
      onConfirm();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            {/* Google Icon */}
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Google Sign In</h3>
              <p className="text-sm text-blue-100">DearBook wants to access your account</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{userName}</p>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">DearBook sẽ có quyền:</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Xem thông tin cơ bản (tên, email)</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Lưu dữ liệu sách của bạn</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Gửi thông báo về đơn hàng</span>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-xs text-yellow-800">
              <strong>📝 Demo Mode:</strong> Đây là OAuth flow giả lập. 
              Production sẽ sử dụng Google OAuth 2.0 thật.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-6 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <span>Tiếp tục</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
