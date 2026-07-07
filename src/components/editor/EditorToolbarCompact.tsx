import {
  ChevronLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Eye,
  Download,
  Grid3x3,
  Type,
  Image as ImageIcon,
  Shapes,
  Smile,
  BookOpen,
  Layers,
  Settings,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  FileText,
  Magnet,
  ArrowLeftRight,
  ArrowUpDown,
} from 'lucide-react';

interface EditorToolbarCompactProps {
  title: string;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  gridVisible: boolean;
  showLeftPanel: boolean;
  showLayerPanel: boolean;
  showRightPanel?: boolean;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  lastSavedAt?: Date;
  onBack?: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onPreview?: () => void;
  onExport: () => void;
  onSaveOrder?: () => void;
  onToggleLeftPanel: () => void;
  onToggleLayerPanel: () => void;
  onToggleRightPanel?: () => void;
  onAddText?: () => void;
  onAddImage?: () => void;
  onAddShape?: () => void;
  onAddSticker?: () => void;
  onSelectCover?: () => void;
  snappingEnabled?: boolean;
  onToggleSnapping?: () => void;
  onDistributeHorizontal?: () => void;
  onDistributeVertical?: () => void;
}

export function EditorToolbarCompact({
  title,
  zoom,
  canUndo,
  canRedo,
  gridVisible,
  showLeftPanel,
  showLayerPanel,
  showRightPanel,
  saveStatus,
  lastSavedAt,
  onBack,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onPreview,
  onExport,
  onSaveOrder,
  onToggleLeftPanel,
  onToggleLayerPanel,
  onToggleRightPanel,
  onAddText,
  onAddImage,
  onAddShape,
  onAddSticker,
  onSelectCover,
  snappingEnabled,
  onToggleSnapping,
  onDistributeHorizontal,
  onDistributeVertical,
}: EditorToolbarCompactProps) {
  
  const saveStatusInfo = {
    saved: { text: 'Đã lưu', color: 'text-green-600', icon: '✓' },
    saving: { text: 'Đang lưu...', color: 'text-amber-600', icon: '⏳' },
    unsaved: { text: 'Chưa lưu', color: 'text-gray-500', icon: '○' },
  };

  const status = saveStatusInfo[saveStatus] || saveStatusInfo.unsaved;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Left Group - Back + Title + Save Status */}
          <div className="flex items-center gap-3 min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Quay lại"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleLeftPanel}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${showLeftPanel ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`}
                title={showLeftPanel ? "Ẩn thư viện" : "Hiện thư viện (Ảnh/Sticker)"}
              >
                {showLeftPanel ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeftOpen className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={onToggleLayerPanel}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${showLayerPanel ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600'}`}
                title={showLayerPanel ? "Ẩn quản lý lớp" : "Hiện quản lý lớp (Layers)"}
              >
                <Layers className="w-5 h-5" />
              </button>
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">
                {title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs">
                <span className={status.color}>{status.icon}</span>
                <span className={status.color}>{status.text}</span>
                {lastSavedAt && saveStatus === 'saved' && (
                  <span className="text-gray-400">
                    • {lastSavedAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center Group - Tools */}
          <div className="flex items-center gap-1">
            {/* Undo/Redo Group */}
            <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg p-1">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Hoàn tác (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Làm lại (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Zoom Group */}
            <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg p-1">
              <button
                onClick={onZoomOut}
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4 text-gray-700" />
              </button>
              <span className="text-xs font-medium text-gray-700 min-w-[45px] text-center px-2">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={onZoomIn}
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* View Tools */}
            <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg p-1">
              <button
                onClick={onToggleGrid}
                className={`p-1.5 rounded transition-colors ${
                  gridVisible ? 'bg-pink-100 text-pink-600' : 'hover:bg-white text-gray-700'
                }`}
                title="Hiển thị lưới"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              {onToggleSnapping !== undefined && (
                <button
                  onClick={onToggleSnapping}
                  className={`p-1.5 rounded transition-colors ${
                    snappingEnabled ? 'bg-blue-100 text-blue-600' : 'hover:bg-white text-gray-400'
                  }`}
                  title={snappingEnabled ? 'Tắt căn chỉnh thông minh' : 'Bật căn chỉnh thông minh'}
                >
                  <Magnet className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Distribute Tools */}
            {(onDistributeHorizontal || onDistributeVertical) && (
              <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg p-1">
                {onDistributeHorizontal && (
                  <button
                    onClick={onDistributeHorizontal}
                    className="p-1.5 hover:bg-white rounded transition-colors text-gray-700"
                    title="Phân bố đều ngang"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                )}
                {onDistributeVertical && (
                  <button
                    onClick={onDistributeVertical}
                    className="p-1.5 hover:bg-white rounded transition-colors text-gray-700"
                    title="Phân bố đều dọc"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Quick Add Tools (optional) */}
            {(onAddText || onAddImage || onAddShape || onAddSticker || onSelectCover) && (
              <div className="h-6 w-px bg-gray-300 mx-1" />
            )}
            
            {onAddText && (
              <button
                onClick={onAddText}
                className="p-1.5 hover:bg-pink-50 text-gray-700 hover:text-pink-600 rounded-lg transition-colors"
                title="Thêm chữ"
              >
                <Type className="w-4 h-4" />
              </button>
            )}
            
            {onAddImage && (
              <button
                onClick={onAddImage}
                className="p-1.5 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                title="Thêm ảnh"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            )}

            {onSelectCover && (
              <button
                onClick={onSelectCover}
                className="px-2 py-1.5 hover:bg-purple-50 text-gray-700 hover:text-purple-600 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Chọn trang bìa"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden lg:inline">Chọn trang bìa</span>
              </button>
            )}
          </div>

          {/* Right Group - Actions */}
          <div className="flex items-center gap-2">
            {onPreview && (
              <button
                onClick={onPreview}
                className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                style={{ background: 'linear-gradient(to right, #3b82f6, #06b6d4)' }}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Xem 3D</span>
              </button>
            )}

            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Xuất PDF</span>
            </button>

            {onSaveOrder && (
              <button
                onClick={onSaveOrder}
                className="flex items-center gap-1.5 px-4 py-1.5 text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold shadow-md transform hover:scale-[1.02] active:scale-95"
                style={{ background: 'linear-gradient(to right, #f43f5e, #ec4899)' }}
              >
                <Send className="w-4 h-4" />
                <span>Gửi cho Admin</span>
              </button>
            )}

            <button
              onClick={onToggleRightPanel}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={showRightPanel ? 'Ẩn panel' : 'Hiện panel'}
            >
              {showRightPanel ? (
                <PanelRightClose className="w-5 h-5 text-gray-600" />
              ) : (
                <PanelRightOpen className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
