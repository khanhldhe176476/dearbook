import type { BookData, PageData } from '../App';
import type { BookViewerData, ViewerPage } from '../types/bookViewer';
import type { EditorPage, PageElement } from '../types/editor';
import { templates } from '../data/templates';

const BG_COLORS: Record<string, string> = {
  love: '#FFE4E1',
  family: '#E0F2FE',
  birthday: '#F3E8FF',
  friendship: '#FEF3C7',
};

/** Check if a page is already in BookPage (EditorPage) format */
function isEditorPage(page: unknown): page is EditorPage {
  return Boolean(page && typeof page === 'object' && 'elements' in page && Array.isArray((page as EditorPage).elements));
}

/** Convert a PageData to EditorPage format using the template */
function convertPageDataToEditorPage(pageData: PageData, templateId: string): EditorPage {
  const template = templates.find(t => t.id === templateId);
  const templatePage = template?.pages.find(p => p.id === pageData.templatePageId);

  if (!templatePage) {
    // Fallback: create basic page with user content
    const fallbackElements: PageElement[] = [];

    for (const [key, value] of Object.entries(pageData.texts || {})) {
      if (value && typeof value === 'string') {
        fallbackElements.push({
          id: `fallback-text-${key}`,
          type: 'text',
          x: 80,
          y: 100,
          width: 340,
          height: 120,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: 10,
          content: value,
          fontFamily: 'Poppins',
          fontSize: 18,
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#1f2937',
          textAlign: 'left',
          lineHeight: 1.6,
          letterSpacing: 0,
          textDecoration: 'none',
        });
      }
    }

    for (const [key, value] of Object.entries(pageData.images || {})) {
      if (value && typeof value === 'string') {
        fallbackElements.push({
          id: `fallback-image-${key}`,
          type: 'image',
          src: value,
          x: 100,
          y: 100,
          width: 300,
          height: 250,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: 10,
          objectFit: 'cover',
          borderRadius: 12,
        });
      }
    }

    return {
      id: pageData.id,
      elements: fallbackElements,
      background: { type: 'color', value: '#ffffff' },
      width: 400,
      height: 600,
    };
  }

  // Clone template elements and replace with user data
  const elements: PageElement[] = templatePage.elements.map(el => {
    const cloned = { ...el };

    if (el.type === 'text') {
      const match = el.id.match(/text-(\w+)-/);
      const fieldKey = match ? match[1] : '';
      if (fieldKey && pageData.texts[fieldKey]) {
        (cloned as any).content = pageData.texts[fieldKey];
      }
    } else if (el.type === 'image') {
      const match = el.id.match(/image-(\w+)-/);
      const fieldKey = match ? match[1] : '';
      if (fieldKey && pageData.images[fieldKey]) {
        (cloned as any).src = pageData.images[fieldKey];
      }
    }

    return cloned as PageElement;
  });

  return {
    id: pageData.id,
    elements,
    background: templatePage.background || { type: 'color', value: '#ffffff' },
    width: templatePage.width || 400,
    height: templatePage.height || 600,
  };
}

/** Convert EditorPage to simplified ViewerPage */
function editorPageToViewerPage(page: EditorPage): ViewerPage {
  // Handle both background formats:
  // 1. Template format: { backgroundColor: string, backgroundImage: string }
  // 2. Editor format: { background: { type, value } }
  const pageAny = page as any;

  let backgroundColor: string | undefined;
  let backgroundImage: string | undefined;

  if (page.background) {
    // Editor format: background object
    if (page.background.type === 'color') {
      backgroundColor = page.background.value;
    } else if (page.background.type === 'image') {
      backgroundImage = page.background.value;
    }
  }
  // Template format: direct properties (override if set)
  if (pageAny.backgroundColor && typeof pageAny.backgroundColor === 'string') {
    backgroundColor = pageAny.backgroundColor;
  }
  if (pageAny.backgroundImage && typeof pageAny.backgroundImage === 'string') {
    backgroundImage = pageAny.backgroundImage;
  }

  return {
    id: page.id,
    backgroundColor,
    backgroundImage,
    elements: page.elements.map(el => ({
      id: el.id,
      type: el.type as ViewerPage['elements'][0]['type'],
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height,
      rotation: el.rotation,
      opacity: el.opacity,
      zIndex: el.zIndex,
      content: (el as any).content,
      fontFamily: (el as any).fontFamily,
      fontSize: (el as any).fontSize,
      color: (el as any).color,
      fontWeight: String((el as any).fontWeight || 'normal'),
      fontStyle: (el as any).fontStyle,
      textAlign: (el as any).textAlign,
      lineHeight: (el as any).lineHeight,
      textShadow: (el as any).textShadow,
      src: (el as any).src || (el as any).url,
      objectFit: (el as any).objectFit,
      borderRadius: (el as any).borderRadius,
      fill: (el as any).fill,
      stroke: (el as any).stroke,
      strokeWidth: (el as any).strokeWidth,
      emoji: (el as any).emoji,
      iconName: (el as any).iconName,
    })),
  };
}

/**
 * Convert BookData (App format) to BookViewerData (viewer format).
 * Handles both PageData[] and BookPage[] page formats.
 */
export function toBookViewerData(book: BookData): BookViewerData {
  const theme = book.theme || 'love';

  // Find the template this book was created from
  const template = templates.find(t => t.id === book.templateId);

  // Convert all user pages
  const allPages: ViewerPage[] = [];
  for (const page of book.pages || []) {
    if (isEditorPage(page)) {
      allPages.push(editorPageToViewerPage(page));
    } else {
      const editorPage = convertPageDataToEditorPage(page as PageData, book.templateId);
      allPages.push(editorPageToViewerPage(editorPage));
    }
  }

  // ── Cover & back cover ──
  // Explicit book.cover takes precedence over deriving from pages.
  // If pages[0] has the same id as book.cover, skip it to avoid duplication.
  let cover: ViewerPage | null = null;
  let backCover: ViewerPage | null = null;
  const contentPages = [...allPages];

  if (book.cover) {
    // Use explicitly provided cover
    if (isEditorPage(book.cover)) {
      cover = editorPageToViewerPage(book.cover);
    } else {
      cover = editorPageToViewerPage(convertPageDataToEditorPage(book.cover as PageData, book.templateId));
    }
    // Skip first page if it's the same as the cover (prevents duplicate)
    if (contentPages.length > 0 && contentPages[0].id === book.cover.id) {
      contentPages.shift();
    }
  } else if (contentPages.length > 0) {
    // Derive cover from first page
    cover = contentPages.shift()!;
  } else if (template?.pages && template.pages.length > 0) {
    cover = editorPageToViewerPage(template.pages[0]);
  }

  // Back cover — use last content page or template fallback
  if (contentPages.length > 0) {
    backCover = contentPages.pop()!;
  } else if (template?.pages && template.pages.length > 1) {
    backCover = editorPageToViewerPage(template.pages[template.pages.length - 1]);
  }

  return {
    id: book.id,
    title: book.title || 'Cuốn sách của tôi',
    theme,
    cover,
    backCover,
    pages: contentPages,
    pageCount: contentPages.length,
  };
}
