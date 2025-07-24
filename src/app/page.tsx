'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../src/app/i18n';

const HomePage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 bg-white">
      {/* Hero Section */}
      <section className="w-full max-w-3xl text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('home_hero_title', '저희 회사를 소개합니다')}</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">{t('home_hero_desc', '최고의 제품과 서비스로 고객 만족을 추구합니다.')}</p>
        <img src="/main_hero.jpg" alt="회사 메인 이미지" className="mx-auto rounded-lg shadow max-h-64 object-cover" />
      </section>
      {/* Vision & Mission Section */}
      <section className="w-full max-w-2xl text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">{t('vision_mission_title', '비전과 미션')}</h2>
        <p className="text-base md:text-lg text-gray-700">{t('vision_mission_desc', '혁신을 통해 더 나은 세상을 만듭니다.')}</p>
      </section>
      {/* Core Values Section */}
      <section className="w-full max-w-2xl text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">{t('core_values_title', '핵심 가치')}</h2>
        <ul className="flex flex-col md:flex-row gap-4 justify-center mt-4">
          <li className="bg-gray-100 rounded p-4 flex-1">{t('core_value_1', '고객 중심')}</li>
          <li className="bg-gray-100 rounded p-4 flex-1">{t('core_value_2', '혁신')}</li>
          <li className="bg-gray-100 rounded p-4 flex-1">{t('core_value_3', '신뢰')}</li>
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
