import { Settings } from 'lucide-react';
import { PageElement } from '../../types/editor';
import { PropertiesPanelAdvanced } from './PropertiesPanelAdvanced';

interface PropertiesPanelProps {
  element?: PageElement | null;
  onUpdate: (updates: Partial<PageElement>) => void;
}

/**
 * Wrapper component for PropertiesPanelAdvanced to handle single element
 */
export function PropertiesPanel({ element, onUpdate }: PropertiesPanelProps) {
  if (!element) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-white">
        <Settings className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-sm">Chọn một phần tử để chỉnh sửa</p>
      </div>
    );
  }

  return (
    <PropertiesPanelAdvanced
      selectedElements={[element]}
      onUpdateElement={(id, updates) => onUpdate(updates)}
    />
  );
}
