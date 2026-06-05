import { useState } from 'react';
import { BookPage } from '../../App';
import { coverTemplates, getCoversByTheme, CoverTemplate } from '../../data/coverTemplates';
import { X, Check, Sparkles, Palette } from 'lucide-react';

interface CoverTemplateSelectorProps {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  currentCover?: BookPage;
  onSelect: (cover: BookPage) => void;
  onClose: () => void;
}

export function CoverTemplateSelector({
  theme,
  currentCover,
  onSelect,
  onClose,
}: CoverTemplateSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const themeCovers = getCoversByTheme(theme);

  const handleSelect = (template: CoverTemplate) => {
    setSelectedId(template.id);
    onSelect(template.cover);
  };

  const themeInfo = {
    love: {
      icon: '',
      title: 'Trang ba tnh yu',
      gradient: 'from-pink-500 to-rose-500'
    },
    family: {
      icon: '',
      title: 'Trang ba gia nh',
      gradient: 'from-blue-500 to-cyan-500'
    },
    birthday: {
      icon: '',
      title: 'Trang ba sinh nht',
      gradient: 'from-purple-500 to-pink-500'
    },
    friendship: {
      icon: '',
      title: 'Trang ba tnh bn',
      gradient: 'from-amber-500 to-orange-500'
    }
  };

  const info = themeInfo[theme];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${info.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                {info.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{info.title}</h2>
                <p className="text-white/90 text-sm">Chn thit k yu thch ca bn</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themeCovers.map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelect(template)}
                className={`group cursor-pointer relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  selectedId === template.id
                    ? 'border-pink-500 shadow-xl shadow-pink-200 scale-105'
                    : 'border-gray-200 hover:border-pink-300 hover:shadow-lg'
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="aspect-[3/4] relative bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Mini cover preview */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: template.cover.backgroundColor,
                      backgroundImage: template.cover.backgroundImage
                        ? `url(${template.cover.backgroundImage})`
                        : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Render simplified version of elements */}
                    {template.cover.elements.slice(0, 5).map((element) => (
                      <div
                        key={element.id}
                        style={{
                          position: 'absolute',
                          left: `${(element.x / 500) * 100}%`,
                          top: `${(element.y / 700) * 100}%`,
                          width: `${(element.width / 500) * 100}%`,
                          height: `${(element.height / 700) * 100}%`,
                          fontSize: element.type === 'text' ? `${((element as any).fontSize || 16) * 0.4}px` : undefined,
                          fontFamily: element.type === 'text' ? (element as any).fontFamily : undefined,
                          color: element.type === 'text' ? (element as any).color : undefined,
                          backgroundColor: element.type === 'shape' ? (element as any).fill : undefined,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: element.opacity || 1,
                          borderRadius: (element as any).borderRadius ? `${(element as any).borderRadius * 0.5}px` : '0',
                          background: element.type === 'shape' && (element as any).fill?.includes('gradient')
                            ? (element as any).fill
                            : undefined,
                        }}
                      >
                        {element.type === 'text' && (
                          <span className="text-center px-1 leading-tight" style={{
                            fontWeight: (element as any).fontWeight,
                            textAlign: (element as any).textAlign,
                          }}>
                            {((element as any).content || '').substring(0, 30)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      Chn mu ny
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {selectedId === template.id && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}

                  {/* Style badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1">
                      <Palette className="w-3 h-3" />
                      {template.style}
                    </div>
                  </div>
                </div>

                {/* Template info */}
                <div className="p-4 bg-white">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    Phong cch {template.style}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {themeCovers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cha c mu no
              </h3>
              <p className="text-gray-500">
                Chng ti ang pht trin thm cc mu trang ba cho ch  ny
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
               Bn c th chnh sa trang ba sau khi chn
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
            >
              ng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
