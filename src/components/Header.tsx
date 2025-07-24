import React, { useState } from 'react';

/**
 * Header (공통 헤더)
 * - 언어 선택에 따라 로고 이미지 변경 (ko: ko_logo, en: en_logo)
 * - 디폴트는 ko_logo
 * - 반응형 모바일 네비게이션 포함
 */
const Header: React.FC = () => {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logoSrc = lang === 'en' ? '/logo/en_logo.svg' : '/logo/ko_logo.svg';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src={logoSrc} alt="SONAVERSE Logo" className="h-8 w-auto" />
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <a href="/" className="hover:text-blue-600 transition-colors">홈</a>
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              제품소개 ▼
            </button>
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded shadow-lg min-w-[160px]">
              <a href="/products/manbo-walker" className="block px-4 py-2 hover:bg-gray-100">만보 보행기</a>
              <a href="/products/bodeum-diaper" className="block px-4 py-2 hover:bg-gray-100">보듬 기저귀</a>
            </div>
          </div>
          <a href="/inquiry" className="hover:text-blue-600 transition-colors">기업/대량 문의</a>
          <a href="/press" className="hover:text-blue-600 transition-colors">언론보도</a>
          <a href="/blog" className="hover:text-blue-600 transition-colors">자사 블로그</a>
          <a href="/brand-story" className="hover:text-blue-600 transition-colors">브랜드 스토리</a>
          
          {/* Language Dropdown */}
          <select
            className="ml-4 border rounded px-2 py-1 text-sm"
            value={lang}
            onChange={e => setLang(e.target.value as 'ko' | 'en')}
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
          
          {/* Search Icon */}
          <button className="ml-2 p-2 hover:bg-gray-100 rounded transition-colors">
            🔍
          </button>
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
            <a href="/" className="block py-2 hover:bg-gray-100 rounded">홈</a>
            <div className="py-2">
              <div className="font-medium mb-2">제품소개</div>
              <div className="pl-4 space-y-1">
                <a href="/products/manbo-walker" className="block py-1 hover:bg-gray-100 rounded">만보 보행기</a>
                <a href="/products/bodeum-diaper" className="block py-1 hover:bg-gray-100 rounded">보듬 기저귀</a>
              </div>
            </div>
            <a href="/inquiry" className="block py-2 hover:bg-gray-100 rounded">기업/대량 문의</a>
            <a href="/press" className="block py-2 hover:bg-gray-100 rounded">언론보도</a>
            <a href="/blog" className="block py-2 hover:bg-gray-100 rounded">자사 블로그</a>
            <a href="/brand-story" className="block py-2 hover:bg-gray-100 rounded">브랜드 스토리</a>
            
            {/* Mobile Language and Search */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <select
                className="flex-1 border rounded px-2 py-1 text-sm"
                value={lang}
                onChange={e => setLang(e.target.value as 'ko' | 'en')}
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                🔍
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 