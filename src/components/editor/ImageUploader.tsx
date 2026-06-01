import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { ImageCropModal } from './ImageCropModal';
import { dbStoreImage } from '../../utils/dbStorage';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  acceptedFormats?: string[];
  maxSizeMB?: number;
  enableCrop?: boolean;
  aspectRatio?: number;
  className?: string;
}

export function ImageUploader({
  onImageUpload,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSizeMB = 10,
  enableCrop = true,
  aspectRatio,
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageForCrop, setImageForCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Định dạng không hỗ trợ. Chỉ chấp nhận: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Kích thước file quá lớn. Tối đa ${maxSizeMB}MB`;
    }

    return null;
  };

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        return;
      }

      setIsUploading(true);

      try {
        // Convert file to data URL
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;

          if (enableCrop) {
            setImageForCrop(dataUrl);
          } else {
            try {
              // Lưu vào IndexedDB (primary storage, không giới hạn ~5MB)
              const imageKey = await dbStoreImage(dataUrl);
              onImageUpload(imageKey);
            } catch (err) {
              console.warn('Failed to save to IndexedDB, fallback to dataUrl:', err);
              // Fallback: dùng raw dataUrl (kém hiệu quả nhưng không mất ảnh)
              onImageUpload(dataUrl);
            }
          }

          setIsUploading(false);
        };

        reader.onerror = () => {
          setError('Không thể đọc file. Vui lòng thử lại.');
          setIsUploading(false);
        };

        reader.readAsDataURL(file);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải ảnh lên.');
        setIsUploading(false);
      }
    },
    [enableCrop, onImageUpload]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    // Lưu ảnh đã crop vào IndexedDB
    try {
      const imageKey = await dbStoreImage(croppedImageUrl);
      onImageUpload(imageKey);
    } catch (err) {
      console.warn('Failed to save cropped image to IndexedDB, fallback to dataUrl:', err);
      onImageUpload(croppedImageUrl);
    }
    setImageForCrop(null);
  };

  return (
    <>
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 border-dashed
            transition-all cursor-pointer
            ${
              isDragging
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50/50'
            }
            ${isUploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
              <p className="text-sm text-gray-600">Đang tải lên...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-pink-100 rounded-full">
                <Upload className="w-6 h-6 text-pink-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  Kéo thả ảnh hoặc click để chọn
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP, GIF (tối đa {maxSizeMB}MB)
                </p>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {imageForCrop && (
        <ImageCropModal
          imageUrl={imageForCrop}
          aspectRatio={aspectRatio}
          onComplete={handleCropComplete}
          onCancel={() => setImageForCrop(null)}
        />
      )}
    </>
  );
}
