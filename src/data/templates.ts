import { BookPage } from '../App';
import { romanticLoveTemplate } from './romanticLoveTemplate';
import { youthArchiveTemplate } from './youthArchiveTemplate';

// Template definitions with real images
export interface Template {
  id: string;
  name: string;
  theme: 'family' | 'friendship' | 'love' | 'birthday';
  thumbnail: string;
  cover: BookPage;
  pages: BookPage[];
  badge?: 'new' | 'bestseller' | 'popular';
}

// Helper function to create magazine-style cover
function createMagazineCover(
  theme: 'family' | 'friendship' | 'love' | 'birthday',
  title: string,
  subtitle: string,
  mainImage: string,
  decorImage?: string
): BookPage {
  const themeColors = {
    love: { primary: 'rgba(255,192,203,0.9)', label: 'LOVE STORY' },
    family: { primary: 'rgba(96,165,250,0.9)', label: 'FAMILY' },
    birthday: { primary: 'rgba(196,181,253,0.9)', label: 'CELEBRATION' },
    friendship: { primary: 'rgba(252,211,77,0.9)', label: 'FRIENDSHIP' }
  };
  
  const config = themeColors[theme];
  
  return {
    id: 'cover',
    backgroundColor: '#ffffff',
    backgroundImage: mainImage,
    elements: [
      // Dark overlay for better text visibility
      {
        id: 'cover-overlay',
        type: 'shape',
        fill: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
        x: 0,
        y: 0,
        width: 500,
        height: 700,
        zIndex: 1
      },
      // Decorative accent image (if provided)
      ...(decorImage ? [{
        id: 'cover-decor',
        type: 'image',
        src: decorImage,
        x: 320,
        y: 30,
        width: 150,
        height: 150,
        objectFit: 'cover',
        borderRadius: 75,
        opacity: 0.7,
        zIndex: 2
      } as any,
      {
        id: 'cover-decor-frame',
        type: 'shape',
        fill: 'transparent',
        stroke: 'rgba(255,255,255,0.5)',
        strokeWidth: 3,
        x: 320,
        y: 30,
        width: 150,
        height: 150,
        borderRadius: 75,
        zIndex: 3
      }] : []),
      // Top label
      {
        id: 'cover-label',
        type: 'shape',
        fill: config.primary,
        x: 30,
        y: 40,
        width: 160,
        height: 35,
        borderRadius: 20,
        zIndex: 4
      },
      {
        id: 'cover-label-text',
        type: 'text',
        content: config.label,
        x: 30,
        y: 48,
        width: 160,
        height: 35,
        fontFamily: 'Poppins',
        fontSize: 13,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 5
      },
      // Main title
      {
        id: 'cover-title',
        type: 'text',
        content: title,
        x: 30,
        y: 380,
        width: 440,
        height: 150,
        fontFamily: 'Dancing Script',
        fontSize: 52,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        rotation: 0,
        opacity: 1,
        zIndex: 6,
        lineHeight: 1.2
      },
      // Subtitle
      {
        id: 'cover-subtitle',
        type: 'text',
        content: subtitle,
        x: 30,
        y: 540,
        width: 440,
        height: 40,
        fontFamily: 'Poppins',
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        rotation: 0,
        opacity: 0.95,
        zIndex: 6
      },
      // Bottom brand strip
      {
        id: 'cover-brand-strip',
        type: 'shape',
        fill: 'rgba(255,255,255,0.15)',
        x: 0,
        y: 640,
        width: 500,
        height: 60,
        zIndex: 7
      },
      {
        id: 'cover-brand',
        type: 'text',
        content: 'DearMemories',
        x: 30,
        y: 650,
        width: 200,
        height: 40,
        fontFamily: 'Dancing Script',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'left',
        zIndex: 8
      },
      {
        id: 'cover-date',
        type: 'text',
        content: new Date().getFullYear().toString(),
        x: 350,
        y: 655,
        width: 120,
        height: 30,
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'right',
        opacity: 0.8,
        zIndex: 8
      }
    ]
  };
}

