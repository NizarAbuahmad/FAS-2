/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CustomPage, UserRole } from "../types";
import { translations } from "../utils/translations";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  FileText, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  Menu,
  CheckCircle2,
  Calendar
} from "lucide-react";

interface PagesManagerProps {
  currentLang: "en" | "ar";
  pages: CustomPage[];
  userRole: UserRole;
  onSavePage: (page: Partial<CustomPage>) => Promise<boolean>;
  onDeletePage: (id: string) => Promise<boolean>;
}

export default function PagesManager({
  currentLang,
  pages,
  userRole,
  onSavePage,
  onDeletePage
}: PagesManagerProps) {
  const [editingPage, setEditingPage] = useState<Partial<CustomPage> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState("");
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  const handleEditClick = (page: CustomPage) => {
    setEditingPage({ ...page });
    setErrorText("");
  };

  const handleCreateNewClick = () => {
    setEditingPage({
      titleEn: "",
      titleAr: "",
      slug: "",
      contentEn: "",
      contentAr: "",
      published: true,
      nav: true
    });
    setErrorText("");
  };

  const handleSavePageData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === "Viewer") {
      alert(t.umRestriction);
      return;
    }

    if (!editingPage?.titleEn?.trim() || !editingPage?.titleAr?.trim()) {
      setErrorText(isRtl ? "يرجى تعبئة عنوان الصفحة باللغتين الإنجليزية والعربية" : "Both English and Arabic Page Titles are required.");
      return;
    }

    setIsSaving(true);
    setErrorText("");

    try {
      const success = await onSavePage(editingPage);
      if (success) {
        setEditingPage(null);
      } else {
        setErrorText(isRtl ? "فشل حفظ الصفحة في قاعدة البيانات" : "Fatal error committing page structure.");
      }
    } catch (err) {
      setErrorText(isRtl ? "حدث خطأ غير متوقع أثناء الحفظ" : "An unexpected error occurred during database save operation.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (userRole === "Viewer") {
      alert(t.umRestriction);
      return;
    }

    const confirmMsg = isRtl 
      ? "هل أنت متأكد من حذف هذه الصفحة تماماً؟ لا يمكن التراجع عن هذا الإجراء."
      : "Are you sure you want to delete this custom page permanently? This action is irreversible.";
      
    if (window.confirm(confirmMsg)) {
      try {
        await onDeletePage(id);
      } catch (err) {
        alert(isRtl ? "خطأ غير متوقع أثناء حذف الصفحة" : "Fatal error removing page object from db.");
      }
    }
  };

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* HEADER SECTION AREA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111111] p-6 border border-white/5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-black text-white px-1 flex items-center gap-2">
            <FileText className="text-amber-500" size={22} />
            <span>{isRtl ? "إدارة وتصميم الصفحات الإضافية" : "Dynamic Custom Pages Hub"}</span>
          </h1>
          <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider px-1">
            {isRtl ? "إضافة وحذف صفحات مخصصة وعرضها في شريط التصفح العلوي" : "Add, modify, or delete custom static pages and menu tabs"}
          </p>
        </div>
        
        {!editingPage && (
          <button
            onClick={handleCreateNewClick}
            disabled={userRole === "Viewer"}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 font-extrabold text-black text-xs rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
          >
            <Plus size={15} />
            <span>{isRtl ? "تصميم صفحة جديدة" : "Design New Page"}</span>
          </button>
        )}
      </div>

      {editingPage ? (
        /* CREATE / EDIT DYNAMIC PAGE COMPONENT FORM */
        <form onSubmit={handleSavePageData} className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                title={isRtl ? "إلغاء والعودة" : "Cancel & Go Back"}
              >
                <ArrowLeft size={16} className={isRtl ? "rotate-180" : ""} />
              </button>
              <h2 className="text-base font-bold text-white">
                {editingPage.id 
                  ? (isRtl ? `تعديل الصفحة: ${editingPage.titleAr}` : `Edit Page: ${editingPage.titleEn}`)
                  : (isRtl ? "تصميم صفحة جديدة كلياً" : "Design a Brand New Page")
                }
              </h2>
            </div>
            {editingPage.createdAt && (
              <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                <Calendar size={12} />
                <span>{new Date(editingPage.createdAt).toLocaleDateString(currentLang)}</span>
              </div>
            )}
          </div>

          {errorText && (
            <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-455 text-xs flex items-center gap-3">
              <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title English */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                {isRtl ? "عنوان الصفحة (باللغة الإنجليزية)" : "Page Title (English) *"}
              </label>
              <input
                type="text"
                value={editingPage.titleEn || ""}
                onChange={(e) => setEditingPage({...editingPage, titleEn: e.target.value})}
                placeholder="e.g. Admission Costs"
                required
                className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-all font-sans"
              />
            </div>

            {/* Title Arabic */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                {isRtl ? "عنوان الصفحة (باللغة العربية) *" : "Page Title (Arabic) *"}
              </label>
              <input
                type="text"
                value={editingPage.titleAr || ""}
                onChange={(e) => setEditingPage({...editingPage, titleAr: e.target.value})}
                placeholder="مثال: الرسوم المدرسية والقبول"
                required
                className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-all font-sans text-right"
              />
            </div>

            {/* Custom URL Slug (English only) */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                {isRtl ? "المعرف الفريد URL Slug (باللغة الإنجليزية فقط)" : "URL Slug Identifier (English only)"}
              </label>
              <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-amber-500 transition-colors">
                <span className="bg-white/5 border-r border-white/10 px-4 py-3 text-xs text-gray-500 font-mono select-none flex items-center">
                  #page-
                </span>
                <input
                  type="text"
                  value={editingPage.slug || ""}
                  onChange={(e) => setEditingPage({...editingPage, slug: e.target.value})}
                  placeholder="e.g. school-fees-schedule"
                  className="w-full bg-[#161616] border-0 px-4 py-3 text-sm text-white focus:outline-none focus:ring-0 font-mono"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                {isRtl 
                  ? "سيتم استخدامه في الرابط لتوجيه المستخدمين، اترك الحقل فارغاً للتوليد التلقائي بناء على العنوان."
                  : "If left empty, this is auto-generated based on the English title. Use URL-safe words separated with dashes."
                }
              </p>
            </div>

            {/* Content English */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                {isRtl ? "محتوى الصفحة (باللغة الإنجليزية)" : "Page Content (English)"}
              </label>
              <textarea
                value={editingPage.contentEn || ""}
                onChange={(e) => setEditingPage({...editingPage, contentEn: e.target.value})}
                placeholder="Write page content (Markdown, raw paragraphs or text)..."
                rows={12}
                className="w-full bg-[#161616] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-amber-500 focus:outline-none transition-all font-mono leading-relaxed"
              />
            </div>

            {/* Content Arabic */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                {isRtl ? "محتوى الصفحة (باللغة العربية)" : "Page Content (Arabic)"}
              </label>
              <textarea
                value={editingPage.contentAr || ""}
                onChange={(e) => setEditingPage({...editingPage, contentAr: e.target.value})}
                placeholder="اكتب محتوى الصفحة هنا باللغة العربية..."
                rows={12}
                className="w-full bg-[#161616] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-amber-500 focus:outline-none transition-all font-mono leading-relaxed text-right"
              />
            </div>

            {/* Published / Active Switch */}
            <div className="p-4 bg-[#151515] border border-white/5 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  {isRtl ? "تفعيل ونشر الصفحة" : "Published State"}
                </p>
                <p className="text-[10px] text-gray-500">
                  {isRtl ? "إتاحة عرض الصفحة لزوار الموقع عند الانتقال إليها" : "Whether this page content is live and indexable"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPage({...editingPage, published: !editingPage.published})}
                className={`p-2 rounded-xl border transition-all ${
                  editingPage.published 
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                    : "bg-white/5 border-white/10 text-gray-500"
                }`}
              >
                {editingPage.published ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* Display in Nav Bar */}
            <div className="p-4 bg-[#151515] border border-white/5 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  {isRtl ? "العرض في شريط التصفح" : "Show in Main Navbar"}
                </p>
                <p className="text-[10px] text-gray-500">
                  {isRtl ? "إظهار رابط مباشر في القائمة العلوية" : "Adds a shortcut tab directly to header navigation bar"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPage({...editingPage, nav: !editingPage.nav})}
                className={`p-2 rounded-xl border transition-all ${
                  editingPage.nav 
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                    : "bg-white/5 border-white/10 text-gray-500"
                }`}
              >
                <Menu size={18} />
              </button>
            </div>

          </div>

          {/* Form buttons */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-end items-center">
            <button
              type="button"
              onClick={() => setEditingPage(null)}
              className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs transition-colors"
            >
              {isRtl ? "إلغاء وتراجع" : "Cancel & Revoke"}
            </button>
            <button
              type="submit"
              disabled={isSaving || userRole === "Viewer"}
              className="w-full sm:w-auto px-8 py-2.5 bg-amber-500 hover:bg-amber-600 font-extrabold text-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              <span>{isRtl ? "حفظ التعديلات وقفل الملف" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      ) : (
        /* STANDARD LIST OF RECONSTRUCTED PAGES TABLE */
        <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          {pages.length === 0 ? (
            <div className="p-12 text-center text-gray-500 space-y-3">
              <FileText className="mx-auto opacity-30" size={48} />
              <p className="text-sm font-semibold text-white">
                {isRtl ? "لا توجد صفحات إضافية حالياً" : "No Custom Pages Created Yet"}
              </p>
              <p className="text-xs max-w-sm mx-auto">
                {isRtl 
                  ? "قم بتصميم وإضافة صفحاتك المخصصة الأولى (مثل أجور التسجيل، أو السياسات المعتمدة) الآن."
                  : "Start designing custom pages. They will render beautifully in the site navigation automatically."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" dir={isRtl ? "rtl" : "ltr"}>
                <thead>
                  <tr className="bg-white/5 text-[10px] uppercase tracking-wider text-gray-400 border-b border-white/10">
                    <th className="px-6 py-4 font-bold">{isRtl ? "عنوان الصفحة" : "Page Title"}</th>
                    <th className="px-6 py-4 font-bold">{isRtl ? "معرف الرابط (Slug)" : "Slug Link"}</th>
                    <th className="px-6 py-4 font-bold text-center">{isRtl ? "شريط التصفح" : "Navbar Menu"}</th>
                    <th className="px-6 py-4 font-bold text-center">{isRtl ? "حالة النشر" : "Status"}</th>
                    <th className="px-6 py-4 font-bold text-center">{isRtl ? "تعديل وحذف" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                  {pages.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.01] transition-all">
                      <td className="px-6 py-4 leading-normal">
                        <p className="font-bold text-white text-sm">
                          {isRtl ? p.titleAr : p.titleEn}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {isRtl ? p.titleEn : p.titleAr}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-amber-500">
                        #page-{p.slug}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.nav 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-white/5 text-gray-500 border border-white/5"
                        }`}>
                          {p.nav ? (isRtl ? "نعم" : "Shown") : (isRtl ? "مخفي" : "Hidden")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.published 
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                            : "bg-rose-500/10 text-rose-450 border border-rose-500/20"
                        }`}>
                          {p.published ? (isRtl ? "نشط" : "Published") : (isRtl ? "مسودة" : "Draft")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-2 hover:bg-white/5 text-amber-450 hover:text-amber-400 rounded-lg transition-colors border border-transparent hover:border-white/5"
                            title={isRtl ? "تعديل" : "Edit"}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p.id)}
                            disabled={userRole === "Viewer"}
                            className="p-2 hover:bg-rose-950/20 text-rose-400 hover:text-rose-500 rounded-lg transition-colors border border-transparent hover:border-rose-950/10 disabled:opacity-50"
                            title={isRtl ? "حذف" : "Delete"}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
