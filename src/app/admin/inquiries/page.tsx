'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InquiryDetailModal from '@/components/admin/InquiryDetailModal';
import { useToast } from '@/components/Toast';

const InquiriesManagement: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [inquiries, setInquiries] = useState([
    {
      id: '1',
      name: '김철수',
      company: 'ABC 기업',
      category: '제품 문의',
      subject: '만보 보행기 대량 구매 문의',
      message: '안녕하세요. 만보 보행기 대량 구매를 고려하고 있습니다. 100개 이상 구매 시 할인율과 배송 조건에 대해 문의드립니다. 또한 제품의 안전 인증서와 보증 기간도 확인하고 싶습니다. 답변 부탁드립니다.',
      status: 'new',
      received_date: '2024-01-15',
      email: 'kim@abc.com',
      phone: '010-1234-5678'
    },
    {
      id: '2',
      name: '이영희',
      company: 'XYZ 회사',
      category: '가격 문의',
      subject: '보듬 기저귀 가격 문의',
      message: '보듬 기저귀의 가격 정책에 대해 문의드립니다. 소매점과 대량 구매 시 가격 차이가 얼마나 나는지, 그리고 계약 조건은 어떻게 되는지 알려주시기 바랍니다.',
      status: 'inProgress',
      received_date: '2024-01-14',
      email: 'lee@xyz.com',
      phone: '010-9876-5432'
    },
    {
      id: '3',
      name: '박민수',
      company: 'DEF 기업',
      category: '기술 문의',
      subject: '제품 스펙 상세 문의',
      message: '제품의 상세 스펙과 기술 자료를 요청드립니다. 특히 재질, 크기, 무게, 사용 연령 등에 대한 상세 정보가 필요합니다. PDF 형태로 자료를 보내주시면 감사하겠습니다.',
      status: 'completed',
      received_date: '2024-01-13',
      email: 'park@def.com',
      phone: '010-5555-1234'
    }
  ]);

  const labels = {
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
      completed: '완료'
    },
    actions: {
      view: '보기',
      reply: '답변',
      delete: '삭제'
    },
    noInquiries: '등록된 문의가 없습니다.'
  };

  // 상태값 수정 함수
  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      // 실제로는 API 호출
      setInquiries(prev => prev.map(inquiry => 
        inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
      ));
      
      addToast({
        type: 'success',
        message: '상태가 성공적으로 변경되었습니다.'
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: '상태 변경에 실패했습니다.'
      });
    }
  };

  // 문의 삭제 함수
  const handleDeleteInquiry = async (inquiryId: string) => {
    try {
      setInquiries(prev => prev.filter(inquiry => inquiry.id !== inquiryId));
      addToast({
        type: 'success',
        message: '문의가 삭제되었습니다.'
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: '문의 삭제에 실패했습니다.'
      });
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{labels.title}</h1>
          <p className="text-gray-300 mt-1">
            고객 문의를 관리합니다.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={labels.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            <option value="all">{labels.filterAll}</option>
            {Object.entries(labels.status).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {labels.table.name}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {labels.table.company}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {labels.table.category}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {labels.table.subject}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {labels.table.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {labels.table.receivedDate}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {labels.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {inquiry.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {inquiry.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{inquiry.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{inquiry.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 max-w-xs truncate">
                        {inquiry.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-yellow-400 ${getStatusColor(inquiry.status)}`}
                      >
                        {Object.entries(labels.status).map(([key, value]) => (
                          <option key={key} value={key} className="bg-gray-800 text-white">
                            {value}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{inquiry.received_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {labels.actions.view}
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300 transition-colors"
                          onClick={() => {
                            if (confirm('정말 삭제하시겠습니까?')) {
                              handleDeleteInquiry(inquiry.id);
                            }
                          }}
                        >
                          {labels.actions.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    {labels.noInquiries}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 문의 상세 모달 */}
      <InquiryDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedInquiry(null);
        }}
        inquiry={selectedInquiry}
      />
    </div>
  );
};

export default InquiriesManagement; 