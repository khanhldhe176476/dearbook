import { BookData, BookPage } from '../App';
import { dbGetImageSync } from './dbStorage';

// ── Types ──────────────────────────────────────────────────────────────────

export type ExportQuality = 'standard' | 'high' | 'print';

export interface ExportOptions {
  quality?: ExportQuality;
  pageSize?: 'A4' | 'A5' | 'letter';
  orientation?: 'portrait' | 'landscape';
  selectedPages?: number[]; // indices của trang cần xuất
}

interface QualityPreset {
  dpi: number;
  label: string;
}

const QUALITY_PRESETS: Record<ExportQuality, QualityPreset> = {
  standard: { dpi: 150, label: 'Tiêu chuẩn' },
  high:     { dpi: 200, label: 'Cao' },
  print:    { dpi: 300, label: 'In ấn' },
};

// Kích thước trang (mm)
const PAGE_SIZES_MM: Record<string, [number, number]> = {
  A4:     [210, 297],
  A5:     [148, 210],
  letter: [215.9, 279.4],
};

// Kích thước canvas gốc của editor (phải khớp với PAGE_W, PAGE_H trong Step4PageEditorAdvanced)
const EDITOR_W = 400;
const EDITOR_H = 600;

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Xuất sách ra PDF chất lượng cao.
 * Render từng trang lên canvas độ phân giải cao → nhúng vào PDF.
 */
export async function exportBookAsPDF(
  book: BookData,
  pages: any[],
  options: ExportOptions = {}
): Promise<Blob> {
  const { jsPDF } = await import('jspdf');

  const {
    quality = 'high',
    pageSize = 'A4',
    orientation = 'portrait',
    selectedPages,
  } = options;

  const { dpi } = QUALITY_PRESETS[quality];
  const pageSizeMM = PAGE_SIZES_MM[pageSize];

  // Tính kích thước canvas render dựa trên DPI
  // A4 landscape: 297mm x 210mm at 300dpi = 3508 x 2480 px
  const mmToPx = dpi / 25.4;
  let renderW = Math.round(pageSizeMM[0] * mmToPx);
  let renderH = Math.round(pageSizeMM[1] * mmToPx);

  // Landscape: hoán đổi nếu cần
  if (orientation === 'landscape') {
    [renderW, renderH] = [renderH, renderW];
  }

  const pdfW = orientation === 'landscape' ? pageSizeMM[1] : pageSizeMM[0];
  const pdfH = orientation === 'landscape' ? pageSizeMM[0] : pageSizeMM[1];

  const pdf = new jsPDF({
    orientation: orientation,
    unit: 'mm',
    format: [pdfW, pdfH],
    compress: true,
  });

  const pageIndices = selectedPages && selectedPages.length > 0
    ? [...selectedPages].sort((a, b) => a - b)
    : pages.map((_, i) => i);

  for (let i = 0; i < pageIndices.length; i++) {
    if (i > 0) pdf.addPage();

    const pageIdx = pageIndices[i];
    const page = pages[pageIdx];
    if (!page) continue;

    // Render trang lên canvas độ phân giải cao
    const dataUrl = await renderPageToCanvas(page, renderW, renderH);

    // Nhúng ảnh canvas vào PDF
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfW, pdfH);
  }

  return pdf.output('blob');
}

/**
 * Xuất 1 trang thành ảnh PNG độ phân giải cao
 */
export async function exportPageAsImage(
  page: any,
  width: number = 2400,
  height: number = 3600
): Promise<string> {
  return renderPageToCanvas(page, width, height);
}

// ── Core: Render page to high-res canvas ──────────────────────────────────

