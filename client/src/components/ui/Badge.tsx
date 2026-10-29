import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const { t } = useTranslation();

  const getBadgeConfig = () => {
    switch (status) {
      case 'APPROVED':
      case 'VERIFIED':
      case 'COMPLIANT':
      case 'COMPLETED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />,
        };
      case 'UNDER_SCRUTINY':
      case 'UNDER_REVIEW':
      case 'INITIAL_VALIDATION':
      case 'IN_PROGRESS':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          icon: <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />,
        };
      case 'DOCUMENTS_REQUIRED':
      case 'PENDING_EVIDENCE':
      case 'CLARIFICATION_NEEDED':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />,
        };
      case 'OVERDUE':
      case 'NON_COMPLIANT':
      case 'REJECTED':
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          icon: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />,
        };
      case 'ESCALATED':
        return {
          bg: 'bg-red-50 text-red-900 border-red-400 font-semibold',
          icon: <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-red-600" />,
        };
      case 'INSPECTION_SCHEDULED':
      case 'SCHEDULED':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-300',
          icon: <Calendar className="w-3.5 h-3.5 mr-1 text-purple-600" />,
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />,
        };
    }
  };

  const config = getBadgeConfig();
  const label = t(`status.${status}`, status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      {config.icon}
      {label}
    </span>
  );
};
