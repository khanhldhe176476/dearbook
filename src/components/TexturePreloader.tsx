import { useEffect, useState } from 'react';

interface TexturePreloaderProps {
  urls: string[];
  onComplete?: (textures: Map<string, any>) => void;
}

export function TexturePreloader({ urls, onComplete }: TexturePreloaderProps) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [textures, setTextures] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    // Texture preloading disabled - no longer using THREE directly
    // Use useTexture from @react-three/drei instead
    return () => {
      // Cleanup if needed
    };
  }, [urls.join(',')]);

  return null; // This is a utility component, renders nothing
}
