import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  BookHeart, Plus, Search, Edit, Copy, Trash2, Clock,
  FileText, Grid3x3, Rows3, Sparkles, Box, BookOpen,
  TrendingUp, ChevronRight
} from 'lucide-react';
import { BookData, User } from '../App';
import { GoogleUserProfile } from './GoogleUserProfile';
import { Test3DButton } from './Test3DButton';
import { FlipBookReader } from './FlipBookReader';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useBookTemplates } from '../hooks/useBookTemplates';
import { toast } from 'sonner@2.0.3';
import { bookApi } from '../lib/bookApi';
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
  const { templates: supabaseTemplates, loading: templatesLoading, error: templatesError } = useBookTemplates();
  const [books, setBooks] = useState<BookData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [filterTheme, setFilterTheme] = useState<string>('all');
  const [show3DBook, setShow3DBook] = useState<BookData | null>(null);
  const [highlightedBookId, setHighlightedBookId] = useState<string | null>(null);
  const userBooksSectionRef = useRef<HTMLDivElement>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; bookId: string; bookTitle: string }>({
    isOpen: false, bookId: '', bookTitle: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = user.id || '00000000-0000-0000-0000-000000000000';

  useEffect(() => { loadBooks(); }, []);

  const loadBooks = async () => {
    setLoading(true);
    const localBooks = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
    try {
      const apiBooks = await bookApi.getMyBooks(userId);
      const mappedApiBooks: BookData[] = apiBooks.map(b => {
        const localMatch = localBooks.find((l: BookData) => l.id === b.id);
        return {
          id: b.id, title: b.title,
          status: b.status.toLowerCase() as any,
          updatedAt: b.updatedAt, createdAt: b.updatedAt,
          theme: (localMatch?.theme || 'love') as any,
          templateId: b.templateId,
          pages: localMatch?.pages || [],
          character: localMatch?.character
        };
      });
      const mergedBooks = [...mappedApiBooks];
      localBooks.forEach((l: BookData) => {
        if (!mergedBooks.find(m => m.id === l.id)) mergedBooks.push(l);
      });
      setBooks(mergedBooks); setError(null);
    } catch (err) {
      console.error('Failed to fetch books from API:', err);
      setError('Không thể kết nối máy chủ. Hiển thị từ bộ nhớ cục bộ.');
      setBooks(localBooks);
    } finally { setLoading(false); }
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
    const allBooks = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
    allBooks.push(duplicated);
    localStorage.setItem('dearbook_books', JSON.stringify(allBooks));
    loadBooks();
    toast.success('✅ Đã thêm sách mẫu vào thư viện!', { description: `"${duplicated.title}" sẵn sàng chỉnh sửa`, duration: 3000 });
    setHighlightedBookId(duplicated.id);
    setTimeout(() => setHighlightedBookId(null), 3000);
    setTimeout(() => { userBooksSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
  };

  const handleDeleteClick = (bookId: string, bookTitle: string) => {
    setDeleteDialog({ isOpen: true, bookId, bookTitle });
  };

  const handleDeleteConfirm = () => {
    const allBooks = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
    const filtered = allBooks.filter((b: BookData) => b.id !== deleteDialog.bookId);
    localStorage.setItem('dearbook_books', JSON.stringify(filtered));
    loadBooks();
    setDeleteDialog({ isOpen: false, bookId: '', bookTitle: '' });
    toast.success('🗑️ Đã xóa sách thành công', { duration: 2000 });
  };

  const handleDeleteCancel = () => setDeleteDialog({ isOpen: false, bookId: '', bookTitle: '' });

  let filteredBooks = books.filter(book => {
    const matchesSearch = (book.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTheme = filterTheme === 'all' || book.theme === filterTheme;
    return matchesSearch && matchesTheme;
  });

  filteredBooks.sort((a, b) => {
    switch (sortBy) {
      case 'recent': return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':   return (a.title || '').localeCompare(b.title || '');
      case 'theme':  return a.theme.localeCompare(b.theme);
      default: return 0;
    }
  });

  const themeData = {
    love:       { name: 'Tình yêu', emoji: '💕', grad: 'from-rose-400 to-pink-500',     badge: 'bg-rose-50 text-rose-600 border-rose-100'   },
    family:     { name: 'Gia đình', emoji: '👨‍👩‍👧', grad: 'from-sky-400 to-blue-500',     badge: 'bg-sky-50 text-sky-600 border-sky-100'       },
    birthday:   { name: 'Sinh nhật', emoji: '🎂', grad: 'from-amber-400 to-orange-500', badge: 'bg-amber-50 text-amber-600 border-amber-100'  },
    friendship: { name: 'Tình bạn', emoji: '🤝', grad: 'from-emerald-400 to-teal-500', badge: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // ─── Book Card (User's books) ───────────────────────────────────────────────
  const BookCard = ({ book }: { book: BookData }) => {
    const theme = themeData[book.theme] ?? themeData['love'];
    const isHighlighted = highlightedBookId === book.id;

    return (
      <div
        className={`group relative flex flex-col overflow-hidden transition-all duration-300
          hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer
          ${isHighlighted ? 'ring-2 ring-black/20 ring-offset-2' : ''}`}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #eeece9',
          boxShadow: isHighlighted
            ? '0 12px 48px rgba(0,0,0,0.16)'
            : '0 2px 16px rgba(0,0,0,0.07)',
        }}
      >
        {/* Cover */}
        <div className={`relative h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br ${theme.grad}`}>
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='37' cy='7' r='2'/%3E%3Ccircle cx='7' cy='37' r='2'/%3E%3Ccircle cx='37' cy='37' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          {/* Dark gradient bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
            <div className="text-4xl mb-2.5 drop-shadow-lg">{theme.emoji}</div>
            <h3 className="text-sm font-bold text-white drop-shadow-lg line-clamp-2 leading-snug px-2">
              {book.title || <span className="opacity-60 italic">Chưa đặt tên</span>}
            </h3>
          </div>
          {/* Status badge top-left */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {book.status === 'draft' && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full"
                style={{ background: 'rgba(255,255,255,0.90)', color: '#666', backdropFilter: 'blur(4px)' }}>
                Nháp
              </span>
            )}
            {book.status === 'completed' && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full"
                style={{ background: 'rgba(34,197,94,0.90)', color: '#fff' }}>
                ✓ Hoàn thành
              </span>
            )}
          </div>
          {/* Pages badge top-right */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 text-xs font-medium rounded-full"
              style={{ background: 'rgba(0,0,0,0.45)', color: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(4px)' }}>
              {book.pages?.length || 0}tr
            </span>
          </div>
          {/* Hover action overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2.5
            opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
            <ActionBtn onClick={() => setShow3DBook(book)} title="Xem 3D" icon={<Box className="w-4 h-4" />} dark />
            <ActionBtn onClick={() => onEditBook(book)} title="Chỉnh sửa" icon={<Edit className="w-4 h-4" />} />
            <ActionBtn onClick={() => handleDuplicate(book)} title="Nhân bản" icon={<Copy className="w-4 h-4" />} />
            <ActionBtn onClick={() => handleDeleteClick(book.id, book.title || 'Sách')} title="Xóa" icon={<Trash2 className="w-4 h-4" />} danger />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-4 gap-2.5">
          {/* Title */}
          <p className="font-semibold text-sm leading-snug line-clamp-1" style={{ color: '#111' }}>
            {book.title || <span style={{ color: '#ccc', fontStyle: 'italic' }}>Chưa đặt tên</span>}
          </p>
          {/* Meta row */}
          <div className="flex items-center justify-between mt-auto">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${theme.badge}`}>
              {theme.emoji} {theme.name}
            </span>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#bbb' }}>
              <Clock className="w-3 h-3" />
              <span>{formatDate(book.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // ─── Template Card ──────────────────────────────────────────────────────────
  const TemplateCard = ({ tpl }: { tpl: any }) => {
    const themeKey = (tpl.theme || 'love') as keyof typeof themeData;
    const td = themeData[themeKey] ?? themeData['love'];
    return (
      <div
        className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #eeece9',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        {/* Image */}
        <div className="relative h-52 flex-shrink-0 overflow-hidden" style={{ background: '#f0ede8' }}>
          {tpl.cover_image_url ? (
            <img
              src={tpl.cover_image_url}
              alt={tpl.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${td.grad}`}>
              <span className="text-6xl opacity-70">{td.emoji}</span>
            </div>
          )}
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          {/* Badges */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.93)', color: '#222', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }}>
              {td.emoji} {td.name}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide"
              style={{ background: '#111', color: '#fff' }}>
              MẪU
            </span>
          </div>
          {tpl.price != null && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.93)', color: '#222', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }}>
                {tpl.price.toLocaleString('vi-VN')}đ
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <h4 className="font-bold text-base leading-snug line-clamp-1" style={{ color: '#111' }}>
            {tpl.name}
          </h4>
          <p className="text-sm leading-relaxed line-clamp-2 flex-1" style={{ color: '#888', minHeight: '2.5rem' }}>
            {tpl.description || 'Mẫu sách thiết kế cao cấp.'}
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#bbb' }}>
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{tpl.page_count ?? '—'} trang</span>
            <span>·</span>
            <span>Nội dung đầy đủ</span>
          </div>
          <button
            onClick={onCreateNew}
            className="mt-1 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              hover:opacity-80 active:scale-95 flex items-center justify-center gap-1.5"
            style={{ background: '#111', color: '#fff' }}
          >
            Dùng mẫu này <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#faf8f5' }}>

      {/* Subtle dot grid background */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #e2ddd6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.45,
        }}
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50"
        style={{
          background: 'rgba(250,248,245,0.88)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 16px rgba(0,0,0,0.04)',
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={onBackToHome}
              className="flex items-center gap-3 group"
              title="Về trang chủ"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ background: '#111' }}
              >
                <BookHeart className="w-5 h-5" style={{ color: '#f3e9d7' }} />
              </div>
              <div className="flex flex-col justify-center leading-none" style={{ height: '32px', overflow: 'visible' }}>
                <img 
                  src="/logo.png" 
                  alt="dearmemories" 
                  className="object-contain block" 
                  style={{ height: '76px', margin: '-20px 0' }}
                />
                <span className="text-[10px] hidden sm:block" style={{ color: '#aaa', marginTop: '-18px' }}>
                  Thiết kế sách cá nhân hoá
                </span>
              </div>
            </button>

            {/* User pill */}
            <div className="flex items-center gap-2">
              <GoogleUserProfile user={user} onLogout={onLogout} />
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">

        {/* Welcome */}
        <div className="space-y-1">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: '#111', lineHeight: 1.2 }}>
            Xin chào, {user.name.split(' ').slice(-1)[0]}! 👋
          </h2>
          <div className="flex items-center gap-3">
            <p className="text-base sm:text-lg" style={{ color: '#999' }}>
              {books.length > 0
                ? `Bạn đang có ${books.length} cuốn sách trong thư viện`
                : 'Bắt đầu tạo cuốn sách đầu tiên của bạn'}
            </p>
            {loading && <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#ccc' }} />}
          </div>
          {error && <p className="text-xs italic" style={{ color: '#bbb' }}>{error}</p>}
        </div>

        {/* ── CTA Banner ──────────────────────────────────────────────────── */}
        <button
          onClick={onCreateNew}
          className="relative w-full overflow-hidden text-left transition-all duration-300
            hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99] cursor-pointer group"
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2520 60%, #3a2e26 100%)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            padding: '32px 36px',
          }}
        >
          {/* Noise/grain overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px',
            }}
          />
          {/* Radial glow */}
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />

          <div className="relative flex items-center gap-5">
            {/* Icon circle */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0
                transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white leading-tight">Tạo cuốn sách mới</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Thiết kế quà tặng ý nghĩa chỉ trong vài phút
              </p>
            </div>
            {/* Arrow */}
            <div className="ml-auto">
              <ChevronRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: 'rgba(255,255,255,0.4)' }} />
            </div>
          </div>
        </button>

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 sm:p-4"
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #eeece9',
            boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Search */}
          <div className="relative flex-1 w-full sm:min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#ccc' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sách..."
              className="w-full pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
              style={{
                borderRadius: '10px',
                border: '1px solid #e8e4de',
                background: '#faf8f5',
                color: '#333',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#999'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.06)'; }}
              onBlur={e  => { e.currentTarget.style.borderColor = '#e8e4de'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <select
              value={filterTheme}
              onChange={e => setFilterTheme(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2.5 text-sm outline-none transition-all cursor-pointer"
              style={{ borderRadius: '10px', border: '1px solid #e8e4de', background: '#faf8f5', color: '#444', minWidth: '130px' }}
            >
              <option value="all">Tất cả chủ đề</option>
              <option value="love">💕 Tình yêu</option>
              <option value="family">👨‍👩‍👧 Gia đình</option>
              <option value="birthday">🎂 Sinh nhật</option>
              <option value="friendship">🤝 Tình bạn</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortBy)}
              className="flex-1 sm:flex-none px-3 py-2.5 text-sm outline-none transition-all cursor-pointer"
              style={{ borderRadius: '10px', border: '1px solid #e8e4de', background: '#faf8f5', color: '#444', minWidth: '110px' }}
            >
              <option value="recent">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name">Tên A-Z</option>
              <option value="theme">Chủ đề</option>
            </select>

            {/* View toggle */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#f0ede8' }}>
              {(['grid', 'masonry', 'list'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={mode === 'grid' ? 'Lưới đều' : mode === 'masonry' ? 'Masonry' : 'Danh sách'}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all"
                  style={viewMode === mode
                    ? { background: '#fff', color: '#111', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }
                    : { color: '#aaa' }
                  }
                >
                  {mode === 'list' ? <Rows3 className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Template Section ─────────────────────────────────────────────── */}
        <section className="space-y-6">
          {/* Section header */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: '#111' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#f3e9d7' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold leading-tight" style={{ color: '#111' }}>Sách Mẫu Tham Khảo</h3>
              <p className="text-sm mt-0.5" style={{ color: '#aaa' }}>
                Các mẫu đã được thiết kế sẵn nội dung chuyên nghiệp
              </p>
            </div>
            {templatesLoading && <Loader2 className="w-4 h-4 animate-spin ml-1 mt-1 flex-shrink-0" style={{ color: '#ccc' }} />}
          </div>

          {/* Skeleton */}
          {templatesLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse overflow-hidden"
                  style={{ borderRadius: '20px', border: '1px solid #eeece9', background: '#fff' }}>
                  <div className="h-52" style={{ background: '#f0ede8' }} />
                  <div className="p-5 space-y-3">
                    <div className="h-4 rounded-lg" style={{ background: '#eee', width: '55%' }} />
                    <div className="h-3 rounded-lg" style={{ background: '#f2f2f2', width: '90%' }} />
                    <div className="h-3 rounded-lg" style={{ background: '#f2f2f2', width: '70%' }} />
                    <div className="h-9 rounded-xl mt-4" style={{ background: '#eee' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!templatesLoading && templatesError && (
            <div className="p-5 text-center rounded-2xl" style={{ background: '#fff5f5', border: '1px solid #fecaca' }}>
              <p className="text-sm font-medium" style={{ color: '#b91c1c' }}>⚠️ Không thể tải mẫu sách</p>
              <p className="text-xs mt-1" style={{ color: '#aaa' }}>{templatesError}</p>
            </div>
          )}

          {/* Empty */}
          {!templatesLoading && !templatesError && supabaseTemplates.length === 0 && (
            <div className="p-8 text-center rounded-2xl" style={{ background: '#faf8f5', border: '1px dashed #e0dbd3' }}>
              <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: '#ddd' }} />
              <p className="text-sm" style={{ color: '#bbb' }}>
                Chưa có mẫu sách. Thêm dữ liệu vào bảng <code className="text-xs px-1 py-0.5 rounded" style={{ background: '#f0ede8' }}>book_templates</code> trên Supabase.
              </p>
            </div>
          )}

          {/* Template grid */}
          {!templatesLoading && !templatesError && supabaseTemplates.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {supabaseTemplates.map(tpl => <TemplateCard key={tpl.id} tpl={tpl} />)}
            </div>
          )}
        </section>

        {/* ── User Books Section ───────────────────────────────────────────── */}
        <section ref={userBooksSectionRef} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#111' }}>
                <BookOpen className="w-4 h-4" style={{ color: '#f3e9d7' }} />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#111' }}>Sách Của Bạn</h3>
                <p className="text-sm mt-0.5" style={{ color: '#aaa' }}>
                  {filteredBooks.length} cuốn{filteredBooks.length !== books.length ? ` / ${books.length} tổng` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                style={{ background: '#f0ede8' }}>
                <FileText className="w-9 h-9" style={{ color: '#ccc' }} />
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: '#222' }}>
                {searchQuery || filterTheme !== 'all' ? 'Không tìm thấy sách nào' : 'Chưa có cuốn sách nào'}
              </h4>
              <p className="text-sm mb-6" style={{ color: '#aaa' }}>
                {searchQuery || filterTheme !== 'all'
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                  : 'Bắt đầu hành trình tạo sách cá nhân hóa của bạn'}
              </p>
              {!searchQuery && filterTheme === 'all' && (
                <button
                  onClick={onCreateNew}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: '#111', color: '#fff' }}
                >
                  <Plus className="w-4 h-4" /> Tạo sách mới
                </button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'masonry'
                ? 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'
                : viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredBooks.map(book => (
                <div key={book.id} className={viewMode === 'masonry' ? 'break-inside-avoid' : ''}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Stats Footer ─────────────────────────────────────────────────── */}
        {books.length > 0 && (
          <section
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-1"
          >
            {Object.entries(themeData).map(([key, data]) => {
              const count = books.filter(b => b.theme === key).length;
              return (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center p-5 text-center transition-all hover:-translate-y-0.5"
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #eeece9',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="text-2xl mb-2">{data.emoji}</div>
                  <div className="text-2xl font-bold leading-none" style={{ color: '#111' }}>{count}</div>
                  <div className="text-xs mt-1" style={{ color: '#aaa' }}>{data.name}</div>
                </div>
              );
            })}
          </section>
        )}
      </div>

      {/* Floating elements */}
      <Test3DButton />

      {show3DBook && (
        <FlipBookReader book={show3DBook} onClose={() => setShow3DBook(null)} />
      )}

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        bookTitle={deleteDialog.bookTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

// ── Tiny helper component ────────────────────────────────────────────────────
function ActionBtn({
  onClick, title, icon, dark, danger
}: {
  onClick: () => void; title: string; icon: ReactNode; dark?: boolean; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{
        background: danger ? '#b45d5d' : dark ? '#111' : '#fff',
        color: (dark || danger) ? '#fff' : '#111',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      }}
    >
      {icon}
    </button>
  );
}