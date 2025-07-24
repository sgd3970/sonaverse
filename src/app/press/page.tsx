'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';

const PAGE_SIZE = 10;

const PressPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [pressList, setPressList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchPress = async (pageNum = 1, searchTerm = '') => {
    setLoading(true);
    const params = new URLSearchParams({
      lang: i18n.language,
      page: String(pageNum),
    });
    if (searchTerm) params.append('search', searchTerm);
    const res = await fetch(`/api/press?${params.toString()}`);
    const data = await res.json();
    setPressList(data.results || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setPage(data.page || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchPress(1, '');
    // eslint-disable-next-line
  }, [i18n.language]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    // 실시간 검색 (디바운스 적용)
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      fetchPress(1, value);
    }, 300);
  };

  const handlePage = (p: number) => {
    fetchPress(p, search);
  };

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('press', '언론보도')}</h1>
        <div className="min-h-[440px] mb-8">
          {loading ? (
            <div className="py-12 text-center text-gray-400 border-b border-gray-200">Loading...</div>
          ) : pressList.length === 0 ? (
            <div className="py-12 text-center text-gray-400 border-b border-gray-200">{t('no_results', '검색 결과가 없습니다.')}</div>
          ) : (
            pressList.map((item, index) => (
              <div key={item.slug} className={`py-3 flex flex-col md:flex-row md:items-center md:justify-between ${pressList.length > 1 && index === pressList.length - 1 ? '' : 'border-b border-gray-400'}`}>
                <div>
                  <Link href={`/press/${item.slug}`} className="text-lg font-medium hover:underline">
                    {item.title}
                  </Link>
                  <span className="ml-2 text-sm text-gray-500">{item.press_name}</span>
                </div>
                <div className="text-sm text-gray-400 mt-2 md:mt-0">{item.published_date?.slice(0, 10)}</div>
              </div>
            ))
          )}
        </div>
        {/* 하단 고정 검색창+페이지네이션 */}
        <div className="sticky bottom-0 bg-white/90 pt-6 pb-2 mt-8 z-10 flex flex-col items-center border-t border-gray-100">
          <div className="mb-4 w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder={t('search_placeholder', '검색어를 입력하세요')}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2 items-center justify-center">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 rounded border text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePage(i + 1)}
                className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-[#bda191] text-white border-[#bda191]' : 'text-gray-700 border-gray-200 hover:bg-gray-100'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 rounded border text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressPage; 