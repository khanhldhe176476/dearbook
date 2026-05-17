import { useState, useEffect, useRef } from 'react';
import { BookHeart, Plus, Search, Edit, Copy, Trash2, Clock, FileText, Grid3x3, Rows3, Calendar, Star, Filter, Box, Sparkles } from 'lucide-react';
import { BookData, User } from '../App';
import { GoogleUserProfile } from './GoogleUserProfile';
import { Test3DButton } from './Test3DButton';
import { FlipBookReader } from './FlipBookReader';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useBookTemplates } from '../hooks/useBookTemplates';
import { toast } from 'sonner@2.0.3';
import { bookApi, UserBook } from '../lib/bookApi';
import { Loader2 } from 'lucide-react';

interface MyBooksLibraryPortfolioProps {
  user: User;
  onLogout: () => void;
  onCreateNew: () => void;
  onEditBook: (book: BookData) => void;
  onBackToHome?: () => void;
}

type ViewMode = 'grid' | 'masonry' | 'list';
type SortBy = 'recent' | 'oldest' | 'name' | 'theme';

export function MyBooksLibraryPortfolio({ user, onLogout, onCreateNew, onEditBook, onBackToHome }: MyBooksLibraryPortfolioProps) {
  // ── Supabase: book_templates ────────────────────────────────────────────
  const { templates: supabaseTemplates, loading: templatesLoading, error: templatesError } = useBookTemplates();
  const [books, setBooks] = useState<BookData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [filterTheme, setFilterTheme] = useState<string>('all');
  const [show3DBook, setShow3DBook] = useState<BookData | null>(null);
  const [highlightedBookId, setHighlightedBookId] = useState<string | null>(null);
  const userBooksSectionRef = useRef<HTMLDivElement>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; bookId: string; bookTitle: string }>({
    isOpen: false,
    bookId: '',
    bookTitle: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulation: Generate a consistent UUID from email for API calls
  const userId = '00000000-0000-0000-0000-000000000000'; // Placeholder

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const localBooks = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
    
    try {
      // Try to fetch from API
      const apiBooks = await bookApi.getMyBooks(userId);
      
      // Map API books to BookData format
      const mappedApiBooks: BookData[] = apiBooks.map(b => {
        const localMatch = localBooks.find((l: BookData) => l.id === b.id);
        return {
          id: b.id,
          title: b.title,
          status: b.status.toLowerCase() as any,
          updatedAt: b.updatedAt,
          createdAt: b.updatedAt, // Fallback
          theme: (localMatch?.theme || 'love') as any,
          templateId: b.templateId,
          pages: localMatch?.pages || [],
          character: localMatch?.character
        };
      });

      // Merge with local books that are not on API (e.g. newly created locally)
      const mergedBooks = [...mappedApiBooks];
      localBooks.forEach((l: BookData) => {
        if (!mergedBooks.find(m => m.id === l.id)) {
          mergedBooks.push(l);
        }
      });

      setBooks(mergedBooks);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch books from API:', err);
      setError('Không thể kết nối với máy chủ. Đang hiển thị sách từ bộ nhớ cục bộ.');
      setBooks(localBooks);
    } finally {
      setLoading(false);
    }
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
    
    // Show success toast
    toast.success('✅ Đã thêm sách mẫu vào thư viện của bạn!', {
      description: `"${duplicated.title}" đã sẵn sàng để chỉnh sửa`,
      duration: 3000,
    });
    
    // Highlight the new book
    setHighlightedBookId(duplicated.id);
    setTimeout(() => setHighlightedBookId(null), 3000);
    
    // Scroll to user books section
    setTimeout(() => {
      userBooksSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 300);
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
    
    // Show success toast
    toast.success('🗑️ Đã xóa sách thành công', {
      description: 'Sách đã được xóa khỏi thư viện của bạn',
      duration: 2000,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, bookId: '', bookTitle: '' });
  };

  // Filter and sort
  let filteredBooks = books.filter(book => {
    const matchesSearch = (book.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTheme = filterTheme === 'all' || book.theme === filterTheme;
    return matchesSearch && matchesTheme;
  });

  // Sort
  filteredBooks.sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return (a.title || '').localeCompare(b.title || '');
      case 'theme':
        return a.theme.localeCompare(b.theme);
      default:
        return 0;
    }
  });

  const themeData = {
    love:       { name: 'Tình yêu', emoji: '💕', color: 'from-rose-300 to-pink-400',     bg: 'bg-rose-50',   text: 'text-rose-700'   },
    family:     { name: 'Gia đình', emoji: '👨‍👩‍👧', color: 'from-sky-300 to-blue-400',     bg: 'bg-sky-50',    text: 'text-sky-700'    },
    birthday:   { name: 'Sinh nhật',emoji: '🎂',  color: 'from-amber-300 to-orange-400', bg: 'bg-amber-50',  text: 'text-amber-700'  },
    friendship: { name: 'Tình bạn', emoji: '🤝',  color: 'from-emerald-300 to-teal-400', bg: 'bg-emerald-50',text: 'text-emerald-700'},
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const BookCard = ({ book }: { book: BookData }) => {
    const theme = themeData[book.theme];
    const isHighlighted = highlightedBookId === book.id;
    
    return (
      <div className={`group relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${
        isHighlighted 
          ? 'ring-4 ring-[#8C6E5D]/40' 
          : 'border-[#DDD8D0]'
      }`} style={{ background: '#FFFFFF' }}>
        {/* Book Cover Preview */}
        <div className={`relative h-64 bg-gradient-to-br ${theme.color} p-6 flex items-center justify-center`}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          <div className="relative text-center">
            <div className="text-6xl mb-3">{theme.emoji}</div>
            <h3 className="text-2xl font-bold text-white drop-shadow-lg line-clamp-2">
              {book.title || 'Chưa đặt tên'}
            </h3>
            {book.status === 'draft' && (
              <span className="inline-block mt-2 px-3 py-1 bg-white/90 text-[#5A5049] text-xs font-semibold rounded-full">
                Nháp
              </span>
            )}
          </div>
          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => setShow3DBook(book)}
              className="p-3 rounded-full text-white transition-all transform hover:scale-110"
              style={{ background: '#3A2E28' }}
              title="Xem 3D"
            >
              <Box className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEditBook(book)}
              className="p-3 rounded-full transition-all transform hover:scale-110"
              style={{ background: '#FAFAF8', color: '#3A2E28' }}
              title="Chỉnh sửa"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDuplicate(book)}
              className="p-3 rounded-full transition-all transform hover:scale-110"
              style={{ background: '#FAFAF8', color: '#3A2E28' }}
              title="Nhân bản"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDeleteClick(book.id, book.title || 'Sách của bạn')}
              className="p-3 rounded-full text-white transition-all transform hover:scale-110"
              style={{ background: '#b45d5d' }}
              title="Xóa"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Book Info */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${theme.bg} ${theme.text}`}>
              {theme.name}
            </span>
            <span className="text-xs" style={{ color: '#9B9088' }}>•</span>
            <span className="text-xs" style={{ color: '#9B9088' }}>{book.pages?.length || 0} trang</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#9B9088' }}>
            <Clock className="w-4 h-4" />
            <span>{formatDate(book.updatedAt)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FAFAF8 0%, #F5F2EE 50%, #EDE9E3 100%)' }}>

      {/* Dot pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30"
           style={{ backgroundImage: `radial-gradient(circle, #DDD8D0 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />

      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(250,250,248,0.90)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #DDD8D0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBackToHome}
              className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
              title="Quay về trang chủ"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all" style={{ background: '#3A2E28' }}>
                <BookHeart className="w-6 h-6" style={{ color: '#EDE9E3' }} />
              </div>
              <div>
                <h1 className="font-handwriting text-2xl" style={{ color: '#3A2E28' }}>DearBook</h1>
                <p className="text-sm" style={{ color: '#7A6F66' }}>Thiết kế sách cá nhân hoá</p>
              </div>
            </button>
            <GoogleUserProfile user={user} onLogout={onLogout} />
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#3A2E28' }}>
            Xin chào, {user.name}! 👋
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-lg" style={{ color: '#7A6F66' }}>
              {books.length > 0 
                ? `Bạn đang có ${books.length} cuốn sách`
                : 'Bắt đầu tạo cuốn sách đầu tiên của bạn'
              }
            </p>
            {loading && <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#9B9088' }} />}
          </div>
          {error && <p className="text-xs mt-1 italic" style={{ color: '#9B9088' }}>{error}</p>}
        </div>

        {/* Create New Button */}
        <button
          onClick={onCreateNew}
          className="w-full mb-10 p-8 rounded-3xl text-white shadow-2xl transform hover:-translate-y-1 transition-all group relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3A2E28 0%, #5A5049 100%)', boxShadow: '0 12px 40px rgba(60,46,40,0.28)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #1C1715 0%, #3A2E28 100%)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #3A2E28 0%, #5A5049 100%)')}
        >
          <div className="absolute inset-0 opacity-8" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          <div className="relative flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'rgba(250,250,248,0.18)', backdropFilter: 'blur(4px)' }}>
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold mb-1">Tạo cuốn sách mới</p>
              <p className="text-sm" style={{ color: 'rgba(250,250,248,0.80)' }}>Thiết kế quà tặng ý nghĩa trong vài phút</p>
            </div>
          </div>
        </button>

        {/* Filters and View Controls */}
        <div className="rounded-2xl p-4 mb-6 border" style={{ background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(8px)', borderColor: '#DDD8D0', boxShadow: '0 2px 12px rgba(60,46,40,0.06)' }}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9B9088' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sách..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl outline-none transition-all border"
                  style={{ borderColor: '#DDD8D0', color: '#3A2E28', background: '#FAFAF8' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#7A6F66'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(122,111,102,0.12)'; }}
                  onBlur={e  => { e.currentTarget.style.borderColor = '#DDD8D0'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
              <select
                value={filterTheme}
                onChange={(e) => setFilterTheme(e.target.value)}
                className="px-4 py-2 rounded-xl outline-none transition-all border"
                style={{ borderColor: '#DDD8D0', color: '#3A2E28', background: '#FAFAF8' }}
              >
                <option value="all">Tất cả chủ đề</option>
                <option value="love">💕 Tình yêu</option>
                <option value="family">👨‍👩‍👧 Gia đình</option>
                <option value="birthday">🎂 Sinh nhật</option>
                <option value="friendship">🤝 Tình bạn</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-4 py-2 rounded-xl outline-none transition-all border"
                style={{ borderColor: '#DDD8D0', color: '#3A2E28', background: '#FAFAF8' }}
              >
                <option value="recent">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="name">Tên A-Z</option>
                <option value="theme">Chủ đề</option>
              </select>
            </div>
            <div className="flex gap-1 rounded-xl p-1" style={{ background: '#EDE9E3' }}>
              {(['masonry','grid','list'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="p-2 rounded-lg transition-all"
                  style={viewMode === mode
                    ? { background: '#FFFFFF', boxShadow: '0 1px 4px rgba(60,46,40,0.10)', color: '#3A2E28' }
                    : { color: '#7A6F66' }
                  }
                  title={mode === 'masonry' ? 'Masonry' : mode === 'grid' ? 'Grid' : 'List'}
                >
                  {mode === 'list' ? <Rows3 className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Books Section — dữ liệu từ Supabase bảng book_templates */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#3A2E28' }}>
              <Sparkles className="w-5 h-5" style={{ color: '#EDE9E3' }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold" style={{ color: '#3A2E28' }}>Sách Mẫu Tham Khảo</h3>
              <p className="text-sm" style={{ color: '#7A6F66' }}>Các mẫu sách đã được thiết kế sẵn nội dung chuyên nghiệp</p>
            </div>
            {templatesLoading && <Loader2 className="w-5 h-5 animate-spin ml-2" style={{ color: '#9B9088' }} />}
          </div>

          {/* Skeleton loading */}
          {templatesLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden border animate-pulse" style={{ background: '#F5F2EE', borderColor: '#DDD8D0' }}>
                  <div className="h-56" style={{ background: '#EDE9E3' }} />
                  <div className="p-5 space-y-3">
                    <div className="h-5 rounded-lg" style={{ background: '#DDD8D0', width: '60%' }} />
                    <div className="h-4 rounded-lg" style={{ background: '#EDE9E3', width: '90%' }} />
                    <div className="h-4 rounded-lg" style={{ background: '#EDE9E3', width: '75%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!templatesLoading && templatesError && (
            <div className="rounded-2xl p-6 text-center border" style={{ background: '#FFF5F5', borderColor: '#FECACA' }}>
              <p className="text-sm font-medium mb-1" style={{ color: '#B91C1C' }}>⚠️ Không thể tải mẫu sách từ Supabase</p>
              <p className="text-xs" style={{ color: '#9B9088' }}>{templatesError}</p>
            </div>
          )}

          {/* Empty state */}
          {!templatesLoading && !templatesError && supabaseTemplates.length === 0 && (
            <div className="rounded-2xl p-8 text-center border" style={{ background: '#F5F2EE', borderColor: '#DDD8D0' }}>
              <p className="text-sm" style={{ color: '#9B9088' }}>Chưa có mẫu sách nào. Vui lòng thêm dữ liệu vào bảng <code>book_templates</code> trên Supabase.</p>
            </div>
          )}

          {/* Supabase data — field mapping: name, description, cover_image_url, price, theme */}
          {!templatesLoading && !templatesError && supabaseTemplates.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {supabaseTemplates.map((tpl) => {
                const themeKey = (tpl.theme || 'love') as keyof typeof themeData;
                const td = themeData[themeKey] ?? themeData['love'];
                return (
                  <div
                    key={tpl.id}
                    className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border flex flex-col hover:-translate-y-0.5"
                    style={{ background: '#FFFFFF', borderColor: '#DDD8D0' }}
                  >
                    {/* Ảnh bìa — field: cover_image_url */}
                    <div className="relative h-56 overflow-hidden flex-shrink-0" style={{ background: '#EDE9E3' }}>
                      {tpl.cover_image_url ? (
                        <img
                          src={tpl.cover_image_url}
                          alt={tpl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${td.color}`}>
                          <span className="text-6xl opacity-60">{td.emoji}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg" style={{ background: '#3A2E28' }}>
                        MẪU
                      </div>
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg" style={{ background: 'rgba(250,250,248,0.92)', color: '#3A2E28' }}>
                        {td.emoji} {td.name}
                      </div>
                      {/* Giá — field: price */}
                      {tpl.price != null && (
                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg" style={{ background: 'rgba(250,250,248,0.92)', color: '#3A2E28' }}>
                          {tpl.price.toLocaleString('vi-VN')}đ
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      {/* Tiêu đề — field: name */}
                      <h4 className="font-bold text-xl mb-2 line-clamp-1" style={{ color: '#3A2E28' }}>{tpl.name}</h4>
                      {/* Mô tả — field: description */}
                      <div className="h-16 mb-4">
                        {tpl.description && (
                          <p className="text-sm line-clamp-3 leading-relaxed" style={{ color: '#7A6F66' }}>
                            {tpl.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-4" style={{ color: '#9B9088' }}>
                        <FileText className="w-4 h-4" />
                        <span>{tpl.page_count ?? '—'} trang</span>
                        <span style={{ color: '#C8C2BA' }}>•</span>
                        <span>Nội dung đầy đủ</span>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => onCreateNew()}
                          className="flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center"
                          style={{ background: '#3A2E28', color: '#FAFAF8' }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#1C1715')}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#3A2E28')}
                        >
                          Dùng mẫu này
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* User's Books Section */}
        <div ref={userBooksSectionRef} className="mb-6">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#3A2E28' }}>Sách Của Bạn</h3>
        </div>

        {/* Books Grid/Masonry/List */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center" style={{ background: '#EDE9E3' }}>
              <FileText className="w-12 h-12" style={{ color: '#9B9088' }} />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#3A2E28' }}>
              {searchQuery || filterTheme !== 'all' 
                ? 'Không tìm thấy sách nào'
                : 'Chưa có cuốn sách nào'
              }
            </h3>
            <p className="mb-6" style={{ color: '#7A6F66' }}>
              {searchQuery || filterTheme !== 'all'
                ? 'Thử thay đổi bộ lọc hoặc tìm kiếm'
                : 'Bắt đầu tạo cuốn sách đầu tiên của bạn'
              }
            </p>
            {!searchQuery && filterTheme === 'all' && (
              <button
                onClick={onCreateNew}
                className="px-8 py-3 rounded-xl font-bold transition-all"
                style={{ background: '#3A2E28', color: '#FAFAF8' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#1C1715')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#3A2E28')}
              >
                Tạo sách mới
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === 'masonry'
                ? 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'
                : viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredBooks.map((book) => (
              <div key={book.id} className={viewMode === 'masonry' ? 'break-inside-avoid' : ''}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {books.length > 0 && (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(themeData).map(([key, data]) => {
              const count = books.filter(b => b.theme === key).length;
              return (
                <div
                  key={key}
                  className="rounded-2xl p-4 text-center border"
                  style={{ background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(8px)', borderColor: '#DDD8D0' }}
                >
                  <div className="text-3xl mb-2">{data.emoji}</div>
                  <div className="text-2xl font-bold" style={{ color: '#3A2E28' }}>{count}</div>
                  <div className="text-sm" style={{ color: '#7A6F66' }}>{data.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Test 3D Button */}
      <Test3DButton />

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