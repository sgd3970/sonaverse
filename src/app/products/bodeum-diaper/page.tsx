'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';

const BodeumDiaperPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative min-h-[70vh] bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                부모님을 위한 작은 배려<br />
                <span className="text-blue-200">보듬</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                부모님의 하루를 보듬어 살핀다는 뜻으로<br />
                사랑을 의미합니다
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg">
                  제품 상세보기
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition-all">
                  구매 문의
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img src="/products/bodeum_packages.jpg" alt="보듬 기저귀 제품군" className="w-full max-w-lg rounded-2xl shadow-2xl" />
                <div className="absolute -bottom-4 -right-4 bg-white text-blue-900 p-4 rounded-xl shadow-lg">
                  <div className="text-sm font-semibold">ISO • FDA • CE</div>
                  <div className="text-xs text-gray-600">국제 인증 완료</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Introduction */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            성인용 기저귀의 실제 구매자이자 사용자의 현장 경험을 통해 제작
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            실제 현직 요양보호사와 팀을 이루어 실제 사용자 및 구매자의 개선점을 반영하여 개발한 프리미엄 성인용 기저귀입니다.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-900">안심할 수 있는 코어 설계</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              3중 흡수층으로 2,000ml의 뛰어난 흡수력을 제공하여 장시간 안심하고 사용할 수 있습니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-900">샘 방지막 설계</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              흡수층을 보조하는 특수 샘 방지막으로 옆 샘 걱정 없이 편안하게 사용하실 수 있습니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 100-5H9v5zm0 0H6.5a2.5 2.5 0 100 5H9v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-900">천연 펄프 사용</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              부드러운 순면감촉의 천연 펄프를 사용하여 민감한 피부에도 자극 없이 편안합니다.
            </p>
          </div>
        </div>

        {/* Product Lineup */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 md:p-12 text-white mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">현재 라인업</h2>
            <p className="text-xl text-blue-100">총 5종 구성 및 재구매 생활용품으로 다양한 구성 상품 가능</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: '팬티형 기저귀 중형', icon: '👔' },
              { name: '팬티형 기저귀 대형', icon: '👔' },
              { name: '속기저귀 일자형', icon: '📦' },
              { name: '속기저귀 라운드형', icon: '📦' },
              { name: '위생 깔개매트', icon: '🛏️' }
            ].map((product, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all">
                <div className="text-4xl mb-3">{product.icon}</div>
                <h3 className="font-semibold text-sm">{product.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Quality & Certification */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">믿을 수 있는 제품</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">편안한 허리밴드</h3>
                    <p className="text-gray-600">뛰어난 신축성과 특수 공법을 사용한 밴드로 피부에 찔리지 않고 부드러움을 제공합니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">국제 인증 완료</h3>
                    <p className="text-gray-600">ISO, FDA, CE 기준을 준수하는 제조 시설에서 생산되어 품질과 안전성을 보장합니다.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">지속적인 개선</h3>
                    <p className="text-gray-600">사용자 피드백을 지속적으로 반영하여 더 나은 제품으로 발전시켜 나가고 있습니다.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img src="/products/bodeum_detail_quality.jpg" alt="보듬 기저귀 품질" className="w-full rounded-2xl shadow-lg" />
              <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">ISO</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">FDA</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">CE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              한번 사용하면 계속 구매하게 되는 상품
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              브랜딩 후 지속적인 매출이 가능한 재구매 생활용품입니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://bodume.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg"
              >
                <span>보듬 공식 홈페이지</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all">
                제품 문의하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodeumDiaperPage; 