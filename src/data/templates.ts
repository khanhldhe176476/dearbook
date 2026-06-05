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
    name: 'Li cm n gia nh',
    theme: 'family',
    badge: 'bestseller',
    thumbnail: 'https://images.unsplash.com/photo-1729291638795-7a23d54ddaa5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Mn Qu Dnh Cho Gia nh',
      ' Yu thng & Gn kt',
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
            content: 'Li nhn gi',
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
            content: '',
            x: 350,
            y: 200,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Cm n ba m  lun bn cnh, yu thng v chm sc con. Nhng k nim cng gia nh l mn qu qu gi nht trong cuc i con.',
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
            content: 'Khonh khc bn nhau',
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
            content: 'Hnh phc l c sum hp bn gia nh, ni lun c tnh yu thng v s m p.',
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
            content: 'Cm n m',
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
            content: 'M l ngi ph n u tin con yu, l ngi hng hu v v i nht trong cuc i con. Cm n m v tt c!',
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
            content: 'Ba cm gia nh',
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
            content: 'Mn n ngon nht khng phi  nh hng 5 sao, m l ba cm m cng quy qun bn gia nh.',
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
            content: 'Nhng bi hc t gia nh',
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
            content: '1. Lun yu thng v tn trng nhau',
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
            content: '2. Gia nh l ni ta c th l chnh mnh',
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
            content: '3. Hy dnh thi gian cho ngi thn',
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
            content: '4. Chia s c vui ln bun',
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
            content: '5. Lun  bn nhau mi lc',
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
            content: 'Li ha ca con',
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
            content: '',
            x: 350,
            y: 60,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Con ha s lun l ngi con ngoan, yu thng v quan tm n gia nh. Con s c gng  lm ba m t ho.',
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
            content: 'Yu ba m nhiu lm! ',
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
    name: 'Ba cm gia nh',
    theme: 'family',
    badge: 'popular',
    thumbnail: 'https://images.unsplash.com/photo-1766808982983-a2f7cdbe58d9?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Ba Cm Gia nh',
      ' Ni tnh thn gn kt',
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
            content: 'Hng v nh',
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
            content: 'Mn n ngon nht khng phi  nh hng, m l ba cm m cng bn gia nh yu thng.',
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
    name: 'M v con',
    theme: 'family',
    badge: 'new',
    thumbnail: 'https://images.unsplash.com/photo-1729291638795-7a23d54ddaa5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Tnh Mu T',
      ' Yu thng v b bn',
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
            content: 'Cm n m',
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
            content: 'M l ngi ph n u tin con yu, l tm gng sng m con lun ngng m. Cm n m v tt c.',
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
    name: 'K ngh gia nh',
    theme: 'family',
    thumbnail: 'https://images.unsplash.com/photo-1766808982983-a2f7cdbe58d9?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'K Ngh Cng Nhau',
      ' Nhng chuyn i ng nh',
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
            content: 'Khonh khc hnh phc',
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
            content: 'Mi chuyn i l c hi  gia nh gn nhau hn, hiu nhau hn v yu thng nhau nhiu hn.',
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
    name: 'ng b v chu',
    theme: 'family',
    thumbnail: 'https://images.unsplash.com/photo-1729291638795-7a23d54ddaa5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Th H Kt Ni',
      ' Tnh yu thng bt tn',
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
            content: 'Li cn dn ca ng b',
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
            content: 'Tnh yu ca ng b dnh cho chu l mn qu v gi, l ngun ng lc  chu trng thnh.',
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
    name: 'Tui th hng',
    theme: 'family',
    thumbnail: 'https://images.unsplash.com/photo-1766808982983-a2f7cdbe58d9?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'family',
      'Tui Th Hng',
      ' K nim thi th u',
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
            content: 'K c tui th',
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
            content: 'Tui th l khong thi gian p nht, ni c tnh yu thng ca gia nh v nhng k nim khng th no qun.',
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
    name: 'Chuyn i cng bn',
    theme: 'friendship',
    badge: 'popular',
    thumbnail: 'https://images.unsplash.com/photo-1583609042814-8a30efe7a9d5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Chuyn i Cng Bn',
      ' Nhng k nim khng th qun',
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
            content: 'Cng nhau khm ph',
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
            content: '',
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
            content: 'Mi chuyn i vi bn b l mt cuc phiu lu y th v, ni chng ta cng nhau to nn nhng k nim khng th qun.',
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
            content: 'Nhng con ng ta i cng nhau',
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
            content: 'Khng phi im n, m chnh l hnh trnh cng nhau mi to nn  ngha.',
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
            content: 'Hong hn bn bn',
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
            content: 'Nhng khonh khc p nht l khi ta c  bn nhng ngi ta yu thng.',
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
            content: 'Ci khng ngng',
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
            content: 'Ting ci ca chng ta l m nhc p nht, l liu thuc cha lnh mi bun phin.',
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
            content: 'Nhng iu mnh thch lm cng nhau',
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
            content: ' Chi game n tn sng',
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
            content: ' i n khp ni',
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
            content: ' Chp nh "sng o"',
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
            content: ' Xem phim v bn lun',
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
            content: ' Tm s n tn m khuya',
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
            content: 'Bn mi mi',
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
            content: '',
            x: 350,
            y: 80,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'D thi gian c tri, d cuc sng c thay i, tnh bn ca chng ta s mi mi khng phai.',
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
            content: 'Love you guys! ',
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
    name: 'Ci cng bn',
    theme: 'friendship',
    badge: 'bestseller',
    thumbnail: 'https://images.unsplash.com/photo-1581812380447-5544e1a1f20d?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Ci Khng Ngng',
      ' Nim vui cng bn b',
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
            content: 'Ting ci sng khoi',
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
            content: 'Nhng lc ci a vi bn b l nhng khonh khc hnh phc nht trong cuc sng ca mnh.',
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
    name: 'Tnh bn mi mi',
    theme: 'friendship',
    badge: 'new',
    thumbnail: 'https://images.unsplash.com/photo-1583609042814-8a30efe7a9d5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Tnh Bn Mi Mi',
      ' Bn cht theo nm thng',
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
            content: 'Bn nhau mi lc',
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
            content: 'Tnh bn ch thc khng o bng thi gian, m o bng tnh cm v s thu hiu ln nhau.',
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
    name: 'Du lch cng hi',
    theme: 'friendship',
    thumbnail: 'https://images.unsplash.com/photo-1581812380447-5544e1a1f20d?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Hnh Trnh Cng Hi',
      ' Khm ph th gii bn nhau',
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
            content: 'Nhng con ng',
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
            content: 'i cng bn b l cch tt nht  khm ph th gii v to ra nhng k nim khng th phai m.',
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
    name: 'Sinh nht bn thn',
    theme: 'friendship',
    thumbnail: 'https://images.unsplash.com/photo-1583609042814-8a30efe7a9d5?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Happy Birthday!',
      ' Chc mng bn thn',
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
            content: 'Chc mng sinh nht!',
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
            content: 'Chc bn mt tui mi trn y nim vui, hnh phc v thnh cng. Cm n v  l ngi bn tuyt vi!',
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
    name: 'Nhng ngy hc',
    theme: 'friendship',
    thumbnail: 'https://images.unsplash.com/photo-1581812380447-5544e1a1f20d?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'friendship',
      'Thi Hc Sinh',
      ' K nim khng phai',
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
            content: 'K c ngy xa',
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
            content: 'Thi hc sinh l khong thi gian p nht, ni ta gp c nhng ngi bn chn thnh v to nn bit bao k nim.',
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
    name: 'Cu chuyn tnh yu',
    theme: 'love',
    badge: 'bestseller',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Our Love Story',
      ' Dnh tng ngi em yu',
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
            content: 'Ngy u tin',
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
            content: 'Anh nh nh in ngy u tin gp em. nh mt em, n ci em  lm anh rung ng khng th t.',
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
            content: '"Anh yu em"',
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
            content: '',
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
            content: 'Anh yu em khng ch v nhng g em l, m cn v nhng g anh tr thnh khi  bn em. Em lm anh mun tr thnh phin bn tt nht ca chnh mnh.',
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
            content: 'Nhng khonh khc bn nhau',
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
            content: 'Mi khonh khc bn em u l mn qu qu gi nht m cuc i trao tng anh.',
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
            content: '100 l do anh yu em',
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
            content: '1. N ci ti ca em',
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
            content: '2. Cch em quan tm ngi khc',
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
            content: '3. Ging ni ngt ngo ca em',
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
            content: '4. Em lun lng nghe anh',
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
            content: '5. V cn 95 l do na...',
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
            content: 'Hnh trnh ca chng ta',
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
            content: ' Thng 3, 2023',
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
            content: 'Ln u gp nhau ti qun c ph',
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
            content: ' Thng 5, 2023',
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
            content: 'Ngy anh t tnh vi em',
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
            content: ' Thng 12, 2023',
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
            content: 'K nim 1 nm yu nhau',
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
            content: 'Li ha ca anh',
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
            content: 'Anh ha s lun yu thng, che ch v bo v em. Anh ha s l ngi bn ng hnh ng tin cy nht trong cuc i em.',
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
            content: '',
            x: 350,
            y: 650,
            width: 100,
            height: 100
          },
          {
            id: '4',
            type: 'text',
            content: 'Mi mi bn nhau',
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
            content: 'Cm n em',
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
            content: '',
            x: 350,
            y: 100,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Cm n em  n bn anh,  khin cuc sng ca anh thm  ngha v trn y hnh phc. Em l iu tuyt vi nht tng n vi anh.',
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
            content: 'Yu em nhiu lm! ',
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
    name: 'K nim tnh yu',
    theme: 'love',
    badge: 'popular',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'K Nim Ca Chng Ta',
      ' Nhng khonh khc ngt ngo',
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
            content: 'Li nhn yu thng',
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
    name: 'm ci ngt ngo',
    theme: 'love',
    badge: 'popular',
    thumbnail: 'https://images.unsplash.com/photo-1767986012138-d02276728368?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Forever & Always',
      ' Ngy trng i ca chng ta',
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
            content: 'Li ha trn i',
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
            content: 'Anh ha s lun  bn em, yu em, chm sc em v lm em hnh phc mi ngy cho n cui i.',
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
    name: 'Hn h lng mn',
    theme: 'love',
    badge: 'new',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Ngy u Gp Nhau',
      ' Khonh khc nh mnh',
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
            content: 'Ln u anh gp em',
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
            content: 'T ln gp u tin, anh  bit em l ngi m anh mun dnh c i  yu thng v bo v.',
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
            content: 'm trng sao',
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
            content: 'Di bu tri y sao, anh v em cng nhn v tng lai - ni c c hai chng ta.',
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
    name: 'Hong hn bn nhau',
    theme: 'love',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Sunset Together',
      ' Mi hong hn bn em',
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
            content: 'Khonh khc bnh yn',
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
            content: 'c ngm hong hn cng em l iu hnh phc nht m anh c th c trong cuc i ny.',
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
    name: 'Th tnh',
    theme: 'love',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Love Letters',
      ' Nhng li yu thng',
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
            content: 'Gi em...',
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
            content: 'Em , c nhng li anh mun ni vi em mi ngy. Cm n em v  n bn anh v lm cho cuc sng ca anh c  ngha hn.',
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
            content: 'm lng mn',
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
            content: 'Nhng m ngm sao cng em l nhng khonh khc p nht trong i anh.',
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
    name: 'K nim 1 nm',
    theme: 'love',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'One Year Anniversary',
      ' 365 ngy bn nhau',
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
            content: '365 ngy yu em',
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
            content: 'Mt nm  tri qua, nhng tnh yu ca anh dnh cho em vn mi nh ngy u tin. Cm n em v mt nm tuyt vi!',
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
    name: 'K nim ng nh',
    theme: 'birthday',
    badge: 'bestseller',
    thumbnail: 'https://images.unsplash.com/photo-1598622443054-499119043e82?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'Khonh Khc ng Nh',
      ' Lu gi k nim qu gi',
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
            content: 'Ct mc ng nh',
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
            content: '',
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
            content: 'Mi khonh khc trong cuc i u l mt mn qu. Hy trn trng v lu gi nhng k nim p.',
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
    name: 'Album nh c',
    theme: 'birthday',
    badge: 'popular',
    thumbnail: 'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'Nhng Tm nh Xa',
      ' K c ng nh',
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
            content: 'K c ngy xa',
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
            content: 'Mi tm nh l mt cu chuyn, mi khonh khc l mt k nim khng th phai m theo thi gian.',
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
    name: 'Cun nht k',
    theme: 'birthday',
    badge: 'new',
    thumbnail: 'https://images.unsplash.com/photo-1598622443054-499119043e82?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'My Diary',
      ' Nhng trang nht k ca ti',
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
            content: 'Ghi ch cuc sng',
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
            content: 'Cuc sng l mt cun sch, v mi ngy l mt trang mi. Hy vit nn cu chuyn ca ring bn.',
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
    name: 'Timeline cuc i',
    theme: 'birthday',
    thumbnail: 'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'My Life Timeline',
      ' Hnh trnh ca ti',
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
            content: 'Ct mc quan trng',
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
            content: 'Mi ct mc trong cuc i l mt bi hc qu gi, gip ta trng thnh v hiu r hn v bn thn mnh.',
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
    name: 'Nhng chuyn i',
    theme: 'birthday',
    thumbnail: 'https://images.unsplash.com/photo-1598622443054-499119043e82?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'Travel Memories',
      ' Hnh trnh khm ph',
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
            content: 'Hnh trnh khm ph',
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
            content: 'Mi chuyn i l mt tri nghim mi, mt bi hc mi v mt k nim p  lu gi mi mi.',
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
    name: 'Nm thng p',
    theme: 'birthday',
    thumbnail: 'https://images.unsplash.com/photo-1577080415932-2e5a0fbec8e2?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'birthday',
      'Beautiful Years',
      ' Nhng nm thng ti p',
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
            content: 'Thi gian qu gi',
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
            content: 'Thi gian tri qua nhanh chng, nhng nhng k nim p s mi cn trong tim v tm tr chng ta.',
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
    name: 'Khonh khc lng mn (Dreamy Style)',
    theme: 'love',
    badge: 'new',
    thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
    cover: createMagazineCover(
      'love',
      'Our Dreamy Love Story',
      ' Cu chuyn tnh yu ca chng ta',
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
            content: 'Hong hn bn nhau',
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
            content: 'Khonh khc ny, ch c anh v em. nh hong hn nh nhng ph ln i ta, nh thi gian ngng tri.',
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
            content: '"Trong nh sng du nh"',
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
            content: 'Trong nhng khonh khc yn bnh, ta tm thy nhau. nh mt em, n ci em, tt c u khin anh say m.',
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
            content: 'Nhng pht giy yn ng',
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
            content: 'i khi, hnh phc ch n gin l c  bn em trong nhng khonh khc bnh yn nht.',
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
            content: 'Nm tay nhau',
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
            content: 'Bn tay em trong tay anh -  l ni anh mun gi mi mi. D i u, d n u, anh ch mun l ngi cng em bc tip.',
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
            content: 'Dnh tng em',
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
            content: '',
            x: 350,
            y: 240,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Em l nh sng trong i anh,\nL l do anh mm ci mi sng thc dy,\nL ngun ng lc cho anh vt qua mi kh khn.\n\nCm n em v  n bn anh.\nAnh yu em, gi v mi mi.',
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
            content: '- Ngi yu em nhiu nht -',
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
