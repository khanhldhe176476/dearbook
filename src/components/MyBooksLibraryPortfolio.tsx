import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  BookHeart, Plus, Search, Edit, Copy, Trash2, Clock,
  FileText, Grid3x3, Rows3, Sparkles, Box, BookOpen,
  TrendingUp, ChevronRight, Pencil, Check, X, Camera
} from 'lucide-react';
import { BookData, User } from '../App';
import { GoogleUserProfile } from './GoogleUserProfile';
import { Test3DButton } from './Test3DButton';
import { FlipBookReader } from './FlipBookReader';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { PhotobookNoticeDialog } from './PhotobookNoticeDialog';
import { useBookTemplates } from '../hooks/useBookTemplates';
import { toast } from 'sonner@2.0.3';
import { bookApi } from '../lib/bookApi';
import { Loader2 } from 'lucide-react';
import { getAllBooks, saveBook, deleteBook, getBooksSync, isIndexedDBAvailable } from '../utils/bookStorage';
import sampleBook1 from '../assets/sample_book_1.jpg';
import sampleBook2 from '../assets/sample_book_2.jpg';
import templateHenryTran from '../assets/template_henry_tran.jpg';
import templateYouthArchive from '../assets/template_youth_archive.jpg';

interface MyBooksLibraryPortfolioProps {
  user: User;
  onLogout: () => void;
  onCreateNew: () => void;
  onEditBook: (book: BookData) => void;
  onBackToHome?: () => void;
}

const LOCAL_TEMPLATES = [
  {
    id: 'local-tpl-henry-tran',
    name: 'Kỷ niệm dáng hình yêu dấu',
    description: 'Một dấu ấn riêng, lưu giữ thanh xuân. Thiết kế tối giản, hiện đại và tinh tế.',
    cover_image_url: templateHenryTran,
    theme: 'romantic',
    price: 299000,
    page_count: 16
  },
  {
    id: 'local-tpl-youth-archive',
    name: 'Gói lại thanh xuân',
    description: 'Lưu giữ những khoảnh khắc không thể quên. Phù hợp làm quà tặng bạn bè, kỷ niệm.',
    cover_image_url: templateYouthArchive,
    theme: 'friendship',
    price: 299000,
    page_count: 24
  }
];

type ViewMode = 'grid' | 'masonry' | 'list';
type SortBy = 'recent' | 'oldest' | 'name' | 'theme';

