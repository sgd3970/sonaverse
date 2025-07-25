'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';
import axios from 'axios';

interface BrandStoryCard {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  thumbnail_url: string;
  body: string;
}

// 1. 브랜드 스토리 포스팅 카드 데이터 (실제 소개/비전/문제/제품)
const brandStoryPosts: BrandStoryCard[] = [
  {
    slug: 'sonaverse-innovation',
    title: '소나버스(SONAVERSE) | 시니어 라이프 혁신',
    subtitle: '한 걸음씩 성실히 걸어온 소나버스, 앞으로도 시니어와 함께 걸어가겠습니다.',
    date: '2024-06-01',
    thumbnail_url: '/brand_story/sonaverse_thumb.jpg',
    body: `저희는 현실 속 사용자 경험을 통해 시장의 명확한 문제점을 발견했습니다. 기존 시장에는 뚜렷한 대체제가 없었고, 명확한 브랜딩을 하는 플레이어가 부재했습니다. 소나버스는 노하우와 전문성을 바탕으로 시니어의 삶을 혁신할 원팀으로 구성되었습니다.<br/><iframe width="100%" height="200" src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1" title="YouTube video" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
  },
  {
    slug: 'problem-we-solve',
    title: '우리가 해결하고자 하는 문제',
    subtitle: '시니어 보행 보조기 시장의 Pain Point',
    date: '2024-06-02',
    thumbnail_url: '/brand_story/problem_thumb.jpg',
    body: `보행 안전성 및 주행 성능의 한계, 인체공학 미흡, 심리적 만족감 부족, 기술 사각지대 등 고질적 문제를 혁신합니다.<br/><iframe width="100%" height="200" src="https://www.youtube.com/embed/ysz5S6PUM-U?autoplay=1&mute=1" title="YouTube video" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
  },
  {
    slug: 'product-lineup',
    title: '제품 라인업',
    subtitle: "만보(MANBO) 워크메이트 & 보듬(BODUME) 기저귀", 
    date: '2024-06-03',
    thumbnail_url: '/brand_story/product_thumb.jpg',
    body: `1. 하이브리드형 워크메이트 '만보(MANBO)'<br/>- 국내 유일 하이브리드형, 전동/비전동 모드, 스마트 경사지 제어, GPS 실종방지<br/>2. 성인용 기저귀 '보듬(BODUME)'<br/>- 3중 흡수, 샘방지, 부드러운 소재, ISO/FDA/CE 인증, 5종 라인업` 
  }
];

// 실제 인력 정보 (메인페이지 teamInfo와 일치)
const personnel = {
  management: [
    { name: '이수진', position: '리더', desc: '인천대 전기공학과, 강원대 데이터사이언스 석사과정. 前 자동차안전연구원 연구원. R&D 과제 책임 및 수상 경력.' },
    { name: '이지명', position: '이사', desc: '연세대 전자공학과. 15년 경력, 前 동부하이텍 연구원. 제품 개발 기획 및 사업화.' },
  ],
  developers: [
    { name: '조윤석', position: '개발자', desc: '단국대 전기공학, 제어계측 석사 수료. 보행 모듈/플랫폼 개발, IR52 장영실상 수상.' },
    { name: '김영석', position: '개발자', desc: '홍익대 기계공학 학·석사. 20년 경력, 자동화 기계/기구 설계 제작.' },
  ],
  advisors: [
    { name: '이주열', position: '연구교수', desc: '서울벤처대학원대학교 연구교수.' },
    { name: '권오원', position: '센터장', desc: '한국기계연구원 융합기술센터장, 기계공학 박사.' },
    { name: '이종하', position: '교수', desc: '계명대 의용공학과 교수, 고령친화제품 사용성평가센터장.' },
    { name: '고준월', position: '요양보호사', desc: '현직 요양보호사 및 간병인, 시니어 프로덕트 현장 자문.' },
  ],
  partners: [
    { name: '아주대학교', position: '협력대학', desc: 'LINC 3.0 사업단' },
    { name: '강원대학교', position: '협력대학', desc: '기술지주회사' },
    { name: 'Alibaba', position: '글로벌 파트너', desc: '이커머스/유통' },
  ],
};

// 연혁(companyHistory) 메인페이지와 동일하게
const companyHistory = [
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
];

