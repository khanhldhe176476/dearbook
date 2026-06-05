import { BookProject } from '../App';

// Sample books with full content and images for 3D preview
export const sampleBooks: BookProject[] = [
  // ========== FAMILY BOOK ==========
  {
    id: 'sample-family-1',
    title: 'Mn Qu Dnh Cho Gia nh',
    theme: 'family',
    templateId: 'family-1',
    pageCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverPage: {
      id: 'cover',
      backgroundColor: '#f97316',
      backgroundImage: 'https://images.unsplash.com/photo-1624448445915-97154f5e688c?w=800&h=1200&fit=crop',
      elements: [
        {
          id: '1',
          type: 'text',
          content: 'Mn Qu Dnh Cho Gia nh',
          x: 50,
          y: 500,
          width: 700,
          height: 120,
          fontSize: 48,
          fontFamily: 'Playfair Display',
          color: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: '2',
          type: 'text',
          content: 'Yu thng & Gn kt',
          x: 50,
          y: 640,
          width: 700,
          height: 60,
          fontSize: 24,
          fontFamily: 'Poppins',
          color: '#ffffff',
          fontWeight: 'normal',
          textAlign: 'center'
        }
      ]
    },
    pages: [
      // Page 1
      {
        id: 'page-1',
        backgroundColor: '#fff8f0',
        backgroundImage: 'https://images.unsplash.com/photo-1624448445915-97154f5e688c?w=800&h=1200&fit=crop&sat=-100&bri=30',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Li nhn gi',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#f97316',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '',
            x: 350,
            y: 150,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Cm n ba m  lun bn cnh, yu thng v chm sc con.',
            x: 80,
            y: 300,
            width: 640,
            height: 150,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 2
      {
        id: 'page-2',
        backgroundColor: '#fef3c7',
        backgroundImage: 'https://images.unsplash.com/photo-1639696317686-f5350dbf2d95?w=800&h=1200&fit=crop',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Ba cm gia nh',
            x: 50,
            y: 80,
            width: 700,
            height: 70,
            fontSize: 38,
            fontFamily: 'Playfair Display',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Mn n ngon nht l ba cm m cng bn gia nh.',
            x: 80,
            y: 550,
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
      // Page 3
      {
        id: 'page-3',
        backgroundColor: '#fce7f3',
        backgroundImage: 'https://images.unsplash.com/photo-1589529800500-8a1a1a047e0e?w=800&h=1200&fit=crop',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Tnh mu t',
            x: 50,
            y: 80,
            width: 700,
            height: 80,
            fontSize: 44,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'M l ngi ph n u tin con yu, l tm gng sng.',
            x: 80,
            y: 550,
            width: 640,
            height: 130,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 4
      {
        id: 'page-4',
        backgroundColor: '#e0f2fe',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Nhng k nim p',
            x: 50,
            y: 200,
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
            type: 'sticker',
            content: '',
            x: 150,
            y: 320,
            width: 80,
            height: 80
          },
          {
            id: '3',
            type: 'sticker',
            content: '',
            x: 570,
            y: 320,
            width: 80,
            height: 80
          },
          {
            id: '4',
            type: 'text',
            content: 'Mi khonh khc bn gia nh u l mn qu qu gi nht trong cuc i.',
            x: 80,
            y: 450,
            width: 640,
            height: 150,
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

  // ========== FRIENDS BOOK ==========
  {
    id: 'sample-friends-1',
    title: 'Chuyn i Cng Bn',
    theme: 'friends',
    templateId: 'friends-1',
    pageCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverPage: {
      id: 'cover',
      backgroundColor: '#6366f1',
      backgroundImage: 'https://images.unsplash.com/photo-1616432119481-2876a5d92249?w=800&h=1200&fit=crop',
      elements: [
        {
          id: '1',
          type: 'text',
          content: 'Chuyn i Cng Bn',
          x: 50,
          y: 500,
          width: 700,
          height: 100,
          fontSize: 48,
          fontFamily: 'Playfair Display',
          color: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: '2',
          type: 'text',
          content: 'Nhng k nim khng th qun',
          x: 50,
          y: 620,
          width: 700,
          height: 60,
          fontSize: 22,
          fontFamily: 'Poppins',
          color: '#ffffff',
          fontWeight: 'normal',
          textAlign: 'center'
        }
      ]
    },
    pages: [
      // Page 1
      {
        id: 'page-1',
        backgroundColor: '#ede9fe',
        backgroundImage: 'https://images.unsplash.com/photo-1616432119481-2876a5d92249?w=800&h=1200&fit=crop&sat=-100&bri=40',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Cng nhau khm ph',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Mi chuyn i vi bn b l mt cuc phiu lu y th v.',
            x: 80,
            y: 550,
            width: 640,
            height: 120,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 2
      {
        id: 'page-2',
        backgroundColor: '#fef3c7',
        backgroundImage: 'https://images.unsplash.com/photo-1638644074459-9067407b72a3?w=800&h=1200&fit=crop',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Ting ci sng khoi',
            x: 50,
            y: 80,
            width: 700,
            height: 80,
            fontSize: 38,
            fontFamily: 'Playfair Display',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
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
            content: 'Nhng lc ci a vi bn b l nhng khonh khc hnh phc nht.',
            x: 80,
            y: 520,
            width: 640,
            height: 130,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 3
      {
        id: 'page-3',
        backgroundColor: '#d1fae5',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Tnh bn mi mi',
            x: 50,
            y: 200,
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
            type: 'sticker',
            content: '',
            x: 350,
            y: 320,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Tnh bn ch thc khng o bng thi gian, m o bng tnh cm.',
            x: 80,
            y: 460,
            width: 640,
            height: 150,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 4
      {
        id: 'page-4',
        backgroundColor: '#fce7f3',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Cm n v  l bn',
            x: 50,
            y: 250,
            width: 700,
            height: 100,
            fontSize: 36,
            fontFamily: 'Dancing Script',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '',
            x: 200,
            y: 400,
            width: 80,
            height: 80
          },
          {
            id: '3',
            type: 'sticker',
            content: '',
            x: 520,
            y: 400,
            width: 80,
            height: 80
          }
        ]
      }
    ]
  },

  // ========== LOVE BOOK ==========
  {
    id: 'sample-love-1',
    title: 'Our Love Story',
    theme: 'love',
    templateId: 'love-1',
    pageCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverPage: {
      id: 'cover',
      backgroundColor: '#ec4899',
      backgroundImage: 'https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?w=800&h=1200&fit=crop',
      elements: [
        {
          id: '1',
          type: 'text',
          content: 'Our Love Story',
          x: 50,
          y: 500,
          width: 700,
          height: 120,
          fontSize: 58,
          fontFamily: 'Dancing Script',
          color: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: '2',
          type: 'text',
          content: 'Dnh tng ngi em yu',
          x: 50,
          y: 640,
          width: 700,
          height: 60,
          fontSize: 22,
          fontFamily: 'Poppins',
          color: '#ffffff',
          fontWeight: 'normal',
          textAlign: 'center'
        }
      ]
    },
    pages: [
      // Page 1
      {
        id: 'page-1',
        backgroundColor: '#fef2f2',
        backgroundImage: 'https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?w=800&h=1200&fit=crop&sat=-80&bri=30',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Li nhn yu thng',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
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
            id: '3',
            type: 'text',
            content: 'Anh yu em khng ch v nhng g em l, m cn v nhng g anh tr thnh khi  bn em.',
            x: 80,
            y: 500,
            width: 640,
            height: 150,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 2
      {
        id: 'page-2',
        backgroundColor: '#fce7f3',
        backgroundImage: 'https://images.unsplash.com/photo-1506014299253-3725319c0f69?w=800&h=1200&fit=crop',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Bn nhau mi mi',
            x: 50,
            y: 80,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'text',
            content: 'Cng nhau vit nn cu chuyn tnh yu ca ring chng ta.',
            x: 80,
            y: 550,
            width: 640,
            height: 120,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 3
      {
        id: 'page-3',
        backgroundColor: '#fff1f2',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Khonh khc c bit',
            x: 50,
            y: 200,
            width: 700,
            height: 80,
            fontSize: 38,
            fontFamily: 'Playfair Display',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '',
            x: 250,
            y: 320,
            width: 90,
            height: 90
          },
          {
            id: '3',
            type: 'sticker',
            content: '',
            x: 460,
            y: 320,
            width: 90,
            height: 90
          },
          {
            id: '4',
            type: 'text',
            content: 'Mi giy pht bn em u l iu k diu vi anh.',
            x: 80,
            y: 470,
            width: 640,
            height: 140,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 4
      {
        id: 'page-4',
        backgroundColor: '#fef3c7',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Forever & Always',
            x: 50,
            y: 280,
            width: 700,
            height: 100,
            fontSize: 48,
            fontFamily: 'Dancing Script',
            color: '#f59e0b',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '',
            x: 350,
            y: 420,
            width: 100,
            height: 100
          }
        ]
      }
    ]
  },

  // ========== MEMORIES BOOK ==========
  {
    id: 'sample-memories-1',
    title: 'K c Ti p',
    theme: 'memories',
    templateId: 'memories-1',
    pageCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverPage: {
      id: 'cover',
      backgroundColor: '#8b5cf6',
      backgroundImage: 'https://images.unsplash.com/photo-1532387482281-c56ef57652ec?w=800&h=1200&fit=crop',
      elements: [
        {
          id: '1',
          type: 'text',
          content: 'K c Ti p',
          x: 50,
          y: 500,
          width: 700,
          height: 100,
          fontSize: 52,
          fontFamily: 'Playfair Display',
          color: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: '2',
          type: 'text',
          content: 'Nhng khonh khc ng nh',
          x: 50,
          y: 620,
          width: 700,
          height: 60,
          fontSize: 22,
          fontFamily: 'Poppins',
          color: '#ffffff',
          fontWeight: 'normal',
          textAlign: 'center'
        }
      ]
    },
    pages: [
      // Page 1
      {
        id: 'page-1',
        backgroundColor: '#f5f3ff',
        backgroundImage: 'https://images.unsplash.com/photo-1532387482281-c56ef57652ec?w=800&h=1200&fit=crop&sat=-100&bri=40',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Nhng ngy xa',
            x: 50,
            y: 50,
            width: 700,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#ffffff',
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
            id: '3',
            type: 'text',
            content: 'Mi bc nh l mt cu chuyn, mi k nim l mt mn qu.',
            x: 80,
            y: 520,
            width: 640,
            height: 130,
            fontSize: 22,
            fontFamily: 'Poppins',
            color: '#ffffff',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 2
      {
        id: 'page-2',
        backgroundColor: '#fef9c3',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Thi gian tri',
            x: 50,
            y: 200,
            width: 700,
            height: 80,
            fontSize: 40,
            fontFamily: 'Playfair Display',
            color: '#8b5cf6',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '',
            x: 200,
            y: 320,
            width: 80,
            height: 80
          },
          {
            id: '3',
            type: 'sticker',
            content: '',
            x: 520,
            y: 320,
            width: 80,
            height: 80
          },
          {
            id: '4',
            type: 'text',
            content: 'Thi gian tri qua nhng k nim mi trong tim.',
            x: 80,
            y: 460,
            width: 640,
            height: 140,
            fontSize: 24,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ]
      },
      // Page 3
      {
        id: 'page-3',
        backgroundColor: '#ddd6fe',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Qung ng  qua',
            x: 50,
            y: 220,
            width: 700,
            height: 80,
            fontSize: 38,
            fontFamily: 'Playfair Display',
            color: '#7c3aed',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '',
            x: 350,
            y: 340,
            width: 100,
            height: 100
          },
          {
            id: '3',
            type: 'text',
            content: 'Mi bc chn l mt du n, mi khonh khc l mt k nim.',
            x: 80,
            y: 490,
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
      // Page 4
      {
        id: 'page-4',
        backgroundColor: '#fce7f3',
        elements: [
          {
            id: '1',
            type: 'text',
            content: 'Trn trng tng pht giy',
            x: 50,
            y: 270,
            width: 700,
            height: 100,
            fontSize: 36,
            fontFamily: 'Dancing Script',
            color: '#ec4899',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: '2',
            type: 'sticker',
            content: '',
            x: 250,
            y: 410,
            width: 80,
            height: 80
          },
          {
            id: '3',
            type: 'sticker',
            content: '',
            x: 470,
            y: 410,
            width: 80,
            height: 80
          }
        ]
      }
    ]
  }
];
