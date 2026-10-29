import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TaskItem } from '../types';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

export const TasksList: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MY_TASKS' | 'DEPT_TASKS' | 'DUE_SOON' | 'OVERDUE'>('ALL');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.getTasks({ filter: activeFilter });
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeFilter, user]);

  const handleTriggerEscalation = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await api.triggerEscalationScan();
      if (res.success) {
        setScanResult(
          `SLA Escalation Engine scanned ${res.data.scannedCount} tasks. ${res.data.escalatedCount} task(s) exceeded statutory thresholds and were escalated to higher administrative levels.`
        );
        fetchTasks();
      }
    } catch {
      setScanResult('Failed to run escalation scan.');
    } finally {
      setScanning(false);
    }
  };

  const handleMarkComplete = async (taskId: string) => {
    try {
      const res = await api.updateTaskStatus(taskId, 'COMPLETED');
      if (res.success) {
        fetchTasks();
      }
    } catch {
      alert('Failed to update task.');
    }
  };

  const getEscalationBadge = (level: number) => {
    if (level === 0) return <span className="text-slate-400 font-mono text-[11px]">{t('tasks.normalSla')}</span>;
    if (level === 1) {
      return (
        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center w-fit">
          <ArrowUpRight className="w-3 h-3 mr-0.5" />
          {t('tasks.level1')}
        </span>
      );
    }
    if (level === 2) {
      return (
        <span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center w-fit">
          <AlertTriangle className="w-3 h-3 mr-0.5" />
          {t('tasks.level2')}
        </span>
      );
    }
    return (
      <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px] flex items-center w-fit animate-pulse">
        <AlertTriangle className="w-3 h-3 mr-0.5" />
        {t('tasks.level3')}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gov-navy">{t('tasks.title')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('tasks.subtitle')}
          </p>
        </div>

        {/* Escalation Scan Trigger */}
        <button
          onClick={handleTriggerEscalation}
          disabled={scanning}
          className="flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white px-3.5 py-2 rounded text-xs font-semibold shadow transition"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{scanning ? t('tasks.scanningBtn') : t('tasks.scanBtn')}</span>
        </button>
      </div>

      {scanResult && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{scanResult}</span>
          </div>
          <button onClick={() => setScanResult(null)} className="font-bold hover:underline">
            {t('actions.dismiss')}
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { key: 'ALL', label: t('tasks.filterAll') },
          { key: 'MY_TASKS', label: t('tasks.filterMy') },
          { key: 'DEPT_TASKS', label: t('tasks.filterDept') },
          { key: 'DUE_SOON', label: t('tasks.filterDueSoon') },
          { key: 'OVERDUE', label: t('tasks.filterOverdue') },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key as any)}
            className={`px-3 py-1.5 rounded border transition font-semibold ${
              activeFilter === f.key
                ? 'bg-gov-blue text-white border-gov-blue'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tasks Table */}
      <Card>
        {loading ? (
          <div className="py-12 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
            <span>{t('tasks.loading')}</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">{t('tasks.empty')}</div>
        ) : (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-semibold">{t('tasks.tableDesc')}</th>
                  <th className="p-3 font-semibold">{t('tasks.tableEntity')}</th>
                  <th className="p-3 font-semibold">{t('tasks.tableAssigned')}</th>
                  <th className="p-3 font-semibold">{t('tasks.tableEscalation')}</th>
                  <th className="p-3 font-semibold">{t('tasks.tablePriority')}</th>
                  <th className="p-3 font-semibold">{t('tasks.tableDueDate')}</th>
                  <th className="p-3 font-semibold text-right">{t('tasks.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{task.title}</div>
                      {task.description && <div className="text-[11px] text-slate-500 mt-0.5">{task.description}</div>}
                    </td>
                    <td className="p-3 font-mono">
                      {task.application ? (
                        <div>
                          <span className="font-bold text-gov-navy">{task.application.applicationNumber}</span>
                          <div className="text-[10px] text-slate-500 font-sans">
                            {task.application.institution.name}
                          </div>
                        </div>
                      ) : (
                        <span>{task.relatedEntityType}</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-700">
                      {task.assignedTo?.fullName || 'Engineering Scrutiny Desk'}
                    </td>
                    <td className="p-3">{getEscalationBadge(task.escalationLevel)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : task.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-700">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      {task.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => handleMarkComplete(task.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                        >
                          {t('tasks.markCompleted')}
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px]">{t('tasks.completed')}</span>
                      )}
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
