import { useState } from 'react';
import { Plus, Type, Image as ImageIcon, Shapes, Smile, Sparkles, X } from 'lucide-react';

interface FloatingActionMenuProps {
  onAddText: () => void;
  onAddImage: () => void;
  onAddShape: () => void;
  onAddSticker: () => void;
}

export function FloatingActionMenu({
  onAddText,
  onAddImage,
  onAddShape,
  onAddSticker,
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Type,
      label: 'Thêm chữ',
      color: 'from-pink-500 to-rose-500',
      onClick: () => {
        onAddText();
        setIsOpen(false);
      }
    },
    {
      icon: ImageIcon,
      label: 'Thêm ảnh',
      color: 'from-blue-500 to-cyan-500',
      onClick: () => {
        onAddImage();
        setIsOpen(false);
      }
    },
    {
      icon: Shapes,
      label: 'Thêm hình',
      color: 'from-purple-500 to-pink-500',
      onClick: () => {
        onAddShape();
        setIsOpen(false);
      }
    },
    {
      icon: Smile,
      label: 'Thêm sticker',
      color: 'from-amber-500 to-orange-500',
      onClick: () => {
        onAddSticker();
        setIsOpen(false);
      }
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-5 duration-300">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`group flex items-center gap-3 bg-gradient-to-r ${action.color} text-white rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm whitespace-nowrap">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gray-800 hover:bg-gray-900 rotate-45'
            : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:shadow-pink-300 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <div className="relative">
            <Plus className="w-7 h-7 text-white" />
            <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
