import { useState, useEffect } from 'react';
import { ArrowLeft, Check, HelpCircle, Book, Wallet, LogOut, Home } from 'lucide-react';
import { BookData, User } from '../App';
import { Step1ThemeSelection } from './builder/Step1ThemeSelection';
import { Step2TemplateSelection } from './builder/Step2TemplateSelection';
import { Step4PageEditorAdvanced } from './builder/Step4PageEditorAdvanced';
import { YouthArchiveEditor } from './builder/YouthArchiveEditor';
import { LocalTemplatePageViewer } from './builder/LocalTemplatePageViewer';
import { Book3DPreviewPanel } from './builder/Book3DPreviewPanel';
import { BeginnerTutorial } from './BeginnerTutorial';
import { HelpPanel } from './HelpPanel';
import { InteractiveLogoutButton } from './InteractiveLogoutButton';

interface GuidedBookBuilderProps {
  user: User;
  initialBook: BookData | null;
  onSave: (book: BookData) => void;
  onBack: () => void;
  onProceedToOrder: (book: BookData) => void;
  onLogout: () => void;
  onBackToHome?: () => void;
}

type Step = 1 | 2 | 3;

export function GuidedBookBuilder({
  user,
  initialBook,
  onSave,
  onBack,
  onProceedToOrder,
  onLogout,
  onBackToHome,
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

  // Theme styling mapping for personalized details in header
  const themeData = {
    love:       { name: 'Tình yêu', emoji: '💕', bg: '#fdf2f2', border: '#fde2e4', text: '#e11d48' },
    family:     { name: 'Gia đình', emoji: '👨‍👩‍👧', bg: '#eff6ff', border: '#dbeafe', text: '#2563eb' },
    birthday:   { name: 'Sinh nhật', emoji: '🎂', bg: '#fffbeb', border: '#fef3c7', text: '#d97706' },
    friendship: { name: 'Tình bạn', emoji: '🤝', bg: '#f0fdf4', border: '#dcfce7', text: '#059669' },
  };

  const currentTheme = bookData.theme ? themeData[bookData.theme] : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#faf8f5' }}>
      
      {/* Subtle background dot pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #e2ddd6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-50 transition-all duration-300 border-b"
        style={{
          background: 'rgba(250, 248, 245, 0.90)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          boxShadow: '0 1px 16px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              {/* Home Button */}
              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group hover:-translate-y-0.5"
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
                  title="Về trang chủ"
                >
                  <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
                </button>
              )}

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
              <span className="hidden sm:inline">Quay lại</span>
            </button>
            </div>

            {/* Book Info Title & Badges */}
            <div className="text-center flex-1 min-w-0">
              <div className="flex items-center justify-center gap-2 max-w-xs sm:max-w-md mx-auto">
                <Book className="w-4 h-4 text-[#8c6e5d] flex-shrink-0" />
                <h1 className="text-sm sm:text-base font-bold text-[#111] truncate">
                  {bookData.title || 'Sách của tôi'}
                </h1>
                {currentTheme && (
                  <span 
                    className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border leading-none"
                    style={{ 
                      background: currentTheme.bg, 
                      borderColor: currentTheme.border, 
                      color: currentTheme.text 
                    }}
                  >
                    {currentTheme.emoji} {currentTheme.name}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium mt-0.5" style={{ color: '#9b9088' }}>
                Tiến trình thiết kế · Bước {currentStep}/3
              </p>
            </div>

            {/* Price & User Info */}
            <div className="flex items-center gap-3">
              {/* Estimated Price Tag */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border"
                style={{
                  background: '#ffffff',
                  borderColor: '#eeece9',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Wallet className="w-4 h-4 text-emerald-600" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none text-emerald-600">
                    {estimatedPrice.toLocaleString('vi-VN')} ₫
                  </p>
                  <p className="text-[9px] mt-0.5 text-[#9b9088] leading-none">Dự kiến</p>
                </div>
              </div>

              {/* User Avatar & Logout Dropdown */}
              <div className="relative group">
                <button
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: 'linear-gradient(135deg, #111 0%, #333 100%)', 
                    color: '#f3e9d7',
                    border: '2.5px solid #ffffff'
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                <div className="absolute right-0 mt-2 w-36 bg-white border border-[#eeece9] rounded-xl shadow-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                  <div className="px-3 py-1.5 border-b border-[#faf8f5]">
                    <p className="text-xs font-bold text-[#111] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#9b9088] truncate">{user.email}</p>
                  </div>
                  <div className="w-full text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                    <InteractiveLogoutButton 
                      onLogout={onLogout}
                      variant="ghost"
                      className="w-full !justify-start px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps Section */}
        <div className="max-w-xl mx-auto px-6 pb-4 pt-1">
          <div className="flex items-center justify-between relative">
            
            {/* Progress Line Bar */}
            <div
              className="absolute top-4.5 left-0 right-0 h-0.5 rounded-full"
              style={{ background: '#e8e4de' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#111] to-[#333]"
                style={{
                  width: `${((currentStep - 1) / 2) * 100}%`,
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
                  className={`relative z-10 flex flex-col items-center gap-2 transition-all ${
                    canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  {/* Step Circle Badge */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 relative"
                    style={{
                      background: isActive
                        ? '#111111'
                        : isCompleted
                        ? '#ffffff'
                        : '#ffffff',
                      color: isActive ? '#f3e9d7' : isCompleted ? '#111' : '#bbb',
                      border: isActive
                        ? 'none'
                        : isCompleted
                        ? '2px solid #8c6e5d'
                        : '2.5px dashed #e8e4de',
                      boxShadow: isActive 
                        ? '0 6px 16px rgba(0,0,0,0.18), 0 0 0 4px rgba(140,110,93,0.15)' 
                        : isCompleted 
                        ? '0 2px 8px rgba(0,0,0,0.04)' 
                        : 'none',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-4 h-4" style={{ color: '#8c6e5d' }} strokeWidth={3} />
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Title labels (visible on larger screen, clean design) */}
                  <div className="text-center hidden xs:block">
                    <p className="text-[10px] font-bold leading-none" style={{ color: isActive ? '#111' : isCompleted ? '#7a6f66' : '#bbb' }}>
                      {step.title}
                    </p>
                    <p className="text-[9px] mt-0.5 leading-none" style={{ color: isActive ? '#8c6e5d' : '#bbb' }}>
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Left: Step Content Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Step 1 Content: Theme Selection */}
            {currentStep === 1 && (
              <Step1ThemeSelection
                selectedTheme={bookData.theme}
                onSelect={(theme) => handleStepComplete({ theme })}
              />
            )}

            {/* Step 2 Content: Template Selection */}
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

            {/* Step 3 Content: Editor Workspace */}
            {currentStep === 3 &&
              bookData.theme &&
              bookData.templateId &&
              bookData.pages && (
                // LOCAL TEMPLATES (temp1 / temp2 / temp3)
                bookData.templateId.startsWith('local-template-') && !useAdvancedEditor ? (
                  <LocalTemplatePageViewer
                    book={bookData as BookData}
                    onBack={() => setCurrentStep(2)}
                    onFinish={handleFinish}
                    onAdvancedEdit={() => setUseAdvancedEditor(true)}
                  />
                ) : bookData.templateId === 'youth-archive-memories' && !useAdvancedEditor ? (
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
                      if (
                        bookData.templateId === 'youth-archive-memories' ||
                        bookData.templateId.startsWith('local-template-')
                      ) {
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
            style={{ borderColor: '#eeece9' }}
          />
        )}
      </div>

      {/* Beginner Tutorial Helper */}
      <BeginnerTutorial currentStep={currentStep} />
      
      {/* Help Info Panel Trigger */}
      <HelpPanel />
    </div>
  );
}