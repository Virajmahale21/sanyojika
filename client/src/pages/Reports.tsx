import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { AnumatiSetuLogo } from '../components/layout/AnumatiSetuLogo';
import { Download, Printer, BarChart3, Clock, CheckCircle2, RefreshCw } from 'lucide-react';

export const Reports: React.FC = () => {
  const { t } = useTranslation();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.getSummaryReport();
      if (res.success) {
        setReport(res.data);
      }
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleExportCsv = () => {
    window.open('/api/v1/reports/export-csv', '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
        <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
        <span>{t('reports.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Printable Official Statutory Header */}
      <div className="bg-white border border-gov-border rounded-lg p-4 shadow-gov-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <AnumatiSetuLogo width={180} className="h-10 md:h-12 w-auto object-contain flex-shrink-0" />
          <div className="border-l border-slate-200 pl-4 hidden sm:block">
            <h2 className="text-sm font-bold text-gov-navy uppercase tracking-wide">
              {t('reports.title')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('reports.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 bg-gov-blue hover:bg-blue-700 text-white px-3.5 py-2 rounded text-xs font-semibold shadow transition"
          >
            <Download className="w-4 h-4" />
            <span>{t('actions.exportCsv')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>{t('actions.printReport')}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-gov-blue">
          <p className="text-[11px] font-bold text-slate-500 uppercase">{t('reports.kpiTotal')}</p>
          <h3 className="text-2xl font-bold text-gov-navy mt-1">{report.totalApplications}</h3>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <p className="text-[11px] font-bold text-slate-500 uppercase">{t('reports.kpiApproved')}</p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1">{report.approvedApplications}</h3>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <p className="text-[11px] font-bold text-slate-500 uppercase">{t('reports.kpiReview')}</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">{report.underReviewApplications}</h3>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <p className="text-[11px] font-bold text-slate-500 uppercase">{t('reports.kpiTurnaround')}</p>
          <h3 className="text-2xl font-bold text-purple-700 mt-1">{report.averageTurnaroundDays} {t('reports.days')}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{t('reports.slaLimit')}</p>
        </Card>
      </div>

      {/* Detailed Analysis Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={t('reports.categoryCardTitle')}>
          <div className="space-y-3 pt-2 text-xs">
            {report.applicationsByType.map((item: any) => (
              <div key={item.type} className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="font-semibold text-slate-700">{item.type}</span>
                <span className="font-mono font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {item.count} Dossiers
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title={t('reports.complianceCardTitle')}>
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-700">{t('reports.totalObligations')}</span>
              <span className="font-bold text-slate-800">{report.complianceStats.total}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded border border-emerald-200">
              <span className="font-semibold text-emerald-900">{t('reports.compliantCount')}</span>
              <span className="font-bold text-emerald-700">{report.complianceStats.compliant}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded border border-blue-200">
              <span className="font-semibold text-blue-900">{t('reports.underReviewCount')}</span>
              <span className="font-bold text-blue-700">{report.complianceStats.underReview}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded border border-amber-200">
              <span className="font-semibold text-amber-900">{t('reports.pendingCount')}</span>
              <span className="font-bold text-amber-700">{report.complianceStats.pendingEvidence}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
