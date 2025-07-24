import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';

const blogList = [
  {
    slug: 'our-company-new-vision-2025',
    title_ko: '새로운 비전 2025, 더 나은 미래를 향하여',
    title_en: 'New Vision 2025, Towards a Better Future',
    summary_ko: '2025년, 저희 회사는 새로운 비전을 선포하며...',
    summary_en: 'In 2025, our company declares a new vision...',
    date: '2025-07-22',
    tags_ko: ['회사소개', '비전', '2025'],
    tags_en: ['Company', 'Vision', '2025'],
    thumbnail_ko: '/blog/blog_thumb_ko.jpg',
    thumbnail_en: '/blog/blog_thumb_en.jpg',
  },
  {
    slug: 'innovation-in-elderly-care',
    title_ko: '시니어 케어 혁신, 우리의 도전',
    title_en: 'Innovation in Elderly Care, Our Challenge',
    summary_ko: '고령화 사회에서의 혁신적 제품 개발 사례...',
    summary_en: 'Innovative product development in an aging society...',
    date: '2025-07-10',
    tags_ko: ['시니어', '혁신'],
    tags_en: ['Senior', 'Innovation'],
    thumbnail_ko: '/blog/blog_thumb2_ko.jpg',
    thumbnail_en: '/blog/blog_thumb2_en.jpg',
  },
];

const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('blog', '자사 블로그')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogList.map(item => (
            <Link key={item.slug} href={`/blog/${item.slug}`} className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition flex flex-col">
              <img src={i18n.language === 'en' ? item.thumbnail_en : item.thumbnail_ko} alt={i18n.language === 'en' ? item.title_en : item.title_ko} className="w-full h-48 object-cover rounded-t" />
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-semibold mb-2">{i18n.language === 'en' ? item.title_en : item.title_ko}</h2>
                <p className="text-gray-600 mb-4 flex-1">{i18n.language === 'en' ? item.summary_en : item.summary_ko}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(i18n.language === 'en' ? item.tags_en : item.tags_ko).map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{tag}</span>
                  ))}
                </div>
                <div className="text-sm text-gray-400">{item.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 