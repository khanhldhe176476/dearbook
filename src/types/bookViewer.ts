export interface ViewerElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'sticker' | 'icon';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  zIndex?: number;
  // Text fields
  content?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  lineHeight?: number;
  textShadow?: string;
  // Image fields
  src?: string;
  objectFit?: string;
  borderRadius?: number;
  // Shape fields
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  // Sticker / Icon
  emoji?: string;
  iconName?: string;
}

export interface ViewerPage {
  id: string;
  backgroundColor?: string;
  backgroundImage?: string;
  elements: ViewerElement[];
}

export interface BookViewerData {
  id: string;
  title: string;
  theme: string;
  cover: ViewerPage | null;
  backCover: ViewerPage | null;
  pages: ViewerPage[];
  pageCount: number;
}
