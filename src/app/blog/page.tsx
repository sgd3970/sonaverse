'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import '../i18n';

interface BlogPost {
  _id: string;
  slug: string;
  content: {
    ko?: {
      title: string;
      subtitle: string;
      thumbnail_url: string;
    };
    en?: {
      title: string;
      subtitle: string;
      thumbnail_url: string;
    };
  };
  created_at: string;
  tags: string[];
}

const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, [i18n.language]);

  const fetchBlogPosts = async (search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '100', // 충분히 큰 값으로 전체 데이터 가져오기
        published: 'true'
      });
      if (search) {
        params.append('search', search);
      }
      const res = await fetch(`/api/blog?${params}`);
      if (!res.ok) throw new Error('Failed to fetch blog posts');
      const data = await res.json();
      setBlogPosts(data.results || []);
      setVisibleCount(6); // 검색 시 초기화
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('블로그 포스트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      fetchBlogPosts(value);
    }, 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '. ');
  };

  if (loading && blogPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">블로그 포스트를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const visiblePosts = blogPosts.slice(0, visibleCount);
  const hasMore = visibleCount < blogPosts.length;

  if (blogPosts && blogPosts.length > 0) {
    visiblePosts.forEach((post, idx) => {
      const content = post.content[i18n.language as keyof typeof post.content] || post.content.ko || post.content.en;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            {t('blog', '블로그')}
          </h1>
          <p className="text-lg text-gray-600">소나버스의 인사이트를 만나보세요</p>
        </div>

        {/* 블로그 포스트 그리드 */}
        {visiblePosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <p className="text-gray-500 text-lg">{t('no_results', '검색 결과가 없습니다.')}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {visiblePosts.map((post) => {
              const content = post.content[i18n.language as keyof typeof post.content] || post.content.ko || post.content.en;
              if (!content) return null;
              return (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                >
                  {/* 이미지 */}
                  <div className="aspect-[5/3] w-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img
                      src={content.thumbnail_url || '/logo/nonImage_logo.png'}
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                    />
                  </div>
                  
                  {/* 본문 */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* 제목 */}
                    <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-slate-600 transition-colors min-h-[3.5rem]">
                      {content.title}
                    </h2>
                    
                    {/* 부제목 */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow min-h-[2.5rem]">
                      {content.subtitle}
                    </p>
                    
                    {/* 하단 정보 */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{formatDate(post.created_at)}</span>
                        <span className="mx-2">•</span>
                        <span>{i18n.language === 'en' ? 'Sonaverse' : '소나버스'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* 더 알아보기 버튼 */}
        {hasMore && (
          <div className="flex justify-center mt-16">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="inline-flex items-center px-8 py-4 text-base font-semibold bg-slate-800 text-white rounded-full hover:bg-slate-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('load_more', '더 알아보기')}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
        
        {/* 검색 기능 추가 */}
        <div className="flex justify-center mt-16">
          <div className="w-full max-w-md relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="블로그 포스트 검색..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all bg-white"
            />
          </div>
        </div>
      </div>
      <style jsx global>{`
        img.default-symbol {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default BlogPage; 