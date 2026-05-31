import { useState, useEffect } from 'react';
import { Heart, Users, Cake, Sparkles, Check, Loader2, Info } from 'lucide-react';
import { categoryApi, Category } from '../../lib/categoryApi';

import autoData from '../../data/autoTemplates.json';

interface Step1ThemeSelectionProps {
  selectedTheme?: string;
  onSelect: (theme: string) => void;
}

const getThemeDetails = (name: string, id: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('yêu') || id.includes('love')) return { icon: Heart, emoji: '💕', bgImage: 'https://images.unsplash.com/photo-1650595808040-e58faadbc6e8?w=800', examples: ['Kỷ niệm tình yêu', 'Valentine'] };
  if (lowerName.includes('gia đình') || id.includes('family')) return { icon: Users, emoji: '👨‍👩‍👧', bgImage: 'https://images.unsplash.com/photo-1598623549917-a38dc6cd19b5?w=800', examples: ['Kỷ niệm gia đình', 'Ngày của mẹ'] };
  if (lowerName.includes('sinh nhật') || id.includes('birthday')) return { icon: Cake, emoji: '🎂', bgImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800', examples: ['Sinh nhật', 'Tuổi mới'] };
  if (lowerName.includes('bạn') || lowerName.includes('friend')) return { icon: Sparkles, emoji: '🤝', bgImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', examples: ['Kỷ niệm bạn bè', 'Tốt nghiệp'] };
  return { icon: Sparkles, emoji: '✨', bgImage: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800', examples: ['Lưu bút', 'Kỷ niệm'] };
};

const autoThemes = autoData.themes.map(t => {
  const details = getThemeDetails(t.name, t.id);
  return {
    id: t.id,
    name: t.name,
    description: `Sách ảnh chủ đề ${t.name}`,
    ...details
  };
});

export function Step1ThemeSelection({ selectedTheme, onSelect }: Step1ThemeSelectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryApi.getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Không thể tải danh mục từ máy chủ. Đang sử dụng dữ liệu dự phòng.');
      } finally { setLoading(false); }
    };
    fetchCategories();
  }, []);

  const displayThemes = categories.length > 0
    ? categories.map(cat => {
        const matched = autoThemes.find(t => t.id === cat.slug);
        const fallback = autoThemes.length > 0 ? autoThemes[0] : null;
        const mockTheme = matched || fallback;
        
        if (!mockTheme) return null;
        
        return { ...mockTheme, id: cat.slug, name: cat.name, description: cat.description || mockTheme.description, apiId: cat.id };
      }).filter(Boolean) as typeof autoThemes
    : autoThemes;

  return (
    <div className="step1-wrapper">
      {/* ── Header ── */}
      <div className="step1-header">
        <p className="step1-eyebrow">Bước 1 · Chọn chủ đề</p>
        <h2 className="step1-title">Câu chuyện nào<br />bạn muốn kể?</h2>
        <p className="step1-subtitle">
          Mỗi chủ đề mang một ngôn ngữ riêng — chọn cái chạm đúng cảm xúc
          bạn muốn gửi gắm vào trang sách.
        </p>
      </div>

      {/* ── Loading state ── */}
      {loading && (
        <div className="step1-loading">
          <Loader2 className="step1-spinner" size={28} />
          <span>Đang tải chủ đề…</span>
        </div>
      )}

      {/* ── Error banner ── */}
      {error && !loading && (
        <div className="step1-error-banner">
          <Info size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Theme grid ── */}
      {!loading && (
        <div className="step1-grid">
          {displayThemes.map((theme) => {
            const Icon = theme.icon;
            const isSelected = selectedTheme === theme.id;

            return (
              <button
                key={theme.id}
                onClick={() => onSelect(theme.id)}
                className={`theme-card${isSelected ? ' theme-card--selected' : ''}`}
                aria-pressed={isSelected}
              >
                {/* Background image */}
                <div
                  className="theme-card__bg"
                  style={{ backgroundImage: `url(${theme.bgImage})` }}
                />

                {/* Dark overlay for readability */}
                <div className="theme-card__overlay" />

                {/* Selected checkmark badge */}
                {isSelected && (
                  <span className="theme-card__check">
                    <Check size={13} strokeWidth={3} />
                  </span>
                )}

                {/* Card content */}
                <div className="theme-card__content">
                  {/* Top row: icon + emoji */}
                  <div className="theme-card__top-row">
                    <span className="theme-card__icon-wrap">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <span className="theme-card__emoji">{theme.emoji}</span>
                  </div>

                  {/* Title */}
                  <h3 className="theme-card__name">{theme.name}</h3>

                  {/* Description */}
                  <p className="theme-card__desc">{theme.description}</p>

                  {/* Example tags */}
                  <div className="theme-card__tags">
                    {theme.examples.map((ex) => (
                      <span key={ex} className="theme-card__tag">{ex}</span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Tip note ── */}
      {!loading && (
        <div className="step1-tip">
          <div className="step1-tip__bar" />
          <p className="step1-tip__text">
            <strong>Lưu ý:</strong> Chủ đề ảnh hưởng đến bố cục, màu sắc và phong cách
            chữ trong toàn bộ cuốn sách. Bạn vẫn có thể đổi trước khi xuất bản.
          </p>
        </div>
      )}

      {/* ── Scoped styles ── */}
      <style>{`
        .step1-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 0.25rem 0;
        }

        /* ── Header ── */
        .step1-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .step1-eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9ca3af;
          margin: 0;
        }
        .step1-title {
          font-size: clamp(1.6rem, 3vw, 2.1rem);
          font-weight: 800;
          line-height: 1.18;
          color: #111827;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .step1-subtitle {
          font-size: 0.9rem;
          line-height: 1.65;
          color: #6b7280;
          margin: 0;
          max-width: 480px;
        }

        /* ── Loading ── */
        .step1-loading {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #6b7280;
          font-size: 0.88rem;
          padding: 1.5rem 0;
        }
        .step1-spinner {
          animation: spin 1s linear infinite;
          color: #374151;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Error banner ── */
        .step1-error-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.82rem;
          color: #92400e;
          line-height: 1.5;
        }
        .step1-error-banner svg { margin-top: 1px; flex-shrink: 0; }

        /* ── Grid ── */
        .step1-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 480px) {
          .step1-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ── Card ── */
        .theme-card {
          position: relative;
          min-height: 210px;
          border-radius: 14px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          background: #1a1a1a;
          cursor: pointer;
          text-align: left;
          padding: 0;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.18s ease;
          outline: none;
        }
        .theme-card:focus-visible {
          outline: 3px solid #111827;
          outline-offset: 3px;
        }
        .theme-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
        }
        .theme-card:hover .theme-card__bg {
          opacity: 0.4;
        }
        .theme-card--selected {
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.15), 0 12px 32px rgba(0, 0, 0, 0.2);
        }

        /* Background image */
        .theme-card__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.28;
          filter: grayscale(60%) sepia(20%);
          transition: opacity 0.25s ease;
        }

        /* Overlay */
        .theme-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(10, 10, 10, 0.45) 0%,
            rgba(10, 10, 10, 0.25) 50%,
            rgba(10, 10, 10, 0.55) 100%
          );
        }

        /* Checkmark badge */
        .theme-card__check {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 24px;
          height: 24px;
          background: #111827;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }

        /* Content */
        .theme-card__content {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1.1rem 1.2rem 1.1rem;
          height: 100%;
          min-height: 210px;
          justify-content: flex-start;
        }

        /* Top row */
        .theme-card__top-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.2rem;
        }
        .theme-card__icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9px;
          color: #ffffff;
          backdrop-filter: blur(4px);
          flex-shrink: 0;
        }
        .theme-card__emoji {
          font-size: 1.4rem;
          line-height: 1;
        }

        /* Title */
        .theme-card__name {
          font-size: 1.18rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.2;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        /* Description */
        .theme-card__desc {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.75);
          margin: 0;
          line-height: 1.5;
        }

        /* Tags */
        .theme-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: auto;
          padding-top: 0.6rem;
        }
        .theme-card__tag {
          font-size: 0.68rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 0.22rem 0.6rem;
          letter-spacing: 0.01em;
          backdrop-filter: blur(3px);
        }

        /* ── Tip box ── */
        .step1-tip {
          display: flex;
          align-items: flex-start;
          gap: 0;
          background: #f9fafb;
          border-radius: 10px;
          overflow: hidden;
        }
        .step1-tip__bar {
          width: 4px;
          flex-shrink: 0;
          background: #374151;
          align-self: stretch;
        }
        .step1-tip__text {
          font-size: 0.8rem;
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
          padding: 0.85rem 1rem;
        }
        .step1-tip__text strong {
          color: #111827;
        }
      `}</style>
    </div>
  );
}
