import { useState } from 'react';
import {
  X, Download, Check, Loader2, Settings,
  Image, AlertTriangle
} from 'lucide-react';
import { exportBookAsPDF, exportPageAsImage, downloadBlob, ExportQuality } from '../utils/pdfExport';
import { getPagePreview, hasTemplateFrame } from '../utils/pagePreview';
import { toast } from 'sonner@2.0.3';

interface ExportModalProps {
  title: string;
  pages: any[];
  book?: any;
  onClose: () => void;
}

const QUALITY_OPTIONS: { value: ExportQuality; label: string; desc: string }[] = [
  { value: 'standard', label: 'Tiêu chuẩn', desc: '150 DPI · File nhẹ · ~2-5MB' },
  { value: 'high',     label: 'Cao',        desc: '200 DPI · Rõ nét · ~5-10MB' },
  { value: 'print',    label: 'In ấn',      desc: '300 DPI · In chuyên nghiệp · ~10-25MB' },
];

const PAGE_SIZES = [
  { value: 'A4' as const,     label: 'A4 (210×297mm)' },
  { value: 'A5' as const,     label: 'A5 (148×210mm)' },
  { value: 'letter' as const, label: 'Letter (215×279mm)' },
];

export function ExportModal({ title, pages, book, onClose }: ExportModalProps) {
  const [selectedPages, setSelectedPages] = useState<Set<number>>(
    new Set(pages.map((_, i) => i))
  );
  const [quality, setQuality] = useState<ExportQuality>('high');
  const [pageSize, setPageSize] = useState<'A4' | 'A5' | 'letter'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');

  const totalPages = pages.length;
  const selectedCount = selectedPages.size;
  const sortedSelected = [...selectedPages].sort((a, b) => a - b);

  const togglePage = (i: number) => {
    setSelectedPages(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const selectAll = () => setSelectedPages(new Set(pages.map((_, i) => i)));
  const deselectAll = () => setSelectedPages(new Set());

  // ── Export PDF ──────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    if (selectedCount === 0) {
      toast.error('Vui lòng chọn ít nhất 1 trang để xuất.');
      return;
    }

    setIsExporting(true);
    setProgress(10);
    setProgressMsg('Đang khởi tạo...');

    try {
      const pageIndices = [...selectedPages].sort((a, b) => a - b);

      setProgress(20);
      setProgressMsg(`Đang render ${pageIndices.length} trang ở chất lượng ${quality}...`);

      const pdfBlob = await exportBookAsPDF(
        book || { id: '', theme: 'love', templateId: '', pages, status: 'draft', createdAt: '', updatedAt: '' },
        pages,
        { quality, pageSize, orientation, selectedPages: pageIndices }
      );

      setProgress(90);
      setProgressMsg('Đang tạo file...');

      const safeTitle = (title || 'sach').replace(/[^a-z0-9à-ỹ]/gi, '_').substring(0, 40);
      downloadBlob(pdfBlob, `${safeTitle}_${quality}.pdf`);

      setProgress(100);
      setProgressMsg('Hoàn tất!');
      toast.success(`✅ Đã xuất ${pageIndices.length} trang thành PDF chất lượng ${quality}!`);

      setTimeout(onClose, 1000);
    } catch (err: any) {
      console.error('PDF export error:', err);
      toast.error(err.message || 'Không thể xuất PDF. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
      setProgress(0);
      setProgressMsg('');
    }
  };

  // ── Export Images ───────────────────────────────────────────────────────
  const handleExportImages = async () => {
    if (selectedCount === 0) {
      toast.error('Vui lòng chọn ít nhất 1 trang.');
      return;
    }

    setIsExporting(true);
    setProgress(0);
    setProgressMsg('Đang xuất ảnh...');

    try {
      const pageIndices = [...selectedPages].sort((a, b) => a - b);
      for (let i = 0; i < pageIndices.length; i++) {
        const idx = pageIndices[i];
        const page = pages[idx];
        if (!page) continue;

        setProgressMsg(`Đang render trang ${idx + 1}/${totalPages}...`);

        // Render ở 2400x3600 (tương đương 300 DPI cho A4 portrait)
        const imgUrl = await exportPageAsImage(page, 2400, 3600);

        const safeTitle = (title || 'sach').replace(/[^a-z0-9à-ỹ]/gi, '_').substring(0, 30);
        const link = document.createElement('a');
        link.href = imgUrl;
        link.download = `${safeTitle}_trang_${idx + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setProgress(((i + 1) / pageIndices.length) * 100);
        await new Promise(r => setTimeout(r, 200));
      }

      toast.success(`✅ Đã xuất ${pageIndices.length} ảnh PNG!`);
      setTimeout(onClose, 1000);
    } catch (err: any) {
      console.error('Image export error:', err);
      toast.error('Không thể xuất ảnh. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
      setProgress(0);
      setProgressMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0"
          style={{ background: 'linear-gradient(135deg, #faf8f5 0%, #f5f2ee 100%)' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1a1a1a' }}>📤 Xuất sách</h2>
            <p className="text-xs mt-0.5" style={{ color: '#999' }}>
              {totalPages} trang · <span className="font-semibold text-black">{selectedCount} được chọn</span>
            </p>
          </div>
          <button onClick={onClose} disabled={isExporting}
            className="p-2 rounded-xl hover:bg-white/60 transition-colors disabled:opacity-40">
            <X className="w-5 h-5" style={{ color: '#666' }} />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Page Selection Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: '#333' }}>
                📄 Chọn trang xuất
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={selectAll}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-gray-200"
                  style={{ color: '#555', background: '#f0ede8' }}>
                  Chọn tất cả
                </button>
                <button onClick={deselectAll}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-gray-200"
                  style={{ color: '#555', background: '#f0ede8' }}>
                  Bỏ chọn
                </button>
              </div>
            </div>

            {/* Thumbnail grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
              {pages.map((page, i) => {
                const isSelected = selectedPages.has(i);
                const preview = getPagePreview(page);

                return (
                  <button
                    key={i}
                    onClick={() => !isExporting && togglePage(i)}
                    disabled={isExporting}
                    className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-200
                      ${isSelected
                        ? 'border-amber-500 shadow-md bg-amber-50/50 scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'}
                      ${isExporting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
                  >
                    {/* Thumbnail */}
                    <div
                      className="w-full aspect-[3/4] rounded-lg overflow-hidden relative border border-gray-100"
                      style={{
                        backgroundColor: page?.background?.type === 'color' ? page.background.value : '#fafafa',
                        backgroundImage: page?.background?.type === 'image'
                          ? `url("${page.background.value}")`
                          : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {/* Show elements preview */}
                      {preview ? (
                        <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[11px] font-bold" style={{ color: '#ddd' }}>
                            {i === 0 ? 'Bìa' : i + 1}
                          </span>
                        </div>
                      )}

                      {/* Checkbox badge */}
                      <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all shadow-sm
                        ${isSelected ? 'bg-amber-500 text-white scale-110' : 'bg-white/90 border-2 border-gray-300'}`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>

                      {/* Template frame indicator */}
                      {hasTemplateFrame(page) && !preview && (
                        <div className="absolute bottom-1 left-1">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-white/80">
                            Mẫu
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Page number */}
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-700' : 'text-gray-400'}`}>
                      {i === 0 ? '📔 Bìa' : `📄 Trang ${i + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gray-50/80 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: '#333' }}>
              <Settings className="w-4 h-4" /> Cài đặt xuất
            </h3>

            {/* Quality */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>Chất lượng</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {QUALITY_OPTIONS.map(opt => (
                  <button key={opt.value}
                    onClick={() => setQuality(opt.value)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${
                      quality === opt.value
                        ? 'border-black/80 bg-white shadow-sm'
                        : 'border-transparent bg-white/60 hover:border-gray-200'
                    }`}>
                    <div className="text-sm font-bold" style={{ color: '#1a1a1a' }}>{opt.label}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#aaa' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Page size + Orientation */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>Khổ giấy</label>
                <select value={pageSize} onChange={e => setPageSize(e.target.value as any)}
                  className="w-full mt-1.5 px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-gray-400"
                  style={{ color: '#333' }}>
                  {PAGE_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>Hướng</label>
                <div className="flex gap-2 mt-1.5">
                  <button onClick={() => setOrientation('portrait')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      orientation === 'portrait' ? 'border-black/80 bg-white' : 'border-gray-200 bg-white/60'}`}>
                    📱 Dọc
                  </button>
                  <button onClick={() => setOrientation('landscape')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      orientation === 'landscape' ? 'border-black/80 bg-white' : 'border-gray-200 bg-white/60'}`}>
                    🖥 Ngang
                  </button>
                </div>
              </div>
            </div>

            {/* File size estimate */}
            <div className="flex items-center gap-2 text-[11px]" style={{ color: '#bbb' }}>
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              Dung lượng ước tính: ~{estimateSize(selectedCount, quality)}MB · Định dạng: PDF vector + ảnh PNG
            </div>
          </div>
        </div>

        {/* ── Progress bar ──────────────────────────────────────────────── */}
        {isExporting && (
          <div className="px-5 pb-2 shrink-0">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-2" style={{ color: '#666' }}>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {progressMsg}
              </span>
              <span className="font-bold" style={{ color: '#111' }}>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* ── Footer buttons ────────────────────────────────────────────── */}
        <div className="p-5 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            onClick={handleExportImages}
            disabled={isExporting || selectedCount === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 transition-all
              disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ borderColor: '#e8e4de', color: '#555' }}>
            <Image className="w-4 h-4" />
            Xuất ảnh PNG{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting || selectedCount === 0}
            className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all
              disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#1a1a1a' }}>
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? 'Đang xuất...' : `Xuất PDF (${selectedCount} trang)`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function estimateSize(pageCount: number, quality: ExportQuality): string {
  const perPage: Record<ExportQuality, number> = { standard: 1.0, high: 2.0, print: 4.5 };
  return (perPage[quality] * pageCount).toFixed(1);
}
