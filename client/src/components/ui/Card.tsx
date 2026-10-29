import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, action }) => {
  return (
    <div className={`bg-white rounded border border-slate-200 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-gov-navy">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
