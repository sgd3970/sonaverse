'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../src/app/i18n';

const heroContent = {
  ko: {
    headline: '시니어 라이프를 혁신하는',
    subheadline: '소나버스',
    description: '불편을 겪는 사용자들의 현실을 통해 발견한 혁신.<br />명확한 브랜딩으로 시니어 보행 기술의 사각지대를 해결합니다.',
    cta: '',
    stats: [
      { number: '120만', label: '노인장기요양보험 등급자' },
      { number: '2,100개', label: '전국 복지용구 사업장' },
      { number: '2026년', label: '만보 런칭 목표' }
    ]
  },
  en: {
    headline: 'Revolutionizing Senior Life',
    subheadline: 'SONAVERSE',
    description: 'Innovation discovered through real user experiences. Clear branding to solve blind spots in senior mobility technology.',
    cta: '',
    stats: [
      { number: '1.2M', label: 'Long-term Care Insurance Users' },
      { number: '2,100', label: 'Welfare Equipment Businesses' },
      { number: '2026', label: 'Manbo Launch Target' }
    ]
  },
};

// 우리가 해결하고자 하는 문제들
const problemsToSolve = {
  ko: [
    {
      title: '보행 안전성 및 주행 성능의 한계',
      description: '불규칙한 지형이나 경사면에서 제동·추진력 부족으로 사고 위험 증가',
      icon: '⚠️'
    },
    {
      title: '사용자 중심의 인체공학 설계 미흡',
      description: '고령 사용자의 체형과 운동 능력을 반영하지 못한 설계로 장시간 사용 곤란',
      icon: '🔧'
    },
    {
      title: '심리적 만족감을 고려하지 않은 디자인',
      description: '고령 사용자의 정서적 안정과 자존감을 고려하지 않아 일상에서 이질감',
      icon: '❤️'
    },
    {
      title: '고령화 시대 속 보행 기술 사각지대',
      description: 'AI·센서 등 최신 기술이 적용되지 않아 보행 시장의 발전 지연',
      icon: '🚀'
    }
  ],
  en: [
    {
      title: 'Walking Safety & Performance Limitations',
      description: 'Increased accident risk due to insufficient braking and propulsion on irregular terrain',
      icon: '⚠️'
    },
    {
      title: 'Insufficient User-Centered Ergonomic Design',
      description: 'Design that fails to reflect elderly users\' body types and motor abilities',
      icon: '🔧'
    },
    {
      title: 'Design Without Psychological Satisfaction',
      description: 'Lack of consideration for emotional stability and self-esteem of elderly users',
      icon: '❤️'
    },
    {
      title: 'Technology Blind Spots in Aging Society',
      description: 'Walking market lagging behind due to lack of AI and sensor technology application',
      icon: '🚀'
    }
  ]
};

