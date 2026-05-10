import { Canvas } from '@react-three/fiber';
import { ReactNode, useEffect, useRef, memo } from 'react';

interface ThreeCanvasProps {
  children: ReactNode;
  [key: string]: any;
}

// Global singleton to ensure only ONE Three.js instance at a time
let globalCanvasInstance: string | null = null;
let globalCleanupPending = false;
const CANVAS_REGISTRY = new WeakMap<HTMLCanvasElement, string>();

// Force cleanup of previous instance before creating new one
const forceCleanupPreviousInstance = () => {
  if (globalCleanupPending) {
    // Wait for previous cleanup to complete
    return new Promise(resolve => setTimeout(resolve, 50));
  }
  return Promise.resolve();
};

/**
 * Optimized wrapper for @react-three/fiber Canvas
 * - Prevents "Multiple instances of Three.js" warning by ensuring singleton pattern
 * - Ensures proper cleanup of WebGL context
 * - Memoized to prevent unnecessary re-renders
 * 
 * IMPORTANT: Only ONE Canvas should be active at a time
 */
function ThreeCanvasComponent({ children, ...props }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceIdRef = useRef<string>(`canvas-${Date.now()}-${Math.random()}`);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const instanceId = instanceIdRef.current;
    
    // Wait for any pending cleanup before initializing
    forceCleanupPreviousInstance().then(() => {
      // Check if another canvas is already active
      if (globalCanvasInstance && globalCanvasInstance !== instanceId) {
        console.warn('[ThreeCanvas] Another Canvas instance is already active. Forcing cleanup...');
        globalCleanupPending = true;
        
        // Force a small delay to ensure cleanup
        setTimeout(() => {
          globalCleanupPending = false;
          globalCanvasInstance = instanceId;
        }, 100);
      } else {
        // Register this instance as the global active canvas
        globalCanvasInstance = instanceId;
      }
    });

    // Store canvas element reference after mount
    const rafId = requestAnimationFrame(() => {
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          canvasElementRef.current = canvas as HTMLCanvasElement;
          CANVAS_REGISTRY.set(canvas as HTMLCanvasElement, instanceId);
        }
      }
    });

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId);
      
      // Mark cleanup as pending
      globalCleanupPending = true;
      
      // Only cleanup if this is still the active global instance
      if (globalCanvasInstance === instanceId) {
        globalCanvasInstance = null;
      }

      // Clean up WebGL context
      const canvas = canvasElementRef.current;
      if (canvas && CANVAS_REGISTRY.has(canvas)) {
        try {
          // Get WebGL context
          const gl = 
            (canvas as any).getContext('webgl2') || 
            (canvas as any).getContext('webgl') ||
            (canvas as any).getContext('experimental-webgl');
          
          if (gl) {
            // Clear all bindings before disposing
            try {
              gl.bindFramebuffer(gl.FRAMEBUFFER, null);
              gl.bindRenderbuffer(gl.RENDERBUFFER, null);
              gl.bindBuffer(gl.ARRAY_BUFFER, null);
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
              gl.bindTexture(gl.TEXTURE_2D, null);
            } catch (e) {
              // Silently ignore binding errors during cleanup
            }
            
            // Try to force context loss only if extension is available
            // This is optional - not critical for cleanup
            try {
              const loseContextExt = 
                gl.getExtension('WEBGL_lose_context') ||
                gl.getExtension('WEBKIT_WEBGL_lose_context');
              
              if (loseContextExt) {
                loseContextExt.loseContext();
              }
            } catch (e) {
              // Extension not supported - this is fine, browser will cleanup naturally
            }
          }
          
          CANVAS_REGISTRY.delete(canvas);
        } catch (error) {
          // Silently ignore all cleanup errors - they are not critical
        }
      }
      
      canvasElementRef.current = null;
      
      // Mark cleanup as complete after a short delay
      setTimeout(() => {
        globalCleanupPending = false;
      }, 100);
    };
  }, []);

  // Merge gl props properly
  const glProps = {
    antialias: true,
    alpha: false,
    stencil: false,
    depth: true,
    powerPreference: 'high-performance' as const,
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: false,
    // Disable extension warnings for unsupported features
    // This prevents console warnings about WEBGL_lose_context
    ...props.gl, // User props override defaults
  };

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none'
      }}
    >
      <Canvas 
        {...props}
        gl={glProps}
      >
        {children}
      </Canvas>
    </div>
  );
}

// Memo comparison to prevent unnecessary re-renders
export const ThreeCanvas = memo(
  ThreeCanvasComponent,
  (prevProps, nextProps) => {
    // Compare critical gl props
    const prevGl = prevProps.gl || {};
    const nextGl = nextProps.gl || {};
    
    if (prevGl.antialias !== nextGl.antialias) return false;
    if (prevGl.alpha !== nextGl.alpha) return false;
    if (prevGl.powerPreference !== nextGl.powerPreference) return false;
    
    // Compare other important props
    if (prevProps.shadows !== nextProps.shadows) return false;
    if (prevProps.dpr !== nextProps.dpr) return false;
    if (prevProps.frameloop !== nextProps.frameloop) return false;
    
    // Deep comparison of children (to detect book data changes)
    if (prevProps.children !== nextProps.children) return false;
    
    return true;
  }
);

ThreeCanvas.displayName = 'ThreeCanvas';

