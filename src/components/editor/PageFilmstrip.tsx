import React from 'react';
import { Plus, Copy, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { EditorPage as BookPage } from '../../types/editor';

interface PageFilmstripProps {
  pages: BookPage[];
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
}

export function PageFilmstrip({
  pages,
  currentPageIndex,
  onPageChange,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
}: PageFilmstripProps) {
  return (
    <div className="bg-white border-t border-gray-200 p-2 shadow-inner flex items-center h-[110px]">
      <div className="flex-shrink-0 flex items-center border-r border-gray-100 pr-4 mr-4 h-full">
        <button
          onClick={onAddPage}
          className="flex flex-col items-center justify-center gap-1 w-16 h-[85px] rounded-lg border-2 border-dashed border-rose-300 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
          title="Thm trang mi"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto custom-scrollbar flex-1 items-center pb-1 h-full pt-1">
        {pages.map((page, index) => (
          <div key={page.id || index} className="relative group shrink-0">
            <div className="absolute -top-1 -right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicatePage(index); }}
                className="p-1.5 bg-white shadow-md rounded-full text-blue-500 hover:text-blue-600 border border-gray-100 transform hover:scale-110 transition-transform"
                title="Nhn i trang"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {pages.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeletePage(index); }}
                  className="p-1.5 bg-white shadow-md rounded-full text-rose-500 hover:text-rose-600 border border-gray-100 transform hover:scale-110 transition-transform"
                  title="Xa trang"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => onPageChange(index)}
              className={`relative w-16 aspect-[3/4] rounded-lg border-2 overflow-hidden transition-all shadow-sm ${
                currentPageIndex === index
                  ? 'border-rose-500 ring-4 ring-rose-500/20 shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div
                className="w-full h-full flex items-center justify-center relative overflow-hidden"
                style={{
                  backgroundColor: page.background?.type === 'color' ? page.background.value : '#fff',
                  backgroundImage: page.background?.type === 'image' || page.background?.type === 'gradient'
                    ? `url("${page.background.value}")`
                    : page.background?.type === 'pattern'
                      ? page.background.value
                      : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Simplified page preview (just a label) */}
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="px-2 py-1 bg-white/90 rounded text-[10px] font-bold text-gray-700 shadow-sm">
                      {index === 0 ? 'TRANG BA' : `TRANG ${index + 1}`}
                   </div>
                </div>
                
                {/* Thumbnail markers */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center opacity-30">
                   <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </button>
            <div className={`mt-1 text-center text-[10px] font-bold ${
              currentPageIndex === index ? 'text-rose-600' : 'text-gray-400'
            }`}>
              {index === 0 ? 'Ba' : index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
