import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const logoAssets: Record<string, string> = {
  en: '/assets/anumatisetu-english.png',
  hi: '/assets/anumatisetu-hindi-marathi.png',
  mr: '/assets/anumatisetu-hindi-marathi.png',
};

export interface AnumatiSetuLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  style?: React.CSSProperties;
}

export const AnumatiSetuLogo: React.FC<AnumatiSetuLogoProps> = ({
  className = '',
  width = 220,
  height = 'auto',
  alt = 'AnumatiSetu',
  style = {},
}) => {
  const { language } = useLanguage();

  const logo = logoAssets[language] || logoAssets.en;

  return (
    <img
      src={logo}
      alt={alt}
      width={typeof width === 'number' ? width : undefined}
      className={`anumatisetu-logo-img ${className}`}
      style={{
        width: typeof width === 'number' ? '100%' : width,
        maxWidth: width,
        height: height,
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = logoAssets.en;
      }}
    />
  );
};

export default AnumatiSetuLogo;
