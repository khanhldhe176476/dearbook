import { Heart, Users, Cake, Smile } from 'lucide-react';

interface Step1ThemeSelectorProps {
  onSelect: (theme: 'love' | 'family' | 'birthday' | 'friendship') => void;
}

const themes = [
  {
    id: 'love' as const,
    title: 'Tnh Yu',
    icon: Heart,
    emoji: '',
    description: 'Cun sch k v cu chuyn tnh yu ngt ngo ca hai bn',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    image: 'https://images.unsplash.com/photo-1558715585-9b706788d173?w=800&fit=crop'
  },
  {
    id: 'family' as const,
    title: 'Gia nh',
    icon: Users,
    emoji: '',
    description: 'Nhng khonh khc m p bn gia nh thn yu',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    image: 'https://images.unsplash.com/photo-1585435656462-8abb322cbb68?w=800&fit=crop'
  },
  {
    id: 'birthday' as const,
    title: 'Sinh Nht',
    icon: Cake,
    emoji: '',
    description: 'Chc mng sinh nht vi mn qu c bit v  ngha',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    image: 'https://images.unsplash.com/photo-1565846289654-80d39aa5ac41?w=800&fit=crop'
  },
  {
    id: 'friendship' as const,
    title: 'Tnh Bn',
    icon: Smile,
    emoji: '',
    description: 'K nim v tnh bn p v nhng ngi bn thn thit',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    image: 'https://images.unsplash.com/photo-1747184046952-8890127c598a?w=800&fit=crop'
  }
];

export function Step1ThemeSelector({ onSelect }: Step1ThemeSelectorProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
          Chn ch  cho cun sch ca bn
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Mi ch  s c nhng ni dung v minh ha ph hp vi cu chuyn bn mun k
        </p>
      </div>

      {/* Theme Grid */}
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {themes.map((theme) => {
          const Icon = theme.icon;
          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className={`group relative overflow-hidden rounded-3xl border-2 ${theme.borderColor} ${theme.bgColor} p-8 text-left transition-all hover:scale-[1.02] hover:shadow-2xl`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                <img
                  src={theme.image}
                  alt={theme.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{theme.emoji}</span>
                  </div>
                  <Icon className={`w-8 h-8 text-gray-400 group-hover:text-gray-600 transition`} />
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition">
                  {theme.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {theme.description}
                </p>

                {/* Arrow */}
                <div className="mt-6 flex items-center gap-2 text-gray-900 font-semibold group-hover:gap-4 transition-all">
                  Chn ch  ny
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className={`absolute inset-0 border-4 border-transparent group-hover:border-current opacity-0 group-hover:opacity-20 rounded-3xl transition-all pointer-events-none`} 
                   style={{ color: theme.color.split(' ')[1] }}></div>
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-12 p-6 rounded-2xl bg-purple-50 border border-purple-200 max-w-3xl mx-auto">
        <p className="text-center text-purple-900">
           <strong>Lu :</strong> Bn c th quay li v thay i ch  bt k lc no trong qu trnh thit k
        </p>
      </div>
    </div>
  );
}
