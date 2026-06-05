import { 
  ArrowLeft, Save, Download, Eye, Undo, Redo, 
  ZoomIn, ZoomOut, Plus, Settings, Grid3x3, Layers,
  Type, Image, Sparkles, Palette, Upload, BookOpen,
  AlignLeft, AlignCenter, AlignRight, Copy, Trash2
} from 'lucide-react';

interface ImprovedEditorToolbarProps {
  title: string;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  gridVisible: boolean;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  onBack?: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onPreview?: () => void;
  onSave: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onShowAssets: () => void;
  onShowLayers: () => void;
  showAssets: boolean;
  showLayers: boolean;
}

export function ImprovedEditorToolbar({
  title,
  zoom,
  canUndo,
  canRedo,
  gridVisible,
  saveStatus,
  onBack,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onPreview,
  onSave,
  onAddText,
  onAddImage,
  onShowAssets,
  onShowLayers,
  showAssets,
  showLayers,
}: ImprovedEditorToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Main Toolbar */}
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
              title="Quay li Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="font-semibold text-gray-900">{title}</span>
          </div>

          {/* Save Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${
              saveStatus === 'saved' ? 'bg-green-500' : 
              saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' : 
              'bg-gray-400'
            }`} />
            <span className="text-xs text-gray-600">
              {saveStatus === 'saved' ? ' lu' : 
               saveStatus === 'saving' ? 'ang lu...' : 
               'Cha lu'}
            </span>
          </div>
        </div>

        {/* Center Section - Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 hover:bg-white rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Hon tc (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 hover:bg-white rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Lm li (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            <button
              onClick={onZoomOut}
              className="p-2 hover:bg-white rounded-md transition-colors"
              title="Thu nh"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="px-3 py-1.5 min-w-[65px] text-center">
              <span className="text-sm font-medium text-gray-700">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <button
              onClick={onZoomIn}
              className="p-2 hover:bg-white rounded-md transition-colors"
              title="Phng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Grid Toggle */}
          <button
            onClick={onToggleGrid}
            className={`p-2 rounded-lg transition-all ${
              gridVisible 
                ? 'bg-purple-100 text-purple-600' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Hin/n li"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>

          {/* Add Elements */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            <button
              onClick={onAddText}
              className="flex items-center gap-1.5 px-3 py-2 hover:bg-white rounded-md transition-colors"
              title="Thm vn bn (T)"
            >
              <Type className="w-4 h-4" />
              <span className="text-sm font-medium">Text</span>
            </button>
            <button
              onClick={onAddImage}
              className="flex items-center gap-1.5 px-3 py-2 hover:bg-white rounded-md transition-colors"
              title="Thm hnh nh (I)"
            >
              <Image className="w-4 h-4" />
              <span className="text-sm font-medium">nh</span>
            </button>
          </div>

          {/* Panel Toggles */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            <button
              onClick={onShowAssets}
              className={`p-2 rounded-md transition-all ${
                showAssets 
                  ? 'bg-pink-100 text-pink-600' 
                  : 'hover:bg-white text-gray-600'
              }`}
              title="Th vin"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={onShowLayers}
              className={`p-2 rounded-md transition-all ${
                showLayers 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'hover:bg-white text-gray-600'
              }`}
              title="Lp & Thuc tnh"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {onPreview && (
            <button
              onClick={onPreview}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Xem trc</span>
            </button>
          )}

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-semibold">Lu</span>
          </button>
        </div>
      </div>

      {/* Quick Tips Bar */}
      <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-t border-amber-100">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-700"> Mo:</span>
            <span>Shift + Click  chn nhiu</span>
          </div>
          <div className="w-px h-3 bg-gray-300" />
          <span>Ctrl + S  lu</span>
          <div className="w-px h-3 bg-gray-300" />
          <span>Delete  xa</span>
          <div className="w-px h-3 bg-gray-300" />
          <span>Ctrl + D  nhn i</span>
        </div>
      </div>
    </div>
  );
}
