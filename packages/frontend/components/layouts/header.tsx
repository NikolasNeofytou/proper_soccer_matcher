'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <span className="text-xl font-bold">Proper Soccer Matcher</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/discover" className="text-sm font-medium hover:text-primary transition-colors">
            Find Pitches
          </Link>
          <Link href="/matches" className="text-sm font-medium hover:text-primary transition-colors">
            Find Matches
          </Link>
          {isAuthenticated && user?.role === 'pitch_owner' && (
            <Link href="/business/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Business Dashboard
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href={user?.role === 'pitch_owner' ? '/business/dashboard' : '/dashboard'}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
