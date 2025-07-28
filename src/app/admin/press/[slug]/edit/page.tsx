'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { useToast } from '@/components/Toast';

interface PressFormData {
  slug: string;
  press_name: {
    ko: string;
    en: string;
  };
  content: {
    ko: {
      title: string;
      body: string;
      external_link?: string;
    };
    en: {
      title: string;
      body: string;
      external_link?: string;
    };
  };
  published_date: string;
  is_active: boolean;
}

const EditPressPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState<PressFormData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPress();
  }, [slug]);

  const fetchPress = async () => {
    try {
      const response = await fetch(`/api/press/${slug}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('언론보도를 불러올 수 없습니다.');
      }
      
      const data = await response.json();
      
      setFormData({
        slug: data.slug,
        press_name: {
          ko: data.press_name?.ko || '',
          en: data.press_name?.en || ''
        },
        content: {
          ko: {
            title: data.content?.ko?.title || '',
            body: data.content?.ko?.body || '',
            external_link: data.content?.ko?.external_link || ''
          },
          en: {
            title: data.content?.en?.title || '',
            body: data.content?.en?.body || '',
            external_link: data.content?.en?.external_link || ''
          }
        },
        published_date: data.published_date || new Date().toISOString().split('T')[0],
        is_active: data.is_active || false
      });
    } catch (error) {
      console.error('Error fetching press:', error);
      addToast({
        type: 'error',
        message: '언론보도를 불러오는데 실패했습니다.'
      });
      router.push('/admin/press');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handlePressNameChange = (lang: string, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      press_name: {
        ...formData.press_name,
        [lang]: value
      }
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);

    try {
      const payload = {
        slug: formData.slug,
        press_name: formData.press_name,
        content: formData.content,
        published_date: formData.published_date,
        is_active: formData.is_active
      };

      const response = await fetch(`/api/press/${formData.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();

      if (!response.ok) {
        addToast({
          type: 'error',
          message: result.error || '언론보도 수정에 실패했습니다.'
        });
        setLoading(false);
        return;
      }

      addToast({
        type: 'success',
        message: '언론보도가 성공적으로 수정되었습니다!'
      });
      
      // 약간의 지연 후 리다이렉트 (토스터가 보이도록)
      setTimeout(() => {
        router.push('/admin/press');
      }, 1000);
      
    } catch (error) {
      console.error('[언론보도 수정 전체 에러]', error);
      addToast({
        type: 'error',
        message: '언론보도 수정 중 오류가 발생했습니다.'
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
            <div className="text-lg text-gray-600">언론보도를 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">언론보도 수정</h1>
          <Link 
            href="/admin/press" 
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
                  발행일 *
                </label>
                <input
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => handleInputChange('published_date', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">활성화</span>
              </label>
            </div>
          </div>

          {/* 언론사 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">언론사 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  언론사명 (한국어) *
                </label>
                <input
                  type="text"
                  value={formData.press_name.ko}
                  onChange={(e) => handlePressNameChange('ko', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  언론사명 (English) *
                </label>
                <input
                  type="text"
                  value={formData.press_name.en}
                  onChange={(e) => handlePressNameChange('en', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
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
                  본문 *
                </label>
                <TiptapEditor
                  value={formData.content.ko.body}
                  onChange={(content: string) => handleContentChange('ko', 'body', content)}
                  placeholder="언론보도 본문을 입력하세요..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  외부 링크
                </label>
                <input
                  type="url"
                  value={formData.content.ko.external_link || ''}
                  onChange={(e) => handleContentChange('ko', 'external_link', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  Content *
                </label>
                <TiptapEditor
                  value={formData.content.en.body}
                  onChange={(content: string) => handleContentChange('en', 'body', content)}
                  placeholder="Enter press release content..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  External Link
                </label>
                <input
                  type="url"
                  value={formData.content.en.external_link || ''}
                  onChange={(e) => handleContentChange('en', 'external_link', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/press"
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

export default EditPressPage; 