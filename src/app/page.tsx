'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../src/app/i18n';

// 타입 정의
interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  content: {
    ko: {
      title: string;
      subtitle: string;
      body: string;
      thumbnail_url?: string;
    };
    en: {
      title: string;
      subtitle: string;
      body: string;
      thumbnail_url?: string;
    };
  };
  summary?: string;
  excerpt?: string;
  thumbnail?: string;
  published_date?: string;
  created_at: string;
  is_published: boolean;
}

interface PressRelease {
  _id: string;
  slug: string;
  press_name: {
    ko: string;
    en: string;
  };
  content: {
    ko: {
      title: string;
      body: string;
      external_link?: string;
    };
    en: {
      title: string;
      body: string;
      external_link?: string;
    };
  };
  published_date?: string;
  created_at: string;
  is_published: boolean;
}

interface BrandStory {
  _id: string;
  slug: string;
  content: {
    ko: {
      title: string;
      subtitle: string;
      body: string;
      thumbnail_url?: string;
    };
    en: {
      title: string;
      subtitle: string;
      body: string;
      thumbnail_url?: string;
    };
  };
  published_date?: string;
  created_at: string;
  is_published: boolean;
}

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
  image?: string;
  created_at: string;
  is_active: boolean;
}

interface TeamMember {
  name: string;
  position: string;
  background: string[];
  experience: string[];
  achievements: string[];
  image?: string;
}

interface CompanyHistory {
  year: string;
  title: string;
  description: string;
  category: 'past' | 'present' | 'future';
}

