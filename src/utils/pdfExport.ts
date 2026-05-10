import { BookData, BookPage } from '../App';

interface ExportOptions {
  quality?: number; // 0-1, default 0.92
  format?: 'pdf' | 'images';
  pageSize?: 'A4' | 'letter' | 'custom';
  includeBleed?: boolean;
}

/**
 * Export book as PDF using jsPDF library
 */
export async function exportBookAsPDF(
  book: BookData,
  pages: BookPage[],
  options: ExportOptions = {}
): Promise<Blob> {
  // Dynamic import to avoid loading jsPDF on initial load
  const { jsPDF } = await import('jspdf');
  
  const {
    quality = 0.92,
    pageSize = 'A4',
    includeBleed = false,
  } = options;

  // Create PDF with landscape orientation for book spreads
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: pageSize,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Render each page
  for (let i = 0; i < pages.length; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    const page = pages[i];
    
    // Draw background
    if (page.backgroundColor) {
      pdf.setFillColor(page.backgroundColor);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }

    // Draw background image if exists
    if (page.backgroundImage) {
      try {
        const imgData = await loadImageAsDataURL(page.backgroundImage);
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
      } catch (error) {
        console.error('Failed to load background image:', error);
      }
    }

    // Draw elements
    for (const element of page.elements) {
      if (!element.visible) continue;

      const x = (element.x / 400) * pageWidth;
      const y = (element.y / 600) * pageHeight;
      const width = (element.width / 400) * pageWidth;
      const height = (element.height / 600) * pageHeight;

      if (element.type === 'text' && element.content) {
        pdf.setFontSize((element.fontSize || 16) * 0.75); // Convert px to pt
        pdf.setTextColor(element.color || '#000000');
        
        // Map custom fonts to jsPDF supported fonts
        const fontMap: Record<string, string> = {
          'Dancing Script': 'times',
          'Poppins': 'helvetica',
          'Playfair Display': 'times',
          'Inter': 'helvetica',
          'Arial': 'helvetica',
        };
        
        const baseFontFamily = element.fontFamily || 'helvetica';
        const mappedFont = fontMap[baseFontFamily] || 'helvetica';
        
        // Set font weight
        if (element.fontWeight === 'bold' || element.fontWeight === 700) {
          pdf.setFont(mappedFont, 'bold');
        } else {
          pdf.setFont(mappedFont, 'normal');
        }

        // Draw text
        const lines = pdf.splitTextToSize(element.content, width);
        pdf.text(lines, x, y + (element.fontSize || 16) * 0.75);
      } else if (element.type === 'image' && element.src) {
        try {
          const imgData = await loadImageAsDataURL(element.src);
          pdf.addImage(imgData, 'JPEG', x, y, width, height);
        } catch (error) {
          console.error('Failed to load element image:', error);
        }
      }
    }
  }

  return pdf.output('blob');
}

/**
 * Export individual page as image
 */
export async function exportPageAsImage(
  page: BookPage,
  width: number = 800,
  height: number = 1200
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw background
  if (page.backgroundColor) {
    ctx.fillStyle = page.backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw background image
  if (page.backgroundImage) {
    const img = await loadImage(page.backgroundImage);
    ctx.drawImage(img, 0, 0, width, height);
  }

  // Draw elements
  for (const element of page.elements) {
    if (!element.visible) continue;

    ctx.save();
    
    // Apply transformations
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    ctx.translate(centerX, centerY);
    if (element.rotation) {
      ctx.rotate((element.rotation * Math.PI) / 180);
    }
    ctx.globalAlpha = element.opacity ?? 1;
    ctx.translate(-centerX, -centerY);

    if (element.type === 'text' && element.content) {
      ctx.fillStyle = element.color || '#000000';
      ctx.font = `${element.fontStyle || 'normal'} ${element.fontWeight || 'normal'} ${
        element.fontSize || 16
      }px ${element.fontFamily || 'Arial'}`;
      ctx.textAlign = (element.textAlign as CanvasTextAlign) || 'left';

      const lines = wrapText(ctx, element.content, element.width);
      const lineHeight = (element.fontSize || 16) * (element.lineHeight || 1.5);

      lines.forEach((line, index) => {
        ctx.fillText(line, element.x, element.y + index * lineHeight + (element.fontSize || 16));
      });
    } else if (element.type === 'image' && element.src) {
      const img = await loadImage(element.src);
      ctx.drawImage(img, element.x, element.y, element.width, element.height);
    }

    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}

/**
 * Generate shareable link for book preview
 */
export function generateShareableLink(bookId: string): string {
  const baseUrl = window.location.origin;
  const encodedBookData = encodeURIComponent(bookId);
  return `${baseUrl}/preview/${encodedBookData}`;
}

/**
 * Copy shareable link to clipboard
 */
export async function copyShareableLink(bookId: string): Promise<boolean> {
  const link = generateShareableLink(bookId);
  
  try {
    await navigator.clipboard.writeText(link);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper: Load image from URL or localStorage key
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = reject;

    // Check if it's a localStorage key
    if (src.startsWith('dearbook_image_')) {
      const dataUrl = localStorage.getItem(src);
      if (dataUrl) {
        img.src = dataUrl;
      } else {
        reject(new Error('Image not found in localStorage'));
      }
    } else {
      img.src = src;
    }
  });
}

/**
 * Helper: Load image as data URL
 */
async function loadImageAsDataURL(src: string): Promise<string> {
  // Check if it's already a data URL
  if (src.startsWith('data:')) {
    return src;
  }

  // Check if it's a localStorage key
  if (src.startsWith('dearbook_image_')) {
    const dataUrl = localStorage.getItem(src);
    if (dataUrl) {
      return dataUrl;
    }
  }

  // Load from URL
  const img = await loadImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Helper: Wrap text to fit width
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  lines.push(currentLine);
  return lines;
}
