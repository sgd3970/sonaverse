'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '../../lib/constants';

interface AdminSidebarProps {
  user?: User | null;
  onLogout?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ user, onLogout }) => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: '대시보드',
      href: '/admin',
      icon: '📊'
    },
    {
      key: 'blog',
      label: '블로그 관리',
      href: '/admin/blog',
      icon: '📝'
    },
    {
      key: 'press',
      label: '언론보도 관리',
      href: '/admin/press',
      icon: '📰'
    },
    {
      key: 'brand-story',
      label: '브랜드 스토리 관리',
      href: '/admin/brand-story',
      icon: '🏢'
    },
    {
      key: 'diaper-products',
      label: '제품 관리',
      href: '/admin/diaper-products',
      icon: '👶'
    },
    {
      key: 'inquiries',
      label: '문의 관리',
      href: '/admin/inquiries',
      icon: '📧'
    },
    {
      key: 'analytics',
      label: '통계',
      href: '/admin/analytics',
      icon: '📈'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-white"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="관리자 메뉴 열기"
      >
        {isMobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-gray-800 border-r border-gray-700 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-yellow-400">
              관리자
            </h1>
          </div>
          {user && (
            <div className="mt-2 text-sm text-gray-300">
              <p>안녕하세요, {user.username}님</p>
              <p className="text-xs">{user.email}</p>
              <p className="text-xs text-gray-500">권한: {user.role}</p>
            </div>
          )}
        </div>
        
        <nav className="p-4 h-full overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-yellow-400 text-black font-semibold'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Back to Site Link */}
          <div className="mt-8 pt-4 border-t border-gray-700 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <span>🏠</span>
              <span>사이트로 돌아가기</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200 w-full text-left cursor-pointer"
            >
              <span>🚪</span>
              <span>로그아웃</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar; 