import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface InteractiveLogoutButtonProps {
  onLogout?: () => Promise<void> | void;
  label?: string;
  className?: string;
  variant?: 'light' | 'dark' | 'ghost';
}

export const InteractiveLogoutButton: React.FC<InteractiveLogoutButtonProps> = ({
  onLogout,
  label = 'Đăng xuất',
  className = '',
  variant = 'ghost',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (onLogout) await onLogout();
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Đăng xuất thất bại. Vui lòng thử lại sau.');
      setIsLoading(false);
    }
  };

  const isGhost = variant === 'ghost';
  const isLight = variant === 'light';

  return (
    <>
      <style>{`
        @keyframes doorSwing {
          0%   { transform: perspective(80px) rotateY(0deg); }
          100% { transform: perspective(80px) rotateY(-38deg); }
        }
        @keyframes personWalk {
          0%   { transform: translateX(0px); opacity: 1; }
          60%  { transform: translateX(5px); opacity: 0.7; }
          100% { transform: translateX(3px); opacity: 1; }
        }

        .ilb-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          outline: none;
          white-space: nowrap;
          user-select: none;
        }
        .ilb-btn:active { transform: scale(0.96); }
        .ilb-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Ghost variant */
        .ilb-ghost {
          background: transparent;
          color: #888;
          padding: 6px 10px;
        }
        .ilb-ghost:hover {
          color: #c0392b;
          background: rgba(192, 57, 43, 0.06);
        }

        /* Light variant */
        .ilb-light {
          background: #ffffff;
          color: #555;
          padding: 7px 14px;
          border: 1px solid #e8e4de;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .ilb-light:hover {
          background: #fff5f5;
          color: #c0392b;
          border-color: #fbbcbc;
          box-shadow: 0 2px 10px rgba(192, 57, 43, 0.10);
        }

        /* Dark variant */
        .ilb-dark {
          background: #1a1a1a;
          color: #f3e9d7;
          padding: 7px 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        }
        .ilb-dark:hover {
          background: #c0392b;
          color: #fff;
        }

        /* SVG door animation */
        .ilb-door {
          transform-origin: 10% 50%;
          transition: transform 0.38s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        .ilb-btn:not(:disabled):hover .ilb-door {
          animation: doorSwing 0.38s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
        }

        /* SVG person animation */
        .ilb-person {
          transition: transform 0.38s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        .ilb-btn:not(:disabled):hover .ilb-person {
          animation: personWalk 0.5s ease-in-out forwards;
        }

        /* Arrow fade-in on hover */
        .ilb-arrow {
          opacity: 0;
          transition: opacity 0.25s ease, transform 0.25s ease;
          transform: translateX(-3px);
        }
        .ilb-btn:not(:disabled):hover .ilb-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      <button
        onClick={handleLogout}
        disabled={isLoading}
        title={label}
        className={`ilb-btn ${isGhost ? 'ilb-ghost' : isLight ? 'ilb-light' : 'ilb-dark'} ${className}`}
      >
        <span>{label}</span>

        <div style={{ width: 18, height: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isLoading ? (
            <Loader2
              style={{ width: 15, height: 15, opacity: 0.6 }}
              className="animate-spin"
            />
          ) : (
            <svg
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 18, height: 18, overflow: 'visible' }}
            >
              {/* Door Frame */}
              <rect x="2" y="2" width="8" height="18" rx="1.5" className="ilb-door" />

              {/* Door knob */}
              <circle cx="8.5" cy="11" r="0.9" fill="currentColor" stroke="none" className="ilb-door" />

              {/* Person (stick figure) */}
              <g className="ilb-person">
                {/* Head */}
                <circle cx="16" cy="7" r="2" strokeWidth="1.6" />
                {/* Body */}
                <line x1="16" y1="9" x2="16" y2="14.5" />
                {/* Left arm */}
                <line x1="16" y1="11" x2="13.5" y2="13" />
                {/* Right arm + arrow */}
                <line x1="16" y1="11" x2="18.5" y2="13" />
                {/* Left leg */}
                <line x1="16" y1="14.5" x2="13.5" y2="19" />
                {/* Right leg */}
                <line x1="16" y1="14.5" x2="18.5" y2="19" />
              </g>

              {/* Arrow hinting "exit" */}
              <g className="ilb-arrow">
                <line x1="9" y1="11" x2="13" y2="11" strokeWidth="1.5" />
                <polyline points="11.5,9 13.5,11 11.5,13" strokeWidth="1.5" />
              </g>
            </svg>
          )}
        </div>
      </button>
    </>
  );
};
