import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-lg w-full space-y-6">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-brown-900">Something went wrong</h2>
              <p className="text-gray-500 text-sm">
                An unexpected error occurred in the application. Please try refreshing the page.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-red-50 p-4 rounded-lg text-left overflow-auto max-h-48 border border-red-100">
                <p className="font-mono text-xs text-red-700 font-bold mb-1">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="font-mono text-[10px] text-red-600/80 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
