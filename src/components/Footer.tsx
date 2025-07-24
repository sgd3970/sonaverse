'use client';

import React, { useState } from 'react';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Footer (공통 푸터)
 * - 3등분 그리드 구조
 * - 좌측: 로고 + 사업자 정보
 * - 중앙: SONAVERSE + 네비게이션
 * - 우측: 고객지원 + SNS + 개인정보처리방침
 */
const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const openPrivacyModal = () => setIsPrivacyModalOpen(true);
  const closePrivacyModal = () => setIsPrivacyModalOpen(false);

  return (
    <footer className="w-full border-t mt-0 pt-8" style={{ backgroundColor: '#f0ece9' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                      {/* 좌측: 로고 + 사업자 정보 */}
            <div className="flex flex-col md:col-span-6">
            {/* 로고 */}
            <a href="/" className="mb-4">
              <img src="/logo/symbol_logo.png" alt="SONAVERSE Symbol Logo" className="h-12 w-auto" />
            </a>
            {/* 사업자 정보 */}
            <div className="text-sm text-gray-600 space-y-1">
              <div><span className="font-bold">{t('company_name_label', '상호명')}:</span> {t('company_name', '(주)소나버스')}</div>
              <div><span className="font-bold">{t('representative_label', '대표자명')}:</span> {t('representative', '이수진')}</div>
              <div><span className="font-bold">{t('address_label', '사업장 주소')}:</span> {t('address', '(24232) 강원특별자치도 춘천시 후석로462번길 7 춘천ICT벤처센터 319호')}</div>
              <div><span className="font-bold">{t('main_phone_label', '대표 전화')}:</span> {t('main_phone', '010-5703-8899')}</div>
              <div><span className="font-bold">{t('business_registration_number_label', '사업자등록번호')}:</span> {t('business_registration_number', '697-87-02555')}</div>
              <div><span className="font-bold">{t('e_commerce_registration_number_label', '통신판매업 신고 번호')}:</span> {t('e_commerce_registration_number', '2023-강원춘천-0688')}</div>
                {/* 개인정보처리방침 */}
              <button 
                onClick={openPrivacyModal}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors underline text-left"
              >
                {t('privacy_policy', '개인정보처리방침')}
              </button>
            </div>
          </div>

          {/* 중앙: SONAVERSE + 네비게이션 */}
          <div className="flex flex-col md:col-span-3 md:col-start-9">
            {/* SONAVERSE 텍스트 + 언더라인 */}
            <div className="mb-4">
              <a href="/"><h3 className="text-xl font-bold text-gray-900 mb-2">{t('sonaverse_title', 'SONAVERSE')}</h3></a>
              <div className="w-16 h-0.5" style={{ backgroundColor: '#bda191' }}></div>
            </div>
            {/* 네비게이션 항목들 */}
            <nav className="flex flex-col space-y-2 text-sm mt-2">              
              <a href="/products/manbo-walker" className="relative px-1 py-0.5 transition-colors duration-200 hover:text-[#bda191] hover:after:opacity-100 after:content-[''] after:block after:h-0.5 after:bg-[#bda191] after:rounded-full after:opacity-0 after:transition-all after:duration-200 after:mt-1 font-medium">{t('manbo_walker', '만보 보행기')}</a>
              <a href="/products/bodeum-diaper" className="relative px-1 py-0.5 transition-colors duration-200 hover:text-[#bda191] hover:after:opacity-100 after:content-[''] after:block after:h-0.5 after:bg-[#bda191] after:rounded-full after:opacity-0 after:transition-all after:duration-200 after:mt-1 font-medium">{t('bodeum_diaper', '보듬 기저귀')}</a>
              <a href="/inquiry" className="relative px-1 py-0.5 transition-colors duration-200 hover:text-[#bda191] hover:after:opacity-100 after:content-[''] after:block after:h-0.5 after:bg-[#bda191] after:rounded-full after:opacity-0 after:transition-all after:duration-200 after:mt-1 font-medium">{t('inquiry', '기업 문의')}</a>
              <a href="/press" className="relative px-1 py-0.5 transition-colors duration-200 hover:text-[#bda191] hover:after:opacity-100 after:content-[''] after:block after:h-0.5 after:bg-[#bda191] after:rounded-full after:opacity-0 after:transition-all after:duration-200 after:mt-1 font-medium">{t('press', '언론보도')}</a>
              <a href="/blog" className="relative px-1 py-0.5 transition-colors duration-200 hover:text-[#bda191] hover:after:opacity-100 after:content-[''] after:block after:h-0.5 after:bg-[#bda191] after:rounded-full after:opacity-0 after:transition-all after:duration-200 after:mt-1 font-medium">{t('blog', '자사 블로그')}</a>
              <a href="/brand-story" className="relative px-1 py-0.5 transition-colors duration-200 hover:text-[#bda191] hover:after:opacity-100 after:content-[''] after:block after:h-0.5 after:bg-[#bda191] after:rounded-full after:opacity-0 after:transition-all after:duration-200 after:mt-1 font-medium">{t('brand_story', '브랜드 스토리')}</a>
            </nav>
          </div>

          {/* 우측: 고객지원 + SNS + 개인정보처리방침 */}
          <div className="flex flex-col md:col-span-4 md:col-start-12">
            {/* 고객지원 텍스트 + 언더라인 */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('customer_support_title', '고객지원')}</h3>
              <div className="w-16 h-0.5" style={{ backgroundColor: '#bda191' }}></div>
            </div>
            {/* 고객센터 정보 */}
            <div className="text-sm text-gray-600 space-y-1 mb-6">
              <div><span className="font-bold">{t('customer_service_label', '고객센터')}</span></div>
              <div>{t('cs_phone', '010-5703-8899')}</div>
              <div><span className="font-bold">{t('email_label', '이메일')}</span></div>
              <div>{t('cs_email', 'shop@sonaverse.kr')}</div>
              <div><span className="font-bold">{t('operating_hours_label', '운영시간')}</span></div>
              <div>{t('cs_hours', '평일 09:30 ~ 18:30')}</div>
              <div>{t('closed_on_weekends', '(주말·공휴일 휴무)')}</div>
            </div>
            {/* SNS 로고들 */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">SNS</h3>
              <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: '#bda191' }}></div>
              <div className="flex space-x-4">
                <a href="https://blog.naver.com/ourcompany" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/ourcompany" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/ourcompany" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://pf.kakao.com/_ourcompany" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
                  </svg>
                </a>
              </div>
            </div>
            
                      </div>
          </div>
        </div>
        
        {/* 개인정보처리방침 모달 */}
        <PrivacyPolicyModal 
          isOpen={isPrivacyModalOpen} 
          onClose={closePrivacyModal} 
        />
      </footer>
    );
  };

export default Footer; 