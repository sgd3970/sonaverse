import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../app/i18n';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const stories = [
  {
    slug: 'our-journey-from-startup-to-leader',
    title_ko: '스타트업에서 리더로: 우리의 여정',
    title_en: 'From Startup to Leader: Our Journey',
    date: '2025-07-15',
    body_ko: '<p>저희는 20XX년 작은 사무실에서 시작했습니다...</p><img src="/brand_story/brand_story_image1_ko.jpg" alt="초기 이미지"><p>수많은 어려움에도 불구하고...</p>',
    body_en: '<p>We started in a small office in 20XX...</p><img src="/brand_story/brand_story_image1_en.jpg" alt="Early Days Image"><p>Despite many challenges...</p>',
    thumbnail_ko: '/brand_story/brand_story_thumb_ko.jpg',
    thumbnail_en: '/brand_story/brand_story_thumb_en.jpg',
  },
  {
    slug: 'brand-value-and-innovation',
    title_ko: '브랜드 가치와 혁신',
    title_en: 'Brand Value and Innovation',
    date: '2025-06-30',
    body_ko: '<p>브랜드의 핵심 가치와 혁신 사례를 소개합니다...</p><img src="/brand_story/brand_story_image2_ko.jpg" alt="혁신 이미지">',
    body_en: '<p>Introducing the core values and innovation cases of the brand...</p><img src="/brand_story/brand_story_image2_en.jpg" alt="Innovation Image">',
    thumbnail_ko: '/brand_story/brand_story_thumb2_ko.jpg',
    thumbnail_en: '/brand_story/brand_story_thumb2_en.jpg',
  },
];

const BrandStoryDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const params = useParams();
  const slug = params?.slug as string;
  const data = stories.find(s => s.slug === slug);
  const otherStories = stories.filter(s => s.slug !== slug);

  if (!data) return <div className="text-center py-20">{t('not_found', '해당 게시물을 찾을 수 없습니다.')}</div>;

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-2xl w-full mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{i18n.language === 'en' ? data.title_en : data.title_ko}</h1>
        <div className="text-sm text-gray-500 mb-2">{data.date}</div>
        <div className="prose prose-sm md:prose-base mx-auto mb-6 text-left" dangerouslySetInnerHTML={{ __html: i18n.language === 'en' ? data.body_en : data.body_ko }} />
      </div>
      {/* 추천 스토리 슬라이드 */}
      <div className="w-full max-w-2xl mx-auto mt-12">
        <h2 className="text-xl font-semibold mb-4 text-center">{t('other_stories', '다른 스토리가 궁금하시다면?')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {otherStories.map(item => (
            <Link key={item.slug} href={`/brand-story/${item.slug}`} className="min-w-[220px] bg-gray-50 rounded-lg shadow hover:shadow-lg transition flex flex-col">
              <img src={i18n.language === 'en' ? item.thumbnail_en : item.thumbnail_ko} alt={i18n.language === 'en' ? item.title_en : item.title_ko} className="w-full h-32 object-cover rounded-t" />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-base font-semibold mb-1">{i18n.language === 'en' ? item.title_en : item.title_ko}</h3>
                <div className="text-xs text-gray-400">{item.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandStoryDetailPage; 