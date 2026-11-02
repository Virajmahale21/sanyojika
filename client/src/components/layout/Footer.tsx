import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnumatiSetuLogo } from './AnumatiSetuLogo';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gov-navyDark text-slate-300 border-t-2 border-gov-saffron text-xs py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="bg-white/95 rounded px-2.5 py-1 shadow-sm">
            <AnumatiSetuLogo width={140} className="h-7 md:h-8 w-auto object-contain" />
          </div>
          <div className="sm:border-l sm:border-slate-700 sm:pl-4">
            <p className="font-semibold text-white">
              {t('landing.footerCopyright')}
            </p>
            <p className="text-[11px] text-amber-300/90 mt-0.5">
              {t('landing.footerSub')}
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 space-x-3">
          <a
            href="https://www.aicte-india.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            {t('landing.officialAicteLink')}
          </a>
          <span>•</span>
          <span className="text-gov-saffron font-medium">{t('landing.psBadge')}</span>
          <span>•</span>
          <span className="text-slate-400">Version 2.6.2</span>
        </div>
      </div>
    </footer>
  );
};
