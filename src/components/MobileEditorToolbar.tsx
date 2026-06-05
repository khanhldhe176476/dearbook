import { useState } from 'react';
import {
  Type,
  Image,
  Layers,
  Settings,
  Undo2,
  Redo2,
  Download,
  Save,
  X,
  ChevronUp,
  Palette,
  AlignLeft,
  Bold,
} from 'lucide-react';

interface MobileEditorToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onShowLayers: () => void;
  onShowProperties: () => void;
  isSaving: boolean;
}

type ToolbarSection = 'main' | 'text' | 'image' | 'format';

export function MobileEditorToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onExport,
  onAddText,
  onAddImage,
  onShowLayers,
  onShowProperties,
  isSaving,
}: MobileEditorToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSection, setCurrentSection] = useState<ToolbarSection>('main');

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleExpanded}
        className={`
          fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl
          bg-gradient-to-r from-pink-500 to-rose-500 text-white
          transition-all duration-300 hover:scale-110 active:scale-95
          ${isExpanded ? 'rotate-45' : ''}
        `}
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <ChevronUp className="w-6 h-6" />
        )}
      </button>

      {/* Expanded Toolbar */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            onClick={toggleExpanded}
          />

          {/* Toolbar Panel */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Cng c chnh sa</h3>
            </div>

            {/* Main Actions */}
            {currentSection === 'main' && (
              <div className="p-6 space-y-4">
                {/* History Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onUndo();
                      setIsExpanded(false);
                    }}
                    disabled={!canUndo}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Undo2 className="w-6 h-6 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Hon tc</span>
                  </button>
                  <button
                    onClick={() => {
                      onRedo();
                      setIsExpanded(false);
                    }}
                    disabled={!canRedo}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Redo2 className="w-6 h-6 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Lm li</span>
                  </button>
                </div>

                {/* Add Elements */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Thm phn t
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        onAddText();
                        setIsExpanded(false);
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <Type className="w-6 h-6 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">Thm ch</span>
                    </button>
                    <button
                      onClick={() => {
                        onAddImage();
                        setIsExpanded(false);
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <Image className="w-6 h-6 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Thm nh</span>
                    </button>
                  </div>
                </div>

                {/* View Controls */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Qun l
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        onShowLayers();
                        setIsExpanded(false);
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all"
                    >
                      <Layers className="w-6 h-6 text-gray-700" />
                      <span className="text-sm font-medium text-gray-900">Layers</span>
                    </button>
                    <button
                      onClick={() => {
                        onShowProperties();
                        setIsExpanded(false);
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all"
                    >
                      <Settings className="w-6 h-6 text-gray-700" />
                      <span className="text-sm font-medium text-gray-900">Thuc tnh</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Hnh ng
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        onSave();
                        setIsExpanded(false);
                      }}
                      disabled={isSaving}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 hover:shadow-md transition-all disabled:opacity-60"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-medium text-gray-900">ang lu...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-6 h-6 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">Lu</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        onExport();
                        setIsExpanded(false);
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 hover:border-orange-300 hover:shadow-md transition-all"
                    >
                      <Download className="w-6 h-6 text-orange-600" />
                      <span className="text-sm font-medium text-gray-900">Xut file</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
