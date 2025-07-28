'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TiptapEditor, { TiptapEditorRef } from '@/components/admin/TiptapEditor';
import BlogPreviewModal from '@/components/admin/BlogPreviewModal';
import FloatingToolbar from '@/components/admin/FloatingToolbar';
import SlugChecker from '@/components/admin/SlugChecker';
import { useToast } from '@/components/Toast';

const NewBlogPage: React.FC = () => {
  const router = useRouter();
  const { addToast } = useToast();
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
  const [hasSlugConflict, setHasSlugConflict] = useState(false);
  const [isSlugValidated, setIsSlugValidated] = useState(false);
  
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
    // 영문, 하이픈, 숫자만 허용
    const sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '');
    handleInputChange('slug', sanitizedValue);
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
      addToast({
        type: 'error',
        message: '필수 필드를 모두 입력해주세요.'
      });
      return;
    }

    if (!isSlugValidated) {
      addToast({
        type: 'error',
        message: '슬러그 중복 확인을 완료해주세요.'
      });
      return;
    }

    if (hasSlugConflict) {
      addToast({
        type: 'error',
        message: '슬러그가 중복됩니다. 다른 슬러그를 사용해주세요.'
      });
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
          console.error('[썸네일 업로드 실패]', error);
          addToast({
            type: 'error',
            message: '썸네일 업로드에 실패했습니다.'
          });
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
          console.error('[한국어 에디터 이미지 업로드 실패]:', error);
        }
      }

      if (enEditorRef.current) {
        try {
          updatedEnBody = await enEditorRef.current.uploadTempImagesToBlob(formData.slug);
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

      // 실제 API 요청
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 기반 인증
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        addToast({
          type: 'error',
          message: result.error || '블로그 생성에 실패했습니다.'
        });
        setLoading(false);
        return;
      }

      addToast({
        type: 'success',
        message: '블로그가 성공적으로 생성되었습니다!'
      });
      
      // 약간의 지연 후 리다이렉트 (토스터가 보이도록)
      setTimeout(() => {
        router.push('/admin/blog');
      }, 1000);
    } catch (error) {
      console.error('[블로그 생성 전체 에러]', error);
      addToast({
        type: 'error',
        message: '블로그 생성 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">새 블로그 글 작성</h1>
          <Link
            href="/admin/blog"
            className="bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
          >
            뒤로가기
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  슬러그 *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    placeholder="예: my-blog-post"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex-shrink-0">
                    <SlugChecker 
                      slug={formData.slug} 
                      onCheck={setHasSlugConflict}
                      onValidated={setIsSlugValidated}
                    />
                  </div>
                </div>
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
                <TiptapEditor
                  ref={koEditorRef}
                  value={formData.content.ko.body}
                  onChange={(value: string) => handleContentChange('ko', 'body', value)}
                  slug={formData.slug}
                  placeholder="한국어 본문을 입력하세요..."
                  images={formData.content.ko.images}
                  onImagesChange={(images) => handleImagesChange('ko', images)}
                  onEditorFocus={() => setActiveEditor(koEditorRef.current?.getEditor())}
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
                <TiptapEditor
                  ref={enEditorRef}
                  value={formData.content.en.body}
                  onChange={(value: string) => handleContentChange('en', 'body', value)}
                  slug={formData.slug}
                  placeholder="영어 본문을 입력하세요..."
                  images={formData.content.en.images}
                  onImagesChange={(images) => handleImagesChange('en', images)}
                  onEditorFocus={() => setActiveEditor(enEditorRef.current?.getEditor())}
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
        {activeEditor && (
          <FloatingToolbar 
            editor={activeEditor}
            tiptapRef={activeEditor === koEditorRef.current?.getEditor() ? koEditorRef : enEditorRef}
          />
        )}
      </div>
    </div>
  );
};

export default NewBlogPage; 