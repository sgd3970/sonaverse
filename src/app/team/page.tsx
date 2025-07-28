'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

interface TeamMember {
  name: string;
  role: string;
  background: string;
  experience: string;
  achievements: string;
  img: string;
}

interface Advisor {
  name: string;
  role: string;
  background: string;
  specialty: string;
  img: string;
}

const TeamPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language === 'en' ? 'en' : 'ko';

  const teamInfo = {
    ko: {
      title: '노하우와 전문성으로 시니어 라이프를 혁신할 실행력을 갖춘 원팀',
      coreTeam: [
        {
          name: '이수진',
          role: 'Leader',
          background: '인천대학교 전기공학과, 강원대학교 데이터사이언스학 석사과정',
          experience: '前 자동차안전연구원 부품연구처 연구원, 과기부·중기부 R&D 개발 책임/참여 8회',
          achievements: '2024 G-스타트업 IR 최우수상, 2024 강원청년창업사관학교 졸업, 2024 여성창업경진대회 입상',
          img: '/people/sujin.png'
        },
        {
          name: '이지명',
          role: 'Director',
          background: '연세대학교 전자공학과',
          experience: '관련 경력 15년, 과기부·중기부 R&D 개발 책임/참여 10회, IoT 제어 및 시스템 개발 기획',
          achievements: '前 동부하이텍 반도체 연구원, 前 중기부 평가위원(~2022), 다수 제품 개발 기획 및 사업화 개발',
          img: '/people/jimyung.png'
        },
        {
          name: '조윤석',
          role: 'Developer',
          background: '단국대학교 전기공학, 단국대학교 제어계측 석사수료',
          experience: '보행 모듈 및 플랫폼 개발, 전동 제어 및 기기 계측',
          achievements: 'IR52 장영실상 수상, 前 Silicon Valley Group: Lithography Field Service Engineer(1997~2022)',
          img: '/people/yoonseok.png'
        },
        {
          name: '김영석',
          role: 'Developer',
          background: '홍익대학교 기계공학 학·석사',
          experience: '관련 경력 20년, 자동화 기계 제작 개발, 기기 설계 및 기구 제작',
          achievements: 'LG 생활건강 기저귀 실험 장비 개발 및 납품, 모듈 및 제어 기기 개발',
          img: '/people/youngseok.png'
        }
      ],
      advisors: [
        {
          name: '이주열',
          role: '자문위원',
          background: '서울벤처대학원대학교 연구교수, 호서대 벤처기술창업대학원 교수',
          specialty: '글로벌 오픈이노베이션 포럼 리더',
          img: '/people/jooyeol.png'
        },
        {
          name: '권오원',
          role: '자문위원',
          background: '한국기계연구원 융합기술센터장, 미국 신시내티대 기계공학 박사',
          specialty: '생활지원기기 및 의료기기 개발',
          img: '/people/owon.png'
        },
        {
          name: '이종하',
          role: '자문위원', 
          background: '계명대학교 의용공학과 교수, 미국 템플대 전기공학 박사',
          specialty: '고령친화제품 사용성평가센터장',
          img: '/people/jongha.png'
        },
        {
          name: '고준월',
          role: '자문위원',
          background: '현직 요양보호사 및 간병',
          specialty: '시니어 프로덕트 현장 자문',
          img: '/people/junwol.png'
        }
      ]
    },
    en: {
      title: 'One Team with Execution Capabilities to Innovate Senior Life with Know-how and Expertise',
      coreTeam: [
        {
          name: 'Sujin Lee',
          role: 'Leader',
          background: 'Incheon University Electrical Engineering, Kangwon University Data Science Master\'s Course',
          experience: 'Former Automotive Safety Research Institute Researcher, 8 times R&D project leader/participant',
          achievements: '2024 G-Startup IR Excellence Award, 2024 Kangwon Youth Startup Academy Graduate',
          img: '/people/sujin.png'
        },
        {
          name: 'Jimyung Lee',
          role: 'Director',
          background: 'Yonsei University Electronics Engineering',
          experience: '15 years experience, 10 times R&D project leader/participant, IoT control system development',
          achievements: 'Former DB HiTek Semiconductor Researcher, Former SMBA Evaluator (~2022)',
          img: '/people/jimyung.png'
        },
        {
          name: 'Yoonseok Cho',
          role: 'Developer',
          background: 'Dankook University Electrical Engineering, Control & Measurement Master\'s',
          experience: 'Walking module and platform development, electric control and instrument measurement',
          achievements: 'IR52 Jang Yeong-sil Award, Former Silicon Valley Group Engineer(1997~2022)',
          img: '/people/yoonseok.png'
        },
        {
          name: 'Youngseok Kim',
          role: 'Developer',
          background: 'Hongik University Mechanical Engineering Bachelor\'s & Master\'s',
          experience: '20 years experience, automation machinery development, equipment design',
          achievements: 'LG Household & Health Care diaper test equipment development and supply',
          img: '/people/youngseok.png'
        }
      ],
      advisors: [
        {
          name: 'Jooyeol Lee',
          role: 'Advisor',
          background: 'Research Professor at Seoul Venture Graduate University',
          specialty: 'Global Open Innovation Forum Leader',
          img: '/people/jooyeol.png'
        },
        {
          name: 'Owon Kwon',
          role: 'Advisor',
          background: 'KIMM Convergence Technology Center Director, PhD from University of Cincinnati',
          specialty: 'Living Support Equipment and Medical Device Development',
          img: '/people/owon.png'
        },
        {
          name: 'Jongha Lee',
          role: 'Advisor',
          background: 'Keimyung University Biomedical Engineering Professor, PhD from Temple University',
          specialty: 'Elderly-friendly Product Usability Evaluation Center Head',
          img: '/people/jongha.png'
        },
        {
          name: 'Junwol Ko',
          role: 'Advisor',
          background: 'Active caregiver and nursing assistant',
          specialty: 'Senior product field consultation',
          img: '/people/junwol.png'
        }
      ]
    }
  };

  const team = teamInfo[lang as keyof typeof teamInfo];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-slate-800">
            {lang === 'ko' ? '팀 소개' : 'Team Introduction'}
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {team.title}
          </p>
        </div>
        
        {/* 코어 팀 섹션 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-700 mb-8 text-center">
            {lang === 'ko' ? '핵심 팀' : 'Core Team'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.coreTeam.map((member: TeamMember, idx: number) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* 헤더 영역 */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={member.img} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e: any) => e.target.style.display = 'none'}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                      <p className="text-sm text-slate-200 font-medium">{member.role}</p>
                    </div>
                  </div>
                </div>
                
                {/* 상세 정보 영역 */}
                <div className="p-6">
                  {/* 학력/배경 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#bda191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      {lang === 'ko' ? '학력' : 'Education'}
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {member.background.split(',').map((item: string, bgIdx: number) => (
                        <li key={bgIdx} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-[#bda191] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{item.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* 경력/경험 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#bda191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                      {lang === 'ko' ? '경력' : 'Experience'}
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {member.experience.split(',').map((item: string, expIdx: number) => (
                        <li key={expIdx} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-[#bda191] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{item.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* 주요 성과 */}
                  {member.achievements && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-[#bda191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        {lang === 'ko' ? '주요 성과' : 'Key Achievements'}
                      </h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {member.achievements.split(',').map((item: string, achIdx: number) => (
                          <li key={achIdx} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#bda191] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            <span className="leading-relaxed">{item.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 자문위원 섹션 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-700 mb-8 text-center">
            {lang === 'ko' ? '자문위원' : 'Advisory Board'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.advisors.map((advisor: Advisor, idx: number) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* 프로필 이미지 */}
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                  <img 
                    src={advisor.img} 
                    alt={advisor.name}
                    className="w-full h-full object-cover"
                    onError={(e: any) => e.target.style.display = 'none'}
                  />
                </div>
                
                {/* 정보 */}
                <div className="p-6">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{advisor.name}</h4>
                  <p className="text-sm text-[#bda191] font-semibold mb-3">{advisor.role}</p>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{advisor.background}</p>
                  {advisor.specialty && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">{lang === 'ko' ? '전문분야' : 'Specialty'}</p>
                      <p className="text-sm text-gray-700">{advisor.specialty}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage; 