import { useRef, useState } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Book, PageElement } from '../../App';

interface EditorCanvasProps {
  book: Book;
  currentPageIndex: number;
  selectedElementId: string | null;
  zoom: number;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: any) => void;
  onDeleteElement: (id: string) => void;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDeletePage: (index: number) => void;
}

export function EditorCanvas({
  book,
  currentPageIndex,
  selectedElementId,
  zoom,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onSelectPage,
  onAddPage,
  onDeletePage,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const currentPage = book.pages[currentPageIndex];
  const scale = zoom / 100;

  const handleElementMouseDown = (e: React.MouseEvent, element: PageElement) => {
    e.stopPropagation();
    onSelectElement(element.id);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggedElement(element.id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedElement && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left - dragOffset.x) / scale;
      const y = (e.clientY - canvasRect.top - dragOffset.y) / scale;
      
      onUpdateElement(draggedElement, {
        position: { x: Math.max(0, x), y: Math.max(0, y) }
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Page Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectPage(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
            Trang {currentPageIndex + 1} / {book.pages.length}
          </span>
          
          <button
            onClick={() => onSelectPage(Math.min(book.pages.length - 1, currentPageIndex + 1))}
            disabled={currentPageIndex === book.pages.length - 1}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddPage}
            className="px-3 py-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thm trang
          </button>
          
          {book.pages.length > 1 && (
            <button
              onClick={() => onDeletePage(currentPageIndex)}
              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              title="Xa trang"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div
        className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-8"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="bg-white shadow-2xl relative"
          style={{
            width: `${500 * scale}px`,
            height: `${700 * scale}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          {/* Page Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" />

          {/* Elements */}
          {currentPage.elements.map((element) => (
            <DraggableElement
              key={element.id}
              element={element}
              isSelected={element.id === selectedElementId}
              onMouseDown={(e) => handleElementMouseDown(e, element)}
              onClick={() => onSelectElement(element.id)}
            />
          ))}

          {/* Selected Element Controls */}
          {selectedElementId && (
            <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg p-1 flex gap-1">
              <button
                onClick={() => onDeleteElement(selectedElementId)}
                className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                title="Xa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Page Thumbnails */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {book.pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => onSelectPage(index)}
              className={`flex-shrink-0 w-24 h-32 rounded-lg border-2 transition-all ${
                index === currentPageIndex
                  ? 'border-purple-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-lg flex items-center justify-center text-xs text-gray-600">
                {index + 1}
              </div>
            </button>
          ))}
          
          <button
            onClick={onAddPage}
            className="flex-shrink-0 w-24 h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors flex items-center justify-center text-gray-400 hover:text-purple-600"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DraggableElement({
  element,
  isSelected,
  onMouseDown,
  onClick,
}: {
  element: PageElement;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
      style={{
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
        fontSize: element.style.fontSize,
        fontFamily: element.style.fontFamily,
        color: element.style.color,
        backgroundColor: element.style.backgroundColor,
        borderRadius: element.style.borderRadius,
        opacity: element.style.opacity,
      }}
    >
      {element.type === 'text' && (
        <div className="w-full h-full p-2 break-words">
          {element.content}
        </div>
      )}
      {element.type === 'image' && (
        <img
          src={element.content}
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
      )}
      {element.type === 'shape' && (
        <div className="w-full h-full" />
      )}
    </div>
  );
}
