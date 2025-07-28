'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '../../../components/Toast';

interface AnalyticsData {
  visitors: {
    trend: Array<{ date: string; count: number }>;
  };
  searchKeywords: Array<{ keyword: string; count: number }>;
  content: {
    blog: Array<{ date: string; count: number }>;
    press: Array<{ date: string; count: number }>;
    brandStory: Array<{ date: string; count: number }>;
  };
  totals: {
    blogs: number;
    press: number;
    brandStories: number;
  };
}

const AnalyticsPage: React.FC = () => {
  const { addToast } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visitorPeriod, setVisitorPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [keywordPeriod, setKeywordPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [contentPeriod, setContentPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // 클라이언트 사이드에서 데이터 필터링
  const getFilteredData = () => {
    if (!rawData) return null;

    return {
      visitors: {
        trend: filterVisitorData(rawData.visitors, visitorPeriod)
      },
      searchKeywords: filterKeywordData(rawData.searchKeywords, keywordPeriod),
      content: {
        blog: filterContentData(rawData.content.blog, contentPeriod),
        press: filterContentData(rawData.content.press, contentPeriod),
        brandStory: filterContentData(rawData.content.brandStory, contentPeriod)
      }
    };
  };

  const filterVisitorData = (visitors: any, period: string) => {
    // 방문자 데이터는 이미 서버에서 처리되므로 그대로 반환
    return visitors.trend;
  };

  const filterKeywordData = (keywords: any, period: string) => {
    // 검색 키워드 데이터는 이미 서버에서 처리되므로 그대로 반환
    return keywords;
  };

  const filterContentData = (content: any, period: string) => {
    // 콘텐츠 데이터는 이미 서버에서 처리되므로 그대로 반환
    return content;
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/analytics?visitorPeriod=daily&keywordPeriod=daily&contentPeriod=daily', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await res.json();
      setRawData(analyticsData);
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      addToast({
        type: 'error',
        message: '통계 데이터를 불러오는데 실패했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderVisitorChart = () => {
    if (!data) return null;

    const maxCount = Math.max(...data.visitors.trend.map(item => item.count));
    const chartHeight = 160; // h-40 (160px)에 맞춤

    const handlePeriodChange = async (newPeriod: 'daily' | 'weekly' | 'monthly') => {
      setVisitorPeriod(newPeriod);
      try {
        const res = await fetch(`/api/admin/analytics?visitorPeriod=${newPeriod}&keywordPeriod=${keywordPeriod}&contentPeriod=${contentPeriod}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const analyticsData = await res.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        addToast({
          type: 'error',
          message: '통계 데이터를 불러오는데 실패했습니다.'
        });
      }
    };

    return (
      <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">방문자 통계</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePeriodChange('daily')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                visitorPeriod === 'daily'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              일간
            </button>
            <button
              onClick={() => handlePeriodChange('weekly')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                visitorPeriod === 'weekly'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              주간
            </button>
            <button
              onClick={() => handlePeriodChange('monthly')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                visitorPeriod === 'monthly'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              월간
            </button>
          </div>
        </div>
        <div className="relative h-48">
          <div className="flex items-end justify-between h-40 space-x-1 overflow-hidden">
            {data.visitors.trend.map((item, index) => {
              const height = maxCount > 0 ? Math.min((item.count / maxCount) * chartHeight, 160) : 0;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-yellow-400 rounded-t w-full transition-all duration-300 hover:bg-yellow-300"
                    style={{ height: `${height}px` }}
                    title={`${item.date}: ${item.count}명`}
                  />
                  <span className="text-xs text-gray-400 mt-2">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSearchKeywords = () => {
    if (!data) return null;

    const handlePeriodChange = async (newPeriod: 'daily' | 'weekly' | 'monthly') => {
      setKeywordPeriod(newPeriod);
      try {
        const res = await fetch(`/api/admin/analytics?visitorPeriod=${visitorPeriod}&keywordPeriod=${newPeriod}&contentPeriod=${contentPeriod}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const analyticsData = await res.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        addToast({
          type: 'error',
          message: '통계 데이터를 불러오는데 실패했습니다.'
        });
      }
    };

    return (
      <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">인입 키워드</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePeriodChange('daily')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                keywordPeriod === 'daily'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              일간
            </button>
            <button
              onClick={() => handlePeriodChange('weekly')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                keywordPeriod === 'weekly'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              주간
            </button>
            <button
              onClick={() => handlePeriodChange('monthly')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                keywordPeriod === 'monthly'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              월간
            </button>
          </div>
        </div>
        
        {/* 키워드 통계 요약 */}
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">총 키워드:</span>
              <span className="ml-2 text-white font-medium">{data.searchKeywords.length}개</span>
            </div>
            <div>
              <span className="text-gray-400">총 검색:</span>
              <span className="ml-2 text-white font-medium">
                {data.searchKeywords.reduce((sum, item) => sum + item.count, 0)}회
              </span>
            </div>
          </div>
        </div>

        {/* 키워드 목록 */}
        <div className="space-y-3">
          {data.searchKeywords.length > 0 ? (
            data.searchKeywords.slice(0, 10).map((keyword, index) => (
              <div key={keyword.keyword} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center">
                  <span className={`text-sm font-bold mr-3 ${
                    index === 0 ? 'text-yellow-400' : 
                    index === 1 ? 'text-gray-300' : 
                    index === 2 ? 'text-orange-400' : 'text-gray-400'
                  }`}>
                    {index + 1}.
                  </span>
                  <span className="text-sm text-gray-200 font-medium">{keyword.keyword}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    {keyword.count}회
                  </span>
                  <div className="w-16 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((keyword.count / Math.max(...data.searchKeywords.map(k => k.count))) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm mb-2">🔍</div>
              <p className="text-gray-400 text-sm">검색 데이터가 없습니다.</p>
              <p className="text-gray-500 text-xs mt-1">사용자가 검색을 시작하면 여기에 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContentStats = () => {
    if (!data) return null;

    const contentData = [
      { name: '블로그', data: data.content.blog, color: 'bg-green-500' },
      { name: '언론보도', data: data.content.press, color: 'bg-blue-500' },
      { name: '브랜드 스토리', data: data.content.brandStory, color: 'bg-purple-500' }
    ];

    const handlePeriodChange = async (newPeriod: 'daily' | 'weekly' | 'monthly') => {
      setContentPeriod(newPeriod);
      try {
        const res = await fetch(`/api/admin/analytics?visitorPeriod=${visitorPeriod}&keywordPeriod=${keywordPeriod}&contentPeriod=${newPeriod}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const analyticsData = await res.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        addToast({
          type: 'error',
          message: '통계 데이터를 불러오는데 실패했습니다.'
        });
      }
    };

    return (
      <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">콘텐츠 업로드 통계</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePeriodChange('daily')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                contentPeriod === 'daily'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              일간
            </button>
            <button
              onClick={() => handlePeriodChange('weekly')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                contentPeriod === 'weekly'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              주간
            </button>
            <button
              onClick={() => handlePeriodChange('monthly')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                contentPeriod === 'monthly'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              월간
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {contentData.map((content) => (
            <div key={content.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">{content.name}</span>
                <span className="text-sm text-gray-400">
                  총 {content.name === '블로그' ? data.totals.blogs :
                       content.name === '언론보도' ? data.totals.press :
                       data.totals.brandStories}개
                </span>
              </div>
              <div className="flex items-end space-x-1 h-16 overflow-hidden">
                {content.data.slice(-7).map((item, index) => {
                  const maxCount = Math.max(...content.data.map(d => d.count));
                  const height = maxCount > 0 ? Math.min((item.count / maxCount) * 60, 60) : 0;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className={`${content.color} rounded-t w-full transition-all duration-300`}
                        style={{ height: `${height}px` }}
                        title={`${item.date}: ${item.count}개`}
                      />
                      <span className="text-xs text-gray-400 mt-1">
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">통계 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">상세 통계</h1>
      </div>

      {/* 요약 통계 */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">방문자</p>
                <p className="text-2xl font-bold text-white">
                  {data.visitors.trend.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🔍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">인입 키워드</p>
                <p className="text-2xl font-bold text-white">
                  {data.searchKeywords.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">총 콘텐츠</p>
                <p className="text-2xl font-bold text-white">
                  {data.totals.blogs + data.totals.press + data.totals.brandStories}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderVisitorChart()}
        {renderSearchKeywords()}
      </div>

      {/* 콘텐츠 통계 */}
      {renderContentStats()}
    </div>
  );
};

export default AnalyticsPage; 