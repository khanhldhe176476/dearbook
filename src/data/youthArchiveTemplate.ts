import { BookPage } from '../App';

/**
 * Youth Archive Template
 * Trang 1: Layout scrapbook với nền nâu, polaroid, filmstrip
 * Người dùng upload ảnh vào các khung trống
 */

// Youth Archive cover page - matching the ya-page-1.jpg layout
export const youthArchiveCover: BookPage = {
  id: 'ya-cover',
  backgroundColor: '#D1C6BA',
  backgroundImage: '/templates/ya-page-1.jpg',
  elements: [
    {
      id: 'ya-win-1',
      type: 'image',
      src: '',
      x: 102, 
      y: 40, 
      width: 84,
      height: 94,
      rotation: -4.5,
      objectFit: 'cover',
      zIndex: 1,
      isUploadSlot: true,
      uploadLabel: 'Cửa sổ 1'
    },
    {
      id: 'ya-win-2',
      type: 'image',
      src: '',
      x: 206, 
      y: 28, 
      width: 84,
      height: 94,
      rotation: -4.5,
      objectFit: 'cover',
      zIndex: 1,
      isUploadSlot: true,
      uploadLabel: 'Cửa sổ 2'
    },
    {
      id: 'ya-win-3',
      type: 'image',
      src: '',
      x: 108, 
      y: 154, 
      width: 84,
      height: 94,
      rotation: -4.5,
      objectFit: 'cover',
      zIndex: 1,
      isUploadSlot: true,
      uploadLabel: 'Cửa sổ 3'
    },
    {
      id: 'ya-win-4',
      type: 'image',
      src: '',
      x: 212, 
      y: 142, 
      width: 84,
      height: 94,
      rotation: -4.5,
      objectFit: 'cover',
      zIndex: 1,
      isUploadSlot: true,
      uploadLabel: 'Cửa sổ 4'
    },
    {
      id: 'ya-pol-1',
      type: 'image',
      src: '',
      x: 40, 
      y: 400, 
      width: 88, 
      height: 82, 
      rotation: -10,
      objectFit: 'cover',
      zIndex: 2,
      isUploadSlot: true,
      uploadLabel: 'Polaroid 1'
    },
    {
      id: 'ya-pol-2',
      type: 'image',
      src: '',
      x: 156, 
      y: 340, 
      width: 88,
      height: 82,
      rotation: 5,
      objectFit: 'cover',
      zIndex: 2,
      isUploadSlot: true,
      uploadLabel: 'Polaroid 2'
    },
    {
      id: 'ya-pol-3',
      type: 'image',
      src: '',
      x: 244, // 61% of 400
      y: 402, // 67% of 600
      width: 96,
      height: 90,
      rotation: -3,
      objectFit: 'cover',
      zIndex: 2,
      isUploadSlot: true,
      uploadLabel: 'Polaroid 3'
    }
  ]
};

