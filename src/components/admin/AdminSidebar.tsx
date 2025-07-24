'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: '대시보드',
      href: '/admin',
      icon: '📊'
    },
    {
      key: 'pages',
      label: '페이지 관리',
      href: '/admin/pages',
      icon: '📄'
    },
    {
      key: 'products',
      label: '제품 관리',
      href: '/admin/products',
      icon: '🛍️'
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
      key: 'company-history',
      label: '회사 연혁 관리',
      href: '/admin/company-history',
      icon: '📅'
    },
    {
      key: 'inquiries',
      label: '문의 관리',
      href: '/admin/inquiries',
      icon: '📧'
    },
    {
      key: 'settings',
      label: '설정',
      href: '/admin/settings',
      icon: '⚙️'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded-lg shadow-lg"
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
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">
              관리자
            </h1>
          </div>
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
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Back to Site Link */}
          <div className="mt-8 pt-4 border-t space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span>🏠</span>
              <span>사이트로 돌아가기</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 transition-colors w-full text-left"
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