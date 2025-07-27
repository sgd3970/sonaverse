'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation('common');

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 만보 보행기 */}
          <Link href="/products/manbo-walker" className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-64 bg-gradient-to-r from-orange-400 to-indigo-400 relative overflow-hidden">
              <img 
                src="/products/manbo_walker_thumb.jpg" 
                alt={t('manbo_walker', '만보 보행기')} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-orange-600 font-semibold text-sm">하이브리드형 워크메이트</span>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('manbo_walker', '만보 보행기')}</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t('manbo_walker_desc', '고령자의 안전하고 편안한 보행을 돕는 차세대 하이브리드 워크메이트. GPS 실종방지 기능과 스마트 제어 시스템을 탑재했습니다.')}
              </p>
              <div className="flex items-center text-orange-600 font-semibold">
                <span>자세히 보기</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* 보듬 기저귀 */}
          <Link href="/products/bodeum-diaper" className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-64 bg-gradient-to-r from-blue-900 to-blue-700 relative overflow-hidden">
              <img 
                src="/products/bodeum_diaper_thumb.jpg" 
                alt={t('bodeum_diaper', '보듬 기저귀')} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-blue-600 font-semibold text-sm">프리미엄 성인용 기저귀</span>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('bodeum_diaper', '보듬 기저귀')}</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t('bodeum_diaper_desc', '현직 요양보호사와 함께 개발한 프리미엄 성인용 기저귀. 뛰어난 흡수력과 편안함을 모두 갖춘 혁신적인 제품입니다.')}
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>자세히 보기</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

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
              <h4 className="text-lg font-semibold mb-2">사용자 중심 설계</h4>
              <p className="text-gray-600">실제 사용자와 전문가의 경험을 바탕으로 개발</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">혁신적인 기술</h4>
              <p className="text-gray-600">최신 기술을 활용한 스마트하고 안전한 솔루션</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">신뢰할 수 있는 품질</h4>
              <p className="text-gray-600">국제 인증 기준을 준수하는 고품질 제품</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 