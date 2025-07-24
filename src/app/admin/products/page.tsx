'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const ProductsManagement: React.FC = () => {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [searchTerm, setSearchTerm] = useState('');

  const productData = {
    ko: {
      title: '제품 관리',
      addNew: '새 제품 추가',
      search: '제품 검색...',
      table: {
        name: '제품명',
        category: '카테고리',
        price: '가격',
        status: '상태',
        lastUpdated: '마지막 수정',
        actions: '작업'
      },
      status: {
        active: '활성',
        inactive: '비활성'
      },
      actions: {
        edit: '수정',
        delete: '삭제',
        view: '보기'
      },
      noProducts: '등록된 제품이 없습니다.'
    },
    en: {
      title: 'Products Management',
      addNew: 'Add New Product',
      search: 'Search products...',
      table: {
        name: 'Product Name',
        category: 'Category',
        price: 'Price',
        status: 'Status',
        lastUpdated: 'Last Updated',
        actions: 'Actions'
      },
      status: {
        active: 'Active',
        inactive: 'Inactive'
      },
      actions: {
        edit: 'Edit',
        delete: 'Delete',
        view: 'View'
      },
      noProducts: 'No products found.'
    }
  };

  const t = productData[lang];

  // Mock data - 실제로는 API에서 가져올 데이터
  const products = [
    {
      id: '1',
      name: { ko: '만보 보행기', en: 'Manbo Walker' },
      category: { ko: '보행기', en: 'Walker' },
      price: { ko: '150,000원', en: '$150' },
      status: 'active',
      last_updated: '2024-01-15',
      updated_by: 'admin'
    },
    {
      id: '2',
      name: { ko: '보듬 기저귀', en: 'Bodeum Diaper' },
      category: { ko: '기저귀', en: 'Diaper' },
      price: { ko: '25,000원', en: '$25' },
      status: 'active',
      last_updated: '2024-01-10',
      updated_by: 'admin'
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category[lang].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-1">
            {lang === 'ko' ? '웹사이트 제품을 관리합니다.' : 'Manage website products.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="border rounded-lg px-3 py-2"
            value={lang}
            onChange={(e) => setLang(e.target.value as 'ko' | 'en')}
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.addNew}
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.name}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.category}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.price}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.lastUpdated}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name[lang]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category[lang]}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.price[lang]}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {t.status[product.status as keyof typeof t.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.last_updated}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {t.actions.edit}
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          {t.actions.view}
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            if (confirm(lang === 'ko' ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete?')) {
                              // Delete logic here
                            }
                          }}
                        >
                          {t.actions.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {t.noProducts}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement; 