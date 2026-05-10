// Editor Assets Library - Icons, Stickers, Shapes, Frames

export interface AssetCategory {
  id: string;
  name: string;
  icon: string;
  items: AssetItem[];
}

export interface AssetItem {
  id: string;
  name: string;
  type: 'icon' | 'sticker' | 'shape' | 'frame' | 'pattern';
  preview?: string;
  data: string; // emoji, lucide icon name, or SVG path
  color?: string;
  tags: string[];
}

// Color Palettes
export const colorPalettes = {
  love: {
    name: 'Romance',
    colors: ['#FFE5E5', '#FFB3BA', '#FF69B4', '#FF1493', '#8B008B']
  },
  family: {
    name: 'Family',
    colors: ['#E3F2FD', '#90CAF9', '#42A5F5', '#1976D2', '#0D47A1']
  },
  birthday: {
    name: 'Celebration',
    colors: ['#F3E5F5', '#CE93D8', '#AB47BC', '#8E24AA', '#4A148C']
  },
  friendship: {
    name: 'Friendship',
    colors: ['#FFF3E0', '#FFB74D', '#FF9800', '#F57C00', '#E65100']
  },
  pastel: {
    name: 'Pastel',
    colors: ['#FFE5E5', '#FFE5CC', '#FFFFCC', '#E5FFCC', '#CCE5FF']
  },
  earth: {
    name: 'Earth Tones',
    colors: ['#F5E6D3', '#E8D5C4', '#D4B896', '#C19A6B', '#8B7355']
  },
  elegant: {
    name: 'Elegant',
    colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#333333', '#000000']
  },
  vibrant: {
    name: 'Vibrant',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
  }
};

// Decorative Stickers (Emojis)
export const stickerCategories: AssetCategory[] = [
  {
    id: 'hearts',
    name: 'Trái tim',
    icon: '❤️',
    items: [
      { id: 'heart-1', name: 'Trái tim đỏ', type: 'sticker', data: '❤️', tags: ['love', 'romance'] },
      { id: 'heart-2', name: 'Trái tim hồng', type: 'sticker', data: '💕', tags: ['love', 'romance'] },
      { id: 'heart-3', name: 'Trái tim lấp lánh', type: 'sticker', data: '💖', tags: ['love', 'romance'] },
      { id: 'heart-4', name: 'Trái tim vàng', type: 'sticker', data: '💛', tags: ['friendship'] },
      { id: 'heart-5', name: 'Trái tim xanh', type: 'sticker', data: '💙', tags: ['family'] },
      { id: 'heart-6', name: 'Trái tim tím', type: 'sticker', data: '💜', tags: ['love'] },
      { id: 'heart-7', name: 'Mũi tên tim', type: 'sticker', data: '💘', tags: ['love', 'romance'] },
      { id: 'heart-8', name: 'Trái tim băng giá', type: 'sticker', data: '💗', tags: ['love'] },
    ]
  },
  {
    id: 'celebration',
    name: 'Lễ hội',
    icon: '🎉',
    items: [
      { id: 'celeb-1', name: 'Pháo hoa', type: 'sticker', data: '🎉', tags: ['birthday', 'celebration'] },
      { id: 'celeb-2', name: 'Bóng bay', type: 'sticker', data: '🎈', tags: ['birthday', 'celebration'] },
      { id: 'celeb-3', name: 'Bánh sinh nhật', type: 'sticker', data: '🎂', tags: ['birthday'] },
      { id: 'celeb-4', name: 'Quà tặng', type: 'sticker', data: '🎁', tags: ['birthday', 'celebration'] },
      { id: 'celeb-5', name: 'Nón tiệc', type: 'sticker', data: '🎊', tags: ['celebration'] },
      { id: 'celeb-6', name: 'Pháo bông', type: 'sticker', data: '✨', tags: ['celebration'] },
      { id: 'celeb-7', name: 'Ngôi sao', type: 'sticker', data: '⭐', tags: ['celebration'] },
      { id: 'celeb-8', name: 'Vương miện', type: 'sticker', data: '👑', tags: ['birthday'] },
    ]
  },
  {
    id: 'nature',
    name: 'Thiên nhiên',
    icon: '🌸',
    items: [
      { id: 'nature-1', name: 'Hoa anh đào', type: 'sticker', data: '🌸', tags: ['nature', 'family'] },
      { id: 'nature-2', name: 'Hoa hồng', type: 'sticker', data: '🌹', tags: ['love', 'romance'] },
      { id: 'nature-3', name: 'Hoa tulip', type: 'sticker', data: '🌷', tags: ['nature'] },
      { id: 'nature-4', name: 'Hoa hướng dương', type: 'sticker', data: '🌻', tags: ['friendship'] },
      { id: 'nature-5', name: 'Bó hoa', type: 'sticker', data: '💐', tags: ['love', 'celebration'] },
      { id: 'nature-6', name: 'Cây', type: 'sticker', data: '🌳', tags: ['family', 'nature'] },
      { id: 'nature-7', name: 'Lá', type: 'sticker', data: '🍃', tags: ['nature'] },
      { id: 'nature-8', name: 'Bướm', type: 'sticker', data: '🦋', tags: ['nature'] },
    ]
  },
  {
    id: 'people',
    name: 'Con người',
    icon: '👨‍👩‍👧‍👦',
    items: [
      { id: 'people-1', name: 'Gia đình', type: 'sticker', data: '👨‍👩‍👧‍👦', tags: ['family'] },
      { id: 'people-2', name: 'Cặp đôi', type: 'sticker', data: '👫', tags: ['love'] },
      { id: 'people-3', name: 'Hai bạn', type: 'sticker', data: '👭', tags: ['friendship'] },
      { id: 'people-4', name: 'Vẫy tay', type: 'sticker', data: '👋', tags: ['friendship'] },
      { id: 'people-5', name: 'Bắt tay', type: 'sticker', data: '🤝', tags: ['friendship'] },
      { id: 'people-6', name: 'Ôm', type: 'sticker', data: '🤗', tags: ['love', 'friendship'] },
      { id: 'people-7', name: 'Nắm tay', type: 'sticker', data: '🤲', tags: ['family'] },
      { id: 'people-8', name: 'Vỗ tay', type: 'sticker', data: '👏', tags: ['celebration'] },
    ]
  },
  {
    id: 'objects',
    name: 'Đồ vật',
    icon: '📷',
    items: [
      { id: 'obj-1', name: 'Máy ảnh', type: 'sticker', data: '📷', tags: ['memories'] },
      { id: 'obj-2', name: 'Ảnh', type: 'sticker', data: '📸', tags: ['memories'] },
      { id: 'obj-3', name: 'Sách', type: 'sticker', data: '📖', tags: ['memories'] },
      { id: 'obj-4', name: 'Bút', type: 'sticker', data: '✍️', tags: ['memories'] },
      { id: 'obj-5', name: 'Thư', type: 'sticker', data: '💌', tags: ['love'] },
      { id: 'obj-6', name: 'Nhẫn', type: 'sticker', data: '💍', tags: ['love'] },
      { id: 'obj-7', name: 'Ngôi nhà', type: 'sticker', data: '🏠', tags: ['family'] },
      { id: 'obj-8', name: 'Mặt trời', type: 'sticker', data: '☀️', tags: ['nature'] },
    ]
  }
];

