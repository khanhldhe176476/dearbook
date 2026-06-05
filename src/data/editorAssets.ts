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

// Text combinations (Canva-like text presets)
export const textCombinations = [
  {
    id: 'tc-classic-title',
    name: 'Tiêu đề Cổ điển',
    elements: [
      { type: 'text', content: 'KỶ NIỆM', fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 'bold', y: 0 },
      { type: 'text', content: 'Những năm tháng tuyệt vời nhất', fontFamily: 'Poppins', fontSize: 18, fontWeight: 'normal', y: 60 }
    ]
  },
  {
    id: 'tc-romantic-love',
    name: 'Tình yêu Lãng mạn',
    elements: [
      { type: 'text', content: 'Gửi người thương', fontFamily: 'Dancing Script', fontSize: 56, fontWeight: 'bold', color: '#FF69B4', y: 0 },
      { type: 'text', content: 'Mãi mãi bên nhau', fontFamily: 'Poppins', fontSize: 20, fontWeight: 'normal', y: 70 }
    ]
  },
  {
    id: 'tc-modern-minimal',
    name: 'Hiện đại Tối giản',
    elements: [
      { type: 'text', content: 'OUR STORY', fontFamily: 'Inter', fontSize: 42, fontWeight: '900', letterSpacing: 5, y: 0 },
      { type: 'text', content: 'EST. 2024', fontFamily: 'Inter', fontSize: 14, fontWeight: 'light', letterSpacing: 8, y: 55 }
    ]
  },
  {
    id: 'tc-birthday-fun',
    name: 'Sinh nhật Vui vẻ',
    elements: [
      { type: 'text', content: 'Happy Birthday!', fontFamily: 'Fredoka', fontSize: 48, fontWeight: 'bold', color: '#FF9800', y: 0 },
      { type: 'text', content: 'Chúc mừng tuổi mới rạng rỡ', fontFamily: 'Nunito', fontSize: 18, fontWeight: 'normal', y: 60 }
    ]
  },
  {
    id: 'tc-family-warm',
    name: 'Gia đình Ấm áp',
    elements: [
      { type: 'text', content: 'Hạnh Phúc', fontFamily: 'Lora', fontSize: 36, fontStyle: 'italic', fontWeight: 'bold', y: 0 },
      { type: 'text', content: 'Là được ở bên nhau', fontFamily: 'Poppins', fontSize: 16, fontWeight: 'normal', y: 45 }
    ]
  },
  {
    id: 'tc-love-forever',
    name: 'Tình yêu Vĩnh cửu',
    elements: [
      { type: 'text', content: 'Forever', fontFamily: 'Great Vibes', fontSize: 64, fontWeight: 'bold', color: '#880E4F', y: 0 },
      { type: 'text', content: '& Always Together', fontFamily: 'Montserrat', fontSize: 16, fontWeight: '300', letterSpacing: 4, y: 70 }
    ]
  },
  {
    id: 'tc-friend-trip',
    name: 'Chuyến đi Kỷ lục',
    elements: [
      { type: 'text', content: 'THE JOURNEY', fontFamily: 'Oswald', fontSize: 40, fontWeight: 'bold', color: '#00796B', y: 0 },
      { type: 'text', content: 'Exploring the world with you', fontFamily: 'Poppins', fontSize: 14, fontWeight: 'light', y: 55 }
    ]
  },
  {
    id: 'tc-modern-quote',
    name: 'Trích dẫn Hiện đại',
    elements: [
      { type: 'text', content: '"', fontFamily: 'Playfair Display', fontSize: 80, fontWeight: 'bold', color: '#E0E0E0', y: -20, x: -10 },
      { type: 'text', content: 'Cứ đam mê, cứ dại khờ', fontFamily: 'Poppins', fontSize: 24, fontWeight: '600', fontStyle: 'italic', y: 30 }
    ]
  }
];

