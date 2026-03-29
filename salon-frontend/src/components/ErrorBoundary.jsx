import { Component } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-red-100 shadow-sm animate-in fade-in duration-500 m-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
             <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 text-center max-w-sm mb-8">
            We encountered an unexpected error while loading this page. This usually happens if the data is no longer available.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh Page
            </button>
            <Link 
               to="/login"
               className="px-6 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Back to Safety
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
