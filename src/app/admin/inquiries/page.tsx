'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const InquiriesManagement: React.FC = () => {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const inquiryData = {
    ko: {
      title: '문의 관리',
      search: '문의 검색...',
      filterAll: '전체',
      table: {
        name: '이름',
        company: '회사명',
        category: '카테고리',
        subject: '제목',
        status: '상태',
        receivedDate: '접수일',
        actions: '작업'
      },
      status: {
        new: '신규',
        inProgress: '처리중',
        completed: '완료',
        closed: '종료'
      },
      actions: {
        view: '보기',
        reply: '답변',
        delete: '삭제'
      },
      noInquiries: '등록된 문의가 없습니다.'
    },
    en: {
      title: 'Inquiries Management',
      search: 'Search inquiries...',
      filterAll: 'All',
      table: {
        name: 'Name',
        company: 'Company',
        category: 'Category',
        subject: 'Subject',
        status: 'Status',
        receivedDate: 'Received Date',
        actions: 'Actions'
      },
      status: {
        new: 'New',
        inProgress: 'In Progress',
        completed: 'Completed',
        closed: 'Closed'
      },
      actions: {
        view: 'View',
        reply: 'Reply',
        delete: 'Delete'
      },
      noInquiries: 'No inquiries found.'
    }
  };

  const t = inquiryData[lang];

  // Mock data - 실제로는 API에서 가져올 데이터
  const inquiries = [
    {
      id: '1',
      name: '김철수',
      company: 'ABC 기업',
      category: { ko: '제품 문의', en: 'Product Inquiry' },
      subject: { ko: '만보 보행기 대량 구매 문의', en: 'Bulk Purchase Inquiry for Manbo Walker' },
      status: 'new',
      received_date: '2024-01-15',
      email: 'kim@abc.com',
      phone: '010-1234-5678'
    },
    {
      id: '2',
      name: '이영희',
      company: 'XYZ 회사',
      category: { ko: '가격 문의', en: 'Price Inquiry' },
      subject: { ko: '보듬 기저귀 가격 문의', en: 'Price Inquiry for Bodeum Diaper' },
      status: 'inProgress',
      received_date: '2024-01-14',
      email: 'lee@xyz.com',
      phone: '010-9876-5432'
    },
    {
      id: '3',
      name: '박민수',
      company: 'DEF 기업',
      category: { ko: '기술 문의', en: 'Technical Inquiry' },
      subject: { ko: '제품 스펙 상세 문의', en: 'Detailed Product Specification Inquiry' },
      status: 'completed',
      received_date: '2024-01-13',
      email: 'park@def.com',
      phone: '010-5555-1234'
    }
  ];

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject[lang].toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'inProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-1">
            {lang === 'ko' ? '고객 문의를 관리합니다.' : 'Manage customer inquiries.'}
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t.filterAll}</option>
            {Object.entries(t.status).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.name}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.company}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.category}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.subject}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.receivedDate}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inquiry.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inquiry.category[lang]}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {inquiry.subject[lang]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                        {t.status[inquiry.status as keyof typeof t.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inquiry.received_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/inquiries/${inquiry.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {t.actions.view}
                        </Link>
                        <Link
                          href={`/admin/inquiries/${inquiry.id}/reply`}
                          className="text-green-600 hover:text-green-900"
                        >
                          {t.actions.reply}
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
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {t.noInquiries}
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

export default InquiriesManagement; 