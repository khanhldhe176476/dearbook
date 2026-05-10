import Book2DPreview from './Book2DPreview';
import { BookProject } from '../App';

interface Book3DPreviewResponsiveProps {
  book: BookProject;
  onBack: () => void;
  onOrder: () => void;
}

export default function Book3DPreviewResponsive({ book, onBack, onOrder }: Book3DPreviewResponsiveProps) {
  // Temporarily using 2D preview due to Three.js multiple instances conflict
  // This provides a stable, beautiful preview experience while we resolve the 3D rendering issues
  console.log('📖 Using 2D Preview (3D temporarily disabled due to Three.js conflicts)');
  
  return <Book2DPreview book={book} onBack={onBack} onOrder={onOrder} />;
}
