'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import ErrorBoundary from '@/components/ErrorBoundary';
import ConsultancyHero from '@/components/consultancy/ConsultancyHero';

export default function ConsultancyPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f19] to-[#1e1b3a]" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6a00]" aria-hidden="true"></div>
        <span className="sr-only">Loading consultancy page...</span>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#ff6a00]/20 to-[#ff1b9c]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#a05eff]/20 to-[#ff6a00]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#ff1b9c]/10 to-[#a05eff]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Navigation Header */}
        <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md" role="banner">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4" role="navigation" aria-label="Main navigation">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => router.push('/welcome')}
                  className="bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] p-1.5 sm:p-2 rounded-lg hover:opacity-90 transition-opacity"
                  aria-label="Go back to welcome page"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Live Consultancy</h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                {user ? (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c] hover:from-[#ff6a00]/90 hover:to-[#ff1b9c]/90 text-white border-none text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2 focus:ring-offset-[#0b0f19]"
                    aria-label="Go to dashboard"
                  >
                    Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/auth')}
                    className="border-[#a05eff] text-[#a05eff] hover:bg-[#a05eff] hover:text-white text-sm sm:text-base px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#a05eff] focus:ring-offset-2 focus:ring-offset-[#0b0f19]"
                    aria-label="Sign in to your account"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="relative z-10" role="main">
          <ConsultancyHero onBrowseMentors={() => console.log('Browse mentors clicked')} />
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center text-gray-400">
              <p>&copy; 2024 oneedu. All rights reserved. Live Consultancy Platform.</p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}