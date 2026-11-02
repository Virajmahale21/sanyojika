import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { AnumatiSetuLogo } from '../components/layout/AnumatiSetuLogo';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck2,
  MapPin,
  Users,
  Award,
  ShieldAlert,
  Eye,
  EyeOff,
  Globe,
  Check,
  Sparkles,
  Info,
  ChevronLeft,
} from 'lucide-react';

interface DemoAccount {
  role: string;
  category: string;
  email: string;
  name: string;
  institution: string;
  features: string[];
  icon: React.ReactNode;
}

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const { user, login, quickSwitchRole } = useAuth();
  const { language, changeLanguage, setFontSize, toggleHighContrast, highContrast } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('principal@gcet.edu.in');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts: DemoAccount[] = [
    {
      role: 'INSTITUTION_ADMIN',
      category: t('login.roleCategoryAcademic'),
      email: 'principal@gcet.edu.in',
      name: 'Dr. Faruk Kazi',
      institution: 'GCET Mumbai (Affiliated Autonomous)',
      features: [
        language === 'hi' ? 'ईओए 2026-27 और नए पाठ्यक्रम आवेदन जमा करें' : language === 'mr' ? 'EoA २०२६-२७ आणि नवीन अभ्यासक्रम अर्ज सादर करा' : 'Submit EoA 2026-27 & New Course applications',
        language === 'hi' ? 'भूमि विलेख, अनापत्ति और भवन योजनाएं अपलोड करें' : language === 'mr' ? 'जमीन मालकी, NOC आणि इमारत नकाशे अपलोड करा' : 'Upload Land deeds, NOCs, & Infrastructure plans',
        language === 'hi' ? 'वास्तविक समय स्वचालित ओसीआर अनुपालन सत्यापन' : language === 'mr' ? 'प्रत्यक्ष वेळेतील स्वयंचलित OCR अनुपालन पडताळणी' : 'Real-time automated OCR compliance verification',
      ],
      icon: <Building2 className="w-5 h-5 text-gov-blue" />,
    },
    {
      role: 'BUREAU_OFFICER',
      category: t('login.roleCategoryScrutiny'),
      email: 'bureau.officer@aicte.gov.in',
      name: 'Dr. Amit V. Deshmukh',
      institution: 'AICTE HQ · Engineering & Tech Bureau',
      features: [
        language === 'hi' ? 'एल्गोरिथम ओसीआर दस्तावेज़ निष्कर्षण की समीक्षा करें' : language === 'mr' ? 'अल्गोरिथमिक OCR दस्तऐवज निष्कर्षाची तपासणी करा' : 'Review algorithmic OCR document extraction',
        language === 'hi' ? 'खंड-विशिष्ट गैर-अनुपालन और कमियों को चिह्नित करें' : language === 'mr' ? 'कलमनिहाय गैर-अनुपालन आणि त्रुटी नोंदवा' : 'Flag clause-specific non-compliance & deficiencies',
        language === 'hi' ? 'सत्यापित प्रस्ताव क्षेत्रीय डेस्क को अग्रेषित करें' : language === 'mr' ? 'पडताळलेले प्रस्ताव प्रादेशिक विभागाकडे पाठवा' : 'Route verified proposals to Regional Desks',
      ],
      icon: <FileCheck2 className="w-5 h-5 text-gov-blue" />,
    },
    {
      role: 'REGIONAL_OFFICER',
      category: t('login.roleCategoryRegional'),
      email: 'regional.wro@aicte.gov.in',
      name: 'Dr. Sunil K. Sonawane',
      institution: 'Western Regional Office (WRO Mumbai)',
      features: [
        language === 'hi' ? 'स्वचालित विशेषज्ञ निरीक्षण समिति (ईवीसी) निर्धारण' : language === 'mr' ? 'स्वयंचलित तज्ज्ञ भेट समिती (EVC) वेळापत्रक नियोजन' : 'Automated Expert Visit Committee (EVC) scheduling',
        language === 'hi' ? 'हित-संघर्ष पहचान और संस्थागत दूरी नियम' : language === 'mr' ? 'हितसंबंध तपासणी आणि संस्थात्मक अंतर नियम' : 'Conflict-of-interest detection & institutional distancing',
        language === 'hi' ? 'क्षेत्रीय एसएलए काउंटडाउन और वृद्धि की निगरानी' : language === 'mr' ? 'प्रादेशिक SLA कालावधी आणि एस्केलेशन देखरेख' : 'Monitor regional SLA countdown timers & escalations',
      ],
      icon: <MapPin className="w-5 h-5 text-gov-blue" />,
    },
    {
      role: 'EVC_MEMBER',
      category: t('login.roleCategoryEvc'),
      email: 'evc.expert@iitb.ac.in',
      name: 'Prof. Milind Atrey',
      institution: 'IIT Bombay · Committee Chairperson',
      features: [
        language === 'hi' ? 'वर्चुअल या भौतिक परिसर निरीक्षण निष्पादित करें' : language === 'mr' ? 'प्रत्यक्ष किंवा आभासी कॅम्पस तपासणी पूर्ण करा' : 'Execute virtual or physical campus inspection',
        language === 'hi' ? 'जियो-टैग की गई बुनियादी ढांचा तस्वीरें अपलोड करें' : language === 'mr' ? 'जिओ-टॅग केलेले पायाभूत सुविधांचे फोटो अपलोड करा' : 'Upload geo-tagged infrastructure photo evidence',
        language === 'hi' ? 'परिषद के लिए डिजिटल सिफारिश चेकलिस्ट जमा करें' : language === 'mr' ? 'परिषदेसाठी डिजिटल शिफारस चेकलिस्ट सादर करा' : 'Submit digital recommendation checklist for Council',
      ],
      icon: <Users className="w-5 h-5 text-gov-blue" />,
    },
    {
      role: 'CENTRAL_ADMIN',
      category: t('login.roleCategoryCentral'),
      email: 'centraladmin@aicte.gov.in',
      name: 'Prof. T. G. Sitharam',
      institution: 'Central Executive Council · New Delhi',
      features: [
        language === 'hi' ? 'लंबित ईओए आवेदनों पर अंतिम परिषद निर्णय' : language === 'mr' ? 'प्रलंबित EoA अर्जांवर अंतिम परिषद निर्णय' : 'Final council adjudication on pending EoA applications',
        language === 'hi' ? 'डिजिटल रूप से हस्ताक्षरित अनुमोदन पत्र (LoA) जारी करें' : language === 'mr' ? 'डिजिटल स्वाक्षरी केलेले मंजुरी पत्र (LoA) जारी करा' : 'Issue cryptographically signed Letters of Approval (LoA)',
        language === 'hi' ? 'राष्ट्रीय अनुपालन सूचकांक एवं वृद्धि डैशबोर्ड की निगरानी' : language === 'mr' ? 'राष्ट्रीय अनुपालन निर्देशांक व एस्केलेशन डॅशबोर्ड देखरेख' : 'Oversee national compliance index & escalation dashboard',
      ],
      icon: <Award className="w-5 h-5 text-gov-blue" />,
    },
    {
      role: 'SUPER_ADMIN',
      category: t('login.roleCategoryAdmin'),
      email: 'superadmin@aicte.gov.in',
      name: 'Shri Rajeshwar Rao',
      institution: 'Ministry / AICTE National IT Directorate',
      features: [
        language === 'hi' ? 'सिस्टम विन्यास और गतिशील एसएलए सीमा नियम' : language === 'mr' ? 'सिस्टीम संरचना आणि गतिमान SLA मर्यादा नियम' : 'System configuration & dynamic SLA threshold rules',
        language === 'hi' ? 'आधिकारिक आरबीएसी उपयोगकर्ता क्रेडेंशियल्स प्रबंधित करें' : language === 'mr' ? 'अधिकृत RBAC वापरकर्ता क्रेडेंशियल्स व्यवस्थापन' : 'Manage official RBAC user credentials & departments',
        language === 'hi' ? 'सिस्टम टेलीमेट्री और लाइव डेटाबेस अखंडता निगरानी' : language === 'mr' ? 'सिस्टीम टेलिमेट्री आणि थेट डेटाबेस आरोग्य देखरेख' : 'System telemetry & live database integrity monitor',
      ],
      icon: <ShieldCheck className="w-5 h-5 text-gov-blue" />,
    },
    {
      role: 'AUDITOR',
      category: t('login.roleCategoryAuditor'),
      email: 'auditor.vigilance@aicte.gov.in',
      name: 'Smt. Kavita Sharma',
      institution: 'Chief Vigilance Office · Central Oversight',
      features: [
        language === 'hi' ? 'क्रिप्टोग्राफिक अपरिवर्तनीय SHA-256 ऑडिट बहीखाता' : language === 'mr' ? 'क्रिप्टोग्राफिक अपरिवर्तनीय SHA-256 ऑडिट नोंदवही' : 'Cryptographic immutable SHA-256 audit ledger',
        language === 'hi' ? 'अनधिकृत स्थिति परिवर्तनों के लिए फोरेंसिक लॉग की जांच' : language === 'mr' ? 'अनाधिकृत टप्पा बदलांसाठी फॉरेन्सिक लॉग तपासणी' : 'Inspect forensic logs for unauthorized state transitions',
        language === 'hi' ? 'सत्यापित ऑडिट साक्ष्य पैकेज निर्यात करें' : language === 'mr' ? 'पडताळलेले ऑडिट पुरावे पॅकेज निर्यात करा' : 'Export verified audit evidence packages',
      ],
      icon: <ShieldAlert className="w-5 h-5 text-gov-blue" />,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      setError(
        language === 'hi'
          ? 'अमान्य आधिकारिक क्रेडेंशियल्स। कृपया अपने ईमेल और पासवर्ड की जांच करें।'
          : language === 'mr'
          ? 'अवैध अधिकृत क्रेडेंशियल्स. कृपया आपला ईमेल आणि पासवर्ड तपासा.'
          : 'Invalid official credentials. Please verify your email and password.'
      );
    }
  };

  const handleQuickDemoLaunch = async (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword('Password@123');
    setLoading(true);
    const success = await quickSwitchRole(acc.email);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleSelectRoleCredentials = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword('Password@123');
    setError('');
  };

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

      {/* 2. Brand Header with Back to Home Link */}
      <header className="bg-white border-b border-gov-border shadow-gov-xs sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-95 transition" title="AnumatiSetu">
            <AnumatiSetuLogo width={220} className="h-11 md:h-12 w-auto object-contain" />
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="text-xs font-semibold text-gov-blue hover:text-blue-800 bg-gov-blueLight border border-gov-border px-3 py-1.5 rounded flex items-center space-x-1.5 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{t('login.backToOverview')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Main Portal Authentication Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        {/* Section Heading with Multilingual Official Logo */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="flex justify-center mb-4">
            <AnumatiSetuLogo width={280} className="h-16 md:h-20 w-auto object-contain" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-gov-blue bg-gov-blueLight border border-gov-border px-3 py-1 rounded-full inline-block mb-2">
            {t('login.gatewayBadge')}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gov-navy tracking-tight">
            {t('login.gatewayHeading')}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-2">
            {t('login.gatewaySub')}
          </p>
        </div>

        {/* Active Session Card if user is already logged in */}
        {user && (
          <div className="max-w-2xl mx-auto mb-8 bg-white border-2 border-emerald-500 rounded-lg p-5 shadow-gov-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{t('login.activeSession')}</span>
              </div>
              <h2 className="text-base font-bold text-gov-navy">{user.fullName}</h2>
              <p className="text-xs text-slate-600">
                {t('roles.' + user.role) || user.role} ({user.email})
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded text-xs flex items-center space-x-1.5 shadow-sm transition whitespace-nowrap"
            >
              <span>{t('login.openWorkspace')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4. Role Selection Grid (All 7 Roles) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gov-navy uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gov-saffron" />
                <span>{t('login.directoryTitle')}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {t('login.directorySub')}
              </p>
            </div>
            <div className="hidden sm:block text-[11px] text-slate-500 bg-white border border-gov-border px-2.5 py-1 rounded">
              {t('login.defaultPasswordNotice')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoAccounts.map((acc) => {
              const isSelected = email === acc.email;
              return (
                <div
                  key={acc.email}
                  className={`bg-white rounded-lg border transition-all duration-200 p-5 flex flex-col justify-between shadow-gov-xs hover:shadow-gov-md ${
                    isSelected
                      ? 'border-gov-blue ring-2 ring-gov-blue/20 bg-blue-50/20'
                      : 'border-gov-border hover:border-gov-blue/60'
                  }`}
                >
                  <div>
                    {/* Header: Icon & Category */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-md bg-gov-blueLight border border-gov-border flex items-center justify-center">
                        {acc.icon}
                      </div>
                      <span className="text-[10px] font-bold tracking-wider text-gov-blue bg-gov-blueLight border border-gov-border px-2.5 py-0.5 rounded">
                        {acc.category}
                      </span>
                    </div>

                    {/* Role Title & Persona */}
                    <h3 className="text-sm font-bold text-gov-navy leading-snug">
                      {t(`roles.${acc.role}`) || acc.role.replace(/_/g, ' ')}
                    </h3>
                    <div className="text-xs font-semibold text-slate-800 mt-1">
                      {acc.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mb-3">
                      {acc.institution}
                    </div>

                    {/* Features list */}
                    <div className="border-t border-slate-100 pt-2.5 space-y-1.5 mb-4">
                      {acc.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start text-[11px] text-slate-600 space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Credential Box */}
                  <div>
                    <div className="bg-slate-50 border border-slate-200 rounded p-2 mb-3 text-[10px] font-mono text-slate-600 space-y-0.5">
                      <div className="truncate">
                        <span className="text-slate-400">{t('login.emailLabel')}:</span> <strong className="text-gov-navy">{acc.email}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">{t('login.passwordLabel')}:</span> <strong className="text-gov-navy">Password@123</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLaunch(acc)}
                        disabled={loading}
                        className="w-full bg-gov-blue hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded text-xs flex items-center justify-center space-x-1 transition shadow-xs"
                        title={t('login.launchBtn')}
                      >
                        <span>{t('login.launchBtn')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectRoleCredentials(acc)}
                        className={`w-full font-semibold py-2 px-2 rounded text-xs border transition ${
                          isSelected
                            ? 'bg-gov-saffron text-gov-navy border-gov-saffron font-bold'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                        title={t('login.useInForm')}
                      >
                        {isSelected ? t('login.selected') : t('login.useInForm')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Official Credentials Form Card */}
        <div className="max-w-xl mx-auto bg-white rounded-lg border border-gov-border shadow-gov-sm overflow-hidden mb-12">
          <div className="bg-gov-navy px-6 py-4 text-white flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                {t('login.formTitle')}
              </h2>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {t('login.formSub')}
              </p>
            </div>
            <Lock className="w-5 h-5 text-gov-saffron" />
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded flex items-start space-x-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gov-navy mb-1">
                  {t('login.emailLabel')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gov-border rounded text-xs focus:ring-1 focus:ring-gov-blue focus:border-gov-blue outline-none transition"
                    placeholder="officer@aicte.gov.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-navy mb-1">
                  {t('login.passwordLabel')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 border border-gov-border rounded text-xs focus:ring-1 focus:ring-gov-blue focus:border-gov-blue outline-none transition"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    title={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gov-blue hover:bg-blue-700 text-white font-semibold py-2.5 rounded text-xs flex items-center justify-center space-x-2 transition shadow-sm"
                >
                  <span>{loading ? t('login.authenticating') : t('login.signInBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 text-center">
              {t('login.databaseNotice')}
            </div>
          </div>
        </div>
      </main>

      {/* 6. Government Footer */}
      <footer className="bg-white border-t border-gov-border py-6 px-4 md:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="font-semibold text-gov-navy">
              {t('landing.footerCopyright')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {t('landing.footerSub')}
            </div>
          </div>

          <div className="text-[11px] space-y-0.5 text-slate-500">
            <div><strong className="text-slate-700">{t('login.nodalDesk')}</strong></div>
            <div><strong className="text-slate-700">{t('login.aicteSupport')}</strong></div>
          </div>
        </div>
      </footer>
    </div>
  );
};
