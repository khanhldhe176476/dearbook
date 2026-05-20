import { BookPage } from '../App';

export interface CoverTemplate {
  id: string;
  name: string;
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  thumbnail: string;
  cover: BookPage;
  style: 'modern' | 'classic' | 'elegant' | 'playful' | 'minimal';
}

// Helper function to create premium cover designs
function createPremiumCover(
  theme: 'love' | 'family' | 'birthday' | 'friendship',
  title: string,
  subtitle: string,
  backgroundImage: string,
  style: 'modern' | 'classic' | 'elegant' | 'playful' | 'minimal' = 'modern'
): BookPage {
  const themeColors = {
    love: { 
      primary: '#FF1493',
      secondary: '#FF69B4',
      gradient: 'linear-gradient(135deg, rgba(255, 20, 147, 0.9) 0%, rgba(255, 105, 180, 0.8) 100%)',
      label: 'LOVE STORY'
    },
    family: { 
      primary: '#3B82F6',
      secondary: '#60A5FA',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(96, 165, 250, 0.8) 100%)',
      label: 'FAMILY MOMENTS'
    },
    birthday: { 
      primary: '#A855F7',
      secondary: '#C084FC',
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(192, 132, 252, 0.8) 100%)',
      label: 'BIRTHDAY CELEBRATION'
    },
    friendship: { 
      primary: '#F59E0B',
      secondary: '#FBBF24',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(251, 191, 36, 0.8) 100%)',
      label: 'FRIENDSHIP'
    }
  };

  const config = themeColors[theme];

  if (style === 'minimal') {
    return {
      id: 'cover',
      backgroundColor: '#FFFFFF',
      elements: [
        // Simple border frame
        {
          id: 'cover-frame',
          type: 'shape',
          shape: 'rectangle',
          fill: 'transparent',
          stroke: config.primary,
          strokeWidth: 4,
          x: 40,
          y: 40,
          width: 420,
          height: 620,
          zIndex: 1,
          opacity: 1,
          rotation: 0,
          locked: false,
          visible: true,
        },
        // Title
        {
          id: 'cover-title',
          type: 'text',
          content: title,
          x: 60,
          y: 250,
          width: 380,
          height: 120,
          fontFamily: 'Playfair Display',
          fontSize: 48,
          fontWeight: 'bold',
          color: config.primary,
          textAlign: 'center',
          lineHeight: 1.2,
          zIndex: 2,
          opacity: 1,
          rotation: 0,
          locked: false,
          visible: true,
          fontStyle: 'normal',
          letterSpacing: 1,
          textDecoration: 'none',
        },
        // Subtitle
        {
          id: 'cover-subtitle',
          type: 'text',
          content: subtitle,
          x: 60,
          y: 390,
          width: 380,
          height: 40,
          fontFamily: 'Poppins',
          fontSize: 18,
          fontWeight: 'normal',
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 1.5,
          zIndex: 2,
          opacity: 1,
          rotation: 0,
          locked: false,
          visible: true,
          fontStyle: 'normal',
          letterSpacing: 0,
          textDecoration: 'none',
        },
        // DearBook brand
        {
          id: 'cover-brand',
          type: 'text',
          content: 'DearMemories',
          x: 60,
          y: 600,
          width: 380,
          height: 40,
          fontFamily: 'Dancing Script',
          fontSize: 24,
          fontWeight: 'bold',
          color: config.secondary,
          textAlign: 'center',
          zIndex: 2,
          opacity: 0.8,
          rotation: 0,
          locked: false,
          visible: true,
          fontStyle: 'normal',
          letterSpacing: 0,
          textDecoration: 'none',
        }
      ]
    };
  }

  if (style === 'elegant') {
    return {
      id: 'cover',
      backgroundColor: '#F8F7F4',
      elements: [
        // Elegant decorative corner top-left
        {
          id: 'corner-tl',
          type: 'text',
          content: '✦',
          x: 50,
          y: 50,
          width: 40,
          height: 40,
          fontSize: 32,
          color: config.primary,
          textAlign: 'center',
          zIndex: 1,
          opacity: 0.6,
          rotation: 0,
          locked: false,
          visible: true,
        },
        // Elegant decorative corner top-right
        {
          id: 'corner-tr',
          type: 'text',
          content: '✦',
          x: 410,
          y: 50,
          width: 40,
          height: 40,
          fontSize: 32,
          color: config.primary,
          textAlign: 'center',
          zIndex: 1,
          opacity: 0.6,
          rotation: 0,
          locked: false,
          visible: true,
        },
        // Elegant decorative corner bottom-left
        {
          id: 'corner-bl',
          type: 'text',
          content: '✦',
          x: 50,
          y: 610,
          width: 40,
          height: 40,
          fontSize: 32,
          color: config.primary,
          textAlign: 'center',
          zIndex: 1,
          opacity: 0.6,
          rotation: 0,
          locked: false,
          visible: true,
        },
        // Elegant decorative corner bottom-right
        {
          id: 'corner-br',
          type: 'text',
          content: '✦',
          x: 410,
          y: 610,
          width: 40,
          height: 40,
          fontSize: 32,
          color: config.primary,
          textAlign: 'center',
          zIndex: 1,
          opacity: 0.6,
          rotation: 0,
          locked: false,
          visible: true,
        },
        // Center decorative element
        {
          id: 'center-decor',
          type: 'text',
          content: '❧',
          x: 230,
          y: 180,
          width: 40,
          height: 40,
          fontSize: 36,
          color: config.primary,
          textAlign: 'center',
          zIndex: 2,
          opacity: 1,
          rotation: 0,
          locked: false,
          visible: true,
        },
        // Title
        {
          id: 'cover-title',
          type: 'text',
          content: title,
          x: 60,
          y: 270,
          width: 380,
          height: 100,
          fontFamily: 'Playfair Display',
          fontSize: 42,
          fontWeight: 'bold',
          color: '#1F2937',
          textAlign: 'center',
          lineHeight: 1.3,
          zIndex: 3,
          opacity: 1,
          rotation: 0,
          locked: false,
          visible: true,
          fontStyle: 'normal',
          letterSpacing: 1,
          textDecoration: 'none',
        },
        // Subtitle
        {
          id: 'cover-subtitle',
          type: 'text',
          content: subtitle,
          x: 80,
          y: 400,
          width: 340,
          height: 60,
          fontFamily: 'Poppins',
          fontSize: 16,
          fontWeight: 'normal',
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 1.6,
          fontStyle: 'italic',
          zIndex: 3,
          opacity: 1,
          rotation: 0,
          locked: false,
          visible: true,
          letterSpacing: 0.5,
          textDecoration: 'none',
        },
        // Bottom decorative line
        {
          id: 'bottom-decor',
          type: 'text',
          content: '━',
          x: 200,
          y: 520,
          width: 100,
          height: 30,
          fontSize: 24,
          color: config.primary,
          textAlign: 'center',
          zIndex: 2,
          opacity: 0.5,
          rotation: 0,
          locked: false,
          visible: true,
        },
        // DearBook brand
        {
          id: 'cover-brand',
          type: 'text',
          content: 'DearMemories',
          x: 60,
          y: 580,
          width: 380,
          height: 40,
          fontFamily: 'Dancing Script',
          fontSize: 20,
          fontWeight: 'normal',
          color: config.secondary,
          textAlign: 'center',
          zIndex: 3,
          opacity: 0.7,
          rotation: 0,
          locked: false,
          visible: true,
          fontStyle: 'normal',
          letterSpacing: 0,
          textDecoration: 'none',
        }
      ]
    };
  }

  // Modern style with background image (default)
  return {
    id: 'cover',
    backgroundColor: '#FFFFFF',
    backgroundImage,
    elements: [
      // Dark gradient overlay
      {
        id: 'cover-overlay',
        type: 'shape',
        shape: 'rectangle',
        fill: config.gradient,
        x: 0,
        y: 0,
        width: 500,
        height: 700,
        zIndex: 1,
        opacity: 1,
        rotation: 0,
        locked: false,
        visible: true,
      },
      // Top label badge
      {
        id: 'cover-badge-bg',
        type: 'shape',
        shape: 'rectangle',
        fill: 'rgba(255, 255, 255, 0.25)',
        x: 40,
        y: 50,
        width: 180,
        height: 40,
        borderRadius: 20,
        zIndex: 2,
        opacity: 1,
        rotation: 0,
        locked: false,
        visible: true,
      },
      {
        id: 'cover-badge-text',
        type: 'text',
        content: config.label,
        x: 40,
        y: 58,
        width: 180,
        height: 40,
        fontFamily: 'Poppins',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 3,
        opacity: 1,
        rotation: 0,
        locked: false,
        visible: true,
        fontStyle: 'normal',
        textDecoration: 'none',
        lineHeight: 1.2,
      },
      // Main title
      {
        id: 'cover-title',
        type: 'text',
        content: title,
        x: 40,
        y: 350,
        width: 420,
        height: 140,
        fontFamily: 'Dancing Script',
        fontSize: 56,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 1.2,
        zIndex: 4,
        opacity: 1,
        rotation: 0,
        locked: false,
        visible: true,
        fontStyle: 'normal',
        letterSpacing: 0,
        textDecoration: 'none',
      },
      // Subtitle
      {
        id: 'cover-subtitle',
        type: 'text',
        content: subtitle,
        x: 60,
        y: 510,
        width: 380,
        height: 50,
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: 'normal',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 1.5,
        zIndex: 4,
        opacity: 0.95,
        rotation: 0,
        locked: false,
        visible: true,
        fontStyle: 'normal',
        letterSpacing: 0,
        textDecoration: 'none',
      },
      // Bottom brand strip
      {
        id: 'cover-brand-strip',
        type: 'shape',
        shape: 'rectangle',
        fill: 'rgba(255, 255, 255, 0.15)',
        x: 0,
        y: 630,
        width: 500,
        height: 70,
        zIndex: 5,
        opacity: 1,
        rotation: 0,
        locked: false,
        visible: true,
      },
      {
        id: 'cover-brand',
        type: 'text',
        content: 'DearMemories',
        x: 40,
        y: 645,
        width: 200,
        height: 40,
        fontFamily: 'Dancing Script',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'left',
        zIndex: 6,
        opacity: 1,
        rotation: 0,
        locked: false,
        visible: true,
        fontStyle: 'normal',
        letterSpacing: 0,
        textDecoration: 'none',
        lineHeight: 1.2,
      },
      {
        id: 'cover-year',
        type: 'text',
        content: new Date().getFullYear().toString(),
        x: 340,
        y: 650,
        width: 120,
        height: 30,
        fontFamily: 'Poppins',
        fontSize: 16,
        fontWeight: 'normal',
        color: '#FFFFFF',
        textAlign: 'right',
        zIndex: 6,
        opacity: 0.8,
        rotation: 0,
        locked: false,
        visible: true,
        fontStyle: 'normal',
        letterSpacing: 0,
        textDecoration: 'none',
        lineHeight: 1.2,
      }
    ]
  };
}

