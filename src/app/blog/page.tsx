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
  const [visibleCount, setVisibleCount] = useState(4); // 큰 카드 1개 + 작은 카드 3개
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
      setVisibleCount(4); // 검색 시 초기화
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
            <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{t('no_results', '검색 결과가 없습니다.')}</h3>
              <p className="text-gray-500">다른 키워드로 검색해보세요</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 첫 번째 포스트는 특별히 크게 표시 */}
            {visiblePosts.length > 0 && (
              <div className="mb-16">
                {(() => {
                  const featuredPost = visiblePosts[0];
                  const content = featuredPost.content[i18n.language as keyof typeof featuredPost.content] || featuredPost.content.ko || featuredPost.content.en;
                  if (!content) return null;
                  
                  return (
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3">
                        <div className="lg:flex">
                          {/* 이미지 */}
                          <div className="lg:w-1/2 relative overflow-hidden">
                            <div className="aspect-[16/10] lg:h-96 relative">
                              <img
                                src={content.thumbnail_url || '/logo/nonImage_logo.png'}
                                alt={content.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={e => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                              <div className="absolute top-6 left-6">
                                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-sm font-semibold shadow-lg">
                                  Featured Article
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* 콘텐츠 */}
                          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                            <div className="flex items-center space-x-4 mb-6">
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <span>{formatDate(featuredPost.created_at)}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{i18n.language === 'en' ? 'SONAVERSE' : '소나버스'}</span>
                              </div>
                            </div>
                            
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6 group-hover:text-rose-600 transition-colors duration-300 leading-tight">
                              {content.title}
                            </h2>
                            
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed line-clamp-3">
                              {content.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })()}
              </div>
            )}
            
            {/* 나머지 포스트들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePosts.slice(1).map((post, index) => {
                const content = post.content[i18n.language as keyof typeof post.content] || post.content.ko || post.content.en;
                if (!content) return null;
                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <article className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                      {/* 이미지 */}
                      <div className="relative overflow-hidden">
                        <div className="aspect-[5/3] relative">
                          <img
                            src={content.thumbnail_url || '/logo/nonImage_logo.png'}
                            alt={content.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={e => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                      
                      {/* 콘텐츠 */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* 메타 정보 */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"></div>
                          <span className="text-xs text-gray-500 font-medium">{formatDate(post.created_at)}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{i18n.language === 'en' ? 'SONAVERSE' : '소나버스'}</span>
                        </div>
                        
                        {/* 제목 */}
                        <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-rose-600 transition-colors duration-300 line-clamp-2 leading-tight">
                          {content.title}
                        </h2>
                        
                        {/* 부제목 */}
                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                          {content.subtitle}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
            
            {/* 더보기 버튼 */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-2xl font-semibold hover:bg-slate-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('load_more', '더 알아보기')}
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            )}
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