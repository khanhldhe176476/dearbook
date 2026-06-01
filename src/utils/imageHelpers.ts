/**
 * Image Helper Utilities
 * Provides helper functions for image manipulation and management
 */

import { dbGetImageSync } from './dbStorage';

/**
 * Load image from localStorage key or URL
 */
export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));

    // Check if it's a localStorage/IndexedDB key
    if (src.startsWith('dearbook_image_')) {
      const dataUrl = dbGetImageSync(src);
      if (dataUrl) {
        img.src = dataUrl;
      } else {
        reject(new Error(`Image not found in localStorage: ${src}`));
      }
    } else {
      img.src = src;
    }
  });
}

/**
 * Get image data URL from localStorage key or URL
 */
export async function getImageDataURL(src: string): Promise<string> {
  // Already a data URL
  if (src.startsWith('data:')) {
    return src;
  }

  // LocalStorage/IndexedDB key
  if (src.startsWith('dearbook_image_')) {
    const dataUrl = dbGetImageSync(src);
    if (dataUrl) {
      return dataUrl;
    }
    throw new Error(`Image not found in localStorage: ${src}`);
  }

  // URL - need to load and convert
  const img = await loadImage(src);
  return imageToDataURL(img);
}

/**
 * Convert HTMLImageElement to data URL
 */
export function imageToDataURL(
  img: HTMLImageElement,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality: number = 0.92
): string {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL(format, quality);
}

/**
 * Resize image to fit within max dimensions while maintaining aspect ratio
 */
export async function resizeImage(
  src: string,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.92
): Promise<string> {
  const img = await loadImage(src);

  let width = img.width;
  let height = img.height;

  // Calculate new dimensions
  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;

    if (width > height) {
      width = maxWidth;
      height = width / aspectRatio;
    } else {
      height = maxHeight;
      width = height * aspectRatio;
    }
  }

  // Create canvas and resize
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Compress image to reduce file size
 */
export async function compressImage(
  src: string,
  maxSizeKB: number = 500,
  quality: number = 0.9
): Promise<string> {
  const img = await loadImage(src);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0);

  // Try different quality levels until size is acceptable
  let currentQuality = quality;
  let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);

  while (getDataURLSizeKB(dataUrl) > maxSizeKB && currentQuality > 0.1) {
    currentQuality -= 0.1;
    dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
  }

  return dataUrl;
}

/**
 * Get data URL size in kilobytes
 */
export function getDataURLSizeKB(dataUrl: string): number {
  // Remove data URL prefix
  const base64 = dataUrl.split(',')[1];
  // Calculate size (base64 is ~1.37x larger than binary)
  const sizeBytes = (base64.length * 3) / 4;
  return sizeBytes / 1024;
}

/**
 * Convert file to data URL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedFormats?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSizeMB = 10,
    allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  } = options;

  // Check format
  if (!allowedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `Định dạng không hỗ trợ. Chỉ chấp nhận: ${allowedFormats
        .map((f) => f.split('/')[1])
        .join(', ')}`,
    };
  }

  // Check size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Kích thước file quá lớn. Tối đa ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Create thumbnail from image
 */
export async function createThumbnail(
  src: string,
  size: number = 150,
  quality: number = 0.8
): Promise<string> {
  const img = await loadImage(src);

  const canvas = document.createElement('canvas');
  const aspectRatio = img.width / img.height;

  if (aspectRatio > 1) {
    canvas.width = size;
    canvas.height = size / aspectRatio;
  } else {
    canvas.height = size;
    canvas.width = size * aspectRatio;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  const img = await loadImage(src);
  return {
    width: img.width,
    height: img.height,
  };
}

/**
 * Store image in localStorage with unique key
 */
export function storeImage(dataUrl: string): string {
  const key = `dearbook_image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    localStorage.setItem(key, dataUrl);
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
  return key;
}

/**
 * Remove image from localStorage
 */
export function removeImage(key: string): boolean {
  if (key.startsWith('dearbook_image_')) {
    localStorage.removeItem(key);
    return true;
  }
  return false;
}

/**
 * Get all stored images
 */
export function getAllStoredImages(): Array<{ key: string; dataUrl: string }> {
  const images: Array<{ key: string; dataUrl: string }> = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('dearbook_image_')) {
      const dataUrl = dbGetImageSync(key);
      if (dataUrl) {
        images.push({ key, dataUrl });
      }
    }
  }

  return images;
}

/**
 * Clean up old/unused images
 */
export function cleanupUnusedImages(usedKeys: Set<string>): number {
  const allImages = getAllStoredImages();
  let cleaned = 0;

  allImages.forEach(({ key }) => {
    if (!usedKeys.has(key)) {
      removeImage(key);
      cleaned++;
    }
  });

  return cleaned;
}

/**
 * Get total size of stored images in MB
 */
export function getTotalImageSize(): number {
  const allImages = getAllStoredImages();
  let totalKB = 0;

  allImages.forEach(({ dataUrl }) => {
    totalKB += getDataURLSizeKB(dataUrl);
  });

  return totalKB / 1024; // Convert to MB
}

/**
 * Apply filter to image
 */
export async function applyImageFilter(
  src: string,
  filter: 'grayscale' | 'sepia' | 'brightness' | 'contrast',
  amount: number = 1
): Promise<string> {
  const img = await loadImage(src);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.filter = `${filter}(${amount})`;
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL('image/png');
}

/**
 * Flip image horizontally or vertically
 */
export async function flipImage(
  src: string,
  direction: 'horizontal' | 'vertical'
): Promise<string> {
  const img = await loadImage(src);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  if (direction === 'horizontal') {
    ctx.translate(img.width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, img.height);
    ctx.scale(1, -1);
  }

  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}
