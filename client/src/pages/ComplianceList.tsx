import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ComplianceSubmission } from '../types';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileCheck,
  RefreshCw,
  Scale,
  Calendar,
} from 'lucide-react';

export const ComplianceList: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState<ComplianceSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Submit Evidence Modal
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [activeSub, setActiveSub] = useState<ComplianceSubmission | null>(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceRemarks, setEvidenceRemarks] = useState('');

  // Verify Modal
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'COMPLIANT' | 'NON_COMPLIANT'>('COMPLIANT');
  const [verifyRemarks, setVerifyRemarks] = useState('');

  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.getComplianceSubmissions({ status: statusFilter });
      if (res.success) {
        setSubmissions(res.data);
      }
    } catch (err) {
      console.error('Failed to load compliance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const handleEvidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSub) return;
    setSubmitting(true);
    try {
      const res = await api.submitComplianceEvidence(activeSub.id, {
        evidenceDocUrl: evidenceUrl || '/uploads/compliance/evidence_sample.pdf',
        remarks: evidenceRemarks,
      });
      if (res.success) {
        setEvidenceModalOpen(false);
        setFeedback('Compliance evidence uploaded and submitted for bureau verification.');
        fetchSubmissions();
      }
    } catch {
      alert('Failed to upload evidence.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSub) return;
    setSubmitting(true);
    try {
      const res = await api.verifyCompliance(activeSub.id, verifyStatus, verifyRemarks);
      if (res.success) {
        setVerifyModalOpen(false);
        setFeedback(`Compliance status updated to ${verifyStatus}.`);
        fetchSubmissions();
      }
    } catch {
      alert('Verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const isOfficer = ['BUREAU_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gov-navy">{t('compliance.title')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('compliance.subtitle')}
          </p>
        </div>
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

      {/* Filter Card */}
      <Card className="p-3">
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-semibold text-slate-600">{t('compliance.filterLabel')}</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 border border-slate-300 rounded bg-white"
          >
            <option value="ALL">{t('compliance.allRecords')}</option>
            <option value="COMPLIANT">{t('status.COMPLIANT')}</option>
            <option value="UNDER_REVIEW">{t('status.UNDER_REVIEW')}</option>
            <option value="PENDING_EVIDENCE">{t('status.PENDING_EVIDENCE')}</option>
            <option value="NON_COMPLIANT">{t('status.NON_COMPLIANT')}</option>
            <option value="OVERDUE">{t('status.OVERDUE')}</option>
          </select>
        </div>
      </Card>

      {/* Compliance Submissions Table */}
      <Card>
        {loading ? (
          <div className="py-12 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
            <span>{t('compliance.loading')}</span>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">{t('compliance.empty')}</div>
        ) : (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-semibold">{t('compliance.tableObligation')}</th>
                  <th className="p-3 font-semibold">{t('compliance.tableInstitution')}</th>
                  <th className="p-3 font-semibold">{t('compliance.tableCategory')}</th>
                  <th className="p-3 font-semibold">{t('compliance.tableStatus')}</th>
                  <th className="p-3 font-semibold">{t('compliance.tableDueDate')}</th>
                  <th className="p-3 font-semibold">{t('compliance.tableSubDate')}</th>
                  <th className="p-3 font-semibold text-right">{t('compliance.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-semibold text-gov-navy">{sub.requirement.title}</div>
                      <div className="text-[11px] text-slate-500">{sub.requirement.description}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{sub.institution.name}</div>
                      <div className="text-[11px] text-slate-500">PID: {sub.institution.permanentId}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                        {sub.requirement.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="p-3 font-medium text-slate-700">{new Date(sub.dueDate).toLocaleDateString()}</td>
                    <td className="p-3 text-slate-600">
                      {sub.submittedDate ? new Date(sub.submittedDate).toLocaleDateString() : 'Awaited'}
                    </td>
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      {user?.role === 'INSTITUTION_ADMIN' && sub.status !== 'COMPLIANT' && (
                        <button
                          onClick={() => {
                            setActiveSub(sub);
                            setEvidenceRemarks(sub.remarks || '');
                            setEvidenceModalOpen(true);
                          }}
                          className="bg-gov-blue hover:bg-blue-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                        >
                          {t('compliance.uploadProofBtn')}
                        </button>
                      )}

                      {isOfficer && (
                        <button
                          onClick={() => {
                            setActiveSub(sub);
                            setVerifyStatus(sub.status === 'COMPLIANT' ? 'COMPLIANT' : 'COMPLIANT');
                            setVerifyRemarks(sub.remarks || '');
                            setVerifyModalOpen(true);
                          }}
                          className="bg-slate-800 hover:bg-slate-900 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                        >
                          {t('compliance.verifyProofBtn')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Upload Proof Modal */}
      <Modal isOpen={evidenceModalOpen} onClose={() => setEvidenceModalOpen(false)} title={t('compliance.evidenceModalTitle')}>
        <form onSubmit={handleEvidenceSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h4 className="font-bold text-gov-navy">{activeSub?.requirement.title}</h4>
            <p className="text-[11px] text-slate-500 mt-1">{activeSub?.requirement.description}</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('compliance.evidenceModalUrl')}</label>
            <input
              type="text"
              required
              placeholder={t('compliance.evidenceModalUrlPlaceholder')}
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('compliance.evidenceModalRemarks')}</label>
            <textarea
              rows={3}
              required
              value={evidenceRemarks}
              onChange={(e) => setEvidenceRemarks(e.target.value)}
              placeholder={t('compliance.evidenceModalRemarksPlaceholder')}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setEvidenceModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-gov-blue text-white rounded font-semibold hover:bg-blue-700"
            >
              {submitting ? 'Submitting...' : t('compliance.evidenceModalSubmit')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Officer Verify Modal */}
      <Modal isOpen={verifyModalOpen} onClose={() => setVerifyModalOpen(false)} title={t('compliance.verifyModalTitle')}>
        <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h4 className="font-bold text-gov-navy">{activeSub?.requirement.title}</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              {t('compliance.evidenceSubmitted')} <strong>{activeSub?.evidenceDocUrl || 'Uploaded File'}</strong>
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('compliance.verifyModalStatus')}</label>
            <select
              value={verifyStatus}
              onChange={(e) => setVerifyStatus(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded font-semibold text-gov-navy"
            >
              <option value="COMPLIANT">{t('compliance.markCompliant')}</option>
              <option value="NON_COMPLIANT">{t('compliance.markNonCompliant')}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('compliance.verifyModalRemarks')}</label>
            <textarea
              rows={3}
              required
              value={verifyRemarks}
              onChange={(e) => setVerifyRemarks(e.target.value)}
              placeholder={t('compliance.verifyModalRemarksPlaceholder')}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setVerifyModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-gov-blue text-white rounded font-semibold hover:bg-blue-700"
            >
              {t('compliance.verifyModalSubmit')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