// Lucide Icons (Common design elements)
export const iconCategories: AssetCategory[] = [
  {
    id: 'basic',
    name: 'Cơ bản',
    icon: 'Heart',
    items: [
      { id: 'icon-heart', name: 'Trái tim', type: 'icon', data: 'Heart', tags: ['love'] },
      { id: 'icon-star', name: 'Ngôi sao', type: 'icon', data: 'Star', tags: ['celebration'] },
      { id: 'icon-circle', name: 'Vòng tròn', type: 'icon', data: 'Circle', tags: ['basic'] },
      { id: 'icon-square', name: 'Hình vuông', type: 'icon', data: 'Square', tags: ['basic'] },
      { id: 'icon-triangle', name: 'Tam giác', type: 'icon', data: 'Triangle', tags: ['basic'] },
      { id: 'icon-diamond', name: 'Kim cương', type: 'icon', data: 'Diamond', tags: ['decoration'] },
    ]
  },
  {
    id: 'arrows',
    name: 'Mũi tên',
    icon: 'ArrowRight',
    items: [
      { id: 'icon-arrow-right', name: 'Mũi tên phải', type: 'icon', data: 'ArrowRight', tags: ['arrow'] },
      { id: 'icon-arrow-left', name: 'Mũi tên trái', type: 'icon', data: 'ArrowLeft', tags: ['arrow'] },
      { id: 'icon-arrow-up', name: 'Mũi tên lên', type: 'icon', data: 'ArrowUp', tags: ['arrow'] },
      { id: 'icon-arrow-down', name: 'Mũi tên xuống', type: 'icon', data: 'ArrowDown', tags: ['arrow'] },
      { id: 'icon-chevron-right', name: 'Chevron phải', type: 'icon', data: 'ChevronRight', tags: ['arrow'] },
      { id: 'icon-chevron-left', name: 'Chevron trái', type: 'icon', data: 'ChevronLeft', tags: ['arrow'] },
    ]
  },
  {
    id: 'decorative',
    name: 'Trang trí',
    icon: 'Sparkles',
    items: [
      { id: 'icon-sparkles', name: 'Lấp lánh', type: 'icon', data: 'Sparkles', tags: ['decoration'] },
      { id: 'icon-flower', name: 'Hoa', type: 'icon', data: 'Flower', tags: ['nature'] },
      { id: 'icon-sun', name: 'Mặt trời', type: 'icon', data: 'Sun', tags: ['nature'] },
      { id: 'icon-moon', name: 'Mặt trăng', type: 'icon', data: 'Moon', tags: ['nature'] },
      { id: 'icon-cloud', name: 'Đám mây', type: 'icon', data: 'Cloud', tags: ['nature'] },
      { id: 'icon-gift', name: 'Quà', type: 'icon', data: 'Gift', tags: ['celebration'] },
      { id: 'icon-cake', name: 'Bánh', type: 'icon', data: 'Cake', tags: ['birthday'] },
      { id: 'icon-camera', name: 'Máy ảnh', type: 'icon', data: 'Camera', tags: ['memories'] },
    ]
  }
];

