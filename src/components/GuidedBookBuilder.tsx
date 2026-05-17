import { useState, useEffect } from 'react';
import { ArrowLeft, Check, HelpCircle } from 'lucide-react';
import { BookData, User, CharacterData, PageData } from '../App';
import { Step1ThemeSelection } from './builder/Step1ThemeSelection';
import { Step2TemplateSelection } from './builder/Step2TemplateSelection';
import { Step4PageEditorAdvanced } from './builder/Step4PageEditorAdvanced';
import { YouthArchiveEditor } from './builder/YouthArchiveEditor';
import { Book3DPreviewPanel } from './builder/Book3DPreviewPanel';
import { BeginnerTutorial } from './BeginnerTutorial';
import { HelpPanel } from './HelpPanel';

interface GuidedBookBuilderProps {
  user: User;
  initialBook: BookData | null;
  onSave: (book: BookData) => void;
  onBack: () => void;
  onProceedToOrder: (book: BookData) => void;
  onLogout: () => void;
}

type Step = 1 | 2 | 3;

export function GuidedBookBuilder({
  user,
  initialBook,
  onSave,
  onBack,
  onProceedToOrder,
  onLogout,
}: GuidedBookBuilderProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false);
  const [bookData, setBookData] = useState<Partial<BookData>>(
    initialBook || {
      id: `book-${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  // Determine starting step based on existing data
  useEffect(() => {
    if (initialBook) {
      if (!initialBook.theme) setCurrentStep(1);
      else if (!initialBook.templateId) setCurrentStep(2);
      else setCurrentStep(3);
    }
  }, [initialBook]);

  const steps = [
    { number: 1, title: 'Chọn chủ đề', subtitle: 'Dịp đặc biệt' },
    { number: 2, title: 'Chọn mẫu', subtitle: 'Phong cách thiết kế' },
    { number: 3, title: 'Nội dung', subtitle: 'Chỉnh sửa trang' },
  ];

  const handleStepComplete = (data: Partial<BookData>) => {
    const updated = {
      ...bookData,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setBookData(updated);
    
    // Auto-save draft
    if (updated.id) {
      onSave(updated as BookData);
    }
    
    // Move to next step
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleGoToStep = (step: Step) => {
    // Only allow going back or to completed steps
    if (step < currentStep || canGoToStep(step)) {
      setCurrentStep(step);
    }
  };

  const canGoToStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return !!bookData.theme;
      case 3:
        return !!bookData.theme && !!bookData.templateId;
      default:
        return false;
    }
  };

  const handleFinish = () => {
    if (bookData.id && bookData.theme && bookData.templateId) {
      const finalBook: BookData = {
        ...bookData as BookData,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      };
      onSave(finalBook);
      onProceedToOrder(finalBook);
    }
  };

  const estimatedPrice = bookData.pages?.length 
    ? 500000 + (bookData.pages.length - 10) * 20000
    : 500000;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(250,250,248,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #DDD8D0',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium"
              style={{ color: '#7A6F66' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>

            <div className="text-center">
              <h1 className="text-base sm:text-lg font-bold" style={{ color: '#3A2E28' }}>
                {bookData.title || 'Sách mới'}
              </h1>
              <p className="text-xs" style={{ color: '#9B9088' }}>
                Bước {currentStep}/3
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold" style={{ color: '#3A2E28' }}>
                  {estimatedPrice.toLocaleString('vi-VN')} ₫
                </p>
                <p className="text-xs" style={{ color: '#9B9088' }}>Dự kiến</p>
              </div>
              <button
                onClick={onLogout}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm"
                style={{ background: '#3A2E28', color: '#EDE9E3' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div
              className="absolute top-5 left-0 right-0 h-0.5 rounded-full"
              style={{ background: '#DDD8D0' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((currentStep - 1) / 2) * 100}%`,
                  background: '#3A2E28',
                }}
              />
            </div>

            {steps.map((step) => {
              const isActive    = currentStep === step.number;
              const isCompleted = currentStep > step.number || canGoToStep(step.number as Step);
              const canClick    = step.number < currentStep || canGoToStep(step.number as Step);

              return (
                <button
                  key={step.number}
                  onClick={() => canClick && handleGoToStep(step.number as Step)}
                  disabled={!canClick}
                  className={`relative flex flex-col items-center gap-2 transition-all ${
                    canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                    style={{
                      background: isActive
                        ? '#3A2E28'
                        : isCompleted
                        ? '#EDE9E3'
                        : '#EDE9E3',
                      color: isActive ? '#EDE9E3' : '#3A2E28',
                      border: isCompleted && !isActive ? '2px solid #7A6F66' : isActive ? 'none' : '2px solid #DDD8D0',
                      boxShadow: isActive ? '0 4px 12px rgba(58,46,40,0.28)' : 'none',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-4 h-4" style={{ color: '#7A6F66' }} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-xs font-semibold" style={{ color: isActive ? '#3A2E28' : '#7A6F66' }}>
                      {step.title}
                    </p>
                    <p className="text-xs" style={{ color: '#9B9088' }}>{step.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Step Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentStep === 1 && (
              <Step1ThemeSelection
                selectedTheme={bookData.theme}
                onSelect={(theme) => handleStepComplete({ theme })}
              />
            )}

            {currentStep === 2 && bookData.theme && (
              <Step2TemplateSelection
                theme={bookData.theme}
                selectedTemplateId={bookData.templateId}
                onSelect={(templateId, pages) =>
                  handleStepComplete({ templateId, pages })
                }
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 &&
              bookData.theme &&
              bookData.templateId &&
              bookData.pages && (
                bookData.templateId === 'youth-archive-memories' && !useAdvancedEditor ? (
                  <YouthArchiveEditor
                    book={bookData as BookData}
                    pages={bookData.pages}
                    onChange={(pages, title) => {
                      const updated = { ...bookData, pages, title };
                      setBookData(updated);
                      if (bookData.id) {
                        onSave(updated as BookData);
                      }
                    }}
                    onBack={() => setCurrentStep(2)}
                    onFinish={handleFinish}
                    onAdvancedEdit={() => setUseAdvancedEditor(true)}
                  />
                ) : (
                  <Step4PageEditorAdvanced
                    theme={bookData.theme}
                    templateId={bookData.templateId}
                    pages={bookData.pages}
                    character={bookData.character}
                    title={bookData.title}
                    onChange={(pages, title) => {
                      const updated = { ...bookData, pages, title };
                      setBookData(updated);
                      if (bookData.id) {
                        onSave(updated as BookData);
                      }
                    }}
                    onBack={() => {
                      if (bookData.templateId === 'youth-archive-memories') {
                        setUseAdvancedEditor(false);
                      } else {
                        setCurrentStep(2);
                      }
                    }}
                    onFinish={handleFinish}
                  />
                )
              )}
          </div>
        </div>

        {/* Right: 3D Preview (desktop only) */}
        {currentStep === 4 && (
          <Book3DPreviewPanel
            book={bookData as BookData}
            className="hidden xl:block w-96 border-l"
            style={{ borderColor: '#DDD8D0' }}
          />
        )}
      </div>

      {/* Beginner Tutorial */}
      <BeginnerTutorial currentStep={currentStep} />
      
      {/* Help Panel */}
      <HelpPanel />
    </div>
  );
}