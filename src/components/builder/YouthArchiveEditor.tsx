import { useState, useRef, useCallback } from 'react';
import { Upload, Camera, ArrowLeft, Check, ShoppingCart, Eye } from 'lucide-react';
import { BookData, PageData } from '../../App';

interface PhotoSlot {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
  shape?: 'rect' | 'circle' | 'polaroid';
}

interface YouthArchiveEditorProps {
  book: BookData;
  pages: PageData[];
  onChange: (pages: PageData[], title: string) => void;
  onBack: () => void;
  onFinish: () => void;
  onAdvancedEdit: () => void;
}

// Photo slots matching the ya-page-1.jpg layout
const COVER_SLOTS: PhotoSlot[] = [
  { id: 'ya-win-1', label: 'Cửa sổ 1', x: 23, y: 8, w: 23, h: 17 },
  { id: 'ya-win-2', label: 'Cửa sổ 2', x: 49, y: 8, w: 23, h: 17 },
  { id: 'ya-win-3', label: 'Cửa sổ 3', x: 23, y: 27, w: 23, h: 17 },
  { id: 'ya-win-4', label: 'Cửa sổ 4', x: 49, y: 27, w: 23, h: 17 },
  { id: 'ya-pol-1', label: 'Polaroid 1', x: 9, y: 66, w: 24, h: 15, rotation: -10 },
  { id: 'ya-pol-2', label: 'Polaroid 2', x: 38, y: 56, w: 24, h: 15, rotation: 5 },
  { id: 'ya-pol-3', label: 'Polaroid 3', x: 61, y: 67, w: 24, h: 15, rotation: -3 },
];

// Photo slots matching the ya-page-2.png layout
const PAGE2_SLOTS: PhotoSlot[] = [
  { id: 'ya2-main', label: 'Ảnh chính', x: 19, y: 15, w: 62, h: 29 },
  { id: 'ya2-sq', label: 'Khung vuông', x: 16, y: 50, w: 30, h: 20 },
  { id: 'ya2-curly', label: 'Khung viền', x: 19, y: 76, w: 26, h: 16 },
  { id: 'ya2-film-1', label: 'Film 1', x: 55, y: 51, w: 29, h: 18 },
  { id: 'ya2-film-2', label: 'Film 2', x: 55, y: 71, w: 29, h: 18 },
];

const PAGE3_SLOTS: PhotoSlot[] = [
  { id: 'ya3-photo', label: 'Ảnh chính', x: 7, y: 7, w: 86, h: 60 },
];

const PAGE4_SLOTS: PhotoSlot[] = [
  { id: 'ya4-fp1', label: 'Strip 1', x: 5, y: 14, w: 20, h: 20 },
  { id: 'ya4-fp2', label: 'Strip 2', x: 28, y: 14, w: 20, h: 20 },
  { id: 'ya4-fp3', label: 'Strip 3', x: 51, y: 14, w: 20, h: 20 },
  { id: 'ya4-fp4', label: 'Strip 4', x: 74, y: 14, w: 20, h: 20 },
  { id: 'ya4-p5', label: 'Ảnh lớn 1', x: 5, y: 47, w: 42, h: 40 },
  { id: 'ya4-p6', label: 'Ảnh lớn 2', x: 53, y: 47, w: 42, h: 40 },
];

const PAGE5_SLOTS: PhotoSlot[] = [
  { id: 'ya5-photo1', label: 'Ảnh kỷ niệm', x: 5, y: 24, w: 90, h: 45 },
];

const ALL_PAGES_SLOTS = [COVER_SLOTS, PAGE2_SLOTS, PAGE3_SLOTS, PAGE4_SLOTS, PAGE5_SLOTS];

const PAGE_LABELS = ['Trang bìa', 'Bộ sưu tập ảnh', 'Khoảnh khắc đặc biệt', 'Hành trình', 'Ghi lại kỷ niệm'];

const PAGE_BG_COLORS = ['#6B4A2A', '#F5EFE6', '#5C3D20', '#1A1A1A', '#F5EFE6'];