const heroContent = {
  ko: {
    headline: '시니어 라이프를 혁신하는',
    subheadline: '소나버스',
    description: '불편을 겪는 사용자들의 현실을 통해 발견한 혁신.\n명확한 브랜딩으로 시니어 보행 기술의 사각지대를 해결합니다.',
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
    description: '바형 손잡이와 통 프레임의 차별화된 설계로 안전성을 갖추며, 경사지 제어를 포함한 스마트 기능의 편의성을 갖춘,\n사용자 만족도를 극대화한 국내 유일 하이브리드형 워크메이트',
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
    description: '성인용 기저귀의 실제 구매자이자 사용자의 현장 경험을 통해 제작.\n실제 현직 요양보호사와 팀을 이루어 실제 사용자 및 구매자의 개선점을 반영한 성인용 기저귀',
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
        description: '뛰어난 신축성과 특수 공법을 사용한 밴드로\n피부에 찔리지 않고 부드러움',
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
    business: '한번 사용하면 계속 구매하게 되는 상품으로 브랜딩 후 지속적인 매출 가능.\n이후 수출 국가에 맞는 다양한 사이즈, 품목 지속적으로 증가 계획'
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
        '한국의 경우 복지용구 제도를 통해 85~100% 할인 가능\n(수동형 4만5천원, 하이브리드 10만5천원)',
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
  const [pressData, setPressData] = useState<PressRelease[]>([]);
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
  const [brandStoryData, setBrandStoryData] = useState<BrandStory[]>([]);
  
  // 더보기 기능을 위한 상태
  const [showFullTeam, setShowFullTeam] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);

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
        setPressData(data.results || []);
      })
      .catch(err => console.error('Error fetching press:', err));

    // Fetch blog posts
    fetch('/api/blog?limit=6&published=true')
      .then(res => res.json())
      .then(data => {
        setBlogData(data.results || []);
      })
      .catch(err => console.error('Error fetching blog:', err));

    // Fetch brand stories
    fetch('/api/brand-story?published=true&limit=6')
      .then(res => res.json())
      .then(data => {
        // 브랜드 스토리 페이지와 동일한 방식으로 데이터 처리
        const brandStories = (data.results || []).map((story: any) => {
          const content = story.content?.[lang] || story.content?.ko || story.content?.en;
          
          return {
            slug: story.slug,
            title: content?.title || 'No Title',
            subtitle: content?.subtitle || 'No Subtitle',
            date: new Date(story.published_date || story.created_at).toLocaleDateString('ko-KR'),
            thumbnail_url: content?.thumbnail_url || '/logo/nonImage_logo.png',
            body: content?.body || 'No content available'
          };
        });
        
        setBrandStoryData(brandStories);
      })
      .catch(err => {
        console.error('Error fetching brand stories:', err);
        setBrandStoryData([]);
      });
  }, []);

  const content: any = heroContent[lang];
  const problems: any = problemsToSolve[lang];
  const manbo: any = manboDetails[lang];
  const bodeum: any = bodeumDetails[lang];
  const team: any = teamInfo[lang];
  const history: any = companyHistory[lang];
  const business: any = businessStrategy[lang];

  // Auto-sliding Carousel component
  const ContentCarousel = ({ items, type }: { items: (BlogPost | PressRelease | BrandStory | Product)[]; type: string }) => {
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
              // 브랜드 스토리 타입일 때는 이미 처리된 데이터 사용
              if (type === 'brand-story') {
                const thumbnailUrl = item.thumbnail_url || '/logo/nonImage_logo.png';
                const title = item.title || 'No Title';
                const description = item.subtitle || 'No description available';
                
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
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // 다른 타입들 (블로그, 언론보도 등)은 기존 방식 사용
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
            <div className="mb-8">
              <span className="inline-block bg-[#bda191]/20 text-[#bda191] px-6 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur">
                {lang === 'ko' ? '시니어 라이프 혁신 기업' : 'Senior Life Innovation Company'}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              {content.headline}
              <br />
              <span className="text-[#bda191] text-4xl md:text-6xl">{content.subheadline}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-slate-200 font-light">
              {content.description.split('\n').map((line: string, i: number, arr: string[]) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            
            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => window.location.href = '/products'}
                className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300 shadow-lg"
              >
                {lang === 'ko' ? '제품 둘러보기' : 'Explore Products'}
              </button>
              <button 
                onClick={() => window.location.href = '/inquiry'}
                className="px-8 py-4 bg-[#bda191] text-white rounded-xl font-semibold hover:bg-[#a68b7a] transition-all duration-300 shadow-lg"
              >
                {lang === 'ko' ? '문의하기' : 'Contact Us'}
              </button>
            </div>
          </div>
          
          {/* 핵심 지표 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.stats.map((stat: any, idx: number) => (
              <div key={idx} className={`transform transition-all duration-1000 delay-${(idx + 1) * 200} ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="text-4xl font-bold text-white mb-3">{stat.number}</div>
                  <div className="text-slate-300 leading-relaxed">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 문제 정의 섹션 - 지그재그 레이아웃 */}
      <section 
        id="problems" 
        data-section 
        className="py-24 bg-white relative overflow-hidden"
      >
        {/* 배경 장식 요소 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#bda191]/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-100 rounded-full translate-y-36 -translate-x-36"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible.problems ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              {lang === 'ko' ? '우리가 해결하고자 하는' : 'Problems We'}
              <br />
              <span className="text-[#bda191]">{lang === 'ko' ? '문제' : 'Aim to Solve'}</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {lang === 'ko' 
                ? '시장은 Pain이 뚜렷했고, 대체제가 없고, 명확한 브랜딩을 하는 플레이어가 없었습니다.'
                : 'The market had clear pain points, no alternatives, and no players with clear branding.'
              }
            </p>
          </div>
          
          {/* 지그재그 레이아웃 */}
          <div className="space-y-32">
            {problems.map((problem: any, idx: number) => (
              <div 
                key={idx} 
                className={`transform transition-all duration-1000 delay-${idx * 300} ${isVisible.problems ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              >
                <div className={`flex flex-col lg:flex-row items-center gap-12 ${
                  idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}>
                  {/* 아이콘 영역 */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#bda191] to-[#a68b7a] rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <span className="text-5xl md:text-6xl">{problem.icon}</span>
                    </div>
                  </div>
                  
                  {/* 텍스트 영역 */}
                  <div className={`flex-1 ${idx % 2 === 0 ? 'lg:text-left' : 'lg:text-right'} text-center lg:text-left`}>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 leading-tight">
                      {problem.title}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                      {problem.description}
                    </p>
                    {/* 데코레이션 라인 */}
                    <div className={`mt-6 h-1 w-20 bg-[#bda191] ${idx % 2 === 0 ? 'lg:ml-0' : 'lg:ml-auto'} mx-auto lg:mx-0`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 만보 워크메이트 섹션 - 자연스러운 제품 소개 */}
      <section 
        id="manbo" 
        data-section 
        className="py-20 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* 제품 헤더 */}
          <div className={`mb-16 transform transition-all duration-1000 ${isVisible.manbo ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {manbo.status}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {manbo.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              {manbo.subtitle}
            </p>
          </div>
          
          {/* 제품 설명과 특징을 나란히 배치 */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* 왼쪽: 제품 설명 */}
            <div className={`transform transition-all duration-1000 delay-200 ${isVisible.manbo ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="prose prose-lg">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {manbo.description.split('\n').map((line: string, i: number, arr: string[]) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">핵심 혁신 기술</h4>
                  <p className="text-blue-800 text-sm">
                    AI 센서와 IoT 기술을 결합한 스마트 보행 보조 시스템으로, 
                    사용자의 보행 패턴을 학습하여 최적의 지원을 제공합니다.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 오른쪽: 제품 특징 목록 */}
            <div className={`transform transition-all duration-1000 delay-400 ${isVisible.manbo ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h3 className="text-xl font-semibold mb-6 text-gray-900">주요 특징</h3>
              <div className="space-y-6">
                {manbo.features.map((feature: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.details.slice(0, 2).map((detail: any, detailIdx: any) => (
                        <li key={detailIdx} className="text-xs text-gray-500 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 하단 CTA */}
          <div className={`text-center transform transition-all duration-1000 delay-600 ${isVisible.manbo ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <button 
              onClick={() => window.location.href = '/products/manbo-walker'}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mr-4"
            >
              제품 자세히 보기
            </button>
            <button 
              onClick={() => window.location.href = '/inquiry'}
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              사전 문의하기
            </button>
          </div>
        </div>
      </section>

      {/* 보듬 기저귀 섹션 - 자연스러운 제품 소개 */}
      <section 
        id="bodeum" 
        data-section 
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* 제품 헤더 */}
          <div className={`mb-16 transform transition-all duration-1000 ${isVisible.bodeum ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {bodeum.title} - {bodeum.subtitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mb-4">
              {bodeum.description.split('\n').map((line: string, i: number, arr: string[]) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
              <p className="text-orange-800 font-medium">{bodeum.meaning}</p>
            </div>
          </div>
          
          {/* 제품 특징과 라인업을 나란히 배치 */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* 왼쪽: 제품 특징 */}
            <div className={`transform transition-all duration-1000 delay-200 ${isVisible.bodeum ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h3 className="text-xl font-semibold mb-6 text-gray-900">제품 특징</h3>
              <div className="space-y-4">
                {bodeum.features.map((feature: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-2xl mr-4">{feature.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">
                          {feature.description.split('\n').map((line: any, i: any, arr: any[]) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < arr.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 오른쪽: 라인업과 비즈니스 정보 */}
            <div className={`transform transition-all duration-1000 delay-400 ${isVisible.bodeum ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="space-y-8">
                {/* 라인업 */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">제품 라인업</h3>
                  <div className="space-y-2">
                    {bodeum.lineup.map((item: any, idx: any) => (
                      <div key={idx} className="flex items-center p-3 bg-orange-50 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 비즈니스 모델 */}
                <div className="bg-gray-900 p-6 rounded-lg text-white">
                  <h3 className="text-lg font-semibold mb-4">비즈니스 전략</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {bodeum.business.split('\n').map((line: string, i: number, arr: string[]) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => window.location.href = '/products/bodeum-diaper'}
                      className="flex-1 bg-white text-gray-900 px-4 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors"
                    >
                      제품 상세보기
                    </button>
                    <button 
                      onClick={() => window.open('https://bodume.com/', '_blank')}
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded font-medium text-sm hover:bg-orange-700 transition-colors"
                    >
                      온라인 구매 →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 팀 소개 섹션 - 간단한 소개 */}
      <section 
        id="team" 
        data-section 
        className="py-20 bg-gradient-to-br from-slate-50 to-stone-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* 섹션 헤더 */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.team ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-800">
              {lang === 'ko' ? '전문성을 갖춘 팀' : 'Expert Team'}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {team.title}
            </p>
          </div>
          
          {/* 코어 팀 섹션 */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.coreTeam.map((member: any, idx: any) => (
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
          {showFullTeam && team.advisors && team.advisors.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-slate-700 mb-8 text-center">
                {lang === 'ko' ? '자문위원' : 'Advisory Board'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.advisors.map((advisor: any, idx: any) => (
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
          )}
          
          {/* 더보기 버튼 */}
          {(team.coreTeam.length > 2 || (team.advisors && team.advisors.length > 0)) && (
            <div className="text-center mt-12">
              <button 
                onClick={() => setShowFullTeam(!showFullTeam)}
                className="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {showFullTeam 
                  ? (lang === 'ko' ? '간단히 보기' : 'Show Less')
                  : (lang === 'ko' ? '팀 전체 보기' : 'View Full Team')
                }
                <svg className={`ml-2 w-5 h-5 transform transition-transform ${showFullTeam ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 회사 연혁 섹션 - 간단한 연혁 */}
      <section 
        id="history" 
        data-section 
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* 섹션 헤더 */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.history ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {lang === 'ko' ? '소나버스의 성장 여정' : 'SONAVERSE Growth Journey'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {lang === 'ko' 
                ? '2022년 설립 이후 지속적인 성장을 이어가고 있습니다.'
                : 'We have been growing continuously since our establishment in 2022.'
              }
            </p>
          </div>
          
          {/* 연혁 섹션 - 기존 구조 유지하면서 일부만 표시 */}
          <div className="relative mb-8">
            {/* 세로 연결선 */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
            
            <div className="space-y-12">
              {(showFullHistory ? history : history.filter((item: any) => parseInt(item.year) >= 2022 && parseInt(item.year) <= 2023)).map((item: any, idx: any) => (
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
                          {item.events.map((event: any, eventIdx: any) => (
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
            
            {/* 미래 포인트 - 전체 보기일 때만 표시 */}
            {showFullHistory && (
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
            )}
          </div>
          
          {/* 더보기 버튼 */}
          {history.filter((item: any) => parseInt(item.year) < 2022 || parseInt(item.year) > 2023).length > 0 && (
            <div className="text-center">
              <button 
                onClick={() => setShowFullHistory(!showFullHistory)}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center"
              >
                {showFullHistory 
                  ? (lang === 'ko' ? '간단히 보기' : 'Show Less')
                  : (lang === 'ko' ? '전체 연혁 보기' : 'View Full History')
                }
                <svg className={`ml-2 w-4 h-4 transform transition-transform ${showFullHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
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
            {pressData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{lang === 'ko' ? '언론보도를 불러오는 중...' : 'Loading press releases...'}</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden backdrop-blur-lg">
                {/* 헤더 */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {lang === 'ko' ? '최신 언론보도' : 'Latest Press'}
                        </h3>
                        <p className="text-sm text-slate-300">
                          {lang === 'ko' ? '소나버스의 주요 뉴스' : 'Major news from SONAVERSE'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.location.href = '/press'}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
                    >
                      {lang === 'ko' ? '전체보기' : 'View All'}
                    </button>
                  </div>
                </div>
                
                {/* 리스트 */}
                <div className="divide-y divide-slate-100">
                  {pressData.slice(0, 5).map((item: any, idx: number) => {
                    const itemContent = item.content?.[lang] || item.content?.ko || item.content?.en || item;
                    const title = itemContent.title || item.title || 'No Title';
                    const pressName = typeof item.press_name === 'object' && item.press_name
                      ? (item.press_name[lang] || item.press_name.ko || item.press_name.en || '')
                      : (item.press_name || '소나버스');
                    const date = new Date(item.published_date || item.created_at || Date.now()).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US');
                    
                    return (
                      <div 
                        key={idx} 
                        onClick={() => window.location.href = `/press/${item.slug}`}
                        className="px-8 py-6 hover:bg-slate-50 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#bda191] to-[#a68b7a] rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{idx + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-slate-800 group-hover:text-[#bda191] transition-colors duration-300 truncate">
                                  {title}
                                </h4>
                                <div className="flex items-center space-x-3 mt-1">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#bda191]/10 text-[#bda191]">
                                    {pressName}
                                  </span>
                                  <span className="text-sm text-slate-500">{date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <svg 
                              className="w-6 h-6 text-slate-400 group-hover:text-[#bda191] group-hover:translate-x-1 transition-all duration-300" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* 하단 액션 */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      {lang === 'ko' 
                        ? `총 ${pressData.length}개의 언론보도` 
                        : `Total ${pressData.length} press releases`
                      }
                    </div>
                    <button 
                      onClick={() => window.location.href = '/press'}
                      className="inline-flex items-center text-sm font-medium text-[#bda191] hover:text-[#a68b7a] transition-colors duration-300"
                    >
                      {lang === 'ko' ? '모든 언론보도 보기' : 'View all press releases'}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 블로그 섹션 */}
      <section 
        id="blog" 
        data-section 
        className="py-20 bg-gradient-to-br from-rose-50 to-stone-50 relative overflow-hidden"
      >
        {/* 배경 장식 */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-rose-200/20 to-transparent rounded-full -translate-y-48 -translate-x-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-stone-200/30 to-transparent rounded-full translate-y-40 translate-x-40"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.blog ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-800">
              {lang === 'ko' ? '블로그' : 'Blog'}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {lang === 'ko' ? '시니어 라이프 혁신에 대한 깊이 있는 통찰과 전문가 의견을 만나보세요' : 'Discover deep insights and expert opinions on senior life innovation'}
            </p>
          </div>
          
          <div className={`transform transition-all duration-1000 delay-200 ${isVisible.blog ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {blogData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{lang === 'ko' ? '블로그 포스트를 불러오는 중...' : 'Loading blog posts...'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 메인 포스트 (첫 번째) */}
                {blogData.length > 0 && (
                  <div className="lg:col-span-2">
                    {(() => {
                      const mainPost = blogData[0];
                      const itemContent = mainPost.content?.[lang] || mainPost.content?.ko || mainPost.content?.en || mainPost;
                      const title = itemContent.title || mainPost.title || 'No Title';
                      const description = itemContent.subtitle || mainPost.summary || mainPost.excerpt || 'No description available';
                      const thumbnailUrl = itemContent.thumbnail_url || mainPost.thumbnail || '/logo/nonImage_logo.png';
                      const date = new Date(mainPost.published_date || mainPost.created_at || Date.now()).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US');
                      
                      return (
                        <div 
                          onClick={() => window.location.href = `/blog/${mainPost.slug}`}
                          className="group bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                        >
                          <div className="relative h-80 overflow-hidden">
                            <img 
                              src={thumbnailUrl}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute top-6 left-6">
                              <span className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-slate-800 rounded-full text-sm font-semibold">
                                {lang === 'ko' ? '특집 기사' : 'Featured'}
                              </span>
                            </div>
                          </div>
                          <div className="p-8">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{date}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{lang === 'ko' ? '소나버스' : 'SONAVERSE'}</span>
                              </div>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-rose-600 transition-colors duration-300 leading-tight">
                              {title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                              {description}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {/* 사이드 포스트들 */}
                <div className="space-y-6">
                  {blogData.slice(1, 4).map((post: BlogPost, idx: number) => {
                    const itemContent = post.content?.[lang] || post.content?.ko || post.content?.en || post;
                    const title = itemContent.title || post.title || 'No Title';
                    const description = itemContent.subtitle || post.summary || post.excerpt || 'No description available';
                    const thumbnailUrl = itemContent.thumbnail_url || post.thumbnail || '/logo/nonImage_logo.png';
                    const date = new Date(post.published_date || post.created_at || Date.now()).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US');
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => window.location.href = `/blog/${post.slug}`}
                        className="group bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                      >
                        <div className="flex">
                          <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden">
                            <img 
                              src={thumbnailUrl}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                              <span className="text-xs text-gray-500">{date}</span>
                            </div>
                            <h4 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors duration-300 line-clamp-2">
                              {title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* 하단 액션 */}
            <div className="text-center mt-12">
              <button 
                onClick={() => window.location.href = '/blog'}
                className="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-2xl font-semibold hover:bg-slate-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {lang === 'ko' ? '모든 블로그 포스트 보기' : 'View All Blog Posts'}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 브랜드 스토리 섹션 */}
      <section 
        id="brand-story" 
        data-section 
        className="py-20 bg-gradient-to-br from-stone-50 to-slate-100 relative overflow-hidden"
      >
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-stone-300/30 to-transparent rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible['brand-story'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-800">
              {lang === 'ko' ? '브랜드 스토리' : 'Brand Story'}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {lang === 'ko' ? '소나버스가 걸어온 혁신의 여정과 미래를 향한 비전을 만나보세요' : 'Discover SONAVERSE\'s journey of innovation and vision for the future'}
            </p>
          </div>
          
          <div className={`transform transition-all duration-1000 delay-200 ${isVisible['brand-story'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {brandStoryData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{lang === 'ko' ? '브랜드 스토리를 불러오는 중...' : 'Loading brand stories...'}</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 타임라인 스타일 레이아웃 */}
                {brandStoryData.slice(0, 3).map((story: any, idx: number) => (
                  <div key={idx} className={`flex flex-col lg:flex-row items-center gap-8 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    {/* 이미지 영역 */}
                    <div className="lg:w-1/2 relative">
                      <div 
                        onClick={() => window.location.href = `/brand-story/${story.slug}`}
                        className="group relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
                      >
                        <div className="aspect-[4/3] relative">
                          <img 
                            src={story.thumbnail_url || '/logo/nonImage_logo.png'}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                        </div>
                        
                        {/* 호버 오버레이 */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
                            <span className="text-slate-800 font-semibold">
                              {lang === 'ko' ? '스토리 보기' : 'View Story'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 장식 요소 */}
                      <div className={`absolute -top-4 ${idx % 2 === 0 ? '-right-4' : '-left-4'} w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20`}></div>
                    </div>
                    
                    {/* 콘텐츠 영역 */}
                    <div className={`lg:w-1/2 ${idx % 2 === 1 ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}>
                      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 backdrop-blur-lg">
                        {/* 날짜 배지 */}
                        <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-semibold mb-4`}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {story.date}
                        </div>
                        
                        {/* 제목 */}
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 leading-tight">
                          {story.title}
                        </h3>
                        
                        {/* 부제목 */}
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                          {story.subtitle}
                        </p>
                        
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* 추가 스토리가 있는 경우 컴팩트하게 표시 */}
                {brandStoryData.length > 3 && (
                  <div className="mt-12">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                      <div className="text-center mb-6">
                        <h4 className="text-xl font-bold text-slate-800 mb-2">
                          {lang === 'ko' ? '더 많은 스토리' : 'More Stories'}
                        </h4>
                        <p className="text-gray-600">
                          {lang === 'ko' ? '소나버스의 다양한 이야기들을 만나보세요' : 'Discover more stories from SONAVERSE'}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {brandStoryData.slice(3, 6).map((story: any, idx: number) => (
                          <div 
                            key={idx}
                            onClick={() => window.location.href = `/brand-story/${story.slug}`}
                            className="group bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-100"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex-shrink-0 overflow-hidden">
                                <img 
                                  src={story.thumbnail_url || '/logo/nonImage_logo.png'}
                                  alt={story.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo/nonImage_logo.png'; }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                                  {story.title}
                                </h5>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                  {story.subtitle}
                                </p>
                                <div className="text-xs text-gray-500">{story.date}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* 하단 액션 */}
            <div className="text-center mt-12">
              <button 
                onClick={() => window.location.href = '/brand-story'}
                className="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-2xl font-semibold hover:bg-slate-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {lang === 'ko' ? '모든 브랜드 스토리 보기' : 'View All Brand Stories'}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 비즈니스 모델 섹션 */}
      <section 
        id="business" 
        data-section 
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              {business.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {lang === 'ko' ? '소나버스의 혁신적인 비즈니스 모델과 함께 성장하세요' : 'Grow with SONAVERSE\'s innovative business model'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* B2B */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#bda191] rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">{business.b2b.title}</h3>
              </div>
              <div className="text-gray-600 mb-6 leading-relaxed">
                {business.b2b.description.split('\n').map((line: string, i: number, arr: string[]) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div className="space-y-3">
                {business.b2b.advantages.map((advantage: any, idx: number) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-[#bda191] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">
                      {advantage.split('\n').map((line: string, i: number, arr: string[]) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* B2C */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">{business.b2c.title}</h3>
              </div>
              <div className="text-gray-600 mb-6 leading-relaxed">
                {business.b2c.description.split('\n').map((line: string, i: number, arr: string[]) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div className="space-y-3">
                {business.b2c.advantages.map((advantage: any, idx: number) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-slate-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">
                      {advantage.split('\n').map((line: string, i: number, arr: string[]) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 수익성 정보 */}
          <div className="bg-slate-800 rounded-lg p-8 text-white text-center mb-12">
            <h3 className="text-2xl font-bold mb-8">{business.profitability.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold mb-2 text-[#bda191]">{business.profitability.price}</div>
                <div className="text-gray-300 text-sm">{lang === 'ko' ? '판매가' : 'Price'}</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">{business.profitability.cost}</div>
                <div className="text-gray-300 text-sm">{lang === 'ko' ? '제조원가' : 'Cost'}</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">{business.profitability.profit}</div>
                <div className="text-gray-300 text-sm">{lang === 'ko' ? '영업이익' : 'Profit'}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2 text-[#bda191]">{business.profitability.margin}</div>
                <div className="text-gray-300 text-sm">{lang === 'ko' ? '영업이익률' : 'Margin'}</div>
              </div>
            </div>
          </div>
          
          {/* 기업 문의 버튼 */}
          <div className="text-center">
            <button 
              onClick={() => window.location.href = '/inquiry'}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-[#bda191] text-white rounded-lg hover:bg-[#a68b7a] transition-colors shadow-lg"
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
