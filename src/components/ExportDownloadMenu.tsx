import { useState } from 'react';
import {
  Download,
  FileText,
  Image,
  Share2,
  Check,
  Loader2,
  X,
} from 'lucide-react';
import { BookData, BookPage } from '../App';
import {
  exportBookAsPDF,
  exportPageAsImage,
  copyShareableLink,
  downloadBlob,
} from '../utils/pdfExport';
import { toast } from 'sonner@2.0.3';

interface ExportDownloadMenuProps {
  book: BookData;
  pages: BookPage[];
  onClose: () => void;
}

type ExportType = 'pdf' | 'images' | 'share';

export function ExportDownloadMenu({ book, pages, onClose }: ExportDownloadMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentExportType, setCurrentExportType] = useState<ExportType | null>(null);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setCurrentExportType('pdf');
    setExportProgress(0);

    try {
      toast.info('Đang tạo file PDF...');
      
      const pdfBlob = await exportBookAsPDF(book, pages, {
        quality: 0.92,
        pageSize: 'A4',
      });

      setExportProgress(100);
      
      const filename = `${book.title || 'book'}_${Date.now()}.pdf`;
      downloadBlob(pdfBlob, filename);
      
      toast.success('Đã tải xuống PDF thành công!');
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Không thể tạo PDF. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
      setCurrentExportType(null);
      setExportProgress(0);
    }
  };

  const handleExportImages = async () => {
    setIsExporting(true);
    setCurrentExportType('images');
    setExportProgress(0);

    try {
      toast.info(`Đang tạo ${pages.length} ảnh...`);
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const imageUrl = await exportPageAsImage(page, 1600, 2400);
        
        // Download each image
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${book.title || 'book'}_page_${i + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setExportProgress(((i + 1) / pages.length) * 100);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast.success(`Đã tải xuống ${pages.length} ảnh thành công!`);
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error('Images export failed:', error);
      toast.error('Không thể tạo ảnh. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
      setCurrentExportType(null);
      setExportProgress(0);
    }
  };

  const handleShare = async () => {
    setIsExporting(true);
    setCurrentExportType('share');

    try {
      const success = await copyShareableLink(book.id);
      
      if (success) {
        toast.success('Đã copy link chia sẻ!');
      } else {
        // Fallback: show link in modal
        const link = `${window.location.origin}/preview/${book.id}`;
        prompt('Copy link này để chia sẻ:', link);
      }
      
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Không thể tạo link chia sẻ.');
    } finally {
      setIsExporting(false);
      setCurrentExportType(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Xuất & Chia sẻ</h2>
            <p className="text-sm text-gray-600 mt-1">
              {book.title || 'Cuốn sách của bạn'} • {pages.length} trang
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          {/* PDF Export */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`
              w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
              ${
                currentExportType === 'pdf'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Tải xuống PDF</h3>
                <p className="text-sm text-gray-600">File PDF chất lượng cao, in được</p>
              </div>
            </div>
            {currentExportType === 'pdf' && isExporting ? (
              <Loader2 className="w-5 h-5 text-pink-600 animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Images Export */}
          <button
            onClick={handleExportImages}
            disabled={isExporting}
            className={`
              w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
              ${
                currentExportType === 'images'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Tải xuống ảnh</h3>
                <p className="text-sm text-gray-600">Mỗi trang thành 1 file ảnh PNG</p>
              </div>
            </div>
            {currentExportType === 'images' && isExporting ? (
              <Loader2 className="w-5 h-5 text-pink-600 animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Share Link */}
          <button
            onClick={handleShare}
            disabled={isExporting}
            className={`
              w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
              ${
                currentExportType === 'share'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Chia sẻ link</h3>
                <p className="text-sm text-gray-600">Copy link để chia sẻ với người khác</p>
              </div>
            </div>
            {currentExportType === 'share' && isExporting ? (
              <Loader2 className="w-5 h-5 text-pink-600 animate-spin" />
            ) : (
              <Share2 className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {isExporting && currentExportType !== 'share' && (
          <div className="px-6 pb-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {currentExportType === 'pdf' ? 'Đang tạo PDF...' : 'Đang tạo ảnh...'}
                </span>
                <span className="font-medium text-pink-600">{Math.round(exportProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="p-1 bg-blue-100 rounded">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Lưu ý:</strong> File PDF và ảnh được tạo từ nội dung hiện tại. Đảm bảo bạn đã
              lưu tất cả thay đổi trước khi xuất.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
