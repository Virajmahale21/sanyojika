import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { AnumatiSetuLogo } from '../components/layout/AnumatiSetuLogo';
import {
  ShieldCheck,
  FileSearch,
  Scale,
  Clock,
  Sparkles,
  CheckCircle2,
  Building2,
  Users,
  FileCheck2,
  MapPin,
  Lock,
  Globe,
  Eye,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language, changeLanguage, setFontSize, toggleHighContrast, highContrast } = useLanguage();
  const navigate = useNavigate();

  const novelties = [
    {
      id: 'ocr',
      icon: <FileSearch className="w-6 h-6 text-gov-blue" />,
      tag: t('landing.noveltyItems.ocrTag'),
      title: t('landing.noveltyItems.ocrTitle'),
      desc: t('landing.noveltyItems.ocrDesc'),
      metric: t('landing.noveltyItems.ocrMetric'),
    },
    {
      id: 'evc',
      icon: <Scale className="w-6 h-6 text-gov-blue" />,
      tag: t('landing.noveltyItems.evcTag'),
      title: t('landing.noveltyItems.evcTitle'),
      desc: t('landing.noveltyItems.evcDesc'),
      metric: t('landing.noveltyItems.evcMetric'),
    },
    {
      id: 'sla',
      icon: <Clock className="w-6 h-6 text-gov-blue" />,
      tag: t('landing.noveltyItems.slaTag'),
      title: t('landing.noveltyItems.slaTitle'),
      desc: t('landing.noveltyItems.slaDesc'),
      metric: t('landing.noveltyItems.slaMetric'),
    },
    {
      id: 'ai',
      icon: <Sparkles className="w-6 h-6 text-gov-blue" />,
      tag: t('landing.noveltyItems.aiTag'),
      title: t('landing.noveltyItems.aiTitle'),
      desc: t('landing.noveltyItems.aiDesc'),
      metric: t('landing.noveltyItems.aiMetric'),
    },
    {
      id: 'compliance',
      icon: <CheckCircle2 className="w-6 h-6 text-gov-blue" />,
      tag: t('landing.noveltyItems.compTag'),
      title: t('landing.noveltyItems.compTitle'),
      desc: t('landing.noveltyItems.compDesc'),
      metric: t('landing.noveltyItems.compMetric'),
    },
    {
      id: 'audit',
      icon: <ShieldCheck className="w-6 h-6 text-gov-blue" />,
      tag: t('landing.noveltyItems.auditTag'),
      title: t('landing.noveltyItems.auditTitle'),
      desc: t('landing.noveltyItems.auditDesc'),
      metric: t('landing.noveltyItems.auditMetric'),
    },
  ];

  const stakeholders = [
    {
      role: 'INSTITUTION_ADMIN',
      title: t('roles.INSTITUTION_ADMIN'),
      persona: 'Dr. Faruk Kazi · GCET Mumbai',
      summary: t('landing.stakeholderSummaries.inst'),
    },
    {
      role: 'BUREAU_OFFICER',
      title: t('roles.BUREAU_OFFICER'),
      persona: 'Dr. Amit V. Deshmukh · AICTE HQ',
      summary: t('landing.stakeholderSummaries.bureau'),
    },
    {
      role: 'REGIONAL_OFFICER',
      title: t('roles.REGIONAL_OFFICER'),
      persona: 'Dr. Sunil K. Sonawane · WRO Mumbai',
      summary: t('landing.stakeholderSummaries.ro'),
    },
    {
      role: 'EVC_MEMBER',
      title: t('roles.EVC_MEMBER'),
      persona: 'Prof. Milind Atrey · IIT Bombay',
      summary: t('landing.stakeholderSummaries.evc'),
    },
    {
      role: 'CENTRAL_ADMIN',
      title: t('roles.CENTRAL_ADMIN'),
      persona: 'Prof. T. G. Sitharam · Member Secretary',
      summary: t('landing.stakeholderSummaries.council'),
    },
    {
      role: 'SUPER_ADMIN',
      title: t('roles.SUPER_ADMIN'),
      persona: 'Shri Rajeshwar Rao · Super Admin',
      summary: t('landing.stakeholderSummaries.admin'),
    },
    {
      role: 'AUDITOR',
      title: t('roles.AUDITOR'),
      persona: 'Smt. Kavita Sharma · Vigilance Officer',
      summary: t('landing.stakeholderSummaries.auditor'),
    },
  ];

  const approvalStages = [
    { step: '01', title: t('landing.stages.s1Title'), desc: t('landing.stages.s1Desc') },
    { step: '02', title: t('landing.stages.s2Title'), desc: t('landing.stages.s2Desc') },
    { step: '03', title: t('landing.stages.s3Title'), desc: t('landing.stages.s3Desc') },
    { step: '04', title: t('landing.stages.s4Title'), desc: t('landing.stages.s4Desc') },
    { step: '05', title: t('landing.stages.s5Title'), desc: t('landing.stages.s5Desc') },
    { step: '06', title: t('landing.stages.s6Title'), desc: t('landing.stages.s6Desc') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gov-surface text-slate-800">
      {/* 1. Top Accessibility & National Ribbon */}
      <div className="bg-gov-navyNav text-slate-200 border-t-[3px] border-gov-saffron px-4 md:px-8 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-gov-saffron shadow-[0_0_8px_rgba(244,169,0,0.8)] inline-block animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">{t('landing.portalTag')}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">{t('landing.governanceBadge')}</span>
            <span className="text-slate-400">·</span>
            <span className="text-gov-saffron font-bold">{t('landing.psBadge')}</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            {/* Font Size Accessibility Controls */}
            <div className="flex items-center space-x-1 border-r border-slate-700 pr-3">
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
              className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] ${
                highContrast ? 'bg-gov-saffron text-gov-navy font-bold' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">{t('accessibility.highContrast')}</span>
            </button>

            {/* Trilingual Language Selector */}
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-700">
              <Globe className="w-3.5 h-3.5 text-gov-saffron mr-0.5" />
              <button
                onClick={() => changeLanguage('en')}
                className={`px-1.5 py-0.5 rounded font-medium transition text-[10px] ${
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
                className={`px-1.5 py-0.5 rounded font-medium transition text-[10px] ${
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
                className={`px-1.5 py-0.5 rounded font-medium transition text-[10px] ${
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

      {/* 2. Brand Header with Sign In CTAs */}
      <header className="bg-white border-b border-gov-border shadow-gov-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-95 transition" title="AnumatiSetu">
            <AnumatiSetuLogo width={220} className="h-11 md:h-12 w-auto object-contain" />
          </Link>

          <div className="flex items-center space-x-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gov-blue hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded text-xs flex items-center space-x-1.5 shadow-sm transition"
              >
                <span>{t('landing.openWorkspace')} ({t(`roles.${user.role}`) || user.role})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gov-blue hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded text-xs flex items-center space-x-1.5 shadow-sm transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t('landing.officialSignIn')}</span>
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex bg-gov-saffron hover:bg-amber-500 text-gov-navy font-bold px-3 py-2 rounded text-xs items-center space-x-1 shadow-xs transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gov-navy" />
                  <span>{t('landing.oneClickDemo')}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Statutory Mandate) */}
      <section className="bg-gradient-to-b from-white via-blue-50/20 to-gov-surface border-b border-gov-border py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <AnumatiSetuLogo width={280} className="h-16 md:h-20 w-auto object-contain" />
          </div>
          <div className="inline-flex items-center space-x-2 bg-gov-blueLight border border-gov-border px-3.5 py-1 rounded-full text-xs font-bold text-gov-blue mb-4">
            <span className="w-2 h-2 rounded-full bg-gov-blue animate-ping"></span>
            <span>{t('landing.heroBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gov-navy tracking-tight leading-tight">
            {t('landing.heroTitle')}
          </h1>

          <p className="mt-4 text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('landing.heroDesc')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-gov-blue hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-gov-sm transition"
            >
              <span>{t('landing.accessPortalBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#novelties"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-gov-navy font-semibold py-3 px-6 rounded-md text-xs sm:text-sm border border-gov-border shadow-xs transition"
            >
              {t('landing.exploreNoveltiesBtn')}
            </a>
          </div>

          {/* Live Metrics Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov-xs">
              <div className="text-xl md:text-2xl font-black text-gov-navy">{t('landing.statInstitutions')}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{t('landing.statInstitutionsLabel')}</div>
              <div className="text-[10px] text-slate-500">{t('landing.statInstitutionsSub')}</div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov-xs">
              <div className="text-xl md:text-2xl font-black text-gov-blue">{t('landing.statOffices')}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{t('landing.statOfficesLabel')}</div>
              <div className="text-[10px] text-slate-500">{t('landing.statOfficesSub')}</div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov-xs">
              <div className="text-xl md:text-2xl font-black text-emerald-700">{t('landing.statWorkflow')}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{t('landing.statWorkflowLabel')}</div>
              <div className="text-[10px] text-slate-500">{t('landing.statWorkflowSub')}</div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov-xs">
              <div className="text-xl md:text-2xl font-black text-amber-700">{t('landing.statDatabase')}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{t('landing.statDatabaseLabel')}</div>
              <div className="text-[10px] text-slate-500">{t('landing.statDatabaseSub')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Novelties Section (Regulatory Innovations) */}
      <section id="novelties" className="py-14 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gov-blue bg-gov-blueLight border border-gov-border px-3 py-1 rounded-full inline-block mb-2">
            {t('landing.noveltiesBadge')}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gov-navy tracking-tight">
            {t('landing.noveltiesHeading')}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mt-2">
            {t('landing.noveltiesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novelties.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gov-border p-6 shadow-gov-xs hover:shadow-gov-md hover:border-gov-blue/60 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gov-blueLight border border-gov-border flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gov-blue bg-gov-blueLight px-2 py-0.5 rounded border border-gov-border">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gov-navy leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-gov-blue">{item.metric}</span>
                <span className="text-slate-400 text-[10px]">{t('landing.verifiedInTestSuite')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 6-Stage Approval State Machine Lifecycle */}
      <section className="bg-white border-y border-gov-border py-14 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gov-blue bg-gov-blueLight border border-gov-border px-3 py-1 rounded-full inline-block mb-2">
              {t('landing.statutoryBadge')}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gov-navy tracking-tight">
              {t('landing.statutoryHeading')}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-2">
              {t('landing.statutorySub')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {approvalStages.map((st) => (
              <div
                key={st.step}
                className="bg-gov-surface rounded-lg border border-gov-border p-4 text-center hover:bg-blue-50/40 transition"
              >
                <div className="w-7 h-7 mx-auto rounded-full bg-gov-navy text-white text-xs font-bold flex items-center justify-center mb-2">
                  {st.step}
                </div>
                <div className="font-bold text-xs text-gov-navy mb-1">{st.title}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 7-Role Stakeholder Matrix */}
      <section className="py-14 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gov-blue bg-gov-blueLight border border-gov-border px-3 py-1 rounded-full inline-block mb-2">
            {t('landing.rolesBadge')}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gov-navy tracking-tight">
            {t('landing.rolesHeading')}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mt-2">
            {t('landing.rolesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stakeholders.map((s) => (
            <div
              key={s.role}
              className="bg-white rounded-lg border border-gov-border p-4 shadow-gov-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-mono font-bold text-gov-blue bg-gov-blueLight border border-gov-border px-2 py-0.5 rounded">
                  {s.role}
                </span>
                <h4 className="font-bold text-xs text-gov-navy mt-2">{s.title}</h4>
                <div className="text-[11px] text-slate-700 font-semibold mt-0.5">{s.persona}</div>
                <p className="text-[11px] text-slate-500 mt-2 leading-tight">{s.summary}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <button
                  onClick={() => navigate('/login')}
                  className="text-[11px] font-semibold text-gov-blue hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>{t('landing.testCredentials')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* 8th Card: Launch Gateway CTA */}
          <div className="bg-gradient-to-br from-gov-navy to-[#071735] text-white rounded-lg p-5 flex flex-col justify-between shadow-gov-sm">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-gov-saffron uppercase">
                {t('landing.evaluatorReady')}
              </span>
              <h4 className="font-bold text-sm text-white mt-2">{t('landing.testAsRole')}</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {t('landing.testAsRoleDesc')}
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full bg-gov-saffron hover:bg-amber-500 text-gov-navy font-bold py-2 rounded text-xs transition flex items-center justify-center space-x-1"
            >
              <span>{t('landing.openLoginGateway')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Government Footer */}
      <footer className="bg-gov-navyDark text-slate-300 border-t-2 border-gov-saffron text-xs py-6 px-4 md:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="bg-white/95 rounded px-2.5 py-1 shadow-sm">
              <AnumatiSetuLogo width={140} className="h-7 md:h-8 w-auto object-contain" />
            </div>
            <div className="sm:border-l sm:border-slate-700 sm:pl-4">
              <div className="font-semibold text-white">
                {t('landing.footerCopyright')}
              </div>
              <div className="text-[11px] text-amber-300/90 mt-0.5">
                {t('landing.footerSub')}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 space-x-3">
            <button onClick={() => navigate('/login')} className="hover:text-white transition underline">
              {t('landing.officialSignIn')}
            </button>
            <span>•</span>
            <a href="https://www.aicte-india.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              {t('landing.officialAicteLink')}
            </a>
            <span>•</span>
            <span className="text-gov-saffron font-medium">{t('landing.psBadge')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
