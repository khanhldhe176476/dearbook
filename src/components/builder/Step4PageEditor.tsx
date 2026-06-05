import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, ShoppingCart, Save } from 'lucide-react';
import { PageData, CharacterData } from '../../App';

interface Step4PageEditorProps {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  templateId: string;
  pages: PageData[];
  character?: CharacterData;
  title?: string;
  onChange: (pages: PageData[], title: string) => void;
  onBack: () => void;
  onFinish: () => void;
}

export function Step4PageEditor({
  theme,
  templateId,
  pages,
  character,
  title,
  onChange,
  onBack,
  onFinish,
}: Step4PageEditorProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [bookTitle, setBookTitle] = useState(title || 'Cun sch ca ti');
  const [localPages, setLocalPages] = useState(pages);
  const [showPreview, setShowPreview] = useState(false);

  const currentPage = localPages[currentPageIndex];

  const handleUpdateText = (fieldKey: string, value: string) => {
    const updated = localPages.map((page, index) =>
      index === currentPageIndex
        ? { ...page, texts: { ...page.texts, [fieldKey]: value } }
        : page
    );
    setLocalPages(updated);
    onChange(updated, bookTitle);
  };

  const handleTitleChange = (value: string) => {
    setBookTitle(value);
    onChange(localPages, value);
  };

  const getPlaceholder = (fieldKey: string): string => {
    const placeholders: { [key: string]: string } = {
      title: 'Nhp tiu  cun sch...',
      subtitle: 'Dng ph  (ty chn)',
      heading: 'Tiu  trang',
      content: 'Vit ni dung ca bn  y. Hy chia s nhng cm xc, k nim ng nh...',
      message: 'Li nhn cui sch',
    };
    return placeholders[fieldKey] || 'Nhp ni dung...';
  };

  const getGuidance = (fieldKey: string): string => {
    const guidance: { [key: string]: string } = {
      title: ' Gi : "Cu chuyn tnh yu ca chng ta", "K nim gia nh", "Sinh nht ng nh"',
      content: ' Gi : K v mt khonh khc c bit, cm xc ca bn, hoc li chc t tri tim',
      message: ' Gi : Mt li nhn ngn gn nhng  ngha  kt thc cun sch',
    };
    return guidance[fieldKey] || '';
  };

  const themeColors = {
    love: 'from-rose-100 to-pink-100',
    family: 'from-blue-100 to-cyan-100',
    birthday: 'from-purple-100 to-pink-100',
    friendship: 'from-amber-100 to-orange-100',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 rounded-xl transition-all text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Quay li</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-gray-700 font-medium"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Xem trc</span>
          </button>
          <button
            onClick={onFinish}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all font-bold"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>t hng</span>
          </button>
        </div>
      </div>

      {/* Title Editor */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-orange-100/50">
        <label className="block font-semibold text-gray-800 mb-3">
           Tn cun sch
        </label>
        <input
          type="text"
          value={bookTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none transition-all text-lg font-semibold"
          placeholder="Nhp tn cun sch..."
        />
      </div>

      {/* Page Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-orange-100/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <p className="font-semibold text-gray-800">
              Trang {currentPageIndex + 1} / {localPages.length}
            </p>
            <p className="text-xs text-gray-600">
              {currentPageIndex === 0
                ? 'Ba trc'
                : currentPageIndex === localPages.length - 1
                ? 'Ba sau'
                : `Trang ni dung ${currentPageIndex}`}
            </p>
          </div>

          <button
            onClick={() =>
              setCurrentPageIndex(Math.min(localPages.length - 1, currentPageIndex + 1))
            }
            disabled={currentPageIndex === localPages.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Page Thumbnails */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {localPages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => setCurrentPageIndex(index)}
              className={`flex-shrink-0 w-16 h-20 rounded-lg border-2 transition-all ${
                index === currentPageIndex
                  ? 'border-rose-500 shadow-md scale-110'
                  : 'border-gray-200 hover:border-rose-300'
              }`}
            >
              <div className={`w-full h-full bg-gradient-to-br ${themeColors[theme]} rounded-lg flex items-center justify-center text-xs font-semibold text-gray-700`}>
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Page Editor */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-lg">Chnh sa ni dung</h3>

          {Object.entries(currentPage.texts).map(([fieldKey, value]) => {
            const isLongText = fieldKey === 'content';
            const guidance = getGuidance(fieldKey);

            return (
              <div
                key={fieldKey}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-orange-100/50"
              >
                <label className="block font-semibold text-gray-700 mb-2 capitalize">
                  {fieldKey === 'title'
                    ? 'Tiu '
                    : fieldKey === 'subtitle'
                    ? 'Ph '
                    : fieldKey === 'heading'
                    ? 'Tiu  trang'
                    : fieldKey === 'content'
                    ? 'Ni dung'
                    : fieldKey === 'message'
                    ? 'Li nhn'
                    : fieldKey}
                </label>

                {guidance && (
                  <p className="text-xs text-gray-600 mb-2 italic">{guidance}</p>
                )}

                {isLongText ? (
                  <textarea
                    value={value}
                    onChange={(e) => handleUpdateText(fieldKey, e.target.value)}
                    placeholder={getPlaceholder(fieldKey)}
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none transition-all resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleUpdateText(fieldKey, e.target.value)}
                    placeholder={getPlaceholder(fieldKey)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none transition-all"
                  />
                )}
              </div>
            );
          })}

          {Object.keys(currentPage.texts).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Trang ny khng c ni dung vn bn  chnh sa</p>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100/50">
            <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
               Xem trc trang
            </p>

            <div className={`bg-gradient-to-br ${themeColors[theme]} rounded-xl p-8 aspect-[1/1.4] relative overflow-hidden`}>
              {/* Decorative texture */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23000000" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")',
                }}
              />

              <div className="relative bg-white/90 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col">
                {currentPage.texts.title && (
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                    {currentPage.texts.title || 'Tiu '}
                  </h2>
                )}
                {currentPage.texts.subtitle && (
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    {currentPage.texts.subtitle}
                  </p>
                )}
                {currentPage.texts.heading && (
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {currentPage.texts.heading}
                  </h3>
                )}
                {currentPage.texts.content && (
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {currentPage.texts.content}
                  </p>
                )}
                {currentPage.texts.message && (
                  <p className="text-center text-gray-700 italic mt-auto">
                    {currentPage.texts.message}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-600 text-center mt-3">
              B cc v kiu ch c ti u t ng
            </p>
          </div>
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <Save className="w-4 h-4" />
        <span>T ng lu nhp</span>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{bookTitle}</h3>
                <p className="text-sm text-gray-600">{localPages.length} trang</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors text-2xl"
              >
                
              </button>
            </div>

            <div className="p-6 space-y-6">
              {localPages.map((page, index) => (
                <div
                  key={page.id}
                  className={`rounded-2xl p-8 bg-gradient-to-br ${themeColors[theme]}`}
                >
                  <p className="text-sm text-gray-600 mb-4">Trang {index + 1}</p>
                  <div className="bg-white rounded-xl shadow-lg p-8 aspect-[1/1.4]">
                    {page.texts.title && (
                      <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">
                        {page.texts.title}
                      </h2>
                    )}
                    {page.texts.subtitle && (
                      <p className="text-gray-600 mb-6 text-center">{page.texts.subtitle}</p>
                    )}
                    {page.texts.heading && (
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {page.texts.heading}
                      </h3>
                    )}
                    {page.texts.content && (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {page.texts.content}
                      </p>
                    )}
                    {page.texts.message && (
                      <p className="text-center text-gray-700 italic mt-8">
                        {page.texts.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-3xl flex gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 py-3 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
              >
                ng
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  onFinish();
                }}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                t hng ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
