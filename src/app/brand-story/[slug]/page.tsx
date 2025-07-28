'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BrandStoryData {
  _id: string;
  slug: string;
  content: {
    ko?: {
      title: string;
      subtitle?: string;
      body: string;
      thumbnail_url?: string;
    };
    en?: {
      title: string;
      subtitle?: string;
      body: string;
      thumbnail_url?: string;
    };
  };
  youtube_url?: string;
  tags: string[];
  created_at: string;
  is_published: boolean;
}

const BrandStoryDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const params = useParams();
  const slug = params?.slug as string;
  
  const [data, setData] = useState<BrandStoryData | null>(null);
  const [otherStories, setOtherStories] = useState<BrandStoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBrandStory();
      fetchOtherStories();
    }
  }, [slug]);

  const fetchBrandStory = async () => {
    try {
      const res = await fetch(`/api/brand-story/${slug}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('게시물을 찾을 수 없습니다.');
        } else {
          throw new Error('Failed to fetch brand story');
        }
        return;
      }
      const responseData = await res.json();
      
      if (responseData.success && responseData.brandStory) {
        setData(responseData.brandStory);
      } else {
        setError('게시물을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Error fetching brand story:', err);
      setError('게시물을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherStories = async () => {
    try {
      const response = await fetch(`/api/brand-story?published=true&limit=4`);
      if (response.ok) {
        const data = await response.json();
        setOtherStories(data.results || []);
      }
    } catch (error) {
      console.error('Error fetching other stories:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentContent = () => {
    if (!data) return null;
    const lang = i18n.language as 'ko' | 'en';
    return data.content[lang] || data.content.ko || data.content.en;
  };

  // YouTube URL을 embed 형식으로 변환하는 함수
  const convertYouTubeUrl = (url: string): string => {
    if (!url) return '';
    
    // 이미 embed 형식인 경우
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // 일반 YouTube URL을 embed 형식으로 변환
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;
    }
    
    return url;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error || t('not_found', '해당 게시물을 찾을 수 없습니다.')}
        </h1>
        <Link 
          href="/brand-story"
          className="text-blue-600 hover:text-blue-800"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const currentContent = getCurrentContent();

  return (
    <div className="w-full min-h-[60vh] bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 헤더 섹션 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {currentContent?.title || 'Untitled'}
          </h1>
          {currentContent?.subtitle && (
            <p className="text-xl text-gray-600 mb-4">{currentContent.subtitle}</p>
          )}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>{formatDate(data.created_at)}</span>
          </div>
        </div>

        {/* 유튜브 동영상 (자동재생) */}
        {data.youtube_url && (
          <div className="mb-8">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src={convertYouTubeUrl(data.youtube_url)}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* 썸네일 이미지 (유튜브가 없을 때만) */}
        {!data.youtube_url && currentContent?.thumbnail_url && (
          <div className="mb-8">
            <img 
              src={currentContent.thumbnail_url} 
              alt={currentContent.title} 
              className="w-full max-h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* 본문 내용 */}
        <div className="prose prose-lg max-w-none mx-auto mb-12">
          <div 
            dangerouslySetInnerHTML={{ __html: currentContent?.body || '' }}
            className="text-gray-800 leading-relaxed"
          />
        </div>
      </div>

      {/* 전체 너비 배경 섹션 */}
      <div className="bg-gray-50 py-16 -mt-12">
        <div className="w-full px-4">
          {/* 추천 스토리 슬라이드 */}
          {otherStories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                {t('other_stories', '다른 스토리가 궁금하시다면?')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {otherStories.map(story => {
                  const storyContent = story.content[i18n.language as 'ko' | 'en'] || story.content.ko || story.content.en;
                  // storyContent가 객체인지 확인하고 안전하게 처리
                  const title = typeof storyContent === 'object' && storyContent?.title ? storyContent.title : 'Untitled';
                  const subtitle = typeof storyContent === 'object' && storyContent?.subtitle ? storyContent.subtitle : '';
                  const thumbnail_url = typeof storyContent === 'object' && storyContent?.thumbnail_url ? storyContent.thumbnail_url : '';
                  
                  return (
                    <Link 
                      key={story.slug} 
                      href={`/brand-story/${story.slug}`}
                      className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      {thumbnail_url && (
                        <img 
                          src={thumbnail_url} 
                          alt={title} 
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-sm font-semibold mb-2 text-gray-900 group-hover:text-[#bda191] transition-colors line-clamp-2">
                          {title}
                        </h3>
                        {subtitle && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{subtitle}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          {formatDate(story.created_at)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* 목록으로 돌아가기 */}
          <div className="text-center">
            <Link 
              href="/brand-story"
              className="inline-flex items-center px-6 py-3 bg-[#bda191] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#a8927f] transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              브랜드 스토리 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandStoryDetailPage; 