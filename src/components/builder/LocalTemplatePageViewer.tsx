/**
 * LocalTemplatePageViewer
 * Hiển thị toàn bộ ảnh trang của một local template (temp1/temp2/temp3).
 * Dùng ở Bước 3 thay thế cho editor khi templateId là local-template-*.
 */
import { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Sliders,
  Grid3x3,
  BookOpen,
  X,
} from 'lucide-react';
import autoData from '../../data/autoTemplates.json';
import { BookData } from '../../App';

export interface LocalTemplatePage {
  id: string;
  imageUrl: string;
  label: string;
}

interface LocalTemplatePageViewerProps {
  book: Partial<BookData>;
  onBack?: () => void;
  onFinish: () => void;
  onAdvancedEdit: () => void;
}

export function LocalTemplatePageViewer({
  book,
  onBack,
  onFinish,
  onAdvancedEdit,
}: LocalTemplatePageViewerProps) {
  const allTemplates = autoData.themes.flatMap(t => t.templates);
  const template = allTemplates.find(t => t.id === book.templateId);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!template) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-[#9b9088]">Không tìm thấy template.</p>
      </div>
    );
  }

  const pages: LocalTemplatePage[] = template.pages;
  const total = pages.length;

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevLightbox = () => setLightboxIdx(i => (i !== null ? Math.max(0, i - 1) : 0));
  const nextLightbox = () => setLightboxIdx(i => (i !== null ? Math.min(total - 1, i + 1) : 0));

  return (
    <div className="space-y-6">
      {/* ── Top Action Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium"
          style={{ color: '#7A6F66' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <button
            onClick={() => setViewMode(v => v === 'grid' ? 'single' : 'grid')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all text-sm font-medium border"
            style={{
              background: '#ffffff',
              color: '#5A5049',
              borderColor: '#DDD8D0',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F5F2EE')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#ffffff')}
          >
            {viewMode === 'grid' ? (
              <><BookOpen className="w-4 h-4" /> Đọc từng trang</>
            ) : (
              <><Grid3x3 className="w-4 h-4" /> Dạng lưới</>
            )}
          </button>

          {/* Advanced edit */}
          <button
            onClick={onAdvancedEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium border text-sm"
            style={{ background: '#EDE9E3', color: '#5A5049', borderColor: '#C8C2BA' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#DDD8D0')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
          >
            <Sliders className="w-4 h-4" />
            <span>Chỉnh sửa tự do</span>
          </button>

          {/* Order */}
          <button
            onClick={onFinish}
            className="flex items-center gap-2 px-5 py-2 rounded-xl transition-all font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, #000000 0%, #5A5049 100%)',
              color: '#FAFAF8',
              boxShadow: '0 4px 14px rgba(60,46,40,0.25)',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#000000')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #000000 0%, #5A5049 100%)')}
          >
            <ShoppingCart className="w-4 h-4" />
            Đặt hàng
          </button>
        </div>
      </div>

      {/* ── Template Info Banner ────────────────────────────────────── */}
      <div
        className="rounded-2xl px-5 py-4 flex items-center gap-4"
        style={{ background: '#ffffff', border: '1px solid #EDE9E3', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-14 h-20 object-cover rounded-xl flex-shrink-0 shadow-sm"
          style={{ border: '1px solid #EDE9E3' }}
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9b9088' }}>
            Phong cách đã chọn
          </p>
          <h2 className="text-lg font-bold" style={{ color: '#111' }}>{template.name}</h2>
          <p className="text-sm mt-0.5" style={{ color: '#7a6f66' }}>
            {total} trang · {template.description.split('–')[0].trim()}
          </p>
        </div>
      </div>

      {/* ── GRID VIEW ──────────────────────────────────────────────── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {pages.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => openLightbox(idx)}
              className="relative rounded-xl overflow-hidden group transition-all duration-200 hover:-translate-y-1"
              style={{
                aspectRatio: '3/4',
                border: '2px solid #eeece9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = '#c8c2ba'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#eeece9'; }}
            >
              <img
                src={page.imageUrl}
                alt={page.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Page number badge */}
              <div
                className="absolute bottom-0 left-0 right-0 py-1.5 text-center text-[10px] font-bold text-white"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
              >
                {page.label}
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-lg">Xem lớn</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── SINGLE PAGE VIEW ───────────────────────────────────────── */}
      {viewMode === 'single' && (
        <div className="flex flex-col items-center gap-4">
          {/* Main page display */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-xl"
            style={{
              width: '100%',
              maxWidth: 480,
              aspectRatio: '3/4',
              border: '2px solid #eeece9',
            }}
          >
            <img
              src={pages[currentIdx].imageUrl}
              alt={pages[currentIdx].label}
              className="w-full h-full object-contain"
              style={{ background: '#f5f5f5' }}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="w-10 h-10 flex items-center justify-center rounded-full border transition-all disabled:opacity-30"
              style={{ background: '#ffffff', borderColor: '#DDD8D0' }}
            >
              <ChevronLeft className="w-5 h-5 text-[#5A5049]" />
            </button>
            <span className="text-sm font-semibold" style={{ color: '#5A5049', minWidth: 80, textAlign: 'center' }}>
              {pages[currentIdx].label} / {total}
            </span>
            <button
              onClick={() => setCurrentIdx(i => Math.min(total - 1, i + 1))}
              disabled={currentIdx === total - 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border transition-all disabled:opacity-30"
              style={{ background: '#ffffff', borderColor: '#DDD8D0' }}
            >
              <ChevronRight className="w-5 h-5 text-[#5A5049]" />
            </button>
          </div>

          {/* Filmstrip thumbnails */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full" style={{ scrollbarWidth: 'thin' }}>
            {pages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setCurrentIdx(i)}
                className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
                style={{
                  width: 40,
                  height: 56,
                  border: i === currentIdx ? '2px solid #111' : '2px solid #eeece9',
                  opacity: i === currentIdx ? 1 : 0.55,
                }}
              >
                <img src={p.imageUrl} alt={p.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── LIGHTBOX ───────────────────────────────────────────────── */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
          onClick={closeLightbox}
        >
          <div
            className="relative flex flex-col items-center"
            style={{ maxWidth: 560, width: '96vw' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <p className="text-sm font-semibold text-white">
                {pages[lightboxIdx].label} &nbsp;·&nbsp; {lightboxIdx + 1} / {total}
              </p>
              <button
                onClick={closeLightbox}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
                style={{ background: 'rgba(255,255,255,0.12)' }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Image */}
            <div
              className="w-full rounded-2xl overflow-hidden shadow-2xl relative"
              style={{ aspectRatio: '3/4', background: '#111' }}
            >
              <img
                src={pages[lightboxIdx].imageUrl}
                alt={pages[lightboxIdx].label}
                className="w-full h-full object-contain"
              />

              {lightboxIdx > 0 && (
                <button
                  onClick={prevLightbox}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full shadow-xl hover:scale-110 transition-transform"
                  style={{ background: 'rgba(255,255,255,0.92)' }}
                >
                  <ChevronLeft className="w-5 h-5 text-[#111]" />
                </button>
              )}
              {lightboxIdx < total - 1 && (
                <button
                  onClick={nextLightbox}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full shadow-xl hover:scale-110 transition-transform"
                  style={{ background: 'rgba(255,255,255,0.92)' }}
                >
                  <ChevronRight className="w-5 h-5 text-[#111]" />
                </button>
              )}
            </div>

            {/* Filmstrip */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 max-w-full" style={{ scrollbarWidth: 'thin' }}>
              {pages.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setLightboxIdx(i)}
                  className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
                  style={{
                    width: 40,
                    height: 56,
                    border: i === lightboxIdx ? '2px solid #fff' : '2px solid transparent',
                    opacity: i === lightboxIdx ? 1 : 0.45,
                  }}
                >
                  <img src={p.imageUrl} alt={p.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