export const templates: Template[] = [
  // ========== FAMILY TEMPLATES (6) ==========
  {
    id: 'family-1',
    name: 'Lời cảm ơn gia đình',
    theme: 'family',
    badge: 'bestseller',
    thumbnail: 'https://images.unsplash.com/photo-1729291638795-7a23d54ddaa5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Món Quà Dành Cho Gia Đình',
      '👨‍👩‍👧 Yêu thương & Gắn kết',
      'https://images.unsplash.com/photo-1729291638795-7a23d54ddaa5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      // Page 1: Opening message
      {
        id: 'page-1',
        backgroundColor: '#fff8f0',
        backgroundImage: 'https://images.unsplash.com/photo-1767082237316-8c6d45b2bc7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Lời nhắn gửi',
            x: 50,
            y: 80,
            width: 700,
            height: 80,
            fontSize: 48,
            fontFamily: 'Playfair Display',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
          },
          {
            id: '2',
            type: 'sticker',
            content: '❤️',
            x: 350,
            y: 200,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Cảm ơn ba mẹ đã luôn bên cạnh, yêu thương và chăm sóc con. Những kỷ niệm cùng gia đình là món quà quý giá nhất trong cuộc đời con.',
            x: 80,
            y: 400,
            width: 640,
            height: 180,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: 'normal',
            textAlign: 'center',
            textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
          }
        ]
      },
      // Page 2: Family photo with caption
      {
        id: 'page-2',
        backgroundColor: '#ffffff',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Khoảnh khắc bên nhau',
            x: 50,
            y: 50,
            width: 700,
            height: 70,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#f97316',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1766818438048-1a17ded5dea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 100,
            y: 160,
            width: 600,
            height: 400
          },
          {
            id: '3',
            type: 'text',
            content: 'Hạnh phúc là được sum họp bên gia đình, nơi luôn có tình yêu thương và sự ấm áp.',
            x: 80,
            y: 620,
            width: 640,
            height: 100,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#6b7280',
            fontWeight: 'normal',
            textAlign: 'center',
            fontStyle: 'italic'
          }
        ]
      },
      // Page 3: Thank you Mom
      {
        id: 'page-3',
        backgroundColor: '#fff1f2',
        backgroundImage: 'https://images.unsplash.com/photo-1621265845825-b261b2aa439f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Cảm ơn mẹ',
            x: 50,
            y: 100,
            width: 700,
            height: 90,
            fontSize: 56,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Mẹ là người phụ nữ đầu tiên con yêu, là người hùng hậu và vĩ đại nhất trong cuộc đời con. Cảm ơn mẹ vì tất cả!',
            x: 80,
            y: 540,
            width: 640,
            height: 140,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: '500',
            textAlign: 'center'
          }
        ]
      },
      // Page 4: Family dinner
      {
        id: 'page-4',
        backgroundColor: '#fff7ed',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Bữa cơm gia đình',
            x: 50,
            y: 50,
            width: 700,
            height: 70,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#ea580c',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1637277040662-7261512caed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 100,
            y: 160,
            width: 600,
            height: 350
          },
          {
            id: '3',
            type: 'text',
            content: 'Món ăn ngon nhất không phải ở nhà hàng 5 sao, mà là bữa cơm ấm cúng quây quần bên gia đình.',
            x: 80,
            y: 580,
            width: 640,
            height: 140,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 5: Lessons learned
      {
        id: 'page-5',
        backgroundColor: '#fef3c7',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Những bài học từ gia đình',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 38,
            fontFamily: 'Playfair Display',
            color: '#f97316',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: 'img-1',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1628676348963-f88c671333f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 520,
            y: 180,
            width: 220,
            height: 320
          },
          {
            id: '2',
            type: 'text',
            content: '1. Luôn yêu thương và tôn trọng nhau',
            x: 60,
            y: 200,
            width: 420,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '3',
            type: 'text',
            content: '2. Gia đình là nơi ta có thể là chính mình',
            x: 60,
            y: 280,
            width: 420,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '4',
            type: 'text',
            content: '3. Hãy dành thời gian cho người thân',
            x: 60,
            y: 360,
            width: 420,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '5',
            type: 'text',
            content: '4. Chia sẻ cả vui lẫn buồn',
            x: 60,
            y: 440,
            width: 420,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '6',
            type: 'text',
            content: '5. Luôn ở bên nhau mọi lúc',
            x: 60,
            y: 520,
            width: 420,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          }
        ]
      },
      // Page 6: Promise to family
      {
        id: 'page-6',
        backgroundColor: '#fff8f0',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Lời hứa của con',
            x: 50,
            y: 150,
            width: 700,
            height: 90,
            fontSize: 52,
            fontFamily: 'Dancing Script',
            color: '#f97316',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '🏠',
            x: 350,
            y: 60,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Con hứa sẽ luôn là người con ngoan, yêu thương và quan tâm đến gia đình. Con sẽ cố gắng để làm ba mẹ tự hào.',
            x: 80,
            y: 350,
            width: 640,
            height: 180,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '500',
            textAlign: 'center'
          },
          {
            id: '4',
            type: 'text',
            content: 'Yêu ba mẹ nhiều lắm! ❤️',
            x: 50,
            y: 620,
            width: 700,
            height: 70,
            fontSize: 32,
            fontFamily: 'Dancing Script',
            color: '#f97316',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'family-2',
    name: 'Bữa cơm gia đình',
    theme: 'family',
    badge: 'popular',
    thumbnail: 'https://images.unsplash.com/photo-1766808982983-a2f7cdbe58d9?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Bữa Cơm Gia Đình',
      '👨‍👩‍👧 Nơi tình thân gắn kết',
      'https://images.unsplash.com/photo-1766808982983-a2f7cdbe58d9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fff7ed',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Hương vị nhà',
            x: 50,
            y: 60,
            width: 700,
            height: 70,
            fontSize: 38,
            fontFamily: 'Playfair Display',
            color: '#ea580c',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Món ăn ngon nhất không phải ở nhà hàng, mà là bữa cơm ấm cúng bên gia đình yêu thương.',
            x: 80,
            y: 200,
            width: 640,
            height: 180,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'family-3',
    name: 'Mẹ và con',
    theme: 'family',
    badge: 'new',
    thumbnail: 'https://images.unsplash.com/photo-1729291638795-7a23d54ddaa5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Tình Mẫu Tử',
      '🌸 Yêu thương vô bờ bến',
      'https://images.unsplash.com/photo-1729291638795-7a23d54ddaa5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fef3c7',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Cảm ơn mẹ',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 44,
            fontFamily: 'Playfair Display',
            color: '#fb923c',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Mẹ là người phụ nữ đầu tiên con yêu, là tấm gương sáng mà con luôn ngưỡng mộ. Cảm ơn mẹ vì tất cả.',
            x: 80,
            y: 250,
            width: 640,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'family-4',
    name: 'Kỳ nghỉ gia đình',
    theme: 'family',
    thumbnail: 'https://images.unsplash.com/photo-1766808982983-a2f7cdbe58d9?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Kỳ Nghỉ Cùng Nhau',
      '👨‍👩‍👧 Những chuyến đi đáng nhớ',
      'https://images.unsplash.com/photo-1766808982983-a2f7cdbe58d9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#e0f2fe',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Khoảnh khắc hạnh phúc',
            x: 50,
            y: 50,
            width: 700,
            height: 70,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#0ea5e9',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Mỗi chuyến đi là cơ hội để gia đình gần nhau hơn, hiểu nhau hơn và yêu thương nhau nhiều hơn.',
            x: 80,
            y: 250,
            width: 640,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'family-5',
    name: 'Ông bà và cháu',
    theme: 'family',
    thumbnail: 'https://images.unsplash.com/photo-1729291638795-7a23d54ddaa5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Thế Hệ Kết Nối',
      '👨‍👩‍👧 Tình yêu thương bất tận',
      'https://images.unsplash.com/photo-1729291638795-7a23d54ddaa5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fef3c7',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Lời căn dặn của ông bà',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 38,
            fontFamily: 'Playfair Display',
            color: '#b45309',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Tình yêu của ông bà dành cho cháu là món quà vô giá, là nguồn động lực để cháu trưởng thành.',
            x: 80,
            y: 250,
            width: 640,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'family-6',
    name: 'Tuổi thơ hồng',
    theme: 'family',
    thumbnail: 'https://images.unsplash.com/photo-1766808982983-a2f7cdbe58d9?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Tuổi Thơ Hồng',
      '🎈 Kỷ niệm thời thơ ấu',
      'https://images.unsplash.com/photo-1766808982983-a2f7cdbe58d9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fef9c3',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Ký ức tuổi thơ',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#f59e0b',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Tuổi thơ là khoảng thời gian đẹp nhất, nơi có tình yêu thương của gia đình và những kỷ niệm không thể nào quên.',
            x: 80,
            y: 250,
            width: 640,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  // ========== FRIENDS TEMPLATES (6) ==========
  {
    id: 'friends-1',
    name: 'Chuyến đi cùng bạn',
    theme: 'friendship',
    badge: 'popular',
    thumbnail: 'https://images.unsplash.com/photo-1583609042814-8a30efe7a9d5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Chuyến Đi Cùng Bạn',
      '🤝 Những kỷ niệm không thể quên',
      'https://images.unsplash.com/photo-1583609042814-8a30efe7a9d5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      // Page 1: Adventure begins
      {
        id: 'page-1',
        backgroundColor: '#ede9fe',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Cùng nhau khám phá',
            x: 50,
            y: 80,
            width: 700,
            height: 80,
            fontSize: 44,
            fontFamily: 'Playfair Display',
            color: '#6366f1',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '✈️',
            x: 350,
            y: 190,
            width: 100,
            height: 100
          },
          {
            id: 'img-friends-travel',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1761472084994-61d80b8f4053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 450,
            y: 320,
            width: 280,
            height: 350
          },
          {
            id: '3',
            type: 'text',
            content: 'Mỗi chuyến đi với bạn bè là một cuộc phiêu lưu đầy thú vị, nơi chúng ta cùng nhau tạo nên những kỷ niệm không thể quên.',
            x: 60,
            y: 380,
            width: 360,
            height: 180,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 2: Adventure photo
      {
        id: 'page-2',
        backgroundColor: '#ffffff',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Những con đường ta đi cùng nhau',
            x: 50,
            y: 50,
            width: 700,
            height: 70,
            fontSize: 36,
            fontFamily: 'Playfair Display',
            color: '#6366f1',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1638644074459-9067407b72a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 100,
            y: 160,
            width: 600,
            height: 400
          },
          {
            id: '3',
            type: 'text',
            content: 'Không phải điểm đến, mà chính là hành trình cùng nhau mới tạo nên ý nghĩa.',
            x: 80,
            y: 620,
            width: 640,
            height: 100,
            fontSize: 19,
            fontFamily: 'Poppins',
            color: '#6b7280',
            fontWeight: 'normal',
            textAlign: 'center',
            fontStyle: 'italic'
          }
        ]
      },
      // Page 3: Beach memories
      {
        id: 'page-3',
        backgroundColor: '#dbeafe',
        backgroundImage: 'https://images.unsplash.com/photo-1594739999245-97c7decb306c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Hoàng hôn bên bạn',
            x: 50,
            y: 100,
            width: 700,
            height: 90,
            fontSize: 54,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Những khoảnh khắc đẹp nhất là khi ta được ở bên những người ta yêu thương.',
            x: 80,
            y: 560,
            width: 640,
            height: 120,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: '500',
            textAlign: 'center'
          }
        ]
      },
      // Page 4: Laughing memories
      {
        id: 'page-4',
        backgroundColor: '#fef3c7',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Cười không ngừng',
            x: 50,
            y: 50,
            width: 700,
            height: 70,
            fontSize: 46,
            fontFamily: 'Playfair Display',
            color: '#f59e0b',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1625283518288-00362afc8663?w=600&h=350&fit=crop',
            x: 100,
            y: 160,
            width: 600,
            height: 350
          },
          {
            id: '3',
            type: 'text',
            content: 'Tiếng cười của chúng ta là âm nhạc đẹp nhất, là liều thuốc chữa lành mọi buồn phiền.',
            x: 80,
            y: 580,
            width: 640,
            height: 140,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 5: Things we love
      {
        id: 'page-5',
        backgroundColor: '#f5f3ff',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Những điều mình thích làm cùng nhau',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 34,
            fontFamily: 'Playfair Display',
            color: '#8b5cf6',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: '🎮 Chơi game đến tận sáng',
            x: 100,
            y: 200,
            width: 600,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '3',
            type: 'text',
            content: '🍕 Đi ăn khắp nơi',
            x: 100,
            y: 280,
            width: 600,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '4',
            type: 'text',
            content: '📸 Chụp ảnh "sống ảo"',
            x: 100,
            y: 360,
            width: 600,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '5',
            type: 'text',
            content: '🎬 Xem phim và bàn luận',
            x: 100,
            y: 440,
            width: 600,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '6',
            type: 'text',
            content: '💬 Tâm sự đến tận đêm khuya',
            x: 100,
            y: 520,
            width: 600,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          }
        ]
      },
      // Page 6: Forever friends
      {
        id: 'page-6',
        backgroundColor: '#ede9fe',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Bạn mãi mãi',
            x: 50,
            y: 180,
            width: 700,
            height: 90,
            fontSize: 60,
            fontFamily: 'Dancing Script',
            color: '#6366f1',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '🤝',
            x: 350,
            y: 80,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Dù thời gian có trôi, dù cuộc sống có thay đổi, tình bạn của chúng ta sẽ mãi mãi không phai.',
            x: 80,
            y: 380,
            width: 640,
            height: 160,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '500',
            textAlign: 'center'
          },
          {
            id: '4',
            type: 'text',
            content: 'Love you guys! 💙',
            x: 50,
            y: 640,
            width: 700,
            height: 70,
            fontSize: 32,
            fontFamily: 'Dancing Script',
            color: '#6366f1',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'friends-2',
    name: 'Cười cùng bạn',
    theme: 'friendship',
    badge: 'bestseller',
    thumbnail: 'https://images.unsplash.com/photo-1581812380447-5544e1a1f20d?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Cười Không Ngừng',
      '😄 Niềm vui cùng bạn bè',
      'https://images.unsplash.com/photo-1581812380447-5544e1a1f20d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fef3c7',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Tiếng cười sảng khoái',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 38,
            fontFamily: 'Playfair Display',
            color: '#f59e0b',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: 'img-friends-fun',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1735958748724-a1c3a643d3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 100,
            y: 180,
            width: 600,
            height: 400
          },
          {
            id: '2',
            type: 'text',
            content: 'Những lúc cười đùa với bạn bè là những khoảnh khắc hạnh phúc nhất trong cuộc sống của mình.',
            x: 80,
            y: 620,
            width: 640,
            height: 120,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'friends-3',
    name: 'Tình bạn mãi mãi',
    theme: 'friendship',
    badge: 'new',
    thumbnail: 'https://images.unsplash.com/photo-1583609042814-8a30efe7a9d5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Tình Bạn Mãi Mãi',
      '🤝 Bền chặt theo năm tháng',
      'https://images.unsplash.com/photo-1583609042814-8a30efe7a9d5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#d1fae5',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Bên nhau mọi lúc',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#10b981',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Tình bạn đích thực không đo bằng thời gian, mà đo bằng tình cảm và sự thấu hiểu lẫn nhau.',
            x: 80,
            y: 250,
            width: 640,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'friends-4',
    name: 'Du lịch cùng hội',
    theme: 'friendship',
    thumbnail: 'https://images.unsplash.com/photo-1581812380447-5544e1a1f20d?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Hành Trình Cùng Hội',
      '🤝 Khám phá thế giới bên nhau',
      'https://images.unsplash.com/photo-1581812380447-5544e1a1f20d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#cffafe',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Những con đường',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#0891b2',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Đi cùng bạn bè là cách tốt nhất để khám phá thế giới và tạo ra những kỷ niệm không thể phai mờ.',
            x: 80,
            y: 250,
            width: 640,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'friends-5',
    name: 'Sinh nhật bạn thân',
    theme: 'friendship',
    thumbnail: 'https://images.unsplash.com/photo-1583609042814-8a30efe7a9d5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Happy Birthday!',
      '🎉 Chúc mừng bạn thân',
      'https://images.unsplash.com/photo-1583609042814-8a30efe7a9d5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fce7f3',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Chúc mừng sinh nhật!',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Chúc bạn một tuổi mới tràn đầy niềm vui, hạnh phúc và thành công. Cảm ơn vì đã là người bạn tuyệt vời!',
            x: 80,
            y: 250,
            width: 640,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'friends-6',
    name: 'Những ngày học',
    theme: 'friendship',
    thumbnail: 'https://images.unsplash.com/photo-1581812380447-5544e1a1f20d?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Thời Học Sinh',
      '🤝 Kỷ niệm không phai',
      'https://images.unsplash.com/photo-1581812380447-5544e1a1f20d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#f5f3ff',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Ký ức ngày xưa',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#8b5cf6',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Thời học sinh là khoảng thời gian đẹp nhất, nơi ta gặp được những người bạn chân thành và tạo nên biết bao kỷ niệm.',
            x: 80,
            y: 250,
            width: 640,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  // ========== LOVE TEMPLATES (6) ==========
  {
    id: 'love-1',
    name: 'Câu chuyện tình yêu',
    theme: 'love',
    badge: 'bestseller',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Our Love Story',
      '💕 Dành tặng người em yêu',
      'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1767986012138-d02276728368?w=300&h=300&fit=crop'
    ),
    pages: [
      // Page 1: Full image with text overlay
      {
        id: 'page-1',
        backgroundColor: '#fff1f2',
        backgroundImage: 'https://images.unsplash.com/photo-1506014299253-3725319c0f69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Ngày đầu tiên',
            x: 50,
            y: 80,
            width: 700,
            height: 90,
            fontSize: 56,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Anh nhớ như in ngày đầu tiên gặp em. Ánh mắt em, nụ cười em đã làm anh rung động không thể tả.',
            x: 80,
            y: 560,
            width: 640,
            height: 120,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 2: Split layout - text left, quote style
      {
        id: 'page-2',
        backgroundColor: '#fef2f2',
        elements: [
          {
            id: '1',
            type: 'text',
            content: '"Anh yêu em"',
            x: 80,
            y: 180,
            width: 640,
            height: 150,
            fontSize: 64,
            fontFamily: 'Dancing Script',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '💕',
            x: 350,
            y: 80,
            width: 100,
            height: 100
          },
          {
            id: 'img-roses',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1669869608865-84bb10423f99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 280,
            y: 480,
            width: 200,
            height: 160
          },
          {
            id: '3',
            type: 'text',
            content: 'Anh yêu em không chỉ vì những gì em là, mà còn vì những gì anh trở thành khi ở bên em. Em làm anh muốn trở thành phiên bản tốt nhất của chính mình.',
            x: 60,
            y: 380,
            width: 420,
            height: 180,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 3: Image with caption
      {
        id: 'page-3',
        backgroundColor: '#ffffff',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Những khoảnh khắc bên nhau',
            x: 50,
            y: 50,
            width: 700,
            height: 70,
            fontSize: 38,
            fontFamily: 'Playfair Display',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 100,
            y: 160,
            width: 600,
            height: 400
          },
          {
            id: '3',
            type: 'text',
            content: 'Mỗi khoảnh khắc bên em đều là món quà quý giá nhất mà cuộc đời trao tặng anh.',
            x: 80,
            y: 620,
            width: 640,
            height: 100,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#6b7280',
            fontWeight: 'normal',
            textAlign: 'center',
            fontStyle: 'italic'
          }
        ]
      },
      // Page 4: Grid of images with text
      {
        id: 'page-4',
        backgroundColor: '#fff1f2',
        elements: [
          {
            id: '1',
            type: 'text',
            content: '100 lý do anh yêu em',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Dancing Script',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: '1. Nụ cười tươi của em',
            x: 80,
            y: 180,
            width: 640,
            height: 50,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '3',
            type: 'text',
            content: '2. Cách em quan tâm người khác',
            x: 80,
            y: 250,
            width: 640,
            height: 50,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '4',
            type: 'text',
            content: '3. Giọng nói ngọt ngào của em',
            x: 80,
            y: 320,
            width: 640,
            height: 50,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '5',
            type: 'text',
            content: '4. Em luôn lắng nghe anh',
            x: 80,
            y: 390,
            width: 640,
            height: 50,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'left'
          },
          {
            id: '6',
            type: 'text',
            content: '5. Và còn 95 lý do nữa...',
            x: 80,
            y: 460,
            width: 640,
            height: 50,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#ec4899',
            fontWeight: '600',
            textAlign: 'left',
            fontStyle: 'italic'
          }
        ]
      },
      // Page 5: Timeline style
      {
        id: 'page-5',
        backgroundColor: '#fef2f2',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Hành trình của chúng ta',
            x: 50,
            y: 50,
            width: 700,
            height: 70,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: '📅 Tháng 3, 2023',
            x: 100,
            y: 180,
            width: 600,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'left'
          },
          {
            id: '3',
            type: 'text',
            content: 'Lần đầu gặp nhau tại quán cà phê',
            x: 100,
            y: 240,
            width: 600,
            height: 60,
            fontSize: 18,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'left'
          },
          {
            id: '4',
            type: 'text',
            content: '💝 Tháng 5, 2023',
            x: 100,
            y: 340,
            width: 600,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'left'
          },
          {
            id: '5',
            type: 'text',
            content: 'Ngày anh tỏ tình với em',
            x: 100,
            y: 400,
            width: 600,
            height: 60,
            fontSize: 18,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'left'
          },
          {
            id: '6',
            type: 'text',
            content: '🎉 Tháng 12, 2023',
            x: 100,
            y: 500,
            width: 600,
            height: 50,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'left'
          },
          {
            id: '7',
            type: 'text',
            content: 'Kỷ niệm 1 năm yêu nhau',
            x: 100,
            y: 560,
            width: 600,
            height: 60,
            fontSize: 18,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'left'
          }
        ]
      },
      // Page 6: Promise page
      {
        id: 'page-6',
        backgroundColor: '#fff1f2',
        backgroundImage: 'https://images.unsplash.com/photo-1575388104683-e076ee9ccaa0?w=800&h=1000&fit=crop&blur=20',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Lời hứa của anh',
            x: 50,
            y: 100,
            width: 700,
            height: 90,
            fontSize: 52,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Anh hứa sẽ luôn yêu thương, che chở và bảo vệ em. Anh hứa sẽ là người bạn đồng hành đáng tin cậy nhất trong cuộc đời em.',
            x: 80,
            y: 400,
            width: 640,
            height: 160,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: '500',
            textAlign: 'center'
          },
          {
            id: '3',
            type: 'sticker',
            content: '💍',
            x: 350,
            y: 650,
            width: 100,
            height: 100
          },
          {
            id: '4',
            type: 'text',
            content: 'Mãi mãi bên nhau',
            x: 50,
            y: 600,
            width: 700,
            height: 60,
            fontSize: 28,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        ]
      },
      // Page 7: Thank you page
      {
        id: 'page-7',
        backgroundColor: '#fef2f2',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Cảm ơn em',
            x: 50,
            y: 200,
            width: 700,
            height: 100,
            fontSize: 64,
            fontFamily: 'Dancing Script',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '❤️',
            x: 350,
            y: 100,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Cảm ơn em đã đến bên anh, đã khiến cuộc sống của anh thêm ý nghĩa và tràn đầy hạnh phúc. Em là điều tuyệt vời nhất từng đến với anh.',
            x: 80,
            y: 380,
            width: 640,
            height: 200,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          },
          {
            id: '4',
            type: 'text',
            content: 'Yêu em nhiều lắm! 💕',
            x: 50,
            y: 650,
            width: 700,
            height: 70,
            fontSize: 32,
            fontFamily: 'Dancing Script',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'love-2',
    name: 'Kỷ niệm tình yêu',
    theme: 'love',
    badge: 'popular',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Kỷ Niệm Của Chúng Ta',
      '💕 Những khoảnh khắc ngọt ngào',
      'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1767986012138-d02276728368?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#ffe4e6',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Lời nhắn yêu thương',
            x: 80,
            y: 300,
            width: 640,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'love-7',
    name: 'Đám cưới ngọt ngào',
    theme: 'love',
    badge: 'popular',
    thumbnail: 'https://images.unsplash.com/photo-1767986012138-d02276728368?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Forever & Always',
      '💍 Ngày trọng đại của chúng ta',
      'https://images.unsplash.com/photo-1767986012138-d02276728368?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fff1f2',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Lời hứa trọn đời',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#f43f5e',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Anh hứa sẽ luôn ở bên em, yêu em, chăm sóc em và làm em hạnh phúc mỗi ngày cho đến cuối đời.',
            x: 80,
            y: 250,
            width: 640,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'love-3',
    name: 'Hẹn hò lãng mạn',
    theme: 'love',
    badge: 'new',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Ngày Đầu Gặp Nhau',
      '💕 Khoảnh khắc định mệnh',
      'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1767986012138-d02276728368?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fce7f3',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Lần đầu anh gặp em',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Dancing Script',
            color: '#be185d',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: 'img-romantic',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1514846528774-8de9d4a07023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 100,
            y: 180,
            width: 600,
            height: 400
          },
          {
            id: '2',
            type: 'text',
            content: 'Từ lần gặp đầu tiên, anh đã biết em là người mà anh muốn dành cả đời để yêu thương và bảo vệ.',
            x: 80,
            y: 620,
            width: 640,
            height: 120,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      {
        id: 'page-2',
        backgroundColor: '#3b3355',
        backgroundImage: 'https://images.unsplash.com/photo-1767368647230-98626a025cef?w=800&h=1000&fit=crop',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Đêm trăng sao',
            x: 50,
            y: 100,
            width: 700,
            height: 90,
            fontSize: 56,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Dưới bầu trời đầy sao, anh và em cùng nhìn về tương lai - nơi có cả hai chúng ta.',
            x: 80,
            y: 560,
            width: 640,
            height: 120,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: '500',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'love-4',
    name: 'Hoàng hôn bên nhau',
    theme: 'love',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Sunset Together',
      '💕 Mỗi hoàng hôn bên em',
      'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1767986012138-d02276728368?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fff7ed',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Khoảnh khắc bình yên',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#fb923c',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Được ngắm hoàng hôn cùng em là điều hạnh phúc nhất mà anh có thể có trong cuộc đời này.',
            x: 80,
            y: 250,
            width: 640,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'love-5',
    name: 'Thư tình',
    theme: 'love',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Love Letters',
      '✉️ Những lời yêu thương',
      'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1767986012138-d02276728368?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fef2f2',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Gửi em...',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 44,
            fontFamily: 'Dancing Script',
            color: '#be123c',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Em à, có những lời anh muốn nói với em mỗi ngày. Cảm ơn em vì đã đến bên anh và làm cho cuộc sống của anh có ý nghĩa hơn.',
            x: 80,
            y: 250,
            width: 640,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      {
        id: 'page-2',
        backgroundColor: '#3b3355',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Đêm lãng mạn',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#fda4af',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1769415002203-67f5bfdb8c09?w=600&h=450&fit=crop',
            x: 100,
            y: 160,
            width: 600,
            height: 450
          },
          {
            id: '3',
            type: 'text',
            content: 'Những đêm ngắm sao cùng em là những khoảnh khắc đẹp nhất trong đời anh.',
            x: 80,
            y: 660,
            width: 640,
            height: 100,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#f3f4f6',
            fontWeight: 'normal',
            textAlign: 'center',
            fontStyle: 'italic'
          }
        ]
      }
    ]
  },

  {
    id: 'love-6',
    name: 'Kỷ niệm 1 năm',
    theme: 'love',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'One Year Anniversary',
      '🎂 365 ngày bên nhau',
      'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1767986012138-d02276728368?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fce7f3',
        elements: [
          {
            id: '1',
            type: 'text',
            content: '365 ngày yêu em',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#db2777',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Một năm đã trôi qua, nhưng tình yêu của anh dành cho em vẫn mãi như ngày đầu tiên. Cảm ơn em vì một năm tuyệt vời!',
            x: 80,
            y: 250,
            width: 640,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  // ========== MEMORIES TEMPLATES (6) ==========
  {
    id: 'memories-1',
    name: 'Kỷ niệm đáng nhớ',
    theme: 'birthday',
    badge: 'bestseller',
    thumbnail: 'https://images.unsplash.com/photo-1598622443054-499119043e82?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'Khoảnh Khắc Đáng Nhớ',
      '🎉 Lưu giữ kỷ niệm quý giá',
      'https://images.unsplash.com/photo-1598622443054-499119043e82?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#faf5ff',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Cột mốc đáng nhớ',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#8b5cf6',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '✨',
            x: 350,
            y: 160,
            width: 100,
            height: 100
          },
          {
            id: 'img-birthday-cake',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1664289597477-d5b2d266169d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 450,
            y: 300,
            width: 280,
            height: 350
          },
          {
            id: '3',
            type: 'text',
            content: 'Mỗi khoảnh khắc trong cuộc đời đều là một món quà. Hãy trân trọng và lưu giữ những kỷ niệm đẹp.',
            x: 60,
            y: 330,
            width: 360,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'memories-2',
    name: 'Album ảnh cũ',
    theme: 'birthday',
    badge: 'popular',
    thumbnail: 'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'Những Tấm Ảnh Xưa',
      '📷 Ký ức đáng nhớ',
      'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1598622443054-499119043e82?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fef3c7',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Ký ức ngày xưa',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#a16207',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: 'img-birthday-party',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1646558583289-41e3c22a3e48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
            x: 450,
            y: 180,
            width: 280,
            height: 400
          },
          {
            id: '2',
            type: 'text',
            content: 'Mỗi tấm ảnh là một câu chuyện, mỗi khoảnh khắc là một kỷ niệm không thể phai mờ theo thời gian.',
            x: 60,
            y: 250,
            width: 360,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'memories-3',
    name: 'Cuốn nhật ký',
    theme: 'birthday',
    badge: 'new',
    thumbnail: 'https://images.unsplash.com/photo-1598622443054-499119043e82?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'My Diary',
      '📔 Những trang nhật ký của tôi',
      'https://images.unsplash.com/photo-1598622443054-499119043e82?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fef3c7',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Ghi chú cuộc sống',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#7c2d12',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Cuộc sống là một cuốn sách, và mỗi ngày là một trang mới. Hãy viết nên câu chuyện của riêng bạn.',
            x: 80,
            y: 250,
            width: 640,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'memories-4',
    name: 'Timeline cuộc đời',
    theme: 'birthday',
    thumbnail: 'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'My Life Timeline',
      '🎉 Hành trình của tôi',
      'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1598622443054-499119043e82?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#ede9fe',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Cột mốc quan trọng',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#6366f1',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Mỗi cột mốc trong cuộc đời là một bài học quý giá, giúp ta trưởng thành và hiểu rõ hơn về bản thân mình.',
            x: 80,
            y: 250,
            width: 640,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'memories-5',
    name: 'Những chuyến đi',
    theme: 'birthday',
    thumbnail: 'https://images.unsplash.com/photo-1598622443054-499119043e82?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'Travel Memories',
      '✈️ Hành trình khám phá',
      'https://images.unsplash.com/photo-1598622443054-499119043e82?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#d1fae5',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Hành trình khám phá',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#059669',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Mỗi chuyến đi là một trải nghiệm mới, một bài học mới và một kỷ niệm đẹp để lưu giữ mãi mãi.',
            x: 80,
            y: 250,
            width: 640,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  {
    id: 'memories-6',
    name: 'Năm tháng đẹp',
    theme: 'birthday',
    thumbnail: 'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'Beautiful Years',
      '🎉 Những năm tháng tươi đẹp',
      'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1598622443054-499119043e82?w=300&h=300&fit=crop'
    ),
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fae8ff',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Thời gian quý giá',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#c026d3',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Thời gian trôi qua nhanh chóng, nhưng những kỷ niệm đẹp sẽ mãi còn trong tim và tâm trí chúng ta.',
            x: 80,
            y: 250,
            width: 640,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      }
    ]
  },

  // ========== DREAMY ROMANTIC TEMPLATE ==========
  // Note: Unsplash doesn't have anime illustrations, so this template uses
  // soft, dreamy, artistic couple photos that users can replace with anime images
  {
    id: 'love-8',
    name: 'Khoảnh khắc lãng mạn (Dreamy Style)',
    theme: 'love',
    badge: 'new',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Our Dreamy Love Story',
      '💕 Câu chuyện tình yêu của chúng ta',
      'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1767986012138-d02276728368?w=300&h=300&fit=crop'
    ),
    pages: [
      // Page 1: Sunset romantic moment with photo placeholder
      {
        id: 'page-1',
        backgroundColor: '#fff5f7',
        backgroundImage: 'https://images.unsplash.com/photo-1768825354617-39cf8b634654?w=800&h=1000&fit=crop',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Hoàng hôn bên nhau',
            x: 50,
            y: 60,
            width: 700,
            height: 90,
            fontSize: 52,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 6px rgba(0,0,0,0.4)'
          },
          {
            id: '2',
            type: 'image',
            content: '',
            src: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=300&fit=crop',
            x: 200,
            y: 200,
            width: 400,
            height: 300,
            rotation: 0,
            opacity: 1,
            locked: false,
            visible: true,
            zIndex: 1
          },
          {
            id: '3',
            type: 'text',
            content: 'Khoảnh khắc này, chỉ có anh và em. Ánh hoàng hôn nhẹ nhàng phủ lên đôi ta, như thời gian ngừng trôi.',
            x: 80,
            y: 540,
            width: 640,
            height: 140,
            fontSize: 19,
            fontFamily: 'Crimson Text',
            color: '#ffffff',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: 1.6,
            textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
          }
        ]
      },
      
      // Page 2: Soft romantic lighting with text focus
      {
        id: 'page-2',
        backgroundColor: '#fef3f4',
        backgroundImage: 'https://images.unsplash.com/photo-1768387107338-cffab37ea808?w=800&h=1000&fit=crop',
        elements: [
          {
            id: '1',
            type: 'text',
            content: '"Trong ánh sáng dịu nhẹ"',
            x: 80,
            y: 150,
            width: 640,
            height: 160,
            fontSize: 58,
            fontFamily: 'Dancing Script',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.3
          },
          {
            id: '2',
            type: 'text',
            content: 'Trong những khoảnh khắc yên bình, ta tìm thấy nhau. Ánh mắt em, nụ cười em, tất cả đều khiến anh say đắm.',
            x: 80,
            y: 400,
            width: 640,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#831843',
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: 1.8
          },
          {
            id: '3',
            type: 'image',
            content: '',
            src: 'https://images.unsplash.com/photo-1759096326709-b3975319748e?w=350&h=250&fit=crop',
            x: 225,
            y: 680,
            width: 350,
            height: 250,
            rotation: 0,
            opacity: 1,
            locked: false,
            visible: true,
            zIndex: 2
          }
        ]
      },
      
      // Page 3: Quiet intimate moment
      {
        id: 'page-3',
        backgroundColor: '#fef3f4',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Những phút giây yên ắng',
            x: 50,
            y: 80,
            width: 700,
            height: 80,
            fontSize: 44,
            fontFamily: 'Playfair Display',
            color: '#be185d',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'image',
            content: '',
            src: 'https://images.unsplash.com/photo-1671600493594-edb52f00c6d7?w=600&h=400&fit=crop',
            x: 100,
            y: 220,
            width: 600,
            height: 400,
            rotation: 0,
            opacity: 1,
            locked: false,
            visible: true,
            zIndex: 1
          },
          {
            id: '3',
            type: 'text',
            content: 'Đôi khi, hạnh phúc chỉ đơn giản là được ở bên em trong những khoảnh khắc bình yên nhất.',
            x: 80,
            y: 560,
            width: 640,
            height: 120,
            fontSize: 21,
            fontFamily: 'Crimson Text',
            color: '#831843',
            fontWeight: '500',
            textAlign: 'center',
            lineHeight: 1.7,
            fontStyle: 'italic'
          }
        ]
      },
      
      // Page 4: Holding hands romantic
      {
        id: 'page-4',
        backgroundColor: '#fff9f0',
        backgroundImage: 'https://images.unsplash.com/photo-1602167783547-0198ed0566e3?w=800&h=1000&fit=crop',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Nắm tay nhau',
            x: 50,
            y: 100,
            width: 700,
            height: 100,
            fontSize: 64,
            fontFamily: 'Dancing Script',
            color: '#fb7185',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(255,255,255,0.8)'
          },
          {
            id: '2',
            type: 'image',
            content: '',
            src: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=500&h=350&fit=crop',
            x: 150,
            y: 280,
            width: 500,
            height: 350,
            rotation: 0,
            opacity: 1,
            locked: false,
            visible: true,
            zIndex: 2
          },
          {
            id: '3',
            type: 'text',
            content: 'Bàn tay em trong tay anh - đó là nơi anh muốn giữ mãi mãi. Dù đi đâu, dù đến đâu, anh chỉ muốn là người cùng em bước tiếp.',
            x: 70,
            y: 500,
            width: 660,
            height: 180,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#9f1239',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: 1.7
          }
        ]
      },
      
      // Page 5: Love message dedication page
      {
        id: 'page-5',
        backgroundColor: '#fdf2f8',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Dành tặng em',
            x: 50,
            y: 120,
            width: 700,
            height: 80,
            fontSize: 48,
            fontFamily: 'Playfair Display',
            color: '#db2777',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '💖',
            x: 350,
            y: 240,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Em là ánh sáng trong đời anh,\nLà lý do anh mỉm cười mỗi sáng thức dậy,\nLà nguồn động lực cho anh vượt qua mọi khó khăn.\n\nCảm ơn em vì đã đến bên anh.\nAnh yêu em, giờ và mãi mãi.',
            x: 80,
            y: 380,
            width: 640,
            height: 350,
            fontSize: 22,
            fontFamily: 'Crimson Text',
            color: '#4a1d34',
            fontWeight: '500',
            textAlign: 'center',
            lineHeight: 2.0,
            fontStyle: 'italic'
          },
          {
            id: '4',
            type: 'text',
            content: '- Người yêu em nhiều nhất -',
            x: 150,
            y: 620,
            width: 500,
            height: 60,
            fontSize: 18,
            fontFamily: 'Dancing Script',
            color: '#be185d',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        ]
      }
    ]
  },
  
  // Add new romantic love template with 10 pages
  romanticLoveTemplate,

  // Youth Archive - scrapbook style template
  youthArchiveTemplate,
];

export function getTemplatesByTheme(theme: string): Template[] {
  return templates.filter(t => t.theme === theme);
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}
