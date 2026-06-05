const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/autoTemplates.json');

// Những file hoặc thư mục nên bỏ qua
const IGNORED = ['.DS_Store', 'logo.png', 'templates'];

// Hàm chuyển tên thành id (ví dụ: Bạn Bè -> ban-be)
const slugify = (text) => {
  return text.toString().toLowerCase()
    .normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, ''); 
}

function generate() {
  const data = { themes: [] };

  try {
    const rootItems = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true });

    for (const rootItem of rootItems) {
      if (!rootItem.isDirectory() || IGNORED.includes(rootItem.name)) continue;

      const themeName = rootItem.name;
      const themeSlug = slugify(themeName);
      const themePath = path.join(PUBLIC_DIR, themeName);

      const themeObj = {
        id: themeSlug,
        name: themeName,
        templates: []
      };

      const templateItems = fs.readdirSync(themePath, { withFileTypes: true });

      for (const templateItem of templateItems) {
        if (!templateItem.isDirectory()) continue;

        const templateName = templateItem.name;
        // Bắt đầu bằng auto-template- để Step3 biết đây là Simple Editor
        const templateId = `auto-template-${themeSlug}-${slugify(templateName)}`;
        const templatePath = path.join(themePath, templateName);

        const templateObj = {
          id: templateId,
          name: templateName,
          description: `Sách ảnh ${templateName} với thiết kế tuyệt đẹp`,
          pages: []
        };

        const pageItems = fs.readdirSync(templatePath, { withFileTypes: true });
        
        // Lọc ra các file ảnh
        const images = pageItems
          .filter(item => item.isFile() && /\.(png|jpe?g|webp)$/i.test(item.name))
          .map(item => item.name);

        // Natural sort: sắp xếp thông minh số đếm (2 đứng trước 10)
        images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

        images.forEach((imgName, index) => {
          templateObj.pages.push({
            id: `${templateId}-page-${index + 1}`,
            imageUrl: `/${themeName}/${templateName}/${imgName}`,
            label: `Trang ${index + 1}`
          });
        });

        if (templateObj.pages.length > 0) {
          // Trang đầu tiên làm ảnh bìa
          templateObj.thumbnail = templateObj.pages[0].imageUrl;
          themeObj.templates.push(templateObj);
        }
      }

      if (themeObj.templates.length > 0) {
        data.themes.push(themeObj);
      }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`[AutoTemplates] Quét thành công: Đã tìm thấy ${data.themes.length} chủ đề và ${data.themes.reduce((sum, t) => sum + t.templates.length, 0)} mẫu thiết kế.`);
  } catch (err) {
    console.error('[AutoTemplates] Lỗi khi tạo template:', err);
  }
}

generate();
