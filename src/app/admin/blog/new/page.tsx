'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TiptapEditorDynamic from '@/components/admin/TiptapEditorDynamic';
import type { TiptapEditorRef } from '@/components/admin/TiptapEditor';

const NewBlogPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    content: {
      ko: { title: '', subtitle: '', body: '', thumbnail_url: '' },
      en: { title: '', subtitle: '', body: '', thumbnail_url: '' }
    },
    tags: '',
    is_published: true
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  // 에디터 ref 추가
  const koEditorRef = useRef<TiptapEditorRef>(null);
  const enEditorRef = useRef<TiptapEditorRef>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContentChange = (lang: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang as keyof typeof prev.content],
          [field]: value
        }
      }
    }));
  };

  // 썸네일 파일 선택 핸들러 (임시 저장만)
  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      // 미리보기를 위한 임시 URL 생성
      const tempUrl = URL.createObjectURL(file);
      setThumbnailPreview(tempUrl);
    }
  };

  // 썸네일을 실제 blob으로 업로드하는 함수
  const uploadThumbnail = async (file: File, slug: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `blog/${slug}`);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('썸네일 업로드 실패');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleInputChange('slug', value);
  };

  const parseTagsToArray = (tagsString: string): string[] => {
    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug.trim() || !formData.content.ko.title.trim() || !formData.content.en.title.trim()) {
      alert('필수 필드를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    
    try {
      let thumbnailUrl = '';

      // 썸네일 업로드 (있는 경우)
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

      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '블로그 포스트 생성에 실패했습니다.');
      }

      alert('블로그 포스트가 성공적으로 생성되었습니다!');
      router.push('/admin/blog');
    } catch (error) {
      console.error('블로그 포스트 생성 오류:', error);
      alert(error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">새 블로그 포스트 작성</h1>
            <Link
              href="/admin/blog"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← 목록으로 돌아가기
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  슬러그 (URL) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="예: my-blog-post"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="예: 기술, 혁신, 제품"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
                    <p className="text-xs text-orange-600 mt-1">※ 임시 이미지입니다. 생성 버튼 클릭 시 실제 업로드됩니다.</p>
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
                  제목 *
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
                  본문 *
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

          {/* 공개 설정 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">공개 설정</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="is_published" className="text-sm text-gray-700">
                즉시 공개
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/blog"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '생성 중...' : '생성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBlogPage; 