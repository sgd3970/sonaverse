'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface DiaperProduct {
  _id: string;
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
  category: string;
}

const BodeumDiaperPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<DiaperProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await fetch(`/api/diaper-products?${params}`);
      
      if (!response.ok) {
        throw new Error('제품 목록을 불러올 수 없습니다.');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: '', label: '전체보기' },
    { value: '팬티형', label: '팬티형' },
    { value: '속기저귀', label: '속기저귀' },
    { value: '깔개매트', label: '깔개매트' }
  ];

  const getLocalizedText = (obj: { ko: string; en: string }, lang: string): string => {
    return obj[lang as keyof typeof obj] || obj.ko;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('bodeum_diaper', '보듬 기저귀')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('bodeum_diaper_description', '실제 사용자 경험을 바탕으로 개발된 믿을 수 있는 품질의 성인용 기저귀')}
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* 제품 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">제품 목록을 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/bodeum-diaper/${product.slug}`}
                className="group block"
              >
                <div className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                  {/* 썸네일 이미지 */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.thumbnail_image}
                      alt={getLocalizedText(product.name, i18n.language)}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png';
                      }}
                    />
                  </div>
                  
                  {/* 제품 정보 */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {getLocalizedText(product.name, i18n.language)}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {getLocalizedText(product.description, i18n.language)}
                    </p>
                    <div className="mt-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">등록된 제품이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodeumDiaperPage; 