'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';
import axios from 'axios';

interface BrandStoryCard {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  thumbnail_url: string;
  body: string;
}

const BrandStoryPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [stories, setStories] = useState<BrandStoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4); // 큰 카드 1개 + 작은 카드 3개

  useEffect(() => {
    fetchBrandStories();
  }, []);

  const fetchBrandStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/brand-story?published=true');
      if (response.data.success) {
        const brandStories = response.data.results.map((story: any) => {
          const content = story.content[i18n.language as keyof typeof story.content] || story.content.ko || story.content.en;
          return {
            slug: story.slug,
            title: content.title,
            subtitle: content.subtitle,
            date: new Date(story.published_date || story.created_at).toLocaleDateString('ko-KR'),
            thumbnail_url: content.thumbnail_url,
            body: content.body
          };
        });
        setStories(brandStories);
      }
    } catch (error) {
      console.error('브랜드 스토리 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const visibleStories = stories.slice(0, visibleCount);
  const hasMore = visibleCount < stories.length;

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('brand_story', '브랜드 스토리')}</h1>
        
        {/* 브랜드 스토리 포스팅 카드 리스트 - 최상단으로 이동 */}
        <div className="mb-20">
          {/* 로딩 상태 */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          )}
          
          {/* 포스팅 카드 리스트 */}
          {!loading && stories.length > 0 && (
            <div className="space-y-8">
              {/* 첫 번째 스토리는 특별히 크게 표시 */}
              {visibleStories.length > 0 && (
                <div className="mb-16">
                  {(() => {
                    const featuredStory = visibleStories[0];
                    
                    return (
                      <Link
                        href={`/brand-story/${featuredStory.slug}`}
                        className="group block"
                      >
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3">
                          <div className="lg:flex">
                            {/* 이미지 */}
                            <div className="lg:w-1/2 relative overflow-hidden">
                              <div className="aspect-[16/10] lg:h-96 relative">
                                <img
                                  src={featuredStory.thumbnail_url || '/logo/nonImage_logo.png'}
                                  alt={featuredStory.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  onError={e => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                                <div className="absolute top-6 left-6">
                                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-sm font-semibold shadow-lg">
                                    {t('featured_story', '주요 스토리')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* 콘텐츠 */}
                            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                              <div className="flex items-center space-x-4 mb-6">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <span>{featuredStory.date}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                  <span>{i18n.language === 'en' ? 'Brand Story' : '브랜드 스토리'}</span>
                                </div>
                              </div>
                              
                              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6 group-hover:text-amber-600 transition-colors duration-300 leading-tight">
                                {featuredStory.title}
                              </h2>
                              
                              <p className="text-lg text-gray-600 mb-8 leading-relaxed line-clamp-3">
                                {featuredStory.subtitle}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })()}
                </div>
              )}
              
              {/* 나머지 스토리들 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleStories.slice(1).map((item, index) => (
                  <Link 
                    key={item.slug} 
                    href={`/brand-story/${item.slug}`}
                    className="group block"
                  >
                    <article className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                      {/* 이미지 */}
                      <div className="relative overflow-hidden">
                        <div className="aspect-[5/3] relative">
                          <img 
                            src={item.thumbnail_url || '/logo/nonImage_logo.png'} 
                            alt={item.title} 
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
                          <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                          <span className="text-xs text-gray-500 font-medium">{item.date}</span>
                        </div>
                        
                        {/* 제목 */}
                        <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2 leading-tight">
                          {item.title}
                        </h2>
                        
                        {/* 부제목 */}
                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
              
              {/* 더보기 버튼 */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 3)}
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
          
          {/* 데이터가 없을 때 */}
          {!loading && stories.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg">등록된 브랜드 스토리가 없습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandStoryPage; 