import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gov-navyDark text-slate-300 border-t-2 border-gov-saffron text-xs py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div>
          <p className="font-semibold text-white">
            {t('landing.footerCopyright')}
          </p>
          <p className="text-[11px] text-amber-300/90 mt-0.5">
            {t('landing.footerSub')}
          </p>
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
