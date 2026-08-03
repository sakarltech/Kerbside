'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-dark-800">KerbSide</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/instructors"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Find Instructor
            </Link>
            <Link
              href="/#how-it-works"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              How It Works
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {session ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register/student">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/instructors"
                className="text-gray-600 hover:text-gray-900 font-medium px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Instructor
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-600 hover:text-gray-900 font-medium px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
                {session ? (
                  <Link href="/dashboard">
                    <Button variant="primary" fullWidth>
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button variant="outline" fullWidth>
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register/student">
                      <Button variant="primary" fullWidth>
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
