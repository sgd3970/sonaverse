'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogPost {
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
  created_at: string;
  is_published: boolean;
  tags: string[];
}

const AdminBlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blog?published=false'); // 모든 항목 조회 (비공개된 것도 포함)
      if (!res.ok) throw new Error('Failed to fetch blog posts');
      const data = await res.json();
      setBlogPosts(data.results || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('블로그 포스트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const res = await fetch(`/api/blog/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_published: !currentStatus }),
      });
      
      if (!res.ok) throw new Error('Failed to update blog post status');
      
      // 목록 새로고침
      fetchBlogPosts();
    } catch (err) {
      console.error('Error updating blog post status:', err);
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

      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error('Failed to delete blog post');
      
      // 목록 새로고침
      fetchBlogPosts();
    } catch (err) {
      console.error('Error deleting blog post:', err);
      alert('삭제에 실패했습니다.');
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
        <h1 className="text-2xl font-bold">블로그 관리</h1>
        <Link 
          href="/admin/blog/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          새 블로그 작성
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
                작성자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
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
            {blogPosts.map((post) => (
              <tr key={post._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {post.content?.ko?.title || post.content?.en?.title || '제목 없음'}
                  </div>
                  <div className="text-sm text-gray-500">{post.slug}</div>
                </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    (주) 소나버스
                  </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(post.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    post.is_published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {post.is_published ? '공개' : '비공개'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/blog/${post.slug}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleTogglePublished(post._id, post.is_published)}
                      className={`${
                        post.is_published 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {post.is_published ? '비공개' : '공개'}
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
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

export default AdminBlogPage; 