async function renderPageToCanvas(
  page: any,
  width: number,
  height: number
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Tỉ lệ scale từ editor (400x600) → output (width x height)
  const scaleX = width / EDITOR_W;
  const scaleY = height / EDITOR_H;

  // 1. Vẽ background
  const bg = page.background;
  if (bg) {
    if (bg.type === 'color') {
      ctx.fillStyle = bg.value;
      ctx.fillRect(0, 0, width, height);
    } else if (bg.type === 'image' && bg.value) {
      try {
        const img = await loadImageSafe(bg.value);
        if (img) {
          ctx.drawImage(img, 0, 0, width, height);
        } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }
      } catch {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
    } else if (bg.type === 'gradient') {
      // Gradient đơn giản: linear-gradient top→bottom
      try {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        const colors = parseGradientColors(bg.value);
        colors.forEach((c, i) => grad.addColorStop(i / Math.max(colors.length - 1, 1), c));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } catch {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Vẽ overlay (template layer)
  if (page.overlay && page.overlay.type === 'image' && page.overlay.value) {
    try {
      const overlayImg = await loadImageSafe(page.overlay.value);
      if (overlayImg) {
        ctx.drawImage(overlayImg, 0, 0, width, height);
      }
    } catch { /* ignore overlay errors */ }
  }

  // 3. Vẽ elements
  const elements = page.elements || [];
  const sortedElements = [...elements].sort((a: any, b: any) => (a.zIndex || 0) - (b.zIndex || 0));

  for (const el of sortedElements) {
    // Chỉ skip elements bị ẩn (visible = false)
    if (el.visible === false) continue;

    ctx.save();

    const ex = el.x * scaleX;
    const ey = el.y * scaleY;
    const ew = (el.width || 100) * scaleX;
    const eh = (el.height || 50) * scaleY;
    const cx = ex + ew / 2;
    const cy = ey + eh / 2;

    // Transform
    ctx.translate(cx, cy);
    if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.globalAlpha = el.opacity ?? 1;
    ctx.translate(-cx, -cy);

    if (el.type === 'text' && el.content) {
      const fontSize = (el.fontSize || 16) * scaleX;
      const fontFamily = el.fontFamily || 'Poppins';
      const fontWeight = el.fontWeight || 'normal';
      const fontStyle = el.fontStyle || 'normal';

      ctx.fillStyle = el.color || '#000000';
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
      ctx.textAlign = (el.textAlign as CanvasTextAlign) || 'left';
      ctx.textBaseline = 'top';

      if (el.textShadow) {
        ctx.shadowColor = el.textShadow;
        ctx.shadowBlur = 3 * scaleX;
        ctx.shadowOffsetX = 1 * scaleX;
        ctx.shadowOffsetY = 1 * scaleY;
      }

      if (el.background) {
        ctx.fillStyle = el.background;
        const padding = (el.padding || 0) * scaleX;
        ctx.fillRect(ex - padding, ey - padding, ew + padding * 2, eh + padding * 2);
        ctx.fillStyle = el.color || '#000000';
      }

      const lines = wrapText(ctx, el.content, ew);
      const lineHeight = fontSize * (el.lineHeight || 1.5);
      const letterSpacing = (el.letterSpacing || 0) * scaleX;

      for (let li = 0; li < lines.length; li++) {
        let lx = ex;
        if (ctx.textAlign === 'center') lx = cx;
        if (ctx.textAlign === 'right') lx = ex + ew;

        if (letterSpacing !== 0) {
          // Manual letter spacing
          let spacedX = lx;
          for (const char of lines[li]) {
            ctx.fillText(char, spacedX, ey + li * lineHeight);
            spacedX += ctx.measureText(char).width + letterSpacing;
          }
        } else {
          ctx.fillText(lines[li], lx, ey + li * lineHeight);
        }
      }

      if (el.textDecoration === 'underline') {
        const lastLineY = ey + (lines.length - 1) * lineHeight + fontSize;
        ctx.strokeStyle = el.color || '#000000';
        ctx.lineWidth = Math.max(1, fontSize * 0.05);
        ctx.beginPath();
        let lx = ex;
        if (ctx.textAlign === 'center') lx = cx - ctx.measureText(lines[lines.length - 1]).width / 2;
        if (ctx.textAlign === 'right') lx = ex + ew - ctx.measureText(lines[lines.length - 1]).width;
        ctx.moveTo(lx, lastLineY);
        ctx.lineTo(lx + ctx.measureText(lines[lines.length - 1]).width, lastLineY);
        ctx.stroke();
      }
    } else if (el.type === 'image' && el.src) {
      try {
        const img = await loadImageSafe(el.src);
        if (img) {
          // Áp dụng CSS filter (grayscale, brightness, contrast, blur, sepia...)
          if (el.filter) {
            try {
              ctx.filter = el.filter;
            } catch { /* filter không hỗ trợ thì bỏ qua */ }
          }

          // Vẽ border nếu có
          if (el.border) {
            const borderW = parseFloat(el.border) || 1;
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = borderW * scaleX;
            ctx.strokeRect(ex, ey, ew, eh);
          }

          // Bo góc nếu có
          if (el.borderRadius) {
            ctx.beginPath();
            const r = el.borderRadius * scaleX;
            roundRect(ctx, ex, ey, ew, eh, r);
            ctx.clip();
          }

          if (el.objectFit === 'cover') {
            // Cover: scale để lấp đầy, crop phần thừa
            const imgRatio = img.width / img.height;
            const boxRatio = ew / eh;
            let sw, sh, sx, sy;
            if (imgRatio > boxRatio) {
              sh = img.height;
              sw = img.height * boxRatio;
              sx = (img.width - sw) / 2;
              sy = 0;
            } else {
              sw = img.width;
              sh = img.width / boxRatio;
              sx = 0;
              sy = (img.height - sh) / 2;
            }
            ctx.drawImage(img, sx, sy, sw, sh, ex, ey, ew, eh);
          } else if (el.objectFit === 'contain') {
            const imgRatio = img.width / img.height;
            const boxRatio = ew / eh;
            let dw, dh, dx, dy;
            if (imgRatio > boxRatio) {
              dw = ew;
              dh = ew / imgRatio;
              dx = ex;
              dy = ey + (eh - dh) / 2;
            } else {
              dh = eh;
              dw = eh * imgRatio;
              dx = ex + (ew - dw) / 2;
              dy = ey;
            }
            ctx.drawImage(img, dx, dy, dw, dh);
          } else {
            ctx.drawImage(img, ex, ey, ew, eh);
          }

          // Reset filter sau khi vẽ ảnh
          if (el.filter) {
            ctx.filter = 'none';
          }
        }
      } catch { /* ignore element image errors */ }
    } else if (el.type === 'shape') {
      ctx.fillStyle = el.fill || '#000000';
      if (el.stroke) {
        ctx.strokeStyle = el.stroke;
        ctx.lineWidth = (el.strokeWidth || 1) * scaleX;
      }
      drawShape(ctx, el.shape, ex, ey, ew, eh);
      if (el.stroke) ctx.stroke();
      ctx.fill();
    } else if (el.type === 'sticker') {
      const stickerSize = Math.max(ew, eh);
      ctx.font = `${stickerSize * 0.8}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.emoji || '⭐', cx, cy);
    } else if (el.type === 'icon') {
      // Icon Lucide — hiển thị dưới dạng text fallback
      ctx.fillStyle = el.color || '#000000';
      ctx.font = `${Math.min(ew, eh) * 0.7}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('◆', cx, cy);
    }

    ctx.restore();
  }

  return canvas.toDataURL('image/png', 1.0);
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function loadImageSafe(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);

    if (src.startsWith('dearbook_image_')) {
      const dataUrl = dbGetImageSync(src);
      img.src = dataUrl || src;
    } else if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) {
      img.src = src;
    } else {
      // Try as data URL
      img.src = src;
    }
  });
}

