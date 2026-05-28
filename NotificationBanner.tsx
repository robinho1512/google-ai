import React from "react";
import { Bell, Info, ShieldCheck, X } from "lucide-react";
import { motion } from "motion/react";

interface Notification {
  id: string;
  type: "warning" | "success" | "info";
  message: string;
  date: string;
  read: boolean;
}

interface NotificationBannerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationBanner({
  notifications,
  onDismiss,
  onClearAll,
}: NotificationBannerProps) {
  const activeAlerts = notifications.filter((n) => !n.read);

  if (activeAlerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-amber-50 border-b border-amber-200 py-3 px-4 sm:px-6 relative"
      id="notification-container"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-full shrink-0">
            <Bell className="h-5 w-5 animate-bounce" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Lembretes importantes para a saúde do seu pet
            </p>
            <div className="flex flex-col gap-1 mt-1">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-2 text-xs text-amber-800">
                  {alert.type === "warning" ? (
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 inline-block" />
                  ) : alert.type === "success" ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 inline-block" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 inline-block" />
                  )}
                  <span>
                    {alert.message} <span className="opacity-60">({alert.date})</span>
                  </span>
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="hover:text-red-600 transition-colors ml-2"
                    title="Ignorar"
                  >
                    <X className="w-3.5 h-3.5 inline" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs font-medium text-amber-800 underline hover:text-amber-900 self-end sm:self-center shrink-0"
        >
          Limpar todos
        </button>
      </div>
    </motion.div>
  );
}