export function MyBooksLibraryPortfolio({ user, onLogout, onCreateNew, onEditBook, onBackToHome }: MyBooksLibraryPortfolioProps) {
  const { templates: supabaseTemplates, loading: templatesLoading, error: templatesError } = useBookTemplates();
  const displayTemplates = supabaseTemplates.filter(tpl => 
    tpl.id !== 'a1b2c3d4-0000-0000-0000-000000000001' &&
    tpl.id !== 'a1b2c3d4-0000-0000-0000-000000000002' &&
    tpl.id !== 'a1b2c3d4-0000-0000-0000-000000000003' &&
    tpl.name !== 'Phong cách Vintage' &&
    tpl.name !== 'Phong cách Hiện đại' &&
    tpl.name !== 'Phong cách Tối giản'
  );
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const handleCreateNewClick = () => {
    setShowNoticeModal(true);
  };
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
    try {
      // Primary: đọc từ IndexedDB (filtered by userId)
      let booksSource: BookData[] = [];
      if (isIndexedDBAvailable()) {
        booksSource = await getAllBooks(userId);
      }
      // Fallback: localStorage nếu IndexedDB trống hoặc không khả dụng
      if (booksSource.length === 0) {
        booksSource = getBooksSync(userId);
      }

      // Đồng bộ với backend API để mở lại sách ở trình duyệt khác.
      try {
        const apiBooks = await bookApi.getMyBooks(userId);
        const mergedBooks = [...booksSource];
        for (const apiBook of apiBooks) {
          let serverBook: BookData | null = null;
          if (apiBook.bookData) {
            try {
              serverBook = JSON.parse(apiBook.bookData) as BookData;
            } catch (err) {
              console.warn('Invalid server book snapshot:', apiBook.id, err);
            }
          }

          if (!serverBook) {
            serverBook = {
              id: apiBook.clientBookId || apiBook.id,
              title: apiBook.title,
              status: (apiBook.status || 'draft').toLowerCase() as any,
              updatedAt: apiBook.updatedAt,
              createdAt: apiBook.createdAt || apiBook.updatedAt,
              theme: 'love' as any,
              templateId: apiBook.templateId || '',
              pages: [],
            };
          }

          const existingIndex = mergedBooks.findIndex(m => m.id === serverBook!.id);
          if (existingIndex < 0) {
            mergedBooks.push(serverBook);
            await saveBook(serverBook, userId);
          } else {
            const localTime = new Date(mergedBooks[existingIndex].updatedAt || 0).getTime();
            const serverTime = new Date(serverBook.updatedAt || apiBook.updatedAt || 0).getTime();
            if (serverTime > localTime) {
              mergedBooks[existingIndex] = serverBook;
              await saveBook(serverBook, userId);
            }
          }
        }
        setBooks(mergedBooks);
      } catch {
        // Backend không khả dụng, dùng local data
        setBooks(booksSource);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load books:', err);
      setError('Không thể tải sách. Hiển thị từ bộ nhớ cục bộ.');
      // Last resort: localStorage
      setBooks(getBooksSync(userId));
    } finally { setLoading(false); }
  };

  const handleDuplicate = async (book: BookData) => {
    const duplicated: BookData = {
      ...book,
      id: `book-${Date.now()}`,
      title: `${book.title || 'Sách'} (Bản sao)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Lưu vào IndexedDB
    try {
      await saveBook(duplicated, userId);
    } catch (err) {
      console.error('Failed to save duplicated book to IndexedDB:', err);
    }
    loadBooks();
    toast.success('✅ Đã thêm sách mẫu vào thư viện!', { description: `"${duplicated.title}" sẵn sàng chỉnh sửa`, duration: 3000 });
    setHighlightedBookId(duplicated.id);
    setTimeout(() => setHighlightedBookId(null), 3000);
    setTimeout(() => { userBooksSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
  };

  const handleDeleteClick = (bookId: string, bookTitle: string) => {
    setDeleteDialog({ isOpen: true, bookId, bookTitle });
  };

  const handleDeleteConfirm = async () => {
    // Xóa khỏi IndexedDB
    try {
      await deleteBook(deleteDialog.bookId, userId);
    } catch (err) {
      console.error('Failed to delete book from IndexedDB:', err);
    }
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
    romantic:   { name: 'Tình yêu', emoji: '💕', grad: 'from-rose-400 to-pink-500',     badge: 'bg-rose-50 text-rose-600 border-rose-100'   },
    family:     { name: 'Gia đình', emoji: '👨‍👩‍👧', grad: 'from-sky-400 to-blue-500',     badge: 'bg-sky-50 text-sky-600 border-sky-100'       },
    birthday:   { name: 'Sinh nhật', emoji: '🎂', grad: 'from-amber-400 to-orange-500', badge: 'bg-amber-50 text-amber-600 border-amber-100'  },
    friendship: { name: 'Tình bạn', emoji: '🤝', grad: 'from-emerald-400 to-teal-500', badge: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    travel:     { name: 'Du lịch',   emoji: '✈️', grad: 'from-cyan-400 to-blue-500',     badge: 'bg-cyan-50 text-cyan-600 border-cyan-100'     },
    wedding:    { name: 'Đám cưới',  emoji: '💍', grad: 'from-purple-400 to-indigo-500', badge: 'bg-purple-50 text-purple-600 border-purple-100' },
    kids:       { name: 'Trẻ em',    emoji: '👶', grad: 'from-yellow-300 to-amber-500',  badge: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Lấy theme chính xác từ templateId (ưu tiên book.theme, fallback suy từ templateId)
  const getBookTheme = (book: BookData): keyof typeof themeData => {
    if (book.theme && themeData[book.theme]) return book.theme;
    const tid = book.templateId || '';
    if (tid.includes('love') || tid.includes('romantic')) return 'love';
    if (tid.includes('family') || tid.includes('gia-dinh')) return 'family';
    if (tid.includes('birthday') || tid.includes('sinh-nhat')) return 'birthday';
    if (tid.includes('friend') || tid.includes('ban-be')) return 'friendship';
    return 'love'; // fallback
  };

  // Lấy ảnh preview đầu tiên từ sách (nếu có)
  const getBookPreviewImage = (book: BookData): string | null => {
    if (!book.pages || book.pages.length === 0) return null;
    const firstPage = book.pages[0] as any;
    // EditorPage format: background image
    if (firstPage.background?.type === 'image' && firstPage.background.value) {
      return firstPage.background.value;
    }
    // PageData format: images
    if (firstPage.images && typeof firstPage.images === 'object') {
      const firstImg = Object.values(firstPage.images)[0];
      if (firstImg && typeof firstImg === 'string') return firstImg;
    }
    // auto-template format: imageUrl
    if (firstPage.imageUrl) return firstPage.imageUrl;
    return null;
  };

  // Rename book handler
  const handleRename = async (book: BookData, newTitle: string) => {
    if (!newTitle.trim()) return;
    const updated = { ...book, title: newTitle.trim(), updatedAt: new Date().toISOString() };
    try {
      await saveBook(updated, userId);
      loadBooks();
      toast.success('✅ Đã đổi tên sách');
    } catch (err) {
      console.error('Rename failed:', err);
      toast.error('Không thể đổi tên sách');
    }
  };

  // ─── Book Card (User's books) ───────────────────────────────────────────────
  const BookCard = ({ book }: { book: BookData }) => {
    const theme = themeData[getBookTheme(book)] ?? themeData['love'];
    const isHighlighted = highlightedBookId === book.id;
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState(book.title || '');
    const previewImage = getBookPreviewImage(book);

    const onRenameConfirm = () => {
      if (renameValue.trim() && renameValue.trim() !== (book.title || '')) {
        handleRename(book, renameValue.trim());
      }
      setIsRenaming(false);
    };

    const onRenameCancel = () => {
      setRenameValue(book.title || '');
      setIsRenaming(false);
    };

    return (
      <div
        className={`group relative flex flex-col overflow-hidden transition-all duration-500
          hover:-translate-y-2 hover:shadow-2xl
          ${isHighlighted ? 'ring-2 ring-amber-400/60 ring-offset-2' : ''}`}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: isHighlighted
            ? '0 12px 48px rgba(0,0,0,0.16)'
            : '0 4px 24px rgba(0,0,0,0.05)',
        }}
      >
        {/* ── Cover Area ─────────────────────────────────────────────────── */}
        <div className="relative h-52 flex-shrink-0 overflow-hidden">
          {/* Background gradient based on theme */}
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.grad}`} />

          {/* Show first page preview if available */}
          {previewImage ? (
            <>
              <img
                src={previewImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
            </>
          ) : (
            <>
              {/* Decorative pattern when no preview */}
              <div className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='5' cy='5' r='1.5'/%3E%3Ccircle cx='25' cy='5' r='1.5'/%3E%3Ccircle cx='5' cy='25' r='1.5'/%3E%3Ccircle cx='25' cy='25' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
            </>
          )}

          {/* Theme icon + title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="relative z-10 w-16 h-16 mb-2 flex items-center justify-center rounded-[1.25rem] bg-white/20 backdrop-blur-md border border-white/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <span className="text-3xl drop-shadow-lg">{theme.emoji}</span>
            </div>
            <h3 className="text-sm font-bold text-white drop-shadow-lg line-clamp-2 leading-snug text-center z-10 max-w-[90%]">
              {book.title || <span className="opacity-60 italic">Chưa đặt tên</span>}
            </h3>
          </div>

          {/* Status badge */}
          <div className="absolute top-3 left-3 z-20">
            {book.status === 'draft' ? (
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase rounded-full"
                style={{ background: 'rgba(255,255,255,0.92)', color: '#555', backdropFilter: 'blur(6px)' }}>
                📝 Nháp
              </span>
            ) : (
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase rounded-full"
                style={{ background: 'rgba(34,197,94,0.9)', color: '#fff', backdropFilter: 'blur(6px)' }}>
                ✓ Xong
              </span>
            )}
          </div>

          {/* Pages count */}
          <div className="absolute top-3 right-3 z-20">
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full"
              style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(6px)' }}>
              📄 {book.pages?.length || 0}
            </span>
          </div>

          {/* Hover actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2.5 z-30
            opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
            <ActionBtn onClick={() => setShow3DBook(book)} title="Xem 3D" icon={<Box className="w-4 h-4" />} dark />
            <ActionBtn onClick={() => onEditBook(book)} title="Chỉnh sửa" icon={<Edit className="w-4 h-4" />} primary />
            <ActionBtn onClick={() => handleDuplicate(book)} title="Nhân bản" icon={<Copy className="w-4 h-4" />} />
            <ActionBtn onClick={() => handleDeleteClick(book.id, book.title || 'Sách')} title="Xóa" icon={<Trash2 className="w-4 h-4" />} danger />
          </div>
        </div>

        {/* ── Info Area ──────────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-4 gap-2.5">
          {/* Title row (with rename) */}
          {isRenaming ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') onRenameConfirm(); if (e.key === 'Escape') onRenameCancel(); }}
                className="flex-1 px-2.5 py-1.5 text-sm font-bold outline-none rounded-lg border-2 border-amber-400 bg-amber-50/50"
                style={{ color: '#1a1a1a' }}
                autoFocus
              />
              <button onClick={onRenameConfirm} className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors" title="Lưu">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={onRenameCancel} className="p-1.5 rounded-lg bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors" title="Hủy">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-1.5 group/title">
              <p
                className="font-bold text-sm leading-snug line-clamp-2 flex-1 cursor-pointer transition-colors hover:text-amber-600"
                style={{ color: '#1a1a1a' }}
                onClick={() => { setRenameValue(book.title || ''); setIsRenaming(true); }}
                title="Click để đổi tên"
              >
                {book.title || <span style={{ color: '#ccc', fontStyle: 'italic' }}>Chưa đặt tên</span>}
              </p>
              <button
                onClick={() => { setRenameValue(book.title || ''); setIsRenaming(true); }}
                className="p-1 rounded-md opacity-0 group-hover/title:opacity-100 transition-all hover:bg-gray-100 flex-shrink-0"
                title="Đổi tên sách"
              >
                <Pencil className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          )}

          {/* Theme badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border w-fit ${theme.badge}`}>
            {theme.emoji} {theme.name}
          </span>

          {/* Creation date */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium mt-auto" style={{ color: '#999' }}>
            <Clock className="w-3 h-3" />
            <span>Tạo {formatDate(book.createdAt)}</span>
            {book.updatedAt !== book.createdAt && (
              <span className="text-[10px]" style={{ color: '#ccc' }}>
                · Cập nhật {formatDate(book.updatedAt)}
              </span>
            )}
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
        className="group flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid rgba(0,0,0,0.03)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        }}
      >
        {/* Image Area */}
        <div className="relative h-60 flex-shrink-0 overflow-hidden bg-gray-50">
          <img
            src={tpl.cover_image_url || (
              themeKey === 'love' || themeKey === 'romantic' || themeKey === 'wedding'
                ? sampleBook1
                : themeKey === 'family' || themeKey === 'kids'
                ? sampleBook2
                : themeKey === 'friendship' || themeKey === 'travel'
                ? '/ban-be/vintage-style/aatbio_com_image_export_May_21_2026%20(1).png'
                : '/ca-nhan/dust-soul/aatbio_com_image_export_May_23_2026%20(1).png'
            )}
            alt={tpl.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase transition-all"
              style={{ background: 'rgba(255,255,255,0.95)', color: '#111', backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              {td.emoji} {td.name}
            </span>
          </div>
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{ background: '#1a1a1a', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              MẪU
            </span>
          </div>
          {tpl.price != null && (
            <div className="absolute bottom-4 right-4 z-20">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.95)', color: '#111', backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                {tpl.price.toLocaleString('vi-VN')}đ
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-1 p-6 gap-4">
          <div>
            <h4 className="font-bold text-xl mb-2.5 transition-colors group-hover:text-amber-700" style={{ color: '#1a1a1a', lineHeight: '1.3' }}>
              {tpl.name}
            </h4>
            <p className="text-[14px] leading-relaxed line-clamp-2" style={{ color: '#666', minHeight: '2.75rem' }}>
              {tpl.description || 'Mẫu sách thiết kế cao cấp, lưu giữ những kỷ niệm vô giá.'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-[13px] font-medium mt-auto pb-5 border-b border-gray-100/80" style={{ color: '#888' }}>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-md">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>{tpl.page_count ?? '—'} trang</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-md">
              <Sparkles className="w-4 h-4 text-gray-400" />
              <span>Nội dung đầy đủ</span>
            </div>
          </div>

          <button
            onClick={handleCreateNewClick}
            className="w-full py-3.5 rounded-xl text-[14px] font-bold transition-all duration-300
              hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
            style={{ background: '#1a1a1a', color: '#fff' }}
          >
            Sử dụng mẫu này
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
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
              className="flex items-center group"
              title="Về trang chủ"
            >
              <div className="flex flex-col justify-center leading-none" style={{ height: '68px', overflow: 'visible' }}>
                <img 
                  src="/logo.png" 
                  alt="dearmemories" 
                  className="object-contain block transition-transform duration-300 group-hover:scale-105" 
                  style={{ height: '160px', margin: '-46px 0' }}
                />
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
          onClick={handleCreateNewClick}
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
            <h3 className="text-xl font-bold leading-tight" style={{ color: '#111' }}>Mẫu Thiết Kế Cá Nhân Hóa</h3>
            <p className="text-sm mt-0.5" style={{ color: '#aaa' }}>
              Các mẫu thiết kế quà tặng độc đáo, được cá nhân hóa trọn vẹn dành cho bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl shadow-lg border border-[#eeece9] bg-white p-2">
            <img src={templateHenryTran} alt="Kỷ niệm dáng hình yêu dấu" className="w-full h-auto object-cover rounded-2xl" />
          </div>
          <div className="overflow-hidden rounded-3xl shadow-lg border border-[#eeece9] bg-white p-2">
            <img src={templateYouthArchive} alt="Gói lại thanh xuân" className="w-full h-auto object-cover rounded-2xl" />
          </div>
        </div>
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
                  onClick={handleCreateNewClick}
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

      <PhotobookNoticeDialog
        isOpen={showNoticeModal}
        onConfirm={() => {
          setShowNoticeModal(false);
          onCreateNew();
        }}
        onCancel={() => setShowNoticeModal(false)}
      />

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
  onClick, title, icon, dark, danger, primary
}: {
  onClick: () => void; title: string; icon: ReactNode; dark?: boolean; danger?: boolean; primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{
        background: danger ? '#ef4444' : primary ? '#f59e0b' : dark ? '#1a1a1a' : '#fff',
        color: (dark || danger || primary) ? '#fff' : '#1a1a1a',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      }}
    >
      {icon}
    </button>
  );
}
