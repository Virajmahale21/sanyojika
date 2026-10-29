import React from 'react';

interface AnumatiLogoProps {
  size?: number;
  className?: string;
}

export const AnumatiLogo: React.FC<AnumatiLogoProps> = ({ size = 38, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`anumatisetu-logo-svg flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Outer Emblem Shield Container */}
      <rect x="2" y="2" width="40" height="40" rx="9" fill="#061D45" stroke="#0B4F92" strokeWidth="1.5" />
      {/* Saffron National Crest Accent */}
      <path d="M6 7.5C6 5.567 7.567 4 9.5 4H34.5C36.433 4 38 5.567 38 7.5V9.5H6V7.5Z" fill="#F4A900" />
      {/* Setu (Bridge & Gateway) Suspension Arches */}
      <path d="M8 33C12.5 24 17.5 24 22 33C26.5 24 31.5 24 36 33" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      {/* Central Pillar of Governance */}
      <path d="M22 13V26" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      {/* Anumati (Permission & Verification) Seal */}
      <circle cx="22" cy="18" r="5" fill="#0B4F92" stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Statutory Approval Checkmark */}
      <path d="M19.8 18L21.3 19.5L24.2 16.5" stroke="#F4A900" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AnumatiBrand: React.FC<{
  light?: boolean;
  size?: number;
  titlePrimary?: string;
  titleAccent?: string;
  subtitle?: string;
  className?: string;
}> = ({
  light = false,
  size = 38,
  titlePrimary = 'Anumati',
  titleAccent = 'Setu',
  subtitle = 'National Permission, Approval & Compliance Portal',
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <AnumatiLogo size={size} />
      <div className="flex flex-col leading-tight">
        <div className={`font-bold tracking-tight text-lg md:text-xl ${light ? 'text-white' : 'text-gov-navy'}`}>
          <span>{titlePrimary}</span>
          <span className={light ? 'text-gov-saffron' : 'text-gov-blue'}> {titleAccent}</span>
        </div>
        <div className={`text-[10px] md:text-[11px] font-semibold uppercase tracking-wider ${light ? 'text-slate-300' : 'text-slate-500'}`}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};
