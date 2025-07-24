import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';
import { useParams } from 'next/navigation';

const blogData = {
  'our-company-new-vision-2025': {
    title_ko: '새로운 비전 2025, 더 나은 미래를 향하여',
    title_en: 'New Vision 2025, Towards a Better Future',
    date: '2025-07-22',
    tags_ko: ['회사소개', '비전', '2025'],
    tags_en: ['Company', 'Vision', '2025'],
    body_ko: '<p>새로운 비전을 통해 저희는...</p><img src="/blog/blog_image1_ko.jpg" alt="비전 이미지"><p>더 많은 혁신을 이룰 것입니다.</p>',
    body_en: '<p>Through our new vision, we will...</p><img src="/blog/blog_image1_en.jpg" alt="Vision Image"><p>Achieve more innovation.</p>',
  },
  'innovation-in-elderly-care': {
    title_ko: '시니어 케어 혁신, 우리의 도전',
    title_en: 'Innovation in Elderly Care, Our Challenge',
    date: '2025-07-10',
    tags_ko: ['시니어', '혁신'],
    tags_en: ['Senior', 'Innovation'],
    body_ko: '<p>고령화 사회에서의 혁신적 제품 개발 사례...</p><img src="/blog/blog_image2_ko.jpg" alt="혁신 이미지">',
    body_en: '<p>Innovative product development in an aging society...</p><img src="/blog/blog_image2_en.jpg" alt="Innovation Image">',
  },
};

const BlogDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const params = useParams();
  const slug = params?.slug as string;
  const data = blogData[slug];

  if (!data) return <div className="text-center py-20">{t('not_found', '해당 게시물을 찾을 수 없습니다.')}</div>;

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-2xl w-full mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{i18n.language === 'en' ? data.title_en : data.title_ko}</h1>
        <div className="text-sm text-gray-500 mb-2">{data.date}</div>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {(i18n.language === 'en' ? data.tags_en : data.tags_ko).map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{tag}</span>
          ))}
        </div>
        <div className="prose prose-sm md:prose-base mx-auto mb-6 text-left" dangerouslySetInnerHTML={{ __html: i18n.language === 'en' ? data.body_en : data.body_ko }} />
      </div>
    </div>
  );
};

export default BlogDetailPage; 