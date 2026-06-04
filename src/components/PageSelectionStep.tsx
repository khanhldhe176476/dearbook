import { useState } from 'react';
import { ArrowLeft, Check, Lock, ImageOff, BookOpen, AlertTriangle, FileText } from 'lucide-react';
import { getPageThumbnail } from '../utils/pagePreview';
import { ExportModal } from './ExportModal';
import { toast } from 'sonner@2.0.3';

interface PageSelectionStepProps {
  pages: any[];
  cover?: any;
  onNext: (selectedPageIds: string[]) => void;
  onBack: () => void;
}

export function PageSelectionStep({ pages, cover, onNext, onBack }: PageSelectionStepProps) {
  // All pages selected by default; cover (index 0) is always locked
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(pages.map((_, i) => i))
  );

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);

  const totalPages = pages.length;
  const selectedCount = selectedIndices.size;
  const isOdd = selectedCount % 2 !== 0;

  const togglePage = (idx: number) => {
    if (idx === 0) return; // Cover is locked
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const selectAll = () => setSelectedIndices(new Set(pages.map((_, i) => i)));
  const deselectAll = () => {
    // Keep cover (index 0) selected
    const next = new Set<number>();
    next.add(0);
    setSelectedIndices(next);
  };

  const handleContinue = () => {
    if (isOdd) {
      toast.error('Vui lòng chọn số trang chẵn để tiếp tục.');
      return;
    }

    const selectedPageIds = Array.from(selectedIndices)
      .sort((a, b) => a - b)
      .map(idx => {
        const page = pages[idx];
        return page?.id || page?.templatePageId || `page-${idx}`;
      });
    onNext(selectedPageIds);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1.5px solid #DDD8D0' }}>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5" style={{ color: '#7A6F66' }} />
          <h2 className="text-lg font-bold" style={{ color: '#000000' }}>
            Chọn trang muốn in
          </h2>
        </div>
        <p className="text-xs" style={{ color: '#7A6F66' }}>
          Chọn những trang bạn muốn in trong cuốn sách. Trang bìa luôn được in kèm.
        </p>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-5 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: '#000000' }}>
              📄 {totalPages} trang
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EDE9E3', color: '#5A5049' }}>
              <span className="font-bold">{selectedCount}</span> được chọn
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-[#DDD8D0]"
              style={{ color: '#5A5049', background: '#EDE9E3' }}
            >
              Chọn tất cả
            </button>
            <button
              type="button"
              onClick={deselectAll}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-[#DDD8D0]"
              style={{ color: '#5A5049', background: '#EDE9E3' }}
            >
              Bỏ chọn
            </button>
          </div>
        </div>

        {/* Even page count warning */}
        {isOdd && (
          <div className="flex items-start gap-3 p-4 rounded-xl mb-4 border-2 border-amber-200 bg-amber-50">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
            <div>
              <p className="text-sm font-bold" style={{ color: '#92400e' }}>
                Số trang sách phải là số chẵn
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#a16207' }}>
                Bạn đang chọn <span className="font-bold">{selectedCount} trang (số lẻ)</span>. Sách in yêu cầu số trang chẵn để đóng gáy.
                Vui lòng chọn thêm 1 trang hoặc bỏ bớt 1 trang để được số chẵn.
              </p>
            </div>
          </div>
        )}

        {/* Page grid */}
        {totalPages === 0 ? (
          <div className="text-center py-16 rounded-xl" style={{ background: '#FAFAF8', border: '1.5px dashed #DDD8D0' }}>
            <ImageOff className="w-12 h-12 mx-auto mb-3" style={{ color: '#C8C2BA' }} />
            <p className="text-sm font-medium" style={{ color: '#9B9088' }}>
              Chưa có trang nào
            </p>
            <p className="text-xs mt-1" style={{ color: '#C8C2BA' }}>
              Vui lòng quay lại bước thiết kế để thêm trang cho cuốn sách.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
            {pages.map((page, idx) => {
              const isSelected = selectedIndices.has(idx);
              const isCover = idx === 0;
              const thumb = getPageThumbnail(page);

              return (
                <button
                  key={page?.id || page?.templatePageId || idx}
                  type="button"
                  onClick={() => togglePage(idx)}
                  className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-200
                    ${isSelected
                      ? 'border-[#000000] shadow-md bg-[#FAFAF8] scale-[1.02]'
                      : 'border-[#DDD8D0] hover:border-[#C8C2BA] bg-white'}
                    ${isCover ? 'cursor-default' : 'cursor-pointer hover:shadow-sm'}`}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-full aspect-[3/4] rounded-lg overflow-hidden relative border border-[#EDE9E3]"
                    style={{
                      backgroundColor: thumb.bgColor || '#fafafa',
                      backgroundImage: thumb.bgImage ? `url("${thumb.bgImage}")` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Overlay preview image */}
                    {thumb.imageUrl ? (
                      <img
                        src={thumb.imageUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[11px] font-bold" style={{ color: '#C8C2BA' }}>
                          {isCover ? 'Bìa' : idx + 1}
                        </span>
                      </div>
                    )}

                    {/* Checkbox badge */}
                    <div
                      className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all shadow-sm
                        ${isSelected ? 'bg-black text-[#EDE9E3] scale-110' : 'bg-white/90 border-2 border-[#C8C2BA]'}`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>

                    {/* Cover lock badge */}
                    {isCover && (
                      <div className="absolute bottom-1 left-1 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-black/50 text-white/90">
                        <Lock className="w-2.5 h-2.5" />
                        Bìa
                      </div>
                    )}
                  </div>

                  {/* Page number label */}
                  <span
                    className={`text-[10px] font-bold truncate max-w-full ${isSelected ? 'text-black' : ''}`}
                    style={{ color: isSelected ? '#000000' : '#9B9088' }}
                  >
                    {isCover ? '📔 Bìa' : `📄 Trang ${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {/* PDF Export Section — tùy chọn, kế thừa từ ExportModal của trang chỉnh sửa tự do */}
        <div className="rounded-2xl p-6" style={{ background: 'white', border: '1.5px solid #DDD8D0' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: '#F5F2EE', color: '#5A5049' }}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#000000' }}>
                  Xuất file PDF
                </p>
                <p className="text-xs" style={{ color: '#7A6F66' }}>
                  Tùy chọn: xuất sách ra PDF với chất lượng tùy chỉnh (in ấn lên đến 300 DPI).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              disabled={selectedCount === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#000000', color: '#EDE9E3' }}
              onMouseEnter={e => {
                if (selectedCount > 0) (e.currentTarget as HTMLElement).style.background = '#1a1a1a';
              }}
              onMouseLeave={e => {
                if (selectedCount > 0) (e.currentTarget as HTMLElement).style.background = '#000000';
              }}
            >
              <FileText className="w-4 h-4" />
              <span>Xuất PDF</span>
            </button>
          </div>
        </div>

        {/* Continue buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 px-6 rounded-2xl font-semibold transition-all"
            style={{ background: '#EDE9E3', color: '#5A5049' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#DDD8D0')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={selectedCount === 0 || isOdd}
            className="flex-1 py-4 px-6 rounded-2xl font-bold transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            style={{ background: '#000000', color: '#EDE9E3', boxShadow: '0 6px 20px rgba(58,46,40,0.22)' }}
            onMouseEnter={e => {
              const t = e.currentTarget as HTMLElement;
              if (selectedCount > 0 && !isOdd) t.style.background = '#1a1a1a';
            }}
            onMouseLeave={e => {
              const t = e.currentTarget as HTMLElement;
              if (selectedCount > 0 && !isOdd) t.style.background = '#000000';
            }}
          >
            {isOdd
              ? `Cần số trang chẵn (hiện tại: ${selectedCount})`
              : `Tiếp tục (${selectedCount} trang)`}
          </button>
        </div>
      </div>

      {/* Export Modal — kế thừa từ trang chỉnh sửa tự do, giữ nguyên các trang đã chọn */}
      {showExportModal && (
        <ExportModal
          title={cover?.text || 'Photobook'}
          pages={pages}
          book={null}
          initialSelectedPages={selectedIndices}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
