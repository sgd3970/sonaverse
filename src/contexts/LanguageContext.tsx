'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import '../app/i18n';

interface LanguageContextType {
  language: 'ko' | 'en';
  setLanguage: (lang: 'ko' | 'en') => void;
  t: ReturnType<typeof useTranslation>['t'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<'ko' | 'en'>('ko');
  const { t, i18n } = useTranslation('common');

  const setLanguage = (lang: 'ko' | 'en') => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    // 로컬 스토리지에 언어 설정 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  useEffect(() => {
    // 로컬 스토리지에서 언어 설정 불러오기
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as 'ko' | 'en';
      if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 