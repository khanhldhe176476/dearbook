import { useState } from 'react';
import { ArrowLeft, Plus, Eye, Trash2, Image as ImageIcon, Type, Layout, User, LogOut } from 'lucide-react';
import { BookDesign, BookPage } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DesignEditorProps {
  bookDesign: BookDesign;
  setBookDesign: (design: BookDesign) => void;
  onPreview: () => void;
  onBackToHome: () => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export function DesignEditor({ bookDesign, setBookDesign, onPreview, onBackToHome, user, onLogout }: DesignEditorProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const currentPage = bookDesign.pages[currentPageIndex];

  const updatePage = (updates: Partial<BookPage>) => {
    const updatedPages = [...bookDesign.pages];
    updatedPages[currentPageIndex] = { ...currentPage, ...updates };
    setBookDesign({ ...bookDesign, pages: updatedPages });
  };

  const addPage = () => {
    const newPage: BookPage = {
      id: Date.now().toString(),
      content: '',
      layout: 'text-only'
    };
    setBookDesign({
      ...bookDesign,
      pages: [...bookDesign.pages, newPage]
    });
    setCurrentPageIndex(bookDesign.pages.length);
  };

  const deletePage = (index: number) => {
    if (bookDesign.pages.length === 1) return;
    const updatedPages = bookDesign.pages.filter((_, i) => i !== index);
    setBookDesign({ ...bookDesign, pages: updatedPages });
    if (currentPageIndex >= updatedPages.length) {
      setCurrentPageIndex(updatedPages.length - 1);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'page') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (type === 'cover') {
          setBookDesign({ ...bookDesign, coverImage: imageUrl });
        } else {
          updatePage({ imageUrl });
        }
        setUploadingImage(null);
      };
      reader.readAsDataURL(file);
      setUploadingImage(type);
    }
  };

  const layouts: Array<{ value: BookPage['layout']; label: string; icon: string }> = [
    { value: 'text-only', label: 'Ch ch', icon: '' },
    { value: 'image-only', label: 'Ch nh', icon: '' },
    { value: 'text-image', label: 'Ch + nh', icon: '' },
    { value: 'image-text', label: 'nh + Ch', icon: '' }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay li</span>
            </button>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full">
                  <User className="w-4 h-4 text-rose-600" />
                  <span className="text-sm text-rose-900">{user.name}</span>
                </div>
              )}
              <span className="text-gray-600">
                Trang {currentPageIndex + 1} / {bookDesign.pages.length}
              </span>
              <button
                onClick={onPreview}
                className="flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition"
              >
                <Eye className="w-5 h-5" />
                Xem trc
              </button>
              {user && (
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  title="ng xut"
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Editor Controls */}
          <div className="space-y-6">
            {/* Book Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-serif text-rose-900 mb-6">Thng tin sch</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiu  sch
                  </label>
                  <input
                    type="text"
                    value={bookDesign.title}
                    onChange={(e) => setBookDesign({ ...bookDesign, title: e.target.value })}
                    placeholder="VD: K nim 1 nm bn nhau"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngi nhn
                  </label>
                  <input
                    type="text"
                    value={bookDesign.recipient}
                    onChange={(e) => setBookDesign({ ...bookDesign, recipient: e.target.value })}
                    placeholder="VD: Anh yu ca em"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Li tng (trang u)
                  </label>
                  <textarea
                    value={bookDesign.dedication}
                    onChange={(e) => setBookDesign({ ...bookDesign, dedication: e.target.value })}
                    placeholder="Gi nhng li yu thng..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    nh ba
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                  />
                  {bookDesign.coverImage && (
                    <div className="mt-2">
                      <img src={bookDesign.coverImage} alt="Cover" className="w-32 h-40 object-cover rounded" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Page Editor */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-serif text-rose-900 mb-6">
                Trang {currentPageIndex + 1}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kiu b cc
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {layouts.map((layout) => (
                      <button
                        key={layout.value}
                        onClick={() => updatePage({ layout: layout.value })}
                        className={`p-3 rounded-lg border-2 transition ${
                          currentPage.layout === layout.value
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-gray-200 hover:border-rose-300'
                        }`}
                      >
                        <span className="text-2xl mb-1 block">{layout.icon}</span>
                        <span className="text-sm">{layout.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {(currentPage.layout === 'text-only' || currentPage.layout === 'text-image' || currentPage.layout === 'image-text') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ni dung
                    </label>
                    <textarea
                      value={currentPage.content}
                      onChange={(e) => updatePage({ content: e.target.value })}
                      placeholder="Vit cu chuyn ca bn..."
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                )}

                {currentPage.layout !== 'text-only' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hnh nh
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'page')}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                    />
                    {currentPage.imageUrl && (
                      <div className="mt-2">
                        <img src={currentPage.imageUrl} alt="Page" className="w-full h-48 object-cover rounded" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Preview & Pages */}
          <div className="space-y-6">
            {/* Current Page Preview */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Xem trc trang hin ti</h3>
              <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-rose-50 rounded-lg p-8 border-2 border-gray-200">
                <PagePreview page={currentPage} />
              </div>
            </div>

            {/* Pages Navigation */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Danh sch trang</h3>
                <button
                  onClick={addPage}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Thm trang
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {bookDesign.pages.map((page, index) => (
                  <div
                    key={page.id}
                    className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition ${
                      index === currentPageIndex ? 'border-rose-500' : 'border-gray-200 hover:border-rose-300'
                    }`}
                    onClick={() => setCurrentPageIndex(index)}
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-rose-50 p-3 text-xs">
                      <PagePreview page={page} compact />
                    </div>
                    <div className="absolute top-1 left-1 bg-white rounded-full px-2 py-1 text-xs font-medium">
                      {index + 1}
                    </div>
                    {bookDesign.pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePage(index);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PagePreview({ page, compact = false }: { page: BookPage; compact?: boolean }) {
  const textClass = compact ? 'text-xs' : 'text-base';
  
  if (page.layout === 'text-only') {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className={`${textClass} text-gray-700 text-center italic`}>
          {page.content || 'Ni dung trang...'}
        </p>
      </div>
    );
  }

  if (page.layout === 'image-only') {
    return page.imageUrl ? (
      <img src={page.imageUrl} alt="Page" className="w-full h-full object-cover" />
    ) : (
      <div className="h-full flex items-center justify-center">
        <ImageIcon className="w-8 h-8 text-gray-300" />
      </div>
    );
  }

  if (page.layout === 'text-image') {
    return (
      <div className="h-full flex flex-col gap-2">
        <div className="flex-1">
          <p className={`${textClass} text-gray-700`}>
            {page.content || 'Ni dung...'}
          </p>
        </div>
        {page.imageUrl ? (
          <img src={page.imageUrl} alt="Page" className="w-full h-32 object-cover rounded" />
        ) : (
          <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-300" />
          </div>
        )}
      </div>
    );
  }

  if (page.layout === 'image-text') {
    return (
      <div className="h-full flex flex-col gap-2">
        {page.imageUrl ? (
          <img src={page.imageUrl} alt="Page" className="w-full h-32 object-cover rounded" />
        ) : (
          <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-300" />
          </div>
        )}
        <div className="flex-1">
          <p className={`${textClass} text-gray-700`}>
            {page.content || 'Ni dung...'}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
