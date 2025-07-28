'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

interface HistoryItem {
  year: string;
  title: string;
  events: string[];
  description: string;
}

const CompanyHistoryPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language === 'en' ? 'en' : 'ko';

  const companyHistory = {
    ko: [
      {
        year: '2022',
        title: '㈜소나버스 법인 설립',
        events: ['기업부설연구소 설립', '여성기업 인증 취득'],
        description: '시니어 케어 시장 진입과 혁신 기술 개발의 시작'
      },
      {
        year: '2023',
        title: '기술력 검증 및 성장 기반 구축',
        events: ['㈜강원대학교 기술지주회사 출자', 'G-스타트업 예비창업 지원사업 선정', 'LINC 3.0 기술사업화 지원사업 선정', '연구소 기업 승인', '벤처기업 인증 취득'],
        description: '정부 지원 사업 선정과 벤처 생태계 진입'
      },
      {
        year: '2024',
        title: '글로벌 진출 및 품질 인증',
        events: ['ISO 인증 취득(9001/14001)', '자본금 증자(0.5억 원 → 1억 원)', '글로벌 MOU 체결 3건', '신용보증기금 Startup-NEST 17기 선정', '창업중심대학 선정', '리틀펭귄 보증 확보', '2024 여성창업경진대회 이사장상 수상', '강소특구 기술이전사업화 R&D 선정'],
        description: '국제 표준 인증과 글로벌 파트너십 구축'
      },
      {
        year: '2025',
        title: '제품 상용화 원년',
        events: ['보듬 기저귀 런칭(2025.06)', '크라우드 펀딩 진행(2025.07)', '알리바바 입점(2025.07)'],
        description: '첫 번째 제품 출시와 본격적인 시장 진입'
      },
      {
        year: '2026',
        title: '하이브리드 워크메이트 출시',
        events: ['만보 런칭 목표(2026.6)'],
        description: '혁신적인 보행 보조 기술의 상용화 달성'
      }
    ],
    en: [
      {
        year: '2022',
        title: 'Sonaverse Co., Ltd. Establishment',
        events: ['Corporate R&D Institute Establishment', 'Women-owned Business Certification'],
        description: 'Entry into senior care market and beginning of innovative technology development'
      },
      {
        year: '2023',
        title: 'Technology Validation and Growth Foundation',
        events: ['Kangwon National University Technology Holding Investment', 'G-Startup Pre-startup Support Program Selection', 'LINC 3.0 Technology Commercialization Support', 'Research Institute Company Approval', 'Venture Company Certification'],
        description: 'Government support program selection and venture ecosystem entry'
      },
      {
        year: '2024',
        title: 'Global Expansion and Quality Certification',
        events: ['ISO Certification (9001/14001)', 'Capital Increase (50M → 100M KRW)', '3 Global MOU Signings', 'Korea Credit Guarantee Fund Startup-NEST 17th Selection', 'Startup-Centered University Selection', 'Little Penguin Guarantee Secured', '2024 Women Entrepreneurship Contest Chairman Award', 'Technology Transfer R&D Selection'],
        description: 'International standard certification and global partnership establishment'
      },
      {
        year: '2025',
        title: 'Product Commercialization Year',
        events: ['Bodume Diaper Launch (June 2025)', 'Crowdfunding Campaign (July 2025)', 'Alibaba Platform Entry (July 2025)'],
        description: 'First product launch and full-scale market entry'
      },
      {
        year: '2026',
        title: 'Hybrid Walkmate Launch',
        events: ['Manbo Launch Target (June 2026)'],
        description: 'Commercialization of innovative walking assistance technology'
      }
    ]
  };

  const history = companyHistory[lang as keyof typeof companyHistory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-slate-800">
            {lang === 'ko' ? '기업 연혁' : 'Company History'}
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {lang === 'ko' 
              ? '2022년 설립 이후 지속적인 성장을 이어가고 있습니다.'
              : 'We have been growing continuously since our establishment in 2022.'
            }
          </p>
        </div>
        
        {/* 연혁 섹션 */}
        <div className="relative mb-8">
          {/* 세로 연결선 */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
          
          <div className="space-y-12">
            {history.map((item: HistoryItem, idx: number) => (
              <div 
                key={idx} 
                className="relative transform transition-all duration-1000"
              >
                {/* 년도 표시 */}
                <div className="absolute left-0 w-12 h-12 bg-[#bda191] rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">{item.year}</span>
                </div>
                
                {/* 내용 카드 */}
                <div className="ml-20">
                  <div className="bg-slate-50 rounded-3xl p-8 hover:bg-white hover:shadow-lg transition-all duration-500 border border-slate-100">
                    <div className="mb-6">
                      <h4 className="text-2xl font-bold text-slate-900">
                        {item.title}
                      </h4>
                    </div>
                    
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* 주요 이벤트 */}
                    {item.events && Array.isArray(item.events) && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {item.events.map((event: string, eventIdx: number) => (
                          <div key={eventIdx} className="flex items-start p-4 bg-white rounded-xl shadow-sm">
                            <div className="w-2 h-2 bg-[#bda191] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-sm text-slate-700 leading-relaxed">{event}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 미래 포인트 - 항상 표시 */}
          <div className="relative">
            <div className="absolute left-0 w-12 h-12 bg-slate-300 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">∞</span>
            </div>
            <div className="ml-20">
              <div className="bg-gradient-to-r from-[#bda191] to-[#a68b7a] rounded-3xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-4">
                  {lang === 'ko' ? '계속되는 여정' : 'Continuing Journey'}
                </h4>
                <p className="text-lg opacity-90">
                  {lang === 'ko' 
                    ? '시니어 라이프 혁신을 위한 소나버스의 도전은 계속됩니다.'
                    : 'SONAVERSE\'s challenge to innovate senior life continues.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Removed "더보기 버튼" as per edit hint */}
      </div>
    </div>
  );
};

export default CompanyHistoryPage; 