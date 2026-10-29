import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Mail, Shield, CheckCircle } from 'lucide-react';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  to: string;
  subject: string;
  body: string;
  date: string;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  to,
  subject,
  body,
  date,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('emailModal.title')} maxWidth="2xl">
      <div className="space-y-4">
        {/* Simulation Banner */}
        <div className="bg-amber-50 border border-amber-300 rounded p-3 flex items-center text-xs text-amber-900">
          <Shield className="w-4 h-4 text-amber-700 mr-2 flex-shrink-0" />
          <span>
            {t('emailModal.banner')}
          </span>
        </div>

        {/* Email Header */}
        <div className="border border-slate-200 rounded p-4 bg-slate-50 text-xs space-y-1.5 font-mono">
          <div>
            <span className="text-slate-500 font-semibold">{t('emailModal.fromLabel')}</span> notifications@aicte-india.org (AICTE Governance
            Portal)
          </div>
          <div>
            <span className="text-slate-500 font-semibold">{t('emailModal.toLabel')}</span> {to}
          </div>
          <div>
            <span className="text-slate-500 font-semibold">{t('emailModal.dateLabel')}</span> {date}
          </div>
          <div>
            <span className="text-slate-500 font-semibold">{t('emailModal.subjectLabel')}</span>{' '}
            <strong className="text-slate-800">{subject}</strong>
          </div>
        </div>

        {/* Official Email Body */}
        <div className="border border-slate-200 rounded p-6 bg-white space-y-4 shadow-inner">
          <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
            <div className="w-10 h-10 rounded bg-gov-blue text-white flex items-center justify-center font-bold">
              AICTE
            </div>
            <div>
              <h4 className="text-sm font-bold text-gov-navy">{t('emailModal.aicteFullName')}</h4>
              <p className="text-[11px] text-slate-500">{t('emailModal.aicteAddress')}</p>
            </div>
          </div>

          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{body}</div>

          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <p>{t('emailModal.footerNotice')}</p>
            <p>{t('emailModal.footerRef')}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded text-xs hover:bg-slate-700 transition"
          >
            {t('emailModal.closeBtn')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
