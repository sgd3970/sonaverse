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
      subtitle: string;
      body: string;
      thumbnail_url: string;
    };
    en?: {
      title: string;
      subtitle: string;
      body: string;
      thumbnail_url: string;
    };
  };
  created_at: string;
  last_updated: string;
  tags: string[];
}

function applyImageMetadataToBody(body: string, images: any[] = []) {
  if (!images || images.length === 0) return body;
  try {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(body, 'text/html');
    const imgTags = doc.querySelectorAll('img');
    imgTags.forEach(img => {
      const meta = images.find(m => img.src.includes((m.src || '').split('/').pop() || ''));
      if (meta) {
        // 비율(%)에 따라 컨테이너 width 설정, aspect-ratio는 원본 비율
        const displaysize = meta.displaysize || 100;
        const aspect = meta.originalWidth && meta.originalHeight ? meta.originalWidth / meta.originalHeight : 16 / 9;
        // 컨테이너 스타일 적용 (inline style)
        const wrapper = doc.createElement('div');
        wrapper.style.width = `${displaysize}%`;
        wrapper.style.maxWidth = '100%';
        wrapper.style.aspectRatio = `${meta.originalWidth} / ${meta.originalHeight}`;
        wrapper.style.maxHeight = '500px';
        wrapper.style.margin = '24px auto';
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        wrapper.style.background = 'none';
        wrapper.style.overflow = 'hidden';
        // 이미지 스타일
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain'; // 비율 유지, 잘림 없음
        img.style.objectPosition = 'center';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.borderRadius = '8px';
        // 기존 부모에서 img를 빼서 wrapper에 넣기
        const parent = img.parentNode;
        if (parent) {
          parent.replaceChild(wrapper, img);
        }
        wrapper.appendChild(img);
      }
    });
    return doc.body.innerHTML;
  } catch (e) {
    console.error('[상세페이지] 이미지 메타데이터 적용 오류:', e);
    return body;
  }
}

const BlogDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const params = useParams();
  const slug = params.slug as string;
  
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 항상 Hook 최상단에서 호출
  const content = blogPost?.content[i18n.language as keyof typeof blogPost.content] || blogPost?.content.ko || blogPost?.content.en || { body: '' };
  const [bodyWithImageMeta, setBodyWithImageMeta] = useState(content.body);
  useEffect(() => {
    if (content.body && 'images' in content && Array.isArray((content as any).images)) {
      setBodyWithImageMeta(applyImageMetadataToBody(content.body, (content as any).images));
    } else {
      setBodyWithImageMeta(content.body || '');
    }
  }, [content.body, (content as any).images]);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug, i18n.language]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog/${slug}`);
      console.log('[상세페이지] API 응답 status:', res.status);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('블로그 포스트를 찾을 수 없습니다.');
        }
        throw new Error('블로그 포스트를 불러오는데 실패했습니다.');
      }
      
      const data = await res.json();
      console.log('[상세페이지] API 데이터:', data);
      setBlogPost(data);
    } catch (err) {
      console.error('[상세페이지] fetchBlogPost 에러:', err);
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

  if (blogPost) {
    console.log('[상세페이지] 렌더링 blogPost:', blogPost);
    console.log('[상세페이지] 렌더링 content:', content);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 rounded-md bg-[#f0ece9] text-[#22223b] hover:bg-[#e6e2dd] transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('back_to_list', '목록으로 돌아가기')}
          </Link>
        </div>

        {/* 헤더 */}
        <article>
          {/* 썸네일 이미지 */}
          {'thumbnail_url' in content && content.thumbnail_url && (
            <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
              <img
                src={content.thumbnail_url}
                alt={'title' in content ? content.title : ''}
                className="object-contain object-center max-w-full h-auto"
                style={{ maxHeight: '100%' }}
              />
            </div>
          )}

          {/* 콘텐츠 */}
          <div className="p-8">
            {/* 제목 */}
            {'title' in content && (
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {content.title}
              </h1>
            )}

            {/* 부제목 */}
            {'subtitle' in content && (
              <p className="text-xl text-gray-600 mb-6">
                {content.subtitle}
              </p>
            )}

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
            {/* {blogPost.tags && blogPost.tags.length > 0 && (
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
            )} */}

            {/* 본문 */}
            <div 
              className="prose prose-lg max-w-none"
              style={{ wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: bodyWithImageMeta }}
            />
          </div>
        </article>
      </div>
      {/* 본문 스타일 커스텀: a 태그 기본 스타일 제거 */}
      <style jsx global>{`
        .prose a {
          color: inherit !important;
          text-decoration: none !important;
          font-weight: inherit !important;
          background: none !important;
          transition: background 0.2s;
        }
        .prose a:hover {
          background: #f0ece9;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage; 