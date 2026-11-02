import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { AnumatiSetuLogo } from '../components/layout/AnumatiSetuLogo';
import { Building2, Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export const NewApplication: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [appType, setAppType] = useState('EOA');
  const [academicYear, setAcademicYear] = useState('2026-2027');

  const [courses, setCourses] = useState([
    {
      program: 'ENGINEERING_AND_TECHNOLOGY',
      courseName: 'Artificial Intelligence & Machine Learning',
      level: 'UG',
      durationYears: 4,
      existingIntake: 0,
      proposedIntake: 60,
      facultyCount: 4,
      nbaAccredited: false,
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addCourseRow = () => {
    setCourses((prev) => [
      ...prev,
      {
        program: 'ENGINEERING_AND_TECHNOLOGY',
        courseName: '',
        level: 'UG',
        durationYears: 4,
        existingIntake: 0,
        proposedIntake: 60,
        facultyCount: 4,
        nbaAccredited: false,
      },
    ]);
  };

  const removeCourseRow = (index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: string, value: any) => {
    setCourses((prev) => {
      const copy = [...prev];
      (copy[index] as any)[field] = value;
      return copy;
    });
  };

  const handleFinalSubmit = async (submitImmediately: boolean) => {
    setError('');
    setSubmitting(true);
    try {
      const res = await api.createApplication({
        applicationType: appType,
        academicYear,
        courses,
        submitImmediately,
      });

      if (res.success && res.data) {
        navigate(`/applications/${res.data.id}`);
      } else {
        setError(res.message || 'Failed to create application.');
      }
    } catch {
      setError('An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header Banner */}
      <div className="bg-white border border-gov-border rounded-lg p-3.5 shadow-gov-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <AnumatiSetuLogo width={165} className="h-9 md:h-11 w-auto object-contain flex-shrink-0" />
          <div className="border-l border-slate-200 pl-3.5 hidden sm:block">
            <h1 className="text-sm font-bold text-gov-navy">{t('newApplication.title')}</h1>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {t('newApplication.subtitle')}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-gov-blue bg-gov-blueLight border border-gov-border px-2.5 py-1 rounded-full uppercase tracking-wider">
          {t('newApplication.stepBadge') || 'STATUTORY FILING WIZARD'}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded">{error}</div>
      )}

      {/* Stepper Indicator */}
      <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
        <div
          className={`p-2.5 rounded border text-center ${
            step >= 1 ? 'bg-gov-blue text-white border-gov-blue' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          {t('newApplication.step1')}
        </div>
        <div
          className={`p-2.5 rounded border text-center ${
            step >= 2 ? 'bg-gov-blue text-white border-gov-blue' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          {t('newApplication.step2')}
        </div>
        <div
          className={`p-2.5 rounded border text-center ${
            step >= 3 ? 'bg-gov-blue text-white border-gov-blue' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          {t('newApplication.step3')}
        </div>
      </div>

      {/* STEP 1: Basic Details */}
      {step === 1 && (
        <Card title={t('newApplication.step1Title')}>
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="font-semibold text-slate-700">{t('newApplication.applicantInst')}</span>
              <p className="font-bold text-gov-navy text-sm mt-0.5">{user?.institution?.name || 'GCET Mumbai'}</p>
              <p className="text-[11px] text-slate-500 font-mono">PID: {user?.institution?.permanentId || '1-1090123456'}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('newApplication.appTypeLabel')}</label>
              <select
                value={appType}
                onChange={(e) => setAppType(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue"
              >
                <option value="EOA">{t('newApplication.appTypeEoa')}</option>
                <option value="NEW_CAMPUS">{t('newApplication.appTypeNewCampus')}</option>
                <option value="INTAKE_INCREASE">{t('newApplication.appTypeIntake')}</option>
                <option value="NEW_COURSE">{t('newApplication.appTypeNewCourse')}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('newApplication.academicYearLabel')}</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue"
              >
                <option value="2026-2027">{t('newApplication.ayCurrent')}</option>
                <option value="2027-2028">{t('newApplication.ayNext')}</option>
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gov-blue hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold flex items-center space-x-1"
              >
                <span>{t('newApplication.continueCourses')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 2: Courses & Intake */}
      {step === 2 && (
        <Card title={t('newApplication.step2Title')}>
          <div className="space-y-4 text-xs">
            {courses.map((course, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">{t('newApplication.courseEntry')} #{idx + 1}</span>
                  {courses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourseRow(idx)}
                      className="text-rose-600 hover:text-rose-800 flex items-center text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      {t('newApplication.remove')}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">{t('newApplication.disciplineLabel')}</label>
                    <select
                      value={course.program}
                      onChange={(e) => updateCourse(idx, 'program', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="ENGINEERING_AND_TECHNOLOGY">{t('newApplication.progEngg', 'Engineering & Technology')}</option>
                      <option value="MANAGEMENT">{t('newApplication.progManagement')}</option>
                      <option value="PHARMACY">{t('newApplication.progPharmacy')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">{t('newApplication.courseNameLabel')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('newApplication.courseNamePlaceholder')}
                      value={course.courseName}
                      onChange={(e) => updateCourse(idx, 'courseName', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white"
                    >
                    </input>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">{t('newApplication.levelLabel')}</label>
                    <select
                      value={course.level}
                      onChange={(e) => updateCourse(idx, 'level', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="UG">{t('newApplication.levelUg')}</option>
                      <option value="PG">{t('newApplication.levelPg')}</option>
                      <option value="DIPLOMA">{t('newApplication.levelDiploma')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">{t('newApplication.existingIntakeLabel')}</label>
                    <input
                      type="number"
                      value={course.existingIntake}
                      onChange={(e) => updateCourse(idx, 'existingIntake', Number(e.target.value))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">{t('newApplication.proposedIntakeLabel')}</label>
                    <input
                      type="number"
                      value={course.proposedIntake}
                      onChange={(e) => updateCourse(idx, 'proposedIntake', Number(e.target.value))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono font-bold text-gov-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">{t('newApplication.facultyCountLabel')}</label>
                    <input
                      type="number"
                      value={course.facultyCount}
                      onChange={(e) => updateCourse(idx, 'facultyCount', Number(e.target.value))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addCourseRow}
              className="flex items-center space-x-1 text-gov-blue hover:underline font-semibold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t('newApplication.addAnother')}</span>
            </button>

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3.5 py-1.5 border border-slate-300 rounded hover:bg-slate-50 flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('actions.back')}</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-gov-blue hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold flex items-center space-x-1"
              >
                <span>{t('newApplication.continueDeclaration')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 3: Declaration & Submit */}
      {step === 3 && (
        <Card title={t('newApplication.step3Title')}>
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <h4 className="font-bold text-gov-navy flex items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
                {t('newApplication.undertakingTitle')}
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {t('newApplication.undertakingText')}
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="decl" required defaultChecked className="rounded border-slate-300" />
              <label htmlFor="decl" className="font-semibold text-slate-800">
                {t('newApplication.affirmLabel')}
              </label>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-3.5 py-1.5 border border-slate-300 rounded hover:bg-slate-50 flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('actions.back')}</span>
              </button>

              <div className="space-x-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleFinalSubmit(false)}
                  className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-100 font-medium"
                >
                  {t('actions.saveDraft')}
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleFinalSubmit(true)}
                  className="bg-gov-blue hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow"
                >
                  {submitting ? 'Submitting Application...' : t('actions.submit')}
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
