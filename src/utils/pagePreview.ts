import { dbGetImageSync } from './dbStorage';

/**
 * Tr v URL nh preview u tin tm thy trong page (dng cho thumbnail).
 * H tr c 2 format: EditorPage (c elements) v PageData (c images).
 */
export function getPagePreview(page: any): string | null {
  if (!page) return null;

  // Format 1: EditorPage - tm nh u tin trong elements
  if (page.elements) {
    for (const el of page.elements) {
      if (el.type === 'image' && el.visible !== false && el.src) {
        const resolved = resolveImageUrl(el.src);
        if (resolved) return resolved;
      }
    }
  }

  // Format 2: PageData - dng images.pageImage hoc image u tin
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
 * Tr v thng tin thumbnail cho mt page, h tr c 2 format.
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
 * Kim tra page c cha template frame element khng.
 */
export function hasTemplateFrame(page: any): boolean {
  if (!page?.elements) return false;
  return page.elements.some((el: any) => el.id?.startsWith('template-frame-'));
}

/**
 * Kim tra page thuc EditorPage format (c elements array).
 */
export function isEditorPage(page: any): boolean {
  return !!(page?.elements && Array.isArray(page.elements));
}

/**
 * Resolve image URL: IndexedDB key, data URL, HTTP URL, hoc relative path.
 */
function resolveImageUrl(src: string): string | null {
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