export function YouthArchiveEditor({ book, pages, onChange, onBack, onFinish, onAdvancedEdit }: YouthArchiveEditorProps) {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<{ [slotId: string]: string }>({});
  const [bookTitle, setBookTitle] = useState(book.title || 'Youth Archive 2025');
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingSlotId, setPendingSlotId] = useState<string | null>(null);

  const currentSlots = ALL_PAGES_SLOTS[currentPageIdx] || [];
  const totalSlots = ALL_PAGES_SLOTS.flat().length;
  const filledSlots = Object.keys(uploadedImages).filter(id => uploadedImages[id]).length;

  const handleSlotClick = (slotId: string) => {
    setPendingSlotId(slotId);
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingSlotId) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const key = `dearbook_ya_${pendingSlotId}_${Date.now()}`;
      localStorage.setItem(key, dataUrl);
      setUploadedImages(prev => ({ ...prev, [pendingSlotId]: dataUrl }));
      // Update pages data
      const updatedPages = pages.map((p, i) => ({
        ...p,
        images: { ...p.images, [pendingSlotId]: dataUrl },
      }));
      onChange(updatedPages, bookTitle);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [pendingSlotId, pages, onChange, bookTitle]);

  const getSlotStyle = (slot: PhotoSlot) => {
    const img = uploadedImages[slot.id];
    const isHovered = hoveredSlot === slot.id;

    return {
      position: 'absolute' as const,
      left: `${slot.x}%`,
      top: `${slot.y}%`,
      width: `${slot.w}%`,
      height: `${slot.h}%`,
      transform: slot.rotation ? `rotate(${slot.rotation}deg)` : undefined,
      cursor: 'pointer',
      overflow: 'hidden',
      borderRadius: slot.shape === 'circle' ? '50%' : slot.shape === 'polaroid' ? '3px' : '6px',
      border: img ? 'none' : `2px dashed ${isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'}`,
      background: img
        ? 'transparent'
        : isHovered
        ? 'rgba(255,255,255,0.2)'
        : 'rgba(255,255,255,0.08)',
      transition: 'all 0.3s ease',
      boxShadow: img ? '0 2px 10px rgba(0,0,0,0.2)' : 'none',
      animation: img ? 'none' : 'pulse-soft 2s infinite',
    };
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#F7F4F0', backgroundImage: 'radial-gradient(#D5CFC5 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <style>{`
        @keyframes pulse-soft {
          0% { background-color: rgba(255,255,255,0.05); }
          50% { background-color: rgba(255,255,255,0.15); }
          100% { background-color: rgba(255,255,255,0.05); }
        }
      `}</style>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(229, 223, 213, 0.8)' }}>
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-[#8C6E5D] hover:text-[#4A3B32] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <div className="text-center absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <input
            type="text"
            value={bookTitle}
            onChange={e => setBookTitle(e.target.value)}
            className="text-center bg-transparent text-[#4A3B32] font-bold text-2xl outline-none border-b border-transparent focus:border-[#C4956A]/50 transition-colors"
            style={{ fontFamily: 'Dancing Script, cursive', minWidth: '250px' }}
          />
          <p className="text-xs font-medium text-[#8C6E5D]/80 mt-1">{filledSlots}/{totalSlots} ảnh đã thêm</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAdvancedEdit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white"
            style={{ border: '1.5px solid rgba(196,149,106,0.5)', color: '#C4956A', boxShadow: '0 2px 8px rgba(196,149,106,0.1)' }}
          >
            Chỉnh sửa tự do
          </button>
          <button
            onClick={onFinish}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #C4956A, #8B5E3C)', color: '#fff', boxShadow: '0 6px 16px rgba(196,149,106,0.3)' }}
          >
            <ShoppingCart className="w-4 h-4" />
            Đặt hàng
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 w-full" style={{ background: '#E5DFD5' }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${(filledSlots / totalSlots) * 100}%`, background: '#C4956A' }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Page strip sidebar */}
        <div className="hidden md:flex flex-col gap-5 p-5 overflow-y-auto" style={{ width: '140px', background: 'rgba(255,255,255,0.4)', borderRight: '1px solid rgba(229, 223, 213, 0.8)' }}>
          {PAGE_LABELS.map((label, idx) => {
            const pageSlots = ALL_PAGES_SLOTS[idx] || [];
            const pageFilled = pageSlots.filter(s => uploadedImages[s.id]).length;
            return (
              <button
                key={idx}
                onClick={() => setCurrentPageIdx(idx)}
                className="group relative flex flex-col items-center gap-2 transition-all w-full"
              >
                <div 
                  className="w-full relative rounded-xl overflow-hidden shadow-sm transition-all duration-300"
                  style={{
                    border: currentPageIdx === idx ? '3px solid #C4956A' : '3px solid #E5DFD5',
                    background: PAGE_BG_COLORS[idx],
                    height: '110px',
                    opacity: currentPageIdx === idx ? 1 : 0.8,
                    transform: currentPageIdx === idx ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <span className="absolute top-1.5 left-1.5 text-white/90 text-xs font-bold drop-shadow-md" style={{ fontSize: '11px' }}>0{idx + 1}</span>
                  {pageFilled === pageSlots.length && pageSlots.length > 0 && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#8B5E3C] border-2 border-white flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-center font-medium transition-colors" style={{ fontSize: '11px', color: currentPageIdx === idx ? '#4A3B32' : '#8C6E5D' }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main canvas area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6 overflow-y-auto">
          <div className="flex items-center gap-2 text-[#8C6E5D] bg-white/60 px-5 py-2 rounded-full shadow-sm border border-[#E5DFD5]">
            <span className="text-lg">📸</span>
            <span className="text-sm font-medium">Click vào khung trống để tải ảnh lên • <strong>{PAGE_LABELS[currentPageIdx]}</strong></span>
          </div>

          {/* Canvas */}
          <div
            className="relative rounded-sm overflow-hidden"
            style={{
              width: 'min(420px, 85vw)',
              aspectRatio: '5/7',
              background: PAGE_BG_COLORS[currentPageIdx],
              boxShadow: '0 25px 50px -12px rgba(74, 59, 50, 0.25), 0 0 0 1px rgba(74, 59, 50, 0.05)',
            }}
          >
            {/* Page content overlay */}
            {currentPageIdx === 0 && (
              <img src="/templates/ya-page-1.jpg" alt="Template Page 1" className="absolute inset-0 w-full h-full object-cover z-0" />
            )}
            {currentPageIdx === 1 && (
              <img src="/templates/ya-page-2.png" alt="Template Page 2" className="absolute inset-0 w-full h-full object-cover z-0" />
            )}
            {currentPageIdx === 2 && (
              <>
                <div className="absolute" style={{ bottom: '10%', left: '5%', right: '5%', fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(13px, 3vw, 18px)', color: '#F5E6D0', textAlign: 'center', fontStyle: 'italic', zIndex: 2 }}>"Tuổi trẻ là khi bạn dám ước mơ và dám sống hết mình."</div>
                <div className="absolute" style={{ bottom: '3%', left: '5%', right: '5%', fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(8px, 2vw, 11px)', color: '#C4956A', textAlign: 'center', zIndex: 2 }}>— Youth Archive 2025</div>
              </>
            )}
            {currentPageIdx === 3 && (
              <>
                <div className="absolute" style={{ top: '2%', left: '5%', right: '5%', fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(16px, 4vw, 26px)', color: '#F5E6D0', textAlign: 'center', fontWeight: 700, zIndex: 2 }}>The Journey</div>
                {/* Film strip bg horizontal */}
                <div className="absolute" style={{ top: '12%', left: 0, right: 0, height: '20%', background: '#0A0A0A', zIndex: 1 }} />
                <div className="absolute" style={{ top: '34%', left: '5%', right: '5%', fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(8px, 2vw, 11px)', color: '#AAA', textAlign: 'center', fontStyle: 'italic', zIndex: 2 }}>Ghi lại hành trình của bạn...</div>
                <div className="absolute" style={{ bottom: '4%', left: '40%', fontSize: 'clamp(14px, 3vw, 20px)', zIndex: 3 }}>🎞️</div>
              </>
            )}
            {currentPageIdx === 4 && (
              <>
                <div className="absolute" style={{ top: '4%', left: '5%', right: '5%', fontSize: 'clamp(18px, 4vw, 28px)', textAlign: 'center', zIndex: 2 }}>📸</div>
                <div className="absolute" style={{ top: '12%', left: '5%', right: '5%', fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(16px, 4vw, 24px)', color: '#5C3D20', textAlign: 'center', fontWeight: 700, zIndex: 2 }}>Ghi lại khoảnh khắc</div>
                <div className="absolute" style={{ bottom: '12%', left: '5%', right: '5%', fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(9px, 2vw, 13px)', color: '#7A5C3A', textAlign: 'center', fontStyle: 'italic', zIndex: 2 }}>Viết điều bạn muốn ghi nhớ về khoảnh khắc này...</div>
                <div className="absolute" style={{ bottom: '4%', left: '5%', right: '5%', fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(8px, 2vw, 12px)', color: '#C4956A', textAlign: 'center', zIndex: 2 }}>📅 Ngày... tháng... năm...</div>
              </>
            )}

            {/* Photo slots */}
            {currentSlots.map(slot => {
              const img = uploadedImages[slot.id];
              const isHovered = hoveredSlot === slot.id;

              return (
                <div
                  key={slot.id}
                  style={{...getSlotStyle(slot), zIndex: 10}}
                  onClick={() => handleSlotClick(slot.id)}
                  onMouseEnter={() => setHoveredSlot(slot.id)}
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  {img ? (
                    <img src={img} alt={slot.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <Upload className="text-white/70" style={{ width: 'clamp(10px, 3%, 18px)', height: 'clamp(10px, 3%, 18px)' }} />
                      <span className="text-white/70 text-center font-medium" style={{ fontSize: 'clamp(6px, 1.5%, 10px)', padding: '0 4px' }}>
                        {slot.label}
                      </span>
                    </div>
                  )}
                  {/* Edit overlay on hover */}
                  {img && isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <Camera className="text-white" style={{ width: '20px', height: '20px' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-2 mt-2">
            {PAGE_LABELS.map((label, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPageIdx(idx)}
                className="flex flex-col items-center gap-1 transition-all"
              >
                <div
                  className="rounded-full transition-all"
                  style={{
                    width: currentPageIdx === idx ? '32px' : '10px',
                    height: '10px',
                    background: currentPageIdx === idx ? '#C4956A' : 'rgba(255,255,255,0.25)',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Upload hint */}
          <div className="text-center max-w-sm mt-2">
            <p className="text-[#8C6E5D] text-xs font-medium bg-white/40 px-4 py-2 rounded-lg border border-[#E5DFD5]">
              {currentPageIdx === 0
                ? `Bìa Scrapbook có ${COVER_SLOTS.length} khung ảnh • Hãy điền đầy đủ nhé`
                : `Trang ${currentPageIdx + 1} • ${currentSlots.length} khung ảnh`}
            </p>
          </div>
        </div>

        {/* Right panel: instructions */}
        <div className="hidden xl:flex flex-col gap-6 p-6 overflow-y-auto" style={{ width: '260px', background: 'rgba(255,255,255,0.4)', borderLeft: '1px solid rgba(229, 223, 213, 0.8)' }}>
          <div className="bg-white/80 rounded-2xl p-5 shadow-sm border border-[#E5DFD5]">
            <h3 className="text-[#4A3B32] font-bold text-base mb-4 flex items-center gap-2">
              <span className="bg-[#F5EFE6] p-1.5 rounded-lg text-[#C4956A]"><Eye className="w-4 h-4" /></span>
              Hướng dẫn
            </h3>
            <div className="space-y-4 text-sm text-[#7A6F66]">
              <div className="flex items-start gap-3">
                <div className="bg-[#F5EFE6] w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow-sm">👆</div>
                <p className="leading-snug">Click vào <strong>khung trống</strong> trên sách để chọn ảnh</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#F5EFE6] w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow-sm">🔄</div>
                <p className="leading-snug">Click lại vào ảnh đã điền để <strong>thay ảnh khác</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#F5EFE6] w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow-sm">✨</div>
                <p className="leading-snug">Sử dụng nút <strong>Chỉnh sửa tự do</strong> phía trên để thêm chữ, sticker</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-5 shadow-sm border border-[#E5DFD5]">
            <h3 className="text-[#4A3B32] font-bold text-sm mb-3">Tiến độ bộ sưu tập</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full" style={{ background: '#E5DFD5' }}>
                <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${(filledSlots / totalSlots) * 100}%`, background: '#C4956A' }} />
              </div>
              <span className="text-[#4A3B32] font-bold text-sm">{filledSlots}/{totalSlots}</span>
            </div>
            {filledSlots === totalSlots && (
              <div className="mt-3 text-xs text-[#8B5E3C] font-medium text-center bg-[#F5EFE6] py-1.5 rounded-md">
                🎉 Tuyệt vời! Đã hoàn thành!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
