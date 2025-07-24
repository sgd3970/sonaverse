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
      summary: string;
      thumbnail_url: string;
    };
    en?: {
      title: string;
      summary: string;
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

  return (
    <div className="min-h-screen bg-[#f8f6f2] w-full py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-gray-900" style={{ fontSize: 'clamp(1.2rem, 3vw, 2.2rem)' }}>
            {t('blog', '블로그')}
          </h1>
        </div>

        {/* 블로그 포스트 그리드 */}
        {visiblePosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
              {t('no_results', '검색 결과가 없습니다.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {visiblePosts.map((post) => {
              const content = post.content[i18n.language as keyof typeof post.content] || post.content.ko || post.content.en;
              if (!content) return null;
              return (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="bg-[#f8f6f2] rounded-lg overflow-hidden flex flex-col"
                  style={{ minWidth: 220 }}
                >
                  {/* 이미지 */}
                  <div className="aspect-[5/3] w-full bg-gray-200">
                    <img
                      src={content.thumbnail_url || '/logo/nonImage_logo.png'}
                      alt={content.title}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                    />
                  </div>
                  {/* 본문 */}
                  <div className="p-4 flex flex-col flex-1">
                    <h2
                      className="font-bold text-gray-900 truncate"
                      style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}
                    >
                      {content.title}
                    </h2>
                    <p
                      className="text-gray-700 truncate"
                      style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)' }}
                    >
                      {content.summary}
                    </p>
                    <div className="flex items-center text-gray-500 mt-auto pt-2" style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}>
                      <span>{formatDate(post.created_at)}</span>
                      <span className="mx-2">|</span>
                      <span>{i18n.language === 'en' ? 'Sonaverse Co., Ltd.' : '(주) 소나버스'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* 더 알아보기 버튼 */}
        {hasMore && (
          <div className="flex justify-center mt-12 mb-0">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="rounded-lg font-semibold transition-colors px-8 py-3"
              style={{ backgroundColor: '#f0ece9', color: '#22223b', fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)' }}
            >
              {t('load_more', '더 알아보기')}
            </button>
          </div>
        )}
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