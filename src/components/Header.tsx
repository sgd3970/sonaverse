'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Header (공통 헤더)
 * - 언어 선택에 따라 로고 이미지 변경 (ko: ko_logo, en: en_logo)
 * - 디폴트는 ko_logo
 * - 반응형 모바일 네비게이션 포함
 */
const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const logoSrc = language === 'en' ? '/logo/en_logo.png' : '/logo/ko_logo.png';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 바깥 클릭 시 드롭다운 닫힘
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isDropdownOpen]);

  // ABOUT US 드롭다운 바깥 클릭 시 닫힘
  useEffect(() => {
    if (!isAboutDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(e.target as Node)) {
        setIsAboutDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isAboutDropdownOpen]);

  return (
    <header className="w-full sticky top-0 z-50 relative" style={{ backgroundColor: '#f0ece9' }}>
      {/* 헤더 하단 그라데이션 */}
      <div className="absolute left-0 right-0 bottom-0 h-6 pointer-events-none" style={{background: 'linear-gradient(to bottom, rgba(240,236,233,0) 0%, rgba(240,236,233,0.7) 60%, rgba(240,236,233,1) 100%)'}} />
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src={logoSrc} alt="SONAVERSE Logo" className="h-8 w-auto" />
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center text-base font-medium tracking-wide">
          <a href="/" className="nav-link">{t('home', '홈')}</a>
          <div className="relative" ref={dropdownRef}>
            <button
              className="nav-link focus:outline-none"
              onClick={() => setIsDropdownOpen((open) => !open)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              type="button"
            >
              {t('products', '제품소개')}
            </button>
            <div className={`absolute left-1/2 -translate-x-1/2 mt-3 flex gap-4 bg-white/90 backdrop-blur-md border border-[#e5e0db] rounded-2xl shadow-2xl px-4 py-4 min-w-[380px] z-50 transition-all duration-200 ${isDropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
              <a href="/products/manbo-walker" className="flex-1 flex flex-col items-center justify-center gap-2 px-6 py-3 rounded-xl hover:bg-[#f0ece9] hover:text-[#bda191] transition-colors duration-200 text-base font-medium shadow-sm">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M7 20v-2a2 2 0 0 1 2-2h2.5M16 20v-2a2 2 0 0 0-2-2h-1.5M12 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4.5 8.5l2.5-2.5m0 0l2.5 2.5m-2.5-2.5V20" stroke="#bda191" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t('manbo_walker', '만보 보행기')}
              </a>
              <a href="/products/bodeum-diaper" className="flex-1 flex flex-col items-center justify-center gap-2 px-6 py-3 rounded-xl hover:bg-[#f0ece9] hover:text-[#bda191] transition-colors duration-200 text-base font-medium shadow-sm">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="4" stroke="#bda191" strokeWidth="1.5"/><path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="#bda191" strokeWidth="1.5"/></svg>
                {t('bodeum_diaper', '보듬 기저귀')}
              </a>
            </div>
          </div>
          <div className="relative" ref={aboutDropdownRef}>
            <button
              className="nav-link focus:outline-none"
              onClick={() => setIsAboutDropdownOpen((open) => !open)}
              aria-expanded={isAboutDropdownOpen}
              aria-haspopup="true"
              type="button"
            >
              {t('about_us', 'ABOUT US')}
            </button>
            <div className={`absolute left-1/2 -translate-x-1/2 mt-3 flex flex-col bg-white/90 backdrop-blur-md border border-[#e5e0db] rounded-2xl shadow-2xl px-4 py-4 min-w-[280px] z-50 transition-all duration-200 ${isAboutDropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
              <a href="/brand-story" className="flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-[#f0ece9] hover:text-[#bda191] transition-colors duration-200 text-base font-medium">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#bda191" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t('brand_story', '브랜드 스토리')}
              </a>
              <a href="/team" className="flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-[#f0ece9] hover:text-[#bda191] transition-colors duration-200 text-base font-medium">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#bda191" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="#bda191" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#bda191" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#bda191" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t('team_introduction', '팀 소개')}
              </a>
              <a href="/company-history" className="flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-[#f0ece9] hover:text-[#bda191] transition-colors duration-200 text-base font-medium">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="#bda191" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t('company_history', '기업 연혁')}
              </a>
            </div>
          </div>
          <a href="/inquiry" className="nav-link">{t('inquiry', '기업 문의')}</a>
          <a href="/press" className="nav-link">{t('press', '언론보도')}</a>
          <a href="/blog" className="nav-link">{t('blog', '자사 블로그')}</a>
          {/* Language Dropdown */}
          <select
            className="ml-4 border border-[#e5e0db] rounded-lg px-3 py-2 bg-white/80 shadow-sm text-sm focus:ring-2 focus:ring-[#bda191] focus:border-[#bda191] transition"
            value={language}
            onChange={e => setLanguage(e.target.value as 'ko' | 'en')}
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </nav>
        
        {/* Mobile Hamburger */}
        <button 
          className="md:hidden block p-2 hover:bg-gray-100 rounded transition-colors"
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="px-4 py-2 space-y-2">
            <a href="/" className="block py-2 hover:bg-gray-100 rounded">{t('home', '홈')}</a>
            <div className="py-2">
              <div className="font-medium mb-2">{t('products', '제품소개')}</div>
              <div className="pl-4 space-y-1">
                <a href="/products/manbo-walker" className="block py-1 hover:bg-gray-100 rounded">{t('manbo_walker', '만보 보행기')}</a>
                <a href="/products/bodeum-diaper" className="block py-1 hover:bg-gray-100 rounded">{t('bodeum_diaper', '보듬 기저귀')}</a>
              </div>
            </div>
            <div className="py-2">
              <div className="font-medium mb-2">{t('about_us', 'ABOUT US')}</div>
              <div className="pl-4 space-y-1">
                <a href="/brand-story" className="block py-1 hover:bg-gray-100 rounded">{t('brand_story', '브랜드 스토리')}</a>
                <a href="/team" className="block py-1 hover:bg-gray-100 rounded">{t('team_introduction', '팀 소개')}</a>
                <a href="/company-history" className="block py-1 hover:bg-gray-100 rounded">{t('company_history', '기업 연혁')}</a>
              </div>
            </div>
            <a href="/inquiry" className="block py-2 hover:bg-gray-100 rounded">{t('inquiry', '기업 문의')}</a>
            <a href="/press" className="block py-2 hover:bg-gray-100 rounded">{t('press', '언론보도')}</a>
            <a href="/blog" className="block py-2 hover:bg-gray-100 rounded">{t('blog', '자사 블로그')}</a>
            
            {/* Mobile Language and Search */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <select
                className="flex-1 border rounded px-2 py-1 text-sm"
                value={language}
                onChange={e => setLanguage(e.target.value as 'ko' | 'en')}
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
            </div>
          </nav>
        </div>
      )}
      {/* 스타일 추가 (글로벌 또는 컴포넌트 내부) */}
      <style jsx global>{`
        .nav-link {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          font-size: 1rem;
          font-weight: 500;
          color: #222;
          background: none;
          border: none;
          border-radius: 0.75rem;
          transition: color 0.2s, background 0.2s, box-shadow 0.2s;
          position: relative;
          line-height: 1.5;
          text-align: center;
        }
        .nav-link:hover, .nav-link:focus {
          color: #bda191;
          background: #f0ece9;
          box-shadow: 0 2px 8px 0 rgba(189,161,145,0.08);
          text-decoration: none;
        }
      `}</style>
    </header>
  );
};

export default Header; 