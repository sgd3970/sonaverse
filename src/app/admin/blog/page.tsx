'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const BlogManagement: React.FC = () => {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [searchTerm, setSearchTerm] = useState('');

  const blogData = {
    ko: {
      title: '블로그 관리',
      addNew: '새 포스트 추가',
      search: '포스트 검색...',
      table: {
        title: '제목',
        summary: '요약',
        tags: '태그',
        status: '상태',
        publishedDate: '발행일',
        lastUpdated: '마지막 수정',
        actions: '작업'
      },
      status: {
        published: '발행됨',
        draft: '임시저장',
        archived: '보관됨'
      },
      actions: {
        edit: '수정',
        delete: '삭제',
        view: '보기',
        preview: '미리보기'
      },
      noPosts: '등록된 포스트가 없습니다.'
    },
    en: {
      title: 'Blog Management',
      addNew: 'Add New Post',
      search: 'Search posts...',
      table: {
        title: 'Title',
        summary: 'Summary',
        tags: 'Tags',
        status: 'Status',
        publishedDate: 'Published Date',
        lastUpdated: 'Last Updated',
        actions: 'Actions'
      },
      status: {
        published: 'Published',
        draft: 'Draft',
        archived: 'Archived'
      },
      actions: {
        edit: 'Edit',
        delete: 'Delete',
        view: 'View',
        preview: 'Preview'
      },
      noPosts: 'No posts found.'
    }
  };

  const t = blogData[lang];

  // Mock data - 실제로는 API에서 가져올 데이터
  const posts = [
    {
      id: '1',
      title: { ko: '만보 보행기의 혁신적인 디자인', en: 'Innovative Design of Manbo Walker' },
      summary: { ko: '어르신들의 안전과 편안함을 위한 혁신적인 디자인에 대해 알아보세요.', en: 'Learn about the innovative design for the safety and comfort of seniors.' },
      tags: ['보행기', '디자인', '안전'],
      status: 'published',
      published_date: '2024-01-15',
      last_updated: '2024-01-15',
      updated_by: 'admin'
    },
    {
      id: '2',
      title: { ko: '보듬 기저귀의 품질 관리', en: 'Quality Management of Bodeum Diaper' },
      summary: { ko: '최고 품질의 기저귀를 위한 철저한 품질 관리 과정을 소개합니다.', en: 'Introducing the thorough quality management process for premium diapers.' },
      tags: ['기저귀', '품질관리', '프리미엄'],
      status: 'draft',
      published_date: null,
      last_updated: '2024-01-10',
      updated_by: 'admin'
    },
    {
      id: '3',
      title: { ko: '고객 만족도 향상을 위한 노력', en: 'Efforts to Improve Customer Satisfaction' },
      summary: { ko: '고객의 만족을 위해 지속적으로 노력하는 우리 회사의 이야기입니다.', en: 'Our company\'s story of continuous efforts for customer satisfaction.' },
      tags: ['고객만족', '서비스', '품질'],
      status: 'published',
      published_date: '2024-01-05',
      last_updated: '2024-01-05',
      updated_by: 'admin'
    }
  ];

  const filteredPosts = posts.filter(post =>
    post.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-1">
            {lang === 'ko' ? '블로그 포스트를 관리합니다.' : 'Manage blog posts.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="border rounded-lg px-3 py-2"
            value={lang}
            onChange={(e) => setLang(e.target.value as 'ko' | 'en')}
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
          <Link
            href="/admin/blog/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.addNew}
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.title}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.summary}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.tags}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.publishedDate}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {post.title[lang]}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {post.summary[lang]}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : post.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {t.status[post.status as keyof typeof t.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {post.published_date || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {t.actions.edit}
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          {t.actions.view}
                        </Link>
                        <Link
                          href={`/blog/${post.id}`}
                          target="_blank"
                          className="text-purple-600 hover:text-purple-900"
                        >
                          {t.actions.preview}
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            if (confirm(lang === 'ko' ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete?')) {
                              // Delete logic here
                            }
                          }}
                        >
                          {t.actions.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {t.noPosts}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement; 