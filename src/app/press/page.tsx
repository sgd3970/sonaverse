import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';

const pressList = [
  {
    slug: 'company-awarded-innovation-prize',
    title_ko: '당사, 2025 혁신 기술상 수상',
    title_en: 'Our Company Wins 2025 Innovation Technology Award',
    date: '2025-07-20',
    press_ko: '전자신문',
    press_en: 'ET News',
    external_link: 'https://www.etnews.com/20250720000001',
  },
  {
    slug: 'company-featured-in-media',
    title_ko: '당사, 주요 언론에 소개',
    title_en: 'Our Company Featured in Major Media',
    date: '2025-06-15',
    press_ko: '매일경제',
    press_en: 'Maeil Business',
    external_link: 'https://www.mk.co.kr/news/business/2025/06/15/123456',
  },
];

const PressPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('press', '언론보도')}</h1>
        <ul className="divide-y divide-gray-200">
          {pressList.map(item => (
            <li key={item.slug} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <Link href={`/press/${item.slug}`} className="text-lg font-medium hover:underline">
                  {i18n.language === 'en' ? item.title_en : item.title_ko}
                </Link>
                <span className="ml-2 text-sm text-gray-500">{i18n.language === 'en' ? item.press_en : item.press_ko}</span>
              </div>
              <div className="text-sm text-gray-400 mt-2 md:mt-0">{item.date}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PressPage; 