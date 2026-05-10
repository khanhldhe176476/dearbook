import { PageElement } from '../types/editor';

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  elements: PageElement[];
  backgroundColor?: string;
}

export const pageTemplates: PageTemplate[] = [
  {
    id: 'text-center',
    name: 'Văn bản trung tâm',
    description: 'Một khối văn bản lớn nằm giữa trang',
    thumbnail: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=200&h=300&fit=crop',
    elements: [
      {
        id: 'temp-text-1',
        type: 'text',
        content: 'Câu chuyện của chúng ta',
        x: 50,
        y: 250,
        width: 300,
        height: 100,
        fontSize: 32,
        fontFamily: 'Dancing Script',
        color: '#3A2E28',
        textAlign: 'center',
        zIndex: 1,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true
      }
    ],
    backgroundColor: '#FAFAF8'
  },
  {
    id: 'image-full',
    name: 'Ảnh tràn viền',
    description: 'Một hình ảnh lớn chiếm toàn bộ không gian trang',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=300&fit=crop',
    elements: [
      {
        id: 'temp-img-1',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop',
        x: 0,
        y: 0,
        width: 400,
        height: 600,
        zIndex: 1,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        objectFit: 'cover'
      }
    ]
  },
  {
    id: 'classic-photo-text',
    name: 'Ảnh & Chữ cổ điển',
    description: 'Ảnh ở trên và văn bản mô tả ở dưới',
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=300&fit=crop',
    elements: [
      {
        id: 'temp-img-1',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=800&fit=crop',
        x: 40,
        y: 60,
        width: 320,
        height: 320,
        zIndex: 1,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        objectFit: 'cover'
      },
      {
        id: 'temp-text-1',
        type: 'text',
        content: 'Khoảnh khắc đáng nhớ',
        x: 40,
        y: 420,
        width: 320,
        height: 120,
        fontSize: 20,
        fontFamily: 'Poppins',
        color: '#5A5049',
        textAlign: 'center',
        zIndex: 2,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true
      }
    ],
    backgroundColor: '#FFFFFF'
  },
  {
    id: 'scrapbook',
    name: 'Scrapbook',
    description: 'Phong cách cắt dán với nhiều lớp',
    thumbnail: 'https://images.unsplash.com/photo-1531685229751-783f1e39196b?w=200&h=300&fit=crop',
    elements: [
      {
        id: 'temp-shape-1',
        type: 'shape',
        shape: 'rectangle',
        fill: '#F5F2EE',
        x: 20,
        y: 20,
        width: 360,
        height: 560,
        zIndex: 1,
        rotation: 0,
        opacity: 1,
        locked: true,
        visible: true
      },
      {
        id: 'temp-img-1',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1531685229751-783f1e39196b?w=400&h=400&fit=crop',
        x: 50,
        y: 80,
        width: 300,
        height: 300,
        zIndex: 2,
        rotation: -3,
        opacity: 1,
        locked: false,
        visible: true,
        objectFit: 'cover'
      },
      {
        id: 'temp-sticker-1',
        type: 'sticker',
        emoji: '✨',
        x: 320,
        y: 50,
        width: 60,
        height: 60,
        zIndex: 3,
        rotation: 15,
        opacity: 1,
        locked: false,
        visible: true
      },
      {
        id: 'temp-text-1',
        type: 'text',
        content: 'Mãi mãi bên nhau',
        x: 50,
        y: 420,
        width: 300,
        height: 80,
        fontSize: 28,
        fontFamily: 'Dancing Script',
        color: '#E11D48',
        textAlign: 'center',
        zIndex: 4,
        rotation: 2,
        opacity: 1,
        locked: false,
        visible: true
      }
    ],
    backgroundColor: '#EDE9E3'
  },
  {
    id: 'quote-page',
    name: 'Trang Trích dẫn',
    description: 'Một câu nói hay trên nền màu nghệ thuật',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&h=300&fit=crop',
    elements: [
      {
        id: 'temp-shape-1',
        type: 'shape',
        shape: 'heart',
        fill: 'rgba(225, 29, 72, 0.1)',
        x: 50,
        y: 150,
        width: 300,
        height: 300,
        zIndex: 1,
        rotation: 0,
        opacity: 1,
        locked: true,
        visible: true
      },
      {
        id: 'temp-text-1',
        type: 'text',
        content: '"Yêu thương không phải là nhìn nhau, mà là cùng nhìn về một hướng"',
        x: 40,
        y: 200,
        width: 320,
        height: 200,
        fontSize: 24,
        fontFamily: 'Dancing Script',
        color: '#E11D48',
        textAlign: 'center',
        zIndex: 2,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true
      },
      {
        id: 'temp-text-2',
        type: 'text',
        content: '— Antoine de Saint-Exupéry',
        x: 40,
        y: 400,
        width: 320,
        height: 40,
        fontSize: 14,
        fontFamily: 'Poppins',
        color: '#7A6F66',
        textAlign: 'center',
        zIndex: 2,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true
      }
    ],
    backgroundColor: '#FFF1F2'
  },
  {
    id: 'grid-3-photos',
    name: 'Lưới 3 ảnh',
    description: 'Bố cục hiện đại với 3 khung hình khác nhau',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=300&fit=crop',
    elements: [
      {
        id: 'temp-img-1',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop',
        x: 20,
        y: 20,
        width: 170,
        height: 250,
        zIndex: 1,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        objectFit: 'cover'
      },
      {
        id: 'temp-img-2',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
        x: 210,
        y: 20,
        width: 170,
        height: 250,
        zIndex: 1,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        objectFit: 'cover'
      },
      {
        id: 'temp-img-3',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1501854140801-50d0167425e2?w=400&h=400&fit=crop',
        x: 20,
        y: 290,
        width: 360,
        height: 200,
        zIndex: 1,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        objectFit: 'cover'
      },
      {
        id: 'temp-text-1',
        type: 'text',
        content: 'HÀNH TRÌNH KHÁM PHÁ',
        x: 20,
        y: 520,
        width: 360,
        height: 40,
        fontSize: 18,
        fontFamily: 'Inter',
        color: '#1C1715',
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 4,
        zIndex: 2,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true
      }
    ],
    backgroundColor: '#FFFFFF'
  },
  {
    id: 'polaroid-style',
    name: 'Phong cách Polaroid',
    description: 'Ảnh với viền trắng cổ điển và chữ viết tay',
    thumbnail: 'https://images.unsplash.com/photo-1520156584121-4b74c5ad406b?w=200&h=300&fit=crop',
    elements: [
      {
        id: 'temp-shape-1',
        type: 'shape',
        shape: 'rectangle',
        fill: '#FFFFFF',
        x: 40,
        y: 60,
        width: 320,
        height: 400,
        zIndex: 1,
        rotation: 2,
        opacity: 1,
        locked: false,
        visible: true
      },
      {
        id: 'temp-img-1',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1520156584121-4b74c5ad406b?w=600&h=600&fit=crop',
        x: 60,
        y: 80,
        width: 280,
        height: 280,
        zIndex: 2,
        rotation: 2,
        opacity: 1,
        locked: false,
        visible: true,
        objectFit: 'cover'
      },
      {
        id: 'temp-text-1',
        type: 'text',
        content: 'Seoul, 2024',
        x: 60,
        y: 380,
        width: 280,
        height: 60,
        fontSize: 22,
        fontFamily: 'Dancing Script',
        color: '#333333',
        textAlign: 'center',
        zIndex: 3,
        rotation: 2,
        opacity: 1,
        locked: false,
        visible: true
      }
    ],
    backgroundColor: '#F5F5F5'
  },
  {
    id: 'scrapbook-vintage-camera',
    name: 'Vintage Scrapbook',
    description: 'Bố cục đa khung hình với phong cách giấy xé và máy ảnh cổ điển',
    thumbnail: 'https://images.unsplash.com/photo-1526285845740-96edca63f03a?w=200&h=300&fit=crop',
    elements: [
      { id: 'bg-1', type: 'shape', shape: 'rectangle', fill: '#D2B48C', x: 0, y: 0, width: 400, height: 150, zIndex: 1, rotation: 0, opacity: 1, locked: true, visible: true },
      { id: 'paper-1', type: 'shape', shape: 'rectangle', fill: '#F5F2EE', x: 20, y: 130, width: 360, height: 450, zIndex: 2, rotation: 1, opacity: 1, locked: true, visible: true },
      { id: 'img-main', type: 'image', src: 'https://images.unsplash.com/photo-1526285845740-96edca63f03a?w=600&h=400&fit=crop', x: 40, y: 40, width: 320, height: 220, zIndex: 3, rotation: -2, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'img-small-1', type: 'image', src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop', x: 40, y: 280, width: 140, height: 140, zIndex: 4, rotation: 3, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'img-small-2', type: 'image', src: 'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?w=300&h=300&fit=crop', x: 220, y: 280, width: 140, height: 140, zIndex: 4, rotation: -1, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'sticker-camera', type: 'icon', iconName: 'Camera', color: '#3A2E28', x: 280, y: 480, width: 80, height: 80, zIndex: 5, rotation: 10, opacity: 1, locked: false, visible: true },
      { id: 'text-1', type: 'text', content: 'Kỷ niệm khó quên', x: 40, y: 450, width: 220, height: 60, fontSize: 24, fontFamily: 'Dancing Script', color: '#5A5049', textAlign: 'left', zIndex: 5, rotation: 0, opacity: 1, locked: false, visible: true }
    ],
    backgroundColor: '#E8D5C4'
  },
  {
    id: 'scrapbook-road-trip',
    name: 'Road Trip Journey',
    description: 'Phong cách hành trình với xe cổ và các mẩu giấy dán',
    thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=300&fit=crop',
    elements: [
      { id: 'bg-grid', type: 'shape', shape: 'rectangle', fill: '#F0F9FF', x: 0, y: 0, width: 400, height: 600, zIndex: 1, rotation: 0, opacity: 1, locked: true, visible: true },
      { id: 'paper-torn', type: 'shape', shape: 'rectangle', fill: '#FEF3C7', x: 0, y: 450, width: 400, height: 150, zIndex: 2, rotation: -2, opacity: 1, locked: true, visible: true },
      { id: 'img-1', type: 'image', src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=400&fit=crop', x: 30, y: 50, width: 250, height: 180, zIndex: 3, rotation: -3, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'img-2', type: 'image', src: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=300&h=400&fit=crop', x: 230, y: 220, width: 140, height: 200, zIndex: 4, rotation: 2, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'sticker-car', type: 'icon', iconName: 'Car', color: '#1E3A8A', x: 40, y: 480, width: 100, height: 100, zIndex: 5, rotation: 0, opacity: 1, locked: false, visible: true },
      { id: 'text-title', type: 'text', content: 'ON THE ROAD', x: 160, y: 500, width: 200, height: 50, fontSize: 28, fontFamily: 'Inter', fontWeight: 'bold', color: '#1E3A8A', textAlign: 'center', letterSpacing: 2, zIndex: 5, rotation: 0, opacity: 1, locked: false, visible: true }
    ],
    backgroundColor: '#FFFFFF'
  },
  {
    id: 'journal-letter',
    name: 'Thư tay & Báo cũ',
    description: 'Trang nhật ký với phong cách báo cũ và không gian viết thư',
    thumbnail: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=200&h=300&fit=crop',
    elements: [
      { id: 'bg-paper', type: 'shape', shape: 'rectangle', fill: '#FDFCF0', x: 0, y: 0, width: 400, height: 600, zIndex: 1, rotation: 0, opacity: 1, locked: true, visible: true },
      { id: 'news-clip', type: 'image', src: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop', x: 20, y: 400, width: 180, height: 180, zIndex: 2, rotation: -5, opacity: 0.8, locked: false, visible: true, objectFit: 'cover' },
      { id: 'envelope', type: 'icon', iconName: 'Mail', color: '#8B4513', x: 40, y: 40, width: 120, height: 100, zIndex: 3, rotation: 10, opacity: 0.9, locked: false, visible: true },
      { id: 'text-main', type: 'text', content: 'Gửi người tôi yêu...\n\nNhững dòng chữ này được viết từ tận đáy lòng, gửi gắm tất cả những kỷ niệm đẹp nhất của chúng ta qua năm tháng.', x: 180, y: 100, width: 200, height: 400, fontSize: 18, fontFamily: 'Dancing Script', color: '#3A2E28', textAlign: 'left', zIndex: 4, rotation: 0, opacity: 1, locked: false, visible: true }
    ],
    backgroundColor: '#F5F5DC'
  },
  {
    id: 'memories-2025',
    name: 'Memories 2025',
    description: 'Dải phim và sticker hiện đại cho những kỷ niệm mới',
    thumbnail: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=200&h=300&fit=crop',
    elements: [
      { id: 'bg-dark', type: 'shape', shape: 'rectangle', fill: '#3A2E28', x: 0, y: 0, width: 400, height: 600, zIndex: 1, rotation: 0, opacity: 1, locked: true, visible: true },
      { id: 'film-strip', type: 'shape', shape: 'rectangle', fill: '#1A1A1A', x: 320, y: 0, width: 80, height: 600, zIndex: 2, rotation: 0, opacity: 1, locked: true, visible: true },
      { id: 'img-1', type: 'image', src: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=300&h=300&fit=crop', x: 40, y: 100, width: 240, height: 180, zIndex: 3, rotation: -5, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'img-2', type: 'image', src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=300&fit=crop', x: 50, y: 320, width: 240, height: 180, zIndex: 3, rotation: 3, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'text-2025', type: 'text', content: '2025', x: 20, y: 20, width: 150, height: 60, fontSize: 48, fontFamily: 'Inter', fontWeight: '900', color: '#FF6B6B', textAlign: 'left', zIndex: 4, rotation: 0, opacity: 1, locked: false, visible: true },
      { id: 'text-memories', type: 'text', content: 'Memories', x: 120, y: 40, width: 200, height: 50, fontSize: 32, fontFamily: 'Dancing Script', color: '#FFFFFF', textAlign: 'left', zIndex: 4, rotation: -5, opacity: 1, locked: false, visible: true }
    ],
    backgroundColor: '#2D241E'
  },
  {
    id: 'travel-van-picnic',
    name: 'Travel & Picnic',
    description: 'Bố cục khung cửa sổ và xe van cho những chuyến đi dã ngoại',
    thumbnail: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=200&h=300&fit=crop',
    elements: [
      { id: 'bg-paper', type: 'shape', shape: 'rectangle', fill: '#F5E6D3', x: 0, y: 0, width: 400, height: 600, zIndex: 1, rotation: 0, opacity: 1, locked: true, visible: true },
      { id: 'picnic-pattern', type: 'shape', shape: 'rectangle', fill: 'repeating-linear-gradient(45deg, #FF6B6B, #FF6B6B 10px, #FFFFFF 10px, #FFFFFF 20px)', x: 0, y: 350, width: 400, height: 150, zIndex: 2, rotation: 0, opacity: 0.3, locked: true, visible: true },
      { id: 'window-frame', type: 'shape', shape: 'rectangle', fill: '#FFFFFF', x: 50, y: 40, width: 300, height: 300, zIndex: 3, rotation: 0, opacity: 1, locked: true, visible: true },
      { id: 'img-1', type: 'image', src: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=200&h=200&fit=crop', x: 60, y: 50, width: 135, height: 135, zIndex: 4, rotation: 0, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'img-2', type: 'image', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop', x: 205, y: 50, width: 135, height: 135, zIndex: 4, rotation: 0, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'img-3', type: 'image', src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=200&h=200&fit=crop', x: 60, y: 195, width: 135, height: 135, zIndex: 4, rotation: 0, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'img-4', type: 'image', src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&h=200&fit=crop', x: 205, y: 195, width: 135, height: 135, zIndex: 4, rotation: 0, opacity: 1, locked: false, visible: true, objectFit: 'cover' },
      { id: 'sticker-sun', type: 'icon', iconName: 'Sun', color: '#F59E0B', x: 20, y: 20, width: 60, height: 60, zIndex: 5, rotation: 0, opacity: 1, locked: false, visible: true },
      { id: 'text-bottom', type: 'text', content: 'Chuyến đi của thanh xuân', x: 50, y: 520, width: 300, height: 50, fontSize: 24, fontFamily: 'Dancing Script', color: '#7C2D12', textAlign: 'center', zIndex: 5, rotation: 0, opacity: 1, locked: false, visible: true }
    ],
    backgroundColor: '#FDF8F3'
  }
];
