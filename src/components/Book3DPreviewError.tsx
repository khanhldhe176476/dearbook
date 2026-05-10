import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class Book3DPreviewError extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('❌ 3D Preview Error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
            {/* Error Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Không thể tải Preview 3D
            </h1>
            <p className="text-gray-600 mb-6">
              Đã xảy ra lỗi khi tải giao diện xem trước 3D. Vui lòng thử lại.
            </p>

            {/* Error Details */}
            {this.state.error && (
              <div className="mb-8 p-4 bg-red-50 rounded-xl text-left">
                <p className="text-sm font-mono text-red-800">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <RefreshCcw className="w-5 h-5" />
                Thử lại
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-300"
              >
                Tải lại trang
              </button>
            </div>

            {/* Help Text */}
            <p className="text-sm text-gray-500 mt-8">
              💡 Nếu vấn đề vẫn tiếp diễn, vui lòng thử:
              <br />
              • Tải lại trang
              <br />
              • Xóa cache trình duyệt
              <br />
              • Thử với trình duyệt khác
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
