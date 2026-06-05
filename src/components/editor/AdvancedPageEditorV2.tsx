import React, { useState, useRef, useEffect } from 'react';
import { PageElement, TextElement, ImageElement, ShapeElement, StickerElement, IconElement, FrameElement } from '../../types/editor';
import { AssetLibrary } from './AssetLibrary';
import { LayerPanel } from './LayerPanel';
import { EditorToolbar } from './EditorToolbar';
import { ImageUploader } from './ImageUploader';

const FONT_FAMILIES = [
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Dancing Script', label: 'Dancing Script' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Pacifico', label: 'Pacifico' },
  { value: 'Caveat', label: 'Caveat' },
  { value: 'Great Vibes', label: 'Great Vibes' },
  { value: 'Comfortaa', label: 'Comfortaa' },
  { value: 'Lobster', label: 'Lobster' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
];

//  InlineTextEditor: component tch bit ngn React re-render khi ang g 
const InlineTextEditor = React.memo(
  ({
    textEl,
    zoom,
    onCommit,
    onExit,
  }: {
    textEl: TextElement;
    zoom: number;
    onCommit: (id: string, content: string) => void;
    onExit: () => void;
  }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const initialContentRef = useRef(textEl.content);

    useEffect(() => {
      const el = editorRef.current;
      if (el) {
        el.innerText = textEl.content || '';
        el.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, []); // Only mount  never re-run

    const handleBlur = () => {
      const newContent = editorRef.current?.innerText || '';
      if (newContent !== initialContentRef.current) {
        onCommit(textEl.id, newContent);
      }
      onExit();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (editorRef.current) {
          editorRef.current.innerText = initialContentRef.current;
        }
        onExit();
      }
    };

    return (
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          height: '100%',
          fontFamily: textEl.fontFamily,
          fontSize: (textEl.fontSize || 24) * zoom,
          fontWeight: textEl.fontWeight,
          fontStyle: textEl.fontStyle,
          color: textEl.color,
          textAlign: textEl.textAlign,
          lineHeight: textEl.lineHeight,
          letterSpacing: (textEl.letterSpacing || 0) * zoom,
          textDecoration: textEl.textDecoration,
          textShadow: textEl.textShadow || 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          padding: '8px',
          outline: '2px solid #8C6E5D',
          background: 'rgba(140,110,93,0.05)',
          minHeight: '30px',
          outlineOffset: '-2px',
        }}
      />
    );
  },
  // NEVER re-render  contentEditable DOM manages itself
  () => true
);
InlineTextEditor.displayName = 'InlineTextEditor';

import { SaveIndicator } from '../SaveIndicator';
import { ExportModal } from '../ExportModal';
import { dbGetImageSync } from '../../utils/dbStorage';
import { MobileEditorToolbar } from '../MobileEditorToolbar';
import { EditorToolbarCompact } from './EditorToolbarCompact';
import { CoverTemplateSelector } from './CoverTemplateSelector';
import { FloatingActionMenu } from './FloatingActionMenu';
import { CoverGuide } from './CoverGuide';
import { PageFilmstrip } from './PageFilmstrip';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { shapes, frames } from '../../data/editorAssets';
import { BookData } from '../../App';
import { EditorPage as BookPage } from '../../types/editor';
import * as LucideIcons from 'lucide-react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Layers,
  Upload,
  Type,
  Image as ImageIcon,
  Save,
  Eye,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface AdvancedPageEditorV2Props {
  book: BookData;
  pages: BookPage[];
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  onUpdatePage: (
    pageIndex: number,
    elements: PageElement[],
    background?: any
  ) => void;
  onSave: () => void;
  onPreview?: () => void;
  onBack?: () => void;
  onSaveOrder?: () => void;
  onAddPage?: () => void;
  onDeletePage?: (index: number) => void;
  onDuplicatePage?: (index: number) => void;
}

