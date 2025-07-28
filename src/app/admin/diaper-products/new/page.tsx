'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';
import MultipleImageUpload from '@/components/admin/MultipleImageUpload';

interface FormData {
  slug: string;
  name: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  thumbnail_image: string;
  product_images: string[];
  detail_images: string[];
  category: string;
  is_active: boolean;
}

const NewDiaperProductPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    slug: '',
    name: { ko: '', en: '' },
    description: { ko: '', en: '' },
    thumbnail_image: '',
    product_images: [],
    detail_images: [],
    category: '팬티형',
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || !formData.name.ko || !formData.name.en) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/diaper-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('제품이 성공적으로 생성되었습니다.');
        router.push('/admin/diaper-products');
      } else {
        const error = await response.json();
        alert(error.error || '제품 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('제품 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">새 제품 추가</h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            뒤로가기
          </button>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  슬러그 *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="product-slug"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="팬티형">팬티형</option>
                  <option value="속기저귀">속기저귀</option>
                  <option value="깔개매트">깔개매트</option>
                </select>
              </div>
            </div>

            {/* 제품명 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제품명 (한국어) *
                </label>
                <input
                  type="text"
                  value={formData.name.ko}
                  onChange={(e) => handleInputChange('name.ko', e.target.value)}
                  placeholder="제품명을 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제품명 (영어) *
                </label>
                <input
                  type="text"
                  value={formData.name.en}
                  onChange={(e) => handleInputChange('name.en', e.target.value)}
                  placeholder="Product name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* 설명 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 (한국어) *
                </label>
                <textarea
                  value={formData.description.ko}
                  onChange={(e) => handleInputChange('description.ko', e.target.value)}
                  placeholder="제품 설명을 입력하세요"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 (영어) *
                </label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => handleInputChange('description.en', e.target.value)}
                  placeholder="Product description"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  썸네일 이미지 *
                </label>
                <ImageUpload
                  onImageUpload={(url: string) => handleInputChange('thumbnail_image', url)}
                  currentImage={formData.thumbnail_image}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제품 이미지들 *
                </label>
                <MultipleImageUpload
                  onImageUpload={(url: string) => {
                    setFormData(prev => ({
                      ...prev,
                      product_images: [...prev.product_images, url]
                    }));
                  }}
                  onImageRemove={(index: number) => {
                    setFormData(prev => ({
                      ...prev,
                      product_images: prev.product_images.filter((_, i) => i !== index)
                    }));
                  }}
                  currentImages={formData.product_images}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세 페이지 이미지들
                </label>
                <MultipleImageUpload
                  onImageUpload={(url: string) => {
                    setFormData(prev => ({
                      ...prev,
                      detail_images: [...prev.detail_images, url]
                    }));
                  }}
                  onImageRemove={(index: number) => {
                    setFormData(prev => ({
                      ...prev,
                      detail_images: prev.detail_images.filter((_, i) => i !== index)
                    }));
                  }}
                  currentImages={formData.detail_images}
                />
              </div>
            </div>

            {/* 상태 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                활성화
              </label>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? '생성 중...' : '제품 생성'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewDiaperProductPage; 