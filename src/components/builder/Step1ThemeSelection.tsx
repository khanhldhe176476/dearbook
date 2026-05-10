import { Heart, Users, Cake, Sparkles, Check } from 'lucide-react';

interface Step1ThemeSelectionProps {
  selectedTheme?: 'love' | 'family' | 'birthday' | 'friendship';
  onSelect: (theme: 'love' | 'family' | 'birthday' | 'friendship') => void;
}

const themes = [
  {
    id: 'love' as const,
    name: 'Tình yêu',
    description: 'Dành tặng người yêu, vợ/chồng, bạn đời',
    icon: Heart,
    emoji: '💕',
    bgImage: 'https://images.unsplash.com/photo-1650595808040-e58faadbc6e8?w=800',
    examples: ['Kỷ niệm ngày cưới', 'Valentine', 'Ngày yêu đầu'],
  },
  {
    id: 'family' as const,
    name: 'Gia đình',
    description: 'Kỷ niệm gia đình, cha mẹ, con cái',
    icon: Users,
    emoji: '👨‍👩‍👧',
    bgImage: 'https://images.unsplash.com/photo-1598623549917-a38dc6cd19b5?w=800',
    examples: ['Kỷ niệm gia đình', 'Ngày của mẹ', 'Tuổi thơ'],
  },
  {
    id: 'birthday' as const,
    name: 'Sinh nhật',
    description: 'Quà tặng sinh nhật đặc biệt',
    icon: Cake,
    emoji: '🎂',
    bgImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
    examples: ['Sinh nhật bạn bè', 'Tuổi mới', 'Năm mới'],
  },
  {
    id: 'friendship' as const,
    name: 'Tình bạn',
    description: 'Tặng bạn thân, người bạn tri kỷ',
    icon: Sparkles,
    emoji: '🤝',
    bgImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
    examples: ['Kỷ niệm bạn bè', 'Tốt nghiệp', 'Chia tay'],
  },
];

export function Step1ThemeSelection({ selectedTheme, onSelect }: Step1ThemeSelectionProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#3A2E28' }}>
          Cuốn sách này dành cho ai?
        </h2>
        <p className="text-base" style={{ color: '#7A6F66' }}>
          Chọn chủ đề phù hợp để chúng tôi gợi ý nội dung phù hợp nhất
        </p>
      </div>

      {/* Theme Cards */}
      <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className="group relative overflow-hidden rounded-2xl text-left transition-all duration-200"
              style={{
                background: '#F5F2EE',
                border: isSelected ? '2px solid #3A2E28' : '1.5px solid #DDD8D0',
                boxShadow: isSelected
                  ? '0 8px 28px rgba(58,46,40,0.18)'
                  : '0 2px 8px rgba(58,46,40,0.06)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(58,46,40,0.12)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(58,46,40,0.06)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }
              }}
            >
              {/* Background image tinted neutral */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={theme.bgImage}
                  alt={theme.name}
                  className="w-full h-full object-cover"
                  style={{ opacity: 0.08, filter: 'grayscale(100%)' }}
                />
              </div>

              {/* Content */}
              <div className="relative p-7">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
                    style={{ background: '#3A2E28' }}
                  >
                    <Icon className="w-7 h-7" style={{ color: '#EDE9E3' }} />
                  </div>
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {theme.emoji}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-1" style={{ color: '#3A2E28' }}>{theme.name}</h3>
                <p className="text-sm mb-4" style={{ color: '#7A6F66' }}>{theme.description}</p>

                <div className="flex flex-wrap gap-2">
                  {theme.examples.map((example, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: isSelected ? 'rgba(58,46,40,0.10)' : '#EDE9E3',
                        color: '#5A5049',
                      }}
                    >
                      {example}
                    </span>
                  ))}
                </div>

                {isSelected && (
                  <div className="mt-4 flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: '#3A2E28' }}
                    >
                      <Check className="w-3 h-3" style={{ color: '#EDE9E3' }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: '#3A2E28' }}>Đã chọn</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tip */}
      <div
        className="max-w-2xl mx-auto p-5 rounded-2xl text-center"
        style={{ background: '#F5F2EE', border: '1px solid #DDD8D0' }}
      >
        <p className="text-sm" style={{ color: '#7A6F66' }}>
          💡 <strong style={{ color: '#5A5049' }}>Mẹo:</strong>{' '}
          Chủ đề ảnh hưởng đến màu sắc, họa tiết và nội dung gợi ý. Bạn có thể thay đổi lại sau.
        </p>
      </div>
    </div>
  );
}