function parseGradientColors(gradientStr: string): string[] {
  // Hỗ trợ linear-gradient(...) và các màu đơn giản
  const colorRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/g;
  const matches = gradientStr.match(colorRegex);
  return matches || ['#ffffff', '#f0f0f0'];
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: string,
  x: number, y: number, w: number, h: number
): void {
  ctx.beginPath();
  switch (shape) {
    case 'circle':
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      break;
    case 'triangle':
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      break;
    case 'star': {
      const cx = x + w / 2, cy = y + h / 2;
      const outerR = Math.min(w, h) / 2;
      const innerR = outerR * 0.4;
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        if (i === 0) ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        else ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
      ctx.closePath();
      break;
    }
    case 'heart': {
      const cx = x + w / 2, cy = y + h / 2;
      const s = Math.min(w, h) / 2;
      ctx.moveTo(cx, cy + s * 0.6);
      ctx.bezierCurveTo(cx - s, cy - s * 0.3, cx - s * 0.5, cy - s, cx, cy - s * 0.3);
      ctx.bezierCurveTo(cx + s * 0.5, cy - s, cx + s, cy - s * 0.3, cx, cy + s * 0.6);
      break;
    }
    case 'square':
    case 'rectangle':
    default:
      ctx.rect(x, y, w, h);
      break;
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
    if (ctx.measureText(testLine).width < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// ── Share ──────────────────────────────────────────────────────────────────

export function generateShareableLink(bookId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/preview/${encodeURIComponent(bookId)}`;
}

export async function copyShareableLink(bookId: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(generateShareableLink(bookId));
    return true;
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
