import { useRef, useState, useEffect, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';

interface BookData {
  title: string;
  coverFront: string;
  coverBack: string;
  spineText: string;
  pages: Array<{
    id: string;
    imageUrl: string;
    text: string;
    pageNumber: number;
  }>;
  thickness: number;
}

interface BookModelProps {
  bookData: BookData;
  currentPage: number;
}

const BookModelComponent = ({ bookData, currentPage }: BookModelProps) => {
  const bookRef = useRef<any>(null);
  const { thickness } = bookData;

  // Debug log on mount
  useEffect(() => {
    console.log(' BookModel mounted with data:', {
      title: bookData.title,
      pagesCount: bookData.pages.length,
      thickness: thickness,
      currentPage: currentPage
    });
  }, []);

  // Book dimensions (A4 ratio scaled to fit scene)
  const BOOK_WIDTH = 0.6;
  const BOOK_HEIGHT = 0.85;
  const COVER_THICKNESS = 0.02;

  // Gentle floating animation
  useFrame((state) => {
    if (bookRef.current) {
      bookRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={bookRef} position={[0, 0, 0]}>
      {/* Spine - center piece */}
      <Spine
        position={[0, 0, 0]}
        width={BOOK_WIDTH}
        height={BOOK_HEIGHT}
        thickness={thickness}
        text={bookData.spineText}
      />

      {/* Back Cover - left side (fixed) */}
      <BackCover
        position={[-BOOK_WIDTH / 2 - COVER_THICKNESS / 2, 0, 0]}
        width={COVER_THICKNESS}
        height={BOOK_HEIGHT}
        depth={thickness}
        color={bookData.coverBack}
      />

      {/* Front Cover - right side (animated) */}
      <FrontCover
        position={[BOOK_WIDTH / 2 + COVER_THICKNESS / 2, 0, 0]}
        width={COVER_THICKNESS}
        height={BOOK_HEIGHT}
        depth={thickness}
        title={bookData.title}
        coverImage={bookData.coverFront}
        currentPage={currentPage}
        totalPages={bookData.pages.length}
      />

      {/* Pages Stack - inside the book */}
      <PagesStack
        bookData={bookData}
        currentPage={currentPage}
        bookWidth={BOOK_WIDTH}
        bookHeight={BOOK_HEIGHT}
        thickness={thickness}
      />
    </group>
  );
};

// Memoize to prevent unnecessary re-renders
export const BookModel = memo(
  BookModelComponent,
  (prevProps, nextProps) => {
    // Only re-render if currentPage or critical book data changes
    return (
      prevProps.currentPage === nextProps.currentPage &&
      prevProps.bookData.title === nextProps.bookData.title &&
      prevProps.bookData.pages.length === nextProps.bookData.pages.length
    );
  }
);

BookModel.displayName = 'BookModel';

// Back Cover Component (solid color, left side)
const BackCover = memo(({ position, width, height, depth, color }: any) => {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
});

BackCover.displayName = 'BackCover';

// Front Cover with image texture and text (right side) - with smooth animation
function FrontCover({ position, width, height, depth, title, coverImage, currentPage, totalPages }: any) {
  const coverRef = useRef<any>(null);
  const [targetRotation, setTargetRotation] = useState(0);
  const [texture, setTexture] = useState<any>(null);

  // Load texture if coverImage exists
  useEffect(() => {
    // Texture loading disabled for now - use useTexture from drei instead
    /*
    if (coverImage && coverImage.startsWith('http')) {
      const loader = new THREE.TextureLoader();
      loader.load(
        coverImage,
        (loadedTexture) => {
          loadedTexture.colorSpace = THREE.SRGBColorSpace;
          setTexture(loadedTexture);
        },
        undefined,
        (error) => {
          console.error('Error loading cover texture:', error);
          setTexture(null);
        }
      );
    }
    */
  }, [coverImage]);

  // Update target rotation when currentPage changes
  useEffect(() => {
    setTargetRotation(currentPage > 0 ? -Math.PI * 0.98 : 0);
  }, [currentPage]);

  // Smooth animation using useFrame
  useFrame(() => {
    if (coverRef.current) {
      const current = coverRef.current.rotation.y;
      const diff = targetRotation - current;
      coverRef.current.rotation.y += diff * 0.1; // Smooth interpolation
    }
  });

  return (
    <group ref={coverRef} position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        
        {/* Left edge (spine side) */}
        <meshStandardMaterial attach="material-0" color="#2d2d2d" roughness={0.6} />
        
        {/* Right edge (outer) */}
        <meshStandardMaterial attach="material-1" color="#1a1a1a" roughness={0.6} />
        
        {/* Top edge */}
        <meshStandardMaterial attach="material-2" color="#3a3a3a" roughness={0.5} />
        
        {/* Bottom edge */}
        <meshStandardMaterial attach="material-3" color="#3a3a3a" roughness={0.5} />
        
        {/* Front face - COVER with image or gradient fallback */}
        <meshStandardMaterial 
          attach="material-4" 
          map={texture}
          color={texture ? "#ffffff" : "#ec4899"}
          roughness={0.25}
          metalness={0.1}
          emissive={texture ? "#000000" : "#f472b6"}
          emissiveIntensity={texture ? 0 : 0.2}
        />
        
        {/* Back face (inside) */}
        <meshStandardMaterial 
          attach="material-5" 
          color="#f8f8f8"
          roughness={0.7}
        />
      </mesh>

      {/* Cover Title Text */}
      <Text
        position={[width / 2 + 0.002, 0, 0]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={depth * 0.8}
        rotation={[0, Math.PI / 2, 0]}
        outlineWidth={0.004}
        outlineColor="#000000"
      >
        {title}
      </Text>

      {/* Decorative elements on cover - only show if no texture */}
      {!texture && (
        <>
          <mesh position={[width / 2 + 0.001, depth * 0.35, 0]}>
            <planeGeometry args={[0.15, 0.15]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.3}
              roughness={0.3}
            />
          </mesh>

          <mesh position={[width / 2 + 0.001, -depth * 0.35, 0]}>
            <planeGeometry args={[0.15, 0.15]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.3}
              roughness={0.3}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

// Spine Component (center)
const Spine = memo(({ position, width, height, thickness, text }: any) => {
  return (
    <group position={position}>
      {/* Spine box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, thickness]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.5}
          metalness={0.15}
        />
      </mesh>

      {/* Spine text (rotated 90 degrees) */}
      <Text
        position={[0, 0, thickness / 2 + 0.003]}
        fontSize={0.055}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={height * 0.8}
        rotation={[0, 0, Math.PI / 2]}
        outlineWidth={0.003}
        outlineColor="#000000"
        letterSpacing={0.02}
      >
        {text}
      </Text>
    </group>
  );
});

Spine.displayName = 'Spine';

// Pages Stack with flip animation
function PagesStack({ bookData, currentPage, bookWidth, bookHeight, thickness }: any) {
  const PAGE_THICKNESS = 0.0015;
  const totalPages = bookData.pages.length;

  return (
    <group position={[0, 0, 0]}>
      {bookData.pages.map((page: any, index: number) => {
        // Calculate z position (depth in the book)
        const zPosition = -thickness / 2 + (index / totalPages) * thickness + PAGE_THICKNESS / 2;
        
        // Determine if page should be flipped
        const isFlipped = index < currentPage;

        return (
          <Page
            key={page.id}
            pageData={page}
            position={[0, 0, zPosition]}
            width={bookWidth}
            height={bookHeight}
            thickness={PAGE_THICKNESS}
            isFlipped={isFlipped}
            pageIndex={index}
            currentPage={currentPage}
          />
        );
      })}
    </group>
  );
}

// Individual Page Component with smooth animation and texture support
function Page({ pageData, position, width, height, thickness, isFlipped, pageIndex }: any) {
  const pageRef = useRef<any>(null);
  const [targetRotation, setTargetRotation] = useState(0);
  const [targetPositionX, setTargetPositionX] = useState(0);
  const [pageTexture, setPageTexture] = useState<any>(null);

  // Load page texture if backgroundImage exists
  useEffect(() => {
    // Texture loading disabled for now
    /*
    if (pageData.imageUrl && pageData.imageUrl.startsWith('http')) {
      console.log(` Loading texture for page ${pageData.pageNumber}:`, pageData.imageUrl);
      const loader = new THREE.TextureLoader();
      loader.load(
        pageData.imageUrl,
        (loadedTexture) => {
          loadedTexture.colorSpace = THREE.SRGBColorSpace;
          setPageTexture(loadedTexture);
          console.log(` Page ${pageData.pageNumber} texture loaded successfully`);
        },
        undefined,
        (error) => {
          console.error(` Error loading texture for page ${pageData.pageNumber}:`, error);
          setPageTexture(null);
        }
      );
    } else {
      console.log(` Page ${pageData.pageNumber} has no image URL`);
    */
    }
    return () => {
      if (pageTexture) {
        pageTexture.dispose();
      }
    };
  }, [pageData.imageUrl, pageData.pageNumber]);

  // Update targets when isFlipped changes
  useEffect(() => {
    setTargetRotation(isFlipped ? -Math.PI * 0.99 : 0);
    setTargetPositionX(isFlipped ? -width : 0);
  }, [isFlipped, width]);

  // Smooth animation using useFrame
  useFrame(() => {
    if (pageRef.current) {
      // Smooth rotation
      const currentRotation = pageRef.current.rotation.y;
      const rotationDiff = targetRotation - currentRotation;
      pageRef.current.rotation.y += rotationDiff * 0.1;

      // Smooth position
      const currentPosX = pageRef.current.position.x;
      const posDiff = targetPositionX - currentPosX;
      pageRef.current.position.x += posDiff * 0.1;
    }
  });

  // Vary page color slightly for depth effect
  const pageColor = isFlipped ? '#fafafa' : '#ffffff';

  return (
    <group ref={pageRef} position={position}>
      <mesh
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, height, thickness]} />
        
        {/* All edges use paper color */}
        <meshStandardMaterial
          attach="material-0"
          color="#fafafa"
          roughness={0.9}
        />
        
        <meshStandardMaterial
          attach="material-1"
          color="#fafafa"
          roughness={0.9}
        />
        
        <meshStandardMaterial
          attach="material-2"
          color="#f5f5f5"
          roughness={0.9}
        />
        
        <meshStandardMaterial
          attach="material-3"
          color="#f5f5f5"
          roughness={0.9}
        />
        
        {/* Front face (page content) - with texture or color fallback */}
        <meshStandardMaterial
          attach="material-4"
          map={pageTexture}
          color={pageTexture ? '#ffffff' : pageColor}
          roughness={0.9}
          metalness={0}
        />
        
        {/* Back face */}
        <meshStandardMaterial
          attach="material-5"
          color="#fcfcfc"
          roughness={0.9}
        />
      </mesh>

      {/* Page number on bottom right (only show on non-flipped pages) */}
      {!isFlipped && (
        <Text
          position={[width / 2 - 0.1, -height / 2 + 0.06, thickness / 2 + 0.002]}
          fontSize={0.025}
          color="#888888"
          anchorX="right"
          anchorY="bottom"
        >
          {pageData.pageNumber}
        </Text>
      )}

      {/* Page text preview (only if no texture) */}
      {!isFlipped && pageData.text && !pageTexture && (
        <Text
          position={[0, 0, thickness / 2 + 0.002]}
          fontSize={0.03}
          color="#333333"
          anchorX="center"
          anchorY="middle"
          maxWidth={width * 0.8}
        >
          {pageData.text.substring(0, 150)}...
        </Text>
      )}
    </group>
  );
}