function PersonnelModal({ open, onClose, members, title, position }: { open: boolean; onClose: () => void; members: any[]; title: string; position?: { x?: number; y?: number } }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className={position ? 'fixed inset-0 z-50 pointer-events-none' : 'fixed inset-0 z-50 flex items-center justify-center bg-black/40'}
      style={position ? { pointerEvents: 'none' } : {}}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 min-w-[260px] max-w-[90vw] pointer-events-auto"
        style={position ? { position: 'absolute', left: position.x, top: position.y, transform: 'translate(-50%, -50%)', zIndex: 100 } : {}}
        onMouseLeave={onClose}
        onClick={e => e.stopPropagation()}
      >
        <h4 className="font-bold text-lg mb-2">{title}</h4>
        <ul className="space-y-2">
          {members.map((m, i) => (
            <li key={i} className="border-b last:border-b-0 pb-2">
              <div className="font-semibold">{m.name} <span className="text-xs text-gray-500">{m.position}</span></div>
              <div className="text-sm text-gray-600">{m.desc}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const BrandStoryPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language === 'en' ? 'en' : 'ko';
  const [stories, setStories] = useState<BrandStoryCard[]>(brandStoryPosts);
  const [modal, setModal] = useState<{ open: boolean; type: string; x?: number; y?: number }>({ open: false, type: '' });
  const [modalHover, setModalHover] = useState(false);
  const [nodeHover, setNodeHover] = useState<string | null>(null);

  // 모달 닫힘 제어
  useEffect(() => {
    if (!modalHover && !nodeHover && modal.open) {
      setModal({ open: false, type: '' });
    }
  }, [modalHover, nodeHover]);

  // TODO: 실제 API 연동 시 아래 주석 해제
  // useEffect(() => {
  //   axios.get('/api/brand-story').then(res => setStories(res.data));
  // }, []);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('brand_story', '브랜드 스토리')}</h1>
        {/* 포스팅 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {stories.map(item => (
            <Link key={item.slug} href={`/brand-story/${item.slug}`} className="bg-white rounded-lg shadow hover:shadow-xl transition flex flex-col group">
              <img src={item.thumbnail_url} alt={item.title} className="w-full h-48 object-cover rounded-t" />
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-semibold mb-1 truncate">{item.title}</h2>
                <p className="text-gray-600 mb-2 truncate">{item.subtitle}</p>
                <div className="text-sm text-gray-400 mb-2">{item.date}</div>
                <div className="prose prose-sm text-gray-700 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.body.replace(/<iframe[\s\S]*?<\/iframe>/g, '') }} />
              </div>
            </Link>
          ))}
        </div>
        {/* 연혁 타임라인 - 메인페이지와 동일한 구조 */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-8 text-center text-orange-700">회사 연혁</h3>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-600 to-orange-600 rounded-full"></div>
            <div className="space-y-16">
              {companyHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative transform transition-all duration-1000 delay-${idx * 200}`}
                >
                  <div className={`flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-slate-600 to-orange-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                      <span className="text-white font-bold text-sm">{item.year}</span>
                    </div>
                    <div className={`flex-1 ml-24 md:ml-0 ${idx % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                      <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <h4 className="text-xl font-bold mb-3 text-slate-800">{item.title}</h4>
                        <p className="text-gray-600 mb-6">{item.description}</p>
                        <ul className="space-y-2">
                          {item.events.map((event, eventIdx) => (
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
        {/* 인력 네트워크 다이어그램(hover 시 모달) */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center text-indigo-700">전문가 원팀 네트워크</h3>
          {/* 네트워크 다이어그램 노드+모달을 하나의 래퍼로 감싸고, 그 래퍼에서 onMouseLeave 시 모달 닫기 */}
          <div className="flex flex-col items-center justify-center animate-fadein-up">
            <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px]">
              {/* 중앙(SONAVERSE) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-gradient-to-br from-orange-200 to-indigo-200 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white z-10">
                <span className="text-lg font-bold text-slate-800">SONAVERSE</span>
                <span className="text-xs text-gray-600">One-Team</span>
              </div>
              {/* 바깥 원: 경영진/개발/자문/파트너 */}
              {[
                { label: '경영진', key: 'management', color: 'from-orange-400 to-orange-200', x: 0.5, y: 0.1 },
                { label: '개발팀', key: 'developers', color: 'from-indigo-400 to-indigo-200', x: 0.85, y: 0.35 },
                { label: '자문위원', key: 'advisors', color: 'from-orange-300 to-indigo-200', x: 0.85, y: 0.7 },
                { label: '파트너', key: 'partners', color: 'from-indigo-300 to-orange-200', x: 0.5, y: 0.95 },
              ].map((node, idx) => (
                <div
                  key={idx}
                  className={`absolute w-20 h-20 rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform`}
                  style={{ left: `${node.x * 100}%`, top: `${node.y * 100}%`, transform: 'translate(-50%, -50%)' }}
                  onMouseEnter={e => {
                    setModal({ open: true, type: node.key, x: e.clientX, y: e.clientY });
                  }}
                >
                  <span className="text-xs font-bold text-slate-800 text-center px-1">{node.label}</span>
                </div>
              ))}
              <PersonnelModal
                open={modal.open && !!personnel[modal.type as keyof typeof personnel]}
                onClose={() => setModal({ open: false, type: '' })}
                members={personnel[modal.type as keyof typeof personnel] || []}
                title={[
                  { key: 'management', label: '경영진' },
                  { key: 'developers', label: '개발팀' },
                  { key: 'advisors', label: '자문위원' },
                  { key: 'partners', label: '파트너' },
                ].find(n => n.key === modal.type)?.label || ''}
                position={modal.open ? { x: modal.x, y: modal.y } : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandStoryPage; 