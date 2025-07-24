'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalPress: number;
  totalBlog: number;
  totalInquiries: number;
  totalProducts: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPress: 0,
    totalBlog: 0,
    totalInquiries: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      // 각 API에서 통계 데이터 가져오기
      const [pressRes, blogRes, inquiriesRes, productsRes] = await Promise.all([
        fetch('/api/press?active=false'),
        fetch('/api/blog'),
        fetch('/api/inquiries'),
        fetch('/api/products')
      ]);

      const pressData = await pressRes.json();
      const blogData = await blogRes.json();
      const inquiriesData = await inquiriesRes.json();
      const productsData = await productsRes.json();

      setStats({
        totalPress: pressData.total || 0,
        totalBlog: blogData.total || 0,
        totalInquiries: inquiriesData.total || 0,
        totalProducts: productsData.total || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: '새 언론보도 등록',
      description: '언론보도 자료를 새로 등록합니다',
      href: '/admin/press/new',
      icon: '📰',
      color: 'bg-blue-500'
    },
    {
      title: '새 블로그 작성',
      description: '회사 블로그 글을 새로 작성합니다',
      href: '/admin/blog/new',
      icon: '📝',
      color: 'bg-green-500'
    },
    {
      title: '문의 내역 확인',
      description: '새로운 문의 내역을 확인합니다',
      href: '/admin/inquiries',
      icon: '📧',
      color: 'bg-yellow-500'
    },
    {
      title: '사이트 설정',
      description: '사이트 전역 설정을 관리합니다',
      href: '/admin/settings',
      icon: '⚙️',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">통계를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="mt-2 text-gray-600">(주)소나버스 관리자 시스템에 오신 것을 환영합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">언론보도</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">블로그</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBlog}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📧</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">문의</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🛍️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">제품</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <span className="text-xl">{action.icon}</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 활동</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-600">최근 활동 내역이 여기에 표시됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 