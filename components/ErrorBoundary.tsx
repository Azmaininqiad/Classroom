'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WelcomeButton } from '@/components/WelcomeButton';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Welcome page error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f19] via-[#1a1a2e] to-[#16213e] p-4">
          <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/10 max-w-md w-full">
            <CardContent className="p-6 text-center space-y-4">
              <div className="bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] p-3 rounded-full mx-auto w-fit">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                <p className="text-gray-300 text-sm">
                  We encountered an error while loading the welcome page. Please try refreshing the page.
                </p>
              </div>
              <WelcomeButton
                onClick={this.handleRetry}
                variant="primary"
                size="default"
                className="w-full"
                aria-label="Retry loading the page"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </WelcomeButton>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mt-4">
                  <summary className="text-sm text-gray-400 cursor-pointer">Error Details</summary>
                  <pre className="text-xs text-red-400 mt-2 p-2 bg-black/20 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;