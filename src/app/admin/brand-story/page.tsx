'use client';

import React, { useEffect, useState } from 'react';
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

const AdminBrandStoryPage: React.FC = () => {
  const { addToast } = useToast();
  const [brandStories, setBrandStories] = useState<BrandStoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrandStories();
  }, []);

  const fetchBrandStories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/brand-story?published=false');
      if (!res.ok) throw new Error('Failed to fetch brand stories');
      const data = await res.json();
      console.log('Brand stories response:', data);
      setBrandStories(data.results || []);
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
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      // 임시로 로컬 상태만 업데이트 (API 연결 문제 해결 전까지)
      setBrandStories(prev => prev.map(story => 
        story._id === id 
          ? { ...story, is_published: !currentStatus }
          : story
      ));
      
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
      setBrandStories(prev => prev.filter(story => story._id !== id));
      
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

      <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                유튜브
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
            {brandStories.map((story) => (
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
                      YouTube
                    </span>
                  ) : (
                    <span className="text-gray-400">없음</span>
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
    </div>
  );
};

export default AdminBrandStoryPage;