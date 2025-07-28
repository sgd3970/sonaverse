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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">{t('press', '언론보도')}</h1>
          <p className="text-lg text-gray-600">소나버스의 언론보도 소식을 확인해보세요</p>
        </div>
        
        <div className="min-h-[440px] mb-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
            </div>
          ) : pressList.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg">{t('no_results', '검색 결과가 없습니다.')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {/* 헤더 구분자 */}
              <div className="border-b-2 border-gray-400 bg-gray-50">
                <div className="max-w-5xl mx-auto px-6">
                  <div className="flex items-center justify-between py-3">
                    <div className="w-16 text-sm font-semibold text-gray-700">
                      번호
                    </div>
                    <div className="flex-1 text-sm font-semibold text-gray-700">
                      제목
                    </div>
                    <div className="w-24 text-sm font-semibold text-gray-700 text-center">
                      작성일
                    </div>
                    <div className="w-20 text-sm font-semibold text-gray-700 text-center">
                      언론사
                    </div>
                  </div>
                </div>
              </div>
              
              {pressList.map((item, index) => {
                // 다국어 객체를 안전하게 처리
                const title = item.content && item.content[i18n.language] && item.content[i18n.language].title
                  ? item.content[i18n.language].title
                  : (item.content && item.content.ko && item.content.ko.title ? item.content.ko.title : '제목 없음');
                
                const pressName = typeof item.press_name === 'object' && item.press_name
                  ? (item.press_name[i18n.language as keyof typeof item.press_name] || item.press_name.ko || item.press_name.en || '')
                  : (item.press_name || '');
                
                const isLastItem = index === pressList.length - 1;
                const showBorder = pressList.length > 1 ? !isLastItem : true;
                
                return (
                  <div key={item.slug}>
                    <Link 
                      href={`/press/${item.slug}`}
                      className="block py-4 hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <div className="max-w-5xl mx-auto px-6">
                        <div className="flex items-center justify-between">
                          {/* 번호 */}
                          <div className="w-16 text-sm text-gray-500">
                            {((page - 1) * 10) + index + 1}
                          </div>
                          
                          {/* 제목 */}
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-[#bda191] transition-colors">
                              {title}
                            </h3>
                          </div>
                          
                          {/* 작성일자 */}
                          <div className="w-24 text-sm text-gray-500 text-center">
                            {new Date(item.created_at).toLocaleDateString('ko-KR')}
                          </div>
                          
                          {/* 신문사 */}
                          {pressName && (
                            <div className="w-20 text-sm text-gray-600 text-center">
                              {pressName}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                    {/* 게시물 사이 구분선 */}
                    {showBorder && (
                      <div className="border-b border-gray-200"></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        
        {/* 검색창과 페이지네이션 */}
        <div className="mt-12">
          <div className="flex flex-col items-center space-y-6">
            {/* 검색창 */}
            <div className="w-full max-w-md relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder={t('search_placeholder', '검색어를 입력하세요')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex gap-2 items-center justify-center">
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 7) {
                    pageNumber = i + 1;
                  } else if (page <= 4) {
                    pageNumber = i + 1;
                  } else if (page >= totalPages - 3) {
                    pageNumber = totalPages - 6 + i;
                  } else {
                    pageNumber = page - 3 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePage(pageNumber)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        page === pageNumber 
                          ? 'bg-slate-700 text-white border-slate-700' 
                          : 'text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressPage; 