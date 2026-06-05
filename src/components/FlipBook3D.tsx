import { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface Page {
  id: number;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

interface FlipBook3DProps {
  autoFlipInterval?: number; // milliseconds
  theme?: 'love' | 'family' | 'birthday' | 'friendship';
}

export function FlipBook3D({ autoFlipInterval = 3500, theme = 'love' }: FlipBook3DProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [leftPageFlipping, setLeftPageFlipping] = useState(false);

  const lovePages: Page[] = [
    {
      id: 0,
      leftContent: (
        <div 
          className="h-full relative p-6 flex flex-col justify-center items-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1743407849750-d7d18f4b8380?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjByb3NlcyUyMGJvdXF1ZXQlMjByb21hbnRpY3xlbnwxfHx8fDE3NzIyNDkwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/60 via-pink-500/50 to-red-500/60"></div>
          <div className="relative space-y-6 text-center">
            <Heart className="w-20 h-20 text-white mx-auto drop-shadow-lg animate-pulse" />
            <h2 className="font-handwriting text-6xl text-white drop-shadow-xl">Our Love Story</h2>
            <p className="text-white text-lg italic drop-shadow-md">Nhng k nim p nht</p>
          </div>
        </div>
      ),
      rightContent: (
        <div className="h-full bg-white p-6">
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-center space-y-3">
                <h3 className="font-handwriting text-4xl text-rose-600">Dear My Love,</h3>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "Trong tt c nhng khonh khc ca cuc i, nhng khonh khc bn em l qu gi nht..."
                </p>
              </div>
              <div className="mt-6 space-y-3 text-sm text-gray-700">
                <p> Ln u gp em, anh bit ngay  l nh mnh</p>
                <p> Mi ngy bn em u l mn qu</p>
                <p> Em l l do anh mm ci mi sng thc dy</p>
              </div>
            </div>
            <div className="flex justify-end items-center gap-2">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span className="text-xs text-gray-400">Page 1</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      leftContent: (
        <div className="h-full bg-gradient-to-br from-pink-50 to-rose-50 p-4">
          <div className="h-full flex flex-col justify-between">
            <div>
              <h3 className="font-handwriting text-3xl text-rose-700 mb-4 text-center">Khonh khc u tin</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-md transform -rotate-2 bg-white p-2">
                  <img 
                    src="https://images.unsplash.com/photo-1604881990409-b9f246db39da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBjb2ZmZWUlMjBkYXRlJTIwY2FmZSUyMHJvbWFudGljfGVufDF8fHx8MTc3MjI0OTMxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    className="w-full h-full object-cover rounded"
                    alt="Coffee date"
                  />
                  <p className="font-handwriting text-xs text-gray-600 mt-1 text-center">Coffee date </p>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-md transform rotate-3 bg-white p-2">
                  <img 
                    src="https://images.unsplash.com/photo-1514846528774-8de9d4a07023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBodWdnaW5nJTIwZW1icmFjZSUyMGxvdmV8ZW58MXx8fHwxNzcyMjQ5MzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    className="w-full h-full object-cover rounded"
                    alt="Hugging"
                  />
                  <p className="font-handwriting text-xs text-gray-600 mt-1 text-center">Warm hug </p>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-md transform rotate-1 bg-white p-2">
                  <img 
                    src="https://images.unsplash.com/photo-1767487196225-ba9b9cb23f1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjB3YWxraW5nJTIwc3RyZWV0JTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzcyMjQ5MzE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    className="w-full h-full object-cover rounded"
                    alt="Walking together"
                  />
                  <p className="font-handwriting text-xs text-gray-600 mt-1 text-center">City walk </p>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-md transform -rotate-3 bg-white p-2">
                  <img 
                    src="https://images.unsplash.com/photo-1544250224-e31adc57a132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBwaWNuaWMlMjBwYXJrJTIwaGFwcHl8ZW58MXx8fHwxNzcyMjQ5MzE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    className="w-full h-full object-cover rounded"
                    alt="Picnic"
                  />
                  <p className="font-handwriting text-xs text-gray-600 mt-1 text-center">Picnic day </p>
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center gap-2">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span className="text-xs text-gray-400">Page 2</span>
            </div>
          </div>
        </div>
      ),
      rightContent: (
        <div className="h-full bg-white p-6">
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-handwriting text-3xl text-purple-700 text-center">Nhng iu anh yu  em</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-rose-500 text-lg"></span>
                  <p>N ci ti nh hoa ca em mi sng</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-500 text-lg"></span>
                  <p>Cch em quan tm anh tng li tng t</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-lg"></span>
                  <p>Ging ni ngt ngo khi gi tn anh</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-500 text-lg"></span>
                  <p>S du dng v kin nhn ca em</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-500 text-lg"></span>
                  <p>Tt c mi th  em u hon ho</p>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="font-handwriting text-2xl text-rose-600">I love everything about you </p>
              </div>
            </div>
            <div className="flex justify-end items-center gap-2">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span className="text-xs text-gray-400">Page 3</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      leftContent: (
        <div className="h-full bg-gradient-to-br from-amber-50 to-orange-50 p-6">
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-handwriting text-3xl text-amber-700 text-center">Our Adventures</h3>
              <div className="space-y-2">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1629401681628-a37c83eb57d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjB0cmF2ZWwlMjBhZHZlbnR1cmUlMjB0b2dldGhlcnxlbnwxfHx8fDE3NzIyNDkzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    className="w-full h-full object-cover"
                    alt="Travel together"
                  />
                </div>
                <p className="font-handwriting text-sm text-gray-600 text-center italic">
                  "Mi chuyn i l mt k nim p..."
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded p-2 shadow-sm">
                    <p className="text-xs text-gray-600"> Beach trip</p>
                  </div>
                  <div className="bg-white rounded p-2 shadow-sm">
                    <p className="text-xs text-gray-600"> Mountain hike</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center gap-2">
              <Heart className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-gray-400">Page 4</span>
            </div>
          </div>
        </div>
      ),
      rightContent: (
        <div 
          className="h-full relative p-6"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1728887042214-55ec07872893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxvd2VycyUyMHBldGFscyUyMHJvbWFudGljfGVufDF8fHx8MTc3MjI0OTMyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
          <div className="h-full flex flex-col justify-between relative z-10">
            <div className="space-y-4">
              <h3 className="font-handwriting text-3xl text-pink-700 text-center">Special Dates</h3>
              <div className="space-y-3">
                <div className="bg-white/90 rounded-lg p-3 shadow-md border-l-4 border-rose-400">
                  <p className="font-handwriting text-lg text-rose-700">Ba ti lng mn u tin</p>
                  <p className="text-xs text-gray-500 mt-1">Nn lung linh, nh mt ngt ngo...</p>
                </div>
                <div className="bg-white/90 rounded-lg p-3 shadow-md border-l-4 border-pink-400">
                  <p className="font-handwriting text-lg text-pink-700">Ngy Valentine</p>
                  <p className="text-xs text-gray-500 mt-1">Hoa hng & chocolates</p>
                </div>
                <div className="bg-white/90 rounded-lg p-3 shadow-md border-l-4 border-purple-400">
                  <p className="font-handwriting text-lg text-purple-700">K nim 1 nm yu</p>
                  <p className="text-xs text-gray-500 mt-1">365 ngy hnh phc...</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center gap-2">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span className="text-xs text-gray-400">Page 5</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      leftContent: (
        <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-md bg-white p-1">
                      <img 
                        src="https://images.unsplash.com/photo-1621797005674-48e0150206da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBzdW5zZXQlMjBiZWFjaCUyMHJvbWFudGljfGVufDF8fHx8MTc3MjI0OTAwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        className="w-full h-full object-cover rounded"
                        alt="Sunset"
                      />
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-md bg-white p-1">
                      <img 
                        src="https://images.unsplash.com/photo-1764773965933-2bbf21366592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjB3aW50ZXIlMjBzbm93JTIwY296eXxlbnwxfHx8fDE3NzIyNDkzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        className="w-full h-full object-cover rounded"
                        alt="Winter love"
                      />
                    </div>
                  </div>
                  <p className="font-handwriting text-2xl text-indigo-700">Every Season with You</p>
                  <p className="text-xs text-gray-500 italic mt-2">Mi ma u p khi c em</p>
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center gap-2">
              <Heart className="w-3 h-3 text-blue-400 fill-blue-400" />
              <span className="text-xs text-gray-400">Page 6</span>
            </div>
          </div>
        </div>
      ),
      rightContent: (
        <div className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-handwriting text-4xl text-indigo-700 text-center">Thank You</h3>
              <div className="space-y-3 text-sm text-gray-700 text-center">
                <p className="italic">Cm n em  n bn anh</p>
                <p className="italic">Cm n em  cho anh bit yu thng l g</p>
                <p className="italic">Cm n em  lm cuc i anh c  ngha</p>
                <div className="my-6 flex justify-center gap-2 text-3xl">
                      
                </div>
                <p className="font-handwriting text-3xl text-rose-600 mt-4">
                  I Love You So Much
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  With all my heart, forever and always 
                </p>
              </div>
            </div>
            <div className="flex justify-end items-center gap-2">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span className="text-xs text-gray-400">Page 7</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const pages = lovePages;

  useEffect(() => {
    const interval = setInterval(() => {
      // Start flipping right page first
      setIsFlipping(true);
      
      // After right page starts flipping, flip left page with delay
      setTimeout(() => {
        setLeftPageFlipping(true);
      }, 200); // 200ms delay for staggered effect
      
      // Change page content
      setTimeout(() => {
        setCurrentPage((prev) => (prev + 1) % pages.length);
        setIsFlipping(false);
        setLeftPageFlipping(false);
      }, 800);
    }, autoFlipInterval);

    return () => clearInterval(interval);
  }, [autoFlipInterval, pages.length]);

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
      {/* Book Container */}
      <div className="relative w-full max-w-4xl aspect-[16/10]">
        {/* Shadow */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-black/20 blur-xl transform translate-y-full"></div>

        {/* Book */}
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {/* Left Page (with delayed flip) */}
          <div
            className="absolute left-0 top-0 w-1/2 h-full"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'right center',
              transform: leftPageFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.7s cubic-bezier(0.645, 0.045, 0.355, 1.000)',
              zIndex: leftPageFlipping ? 5 : 1,
            }}
          >
            {/* Front of left page */}
            <div
              className="absolute inset-0 bg-white rounded-l-lg shadow-2xl overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              {pages[currentPage].leftContent}
              {/* Page edge shadow */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-r from-transparent to-black/10"></div>
            </div>

            {/* Back of left page (next page right side) */}
            <div
              className="absolute inset-0 bg-white shadow-2xl overflow-hidden rounded-r-lg"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(-180deg)',
              }}
            >
              {pages[(currentPage + 1) % pages.length].rightContent}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-l from-transparent to-black/10"></div>
            </div>
          </div>

          {/* Right Page (Flipping) */}
          <div
            className="absolute left-1/2 top-0 w-1/2 h-full"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center',
              transform: isFlipping ? 'rotateY(-180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000)',
              zIndex: isFlipping ? 10 : 2,
            }}
          >
            {/* Front of flipping page */}
            <div
              className="absolute inset-0 bg-white rounded-r-lg shadow-2xl overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              {pages[currentPage].rightContent}
              {/* Page edge shadow */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-l from-transparent to-black/10"></div>
            </div>

            {/* Back of flipping page (next page left side) */}
            <div
              className="absolute inset-0 bg-white shadow-2xl overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {pages[(currentPage + 1) % pages.length].leftContent}
            </div>
          </div>

          {/* Book Spine */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 -translate-x-1/2 shadow-lg"
            style={{
              transformStyle: 'preserve-3d',
              zIndex: 20,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20"></div>
          </div>

          {/* Page Curl Effect on Right */}
          {isFlipping && (
            <div
              className="absolute left-1/2 top-0 w-1/2 h-full pointer-events-none"
              style={{
                background: 'linear-gradient(to left, rgba(0,0,0,0.15), transparent)',
                transformOrigin: 'left center',
                transform: 'rotateY(-90deg)',
                transition: 'transform 0.4s ease-out',
                zIndex: 11,
              }}
            ></div>
          )}
          
          {/* Page Curl Effect on Left (delayed) */}
          {leftPageFlipping && (
            <div
              className="absolute right-1/2 top-0 w-1/2 h-full pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)',
                transformOrigin: 'right center',
                transform: 'rotateY(90deg)',
                transition: 'transform 0.35s ease-out',
                zIndex: 6,
              }}
            ></div>
          )}
        </div>
      </div>

      {/* Page Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
        Page {currentPage * 2 + 1}-{currentPage * 2 + 2} of {pages.length * 2}
      </div>
    </div>
  );
}