// Shape presets
export const shapes = [
  {
    id: 'circle',
    name: 'Vòng tròn',
    svg: '<circle cx="50" cy="50" r="40" fill="currentColor" />',
    viewBox: '0 0 100 100'
  },
  {
    id: 'square',
    name: 'Hình vuông',
    svg: '<rect x="10" y="10" width="80" height="80" fill="currentColor" />',
    viewBox: '0 0 100 100'
  },
  {
    id: 'heart',
    name: 'Trái tim',
    svg: '<path d="M50 85 C30 70, 10 50, 10 35 C10 20, 20 10, 30 10 C40 10, 45 15, 50 25 C55 15, 60 10, 70 10 C80 10, 90 20, 90 35 C90 50, 70 70, 50 85 Z" fill="currentColor" />',
    viewBox: '0 0 100 100'
  },
  {
    id: 'star',
    name: 'Ngôi sao',
    svg: '<path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" fill="currentColor" />',
    viewBox: '0 0 100 100'
  },
  {
    id: 'rectangle',
    name: 'Chữ nhật',
    svg: '<rect x="10" y="30" width="80" height="40" fill="currentColor" />',
    viewBox: '0 0 100 100'
  },
  {
    id: 'triangle',
    name: 'Tam giác',
    svg: '<path d="M50 10 L90 90 L10 90 Z" fill="currentColor" />',
    viewBox: '0 0 100 100'
  }
];

// Frame/Border presets
export const frames = [
  {
    id: 'simple',
    name: 'Đơn giản',
    svg: '<rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" stroke-width="2" />',
    viewBox: '0 0 100 100'
  },
  {
    id: 'double',
    name: 'Đường kép',
    svg: '<rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" stroke-width="2" /><rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="1" />',
    viewBox: '0 0 100 100'
  },
  {
    id: 'rounded',
    name: 'Bo tròn',
    svg: '<rect x="5" y="5" width="90" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="2" />',
    viewBox: '0 0 100 100'
  },
  {
    id: 'dashed',
    name: 'Nét đứt',
    svg: '<rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5,5" />',
    viewBox: '0 0 100 100'
  },
  {
    id: 'decorative',
    name: 'Trang trí',
    svg: '<rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" stroke-width="3" /><circle cx="50" cy="5" r="3" fill="currentColor" /><circle cx="50" cy="95" r="3" fill="currentColor" /><circle cx="5" cy="50" r="3" fill="currentColor" /><circle cx="95" cy="50" r="3" fill="currentColor" />',
    viewBox: '0 0 100 100'
  }
];

// Font combinations
export const fontPairings = [
  {
    id: 'classic',
    name: 'Classic',
    heading: 'Playfair Display',
    body: 'Poppins'
  },
  {
    id: 'modern',
    name: 'Modern',
    heading: 'Inter',
    body: 'Inter'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    heading: 'Dancing Script',
    body: 'Poppins'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    heading: 'Cormorant',
    body: 'Lato'
  },
  {
    id: 'playful',
    name: 'Playful',
    heading: 'Fredoka',
    body: 'Nunito'
  }
];

// Text effects presets
export const textEffects = [
  {
    id: 'none',
    name: 'Không',
    style: {}
  },
  {
    id: 'shadow',
    name: 'Bóng đổ',
    style: {
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
    }
  },
  {
    id: 'outline',
    name: 'Viền',
    style: {
      WebkitTextStroke: '1px currentColor',
      WebkitTextFillColor: 'transparent'
    }
  },
  {
    id: 'glow',
    name: 'Phát sáng',
    style: {
      textShadow: '0 0 10px currentColor, 0 0 20px currentColor'
    }
  },
  {
    id: 'gradient',
    name: 'Gradient',
    style: {
      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }
];

// Background patterns (using CSS gradients and patterns)
export const backgroundPatterns = [
  {
    id: 'solid',
    name: 'Màu đặc',
    style: (color: string) => ({ background: color })
  },
  {
    id: 'gradient-vertical',
    name: 'Gradient dọc',
    style: (color: string) => ({
      background: `linear-gradient(180deg, ${color}, ${adjustBrightness(color, -20)})`
    })
  },
  {
    id: 'gradient-diagonal',
    name: 'Gradient chéo',
    style: (color: string) => ({
      background: `linear-gradient(135deg, ${color}, ${adjustBrightness(color, -20)})`
    })
  },
  {
    id: 'dots',
    name: 'Chấm bi',
    style: (color: string) => ({
      background: `radial-gradient(circle, ${adjustBrightness(color, -10)} 1px, transparent 1px)`,
      backgroundSize: '20px 20px'
    })
  },
  {
    id: 'stripes',
    name: 'Sọc',
    style: (color: string) => ({
      background: `repeating-linear-gradient(45deg, ${color}, ${color} 10px, ${adjustBrightness(color, -5)} 10px, ${adjustBrightness(color, -5)} 20px)`
    })
  }
];

// Helper function
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}
