'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const AdminDashboard: React.FC = () => {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');

  const dashboardData = {
    ko: {
      title: '관리자 대시보드',
      welcome: '안녕하세요! 관리자님',
      stats: {
        totalPages: '총 페이지',
        totalProducts: '총 제품',
        totalBlogPosts: '총 블로그 포스트',
        totalPressReleases: '총 언론보도',
        totalBrandStories: '총 브랜드 스토리',
        newInquiries: '새로운 문의',
        totalInquiries: '총 문의'
      },
      quickActions: {
        title: '빠른 액션',
        addPage: '새 페이지 추가',
        addProduct: '새 제품 추가',
        addBlogPost: '새 블로그 포스트 추가',
        addPressRelease: '새 언론보도 추가',
        addBrandStory: '새 브랜드 스토리 추가',
        viewInquiries: '문의 내역 보기'
      },
      recentActivity: {
        title: '최근 활동',
        noActivity: '최근 활동이 없습니다.'
      }
    },
    en: {
      title: 'Admin Dashboard',
      welcome: 'Hello, Administrator!',
      stats: {
        totalPages: 'Total Pages',
        totalProducts: 'Total Products',
        totalBlogPosts: 'Total Blog Posts',
        totalPressReleases: 'Total Press Releases',
        totalBrandStories: 'Total Brand Stories',
        newInquiries: 'New Inquiries',
        totalInquiries: 'Total Inquiries'
      },
      quickActions: {
        title: 'Quick Actions',
        addPage: 'Add New Page',
        addProduct: 'Add New Product',
        addBlogPost: 'Add New Blog Post',
        addPressRelease: 'Add New Press Release',
        addBrandStory: 'Add New Brand Story',
        viewInquiries: 'View Inquiries'
      },
      recentActivity: {
        title: 'Recent Activity',
        noActivity: 'No recent activity.'
      }
    }
  };

  const t = dashboardData[lang];

  // Mock data - 실제로는 API에서 가져올 데이터
  const stats = {
    pages: 5,
    products: 2,
    blogPosts: 12,
    pressReleases: 8,
    brandStories: 6,
    newInquiries: 3,
    totalInquiries: 25
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-1">{t.welcome}</p>
        </div>
        <select
          className="border rounded-lg px-3 py-2"
          value={lang}
          onChange={(e) => setLang(e.target.value as 'ko' | 'en')}
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.stats.totalPages}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🛍️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.stats.totalProducts}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.stats.totalBlogPosts}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.blogPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">📧</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.stats.newInquiries}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newInquiries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.quickActions.title}</h2>
          <div className="space-y-3">
            <Link
              href="/admin/pages/new"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">📄</span>
              <span>{t.quickActions.addPage}</span>
            </Link>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">🛍️</span>
              <span>{t.quickActions.addProduct}</span>
            </Link>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">📝</span>
              <span>{t.quickActions.addBlogPost}</span>
            </Link>
            <Link
              href="/admin/press/new"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">📰</span>
              <span>{t.quickActions.addPressRelease}</span>
            </Link>
            <Link
              href="/admin/brand-story/new"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">🏢</span>
              <span>{t.quickActions.addBrandStory}</span>
            </Link>
            <Link
              href="/admin/inquiries"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">📧</span>
              <span>{t.quickActions.viewInquiries}</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.recentActivity.title}</h2>
          <div className="text-gray-500 text-center py-8">
            <span className="text-4xl">📊</span>
            <p className="mt-2">{t.recentActivity.noActivity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 