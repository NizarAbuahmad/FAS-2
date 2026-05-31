/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Post, MediaAsset, UserRole } from "../types";
import { translations } from "../utils/translations";
import { compressImage } from "../utils/imageCompressor";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  FileText, 
  ArrowLeft,
  Settings,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Loader2
} from "lucide-react";

interface PostManagerProps {
  currentLang: "en" | "ar";
  posts: Post[];
  media: MediaAsset[];
  userRole: UserRole;
  onSavePost: (post: Partial<Post>) => Promise<boolean>;
  onDeletePost: (id: string) => Promise<boolean>;
  onUploadMedia?: (media: { name: string; type: string; size: number; content: string }) => Promise<any>;
}

export default function PostManager({
  currentLang,
  posts,
  media,
  userRole,
  onSavePost,
  onDeletePost,
  onUploadMedia
}: PostManagerProps) {
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorText, setErrorText] = useState("");
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  const handleEditClick = (post: Post) => {
    setEditingPost({ ...post });
    setErrorText("");
  };

  const handleCreateNewClick = () => {
    setEditingPost({
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
      descriptionEn: "",
      descriptionAr: "",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
      categoryEn: "Academics",
      categoryAr: "الأنشطة الأكاديمية",
      authorEn: "Admissions Hub",
      authorAr: "قسم القبول والتسجيل",
      published: true
    });
    setErrorText("");
  };

  const handleFormFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userRole === "Viewer") {
      alert(t.umRestriction);
      return;
    }
    if (e.target.files && e.target.files[0] && onUploadMedia) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are permitted.");
        return;
      }
      setIsUploadingImage(true);
      setUploadError("");
      try {
        const compressedBase64 = await compressImage(file);
        const approximateSize = Math.round((compressedBase64.length * 3) / 4);
        
        const uploadedAsset = await onUploadMedia({
          name: file.name,
          type: "image/jpeg",
          size: approximateSize,
          content: compressedBase64
        });
        if (uploadedAsset && uploadedAsset.url) {
          setEditingPost((prev) => prev ? { ...prev, image: uploadedAsset.url } : null);
        } else {
          setUploadError("File upload dispatch aborted by server.");
        }
      } catch (err) {
        setUploadError("Image compression or upload failure.");
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const selectMediaImage = (url: string) => {
    setEditingPost((prev) => prev ? { ...prev, image: url } : null);
    setShowMediaSelector(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditingPost((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditingPost((prev) => (prev ? { ...prev, [name]: checked } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === "Viewer") {
      setErrorText(t.umRestriction);
      return;
    }

    if (!editingPost?.titleEn || !editingPost?.titleAr || !editingPost?.contentEn || !editingPost?.contentAr) {
      setErrorText("All bilingual Titles and Content sections are required.");
      return;
    }

    setIsSaving(true);
    setErrorText("");
    try {
      const success = await onSavePost(editingPost);
      if (success) {
        setEditingPost(null);
      } else {
        setErrorText("Failure updating posts in databases.");
      }
    } catch {
      setErrorText("Mismatched database payload.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (userRole === "Viewer") {
      alert(t.umRestriction);
      return;
    }
    if (confirm(isRtl ? "هل أنت متأكد من حذف هذا المقال نهائياً من الأرشيف الدراسي؟" : "Are you sure you want to permanently delete this school article?")) {
      await onDeletePost(id);
    }
  };

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.pmHeader}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isRtl 
              ? "تفقد منشورات المدرسة وأرشيف الأنباء، وقم بإنشاء وتعديل الأخبار للعامة." 
              : "Review academic news archives, change visual assets, and draft announcements."}
          </p>
        </div>
        
        {!editingPost && (
          <button
            id="btn-cms-new-post"
            onClick={handleCreateNewClick}
            disabled={userRole === "Viewer"}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Plus size={16} />
            <span>{t.pmAddBtn}</span>
          </button>
        )}
      </div>

      {userRole === "Viewer" && (
        <div className="p-4 bg-amber-500/10 border border-amber-550/20 text-amber-800 dark:text-amber-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{t.umRestriction} (Viewer Access ONLY)</span>
        </div>
      )}

      {/* Editor Panel */}
      {editingPost ? (
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-850 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-850">
            <button
              onClick={() => setEditingPost(null)}
              className="p-2 text-slate-550 hover:text-slate-800 dark:hover:text-white bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <ArrowLeft size={16} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-150">
              {editingPost.id ? t.pmEditTitle : t.pmAddBtn}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Titles Bilingual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.pmTitleEn} *</label>
                <input
                  type="text"
                  name="titleEn"
                  required
                  value={editingPost.titleEn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.pmTitleAr} *</label>
                <input
                  type="text"
                  name="titleAr"
                  required
                  value={editingPost.titleAr}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 text-right"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Image Link & Visual Cover Upload Setup (any part inside the site) */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-850">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide block">{t.pmImage}</label>
              
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Thumb preview panel */}
                <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center flex-shrink-0">
                  {editingPost.image ? (
                    <img
                      src={editingPost.image}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center text-slate-450 p-2">
                      <ImageIcon size={24} className="mx-auto text-slate-350 mb-1" />
                      <p className="text-[10px] font-semibold">No Cover Image Loaded</p>
                    </div>
                  )}
                </div>

                {/* Cover file actions */}
                <div className="flex-grow w-full space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMediaSelector((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-250 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <ImageIcon size={12} className="text-sky-600" />
                      <span>{t.cmSelectMedia}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                    >
                      {isUploadingImage ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Upload size={12} />
                      )}
                      <span>{isUploadingImage ? "Uploading..." : (isRtl ? "رفع غلاف جديد" : "Upload Cover File")}</span>
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFormFileUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  {/* Manual URL entry field */}
                  <div className="space-y-1">
                    <input
                      type="text"
                      name="image"
                      value={editingPost.image}
                      onChange={handleInputChange}
                      placeholder="Insert absolute URL, fallback path or upload a new covers file..."
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-sky-500 font-mono"
                    />
                    <p className="text-[9px] text-slate-450 leading-relaxed">
                      Either upload a new high-quality image from your computer or supply any CDN url paths manually.
                    </p>
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-455 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Media assets list choices */}
              {showMediaSelector && (
                <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850 space-y-3 mt-3 animate-fadeIn">
                  <div className="flex justify-between items-center pb-2 border-b border-light dark:border-slate-850">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{t.cmSelectMedia}</span>
                    <button
                      type="button"
                      onClick={() => setShowMediaSelector(false)}
                      className="text-xs text-rose-500 font-bold"
                    >
                      Close selection library
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 max-h-40 overflow-y-auto p-1 text-center">
                    {media.filter((m) => m.type.startsWith("image/")).map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => selectMediaImage(asset.url)}
                        className="group relative cursor-pointer border rounded-lg overflow-hidden h-14 hover:border-sky-500 transition-all bg-slate-100 border-slate-200 dark:border-slate-800"
                      >
                        <img
                          src={asset.url}
                          alt="Option cover"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold">
                          Pick
                        </div>
                      </div>
                    ))}
                    {media.filter((m) => m.type.startsWith("image/")).length === 0 && (
                      <p className="col-span-full text-xs text-slate-500 py-3">
                        No image assets uploaded yet. Try clicking "Upload Cover File" above to load one!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Summaries / Descriptions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.pmDescEn}</label>
                <textarea
                  name="descriptionEn"
                  rows={2}
                  value={editingPost.descriptionEn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-2" dir="rtl">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide text-right block">{t.pmDescAr}</label>
                <textarea
                  name="descriptionAr"
                  rows={2}
                  value={editingPost.descriptionAr}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 text-right"
                />
              </div>
            </div>

            {/* Content Body Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.pmContentEn} *</label>
                <textarea
                  name="contentEn"
                  required
                  rows={6}
                  value={editingPost.contentEn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-2" dir="rtl">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide text-right block">{t.pmContentAr} *</label>
                <textarea
                  name="contentAr"
                  required
                  rows={6}
                  value={editingPost.contentAr}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 text-right"
                />
              </div>
            </div>

            {/* Extra Metadata Configurations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-850">
              
              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category (EN/AR)</label>
                <select
                  name="categoryEn"
                  value={editingPost.categoryEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    const mapAr: Record<string, string> = {
                      "Admissions": "القبول والتسجيل",
                      "Academics": "الأنشطة الأكاديمية",
                      "Events": "الفعاليات المدرسية",
                      "General": "عام"
                    };
                    setEditingPost((prev) => prev ? { 
                      ...prev, 
                      categoryEn: val, 
                      categoryAr: mapAr[val] || "عام" 
                    } : null);
                  }}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="Admissions">Admissions</option>
                  <option value="Academics">Academics</option>
                  <option value="Events">Events</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.pmAuthor}</label>
                <input
                  type="text"
                  name="authorEn"
                  value={editingPost.authorEn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
              </div>

              {/* Publishing toggler */}
              <div className="flex items-center space-x-3 space-x-reverse h-full pt-6">
                <input
                  type="checkbox"
                  id="published-toggle"
                  name="published"
                  checked={editingPost.published}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 accent-sky-600 border-slate-300 dark:border-slate-700 rounded-lg"
                />
                <label htmlFor="published-toggle" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {t.pmStatusPublished}
                </label>
              </div>

            </div>

            {errorText && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-400 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{errorText}</span>
              </div>
            )}

            {/* Form actions */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || userRole === "Viewer"}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-650 hover:from-sky-750 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : t.pmSaveBtn}
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* List Archive */
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-850 p-6 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-[13px]" dir={isRtl ? "rtl" : "ltr"}>
              <thead>
                <tr className="text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-850 text-left rtl:text-right">
                  <th className="pb-3 px-3">Title / Subject</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Author</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">{t.pmViews}</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right rtl:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-3 font-semibold text-slate-800 dark:text-slate-100">
                      <div className="max-w-xs sm:max-w-md">
                        <p className="line-clamp-1">{post.titleEn}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-550 mt-1 line-clamp-1 text-right rtl:text-left" dir="rtl">{post.titleAr}</p>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="bg-sky-500/10 text-sky-600 dark:text-sky-400 font-sans text-xs font-bold px-2 py-0.5 rounded-md">
                        {currentLang === "en" ? post.categoryEn : post.categoryAr}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-400">{currentLang === "en" ? post.authorEn : post.authorAr}</td>
                    <td className="py-4 px-3 text-slate-500 dark:text-slate-500 font-mono font-bold">{post.date}</td>
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-400 font-mono font-semibold">{post.views || 0}</td>
                    <td className="py-4 px-3">
                      {post.published ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <Eye size={14} />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                          <EyeOff size={14} />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-right rtl:text-left">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(post)}
                          className="p-2 text-sky-600 hover:text-sky-700 bg-sky-50 dark:bg-sky-950/30 rounded-lg hover:scale-105 transition-all"
                          aria-label="Edit Post"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(post.id)}
                          disabled={userRole === "Viewer"}
                          className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/30 rounded-lg hover:gradient hover:scale-105 transition-all disabled:opacity-50"
                          aria-label="Delete Post"
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
        </div>
      )}

    </div>
  );
}
