import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Book, Box } from 'lucide-react';
import { BookProject } from '../App';
import { Book3DPreview } from './Book3DPreview';

interface Preview3DProps {
  book: BookProject;
  onBack: () => void;
  onOrder: () => void;
}

export function Preview3D({ book, onBack, onOrder }: Preview3DProps) {
  const [view3D, setView3D] = useState(true);

  if (view3D) {
    return <Book3DPreview book={book} onBack={onBack} onOrder={onOrder} />;
  }

  // Fallback to 2D flip view
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay li chnh sa</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setView3D(!view3D)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
              >
                {view3D ? <Book className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                {view3D ? '2D View' : '3D View'}
              </button>
              
              <button
                onClick={onOrder}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full hover:shadow-xl transition"
              >
                <ShoppingCart className="w-5 h-5" />
                t in sch ny
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <p className="text-white">2D Flip View - Coming Soon</p>
      </div>
    </div>
  );
}
