const fs = require('fs');

function buildTemp1Pages() {
  const base = '/temp1/aatbio_com_image_export_May_';
  const pages = [
    { id: 'temp1-cover', imageUrl: '/temp1/aatbio_com_image_export_May_21_2026 (1).png', label: 'Bìa sách' },
    { id: 'temp1-p0', imageUrl: `${base}23_2026.png`, label: 'Trang 1' },
    ...Array.from({ length: 14 }, (_, i) => ({
      id: `temp1-p${i + 1}`,
      imageUrl: `${base}23_2026 (${i + 1}).png`,
      label: `Trang ${i + 2}`,
    })),
  ];
  return pages;
}

function buildTemp2Pages() {
  const base = '/temp2/aatbio_com_image_export_May_23_2026';
  const pages = [
    { id: 'temp2-cover', imageUrl: `${base}.png`, label: 'Bìa sách' },
    ...Array.from({ length: 32 }, (_, i) => ({
      id: `temp2-p${i + 1}`,
      imageUrl: `${base} (${i + 1}).png`,
      label: `Trang ${i + 1}`,
    })),
  ];
  return pages;
}

function buildTemp3Pages() {
  const base = '/temp3/aatbio_com_image_export_May_23_2026';
  const pages = [
    { id: 'temp3-cover', imageUrl: `${base}.png`, label: 'Bìa sách' },
    ...Array.from({ length: 31 }, (_, i) => ({
      id: `temp3-p${i + 1}`,
      imageUrl: `${base} (${i + 1}).png`,
      label: `Trang ${i + 1}`,
    })),
  ];
  return pages;
}

const localTemplates = [
  {
    id: 'local-template-1',
    name: 'Phong cách Vintage',
    description: '16 trang thiết kế phong cách vintage – hoài niệm và ấm áp, lý tưởng cho kỷ niệm đặc biệt.',
    thumbnail: '/temp1/aatbio_com_image_export_May_21_2026 (1).png',
    badge: 'bestseller',
    folderKey: 'temp1',
    pages: buildTemp1Pages(),
    uuid: 'a1b2c3d4-0000-0000-0000-000000000001'
  },
  {
    id: 'local-template-2',
    name: 'Phong cách Hiện đại',
    description: '33 trang thiết kế hiện đại – tinh tế, sang trọng với bố cục đa dạng và đầy cảm xúc.',
    thumbnail: '/temp2/aatbio_com_image_export_May_23_2026.png',
    badge: 'popular',
    folderKey: 'temp2',
    pages: buildTemp2Pages(),
    uuid: 'a1b2c3d4-0000-0000-0000-000000000002'
  },
  {
    id: 'local-template-3',
    name: 'Phong cách Tối giản',
    description: '32 trang thiết kế tối giản – tinh tế, tập trung vào nội dung và cảm xúc chính.',
    thumbnail: '/temp3/aatbio_com_image_export_May_23_2026.png',
    badge: 'new',
    folderKey: 'temp3',
    pages: buildTemp3Pages(),
    uuid: 'a1b2c3d4-0000-0000-0000-000000000003'
  },
];

let sql = `-- Lệnh tạo 3 template local vào database\n\n`;

// Giả sử lấy category "Tình yêu" (từ DB là fd28d922-2edc-3706-d6af-495b4381b988)
const catId = 'fd28d922-2edc-3706-d6af-495b4381b988';

for (const tpl of localTemplates) {
  sql += `-- Insert Template: ${tpl.name}\n`;
  sql += `INSERT INTO public.book_templates (id, category_id, name, description, cover_image_url, price, is_active)\n`;
  sql += `VALUES ('${tpl.uuid}', '${catId}', '${tpl.name}', '${tpl.description}', '${encodeURI(tpl.thumbnail)}', 299000, true)\n`;
  sql += `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, cover_image_url = EXCLUDED.cover_image_url;\n\n`;

  for (let i = 0; i < tpl.pages.length; i++) {
    const page = tpl.pages[i];
    const isCover = i === 0;
    const defaultContent = {
      id: `page-${i}`,
      backgroundColor: '#ffffff',
      backgroundImage: encodeURI(page.imageUrl),
      elements: []
    };
    const jsonStr = JSON.stringify(defaultContent).replace(/'/g, "''");
    
    // Tạo UUID hợp lệ (chỉ chứa a-f, 0-9). Sử dụng index của template (0, 1, 2) thay cho 'temp'
    const tplIndexStr = String(localTemplates.indexOf(tpl) + 1).padStart(4, '0');
    const pageUuid = `b1b2c3d4-${tplIndexStr}-0000-0000-${String(i+1).padStart(12, '0')}`;
    
    sql += `INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)\n`;
    sql += `VALUES ('${pageUuid}', '${tpl.uuid}', ${i + 1}, '${isCover ? 'COVER' : 'PAGE'}', '${jsonStr}'::jsonb)\n`;
    sql += `ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;\n`;
  }
  sql += `\n`;
}

fs.writeFileSync('insert_local_templates.sql', sql);
console.log('SQL generated at insert_local_templates.sql');
