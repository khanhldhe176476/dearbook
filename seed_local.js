const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zncvhhibbnpcihsualen.supabase.co';
const supabaseKey = 'sb_publishable_bIGjVwDVbjCgSbSqz92CQw_3SqS12_A';
const supabase = createClient(supabaseUrl, supabaseKey);

// Helpers from localTemplates.ts
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

async function seedLocalTemplates() {
  console.log('Fetching categories...');
  const { data: categories } = await supabase.from('book_categories').select('id, name');
  // Just use the first category (e.g. Tình yêu)
  const categoryId = categories && categories.length > 0 ? categories[0].id : null;
  if (!categoryId) {
    console.error('No category found, cannot insert templates.');
    return;
  }

  for (const tpl of localTemplates) {
    console.log(`Inserting template: ${tpl.name}...`);
    
    // Check if exists
    const { data: existing } = await supabase.from('book_templates').select('id').eq('name', tpl.name).single();
    let templateId = existing ? existing.id : null;

    if (!templateId) {
      const { data: insertedTpl, error: errTpl } = await supabase.from('book_templates').insert({
        category_id: categoryId,
        name: tpl.name,
        description: tpl.description,
        cover_image_url: tpl.thumbnail,
        price: 299000,
        is_active: true
      }).select().single();

      if (errTpl) {
        console.error('Error inserting template:', errTpl.message);
        continue;
      }
      templateId = insertedTpl.id;
    } else {
      console.log(`Template ${tpl.name} already exists. Updating pages...`);
      // Delete old pages
      await supabase.from('template_pages').delete().eq('template_id', templateId);
    }

    // Insert pages
    console.log(`Inserting ${tpl.pages.length} pages for ${tpl.name}...`);
    for (let i = 0; i < tpl.pages.length; i++) {
      const page = tpl.pages[i];
      const isCover = i === 0;
      
      const defaultContent = {
        id: `page-${i}`,
        backgroundColor: '#ffffff',
        backgroundImage: page.imageUrl,
        elements: []
      };

      const { error: errPage } = await supabase.from('template_pages').insert({
        template_id: templateId,
        page_number: i + 1,
        layout_type: isCover ? 'COVER' : 'PAGE',
        default_content: defaultContent
      });

      if (errPage) {
        console.error(`Error inserting page ${i+1}:`, errPage.message);
      }
    }
    console.log(`Successfully processed ${tpl.name}`);
  }
}

seedLocalTemplates().then(() => console.log('Done!'));
