'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';

const BodeumDiaperPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                프리미엄 성인용 기저귀
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  부모님을 위한 작은 배려<br />
                  <span className="text-blue-600">보듬</span>
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  부모님의 하루를 보듬어 살핀다는 뜻으로<br />
                  사랑을 의미합니다
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://bodume.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg text-center"
                >
                  보듬 공식 홈페이지
                </a>
              </div>
            </div>
            
            {/* Product Image */}
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="/products/bodeum_packages.jpg" 
                  alt="보듬 기저귀 제품군" 
                  className="w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200" 
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-slate-200">
                  <div className="text-sm font-semibold text-blue-900">ISO • FDA • CE</div>
                  <div className="text-xs text-slate-600">국제 인증 완료</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              실제 사용자 경험을 바탕으로 개발된 제품
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto">
              현직 요양보호사와 함께 실제 사용자들의 피드백을 반영하여 개발했습니다.
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-slate-900">안심할 수 있는 코어 설계</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                3중 흡수층으로 2,000ml의 뛰어난 흡수력을 제공하여 장시간 안심하고 사용할 수 있습니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-slate-900">샘 방지막 설계</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                흡수층을 보조하는 특수 샘 방지막으로 옆 샘 걱정 없이 편안하게 사용하실 수 있습니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 100-5H9v5zm0 0H6.5a2.5 2.5 0 100 5H9v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-slate-900">천연 펄프 사용</h3>
              <p className="text-slate-600 text-center leading-relaxed">
                부드러운 순면감촉의 천연 펄프를 사용하여 민감한 피부에도 자극 없이 편안합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Lineup */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">현재 라인업</h2>
              <p className="text-xl text-slate-600">총 5종 구성 및 재구매 생활용품으로 다양한 구성 상품 가능</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { name: '팬티형 기저귀 중형', icon: '👔' },
                { name: '팬티형 기저귀 대형', icon: '👔' },
                { name: '속기저귀 일자형', icon: '📦' },
                { name: '속기저귀 라운드형', icon: '📦' },
                { name: '위생 깔개매트', icon: '🛏️' }
              ].map((product, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-6 text-center hover:bg-slate-100 transition-colors border border-slate-200">
                  <div className="text-4xl mb-3">{product.icon}</div>
                  <h3 className="font-semibold text-sm text-slate-900">{product.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality & Certification */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">믿을 수 있는 제품</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3">편안한 허리밴드</h3>
                    <p className="text-slate-600 leading-relaxed">뛰어난 신축성과 특수 공법을 사용한 밴드로 피부에 찔리지 않고 부드러움을 제공합니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3">국제 인증 완료</h3>
                    <p className="text-slate-600 leading-relaxed">ISO, FDA, CE 기준을 준수하는 제조 시설에서 생산되어 품질과 안전성을 보장합니다.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3">지속적인 개선</h3>
                    <p className="text-slate-600 leading-relaxed">사용자 피드백을 지속적으로 반영하여 더 나은 제품으로 발전시켜 나가고 있습니다.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img src="/products/bodeum_detail_quality.jpg" alt="보듬 기저귀 품질" className="w-full rounded-2xl shadow-lg" />
              <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg border border-slate-200">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">ISO</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">FDA</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">CE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                믿을 수 있는 품질의 성인용 기저귀
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                한번 사용하면 계속 구매하게 되는 보듬 기저귀
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://bodume.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
                >
                  <span>보듬 공식 홈페이지</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BodeumDiaperPage; 