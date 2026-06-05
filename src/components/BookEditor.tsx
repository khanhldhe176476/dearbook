import { useState } from 'react';
import { ArrowLeft, Save, Download, Eye, Undo, Redo, ZoomIn, ZoomOut, Plus, Settings, LogOut } from 'lucide-react';
import { Book } from '../App';
import { EditorSidebar } from './editor/EditorSidebar';
import { EditorCanvas } from './editor/EditorCanvas';
import { EditorProperties } from './editor/EditorProperties';

interface BookEditorProps {
  book: Book;
  user: { email: string; name: string };
  onSave: (book: Book) => void;
  onBack: () => void;
  onLogout: () => void;
}

export function BookEditor({ book, user, onSave, onBack, onLogout }: BookEditorProps) {
  const [currentBook, setCurrentBook] = useState<Book>(book);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState<Book[]>([book]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const currentPage = currentBook.pages[currentPageIndex];
  const selectedElement = currentPage?.elements.find(el => el.id === selectedElementId);

  const handleSave = () => {
    onSave(currentBook);
    // Show success notification
    alert('Đã lưu thành công! ✅');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentBook(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentBook(history[newIndex]);
    }
  };

  const updateBook = (updatedBook: Book) => {
    setCurrentBook(updatedBook);
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedBook);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUpdatePage = (pageIndex: number, updates: Partial<typeof currentPage>) => {
    const updatedPages = [...currentBook.pages];
    updatedPages[pageIndex] = { ...updatedPages[pageIndex], ...updates };
    updateBook({ ...currentBook, pages: updatedPages });
  };

  const handleUpdateElement = (elementId: string, updates: any) => {
    const updatedElements = currentPage.elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    handleUpdatePage(currentPageIndex, { elements: updatedElements });
  };

  const handleAddElement = (element: any) => {
    const newElement = {
      ...element,
      id: `element-${Date.now()}`,
    };
    handleUpdatePage(currentPageIndex, {
      elements: [...currentPage.elements, newElement]
    });
  };

  const handleDeleteElement = (elementId: string) => {
    const updatedElements = currentPage.elements.filter(el => el.id !== elementId);
    handleUpdatePage(currentPageIndex, { elements: updatedElements });
    setSelectedElementId(null);
  };

  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      type: 'content' as const,
      template: 'default',
      elements: []
    };
    updateBook({
      ...currentBook,
      pages: [...currentBook.pages, newPage]
    });
    setCurrentPageIndex(currentBook.pages.length);
  };

  const handleDeletePage = (pageIndex: number) => {
    if (currentBook.pages.length <= 1) {
      alert('Không thể xóa trang cuối cùng!');
      return;
    }
    const updatedPages = currentBook.pages.filter((_, i) => i !== pageIndex);
    updateBook({ ...currentBook, pages: updatedPages });
    if (currentPageIndex >= updatedPages.length) {
      setCurrentPageIndex(updatedPages.length - 1);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div>
            <input
              type="text"
              value={currentBook.title}
              onChange={(e) => updateBook({ ...currentBook, title: e.target.value })}
              className="text-lg font-semibold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1"
            />
            <p className="text-xs text-gray-500 px-2">
              {currentBook.pages.length} trang
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* History controls */}
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Hoàn tác"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Làm lại"
          >
            <Redo className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-gray-300" />

          {/* Preview */}
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Xem trước
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Lưu
          </button>

          <div className="w-px h-6 bg-gray-300" />

          {/* User menu */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Editor - 3 columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Templates & Elements */}
        <EditorSidebar
          book={currentBook}
          onAddElement={handleAddElement}
          onUpdateBook={updateBook}
        />

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col bg-gray-100">
          <EditorCanvas
            book={currentBook}
            currentPageIndex={currentPageIndex}
            selectedElementId={selectedElementId}
            zoom={zoom}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onSelectPage={setCurrentPageIndex}
            onAddPage={handleAddPage}
            onDeletePage={handleDeletePage}
          />
        </div>

        {/* Right Properties Panel */}
        <EditorProperties
          selectedElement={selectedElement}
          currentPage={currentPage}
          book={currentBook}
          onUpdateElement={handleUpdateElement}
          onUpdatePage={(updates) => handleUpdatePage(currentPageIndex, updates)}
          onUpdateBook={updateBook}
        />
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">Xem trước sách</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {currentBook.pages.map((page, index) => (
                <div key={page.id} className="bg-gray-50 rounded-2xl p-8">
                  <p className="text-sm text-gray-500 mb-4">Trang {index + 1}</p>
                  <div className="bg-white rounded-xl shadow-lg aspect-[1/1.4] p-8">
                    {/* Render page preview */}
                    {page.elements.map((element) => (
                      <div
                        key={element.id}
                        style={{
                          position: 'absolute',
                          left: `${element.position.x}px`,
                          top: `${element.position.y}px`,
                          width: `${element.size.width}px`,
                          height: `${element.size.height}px`,
                          fontSize: element.style.fontSize,
                          fontFamily: element.style.fontFamily,
                          color: element.style.color,
                          backgroundColor: element.style.backgroundColor,
                          borderRadius: element.style.borderRadius,
                          opacity: element.style.opacity,
                        }}
                      >
                        {element.type === 'text' && element.content}
                        {element.type === 'image' && (
                          <img src={element.content} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
