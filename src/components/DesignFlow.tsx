import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Step1ThemeSelector } from './Step1ThemeSelector';
import { Step2CharacterCreator } from './Step2CharacterCreator';
import { Step3BookPreview } from './Step3BookPreview';
import { Step4Checkout } from './Step4Checkout';
import { BookOrder, CharacterDesign } from '../App';

interface DesignFlowProps {
  onComplete: (order: BookOrder) => void;
  onBackToProduct: () => void;
}

export function DesignFlow({ onComplete, onBackToProduct }: DesignFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<'love' | 'family' | 'birthday' | 'friendship' | null>(null);
  const [character, setCharacter] = useState<CharacterDesign>({
    gender: 'female',
    hairStyle: 'long',
    hairColor: 'brown',
    skinTone: 'light',
    outfit: 'romantic'
  });

  const steps = [
    { number: 1, label: 'Chọn chủ đề' },
    { number: 2, label: 'Tạo nhân vật' },
    { number: 3, label: 'Xem trước' },
    { number: 4, label: 'Đặt hàng' }
  ];

  const handleThemeSelect = (theme: 'love' | 'family' | 'birthday' | 'friendship') => {
    setSelectedTheme(theme);
    setCurrentStep(2);
  };

  const handleCharacterComplete = (char: CharacterDesign) => {
    setCharacter(char);
    setCurrentStep(3);
  };

  const handlePreviewContinue = () => {
    setCurrentStep(4);
  };

  const handleCheckoutComplete = () => {
    if (selectedTheme) {
      const order: BookOrder = {
        theme: selectedTheme,
        character: character,
        bookTitle: 'Em Yêu Anh',
        pages: 40,
        price: 570000
      };
      onComplete(order);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBackToProduct();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">
                {currentStep === 1 ? 'Trở lại trang sản phẩm' : 'Quay lại'}
              </span>
            </button>
            <div className="text-sm text-gray-600">
              Bước {currentStep} / {steps.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {currentStep === 1 && (
          <Step1ThemeSelector onSelect={handleThemeSelect} />
        )}
        {currentStep === 2 && (
          <Step2CharacterCreator
            initialCharacter={character}
            onComplete={handleCharacterComplete}
          />
        )}
        {currentStep === 3 && selectedTheme && (
          <Step3BookPreview
            theme={selectedTheme}
            character={character}
            onContinue={handlePreviewContinue}
          />
        )}
        {currentStep === 4 && selectedTheme && (
          <Step4Checkout
            theme={selectedTheme}
            character={character}
            onComplete={handleCheckoutComplete}
            onEdit={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  );
}
