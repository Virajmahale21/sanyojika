import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-xs text-slate-500 py-2.5 px-6 border-b border-gov-border bg-white">
      <Link to="/dashboard" className="hover:text-gov-blue text-gov-blue font-medium flex items-center">
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>{t('landing.portalTag')}</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        let displayLabel = value;
        if (value === 'dashboard') displayLabel = t('nav.dashboard');
        else if (value === 'applications') displayLabel = t('nav.applications');
        else if (value === 'institutions') displayLabel = t('nav.institutions');
        else if (value === 'documents') displayLabel = t('nav.documents');
        else if (value === 'inspections') displayLabel = t('nav.inspections');
        else if (value === 'compliance') displayLabel = t('nav.compliance');
        else if (value === 'tasks') displayLabel = t('nav.tasks');
        else if (value === 'reports') displayLabel = t('nav.reports');
        else if (value === 'audit-logs') displayLabel = t('nav.auditLogs');
        else if (value === 'admin') displayLabel = t('nav.admin');
        else if (value === 'new') displayLabel = 'New Application';

        return (
          <div key={to} className="flex items-center">
            <ChevronRight className="w-3 h-3 mx-1.5 text-slate-400" />
            {isLast ? (
              <span className="text-slate-800 font-semibold truncate max-w-[200px]">{displayLabel}</span>
            ) : (
              <Link to={to} className="hover:text-gov-blue truncate max-w-[150px]">
                {displayLabel}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