export const coverTemplates: CoverTemplate[] = [
  // ========== LOVE COVERS ==========
  {
    id: 'love-modern-1',
    name: 'Tình yêu lãng mạn',
    theme: 'love',
    style: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1620455970942-5fca5840d5ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=500',
    cover: createPremiumCover(
      'love',
      'Câu Chuyện Tình Yêu Của Chúng Ta',
      'Khoảnh khắc đẹp nhất bên em',
      'https://images.unsplash.com/photo-1620455970942-5fca5840d5ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&h=1200',
      'modern'
    )
  },
  {
    id: 'love-elegant-1',
    name: 'Tình yêu thanh lịch',
    theme: 'love',
    style: 'elegant',
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop',
    cover: createPremiumCover(
      'love',
      'Trọn Đời Bên Em',
      'Tình yêu là hành trình đẹp nhất',
      '',
      'elegant'
    )
  },
  {
    id: 'love-minimal-1',
    name: 'Tình yêu tối giản',
    theme: 'love',
    style: 'minimal',
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=500&fit=crop',
    cover: createPremiumCover(
      'love',
      'Yêu Em',
      'Đơn giản nhưng chân thành',
      '',
      'minimal'
    )
  },

  // ========== FAMILY COVERS ==========
  {
    id: 'family-modern-1',
    name: 'Gia đình hạnh phúc',
    theme: 'family',
    style: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1624448445915-97154f5e688c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=500',
    cover: createPremiumCover(
      'family',
      'Gia Đình Tôi',
      'Nơi tình yêu thương bắt đầu',
      'https://images.unsplash.com/photo-1624448445915-97154f5e688c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&h=1200',
      'modern'
    )
  },
  {
    id: 'family-elegant-1',
    name: 'Gia đình thanh lịch',
    theme: 'family',
    style: 'elegant',
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=500&fit=crop',
    cover: createPremiumCover(
      'family',
      'Kỷ Niệm Gia Đình',
      'Những khoảnh khắc đáng nhớ',
      '',
      'elegant'
    )
  },
  {
    id: 'family-minimal-1',
    name: 'Gia đình tối giản',
    theme: 'family',
    style: 'minimal',
    thumbnail: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=500&fit=crop',
    cover: createPremiumCover(
      'family',
      'Tình Thân',
      'Luôn bên nhau',
      '',
      'minimal'
    )
  },

  // ========== BIRTHDAY COVERS ==========
  {
    id: 'birthday-modern-1',
    name: 'Sinh nhật rực rỡ',
    theme: 'birthday',
    style: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1715281007002-0c6951203c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=500',
    cover: createPremiumCover(
      'birthday',
      'Chúc Mừng Sinh Nhật',
      'Một năm tuổi mới tuyệt vời',
      'https://images.unsplash.com/photo-1715281007002-0c6951203c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&h=1200',
      'modern'
    )
  },
  {
    id: 'birthday-playful-1',
    name: 'Sinh nhật vui nhộn',
    theme: 'birthday',
    style: 'elegant',
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=500&fit=crop',
    cover: createPremiumCover(
      'birthday',
      'Happy Birthday',
      'Một ngày đặc biệt dành cho bạn',
      '',
      'elegant'
    )
  },
  {
    id: 'birthday-minimal-1',
    name: 'Sinh nhật tối giản',
    theme: 'birthday',
    style: 'minimal',
    thumbnail: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=500&fit=crop',
    cover: createPremiumCover(
      'birthday',
      'Sinh Nhật Vui Vẻ',
      'Chúc bạn thật nhiều niềm vui',
      '',
      'minimal'
    )
  },

  // ========== FRIENDSHIP COVERS ==========
  {
    id: 'friendship-modern-1',
    name: 'Tình bạn phiêu lưu',
    theme: 'friendship',
    style: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=500',
    cover: createPremiumCover(
      'friendship',
      'Bạn Thân Của Tôi',
      'Những kỷ niệm không thể quên',
      'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&h=1200',
      'modern'
    )
  },
  {
    id: 'friendship-elegant-1',
    name: 'Tình bạn thanh lịch',
    theme: 'friendship',
    style: 'elegant',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop',
    cover: createPremiumCover(
      'friendship',
      'Tình Bạn Đẹp',
      'Cùng nhau trên mọi nẻo đường',
      '',
      'elegant'
    )
  },
  {
    id: 'friendship-minimal-1',
    name: 'Tình bạn tối giản',
    theme: 'friendship',
    style: 'minimal',
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=500&fit=crop',
    cover: createPremiumCover(
      'friendship',
      'Bạn Bè',
      'Luôn ở bên nhau',
      '',
      'minimal'
    )
  },
];

// Helper function to get covers by theme
export function getCoversByTheme(theme: 'love' | 'family' | 'birthday' | 'friendship'): CoverTemplate[] {
  return coverTemplates.filter(cover => cover.theme === theme);
}

// Helper function to get cover by ID
export function getCoverById(id: string): CoverTemplate | undefined {
  return coverTemplates.find(cover => cover.id === id);
}
