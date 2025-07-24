'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import TiptapEditorDynamic from '@/components/admin/TiptapEditorDynamic';

const EditBlogPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [thumbnailFiles, setThumbnailFiles] = useState<{ ko?: File; en?: File }>({});
  const [thumbnailUrls, setThumbnailUrls] = useState<{ ko?: string; en?: string }>({});

  useEffect(() => {
    if (slug) {
      fetch(`/api/blog/${slug}`)
        .then(res => res.json())
        .then(data => {
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
            is_published: data.is_published
          });
          setThumbnailUrls({
            ko: data.content.ko?.thumbnail_url,
            en: data.content.en?.thumbnail_url
          });
        });
    }
  }, [slug]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContentChange = (lang: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          [field]: value
        }
      }
    }));
  };

  // 썸네일 업로드 핸들러 (공통)
  const handleThumbnailChange = async (file: File) => {
    setThumbnailFiles({ ko: file });
    if (formData.slug) {
      const formDataObj = new FormData();
      const ext = file.name.split('.').pop();
      const filename = `${formData.slug}_thumbnail.${ext}`;
      formDataObj.append('file', file, filename);
      const res = await fetch('/api/upload/blob', { method: 'POST', body: formDataObj });
      if (res.ok) {
        const data = await res.json();
        setThumbnailUrls({ ko: data.url });
        handleContentChange('ko', 'thumbnail_url', data.url);
        handleContentChange('en', 'thumbnail_url', data.url);
      } else {
        alert('썸네일 업로드 실패');
      }
    } else {
      alert('슬러그를 먼저 입력하세요.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug || !formData.content.ko.title || !formData.content.ko.body) {
      alert('필수 항목을 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      const tags = formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      const res = await fetch(`/api/blog/${slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '수정에 실패했습니다.');
      }
      alert('블로그 포스트가 수정되었습니다.');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert(error instanceof Error ? error.message : '수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <div className="p-8 text-center">불러오는 중...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">블로그 수정</h1>
        <Link href="/admin/blog" className="text-gray-600 hover:text-gray-800">목록으로 돌아가기</Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">슬러그 *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="blog-post-slug"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="태그1, 태그2, 태그3"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">즉시 공개</span>
            </label>
          </div>
        </div>
        {/* 한국어 콘텐츠 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">한국어 콘텐츠</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
              <input
                type="text"
                value={formData.content.ko.title}
                onChange={(e) => handleContentChange('ko', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="블로그 포스트 제목"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
              <input
                type="text"
                value={formData.content.ko.subtitle || ''}
                onChange={(e) => handleContentChange('ko', 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="블로그 포스트 부제목"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">썸네일 업로드</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files && handleThumbnailChange(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {thumbnailUrls.ko && <img src={thumbnailUrls.ko} alt="썸네일 미리보기" className="mt-2 h-24 rounded" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">본문 *</label>
              <TiptapEditorDynamic
                value={formData.content.ko.body}
                onChange={val => handleContentChange('ko', 'body', val)}
                slug={formData.slug}
              />
            </div>
          </div>
        </div>
        {/* 영어 콘텐츠 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">영어 콘텐츠</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input
                type="text"
                value={formData.content.en.title}
                onChange={(e) => handleContentChange('en', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Blog Post Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
              <input
                type="text"
                value={formData.content.en.subtitle || ''}
                onChange={(e) => handleContentChange('en', 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Blog Post Subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">본문</label>
              <TiptapEditorDynamic
                value={formData.content.en.body}
                onChange={val => handleContentChange('en', 'body', val)}
                slug={formData.slug}
              />
            </div>
          </div>
        </div>
        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/blog" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">취소</Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? '수정 중...' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage; 