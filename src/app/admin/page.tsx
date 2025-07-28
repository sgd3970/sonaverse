'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '../../components/Toast';
import RecentPostModal from '../../components/admin/RecentPostModal';

interface DashboardStats {
  totalPress: number;
  totalBlog: number;
  totalInquiries: number;
  totalBrandStories: number;
  totalVisitors: number;
  recentPosts: Array<{
    type: string;
    title: string;
    slug: string;
    created_at: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const { addToast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalPress: 0,
    totalBlog: 0,
    totalInquiries: 0,
    totalBrandStories: 0,
    totalVisitors: 0,
    recentPosts: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats', {
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Response:', res.status, errorText);
        throw new Error(`Failed to fetch stats: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('[대시보드] Error fetching stats:', error);
      addToast({
        type: 'error',
        message: '통계 데이터를 불러오는데 실패했습니다.'
      });
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
      title: '통계 보기',
      description: '상세한 통계를 확인합니다',
      href: '/admin/analytics',
      icon: '📈',
      color: 'bg-indigo-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">통계를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">관리자 대시보드</h1>
        <p className="mt-2 text-gray-300">(주)소나버스 관리자 시스템에 오신 것을 환영합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Link href="/admin/press" className="bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">언론보도</p>
              <p className="text-2xl font-bold text-white">{stats.totalPress}</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/blog" className="bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">블로그</p>
              <p className="text-2xl font-bold text-white">{stats.totalBlog}</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/brand-story" className="bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🏢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">브랜드 스토리</p>
              <p className="text-2xl font-bold text-white">{stats.totalBrandStories}</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/inquiries" className="bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📧</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">문의</p>
              <p className="text-2xl font-bold text-white">{stats.totalInquiries}</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/analytics" className="bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">방문자</p>
              <p className="text-2xl font-bold text-white">{stats.totalVisitors}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* 빠른 액션 */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-700"
            >
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-yellow-400 text-black">
                  <span className="text-xl">{action.icon}</span>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-1">{action.title}</h3>
              <p className="text-sm text-gray-400">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 업로드된 게시물 */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">최근 업로드된 게시물</h2>
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">유형</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">제목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">업로드 날짜</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {stats.recentPosts.length > 0 ? (
                  stats.recentPosts.slice(0, 5).map((post, index) => (
                    <tr key={index} className="hover:bg-gray-700 cursor-pointer" onClick={() => {
                      setSelectedPost(post);
                      setShowModal(true);
                    }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          post.type === 'blog' ? 'bg-green-100 text-green-800' :
                          post.type === 'press' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {post.type === 'blog' ? '블로그' :
                           post.type === 'press' ? '언론보도' :
                           '브랜드 스토리'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(post.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      최근 업로드된 게시물이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 최근 게시물 모달 */}
      <RecentPostModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
      />
    </div>
  );
};

export default AdminDashboard; 