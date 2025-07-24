'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NewPressPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    published_date: '',
    press_name: { ko: '', en: '' },
    content: {
      ko: { title: '', body: '', external_link: '' },
      en: { title: '', body: '', external_link: '' }
    },
    is_active: true
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || !formData.published_date) {
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

      const res = await fetch('/api/press', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          updated_by: 'admin' // 실제로는 로그인된 사용자 ID를 사용해야 함
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '등록에 실패했습니다.');
      }

      alert('언론보도가 등록되었습니다.');
      router.push('/admin/press');
    } catch (error) {
      console.error('Error creating press release:', error);
      alert(error instanceof Error ? error.message : '등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">새 언론보도 등록</h1>
        <Link 
          href="/admin/press" 
          className="text-gray-600 hover:text-gray-800"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <div className="md:col-span-2">
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
                  placeholder="예: award-2025"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  발행일 *
                </label>
                <input
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => handleInputChange('published_date', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* 언론사명 */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">언론사명</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  한국어
                </label>
                <input
                  type="text"
                  value={formData.press_name.ko}
                  onChange={(e) => handleNestedInputChange('press_name', 'ko', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="예: 전자신문"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English
                </label>
                <input
                  type="text"
                  value={formData.press_name.en}
                  onChange={(e) => handleNestedInputChange('press_name', 'en', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="예: ET News"
                />
              </div>
            </div>
          </div>

          {/* 한국어 콘텐츠 */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">한국어 콘텐츠</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.content.ko.title}
                  onChange={(e) => handleContentChange('ko', 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="제목을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  본문
                </label>
                <textarea
                  value={formData.content.ko.body}
                  onChange={(e) => handleContentChange('ko', 'body', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-32"
                  placeholder="본문을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  외부 링크
                </label>
                <input
                  type="url"
                  value={formData.content.ko.external_link}
                  onChange={(e) => handleContentChange('ko', 'external_link', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* 영어 콘텐츠 */}
          <div className="md:col-span-2">
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
                  Body
                </label>
                <textarea
                  value={formData.content.en.body}
                  onChange={(e) => handleContentChange('en', 'body', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-32"
                  placeholder="Enter body content"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  External Link
                </label>
                <input
                  type="url"
                  value={formData.content.en.external_link}
                  onChange={(e) => handleContentChange('en', 'external_link', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* 상태 */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                활성화
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Link
            href="/admin/press"
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPressPage; 