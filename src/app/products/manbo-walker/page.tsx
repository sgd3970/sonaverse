import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';

const ManboWalkerPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('manbo_walker', '만보 보행기')}</h1>
        <img src="/products/manbo_walker_main.jpg" alt={t('manbo_walker', '만보 보행기')} className="w-full max-h-72 object-cover rounded mb-6" />
        <p className="text-lg text-gray-700 mb-4">{t('manbo_walker_desc_detail', '만보 보행기는 어르신들의 안전하고 편안한 보행을 돕습니다.')}</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">{t('features', '특징')}</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>{t('manbo_feature_1', '인체공학적 디자인')}</li>
          <li>{t('manbo_feature_2', '초경량 소재')}</li>
          <li>{t('manbo_feature_3', '안전 브레이크 시스템')}</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">{t('specifications', '스펙')}</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>{t('manbo_spec_1', '크기: 100x50x80cm')}</li>
          <li>{t('manbo_spec_2', '무게: 5kg')}</li>
          <li>{t('manbo_spec_3', '재질: 알루미늄')}</li>
        </ul>
        <div className="flex gap-4 mt-8">
          <img src="/products/manbo_walker_detail1.jpg" alt="detail1" className="w-1/2 rounded" />
          <img src="/products/manbo_walker_detail2.jpg" alt="detail2" className="w-1/2 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ManboWalkerPage; 