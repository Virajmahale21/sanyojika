import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { AnumatiSetuLogo } from './AnumatiSetuLogo';
import {
  Bell,
  Globe,
  LogOut,
  ChevronDown,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Menu,
  Shield,
  User as UserIcon,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  onToggleAi: () => void;
  onToggleNotifications: () => void;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleAi,
  onToggleNotifications,
  onToggleSidebar,
  sidebarCollapsed = false,
}) => {
  const { t } = useTranslation();
  const { user, logout, quickSwitchRole } = useAuth();
  const { language, changeLanguage, setFontSize, toggleHighContrast, highContrast } = useLanguage();
  const { unreadCount } = useNotifications();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const demoAccounts = [
    { role: 'INSTITUTION_ADMIN', name: 'Dr. Faruk Kazi (GCET)', email: 'principal@gcet.edu.in', label: t('roles.INSTITUTION_ADMIN') },
    { role: 'BUREAU_OFFICER', name: 'Dr. Amit V. Deshmukh', email: 'bureau.officer@aicte.gov.in', label: t('roles.BUREAU_OFFICER') },
    { role: 'REGIONAL_OFFICER', name: 'Dr. Sunil K. Sonawane', email: 'regional.wro@aicte.gov.in', label: t('roles.REGIONAL_OFFICER') },
    { role: 'EVC_MEMBER', name: 'Prof. Milind Atrey (IITB)', email: 'evc.expert@iitb.ac.in', label: t('roles.EVC_MEMBER') },
    { role: 'CENTRAL_ADMIN', name: 'Prof. T. G. Sitharam', email: 'centraladmin@aicte.gov.in', label: t('roles.CENTRAL_ADMIN') },
    { role: 'SUPER_ADMIN', name: 'Shri Rajeshwar Rao', email: 'superadmin@aicte.gov.in', label: t('roles.SUPER_ADMIN') },
    { role: 'AUDITOR', name: 'Smt. Kavita Sharma', email: 'auditor.vigilance@aicte.gov.in', label: t('roles.AUDITOR') },
  ];

  const getRoleDisplayName = (role?: string) => {
    if (!role) return 'Official';
    return t(`roles.${role}`) || role;
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AI';
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 shadow-gov-xs">
      {/* 1. AnumatiSetu Top Accessibility & National Ribbon */}
      <div className="bg-gov-navyNav text-slate-200 border-t-[3px] border-gov-saffron px-4 md:px-8 py-1 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron inline-block shadow-[0_0_6px_#f4a90099]"></span>
            <span className="font-semibold text-white tracking-wide">{t('landing.portalTag')}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 hidden sm:inline">{t('ministry')}</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-gov-saffron font-bold">{t('landing.psBadge')}</span>
          </div>

          <div className="flex items-center space-x-2.5 text-[11px]">
            {/* Font Size Accessibility Controls */}
            <div className="flex items-center space-x-1 border-r border-slate-700 pr-2.5">
              <span className="text-slate-400 mr-1 text-[10px]">{t('navExtra.fontLabel')}</span>
              <button
                onClick={() => setFontSize('sm')}
                title={t('navExtra.decreaseFont')}
                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-[10px]"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                title={t('navExtra.standardFont')}
                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-[10px] font-bold"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                title={t('navExtra.increaseFont')}
                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-[10px] font-bold"
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] transition ${
                highContrast ? 'bg-gov-saffron text-gov-navy font-bold' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">{t('accessibility.highContrast')}</span>
            </button>

            {/* Trilingual Language Selector */}
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-700">
              <Globe className="w-3.5 h-3.5 text-gov-saffron mr-0.5 flex-shrink-0" />
              <button
                onClick={() => changeLanguage('en')}
                aria-pressed={language === 'en'}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                  language === 'en'
                    ? 'bg-gov-saffron text-gov-navy font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="text-slate-500 text-[10px]">|</span>
              <button
                onClick={() => changeLanguage('hi')}
                aria-pressed={language === 'hi'}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                  language === 'hi'
                    ? 'bg-gov-saffron text-gov-navy font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <span className="text-slate-500 text-[10px]">|</span>
              <button
                onClick={() => changeLanguage('mr')}
                aria-pressed={language === 'mr'}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                  language === 'mr'
                    ? 'bg-gov-saffron text-gov-navy font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Gov Portal Header Bar */}
      <div className="bg-white border-b border-gov-border px-4 md:px-6 py-2.5 flex items-center justify-between">
        {/* Left Side: Mobile Toggle, Multilingual Logo & Portal Subtitle */}
        <div className="flex items-center space-x-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-1.5 rounded border border-gov-border text-gov-navy hover:bg-slate-100 transition"
              title={sidebarCollapsed ? t('navExtra.standardFont') : t('navExtra.toggleSidebar')}
              aria-label={t('navExtra.toggleSidebar')}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center hover:opacity-90 transition mr-1" title="AnumatiSetu Portal">
            <AnumatiSetuLogo width={165} className="h-8 md:h-10 w-auto object-contain" />
          </Link>

          <div className="hidden lg:flex items-center space-x-2 text-xs border-l border-slate-200 pl-3">
            <Link to="/dashboard" className="font-bold text-gov-navy hover:text-gov-blue tracking-tight">
              {t('navExtra.portalHeading')}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-gov-blue font-semibold">{getRoleDisplayName(user?.role)}</span>
            <Link
              to="/"
              className="text-[11px] text-slate-500 hover:text-gov-blue hidden xl:inline-flex items-center space-x-1 pl-2 border-l border-slate-200"
              title={t('navExtra.publicOverview')}
            >
              <span>{t('navExtra.publicOverview')}</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Demo Mode Pill, Role Switcher, AICTE Saarthi, Notifications & Profile */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Demo Mode Pill */}
          <span
            className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full hidden md:inline-block shadow-xs"
            title={t('demoDisclaimer')}
          >
            {t('navExtra.demoMode')}
          </span>

          {/* Quick Demo Role Switcher for Hackathon Judges */}
          <div className="relative" ref={roleMenuRef}>
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-1.5 bg-gov-saffron hover:bg-amber-500 text-gov-navy px-2.5 py-1.5 rounded text-xs font-bold shadow-gov-xs transition"
              title={t('actions.switchRole')}
            >
              <Sliders className="w-3.5 h-3.5 text-gov-navy" />
              <span className="hidden md:inline">{t('actions.switchRole')}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-gov-navy" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-md shadow-gov-md border border-gov-border py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>{t('navExtra.switchRoleInstantly')}</span>
                  <span className="text-gov-blue font-semibold">7 Roles</span>
                </div>
                {demoAccounts.map((acc) => {
                  const isActive = user?.email === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={async () => {
                        setRoleMenuOpen(false);
                        await quickSwitchRole(acc.email);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-start justify-between transition ${
                        isActive ? 'bg-blue-50/80 font-bold border-l-4 border-gov-blue' : ''
                      }`}
                    >
                      <div>
                        <div className="text-gov-navy font-semibold">{acc.label}</div>
                        <div className="text-[11px] text-slate-500">{acc.name}</div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-gov-blue mt-1 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* AICTE Saarthi Assistant Trigger */}
          <button
            type="button"
            onClick={onToggleAi}
            className="flex items-center space-x-1.5 bg-gov-blue hover:bg-blue-700 text-white px-2.5 py-1.5 rounded text-xs font-semibold shadow-gov-xs transition"
            title="Open AICTE Saarthi Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-gov-saffron animate-pulse" />
            <span className="hidden sm:inline">{t('aiAssistant.title')}</span>
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={onToggleNotifications}
            className="relative p-1.5 rounded border border-gov-border hover:bg-slate-100 text-slate-700 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gov-red text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile dropdown */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 pl-1.5 pr-2 py-1 rounded border border-gov-border hover:bg-slate-50 transition"
              >
                <div className="w-7 h-7 rounded-full bg-gov-blue text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {getInitials(user.fullName)}
                </div>
                <div className="hidden lg:flex flex-col text-left leading-none max-w-[140px]">
                  <strong className="text-xs text-gov-navy truncate">{user.fullName}</strong>
                  <small className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</small>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-md shadow-gov-md border border-gov-border py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-gov-navy">{user.fullName}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                    <div className="text-[10px] font-bold text-gov-blue uppercase mt-1 bg-gov-blueLight px-2 py-0.5 rounded inline-block">
                      {user.role}
                    </div>
                  </div>

                  <div className="py-1">
                    <div className="px-4 py-1.5 text-[11px] text-slate-500">
                      <div>{t('navExtra.activeOrg')}</div>
                      <div className="font-semibold text-slate-700 mt-0.5">
                        {user.institution?.name || user.department?.name || 'AICTE Central Headquarters'}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('actions.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
