import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { AuditLogItem } from '../types';
import { Card } from '../components/ui/Card';
import { AnumatiSetuLogo } from '../components/layout/AnumatiSetuLogo';
import { History, Shield, Filter, RefreshCw } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs({
        action: actionFilter,
        entityType: entityFilter,
      });
      if (res.success) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, entityFilter]);

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center space-x-3.5 border-b border-slate-200 pb-4">
        <AnumatiSetuLogo width={150} className="hidden sm:block shrink-0" />
        <div>
          <h1 className="text-xl font-bold text-gov-navy flex items-center">
            <Shield className="w-5 h-5 mr-2 text-gov-blue" />
            <span>{t('auditLogs.title')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('auditLogs.subtitle')}
          </p>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">{t('auditLogs.filterAction')}</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white"
            >
              <option value="ALL">{t('auditLogs.allActions')}</option>
              <option value="CREATE">{t('auditLogs.actionCreate')}</option>
              <option value="SUBMIT">{t('auditLogs.actionSubmit')}</option>
              <option value="ADVANCE_STAGE">{t('auditLogs.actionAdvance')}</option>
              <option value="REQUEST_DEFICIENCY">{t('auditLogs.actionDeficiency')}</option>
              <option value="VERIFY_DOC">{t('auditLogs.actionVerifyDoc')}</option>
              <option value="SCHEDULE_INSPECTION">{t('auditLogs.actionScheduleInspection')}</option>
              <option value="APPROVE">{t('auditLogs.actionApprove')}</option>
              <option value="REJECT">{t('auditLogs.actionReject')}</option>
              <option value="ESCALATE">{t('auditLogs.actionEscalate')}</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">{t('auditLogs.filterEntity')}</label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white"
            >
              <option value="ALL">{t('auditLogs.allEntities')}</option>
              <option value="APPLICATION">{t('auditLogs.entityApplication')}</option>
              <option value="DOCUMENT">{t('auditLogs.entityDocument')}</option>
              <option value="INSPECTION">{t('auditLogs.entityInspection')}</option>
              <option value="COMPLIANCE">{t('auditLogs.entityCompliance')}</option>
              <option value="TASK">{t('auditLogs.entityTask')}</option>
              <option value="USER">{t('auditLogs.entityUser')}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        {loading ? (
          <div className="py-12 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
            <span>{t('auditLogs.loading')}</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">{t('auditLogs.empty')}</div>
        ) : (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-semibold">{t('auditLogs.tableTime')}</th>
                  <th className="p-3 font-semibold">{t('auditLogs.tableAction')}</th>
                  <th className="p-3 font-semibold">{t('auditLogs.tableRole')}</th>
                  <th className="p-3 font-semibold">{t('auditLogs.tableEntity')}</th>
                  <th className="p-3 font-semibold">{t('auditLogs.tableDesc')}</th>
                  <th className="p-3 font-semibold">{t('auditLogs.tableIp')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition font-sans">
                    <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-gov-navy bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-800">{log.userRole || 'SYSTEM_DAEMON'}</span>
                      {log.userEmail && <div className="text-[10px] text-slate-400 font-mono">{log.userEmail}</div>}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">
                      <strong>{log.entityType}</strong>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{log.entityId}</div>
                    </td>
                    <td className="p-3 text-slate-700 max-w-md leading-relaxed">{log.description}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{log.ipAddress || '127.0.0.1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
