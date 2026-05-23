// Editor Element Types

export type ElementType = 'text' | 'image' | 'shape' | 'sticker' | 'icon' | 'frame';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | 'lighter' | number;
  fontStyle: 'normal' | 'italic';
  color: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpacing: number;
  textDecoration: 'none' | 'underline' | 'line-through';
  textShadow?: string;
  background?: string;
  padding?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt?: string;
  objectFit: 'cover' | 'contain' | 'fill';
  filter?: string;
  borderRadius?: number;
  border?: string;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shape: 'circle' | 'square' | 'rectangle' | 'triangle' | 'star' | 'heart';
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface StickerElement extends BaseElement {
  type: 'sticker';
  emoji: string;
  filter?: string;
}

export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string; // Lucide icon name
  color: string;
  strokeWidth: number;
}

export interface FrameElement extends BaseElement {
  type: 'frame';
  frameStyle: 'simple' | 'double' | 'rounded' | 'dashed' | 'decorative';
  color: string;
  strokeWidth: number;
}

export type PageElement = 
  | TextElement 
  | ImageElement 
  | ShapeElement 
  | StickerElement 
  | IconElement 
  | FrameElement;

export interface EditorPage {
  id: string;
  elements: PageElement[];
  background: {
    type: 'color' | 'gradient' | 'image' | 'pattern';
    value: string;
  };
  overlay?: {
    type: 'image';
    value: string;
  };
  width: number;
  height: number;
}

export interface EditorState {
  pages: EditorPage[];
  currentPageIndex: number;
  selectedElementIds: string[];
  clipboard: PageElement[];
  history: {
    past: EditorPage[][];
    future: EditorPage[][];
  };
  zoom: number;
  gridVisible: boolean;
  snapToGrid: boolean;
}

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

// Action types
export type EditorAction =
  | { type: 'ADD_ELEMENT'; element: PageElement }
  | { type: 'UPDATE_ELEMENT'; id: string; updates: Partial<PageElement> }
  | { type: 'DELETE_ELEMENT'; id: string }
  | { type: 'SELECT_ELEMENT'; id: string; multiSelect?: boolean }
  | { type: 'DESELECT_ALL' }
  | { type: 'MOVE_ELEMENT'; id: string; x: number; y: number }
  | { type: 'RESIZE_ELEMENT'; id: string; transform: Transform }
  | { type: 'REORDER_ELEMENT'; id: string; direction: 'front' | 'back' | 'forward' | 'backward' }
  | { type: 'DUPLICATE_ELEMENT'; id: string }
  | { type: 'COPY_ELEMENTS'; ids: string[] }
  | { type: 'PASTE_ELEMENTS' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'TOGGLE_GRID' }
  | { type: 'CHANGE_PAGE'; index: number };
