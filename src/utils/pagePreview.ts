import { dbGetImageSync } from './dbStorage';

/**
 * Trả về URL ảnh preview đầu tiên tìm thấy trong page (dùng cho thumbnail).
 * Hỗ trợ cả 2 format: EditorPage (có elements) và PageData (có images).
 */
export function getPagePreview(page: any): string | null {
  if (!page) return null;

  // Format 1: EditorPage - tìm ảnh đầu tiên trong elements
  if (page.elements) {
    for (const el of page.elements) {
      if (el.type === 'image' && el.visible !== false && el.src) {
        const resolved = resolveImageUrl(el.src);
        if (resolved) return resolved;
      }
    }
  }

  // Format 2: PageData - dùng images.pageImage hoặc image đầu tiên
  if (page.images) {
    const imgUrl = page.images.pageImage || Object.values(page.images)[0];
    if (imgUrl && typeof imgUrl === 'string') {
      const resolved = resolveImageUrl(imgUrl);
      if (resolved) return resolved;
    }
  }

  // Fallback: background image (EditorPage format)
  if (page.background?.type === 'image' && page.background.value) {
    const resolved = resolveImageUrl(page.background.value);
    if (resolved) return resolved;
  }

  // Fallback: flat backgroundImage string (template page format)
  if (page.backgroundImage) {
    const resolved = resolveImageUrl(page.backgroundImage);
    if (resolved) return resolved;
  }

  return null;
}

/**
 * Trả về thông tin thumbnail cho một page, hỗ trợ cả 2 format.
 */
export function getPageThumbnail(page: any): {
  imageUrl: string | null;
  bgColor: string;
  bgImage: string | null;
} {
  const imageUrl = getPagePreview(page);

  let bgColor = '#fafafa';
  let bgImage: string | null = null;

  if (page) {
    // EditorPage format
    if (page.background?.type === 'color') {
      bgColor = page.background.value;
    } else if (page.background?.type === 'image') {
      bgImage = resolveImageUrl(page.background.value);
    } else if (page.background?.type === 'gradient') {
      bgColor = '#f5f2ee';
    }

    // Flat backgroundColor (template page format)
    if (page.backgroundColor) {
      bgColor = page.backgroundColor;
    }
    if (page.backgroundImage) {
      const resolved = resolveImageUrl(page.backgroundImage);
      if (resolved) bgImage = resolved;
    }
  }

  return { imageUrl, bgColor, bgImage };
}

/**
 * Kiểm tra page có chứa template frame element không.
 */
export function hasTemplateFrame(page: any): boolean {
  if (!page?.elements) return false;
  return page.elements.some((el: any) => el.id?.startsWith('template-frame-'));
}

/**
 * Kiểm tra page thuộc EditorPage format (có elements array).
 */
export function isEditorPage(page: any): boolean {
  return !!(page?.elements && Array.isArray(page.elements));
}

/**
 * Resolve image URL: IndexedDB key, data URL, HTTP URL, hoặc relative path.
 * Exported for reuse across all preview/viewer components.
 */
export function resolveImageUrl(src: string): string | null {
  if (!src) return null;
  if (src.startsWith('dearbook_image_')) {
    const resolved = dbGetImageSync(src);
    return resolved || null;
  }
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) {
    return src;
  }
  return null;
}
