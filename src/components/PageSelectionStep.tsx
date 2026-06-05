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
  const [hasExportedPdf, setHasExportedPdf] = useState(false);

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
      toast.error('Vui lng chn s trang chn  tip tc.');
      return;
    }
    if (!hasExportedPdf) {
      toast.error('Vui lng xut file PDF thit k trc khi tip tc.');
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
            Chn trang mun in
          </h2>
        </div>
        <p className="text-xs" style={{ color: '#7A6F66' }}>
          Chn nhng trang bn mun in trong cun sch. Trang ba lun c in km.
        </p>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-5 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: '#000000' }}>
               {totalPages} trang
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EDE9E3', color: '#5A5049' }}>
              <span className="font-bold">{selectedCount}</span> c chn
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-[#DDD8D0]"
              style={{ color: '#5A5049', background: '#EDE9E3' }}
            >
              Chn tt c
            </button>
            <button
              type="button"
              onClick={deselectAll}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-[#DDD8D0]"
              style={{ color: '#5A5049', background: '#EDE9E3' }}
            >
              B chn
            </button>
          </div>
        </div>

        {/* Even page count warning */}
        {isOdd && (
          <div className="flex items-start gap-3 p-4 rounded-xl mb-4 border-2 border-amber-200 bg-amber-50">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
            <div>
              <p className="text-sm font-bold" style={{ color: '#92400e' }}>
                S trang sch phi l s chn
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#a16207' }}>
                Bn ang chn <span className="font-bold">{selectedCount} trang (s l)</span>. Sch in yu cu s trang chn  ng gy.
                Vui lng chn thm 1 trang hoc b bt 1 trang  c s chn.
              </p>
            </div>
          </div>
        )}

        {/* Page grid */}
        {totalPages === 0 ? (
          <div className="text-center py-16 rounded-xl" style={{ background: '#FAFAF8', border: '1.5px dashed #DDD8D0' }}>
            <ImageOff className="w-12 h-12 mx-auto mb-3" style={{ color: '#C8C2BA' }} />
            <p className="text-sm font-medium" style={{ color: '#9B9088' }}>
              Cha c trang no
            </p>
            <p className="text-xs mt-1" style={{ color: '#C8C2BA' }}>
              Vui lng quay li bc thit k  thm trang cho cun sch.
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
                          {isCover ? 'Ba' : idx + 1}
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
                        Ba
                      </div>
                    )}
                  </div>

                  {/* Page number label */}
                  <span
                    className={`text-[10px] font-bold truncate max-w-full ${isSelected ? 'text-black' : ''}`}
                    style={{ color: isSelected ? '#000000' : '#9B9088' }}
                  >
                    {isCover ? ' Ba' : ` Trang ${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {/* PDF Export Section  BT BUC */}
        <div
          className="rounded-2xl p-6 transition-all"
          style={{
            background: hasExportedPdf ? '#f0fdf4' : 'white',
            border: hasExportedPdf ? '2px solid #22c55e' : '2px solid #f59e0b',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: hasExportedPdf ? '#dcfce7' : '#F5F2EE',
                  color: hasExportedPdf ? '#16a34a' : '#5A5049',
                }}
              >
                {hasExportedPdf ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#000000' }}>
                  {hasExportedPdf ? '  xut file PDF thit k' : 'Bc 1: Xut file PDF thit k'}
                </p>
                <p className="text-xs" style={{ color: hasExportedPdf ? '#16a34a' : '#dc2626' }}>
                  {hasExportedPdf
                    ? 'File PDF  sn sng. Bn c th xut li nu cn.'
                    : isOdd
                      ? `Cn chn s trang chn  xut PDF (hin c ${selectedCount} trang - l).`
                      : 'Bt buc: xut sch ra PDF trc khi sang bc giao hng.'
                  }
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              disabled={selectedCount === 0 || isOdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: hasExportedPdf ? '#16a34a' : '#000000',
                color: '#EDE9E3',
              }}
              onMouseEnter={e => {
                if (selectedCount > 0 && !isOdd) {
                  (e.currentTarget as HTMLElement).style.background = hasExportedPdf ? '#15803d' : '#1a1a1a';
                }
              }}
              onMouseLeave={e => {
                if (selectedCount > 0 && !isOdd) {
                  (e.currentTarget as HTMLElement).style.background = hasExportedPdf ? '#16a34a' : '#000000';
                }
              }}
              title={isOdd ? 'Cn s trang chn  xut PDF' : undefined}
            >
              <FileText className="w-4 h-4" />
              <span>{isOdd ? `Cn s chn (${selectedCount} trang)` : hasExportedPdf ? 'Xut li' : 'Xut PDF'}</span>
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
            Quay li
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={selectedCount === 0 || isOdd || !hasExportedPdf}
            className="flex-1 py-4 px-6 rounded-2xl font-bold transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            style={{ background: '#000000', color: '#EDE9E3', boxShadow: '0 6px 20px rgba(58,46,40,0.22)' }}
            onMouseEnter={e => {
              const t = e.currentTarget as HTMLElement;
              if (selectedCount > 0 && !isOdd && hasExportedPdf) t.style.background = '#1a1a1a';
            }}
            onMouseLeave={e => {
              const t = e.currentTarget as HTMLElement;
              if (selectedCount > 0 && !isOdd && hasExportedPdf) t.style.background = '#000000';
            }}
          >
            {!hasExportedPdf
              ? ' Cn xut PDF trc khi tip tc'
              : isOdd
                ? `Cn s trang chn (hin ti: ${selectedCount})`
                : `Tip tc (${selectedCount} trang)`}
          </button>
        </div>
      </div>

      {/* Export Modal  k tha t trang chnh sa t do, gi nguyn cc trang  chn */}
      {showExportModal && (
        <ExportModal
          title={cover?.text || 'Photobook'}
          pages={pages}
          book={null}
          initialSelectedPages={selectedIndices}
          onClose={() => setShowExportModal(false)}
          onExportComplete={() => setHasExportedPdf(true)}
        />
      )}
    </div>
  );
}
