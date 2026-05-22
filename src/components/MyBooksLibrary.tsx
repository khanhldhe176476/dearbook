import { useState, useEffect } from 'react';
import { BookHeart, Plus, Search, Edit, Copy, Trash2, Clock, FileText, Box } from 'lucide-react';
import { BookData, User } from '../App';
import { GoogleUserProfile } from './GoogleUserProfile';
import { FlipBookReader } from './FlipBookReader';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface MyBooksLibraryProps {
  user: User;
  onLogout: () => void;
  onCreateNew: () => void;
  onEditBook: (book: BookData) => void;
}

export function MyBooksLibrary({ user, onLogout, onCreateNew, onEditBook }: MyBooksLibraryProps) {
  const [books, setBooks] = useState<BookData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [show3DBook, setShow3DBook] = useState<BookData | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; bookId: string; bookTitle: string }>({
    isOpen: false,
    bookId: '',
    bookTitle: '',
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    const savedBooks = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
    
    // Migrate old books: add default theme if missing
    const migratedBooks = savedBooks.map((book: BookData) => {
      if (!book.theme) {
        console.log(`⚠️ Book "${book.title}" missing theme, adding default: love`);
        return { ...book, theme: 'love' };
      }
      return book;
    });
    
    // Save migrated books back
    if (JSON.stringify(savedBooks) !== JSON.stringify(migratedBooks)) {
      localStorage.setItem('dearbook_books', JSON.stringify(migratedBooks));
    }
    
    setBooks(migratedBooks);
  };

  const handleDuplicate = (book: BookData) => {
    const duplicated: BookData = {
      ...book,
      id: `book-${Date.now()}`,
      title: `${book.title || 'Sách'} (Bản sao)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const books = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
    books.push(duplicated);
    localStorage.setItem('dearbook_books', JSON.stringify(books));
    loadBooks();
  };

  const handleDeleteClick = (bookId: string, bookTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      bookId,
      bookTitle,
    });
  };

  const handleDeleteConfirm = () => {
    const books = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
    const filtered = books.filter((b: BookData) => b.id !== deleteDialog.bookId);
    localStorage.setItem('dearbook_books', JSON.stringify(filtered));
    loadBooks();
    setDeleteDialog({ isOpen: false, bookId: '', bookTitle: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, bookId: '', bookTitle: '' });
  };

  const filteredBooks = books.filter(book =>
    (book.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const themeData = {
    love: { name: 'Tình yêu', emoji: '💕', color: 'from-rose-400 to-pink-400' },
    family: { name: 'Gia đình', emoji: '👨‍👩‍👧', color: 'from-blue-400 to-cyan-400' },
    birthday: { name: 'Sinh nhật', emoji: '🎂', color: 'from-purple-400 to-pink-400' },
    friendship: { name: 'Tình bạn', emoji: '🤝', color: 'from-amber-400 to-orange-400' },
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-orange-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center shadow-lg">
                <BookHeart className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col justify-center" style={{ height: '32px', overflow: 'visible' }}>
                <img 
                  src="/logo.png" 
                  alt="dearmemories" 
                  className="object-contain block" 
                  style={{ height: '76px', margin: '-20px 0' }}
                />
                <p className="text-xs text-gray-600" style={{ marginTop: '-18px' }}>Sách tặng ý nghĩa</p>
              </div>
            </div>

            <GoogleUserProfile user={user} onLogout={onLogout} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Xin chào, {user.name}! 👋
          </h2>
          <p className="text-lg text-gray-600">
            Tạo cuốn sách đầy cảm xúc cho người thân yêu của bạn
          </p>
        </div>

        {/* Create New CTA */}
        <button
          onClick={onCreateNew}
          className="w-full mb-10 p-8 rounded-3xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all group relative overflow-hidden"
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
          
          <div className="relative flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-left">
              <p className="text-2xl sm:text-3xl font-bold mb-1">Tạo sách mới</p>
              <p className="text-white/90 text-sm sm:text-base">Bắt đầu hành trình sáng tạo của bạn</p>
            </div>
          </div>
        </button>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-200/50 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Books Grid */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Sách của tôi ({filteredBooks.length})
          </h3>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-3xl border border-orange-200/50">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center mx-auto mb-4">
                <BookHeart className="w-10 h-10 text-rose-400" />
              </div>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Không tìm thấy sách nào' : 'Bạn chưa có sách nào'}
              </p>
              {!searchQuery && (
                <button
                  onClick={onCreateNew}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-amber-400 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Tạo sách đầu tiên
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const theme = themeData[book.theme];
                return (
                  <div
                    key={book.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-orange-100/50 group"
                  >
                    {/* Preview */}
                    <div className={`h-48 bg-gradient-to-br ${theme.color} flex items-center justify-center text-6xl relative`}>
                      <span className="group-hover:scale-110 transition-transform">{theme.emoji}</span>
                      {book.status === 'draft' && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                          Nháp
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 mb-1 truncate">
                        {book.title || `Sách ${theme.name}`}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{theme.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-2 mb-4">
                        <Clock className="w-3 h-3" />
                        {new Date(book.updatedAt).toLocaleDateString('vi-VN')}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShow3DBook(book)}
                          className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all"
                          title="Xem 3D"
                        >
                          <Box className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditBook(book)}
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium hover:shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          {book.status === 'draft' ? 'Tiếp tục' : 'Chỉnh sửa'}
                        </button>
                        <button
                          onClick={() => handleDuplicate(book)}
                          className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                          title="Sao chép"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(book.id, book.title || 'Sách của bạn')}
                          className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pricing Info */}
        <div className="mt-12 p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-orange-200/50">
          <h4 className="font-bold text-gray-800 mb-3">💝 Thông tin giá</h4>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Giá: 500,000 - 700,000 VNĐ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Giao hàng: 5-7 ngày làm việc</span>
            </div>
          </div>
        </div>
      </div>

      {/* FlipBook Reader Modal */}
      {show3DBook && (
        <FlipBookReader
          book={show3DBook}
          onClose={() => setShow3DBook(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        bookTitle={deleteDialog.bookTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
