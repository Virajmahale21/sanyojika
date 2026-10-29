import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { Settings, Users, RotateCcw, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleResetDemoDb = async () => {
    if (
      !window.confirm(
        'Are you sure you want to restore the demonstration database to its initial synthetic presentation state?'
      )
    ) {
      return;
    }

    setResetting(true);
    try {
      const res = await api.resetDemoDb();
      if (res.success) {
        setFeedback('Demo database successfully re-seeded with pristine baseline data.');
        fetchUsers();
      }
    } catch {
      alert('Failed to reset demo state.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-gov-navy flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gov-blue" />
          <span>{t('admin.title')}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('admin.subtitle')}
        </p>
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

      {/* Demo Reset Card for Judges */}
      <Card
        className="border-2 border-dashed border-amber-300 bg-amber-50/50"
        title={t('admin.resetCardTitle')}
        subtitle={t('admin.resetCardSub')}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="max-w-xl text-slate-700 space-y-1">
            <p>
              {t('admin.resetDesc1')}
            </p>
            <p className="text-[11px] text-slate-500">
              {t('admin.resetDesc2')}
            </p>
          </div>

          <button
            onClick={handleResetDemoDb}
            disabled={resetting}
            className="flex items-center justify-center space-x-1.5 bg-gov-navy hover:bg-slate-800 text-amber-300 px-4 py-2.5 rounded text-xs font-bold shadow transition flex-shrink-0"
          >
            <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? t('admin.resettingBtn') : t('admin.resetBtn')}</span>
          </button>
        </div>
      </Card>

      {/* Authorized System Stakeholders List */}
      <Card title={t('admin.usersTableTitle')}>
        {loading ? (
          <div className="py-12 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
            <span>{t('admin.loading')}</span>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-semibold">{t('admin.userName')}</th>
                  <th className="p-3 font-semibold">{t('admin.userEmail')}</th>
                  <th className="p-3 font-semibold">{t('admin.userRole')}</th>
                  <th className="p-3 font-semibold">{t('admin.userDept')}</th>
                  <th className="p-3 font-semibold">{t('admin.userDesignation')}</th>
                  <th className="p-3 font-semibold">{t('admin.userLanguage')}</th>
                  <th className="p-3 font-semibold">{t('admin.userStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-gov-navy">{u.fullName}</td>
                    <td className="p-3 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span className="font-semibold text-gov-blue bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                        {t(`roles.${u.role}`) || u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">
                      {u.institution?.name || u.department?.name || u.region?.name || 'Central AICTE Secretariat'}
                    </td>
                    <td className="p-3 text-slate-600">{u.designation || 'Statutory Officer'}</td>
                    <td className="p-3 uppercase font-mono font-bold text-slate-500">{u.preferredLang}</td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                        {t('admin.active')}
                      </span>
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
