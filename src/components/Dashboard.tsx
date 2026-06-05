import { useState, useEffect } from 'react';
import { BookHeart, Plus, LogOut, Search, Grid, List, Heart, Users, Cake, Sparkles, Clock, Edit, Trash2, BookOpen, Star, Zap } from 'lucide-react';
import { Book, Theme } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DashboardProps {
  user: { email: string; name: string };
  onLogout: () => void;
  onCreateBook: (theme: Theme) => void;
  onEditBook: (book: Book) => void;
}

/*  Neutral palette tokens  */
const N = {
  ivory:      '#FAFAF8',
  cream:      '#F5F2EE',
  sandLight:  '#EDE9E3',
  sand:       '#DDD8D0',
  stoneLt:    '#C8C2BA',
  stone:      '#9B9088',
  taupe:      '#7A6F66',
  taupeDark:  '#5A5049',
  espresso:   '#000000',
  ink:        '#000000',
  accent:     '#8C6E5D',
};

export function Dashboard({ user, onLogout, onCreateBook, onEditBook }: DashboardProps) {
  const [viewMode,       setViewMode]       = useState<'grid' | 'list'>('grid');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [savedBooks,     setSavedBooks]     = useState<Book[]>([]);
  const [showCreateModal,setShowCreateModal]= useState(false);

  useEffect(() => {
    const books = JSON.parse(localStorage.getItem('bookify_books') || '[]');
    setSavedBooks(books);
  }, []);

  const handleDeleteBook = (bookId: string) => {
    const updated = savedBooks.filter(b => b.id !== bookId);
    localStorage.setItem('bookify_books', JSON.stringify(updated));
    setSavedBooks(updated);
  };

  const filteredBooks = savedBooks.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const themes: { id: Theme; name: string; icon: any; description: string }[] = [
    { id: 'love',       name: 'Tnh yu',  icon: Heart,    description: 'Cho ngi thng yu' },
    { id: 'family',     name: 'Gia nh',  icon: Users,    description: 'K nim gia nh' },
    { id: 'birthday',   name: 'Sinh nht', icon: Cake,     description: 'Chc mng sinh nht' },
    { id: 'friendship', name: 'Tnh bn',  icon: Sparkles, description: 'Dnh cho bn b' },
  ];

  return (
    <div className="min-h-screen" style={{ background: N.ivory }}>

      {/*  Subtle dot pattern  */}
      <div className="fixed inset-0 pointer-events-none opacity-40"
           style={{
             backgroundImage: `radial-gradient(circle, ${N.sand} 1px, transparent 1px)`,
             backgroundSize: '28px 28px',
           }} />

      {/*  Header  */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(250,250,248,0.90)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${N.sand}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex flex-col justify-center" style={{ height: '40px', overflow: 'visible' }}>
              <img 
                src="/logo.png" 
                alt="dearmemories" 
                className="object-contain block" 
                style={{ height: '96px', margin: '-28px 0' }}
              />
            </div>
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-3 px-3 py-2 rounded-xl"
              style={{ background: N.cream, border: `1px solid ${N.sand}` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
                style={{ background: N.espresso, color: N.sandLight }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium" style={{ color: N.espresso }}>{user.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl transition-colors"
              title="ng xut"
              style={{ color: N.stone }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = N.sandLight)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">

        {/*  Welcome Section  */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2" style={{ color: N.espresso }}>
                Cho mng tr li, {user.name} 
              </h2>
              <p className="text-base" style={{ color: N.taupe }}>
                To nhng cun sch tuyt vi vi cu chuyn ca ring bn
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { icon: BookOpen, label: 'Sch ca bn', value: savedBooks.length,                                         color: N.espresso },
                  { icon: Star,     label: ' hon thnh', value: savedBooks.filter(b => b.pages.length >= 8).length,       color: N.accent },
                  { icon: Zap,      label: 'ang lm',      value: savedBooks.filter(b => b.pages.length < 8).length,        color: N.taupe },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl p-4"
                      style={{ background: N.cream, border: `1px solid ${N.sand}` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" style={{ color: stat.color }} />
                        <span className="text-xs font-medium" style={{ color: N.stone }}>{stat.label}</span>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: N.espresso }}>{stat.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inspiring photo */}
            <div className="lg:w-72 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group" style={{ border: `1px solid ${N.sand}` }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1577086664341-033ee09074ec?w=400"
                  alt="Inspiration"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0 flex items-end p-4"
                  style={{ background: 'linear-gradient(to top, rgba(28,23,21,0.75), transparent)' }}
                >
                  <p className="text-xs font-medium" style={{ color: N.sandLight }}>
                    "Mi cun sch l mt mn qu t tri tim" 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  Create New Book Button  */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full p-7 rounded-2xl border-2 border-dashed transition-all duration-200 group flex items-center justify-center gap-5 hover:-translate-y-0.5"
            style={{
              background: N.cream,
              borderColor: N.stoneLt,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = N.taupe;
              (e.currentTarget as HTMLElement).style.background = N.sandLight;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = N.stoneLt;
              (e.currentTarget as HTMLElement).style.background = N.cream;
            }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: N.espresso }}
            >
              <Plus className="w-7 h-7" style={{ color: N.sandLight }} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xl font-bold" style={{ color: N.espresso }}>To sch mi</p>
              <p className="text-sm" style={{ color: N.taupe }}>Bt u hnh trnh sng to ca bn</p>
            </div>
          </button>
        </div>

        {/*  Search & View Toggle  */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: N.stone }} />
            <input
              type="text"
              placeholder="Tm kim sch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all text-sm"
              style={{
                background: N.cream,
                border: `1.5px solid ${N.sand}`,
                color: N.espresso,
              }}
              onFocus={e => ((e.target as HTMLInputElement).style.borderColor = N.taupe)}
              onBlur={e  => ((e.target as HTMLInputElement).style.borderColor = N.sand)}
            />
          </div>

          <div className="flex gap-2">
            {([['grid', Grid], ['list', List]] as const).map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="p-3 rounded-xl transition-all"
                style={{
                  background:   viewMode === mode ? N.espresso : N.cream,
                  color:        viewMode === mode ? N.sandLight : N.taupe,
                  border:       `1.5px solid ${viewMode === mode ? N.espresso : N.sand}`,
                }}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        {/*  Library  */}
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: N.espresso }}>
            <BookOpen className="w-5 h-5" style={{ color: N.taupe }} />
            Th vin ca ti ({filteredBooks.length})
          </h3>

          {filteredBooks.length === 0 ? (
            <div
              className="text-center py-20 px-4 rounded-2xl"
              style={{ background: N.cream, border: `1.5px dashed ${N.sand}` }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: N.sandLight }}
              >
                <BookHeart className="w-12 h-12" style={{ color: N.stone }} />
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: N.espresso }}>
                {searchQuery ? 'Khng tm thy sch no' : 'Cha c cun sch no'}
              </h4>
              <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: N.taupe }}>
                {searchQuery
                  ? 'Th tm kim vi t kho khc nh!'
                  : 'Bt u to cun sch u tin v lu gi nhng khonh khc ng nh'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-7 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
                  style={{ background: N.espresso, color: N.sandLight, boxShadow: `0 4px 16px rgba(60,46,40,0.20)` }}
                >
                  To sch u tin
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  viewMode={viewMode}
                  onEdit={() => onEditBook(book)}
                  onDelete={() => handleDeleteBook(book.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/*  Inspiration Footer Banner  */}
        {filteredBooks.length > 0 && (
          <div
            className="rounded-2xl p-7 flex flex-col md:flex-row items-center gap-6"
            style={{ background: N.cream, border: `1px solid ${N.sand}` }}
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2" style={{ color: N.espresso }}>Tip tc sng to!</h3>
              <p className="text-sm mb-4" style={{ color: N.taupe }}>
                Hy tip tc to thm nhng cun sch tuyt vi na nh.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: N.espresso, color: N.sandLight }}
              >
                To thm sch mi
              </button>
            </div>
            <div className="w-full md:w-56">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1585521551422-497df464aa43?w=300"
                alt="Books"
                className="w-full h-36 object-cover rounded-xl"
              />
            </div>
          </div>
        )}
      </div>

      {/*  Create Modal  */}
      {showCreateModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: 'rgba(28,23,21,0.60)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
          <div
            className="rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
            style={{ background: N.ivory, border: `1px solid ${N.sand}` }}
          >
            <div className="p-7">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1" style={{ color: N.espresso }}>Chn ch  sch</h3>
                  <p className="text-sm" style={{ color: N.taupe }}>Chn ch  ph hp vi cu chuyn ca bn</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors text-lg"
                  style={{ color: N.stone }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = N.sandLight)}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {themes.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => { onCreateBook(theme.id); setShowCreateModal(false); }}
                      className="relative p-7 rounded-2xl text-left group transition-all hover:-translate-y-0.5 overflow-hidden"
                      style={{
                        background: N.cream,
                        border: `1.5px solid ${N.sand}`,
                        boxShadow: `0 2px 8px rgba(60,46,40,0.06)`,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = N.sandLight;
                        (e.currentTarget as HTMLElement).style.borderColor = N.taupe;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(60,46,40,0.14)`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = N.cream;
                        (e.currentTarget as HTMLElement).style.borderColor = N.sand;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px rgba(60,46,40,0.06)`;
                      }}
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                        style={{ background: N.espresso }}
                      >
                        <Icon className="w-7 h-7" style={{ color: N.sandLight }} strokeWidth={2} />
                      </div>
                      <h4 className="text-lg font-bold mb-1" style={{ color: N.espresso }}>{theme.name}</h4>
                      <p className="text-sm" style={{ color: N.taupe }}>{theme.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*  BookCard Component  */
function BookCard({
  book, viewMode, onEdit, onDelete,
}: {
  book: Book;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
}) {
  const themeIcons: Record<string, string> = {
    love: '', family: '', birthday: '', friendship: '',
  };
  const themeLabels: Record<string, string> = {
    love: 'Tnh yu', family: 'Gia nh', birthday: 'Sinh nht', friendship: 'Tnh bn',
  };

  const bgMap: Record<string, string> = {
    love:       '#F2EBE5',
    family:     '#E8ECEF',
    birthday:   '#EDE8F0',
    friendship: '#F0EBE5',
  };

  if (viewMode === 'list') {
    return (
      <div
        className="rounded-2xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 group"
        style={{ background: '#FAFAF8', border: `1.5px solid ${N.sand}`, boxShadow: `0 1px 4px rgba(60,46,40,0.06)` }}
      >
        <div
          className="w-16 h-20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform"
          style={{ background: bgMap[book.theme] ?? N.cream }}
        >
          {themeIcons[book.theme]}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold truncate" style={{ color: N.espresso }}>{book.title}</h4>
          <p className="text-xs flex items-center gap-1 mt-1" style={{ color: N.stone }}>
            <Clock className="w-3 h-3" />
            {new Date(book.updatedAt).toLocaleDateString('vi-VN')}
          </p>
          <p className="text-xs mt-0.5" style={{ color: N.stone }}>
            {book.pages.length} trang  {themeLabels[book.theme]}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit}
            className="p-2.5 rounded-xl transition-colors"
            style={{ background: N.sandLight, color: N.espresso }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = N.sand)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = N.sandLight)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete}
            className="p-2.5 rounded-xl transition-colors"
            style={{ background: '#F2E8E8', color: '#9B4444' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#EDD8D8')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#F2E8E8')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1 group"
      style={{ background: '#FAFAF8', border: `1.5px solid ${N.sand}`, boxShadow: `0 2px 8px rgba(60,46,40,0.07)` }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(60,46,40,0.14)`)}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px rgba(60,46,40,0.07)`)}
    >
      <div
        className="relative h-48 flex items-center justify-center text-6xl overflow-hidden"
        style={{ background: bgMap[book.theme] ?? N.cream }}
      >
        <span className="group-hover:scale-110 transition-transform duration-300">{themeIcons[book.theme]}</span>
      </div>
      <div className="p-4">
        <h4 className="font-bold mb-1 truncate" style={{ color: N.espresso }}>{book.title}</h4>
        <p className="text-xs flex items-center gap-1 mb-0.5" style={{ color: N.stone }}>
          <Clock className="w-3 h-3" />
          {new Date(book.updatedAt).toLocaleDateString('vi-VN')}
        </p>
        <p className="text-xs mb-4" style={{ color: N.stone }}>{book.pages.length} trang</p>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 py-2 px-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
            style={{ background: N.espresso, color: N.sandLight }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = N.ink)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = N.espresso)}
          >
            <Edit className="w-3.5 h-3.5" /> Chnh sa
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-xl transition-colors"
            style={{ background: '#F2E8E8', color: '#9B4444' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#EDD8D8')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#F2E8E8')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
