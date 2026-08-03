'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  PoundSterling,
  User,
  MessageSquare,
  Search,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const role = (session?.user as { role?: string })?.role;

  const instructorNav: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard/instructor',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Availability',
      href: '/dashboard/instructor/availability',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: 'Bookings',
      href: '/dashboard/instructor/bookings',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: 'Earnings',
      href: '/dashboard/instructor/earnings',
      icon: <PoundSterling className="w-5 h-5" />,
    },
    {
      label: 'Profile',
      href: '/dashboard/instructor/profile',
      icon: <User className="w-5 h-5" />,
    },
    {
      label: 'Messages',
      href: '/dashboard/messages',
      icon: <MessageSquare className="w-5 h-5" />,
    },
  ];

  const studentNav: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard/student',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Find Matches',
      href: '/dashboard/student/matches',
      icon: <Search className="w-5 h-5" />,
    },
    {
      label: 'Bookings',
      href: '/dashboard/student/bookings',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: 'Progress',
      href: '/dashboard/student/progress',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: 'Messages',
      href: '/dashboard/messages',
      icon: <MessageSquare className="w-5 h-5" />,
    },
  ];

  const navItems = role === 'INSTRUCTOR' ? instructorNav : studentNav;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-primary-500 text-white rounded-full shadow-lg"
      >
        {collapsed ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-transform duration-200 ${
          collapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-lg font-bold text-dark-800">KerbSide</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setCollapsed(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 text-xs font-semibold">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email || ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
