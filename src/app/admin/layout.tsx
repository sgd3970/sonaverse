'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const user = localStorage.getItem('adminUser');

      if (!token || !user) {
        // 로그인 페이지가 아닌 경우에만 리다이렉트
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        setIsAuthenticated(false);
      } else {
        // 토큰 유효성 검증 (간단한 검증)
        try {
          const userData = JSON.parse(user);
          if (userData && userData.email) {
            setIsAuthenticated(true);
          } else {
            throw new Error('Invalid user data');
          }
        } catch (error) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          if (pathname !== '/admin/login') {
            router.push('/admin/login');
          }
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // 로그인 페이지인 경우 사이드바 없이 렌더링
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 