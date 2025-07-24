import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';
import { useParams } from 'next/navigation';

const pressData = {
  'company-awarded-innovation-prize': {
    title_ko: '당사, 2025 혁신 기술상 수상',
    title_en: 'Our Company Wins 2025 Innovation Technology Award',
    date: '2025-07-20',
    press_ko: '전자신문',
    press_en: 'ET News',
    body_ko: '<p>저희 회사가 2025 혁신 기술상을 수상했습니다...</p><img src="/press/press_image_ko.jpg" alt="수상 이미지" />',
    body_en: '<p>Our company has won the 2025 Innovation Technology Award...</p><img src="/press/press_image_en.jpg" alt="Award Image" />',
    external_link_ko: 'https://www.etnews.com/20250720000001',
    external_link_en: 'https://www.etnews.com/en/20250720000001',
  },
  'company-featured-in-media': {
    title_ko: '당사, 주요 언론에 소개',
    title_en: 'Our Company Featured in Major Media',
    date: '2025-06-15',
    press_ko: '매일경제',
    press_en: 'Maeil Business',
    body_ko: '<p>당사가 주요 언론에 소개되었습니다...</p><img src="/press/press_image2_ko.jpg" alt="소개 이미지" />',
    body_en: '<p>Our company was featured in major media...</p><img src="/press/press_image2_en.jpg" alt="Feature Image" />',
    external_link_ko: 'https://www.mk.co.kr/news/business/2025/06/15/123456',
    external_link_en: 'https://www.mk.co.kr/news/business/2025/06/15/123456',
  },
};

const PressDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const params = useParams();
  const slug = params?.slug as string;
  const data = pressData[slug];

  if (!data) return <div className="text-center py-20">{t('not_found', '해당 보도 자료를 찾을 수 없습니다.')}</div>;

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-2xl w-full mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{i18n.language === 'en' ? data.title_en : data.title_ko}</h1>
        <div className="text-sm text-gray-500 mb-2">
          {i18n.language === 'en' ? data.press_en : data.press_ko} | {data.date}
        </div>
        <div className="prose prose-sm md:prose-base mx-auto mb-6" dangerouslySetInnerHTML={{ __html: i18n.language === 'en' ? data.body_en : data.body_ko }} />
        <a href={i18n.language === 'en' ? data.external_link_en : data.external_link_ko} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">
          {t('go_to_original', '원본 기사 보기')}
        </a>
      </div>
    </div>
  );
};

export default PressDetailPage; 