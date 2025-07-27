'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import TiptapEditor, { TiptapEditorRef } from '@/components/admin/TiptapEditor';
import FloatingToolbar from '@/components/admin/FloatingToolbar';
import BrandStoryPreviewModal from '@/components/admin/BrandStoryPreviewModal';

const NewBrandStoryPage: React.FC = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    content: {
      ko: { title: '', subtitle: '', body: '', thumbnail_url: '', images: [] },
      en: { title: '', subtitle: '', body: '', thumbnail_url: '', images: [] }
    },
    youtube_url: '',
    tags: '',
    is_published: false
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

    const formData = new FormData();
    formData.append('file', thumbnailFile);
    formData.append('type', 'thumbnail');

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('썸네일 업로드 실패');
    const data = await res.json();
    return data.url;
  };

  // 에디터의 HTML 콘텐츠 가져오기 (TiptapEditor 사용으로 인해 직접 접근)
  const getEditorContent = (lang: string) => {
    return formData.content[lang as keyof typeof formData.content].body || '';
  };

  // 슬러그 자동 생성
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  // 유튜브 URL 검증
  const validateYouTubeUrl = (url: string): boolean => {
    if (!url) return true; // 빈 URL은 허용
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  // 유튜브 임베드 URL 변환
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return '';
    
    // YouTube 정규식 패턴들
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1`;
      }
    }
    
    return url; // 변환할 수 없으면 원본 반환
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || !formData.content.ko.title) {
      addToast({
        type: 'error',
        message: '필수 항목을 입력해주세요.'
      });
      return;
    }

    // 유튜브 URL 검증
    if (formData.youtube_url && !validateYouTubeUrl(formData.youtube_url)) {
      addToast({
        type: 'error',
        message: '올바른 유튜브 URL을 입력해주세요.'
      });
      return;
    }

    try {
      setLoading(true);

      // 썸네일 업로드
      let thumbnailUrl = '';
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
      }

      // 에디터에서 HTML 콘텐츠 가져오기
      const koBody = getEditorContent('ko');
      const enBody = getEditorContent('en');

      // 유튜브 URL을 임베드 형식으로 변환
      const embedUrl = formData.youtube_url ? convertToEmbedUrl(formData.youtube_url) : '';

      const submitData = {
        ...formData,
        youtube_url: embedUrl,
        content: {
          ko: {
            ...formData.content.ko,
            body: koBody,
            thumbnail_url: thumbnailUrl
          },
          en: {
            ...formData.content.en,
            body: enBody,
            thumbnail_url: thumbnailUrl
          }
        },
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        updated_by: 'admin' // 실제로는 로그인된 사용자 ID를 사용해야 함
      };

      const res = await fetch('/api/brand-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include',
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '등록에 실패했습니다.');
      }

      addToast({
        type: 'success',
        message: '브랜드 스토리가 등록되었습니다.'
      });
      
      // 약간의 지연 후 리다이렉트 (토스터가 보이도록)
      setTimeout(() => {
        router.push('/admin/brand-story');
      }, 1000);
    } catch (error) {
      console.error('Error creating brand story:', error);
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : '등록에 실패했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">새 브랜드 스토리 작성</h1>
        <Link 
          href="/admin/brand-story" 
          className="text-gray-600 hover:text-gray-800"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="예: company-vision-2025"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="태그1, 태그2, 태그3"
              />
            </div>
          </div>
        </div>

        {/* 유튜브 동영상 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">유튜브 동영상 (선택사항)</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              유튜브 URL (임베드 자동 변환)
            </label>
            <input
              type="url"
              value={formData.youtube_url}
              onChange={(e) => handleInputChange('youtube_url', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
            />
            <p className="text-sm text-gray-500 mt-2">
              유튜브 URL을 입력하면 상세페이지에서 자동재생됩니다. (watch, youtu.be, embed 형식 모두 지원)
            </p>
          </div>
        </div>

        {/* 썸네일 이미지 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">썸네일 이미지</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              썸네일 업로드
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {thumbnailPreview && (
              <div className="mt-4">
                <img 
                  src={thumbnailPreview} 
                  alt="썸네일 미리보기" 
                  className="max-w-xs h-40 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>

        {/* 한국어 콘텐츠 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">한국어 콘텐츠</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={formData.content.ko.title}
                onChange={(e) => {
                  handleContentChange('ko', 'title', e.target.value);
                  if (!formData.slug) {
                    handleInputChange('slug', generateSlug(e.target.value));
                  }
                }}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="제목을 입력하세요"
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
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="부제목을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                본문 내용
              </label>
              <TiptapEditor
                ref={koEditorRef}
                value={formData.content.ko.body}
                onChange={(content: string) => handleContentChange('ko', 'body', content)}
                placeholder="브랜드 스토리 내용을 입력하세요..."
                images={formData.content.ko.images}
                onImagesChange={(images) => handleImagesChange('ko', images)}
                onEditorFocus={() => setActiveEditor(koEditorRef.current?.getEditor())}
              />
            </div>
          </div>
        </div>

        {/* 영어 콘텐츠 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">English Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.content.en.title}
                onChange={(e) => handleContentChange('en', 'title', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter title"
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
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Content
              </label>
              <TiptapEditor
                ref={enEditorRef}
                value={formData.content.en.body}
                onChange={(content: string) => handleContentChange('en', 'body', content)}
                placeholder="Enter brand story content..."
                images={formData.content.en.images}
                onImagesChange={(images) => handleImagesChange('en', images)}
                onEditorFocus={() => setActiveEditor(enEditorRef.current?.getEditor())}
              />
            </div>
          </div>
        </div>

        {/* 게시 설정 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">게시 설정</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => handleInputChange('is_published', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
              즉시 게시
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Link
            href="/admin/brand-story"
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            미리보기
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>

      {/* 플로팅 툴바 */}
      {activeEditor && (
        <FloatingToolbar 
          editor={activeEditor}
          tiptapRef={activeEditor === koEditorRef.current?.getEditor() ? koEditorRef : enEditorRef}
        />
      )}

      {/* 미리보기 모달 */}
      <BrandStoryPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={formData}
        thumbnailPreview={thumbnailPreview}
      />
    </div>
  );
};

export default NewBrandStoryPage;