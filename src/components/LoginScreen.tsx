import { useState } from 'react';
import { BookHeart, Mail, Lock, User, Sparkles, Heart, Users, Cake, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password: string, isSignup: boolean, name?: string) => Promise<{ needsOtp?: boolean } | void>;
  onVerifyOtp: (email: string, token: string, name?: string) => Promise<void>;
}

export function LoginScreen({ onLogin, onVerifyOtp }: LoginScreenProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP Verification States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        setIsLoading(true);
        const result = await onLogin(email, password, isSignup, isSignup ? name : undefined);
        if (isSignup && result && result.needsOtp) {
          setShowOtpScreen(true);
        }
      } catch (err) {
        console.error('Registration/Login error in UI:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode) {
      try {
        setOtpLoading(true);
        await onVerifyOtp(email, otpCode, name);
      } catch (err) {
        console.error('OTP verification error in UI:', err);
      } finally {
        setOtpLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await onLogin(email, password, isSignup, name);
    } catch (err) {
      console.error('Resend OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all border text-sm`;
  const inputStyle = {
    background: '#FFFFFF',
    borderColor: '#DDD8D0',
    color: '#3A2E28',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #FAFAF8 0%, #F5F2EE 50%, #EDE9E3 100%)' }}
    >
      {/* Background dot pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #DDD8D0 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Soft ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(200,175,150,0.20) 0%, transparent 65%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(185,165,145,0.15) 0%, transparent 65%)' }} />

      {/* Floating decorative text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-16 left-12 text-5xl opacity-[0.08] animate-pulse">💕</div>
        <div className="absolute top-36 right-16 text-4xl opacity-[0.08] animate-pulse" style={{ animationDelay: '0.3s' }}>📚</div>
        <div className="absolute bottom-28 left-16 text-4xl opacity-[0.08] animate-pulse" style={{ animationDelay: '0.15s' }}>✨</div>
        <div className="absolute bottom-16 right-28 text-5xl opacity-[0.08] animate-pulse">💝</div>
      </div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-10 items-center relative z-10">

        {/* ── Left: Branding ── */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            {/* Logo icon */}
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
              style={{ background: '#3A2E28' }}
            >
              <BookHeart className="w-10 h-10" style={{ color: '#EDE9E3' }} />
            </div>

            <h1 className="font-handwriting text-6xl" style={{ color: '#3A2E28' }}>
              DearBook
            </h1>

            <p className="text-base max-w-sm mx-auto" style={{ color: '#7A6F66', lineHeight: 1.8 }}>
              Tạo cuốn sách quà tặng cá nhân hoá đầy ý nghĩa
            </p>

            {/* Theme grid */}
            <div className="grid grid-cols-2 gap-3 mt-8 max-w-sm mx-auto">
              {[
                { emoji: '💕', label: 'Tình yêu', icon: Heart },
                { emoji: '👨‍👩‍👧', label: 'Gia đình', icon: Users },
                { emoji: '🎂', label: 'Sinh nhật', icon: Cake },
                { emoji: '🤝', label: 'Bạn bè', icon: Sparkles },
              ].map((t) => (
                <div
                  key={t.label}
                  className="p-4 rounded-2xl flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.70)',
                    border: '1px solid #DDD8D0',
                    boxShadow: '0 2px 8px rgba(60,46,40,0.05)',
                  }}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <p className="text-xs font-medium" style={{ color: '#5A5049' }}>{t.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: '#9B9088' }}>
              <Sparkles className="w-3 h-3" />
              <span>Trusted by 10,000+ users</span>
            </div>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="w-full max-w-md mx-auto">
          <div
            className="rounded-3xl p-8 shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.90)',
              backdropFilter: 'blur(24px)',
              border: '1px solid #DDD8D0',
              boxShadow: '0 16px 60px rgba(60,46,40,0.10)',
            }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-6">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                style={{ background: '#3A2E28' }}
              >
                <BookHeart className="w-7 h-7" style={{ color: '#EDE9E3' }} />
              </div>
              <h2 className="font-handwriting text-3xl" style={{ color: '#3A2E28' }}>DearBook</h2>
            </div>

            {!showOtpScreen ? (
              // ── Main SignUp/SignIn View ──
              <>
                <div className="mb-7">
                  <h3 className="text-xl font-semibold text-center" style={{ color: '#3A2E28' }}>
                    {isSignup ? 'Tạo tài khoản mới' : 'Chào mừng trở lại'}
                  </h3>
                  <p className="text-sm text-center mt-1" style={{ color: '#9B9088' }}>
                    {isSignup ? 'Đăng ký để bắt đầu tạo sách' : 'Đăng nhập để tiếp tục'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignup && (
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Họ và tên</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9088' }} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputClass}
                          style={inputStyle}
                          placeholder="Nhập họ và tên"
                          required={isSignup}
                          onFocus={e => { e.target.style.borderColor = '#7A6F66'; e.target.style.boxShadow = '0 0 0 3px rgba(122,111,102,0.10)'; }}
                          onBlur={e => { e.target.style.borderColor = '#DDD8D0'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9088' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                        placeholder="email@example.com"
                        required
                        onFocus={e => { e.target.style.borderColor = '#7A6F66'; e.target.style.boxShadow = '0 0 0 3px rgba(122,111,102,0.10)'; }}
                        onBlur={e => { e.target.style.borderColor = '#DDD8D0'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#7A6F66' }}>Mật khẩu</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9088' }} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                        placeholder="••••••••"
                        required
                        onFocus={e => { e.target.style.borderColor = '#7A6F66'; e.target.style.boxShadow = '0 0 0 3px rgba(122,111,102,0.10)'; }}
                        onBlur={e => { e.target.style.borderColor = '#DDD8D0'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  {!isSignup && (
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer" style={{ color: '#9B9088' }}>
                        <input type="checkbox" className="rounded" />
                        <span>Ghi nhớ đăng nhập</span>
                      </label>
                      <button
                        type="button"
                        className="transition-colors"
                        style={{ color: '#7A6F66' }}
                        onMouseEnter={e => ((e.target as HTMLElement).style.color = '#3A2E28')}
                        onMouseLeave={e => ((e.target as HTMLElement).style.color = '#7A6F66')}
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 rounded-xl font-semibold mt-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    style={{
                      background: '#3A2E28',
                      color: '#FAFAF8',
                      boxShadow: '0 4px 16px rgba(60,46,40,0.22)',
                    }}
                    onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#1C1715'; }}
                    onMouseLeave={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#3A2E28'; }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      isSignup ? 'Đăng ký' : 'Đăng nhập'
                    )}
                  </button>
                </form>

                <div className="mt-5 text-center text-sm" style={{ color: '#9B9088' }}>
                  {isSignup ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
                  <button
                    onClick={() => setIsSignup(!isSignup)}
                    className="font-semibold transition-colors"
                    style={{ color: '#5A5049' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = '#3A2E28')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = '#5A5049')}
                  >
                    {isSignup ? 'Đăng nhập' : 'Đăng ký ngay'}
                  </button>
                </div>

                {/* Demo hint */}
                <div
                  className="mt-5 p-4 rounded-xl"
                  style={{
                    background: '#F5F2EE',
                    border: '1px solid #DDD8D0',
                  }}
                >
                  <p className="text-xs text-center font-medium mb-1" style={{ color: '#7A6F66' }}>
                    💡 Demo Mode
                  </p>
                  <p className="text-xs text-center" style={{ color: '#9B9088' }}>
                    Nhập bất kỳ email &amp; password nào để dùng thử<br />
                    Ví dụ: demo@dearbook.com / 123456
                  </p>
                </div>
              </>
            ) : (
              // ── OTP Code Verification View ──
              <div className="transition-all duration-300">
                <button
                  onClick={() => setShowOtpScreen(false)}
                  className="flex items-center gap-1.5 text-xs font-semibold mb-6 transition-colors"
                  style={{ color: '#7A6F66' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#3A2E28')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#7A6F66')}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại đăng ký</span>
                </button>

                <div className="text-center mb-6">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3"
                    style={{ background: '#EDE9E3' }}
                  >
                    <ShieldCheck className="w-8 h-8" style={{ color: '#3A2E28' }} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: '#3A2E28' }}>Xác thực Email</h3>
                  <p className="text-xs mt-1.5 px-2 leading-relaxed" style={{ color: '#7A6F66' }}>
                    Chúng tôi đã gửi mã xác thực OTP gồm 6 chữ số vào địa chỉ email:
                    <br />
                    <strong style={{ color: '#3A2E28' }}>{email}</strong>
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-center" style={{ color: '#7A6F66' }}>
                      Mã OTP xác thực
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9088' }} />
                      <input
                        type="text"
                        maxLength={10}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all border text-center text-lg font-bold tracking-widest"
                        style={inputStyle}
                        placeholder="Nhập mã OTP"
                        required
                        onFocus={e => { e.target.style.borderColor = '#7A6F66'; e.target.style.boxShadow = '0 0 0 3px rgba(122,111,102,0.10)'; }}
                        onBlur={e => { e.target.style.borderColor = '#DDD8D0'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="w-full py-3 px-6 rounded-xl font-semibold mt-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    style={{
                      background: '#3A2E28',
                      color: '#FAFAF8',
                      boxShadow: '0 4px 16px rgba(60,46,40,0.22)',
                    }}
                    onMouseEnter={e => { if (!otpLoading) (e.currentTarget as HTMLElement).style.background = '#1C1715'; }}
                    onMouseLeave={e => { if (!otpLoading) (e.currentTarget as HTMLElement).style.background = '#3A2E28'; }}
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang xác minh...</span>
                      </>
                    ) : (
                      'Xác nhận đăng ký'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs" style={{ color: '#9B9088' }}>
                  Không nhận được mã?{' '}
                  <button
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="font-bold transition-colors underline"
                    style={{ color: '#5A5049' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = '#3A2E28')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = '#5A5049')}
                  >
                    {isLoading ? 'Đang gửi lại...' : 'Gửi lại mã'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-5 flex items-center justify-center gap-6 text-xs" style={{ color: '#9B9088' }}>
            <span>🔒 Secure</span>
            <span>✨ Easy to use</span>
            <span>💝 Premium quality</span>
          </div>
        </div>
      </div>
    </div>
  );
}
