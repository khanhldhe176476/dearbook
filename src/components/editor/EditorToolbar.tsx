import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  Copy,
  Trash2,
  Grid3x3,
  Save
} from 'lucide-react';

interface EditorToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onAlignTop: () => void;
  onAlignMiddle: () => void;
  onAlignBottom: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleGrid: () => void;
  gridVisible: boolean;
  onSave: () => void;
}

export function EditorToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasSelection,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onAlignTop,
  onAlignMiddle,
  onAlignBottom,
  onDuplicate,
  onDelete,
  onToggleGrid,
  gridVisible,
  onSave,
}: EditorToolbarProps) {
  return (
    <div className="bg-white border-b px-4 py-2 flex items-center justify-between gap-4">
      {/* Left: History */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Hon tc (Ctrl+Z)"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Lm li (Ctrl+Y)"
        >
          <Redo2 className="w-5 h-5" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all font-medium"
          title="Lu (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Lu</span>
        </button>
      </div>

      {/* Center: Alignment (only when selection) */}
      {hasSelection && (
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 mr-2">Cn chnh:</div>
          
          {/* Horizontal Alignment */}
          <button
            onClick={onAlignLeft}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Cn tri"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onAlignCenter}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Cn gia ngang"
          >
            <AlignHorizontalJustifyCenter className="w-4 h-4" />
          </button>
          <button
            onClick={onAlignRight}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Cn phi"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Vertical Alignment */}
          <button
            onClick={onAlignTop}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Cn trn"
          >
            <AlignLeft className="w-4 h-4 rotate-90" />
          </button>
          <button
            onClick={onAlignMiddle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Cn gia dc"
          >
            <AlignVerticalJustifyCenter className="w-4 h-4" />
          </button>
          <button
            onClick={onAlignBottom}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Cn di"
          >
            <AlignRight className="w-4 h-4 rotate-90" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Actions */}
          <button
            onClick={onDuplicate}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Nhn bn (Ctrl+D)"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
            title="Xa (Delete)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Right: View Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleGrid}
          className={`p-2 rounded-lg transition-all ${
            gridVisible
              ? 'bg-rose-50 text-rose-600'
              : 'hover:bg-gray-100'
          }`}
          title="Hin/n li"
        >
          <Grid3x3 className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          title="Thu nh (-)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        
        <div className="min-w-[60px] text-center">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(zoom * 100)}%
          </span>
        </div>
        
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          title="Phng to (+)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        
        <button
          onClick={onZoomFit}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          title="Va khung (0)"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
