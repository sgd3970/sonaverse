import React from 'react';

/**
 * Footer (공통 푸터)
 * - 네비게이션, 회사/고객센터 정보, SNS 링크, 개인정보처리방침 등
 * - symbol_logo 이미지를 항상 동일하게 노출
 */
const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-gray-50 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:justify-between gap-8">
        {/* Logo & Navigation */}
        <div>
          <a href="/" className="flex items-center gap-2">
            <img src="/logo/symbol_logo.svg" alt="SONAVERSE Symbol Logo" className="h-8 w-auto" />
          </a>
          <nav className="mt-4 flex flex-col gap-2 md:flex-row md:gap-6">
            <a href="/">홈</a>
            <a href="/products/manbo-walker">만보 보행기</a>
            <a href="/products/bodeum-diaper">보듬 기저귀</a>
            <a href="/inquiry">기업/대량 문의</a>
            <a href="/press">언론보도</a>
            <a href="/blog">자사 블로그</a>
            <a href="/brand-story">브랜드 스토리</a>
          </nav>
        </div>
        {/* Company & CS Info */}
        <div className="text-sm">
          <div>상호명: 테스트 기업</div>
          <div>대표자: 김대표</div>
          <div>사업장 주소: 강원도 춘천시 어쩌고 빌딩</div>
          <div>대표 전화: 033-123-4567</div>
          <div>사업자등록번호: 123-45-67890</div>
          <div>통신판매업 신고 번호: 2025-강원춘천-0001</div>
          <div>개인정보보호책임자: 박개인</div>
          <div className="mt-2">고객센터: 033-789-0123 / cs@example.com</div>
          <div>CS 운영 시간: 평일 09:00 ~ 18:00 (주말 및 공휴일 휴무)</div>
        </div>
        {/* SNS & Policy */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <a href="https://blog.naver.com/ourcompany" target="_blank" rel="noopener noreferrer">네이버블로그</a>
            <a href="https://www.youtube.com/ourcompany" target="_blank" rel="noopener noreferrer">유튜브</a>
            <a href="https://www.instagram.com/ourcompany" target="_blank" rel="noopener noreferrer">인스타그램</a>
            <a href="https://pf.kakao.com/_ourcompany" target="_blank" rel="noopener noreferrer">카카오톡</a>
          </div>
          <a href="/privacy-policy" className="underline">개인정보처리방침</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 