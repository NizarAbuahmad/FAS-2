/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AdminUser, UserRole } from "../types";
import { translations } from "../utils/translations";
import { ShieldAlert, Plus, Trash2, Key, Users, AlertCircle, Shield } from "lucide-react";

interface UserManagerProps {
  currentLang: "en" | "ar";
  users: AdminUser[];
  userRole: UserRole;
  onSaveUser: (user: Partial<AdminUser>) => Promise<boolean>;
  onDeleteUser: (id: string) => Promise<boolean>;
}

export default function UserManager({
  currentLang,
  users,
  userRole,
  onSaveUser,
  onDeleteUser
}: UserManagerProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("Viewer");
  const [newPassword, setNewPassword] = useState("");
  const [errorWord, setErrorWord] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== "Admin") {
      setErrorWord(isRtl ? "فقط مسؤولو النظام يمكنهم تعيين أو تعديل الحسابات الصالحة للدخول." : "Only High Level Administrators can appoint or remove login credentials.");
      return;
    }

    if (!newUsername || !newEmail) {
      setErrorWord(isRtl ? "الرجاء إدخال اسم المستخدم والبريد الإلكتروني." : "Please enter both Username tag and email login addresses.");
      return;
    }

    setIsSaving(true);
    setErrorWord("");

    try {
      const payload: Partial<AdminUser> = {
        username: newUsername,
        email: newEmail,
        role: newRole,
        password: newPassword
      };

      if (editingUserId) {
        payload.id = editingUserId;
      }

      const result = await onSaveUser(payload);

      if (result) {
        setEditingUserId(null);
        setNewUsername("");
        setNewEmail("");
        setNewRole("Viewer");
        setNewPassword("");
      } else {
        setErrorWord(isRtl ? "فشل حفظ التعديلات في قاعدة البيانات." : "Failure communicating database update.");
      }
    } catch {
      setErrorWord(isRtl ? "خطأ في الاتصال بالخادم." : "Database validation failure.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (user: AdminUser) => {
    setEditingUserId(user.id);
    setNewUsername(user.username);
    setNewEmail(user.email);
    setNewRole(user.role);
    setNewPassword(user.password || "");
    setErrorWord("");
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setNewUsername("");
    setNewEmail("");
    setNewRole("Viewer");
    setNewPassword("");
    setErrorWord("");
  };

  const handleDeleteUser = async (id: string) => {
    if (userRole !== "Admin") {
      alert("Only High-Level administrators have clearance to revoke permissions.");
      return;
    }

    if (confirm(isRtl ? "هل أنت متأكد من حذف هذا الحساب نهائياً من النظام وسحب صلاحيات الدخول؟" : "Are you sure you want to permanently delete this user profile and revoke access?")) {
      await onDeleteUser(id);
      if (editingUserId === id) {
        cancelEditing();
      }
    }
  };

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Upper info header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-sky-600" size={22} />
            <span>{t.dashUsers}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isRtl 
              ? "إدارة حسابات الهيئة التدريسية والإدارية، وتعيين كلمات المرور، وتخصيص صلاحيات الدخول والنشر." 
              : "Appoint administrators, edit publication clearances, set secure access passwords, and review login tags."}
          </p>
        </div>
      </div>

      {userRole !== "Admin" && (
        <div className="p-4 bg-amber-500/10 border border-amber-550/20 text-text dark:text-amber-450 text-xs rounded-xl flex items-center gap-2 font-semibold font-sans">
          <ShieldAlert size={15} />
          <span>Restricted Clearances: Only Admins can modify accounts list. Your clearance: {userRole}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Adding/Editing Credentials (Admin Only) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-850 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-850 dark:text-white pb-3 border-b border-light dark:border-slate-850 flex items-center gap-1.5">
            <Shield className="text-sky-600" size={16} />
            <span>{editingUserId ? (isRtl ? "تعديل حساب موظف قائم" : "Edit Profile Credentials") : t.umAddBtn}</span>
          </h3>

          <form onSubmit={handleCreateUser} className="space-y-4">
            
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username-user" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.umUsername}</label>
              <input
                type="text"
                id="username-user"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. samir_admissions"
                disabled={userRole !== "Admin"}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email-user" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.umEmail}</label>
              <input
                type="email"
                id="email-user"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="samir@firstacademy.edu.jo"
                disabled={userRole !== "Admin"}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password-user" className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <Key size={12} className="text-sky-500" />
                <span>{isRtl ? "رمز المرور للتحقق الآمن" : "Secure Access Key (Password)"}</span>
              </label>
              <input
                type="text"
                id="password-user"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={editingUserId ? (isRtl ? "اتركه فارغاً للاحتفاظ بكلمة المرور الحالية" : "Leave blank to keep current password") : (isRtl ? "اكتب كلمة المرور (الافتراضي: admin123)" : "e.g. admin123 (Default if blank)")}
                disabled={userRole !== "Admin"}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none font-mono"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                {isRtl ? "يتم تشفير كلمة المرور وتمليحها تلقائياً على الخادم لضمان أقصى درجات الأمان." : "Passwords are automatically salted and cryptographically hashed on the backend for hardened production safety."}
              </p>
            </div>

            {/* Role selections */}
            <div className="space-y-1.5">
              <label htmlFor="role-user" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.umRole}</label>
              <select
                id="role-user"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                disabled={userRole !== "Admin"}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none font-semibold"
              >
                <option value="Admin">{isRtl ? "مدير نظام" : "Admin"}</option>
                <option value="Editor">{isRtl ? "محرر محتوى" : "Editor"}</option>
                <option value="Viewer">{isRtl ? "مستعرض تقارير" : "Viewer"}</option>
              </select>
            </div>

            {errorWord && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-400 rounded-xl text-xs font-semibold flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5" />
                <span>{errorWord}</span>
              </div>
            )}

            <div className="flex gap-2.5">
              {editingUserId && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-sm transition-all"
                >
                  {isRtl ? "إلغاء التعديل" : "Cancel"}
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving || userRole !== "Admin"}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Plus size={15} />
                <span>{isSaving ? "Saving..." : (editingUserId ? (isRtl ? "تحديث الحساب" : "Save Changes") : t.umAddBtn)}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Credentials table directory */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-sm">
          <h3 className="text-base font-bold text-slate-850 dark:text-white pb-3 border-b border-light dark:border-slate-850 flex items-center justify-between">
            <span>{isRtl ? "الحسابات النشطة وعلامات الصلاحية" : "Active Credentials Directory"}</span>
            <span className="text-xs font-mono font-bold text-slate-400">{users.length} accounts</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-[13px]" dir={isRtl ? "rtl" : "ltr"}>
              <thead>
                <tr className="text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-850 text-left rtl:text-right">
                  <th className="py-2.5 px-1">{t.umUsername}</th>
                  <th className="py-2.5 px-1">{t.umRole}</th>
                  <th className="py-2.5 px-1 text-right rtl:text-left">{isRtl ? "الخيارات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {users.map((item) => {
                  let roleLabel = item.role;
                  if (currentLang === "ar") {
                    if (item.role === "Admin") roleLabel = "مدير نظام" as any;
                    else if (item.role === "Editor") roleLabel = "محرر محتوى" as any;
                    else if (item.role === "Viewer") roleLabel = "مستعرض تقارير" as any;
                  }
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/10">
                      <td className="py-3 px-1">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-slate-800 dark:text-slate-100">@{item.username}</p>
                          <span title={isRtl ? "محمي بنظام التشفير" : "Protected by secure cryptographic hashing system"}>
                            <Key size={11} className="text-emerald-500 shrink-0" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-450 truncate font-medium font-mono">{item.email}</p>
                      </td>
                      <td className="py-3 px-1 font-semibold text-xs">
                        <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          item.role === "Admin"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-450"
                            : item.role === "Editor"
                            ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                            : "bg-slate-200/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}>
                          {roleLabel}
                        </span>
                      </td>
                      <td className="py-3 px-1 text-right rtl:text-left">
                        <div className="flex items-center justify-end gap-1">
                          {userRole === "Admin" && (
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-1 px-2.5 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-lg text-xs font-bold transition-colors"
                            >
                              {isRtl ? "تعديل" : "Edit"}
                            </button>
                          )}
                          
                          {item.username !== "nizar_admin" ? (
                            <button
                              onClick={() => handleDeleteUser(item.id)}
                              disabled={userRole !== "Admin"}
                              className="p-1 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                              aria-label="Remove Profile"
                            >
                              <Trash2 size={11} className="text-rose-600" />
                              <span>{isRtl ? "حذف" : "Remove"}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 uppercase font-sans font-bold tracking-wider px-2 block">
                              Locked
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
