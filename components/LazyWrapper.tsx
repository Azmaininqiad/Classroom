'use client';

import React, { Suspense, ReactNode } from 'react';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8" role="status" aria-label="Loading content">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff6a00]" aria-hidden="true"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <DefaultFallback />,
  className 
}) => {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
};