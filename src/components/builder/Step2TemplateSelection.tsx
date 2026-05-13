import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Check, Layout, Loader2 } from 'lucide-react';
import { PageData, BookData } from '../../App';
import { templates as realTemplates } from '../../data/templates';
import { FlipBookReader } from '../FlipBookReader';
import { templateApi, Template } from '../../lib/templateApi';

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
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await templateApi.getTemplates();
        setApiTemplates(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch templates:', err);
        setError('Không thể tải mẫu sách từ máy chủ. Đang sử dụng dữ liệu dự phòng.');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  // Filter mock templates by theme
  const filteredMockTemplates = realTemplates.filter(t => t.theme === theme);
  
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
        description: `${t.pages.length} trang với nội dung ${t.theme === 'love' ? 'lãng mạn' : t.theme === 'family' ? 'gia đình' : t.theme === 'birthday' ? 'sinh nhật' : 'bạn bè'}`,
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium"
        style={{ color: '#7A6F66' }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại chọn chủ đề</span>
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#3A2E28' }}>
          Chọn phong cách thiết kế
        </h2>
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#7A6F66' }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang tải mẫu sách...
          </div>
        ) : error ? (
          <p className="text-xs italic" style={{ color: '#9B9088' }}>{error}</p>
        ) : (
          <p className="text-base" style={{ color: '#7A6F66' }}>
            Mỗi mẫu có bố cục và số trang khác nhau. Bạn có thể tùy chỉnh nội dung sau.
          </p>
        )}
      </div>

      {/* Template Grid */}
      <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {templates.map((template) => {
          const isSelected = selectedTemplateId === template.id;

          return (
            <div
              key={template.id}
              className="relative rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: '#FAFAF8',
                border: isSelected ? '2px solid #3A2E28' : '1.5px solid #DDD8D0',
                boxShadow: isSelected ? '0 8px 28px rgba(58,46,40,0.18)' : '0 2px 8px rgba(58,46,40,0.06)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Preview */}
              <div className="h-48 relative overflow-hidden" style={{ background: '#EDE9E3' }}>
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />

                {/* Badge */}
                {template.badge && (
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#3A2E28', color: '#EDE9E3' }}
                  >
                    {template.badge === 'bestseller' ? '🔥 Bán chạy' :
                     template.badge === 'popular'    ? '⭐ Phổ biến' :
                     '✨ Mới'}
                  </div>
                )}

                <div className="absolute top-3 right-3">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    style={{ background: 'rgba(250,250,248,0.90)', color: '#3A2E28' }}
                  >
                    <Layout className="w-3 h-3" />
                    {template.pageCount} trang
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold mb-1" style={{ color: '#3A2E28' }}>{template.name}</h3>
                <p className="text-sm mb-4" style={{ color: '#7A6F66' }}>{template.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 py-2 px-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                    style={{ background: '#EDE9E3', color: '#5A5049' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#DDD8D0')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
                  >
                    <Eye className="w-4 h-4" />
                    Xem trước
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(template)}
                    className="flex-1 py-2 px-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all"
                    style={{
                      background: isSelected ? '#1C1715' : '#3A2E28',
                      color: '#EDE9E3',
                      boxShadow: isSelected ? '0 4px 14px rgba(28,23,21,0.30)' : 'none',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#1C1715')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = isSelected ? '#1C1715' : '#3A2E28')}
                  >
                    {isSelected ? (
                      <><Check className="w-4 h-4" /> Đã chọn</>
                    ) : 'Chọn mẫu'}
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

      {/* Info */}
      <div
        className="max-w-2xl mx-auto p-5 rounded-2xl text-center"
        style={{ background: '#F5F2EE', border: '1px solid #DDD8D0' }}
      >
        <p className="text-sm" style={{ color: '#7A6F66' }}>
          💡 <strong style={{ color: '#5A5049' }}>Lưu ý:</strong>{' '}
          Số trang và bố cục được cố định để đảm bảo chất lượng in ấn. Bạn sẽ tùy chỉnh nội dung ở bước tiếp theo.
        </p>
      </div>
    </div>
  );
}

// Templates are now imported from /data/templates.ts