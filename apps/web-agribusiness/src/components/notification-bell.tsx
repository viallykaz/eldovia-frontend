'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, CheckCheck, TrendingUp, Leaf, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/session-provider';
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  type Notification,
} from '@/lib/api';

function notifIcon(type: string) {
  switch (type) {
    case 'investment_approved': return <TrendingUp size={13} className="text-green-500" />;
    case 'investment_submitted': return <TrendingUp size={13} className="text-yellow-500" />;
    case 'investment_rejected': return <AlertCircle size={13} className="text-red-400" />;
    case 'project_status_change':
    case 'project_phase_change':
    case 'milestone_completed': return <Leaf size={13} className="text-green-400" />;
    case 'forum_post':
    case 'forum_reply': return <Bell size={13} className="text-blue-400" />;
    case 'new_report': return <Bell size={13} className="text-purple-400" />;
    default: return <Bell size={13} className="text-gray-400" />;
  }
}

function NewNotifToast({ notif, onClose }: { notif: Notification; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex items-start gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-2xl p-4 w-80 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="mt-0.5 h-7 w-7 shrink-0 flex items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
        {notifIcon(notif.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{notif.title}</p>
        <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5 line-clamp-2">{notif.message}</p>
      </div>
      <button onClick={onClose} className="text-gray-300 dark:text-white/20 hover:text-gray-500 dark:hover:text-white/50 transition shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Notification | null>(null);
  const prevUnreadRef = useRef(-1);
  const ref = useRef<HTMLDivElement>(null);

  const checkUnread = useCallback(async () => {
    if (!user) return;
    try {
      const { count } = await getUnreadNotificationCount();
      if (prevUnreadRef.current !== -1 && count > prevUnreadRef.current) {
        // New notification arrived — fetch the latest to show a toast
        const fresh = await getMyNotifications(5);
        const newest = fresh.find((n) => !n.isRead);
        if (newest) setToast(newest);
        // If panel is open, refresh its list
        if (open) setNotifications(fresh);
      }
      prevUnreadRef.current = count;
      setUnread(count);
    } catch {}
  }, [user, open]);

  useEffect(() => {
    if (!user) return;
    checkUnread();
    const interval = setInterval(checkUnread, 30_000);
    return () => clearInterval(interval);
  }, [user, checkUnread]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleOpen() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    setLoading(true);
    try {
      const data = await getMyNotifications(20);
      setNotifications(data);
    } catch {}
    finally { setLoading(false); }
  }

  async function handleMarkRead(id: string) {
    await markNotificationRead(id).catch(() => {});
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    setUnread((c) => Math.max(0, c - 1));
  }

  async function handleMarkAll() {
    await markAllNotificationsRead().catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  }

  if (!user) return null;

  return (
    <>
    {toast && <NewNotifToast notif={toast} onClose={() => setToast(null)} />}
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center h-9 w-9 rounded-full text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[9px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h4>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={handleMarkAll} className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1">
                  <CheckCheck size={11} /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-6">
                <div className="h-5 w-5 rounded-full border-2 border-green-400/40 border-t-green-400 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={24} className="mx-auto mb-2 text-gray-300 dark:text-white/20" />
                <p className="text-xs text-gray-400 dark:text-white/30">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkRead(n.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-black/4 dark:border-white/4 last:border-0 hover:bg-black/3 dark:hover:bg-white/3 transition-colors ${n.isRead ? 'opacity-60' : ''}`}
                >
                  <div className="mt-0.5 h-6 w-6 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/8">
                    {notifIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium text-gray-900 dark:text-white truncate ${!n.isRead ? 'font-semibold' : ''}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-gray-400 dark:text-white/25 mt-1">
                      {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
