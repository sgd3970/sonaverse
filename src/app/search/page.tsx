'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../app/i18n';
import Link from 'next/link';
import { useToast } from '../../components/Toast';

interface SearchResult {
  type: 'blog' | 'press' | 'brand-story' | 'product';
  slug: string;
  title_ko: string;
  title_en: string;
  subtitle_ko: string;
  subtitle_en: string;
}

const SearchPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm.trim())}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results || []);
      } else {
        setResults([]);
        addToast({
          type: 'error',
          message: '검색 중 오류가 발생했습니다.'
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      addToast({
        type: 'error',
        message: '검색 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'blog': return '블로그';
      case 'press': return '언론보도';
      case 'brand-story': return '브랜드 스토리';
      case 'product': return '제품';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog': return 'bg-blue-100 text-blue-800';
      case 'press': return 'bg-green-100 text-green-800';
      case 'brand-story': return 'bg-purple-100 text-purple-800';
      case 'product': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDetailUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'blog': return `/blog/${result.slug}`;
      case 'press': return `/press/${result.slug}`;
      case 'brand-story': return `/brand-story/${result.slug}`;
      case 'product': return `/products/${result.slug}`;
      default: return '#';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('search', '검색')}
          </h1>
          <p className="text-gray-600">
            {t('search_description', '원하는 정보를 검색해보세요')}
          </p>
        </div>

        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search_placeholder', '검색어를 입력하세요...')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('searching', '검색 중...')}
                </div>
              ) : (
                t('search', '검색')
              )}
            </button>
          </div>
        </form>

        {/* 검색 결과 */}
        {hasSearched && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t('searching', '검색 중...')}</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="text-sm text-gray-600 mb-4">
                  {t('search_results_count', '{{count}}개의 결과를 찾았습니다', { count: results.length })}
                </div>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <Link
                      key={index}
                      href={getDetailUrl(result)}
                      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(result.type)}`}>
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {i18n.language === 'en' ? result.title_en : result.title_ko}
                          </h3>
                          <p className="text-gray-600">
                            {i18n.language === 'en' ? result.subtitle_en : result.subtitle_ko}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('no_results', '검색 결과가 없습니다')}
                </h3>
                <p className="text-gray-600">
                  {t('no_results_description', '다른 검색어를 시도해보세요')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 