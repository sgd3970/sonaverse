import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';

const mockResults = [
  {
    type: 'blog',
    slug: 'our-company-new-vision-2025',
    title_ko: '새로운 비전 2025, 더 나은 미래를 향하여',
    title_en: 'New Vision 2025, Towards a Better Future',
    summary_ko: '2025년, 저희 회사는 새로운 비전을 선포하며...',
    summary_en: 'In 2025, our company declares a new vision...',
  },
  {
    type: 'product',
    slug: 'manbo-walker',
    title_ko: '만보 보행기',
    title_en: 'Manbo Walker',
    summary_ko: '어르신들의 안전하고 편안한 보행을 돕는 제품',
    summary_en: 'A product that helps seniors walk safely and comfortably.',
  },
  {
    type: 'press',
    slug: 'company-awarded-innovation-prize',
    title_ko: '당사, 2025 혁신 기술상 수상',
    title_en: 'Our Company Wins 2025 Innovation Technology Award',
    summary_ko: '저희 회사가 2025 혁신 기술상을 수상했습니다...',
    summary_en: 'Our company has won the 2025 Innovation Technology Award...',
  },
  {
    type: 'brand_story',
    slug: 'our-journey-from-startup-to-leader',
    title_ko: '스타트업에서 리더로: 우리의 여정',
    title_en: 'From Startup to Leader: Our Journey',
    summary_ko: '작은 아이디어에서 시작하여 산업을 선도하기까지의 여정.',
    summary_en: 'From a small idea to leading the industry.',
  },
];

const SearchPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockResults>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 검색 로직은 추후 구현, 현재는 mockResults에서 제목/요약에 포함된 경우만 필터
    const q = query.trim().toLowerCase();
    setResults(
      mockResults.filter(item =>
        (i18n.language === 'en'
          ? item.title_en.toLowerCase() + item.summary_en.toLowerCase()
          : item.title_ko + item.summary_ko
        ).includes(q)
      )
    );
  };

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('search', '검색')}</h1>
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('search_placeholder', '검색어를 입력하세요')}
            className="flex-1 border rounded px-3 py-2"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">
            {t('search', '검색')}
          </button>
        </form>
        <div>
          {results.length === 0 && (
            <div className="text-gray-400 text-center py-8">{t('no_results', '검색 결과가 없습니다.')}</div>
          )}
          <ul className="space-y-4">
            {results.map(item => (
              <li key={item.type + item.slug} className="bg-gray-50 rounded-lg shadow p-4">
                <div className="text-xs text-gray-500 mb-1">
                  {t(item.type, item.type)}
                </div>
                <Link href={`/${item.type === 'brand_story' ? 'brand-story' : item.type}/${item.slug}`} className="text-lg font-semibold hover:underline">
                  {i18n.language === 'en' ? item.title_en : item.title_ko}
                </Link>
                <div className="text-gray-600 mt-1">{i18n.language === 'en' ? item.summary_en : item.summary_ko}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 