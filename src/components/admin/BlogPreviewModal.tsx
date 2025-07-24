'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface IImageMetadata {
  src: string;
  alt?: string;
  alignment: 'left' | 'center' | 'right';
  displaySize: '25%' | '50%' | '75%' | '100%';
  originalWidth?: number;
  originalHeight?: number;
  uploadedAt: Date;
}

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogData: {
    slug: string;
    content: {
      ko: { title: string; subtitle: string; body: string; thumbnail_url: string; images?: IImageMetadata[] };
      en: { title: string; subtitle: string; body: string; thumbnail_url: string; images?: IImageMetadata[] };
    };
    tags: string[];
    created_at?: string;
  };
  currentLanguage: 'ko' | 'en';
  onLanguageChange?: (lang: 'ko' | 'en') => void;
}

const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({
  isOpen,
  onClose,
  blogData,
  currentLanguage,
  onLanguageChange
}) => {
  const { t } = useTranslation('common');

  // 이미지 메타데이터를 DOM에 적용하는 함수
  const applyImageMetadata = (content: { body: string; images?: IImageMetadata[] }) => {
    if (!content.images || content.images.length === 0) return content.body;

    // DOM 파서로 HTML 파싱
    const parser = new DOMParser();
    const doc = parser.parseFromString(content.body, 'text/html');
    const images = doc.querySelectorAll('img');

    images.forEach((img) => {
      // 이미지 메타데이터 찾기 (더 유연한 매칭)
      const metadata = content.images?.find(meta => {
        // 정확한 URL 매칭
        if (meta.src === img.src) return true;
        
        // 파일명으로 매칭
        const metaFilename = meta.src.split('/').pop()?.split('?')[0];
        const imgFilename = img.src.split('/').pop()?.split('?')[0];
        if (metaFilename && imgFilename && metaFilename === imgFilename) return true;
        
        // 부분 URL 매칭
        if (img.src.includes(meta.src) || meta.src.includes(img.src)) return true;
        
        return false;
      });

      if (metadata) {
        console.log('미리보기 모달 이미지 메타데이터 적용:', { src: img.src, metadata });
        // 메타데이터 속성 적용
        img.setAttribute('data-alignment', metadata.alignment);
        img.setAttribute('data-size', metadata.displaySize);
        if (metadata.alt) img.alt = metadata.alt;

        // 정렬 클래스 적용
        img.classList.add(`image-align-${metadata.alignment}`);

        // 이미지 크기 적용 (미리보기 기준)
        const baseWidth = 400; // 미리보기 콘텐츠 영역 기본 너비
        let displayWidth: string;
        
        switch (metadata.displaySize) {
          case '25%':
            displayWidth = `${baseWidth * 0.25}px`;
            break;
          case '50%':
            displayWidth = `${baseWidth * 0.5}px`;
            break;
          case '75%':
            displayWidth = `${baseWidth * 0.75}px`;
            break;
          case '100%':
          default:
            displayWidth = '100%';
            break;
        }

        // 인라인 스타일 적용
        img.style.width = displayWidth;
        img.style.height = 'auto';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';

        // 정렬 스타일 적용
        if (metadata.alignment === 'left') {
          img.style.float = 'left';
          img.style.margin = '0 16px 12px 0';
          img.style.clear = 'left';
        } else if (metadata.alignment === 'right') {
          img.style.float = 'right';
          img.style.margin = '0 0 12px 16px';
          img.style.clear = 'right';
        } else {
          img.style.float = 'none';
          img.style.margin = '12px auto';
          img.style.display = 'block';
          img.style.clear = 'both';
        }
      }
    });

    return doc.body.innerHTML;
  };

  if (!isOpen) return null;

  const content = blogData.content[currentLanguage];
  const formattedDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\./g, '. ');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full h-[90vh] flex">
        {/* 헤더 */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 왼쪽: 카드 뷰 */}
        <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2">📋 카드 뷰 미리보기</h2>
            <p className="text-sm text-gray-600">블로그 목록에서 보이는 모습</p>
          </div>
          
          {/* 카드 컴포넌트 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-sm mx-auto">
            {/* 썸네일 */}
            {content.thumbnail_url && (
              <div className="w-full h-48 bg-gray-200">
                <img
                  src={content.thumbnail_url}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* 카드 내용 */}
            <div className="p-4">
              {/* 제목 */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {content.title}
              </h3>
              
              {/* 부제목 */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {content.subtitle}
              </p>
              
              {/* 본문 미리보기 */}
              <div 
                className="text-gray-700 text-sm leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ 
                  __html: content.body.replace(/<[^>]*>/g, '').substring(0, 100) + '...' 
                }}
              />
              
              {/* 태그 */}
              {blogData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {blogData.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {blogData.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{blogData.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              {/* 메타 정보 */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>{formattedDate}</span>
                <span>{currentLanguage === 'en' ? 'Sonaverse Co., Ltd.' : '(주) 소나버스'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 상세 뷰 */}
        <div className="w-1/2 overflow-y-auto">
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2">📄 상세 뷰 미리보기</h2>
              <p className="text-sm text-gray-600">블로그 상세페이지에서 보이는 모습</p>
            </div>
            
            {/* 상세 페이지 컨텐츠 */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* 콘텐츠 */}
              <div className="p-6">
                {/* 제목 */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {content.title}
                </h1>

                {/* 부제목 */}
                <p className="text-lg text-gray-600 mb-4">
                  {content.subtitle}
                </p>

                {/* 메타 정보 */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <span>{formattedDate}</span>
                    <span>|</span>
                    <span>{currentLanguage === 'en' ? 'Sonaverse Co., Ltd.' : '(주) 소나버스'}</span>
                  </div>
                </div>

                {/* 태그 */}
                {blogData.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {blogData.tags.map((tag, index) => (
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
                  className="prose prose-lg max-w-none blog-content"
                  dangerouslySetInnerHTML={{ __html: applyImageMetadata(content) }}
                />
              </div>
            </article>
          </div>
        </div>
      </div>
      
      {/* 언어 전환 탭 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-1 flex">
        <button
          onClick={() => onLanguageChange?.('ko')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentLanguage === 'ko' 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          한국어
        </button>
        <button
          onClick={() => onLanguageChange?.('en')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentLanguage === 'en' 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          English
        </button>
      </div>
    </div>
  );
};

export default BlogPreviewModal; 