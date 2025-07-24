'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';

const stories = [
  {
    slug: 'our-journey-from-startup-to-leader',
    title_ko: '스타트업에서 리더로: 우리의 여정',
    title_en: 'From Startup to Leader: Our Journey',
    summary_ko: '작은 아이디어에서 시작하여 산업을 선도하기까지의 여정.',
    summary_en: 'From a small idea to leading the industry.',
    date: '2025-07-15',
    thumbnail_ko: '/brand_story/brand_story_thumb_ko.jpg',
    thumbnail_en: '/brand_story/brand_story_thumb_en.jpg',
  },
  {
    slug: 'brand-value-and-innovation',
    title_ko: '브랜드 가치와 혁신',
    title_en: 'Brand Value and Innovation',
    summary_ko: '브랜드의 핵심 가치와 혁신 사례를 소개합니다.',
    summary_en: 'Introducing the core values and innovation cases of the brand.',
    date: '2025-06-30',
    thumbnail_ko: '/brand_story/brand_story_thumb2_ko.jpg',
    thumbnail_en: '/brand_story/brand_story_thumb2_en.jpg',
  },
];

const history = [
  {
    year: 2010,
    event_ko: '회사 설립 및 만보 보행기 개발 시작',
    event_en: 'Company founded and Manbo Walker development began',
    image: '/history/history_2010.jpg',
  },
  {
    year: 2015,
    event_ko: '보듬 기저귀 출시',
    event_en: 'Bodeum Diaper launched',
    image: '/history/history_2015.jpg',
  },
  {
    year: 2020,
    event_ko: '글로벌 시장 진출',
    event_en: 'Entered global market',
    image: '/history/history_2020.jpg',
  },
];

const BrandStoryPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('brand_story', '브랜드 스토리')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {stories.map(item => (
            <Link key={item.slug} href={`/brand-story/${item.slug}`} className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition flex flex-col">
              <img src={i18n.language === 'en' ? item.thumbnail_en : item.thumbnail_ko} alt={i18n.language === 'en' ? item.title_en : item.title_ko} className="w-full h-48 object-cover rounded-t" />
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-semibold mb-2">{i18n.language === 'en' ? item.title_en : item.title_ko}</h2>
                <p className="text-gray-600 mb-4 flex-1">{i18n.language === 'en' ? item.summary_en : item.summary_ko}</p>
                <div className="text-sm text-gray-400">{item.date}</div>
              </div>
            </Link>
          ))}
        </div>
        {/* 연혁 다이어그램 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('company_history', '회사 연혁')}</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {history.map(item => (
              <div key={item.year} className="flex flex-col items-center">
                <img src={item.image} alt={item.year + ' ' + (i18n.language === 'en' ? item.event_en : item.event_ko)} className="w-24 h-24 object-cover rounded-full mb-2" />
                <div className="font-bold text-lg">{item.year}</div>
                <div className="text-sm text-gray-600 text-center max-w-[120px]">{i18n.language === 'en' ? item.event_en : item.event_ko}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandStoryPage; 