import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, CheckCheck, Mail, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { StatusBadge } from '../ui/Badge';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, openSimulatedEmail } = useNotifications();
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900 bg-opacity-40 transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gov-navy text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold">{t('notifications.title')}</h2>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} {t('notifications.newBadge')}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-amber-300 hover:text-white flex items-center space-x-1 transition"
                  title={t('notifications.markAllRead')}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('notifications.markAllRead')}</span>
                </button>
              )}
              <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('notifications.empty')}</div>
            ) : (
              notifications.map((notif) => {
                const title =
                  language === 'hi' && notif.titleHi
                    ? notif.titleHi
                    : language === 'mr' && notif.titleMr
                    ? notif.titleMr
                    : notif.title;
                const message =
                  language === 'hi' && notif.messageHi
                    ? notif.messageHi
                    : language === 'mr' && notif.messageMr
                    ? notif.messageMr
                    : notif.message;

                return (
                  <div
                    key={notif.id}
                    className={`p-3 rounded hover:bg-slate-50 transition text-xs space-y-1.5 ${
                      !notif.isRead ? 'bg-blue-50/50 border-l-2 border-gov-blue' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-slate-800 flex items-center">
                        {notif.priority === 'URGENT' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 mr-1 flex-shrink-0" />
                        )}
                        {title}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-[11px]">{message}</p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => {
                          markAsRead(notif.id);
                          openSimulatedEmail({
                            to: 'official-recipient@institution.edu.in',
                            subject: `[AICTE Notice] ${title}`,
                            body: `Dear Stakeholder,\n\n${message}\n\nPlease visit the AICTE Approval Portal to take appropriate administrative action.\n\nRegards,\nCentral Approval & Scrutiny Bureau\nAICTE, New Delhi`,
                            date: new Date(notif.createdAt).toLocaleString(),
                          });
                        }}
                        className="text-[11px] text-gov-blue hover:underline flex items-center font-medium"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        {t('notifications.viewEmailTemplate')}
                      </button>

                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-[10px] text-slate-400 hover:text-slate-600"
                        >
                          {t('notifications.markRead')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
