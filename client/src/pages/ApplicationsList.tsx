import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Application } from '../types';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { AnumatiSetuLogo } from '../components/layout/AnumatiSetuLogo';
import { Search, Plus, Filter, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export const ApplicationsList: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.getApplications({
        search,
        status: statusFilter,
        type: typeFilter,
      });
      if (res.success) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const getRiskBadge = (score: number, level: string) => {
    let color = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    if (level === 'CRITICAL' || score >= 75) {
      color = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
    } else if (level === 'HIGH' || score >= 50) {
      color = 'bg-amber-50 text-amber-800 border-amber-300';
    } else if (level === 'MEDIUM' || score >= 30) {
      color = 'bg-blue-50 text-blue-800 border-blue-300';
    }
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] border flex items-center w-fit ${color}`}>
        {level === 'HIGH' || level === 'CRITICAL' ? <AlertTriangle className="w-2.5 h-2.5 mr-1 text-rose-600" /> : null}
        {t('applications.riskLabel')}: {score}/100 ({level})
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header and New Application Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <AnumatiSetuLogo width={150} className="hidden sm:block shrink-0" />
          <div>
            <h1 className="text-xl font-bold text-gov-navy">{t('applications.title')}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('applications.subtitle')}
            </p>
          </div>
        </div>

        {user?.role === 'INSTITUTION_ADMIN' && (
          <Link
            to="/applications/new"
            className="flex items-center space-x-1.5 bg-gov-blue hover:bg-blue-700 text-white px-3.5 py-2 rounded text-xs font-semibold shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('applications.createNew')}</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('applications.searchPlaceholder')}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-gov-blue focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-3 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-gov-blue focus:outline-none bg-white"
            >
              <option value="ALL">{t('applications.allStatuses')}</option>
              <option value="DRAFT">{t('status.DRAFT')}</option>
              <option value="SUBMITTED">{t('status.SUBMITTED')}</option>
              <option value="UNDER_SCRUTINY">{t('status.UNDER_SCRUTINY')}</option>
              <option value="DOCUMENTS_REQUIRED">{t('status.DOCUMENTS_REQUIRED')}</option>
              <option value="INSPECTION_SCHEDULED">{t('status.INSPECTION_SCHEDULED')}</option>
              <option value="APPROVED">{t('status.APPROVED')}</option>
              <option value="REJECTED">{t('status.REJECTED')}</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-1.5 px-3 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-gov-blue focus:outline-none bg-white"
            >
              <option value="ALL">{t('applications.allCategories')}</option>
              <option value="EOA">{t('newApplication.appTypeEoa')}</option>
              <option value="NEW_CAMPUS">{t('newApplication.appTypeNewCampus')}</option>
              <option value="INTAKE_INCREASE">{t('newApplication.appTypeIntake')}</option>
              <option value="NEW_COURSE">{t('newApplication.appTypeNewCourse')}</option>
            </select>
          </div>
        </form>
      </Card>

      {/* Applications Table */}
      <Card>
        {loading ? (
          <div className="py-12 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
            <span>{t('applications.loading')}</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            {t('applications.empty')}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-semibold">{t('applications.tableNumber')}</th>
                  <th className="p-3 font-semibold">{t('applications.tableInstitution')}</th>
                  <th className="p-3 font-semibold">{t('applications.tableCategory')}</th>
                  <th className="p-3 font-semibold">{t('applications.tableStage')}</th>
                  <th className="p-3 font-semibold">{t('applications.tableStatus')}</th>
                  <th className="p-3 font-semibold">{t('applications.tableRisk')}</th>
                  <th className="p-3 font-semibold">{t('applications.tableDueDate')}</th>
                  <th className="p-3 font-semibold text-right">{t('applications.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-gov-navy">
                      <Link to={`/applications/${app.id}`} className="hover:text-gov-blue hover:underline">
                        {app.applicationNumber}
                      </Link>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{app.institution.name}</div>
                      <div className="text-[11px] text-slate-500">
                        PID: {app.institution.permanentId} • {app.institution.city}, {app.institution.state}
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{app.applicationType}</td>
                    <td className="p-3 text-slate-600">
                      <span className="font-semibold">{app.currentStageCode.replace('STAGE_', '')}</span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="p-3">{getRiskBadge(app.delayRiskScore, app.delayRiskLevel)}</td>
                    <td className="p-3 text-slate-600">
                      {app.targetDueDate ? new Date(app.targetDueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/applications/${app.id}`}
                        className="inline-flex items-center text-xs font-semibold text-gov-blue hover:text-blue-800 hover:underline"
                      >
                        <span>{t('actions.viewDetails')}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </td>
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
