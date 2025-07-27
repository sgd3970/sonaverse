'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '../../../components/Toast';

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
  const { addToast } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blog?published=false', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch blog posts');
      const data = await res.json();
      setBlogPosts(data.results || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('블로그 포스트 목록을 불러오는데 실패했습니다.');
      addToast({
        type: 'error',
        message: '블로그 포스트 목록을 불러오는데 실패했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 기반 인증
        body: JSON.stringify({ is_published: !currentStatus }),
      });
      
      if (!res.ok) throw new Error('Failed to update blog post status');
      
      // 목록 새로고침
      fetchBlogPosts();
      addToast({
        type: 'success',
        message: `블로그 포스트가 ${!currentStatus ? '공개' : '비공개'}로 변경되었습니다.`
      });
    } catch (err) {
      console.error('Error updating blog post status:', err);
      addToast({
        type: 'error',
        message: '상태 변경에 실패했습니다.'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        credentials: 'include', // 쿠키 기반 인증
      });
      
      if (!res.ok) throw new Error('Failed to delete blog post');
      
      // 목록 새로고침
      fetchBlogPosts();
      addToast({
        type: 'success',
        message: '블로그 포스트가 삭제되었습니다.'
      });
    } catch (err) {
      console.error('Error deleting blog post:', err);
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
        <h1 className="text-2xl font-bold text-white">블로그 관리</h1>
        <Link 
          href="/admin/blog/new" 
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
        >
          새 블로그 작성
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
                작성자
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
            {blogPosts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {post.content?.ko?.title || post.content?.en?.title || '제목 없음'}
                  </div>
                  <div className="text-sm text-gray-400">{post.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  (주) 소나버스
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatDate(post.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={post.is_published ? 'published' : 'unpublished'}
                    onChange={(e) => handleTogglePublished(post._id, post.is_published)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-yellow-400 ${
                      post.is_published 
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
                      href={`/admin/blog/${post.slug}/edit`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
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

export default AdminBlogPage; 