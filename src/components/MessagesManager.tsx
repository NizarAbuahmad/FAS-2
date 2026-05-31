/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ContactMessage, UserRole } from "../types";
import { translations } from "../utils/translations";
import { Mail, Check, Trash2, Calendar, Phone, MailOpen, Inbox } from "lucide-react";

interface MessagesManagerProps {
  currentLang: "en" | "ar";
  messages: ContactMessage[];
  userRole: UserRole;
  onMarkRead: (id: string) => Promise<boolean>;
  onDeleteMessage: (id: string) => Promise<boolean>;
}

export default function MessagesManager({
  currentLang,
  messages,
  userRole,
  onMarkRead,
  onDeleteMessage
}: MessagesManagerProps) {
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  const handleMarkRead = async (id: string) => {
    if (userRole === "Viewer") return;
    await onMarkRead(id);
  };

  const handleDelete = async (id: string) => {
    if (userRole === "Viewer") {
      alert(t.umRestriction);
      return;
    }
    if (confirm(isRtl ? "هل أنت متأكد من حذف هذه الرسالة من الأرشيف؟" : "Are you sure you want to delete this message query?")) {
      await onDeleteMessage(id);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox size={22} className="text-sky-600" />
            <span>{t.dashMessages}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isRtl 
              ? "موقع لمراجعة الرسائل الصادرة من تواصل المقبولين والمهتمين بالالتحاق بالطلبات." 
              : "Review direct registrations, schedule tours, and answer admissions questions."}
          </p>
        </div>

        {/* Counter weight */}
        <div className="bg-sky-50 dark:bg-sky-950/40 p-3 px-5 border border-sky-100 dark:border-sky-900 rounded-xl">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
            {unreadCount} {isRtl ? "رسائل معلقة" : "Pending Messages"}
          </span>
        </div>
      </div>

      {/* List content message box */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-850 text-slate-500 font-medium">
            Inbox is currently empty. Test by submitting a form on the Main contact layout!
          </div>
        ) : (
          messages.map((msg) => {
            return (
              <div
                key={msg.id}
                id={`msg-card-${msg.id}`}
                className={`p-6 bg-white dark:bg-slate-950 rounded-2xl border transition-all ${
                  msg.isRead 
                    ? "border-slate-150 dark:border-slate-850 opacity-80" 
                    : "border-sky-200 dark:border-sky-900 shadow-sm shadow-sky-500/5 ring-1 ring-sky-500/10"
                }`}
              >
                
                {/* Upper line: sender in info layout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 dark:border-slate-850 gap-3">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <MailOpen className="text-slate-400" size={14} />
                      <span>{msg.name}</span>
                    </span>
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-450 text-[11px] block">{msg.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-450 font-mono">
                    <Calendar size={12} />
                    <span>{new Date(msg.createdAt).toLocaleString(currentLang === "ar" ? "ar-JO" : "en-US")}</span>
                  </div>
                </div>

                {/* Subject Grade */}
                <div className="py-4 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.msgSubject}</p>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{msg.subject || "No designated grade selected"}</p>
                </div>

                {/* Phone & Message parameters */}
                <div className="space-y-3">
                  
                  {msg.phone && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-md inline-block" dir="ltr">
                      <Phone size={12} className="text-sky-600" />
                      <span>{msg.phone}</span>
                    </div>
                  )}

                  <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-semibold p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                    {msg.message}
                  </p>
                </div>

                {/* Actions bottom bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-850 bg-light flex justify-between items-center mt-4">
                  <div>
                    {!msg.isRead ? (
                      <span className="bg-amber-400/10 text-amber-600 font-sans text-xs font-bold px-3 py-1 rounded-md">
                        {t.msgUnreadBadge}
                      </span>
                    ) : (
                      <span className="bg-slate-500/10 text-slate-500 font-sans text-xs font-bold px-3 py-1 rounded-md">
                        {t.msgReadBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        disabled={userRole === "Viewer"}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 hover:text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                        title={t.msgMarkRead}
                      >
                        <Check size={12} />
                        <span>{isRtl ? "تأكيد القراءة" : "Mark Read"}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={userRole === "Viewer"}
                      className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg disabled:opacity-50"
                      aria-label="Delete message"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
