import { BookPage } from '../App';

interface Template {
  id: string;
  name: string;
  theme: 'family' | 'friendship' | 'love' | 'birthday';
  thumbnail: string;
  cover: BookPage;
  pages: BookPage[];
  badge?: 'new' | 'bestseller' | 'popular';
}

// NEW ROMANTIC LOVE TEMPLATES - 10 Emotional Storytelling Pages
export const romanticLoveTemplate: Template = {
  id: 'love-romantic-10',
  name: 'Romantic Love Story - 10 Pages',
  theme: 'love',
  badge: 'new',
  thumbnail: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=400&h=500&fit=crop',
  cover: {
    id: 'cover',
    backgroundColor: '#ffffff',
    backgroundImage: 'https://images.unsplash.com/photo-1768468104279-726353bcad08?w=800&h=1200&fit=crop',
    elements: [
      // Dark overlay
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
      // Decorative image circle
      {
        id: 'cover-decor',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1767986012138-d02276728368?w=300&h=300&fit=crop',
        x: 320,
        y: 30,
        width: 150,
        height: 150,
        objectFit: 'cover',
        borderRadius: 75,
        opacity: 0.7,
        zIndex: 2
      },
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
      },
      // Top label
      {
        id: 'cover-label',
        type: 'shape',
        fill: 'rgba(255,192,203,0.9)',
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
        content: 'LOVE STORY',
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
        content: 'Our Love Story',
        x: 30,
        y: 380,
        width: 440,
        height: 150,
        fontSize: 52,
        fontFamily: 'Dancing Script',
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
        content: ' A journey of two hearts',
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
  },
  pages: [
    // ========== PAGE 1: Balcony Sunset - Romantic Beginning ==========
    {
      id: 'page-1-balcony-sunset',
      backgroundColor: '#FFF4E6',
      backgroundImage: 'https://images.unsplash.com/photo-1759265472435-bce65ac2eb36?w=800&h=1000&fit=crop',
      elements: [
        {
          id: 'p1-title',
          type: 'text',
          content: 'Sunset on the Balcony',
          x: 60,
          y: 60,
          width: 680,
          height: 100,
          fontSize: 52,
          fontFamily: 'Dancing Script',
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: 'p1-text',
          type: 'text',
          content: 'Watching the sunset together, hands intertwined, hearts beating as one. In this moment, everything feels perfect.',
          x: 80,
          y: 550,
          width: 640,
          height: 120,
          fontSize: 22,
          fontFamily: 'Cormorant',
          color: '#fff',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        {
          id: 'p1-image-placeholder',
          type: 'image',
          src: 'https://images.unsplash.com/photo-1764520236419-8991e5ca8a23?w=400&h=300&fit=crop',
          x: 250,
          y: 400,
          width: 300,
          height: 200,
          objectFit: 'cover'
        }
      ]
    },

    // ========== PAGE 2: City Night Lights - Urban Romance ==========
    {
      id: 'page-2-city-night',
      backgroundColor: '#1A1A2E',
      elements: [
        {
          id: 'p2-bg-overlay',
          type: 'shape',
          shapeType: 'rectangle',
          fill: 'rgba(26, 26, 46, 0.8)',
          x: 0,
          y: 0,
          width: 800,
          height: 1000
        },
        {
          id: 'p2-main-image',
          type: 'image',
          src: 'https://images.unsplash.com/photo-1715483282597-fb57c8b0c28f?w=700&h=900&fit=crop',
          x: 50,
          y: 50,
          width: 700,
          height: 600,
          objectFit: 'cover'
        },
        {
          id: 'p2-title',
          type: 'text',
          content: 'City Lights & Us',
          x: 60,
          y: 680,
          width: 680,
          height: 90,
          fontSize: 48,
          fontFamily: 'Playfair Display',
          color: '#FFD700',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: 'p2-quote',
          type: 'text',
          content: '"Among millions of city lights, your eyes shine the brightest to me."',
          x: 80,
          y: 530,
          width: 640,
          height: 150,
          fontSize: 24,
          fontFamily: 'Dancing Script',
          color: '#FFB6C1',
          fontWeight: 'normal',
          textAlign: 'center',
          fontStyle: 'italic'
        }
      ]
    },

    // ========== PAGE 3: Rainy Caf Date - Cozy Moment ==========
    {
      id: 'page-3-rainy-cafe',
      backgroundColor: '#8B7355',
      elements: [
        {
          id: 'p3-bg-image',
          type: 'image',
          src: 'https://images.unsplash.com/photo-1663704455259-b55d664d7a3c?w=800&h=1000&fit=crop',
          x: 0,
          y: 0,
          width: 800,
          height: 1000,
          objectFit: 'cover'
        },
        {
          id: 'p3-text-box',
          type: 'shape',
          shapeType: 'rectangle',
          fill: 'rgba(255, 255, 255, 0.92)',
          x: 70,
          y: 420,
          width: 660,
          height: 250,
          borderRadius: 20
        },
        {
          id: 'p3-title',
          type: 'text',
          content: 'Rainy Day Caf',
          x: 100,
          y: 450,
          width: 600,
          height: 70,
          fontSize: 44,
          fontFamily: 'Cormorant',
          color: '#8B4513',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: 'p3-body',
          type: 'text',
          content: 'Rain tapping on the window, warm coffee in our hands, and endless conversations. These simple moments with you mean everything.',
          x: 100,
          y: 535,
          width: 600,
          height: 110,
          fontSize: 20,
          fontFamily: 'Poppins',
          color: '#5D4037',
          fontWeight: 'normal',
          textAlign: 'center'
        }
      ]
    },

    // ========== PAGE 4: Warm Indoor Moment - Intimate Connection ==========
    {
      id: 'page-4-indoor-warm',
      backgroundColor: '#FFF8DC',
      elements: [
        {
          id: 'p4-left-image',
          type: 'image',
          src: 'https://images.unsplash.com/photo-1764082497081-a023b72c9239?w=400&h=600&fit=crop',
          x: 50,
          y: 100,
          width: 320,
          height: 450,
          objectFit: 'cover',
          borderRadius: 15
        },
        {
          id: 'p4-right-content',
          type: 'shape',
          shapeType: 'rectangle',
          fill: '#FFE4E1',
          x: 400,
          y: 100,
          width: 350,
          height: 450,
          borderRadius: 15
        },
        {
          id: 'p4-title',
          type: 'text',
          content: 'Home is Where You Are',
          x: 420,
          y: 150,
          width: 310,
          height: 120,
          fontSize: 38,
          fontFamily: 'Playfair Display',
          color: '#8B4513',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: 'p4-text',
          type: 'text',
          content: 'In the quiet warmth of our little space, I found my forever. Your laugh, your touch, your presencehome.',
          x: 420,
          y: 300,
          width: 310,
          height: 200,
          fontSize: 20,
          fontFamily: 'Cormorant',
          color: '#6B4423',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        {
          id: 'p4-bottom-text',
          type: 'text',
          content: 'Every day with you feels like coming home.',
          x: 80,
          y: 650,
          width: 640,
          height: 100,
          fontSize: 26,
          fontFamily: 'Dancing Script',
          color: '#D2691E',
          fontWeight: 'bold',
          textAlign: 'center',
          fontStyle: 'italic'
        }
      ]
    },

    // ========== PAGE 5: Long Distance Love - Nostalgic Memory ==========
    {
      id: 'page-5-long-distance',
      backgroundColor: '#E6E6FA',
      elements: [
        {
          id: 'p5-bg-gradient',
          type: 'shape',
          shapeType: 'rectangle',
          fill: 'linear-gradient(to bottom, #E6E6FA, #DDA0DD)',
          x: 0,
          y: 0,
          width: 800,
          height: 1000
        },
        {
          id: 'p5-main-image',
          type: 'image',
          src: 'https://images.unsplash.com/photo-1754769440790-fd58bfbf2540?w=600&h=400&fit=crop',
          x: 100,
          y: 200,
          width: 600,
          height: 400,
          objectFit: 'cover',
          borderRadius: 20
        },
        {
          id: 'p5-title',
          type: 'text',
          content: 'Miles Apart, Hearts Together',
          x: 60,
          y: 80,
          width: 680,
          height: 90,
          fontSize: 46,
          fontFamily: 'Playfair Display',
          color: '#8B008B',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: 'p5-quote',
          type: 'text',
          content: '"Distance means so little when someone means so much."',
          x: 80,
          y: 650,
          width: 640,
          height: 100,
          fontSize: 28,
          fontFamily: 'Dancing Script',
          color: '#4B0082',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: 'p5-body',
          type: 'text',
          content: 'Though miles separate us, you are always in my thoughts, in my heart, in every beat. I carry you with me, always.',
          x: 80,
          y: 560,
          width: 640,
          height: 120,
          fontSize: 20,
          fontFamily: 'Poppins',
          color: '#6A5ACD',
          fontWeight: 'normal',
          textAlign: 'center'
        }
      ]
    },

    // ========== PAGE 6: Golden Hour Embrace - Magical Moment ==========
    {
      id: 'page-6-golden-hour',
      backgroundColor: '#FFE4B5',
      backgroundImage: 'https://images.unsplash.com/photo-1758810410699-2dc1daec82dc?w=800&h=1000&fit=crop',
      elements: [
        {
          id: 'p6-overlay',
          type: 'shape',
          shapeType: 'rectangle',
          fill: 'rgba(255, 215, 0, 0.2)',
          x: 0,
          y: 0,
          width: 800,
          height: 1000
        },
        {
          id: 'p6-title',
          type: 'text',
          content: 'Golden Hour Magic',
          x: 60,
          y: 420,
          width: 680,
          height: 90,
          fontSize: 56,
          fontFamily: 'Dancing Script',
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
        },
        {
          id: 'p6-text',
          type: 'text',
          content: 'In the golden glow, everything feels like a dream. You, me, this momentpure magic.',
          x: 80,
          y: 540,
          width: 640,
          height: 100,
          fontSize: 22,
          fontFamily: 'Cormorant',
          color: '#fff',
          fontWeight: 'normal',
          textAlign: 'center',
          textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
        }
      ]
    },

    // ========== PAGE 7: Holding Hands Walk - Simple Love ==========
    {
      id: 'page-7-hand-in-hand',
      backgroundColor: '#F0E68C',
      elements: [
        {
          id: 'p7-main-image',
          type: 'image',
          src: 'https://images.unsplash.com/photo-1769050350292-f990b8fc9e3b?w=700&h=500&fit=crop',
          x: 50,
          y: 150,
          width: 700,
          height: 500,
          objectFit: 'cover',
          borderRadius: 25
        },
        {
          id: 'p7-title',
          type: 'text',
          content: 'Hand in Hand',
          x: 60,
          y: 50,
          width: 680,
          height: 80,
          fontSize: 50,
          fontFamily: 'Playfair Display',
          color: '#8B4513',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: 'p7-text-box',
          type: 'shape',
          shapeType: 'rectangle',
          fill: '#FFF8DC',
          x: 80,
          y: 440,
          width: 640,
          height: 220,
          borderRadius: 20
        },
        {
          id: 'p7-body',
          type: 'text',
          content: 'Walking through life with your hand in mine. Every step we take together is a promiseto love, to support, to never let go.',
          x: 110,
          y: 480,
          width: 580,
          height: 140,
          fontSize: 22,
          fontFamily: 'Poppins',
          color: '#5D4037',
          fontWeight: 'normal',
          textAlign: 'center'
        }
      ]
    },

    // ========== PAGE 8: Embrace Love - Emotional Connection ==========
    {
      id: 'page-8-embrace',
      backgroundColor: '#FFE4E1',
      backgroundImage: 'https://images.unsplash.com/photo-1514846528774-8de9d4a07023?w=800&h=1000&fit=crop',
      elements: [
        {
          id: 'p8-gradient-overlay',
          type: 'shape',
          shapeType: 'rectangle',
          fill: 'rgba(255, 182, 193, 0.3)',
          x: 0,
          y: 0,
          width: 800,
          height: 1000
        },
        {
          id: 'p8-quote',
          type: 'text',
          content: '"In your arms, I found my safe haven."',
          x: 80,
          y: 100,
          width: 640,
          height: 150,
          fontSize: 42,
          fontFamily: 'Dancing Script',
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '2px 2px 10px rgba(0,0,0,0.6)'
        },
        {
          id: 'p8-text',
          type: 'text',
          content: 'Your embrace is where I feel most alive, most loved, most myself. In your arms, the world fades away and only we remain.',
          x: 80,
          y: 540,
          width: 640,
          height: 140,
          fontSize: 24,
          fontFamily: 'Cormorant',
          color: '#fff',
          fontWeight: 'normal',
          textAlign: 'center',
          textShadow: '1px 1px 6px rgba(0,0,0,0.5)'
        }
      ]
    },

    // ========== PAGE 9: Beach Sunset Romance - Serene Love ==========
    {
      id: 'page-9-beach-sunset',
      backgroundColor: '#FFB347',
      elements: [
        {
          id: 'p9-bg-image',
          type: 'image',
          src: 'https://images.unsplash.com/photo-1763129637045-0ff9297a58a9?w=800&h=1000&fit=crop',
          x: 0,
          y: 0,
          width: 800,
          height: 1000,
          objectFit: 'cover'
        },
        {
          id: 'p9-text-container',
          type: 'shape',
          shapeType: 'rectangle',
          fill: 'rgba(255, 255, 255, 0.85)',
          x: 100,
          y: 100,
          width: 600,
          height: 300,
          borderRadius: 30
        },
        {
          id: 'p9-title',
          type: 'text',
          content: 'Sunset by the Sea',
          x: 130,
          y: 150,
          width: 540,
          height: 90,
          fontSize: 48,
          fontFamily: 'Playfair Display',
          color: '#D2691E',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: 'p9-body',
          type: 'text',
          content: 'Waves whisper love songs, the sun paints the sky in our colors. Here, with you, everything is perfect.',
          x: 130,
          y: 260,
          width: 540,
          height: 110,
          fontSize: 22,
          fontFamily: 'Cormorant',
          color: '#8B4513',
          fontWeight: 'normal',
          textAlign: 'center'
        }
      ]
    },

    // ========== PAGE 10: Forever Promise - Ending with Hope ==========
    {
      id: 'page-10-forever',
      backgroundColor: '#FFE4E1',
      elements: [
        {
          id: 'p10-gradient',
          type: 'shape',
          shapeType: 'rectangle',
          fill: 'linear-gradient(135deg, #FFE4E1, #FFB6C1, #FFC0CB)',
          x: 0,
          y: 0,
          width: 800,
          height: 1000
        },
        {
          id: 'p10-center-image',
          type: 'image',
          src: 'https://images.unsplash.com/photo-1764520236419-8991e5ca8a23?w=500&h=500&fit=crop',
          x: 150,
          y: 200,
          width: 500,
          height: 500,
          objectFit: 'cover',
          borderRadius: 250
        },
        {
          id: 'p10-main-title',
          type: 'text',
          content: 'Forever & Always',
          x: 60,
          y: 80,
          width: 680,
          height: 100,
          fontSize: 62,
          fontFamily: 'Dancing Script',
          color: '#C71585',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: 'p10-promise',
          type: 'text',
          content: 'This is not the end, but the beginning of our forever. With every sunrise and every sunset, I choose you. Always.',
          x: 80,
          y: 450,
          width: 640,
          height: 160,
          fontSize: 26,
          fontFamily: 'Cormorant',
          color: '#8B4789',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: 'p10-ending',
          type: 'text',
          content: ' To infinity and beyond ',
          x: 80,
          y: 620,
          width: 640,
          height: 60,
          fontSize: 22,
          fontFamily: 'Dancing Script',
          color: '#FF1493',
          fontWeight: 'normal',
          textAlign: 'center',
          fontStyle: 'italic'
        }
      ]
    }
  ]
};
