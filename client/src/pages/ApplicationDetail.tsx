import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Application, DocumentItem } from '../types';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { AnumatiSetuLogo } from '../components/layout/AnumatiSetuLogo';
import {
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Upload,
  UserCheck,
  RefreshCw,
  FileSearch,
} from 'lucide-react';

export const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'documents' | 'inspections' | 'actions' | 'audit'>(
    'overview'
  );

  // Modals for Officer Actions
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [targetStage, setTargetStage] = useState('STAGE_SCRUTINY');
  const [advanceRemarks, setAdvanceRemarks] = useState('');

  const [deficiencyModalOpen, setDeficiencyModalOpen] = useState(false);
  const [deficiencyRemarks, setDeficiencyRemarks] = useState('');
  const [deadlineDays, setDeadlineDays] = useState(7);

  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [decisionRemarks, setDecisionRemarks] = useState('');

  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [ocrDocNumber, setOcrDocNumber] = useState('');
  const [ocrIssueDate, setOcrIssueDate] = useState('');
  const [ocrExpiryDate, setOcrExpiryDate] = useState('');
  const [ocrAuthority, setOcrAuthority] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchApplication = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.getApplicationById(id);
      if (res.success && res.data) {
        setApplication(res.data);
      }
    } catch (err) {
      console.error('Failed to load application:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleAdvanceStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setActionLoading(true);
    const res = await api.advanceStage(id, targetStage, advanceRemarks);
    setActionLoading(false);
    if (res.success) {
      setAdvanceModalOpen(false);
      setFeedbackMsg(`Application stage advanced successfully to ${targetStage}.`);
      fetchApplication();
    }
  };

  const handleDeficiencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setActionLoading(true);
    const res = await api.raiseDeficiency(id, deficiencyRemarks, deadlineDays);
    setActionLoading(false);
    if (res.success) {
      setDeficiencyModalOpen(false);
      setFeedbackMsg('Deficiency notice issued and task dispatched to institution.');
      fetchApplication();
    }
  };

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setActionLoading(true);
    const res = await api.recordDecision(id, decisionType, decisionRemarks);
    setActionLoading(false);
    if (res.success) {
      setDecisionModalOpen(false);
      setFeedbackMsg(`Final Council Decision ${decisionType} recorded.`);
      fetchApplication();
    }
  };

  const handleConfirmOcr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    setActionLoading(true);
    const res = await api.confirmOcr(selectedDoc.id, {
      docNumber: ocrDocNumber,
      issueDate: ocrIssueDate,
      expiryDate: ocrExpiryDate,
      issuingAuthority: ocrAuthority,
    });
    setActionLoading(false);
    if (res.success) {
      setOcrModalOpen(false);
      setFeedbackMsg('OCR extracted metadata confirmed and verified.');
      fetchApplication();
    }
  };

  const openOcrReview = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setOcrDocNumber(doc.ocrData?.extractedDocNumber || '');
    setOcrIssueDate(doc.ocrData?.extractedIssueDate ? doc.ocrData.extractedIssueDate.split('T')[0] : '');
    setOcrExpiryDate(doc.ocrData?.extractedExpiryDate ? doc.ocrData.extractedExpiryDate.split('T')[0] : '');
    setOcrAuthority(doc.ocrData?.extractedAuthority || '');
    setOcrModalOpen(true);
  };

  if (loading || !application) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
        <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
        <span>{t('applications.loading')}</span>
      </div>
    );
  }

  const isOfficer = ['BUREAU_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');
  const isCouncilAdmin = ['CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

  let parsedRiskReasons: string[] = [];
  try {
    if (application.delayRiskReasons) {
      parsedRiskReasons = JSON.parse(application.delayRiskReasons);
    }
  } catch {}

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg('')} className="text-emerald-700 font-bold hover:underline">
            {t('actions.dismiss')}
          </button>
        </div>
      )}

      {/* Application Master Header Card */}
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-start space-x-3.5">
            <AnumatiSetuLogo width={140} className="hidden lg:block shrink-0 pt-1" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gov-blue bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {application.applicationType}
                </span>
                <span className="text-xs text-slate-500">• AY {application.academicYear}</span>
              </div>
              <h1 className="text-xl font-bold text-gov-navy mt-1 font-mono">{application.applicationNumber}</h1>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span className="font-semibold">{application.institution.name}</span>
                <span className="mx-1.5">•</span>
                <span>PID: {application.institution.permanentId}</span>
                <span className="mx-1.5">•</span>
                <span>Region: {application.institution.region?.name || 'Western Region'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">{t('applications.tableStatus')}:</span>
              <StatusBadge status={application.status} />
            </div>
            <div className="text-xs text-slate-500">
              {t('applications.tableStage')}:{' '}
              <strong className="text-slate-800">{application.currentStageCode.replace('STAGE_', '')}</strong>
            </div>
          </div>
        </div>

        {/* Action Bar for Scrutiny Officers */}
        {isOfficer && application.status !== 'APPROVED' && application.status !== 'REJECTED' && (
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setTargetStage('STAGE_SCRUTINY');
                setAdvanceModalOpen(true);
              }}
              className="bg-gov-blue hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 shadow-sm transition"
            >
              <span>{t('actions.advanceStage')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setDeficiencyModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 shadow-sm transition"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t('actions.raiseDeficiency')}</span>
            </button>

            {isCouncilAdmin && (
              <button
                onClick={() => setDecisionModalOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 shadow-sm transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('actions.recordDecision')}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex space-x-4 text-xs font-medium bg-white px-4 rounded-t border-t border-x">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-2 border-b-2 font-semibold transition ${
            activeTab === 'overview'
              ? 'border-gov-blue text-gov-blue'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('applicationDetail.tabOverview')}
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`py-3 px-2 border-b-2 font-semibold transition ${
            activeTab === 'courses'
              ? 'border-gov-blue text-gov-blue'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('applicationDetail.tabCourses')} ({application.courses?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`py-3 px-2 border-b-2 font-semibold transition ${
            activeTab === 'documents'
              ? 'border-gov-blue text-gov-blue'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('applicationDetail.tabDocuments')} ({application.documents?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('inspections')}
          className={`py-3 px-2 border-b-2 font-semibold transition ${
            activeTab === 'inspections'
              ? 'border-gov-blue text-gov-blue'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('applicationDetail.tabInspections')} ({application.inspections?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-2 border-b-2 font-semibold transition ${
            activeTab === 'audit'
              ? 'border-gov-blue text-gov-blue'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('applicationDetail.tabAudit')}
        </button>
      </div>

      {/* Tab 1: Overview & AI Risk Card */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" title={t('applicationDetail.instProfileTitle')}>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold">{t('applicationDetail.instName')}:</span>
                <p className="font-bold text-slate-800">{application.institution.name}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">{t('applicationDetail.permanentId')}:</span>
                <p className="font-mono font-bold text-gov-navy">{application.institution.permanentId}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">{t('applicationDetail.category')}:</span>
                <p className="font-medium text-slate-700">{application.institution.category}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">{t('applicationDetail.university')}:</span>
                <p className="font-medium text-slate-700">{application.institution.affiliatingUniv}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">{t('applicationDetail.subDate')}:</span>
                <p className="text-slate-800">
                  {application.submissionDate ? new Date(application.submissionDate).toLocaleDateString() : t('status.DRAFT')}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">{t('applicationDetail.targetDueDate')}:</span>
                <p className="font-bold text-rose-700">
                  {application.targetDueDate ? new Date(application.targetDueDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">{t('applicationDetail.assignedOfficer')}:</span>
                <p className="text-slate-800">{application.assignedOfficer?.fullName || 'Engineering Bureau Pool'}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">{t('applicationDetail.accreditations')}:</span>
                <p className="text-slate-800">
                  NAAC: {application.institution.naacAccreditation || 'NA'} • NBA Accredited:{' '}
                  {application.institution.nbaAccredited ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <span className="text-slate-500 font-semibold text-xs">{t('applicationDetail.scrutinyRemarks')}:</span>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded mt-1 border border-slate-200">
                {application.overallRemarks || t('applicationDetail.noRemarks')}
              </p>
            </div>
          </Card>

          {/* AI Delay Risk Indicator Card */}
          <Card title={t('applicationDetail.aiRiskTitle')} subtitle={t('applicationDetail.aiRiskSub')}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gov-navy">{application.delayRiskScore}/100</div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      application.delayRiskLevel === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : application.delayRiskLevel === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {t('applicationDetail.riskLevel')}: {application.delayRiskLevel}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-gov-blue">
                  AICTE
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <p className="font-semibold mb-1">{t('applicationDetail.explainableFactors')}</p>
                <ul className="space-y-1.5 list-disc list-inside text-[11px] text-slate-700">
                  {parsedRiskReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 leading-relaxed">
                {t('applicationDetail.regulatoryClause')}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Courses & Intake */}
      {activeTab === 'courses' && (
        <Card title={t('applicationDetail.coursesTitle')}>
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-semibold">{t('applicationDetail.tableProgramme')}</th>
                  <th className="p-3 font-semibold">{t('applicationDetail.tableCourseName')}</th>
                  <th className="p-3 font-semibold">{t('applicationDetail.tableLevel')}</th>
                  <th className="p-3 font-semibold">{t('applicationDetail.tableExistingIntake')}</th>
                  <th className="p-3 font-semibold">{t('applicationDetail.tableProposedIntake')}</th>
                  <th className="p-3 font-semibold">{t('applicationDetail.tableApprovedIntake')}</th>
                  <th className="p-3 font-semibold">{t('applicationDetail.tableFacultyCount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {application.courses?.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-600">{course.program.replace('_', ' ')}</td>
                    <td className="p-3 font-bold text-slate-800">{course.courseName}</td>
                    <td className="p-3">{course.level}</td>
                    <td className="p-3 font-mono">{course.existingIntake}</td>
                    <td className="p-3 font-mono font-bold text-gov-blue">{course.proposedIntake}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">{course.approvedIntake ?? t('status.PENDING')}</td>
                    <td className="p-3 font-mono">{course.facultyCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Documents & OCR Extraction */}
      {activeTab === 'documents' && (
        <Card title={t('applicationDetail.docsTitle')}>
          <div className="space-y-4">
            <div className="overflow-x-auto -mx-5 -my-5">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                    <th className="p-3 font-semibold">{t('applicationDetail.docTableTitle')}</th>
                    <th className="p-3 font-semibold">{t('applicationDetail.docTableStatus')}</th>
                    <th className="p-3 font-semibold">{t('applicationDetail.docTableOcrNo')}</th>
                    <th className="p-3 font-semibold">{t('applicationDetail.docTableValidity')}</th>
                    <th className="p-3 font-semibold">{t('applicationDetail.docTableConfidence')}</th>
                    <th className="p-3 font-semibold text-right">{t('applicationDetail.docTableActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {application.documents?.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{doc.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {doc.category} • {doc.fileName}
                        </div>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        {doc.ocrData?.extractedDocNumber || 'Not Extracted'}
                      </td>
                      <td className="p-3 text-slate-600">
                        {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : t('applicationDetail.perpetual')}
                      </td>
                      <td className="p-3">
                        {doc.ocrData ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {Math.round(doc.ocrData.confidenceScore * 100)}% {t('applicationDetail.match')}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {isOfficer && (
                          <button
                            onClick={() => openOcrReview(doc)}
                            className="bg-gov-blue hover:bg-blue-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                          >
                            {t('applicationDetail.reviewOcrBtn')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Inspections */}
      {activeTab === 'inspections' && (
        <Card title={t('applicationDetail.inspectionsTitle')}>
          {application.inspections?.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              {t('applicationDetail.noInspections')}
            </div>
          ) : (
            <div className="space-y-6">
              {application.inspections?.map((insp) => (
                <div key={insp.id} className="border border-slate-200 rounded p-4 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-gov-navy text-sm">{insp.inspectionNumber}</span>
                      <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        {insp.inspectionType} INSPECTION
                      </span>
                    </div>
                    <StatusBadge status={insp.status} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold">{t('applicationDetail.inspDate')}:</span>
                      <p className="font-medium text-slate-800">{new Date(insp.scheduledDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">{t('applicationDetail.inspChair')}:</span>
                      <p className="font-medium text-slate-800">
                        {insp.committeeMembers?.[0]?.user?.fullName || 'IIT Expert'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">{t('applicationDetail.inspRecommendation')}:</span>
                      <p className="font-bold text-gov-blue">{insp.recommendation || 'Report Awaited'}</p>
                    </div>
                  </div>

                  {insp.checklists && insp.checklists.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <h4 className="text-xs font-bold text-slate-700 mb-2">{t('applicationDetail.inspChecklistScores')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {insp.checklists.map((c) => (
                          <div key={c.id} className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                            <span className="text-slate-700">{c.itemName}</span>
                            <span className="font-bold text-emerald-700">{c.score}/10</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab 5: Workflow Timeline & Audit Log */}
      {activeTab === 'audit' && (
        <Card title={t('applicationDetail.auditTitle')}>
          <div className="space-y-4">
            <div className="divide-y divide-slate-100">
              {application.auditLogs?.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between text-xs">
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gov-navy bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {log.action}
                      </span>
                      <span className="text-slate-500 text-[11px]">By: {t(`roles.${log.userRole}`) || log.userRole || 'SYSTEM'}</span>
                    </div>
                    <p className="text-slate-700">{log.description}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* MODAL 1: Advance Stage */}
      <Modal isOpen={advanceModalOpen} onClose={() => setAdvanceModalOpen(false)} title={t('applicationDetail.modalAdvanceTitle')}>
        <form onSubmit={handleAdvanceStage} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalAdvanceStageLabel')}</label>
            <select
              value={targetStage}
              onChange={(e) => setTargetStage(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue"
            >
              <option value="STAGE_VALIDATION">Stage 2: Initial Scrutiny & Validation</option>
              <option value="STAGE_SCRUTINY">{t('applicationDetail.stageScrutiny')}</option>
              <option value="STAGE_EVC">{t('applicationDetail.stageEvc')}</option>
              <option value="STAGE_COMMITTEE">{t('applicationDetail.stageShc')}</option>
              <option value="STAGE_APPROVAL">{t('applicationDetail.stageCouncil')}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalAdvanceRemarks')}</label>
            <textarea
              required
              rows={3}
              value={advanceRemarks}
              onChange={(e) => setAdvanceRemarks(e.target.value)}
              placeholder={t('applicationDetail.modalAdvanceRemarksPlaceholder')}
              className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setAdvanceModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-1.5 bg-gov-blue text-white rounded font-semibold hover:bg-blue-700"
            >
              {actionLoading ? 'Advancing...' : t('applicationDetail.modalAdvanceBtn')}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Raise Deficiency Notice */}
      <Modal isOpen={deficiencyModalOpen} onClose={() => setDeficiencyModalOpen(false)} title={t('applicationDetail.modalDeficiencyTitle')}>
        <form onSubmit={handleDeficiencySubmit} className="space-y-4 text-xs">
          <div className="bg-amber-50 p-2.5 rounded border border-amber-300 text-amber-900 text-[11px]">
            {t('applicationDetail.modalDeficiencyBanner')}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalDeficiencyRemarks')}</label>
            <textarea
              required
              rows={3}
              value={deficiencyRemarks}
              onChange={(e) => setDeficiencyRemarks(e.target.value)}
              placeholder={t('applicationDetail.modalDeficiencyPlaceholder')}
              className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalDeficiencyDeadline')}</label>
            <input
              type="number"
              min={1}
              max={30}
              value={deadlineDays}
              onChange={(e) => setDeadlineDays(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setDeficiencyModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-1.5 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700"
            >
              {actionLoading ? 'Issuing...' : t('applicationDetail.modalDeficiencyBtn')}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Final Council Decision */}
      <Modal isOpen={decisionModalOpen} onClose={() => setDecisionModalOpen(false)} title={t('applicationDetail.modalDecisionTitle')}>
        <form onSubmit={handleDecisionSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalDecisionTypeLabel')}</label>
            <select
              value={decisionType}
              onChange={(e) => setDecisionType(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded font-bold"
            >
              <option value="APPROVED">{t('applicationDetail.modalDecisionApprove')}</option>
              <option value="REJECTED">{t('applicationDetail.modalDecisionReject')}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalDecisionRemarks')}</label>
            <textarea
              required
              rows={3}
              value={decisionRemarks}
              onChange={(e) => setDecisionRemarks(e.target.value)}
              placeholder={t('applicationDetail.modalDecisionPlaceholder')}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setDecisionModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className={`px-4 py-1.5 text-white rounded font-semibold ${
                decisionType === 'APPROVED' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'
              }`}
            >
              {actionLoading ? 'Recording...' : `${t('actions.confirm')} ${decisionType}`}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: OCR Review & Confirm */}
      <Modal isOpen={ocrModalOpen} onClose={() => setOcrModalOpen(false)} title={t('applicationDetail.modalOcrTitle')}>
        <form onSubmit={handleConfirmOcr} className="space-y-4 text-xs">
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <p className="font-bold text-gov-navy">{selectedDoc?.title}</p>
            <p className="text-[11px] text-slate-500">
              {t('applicationDetail.category')}: {selectedDoc?.category} • {t('applicationDetail.docTableConfidence')}:{' '}
              {Math.round((selectedDoc?.ocrData?.confidenceScore || 0) * 100)}%
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalOcrDocNum')}</label>
            <input
              type="text"
              required
              value={ocrDocNumber}
              onChange={(e) => setOcrDocNumber(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalOcrIssueDate')}</label>
              <input
                type="date"
                value={ocrIssueDate}
                onChange={(e) => setOcrIssueDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalOcrExpiryDate')}</label>
              <input
                type="date"
                value={ocrExpiryDate}
                onChange={(e) => setOcrExpiryDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalOcrAuthority')}</label>
            <input
              type="text"
              value={ocrAuthority}
              onChange={(e) => setOcrAuthority(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setOcrModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-1.5 bg-gov-blue text-white rounded font-semibold hover:bg-blue-700"
            >
              {actionLoading ? 'Saving...' : t('applicationDetail.modalOcrConfirmBtn')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