// 만보 워크메이트 상세 정보
const manboDetails = {
  ko: {
    title: '만보 (Manual Walkmate MANBO)',
    subtitle: '하이브리드형 워크메이트',
    description: '바형 손잡이와 통 프레임의 차별화된 설계로 안전성을 갖추며, 경사지 제어를 포함한 스마트 기능의 편의성을 갖춘,<br />사용자 만족도를 극대화한 국내 유일 하이브리드형 워크메이트',
    features: [
      {
        title: '하이브리드 주행 시스템',
        description: '전동과 비전동 모드를 자유롭게 선택할 수 있어, 다양한 보행 환경에 맞춰 유연하게 대응 가능',
        details: ['비전동모드: 가볍게 걸을 땐 스스로 밀며 사용', '전동모드: 언덕길이나 피로 상황에서는 자동 보행 보조']
      },
      {
        title: '경사지 제어 기능',
        description: '오르막엔 추진력, 내리막엔 제동력으로 경사 지형에서도 안정적인 보행을 지원하는 스마트 제어 기능',
        details: ['사용자의 힘과 속도에 맞춰 미세하게 구동하는 미세 모터 적용', '추진력 제공과 사용자 지지력 제동력 제공']
      },
      {
        title: '비상 시 자동 정지 기능',
        description: '센서 반응형 브레이크 탑재로 위급 상황 발생 시 즉각 정지하여, 돌발 사고를 효과적으로 차단',
        details: ['제어패널, 전원모듈, 구동 및 제어 PCB, 터치센서 통합']
      },
      {
        title: '실종 방지 기능',
        description: 'GPS 기반 위치 추적 시스템을 통한 실시간 모니터링으로, 치매 등 고위험군의 실종 사고 예방',
        details: ['개별 프로토타입 완료', '가족이 스마트폰으로 실시간 위치 확인 가능']
      }
    ],
    status: '1차 시제품 제작 및 1차 성능평가 완료, 현재 2차 시제품 제작 중, 2026년 6월 런칭 목표'
  },
  en: {
    title: 'MANBO (Manual Walkmate MANBO)',
    subtitle: 'Hybrid Walkmate',
    description: 'Korea\'s only hybrid walkmate with differentiated bar handle and cylindrical frame design for safety, smart slope control functions for convenience, maximizing user satisfaction.',
    features: [
      {
        title: 'Hybrid Driving System',
        description: 'Freely choose between electric and manual modes, flexibly responding to various walking environments',
        details: ['Manual Mode: Push yourself when walking lightly', 'Electric Mode: Automatic walking assistance on hills or when tired']
      },
      {
        title: 'Slope Control Function',
        description: 'Smart control function providing propulsion on uphill and braking on downhill for stable walking on slopes',
        details: ['Fine motor applied to drive precisely according to user\'s strength and speed', 'Provides propulsion and user support braking']
      },
      {
        title: 'Emergency Auto-Stop Function',
        description: 'Sensor-responsive brakes immediately stop in emergency situations, effectively preventing sudden accidents',
        details: ['Integrated control panel, power module, drive & control PCB, touch sensor']
      },
      {
        title: 'Lost Prevention Function',
        description: 'Real-time monitoring through GPS-based location tracking system to prevent disappearance of high-risk groups like dementia patients',
        details: ['Individual prototype completed', 'Family can check real-time location via smartphone']
      }
    ],
    status: '1st prototype completed and 1st performance evaluation done, currently making 2nd prototype, targeting June 2026 launch'
  }
};