export function AdvancedPageEditorV2({
  book,
  pages,
  currentPageIndex,
  onPageChange,
  onUpdatePage,
  onSave,
  onPreview,
  onBack,
  onSaveOrder,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
}: AdvancedPageEditorV2Props) {
  const currentPage = pages[currentPageIndex];
  const isMobile = useIsMobile();

  // Safety check
  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500">Khng tm thy trang</p>
        </div>
      </div>
    );
  }

  // Combined state for elements and background to ensure atomic updates and undo/redo support for background
  interface EditorState {
    elements: PageElement[];
    background: { type: 'color' | 'image' | 'gradient' | 'pattern'; value: string };
  }

  const {
    state: editorState,
    setState: setEditorState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    reset,
  } = useUndoRedo<EditorState>({
    initialState: {
      elements: currentPage.elements || [],
      background: currentPage.background || { type: 'color', value: '#FFFFFF' },
    },
    maxHistory: 50,
  });

  const elements = editorState.elements;
  const background = editorState.background;

  // Auto-save with custom hook
  const { saveStatus, lastSavedAt, forceSave, isSaving } = useAutoSave({
    // Include pageIndex in data to ensure we save to the correct page even if the index changes during debounce
    data: { 
      elements, 
      background,
      pageIndex: currentPageIndex,
    },
    onSave: (data) => {
      onUpdatePage(
        data.pageIndex, // Use the pageIndex that was active when this data was captured
        data.elements,
        data.background
      );
      onSave();
    },
    interval: 30000, // 30 seconds
    debounceTime: 2000, // 2 seconds
  });

  // Sync state when page changes via safe useEffect
  useEffect(() => {
    // Use reset to update both state and history in one atomic operation
    reset({
      elements: currentPage?.elements || [],
      background: currentPage?.background || { type: 'color', value: '#FFFFFF' }
    });
    setSelectedIds([]);
  }, [currentPageIndex, reset]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [gridVisible, setGridVisible] = useState(false);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(!isMobile);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showCoverSelector, setShowCoverSelector] = useState(false);
  const [showCoverGuide, setShowCoverGuide] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [resizingElement, setResizingElement] = useState<{
    id: string;
    handle: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    elStartX: number;
    elStartY: number;
  } | null>(null);
  const [rotatingElement, setRotatingElement] = useState<{
    id: string;
    centerX: number;
    centerY: number;
    startAngle: number;
    startRotation: number;
  } | null>(null);
  // Track which upload slot is being hovered during external drag (from library)
  const [dragOverSlotId, setDragOverSlotId] = useState<string | null>(null);

  // Check if current page is cover
  const isCoverPage = currentPageIndex === 0 || currentPage?.id === 'cover';

  // Show cover guide on first visit to cover page
  useEffect(() => {
    const hasSeenCoverGuide = localStorage.getItem('dearbook_seen_cover_guide');
    if (isCoverPage && !hasSeenCoverGuide && !isMobile) {
      setTimeout(() => setShowCoverGuide(true), 1000);
    }
  }, [isCoverPage, isMobile]);

  const handleDismissCoverGuide = () => {
    setShowCoverGuide(false);
    localStorage.setItem('dearbook_seen_cover_guide', 'true');
  };

  const canvasRef = useRef<HTMLDivElement>(null);
  //  Global rule: hidden file input for click-to-fill upload slots
  const slotFileInputRef = useRef<HTMLInputElement>(null);
  const pendingSlotIdRef = useRef<string | null>(null);
  const PAGE_WIDTH = 400;
  const PAGE_HEIGHT = 600;

  // Called when user selects a file after clicking an upload slot
  const handleSlotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slotId = pendingSlotIdRef.current;
    if (!file || !slotId) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      // Fill the slot: set src, enforce cover fit
      handleUpdateElement(slotId, { src, objectFit: 'cover' });
      toast.success(' nh  c fit vo khung!');
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = '';
    pendingSlotIdRef.current = null;
  };

  // Syncing is now handled during render above for better performance

  const handleAddElement = (
    type: 'text' | 'image' | 'shape' | 'sticker' | 'icon' | 'frame',
    data: any
  ) => {
    const baseElement = {
      id: `el-${Date.now()}-${Math.random()}`,
      type,
      x: data.x || PAGE_WIDTH / 2 - 50,
      y: data.y || PAGE_HEIGHT / 2 - 50,
      width: data.width || 100,
      height: data.height || 100,
      rotation: data.rotation || 0,
      opacity: data.opacity || 1,
      locked: false,
      visible: true,
      zIndex: elements.length,
    };

    let newElement: PageElement;

    switch (type) {
      case 'text':
        newElement = {
          ...baseElement,
          type: 'text',
          content: data.content || 'Nhp ni dung...',
          fontFamily: data.fontFamily || 'Poppins',
          fontSize: data.fontSize || 24,
          fontWeight: data.fontWeight || 'normal',
          fontStyle: data.fontStyle || 'normal',
          color: data.color || '#000000',
          textAlign: data.textAlign || 'left',
          lineHeight: data.lineHeight || 1.4,
          letterSpacing: data.letterSpacing || 0,
          textDecoration: data.textDecoration || 'none',
        } as TextElement;
        break;

      case 'image':
        newElement = {
          ...baseElement,
          type: 'image',
          src: data.src,
          objectFit: data.objectFit || 'cover',
          width: data.width || 200,
          height: data.height || 200,
        } as ImageElement;
        break;

      case 'shape':
        newElement = {
          ...baseElement,
          type: 'shape',
          shape: data.shape,
          fill: data.fill || '#FF6B6B',
        } as ShapeElement;
        break;

      case 'sticker':
        newElement = {
          ...baseElement,
          type: 'sticker',
          emoji: data.emoji,
        } as StickerElement;
        break;

      case 'icon':
        newElement = {
          ...baseElement,
          type: 'icon',
          iconName: data.iconName,
          color: data.color || '#000000',
          strokeWidth: data.strokeWidth || 2,
        } as IconElement;
        break;

      case 'frame':
        newElement = {
          ...baseElement,
          type: 'frame',
          frameStyle: data.frameStyle,
          color: data.color || '#000000',
          strokeWidth: data.strokeWidth || 2,
        } as FrameElement;
        break;

      default:
        return;
    }

    const newElements = [...elements, newElement];
    setEditorState(prev => ({ ...prev, elements: newElements }));
    setSelectedIds([newElement.id]);
    setShowLayerPanel(true);
    if (type === 'text') {
      setEditingTextId(newElement.id);
    }
    toast.success(' thm phn t mi');
  };

  const handleUpdateElement = (id: string, updates: Partial<PageElement>) => {
    const newElements = elements.map((el) =>
      el.id === id ? { ...el, ...updates } : el
    );
    setEditorState(prev => ({ ...prev, elements: newElements as PageElement[] }));
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleSaveOrder = () => {
    forceSave(); // Ensure latest changes are saved before proceeding
    toast.success(' gi thit k cho Admin thnh cng! Chng ti s sm lin h vi bn.');
    if (onSaveOrder) onSaveOrder();
  };

  const handlePageChange = (newIndex: number) => {
    if (newIndex === currentPageIndex) return;
    
    // Attempt to save current changes before switching
    forceSave();
    
    // Switch page
    onPageChange(newIndex);
  };

  const handleDeleteElement = (id: string) => {
    const newElements = elements.filter((el) => el.id !== id);
    setEditorState(prev => ({ ...prev, elements: newElements }));
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
    toast.info(' xa phn t');
  };

  const handleApplyTemplate = (template: any) => {
    const newElements = template.elements.map((el: any, idx: number) => ({
      ...el,
      id: `el-${Date.now()}-${Math.random()}-${idx}`,
      zIndex: idx,
      locked: false,
      visible: true,
      rotation: el.rotation || 0,
      opacity: el.opacity || 1,
    }));
    setEditorState(prev => ({ ...prev, elements: newElements as PageElement[] }));
    setSelectedIds([]);
    setShowLayerPanel(true);
    toast.success(` p dng mu: ${template.name}`);
  };

  const handleAddTextCombination = (combination: any) => {
    const newElements = [...elements];
    combination.elements.forEach((el: any, idx: number) => {
      const newEl = {
        ...el,
        id: `el-${Date.now()}-${Math.random()}-${idx}`,
        x: (el.x || 50),
        y: (el.y || 100) + (combination.elements[0].y === el.y ? 0 : 0), // Simple offset if needed
        width: el.width || 300,
        height: el.height || 60,
        zIndex: elements.length + idx,
        locked: false,
        visible: true,
        rotation: el.rotation || 0,
        opacity: el.opacity || 1,
      };
      newElements.push(newEl as PageElement);
    });
    setEditorState(prev => ({ ...prev, elements: newElements as PageElement[] }));
    setShowLayerPanel(true);
    toast.success(` thm: ${combination.name}`);
  };

  const handleSelectElement = (id: string, multiSelect?: boolean) => {
    if (multiSelect) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const handleDuplicate = (id?: string) => {
    const targetIds = id ? [id] : selectedIds;
    const newElements = [...elements];

    targetIds.forEach((targetId) => {
      const element = elements.find((el) => el.id === targetId);
      if (element) {
        const duplicate = {
          ...element,
          id: `el-${Date.now()}-${Math.random()}`,
          x: element.x + 20,
          y: element.y + 20,
          zIndex: elements.length + newElements.length,
        };
        newElements.push(duplicate);
      }
    });

    setEditorState(prev => ({ ...prev, elements: newElements }));
    toast.success(' nhn i phn t');
  };

  const handleAlign = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedIds.length === 0) return;

    const newElements = elements.map((el) => {
      if (!selectedIds.includes(el.id)) return el;

      switch (type) {
        case 'left':
          return { ...el, x: 20 };
        case 'center':
          return { ...el, x: (PAGE_WIDTH - el.width) / 2 };
        case 'right':
          return { ...el, x: PAGE_WIDTH - el.width - 20 };
        case 'top':
          return { ...el, y: 20 };
        case 'middle':
          return { ...el, y: (PAGE_HEIGHT - el.height) / 2 };
        case 'bottom':
          return { ...el, y: PAGE_HEIGHT - el.height - 20 };
        default:
          return el;
      }
    });

    setEditorState(prev => ({ ...prev, elements: newElements }));
    toast.success(' cn chnh phn t');
  };

  const handleReorderElement = (id: string, direction: 'up' | 'down') => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    const sortedByZ = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sortedByZ.findIndex((el) => el.id === id);

    if (direction === 'up' && currentIndex < sortedByZ.length - 1) {
      const nextEl = sortedByZ[currentIndex + 1];
      const temp = element.zIndex;
      element.zIndex = nextEl.zIndex;
      nextEl.zIndex = temp;
    } else if (direction === 'down' && currentIndex > 0) {
      const prevEl = sortedByZ[currentIndex - 1];
      const temp = element.zIndex;
      element.zIndex = prevEl.zIndex;
      prevEl.zIndex = temp;
    }

    setEditorState(prev => ({ ...prev, elements: [...elements] }));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when editing text
      if (editingTextId) return;
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          forceSave();
          toast.success(' lu th cng');
        } else if (e.key === 'd') {
          e.preventDefault();
          handleDuplicate();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds && selectedIds.length > 0 && !editingTextId) {
          e.preventDefault();
          selectedIds.forEach((id) => handleDeleteElement(id));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, forceSave, editingTextId]);

  // Global mouse handlers  bt s kin trn ton window  ko/th vt ra ngoi canvas
  useEffect(() => {
    const isActive = draggedElement || resizingElement || rotatingElement;
    if (!isActive) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (rotatingElement) {
        const angle = Math.atan2(e.clientY - rotatingElement.centerY, e.clientX - rotatingElement.centerX);
        let deltaRotation = (angle - rotatingElement.startAngle) * 180 / Math.PI;
        handleUpdateElement(rotatingElement.id, { rotation: rotatingElement.startRotation + deltaRotation });
        return;
      }

      // Get current element (React state in closure, use refs if stale)
      if (resizingElement) {
        const el = elements.find(el => el.id === resizingElement.id);
        if (!el) return;

        const angle = el.rotation || 0;
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const rawDeltaX = (e.clientX - resizingElement.startX) / zoom;
        const rawDeltaY = (e.clientY - resizingElement.startY) / zoom;

        const deltaX = rawDeltaX * cos + rawDeltaY * sin;
        const deltaY = -rawDeltaX * sin + rawDeltaY * cos;

        let newWidth = resizingElement.startWidth;
        let newHeight = resizingElement.startHeight;
        let deltaX_local = 0;
        let deltaY_local = 0;

        if (resizingElement.handle.includes('e')) newWidth = Math.max(20, resizingElement.startWidth + deltaX);
        if (resizingElement.handle.includes('w')) { newWidth = Math.max(20, resizingElement.startWidth - deltaX); deltaX_local = resizingElement.startWidth - newWidth; }
        if (resizingElement.handle.includes('s')) newHeight = Math.max(20, resizingElement.startHeight + deltaY);
        if (resizingElement.handle.includes('n')) { newHeight = Math.max(20, resizingElement.startHeight - deltaY); deltaY_local = resizingElement.startHeight - newHeight; }

        const localDeltaCenterX = deltaX_local + (newWidth - resizingElement.startWidth) / 2;
        const localDeltaCenterY = deltaY_local + (newHeight - resizingElement.startHeight) / 2;
        const globalDeltaCenterX = localDeltaCenterX * cos - localDeltaCenterY * sin;
        const globalDeltaCenterY = localDeltaCenterX * sin + localDeltaCenterY * cos;
        const startCenterGlobalX = resizingElement.elStartX + resizingElement.startWidth / 2;
        const startCenterGlobalY = resizingElement.elStartY + resizingElement.startHeight / 2;
        const newCenterGlobalX = startCenterGlobalX + globalDeltaCenterX;
        const newCenterGlobalY = startCenterGlobalY + globalDeltaCenterY;

        handleUpdateElement(resizingElement.id, {
          x: newCenterGlobalX - newWidth / 2,
          y: newCenterGlobalY - newHeight / 2,
          width: newWidth,
          height: newHeight,
        });
        return;
      }

      if (draggedElement) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // Khng gii hn v tr  cho php ko ra ngoi trang
        handleUpdateElement(draggedElement.id, {
          x: (mouseX - draggedElement.offsetX) / zoom,
          y: (mouseY - draggedElement.offsetY) / zoom,
        });
      }
    };

    const handleGlobalMouseUp = () => {
      setDraggedElement(null);
      setResizingElement(null);
      setRotatingElement(null);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggedElement, resizingElement, rotatingElement, elements, zoom, handleUpdateElement]);

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (e.button !== 0) return;

    const element = elements.find((el) => el.id === elementId);
    if (!element || element.locked) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - element.x * zoom;
    const offsetY = e.clientY - rect.top - element.y * zoom;

    setDraggedElement({ id: elementId, offsetX, offsetY });

    if (!selectedIds.includes(elementId)) {
      handleSelectElement(elementId, e.shiftKey);
    }
  };

  //  Drop-Into-Frame: Universal rule for all templates 
  // When an image is dragged from the AssetLibrary onto the canvas:
  //   1. Check if the drop point hits an isUploadSlot element
  //   2. If YES  set the slot's src to the dragged image (auto-fit cover)
  //   3. If NO   add a new free-floating image element as before
  const handleCanvasDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    // Find topmost upload slot under cursor
    const slotUnder = [...elements]
      .filter((el): el is ImageElement => el.type === 'image' && !!(el as any).isUploadSlot)
      .sort((a, b) => b.zIndex - a.zIndex)
      .find(el => {
        const imgEl = el as ImageElement;
        return (
          mouseX >= imgEl.x &&
          mouseX <= imgEl.x + imgEl.width &&
          mouseY >= imgEl.y &&
          mouseY <= imgEl.y + imgEl.height
        );
      });

    setDragOverSlotId(slotUnder ? slotUnder.id : null);
  };

  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverSlotId(null);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    // Find topmost upload slot under drop point
    const slotUnder = [...elements]
      .filter((el): el is ImageElement => el.type === 'image' && !!(el as any).isUploadSlot)
      .sort((a, b) => b.zIndex - a.zIndex)
      .find(el => {
        const imgEl = el as ImageElement;
        return (
          mouseX >= imgEl.x &&
          mouseX <= imgEl.x + imgEl.width &&
          mouseY >= imgEl.y &&
          mouseY <= imgEl.y + imgEl.height
        );
      });

    // Handle OS file drop first
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const fileSrc = ev.target?.result as string;
          if (slotUnder) {
            handleUpdateElement(slotUnder.id, { src: fileSrc, objectFit: 'cover' });
            toast.success(' nh  c fit vo khung!');
          } else {
            handleAddElement('image', {
              src: fileSrc,
              objectFit: 'cover',
              x: Math.max(0, mouseX - 100),
              y: Math.max(0, mouseY - 100),
              width: 200,
              height: 200,
              rotation: 0,
              opacity: 1,
            });
          }
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    // Handle internal drag from asset library
    const src = e.dataTransfer.getData('application/dearbook-image-src');
    if (!src) return;

    if (slotUnder) {
      //  Drop into frame: replace slot src, keep frame dimensions
      handleUpdateElement(slotUnder.id, {
        src,
        objectFit: 'cover',
      });
      toast.success(' nh  c fit vo khung!');
    } else {
      // Drop onto empty canvas area  add as new free-floating element
      handleAddElement('image', {
        src,
        objectFit: 'cover',
        x: Math.max(0, mouseX - 100),
        y: Math.max(0, mouseY - 100),
        width: 200,
        height: 200,
        rotation: 0,
        opacity: 1,
      });
    }
  };
  // 

  const handleResizeStart = (e: React.MouseEvent, id: string, handle: string) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === id);
    if (!element) return;
    setResizingElement({
      id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: element.width,
      startHeight: element.height,
      elStartX: element.x,
      elStartY: element.y,
    });
  };

  const handleRotateStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === id);
    if (!element) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + (element.x + element.width / 2) * zoom;
    const centerY = rect.top + (element.y + element.height / 2) * zoom;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    setRotatingElement({
      id,
      centerX,
      centerY,
      startAngle,
      startRotation: element.rotation || 0,
    });
  };

  const selectedElement = selectedIds.length === 1 ? elements.find((el) => el.id === selectedIds[0]) : null;

  // Handle cover selection
  const handleSelectCover = (cover: BookPage) => {
    if (currentPageIndex === 0 || pages[currentPageIndex]?.id === 'cover') {
      // Update cover page
      onUpdatePage(currentPageIndex, cover.elements, cover.background);
      setEditorState({ elements: cover.elements, background: cover.background });
      toast.success(' p dng trang ba mi');
    }
    setShowCoverSelector(false);
  };

  const renderElement = (element: PageElement) => {
    const isSelected = selectedIds.includes(element.id);
    const isEditing = editingTextId === element.id;
    const transform = `translate(${element.x * zoom}px, ${element.y * zoom}px) rotate(${element.rotation}deg)`;

    const commonStyle = {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      width: element.width * zoom,
      height: element.height * zoom,
      transform,
      opacity: element.opacity,
      zIndex: element.zIndex,
      cursor: element.locked ? 'not-allowed' : (isEditing ? 'text' : 'move'),
      display: element.visible ? 'block' : 'none',
      pointerEvents: element.locked ? ('none' as const) : ('auto' as const),
      outline: isSelected ? '2px solid #C4956A' : 'none',
      outlineOffset: '-2px',
      borderRadius: (element as any).borderRadius || 0,
    };

    const handles = [
      { position: 'nw', cursor: 'nwse-resize', top: -6, left: -6 },
      { position: 'n', cursor: 'ns-resize', top: -6, left: 'calc(50% - 6px)' },
      { position: 'ne', cursor: 'nesw-resize', top: -6, right: -6 },
      { position: 'w', cursor: 'ew-resize', top: 'calc(50% - 6px)', left: -6 },
      { position: 'e', cursor: 'ew-resize', top: 'calc(50% - 6px)', right: -6 },
      { position: 'sw', cursor: 'nesw-resize', bottom: -6, left: -6 },
      { position: 's', cursor: 'ns-resize', bottom: -6, left: 'calc(50% - 6px)' },
      { position: 'se', cursor: 'nwse-resize', bottom: -6, right: -6 },
    ];

    const resizeHandle = isSelected && !element.locked && !isEditing ? (
      <>
        {handles.map((h, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 12,
              height: 12,
              backgroundColor: '#fff',
              border: '2px solid #8C6E5D',
              borderRadius: h.position.length === 1 ? '0%' : '50%',
              cursor: h.cursor,
              zIndex: 10,
              top: h.top,
              left: h.left,
              right: h.right,
              bottom: h.bottom,
            }}
            onMouseDown={(e) => handleResizeStart(e, element.id, h.position)}
          />
        ))}
        {/* Rotate Handle */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            left: 'calc(50% - 6px)',
            width: 12,
            height: 12,
            backgroundColor: '#fff',
            border: '2px solid #8C6E5D',
            borderRadius: '50%',
            cursor: 'crosshair',
            zIndex: 10,
          }}
          onMouseDown={(e) => handleRotateStart(e, element.id)}
        />
        <div
          style={{
            position: 'absolute',
            top: -18,
            left: 'calc(50% - 1px)',
            width: 2,
            height: 18,
            backgroundColor: '#8C6E5D',
            zIndex: 9,
          }}
        />
      </>
    ) : null;

    let content;

    switch (element.type) {
      case 'text':
        const textEl = element as TextElement;
        
        const handleTextDoubleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          setEditingTextId(element.id);
          setSelectedIds([element.id]);
        };

        content = (
          <div
            style={commonStyle}
            onMouseDown={(e) => {
              if (!isEditing) {
                handleMouseDown(e, element.id);
              }
            }}
            onDoubleClick={handleTextDoubleClick}
          >
            {isEditing ? (
              <InlineTextEditor
                textEl={textEl}
                zoom={zoom}
                onCommit={(id, content) => handleUpdateElement(id, { content })}
                onExit={() => setEditingTextId(null)}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  fontFamily: textEl.fontFamily,
                  fontSize: (textEl.fontSize || 24) * zoom,
                  fontWeight: textEl.fontWeight,
                  fontStyle: textEl.fontStyle,
                  color: textEl.color,
                  textAlign: textEl.textAlign,
                  lineHeight: textEl.lineHeight,
                  letterSpacing: (textEl.letterSpacing || 0) * zoom,
                  textDecoration: textEl.textDecoration,
                  textShadow: textEl.textShadow || 'none',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  userSelect: 'none',
                  padding: '8px',
                }}
              >
                {textEl.content}
              </div>
            )}
            {resizeHandle}
          </div>
        );
        break;

      case 'image':
        const imgEl = element as ImageElement;
        const isUploadSlot = !!(imgEl as any).isUploadSlot;
        const isDragTarget = dragOverSlotId === element.id;
        const imgSrc = imgEl.src
          ? (imgEl.src.startsWith('dearbook_image_')
            ? dbGetImageSync(imgEl.src) || imgEl.src
            : imgEl.src)
          : '';
        content = (
          <div
            style={{
              ...commonStyle,
              outline: isDragTarget
                ? '3px solid #C4956A'
                : isUploadSlot && !imgSrc
                ? 'none'
                : commonStyle.outline,
              // Move pointer/cursor logic here for the whole element
              cursor: isUploadSlot && !imgSrc ? 'pointer' : (element.locked ? 'not-allowed' : 'move'),
            }}
            onMouseDown={(e) => {
              //  If it's an empty upload slot, open file picker on click instead of drag
              if (isUploadSlot && !imgSrc) {
                e.stopPropagation();
                pendingSlotIdRef.current = element.id;
                slotFileInputRef.current?.click();
              } else {
                handleMouseDown(e, element.id);
              }
            }}
            //  If slot already has image, double-click to replace
            onDoubleClick={(e) => {
              if (isUploadSlot && imgSrc) {
                e.stopPropagation();
                pendingSlotIdRef.current = element.id;
                slotFileInputRef.current?.click();
              }
            }}
          >
            <div
              className={isUploadSlot ? "image-frame" : ""}
              style={{
                width: '100%',
                height: '100%',
                //  GLOBAL RULE: always clip image to its frame bounds
                overflow: 'hidden',
                borderRadius: 'inherit',
                background: isUploadSlot && !imgSrc
                  ? (isDragTarget ? '#DCD4CB' : '#EAE6DF')
                  : 'transparent',
              }}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={(imgEl as any).alt || (imgEl as any).uploadLabel || 'Image'}
                  style={{
                    //  GLOBAL RULE: absolute fill ensures 100% coverage regardless of zoom
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: isUploadSlot ? 'cover' : (imgEl.objectFit || 'cover'),
                    objectPosition: 'center',
                    pointerEvents: 'none',
                    display: 'block',
                  }}
                />
              ) : isUploadSlot ? (
                // Empty upload slot placeholder
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: isDragTarget ? '#8C6E5D' : '#8D96A0', // Canva gray
                  transition: 'all 0.2s ease',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span style={{ fontSize: '11px', fontWeight: 500, textAlign: 'center', padding: '0 4px', fontFamily: 'var(--font-secondary), sans-serif' }}>
                    {isDragTarget ? ' Th nh vo y' : ((imgEl as any).uploadLabel || 'Click ti nh')}
                  </span>
                </div>
              ) : null}
            </div>
            {resizeHandle}
          </div>
        );
        break;

      case 'shape':
        const shapeEl = element as ShapeElement;
        const shapeData = shapes.find((s) => s.id === shapeEl.shape);
        content = (
          <div
            style={{
              ...commonStyle,
              backgroundColor: shapeEl.fill,
              borderRadius: (shapeData as any)?.borderRadius || 0,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {resizeHandle}
          </div>
        );
        break;

      case 'sticker':
        const stickerEl = element as StickerElement;
        content = (
          <div
            style={{
              ...commonStyle,
              fontSize: element.height * zoom * 0.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {stickerEl.emoji}
            {resizeHandle}
          </div>
        );
        break;

      case 'icon':
        const iconEl = element as IconElement;
        const IconComponent = (LucideIcons as any)[iconEl.iconName];
        content = (
          <div
            style={{
              ...commonStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {IconComponent && (
              <IconComponent
                style={{
                  width: '100%',
                  height: '100%',
                  color: iconEl.color,
                  strokeWidth: iconEl.strokeWidth,
                }}
              />
            )}
            {resizeHandle}
          </div>
        );
        break;

      default:
        content = null;
    }

    return <div key={element.id}>{content}</div>;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/*  Global hidden file input for click-to-fill upload slots */}
      <input
        ref={slotFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleSlotFileChange}
      />
      {/* Left Sidebar - Asset Library (Desktop only) */}
      {!isMobile && showAssetLibrary && (
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto animate-in slide-in-from-left duration-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="font-semibold text-gray-900"> Th vin</h3>
            <button
              onClick={() => setShowAssetLibrary(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <AssetLibrary
            onAddElement={handleAddElement}
            onApplyTemplate={handleApplyTemplate}
            onAddTextCombination={handleAddTextCombination}
          />
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Compact Toolbar */}
        {!isMobile && (
          <EditorToolbarCompact
            title={book.title || 'Chnh sa trang'}
            zoom={zoom}
            canUndo={canUndo}
            canRedo={canRedo}
            gridVisible={gridVisible}
            showLeftPanel={showAssetLibrary}
            showLayerPanel={showLayerPanel}
            saveStatus={saveStatus as any}
            lastSavedAt={lastSavedAt || undefined}
            onBack={onBack}
            onUndo={undo}
            onRedo={redo}
            onZoomIn={() => setZoom(Math.min(2, zoom + 0.1))}
            onZoomOut={() => setZoom(Math.max(0.5, zoom - 0.1))}
            onToggleGrid={() => setGridVisible(!gridVisible)}
            onPreview={onPreview}
            onExport={handleExport}
            onSaveOrder={handleSaveOrder}
            onToggleLeftPanel={() => setShowAssetLibrary(!showAssetLibrary)}
            onToggleLayerPanel={() => setShowLayerPanel(!showLayerPanel)}
            onAddText={() =>
              handleAddElement('text', {
                content: 'Nhp ni dung...',
                fontSize: 24,
              })
            }
            onAddImage={() => setShowImageUploader(true)}
            onSelectCover={isCoverPage ? () => setShowCoverSelector(true) : undefined}
          />
        )}

        {/* Contextual Element Properties Bar */}
        {!isMobile && selectedElement && (
          <ElementPropertiesBar
            element={selectedElement}
            onUpdate={(updates) => handleUpdateElement(selectedElement.id, updates)}
          />
        )}

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center overflow-auto p-6">
          <div
            ref={canvasRef}
            id="printable-canvas"
            className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
            style={{
              width: PAGE_WIDTH * zoom,
              height: PAGE_HEIGHT * zoom,
              backgroundColor: background?.type === 'color' ? background.value : '#FFFFFF',
              backgroundImage: background?.type === 'image'
                ? `url("${background.value}")`
                : 'none',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            // Mouse drag/resize/rotate handled globally via window listeners
            //  Drop-Into-Frame handlers
            onDragOver={handleCanvasDragOver}
            onDragLeave={() => setDragOverSlotId(null)}
            onDrop={handleCanvasDrop}
          >
            {/* Grid */}
            {gridVisible && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                }}
              />
            )}

            {/* Elements */}
            {elements && elements.length > 0 && elements
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((element) => renderElement(element))}

            {/* Overlay Template Layer */}
            {currentPage?.overlay && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${currentPage.overlay.value})`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 9999
                }}
              />
            )}
          </div>
        </div>

        {/* Page Filmstrip (Replaces old navigation) */}
        <PageFilmstrip
          pages={pages}
          currentPageIndex={currentPageIndex}
          onPageChange={handlePageChange}
          onAddPage={onAddPage || (() => {})}
          onDeletePage={onDeletePage || (() => {})}
          onDuplicatePage={onDuplicatePage || (() => {})}
        />
      </div>

      {/* Right Sidebar - Layer Panel (Desktop only) */}
      {!isMobile && showLayerPanel && (
        <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-200">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 sticky top-0 z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Lp (Layers)</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {elements.length} phn t
              </p>
            </div>
            <button
              onClick={() => setShowLayerPanel(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              title="n danh sch lp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <LayerPanel
              elements={elements}
              selectedIds={selectedIds}
              onSelectElement={handleSelectElement}
              onReorder={handleReorderElement}
              onDelete={handleDeleteElement}
              onDuplicate={handleDuplicate}
              onToggleVisibility={(id) => {
                const element = elements.find((el) => el.id === id);
                if (element) {
                  handleUpdateElement(id, { visible: !element.visible });
                }
              }}
              onToggleLock={(id) => {
                const element = elements.find((el) => el.id === id);
                if (element) {
                  handleUpdateElement(id, { locked: !element.locked });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile Toolbar */}
      {isMobile && (
        <MobileEditorToolbar
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onSave={forceSave}
          onExport={() => setShowExportModal(true)}
          onAddText={() =>
            handleAddElement('text', {
              content: 'Nhp ni dung...',
              fontSize: 24,
            })
          }
          onAddImage={() => setShowImageUploader(true)}
          onShowLayers={() => setShowLayerPanel(true)}
          isSaving={isSaving}
        />
      )}

      {/* Cover Template Selector Modal */}
      {showCoverSelector && book.theme && (
        <CoverTemplateSelector
          theme={book.theme}
          currentCover={currentPage}
          onSelect={handleSelectCover}
          onClose={() => setShowCoverSelector(false)}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          title={book.title || 'Cun sch ca ti'}
          pages={pages}
          book={book}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900"> Thm hnh nh</h3>
              <button
                onClick={() => setShowImageUploader(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <ImageUploader
              onImageUpload={(imageKey) => {
                handleAddElement('image', { src: imageKey });
                setShowImageUploader(false);
              }}
              enableCrop={false}
            />
          </div>
        </div>
      )}

      {/* Floating Action Menu (when asset library is closed) */}
      {!isMobile && !showAssetLibrary && (
        <FloatingActionMenu
          onAddText={() =>
            handleAddElement('text', {
              content: 'Nhp ni dung...',
              fontSize: 24,
            })
          }
          onAddImage={() => setShowImageUploader(true)}
          onAddShape={() => {
            setShowAssetLibrary(true);
            toast.info('Chn hnh khi t th vin');
          }}
          onAddSticker={() => {
            setShowAssetLibrary(true);
            toast.info('Chn sticker t th vin');
          }}
        />
      )}

      {/* Cover Guide (first time only) */}
      {!isMobile && showCoverGuide && isCoverPage && (
        <CoverGuide
          onSelectCover={() => {
            setShowCoverSelector(true);
            handleDismissCoverGuide();
          }}
          onDismiss={handleDismissCoverGuide}
        />
      )}
    </div>
  );
}

//  Element Properties Bar 
// Hin th thuc tnh ca element ang c chn ngay trn thanh toolbar

function ElementPropertiesBar({
  element,
  onUpdate,
}: {
  element: PageElement;
  onUpdate: (updates: Partial<PageElement>) => void;
}) {
  const typeLabel = {
    text: ' Vn bn',
    image: ' Hnh nh',
    shape: ' Hnh khi',
    sticker: ' Sticker',
    icon: ' Icon',
    frame: ' Khung',
  }[element.type] || 'Phn t';

  return (
    <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-3 overflow-x-auto shadow-sm">
      {/* Type badge */}
      <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap flex-shrink-0">
        {typeLabel}
      </span>
      <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

      {/* Position & Size */}
      <div className="flex items-center gap-1 text-[11px] text-gray-500">
        <span className="text-gray-400">X</span>
        <input
          type="number"
          value={Math.round(element.x)}
          onChange={e => onUpdate({ x: Number(e.target.value) })}
          className="w-12 px-1 py-0.5 border border-gray-200 rounded text-center text-[11px]"
        />
        <span className="text-gray-400 ml-1">Y</span>
        <input
          type="number"
          value={Math.round(element.y)}
          onChange={e => onUpdate({ y: Number(e.target.value) })}
          className="w-12 px-1 py-0.5 border border-gray-200 rounded text-center text-[11px]"
        />
        <span className="text-gray-400 ml-1">W</span>
        <input
          type="number"
          value={Math.round(element.width)}
          onChange={e => onUpdate({ width: Math.max(10, Number(e.target.value)) })}
          className="w-12 px-1 py-0.5 border border-gray-200 rounded text-center text-[11px]"
        />
        <span className="text-gray-400 ml-1">H</span>
        <input
          type="number"
          value={Math.round(element.height)}
          onChange={e => onUpdate({ height: Math.max(10, Number(e.target.value)) })}
          className="w-12 px-1 py-0.5 border border-gray-200 rounded text-center text-[11px]"
        />
      </div>

      <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

      {/* Rotation + Opacity (chung cho mi loi) */}
      <div className="flex items-center gap-1 text-[11px] text-gray-500">
        <span className="text-gray-400"></span>
        <input
          type="number"
          value={Math.round(element.rotation || 0)}
          onChange={e => onUpdate({ rotation: Number(e.target.value) })}
          className="w-12 px-1 py-0.5 border border-gray-200 rounded text-center text-[11px]"
          min={-180} max={180}
        />
        <span className="text-gray-400 ml-1"></span>
        <span className="text-gray-400 ml-2">Opacity</span>
        <input
          type="range"
          value={(element.opacity ?? 1) * 100}
          onChange={e => onUpdate({ opacity: Number(e.target.value) / 100 })}
          className="w-16 h-4"
          min={0} max={100}
        />
        <span className="text-[10px] text-gray-400 w-7">{Math.round((element.opacity ?? 1) * 100)}%</span>
      </div>

      {/* Text-specific properties */}
      {element.type === 'text' && (
        <>
          <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
          <div className="flex items-center gap-1.5">
            <select
              value={(element as TextElement).fontFamily || 'Poppins'}
              onChange={e => onUpdate({ fontFamily: e.target.value })}
              className="px-1.5 py-0.5 border border-gray-200 rounded text-[11px] bg-white"
              style={{ fontFamily: (element as TextElement).fontFamily || 'Poppins' }}
            >
              {FONT_FAMILIES.map(f => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
              ))}
            </select>
            <input
              type="number"
              value={(element as TextElement).fontSize || 16}
              onChange={e => onUpdate({ fontSize: Math.max(8, Number(e.target.value)) })}
              className="w-12 px-1 py-0.5 border border-gray-200 rounded text-center text-[11px]"
              min={8}
            />
            <span className="text-[10px] text-gray-400">px</span>
            <button
              onClick={() => onUpdate({ fontWeight: (element as TextElement).fontWeight === 'bold' ? 'normal' : 'bold' })}
              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                (element as TextElement).fontWeight === 'bold' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >B</button>
            <button
              onClick={() => onUpdate({ fontStyle: (element as TextElement).fontStyle === 'italic' ? 'normal' : 'italic' })}
              className={`px-2 py-0.5 rounded text-[11px] italic border transition-colors ${
                (element as TextElement).fontStyle === 'italic' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >I</button>
            <button
              onClick={() => onUpdate({ textDecoration: (element as TextElement).textDecoration === 'underline' ? 'none' : 'underline' })}
              className={`px-2 py-0.5 rounded text-[11px] underline border transition-colors ${
                (element as TextElement).textDecoration === 'underline' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >U</button>
            <div className="flex items-center gap-0.5 border border-gray-200 rounded overflow-hidden">
              {(['left', 'center', 'right'] as const).map(align => (
                <button
                  key={align}
                  onClick={() => onUpdate({ textAlign: align })}
                  className={`px-1.5 py-0.5 text-[10px] transition-colors ${
                    (element as TextElement).textAlign === align ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-400'
                  }`}
                >{align === 'left' ? '' : align === 'center' ? '' : ''}</button>
              ))}
            </div>
            <input
              type="color"
              value={(element as TextElement).color || '#000000'}
              onChange={e => onUpdate({ color: e.target.value })}
              className="w-6 h-6 rounded border border-gray-200 cursor-pointer p-0"
              title="Mu ch"
            />
            {['#000000','#FF0000','#FF6B6B','#FF9800','#4CAF50','#2196F3','#9C27B0','#FFFFFF'].map(c => (
              <button
                key={c}
                onClick={() => onUpdate({ color: c })}
                className={`w-4 h-4 rounded-full border transition-transform hover:scale-125 ${
                  (element as TextElement).color === c ? 'ring-1 ring-offset-1 ring-gray-400' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </>
      )}

      {/* Image-specific properties */}
      {element.type === 'image' && (
        <>
          <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
          <div className="flex items-center gap-1.5">
            <select
              value={(element as ImageElement).objectFit || 'cover'}
              onChange={e => onUpdate({ objectFit: e.target.value as any })}
              className="px-1.5 py-0.5 border border-gray-200 rounded text-[11px] bg-white"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
            <input
              type="number"
              value={(element as ImageElement).borderRadius || 0}
              onChange={e => onUpdate({ borderRadius: Math.max(0, Number(e.target.value)) })}
              className="w-12 px-1 py-0.5 border border-gray-200 rounded text-center text-[11px]"
              min={0}
            />
            <span className="text-[10px] text-gray-400">r px</span>
          </div>
        </>
      )}

      {/* Shape-specific properties */}
      {element.type === 'shape' && (
        <>
          <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
          <div className="flex items-center gap-1.5">
            <select
              value={(element as ShapeElement).shape || 'rectangle'}
              onChange={e => onUpdate({ shape: e.target.value as any })}
              className="px-1.5 py-0.5 border border-gray-200 rounded text-[11px] bg-white"
            >
              <option value="rectangle"> Ch nht</option>
              <option value="square"> Vung</option>
              <option value="circle"> Trn</option>
              <option value="triangle"> Tam gic</option>
              <option value="star"> Sao</option>
              <option value="heart"> Tim</option>
            </select>
            <input
              type="color"
              value={(element as ShapeElement).fill || '#000000'}
              onChange={e => onUpdate({ fill: e.target.value })}
              className="w-6 h-6 rounded border border-gray-200 cursor-pointer p-0"
              title="Mu nn"
            />
            <input
              type="color"
              value={(element as ShapeElement).stroke || '#000000'}
              onChange={e => onUpdate({ stroke: e.target.value })}
              className="w-6 h-6 rounded border border-gray-200 cursor-pointer p-0"
              title="Mu vin"
            />
            <input
              type="number"
              value={(element as ShapeElement).strokeWidth || 1}
              onChange={e => onUpdate({ strokeWidth: Math.max(0, Number(e.target.value)) })}
              className="w-12 px-1 py-0.5 border border-gray-200 rounded text-center text-[11px]"
              min={0}
            />
            <span className="text-[10px] text-gray-400">vin</span>
          </div>
        </>
      )}

      {/* Sticker-specific  ch hin emoji */}
      {element.type === 'sticker' && (
        <>
          <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
          <span className="text-lg">{(element as StickerElement).emoji}</span>
        </>
      )}

      {/* Close button */}
      <div className="flex-1" />
      <button
        onClick={() => {
          // Deselect bng cch click ra ngoi (handled elsewhere)
        }}
        className="text-[10px] text-gray-400 hover:text-gray-600 px-2 py-0.5"
      >
        
      </button>
    </div>
  );
}