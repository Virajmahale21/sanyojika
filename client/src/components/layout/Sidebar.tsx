import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { AnumatiSetuLogo } from './AnumatiSetuLogo';
import {
  LayoutDashboard,
  FileText,
  Building2,
  FolderLock,
  ClipboardCheck,
  ShieldAlert,
  CheckSquare,
  BarChart3,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sliders,
  Check,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed: controlledCollapsed,
  onToggleCollapse,
}) => {
  const { t } = useTranslation();
  const { user, logout, quickSwitchRole } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [quickRoleModalOpen, setQuickRoleModalOpen] = useState(false);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard className="w-4 h-4 flex-shrink-0" /> },
    { to: '/applications', label: t('nav.applications'), icon: <FileText className="w-4 h-4 flex-shrink-0" /> },
    { to: '/institutions', label: t('nav.institutions'), icon: <Building2 className="w-4 h-4 flex-shrink-0" /> },
    { to: '/documents', label: t('nav.documents'), icon: <FolderLock className="w-4 h-4 flex-shrink-0" /> },
    { to: '/inspections', label: t('nav.inspections'), icon: <ClipboardCheck className="w-4 h-4 flex-shrink-0" /> },
    { to: '/compliance', label: t('nav.compliance'), icon: <ShieldAlert className="w-4 h-4 flex-shrink-0" /> },
    { to: '/tasks', label: t('nav.tasks'), icon: <CheckSquare className="w-4 h-4 flex-shrink-0" /> },
    { to: '/reports', label: t('nav.reports'), icon: <BarChart3 className="w-4 h-4 flex-shrink-0" /> },
  ];

  const hasAuditAccess = ['SUPER_ADMIN', 'CENTRAL_ADMIN', 'AUDITOR'].includes(user?.role || '');
  const hasAdminAccess = ['SUPER_ADMIN', 'CENTRAL_ADMIN'].includes(user?.role || '');

  const getPortalTag = (role?: string) => {
    switch (role) {
      case 'INSTITUTION_ADMIN': return 'INSTITUTION WORKBENCH';
      case 'BUREAU_OFFICER': return 'SCRUTINY OFFICER WORKBENCH';
      case 'REGIONAL_OFFICER': return 'REGIONAL DIRECTOR CONSOLE';
      case 'EVC_MEMBER': return 'EVC COMMITTEE CONSOLE';
      case 'CENTRAL_ADMIN': return 'CENTRAL COUNCIL CONSOLE';
      case 'SUPER_ADMIN': return 'SUPER ADMIN CONSOLE';
      case 'AUDITOR': return 'VIGILANCE AUDITOR CONSOLE';
      default: return 'GOVERNANCE PORTAL';
    }
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

  const demoAccounts = [
    { role: 'INSTITUTION_ADMIN', name: 'Dr. Faruk Kazi (GCET)', email: 'principal@gcet.edu.in', label: t('roles.INSTITUTION_ADMIN') },
    { role: 'BUREAU_OFFICER', name: 'Dr. Amit V. Deshmukh', email: 'bureau.officer@aicte.gov.in', label: t('roles.BUREAU_OFFICER') },
    { role: 'REGIONAL_OFFICER', name: 'Dr. Sunil K. Sonawane', email: 'regional.wro@aicte.gov.in', label: t('roles.REGIONAL_OFFICER') },
    { role: 'EVC_MEMBER', name: 'Prof. Milind Atrey', email: 'evc.expert@iitb.ac.in', label: t('roles.EVC_MEMBER') },
    { role: 'CENTRAL_ADMIN', name: 'Prof. T. G. Sitharam', email: 'centraladmin@aicte.gov.in', label: t('roles.CENTRAL_ADMIN') },
    { role: 'SUPER_ADMIN', name: 'Shri Rajeshwar Rao', email: 'superadmin@aicte.gov.in', label: t('roles.SUPER_ADMIN') },
    { role: 'AUDITOR', name: 'Smt. Kavita Sharma', email: 'auditor.vigilance@aicte.gov.in', label: t('roles.AUDITOR') },
  ];

  return (
    <aside
      className={`bg-gov-sidebar border-r border-gov-sidebarBorder text-slate-100 flex flex-col justify-between transition-all duration-200 select-none ${
        isCollapsed ? 'w-[78px]' : 'w-[260px]'
      }`}
    >
      <div>
        {/* 1. AnumatiSetu Dark Brand Box */}
        <div className="bg-gov-navyDark border-b border-gov-sidebarBorder p-3 relative">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
            <NavLink to="/dashboard" className="block max-w-[190px] hover:opacity-95 transition" title="AnumatiSetu">
              {isCollapsed ? (
                <AnumatiSetuLogo width={46} className="h-10 w-auto object-contain mx-auto" />
              ) : (
                <AnumatiSetuLogo width={180} className="h-12 w-auto object-contain" />
              )}
            </NavLink>
          </div>

          {!isCollapsed && user && (
            <div className="mt-2.5">
              <span className="text-[9px] font-bold tracking-wider text-blue-200 bg-[#122b51] border border-gov-sidebarBorder px-2 py-0.5 rounded inline-block truncate max-w-full">
                {getPortalTag(user.role)}
              </span>
            </div>
          )}

          {/* Sidebar Collapse Toggle Button */}
          <button
            type="button"
            onClick={toggleCollapse}
            className={`w-7 h-7 rounded bg-[#122b51] hover:bg-gov-sidebarHover border border-gov-sidebarBorder text-slate-200 flex items-center justify-center transition shadow-xs ${
              isCollapsed ? 'mt-3 mx-auto' : 'absolute top-3.5 right-2.5'
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* 2. Main Workspace Navigation */}
        <div className="py-3 px-2">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t('navExtra.mainWorkspace')}
            </div>
          )}

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-md text-xs font-medium transition ${
                    isCollapsed
                      ? 'justify-center py-2.5 px-2'
                      : 'px-3 py-2 space-x-3'
                  } ${
                    isActive
                      ? 'bg-gov-sidebarActive text-white font-semibold shadow-xs'
                      : 'text-slate-200 hover:bg-gov-sidebarHover hover:text-white'
                  }`
                }
              >
                {item.icon}
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}

            {hasAuditAccess && (
              <NavLink
                to="/audit-logs"
                title={isCollapsed ? t('nav.auditLogs') : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-md text-xs font-medium transition ${
                    isCollapsed
                      ? 'justify-center py-2.5 px-2'
                      : 'px-3 py-2 space-x-3'
                  } ${
                    isActive
                      ? 'bg-gov-sidebarActive text-white font-semibold shadow-xs'
                      : 'text-slate-200 hover:bg-gov-sidebarHover hover:text-white'
                  }`
                }
              >
                <History className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{t('nav.auditLogs')}</span>}
              </NavLink>
            )}

            {hasAdminAccess && (
              <NavLink
                to="/admin"
                title={isCollapsed ? t('nav.admin') : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-md text-xs font-medium transition ${
                    isCollapsed
                      ? 'justify-center py-2.5 px-2'
                      : 'px-3 py-2 space-x-3'
                  } ${
                    isActive
                      ? 'bg-gov-sidebarActive text-white font-semibold shadow-xs'
                      : 'text-slate-200 hover:bg-gov-sidebarHover hover:text-white'
                  }`
                }
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{t('nav.admin')}</span>}
              </NavLink>
            )}
          </nav>
        </div>
      </div>

      {/* 3. AnumatiSetu Dark Sidebar Footer */}
      <div className="bg-[#091a3a] border-t border-gov-sidebarBorder p-3">
        {/* User profile card */}
        {user && (
          <div
            className={`bg-[#10294d] border border-gov-sidebarBorder rounded-md p-2 mb-2 flex items-center ${
              isCollapsed ? 'justify-center' : 'space-x-2.5'
            }`}
            title={`${user.fullName} (${user.role})`}
          >
            <div className="w-8 h-8 rounded-full bg-gov-blue text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-xs">
              {getInitials(user.fullName)}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 leading-tight">
                <strong className="text-xs text-white truncate">{user.fullName}</strong>
                <span className="text-[10px] text-slate-300 truncate mt-0.5">
                  {user.institution?.name || user.department?.name || 'AICTE Officer'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Demo Role Switcher quick button */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setQuickRoleModalOpen(!quickRoleModalOpen)}
            className={`w-full bg-[#10294d] hover:bg-gov-sidebarHover border border-gov-sidebarBorder text-slate-200 rounded text-xs font-semibold py-1.5 transition flex items-center ${
              isCollapsed ? 'justify-center' : 'px-2.5 space-x-2'
            }`}
            title={t('navExtra.switchDemoRole')}
          >
            <Sliders className="w-3.5 h-3.5 text-gov-saffron flex-shrink-0" />
            {!isCollapsed && <span className="text-[11px] truncate">{t('navExtra.switchDemoRole')}</span>}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            className={`w-full border border-gov-sidebarBorder text-slate-300 hover:text-rose-200 hover:bg-[#3b2034] hover:border-rose-900 rounded text-xs font-medium py-1.5 transition flex items-center ${
              isCollapsed ? 'justify-center' : 'px-2.5 space-x-2'
            }`}
            title={t('actions.logout')}
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            {!isCollapsed && <span className="text-[11px] truncate">{t('actions.logout')}</span>}
          </button>
        </div>

        {/* Quick Role Switcher Modal / Dropdown */}
        {quickRoleModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white text-slate-800 rounded-lg shadow-gov-md border border-gov-border max-w-sm w-full p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-gov-saffron" />
                  <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                    {t('navExtra.instantRoleSwitch')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickRoleModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {demoAccounts.map((acc) => {
                  const isActive = user?.email === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={async () => {
                        setQuickRoleModalOpen(false);
                        await quickSwitchRole(acc.email);
                      }}
                      className={`w-full text-left p-2 rounded border text-xs transition flex items-center justify-between ${
                        isActive
                          ? 'bg-blue-50 border-gov-blue font-bold text-gov-navy'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-gov-navy">{acc.label}</div>
                        <div className="text-[10px] text-slate-500">{acc.name}</div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-gov-blue flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
