import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Check, Layout, Loader2 } from 'lucide-react';
import { PageData, BookData } from '../../App';
import { templates as realTemplates } from '../../data/templates';
import { FlipBookReader } from '../FlipBookReader';
import { templateApi } from '../../lib/templateApi';

interface Template {
  id: string;
  name: string;
  description: string;
  style: 'minimal' | 'romantic' | 'playful' | 'elegant';
  pageCount: number;
  preview: string;
  pages: TemplatePageDef[];
}

interface TemplatePageDef {
  id: string;
  layout: string;
  textFields: string[];
  imageFields: string[];
  defaultTexts: { [key: string]: string };
}

interface Step2TemplateSelectionProps {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  selectedTemplateId?: string;
  onSelect: (templateId: string, pages: PageData[]) => void;
  onBack: () => void;
}

export function Step2TemplateSelection({
  theme,
  selectedTemplateId,
  onSelect,
  onBack,
}: Step2TemplateSelectionProps) {
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [apiTemplates, setApiTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Không load đè template từ API nữa để giữ lại mẫu Youth Archive của user
    setLoading(false);
  }, []);

  // Filter mock templates by theme, always include Youth Archive
  // THEO YÊU CẦU: Xóa hết các mẫu khác, chỉ để lại mẫu Youth Archive đã hoàn thành
  const filteredMockTemplates = realTemplates.filter(t =>
    t.id === 'youth-archive-memories'
  );
  
  // Map API templates to UI format, fallback to mock
  const templates = apiTemplates.length > 0
    ? apiTemplates.map(t => {
        // Try to find matching mock template for detailed pages/data
        const mockMatch = realTemplates.find(m => m.id === t.id || m.name === t.name);
        return {
          id: t.id,
          name: t.name,
          description: t.description || `${mockMatch?.pages.length || 10} trang thiết kế cao cấp`,
          style: 'romantic' as const,
          pageCount: mockMatch?.pages.length || 10,
          preview: t.coverImageUrl || mockMatch?.thumbnail || '',
          badge: mockMatch?.badge,
          realTemplate: mockMatch || t
        };
      })
    : filteredMockTemplates.map(t => ({
        id: t.id,
        name: t.name,
        description: t.id === 'youth-archive-memories'
          ? `${t.pages.length} trang scrapbook vintage – tải lên ảnh kỷ niệm của bạn`
          : `${t.pages.length} trang với nội dung ${t.theme === 'love' ? 'lãng mạn' : t.theme === 'family' ? 'gia đình' : t.theme === 'birthday' ? 'sinh nhật' : 'bạn bè'}`,
        style: 'romantic' as const,
        pageCount: t.pages.length,
        preview: t.thumbnail,
        badge: t.badge,
        realTemplate: t
      }));

  const handleSelectTemplate = (template: any) => {
    // Convert real template pages to PageData format
    const pages: PageData[] = template.realTemplate.pages.map((page: any) => ({
      id: page.id,
      templatePageId: page.id,
      texts: {},
      images: {},
    }));

    onSelect(template.id, pages);
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
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#7a6f66' }}>
            <Loader2 className="w-4 h-4 animate-spin text-[#111]" />
            Đang tải mẫu sách...
          </div>
        ) : error ? (
          <p className="text-xs italic text-rose-500">{error}</p>
        ) : (
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#6b7280' }}>
            Mỗi mẫu được đo đạc với số trang và bố cục chuyên nghiệp. Bạn có thể tùy chỉnh hình ảnh, câu chữ ở bước tiếp theo.
          </p>
        )}
      </div>

      {/* Template Grid */}
      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {templates.map((template) => {
          const isSelected = selectedTemplateId === template.id;

          return (
            <div
              key={template.id}
              className="relative rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group"
              style={{
                background: '#ffffff',
                border: isSelected ? '2.5px solid #111' : '1px solid #eeece9',
                boxShadow: isSelected ? '0 12px 36px rgba(0,0,0,0.12)' : '0 2px 16px rgba(0,0,0,0.05)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
              }}
            >
              {/* Preview Image */}
              <div className="h-56 relative overflow-hidden bg-[#faf8f5] flex-shrink-0">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badge Overlay */}
                {template.badge && (
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md"
                    style={{ background: '#111111', color: '#f3e9d7' }}
                  >
                    {template.badge === 'bestseller' ? '🔥 Bán chạy' :
                     template.badge === 'popular'    ? '⭐ Phổ biến' :
                     '✨ Mới'}
                  </div>
                )}

                {/* Page Count Tag Overlay */}
                <div className="absolute top-4 right-4">
                  <div
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md"
                    style={{ background: 'rgba(255, 255, 255, 0.90)', color: '#111', backdropFilter: 'blur(4px)' }}
                  >
                    <Layout className="w-3.5 h-3.5 text-[#8c6e5d]" />
                    {template.pageCount} trang
                  </div>
                </div>
                
                {/* Hover overlay shading */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info & Content */}
              <div className="p-6 flex flex-col flex-1 gap-4 justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#111] mb-1.5 leading-snug">{template.name}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#7a6f66]">{template.description}</p>
                </div>

                {/* Action Buttons Row */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 border"
                    style={{ background: '#faf8f5', color: '#111', borderColor: '#eeece9' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f0ede8';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#faf8f5';
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Xem mẫu
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(template)}
                    className="flex-1 py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: '#111111',
                      color: '#f3e9d7',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#000000';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#111111';
                    }}
                  >
                    {isSelected ? (
                      <><Check className="w-4 h-4 text-emerald-400" strokeWidth={3} /> Đã chọn</>
                    ) : 'Sử dụng mẫu này'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal - Using FlipBookReader */}
      {previewTemplate && (() => {
        // Create a BookData object from the template for FlipBookReader
        const previewBook: BookData = {
          id: previewTemplate.realTemplate.id,
          title: previewTemplate.name,
          theme: theme,
          templateId: previewTemplate.realTemplate.id,
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          cover: previewTemplate.realTemplate.cover,
          pages: previewTemplate.realTemplate.pages
        };

        console.log('📖 Opening template preview:', {
          template: previewTemplate.name,
          theme: theme,
          templateId: previewTemplate.realTemplate.id
        });

        return (
          <FlipBookReader
            book={previewBook}
            onClose={() => setPreviewTemplate(null)}
          />
        );
      })()}

      {/* Tip Info banner */}
      <div className="max-w-2xl mx-auto flex items-start gap-0.5 rounded-2xl overflow-hidden shadow-sm"
        style={{ background: '#ffffff', border: '1px solid #eeece9' }}
      >
        <div className="w-1.5 self-stretch bg-[#8c6e5d]" />
        <p className="text-xs sm:text-sm p-4 leading-relaxed text-[#7a6f66] flex-1">
          💡 <strong>Mẹo nhỏ:</strong> Số lượng trang sách đã được tối ưu hóa cho công nghệ đóng gáy sách cứng cao cấp, bảo đảm độ mở phẳng và thẩm mỹ hoàn mỹ nhất.
        </p>
      </div>
    </div>
  );
}