// 보듬 기저귀 상세 정보
const bodeumDetails = {
  ko: {
    title: '보듬 (BODUME)',
    subtitle: '부모님을 위한 작은 배려',
    description: '성인용 기저귀의 실제 구매자이자 사용자의 현장 경험을 통해 제작.<br />실제 현직 요양보호사와 팀을 이루어 실제 사용자 및 구매자의 개선점을 반영한 성인용 기저귀',
    meaning: '"보듬"이란, 부모님의 하루를 보듬어 살핀다 라는 뜻으로 사랑을 의미합니다.',
    features: [
      {
        title: '안심할 수 있는 코어 설계',
        description: '3중 흡수층으로 2,000ml의 강력한 흡수력 제공',
        icon: '💧'
      },
      {
        title: '샘 방지막 설계',
        description: '흡수층을 보조하는 샘 방지막으로 완벽한 누수 방지',
        icon: '🛡️'
      },
      {
        title: '천연 펄프 사용',
        description: '부드러운 순면감촉으로 피부에 자극 없이 편안함',
        icon: '🌿'
      },
      {
        title: '편안한 허리밴드',
        description: '뛰어난 신축성과 특수 공법을 사용한 밴드로<br />피부에 찔리지 않고 부드러움',
        icon: '✨'
      },
      {
        title: '믿을 수 있는 제품',
        description: 'ISO, FDA, CE 기준 준수 제조 시설에서 생산',
        icon: '🏆'
      }
    ],
    lineup: [
      '팬티형 기저귀 중형',
      '팬티형 기저귀 대형', 
      '속기저귀 일자형',
      '속기저귀 라운드형',
      '위생 깔개매트'
    ],
    business: '한번 사용하면 계속 구매하게 되는 상품으로 브랜딩 후 지속적인 매출 가능.<br />이후 수출 국가에 맞는 다양한 사이즈, 품목 지속적으로 증가 계획'
  },
  en: {
    title: 'BODUME',
    subtitle: 'Small Consideration for Parents',
    description: 'Created through real field experience of actual buyers and users of adult diapers. Developed in partnership with active caregivers to reflect improvements from actual users and buyers.',
    meaning: '"Bodume" means caring for parents\' daily life with love.',
    features: [
      {
        title: 'Reliable Core Design',
        description: 'Triple absorption layer providing powerful 2,000ml absorption capacity',
        icon: '💧'
      },
      {
        title: 'Leak Prevention Design',
        description: 'Leak prevention barrier supporting absorption layer for perfect leakage prevention',
        icon: '🛡️'
      },
      {
        title: 'Natural Pulp Material',
        description: 'Soft cotton touch comfortable on skin without irritation',
        icon: '🌿'
      },
      {
        title: 'Comfortable Waistband',
        description: 'Excellent elasticity and special construction band that\'s soft without irritating skin',
        icon: '✨'
      },
      {
        title: 'Trustworthy Product',
        description: 'Manufactured in facilities complying with ISO, FDA, CE standards',
        icon: '🏆'
      }
    ],
    lineup: [
      'Panty-type Diaper Medium',
      'Panty-type Diaper Large',
      'Insert Diaper Straight',
      'Insert Diaper Round',
      'Hygiene Pad Mat'
    ],
    business: 'Products that customers continue to purchase after first use, enabling continuous sales after branding. Plans to continuously increase various sizes and items for export countries.'
  }
};

// 팀 정보
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

// 회사 연혁
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

// 비즈니스 모델 및 시장 전략
const businessStrategy = {
  ko: {
    title: 'B2B를 기반으로 한 확장형 비즈니스 모델',
    b2b: {
      title: 'B2B: 제도 활용 안정적 수익 기반 마련 가능',
      description: '소나버스(제조) → 복지용품 유통(유통) → 시니어(사용자)',
      advantages: [
        '한국의 경우 복지용구 제도를 통해 85~100% 할인 가능<br />(수동형 4만5천원, 하이브리드 10만5천원)',
        '전국 복지용구 사업장 약 2,100개',
        '노인장기요양보험 등급자 약 120만 명'
      ]
    },
    b2c: {
      title: 'B2C: 프리미엄 브랜딩 확장 전략',
      description: '일반 소비자 직접 판매 방식',
      advantages: [
        '기존 온라인 구매 고객 및 해외 고객',
        '프리미엄 브랜딩, 퍼포먼스',
        '부품 교체, A/S 관리 등 유지보수 서비스',
        '한정적 시장 규모에서 벗어나 확장 가능'
      ]
    },
    profitability: {
      title: '만보 (하이브리드형) 수익성',
      price: '700,000원',
      cost: '250,000원',
      profit: '230,000원',
      margin: '33%'
    }
  },
  en: {
    title: 'Scalable Business Model Based on B2B',
    b2b: {
      title: 'B2B: Stable Revenue Base Through System Utilization',
      description: 'Sonaverse (Manufacturing) → Welfare Product Distribution → Seniors (Users)',
      advantages: [
        'In Korea, 85-100% discount available through welfare equipment system (Manual 45,000 KRW, Hybrid 105,000 KRW)',
        'Approximately 2,100 welfare equipment businesses nationwide',
        'Approximately 1.2 million long-term care insurance recipients'
      ]
    },
    b2c: {
      title: 'B2C: Premium Branding Expansion Strategy',
      description: 'Direct consumer sales approach',
      advantages: [
        'Existing online customers and overseas customers',
        'Premium branding and performance',
        'Parts replacement and A/S maintenance services',
        'Expansion beyond limited market size'
      ]
    },
    profitability: {
      title: 'Manbo (Hybrid) Profitability',
      price: '700,000 KRW',
      cost: '250,000 KRW',
      profit: '230,000 KRW',
      margin: '33%'
    }
  }
};

