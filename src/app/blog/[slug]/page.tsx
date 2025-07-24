'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import '../../i18n';

interface BlogPost {
  _id: string;
  slug: string;
  content: {
    ko?: {
      title: string;
      summary: string;
      body: string;
      thumbnail_url: string;
    };
    en?: {
      title: string;
      summary: string;
      body: string;
      thumbnail_url: string;
    };
  };
  created_at: string;
  last_updated: string;
  tags: string[];
}

const BlogDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const params = useParams();
  const slug = params.slug as string;
  
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug, i18n.language]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog/${slug}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('블로그 포스트를 찾을 수 없습니다.');
        }
        throw new Error('블로그 포스트를 불러오는데 실패했습니다.');
      }
      
      const data = await res.json();
      setBlogPost(data);
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError(err instanceof Error ? err.message : '블로그 포스트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '. ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">블로그 포스트를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t('error_occurred', '오류가 발생했습니다')}
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/blog"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {t('back_to_list', '목록으로 돌아가기')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const content = blogPost.content[i18n.language as keyof typeof blogPost.content] || blogPost.content.ko || blogPost.content.en;
  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">콘텐츠를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('back_to_list', '목록으로 돌아가기')}
          </Link>
        </div>

        {/* 헤더 */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 썸네일 이미지 */}
          {content.thumbnail_url && (
            <div className="w-full h-64 md:h-96 bg-gray-200">
              <img
                src={content.thumbnail_url}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 콘텐츠 */}
          <div className="p-8">
            {/* 제목 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>

            {/* 부제목 */}
            <p className="text-xl text-gray-600 mb-6">
              {content.summary}
            </p>

            {/* 메타 정보 */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <span>{formatDate(blogPost.created_at)}</span>
                <span>|</span>
                <span>{i18n.language === 'en' ? 'Sonaverse Co., Ltd.' : '(주) 소나버스'}</span>
              </div>
              {blogPost.last_updated !== blogPost.created_at && (
                <span className="text-xs">
                  수정: {formatDate(blogPost.last_updated)}
                </span>
              )}
            </div>

            {/* 태그 */}
            {blogPost.tags && blogPost.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 본문 */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.body }}
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage; 