import { useState, useEffect } from 'react';
import { 
  Camera, Loader2, MapPin, Phone, Save, UserRound, ArrowLeft, 
  BookOpen, ShoppingBag, Clock, Trash2, Edit, CheckCircle, 
  AlertCircle, ChevronRight, X
} from 'lucide-react';
import { User, BookData } from '../App';
import type { AuthUser } from '../lib/authApi';
import { orderApi, OrderResponse } from '../lib/orderApi';
import { bookApi } from '../lib/bookApi';
import { getAllBooks, deleteBook, getBooksSync, isIndexedDBAvailable, saveBook } from '../utils/bookStorage';
import { VIETNAM_PROVINCES } from '../data/vietnamProvinces';
import { toast } from 'sonner@2.0.3';

interface UserProfilePageProps {
  user: User;
  onBackToLibrary: () => void;
  onUpdateProfile: (profile: AuthUser) => Promise<AuthUser>;
  onEditBook: (book: BookData) => void;
}

export function UserProfilePage({ user, onBackToLibrary, onUpdateProfile, onEditBook }: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'designs' | 'orders'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [books, setBooks] = useState<BookData[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  const [form, setForm] = useState({
    fullName: user.name || '',
    avatarUrl: user.picture || '',
    phone: user.phone || '',
    address: user.address || '',
    ward: user.ward || '',
    district: user.district || '',
    city: user.city || '',
    shippingNote: user.shippingNote || '',
  });

  const userId = user.id || '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    loadBooks();
    loadOrders();
  }, [userId]);

  const loadBooks = async () => {
    setLoadingBooks(true);
    try {
      let booksSource: BookData[] = [];
      if (isIndexedDBAvailable()) {
        booksSource = await getAllBooks(userId);
      }
      if (booksSource.length === 0) {
        booksSource = getBooksSync(userId);
      }

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
        setBooks(booksSource);
      }
    } catch (err) {
      console.error('Failed to load books for profile page:', err);
      setBooks(getBooksSync(userId));
    } finally {
      setLoadingBooks(false);
    }
  };

  const loadOrders = async () => {
    if (!user.id) return;
    setLoadingOrders(true);
    try {
      const myOrders = await orderApi.getMyOrders(user.id);
      setOrders(myOrders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('avatarUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.id) return;

    try {
      setIsSaving(true);
      await onUpdateProfile({
        id: user.id,
        email: user.email,
        fullName: form.fullName.trim() || user.email.split('@')[0],
        avatarUrl: form.avatarUrl.trim() || undefined,
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
        ward: form.ward.trim() || undefined,
        district: form.district.trim() || undefined,
        city: form.city.trim() || undefined,
        shippingNote: form.shippingNote.trim() || undefined,
      });
      toast.success('Đã cập nhật hồ sơ thành công.');
    } catch (err: any) {
      toast.error(err?.message || 'Không thể cập nhật hồ sơ.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa cuốn sách "${bookTitle || 'chưa đặt tên'}" không?`)) {
      return;
    }
    try {
      await deleteBook(bookId, userId);
      toast.success('Đã xóa sách thành công.');
      loadBooks();
    } catch (err) {
      console.error('Delete book failed:', err);
      toast.error('Không thể xóa sách.');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            ⏳ Chờ xử lý
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            ✓ Đã xác nhận
          </span>
        );
      case 'PRINTING':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200 animate-pulse">
            🖨️ Đang in ấn
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-50 text-green-700 border border-green-200">
            🎉 Hoàn thành
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-50 text-red-700 border border-red-200">
            🗙 Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-50 text-gray-600 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const getBookPreviewImage = (book: BookData): string | null => {
    if (!book.pages || book.pages.length === 0) return null;
    const firstPage = book.pages[0] as any;
    if (firstPage.background?.type === 'image' && firstPage.background.value) {
      return firstPage.background.value;
    }
    if (firstPage.images && typeof firstPage.images === 'object') {
      const firstImg = Object.values(firstPage.images)[0];
      if (firstImg && typeof firstImg === 'string') return firstImg;
    }
    if (firstPage.imageUrl) return firstPage.imageUrl;
    return null;
  };

  return (
    <div className="min-h-screen" style={{ background: '#faf8f5' }}>
      {/* Background decoration grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #e2ddd6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.45,
        }}
      />

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBackToLibrary}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-950 hover:bg-stone-50 transition-all font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Quay lại thư viện</span>
            </button>
            <h1 className="text-lg font-bold text-stone-900">Tài khoản & Hoạt động</h1>
            <div className="w-24"></div> {/* Balance header */}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Navigation Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative group">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-stone-100 bg-stone-50 text-xl font-black text-stone-500 shadow-inner">
                  {form.avatarUrl ? (
                    <img src={form.avatarUrl} alt={form.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-10 w-10" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 bg-stone-950 text-white rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md">
                  <Camera className="h-3.5 w-3.5" />
                  <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                </label>
              </div>

              <div>
                <h2 className="text-lg font-bold text-stone-950">{form.fullName || user.email.split('@')[0]}</h2>
                <p className="text-xs text-stone-400 mt-1">{user.email}</p>
              </div>
            </div>

            {/* Vertical menu navigation */}
            <div className="flex flex-col gap-1 pt-4 border-t border-stone-100">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                  activeTab === 'profile' 
                    ? 'bg-stone-950 text-white shadow-md scale-[1.02]' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <UserRound className="h-4.5 w-4.5" />
                Thông tin cá nhân
              </button>
              
              <button
                onClick={() => setActiveTab('designs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                  activeTab === 'designs' 
                    ? 'bg-stone-950 text-white shadow-md scale-[1.02]' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <BookOpen className="h-4.5 w-4.5" />
                Lịch sử thiết kế ({books.length})
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                  activeTab === 'orders' 
                    ? 'bg-stone-950 text-white shadow-md scale-[1.02]' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                Lịch sử đơn hàng ({orders.length})
              </button>
            </div>
          </div>

          {/* Right Column: Display Corresponding Content */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8 min-h-[480px]">
            
            {/* PROFILE CONTENT */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Visual Profile Card displaying Avatar, Name, Email, and Join date */}
                <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-stone-50 rounded-2xl border border-stone-200/50">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-stone-200 bg-stone-100 flex-shrink-0">
                    {form.avatarUrl ? (
                      <img src={form.avatarUrl} alt={form.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-stone-500 bg-stone-200">
                        {form.fullName.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h4 className="text-lg font-bold text-stone-950">{form.fullName || user.email.split('@')[0]}</h4>
                    <p className="text-sm text-stone-500 font-medium">{user.email}</p>
                    {user.createdAt && (
                      <p className="text-xs text-stone-400">
                        Ngày tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-stone-450 uppercase tracking-wider mb-2">Chỉnh sửa thông tin nhận hàng</h3>
                </div>
                
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-stone-500">Tên hiển thị</span>
                    <input 
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-stone-900 bg-stone-50/50" 
                      value={form.fullName} 
                      onChange={e => updateField('fullName', e.target.value)} 
                      required 
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-stone-500">Số điện thoại</span>
                    <input 
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-stone-900 bg-stone-50/50" 
                      value={form.phone} 
                      onChange={e => updateField('phone', e.target.value.replace(/[^\d+()\-\s]/g, ''))} 
                      placeholder="Nhập số điện thoại" 
                      required 
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-bold text-stone-500">Địa chỉ nhận hàng</span>
                    <input 
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-stone-900 bg-stone-50/50" 
                      value={form.address} 
                      onChange={e => updateField('address', e.target.value)} 
                      placeholder="Số nhà, tên đường..." 
                      required 
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-stone-500">Phường / Xã</span>
                    <input 
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-stone-900 bg-stone-50/50" 
                      value={form.ward} 
                      onChange={e => updateField('ward', e.target.value)} 
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-stone-500">Quận / Huyện</span>
                    <input 
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-stone-900 bg-stone-50/50" 
                      value={form.district} 
                      onChange={e => updateField('district', e.target.value)} 
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-bold text-stone-500">Tỉnh / Thành phố</span>
                    <select 
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-stone-900 bg-stone-50/50 cursor-pointer" 
                      value={form.city} 
                      onChange={e => updateField('city', e.target.value)} 
                      required
                    >
                      <option value="">Chọn tỉnh / thành phố</option>
                      {VIETNAM_PROVINCES.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-bold text-stone-500">Ghi chú giao hàng</span>
                    <textarea 
                      className="min-h-[80px] w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-stone-900 bg-stone-50/50" 
                      value={form.shippingNote} 
                      onChange={e => updateField('shippingNote', e.target.value)} 
                      placeholder="Giao giờ hành chính, gọi trước khi giao..." 
                    />
                  </label>
                </div>

                <div className="flex justify-end pt-4 border-t border-stone-100">
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="inline-flex items-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-bold text-white hover:bg-stone-900 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            )}

            {/* DESIGNS CONTENT */}
            {activeTab === 'designs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-950">Lịch sử thiết kế</h3>
                  <p className="text-xs text-stone-400 mt-1">Các tác phẩm thiết kế sách bạn đã và đang thực hiện.</p>
                </div>

                {loadingBooks ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
                    <span className="text-xs text-stone-400 mt-2 animate-pulse">Đang tải danh sách thiết kế...</span>
                  </div>
                ) : books.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-stone-50/30 rounded-2xl border border-dashed border-stone-200">
                    <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mb-4 text-stone-400">
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <h4 className="font-bold text-stone-850 text-sm">Chưa có thiết kế nào</h4>
                    <p className="text-xs text-stone-400 max-w-xs mt-1">Các thiết kế sách của bạn sẽ hiển thị tại đây.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {books.map(book => {
                      const preview = getBookPreviewImage(book);
                      return (
                        <div 
                          key={book.id}
                          className="group flex flex-col justify-between border border-stone-100 hover:border-stone-300 rounded-2xl p-4 transition-all bg-stone-50/30 hover:shadow-md"
                        >
                          <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                              {preview ? (
                                <img src={preview} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400 font-bold">
                                  📖
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-sm text-stone-900 truncate" title={book.title}>
                                {book.title || <span className="italic text-stone-300">Chưa đặt tên</span>}
                              </h4>
                              <p className="text-xs text-stone-400 mt-1 capitalize">Chủ đề: {book.theme || 'Tình yêu'}</p>
                              <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                book.status === 'draft' ? 'bg-stone-100 text-stone-600' : 'bg-green-150 text-green-700'
                              }`}>
                                {book.status === 'draft' ? '📝 Nháp' : '✓ Hoàn thành'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-stone-100 mt-4 pt-3 text-[11px] text-stone-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(book.updatedAt).toLocaleDateString('vi-VN')}
                            </span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => onEditBook(book)}
                                className="p-2 bg-stone-100 hover:bg-stone-950 hover:text-white rounded-lg text-stone-600 transition-all cursor-pointer"
                                title="Chỉnh sửa"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteBook(book.id, book.title || 'Sách')}
                                className="p-2 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg text-red-500 transition-all cursor-pointer"
                                title="Xóa"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ORDERS CONTENT */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-950">Lịch sử đơn hàng</h3>
                  <p className="text-xs text-stone-400 mt-1">Theo dõi quá trình đặt hàng và in ấn các tác phẩm của bạn.</p>
                </div>

                {loadingOrders ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
                    <span className="text-xs text-stone-400 mt-2 animate-pulse">Đang tải lịch sử đơn hàng...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-stone-50/30 rounded-2xl border border-dashed border-stone-200">
                    <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mb-4 text-stone-400">
                      <ShoppingBag className="h-7 w-7" />
                    </div>
                    <h4 className="font-bold text-stone-850 text-sm">Chưa có đơn hàng nào</h4>
                    <p className="text-xs text-stone-400 max-w-sm mt-1">Đơn hàng của bạn sẽ hiển thị tại đây sau khi bạn đặt mua.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {orders.map(order => (
                      <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-stone-900 text-sm truncate max-w-[200px]" title={order.id}>
                              Mã: #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-stone-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <div className="text-right">
                            <p className="text-xs text-stone-400">Tổng cộng</p>
                            <p className="font-bold text-stone-950 text-sm mt-0.5">
                              {order.totalAmount ? order.totalAmount.toLocaleString('vi-VN') : '0'}đ
                            </p>
                          </div>
                          
                          <a 
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/orders/${order.id}/pdf/download`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-stone-200 text-stone-700 bg-white hover:bg-stone-50 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            Tải PDF
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