const HomePage: React.FC = () => {
  const { i18n } = useTranslation('common');
  const lang = i18n.language === 'en' ? 'en' : 'ko';
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState<any>({});
  const [pressData, setPressData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [brandStoryData, setBrandStoryData] = useState<any[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: any[]) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            setIsVisible((prev: any) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Fetch press releases
    fetch('/api/press?limit=6&published=true')
      .then(res => res.json())
      .then(data => {
        console.log('Press data:', data);
        setPressData(data.results || []);
      })
      .catch(err => console.error('Error fetching press:', err));

    // Fetch blog posts
    fetch('/api/blog?limit=6&published=true')
      .then(res => res.json())
      .then(data => {
        console.log('Blog data:', data);
        setBlogData(data.results || []);
      })
      .catch(err => console.error('Error fetching blog:', err));

    // Fetch brand stories from pages API
    fetch('/api/pages?limit=6')
      .then(res => res.json())
      .then(data => {
        console.log('Pages data:', data);
        // Filter pages by category or type if available
        let brandStories: any[] = Array.isArray(data.results || data) ? (data.results || data).filter((page: any) => 
          page.category === 'brand-story' || 
          page.type === 'brand-story' ||
          page.slug?.includes('brand')
        ).slice(0, 6) : [];
        
        // If no brand stories found, create mock data
        if (brandStories.length === 0) {
          brandStories = [
            {
              slug: 'our-journey-from-startup-to-leader',
              content: {
                ko: {
                  title: '스타트업에서 리더로: 우리의 여정',
                  subtitle: '작은 아이디어에서 시작하여 산업을 선도하기까지의 여정',
                  thumbnail_url: '/logo/symbol_logo.png'
                },
                en: {
                  title: 'From Startup to Leader: Our Journey',
                  subtitle: 'From a small idea to leading the industry',
                  thumbnail_url: '/logo/symbol_logo.png'
                }
              },
              created_at: '2024-01-15',
              published_date: '2024-01-15'
            },
            {
              slug: 'innovation-at-the-core-of-our-brand',
              content: {
                ko: {
                  title: '브랜드의 핵심, 혁신',
                  subtitle: '브랜드의 핵심 가치와 혁신 사례를 소개합니다',
                  thumbnail_url: '/logo/symbol_logo.png'
                },
                en: {
                  title: 'Innovation at the Core of Our Brand',
                  subtitle: 'Introducing the core values and innovation cases',
                  thumbnail_url: '/logo/symbol_logo.png'
                }
              },
              created_at: '2024-02-20',
              published_date: '2024-02-20'
            },
            {
              slug: 'building-trust-with-seniors',
              content: {
                ko: {
                  title: '시니어와 함께 만들어가는 신뢰',
                  subtitle: '고객의 목소리에 귀 기울이며 만들어가는 브랜드 스토리',
                  thumbnail_url: '/logo/symbol_logo.png'
                },
                en: {
                  title: 'Building Trust with Seniors',
                  subtitle: 'Brand story built by listening to customer voices',
                  thumbnail_url: '/logo/symbol_logo.png'
                }
              },
              created_at: '2024-03-10',
              published_date: '2024-03-10'
            }
          ];
        }
        
        setBrandStoryData(brandStories);
      })
      .catch(err => {
        console.error('Error fetching brand stories:', err);
        // Set mock data on error
        setBrandStoryData([
          {
            slug: 'our-journey-from-startup-to-leader',
            content: {
              ko: {
                title: '스타트업에서 리더로: 우리의 여정',
                subtitle: '작은 아이디어에서 시작하여 산업을 선도하기까지의 여정',
                thumbnail_url: '/logo/symbol_logo.png'
              },
              en: {
                title: 'From Startup to Leader: Our Journey',
                subtitle: 'From a small idea to leading the industry',
                thumbnail_url: '/logo/symbol_logo.png'
              }
            },
            created_at: '2024-01-15',
            published_date: '2024-01-15'
          }
        ] as any[]);
      });
  }, [lang]);

  const content: any = heroContent[lang];
  const problems: any = problemsToSolve[lang];
  const manbo: any = manboDetails[lang];
  const bodeum: any = bodeumDetails[lang];
  const team: any = teamInfo[lang];
  const history: any = companyHistory[lang];
  const business: any = businessStrategy[lang];

  // Auto-sliding Carousel component
  const ContentCarousel = ({ items, type }: { items: any[]; type: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    // Auto-slide functionality
    useEffect(() => {
      if (!items || items.length <= 3 || isHovered) return;
      
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.max(1, items.length - 2));
      }, 3000); // Slide every 3 seconds
      
      return () => clearInterval(interval);
    }, [items, isHovered]);

    if (!items || items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">{lang === 'ko' ? '콘텐츠를 불러오는 중...' : 'Loading content...'}</p>
        </div>
      );
    }

    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
          >
            {items.map((item: any, idx: any) => {
              const itemContent = item.content?.[lang] || item.content?.ko || item.content?.en || item;
              const thumbnailUrl = itemContent.thumbnail_url || item.thumbnail || '/logo/nonImage_logo.png';
              const title = itemContent.title || item.title || 'No Title';
              const description = itemContent.subtitle || item.summary || item.excerpt || item.description || 'No description available';
              
              return (
                <div key={idx} className="w-1/3 flex-shrink-0 px-3">
                  <div 
                    onClick={() => window.location.href = `/${type}/${item.slug}`}
                    className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full cursor-pointer"
                  >
                    <img 
                      src={thumbnailUrl}
                      alt={title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                    />
                    <h3 className="text-lg font-bold mb-2 text-slate-800 line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 max-w-xs">
                      {description}
                    </p>
                    <div className="flex justify-start items-center text-xs text-gray-500">
                      <span>{new Date(item.published_date || item.created_at || item.createdAt || Date.now()).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section - 전체화면 */}
      <section 
        id="hero" 
        data-section 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url('/hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <div className={`transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight">
              {content.headline}
            </h1>
            <h2 className="text-2xl md:text-4xl font-light mb-6 text-rose-100">
              {content.subheadline}
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-4xl mx-auto leading-relaxed text-gray-200"
               dangerouslySetInnerHTML={{ __html: content.description }} />
          </div>
          
          {/* 통계 */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.stats.map((stat: any, idx: number) => (
              <div key={idx} className={`transform transition-all duration-1000 delay-${(idx + 1) * 200} ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                  <div className="text-3xl font-bold text-orange-200 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 문제 정의 섹션 - 전체화면 */}
      <section 
        id="problems" 
        data-section 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible.problems ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-800">
              {lang === 'ko' ? '우리가 해결하고자 하는 문제' : 'Problems We Aim to Solve'}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
              {lang === 'ko' 
                ? '시장은 Pain이 뚜렷했고, 대체제가 없고, 명확한 브랜딩을 하는 플레이어가 없었습니다.'
                : 'The market had clear pain points, no alternatives, and no players with clear branding.'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {problems.map((problem: any, idx: number) => (
              <div 
                key={idx} 
                className={`transform transition-all duration-1000 delay-${idx * 200} ${isVisible.problems ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              >
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="text-4xl mb-4">{problem.icon}</div>
                  <h3 className="text-lg font-bold mb-3 text-slate-800">{problem.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{problem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 만보 워크메이트 섹션 - 전체화면 */}
      <section 
        id="manbo" 
        data-section 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-800/10 to-slate-700/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-white">
          <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible.manbo ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              {manbo.title}
            </h2>
            <h3 className="text-xl md:text-2xl font-light mb-6 text-orange-200">{manbo.subtitle}</h3>
            <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto leading-relaxed mb-6">
              {manbo.description}
            </p>
            <div className="inline-block bg-orange-600/20 backdrop-blur-lg rounded-full px-5 py-2 border border-orange-400/30">
              <span className="text-sm text-orange-200">{manbo.status}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {manbo.features.map((feature: any, idx: number) => (
              <div 
                key={idx} 
                className={`transform transition-all duration-1000 delay-${idx * 200} ${isVisible.manbo ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500">
                  <h4 className="text-lg font-bold mb-3 text-orange-200">{feature.title}</h4>
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail: any, detailIdx: any) => (
                      <li key={detailIdx} className="text-xs text-gray-400 flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 보듬 기저귀 섹션 - 전체화면 */}
      <section 
        id="bodeum" 
        data-section 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-stone-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible.bodeum ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-800">
              {bodeum.title}
            </h2>
            <h3 className="text-xl md:text-2xl font-light mb-6 text-rose-700">{bodeum.subtitle}</h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed mb-4">
              {bodeum.description}
            </p>
            <div className="text-rose-700 text-base md:text-lg font-semibold">
              {bodeum.meaning}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {bodeum.features.map((feature: any, idx: number) => (
              <div 
                key={idx} 
                className={`transform transition-all duration-1000 delay-${idx * 100} ${isVisible.bodeum ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              >
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-center">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h4 className="text-lg font-bold mb-2 text-slate-800">{feature.title}</h4>
                  <div className="text-sm text-gray-600">
                    {feature.description.split(/<br\s*\/?>|\n/).map((line: any, i: any, arr: any[]) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible.bodeum ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-xl">
                <h4 className="text-2xl font-bold mb-6 text-purple-800">{lang === 'ko' ? '현재 라인업' : 'Current Lineup'}</h4>
                <ul className="space-y-3">
                  {bodeum.lineup.map((item: any, idx: any) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className={`transform transition-all duration-1000 delay-400 ${isVisible.bodeum ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-xl">
                <h4 className="text-2xl font-bold mb-6 text-purple-800">{lang === 'ko' ? '비즈니스 모델' : 'Business Model'}</h4>
                <div className="text-gray-600 mb-6">
                  {bodeum.business.split(/<br\s*\/?>|\n/).map((line: string, i: number, arr: string[]) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* 제품 링크 */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => window.location.href = '/products/bodeum-diaper'}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {lang === 'ko' ? '제품 보러가기' : 'View Product'}
                  </button>
                  <button 
                    onClick={() => window.open('https://bodume.com/', '_blank')}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {lang === 'ko' ? '제품 구매하러가기' : 'Buy Product'}
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 팀 소개 섹션 - 전체화면 */}
      <section 
        id="team" 
        data-section 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-800/10 to-slate-700/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-white">
          <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible.team ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white">
              {team.title}
            </h2>
          </div>
          
          {/* 핵심 팀 */}
          <div className="mb-20">
            <h3 className={`text-2xl md:text-3xl font-bold mb-8 text-center text-orange-300 transform transition-all duration-1000 delay-200 ${isVisible.team ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              {lang === 'ko' ? '핵심 팀' : 'Core Team'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {team.coreTeam.map((member: any, idx: any) => (
                <div 
                  key={idx} 
                  className={`transform transition-all duration-1000 delay-${(idx + 1) * 200} ${isVisible.team ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 h-full">
                    <div className="flex items-center mb-6">
                      <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full object-cover border-4 border-orange-300 mr-6" />
                      <div>
                        <h4 className="text-2xl font-bold text-white">{member.name}</h4>
                        <span className="text-orange-300 font-semibold">{member.role}</span>
                      </div>
                    </div>
                    <div className="space-y-3 text-gray-300">
                      <p><span className="text-orange-300 font-semibold">{lang === 'ko' ? '학력:' : 'Education:'}</span> {member.background}</p>
                      <p><span className="text-orange-300 font-semibold">{lang === 'ko' ? '경력:' : 'Experience:'}</span> {member.experience}</p>
                      <p><span className="text-orange-300 font-semibold">{lang === 'ko' ? '성과:' : 'Achievements:'}</span> {member.achievements}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 자문위원 */}
          <div>
            <h3 className={`text-2xl md:text-3xl font-bold mb-8 text-center text-orange-300 transform transition-all duration-1000 delay-600 ${isVisible.team ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              {lang === 'ko' ? '자문위원' : 'Advisors'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.advisors.map((advisor: any, idx: any) => (
                <div 
                  key={idx} 
                  className={`transform transition-all duration-1000 delay-${(idx + 7) * 100} ${isVisible.team ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 text-center h-full flex flex-col">
                    <img src={advisor.img} alt={advisor.name} className="w-16 h-16 rounded-full object-cover border-3 border-orange-300 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-white mb-1">{advisor.name}</h4>
                    <span className="text-orange-300 text-sm font-semibold block mb-3">{advisor.role}</span>
                    <div className="text-gray-400 text-sm mb-2">
                      <ul className="list-disc pl-5 text-gray-400 text-sm text-left">
                        {advisor.background.split(',').map((item: any, i: any) => <li key={i}>{item.trim()}</li>)}
                      </ul>
                    </div>
                    <div className="text-gray-400 text-xs">
                      <ul className="list-disc pl-5 text-gray-400 text-xs text-left">
                        {advisor.specialty.split(',').map((item: any, i: any) => <li key={i}>{item.trim()}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 회사 연혁 섹션 - 전체화면 */}
      <section 
        id="history" 
        data-section 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-slate-50 to-orange-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible.history ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-800">
              {lang === 'ko' ? '한 걸음씩 성실히 걸어온' : 'Step by Step, Walking Steadily'}
            </h2>
            <h3 className="text-xl md:text-2xl font-light mb-6 text-orange-700">
              {lang === 'ko' ? '소나버스의 여정' : 'SONAVERSE Journey'}
            </h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              {lang === 'ko' 
                ? '앞으로도 시니어와 함께 걸어가겠습니다.'
                : 'We will continue walking together with seniors.'
              }
            </p>
          </div>
          
          <div className="relative">
            {/* 타임라인 선 */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-600 to-orange-600 rounded-full"></div>
            
            <div className="space-y-16">
              {history.map((item: any, idx: any) => (
                <div 
                  key={idx} 
                  className={`relative transform transition-all duration-1000 delay-${idx * 200} ${isVisible.history ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                >
                  <div className={`flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* 년도 원 */}
                    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-slate-600 to-orange-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                      <span className="text-white font-bold text-sm">{item.year}</span>
                    </div>
                    
                    {/* 내용 카드 */}
                    <div className={`flex-1 ml-24 md:ml-0 ${idx % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                      <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <h4 className="text-xl font-bold mb-3 text-slate-800">{item.title}</h4>
                        <p className="text-gray-600 mb-6">{item.description}</p>
                        <ul className="space-y-2">
                          {item.events.map((event: any, eventIdx: any) => (
                            <li key={eventIdx} className="flex items-start text-gray-700">
                              <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              <span className="text-sm">{event}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 언론보도 섹션 */}
      <section 
        id="press" 
        data-section 
        className="py-20 bg-gradient-to-br from-slate-100 to-stone-100 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible.press ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-800">
              {lang === 'ko' ? '언론보도' : 'Press Release'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {lang === 'ko' ? '소나버스의 소식을 확인해보세요' : 'Check out the latest news about SONAVERSE'}
            </p>
          </div>
          <div className={`transform transition-all duration-1000 delay-200 ${isVisible.press ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <ContentCarousel items={pressData} type="press" />
          </div>
        </div>
      </section>

      {/* 블로그 섹션 */}
      <section 
        id="blog" 
        data-section 
        className="py-20 bg-gradient-to-br from-rose-50 to-stone-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible.blog ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-800">
              {lang === 'ko' ? '블로그' : 'Blog'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {lang === 'ko' ? '소나버스의 인사이트를 만나보세요' : 'Discover insights from SONAVERSE'}
            </p>
          </div>
          <div className={`transform transition-all duration-1000 delay-200 ${isVisible.blog ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <ContentCarousel items={blogData} type="blog" />
          </div>
        </div>
      </section>

      {/* 브랜드 스토리 섹션 */}
      <section 
        id="brand-story" 
        data-section 
        className="py-20 bg-gradient-to-br from-stone-50 to-slate-100 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible.brandStory ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-800">
              {lang === 'ko' ? '브랜드 스토리' : 'Brand Story'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {lang === 'ko' ? '소나버스의 이야기를 들어보세요' : 'Listen to the story of SONAVERSE'}
            </p>
          </div>
          <div className={`transform transition-all duration-1000 delay-200 ${isVisible.brandStory ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <ContentCarousel items={brandStoryData} type="brand-story" />
          </div>
        </div>
      </section>

      {/* 비즈니스 모델 섹션 - 전체화면 */}
      <section 
        id="business" 
        data-section 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-stone-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible.business ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-800">
              {business.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* B2B */}
            <div className={`transform transition-all duration-1000 delay-200 ${isVisible.business ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-xl h-full">
                <h3 className="text-2xl font-bold mb-4 text-slate-800">{business.b2b.title}</h3>
                <div className="text-gray-600 mb-6">
                  {business.b2b.description.split(/<br\s*\/?>|\n/).map((line: string, i: number, arr: string[]) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <ul className="space-y-3">
                  {business.b2b.advantages.map((advantage: any, idx: number) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* B2C */}
            <div className={`transform transition-all duration-1000 delay-400 ${isVisible.business ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-xl h-full">
                <h3 className="text-2xl font-bold mb-4 text-slate-800">{business.b2c.title}</h3>
                <div className="text-gray-600 mb-6">
                  {business.b2c.description.split(/<br\s*\/?>|\n/).map((line: string, i: number, arr: string[]) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <ul className="space-y-3">
                  {business.b2c.advantages.map((advantage: any, idx: number) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm">{advantage}</span>
                    </li>
                  ))}
        </ul>
              </div>
            </div>
          </div>
          
          {/* 수익성 정보 */}
          <div className={`transform transition-all duration-1000 delay-600 ${isVisible.business ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="bg-gradient-to-r from-slate-700 to-orange-700 rounded-3xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-6">{business.profitability.title}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-2">{business.profitability.price}</div>
                  <div className="text-orange-200">{lang === 'ko' ? '판매가' : 'Price'}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{business.profitability.cost}</div>
                  <div className="text-orange-200">{lang === 'ko' ? '제조원가' : 'Cost'}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{business.profitability.profit}</div>
                  <div className="text-orange-200">{lang === 'ko' ? '영업이익' : 'Profit'}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{business.profitability.margin}</div>
                  <div className="text-orange-200">{lang === 'ko' ? '영업이익률' : 'Margin'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 기업 문의 버튼 */}
          <div className={`text-center mt-16 transform transition-all duration-1000 delay-800 ${isVisible.business ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <button 
              onClick={() => window.location.href = '/inquiry'}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-slate-700 to-orange-700 text-white rounded-full hover:from-slate-800 hover:to-orange-800 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {lang === 'ko' ? '기업 문의하기' : 'Business Inquiry'}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
