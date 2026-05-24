// ============================================================
// Local Image Templates – sử dụng ảnh từ thư mục public/temp1, temp2, temp3
// Mỗi template là một phong cách thiết kế sách, mỗi ảnh = 1 trang
// ============================================================

export interface LocalTemplatePage {
  id: string;
  imageUrl: string;      // đường dẫn ảnh trang, ví dụ: /temp1/aatbio_...png
  label?: string;        // nhãn tùy chọn, ví dụ: "Trang 1", "Bìa"
}

export interface LocalTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;     // ảnh đại diện (trang đầu)
  badge?: 'new' | 'bestseller' | 'popular';
  folderKey: 'temp1' | 'temp2' | 'temp3';
  pages: LocalTemplatePage[];
}

// ── Helper: tạo danh sách trang từ folder ──────────────────────────────────
// temp1: 16 files → trang bìa + 15 trang nội dung
// temp2: 33 files → trang bìa + 32 trang nội dung
// temp3: 32 files → trang bìa + 31 trang nội dung

function buildTemp1Pages(): LocalTemplatePage[] {
  const base = '/temp1/aatbio_com_image_export_May_';
  // File đặc biệt: May_21_2026 (1).png là file đầu tiên (bìa)
  const pages: LocalTemplatePage[] = [
    {
      id: 'temp1-cover',
      imageUrl: '/temp1/aatbio_com_image_export_May_21_2026 (1).png',
      label: 'Bìa sách',
    },
    {
      id: 'temp1-p0',
      imageUrl: `${base}23_2026.png`,
      label: 'Trang 1',
    },
    ...Array.from({ length: 14 }, (_, i) => ({
      id: `temp1-p${i + 1}`,
      imageUrl: `${base}23_2026 (${i + 1}).png`,
      label: `Trang ${i + 2}`,
    })),
  ];
  return pages;
}

function buildTemp2Pages(): LocalTemplatePage[] {
  const base = '/temp2/aatbio_com_image_export_May_23_2026';
  const pages: LocalTemplatePage[] = [
    {
      id: 'temp2-cover',
      imageUrl: `${base}.png`,
      label: 'Bìa sách',
    },
    ...Array.from({ length: 32 }, (_, i) => ({
      id: `temp2-p${i + 1}`,
      imageUrl: `${base} (${i + 1}).png`,
      label: `Trang ${i + 1}`,
    })),
  ];
  return pages;
}

function buildTemp3Pages(): LocalTemplatePage[] {
  const base = '/temp3/aatbio_com_image_export_May_23_2026';
  const pages: LocalTemplatePage[] = [
    {
      id: 'temp3-cover',
      imageUrl: `${base}.png`,
      label: 'Bìa sách',
    },
    ...Array.from({ length: 31 }, (_, i) => ({
      id: `temp3-p${i + 1}`,
      imageUrl: `${base} (${i + 1}).png`,
      label: `Trang ${i + 1}`,
    })),
  ];
  return pages;
}

// ── Danh sách 3 template ───────────────────────────────────────────────────
export const localTemplates: LocalTemplate[] = [
  {
    id: 'local-template-1',
    name: 'Phong cách Vintage',
    description: '16 trang thiết kế phong cách vintage – hoài niệm và ấm áp, lý tưởng cho kỷ niệm đặc biệt.',
    thumbnail: '/temp1/aatbio_com_image_export_May_21_2026 (1).png',
    badge: 'bestseller',
    folderKey: 'temp1',
    pages: buildTemp1Pages(),
  },
  {
    id: 'local-template-2',
    name: 'Phong cách Hiện đại',
    description: '33 trang thiết kế hiện đại – tinh tế, sang trọng với bố cục đa dạng và đầy cảm xúc.',
    thumbnail: '/temp2/aatbio_com_image_export_May_23_2026.png',
    badge: 'popular',
    folderKey: 'temp2',
    pages: buildTemp2Pages(),
  },
  {
    id: 'local-template-3',
    name: 'Phong cách Tối giản',
    description: '32 trang thiết kế tối giản – tinh tế, tập trung vào nội dung và cảm xúc chính.',
    thumbnail: '/temp3/aatbio_com_image_export_May_23_2026.png',
    badge: 'new',
    folderKey: 'temp3',
    pages: buildTemp3Pages(),
  },
];
