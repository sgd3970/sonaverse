'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
  const [pressList, setPressList] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPressList();
  }, []);

  const fetchPressList = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/press?active=false'); // 모든 항목 조회 (비활성화된 것도 포함)
      if (!res.ok) throw new Error('Failed to fetch press list');
      const data = await res.json();
      setPressList(data.results || []);
    } catch (err) {
      console.error('Error fetching press list:', err);
      setError('언론보도 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const res = await fetch(`/api/press/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      
      if (!res.ok) throw new Error('Failed to update press status');
      
      // 목록 새로고침
      fetchPressList();
    } catch (err) {
      console.error('Error updating press status:', err);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const res = await fetch(`/api/press/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error('Failed to delete press');
      
      // 목록 새로고침
      fetchPressList();
    } catch (err) {
      console.error('Error deleting press:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">언론보도 관리</h1>
        <Link 
          href="/admin/press/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          새 언론보도 등록
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                언론사
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                발행일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pressList.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.content?.ko?.title || item.content?.en?.title || '제목 없음'}
                  </div>
                  <div className="text-sm text-gray-500">{item.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.press_name?.ko || item.press_name?.en || '언론사명 없음'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.published_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.is_active ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/press/${item.slug}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleToggleActive(item._id, item.is_active)}
                      className={`${
                        item.is_active 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {item.is_active ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900"
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