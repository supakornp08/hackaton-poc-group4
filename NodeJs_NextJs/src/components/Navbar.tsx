'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '🏠 หน้าหลัก', icon: '🏠' },
  { href: '/upload', label: '📤 อัพโหลด', icon: '📤' },
  { href: '/search', label: '🔍 ค้นหา', icon: '🔍' },
  { href: '/register', label: '📝 ลงทะเบียน', icon: '📝' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏦</span>
            <span className="font-bold text-xl text-primary-700">EXIM Bank</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              🔔
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <span className="text-xl">👤</span>
              <span className="text-sm font-medium text-gray-700">Guest</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
