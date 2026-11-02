import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DocumentItem } from '../types';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { AnumatiSetuLogo } from '../components/layout/AnumatiSetuLogo';
import {
  FolderLock,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Filter,
  RefreshCw,
  Eye,
  FileText,
} from 'lucide-react';

export const DocumentsList: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('FIRE_NOC');
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [docToReview, setDocToReview] = useState<DocumentItem | null>(null);
  const [reviewStatus, setReviewStatus] = useState('VERIFIED');
  const [reviewRemarks, setReviewRemarks] = useState('');

  // OCR modal state
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [docForOcr, setDocForOcr] = useState<DocumentItem | null>(null);
  const [ocrDocNum, setOcrDocNum] = useState('');
  const [ocrIssueDate, setOcrIssueDate] = useState('');
  const [ocrExpiryDate, setOcrExpiryDate] = useState('');
  const [ocrAuthority, setOcrAuthority] = useState('');

  const [feedback, setFeedback] = useState('');

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.getDocuments({
        category: categoryFilter,
        status: statusFilter,
      });
      if (res.success) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [categoryFilter, statusFilter]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('category', uploadCategory);
      formData.append('title', uploadTitle);
      if (selectedFile) formData.append('file', selectedFile);

      const res = await api.uploadDocument(formData);
      if (res.success) {
        setUploadModalOpen(false);
        setUploadTitle('');
        setSelectedFile(null);
        setFeedback('Document uploaded and processed through OCR extraction successfully.');
        fetchDocuments();
      }
    } catch {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docToReview) return;
    try {
      const res = await api.reviewDocument(docToReview.id, reviewStatus, reviewRemarks);
      if (res.success) {
        setReviewModalOpen(false);
        setFeedback(`Document status updated to ${reviewStatus}.`);
        fetchDocuments();
      }
    } catch {
      alert('Failed to submit review.');
    }
  };

  const handleConfirmOcrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForOcr) return;
    try {
      const res = await api.confirmOcr(docForOcr.id, {
        docNumber: ocrDocNum,
        issueDate: ocrIssueDate,
        expiryDate: ocrExpiryDate,
        issuingAuthority: ocrAuthority,
      });
      if (res.success) {
        setOcrModalOpen(false);
        setFeedback('OCR metadata verified and permanently saved.');
        fetchDocuments();
      }
    } catch {
      alert('Failed to confirm OCR.');
    }
  };

  const isOfficer = ['BUREAU_OFFICER', 'CENTRAL_ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

  return (
    <div className="space-y-5">
      {/* Official Document Repository Header */}
      <div className="bg-white border border-gov-border rounded-lg p-3.5 shadow-gov-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <AnumatiSetuLogo width={165} className="h-9 md:h-11 w-auto object-contain flex-shrink-0" />
          <div className="border-l border-slate-200 pl-3.5 hidden sm:block">
            <h1 className="text-sm font-bold text-gov-navy">{t('documents.title')}</h1>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {t('documents.subtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center space-x-1.5 bg-gov-blue hover:bg-blue-700 text-white px-3.5 py-2 rounded text-xs font-semibold shadow transition"
        >
          <Upload className="w-4 h-4" />
          <span>{t('documents.uploadBtn')}</span>
        </button>
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
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">{t('documents.filterCategory')}</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white"
            >
              <option value="ALL">{t('documents.allCategories')}</option>
              <option value="FIRE_NOC">{t('documents.docFireNoc')}</option>
              <option value="LAND_TITLE">{t('documents.docLandDeed')}</option>
              <option value="BUILDING_PLAN">{t('documents.docBuildingPlan')}</option>
              <option value="FACULTY_CADRE">{t('documents.docFacultyCadre', 'Faculty Cadre Roster & 7th CPC Compliance')}</option>
              <option value="AUDITED_FINANCIALS">{t('documents.docBalanceSheets')}</option>
              <option value="AICTE_PREV_APPROVAL">{t('documents.docEoaLetter')}</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">{t('documents.filterStatus')}</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white"
            >
              <option value="ALL">{t('documents.allStatuses')}</option>
              <option value="PENDING">{t('status.PENDING')}</option>
              <option value="VERIFIED">{t('status.VERIFIED')}</option>
              <option value="CLARIFICATION_NEEDED">{t('status.DOCUMENTS_REQUIRED')}</option>
              <option value="REJECTED">{t('status.REJECTED')}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Documents Table */}
      <Card>
        {loading ? (
          <div className="py-12 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
            <span>{t('documents.loading')}</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">{t('documents.empty')}</div>
        ) : (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-semibold">{t('documents.tableTitle')}</th>
                  <th className="p-3 font-semibold">{t('documents.tableInstitution')}</th>
                  <th className="p-3 font-semibold">{t('documents.tableCategory')}</th>
                  <th className="p-3 font-semibold">{t('documents.tableStatus')}</th>
                  <th className="p-3 font-semibold">{t('documents.tableOcrNo')}</th>
                  <th className="p-3 font-semibold">{t('documents.tableExpiry')}</th>
                  <th className="p-3 font-semibold text-right">{t('documents.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-semibold text-gov-navy">{doc.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{doc.fileName}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-800">{doc.institution?.name}</span>
                      <div className="text-[11px] text-slate-500">PID: {doc.institution?.permanentId}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{doc.category}</td>
                    <td className="p-3">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="p-3 font-mono">
                      {doc.ocrData?.extractedDocNumber ? (
                        <div>
                          <span className="font-bold text-slate-800">{doc.ocrData.extractedDocNumber}</span>
                          <span className="ml-1 text-[10px] text-emerald-600 font-sans">
                            ({Math.round(doc.ocrData.confidenceScore * 100)}% {t('applicationDetail.match')})
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">{t('documents.processing')}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {doc.expiryDate ? (
                        <span className="font-medium text-slate-700">
                          {new Date(doc.expiryDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">{t('applicationDetail.perpetual')}</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      {doc.ocrData && (
                        <button
                          onClick={() => {
                            setDocForOcr(doc);
                            setOcrDocNum(doc.ocrData?.extractedDocNumber || '');
                            setOcrIssueDate(
                              doc.ocrData?.extractedIssueDate ? doc.ocrData.extractedIssueDate.split('T')[0] : ''
                            );
                            setOcrExpiryDate(
                              doc.ocrData?.extractedExpiryDate ? doc.ocrData.extractedExpiryDate.split('T')[0] : ''
                            );
                            setOcrAuthority(doc.ocrData?.extractedAuthority || '');
                            setOcrModalOpen(true);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-gov-navy px-2.5 py-1 rounded text-[11px] font-semibold transition"
                        >
                          {t('documents.verifyOcrBtn')}
                        </button>
                      )}

                      {isOfficer && (
                        <button
                          onClick={() => {
                            setDocToReview(doc);
                            setReviewStatus(doc.status);
                            setReviewRemarks(doc.reviewRemarks || '');
                            setReviewModalOpen(true);
                          }}
                          className="bg-gov-blue hover:bg-blue-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                        >
                          {t('documents.reviewBtn')}
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

      {/* Upload Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title={t('documents.uploadModalTitle')}>
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('documents.uploadModalCategory')}</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded"
            >
              <option value="FIRE_NOC">{t('documents.docFireNoc')}</option>
              <option value="LAND_TITLE">{t('documents.docLandDeed')}</option>
              <option value="BUILDING_PLAN">{t('documents.docBuildingPlan')}</option>
              <option value="FACULTY_CADRE">{t('documents.docFacultyCadre', 'Faculty Cadre Roster & 7th CPC Compliance')}</option>
              <option value="AUDITED_FINANCIALS">{t('documents.docBalanceSheets')}</option>
              <option value="AICTE_PREV_APPROVAL">{t('documents.docEoaLetter')}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('documents.uploadModalDocTitle')}</label>
            <input
              type="text"
              required
              placeholder={t('documents.uploadModalDocPlaceholder')}
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('documents.uploadModalFile')}</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-slate-300 rounded bg-slate-50"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              {t('documents.uploadModalHelper')}
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-1.5 bg-gov-blue text-white rounded font-semibold hover:bg-blue-700"
            >
              {uploading ? 'Processing OCR...' : t('documents.uploadModalSubmit')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title={t('documents.reviewModalTitle')}>
        <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <div className="font-bold text-gov-navy">{docToReview?.title}</div>
            <div className="text-[11px] text-slate-500">{docToReview?.institution?.name}</div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('documents.reviewModalStatus')}</label>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded font-semibold"
            >
              <option value="VERIFIED">{t('documents.markVerified')}</option>
              <option value="CLARIFICATION_NEEDED">{t('documents.markClarification')}</option>
              <option value="REJECTED">{t('documents.markRejected')}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('documents.reviewModalRemarks')}</label>
            <textarea
              rows={3}
              required
              value={reviewRemarks}
              onChange={(e) => setReviewRemarks(e.target.value)}
              placeholder={t('documents.reviewModalRemarksPlaceholder')}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded"
            >
              {t('actions.cancel')}
            </button>
            <button type="submit" className="px-4 py-1.5 bg-gov-blue text-white rounded font-semibold hover:bg-blue-700">
              {t('documents.reviewModalSubmit')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm OCR Modal */}
      <Modal isOpen={ocrModalOpen} onClose={() => setOcrModalOpen(false)} title={t('applicationDetail.modalOcrTitle')}>
        <form onSubmit={handleConfirmOcrSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('applicationDetail.modalOcrDocNum')}</label>
            <input
              type="text"
              required
              value={ocrDocNum}
              onChange={(e) => setOcrDocNum(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
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
              className="px-3 py-1.5 border border-slate-300 rounded"
            >
              {t('actions.cancel')}
            </button>
            <button type="submit" className="px-4 py-1.5 bg-gov-blue text-white rounded font-semibold hover:bg-blue-700">
              {t('applicationDetail.modalOcrConfirmBtn')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