// Page Templates (Layouts)
export const pageTemplates = [
  {
    id: 'pt-full-image',
    name: 'Ảnh toàn trang',
    thumbnail: 'https://images.unsplash.com/photo-1626233563542-148409467765?w=200&h=300&fit=crop',
    elements: [
      { id: 'full-img', type: 'image', x: 0, y: 0, width: 400, height: 600, src: 'https://images.unsplash.com/photo-1626233563542-148409467765', objectFit: 'cover' }
    ]
  },
  {
    id: 'pt-hero-text',
    name: 'Tiêu đề lớn',
    thumbnail: 'https://images.unsplash.com/photo-1767455281523-8caf432d2ecc?w=200&h=300&fit=crop',
    elements: [
      { id: 'bg-shape', type: 'shape', x: 0, y: 0, width: 400, height: 600, fill: '#F5F2EE', shape: 'square' },
      { id: 'title', type: 'text', x: 40, y: 100, width: 320, height: 100, content: 'TIÊU ĐỀ CHÍNH', fontSize: 42, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center' },
      { id: 'divider', type: 'shape', x: 150, y: 220, width: 100, height: 2, fill: '#3A2E28', shape: 'rectangle' },
      { id: 'body', type: 'text', x: 40, y: 260, width: 320, height: 200, content: 'Bắt đầu câu chuyện của bạn tại đây với những dòng chữ đầy cảm xúc...', fontSize: 18, fontFamily: 'Poppins', textAlign: 'center' }
    ]
  },
  {
    id: 'pt-photo-grid',
    name: 'Bộ sưu tập',
    thumbnail: 'https://images.unsplash.com/photo-1759976910127-33085ece44b3?w=200&h=300&fit=crop',
    elements: [
      { id: 'img-1', type: 'image', x: 20, y: 20, width: 170, height: 170, src: 'https://images.unsplash.com/photo-1766808984213-4293f91d6a6f', objectFit: 'cover' },
      { id: 'img-2', type: 'image', x: 210, y: 20, width: 170, height: 170, src: 'https://images.unsplash.com/photo-1638297166240-866903a7190c', objectFit: 'cover' },
      { id: 'img-3', type: 'image', x: 20, y: 210, width: 360, height: 250, src: 'https://images.unsplash.com/photo-1764751024389-857d08396423', objectFit: 'cover' },
      { id: 'caption', type: 'text', x: 40, y: 480, width: 320, height: 60, content: 'Những khoảnh khắc đáng nhớ cùng nhau', fontSize: 16, fontFamily: 'Poppins', fontStyle: 'italic', textAlign: 'center' }
    ]
  },
  {
    id: 'pt-love-message',
    name: 'Thư tình',
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=300&fit=crop',
    elements: [
      { id: 'bg-color', type: 'shape', x: 0, y: 0, width: 400, height: 600, fill: '#FFF5F5', shape: 'square' },
      { id: 'heart-decor', type: 'sticker', x: 175, y: 40, width: 50, height: 50, emoji: '💖' },
      { id: 'message', type: 'text', x: 50, y: 120, width: 300, height: 400, content: 'Gửi người em yêu nhất,\n\nCảm ơn anh đã luôn ở bên cạnh em, che chở và yêu thương em vô điều kiện. Cuốn sách này là minh chứng cho hành trình tuyệt vời mà chúng ta đã cùng đi qua...', fontSize: 20, fontFamily: 'Dancing Script', lineHeight: 1.8 }
    ]
  },
  {
    id: 'pt-love-floral',
    name: 'Hoa Tình Yêu',
    thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=300&fit=crop',
    elements: [
      { id: 'bg-img', type: 'image', x: 0, y: 0, width: 400, height: 600, src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946', objectFit: 'cover', opacity: 0.3 },
      { id: 'title', type: 'text', x: 20, y: 250, width: 360, content: 'Nơi Tình Yêu Bắt Đầu', fontSize: 36, fontFamily: 'Dancing Script', color: '#D81B60', textAlign: 'center' },
      { id: 'date', type: 'text', x: 20, y: 310, width: 360, content: 'Since 20.10.2020', fontSize: 16, fontFamily: 'Poppins', color: '#333', textAlign: 'center' }
    ]
  },
  {
    id: 'pt-family-polaroid',
    name: 'Gia Đình Polaroid',
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=300&fit=crop',
    elements: [
      { id: 'bg', type: 'shape', x: 0, y: 0, width: 400, height: 600, fill: '#F8F9FA', shape: 'square' },
      { id: 'frame-1', type: 'image', x: 50, y: 50, width: 300, height: 350, src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300', objectFit: 'cover', border: '15px solid white' },
      { id: 'caption', type: 'text', x: 50, y: 420, width: 300, content: 'Gia đình là tất cả ❤️', fontSize: 24, fontFamily: 'Lora', textAlign: 'center' }
    ]
  },
  {
    id: 'pt-birthday-party',
    name: 'Tiệc Sinh Nhật',
    thumbnail: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=200&h=300&fit=crop',
    elements: [
      { id: 'bg-color', type: 'shape', x: 0, y: 0, width: 400, height: 600, fill: '#FFF3E0', shape: 'square' },
      { id: 'balloon-1', type: 'sticker', x: 30, y: 30, width: 60, height: 60, emoji: '🎈' },
      { id: 'balloon-2', type: 'sticker', x: 310, y: 50, width: 60, height: 60, emoji: '🎈' },
      { id: 'cake', type: 'sticker', x: 150, y: 480, width: 100, height: 100, emoji: '🎂' },
      { id: 'title', type: 'text', x: 50, y: 150, width: 300, content: 'HAPPY BIRTHDAY', fontSize: 48, fontFamily: 'Fredoka', color: '#F57C00', textAlign: 'center', fontWeight: 'bold' }
    ]
  },
  {
    id: 'pt-friend-adventures',
    name: 'Hành trình Bạn thân',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=300&fit=crop',
    elements: [
      { id: 'img-main', type: 'image', x: 0, y: 0, width: 400, height: 400, src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac', objectFit: 'cover' },
      { id: 'text-bg', type: 'shape', x: 0, y: 400, width: 400, height: 200, fill: '#004D40', shape: 'square' },
      { id: 'quote', type: 'text', x: 40, y: 440, width: 320, content: '“Bạn thân là người hiểu ta ngay cả khi ta chưa nói nửa lời.”', fontSize: 18, fontFamily: 'Montserrat', color: '#E0F2F1', textAlign: 'center', fontWeight: '300' }
    ]
  },
  {
    id: 'pt-minimal-focus',
    name: 'Tối Giản',
    thumbnail: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=200&h=300&fit=crop',
    elements: [
      { id: 'main-img', type: 'image', x: 40, y: 80, width: 320, height: 320, src: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85', objectFit: 'cover' },
      { id: 'title', type: 'text', x: 40, y: 430, width: 320, content: 'Tĩnh Lặng', fontSize: 24, fontFamily: 'Inter', letterSpacing: 10, textAlign: 'center' }
    ]
  }
];

// Helper function
function adjustBrightness(color: string, percent: number): string {
  if (color.startsWith('rgba')) return color;
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
