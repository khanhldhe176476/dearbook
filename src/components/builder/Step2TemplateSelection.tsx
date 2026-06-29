import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Check, Layout, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { PageData } from '../../App';
import autoData from '../../data/autoTemplates.json';
import { supabase } from '../../lib/supabase';

export interface LocalTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  badge?: string;
  aspectRatio?: string;
  pages: {
    id: string;
    imageUrl: string;
    label: string;
  }[];
}

interface Step2TemplateSelectionProps {
  theme: string;
  selectedTemplateId?: string;
  onSelect: (templateId: string, pages: PageData[]) => void;
  onBack: () => void;
}

// ── Preview Modal: hiển thị toàn bộ trang của template ────────────────────
function TemplatePreviewModal({
  template,
  onClose,
  onSelect,
}: {
  template: LocalTemplate;
  onClose: () => void;
  onSelect: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const total = template.pages.length;
  const page = template.pages[currentIdx];

  const prev = () => setCurrentIdx(i => Math.max(0, i - 1));
  const next = () => setCurrentIdx(i => Math.min(total - 1, i + 1));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center"
        style={{ maxWidth: 540, width: '96vw' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-base font-bold text-white leading-tight">{template.name}</h2>
            <p className="text-xs text-white/60 mt-0.5">
              Trang {currentIdx + 1} / {total}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onSelect}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: '#ffffff', color: '#111' }}
            >
              <Check className="w-3.5 h-3.5 inline mr-1" />
              Chọn mẫu này
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Page image */}
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: '#1a1a1a', aspectRatio: template.aspectRatio || '3/4' }}
        >
          <img
            src={page.imageUrl}
            alt={page.label}
            className="w-full h-full object-contain"
          />

          {/* Nav arrows */}
          {currentIdx > 0 && (
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.92)' }}
            >
              <ChevronLeft className="w-5 h-5 text-[#111]" />
            </button>
          )}
          {currentIdx < total - 1 && (
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.92)' }}
            >
              <ChevronRight className="w-5 h-5 text-[#111]" />
            </button>
          )}

          {/* Label */}
          <div
            className="absolute bottom-0 left-0 right-0 px-4 py-2 text-xs font-semibold text-white text-center"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
          >
            {page.label}
          </div>
        </div>

        {/* Thumbnail filmstrip */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 max-w-full" style={{ scrollbarWidth: 'thin' }}>
          {template.pages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrentIdx(i)}
              className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
              style={{
                width: 44,
                height: 60,
                border: i === currentIdx ? '2px solid #ffffff' : '2px solid transparent',
                opacity: i === currentIdx ? 1 : 0.5,
              }}
            >
              <img src={p.imageUrl} alt={p.label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Step2 Component ───────────────────────────────────────────────────
export function Step2TemplateSelection({
  theme,
  selectedTemplateId,
  onSelect,
  onBack,
}: Step2TemplateSelectionProps) {
  const [previewTemplate, setPreviewTemplate] = useState<LocalTemplate | null>(null);
  const [supabaseTemplates, setSupabaseTemplates] = useState<LocalTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSupabaseTemplates = async () => {
      if (!supabase) return;
      try {
        setLoading(true);
        console.log(`📡 Fetching Supabase templates for theme: ${theme}`);
        // 1. Fetch categories to find the ID corresponding to selected theme slug
        const { data: catData, error: catError } = await supabase
          .from('book_categories')
          .select('id, slug')
          .eq('slug', theme)
          .single();

        if (catError || !catData) {
          console.warn('⚠️ Category not found in Supabase:', catError);
          setSupabaseTemplates([]);
          return;
        }

        const categoryId = catData.id;

        // 2. Fetch templates for this category
        const { data: tplData, error: tplError } = await supabase
          .from('book_templates')
          .select('*')
          .eq('category_id', categoryId)
          .eq('is_active', true);

        if (tplError || !tplData || tplData.length === 0) {
          console.log('No templates found in Supabase for category:', categoryId);
          setSupabaseTemplates([]);
          return;
        }

        // 3. For each template, fetch its template_pages
        const formattedTemplates: LocalTemplate[] = [];
        for (const tpl of tplData) {
          const { data: pageData, error: pageError } = await supabase
            .from('template_pages')
            .select('*')
            .eq('template_id', tpl.id)
            .order('page_number', { ascending: true });

          if (pageError) {
            console.error('Error fetching template pages:', pageError);
            continue;
          }

          const mappedPages = (pageData || []).map((p: any) => {
            const defContent = p.default_content || {};
            return {
              id: p.id,
              imageUrl: defContent.backgroundImage || defContent.imageUrl || tpl.cover_image_url || '',
              label: p.page_number === 1 ? 'Trang bìa' : `Trang ${p.page_number - 1}`
            };
          });

          formattedTemplates.push({
            id: tpl.id,
            name: tpl.name,
            description: tpl.description || 'Mẫu thiết kế cao cấp.',
            thumbnail: tpl.cover_image_url || (mappedPages[0]?.imageUrl || ''),
            pages: mappedPages
          });
        }

        console.log('✅ Loaded Supabase templates:', formattedTemplates);
        setSupabaseTemplates(formattedTemplates);
      } catch (err) {
        console.error('❌ Exception loading Supabase templates:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSupabaseTemplates();
  }, [theme]);

  // Combine local templates with Supabase templates
  // Translate theme slug if needed (e.g. love -> tinh-yeu)
  const mappedThemeId = theme === 'love' ? 'tinh-yeu' : (theme === 'friendship' ? 'ban-be' : (theme === 'family' ? 'gia-dinh' : theme));
  const localTemplates = autoData.themes.find(t => t.id === mappedThemeId)?.templates || [];
  
  const templates = [...supabaseTemplates, ...localTemplates];

  const handleSelectTemplate = (template: LocalTemplate) => {
    // Chuyển đổi pages của local template sang PageData
    const pages: PageData[] = template.pages.map(p => ({
      id: p.id,
      templatePageId: p.id,
      texts: {},
      images: { pageImage: p.imageUrl },
    }));
    onSelect(template.id, pages);
    setPreviewTemplate(null);
  };

  const badgeLabel: Record<string, string> = {
    bestseller: '🔥 Bán chạy',
    popular: '⭐ Phổ biến',
    new: '✨ Mới',
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-200 text-sm font-semibold group hover:-translate-x-0.5"
        style={{
          color: '#7a6f66',
          background: '#ffffff',
          border: '1px solid #eeece9',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#faf8f5';
          e.currentTarget.style.borderColor = '#ddd8d0';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.borderColor = '#eeece9';
        }}
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Quay lại chọn chủ đề</span>
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#9ca3af' }}>
          Bước 2 · Phong cách thiết kế
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: '#111827' }}>
          Chọn phong cách thiết kế
        </h2>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#6b7280' }}>
          Mỗi mẫu được thiết kế chuyên nghiệp với đầy đủ trang bìa và nội dung. Bạn có thể xem trước toàn bộ trước khi chọn.
        </p>
      </div>

      {/* Template Grid */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="ml-2 mt-2 text-sm text-[#7a6f66]">Đang tải phong cách thiết kế từ Supabase...</span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {templates.map((template) => {
          const isSelected = selectedTemplateId === template.id;

          return (
            <div
              key={template.id}
              className="relative rounded-xl overflow-hidden transition-all duration-300 flex flex-col group"
              style={{
                background: '#ffffff',
                border: isSelected ? '2px solid #2D2421' : '1px solid rgba(45, 36, 33, 0.12)',
                boxShadow: isSelected
                  ? '0 18px 42px rgba(45,36,33,0.13)'
                  : '0 10px 28px rgba(45,36,33,0.06)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
              }}
            >
              {/* Preview Image (trang bìa) */}
              <div className="relative overflow-hidden bg-[#faf8f5] flex-shrink-0" style={{ aspectRatio: template.aspectRatio || '3/4' }}>
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badge */}
                {template.badge && (
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md"
                    style={{ background: '#111111', color: '#f3e9d7' }}
                  >
                    {badgeLabel[template.badge]}
                  </div>
                )}

                {/* Page count */}
                <div className="absolute top-3 right-3">
                  <div
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md"
                    style={{
                      background: 'rgba(255,255,255,0.92)',
                      color: '#111',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <Layout className="w-3.5 h-3.5 text-[#8c6e5d]" />
                    {template.pages.length} trang
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Selected check */}
                {isSelected && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.25)' }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
                      style={{ background: '#111' }}
                    >
                      <Check className="w-7 h-7 text-emerald-400" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>

              {/* Info & Actions */}
              <div className="p-5 flex flex-col flex-1 gap-3 justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#2D2421] mb-1 leading-snug">{template.name}</h3>
                  <p className="text-xs leading-relaxed text-[#7a6f66]">{template.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 border"
                    style={{ background: '#faf8f5', color: '#2D2421', borderColor: '#e6ded5' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f0ede8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#faf8f5'; }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem mẫu
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(template)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: isSelected ? '#2F6F5F' : '#2D2421',
                      color: '#fffdf9',
                      boxShadow: isSelected ? '0 4px 12px rgba(5,150,105,0.25)' : '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = isSelected ? '#285f52' : '#171211'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isSelected ? '#2F6F5F' : '#2D2421'; }}
                  >
                    {isSelected ? (
                      <><Check className="w-3.5 h-3.5 text-emerald-300" strokeWidth={3} /> Đã chọn</>
                    ) : 'Sử dụng mẫu này'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Tip banner */}
      <div
        className="max-w-3xl mx-auto flex items-start gap-0.5 rounded-2xl overflow-hidden shadow-sm"
        style={{ background: '#ffffff', border: '1px solid #eeece9' }}
      >
        <div className="w-1.5 self-stretch bg-[#8c6e5d]" />
        <p className="text-xs sm:text-sm p-4 leading-relaxed text-[#7a6f66] flex-1">
          💡 <strong>Mẹo nhỏ:</strong> Nhấn <strong>Xem mẫu</strong> để xem trước từng trang của mẫu sách trước khi chọn.
          Sau khi chọn, bạn có thể chỉnh sửa tự do ở bước tiếp theo.
        </p>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => handleSelectTemplate(previewTemplate)}
        />
      )}
    </div>
  );
}
