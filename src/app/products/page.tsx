'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';

interface Product {
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
  category: string;
  thumbnail_url: string;
  is_active: boolean;
}

const ProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language === 'en' ? 'en' : 'ko';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?published=true');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.results || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('제품 데이터 로딩 실패:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full min-h-[70vh] bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('products', '제품소개')}</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-4">
            {t('products_subtitle', '혁신적인 헬스케어 솔루션으로')}
          </p>
          <p className="text-lg text-blue-200">
            {t('products_description', '더 나은 삶의 질을 제공합니다')}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('our_products', '소나버스의 핵심 제품군')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('products_intro', '실제 사용자 경험을 바탕으로 개발된 혁신적인 헬스케어 제품들을 소개합니다')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {products.map((product) => (
              <Link 
                key={product._id} 
                href={`/products/${product.slug}`} 
                className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="h-64 bg-gradient-to-r from-orange-400 to-indigo-400 relative overflow-hidden">
                  <img 
                    src={product.thumbnail_url || '/logo/symbol_logo.png'} 
                    alt={product.name[lang]} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-orange-600 font-semibold text-sm">{product.category}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">{product.name[lang]}</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {product.description[lang]}
                  </p>
                  <div className="flex items-center text-orange-600 font-semibold">
                    <span>자세히 보기</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-500 text-lg">{t('no_products', '등록된 제품이 없습니다.')}</p>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            {t('why_choose_us', '소나버스 제품의 특별함')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">{t('quality_assurance', '품질 보증')}</h4>
              <p className="text-gray-600">{t('quality_desc', '엄격한 품질 관리와 인증을 통한 신뢰성')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">{t('innovation', '혁신 기술')}</h4>
              <p className="text-gray-600">{t('innovation_desc', '최신 기술을 적용한 혁신적인 솔루션')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">{t('user_centered', '사용자 중심')}</h4>
              <p className="text-gray-600">{t('user_centered_desc', '실제 사용자 경험을 바탕으로 한 설계')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 