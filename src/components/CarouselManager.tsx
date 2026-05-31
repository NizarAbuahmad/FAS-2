/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { CarouselSlide, MediaAsset, UserRole } from "../types";
import { translations } from "../utils/translations";
import { compressImage } from "../utils/imageCompressor";
import { 
  Save,
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Layers, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Upload,
  Loader2
} from "lucide-react";

interface CarouselManagerProps {
  currentLang: "en" | "ar";
  slides: CarouselSlide[];
  media: MediaAsset[];
  userRole: UserRole;
  onSaveSlide: (slide: Partial<CarouselSlide>) => Promise<boolean>;
  onDeleteSlide: (id: string) => Promise<boolean>;
  onUploadMedia?: (media: { name: string; type: string; size: number; content: string }) => Promise<any>;
}

export default function CarouselManager({
  currentLang,
  slides,
  media,
  userRole,
  onSaveSlide,
  onDeleteSlide,
  onUploadMedia
}: CarouselManagerProps) {
  const [selectedSlide, setSelectedSlide] = useState<Partial<CarouselSlide> | null>(null);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorText, setErrorText] = useState("");
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  const handleSelectSlide = (slide: CarouselSlide) => {
    setSelectedSlide({ ...slide });
    setErrorText("");
  };

  const handleCreateSlide = () => {
    setSelectedSlide({
      titleEn: "New Slide Heading En",
      titleAr: "عنوان جديد للشريحة العربية",
      subtitleEn: "New Slide Subtitle En",
      subtitleAr: "شرح جديد للشريحة العربية",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
      link: "#",
      order: slides.length + 1
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
          setSelectedSlide((prev) => prev ? { ...prev, image: uploadedAsset.url } : null);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSelectedSlide((prev) => (prev ? { ...prev, [name]: name === "order" ? parseInt(value) || 1 : value } : null));
  };

  const handleSaveSlide = async () => {
    if (userRole === "Viewer") {
      setErrorText(t.umRestriction);
      return;
    }

    if (!selectedSlide?.titleEn || !selectedSlide?.titleAr) {
      setErrorText("All bilingual slide Titles are required.");
      return;
    }

    setIsSaving(true);
    setErrorText("");
    try {
      const success = await onSaveSlide(selectedSlide);
      if (success) {
        setSelectedSlide(null);
      } else {
        setErrorText("Failure updating database slides.");
      }
    } catch {
      setErrorText("Mismatched sliders schema.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (userRole === "Viewer") {
      alert(t.umRestriction);
      return;
    }
    if (confirm(isRtl ? "هل أنت متأكد من إزالة شريحة العرض هذه؟" : "Confirm removing this slide overlay?")) {
      await onDeleteSlide(id);
    }
  };

  const selectMediaImage = (url: string) => {
    setSelectedSlide((prev) => prev ? { ...prev, image: url } : null);
    setShowMediaSelector(false);
  };

  const activeSlidesSorted = [...slides].sort((a,b) => a.order - b.order);

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.dashCarousel}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isRtl 
              ? "تحكم بالصور الدوارة في واجهة المدرسة وعاين المظهر البصري بدقة." 
              : "Reorder homepage slides, change text titles, and replace cover dimensions."}
          </p>
        </div>

        {!selectedSlide && (
          <button
            onClick={handleCreateSlide}
            disabled={userRole === "Viewer"}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Plus size={16} />
            <span>Add Slide</span>
          </button>
        )}
      </div>

      {errorText && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-450 text-xs font-bold rounded-xl flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{errorText}</span>
        </div>
      )}

      {/* Grid: Editor Panel / Sliders list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Slides directory list */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-850 dark:text-white pb-3 border-b border-light dark:border-slate-850">
            {isRtl ? "الشرائح المعتمدة حالياً" : "Current Board Slides"}
          </h3>
          
          <div className="space-y-3">
            {activeSlidesSorted.map((slide) => {
              const isEditing = selectedSlide?.id === slide.id;
              return (
                <div
                  key={slide.id}
                  onClick={() => handleSelectSlide(slide)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isEditing
                      ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/20"
                      : "border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 flex-shrink-0">
                    <img
                      src={slide.image}
                      alt="Thumbnail slide"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 bg-slate-900/80 text-[9px] text-white font-bold px-1.5 font-mono">
                      #{slide.order}
                    </span>
                  </div>

                  {/* Desc overflow */}
                  <div className="flex-grow min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {currentLang === "en" ? slide.titleEn : slide.titleAr}
                    </p>
                    <p className="text-[10px] text-slate-450 truncate">
                      {slide.link}
                    </p>
                  </div>

                  {/* Trash action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(slide.id);
                    }}
                    disabled={userRole === "Viewer"}
                    className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex-shrink-0 disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                  </button>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Editor Panel */}
        <div className="lg:col-span-8">
          {selectedSlide ? (
            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-850 p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-light dark:border-slate-850 gap-4">
                <h3 className="text-base font-bold text-slate-850 dark:text-white flex items-center gap-2">
                  <Sparkles className="text-sky-600" size={16} />
                  <span>{isRtl ? "تحرير محتوى الشريحة" : "Carousel Slide Overlays Editor"}</span>
                </h3>
                
                {/* Image confirmation indicator */}
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t.carouselOptimized}</span>
                </div>
              </div>

              {/* Form elements */}
              <div className="space-y-5">
                
                {/* CURRENT IMAGE PREVIEW & UPLOAD TRIGGERS (satisfies "cms i need to see what image is currenlty used and able to change it by uploading new image.") */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {isRtl ? "معاينة الصورة المستخدمة حالياً في العرض والصفحة" : "Verification Panel: Visual Confirmation of Active Background Image"}
                  </label>
                  
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner flex items-center justify-center">
                    <img
                      src={selectedSlide.image}
                      alt="Active Slide Preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Centered label */}
                    <div className="relative z-10 text-center bg-slate-950/85 p-4 rounded-xl border border-white/10 backdrop-blur max-w-sm flex flex-col items-center gap-2">
                      <p className="text-white text-xs font-bold truncate max-w-[280px]">{selectedSlide.image}</p>
                      
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setShowMediaSelector((prev) => !prev)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-white/5 transition-all shadow"
                        >
                          <ImageIcon size={12} />
                          <span>{t.cmSelectMedia}</span>
                        </button>
                        
                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all shadow disabled:opacity-50"
                        >
                          {isUploadingImage ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Upload size={12} />
                          )}
                          <span>{isUploadingImage ? "Uploading..." : (isRtl ? "رفع وحفظ صورة" : "Upload Image")}</span>
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFormFileUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  
                  {uploadError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-450 text-xs font-bold rounded-xl flex items-center gap-2 mt-1">
                      <AlertCircle size={14} />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                {/* Media assets selection modal/popup inside manager */}
                {showMediaSelector && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{t.cmSelectMedia}</span>
                      <button
                        type="button"
                        onClick={() => setShowMediaSelector(false)}
                        className="text-xs text-rose-500 font-bold"
                      >
                        Close library close
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1 text-center">
                      {media.filter(m => m.type.startsWith("image/")).map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => selectMediaImage(asset.url)}
                          className="group relative cursor-pointer border dark:border-slate-800 rounded-lg overflow-hidden h-16 hover:border-sky-500 transition-all bg-slate-200"
                        >
                          <img
                            src={asset.url}
                            alt="Media item choice"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold">
                            Select
                          </div>
                        </div>
                      ))}
                      {media.length === 0 && (
                        <p className="col-span-full text-xs text-slate-500 py-4">
                          No images uploaded yet. Please Drag and Drop images in is the Media Center first!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Background image source link directly */}
                <div className="space-y-2">
                  <label htmlFor="image-input" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.cmImageSource}</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="image-input"
                      name="image"
                      required
                      value={selectedSlide.image}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                    />
                    <ImageIcon className="absolute left-3 top-3.5 text-slate-400" size={15} />
                  </div>
                </div>

                {/* Bilingual Titles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="titleEn-input" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.cmEnHeading}</label>
                    <input
                      type="text"
                      id="titleEn-input"
                      name="titleEn"
                      required
                      value={selectedSlide.titleEn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="titleAr-input" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.cmArHeading}</label>
                    <input
                      type="text"
                      id="titleAr-input"
                      name="titleAr"
                      required
                      value={selectedSlide.titleAr}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Bilingual Subtitle Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="subtitleEn-input" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.cmEnSubtitle}</label>
                    <input
                      type="text"
                      id="subtitleEn-input"
                      name="subtitleEn"
                      value={selectedSlide.subtitleEn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subtitleAr-input" className="text-xs font-bold text-slate-500 uppercase tracking-wide text-right block">{t.cmArSubtitle}</label>
                    <input
                      type="text"
                      id="subtitleAr-input"
                      name="subtitleAr"
                      value={selectedSlide.subtitleAr}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Navigation Links & Sizing Indices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Link anchor */}
                  <div className="space-y-2">
                    <label htmlFor="link-input" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Slider Anchor link</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="link-input"
                        name="link"
                        value={selectedSlide.link}
                        onChange={handleInputChange}
                        placeholder="#contact"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                      />
                      <LinkIcon className="absolute left-3 top-3.5 text-slate-400" size={14} />
                    </div>
                  </div>

                  {/* Order weight */}
                  <div className="space-y-2">
                    <label htmlFor="order-input" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.cmOrder}</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="order-input"
                        name="order"
                        value={selectedSlide.order}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                      />
                      <Layers className="absolute left-3 top-3.5 text-slate-400" size={14} />
                    </div>
                  </div>

                </div>

              </div>

              {/* Action row bottom */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedSlide(null)}
                  className="px-5 py-2.5 bg-slate-150 dark:bg-slate-900 text-slate-700 dark:text-slate-350 text-xs font-bold rounded-xl"
                >
                  Close Edit
                </button>
                <button
                  onClick={handleSaveSlide}
                  disabled={isSaving || userRole === "Viewer"}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-650 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <Save size={13} />
                  <span>{isSaving ? "Saving..." : t.cmSaveSlide}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-850 p-12 text-center rounded-3xl flex flex-col items-center justify-center space-y-3">
              <Sparkles className="text-sky-500" size={28} />
              <p className="text-slate-600 dark:text-slate-450 font-bold text-sm">
                {isRtl ? "لم يتم تحديد أي شريحة عرض" : "No Slide Selected"}
              </p>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {isRtl 
                  ? "انقر فوق أي شريحة في الدليل الأيسر لمعاينة وتعديل المحتوى البصري وبلاغات التنبيه بالتوجيه." 
                  : "Click any left slide list item to verify which background is used and edit caption variables."}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
