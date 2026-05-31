/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { GalleryItem, MediaAsset, UserRole } from "../types";
import { translations } from "../utils/translations";
import { 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Layers, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Upload,
  Loader2,
  Filter,
  Eye
} from "lucide-react";

interface GalleryManagerProps {
  currentLang: "en" | "ar";
  gallery: GalleryItem[];
  media: MediaAsset[];
  userRole: UserRole;
  onSaveGalleryItem: (item: Partial<GalleryItem>) => Promise<boolean>;
  onDeleteGalleryItem: (id: string) => Promise<boolean>;
  onUploadMedia?: (media: { name: string; type: string; size: number; content: string }) => Promise<any>;
}

export default function GalleryManager({
  currentLang,
  gallery,
  media,
  userRole,
  onSaveGalleryItem,
  onDeleteGalleryItem,
  onUploadMedia
}: GalleryManagerProps) {
  const [selectedItem, setSelectedItem] = useState<Partial<GalleryItem> | null>(null);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorText, setErrorText] = useState("");
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  const handleSelectItem = (item: GalleryItem) => {
    setSelectedItem({ ...item });
    setErrorText("");
  };

  const handleCreateItem = () => {
    setSelectedItem({
      titleEn: "New School Activity photo",
      titleAr: "صورة جديدة للنشاط المدرسي",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
      categoryEn: "Activities",
      categoryAr: "الأنشطة المدرسية",
      order: gallery.length + 1
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
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64Content = event.target?.result as string;
          const uploadedAsset = await onUploadMedia({
            name: file.name,
            type: file.type,
            size: file.size,
            content: base64Content
          });
          if (uploadedAsset && uploadedAsset.url) {
            setSelectedItem((prev) => prev ? { ...prev, image: uploadedAsset.url } : null);
          } else {
            setUploadError("File upload dispatch aborted by server.");
          }
          setIsUploadingImage(false);
        };
        reader.onerror = () => {
          setUploadError("Error reading asset file.");
          setIsUploadingImage(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setUploadError("Image upload parsing failure.");
        setIsUploadingImage(false);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "categoryEn") {
      const isFacilities = value === "Facilities";
      setSelectedItem((prev) => (prev ? {
        ...prev,
        categoryEn: value,
        categoryAr: isFacilities ? "المرافق المدرسية" : "الأنشطة المدرسية"
      } : null));
    } else {
      setSelectedItem((prev) => (prev ? { ...prev, [name]: name === "order" ? parseInt(value) || 1 : value } : null));
    }
  };

  const handleSaveItem = async () => {
    if (userRole === "Viewer") {
      setErrorText(t.umRestriction);
      return;
    }

    if (!selectedItem?.titleEn || !selectedItem?.titleAr) {
      setErrorText("All bilingual item captions/titles are required.");
      return;
    }

    if (!selectedItem?.image) {
      setErrorText("An image is required.");
      return;
    }

    setIsSaving(true);
    setErrorText("");
    try {
      const success = await onSaveGalleryItem(selectedItem);
      if (success) {
        setSelectedItem(null);
      } else {
        setErrorText("Failure updating database photo gallery.");
      }
    } catch {
      setErrorText("Incorrect gallery schema elements.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async () => {
    if (userRole === "Viewer") {
      setErrorText(t.umRestriction);
      return;
    }

    if (!selectedItem?.id) return;

    const confirmMsg = isRtl
      ? "هل أنت متأكد من حذف هذه الصورة الفعالية نهائياً من قاعدة البيانات المعرض؟"
      : "Are you sure you want to permanently delete this photo from the gallery database?";
    
    if (window.confirm(confirmMsg)) {
      setIsSaving(true);
      try {
        const success = await onDeleteGalleryItem(selectedItem.id);
        if (success) {
          setSelectedItem(null);
        } else {
          setErrorText("Failure deleting selected image.");
        }
      } catch {
        setErrorText("Network validation error on delete.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="space-y-8" dir={isRtl ? "rtl" : "ltr"}>
      {/* Module Title Header Card */}
      <div className="bg-neutral-900 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-950/50 rounded-lg text-blue-400">
              <ImageIcon size={18} />
            </span>
            <h2 className="text-xl font-black text-white">
              {isRtl ? "إدارة معرض صور البراعم والأنشطة" : "Activity Photo Gallery Manager"}
            </h2>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-semibold">
            {isRtl 
              ? "أضف، عدل، رتب أو احذف صور الأنشطة المدرسية والمرافق الفعالة، والتي تظهر بتصنيفاتها داخل قسم (عن المدرسة)."
              : "Create, translate, re-order, or delete high-resolution photos that show interactive facilities or school events."}
          </p>
        </div>

        <button
          onClick={handleCreateItem}
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-all hover:scale-102"
        >
          <Plus size={14} />
          {isRtl ? "إضافة صورة جديدة" : "Add Gallery Photo"}
        </button>
      </div>

      {/* Main Container Split View list vs form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Photo Cards Lists */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-extrabold text-gray-300 uppercase tracking-widest flex items-center gap-2">
            <Layers size={14} className="text-sky-400" />
            {isRtl ? "قائمة الصور الحالية" : "Current Gallery Photos"} ({gallery.length})
          </h3>

          {gallery.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium border border-dashed border-white/10 rounded-2xl bg-neutral-900/50">
              {isRtl ? "بدون صور حالياً. اضغط إضافة صورة جديدة." : "No gallery photos found. Click Add to insert one."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-4 rounded-2xl border text-start cursor-pointer transition-all flex flex-col justify-between h-[240px] ${
                    selectedItem?.id === item.id
                      ? "bg-blue-950/30 border-blue-500/50 shadow-inner"
                      : "bg-[#111] hover:bg-[#151515] border-white/5"
                  }`}
                >
                  <div className="relative w-full h-[120px] rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
                    <img
                      src={item.image}
                      alt={isRtl ? item.titleAr : item.titleEn}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase bg-sky-600 px-2 py-0.5 rounded text-white shadow">
                      {isRtl ? item.categoryAr : item.categoryEn}
                    </span>
                    <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-gray-300 font-bold font-mono">
                      Order: {item.order}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <h4 className="font-extrabold text-white text-xs sm:text-sm line-clamp-2">
                      {isRtl ? item.titleAr : item.titleEn}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Active Form Configurator */}
        <div className="lg:col-span-5">
          {selectedItem ? (
            <div className="bg-neutral-900 border border-white/10 p-6 rounded-3xl space-y-6 sticky top-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-400" />
                  {selectedItem.id ? (isRtl ? "تعديل بيانات الصورة" : "Edit Photo Settings") : (isRtl ? "إضافة صورة جديدة" : "Create Photo Item")}
                </h3>
                {selectedItem.id && (
                  <button
                    onClick={handleDeleteItem}
                    className="p-2 text-red-500 hover:text-red-400 hover:bg-red-550/10 rounded-lg transition"
                    title={isRtl ? "حذف نهائي" : "Delete Slide"}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {errorText && (
                <div className="p-3 bg-red-950/50 border border-red-500/20 text-red-200 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} className="flex-shrink-0 text-red-400" />
                  <span className="font-semibold">{errorText}</span>
                </div>
              )}

              {/* Caption Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                    {isRtl ? "العنوان أو الشرح (بالعربية)" : "Caption / Title (Arabic)"}
                  </label>
                  <input
                    type="text"
                    name="titleAr"
                    value={selectedItem.titleAr || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#161618] border border-white/5 focus:border-blue-500 focus:outline-none p-3 rounded-xl text-xs sm:text-sm font-medium text-white shadow-inner"
                    placeholder="مثل: تدريبات فريق كرة القدم..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                    {isRtl ? "العنوان أو الشرح (بالإنجليزية)" : "Caption / Title (English)"}
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    value={selectedItem.titleEn || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#161618] border border-white/5 focus:border-blue-500 focus:outline-none p-3 rounded-xl text-xs sm:text-sm font-medium text-white shadow-inner"
                    placeholder="e.g., Football Team Training Session..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                      {isRtl ? "التصنيف والتبويب" : "Category Tag"}
                    </label>
                    <select
                      name="categoryEn"
                      value={selectedItem.categoryEn || "Activities"}
                      onChange={handleInputChange}
                      className="w-full bg-[#161618] border border-white/5 focus:border-blue-500 focus:outline-none p-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-inner"
                    >
                      <option value="Facilities">{isRtl ? "مرافق المدرسة" : "Facilities"}</option>
                      <option value="Activities">{isRtl ? "الأنشطة المدرسية" : "Activities"}</option>
                    </select>
                  </div>

                  {/* Ordering Priority */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                      {isRtl ? "رقم المحاذاة (الترتيب)" : "Display Order"}
                    </label>
                    <input
                      type="number"
                      name="order"
                      min={1}
                      value={selectedItem.order || 1}
                      onChange={handleInputChange}
                      className="w-full bg-[#161618] border border-white/5 focus:border-blue-500 focus:outline-none p-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-inner font-mono"
                    />
                  </div>
                </div>

                {/* Image Selection Block */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                    {isRtl ? "صورة الخلفية الفعالية" : "Active Photo Image URL"}
                  </label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="image"
                      value={selectedItem.image || ""}
                      onChange={handleInputChange}
                      className="w-full bg-[#161618] border border-white/5 focus:border-blue-500 focus:outline-none p-3 rounded-xl text-xs sm:text-sm font-medium text-white shadow-inner font-mono leading-relaxed"
                      placeholder="https://images.unsplash.com/..."
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowMediaSelector((prev) => !prev)}
                      className="px-3.5 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-xl border border-white/10 transition"
                      title={isRtl ? "اختر من مكتبة الصور" : "Pick from Library"}
                    >
                      <Layers size={15} />
                    </button>
                  </div>

                  {/* Library Media popup dropdown list for absolute single-click integration */}
                  {showMediaSelector && (
                    <div className="p-3 bg-[#111] border border-white/10 rounded-2xl max-h-[160px] overflow-y-auto space-y-2.5">
                      <p className="text-[10px] font-extrabold uppercase text-gray-500">
                        {isRtl ? "اختر بلمسة واحدة من الملفات المرفوعة:" : "Click one to link uploaded file:"}
                      </p>
                      {media.length === 0 ? (
                        <p className="text-[11px] text-gray-400">{isRtl ? "لا توجد ملفات في المعرض كحزمة مبدئية." : "No files uploaded to the Media folder."}</p>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {media.map((asset) => (
                            <div
                              key={asset.id}
                              onClick={() => {
                                setSelectedItem((prev) => prev ? { ...prev, image: asset.url } : null);
                                setShowMediaSelector(false);
                              }}
                              className="w-full h-11 rounded-lg overflow-hidden cursor-pointer border border-white/10 hover:border-blue-500 transition-all bg-black bg-center"
                              title={asset.name}
                            >
                              <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Drop File Upload Box */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-xl text-xs font-bold border border-white/10 transition flex items-center justify-center gap-2"
                    >
                      {isUploadingImage ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                      {isRtl ? "تحميل صورة جديدة للهاتف" : "Upload Image Device"}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFormFileUpload}
                    />
                  </div>

                  {uploadError && (
                    <p className="text-[10px] text-red-500 font-extrabold">{uploadError}</p>
                  )}

                  {selectedItem.image && (
                    <div className="relative w-full h-[150px] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                      <img
                        src={selectedItem.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action operations buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={handleSaveItem}
                  disabled={isSaving}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-black rounded-xl shadow transition flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {isSaving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={14} />
                      {isRtl ? "حفظ التغييرات بالخادم" : "Save Changes"}
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-gray-300 text-xs font-bold rounded-xl transition"
                >
                  {isRtl ? "إلغاء التعديل" : "Cancel"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-950 border border-dashed border-white/5 p-12 rounded-3xl text-center text-gray-500 space-y-3">
              <div className="bg-neutral-900 mx-auto w-12 h-12 rounded-full flex items-center justify-center text-gray-400">
                <ArrowRight size={20} className="stroke-2" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-gray-400">
                  {isRtl ? "لم يتم تحديد أي شريحة للتعديل" : "No photo selected"}
                </p>
                <p className="text-[11px] text-gray-550 leading-relaxed font-semibold max-w-xs mx-auto">
                  {isRtl 
                    ? "اختر أي صورة معلم من القائمة المقابلة لمراجعتها وتعديل مسمياتها وببياناتها، أو انقر (إضافة صورة جديدة) لإنشاء مادة جديدة بالكامل."
                    : "Select a photo from the left to edit, or click dynamic Add Photo directly to generate a new entry."}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
