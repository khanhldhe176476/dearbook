import { useState, useEffect } from 'react';
import { X, ChevronRight, Lightbulb, BookOpen, Edit3, Eye } from 'lucide-react';

interface BeginnerTutorialProps {
  currentStep: number;
}

export function BeginnerTutorial({ currentStep }: BeginnerTutorialProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed tutorial before
    const dismissed = localStorage.getItem('dearbook_tutorial_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('dearbook_tutorial_dismissed', 'true');
    setIsVisible(false);
    setIsDismissed(true);
  };

  const tutorials = [
    {
      step: 1,
      icon: BookOpen,
      title: 'Chọn chủ đề phù hợp',
      tips: [
        'Mỗi chủ đề có nội dung và hình ảnh được thiết kế riêng',
        'Bạn có thể xem trước các mẫu trước khi chọn',
        'Đừng lo! Bạn có thể thay đổi bất cứ lúc nào'
      ]
    },
    {
      step: 2,
      icon: Edit3,
      title: 'Chọn mẫu thiết kế',
      tips: [
        'Mỗi mẫu đã có nội dung mẫu sẵn - bạn chỉ cần tùy chỉnh',
        'Nhấn vào mẫu để xem chi tiết các trang',
        'Chọn mẫu phù hợp với phong cách và dịp của bạn'
      ]
    },
    {
      step: 3,
      icon: Users,
      title: 'Tùy chỉnh nhân vật',
      tips: [
        'Chọn phong cách phù hợp với người nhận quà',
        'Bạn có thể thay đổi tóc, trang phục theo sở thích',
        'Nhân vật này sẽ xuất hiện trong các trang sách'
      ]
    },
    {
      step: 4,
      icon: Eye,
      title: 'Chỉnh sửa nội dung',
      tips: [
        'Nhấn vào văn bản để chỉnh sửa lời nhắn của bạn',
        'Kéo thả để di chuyển các phần tử',
        'Upload ảnh của bạn vào các khung ảnh',
        'Xem 3D để kiểm tra trước khi đặt hàng'
      ]
    }
  ];

  const currentTutorial = tutorials.find(t => t.step === currentStep);
  
  if (!currentTutorial || !isVisible || isDismissed) {
    return null;
  }

  const Icon = currentTutorial.icon;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm animate-fade-in" style={{ zIndex: 9999 }}>
      <div 
        className="rounded-2xl shadow-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF7ED 100%)',
          border: '1px solid #FED7AA',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Header */}
        <div 
          className="px-4 py-3 flex items-center justify-between"
          style={{
            background: 'linear-gradient(90deg, #FB7185 0%, #FB923C 100%)',
            color: '#ffffff',
          }}
        >
          <div className="flex items-center gap-2" style={{ color: '#ffffff' }}>
            <Lightbulb className="w-5 h-5" style={{ color: '#ffffff' }} />
            <span className="font-semibold">Mẹo hữu ích</span>
          </div>
          <button
            onClick={handleDismiss}
            className="transition-colors"
            style={{ color: 'rgba(255, 255, 255, 0.8)', border: 'none', background: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3" style={{ background: '#FFFBEB' }}>
          <div className="flex items-center gap-2 text-gray-800" style={{ color: '#1F2937' }}>
            <Icon className="w-5 h-5 text-rose-500" style={{ color: '#F43F5E' }} />
            <h3 className="font-semibold" style={{ color: '#1F2937', margin: 0 }}>{currentTutorial.title}</h3>
          </div>

          <ul className="space-y-2" style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {currentTutorial.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700" style={{ color: '#374151' }}>
                <ChevronRight className="w-4 h-4 mt-0.5 text-rose-400 flex-shrink-0" style={{ color: '#FB7185' }} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-orange-200" style={{ background: 'rgba(255, 255, 255, 0.65)', borderTop: '1px solid #FED7AA' }}>
          <button
            onClick={handleDismiss}
            className="text-xs transition-colors"
            style={{ color: '#4B5563', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#4B5563'}
          >
            Không hiển thị lại
          </button>
        </div>
      </div>
    </div>
  );
}

function Users({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
