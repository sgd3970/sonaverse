'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';

const ManboWalkerPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                하이브리드 기술
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  고령자의 안전한<br />
                  보행을 위한<br />
                  <span className="text-blue-600">만보</span>
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  전동과 비전동 모드를 자유롭게 선택할 수 있는<br />
                  차세대 스마트 보행 보조기구
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/inquiry" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg text-center"
                >
                  제품 문의하기
                </a>
              </div>
            </div>
            
            {/* Product Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-3xl transform rotate-3"></div>
                <img 
                  src="/products/manbo_walker_main.jpg" 
                  alt="만보 워크메이트" 
                  className="relative w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200" 
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">하이브리드형</div>
                  <div className="text-lg font-bold text-slate-900">워크메이트</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              기존 보행 보조기구의 한계점
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto">
              시장 조사 결과, 사용자들이 겪고 있는 실제 문제점들을 발견했습니다.
            </p>
          </div>

          {/* Pain Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-4">보행 안전성 및 주행 성능의 한계</h3>
              <p className="text-slate-600 text-sm leading-relaxed">불규칙한 지형이나 경사면에서 제동·추진력 부족으로 사고 위험</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-4">사용자 중심의 인체공학적 설계 미흡</h3>
              <p className="text-slate-600 text-sm leading-relaxed">고령 사용자의 체형과 운동 능력, 사용 습관 반영 부족</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-4">심리적 만족감을 고려하지 않은 디자인</h3>
              <p className="text-slate-600 text-sm leading-relaxed">고령 사용자의 정서적 안정감과 자존감 미고려</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-4">고급화 시대 속 보행 기술 사각지대</h3>
              <p className="text-slate-600 text-sm leading-relaxed">AI·센서 등 최신 기술 적용된 안전 문제 장기화</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                듀얼 구동 방식을 적용한 차세대 하이브리드 워크 메이트
              </h2>
              <p className="text-xl text-slate-600">
                바람 손잡이와 통 프레임의 차별화된 설계로 안전성을 강화
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-slate-900">하이브리드 주행 시스템</h3>
                    <p className="text-slate-600 leading-relaxed">전동과 비전동 모드를 자유롭게 선택하여, 다양한 보행 환경에 맞춰 유연하게 대응 가능</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-slate-900">경사지 제어 기능</h3>
                    <p className="text-slate-600 leading-relaxed">오르막에 추력, 내리막에 제동력으로 경사 지형에서도 안정적인 보행을 지원하는 스마트 제어 기능</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-slate-900">미세 모터 적용</h3>
                    <p className="text-slate-600 leading-relaxed">사용자의 힘과 속도에 맞춰 미세하게 구동하는 미세모터 적용</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <img src="/products/manbo_walker_features.jpg" alt="만보 워크메이트 기능" className="w-full max-w-md rounded-2xl shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              예방과 대응 기능을 모두 담은 지능형 보행 케어 기술
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">비상 시 자동 정지 기능</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">센서 반응형 브레이크 타이즈로 위급 상황 발생 시 즉각 정지하여, 돌발 사고를 효과적으로 차단하는 비상 대응 기능</p>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-700">비전동모드</span>
                  <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded-full">OFF</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">전동모드</span>
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full">ON</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">실종 방지 기능(GPS 프로토 완료)</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">GPS 기반 위치 추적 시스템을 통한 실시간 모니터링으로, 치매 등 고위험군의 실종 사고 예방</p>
              
              <div className="bg-blue-50 rounded-lg p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-blue-900">실시간 위치 추적</div>
                  <div className="text-sm text-blue-700">가족과 보호자에게 실시간 알림</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              현재 개발 및 제품 라인업 상용화 계획
            </h2>
            <p className="text-lg text-slate-600">
              1차 시제품 제작 및 1차 성능평가 완료, 현재 2차 시제품 제작 중, 2026년 6월 런칭 목표
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-orange-500">
              <div className="text-orange-600 font-bold text-sm mb-4">1차 단계 완료</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">시제품 제작 및 성능평가</h3>
              <ul className="text-slate-600 space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>기본 구조 설계 완료</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>하이브리드 시스템 프로토타입</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>초기 사용자 테스트</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-blue-500">
              <div className="text-blue-600 font-bold text-sm mb-4">현재 진행중</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">2차 시제품 제작</h3>
              <ul className="text-slate-600 space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>GPS 시스템 통합</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>스마트 제어 시스템 고도화</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>안전성 강화 설계</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-orange-500">
              <div className="text-orange-600 font-bold text-sm mb-4">2026년 6월 목표</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">상용화 런칭</h3>
              <ul className="text-slate-600 space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>대량 생산 체계 구축</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>B2B/B2C 판매 채널 오픈</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>글로벌 시장 진출</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">B2B를 기반으로 한 확장형 비즈니스 모델</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">B2B (제도 활용 안정적 수익)</h3>
                <div className="space-y-6">
                  <p className="text-slate-200">소나버스(제조) → 복지용품 유통(유통) → 시니어(사용자)</p>
                  <ul className="space-y-3 text-slate-200">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>한국의 경우 복지용구 제도를 통해 85~100% 할인 가능</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>전국 복지용구 사업장 약 2,100개</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>노인장기요양보험 등급자 약 120만 명</span>
                    </li>
                  </ul>
                  <div className="bg-white/20 rounded-lg p-6">
                    <div className="text-lg font-bold mb-4">만보 (하이브리드형)</div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>판매가</span>
                        <span>700,000원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>제조원가</span>
                        <span>250,000원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>영업이익</span>
                        <span>230,000원</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-white/20 pt-3">
                        <span>영업이익률</span>
                        <span>33%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">B2C (프리미엄 브랜딩 확장)</h3>
                <div className="space-y-6">
                  <p className="text-slate-200">일반 소비자 직접 판매 방식</p>
                  <ul className="space-y-3 text-slate-200">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>기존 온라인 구매 고객 및 해외 고객</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>프리미엄 브랜딩, 퍼포먼스</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>부품 교체, A/S 관리 등 유지보수 서비스</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>한정적 시장 규모를 벗어나 확장 가능</span>
                    </li>
                  </ul>
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
                혁신적인 보행 보조기구로 새로운 경험을 제공합니다
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                안전하고 편안한 보행을 위한 만보 워크메이트
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/inquiry" 
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
                >
                  <span>제품 문의하기</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManboWalkerPage; 