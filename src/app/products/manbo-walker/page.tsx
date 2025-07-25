'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';

const ManboWalkerPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full bg-gradient-to-b from-orange-400 to-indigo-400">
      {/* Hero Section */}
      <div className="relative min-h-[70vh] bg-gradient-to-r from-orange-400 to-indigo-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                고령자의 편안한 보행을 돕는<br />
                <span className="text-orange-200">만보</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-100">
                하이브리드형 워크메이트<br />
                사업화 성공 가능성을 높이는 제품 라인업
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-white text-orange-900 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-all shadow-lg">
                  제품 상세보기
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-orange-900 transition-all">
                  구매 문의
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img src="/products/manbo_walker_main.jpg" alt="만보 워크메이트" className="w-full max-w-lg rounded-2xl shadow-2xl" />
                <div className="absolute -bottom-4 -right-4 bg-white text-orange-900 p-4 rounded-xl shadow-lg">
                  <div className="text-sm font-semibold">하이브리드형</div>
                  <div className="text-xs text-gray-600">워크메이트</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            불편을 겪는 사용자들의 현실 사용 경험을 들었습니다
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            시장은 Pain이 뚜렷했고, 대체제가 없고, 명확한 브랜딩을 하는 플레이어가 없었습니다.
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">보행 안전성 및 주행 성능의 한계</h3>
            <p className="text-gray-600 text-sm">불규칙한 지형이나 경사면에서 제동·추진력 부족으로 사고 위험</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">사용자 중심의 인체공학적 설계 미흡</h3>
            <p className="text-gray-600 text-sm">고령 사용자의 체형과 운동 능력, 사용 습관 반영 부족</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">👁️</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">심리적 만족감을 고려하지 않은 디자인</h3>
            <p className="text-gray-600 text-sm">고령 사용자의 정서적 안정감과 자존감 미고려</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">고급화 시대 속 보행 기술 사각지대</h3>
            <p className="text-gray-600 text-sm">AI·센서 등 최신 기술 적용된 안전 문제 장기화</p>
          </div>
        </div>

        {/* Product Features */}
        <div className="bg-gradient-to-r from-orange-400 to-indigo-400 rounded-3xl p-8 md:p-12 text-white mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">듀얼 구동 방식을 적용한 차세대 하이브리드 워크 메이트</h2>
            <p className="text-xl text-orange-100">바람 손잡이와 통 프레임의 차별화된 설계로 안전성을 강화</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">하이브리드 주행 시스템</h3>
                    <p className="text-orange-100">전동과 비전동 모드를 자유롭게 선택하여, 다양한 보행 환경에 맞춰 유연하게 대응 가능</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">경사지 제어 기능</h3>
                    <p className="text-orange-100">오르막에 추력, 내리막에 제동력으로 경사 지형에서도 안정적인 보행을 지원하는 스마트 제어 기능</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">미세 모터 적용</h3>
                    <p className="text-orange-100">사용자의 힘과 속도에 맞춰 미세하게 구동하는 미세모터 적용</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img src="/products/manbo_walker_features.jpg" alt="만보 워크메이트 기능" className="w-full max-w-md rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>

        {/* Smart Features */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">예방과 대응 기능을 모두 담은 지능형 보행 케어 기술</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">비상 시 자동 정지 기능</h3>
              <p className="text-gray-600 mb-6">센서 반응형 브레이크 타이즈로 위급 상황 발생 시 즉각 정지하여, 돌발 사고를 효과적으로 차단하는 비상 대응 기능</p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">비전동모드</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">OFF</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">전동모드</span>
                  <span className="px-2 py-1 bg-indigo-500 text-white text-xs rounded">ON</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">실종 방지 기능(GPS 프로토 완료)</h3>
              <p className="text-gray-600 mb-6">GPS 기반 위치 추적 시스템을 통한 실시간 모니터링으로, 치매 등 고위험군의 실종 사고 예방</p>
              
              <div className="bg-indigo-50 rounded-lg p-4 flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-indigo-900">실시간 위치 추적</div>
                  <div className="text-sm text-indigo-700">가족과 보호자에게 실시간 알림</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">현재 개발 및 제품 라인업 상용화 계획</h2>
            <p className="text-lg text-gray-600">1차 시제품 제작 및 1차 성능평가 완료, 현재 2차 시제품 제작 중, 2026년 6월 런칭 목표</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
              <div className="text-orange-600 font-bold text-sm mb-2">1차 단계 완료</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">시제품 제작 및 성능평가</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• 기본 구조 설계 완료</li>
                <li>• 하이브리드 시스템 프로토타입</li>
                <li>• 초기 사용자 테스트</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-indigo-500">
              <div className="text-indigo-600 font-bold text-sm mb-2">현재 진행중</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2차 시제품 제작</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• GPS 시스템 통합</li>
                <li>• 스마트 제어 시스템 고도화</li>
                <li>• 안전성 강화 설계</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
              <div className="text-orange-600 font-bold text-sm mb-2">2026년 6월 목표</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">상용화 런칭</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• 대량 생산 체계 구축</li>
                <li>• B2B/B2C 판매 채널 오픈</li>
                <li>• 글로벌 시장 진출</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Business Model */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-3xl p-8 md:p-12 text-white mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">B2B를 기반으로 한 확장형 비즈니스 모델</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">B2B (제도 활용 안정적 수익)</h3>
              <div className="space-y-4">
                <p className="text-gray-200">소나버스(제조) → 복지용품 유통(유통) → 시니어(사용자)</p>
                <ul className="space-y-2 text-gray-200">
                  <li>• 한국의 경우 복지용구 제도를 통해 85~100% 할인 가능</li>
                  <li>• 전국 복지용구 사업장 약 2,100개</li>
                  <li>• 노인장기요양보험 등급자 약 120만 명</li>
                </ul>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-lg font-bold mb-2">만보 (하이브리드형)</div>
                  <div className="space-y-1 text-sm">
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
                    <div className="flex justify-between font-bold border-t pt-1">
                      <span>영업이익률</span>
                      <span>33%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">B2C (프리미엄 브랜딩 확장)</h3>
              <div className="space-y-4">
                <p className="text-gray-200">일반 소비자 직접 판매 방식</p>
                <ul className="space-y-2 text-gray-200">
                  <li>• 기존 온라인 구매 고객 및 해외 고객</li>
                  <li>• 프리미엄 브랜딩, 퍼포먼스</li>
                  <li>• 부품 교체, A/S 관리 등 유지보수 서비스</li>
                  <li>• 한정적 시장 규모를 벗어나 확장 가능</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              혁신적인 실용 경험을 통한 기회의 시장 발견
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              현실적인 문제 해결을 통해 현실적인 문제 해결을 제공합니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-700 transition-all shadow-lg">
                <span>제품 상담 신청</span>
              </button>
              <button className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-orange-600 hover:text-white transition-all">
                개발 진행상황 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManboWalkerPage; 