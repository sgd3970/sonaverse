'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';

const BodeumDiaperPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('bodeum_diaper', '보듬 기저귀')}</h1>
        <img src="/products/bodeum_diaper_main.jpg" alt={t('bodeum_diaper', '보듬 기저귀')} className="w-full max-h-72 object-cover rounded mb-6" />
        <p className="text-lg text-gray-700 mb-4">{t('bodeum_diaper_desc_detail', '보듬 기저귀는 편안함과 흡수력을 모두 갖춘 프리미엄 기저귀입니다.')}</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">{t('features', '특징')}</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>{t('bodeum_feature_1', '피부 자극 최소화')}</li>
          <li>{t('bodeum_feature_2', '강력한 흡수력')}</li>
          <li>{t('bodeum_feature_3', '편안한 착용감')}</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">{t('specifications', '스펙')}</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>{t('bodeum_spec_1', '사이즈: M/L/XL')}</li>
          <li>{t('bodeum_spec_2', '흡수량: 1200ml')}</li>
          <li>{t('bodeum_spec_3', '소재: 부드러운 부직포')}</li>
        </ul>
        <div className="flex gap-4 mt-8">
          <img src="/products/bodeum_diaper_detail1.jpg" alt="detail1" className="w-1/2 rounded" />
          <img src="/products/bodeum_diaper_detail2.jpg" alt="detail2" className="w-1/2 rounded" />
        </div>
        <div className="mt-10 text-center">
          <a href="https://bodume.com/" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">
            {t('bodeum_external_link', '보듬 공식 홈페이지 바로가기')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default BodeumDiaperPage; 