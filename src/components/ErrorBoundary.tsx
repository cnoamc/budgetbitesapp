import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const LOG_TAG = '[ERROR_BOUNDARY]';

/**
 * Global error boundary to prevent hard crashes on UI errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error with clear tags for debugging
    console.error(LOG_TAG, 'Uncaught error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    
    this.setState({ errorInfo });
  }

  handleRetry = (): void => {
    // Reset error state and try to re-render
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = (): void => {
    // Full page reload as last resort
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div 
          className="fixed inset-0 flex flex-col items-center justify-center bg-background p-6 text-center"
          dir="rtl"
        >
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          
          <h2 className="text-xl font-bold mb-2">משהו השתבש</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            אירעה שגיאה בלתי צפויה. נסה לרענן את הדף.
          </p>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={this.handleRetry}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              נסה שוב
            </Button>
            <Button 
              onClick={this.handleReload}
              className="gap-2"
            >
              רענן דף
            </Button>
          </div>
          
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-8 text-left text-xs text-muted-foreground max-w-md">
              <summary className="cursor-pointer">פרטי שגיאה (למפתחים)</summary>
              <pre className="mt-2 p-3 bg-muted rounded-lg overflow-auto max-h-40">
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
