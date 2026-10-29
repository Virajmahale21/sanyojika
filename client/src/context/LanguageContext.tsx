import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';

interface LanguageContextType {
  language: 'en' | 'hi' | 'mr';
  changeLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<'en' | 'hi' | 'mr'>((i18n.language as any) || 'en');
  const [fontSize, setFontSizeState] = useState<'sm' | 'md' | 'lg'>('md');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem('i18nextLng') as 'en' | 'hi' | 'mr') || 'en';
    if (['en', 'hi', 'mr'].includes(savedLang)) {
      setLanguageState(savedLang);
      i18n.changeLanguage(savedLang);
      document.documentElement.lang = savedLang;
    }
  }, [i18n]);

  const changeLanguage = (lang: 'en' | 'hi' | 'mr') => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    localStorage.setItem('i18nextLng', lang);
    api.updateLanguage(lang).catch(() => {});
  };

  const setFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontSizeState(size);
    const root = document.documentElement;
    if (size === 'sm') root.style.fontSize = '14px';
    else if (size === 'md') root.style.fontSize = '16px';
    else if (size === 'lg') root.style.fontSize = '18px';
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      if (next) document.body.classList.add('high-contrast');
      else document.body.classList.remove('high-contrast');
      return next;
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        fontSize,
        setFontSize,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