// Inner pages for Youth Archive
export const youthArchivePages: BookPage[] = [
  // Page 2: ya-page-2.png layout
  {
    id: 'ya-page-2',
    backgroundColor: '#D1C6BA',
    backgroundImage: '/templates/ya-page-2.png',
    elements: [
      {
        id: 'ya2-main',
        type: 'image',
        src: '',
        x: 76, // 19% of 400
        y: 90, // 15% of 600
        width: 248, // 62% of 400
        height: 174, // 29% of 600
        objectFit: 'cover',
        zIndex: 1,
        isUploadSlot: true,
        uploadLabel: 'Ảnh chính'
      },
      {
        id: 'ya2-sq',
        type: 'image',
        src: '',
        x: 64, // 16% of 400
        y: 300, // 50% of 600
        width: 120, // 30% of 400
        height: 120, // 20% of 600
        objectFit: 'cover',
        zIndex: 1,
        isUploadSlot: true,
        uploadLabel: 'Khung vuông'
      },
      {
        id: 'ya2-curly',
        type: 'image',
        src: '',
        x: 76, // 19% of 400
        y: 456, // 76% of 600
        width: 104, // 26% of 400
        height: 96, // 16% of 600
        objectFit: 'cover',
        zIndex: 1,
        isUploadSlot: true,
        uploadLabel: 'Khung viền'
      },
      {
        id: 'ya2-film-1',
        type: 'image',
        src: '',
        x: 220, // 55% of 400
        y: 306, // 51% of 600
        width: 116, // 29% of 400
        height: 108, // 18% of 600
        objectFit: 'cover',
        zIndex: 1,
        isUploadSlot: true,
        uploadLabel: 'Film 1'
      },
      {
        id: 'ya2-film-2',
        type: 'image',
        src: '',
        x: 220,
        y: 426, // 71% of 600
        width: 116,
        height: 108,
        objectFit: 'cover',
        zIndex: 1,
        isUploadSlot: true,
        uploadLabel: 'Film 2'
      }
    ]
  },

  // Page 3: Single large photo + quote
  {
    id: 'ya-page-3',
    backgroundColor: '#6B4A2A',
    elements: [
      {
        id: 'ya3-photo',
        type: 'image',
        src: '',
        x: 30,
        y: 40,
        width: 340,
        height: 380,
        objectFit: 'cover',
        borderRadius: 12,
        zIndex: 1,
        isUploadSlot: true,
        uploadLabel: 'Ảnh chính',
      },
      {
        id: 'ya3-polaroid-frame',
        type: 'shape',
        fill: 'rgba(255,255,255,0.08)',
        x: 22,
        y: 32,
        width: 356,
        height: 396,
        borderRadius: 14,
        zIndex: 0,
        stroke: 'rgba(255,255,255,0.25)',
        strokeWidth: 2,
      },
      {
        id: 'ya3-quote',
        type: 'text',
        content: '"Tuổi trẻ là khi bạn dám ước mơ và dám sống hết mình."',
        x: 20,
        y: 445,
        width: 360,
        height: 80,
        fontFamily: 'Dancing Script',
        fontSize: 20,
        color: '#F5E6D0',
        textAlign: 'center',
        fontStyle: 'italic',
        zIndex: 2,
      },
      {
        id: 'ya3-year',
        type: 'text',
        content: '— Youth Archive 2025',
        x: 20,
        y: 530,
        width: 360,
        height: 40,
        fontFamily: 'Poppins',
        fontSize: 13,
        color: '#C4956A',
        textAlign: 'center',
        zIndex: 2,
      },
      { id: 'ya3-stk1', type: 'sticker', content: '✨', emoji: '✨', x: 15, y: 575, width: 35, height: 35, zIndex: 3 },
      { id: 'ya3-stk2', type: 'sticker', content: '✨', emoji: '✨', x: 350, y: 575, width: 35, height: 35, zIndex: 3 },
    ],
  },

  // Page 4: Timeline / film strip style
  {
    id: 'ya-page-4',
    backgroundColor: '#1A1A1A',
    elements: [
      {
        id: 'ya4-title',
        type: 'text',
        content: 'The Journey',
        x: 20,
        y: 20,
        width: 360,
        height: 55,
        fontFamily: 'Dancing Script',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#F5E6D0',
        textAlign: 'center',
        zIndex: 1,
      },
      // Horizontal film strip
      {
        id: 'ya4-strip-bg',
        type: 'shape',
        fill: '#0A0A0A',
        x: 0,
        y: 80,
        width: 400,
        height: 120,
        zIndex: 1,
      },
      // Film holes
      { id: 'ya4-h1', type: 'shape', fill: '#333', x: 8, y: 86, width: 10, height: 10, borderRadius: 2, zIndex: 3 },
      { id: 'ya4-h2', type: 'shape', fill: '#333', x: 8, y: 108, width: 10, height: 10, borderRadius: 2, zIndex: 3 },
      { id: 'ya4-h3', type: 'shape', fill: '#333', x: 8, y: 130, width: 10, height: 10, borderRadius: 2, zIndex: 3 },
      { id: 'ya4-h4', type: 'shape', fill: '#333', x: 8, y: 152, width: 10, height: 10, borderRadius: 2, zIndex: 3 },
      { id: 'ya4-h5', type: 'shape', fill: '#333', x: 382, y: 86, width: 10, height: 10, borderRadius: 2, zIndex: 3 },
      { id: 'ya4-h6', type: 'shape', fill: '#333', x: 382, y: 108, width: 10, height: 10, borderRadius: 2, zIndex: 3 },
      { id: 'ya4-h7', type: 'shape', fill: '#333', x: 382, y: 130, width: 10, height: 10, borderRadius: 2, zIndex: 3 },
      { id: 'ya4-h8', type: 'shape', fill: '#333', x: 382, y: 152, width: 10, height: 10, borderRadius: 2, zIndex: 3 },
      // Film photos in strip
      { id: 'ya4-fp1', type: 'image', src: '', x: 25, y: 85, width: 82, height: 108, objectFit: 'cover', zIndex: 2, isUploadSlot: true, uploadLabel: 'Strip 1' },
      { id: 'ya4-fp2', type: 'image', src: '', x: 115, y: 85, width: 82, height: 108, objectFit: 'cover', zIndex: 2, isUploadSlot: true, uploadLabel: 'Strip 2' },
      { id: 'ya4-fp3', type: 'image', src: '', x: 205, y: 85, width: 82, height: 108, objectFit: 'cover', zIndex: 2, isUploadSlot: true, uploadLabel: 'Strip 3' },
      { id: 'ya4-fp4', type: 'image', src: '', x: 295, y: 85, width: 78, height: 108, objectFit: 'cover', zIndex: 2, isUploadSlot: true, uploadLabel: 'Strip 4' },
      // Bottom section: text
      {
        id: 'ya4-text',
        type: 'text',
        content: 'Ghi lại hành trình của bạn...',
        x: 20,
        y: 225,
        width: 360,
        height: 50,
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#AAA',
        textAlign: 'center',
        fontStyle: 'italic',
        zIndex: 2,
      },
      // 2 more photo spots below
      { id: 'ya4-p5', type: 'image', src: '', x: 20, y: 285, width: 170, height: 170, objectFit: 'cover', borderRadius: 10, zIndex: 2, isUploadSlot: true, uploadLabel: 'Ảnh lớn 1' },
      { id: 'ya4-p6', type: 'image', src: '', x: 210, y: 285, width: 170, height: 170, objectFit: 'cover', borderRadius: 10, zIndex: 2, isUploadSlot: true, uploadLabel: 'Ảnh lớn 2' },
      { id: 'ya4-stk1', type: 'sticker', content: '🎞️', emoji: '🎞️', x: 170, y: 475, width: 60, height: 40, zIndex: 3 },
    ],
  },

  // Page 5: Message / dedication page
  {
    id: 'ya-page-5',
    backgroundColor: '#F5EFE6',
    elements: [
      { id: 'ya5-stk1', type: 'sticker', content: '📸', emoji: '📸', x: 180, y: 30, width: 50, height: 50, zIndex: 1 },
      {
        id: 'ya5-title',
        type: 'text',
        content: 'Ghi lại khoảnh khắc',
        x: 20,
        y: 90,
        width: 360,
        height: 55,
        fontFamily: 'Dancing Script',
        fontSize: 30,
        fontWeight: 'bold',
        color: '#5C3D20',
        textAlign: 'center',
        zIndex: 1,
      },
      // Wide photo
      { id: 'ya5-photo1', type: 'image', src: '', x: 20, y: 155, width: 360, height: 220, objectFit: 'cover', borderRadius: 12, zIndex: 2, isUploadSlot: true, uploadLabel: 'Ảnh kỷ niệm' },
      // Message text
      {
        id: 'ya5-msg',
        type: 'text',
        content: 'Viết điều bạn muốn ghi nhớ về khoảnh khắc này...',
        x: 20,
        y: 390,
        width: 360,
        height: 100,
        fontFamily: 'Poppins',
        fontSize: 15,
        color: '#7A5C3A',
        textAlign: 'center',
        fontStyle: 'italic',
        zIndex: 2,
      },
      {
        id: 'ya5-date',
        type: 'text',
        content: '📅 Ngày... tháng... năm...',
        x: 20,
        y: 500,
        width: 360,
        height: 40,
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#C4956A',
        textAlign: 'center',
        zIndex: 2,
      },
      { id: 'ya5-stk2', type: 'sticker', content: '⭐', emoji: '⭐', x: 20, y: 560, width: 35, height: 35, zIndex: 3 },
      { id: 'ya5-stk3', type: 'sticker', content: '🌸', emoji: '🌸', x: 345, y: 560, width: 35, height: 35, zIndex: 3 },
    ],
  },

  // Page 6: 2025 custom template
  {
    id: 'ya-page-6',
    backgroundColor: '#E5DFD5',
    overlay: { type: 'image', value: '/templates/aatbio_com_image_export_May_21_2026.png' },
    elements: [
      { id: 'ya6-camera', type: 'image', src: '', x: 124, y: 144, width: 104, height: 78, objectFit: 'cover', rotation: -2, zIndex: 1, isUploadSlot: true, uploadLabel: 'Camera' },
      { id: 'ya6-pol1', type: 'image', src: '', x: 12, y: 306, width: 104, height: 126, objectFit: 'cover', rotation: -5, zIndex: 1, isUploadSlot: true, uploadLabel: 'Polaroid 1' },
      { id: 'ya6-pol2', type: 'image', src: '', x: 124, y: 318, width: 104, height: 126, objectFit: 'cover', rotation: 8, zIndex: 1, isUploadSlot: true, uploadLabel: 'Polaroid 2' },
      { id: 'ya6-film1', type: 'image', src: '', x: 320, y: 114, width: 72, height: 84, objectFit: 'cover', rotation: -6, zIndex: 1, isUploadSlot: true, uploadLabel: 'Film 1' },
      { id: 'ya6-film2', type: 'image', src: '', x: 312, y: 216, width: 72, height: 84, objectFit: 'cover', rotation: -6, zIndex: 1, isUploadSlot: true, uploadLabel: 'Film 2' },
      { id: 'ya6-film3', type: 'image', src: '', x: 304, y: 318, width: 72, height: 84, objectFit: 'cover', rotation: -6, zIndex: 1, isUploadSlot: true, uploadLabel: 'Film 3' },
    ],
  },
];

// Full template definition
export const youthArchiveTemplate = {
  id: 'youth-archive-memories',
  name: 'Youth Archive',
  theme: 'friendship' as const,
  badge: 'new' as const,
  thumbnail: '/templates/youth-archive-thumbnail.png',
  cover: youthArchiveCover,
  pages: youthArchivePages,
};
