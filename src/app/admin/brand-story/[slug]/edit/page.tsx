'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import TiptapEditor from '@/components/admin/TiptapEditor';
import SlugChecker from '@/components/admin/SlugChecker';

interface BrandStoryFormData {
  slug: string;
  content: {
    ko: { title: string; subtitle: string; body: string; thumbnail_url: string; images: any[] };
    en: { title: string; subtitle: string; body: string; thumbnail_url: string; images: any[] };
  };
  youtube_url: string;
  tags: string;
  is_published: boolean;
}

const EditBrandStoryPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState<BrandStoryFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [hasSlugConflict, setHasSlugConflict] = useState(false);
  const [isSlugValidated, setIsSlugValidated] = useState(false);
  const [originalSlug, setOriginalSlug] = useState('');

  useEffect(() => {
    fetchBrandStory();
  }, [slug]);

  const fetchBrandStory = async () => {
    try {
      const response = await fetch(`/api/brand-story/${slug}`);
      
      if (!response.ok) {
        throw new Error('브랜드 스토리를 불러올 수 없습니다.');
      }
      
      const data = await response.json();
      const brandStory = data.brandStory;
      
      setFormData({
        slug: brandStory.slug,
        content: {
          ko: {
            title: brandStory.content?.ko?.title || '',
            subtitle: brandStory.content?.ko?.subtitle || '',
            body: brandStory.content?.ko?.body || '',
            thumbnail_url: brandStory.content?.ko?.thumbnail_url || '',
            images: brandStory.content?.ko?.images || []
          },
          en: {
            title: brandStory.content?.en?.title || '',
            subtitle: brandStory.content?.en?.subtitle || '',
            body: brandStory.content?.en?.body || '',
            thumbnail_url: brandStory.content?.en?.thumbnail_url || '',
            images: brandStory.content?.en?.images || []
          }
        },
        youtube_url: brandStory.youtube_url || '',
        tags: brandStory.tags ? brandStory.tags.join(', ') : '',
        is_published: brandStory.is_published || false
      });
      
      setOriginalSlug(brandStory.slug);
      
      if (brandStory.content?.ko?.thumbnail_url) {
        setThumbnailPreview(brandStory.content.ko.thumbnail_url);
      }
    } catch (error) {
      console.error('Error fetching brand story:', error);
      addToast({
        type: 'error',
        message: '브랜드 스토리를 불러오는데 실패했습니다.'
      });
      router.push('/admin/brand-story');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const value = e.target.value;
    // 영문, 하이픈, 숫자만 허용
    const sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '');
    handleInputChange('slug', sanitizedValue);
  };

  const handleContentChange = (lang: string, field: string, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        [lang]: {
          ...formData.content[lang as keyof typeof formData.content],
          [field]: value
        }
      }
    });
  };

  const handleImagesChange = (lang: string, images: any[]) => {
    if (!formData) return;
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        [lang]: {
          ...formData.content[lang as keyof typeof formData.content],
          images
        }
      }
    });
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadThumbnail = async (file: File, slug: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', slug);
    formData.append('type', 'brand-story');

    const response = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error('썸네일 업로드에 실패했습니다.');
    }

    const result = await response.json();
    return result.url;
  };

  const parseTagsToArray = (tagsString: string): string[] => {
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);

    try {
      const payload = {
        slug: formData.slug,
        content: {
          ko: {
            title: formData.content.ko.title,
            subtitle: formData.content.ko.subtitle,
            body: formData.content.ko.body,
            thumbnail_url: thumbnailPreview || formData.content.ko.thumbnail_url,
            images: formData.content.ko.images
          },
          en: {
            title: formData.content.en.title,
            subtitle: formData.content.en.subtitle,
            body: formData.content.en.body,
            thumbnail_url: thumbnailPreview || formData.content.en.thumbnail_url,
            images: formData.content.en.images
          }
        },
        youtube_url: convertYouTubeUrl(formData.youtube_url),
        tags: parseTagsToArray(formData.tags),
        is_published: formData.is_published
      };

      const response = await fetch(`/api/brand-story/${formData.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '브랜드 스토리 수정에 실패했습니다.');
      }
      
      addToast({
        type: 'success',
        message: '브랜드 스토리가 성공적으로 수정되었습니다!'
      });
      
      // 약간의 지연 후 리다이렉트 (토스터가 보이도록)
      setTimeout(() => {
        router.push('/admin/brand-story');
      }, 1000);
      
    } catch (error) {
      console.error('[브랜드 스토리 수정 전체 에러]', error);
      addToast({
        type: 'error',
        message: '브랜드 스토리 수정 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">브랜드 스토리를 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">브랜드 스토리 수정</h1>
          <Link 
            href="/admin/brand-story" 
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  슬러그 (URL)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    placeholder="brand-story-slug"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex-shrink-0">
                    <SlugChecker
                      slug={formData.slug}
                      originalSlug={originalSlug}
                      onCheck={setHasSlugConflict}
                      onValidated={setIsSlugValidated}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  태그
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="태그1, 태그2, 태그3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  쉼표(,)로 구분하여 입력
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => handleInputChange('is_published', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">공개</span>
              </label>
            </div>
          </div>

          {/* 썸네일 업로드 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">썸네일 이미지</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  썸네일 업로드
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {thumbnailPreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">미리보기:</p>
                    <img 
                      src={thumbnailPreview} 
                      alt="썸네일 미리보기" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 한국어 콘텐츠 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">한국어 콘텐츠</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.content.ko.title}
                  onChange={(e) => handleContentChange('ko', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부제목
                </label>
                <input
                  type="text"
                  value={formData.content.ko.subtitle}
                  onChange={(e) => handleContentChange('ko', 'subtitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  본문 *
                </label>
                <TiptapEditor
                  value={formData.content.ko.body}
                  onChange={(content: string) => handleContentChange('ko', 'body', content)}
                  placeholder="브랜드 스토리 본문을 입력하세요..."
                  images={formData.content.ko.images}
                  onImagesChange={(images) => handleImagesChange('ko', images)}
                />
              </div>
            </div>
          </div>

          {/* 영어 콘텐츠 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">English Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.content.en.title}
                  onChange={(e) => handleContentChange('en', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.content.en.subtitle}
                  onChange={(e) => handleContentChange('en', 'subtitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <TiptapEditor
                  value={formData.content.en.body}
                  onChange={(content: string) => handleContentChange('en', 'body', content)}
                  placeholder="Enter brand story content..."
                  images={formData.content.en.images}
                  onImagesChange={(images) => handleImagesChange('en', images)}
                />
              </div>
            </div>
          </div>

          {/* 유튜브 URL 필드 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">유튜브 URL</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  유튜브 URL
                </label>
                <input
                  type="text"
                  value={formData.youtube_url}
                  onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  유튜브 영상 URL을 입력하면 썸네일로 변환됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/brand-story"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBrandStoryPage; 