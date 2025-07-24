'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 bg-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('products', '제품소개')}</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
        {/* 만보 보행기 */}
        <Link href="/products/manbo-walker" className="flex-1 bg-gray-50 rounded-lg shadow p-6 hover:shadow-lg transition flex flex-col items-center">
          <img src="/products/manbo_walker_thumb.jpg" alt={t('manbo_walker', '만보 보행기')} className="h-32 w-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('manbo_walker', '만보 보행기')}</h2>
          <p className="text-gray-600 text-center">{t('manbo_walker_desc', '어르신들의 안전하고 편안한 보행을 돕는 제품')}</p>
        </Link>
        {/* 보듬 기저귀 */}
        <Link href="/products/bodeum-diaper" className="flex-1 bg-gray-50 rounded-lg shadow p-6 hover:shadow-lg transition flex flex-col items-center">
          <img src="/products/bodeum_diaper_thumb.jpg" alt={t('bodeum_diaper', '보듬 기저귀')} className="h-32 w-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('bodeum_diaper', '보듬 기저귀')}</h2>
          <p className="text-gray-600 text-center">{t('bodeum_diaper_desc', '편안함과 흡수력을 모두 갖춘 프리미엄 기저귀')}</p>
        </Link>
      </div>
    </div>
  );
};

export default ProductsPage; 