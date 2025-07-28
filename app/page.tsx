'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the welcome page
    router.push('/welcome');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f19] to-[#1e1b3a]">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6a00]"></div>
    </div>
  );
}