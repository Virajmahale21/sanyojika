import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Inspection, Application } from '../types';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  ClipboardCheck,
  Calendar,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  FileCheck,
} from 'lucide-react';

export const InspectionsList: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  // Scheduling Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [inspectionType, setInspectionType] = useState('PHYSICAL');
  const [scheduledDate, setScheduledDate] = useState('');
  const [expertUsers, setExpertUsers] = useState<any[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState('');
  const [conflictWarning, setConflictWarning] = useState('');

  // Report Submission Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [recommendation, setRecommendation] = useState<'RECOMMENDED' | 'NOT_RECOMMENDED' | 'CONDITIONAL'>('RECOMMENDED');
  const [summaryReport, setSummaryReport] = useState('');
  const [checklistValues, setChecklistValues] = useState<Record<string, { compliant: boolean; score: number }>>({});

  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const res = await api.getInspections();
      if (res.success) {
        setInspections(res.data);
      }
    } catch (err) {
      console.error('Failed to load inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [user]);

  const openScheduleModal = async () => {
    try {
      const [appRes, userRes] = await Promise.all([
        api.getApplications({ status: 'UNDER_SCRUTINY' }),
        api.getUsers(),
      ]);
      if (appRes.success) setApplications(appRes.data);
      if (userRes.success) {
        const evcExperts = userRes.data.filter((u: any) => u.role === 'EVC_MEMBER' || u.role === 'BUREAU_OFFICER');
        setExpertUsers(evcExperts);
        if (evcExperts.length > 0) setSelectedExpertId(evcExperts[0].id);
      }
      setScheduleModalOpen(true);
    } catch {
      alert('Failed to load scheduling data.');
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !scheduledDate) return;
    setSubmitting(true);
    setConflictWarning('');

    try {
      const res = await api.scheduleInspection({
        applicationId: selectedAppId,
        inspectionType,
        scheduledDate,
        committeeUserIds: selectedExpertId ? [selectedExpertId] : [],
      });

      if (res.success) {
        setScheduleModalOpen(false);
        setFeedback(`Inspection ${res.data.inspectionNumber} scheduled successfully.`);
        if (res.conflictWarnings && res.conflictWarnings.length > 0) {
          setFeedback(res.conflictWarnings.join(' '));
        }
        fetchInspections();
      } else {
        setConflictWarning(res.message);
      }
    } catch {
      setConflictWarning('Error executing scheduling.');
    } finally {
      setSubmitting(false);
    }
  };

  const openReportModal = (insp: Inspection) => {
    setSelectedInspection(insp);
    setRecommendation((insp.recommendation as any) || 'RECOMMENDED');
    setSummaryReport(insp.summaryReport || '');
    const initialChecklist: Record<string, { compliant: boolean; score: number }> = {};
    insp.checklists?.forEach((c) => {
      initialChecklist[c.id] = { compliant: c.isCompliant, score: c.score };
    });
    setChecklistValues(initialChecklist);
    setReportModalOpen(true);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInspection) return;
    setSubmitting(true);

    try {
      const formattedChecklists = Object.entries(checklistValues).map(([id, val]) => ({
        id,
        isCompliant: val.compliant,
        score: val.score,
      }));

      const res = await api.submitInspectionReport(selectedInspection.id, {
        recommendation,
        summaryReport,
        checklists: formattedChecklists,
      });

      if (res.success) {
        setReportModalOpen(false);
        setFeedback('EVC committee observations and recommendation registered.');
        fetchInspections();
      }
    } catch {
      alert('Failed to submit inspection report.');
    } finally {
      setSubmitting(false);
    }
  };

  const canSchedule = ['REGIONAL_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');
  const canSubmitReport = ['EVC_MEMBER', 'REGIONAL_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(
    user?.role || ''
  );

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gov-navy">{t('inspections.title')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('inspections.subtitle')}
          </p>
        </div>

        {canSchedule && (
          <button
            onClick={openScheduleModal}
            className="flex items-center space-x-1.5 bg-gov-blue hover:bg-blue-700 text-white px-3.5 py-2 rounded text-xs font-semibold shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('inspections.scheduleBtn')}</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback('')} className="font-bold hover:underline">
            {t('actions.dismiss')}
          </button>
        </div>
      )}

      {/* Inspections Grid */}
      {loading ? (
        <div className="py-12 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
          <span>{t('inspections.loading')}</span>
        </div>
      ) : inspections.length === 0 ? (
        <Card>
          <div className="text-center py-10 text-xs text-slate-500">{t('inspections.empty')}</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inspections.map((insp) => (
            <Card key={insp.id} className="border-t-4 border-t-purple-600">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gov-navy text-sm">{insp.inspectionNumber}</span>
                  <StatusBadge status={insp.status} />
                </div>

                <div className="border-y border-slate-100 py-2 space-y-1">
                  <div className="font-bold text-slate-800 text-sm">{insp.institution.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {t('applications.title')}: <strong className="font-mono">{insp.application.applicationNumber}</strong> (
                    {insp.application.applicationType})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {t('institutions.tableLocation')}: {insp.institution.city}, {insp.institution.state}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold">{t('inspections.inspType')}:</span>
                    <p className="font-bold text-purple-800">{insp.inspectionType}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">{t('inspections.scheduledDate')}:</span>
                    <p className="font-bold text-slate-800">{new Date(insp.scheduledDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold">{t('inspections.committeeExperts')}</span>
                  <div className="mt-1 space-y-1">
                    {insp.committeeMembers.map((m) => (
                      <div key={m.id} className="bg-slate-50 p-1.5 rounded border border-slate-200 text-[11px]">
                        <strong>{m.roleInCommittee}:</strong> {m.user.fullName} ({m.user.designation || 'Expert'})
                      </div>
                    ))}
                  </div>
                </div>

                {insp.recommendation && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 font-medium">
                    {t('inspections.recommendation')} <strong>{insp.recommendation}</strong>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  {canSubmitReport && (
                    <button
                      onClick={() => openReportModal(insp)}
                      className="bg-gov-blue hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{insp.status === 'COMPLETED' ? t('inspections.viewReportBtn') : t('inspections.submitReportBtn')}</span>
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Inspection Modal */}
      <Modal isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} title={t('inspections.scheduleModalTitle')}>
        <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
          {conflictWarning && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded font-semibold text-xs flex items-center">
              <AlertTriangle className="w-4 h-4 text-rose-600 mr-2 flex-shrink-0" />
              <span>{conflictWarning}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('inspections.scheduleModalApp')}</label>
            <select
              required
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded"
            >
              <option value="">{t('inspections.scheduleModalAppPlaceholder')}</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.applicationNumber} - {app.institution.name} ({app.applicationType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('inspections.scheduleModalType')}</label>
              <select
                value={inspectionType}
                onChange={(e) => setInspectionType(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded"
              >
                <option value="PHYSICAL">{t('inspections.scheduleModalTypePhysical')}</option>
                <option value="VIRTUAL">{t('inspections.scheduleModalTypeVirtual')}</option>
                <option value="SURPRISE">{t('inspections.scheduleModalTypeSurprise')}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('inspections.scheduleModalDate')}</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('inspections.scheduleModalExpert')}</label>
            <select
              value={selectedExpertId}
              onChange={(e) => setSelectedExpertId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded"
            >
              {expertUsers.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.fullName} ({exp.designation || exp.role})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 mt-1">
              {t('inspections.scheduleModalHelper')}
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-gov-blue text-white rounded font-semibold hover:bg-blue-700"
            >
              {submitting ? 'Checking Conflict & Scheduling...' : t('inspections.scheduleModalSubmit')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Report Submission Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title={t('inspections.reportModalTitle')}
        maxWidth="2xl"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <div className="font-bold text-gov-navy text-sm">{selectedInspection?.institution?.name}</div>
            <div className="text-[11px] text-slate-500 font-mono">
              {selectedInspection?.inspectionNumber} • {selectedInspection?.inspectionType}
            </div>
          </div>

          {/* Statutory Checklist */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2">{t('inspections.reportModalChecklist')}</h4>
            <div className="space-y-2">
              {selectedInspection?.checklists?.map((item) => (
                <div key={item.id} className="p-2.5 bg-white border border-slate-200 rounded flex items-center justify-between">
                  <span className="text-slate-700 max-w-[70%]">{item.itemName}</span>
                  <div className="flex items-center space-x-2">
                    <select
                      value={checklistValues[item.id]?.compliant ? 'true' : 'false'}
                      onChange={(e) =>
                        setChecklistValues((prev) => ({
                          ...prev,
                          [item.id]: {
                            ...prev[item.id],
                            compliant: e.target.value === 'true',
                            score: e.target.value === 'true' ? 10 : 0,
                          },
                        }))
                      }
                      className="p-1 border border-slate-300 rounded text-xs font-semibold"
                    >
                      <option value="true">{t('inspections.reportModalCompliant')}</option>
                      <option value="false">{t('inspections.reportModalDeficient')}</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('inspections.reportModalRecLabel')}</label>
            <select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded font-bold text-gov-navy"
            >
              <option value="RECOMMENDED">{t('inspections.reportModalRecApproved')}</option>
              <option value="CONDITIONAL">{t('inspections.reportModalRecConditional')}</option>
              <option value="NOT_RECOMMENDED">{t('inspections.reportModalRecRejected')}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('inspections.reportModalSummary')}</label>
            <textarea
              required
              rows={3}
              value={summaryReport}
              onChange={(e) => setSummaryReport(e.target.value)}
              placeholder={t('inspections.reportModalSummaryPlaceholder')}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-gov-blue text-white rounded font-semibold hover:bg-blue-700"
            >
              {submitting ? 'Submitting...' : t('inspections.reportModalSubmit')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
