import { useState } from 'react';
import { Mail, Lock, User, Sparkles, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password: string, isSignup: boolean, name?: string) => Promise<{ needsOtp?: boolean } | void>;
  onVerifyOtp: (email: string, token: string, name?: string) => Promise<void>;
}

type GhostState = 'idle' | 'typing-email' | 'typing-password' | 'typing-name' | 'loading' | 'success' | 'error';

export function LoginScreen({ onLogin, onVerifyOtp }: LoginScreenProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Interaction States
  const [focusState, setFocusState] = useState<'idle' | 'email' | 'password' | 'name' | 'otp'>('idle');
  const [statusState, setStatusState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Sync Focus & Status states to determine Ghost state
  let ghostState: GhostState = 'idle';
  if (statusState === 'success') {
    ghostState = 'success';
  } else if (statusState === 'loading') {
    ghostState = 'loading';
  } else if (statusState === 'error') {
    ghostState = 'error';
  } else if (showOtpScreen) {
    ghostState = 'typing-email'; // Keep curious eyes for OTP
  } else if (focusState === 'password') {
    ghostState = 'typing-password';
  } else if (focusState === 'email') {
    ghostState = 'typing-email';
  } else if (focusState === 'name') {
    ghostState = 'typing-name';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        setIsLoading(true);
        setStatusState('loading');
        const result = await onLogin(email, password, isSignup, isSignup ? name : undefined);
        
        setStatusState('success');
        
        // Show success animation for 2s before advancing state
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (isSignup && result && result.needsOtp) {
          setShowOtpScreen(true);
          setStatusState('idle');
        }
      } catch (err) {
        console.error('Login error:', err);
        setStatusState('error');
        // Revert back to idle after 2.5s error shake
        setTimeout(() => setStatusState('idle'), 2500);
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
        setStatusState('loading');
        await onVerifyOtp(email, otpCode, name);
        setStatusState('success');
      } catch (err) {
        console.error('OTP error:', err);
        setStatusState('error');
        setTimeout(() => setStatusState('idle'), 2500);
      } finally {
        setOtpLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      setStatusState('loading');
      await onLogin(email, password, isSignup, name);
      setStatusState('idle');
    } catch (err) {
      console.error('Resend error:', err);
      setStatusState('error');
      setTimeout(() => setStatusState('idle'), 2500);
    } finally {
      setIsLoading(false);
    }
  };

  // Speech bubble text based on current interaction state (authentic English to match video!)
  const getSpeechBubbleText = () => {
    if (statusState === 'success') {
      return "Correct password";
    }
    if (statusState === 'loading') {
      return "Checking... 🔍";
    }
    if (statusState === 'error') {
      return "Wrong Password! 😢";
    }
    if (showOtpScreen) {
      return "Enter your OTP code! 🔑";
    }
    switch (focusState) {
      case 'email':
        return "Typing email... 📧";
      case 'password':
        return "Covering my eyes! 🤫";
      case 'name':
        return "Nice to meet you! ✨";
      default:
        return isSignup ? "Let's make a book! 👻" : "Welcome back! 👻";
    }
  };

  // dynamic coordinates for Ghost Left's eyes to look at input when typing
  const eyeDx = ghostState === 'typing-email' ? 3 : ghostState === 'typing-name' ? 2 : 0;
  const eyeDy = ghostState === 'typing-password' ? 1.5 : 0;

  return (
    <div className="spooky-login-bg">
      
      {/* ── BULLETPROOF STYLING SYSTEM (Bypasses all Tailwind viewport and clipping bugs) ── */}
      <style>{`
        /* Page Viewport Centering */
        .spooky-login-bg {
          background-color: #faf8f5 !important;
          min-height: 100vh;
          width: 100% !important;
          margin: 0 !important;
          padding: 2.5rem 1.5rem !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          overflow-x: hidden;
        }

        @media (min-width: 769px) and (min-height: 700px) {
          .spooky-login-bg {
            overflow: hidden !important;
            height: 100vh !important;
            max-height: 100vh !important;
          }
        }

        /* Enforce exact centering width limits */
        .spooky-container {
          width: 100%;
          max-width: 850px;
          margin: 0 auto !important;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-sizing: border-box;
        }

        /* Autofill overrides & browser credentials button hidden (kills the black vertical line!) */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #0f172a !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        input::-webkit-contacts-auto-fill-button,
        input::-webkit-credentials-auto-fill-button {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        /* Reels Header styling */
        .spooky-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #0f172a !important;
          padding: 0 0.5rem;
          box-sizing: border-box;
        }

        .spooky-back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: #64748b !important;
          transition: color 0.2s;
          font-weight: 600;
          font-size: 0.95rem;
          background: none;
          border: none;
          padding: 0;
          outline: none;
        }
        .spooky-back-btn:hover {
          color: #0f172a !important;
        }

        .spooky-title {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          display: flex;
          align-items: center;
          user-select: none;
          color: #0f172a !important;
        }
        .spooky-title-green {
          color: #6366f1 !important;
          margin-right: 0.35rem;
        }

        .spooky-header-icons {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          color: #64748b !important;
        }
        .spooky-header-icon {
          cursor: pointer;
          transition: color 0.2s;
        }
        .spooky-header-icon:hover {
          color: #0f172a !important;
        }

        /* Card Split Layout (Guaranteed Flex Row with absolute border-radius) */
        .spooky-card {
          width: 100%;
          background-color: #ffffff !important;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04);
          border: 1px solid #e2e8f0;
          min-height: 520px;
          box-sizing: border-box;
          transition: transform 0.3s ease;
        }

        /* Left Half Panel (Ghosts) - Explicit left border-radius to prevent browser clipping bugs */
        .spooky-left {
          width: 45%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          background-color: #ffffff !important;
          border-right: 1px solid #f1f5f9;
          position: relative;
          box-sizing: border-box;
          flex-shrink: 0;
          border-radius: 24px 0 0 24px;
        }

        /* Right Half Panel (Form) - Explicit right border-radius to prevent browser clipping bugs */
        .spooky-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem 2.5rem;
          background-color: #ffffff !important;
          box-sizing: border-box;
          border-radius: 0 24px 24px 0;
        }

        /* Speech bubble */
        .speech-bubble {
          position: relative;
          background: #ffffff !important;
          border: 2.5px solid #111111 !important;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .speech-bubble::before,
        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 61px;
          border-style: solid;
          display: block;
          width: 0;
        }
        .speech-bubble::before {
          border-width: 10px 10px 0;
          border-color: #111111 transparent;
          bottom: -10px;
          left: 60px;
        }
        .speech-bubble::after {
          border-width: 7px 7px 0;
          border-color: #ffffff transparent;
          bottom: -7px;
          left: 63px;
        }

        /* SVG Doodle Ghosts styles */
        .ghost-body {
          fill: #ffffff;
          stroke: #111111;
          stroke-width: 4.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .ghost-stroke-thick {
          stroke: #111111;
          stroke-width: 4.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* Form elements styling */
        .spooky-form-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 0.25rem;
          letter-spacing: -0.025em;
          text-align: left;
        }

        .spooky-form-subtitle {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .spooky-form-group {
          margin-bottom: 1.25rem;
          text-align: left;
        }

        .spooky-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.375rem;
          color: #475569;
        }

        .spooky-input-wrapper {
          position: relative;
        }

        .spooky-input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spooky-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background-color: #ffffff !important;
          color: #0f172a !important;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s ease-in-out;
          box-sizing: border-box;
        }
        .spooky-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .spooky-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          margin-top: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .spooky-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          cursor: pointer;
          user-select: none;
        }

        .spooky-checkbox {
          border-radius: 4px;
          border: 1.5px solid #cbd5e1;
          color: #6366f1;
          cursor: pointer;
        }

        .spooky-forgot-btn {
          font-weight: 700;
          color: #6366f1;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.75rem;
          padding: 0;
        }
        .spooky-forgot-btn:hover {
          text-decoration: underline;
        }

        /* Primary and Secondary button CTAs */
        .spooky-btn-container {
          padding-top: 0.5rem;
        }

        .spooky-btn-primary {
          width: 100%;
          padding: 0.875rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.875rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
          color: #ffffff !important;
          border: none !important;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-sizing: border-box;
        }
        .spooky-btn-primary:hover {
          opacity: 0.95;
          transform: translateY(-1.5px);
          box-shadow: 0 6px 18px rgba(99, 102, 241, 0.45);
        }
        .spooky-btn-primary:active {
          transform: translateY(0);
        }
        .spooky-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .spooky-btn-success {
          width: 100%;
          padding: 0.875rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.875rem;
          background-color: #d1fae5 !important;
          border: 1.5px solid #a7f3d0 !important;
          color: #065f46 !important;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-sizing: border-box;
          animation: bounce-btn 1s infinite;
        }

        .spooky-btn-error {
          width: 100%;
          padding: 0.875rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.875rem;
          background-color: #4b5563 !important;
          color: #ffffff !important;
          border: none !important;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-sizing: border-box;
        }
        .spooky-btn-error:hover {
          background-color: #374151 !important;
        }

        /* Signup toggler */
        .spooky-toggle-signup {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
          text-align: center;
          font-size: 0.75rem;
          color: #64748b;
        }
        .spooky-toggle-btn {
          font-weight: 700;
          color: #6366f1;
          background: none;
          border: none;
          cursor: pointer;
          margin-left: 0.25rem;
        }
        .spooky-toggle-btn:hover {
          text-decoration: underline;
        }

        /* Demo box */
        .spooky-demo-box {
          margin-top: 1.25rem;
          padding: 0.875rem 1rem;
          border-radius: 16px;
          background-color: #ffffff !important;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          text-align: left;
        }
        .spooky-demo-title {
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 0.25rem;
        }
        .spooky-demo-text {
          font-size: 0.7rem;
          line-height: 1.4;
          color: #64748b;
          margin: 0;
        }

        /* Trust badges */
        .spooky-badges {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
        }
        .spooky-badge-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #cbd5e1;
        }

        /* ── GHOST BOBBING & ARM WAVING KEYFRAMES ── */
        @keyframes float-a {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(-1.5deg); }
        }
        @keyframes float-b {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(1.5deg); }
        }

        .ghost-a-animated {
          animation: float-a 4s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .ghost-b-animated {
          animation: float-b 3.5s ease-in-out infinite;
          transform-origin: center bottom;
        }

        @keyframes wave-arm-left-a {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-10deg); }
        }
        @keyframes wave-arm-right-a {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes wave-arm-left-b {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg); }
        }
        @keyframes wave-arm-right-b {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }

        .ghost-a-arm-left {
          animation: wave-arm-left-a 2.5s ease-in-out infinite;
          transform-origin: 42px 82px;
        }
        .ghost-a-arm-right {
          animation: wave-arm-right-a 2.5s ease-in-out infinite;
          transform-origin: 87px 82px;
        }
        .ghost-b-arm-left {
          animation: wave-arm-left-b 2.2s ease-in-out infinite;
          transform-origin: 132px 82px;
        }
        .ghost-b-arm-right {
          animation: wave-arm-right-b 2.2s ease-in-out infinite;
          transform-origin: 177px 82px;
        }

        @keyframes blush-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        .ghost-cheek {
          animation: blush-pulse 2s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes bounce-btn {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* Responsive styling */
        @media (max-width: 768px) {
          .spooky-card {
            flex-direction: column !important;
            min-height: auto;
          }
          .spooky-left {
            width: 100% !important;
            border-right: none;
            border-bottom: 1px solid #f1f5f9;
            padding: 2.25rem 1.5rem;
            border-radius: 24px 24px 0 0 !important;
          }
          .spooky-right {
            width: 100% !important;
            padding: 2.25rem 1.5rem;
            border-radius: 0 0 24px 24px !important;
          }
          .spooky-header {
            margin-bottom: 1rem;
          }
        }
      `}</style>

      {/* ── Outer wrapper container with forced horizontal centering ── */}
      <div className="spooky-container">
        
        {/* ── Spooky Reels Header (Enforced contrast layout) ── */}
        <div className="spooky-header">
          <button className="spooky-back-btn" onClick={() => window.history.back()}>
            <span style={{ fontSize: '1.25rem', lineHeight: '1' }}>&lt;</span>
            <span>Reels</span>
          </button>
          <div className="spooky-title">
            <span className="spooky-title-green">Spooky</span>
            <span>Login Form</span>
          </div>
          {/* Centering spacer replacing the deleted header icons */}
          <div style={{ width: '56px' }}></div>
        </div>

        {/* ── Main Card (Always Flex-Row on Desktop, Explicitly Rounded) ── */}
        <div 
          className={`spooky-card ${statusState === 'error' ? 'animate-shake' : ''}`}
        >
          
          {/* ── Left Half: Spooky Doodle Ghosts Panel (Explicitly Rounded Left) ── */}
          <div className="spooky-left">
            
            {/* Speech Bubble Above Ghost Left */}
            <div className="relative z-10 w-full max-w-[230px] mb-4">
              <div className="speech-bubble text-[#111111] text-xs font-bold py-3 px-4 text-center leading-relaxed transition-all duration-300">
                {getSpeechBubbleText()}
              </div>
            </div>

            {/* Interactive SVG Doodle Ghosts Container */}
            <div className="relative z-10 w-full max-w-[280px] h-[180px] flex items-center justify-center">
              <svg viewBox="0 0 220 130" className="w-full h-full">
                
                {/* Sparkles celebration overlay on success */}
                {ghostState === 'success' && (
                  <g className="animate-bounce">
                    <path d="M 112,33 L 115,38 L 120,39 L 116,43 L 117,48 L 112,45 L 107,48 L 108,43 L 104,39 L 109,38 Z" fill="#ffd700" />
                    <path d="M 185,30 L 188,35 L 193,36 L 189,40 L 190,45 L 185,42 L 180,45 L 181,40 L 177,36 L 182,35 Z" fill="#ffd700" />
                  </g>
                )}

                {/* ── Ghost A (Left - Interactive Speaker) ── */}
                <g className="ghost-a-animated">
                  {/* Body shape (Perfectly Centered +7px shifted) */}
                  <path
                    d="M 42,95 C 42,50 87,50 87,95 C 87,100 81,103 75,100 C 69,103 59,103 53,100 C 47,103 42,100 42,95 Z"
                    className="ghost-body"
                  />

                  {/* Star eyes or regular eyes based on success/error */}
                  {ghostState === 'success' ? (
                    <>
                      <path d="M 52,71 L 56,75 M 56,71 L 52,75" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 68,71 L 72,75 M 72,71 L 68,75" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                    </>
                  ) : ghostState === 'error' ? (
                    <>
                      <path d="M 51,70 Q 55,76 59,70" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 67,70 Q 71,76 75,70" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      {/* Normal eyes - looking at input dynamic coords */}
                      <circle cx={55 + eyeDx} cy={72 + eyeDy} r="3.5" fill="#111" />
                      <circle cx={71 + eyeDx} cy={72 + eyeDy} r="3.5" fill="#111" />
                    </>
                  )}

                  {/* Pink cheeks */}
                  <ellipse cx="49" cy="77" rx="4" ry="2.2" fill="#ffb6c1" className="ghost-cheek" />
                  <ellipse cx="77" cy="77" rx="4" ry="2.2" fill="#ffb6c1" className="ghost-cheek" />

                  {/* Mouth shape changing on states */}
                  {ghostState === 'success' ? (
                    <path d="M 59,79 Q 63,86 67,79 Z" fill="#111" />
                  ) : ghostState === 'error' ? (
                    <path d="M 60,81 Q 63,77 66,81" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                  ) : ghostState === 'loading' ? (
                    <circle cx="63" cy="80" r="3.5" fill="#111" />
                  ) : ghostState === 'typing-email' ? (
                    <circle cx="63" cy="80" r="2.2" fill="#111" />
                  ) : (
                    <path d="M 60,79 Q 63,82 66,79" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                  )}

                  {/* Animated waving arms */}
                  <path d="M 42,82 Q 31,79 26,84" fill="none" className="ghost-stroke-thick ghost-a-arm-left" />
                  <path d="M 87,82 Q 97,83 101,79" fill="none" className="ghost-stroke-thick ghost-a-arm-right" />
                </g>

                {/* ── Ghost B (Right - Playful Reactor) ── */}
                <g className="ghost-b-animated">
                  {/* Body shape (Perfectly Centered +7px shifted) */}
                  <path
                    d="M 132,95 C 132,50 177,50 177,95 C 177,100 171,103 165,100 C 159,103 149,103 143,100 C 137,103 132,100 132,95 Z"
                    className="ghost-body"
                  />

                  {/* Face expressions based on states */}
                  {(ghostState === 'typing-password' || ghostState === 'success') ? (
                    <>
                      {/* Happy happy closed eyes */}
                      <path d="M 144,72 Q 149,67 154,72" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 156,72 Q 161,67 166,72" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                    </>
                  ) : ghostState === 'error' ? (
                    <>
                      {/* Dizzy cross eyes */}
                      <path d="M 144,69 L 150,75 M 150,69 L 144,75" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 158,69 L 164,75 M 164,69 L 158,75" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      {/* Standard eyes */}
                      <circle cx="149" cy="72" r="3.5" fill="#111" />
                      <circle cx="161" cy="72" r="3.5" fill="#111" />
                    </>
                  )}

                  {/* Pink cheeks */}
                  <ellipse cx="141" cy="77" rx="4" ry="2.2" fill="#ffb6c1" className="ghost-cheek" />
                  <ellipse cx="169" cy="77" rx="4" ry="2.2" fill="#ffb6c1" className="ghost-cheek" />

                  {/* Mouth */}
                  {ghostState === 'success' ? (
                    <path d="M 151,78 Q 155,86 159,78 Z" fill="#111" />
                  ) : ghostState === 'error' ? (
                    <path d="M 152,81 Q 155,77 158,81" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                  ) : (
                    <path d="M 152,78 Q 155,81 158,78" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                  )}

                  {/* Interactive hands covering eyes when typing-password */}
                  {ghostState === 'typing-password' ? (
                    <>
                      {/* Left arm covering eye */}
                      <path d="M 132,82 Q 140,74 147,72" fill="none" stroke="#111" strokeWidth="3.2" strokeLinecap="round" />
                      <circle cx="147" cy="72" r="3.5" fill="#ffffff" stroke="#111" strokeWidth="2.2" />
                      {/* Right arm covering eye */}
                      <path d="M 177,82 Q 169,74 162,72" fill="none" stroke="#111" strokeWidth="3.2" strokeLinecap="round" />
                      <circle cx="162" cy="72" r="3.5" fill="#ffffff" stroke="#111" strokeWidth="2.2" />
                    </>
                  ) : ghostState === 'success' ? (
                    <>
                      {/* Waving high in the air */}
                      <path d="M 132,82 Q 121,68 126,61" fill="none" className="ghost-stroke-thick ghost-b-arm-left" />
                      <path d="M 177,82 Q 188,68 183,61" fill="none" className="ghost-stroke-thick ghost-b-arm-right" />
                    </>
                  ) : (
                    <>
                      {/* Standard arms waving */}
                      <path d="M 132,82 Q 125,84 121,80" fill="none" className="ghost-stroke-thick ghost-b-arm-left" />
                      <path d="M 177,82 Q 184,84 188,80" fill="none" className="ghost-stroke-thick ghost-b-arm-right" />
                    </>
                  )}
                </g>
              </svg>
            </div>
            
            {/* Subtitle branding */}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <span className="font-serif italic text-sm font-bold tracking-wide text-slate-800">DearBook</span>
              <p className="text-[9px] font-bold tracking-[0.12em] uppercase mt-0.5 text-slate-400" style={{ margin: '2px 0 0' }}>
                Personalized Story Book
              </p>
            </div>
          </div>

          {/* ── Right Half: Clean Input Form Panel (Explicitly Rounded Right) ── */}
          <div className="spooky-right">
            
            {!showOtpScreen ? (
              <>
                {/* Header Title */}
                <div>
                  <h2 className="spooky-form-title">
                    {isSignup ? 'Sign Up' : 'Sign In'}
                  </h2>
                  <p className="spooky-form-subtitle">
                    {isSignup ? 'Create an account to build your custom book' : 'Enter your credentials to access your library'}
                  </p>
                </div>

                {/* Form Input fields */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {isSignup && (
                    <div className="spooky-form-group">
                      <label className="spooky-label">Full Name</label>
                      <div className="spooky-input-wrapper">
                        <span className="spooky-input-icon">
                          <User className="w-4 h-4" />
                        </span>
                        <input 
                          type="text" 
                          value={name} 
                          onChange={e => setName(e.target.value)}
                          className="spooky-input" 
                          placeholder="Your Name" 
                          required={isSignup}
                          onFocus={() => setFocusState('name')}
                          onBlur={() => setFocusState('idle')}
                        />
                      </div>
                    </div>
                  )}

                  <div className="spooky-form-group">
                    <label className="spooky-label">Email Address</label>
                    <div className="spooky-input-wrapper">
                      <span className="spooky-input-icon">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        className="spooky-input" 
                        placeholder="username@gmail.com" 
                        required
                        onFocus={() => setFocusState('email')}
                        onBlur={() => setFocusState('idle')}
                      />
                    </div>
                  </div>

                  <div className="spooky-form-group">
                    <label className="spooky-label">Password</label>
                    <div className="spooky-input-wrapper">
                      <span className="spooky-input-icon">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        className="spooky-input" 
                        placeholder="••••••••" 
                        required
                        onFocus={() => setFocusState('password')}
                        onBlur={() => setFocusState('idle')}
                      />
                    </div>
                  </div>

                  {/* Extra Options */}
                  {!isSignup && (
                    <div className="spooky-options">
                      <label className="spooky-checkbox-label">
                        <input type="checkbox" className="spooky-checkbox" />
                        <span>Remember me</span>
                      </label>
                      <button type="button" className="spooky-forgot-btn">
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* ── Dynamic Button States (Absolutely Guaranteed Rendering) ── */}
                  <div className="spooky-btn-container">
                    {statusState === 'success' ? (
                      /* Success Button */
                      <div className="spooky-btn-success">
                        <Sparkles className="w-4 h-4 text-[#065f46]" />
                        <span>Login Successful!</span>
                      </div>
                    ) : statusState === 'error' ? (
                      /* Error Button */
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="spooky-btn-error"
                      >
                        <span>Try Again</span>
                      </button>
                    ) : (
                      /* Normal Button (Purple Gradient) */
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="spooky-btn-primary"
                      >
                        {statusState === 'loading' ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in...</span></>
                        ) : (
                          <span>{isSignup ? 'Sign Up' : 'Sign In'}</span>
                        )}
                      </button>
                    )}
                  </div>
                </form>

                {/* Toggle Signup Link */}
                <div className="spooky-toggle-signup">
                  <span>{isSignup ? 'Already have an account? ' : "Don't have an account? "}</span>
                  <button 
                    onClick={() => setIsSignup(!isSignup)}
                    className="spooky-toggle-btn"
                  >
                    {isSignup ? 'Sign In' : 'Sign Up Now'}
                  </button>
                </div>


              </>
            ) : (
              /* OTP Screen State */
              <div>
                <button 
                  onClick={() => { setShowOtpScreen(false); setStatusState('idle'); }}
                  className="spooky-back-btn"
                  style={{ color: '#64748b', marginBottom: '1.75rem' }}
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Signup
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '50%',
                    backgroundColor: '#e0e7ff',
                    marginBottom: '1rem'
                  }}>
                    <ShieldCheck className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h2 className="spooky-form-title" style={{ textAlign: 'center' }}>Email Verification</h2>
                  <p className="spooky-form-subtitle" style={{ textAlign: 'center' }}>
                    An OTP key has been sent to your email:<br />
                    <strong style={{ color: '#0f172a' }}>{email}</strong>
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="spooky-form-group">
                    <label className="spooky-label" style={{ textAlign: 'center' }}>Verification Code</label>
                    <input
                      type="text" 
                      maxLength={10} 
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="spooky-input"
                      style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.25em', paddingLeft: '1rem' }}
                      placeholder="······" 
                      required
                      onFocus={() => setFocusState('otp')}
                      onBlur={() => setFocusState('idle')}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={otpLoading}
                    className="spooky-btn-primary"
                  >
                    {otpLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying...</span></>
                    ) : (
                      'Confirm OTP'
                    )}
                  </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                  Didn't receive the code?{' '}
                  <button 
                    onClick={handleResendOtp} 
                    disabled={isLoading}
                    className="spooky-toggle-btn"
                  >
                    {isLoading ? 'Sending...' : 'Resend Code'}
                  </button>
                </p>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
}
