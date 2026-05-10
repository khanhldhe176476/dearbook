// Background music URLs for each theme
// Using royalty-free instrumental music

export interface ThemeMusic {
  url: string;
  title: string;
  description: string;
}

export const THEME_MUSIC: Record<string, ThemeMusic[]> = {
  // LOVE THEME - Romantic, soft piano & strings
  love: [
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-tender-love-13.mp3',
      title: 'Tender Love',
      description: 'Soft romantic piano melody'
    },
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-romantic-love-10.mp3',
      title: 'Romantic Love',
      description: 'Gentle piano and strings'
    },
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-22.mp3',
      title: 'Beautiful Dream',
      description: 'Emotional piano ballad'
    }
  ],

  // FAMILY THEME - Warm, peaceful acoustic
  family: [
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3',
      title: 'Family Warmth',
      description: 'Warm acoustic melody'
    },
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-happy-and-joyful-children-14.mp3',
      title: 'Happy Family',
      description: 'Cozy and heartwarming'
    },
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-soft-piano-100.mp3',
      title: 'Home Sweet Home',
      description: 'Gentle piano melody'
    }
  ],

  // BIRTHDAY THEME - Happy, upbeat celebration
  birthday: [
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-happy-sun-126.mp3',
      title: 'Happy Celebration',
      description: 'Cheerful birthday tune'
    },
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-happy-and-joyful-children-14.mp3',
      title: 'Party Time',
      description: 'Upbeat celebration music'
    },
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-feeling-happy-5.mp3',
      title: 'Joyful Day',
      description: 'Happy and energetic'
    }
  ],

  // FRIENDSHIP THEME - Cheerful, positive acoustic
  friendship: [
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-happy-sun-126.mp3',
      title: 'Sunny Day Together',
      description: 'Cheerful acoustic melody'
    },
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-feeling-happy-5.mp3',
      title: 'Best Friends',
      description: 'Uplifting and friendly'
    },
    {
      url: 'https://assets.mixkit.co/music/preview/mixkit-a-happy-child-532.mp3',
      title: 'Happy Moments',
      description: 'Positive and bright'
    }
  ]
};

// Get default music for a theme (first in list)
export const getThemeMusic = (theme: string): string => {
  const themeKey = theme as keyof typeof THEME_MUSIC;
  const musicList = THEME_MUSIC[themeKey] || THEME_MUSIC.love;
  return musicList[0].url;
};

// Get random music for a theme
export const getRandomThemeMusic = (theme: string): string => {
  const themeKey = theme as keyof typeof THEME_MUSIC;
  const musicList = THEME_MUSIC[themeKey] || THEME_MUSIC.love;
  const randomIndex = Math.floor(Math.random() * musicList.length);
  return musicList[randomIndex].url;
};

// Get random music with full info for a theme
export const getRandomThemeMusicWithInfo = (theme: string): { music: ThemeMusic; index: number } => {
  // Normalize theme to lowercase and handle edge cases
  const normalizedTheme = (theme || 'love').toLowerCase().trim();
  
  // Get music list, fallback to love theme if not found
  const themeKey = normalizedTheme as keyof typeof THEME_MUSIC;
  const musicList = THEME_MUSIC[themeKey] || THEME_MUSIC.love;
  
  // Ensure musicList has items
  if (!musicList || musicList.length === 0) {
    console.warn(`No music found for theme: ${theme}, using love theme`);
    const fallbackList = THEME_MUSIC.love;
    const randomIndex = Math.floor(Math.random() * fallbackList.length);
    return {
      music: fallbackList[randomIndex],
      index: randomIndex
    };
  }
  
  const randomIndex = Math.floor(Math.random() * musicList.length);
  console.log(`🎵 Selected music for theme "${normalizedTheme}": ${musicList[randomIndex].title} (${randomIndex + 1}/${musicList.length})`);
  
  return {
    music: musicList[randomIndex],
    index: randomIndex
  };
};
