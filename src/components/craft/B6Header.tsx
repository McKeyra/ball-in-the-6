'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { B6MobileMenu } from './B6MobileMenu';

export function B6Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-[#0f0f0f]/90 backdrop-blur-lg border-b border-white/[0.06]">
        <div className="safe-area-padding">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <Image
                src="/logo.svg"
                alt="Ball in the 6"
                width={32}
                height={32}
                className="rounded-lg object-contain"
              />
              <span className="text-base font-black tracking-tight text-white hidden sm:inline">
                Ball in the 6
              </span>
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <B6MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
