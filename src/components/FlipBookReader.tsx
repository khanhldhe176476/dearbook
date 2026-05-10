import { useState, useRef, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  Home, Share2, Printer, Download, Bookmark, Menu,
  Maximize2, Music, Volume2, VolumeX, Box
} from 'lucide-react';
import { BookData, PageData, BookPage, PageElement } from '../App';
import { templates } from '../data/templates';
import { getRandomThemeMusicWithInfo, THEME_MUSIC } from '../data/backgroundMusic';
import { AudioGenerator } from '../utils/audioGenerator';

interface FlipBookReaderProps {
  book: BookData;
  onClose: () => void;
}

export function FlipBookReader({ book, onClose }: FlipBookReaderProps) {
  // Debug: Log book theme
  console.log('📖 FlipBookReader opened with book:', { id: book.id, title: book.title, theme: book.theme });
  
  const [currentSpread, setCurrentSpread] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Music states
  const [isPlaying, setIsPlaying] = useState(false); // Start as false, set to true when playing
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showMusicTooltip, setShowMusicTooltip] = useState(false);
  const [showMusicNotification, setShowMusicNotification] = useState(false);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioGeneratorRef = useRef<AudioGenerator | null>(null);
  
  // Page curl states
  const [isCurling, setIsCurling] = useState(false);
  const [curlAmount, setCurlAmount] = useState(0);
  const [curlPosition, setCurlPosition] = useState({ x: 0, y: 0 });
  const [curlSide, setCurlSide] = useState<'left' | 'right' | null>(null);
  const [isHovering, setIsHovering] = useState<'left' | 'right' | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // Current mouse position
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Drag start position
  
  const containerRef = useRef<HTMLDivElement>(null);
  const curlStartPos = useRef({ x: 0, y: 0 });
  const pageRef = useRef<HTMLDivElement>(null);

  // Initialize audio with random theme music and auto-play
  useEffect(() => {
    // Get random music with info
    const { music, index } = getRandomThemeMusicWithInfo(book.theme);
    setCurrentMusicIndex(index);
    
    console.log('🎵 Initializing ambient music for theme:', book.theme);
    
    setIsAudioLoading(true);
    
    // Create audio generator
    const generator = new AudioGenerator();
    audioGeneratorRef.current = generator;

    // Start playing ambient music
    const startMusic = async () => {
      try {
        await generator.start({ theme: book.theme as any });
        setIsPlaying(true);
        setIsAudioLoading(false);
        
        console.log('✅ Ambient music started for theme:', book.theme);
        
        // Show music notification
        setShowMusicNotification(true);
        setTimeout(() => {
          setShowMusicNotification(false);
        }, 3000);
      } catch (error) {
        console.log('⏸️ Auto-play prevented by browser. User can click play button.');
        setIsPlaying(false);
        setIsAudioLoading(false);
      }
    };

    // Start playing after a short delay
    const playTimer = setTimeout(() => {
      startMusic();
    }, 300);

    return () => {
      clearTimeout(playTimer);
      if (audioGeneratorRef.current) {
        audioGeneratorRef.current.destroy();
        audioGeneratorRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [book.theme]);

  // Handle play/pause
  const togglePlay = () => {
    if (!audioGeneratorRef.current) {
      console.warn('⚠️ Audio generator not available');
      return;
    }

    if (isPlaying) {
      console.log('⏸️ Pausing music');
      audioGeneratorRef.current.pause();
      setIsPlaying(false);
    } else {
      console.log('▶️ Playing music');
      audioGeneratorRef.current.resume();
      setIsPlaying(true);
    }
  };

  // Handle mute
  const toggleMute = () => {
    if (!audioGeneratorRef.current) return;
    
    const newMuted = !isMuted;
    if (newMuted) {
      audioGeneratorRef.current.setVolume(0);
    } else {
      audioGeneratorRef.current.setVolume(volume);
    }
    setIsMuted(newMuted);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioGeneratorRef.current) {
      audioGeneratorRef.current.setVolume(newVolume);
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Convert PageData to renderable format with elements
  const convertPageToRender = (pageData: PageData): BookPage => {
    // Find the template
    const template = templates.find(t => t.id === book.templateId);
    const templatePage = template?.pages.find(p => p.id === pageData.templatePageId);
    
    if (!templatePage) {
      // Fallback: create basic page with user content
      const fallbackElements: PageElement[] = [];
      
      // Add texts if any
      const textEntries = Object.entries(pageData.texts || {});
      textEntries.forEach(([key, value], index) => {
        if (value && typeof value === 'string') {
          fallbackElements.push({
            id: `fallback-text-${key}`,
            type: 'text',
            content: value,
            x: 80,
            y: 100 + (index * 150),
            width: 340,
            height: 120,
            fontSize: 18,
            fontFamily: 'Poppins',
            color: '#1f2937',
            fontWeight: 'normal',
            textAlign: 'left',
            lineHeight: 1.6
          });
        }
      });
      
      // Add images if any
      const imageEntries = Object.entries(pageData.images || {});
      imageEntries.forEach(([key, value], index) => {
        if (value && typeof value === 'string') {
          fallbackElements.push({
            id: `fallback-image-${key}`,
            type: 'image',
            src: value,
            x: 100,
            y: 100 + (index * 300),
            width: 300,
            height: 250,
            objectFit: 'cover',
            borderRadius: 12
          });
        }
      });
      
      return {
        id: pageData.id,
        backgroundColor: '#ffffff',
        elements: fallbackElements
      };
    }

    // Clone template elements and replace with user data
    const elements: PageElement[] = templatePage.elements.map(el => {
      const clonedEl = { ...el };
      
      if (el.type === 'text') {
        // Extract field key from element id (e.g., "text-title-1" -> "title")
        const match = el.id.match(/text-(\w+)-/);
        const fieldKey = match ? match[1] : '';
        
        // Replace with user text
        if (fieldKey && pageData.texts[fieldKey]) {
          clonedEl.content = pageData.texts[fieldKey];
        }
      } else if (el.type === 'image') {
        // Extract field key from element id (e.g., "image-photo-1" -> "photo")
        const match = el.id.match(/image-(\w+)-/);
        const fieldKey = match ? match[1] : '';
        
        // Replace with user image
        if (fieldKey && pageData.images[fieldKey]) {
          clonedEl.src = pageData.images[fieldKey];
        }
      }
      
      return clonedEl as PageElement;
    });

    return {
      id: pageData.id,
      backgroundColor: templatePage.backgroundColor,
      backgroundImage: templatePage.backgroundImage,
      elements
    };
  };

  const bookPages = book.pages || [];
  const totalPages = bookPages.length;
  // Front cover (1 spread) + content pages + back cover (1 spread)
  const totalSpreads = 1 + Math.ceil(totalPages / 2);

  // Check if pages are already in BookPage format (template books) or PageData format
  const isBookPageFormat = (page: any): page is BookPage => {
    return page && 'elements' in page && Array.isArray(page.elements);
  };

  // Get current spread pages
  const getSpreadPages = () => {
    // Front cover (spread 0) - single page
    if (currentSpread === 0) {
      // Cover page - use book.cover if available, otherwise create default
      if (book.cover) {
        return {
          left: null,
          right: book.cover,
          isSinglePage: true
        };
      }
      
      // Choose cover image based on theme
      const coverImages = {
        love: 'https://images.unsplash.com/photo-1620455970942-5fca5840d5ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmUlMjBzdW5zZXR8ZW58MXx8fHwxNzY5NjEzNDc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        family: 'https://images.unsplash.com/photo-1624448445915-97154f5e688c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMHBvcnRyYWl0JTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzY5Njc1MTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        birthday: 'https://images.unsplash.com/photo-1768767297804-7433e9765001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNlbGVicmF0aW9uJTIwY2FrZSUyMGJhbGxvb25zfGVufDF8fHx8MTc2OTY3NTE3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        friendship: 'https://images.unsplash.com/photo-1764751024389-857d08396423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwbGF1Z2hpbmclMjB0b2dldGhlciUyMGhhcHB5fGVufDF8fHx8MTc2OTY3NTE3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      };
      
      const decorImages = {
        love: 'https://images.unsplash.com/photo-1765444122637-c4e2d3ec3f1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwZmxvd2VycyUyMHBpbmslMjByb21hbnRpY3xlbnwxfHx8fDE3Njk2NzUxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        family: 'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmxvcmFsJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3Njk2NzUxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        birthday: 'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmxvcmFsJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3Njk2NzUxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        friendship: 'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmxvcmFsJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3Njk2NzUxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      };
      
      const themeKey = (book.theme || 'love') as keyof typeof coverImages;
      
      const coverPage: BookPage & { theme?: string } = {
        id: 'cover',
        theme: book.theme, // Pass theme for gradient
        backgroundColor: book.theme === 'love' ? '#FFE4E1' : 
                        book.theme === 'family' ? '#E0F2FE' :
                        book.theme === 'birthday' ? '#F3E8FF' : '#FEF3C7',
        elements: [
          // Main background image - full cover with overlay
          {
            id: 'cover-bg-image',
            type: 'image',
            src: coverImages[themeKey],
            x: 0,
            y: 0,
            width: 400,
            height: 600,
            objectFit: 'cover',
            opacity: 1,
            zIndex: 0
          },
          // Dark overlay for better text visibility
          {
            id: 'cover-overlay',
            type: 'shape',
            fill: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
            x: 0,
            y: 0,
            width: 400,
            height: 600,
            zIndex: 1
          },
          // Decorative accent image (small corner decoration)
          {
            id: 'cover-decor',
            type: 'image',
            src: decorImages[themeKey],
            x: 256,
            y: 24,
            width: 120,
            height: 120,
            objectFit: 'cover',
            borderRadius: 60,
            opacity: 0.7,
            zIndex: 2
          },
          // White frame around decor
          {
            id: 'cover-decor-frame',
            type: 'shape',
            fill: 'transparent',
            stroke: 'rgba(255,255,255,0.5)',
            strokeWidth: 3,
            x: 256,
            y: 24,
            width: 120,
            height: 120,
            borderRadius: 60,
            zIndex: 3
          },
          // Magazine-style top label
          {
            id: 'cover-label',
            type: 'shape',
            fill: book.theme === 'love' ? 'rgba(255,192,203,0.9)' :
                  book.theme === 'family' ? 'rgba(96,165,250,0.9)' :
                  book.theme === 'birthday' ? 'rgba(196,181,253,0.9)' : 'rgba(252,211,77,0.9)',
            x: 24,
            y: 32,
            width: 128,
            height: 28,
            borderRadius: 16,
            zIndex: 4
          },
          {
            id: 'cover-label-text',
            type: 'text',
            content: book.theme === 'love' ? 'LOVE STORY' :
                    book.theme === 'family' ? 'FAMILY' :
                    book.theme === 'birthday' ? 'CELEBRATION' : 'FRIENDSHIP',
            x: 24,
            y: 38,
            width: 128,
            height: 28,
            fontFamily: 'Poppins',
            fontSize: 13,
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            letterSpacing: 2,
            zIndex: 5
          },
          // Main title with magazine styling
          {
            id: 'cover-title',
            type: 'text',
            content: book.title || 'Cuốn sách của tôi',
            x: 24,
            y: 320,
            width: 352,
            height: 120,
            fontFamily: 'Dancing Script',
            fontSize: 45,
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            rotation: 0,
            opacity: 1,
            zIndex: 6,
            lineHeight: 1.2
          },
          // Subtitle with icon
          {
            id: 'cover-subtitle',
            type: 'text',
            content: book.theme === 'love' ? '💕 Yêu thương & Gắn kết' :
                    book.theme === 'family' ? '👨‍👩‍👧 Gia đình yêu thương' :
                    book.theme === 'birthday' ? '🎂 Chúc mừng sinh nhật' : '🤝 Tình bạn mãi mãi',
            x: 24,
            y: 460,
            width: 352,
            height: 32,
            fontFamily: 'Poppins',
            fontSize: 18,
            color: '#ffffff',
            textAlign: 'center',
            rotation: 0,
            opacity: 0.95,
            zIndex: 6
          },
          // Bottom brand strip
          {
            id: 'cover-brand-strip',
            type: 'shape',
            fill: 'rgba(255,255,255,0.15)',
            x: 0,
            y: 552,
            width: 400,
            height: 48,
            zIndex: 7
          },
          {
            id: 'cover-brand',
            type: 'text',
            content: 'DearBook',
            x: 24,
            y: 560,
            width: 160,
            height: 32,
            fontFamily: 'Dancing Script',
            fontSize: 21,
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'left',
            zIndex: 8
          },
          {
            id: 'cover-date',
            type: 'text',
            content: new Date().getFullYear().toString(),
            x: 280,
            y: 564,
            width: 96,
            height: 24,
            fontFamily: 'Poppins',
            fontSize: 13,
            color: '#ffffff',
            textAlign: 'right',
            opacity: 0.8,
            zIndex: 8
          }
        ]
      };
      
      return {
        left: coverPage,
        right: null,
        isSinglePage: true
      };
    }
    
    // Back cover (last spread) - single page
    if (currentSpread === totalSpreads) {
      // Back cover images
      const backCoverImages = {
        love: 'https://images.unsplash.com/photo-1765444122637-c4e2d3ec3f1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwZmxvd2VycyUyMHBpbmslMjByb21hbnRpY3xlbnwxfHx8fDE3Njk2NzUxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        family: 'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmxvcmFsJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3Njk2NzUxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        birthday: 'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmxvcmFsJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3Njk2NzUxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        friendship: 'https://images.unsplash.com/photo-1763696790396-faf8ddc25725?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmxvcmFsJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3Njk2NzUxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      };
      
      const themeKey = (book.theme || 'love') as keyof typeof backCoverImages;
      
      const backCoverPage: BookPage & { theme?: string } = {
        id: 'back-cover',
        theme: book.theme,
        backgroundColor: book.theme === 'love' ? '#FFE4E1' : 
                        book.theme === 'family' ? '#E0F2FE' :
                        book.theme === 'birthday' ? '#F3E8FF' : '#FEF3C7',
        elements: [
          // Soft background image
          {
            id: 'back-bg-image',
            type: 'image',
            src: backCoverImages[themeKey],
            x: 0,
            y: 0,
            width: 400,
            height: 600,
            objectFit: 'cover',
            opacity: 0.35,
            zIndex: 0
          },
          // Gradient overlay
          {
            id: 'back-overlay',
            type: 'shape',
            fill: book.theme === 'love' ? 'linear-gradient(135deg, rgba(255,182,193,0.85) 0%, rgba(255,105,180,0.85) 100%)' :
                  book.theme === 'family' ? 'linear-gradient(135deg, rgba(147,197,253,0.85) 0%, rgba(59,130,246,0.85) 100%)' :
                  book.theme === 'birthday' ? 'linear-gradient(135deg, rgba(216,180,254,0.85) 0%, rgba(168,85,247,0.85) 100%)' :
                  'linear-gradient(135deg, rgba(253,224,71,0.85) 0%, rgba(251,191,36,0.85) 100%)',
            x: 0,
            y: 0,
            width: 400,
            height: 600,
            zIndex: 1
          },
          // Decorative circles
          {
            id: 'back-circle-1',
            type: 'shape',
            fill: 'rgba(255,255,255,0.1)',
            x: 0,
            y: 0,
            width: 160,
            height: 160,
            borderRadius: 80,
            zIndex: 2
          },
          {
            id: 'back-circle-2',
            type: 'shape',
            fill: 'rgba(255,255,255,0.08)',
            x: 280,
            y: 500,
            width: 200,
            height: 200,
            borderRadius: 100,
            zIndex: 2
          },
          // Logo/Icon
          {
            id: 'back-logo',
            type: 'text',
            content: '✨',
            x: 160,
            y: 96,
            width: 80,
            height: 80,
            fontSize: 58,
            fontFamily: 'Arial',
            color: '#ffffff',
            textAlign: 'center',
            opacity: 1,
            zIndex: 3
          },
          // Brand name
          {
            id: 'back-brand',
            type: 'text',
            content: 'DearBook',
            x: 64,
            y: 192,
            width: 272,
            height: 64,
            fontSize: 42,
            fontFamily: 'Dancing Script',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center',
            opacity: 1,
            zIndex: 3
          },
          // Tagline
          {
            id: 'back-tagline',
            type: 'text',
            content: 'Thiết kế sách cá nhân hóa',
            x: 64,
            y: 264,
            width: 272,
            height: 40,
            fontSize: 16,
            fontFamily: 'Poppins',
            color: '#ffffff',
            textAlign: 'center',
            opacity: 0.95,
            zIndex: 3,
            letterSpacing: 1
          },
          // Decorative divider
          {
            id: 'back-divider',
            type: 'shape',
            fill: 'rgba(255, 255, 255, 0.4)',
            x: 144,
            y: 328,
            width: 112,
            height: 2,
            borderRadius: 2,
            zIndex: 3
          },
          // Theme quote
          {
            id: 'back-quote',
            type: 'text',
            content: book.theme === 'love' ? '"Tình yêu là điều đẹp đẽ nhất\ntrong cuộc sống"' :
                    book.theme === 'family' ? '"Gia đình là nơi\ntình yêu bắt đầu"' :
                    book.theme === 'birthday' ? '"Mỗi khoảnh khắc\nđều đáng trân trọng"' : 
                    '"Tình bạn là món quà\nvô giá của cuộc đời"',
            x: 48,
            y: 360,
            width: 304,
            height: 80,
            fontSize: 18,
            fontFamily: 'Cormorant',
            color: '#ffffff',
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 1.6,
            opacity: 0.95,
            zIndex: 3
          },
          // Footer text
          {
            id: 'back-footer',
            type: 'text',
            content: 'Made with love ❤️',
            x: 64,
            y: 496,
            width: 272,
            height: 32,
            fontSize: 12,
            fontFamily: 'Poppins',
            color: '#ffffff',
            textAlign: 'center',
            opacity: 0.85,
            zIndex: 3
          }
        ]
      };
      
      return {
        left: null,
        right: backCoverPage,
        isSinglePage: true
      };
    }
    
    // Content pages
    const leftIndex = (currentSpread - 1) * 2;
    const rightIndex = leftIndex + 1;
    
    // Check if pages are already in BookPage format or need conversion
    const leftPage = bookPages[leftIndex];
    const rightPage = bookPages[rightIndex];
    
    return {
      left: leftPage ? (isBookPageFormat(leftPage) ? leftPage : convertPageToRender(leftPage)) : null,
      right: rightPage ? (isBookPageFormat(rightPage) ? rightPage : convertPageToRender(rightPage)) : null
    };
  };

  const spreadData = getSpreadPages();
  const { left, right, isSinglePage } = spreadData as { left: BookPage | null; right: BookPage | null; isSinglePage?: boolean };

  // Check if near corner for curl
  const isNearCorner = (x: number, y: number, side: 'left' | 'right', rect: DOMRect): boolean => {
    const cornerSize = 150;
    const localX = x - rect.left;
    const localY = y - rect.top;
    
    if (side === 'right') {
      return localX > rect.width - cornerSize && localY > rect.height - cornerSize;
    } else {
      return localX < cornerSize && localY > rect.height - cornerSize;
    }
  };

  const handleMouseDown = (e: React.MouseEvent, side: 'left' | 'right') => {
    if (!pageRef.current) return;
    
    const rect = pageRef.current.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (isNearCorner(x, y, side, rect)) {
      e.stopPropagation();
      setIsCurling(true);
      setCurlSide(side);
      setCurlAmount(0);
      
      // Store both drag start and current mouse position
      const localX = x - rect.left;
      const localY = y - rect.top;
      setDragStart({ x: localX, y: localY });
      setMousePos({ x: localX, y: localY });
      
      curlStartPos.current = { x, y };
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update hover state
    if (!isCurling && pageRef.current) {
      const rect = pageRef.current.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      // Front cover (spread 0) only allows right hover (to next page)
      // Other spreads allow left hover if > 0, right hover if < totalSpreads
      if (currentSpread === 0) {
        // Front cover: only right hover
        if (isNearCorner(x, y, 'right', rect)) {
          setIsHovering('right');
        } else {
          setIsHovering(null);
        }
      } else {
        if (currentSpread > 0 && isNearCorner(x, y, 'left', rect)) {
          setIsHovering('left');
        } else if (currentSpread < totalSpreads && isNearCorner(x, y, 'right', rect)) {
          setIsHovering('right');
        } else {
          setIsHovering(null);
        }
      }
    }
    
    if (!isCurling || !pageRef.current) return;
    
    const rect = pageRef.current.getBoundingClientRect();
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    // Update mouse position relative to page container
    let localX = currentX - rect.left;
    let localY = currentY - rect.top;
    
    setMousePos({ x: localX, y: localY });
    
    setCurlPosition({ x: currentX, y: currentY });
    
    // Calculate curl amount based on drag distance and direction
    const startX = curlStartPos.current.x;
    const startY = curlStartPos.current.y;
    const deltaX = curlSide === 'right' ? startX - currentX : currentX - startX;
    const deltaY = startY - currentY;
    
    // Calculate distance from starting corner
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Increase sensitivity for smoother curl
    const maxDistance = 500;
    let amount = Math.max(0, Math.min(1, distance / maxDistance));
    
    // Apply easing for more natural feel
    amount = amount * amount * (3 - 2 * amount); // Smoothstep
    
    setCurlAmount(amount);
  };

  const handleMouseUp = () => {
    if (!isCurling) return;
    
    document.body.style.cursor = '';
    
    if (curlAmount > 0.45) {
      // Complete flip with smooth animation
      setIsFlipping(true);
      
      // Animate curl to 1 - faster for smoother feel
      let start = curlAmount;
      const duration = 450; // Reduced from 700ms to 450ms
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic (smoother than quart)
        
        setCurlAmount(start + (1 - start) * eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          if (curlSide === 'right' && currentSpread < totalSpreads) {
            setCurrentSpread(prev => prev + 1);
          } else if (curlSide === 'left' && currentSpread > 0) {
            setCurrentSpread(prev => prev - 1);
          }
          setIsFlipping(false);
          setIsCurling(false);
          setCurlAmount(0);
          setCurlSide(null);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      // Snap back with smooth bounce
      const start = curlAmount;
      const duration = 350; // Reduced from 500ms to 350ms
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 2); // Ease out quad (faster, smoother)
        
        setCurlAmount(start * (1 - eased));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsCurling(false);
          setCurlAmount(0);
          setCurlSide(null);
        }
      };
      
      requestAnimationFrame(animate);
    }
  };

  const handleNext = () => {
    if (currentSpread < totalSpreads && !isFlipping) {
      setIsFlipping(true);
      setCurlSide('right');
      
      // Smooth animation from 0 to 1 - faster duration for smoother feel
      const duration = 500; // Reduced from 800ms to 500ms
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Optimized easing for smoother, more natural page flip
        const eased = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2; // Ease in-out quad (smoother)
        
        setCurlAmount(eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentSpread(prev => prev + 1);
          setIsFlipping(false);
          setCurlAmount(0);
          setCurlSide(null);
        }
      };
      
      requestAnimationFrame(animate);
    }
  };

  const handlePrev = () => {
    if (currentSpread > 0 && !isFlipping) {
      setIsFlipping(true);
      setCurlSide('left');
      
      // Smooth animation from 0 to 1 - faster duration for smoother feel
      const duration = 500; // Reduced from 800ms to 500ms
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Optimized easing for smoother, more natural page flip
        const eased = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2; // Ease in-out quad (smoother)
        
        setCurlAmount(eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentSpread(prev => prev - 1);
          setIsFlipping(false);
          setCurlAmount(0);
          setCurlSide(null);
        }
      };
      
      requestAnimationFrame(animate);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(1.5, prev + 0.1));
  const handleZoomOut = () => setZoom(prev => Math.max(0.7, prev - 0.1));

  // Keyboard navigation for page flipping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys to avoid page scrolling
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }

      // Next page: ArrowRight or ArrowDown
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      }
      
      // Previous page: ArrowLeft or ArrowUp
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSpread, isFlipping, totalSpreads]); // Dependencies to access current state

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 z-50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-20 shadow-sm">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Left - Book Title & Close */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="h-8 w-px bg-gray-200" />
            <h2 className="text-lg font-bold text-gray-900 truncate max-w-md leading-tight" title={book.title || 'Untitled Book'}>
              {book.title || 'Untitled Book'}
            </h2>
          </div>

          {/* Center - Tools */}
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Home">
              <Home className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Share">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Print">
              <Printer className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Download">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Bookmark">
              <Bookmark className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Menu">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-2" />
            
            <button 
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" 
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" 
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Fullscreen">
              <Maximize2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Right - Music & Page Info */}
          <div className="flex items-center gap-3">
            {/* Music Controls */}
            <div 
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all"
              onMouseEnter={() => setShowMusicTooltip(true)}
              onMouseLeave={() => setShowMusicTooltip(false)}
            >
              <button 
                onClick={togglePlay}
                className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center transition-all group"
                title={isAudioLoading ? 'Loading music...' : (isPlaying ? 'Pause Music' : 'Play Music')}
                disabled={isAudioLoading}
              >
                {isAudioLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-4 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                ) : (
                  <Music className="w-4 h-4 text-gray-600 group-hover:text-pink-500 transition-colors" />
                )}
              </button>
              
              <button 
                onClick={toggleMute}
                className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center transition-all"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-gray-600" />
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:hover:scale-125
                  [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-pink-500 [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                }}
              />

              {/* Music Info Tooltip */}
              {showMusicTooltip && (
                <div className="absolute bottom-full right-0 mb-2 px-4 py-2.5 bg-gray-900 text-white text-xs rounded-xl shadow-2xl max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="font-bold text-sm mb-1 leading-tight">
                    {book.theme === 'love' ? '❤️ Romantic Ambient' : 
                     book.theme === 'family' ? '👨‍👩‍👧 Family Warmth' : 
                     book.theme === 'birthday' ? '🎉 Birthday Celebration' : 
                     '🤝 Friendship Cheer'}
                  </div>
                  <div className="text-gray-300 text-[11px] leading-snug">Generative ambient music</div>
                  {/* Arrow */}
                  <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-gray-200" />

            <div className="text-sm text-gray-600 font-medium">
              Trang <span className="font-bold text-gray-900">{currentSpread + 1}</span> / <span className="font-bold text-gray-900">{totalSpreads + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Music Playing Notification */}
      {showMusicNotification && (
        <div className="fixed top-24 right-6 z-30 animate-in slide-in-from-right-5 fade-in duration-300">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-sm border border-white/20 max-w-xs">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <div className="flex gap-0.5">
                <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm leading-tight mb-1">🎵 Nhạc nền đang phát</div>
              <div className="text-xs text-white/95 font-medium truncate leading-tight">Ambient {book.theme === 'love' ? 'Romantic' : book.theme === 'family' ? 'Warmth' : book.theme === 'birthday' ? 'Celebration' : 'Cheerful'} Music</div>
              <div className="text-[10px] text-white/80 mt-0.5">Generative audio</div>
            </div>
          </div>
        </div>
      )}

      {/* Book Container */}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center pt-20 pb-8"
        style={{
          perspective: '3000px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        <div
          className="relative"
          style={{
            transform: `scale(${zoom}) rotateX(5deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s ease-out',
            willChange: 'transform'
          }}
        >
          {/* Book Spread */}
          <div
            ref={pageRef}
            className="relative bg-white rounded-lg overflow-visible"
            style={{
              width: isSinglePage ? '400px' : '800px',
              height: '600px',
              transformStyle: 'preserve-3d',
              boxShadow: `
                0 30px 90px rgba(0,0,0,0.25),
                0 15px 40px rgba(0,0,0,0.15),
                0 5px 15px rgba(0,0,0,0.1),
                inset 0 0 0 1px rgba(255,255,255,0.1)
              `,
              filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.2))',
              willChange: 'transform'
            }}
          >
            {/* Left Page */}
            {left && (() => {
              // Check if this is front cover (special case)
              const isFrontCover = currentSpread === 0;
              
              // Calculate dynamic transform based on mouse position for left page
              let transform = '';
              
              if (isFrontCover && isCurling && curlSide === 'right') {
                // Front cover curls like a right page (curling forward to open)
                const pageWidth = 400;
                const pageHeight = 600;
                
                // Mouse position relative to bottom-right corner (since front cover curls from right)
                const dx = pageWidth - mousePos.x;
                const dy = pageHeight - mousePos.y;
                
                // Calculate curl direction
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const clampedAngle = Math.max(-45, Math.min(45, 135 - angle));
                
                // Calculate 3D transform - positive rotateY to curl forward
                const rotateY = curlAmount * 180;
                const rotateZ = -clampedAngle * curlAmount * 0.3;
                const translateX = curlAmount * 15;
                const translateY = (mousePos.y - dragStart.y) * curlAmount * 0.3;
                const translateZ = curlAmount * 40;
                
                transform = `
                  translateX(${translateX}px) 
                  translateY(${translateY}px) 
                  translateZ(${translateZ}px) 
                  rotateY(${rotateY}deg) 
                  rotateZ(${rotateZ}deg)
                `;
              } else if (!isFrontCover && isCurling && curlSide === 'left') {
                // Normal left page curl (curling backward to go to previous page)
                const pageWidth = 400;
                const pageHeight = 600;
                
                // Mouse position relative to bottom-left corner
                const dx = mousePos.x;
                const dy = pageHeight - mousePos.y;
                
                // Calculate curl direction
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const clampedAngle = Math.max(-45, Math.min(45, angle - 45));
                
                // Calculate 3D transform - negative rotateY to curl backward
                const rotateY = -curlAmount * 180;
                const rotateZ = clampedAngle * curlAmount * 0.3;
                const translateX = -curlAmount * 15;
                const translateY = (mousePos.y - dragStart.y) * curlAmount * 0.3;
                const translateZ = curlAmount * 40;
                
                transform = `
                  translateX(${translateX}px) 
                  translateY(${translateY}px) 
                  translateZ(${translateZ}px) 
                  rotateY(${rotateY}deg) 
                  rotateZ(${rotateZ}deg)
                `;
              } else if (isFrontCover && isHovering === 'right') {
                transform = 'rotateY(3deg) translateZ(8px)';
              } else if (!isFrontCover && isHovering === 'left') {
                transform = 'rotateY(-3deg) translateZ(8px)';
              } else {
                transform = 'rotateY(0deg) translateZ(0)';
              }
              
              return (
                <div
                  className="absolute top-0 left-0"
                  style={{
                    width: '400px',
                    height: '600px',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'right bottom', // Always right for left page position
                    transform,
                    transition: isCurling 
                      ? 'none' 
                      : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    willChange: 'transform'
                  }}
                  onMouseDown={(e) => {
                    if (isFrontCover && currentSpread < totalSpreads) {
                      // Front cover curls to the right (next)
                      handleMouseDown(e, 'right');
                    } else if (currentSpread > 0) {
                      // Regular left page curls to the left (previous)
                      handleMouseDown(e, 'left');
                    }
                  }}
                >
                  {/* Front face of page */}
                  <div
                    className="absolute inset-0 bg-white overflow-hidden"
                    style={{
                      borderRadius: '8px 0 0 8px',
                      boxShadow: isCurling && ((isFrontCover && curlSide === 'right') || (!isFrontCover && curlSide === 'left'))
                        ? (isFrontCover 
                            ? `${curlAmount * 20}px ${curlAmount * 5}px ${25 + curlAmount * 25}px rgba(0,0,0,${0.04 + curlAmount * 0.08}), 
                               ${curlAmount * 10}px ${curlAmount * 3}px ${15 + curlAmount * 15}px rgba(0,0,0,${0.02 + curlAmount * 0.05})`
                            : `${-curlAmount * 20}px ${curlAmount * 5}px ${25 + curlAmount * 25}px rgba(0,0,0,${0.04 + curlAmount * 0.08}), 
                               ${-curlAmount * 10}px ${curlAmount * 3}px ${15 + curlAmount * 15}px rgba(0,0,0,${0.02 + curlAmount * 0.05})`)
                        : '2px 0 10px rgba(0,0,0,0.02), 1px 0 3px rgba(0,0,0,0.01)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {/* Ambient occlusion on right edge */}
                    <div 
                      className="absolute inset-y-0 right-0 w-16 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to left, rgba(0,0,0,0.015) 0%, transparent 100%)',
                        opacity: isCurling && ((isFrontCover && curlSide === 'right') || (!isFrontCover && curlSide === 'left')) ? 0 : 0.7,
                        transition: 'opacity 0.2s ease-out',
                        willChange: 'opacity'
                      }}
                    />
                    
                    <PageRenderer page={left} debugMode={debugMode} />
                  </div>
                  
                  {/* Back face of page */}
                  <div
                    className="absolute inset-0 bg-white overflow-hidden"
                    style={{
                      borderRadius: '0 8px 8px 0',
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      boxShadow: '2px 0 15px rgba(0,0,0,0.05), 1px 0 5px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Backside content - mirror or empty */}
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      {/* Empty backside */}
                    </div>
                  </div>
                
                {/* Enhanced Curl indicator */}
                {!isCurling && (isFrontCover ? currentSpread < totalSpreads : currentSpread > 0) && (
                  <div 
                    className={`absolute bottom-0 w-32 h-32 cursor-grab group transition-all ${isFrontCover ? 'right-0' : 'left-0'}`}
                    style={{
                      background: isFrontCover
                        ? (isHovering === 'right'
                            ? 'linear-gradient(225deg, transparent 0%, transparent 50%, rgba(0,0,0,0.04) 100%)'
                            : 'linear-gradient(225deg, transparent 0%, transparent 65%, rgba(0,0,0,0.01) 100%)')
                        : (isHovering === 'left'
                            ? 'linear-gradient(135deg, transparent 0%, transparent 50%, rgba(0,0,0,0.04) 100%)'
                            : 'linear-gradient(135deg, transparent 0%, transparent 65%, rgba(0,0,0,0.01) 100%)'),
                      transition: 'background 0.2s ease-out'
                    }}
                  >
                    <div className={`absolute bottom-6 transition-all duration-200 group-hover:scale-125 ${isFrontCover ? 'right-6' : 'left-6'}`}>
                      {isFrontCover ? (
                        <ChevronRight className="w-6 h-6 text-gray-400 opacity-0 group-hover:opacity-80 transition-all duration-200 drop-shadow-lg" />
                      ) : (
                        <ChevronLeft className="w-6 h-6 text-gray-400 opacity-0 group-hover:opacity-80 transition-all duration-200 drop-shadow-lg" />
                      )}
                    </div>
                    {((isFrontCover && isHovering === 'right') || (!isFrontCover && isHovering === 'left')) && (
                      <div 
                        className={`absolute bottom-0 w-20 h-20 rounded-full bg-white opacity-10 animate-ping ${isFrontCover ? 'right-0' : 'left-0'}`}
                        style={{ animationDuration: '2s' }}
                      />
                    )}
                  </div>
                )}
                </div>
              );
            })()}

            {/* Right Page */}
            {right && (() => {
              // Calculate dynamic transform based on mouse position for right page
              let transform = '';
              
              if (isCurling && curlSide === 'right') {
                // Calculate curl angle based on mouse position
                const pageWidth = 400;
                const pageHeight = 600;
                
                // Adjust mouse position relative to right page
                // For single page (front cover), mousePos is already 0-400
                // For regular spread, mousePos is 0-800, so right page needs offset
                const adjustedMouseX = isSinglePage ? mousePos.x : mousePos.x - 400;
                
                // Mouse position relative to bottom-right corner
                const dx = pageWidth - adjustedMouseX;
                const dy = pageHeight - mousePos.y;
                
                // Calculate curl direction
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const clampedAngle = Math.max(-45, Math.min(45, 135 - angle));
                
                // Calculate 3D transform
                const rotateY = curlAmount * 180;
                const rotateZ = -clampedAngle * curlAmount * 0.3;
                const translateX = curlAmount * 15;
                const translateY = (mousePos.y - dragStart.y) * curlAmount * 0.3;
                const translateZ = curlAmount * 40;
                
                transform = `
                  translateX(${translateX}px) 
                  translateY(${translateY}px) 
                  translateZ(${translateZ}px) 
                  rotateY(${rotateY}deg) 
                  rotateZ(${rotateZ}deg)
                `;
              } else if (isHovering === 'right') {
                transform = 'rotateY(3deg) translateZ(8px)';
              } else {
                transform = 'rotateY(0deg) translateZ(0)';
              }
              
              return (
                <div
                  className="absolute top-0 right-0"
                  style={{
                    width: '400px',
                    height: '600px',
                    transformStyle: 'preserve-3d',
                    transformOrigin: isSinglePage ? 'center bottom' : 'left bottom',
                    transform,
                    transition: isCurling 
                      ? 'none' 
                      : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Faster, smoother easeOutQuad
                    willChange: 'transform'
                  }}
                  onMouseDown={(e) => currentSpread < totalSpreads && handleMouseDown(e, 'right')}
                >
                  {/* Front face of page */}
                  <div
                    className="absolute inset-0 bg-white overflow-hidden"
                    style={{
                      borderRadius: isSinglePage ? '8px' : '0 8px 8px 0',
                      boxShadow: isCurling && curlSide === 'right' 
                        ? `${curlAmount * 20}px ${curlAmount * 5}px ${25 + curlAmount * 25}px rgba(0,0,0,${0.04 + curlAmount * 0.08}), 
                           ${curlAmount * 10}px ${curlAmount * 3}px ${15 + curlAmount * 15}px rgba(0,0,0,${0.02 + curlAmount * 0.05})`
                        : '-2px 0 10px rgba(0,0,0,0.02), -1px 0 3px rgba(0,0,0,0.01)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {/* Ambient occlusion on right edge */}
                    <div 
                      className="absolute inset-y-0 left-0 w-16 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to right, rgba(0,0,0,0.015) 0%, transparent 100%)',
                        opacity: isCurling && curlSide === 'right' ? 0 : 0.7,
                        transition: 'opacity 0.2s ease-out',
                        willChange: 'opacity'
                      }}
                    />
                    
                    <PageRenderer page={right} debugMode={debugMode} />
                  </div>
                  
                  {/* Back face of page */}
                  <div
                    className="absolute inset-0 bg-white overflow-hidden"
                    style={{
                      borderRadius: '8px 0 0 8px',
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      boxShadow: '-2px 0 15px rgba(0,0,0,0.05), -1px 0 5px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Backside content - mirror or empty */}
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      {/* Empty backside */}
                    </div>
                  </div>
                
                {/* Enhanced Curl indicator */}
                {!isCurling && currentSpread < totalSpreads && (
                  <div 
                    className="absolute bottom-0 right-0 w-32 h-32 cursor-grab group transition-all"
                    style={{
                      background: isHovering === 'right'
                        ? 'linear-gradient(225deg, transparent 0%, transparent 50%, rgba(0,0,0,0.04) 100%)'
                        : 'linear-gradient(225deg, transparent 0%, transparent 65%, rgba(0,0,0,0.01) 100%)',
                      transition: 'background 0.2s ease-out'
                    }}
                  >
                    <div className="absolute bottom-6 right-6 transition-all duration-200 group-hover:scale-125">
                      <ChevronRight className="w-6 h-6 text-gray-400 opacity-0 group-hover:opacity-80 transition-all duration-200 drop-shadow-lg" />
                    </div>
                    {isHovering === 'right' && (
                      <div 
                        className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-white opacity-10 animate-ping"
                        style={{ animationDuration: '2s' }}
                      />
                    )}
                  </div>
                )}
                </div>
              );
            })()}

            {/* Center Spine Shadow - Very Subtle */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10 transition-all duration-300"
              style={{
                width: isCurling ? `${4 - curlAmount * 1.5}px` : '4px',
                height: '700px',
                background: 'linear-gradient(to right, rgba(0,0,0,0.04), rgba(0,0,0,0.02), rgba(0,0,0,0.04))',
                filter: `blur(${isCurling ? 1 : 2}px)`,
                opacity: isCurling ? 1 - curlAmount * 0.6 : 0.5
              }}
            />

            {/* Enhanced 3D Curled Page Effect - Follows Mouse */}
            {isCurling && curlSide && curlAmount > 0.05 && (() => {
              const pageWidth = 400;
              const pageHeight = 560;
              
              // Calculate corner position
              let cornerX, cornerY;
              if (curlSide === 'right') {
                cornerX = pageWidth - (pageWidth - mousePos.x) * curlAmount;
                cornerY = pageHeight - (pageHeight - mousePos.y) * curlAmount;
              } else {
                cornerX = mousePos.x * curlAmount;
                cornerY = pageHeight - (pageHeight - mousePos.y) * curlAmount;
              }
              
              // Calculate curl size based on mouse distance from corner
              const distanceFromCorner = Math.sqrt(
                Math.pow(mousePos.x - (curlSide === 'right' ? pageWidth : 0), 2) +
                Math.pow(mousePos.y - pageHeight, 2)
              );
              const curlSize = Math.min(400, 200 + distanceFromCorner * 0.5) * curlAmount;
              
              // Calculate rotation based on mouse direction
              const dx = curlSide === 'right' ? pageWidth - mousePos.x : mousePos.x;
              const dy = pageHeight - mousePos.y;
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              
              return (
                <>
                  {/* Main curl shadow - follows mouse with realistic gradient */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      width: `${curlSize}px`,
                      height: `${curlSize}px`,
                      bottom: `${pageHeight - cornerY}px`,
                      right: curlSide === 'right' ? `${pageWidth - cornerX}px` : 'auto',
                      left: curlSide === 'left' ? `${cornerX - curlSize}px` : 'auto',
                      background: curlSide === 'right'
                        ? `radial-gradient(ellipse at ${curlSize * 0.9}px ${curlSize * 0.85}px, 
                           rgba(255,255,255,1) 0%, 
                           rgba(245,245,245,0.98) 12%, 
                           rgba(230,230,230,0.85) 25%, 
                           rgba(200,200,200,0.65) 40%, 
                           rgba(160,160,160,0.45) 55%,
                           rgba(120,120,120,0.25) 72%,
                           transparent 100%)`
                        : `radial-gradient(ellipse at ${curlSize * 0.1}px ${curlSize * 0.85}px, 
                           rgba(255,255,255,1) 0%, 
                           rgba(245,245,245,0.98) 12%, 
                           rgba(230,230,230,0.85) 25%, 
                           rgba(200,200,200,0.65) 40%, 
                           rgba(160,160,160,0.45) 55%,
                           rgba(120,120,120,0.25) 72%,
                           transparent 100%)`,
                      borderRadius: curlSide === 'right' ? '100% 0 0 0' : '0 100% 0 0',
                      boxShadow: `
                        ${curlSide === 'right' ? '-' : ''}${8 * curlAmount}px ${5 * curlAmount}px ${25 * curlAmount}px rgba(0,0,0,${0.08 * curlAmount}),
                        ${curlSide === 'right' ? '-' : ''}${4 * curlAmount}px ${3 * curlAmount}px ${12 * curlAmount}px rgba(0,0,0,${0.05 * curlAmount})
                      `,
                      transform: `
                        rotate(${curlSide === 'right' ? angle - 45 : 45 - angle}deg)
                        scale(${1 + curlAmount * 0.2})
                      `,
                      transformOrigin: curlSide === 'right' ? 'bottom right' : 'bottom left',
                      opacity: Math.min(curlAmount * 1.4, 1),
                      filter: `blur(${curlAmount * 2}px)`,
                      transition: 'none',
                      zIndex: 15
                    }}
                  />
                  
                  {/* Dynamic curl highlight - brighter edge */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      width: `${curlSize * 0.85}px`,
                      height: `${curlSize * 0.85}px`,
                      bottom: `${pageHeight - cornerY}px`,
                      right: curlSide === 'right' ? `${pageWidth - cornerX}px` : 'auto',
                      left: curlSide === 'left' ? `${cornerX - curlSize * 0.85}px` : 'auto',
                      background: curlSide === 'right'
                        ? `linear-gradient(${230 + angle * 0.25}deg, 
                           rgba(255,255,255,1) 0%, 
                           rgba(255,255,255,0.8) 20%,
                           rgba(255,255,255,0.45) 40%, 
                           transparent 70%)`
                        : `linear-gradient(${130 - angle * 0.25}deg, 
                           rgba(255,255,255,1) 0%, 
                           rgba(255,255,255,0.8) 20%,
                           rgba(255,255,255,0.45) 40%, 
                           transparent 70%)`,
                      borderRadius: curlSide === 'right' ? '100% 0 0 0' : '0 100% 0 0',
                      transform: `
                        rotate(${curlSide === 'right' ? angle - 45 : 45 - angle}deg)
                      `,
                      transformOrigin: curlSide === 'right' ? 'bottom right' : 'bottom left',
                      opacity: curlAmount * 0.85,
                      mixBlendMode: 'screen',
                      transition: 'none',
                      zIndex: 16
                    }}
                  />
                  
                  {/* Page edge fold line - enhanced */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      width: `${curlSize * 1.4}px`,
                      height: '3px',
                      bottom: `${pageHeight - cornerY + 1}px`,
                      right: curlSide === 'right' ? `${pageWidth - cornerX - curlSize * 0.7}px` : 'auto',
                      left: curlSide === 'left' ? `${cornerX - curlSize * 0.7}px` : 'auto',
                      background: `linear-gradient(to ${curlSide === 'right' ? 'left' : 'right'}, 
                        rgba(80,80,80,${0.2 * curlAmount}) 0%,
                        rgba(100,100,100,${0.35 * curlAmount}) 30%, 
                        rgba(120,120,120,${0.4 * curlAmount}) 50%, 
                        rgba(100,100,100,${0.25 * curlAmount}) 70%,
                        transparent 100%)`,
                      transform: `rotate(${curlSide === 'right' ? angle - 45 : 45 - angle}deg)`,
                      transformOrigin: curlSide === 'right' ? 'right center' : 'left center',
                      filter: 'blur(0.5px)',
                      transition: 'none',
                      zIndex: 17
                    }}
                  />
                  
                  {/* Inner shadow on curling page edge */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      width: `${curlSize * 0.6}px`,
                      height: `${curlSize * 0.6}px`,
                      bottom: `${pageHeight - cornerY - 5}px`,
                      right: curlSide === 'right' ? `${pageWidth - cornerX - 10}px` : 'auto',
                      left: curlSide === 'left' ? `${cornerX - curlSize * 0.6 + 10}px` : 'auto',
                      background: curlSide === 'right'
                        ? `radial-gradient(ellipse at bottom right, 
                           rgba(0,0,0,${0.12 * curlAmount}) 0%, 
                           rgba(0,0,0,${0.06 * curlAmount}) 30%,
                           transparent 65%)`
                        : `radial-gradient(ellipse at bottom left, 
                           rgba(0,0,0,${0.12 * curlAmount}) 0%, 
                           rgba(0,0,0,${0.06 * curlAmount}) 30%,
                           transparent 65%)`,
                      borderRadius: curlSide === 'right' ? '0 0 100% 0' : '0 0 0 100%',
                      transform: `rotate(${curlSide === 'right' ? angle - 45 : 45 - angle}deg)`,
                      transformOrigin: curlSide === 'right' ? 'bottom right' : 'bottom left',
                      opacity: curlAmount * 0.9,
                      filter: 'blur(2px)',
                      transition: 'none',
                      zIndex: 14
                    }}
                  />
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        disabled={currentSpread === 0}
        className="fixed left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-xl hover:shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-110 z-10"
        style={{ opacity: currentSpread === 0 ? 0.3 : 1 }}
      >
        <ChevronLeft className="w-7 h-7 text-gray-700" />
      </button>

      <button
        onClick={handleNext}
        disabled={currentSpread >= totalSpreads}
        className="fixed right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-xl hover:shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-110 z-10"
        style={{ opacity: currentSpread >= totalSpreads ? 0.3 : 1 }}
      >
        <ChevronRight className="w-7 h-7 text-gray-700" />
      </button>

      {/* Bottom Progress */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg z-10">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSpreads + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isFlipping) {
                  setIsFlipping(true);
                  setTimeout(() => {
                    setCurrentSpread(i);
                    setIsFlipping(false);
                  }, 300);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSpread 
                  ? 'bg-blue-500 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title={`Spread ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Page Renderer Component
function PageRenderer({ page, debugMode = false }: { page: any; debugMode?: boolean }) {
  if (!page) {
    console.warn('⚠️ PageRenderer: page is null or undefined');
    return null;
  }

  // Debug log for pages without elements
  if (!page.elements || page.elements.length === 0) {
    console.warn('⚠️ PageRenderer: page has no elements', { pageId: page.id, page });
  }

  // Check if this is the cover page
  const isCover = page.id === 'cover';
  const isBackCover = page.id === 'back-cover';
  const isCoverPage = isCover || isBackCover;
  
  // Gradient backgrounds for themes
  const themeGradients: Record<string, string> = {
    love: 'linear-gradient(135deg, #FF6B9D 0%, #FFA8C3 50%, #FFD4E5 100%)',
    family: 'linear-gradient(135deg, #60A5FA 0%, #93C5FD 50%, #DBEAFE 100%)',
    birthday: 'linear-gradient(135deg, #C084FC 0%, #E9D5FF 50%, #F3E8FF 100%)',
    friendship: 'linear-gradient(135deg, #FBBF24 0%, #FDE68A 50%, #FEF3C7 100%)'
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: isCoverPage && page.theme 
          ? themeGradients[page.theme] || page.backgroundColor || '#ffffff'
          : page.backgroundColor || '#ffffff'
      }}
    >
      {/* Paper texture overlay */}
      {!isCoverPage && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
            mixBlendMode: 'multiply'
          }}
        />
      )}
      {/* Background Pattern for Cover */}
      {isCoverPage && (
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      )}

      {/* Background Image */}
      {page.backgroundImage && (
        <img
          src={page.backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            opacity: isCoverPage ? 1 : 0.95 
          }}
        />
      )}

      {/* Elements */}
      <div className="relative w-full h-full p-8">
        {/* Show placeholder if no elements */}
        {(!page.elements || page.elements.length === 0) && !isCoverPage && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-300">
              <div className="text-6xl mb-4">📄</div>
              <div className="text-sm">Trang trống</div>
            </div>
          </div>
        )}
        
        {page.elements?.map((el: any, idx: number) => {
          // Log any element with missing or invalid data
          if (!el.type || (!el.content && !el.src && !el.url && !el.emoji && el.type !== 'shape')) {
            console.warn('⚠️ Element missing data:', { pageId: page.id, element: el });
          }
          
          // Validate positioning - element should be visible within page bounds (500x700)
          const isOutOfBounds = el.x < 0 || el.y < 0 || el.x > 500 || el.y > 750;
          if (isOutOfBounds) {
            console.warn('⚠️ Element out of page bounds:', { 
              pageId: page.id, 
              elementId: el.id,
              x: el.x, 
              y: el.y,
              pageSize: '500x700'
            });
          }
          
          return (
          <div
            key={el.id || idx}
            className={`absolute ${debugMode ? 'outline outline-2 outline-red-500' : ''}`}
            style={{
              left: `${el.x || 0}px`,
              top: `${el.y || 0}px`,
              width: `${el.width || 100}px`,
              height: `${el.height || 100}px`,
              transform: `rotate(${el.rotation || 0}deg)`,
              opacity: el.opacity !== undefined ? el.opacity : 1,
              zIndex: el.zIndex !== undefined ? el.zIndex : idx
            }}
          >
            {el.type === 'text' && (
              <div
                style={{
                  fontFamily: el.fontFamily || 'Poppins',
                  fontSize: `${el.fontSize || 16}px`,
                  color: el.color || '#000',
                  fontWeight: el.fontWeight || 'normal',
                  fontStyle: el.fontStyle || 'normal',
                  textAlign: (el.textAlign || 'left') as any,
                  textDecoration: el.textDecoration || 'none',
                  lineHeight: el.lineHeight || 1.5,
                  textShadow: el.textShadow || (isCoverPage ? '2px 2px 4px rgba(0,0,0,0.2)' : 'none'),
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
                className="w-full h-full overflow-hidden flex items-center justify-center px-2"
              >
                {el.content || ''}
              </div>
            )}

            {el.type === 'image' && (el.src || el.url) && (
              <img
                src={el.src || el.url}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                style={{
                  objectFit: el.objectFit || 'cover',
                  borderRadius: `${el.borderRadius || 0}px`,
                  filter: el.filter
                }}
              />
            )}

            {el.type === 'shape' && (
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: el.fill,
                  borderRadius: `${el.borderRadius || 0}px`,
                  border: el.stroke ? `${el.strokeWidth || 1}px solid ${el.stroke}` : 'none'
                }}
              />
            )}

            {el.type === 'sticker' && (
              <div 
                className="w-full h-full flex items-center justify-center text-6xl"
                style={{ fontSize: `${el.width * 0.8}px` }}
              >
                {el.emoji || el.content}
              </div>
            )}
            
            {el.type === 'icon' && (
              <div className="w-full h-full flex items-center justify-center">
                {(() => {
                  const IconComp = (LucideIcons as any)[el.iconName];
                  return IconComp ? <IconComp style={{ color: el.color, width: '100%', height: '100%', strokeWidth: el.strokeWidth || 2 }} /> : null;
                })()}
              </div>
            )}

            {/* Fallback for unknown element types */}
            {!['text', 'image', 'shape', 'sticker', 'icon'].includes(el.type) && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                Unknown type: {el.type}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
