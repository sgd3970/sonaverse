'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import TiptapEditorDynamic from '@/components/admin/TiptapEditorDynamic';
import type { TiptapEditorRef } from '@/components/admin/TiptapEditor';

interface BlogFormData {
  slug: string;
  content: {
    ko: { title: string; subtitle: string; body: string; thumbnail_url: string };
    en: { title: string; subtitle: string; body: string; thumbnail_url: string };
  };
  tags: string;
  is_published: boolean;
}

const EditBlogPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogFormData | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  // 에디터 ref 추가
  const koEditorRef = useRef<TiptapEditorRef>(null);
  const enEditorRef = useRef<TiptapEditorRef>(null);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        throw new Error('블로그 포스트를 불러올 수 없습니다.');
      }
      
      const data = await response.json();
      setFormData({
        slug: data.slug,
        content: {
          ko: {
            title: data.content.ko?.title || '',
            subtitle: data.content.ko?.subtitle || '',
            body: data.content.ko?.body || '',
            thumbnail_url: data.content.ko?.thumbnail_url || ''
          },
          en: {
            title: data.content.en?.title || '',
            subtitle: data.content.en?.subtitle || '',
            body: data.content.en?.body || '',
            thumbnail_url: data.content.en?.thumbnail_url || ''
          }
        },
        tags: (data.tags || []).join(', '),
        is_published: data.is_published || false
      });

      // 기존 썸네일이 있으면 미리보기 설정
      if (data.content.ko?.thumbnail_url) {
        setThumbnailPreview(data.content.ko.thumbnail_url);
      }
    } catch (error) {
      console.error('블로그 포스트 로딩 오류:', error);
      alert('블로그 포스트를 불러오는데 실패했습니다.');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null);
  };

  const handleContentChange = (lang: string, field: string, value: string) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang as keyof typeof prev.content],
          [field]: value
        }
      }
    }) : null);
  };

  // 썸네일 파일 선택 핸들러 (임시 저장만)
  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !formData) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setThumbnailFile(file);
    
    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 썸네일 업로드 함수 (실제 blob 업로드)
  const uploadThumbnail = async (file: File, slug: string) => {
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('type', 'thumbnail');
      formDataObj.append('filename', `${slug}_thumbnail`);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '썸네일 업로드 실패');
      }

      const result = await response.json();
      return result.url;

    } catch (error) {
      console.error('썸네일 업로드 오류:', error);
      throw error;
    }
  };

  // 태그 문자열을 배열로 변환
  const parseTagsToArray = (tagsString: string): string[] => {
    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;

    // 유효성 검사
    if (!formData.content.ko.title) {
      alert('한국어 제목을 입력해주세요.');
      return;
    }

    if (!formData.content.ko.body) {
      alert('한국어 본문을 입력해주세요.');
      return;
    }

    setLoading(true);
    
    try {
      let thumbnailUrl = formData.content.ko.thumbnail_url; // 기존 썸네일 URL 유지

      // 새 썸네일이 있는 경우 업로드
      if (thumbnailFile) {
        try {
          thumbnailUrl = await uploadThumbnail(thumbnailFile, formData.slug);
        } catch (error) {
          alert('썸네일 업로드에 실패했습니다.');
          setLoading(false);
          return;
        }
      }

      // 에디터의 임시 이미지를 실제 blob으로 업로드
      let updatedKoBody = formData.content.ko.body;
      let updatedEnBody = formData.content.en.body;

      if (koEditorRef.current) {
        try {
          updatedKoBody = await koEditorRef.current.uploadTempImagesToBlob(formData.slug);
        } catch (error) {
          console.error('한국어 에디터 이미지 업로드 실패:', error);
        }
      }

      if (enEditorRef.current) {
        try {
          updatedEnBody = await enEditorRef.current.uploadTempImagesToBlob(formData.slug);
        } catch (error) {
          console.error('영어 에디터 이미지 업로드 실패:', error);
        }
      }

      const tagsArray = parseTagsToArray(formData.tags);
      
      const submitData = {
        ...formData,
        content: {
          ko: { 
            ...formData.content.ko, 
            body: updatedKoBody,
            thumbnail_url: thumbnailUrl
          },
          en: { 
            ...formData.content.en, 
            body: updatedEnBody,
            thumbnail_url: thumbnailUrl
          }
        },
        tags: tagsArray
      };

      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '블로그 포스트 수정에 실패했습니다.');
      }

      alert('블로그 포스트가 성공적으로 수정되었습니다.');
      router.push('/admin/blog');
      
    } catch (error) {
      console.error('블로그 포스트 수정 오류:', error);
      alert(error instanceof Error ? error.message : '블로그 포스트 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중이거나 데이터가 없으면 로딩 표시
  if (!formData) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">블로그 포스트를 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">블로그 포스트 수정</h1>
          <Link 
            href="/admin/blog" 
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
                <input
                  type="text"
                  value={formData.slug}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  슬러그는 수정할 수 없습니다.
                </p>
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
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">발행됨</span>
              </label>
            </div>
          </div>

          {/* 썸네일 업로드 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">썸네일 이미지</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                썸네일 (공통)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {thumbnailFile && (
                <p className="text-sm text-orange-600 mt-2">
                  📸 새 썸네일이 임시 저장되었습니다. 수정 버튼 클릭 시 업로드됩니다.
                </p>
              )}
              {thumbnailPreview && (
                <div className="mt-4">
                  <img 
                    src={thumbnailPreview} 
                    alt="썸네일 미리보기" 
                    className="max-w-xs h-auto rounded-lg border"
                  />
                  {thumbnailFile && (
                    <p className="text-xs text-gray-500 mt-1">새로 선택된 썸네일</p>
                  )}
                </div>
              )}
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
                <TiptapEditorDynamic
                  ref={koEditorRef}
                  value={formData.content.ko.body}
                  onChange={(value) => handleContentChange('ko', 'body', value)}
                  slug={formData.slug}
                  placeholder="한국어 본문을 입력하세요..."
                />
              </div>
            </div>
          </div>

          {/* 영어 콘텐츠 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">영어 콘텐츠</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.content.en.title}
                  onChange={(e) => handleContentChange('en', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부제목
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
                  본문
                </label>
                <TiptapEditorDynamic
                  ref={enEditorRef}
                  value={formData.content.en.body}
                  onChange={(value) => handleContentChange('en', 'body', value)}
                  slug={formData.slug}
                  placeholder="영어 본문을 입력하세요..."
                />
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4">
            <Link 
              href="/admin/blog"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '수정 중...' : '블로그 포스트 수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPage; 