import { SaveStatus } from '../hooks/useAutoSave';
import { Cloud, CloudOff, Loader2, Check, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface SaveIndicatorProps {
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  className?: string;
}

export function SaveIndicator({ saveStatus, lastSavedAt, className = '' }: SaveIndicatorProps) {
  const getStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'ang lu...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
      case 'saved':
        return {
          icon: <Check className="w-4 h-4" />,
          text: lastSavedAt
            ? ` lu ${formatDistanceToNow(lastSavedAt, { addSuffix: true, locale: vi })}`
            : ' lu',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Li lu',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
        };
      default:
        return {
          icon: <Cloud className="w-4 h-4" />,
          text: lastSavedAt
            ? `${formatDistanceToNow(lastSavedAt, { addSuffix: true, locale: vi })}`
            : 'Cha lu',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bgColor} ${status.color} text-sm ${className}`}
    >
      {status.icon}
      <span className="font-medium">{status.text}</span>
    </div>
  );
}
