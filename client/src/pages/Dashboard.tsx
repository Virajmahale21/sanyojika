import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { AnumatiSetuLogo } from '../components/layout/AnumatiSetuLogo';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FolderLock,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardMetrics();
      if (res.success) {
        setMetrics(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user]);

  if (loading || !metrics) {
    return (
      <div className="p-8 flex items-center justify-center space-x-2 text-slate-500 text-xs">
        <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
        <span>{t('dashboard.loading')}</span>
      </div>
    );
  }

  const { kpis, stageMetrics, statusCounts, regionalWorkload, recentActivities } = metrics;

  const STATUS_COLORS: Record<string, string> = {
    APPROVED: '#15803d',
    UNDER_SCRUTINY: '#1a4b84',
    SUBMITTED: '#3b82f6',
    INITIAL_VALIDATION: '#60a5fa',
    DOCUMENTS_REQUIRED: '#e67e22',
    INSPECTION_SCHEDULED: '#8b5cf6',
    REJECTED: '#b91c1c',
  };

  return (
    <div className="space-y-6">
      {/* Official Portal Branding Banner */}
      <div className="bg-white border border-gov-border rounded-lg p-3.5 shadow-gov-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <AnumatiSetuLogo width={180} className="h-10 md:h-12 w-auto object-contain flex-shrink-0" />
          <div className="border-l border-slate-200 pl-3.5 hidden sm:block">
            <div className="text-[11px] font-bold text-gov-navy tracking-wide uppercase">
              {t('ministry')}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {t('portalSubtitle')}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold text-gov-blue bg-gov-blueLight border border-gov-border px-2.5 py-1 rounded-full uppercase tracking-wider">
            {user?.role ? t(`roles.${user.role}`) || user.role : 'NATIONAL WORKSPACE'}
          </span>
          <button
            onClick={fetchMetrics}
            className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded text-xs font-medium transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('dashboard.refreshIntelligence') || t('actions.refresh')}</span>
          </button>
        </div>
      </div>

      {/* Page Title & User Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gov-navy flex items-center">
            {t('nav.dashboard')}
            <span className="ml-3 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-gov-blue">
              {t('dashboard.cycle')}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded text-xs font-medium transition shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t('dashboard.refreshIntelligence') || t('actions.refresh')}</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-gov-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">{t('dashboard.kpiTotal')}</p>
              <h3 className="text-2xl font-bold text-gov-navy mt-1">{kpis.totalApplications}</h3>
              <p className="text-[11px] text-slate-400 mt-1">{t('dashboard.kpiTotalSub')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-gov-blue flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">{t('dashboard.kpiPending')}</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{kpis.pendingApplications}</h3>
              <p className="text-[11px] text-slate-400 mt-1">{t('dashboard.kpiPendingSub')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">{t('dashboard.kpiApproved')}</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">{kpis.approvedApplications}</h3>
              <p className="text-[11px] text-emerald-600 mt-1">{t('dashboard.kpiApprovedSub')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-rose-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">{t('dashboard.kpiOverdue')}</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">{kpis.overdueApplications}</h3>
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{t('dashboard.kpiOverdueSub')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-3.5 rounded border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-slate-600">{t('dashboard.upcomingInspections')}:</span>
          </div>
          <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
            {kpis.upcomingInspections}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <FolderLock className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-slate-600">{t('dashboard.expiringDocs')}:</span>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
            {kpis.expiringDocuments}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-slate-600">{t('dashboard.complianceRate')}:</span>
          </div>
          <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
            {kpis.complianceRate}%
          </span>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-slate-600">{t('dashboard.pendingTasks')}:</span>
          </div>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
            {kpis.pendingTasks}
          </span>
        </div>
      </div>

      {/* Interactive Charts: Pipeline Funnel & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Workflow Stage */}
        <Card title={t('dashboard.pipelineChartTitle')} subtitle={t('dashboard.pipelineChartSub')}>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="code"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => val.replace('STAGE_', '')}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, _name, item: any) => [`${val} Applications`, item.payload.name]}
                  contentStyle={{ fontSize: '11px', borderRadius: '4px' }}
                />
                <Bar dataKey="count" fill="#1a4b84" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution Donut Chart */}
        <Card title={t('dashboard.statusChartTitle')} subtitle={t('dashboard.statusChartSub')}>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts.filter((s: any) => s.count > 0)}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  label={({ status, count }) => `${t(`status.${status}`) || status.replace('_', ' ')} (${count})`}
                  labelLine={false}
                >
                  {statusCounts.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Regional Workload & Recent Consequential Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Workload Bar Chart */}
        <Card
          className="lg:col-span-1"
          title={t('dashboard.regionalTitle')}
          subtitle={t('dashboard.regionalSub')}
        >
          <div className="space-y-3 pt-2">
            {regionalWorkload.map((reg: any) => (
              <div key={reg.regionCode} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{reg.regionName}</span>
                  <span className="text-slate-500 font-bold">{reg.count} Apps</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gov-blue h-2 rounded-full"
                    style={{ width: `${Math.min(100, (reg.count / (kpis.totalApplications || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Audit Activities */}
        <Card
          className="lg:col-span-2"
          title={t('dashboard.recentAuditTitle')}
          subtitle={t('dashboard.recentAuditSub')}
        >
          <div className="divide-y divide-slate-100 -mx-5 -mb-5">
            {recentActivities.map((act: any) => (
              <div key={act.id} className="p-3.5 hover:bg-slate-50 transition text-xs flex items-start justify-between">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gov-navy text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {act.action}
                    </span>
                    <span className="text-slate-500 text-[11px]">• {t('auditLogs.tableRole')}: {t(`roles.${act.userRole}`) || act.userRole}</span>
                  </div>
                  <p className="text-slate-700 text-xs">{act.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(act.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
