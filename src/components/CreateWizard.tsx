import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { BookProject } from '../App';
import { templates, Template } from '../data/templates';

interface CreateWizardProps {
  onComplete: (book: BookProject) => void;
  onCancel: () => void;
}

type Theme = 'family' | 'friends' | 'love' | 'memories';

export function CreateWizard({ onComplete, onCancel }: CreateWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [pageCount, setPageCount] = useState(20);
  const [bookTitle, setBookTitle] = useState('');

  const themes = [
    {
      id: 'family' as Theme,
      title: 'Gia đình',
      description: 'Món quà ý nghĩa cho người thân yêu',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-orange-400 to-rose-400',
      examples: 'Cảm ơn cha mẹ, kỷ niệm gia đình, bữa cơm nhà'
    },
    {
      id: 'friends' as Theme,
      title: 'Bạn bè',
      description: 'Kỷ niệm những khoảnh khắc đáng nhớ',
      icon: '🎉',
      color: 'from-cyan-400 to-blue-400',
      examples: 'Tình bạn mãi mãi, chuyến đi, cười không ngừng'
    },
    {
      id: 'love' as Theme,
      title: 'Người yêu',
      description: 'Lời yêu thương chân thành nhất',
      icon: '💕',
      color: 'from-pink-400 to-rose-500',
      examples: 'Ngày đầu gặp nhau, điều em thích, hứa hẹn tương lai'
    },
    {
      id: 'memories' as Theme,
      title: 'Kỷ niệm',
      description: 'Lưu giữ những ký ức đẹp',
      icon: '📸',
      color: 'from-purple-400 to-indigo-400',
      examples: 'Timeline, cột mốc quan trọng, bài học cuộc sống'
    }
  ];

  const filteredTemplates = selectedTheme
    ? templates.filter(t => t.theme === selectedTheme)
    : templates;

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setStep(2);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    if (!bookTitle) {
      setBookTitle(template.name);
    }
  };

  const handleCreate = () => {
    if (!selectedTemplate || !selectedTheme) return;

    const newBook: BookProject = {
      id: Date.now().toString(),
      title: bookTitle || selectedTemplate.name,
      theme: selectedTheme,
      templateId: selectedTemplate.id,
      pageCount: pageCount,
      coverPage: selectedTemplate.cover,
      pages: selectedTemplate.pages.slice(0, pageCount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onComplete(newBook);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-12">
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`stepper-number ${
                stepNum < step
                  ? 'completed'
                  : stepNum === step
                  ? 'active'
                  : 'inactive'
              }`}
            >
              {stepNum < step ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{stepNum}</span>
              )}
            </div>
            <span className="text-xs text-gray-600 mt-2 hidden sm:block">
              {stepNum === 1 && 'Chủ đề'}
              {stepNum === 2 && 'Template'}
              {stepNum === 3 && 'Số trang'}
              {stepNum === 4 && 'Xác nhận'}
            </span>
          </div>
          {stepNum < 4 && (
            <div className={`w-12 sm:w-20 h-1 mx-2 rounded ${
              stepNum < step ? 'bg-green-400' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Tạo sách mới
          </h1>
          
          <div className="w-20"></div>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 min-h-[500px]">
          {/* Step 1: Choose Theme */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">
                  Chọn chủ đề cho cuốn sách
                </h2>
                <p className="text-gray-600">
                  Mỗi chủ đề có nội dung và mẫu thiết kế riêng
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`card p-8 text-left hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                      selectedTheme === theme.id ? 'ring-4 ring-pink-400' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${theme.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                        {theme.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{theme.title}</h3>
                        <p className="text-gray-600">{theme.description}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mt-4">
                      <p className="text-sm text-gray-600 mb-2">Ví dụ nội dung:</p>
                      <p className="text-sm text-gray-800 italic">"{theme.examples}"</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Template */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">
                  Chọn mẫu thiết kế
                </h2>
                <p className="text-gray-600">
                  {filteredTemplates.length} mẫu có sẵn cho chủ đề{' '}
                  <span className="font-semibold text-pink-600">
                    {themes.find(t => t.id === selectedTheme)?.title}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[500px] overflow-y-auto scrollbar-custom pr-4">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                      selectedTemplate?.id === template.id ? 'ring-4 ring-pink-400' : ''
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Badge */}
                      {template.badge && (
                        <div className="absolute top-2 right-2">
                          <span
                            className={`badge text-xs px-2 py-1 ${
                              template.badge === 'bestseller'
                                ? 'badge-bestseller'
                                : template.badge === 'new'
                                ? 'badge-new'
                                : 'badge-popular'
                            }`}
                          >
                            {template.badge === 'bestseller' ? 'Bán chạy' : template.badge === 'new' ? 'Mới' : 'Phổ biến'}
                          </span>
                        </div>
                      )}
                      
                      {selectedTemplate?.id === template.id && (
                        <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-pink-600" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm line-clamp-2">{template.name}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8 pt-8 border-t">
                <button onClick={() => setStep(1)} className="btn btn-outline">
                  <ArrowLeft className="w-5 h-5" />
                  Quay lại
                </button>
                
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedTemplate}
                  className="btn btn-primary"
                >
                  Tiếp tục
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Choose Page Count */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">
                  Chọn số trang
                </h2>
                <p className="text-gray-600">
                  Số trang sẽ ảnh hưởng đến giá in cuối cùng
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                {/* Quick Select */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[10, 20, 30, 40].map((count) => (
                    <button
                      key={count}
                      onClick={() => setPageCount(count)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        pageCount === count
                          ? 'border-pink-400 bg-pink-50 shadow-lg'
                          : 'border-gray-200 hover:border-pink-200'
                      }`}
                    >
                      <div className="text-3xl font-bold text-pink-600 mb-1">{count}</div>
                      <div className="text-sm text-gray-600">trang</div>
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Hoặc nhập số trang tùy chỉnh:
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={pageCount}
                    onChange={(e) => setPageCount(Math.max(10, Math.min(100, parseInt(e.target.value) || 10)))}
                    className="input text-center text-2xl font-bold"
                  />
                  <p className="text-sm text-gray-500 mt-2">Từ 10 đến 100 trang</p>
                </div>

                {/* Price Estimate */}
                <div className="card p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Giá ước tính:</p>
                      <p className="text-3xl font-bold gradient-text">
                        {(pageCount * 5000).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <Sparkles className="w-12 h-12 text-pink-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    *Giá chưa bao gồm phí ship và các tùy chọn đặc biệt
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-8 border-t">
                <button onClick={() => setStep(2)} className="btn btn-outline">
                  <ArrowLeft className="w-5 h-5" />
                  Quay lại
                </button>
                
                <button onClick={() => setStep(4)} className="btn btn-primary">
                  Tiếp tục
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && selectedTemplate && selectedTheme && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">
                  Xác nhận thông tin
                </h2>
                <p className="text-gray-600">
                  Kiểm tra lại trước khi tạo sách
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                {/* Book Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên cuốn sách
                  </label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="Nhập tên cuốn sách..."
                    className="input"
                  />
                </div>

                {/* Summary */}
                <div className="card p-6 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-gray-600">Chủ đề:</span>
                    <span className="font-semibold">
                      {themes.find(t => t.id === selectedTheme)?.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-gray-600">Template:</span>
                    <span className="font-semibold">{selectedTemplate.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-gray-600">Số trang:</span>
                    <span className="font-semibold">{pageCount} trang</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-semibold">Giá ước tính:</span>
                    <span className="text-2xl font-bold gradient-text">
                      {(pageCount * 5000).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Xem trước bìa:</p>
                  <div className="card overflow-hidden">
                    <img
                      src={selectedTemplate.thumbnail}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-8 border-t">
                <button onClick={() => setStep(3)} className="btn btn-outline">
                  <ArrowLeft className="w-5 h-5" />
                  Quay lại
                </button>
                
                <button onClick={handleCreate} className="btn btn-primary btn-lg">
                  <Sparkles className="w-5 h-5" />
                  Tạo sách ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
