'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '../../../components/Toast';

interface PressItem {
  _id: string;
  slug: string;
  published_date: string;
  press_name: Record<string, string>;
  content: Record<string, {
    title: string;
    body: string;
    external_link?: string;
  }>;
  is_active: boolean;
  created_at: string;
  last_updated: string;
}

const AdminPressPage: React.FC = () => {
  const { addToast } = useToast();
  const [pressList, setPressList] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPressList();
  }, []);

  const fetchPressList = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/press?active=false', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch press list');
      const data = await res.json();
      setPressList(data.results || []);
    } catch (err) {
      console.error('Error fetching press list:', err);
      setError('언론보도 목록을 불러오는데 실패했습니다.');
      addToast({
        type: 'error',
        message: '언론보도 목록을 불러오는데 실패했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/press/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 기반 인증
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      
      if (!res.ok) throw new Error('Failed to update press status');
      
      // 목록 새로고침
      fetchPressList();
      addToast({
        type: 'success',
        message: `언론보도가 ${!currentStatus ? '활성화' : '비활성화'}되었습니다.`
      });
    } catch (err) {
      console.error('Error updating press status:', err);
      addToast({
        type: 'error',
        message: '상태 변경에 실패했습니다.'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      const res = await fetch(`/api/press/${id}`, {
        method: 'DELETE',
        credentials: 'include', // 쿠키 기반 인증
      });
      
      if (!res.ok) throw new Error('Failed to delete press');
      
      // 목록 새로고침
      fetchPressList();
      addToast({
        type: 'success',
        message: '언론보도가 삭제되었습니다.'
      });
    } catch (err) {
      console.error('Error deleting press:', err);
      addToast({
        type: 'error',
        message: '삭제에 실패했습니다.'
      });
    }
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
        <h1 className="text-2xl font-bold text-white">언론보도 관리</h1>
        <Link 
          href="/admin/press/new" 
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
        >
          새 언론보도 등록
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
                언론사
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                발행일
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
            {pressList.map((item) => (
              <tr key={item._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {item.content?.ko?.title || item.content?.en?.title || '제목 없음'}
                  </div>
                  <div className="text-sm text-gray-400">{item.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {item.press_name?.ko || item.press_name?.en || '언론사명 없음'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(item.published_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={item.is_active ? 'active' : 'inactive'}
                    onChange={(e) => handleToggleActive(item._id, item.is_active)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-yellow-400 ${
                      item.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/press/${item.slug}/edit`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
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

export default AdminPressPage; 