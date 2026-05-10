export function Loading3D() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        {/* Premium Animated 3D Book Icon */}
        <div className="relative w-40 h-40 mx-auto">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 rounded-3xl animate-pulse opacity-30 blur-2xl"></div>
          
          {/* Main book container */}
          <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 rounded-3xl w-full h-full flex items-center justify-center shadow-2xl transform perspective-1000">
            {/* Animated book icon */}
            <div className="relative animate-bounce">
              <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              
              {/* Sparkles */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
            </div>

            {/* Floating particles */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-white/50 rounded-full animate-float"></div>
            <div className="absolute bottom-6 right-6 w-2 h-2 bg-white/50 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 right-4 w-1.5 h-1.5 bg-white/40 rounded-full animate-float" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Loading dots animation */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '450ms' }}></div>
        </div>

        {/* Loading text with gradient */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Đang tải Preview
          </h2>
          <p className="text-gray-600 text-lg font-medium">
            Chuẩn bị hiển thị cuốn sách của bạn...
          </p>
        </div>

        {/* Premium progress bar */}
        <div className="max-w-sm mx-auto space-y-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 rounded-full animate-pulse shadow-lg"></div>
          </div>
          <p className="text-sm text-gray-500">
            Đang tải nội dung...
          </p>
        </div>

        {/* Tips */}
        <div className="mt-12 card p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-3 font-medium">💡 Mẹo nhỏ</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Bạn có thể xoay, zoom và lật từng trang để xem chi tiết cuốn sách của mình!
          </p>
        </div>
      </div>

      {/* Float animation handled by Tailwind */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
