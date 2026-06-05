const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../public');

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

const themeMappings = {
  'ban-be': 'ban-be',
  'ca-nhan': 'ca-nhan',
  'tinh-yeu': 'tinh-yeu'
};

const templateMappings = {
  'tinh-nghich': 'tinh-nghich',
  'vintage-style': 'vintage-style',
  'xanh-la-khong-xa-lanh': 'xanh-la-khong-xa-lanh',
  'dust-&-soul': 'dust-soul',
  'dust-soul': 'dust-soul',
  'firrst-love': 'firrst-love'
};

function renameAll() {
  console.log('Scanning public directory: ', PUBLIC_DIR);
  const items = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true });

  for (const item of items) {
    if (!item.isDirectory() || item.name === 'assets' || item.name === 'templates') continue;

    const currentThemeSlug = slugify(item.name);
    const targetThemeName = themeMappings[currentThemeSlug];

    if (targetThemeName) {
      const oldThemePath = path.join(PUBLIC_DIR, item.name);
      const newThemePath = path.join(PUBLIC_DIR, targetThemeName);

      // Rename subdirectories first before renaming the parent directory
      const subItems = fs.readdirSync(oldThemePath, { withFileTypes: true });
      for (const subItem of subItems) {
        if (!subItem.isDirectory()) continue;

        const currentTplSlug = slugify(subItem.name);
        const targetTplName = templateMappings[currentTplSlug];

        if (targetTplName) {
          const oldTplPath = path.join(oldThemePath, subItem.name);
          const newTplPath = path.join(oldThemePath, targetTplName);
          if (oldTplPath !== newTplPath) {
            console.log(`Renaming subfolder: "${oldTplPath}" -> "${newTplPath}"`);
            fs.renameSync(oldTplPath, newTplPath);
          }
        }
      }

      // Rename parent theme directory
      if (oldThemePath !== newThemePath) {
        console.log(`Renaming theme folder: "${oldThemePath}" -> "${newThemePath}"`);
        fs.renameSync(oldThemePath, newThemePath);
      }
    }
  }
  console.log('Renaming finished successfully!');
}

renameAll();
