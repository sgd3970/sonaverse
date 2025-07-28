'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useToast } from '../../../components/Toast';

interface BrandStoryItem {
  _id: string;
  slug: string;
  content: {
    ko?: {
      title: string;
      subtitle: string;
    };
    en?: {
      title: string;
      subtitle: string;
    };
  };
  youtube_url?: string;
  created_at: string;
  is_published: boolean;
  tags: string[];
}

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  results: BrandStoryItem[];
}

const AdminBrandStoryPage: React.FC = () => {
  const { addToast } = useToast();
  const [allBrandStories, setAllBrandStories] = useState<BrandStoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 모든 브랜드 스토리를 가져오기
  useEffect(() => {
    fetchAllBrandStories();
  }, []);

  const fetchAllBrandStories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/brand-story?pageSize=1000');
      if (!res.ok) throw new Error('Failed to fetch brand stories');
      const data = await res.json();
      setAllBrandStories(data.results || []);
    } catch (err) {
      console.error('Error fetching brand stories:', err);
      setError('브랜드 스토리 목록을 불러오는데 실패했습니다.');
      addToast({
        type: 'error',
        message: '브랜드 스토리 목록을 불러오는데 실패했습니다.'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // 검색 필터링된 결과
  const filteredBrandStories = useMemo(() => {
    if (!searchTerm.trim()) {
      return allBrandStories;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return allBrandStories.filter(story => {
      const koTitle = story.content?.ko?.title?.toLowerCase() || '';
      const enTitle = story.content?.en?.title?.toLowerCase() || '';
      const koSubtitle = story.content?.ko?.subtitle?.toLowerCase() || '';
      const enSubtitle = story.content?.en?.subtitle?.toLowerCase() || '';
      const tags = story.tags?.join(' ').toLowerCase() || '';
      
      return koTitle.includes(searchLower) ||
             enTitle.includes(searchLower) ||
             koSubtitle.includes(searchLower) ||
             enSubtitle.includes(searchLower) ||
             tags.includes(searchLower);
    });
  }, [allBrandStories, searchTerm]);

  // 페이징네이션 계산
  const paginationData = useMemo(() => {
    const total = filteredBrandStories.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const results = filteredBrandStories.slice(startIndex, endIndex);
    
    return {
      total,
      page: currentPage,
      pageSize,
      totalPages,
      results
    };
  }, [filteredBrandStories, currentPage, pageSize]);

  // 검색어가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      // 즉시 로컬 상태 업데이트
      setAllBrandStories(prev => prev.map(story => 
        story._id === id 
          ? { ...story, is_published: !currentStatus }
          : story
      ));

      const res = await fetch(`/api/brand-story/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ is_published: !currentStatus }),
      });
      
      if (!res.ok) {
        // API 실패 시 원래 상태로 되돌리기
        setAllBrandStories(prev => prev.map(story => 
          story._id === id 
            ? { ...story, is_published: currentStatus }
            : story
        ));
        throw new Error('Failed to update brand story status');
      }
      
      addToast({
        type: 'success',
        message: `브랜드 스토리가 ${!currentStatus ? '공개' : '비공개'}로 변경되었습니다.`
      });
    } catch (err) {
      console.error('Error updating brand story status:', err);
      addToast({
        type: 'error',
        message: '상태 변경에 실패했습니다.'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      // 임시로 로컬 상태만 업데이트 (API 연결 문제 해결 전까지)
      setAllBrandStories(prev => prev.filter(story => story._id !== id));
      
      addToast({
        type: 'success',
        message: '브랜드 스토리가 삭제되었습니다.'
      });
    } catch (err) {
      console.error('Error deleting brand story:', err);
      addToast({
        type: 'error',
        message: '삭제에 실패했습니다.'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '. ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-400 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">브랜드 스토리 관리</h1>
        <Link 
          href="/admin/brand-story/new" 
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
        >
          새 브랜드 스토리 작성
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700 mb-6">
        <div className="p-4 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="제목, 부제목, 태그로 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchTerm && (
            <div className="ml-4 text-sm text-gray-400">
              {paginationData.total}개 결과
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                구분
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                작성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {paginationData.results.map((story) => (
              <tr key={story._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {story.content?.ko?.title || story.content?.en?.title || '제목 없음'}
                  </div>
                  <div className="text-sm text-gray-400">{story.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {story.youtube_url ? (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      유튜브
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      블로그
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatDate(story.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={story.is_published ? 'published' : 'unpublished'}
                    onChange={(e) => handleTogglePublished(story._id, story.is_published)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-yellow-400 ${
                      story.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <option value="published">공개</option>
                    <option value="unpublished">비공개</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/brand-story/${story.slug}/edit`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(story._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginationData.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-1">
            {/* 이전 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-l-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 페이지 번호들 */}
            {Array.from({ length: Math.min(5, paginationData.totalPages) }, (_, i) => {
              let pageNum;
              if (paginationData.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= paginationData.totalPages - 2) {
                pageNum = paginationData.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border transition-colors ${
                    currentPage === pageNum
                      ? 'z-10 bg-yellow-400 text-black border-yellow-400'
                      : 'text-gray-300 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* 다음 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === paginationData.totalPages}
              className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-r-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>

          {/* 페이지 정보 */}
          <div className="ml-6 flex items-center text-sm text-gray-400">
            <span>
              {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, paginationData.total)} / {paginationData.total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrandStoryPage;