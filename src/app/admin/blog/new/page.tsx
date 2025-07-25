'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TiptapEditorDynamic from '@/components/admin/TiptapEditorDynamic';
import BlogPreviewModal from '@/components/admin/BlogPreviewModal';
import FloatingToolbar from '@/components/admin/FloatingToolbar';
import type { TiptapEditorRef } from '@/components/admin/TiptapEditor';

const NewBlogPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    content: {
      ko: { title: '', subtitle: '', body: '', thumbnail_url: '', images: [] },
      en: { title: '', subtitle: '', body: '', thumbnail_url: '', images: [] }
    },
    tags: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  
  // 에디터 ref 추가
  const koEditorRef = useRef<TiptapEditorRef>(null);
  const enEditorRef = useRef<TiptapEditorRef>(null);
  
  // 현재 활성 에디터 추적
  const [activeEditor, setActiveEditor] = useState<any>(null);

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

  // 이미지 메타데이터 변경 핸들러
  const handleImagesChange = (lang: string, images: any[]) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang as keyof typeof prev.content],
          images
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
    console.log('[블로그 생성] 제출 formData:', formData);
    
    try {
      let thumbnailUrl = '';

      // 썸네일 업로드 (있는 경우)
      if (thumbnailFile) {
        try {
          thumbnailUrl = await uploadThumbnail(thumbnailFile, formData.slug);
          console.log('[썸네일 업로드 성공] URL:', thumbnailUrl);
        } catch (error) {
          console.error('[썸네일 업로드 실패]', error);
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
          console.log('[한국어 본문 이미지 업로드 후 HTML]', updatedKoBody);
        } catch (error) {
          console.error('[한국어 에디터 이미지 업로드 실패]:', error);
        }
      }

      if (enEditorRef.current) {
        try {
          updatedEnBody = await enEditorRef.current.uploadTempImagesToBlob(formData.slug);
          console.log('[영어 본문 이미지 업로드 후 HTML]', updatedEnBody);
        } catch (error) {
          console.error('[영어 에디터 이미지 업로드 실패]:', error);
        }
      }

      // 최종 DB로 전송할 데이터 구조
      const payload = {
        ...formData,
        thumbnail_url: thumbnailUrl,
        content: {
          ko: {
            ...formData.content.ko,
            body: updatedKoBody,
          },
          en: {
            ...formData.content.en,
            body: updatedEnBody,
          }
        }
      };
      console.log('[최종 DB 전송 payload]', payload);

      // 실제 API 요청
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log('[블로그 생성 API 응답]', result);

      if (!response.ok) {
        alert(result.error || '블로그 생성에 실패했습니다.');
        setLoading(false);
        return;
      }

      alert('블로그가 성공적으로 생성되었습니다!');
      window.location.href = '/admin/blog';
    } catch (error) {
      console.error('[블로그 생성 전체 에러]', error);
      alert('블로그 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
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
                  images={formData.content.ko.images}
                  onImagesChange={(images) => handleImagesChange('ko', images)}
                  onEditorFocus={(editor) => setActiveEditor(editor)}
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
                  images={formData.content.en.images}
                  onImagesChange={(images) => handleImagesChange('en', images)}
                  onEditorFocus={(editor) => setActiveEditor(editor)}
                />
              </div>
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
              type="button"
              onClick={() => {
                console.log('Preview button clicked, formData:', formData);
                setShowPreview(true);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              미리보기
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '생성 중...' : '생성하기'}
            </button>
          </div>
        </form>

        {/* 미리보기 모달 */}
        <BlogPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          formData={formData}
          thumbnailPreview={thumbnailPreview}
        />

        {/* 플로팅 툴바 */}
        <FloatingToolbar
          editor={activeEditor}
          onImageUpload={() => {
            // 현재 활성 에디터에서 이미지 업로드 실행
            if (activeEditor) {
              // TiptapEditor의 handleImageUpload 메서드를 직접 호출할 수 없으므로
              // 에디터에 포커스를 주고 임시로 이미지 업로드 트리거
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.multiple = true;
              
              input.onchange = async () => {
                if (input.files) {
                  const files = Array.from(input.files);
                  for (const file of files) {
                    const tempUrl = URL.createObjectURL(file);
                    activeEditor.chain().focus().insertContent({
                      type: 'image',
                      attrs: {
                        src: tempUrl,
                        alt: file.name
                      }
                    }).run();
                  }
                }
              };
              
              input.click();
            }
          }}
        />
      </div>
    </div>
  );
};

export default NewBlogPage; 