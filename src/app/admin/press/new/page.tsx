'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TiptapEditor, { TiptapEditorRef } from '@/components/admin/TiptapEditor';
import PressPreviewModal from '@/components/admin/PressPreviewModal';
import FloatingToolbar from '@/components/admin/FloatingToolbar';
import SlugChecker from '@/components/admin/SlugChecker';
import { useToast } from '@/components/Toast';

interface IBlogPostImage {
  src: string;
  alt: string;
  alignment: 'left' | 'center' | 'right' | 'full';
  displaysize: number;
  originalWidth: number;
  originalHeight: number;
  uploadAt: Date;
  file?: File;
}

const NewPressPage: React.FC = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    press_name: { ko: '', en: '' },
    external_link: '',
    content: {
      ko: { title: '', subtitle: '', body: '', thumbnail_url: '', images: [] as IBlogPostImage[] },
      en: { title: '', subtitle: '', body: '', thumbnail_url: '', images: [] as IBlogPostImage[] }
    },
    tags: '',
    is_active: true
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

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 영문, 하이픈, 숫자만 허용
    const sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '');
    handleInputChange('slug', sanitizedValue);
  };

  const handleNestedInputChange = (parent: string, child: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as Record<string, any>),
        [child]: value
      }
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
  const handleImagesChange = (lang: string, images: IBlogPostImage[]) => {
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

  // 썸네일 파일 처리
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 썸네일 업로드
  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnailFile) return '';

    const uploadFormData = new FormData();
    uploadFormData.append('file', thumbnailFile);
    uploadFormData.append('folder', `press/${formData.slug}`);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error('썸네일 업로드 실패');
    }

    const data = await response.json();
    return data.url;
  };

  const getEditorContent = (lang: string) => {
    return formData.content[lang as keyof typeof formData.content]?.body || '';
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // 썸네일 업로드
      const thumbnailUrl = await uploadThumbnail();

      // 본문 이미지 업로드 및 HTML 업데이트
      let updatedKoBody = formData.content.ko.body;
      let updatedEnBody = formData.content.en.body;

      // 한국어 본문 이미지 업로드
      if (formData.content.ko.images && formData.content.ko.images.length > 0) {
        for (const image of formData.content.ko.images) {
          if (image.file) {
            const imageFormData = new FormData();
            imageFormData.append('file', image.file);
            imageFormData.append('folder', `press/${formData.slug}/ko`);

            const imageResponse = await fetch('/api/upload', {
              method: 'POST',
              body: imageFormData,
            });

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              updatedKoBody = updatedKoBody.replace(
                `src="${image.src}"`,
                `src="${imageData.url}"`
              );
            }
          }
        }
      }

      // 영어 본문 이미지 업로드
      if (formData.content.en.images && formData.content.en.images.length > 0) {
        for (const image of formData.content.en.images) {
          if (image.file) {
            const imageFormData = new FormData();
            imageFormData.append('file', image.file);
            imageFormData.append('folder', `press/${formData.slug}/en`);

            const imageResponse = await fetch('/api/upload', {
              method: 'POST',
              body: imageFormData,
            });

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              updatedEnBody = updatedEnBody.replace(
                `src="${image.src}"`,
                `src="${imageData.url}"`
              );
            }
          }
        }
      }

      // 태그 파싱
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const payload = {
        slug: formData.slug,
        press_name: formData.press_name,
        external_link: formData.external_link,
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
        tags,
        is_active: formData.is_active
      };

      const response = await fetch('/api/press', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('언론보도 생성 실패');
      }

      addToast({
        type: 'success',
        message: '언론보도가 성공적으로 생성되었습니다.'
      });
      
      // 약간의 지연 후 리다이렉트 (토스터가 보이도록)
      setTimeout(() => {
        router.push('/admin/press');
      }, 1000);
    } catch (error) {
      console.error('[언론보도 생성 전체 에러]', error);
      addToast({
        type: 'error',
        message: '언론보도 생성 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">새 언론보도 등록</h1>
          <Link
            href="/admin/press"
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
                  슬러그 (URL) *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    placeholder="예: press-release-2025"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
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
                  placeholder="예: 언론보도, 수상, 혁신"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 언론사 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">언론사 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  한국어 언론사명 *
                </label>
                <input
                  type="text"
                  value={formData.press_name.ko}
                  onChange={(e) => handleNestedInputChange('press_name', 'ko', e.target.value)}
                  placeholder="예: 전자신문"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Press Name *
                </label>
                <input
                  type="text"
                  value={formData.press_name.en}
                  onChange={(e) => handleNestedInputChange('press_name', 'en', e.target.value)}
                  placeholder="예: ET News"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                외부 기사 링크
              </label>
              <input
                type="url"
                value={formData.external_link}
                onChange={(e) => handleInputChange('external_link', e.target.value)}
                placeholder="https://example.com/article"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 썸네일 이미지 */}
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
              href="/admin/press"
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
        <PressPreviewModal
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

export default NewPressPage; 