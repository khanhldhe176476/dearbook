import { useState, useRef, useCallback, useEffect } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut, Check, Move } from 'lucide-react';

interface ImageCropModalProps {
  imageUrl: string;
  aspectRatio?: number; // width/height, undefined = free crop
  onComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCropModal({
  imageUrl,
  aspectRatio,
  onComplete,
  onCancel,
}: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setIsLoading(false);
      
      // Set initial crop area based on image size
      const minDimension = Math.min(img.width, img.height);
      const initialSize = minDimension * 0.8;
      const initialX = (img.width - initialSize) / 2;
      const initialY = (img.height - initialSize) / 2;
      
      setCropArea({
        x: initialX,
        y: initialY,
        width: initialSize,
        height: aspectRatio ? initialSize / aspectRatio : initialSize,
      });
      
      drawCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl, aspectRatio]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaled dimensions
    const scale = Math.min(
      (canvas.width * 0.9) / img.width,
      (canvas.height * 0.9) / img.height
    );

    const scaledWidth = img.width * scale * zoom;
    const scaledHeight = img.height * scale * zoom;
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    // Save context
    ctx.save();

    // Apply rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

    // Restore context
    ctx.restore();

    // Draw crop area overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    ctx.clearRect(cropArea.x * scale * zoom + x, cropArea.y * scale * zoom + y, cropArea.width * scale * zoom, cropArea.height * scale * zoom);

    // Draw crop area border
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x * scale * zoom + x, cropArea.y * scale * zoom + y, cropArea.width * scale * zoom, cropArea.height * scale * zoom);

    // Draw corner handles
    const handleSize = 10;
    ctx.fillStyle = '#FF1493';
    [
      [cropArea.x * scale * zoom + x, cropArea.y * scale * zoom + y],
      [cropArea.x * scale * zoom + x + cropArea.width * scale * zoom, cropArea.y * scale * zoom + y],
      [cropArea.x * scale * zoom + x, cropArea.y * scale * zoom + y + cropArea.height * scale * zoom],
      [cropArea.x * scale * zoom + x + cropArea.width * scale * zoom, cropArea.y * scale * zoom + y + cropArea.height * scale * zoom],
    ].forEach(([hx, hy]) => {
      ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
    });
  }, [zoom, rotation, cropArea]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    setCropArea((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(prev.x + deltaX / zoom, imageRef.current!.width - prev.width)),
      y: Math.max(0, Math.min(prev.y + deltaY / zoom, imageRef.current!.height - prev.height)),
    }));

    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleComplete = () => {
    const img = imageRef.current;
    if (!img) return;

    // Create a temporary canvas for cropping
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropArea.width;
    tempCanvas.height = cropArea.height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    // Apply rotation if needed
    if (rotation !== 0) {
      ctx.translate(cropArea.width / 2, cropArea.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-cropArea.width / 2, -cropArea.height / 2);
    }

    // Draw cropped area
    ctx.drawImage(
      img,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    // Convert to data URL
    const croppedImageUrl = tempCanvas.toDataURL('image/png');
    onComplete(croppedImageUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Ct & Chnh sa nh</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative bg-gray-100">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent" />
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-full cursor-move"
            />
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-300"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-2" />

              <button
                onClick={handleRotate}
                className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg transition-colors border border-gray-300"
                title="Rotate 90"
              >
                <RotateCw className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">{rotation}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hy
              </button>
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Check className="w-5 h-5" />
                Hon thnh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
