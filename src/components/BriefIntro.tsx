/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { translations } from "../utils/translations";
import { GalleryItem } from "../types";
import { 
  Award, 
  BookOpen, 
  Smartphone, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  Eye, 
  X, 
  Filter,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BriefIntroProps {
  currentLang: "en" | "ar";
  gallery: GalleryItem[];
}

export default function BriefIntro({ currentLang, gallery }: BriefIntroProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  // Photo Gallery State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const highlightingFeatures = [
    {
      icon: <Award className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      titleEn: "Certified Excellence",
      titleAr: "اعتماد وجودة تعليمية",
      descEn: "Full licensed dual accreditation paths fitting international testing parameters.",
      descAr: "تراخيص واعتمادات أكاديمية كاملة تلبي معايير القياس الوطنية والدولية."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#1565C0] dark:text-[#64B5F6]" />,
      titleEn: "Personalized Support",
      titleAr: "رعاية أكاديمية مخصصة",
      descEn: "Caring responsive teachers with lower class size ratios for focused growth.",
      descAr: "كادر تدريسي متميز ومحب مع كثافة صفية منخفضة لضمان استيعاب فريـد."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      titleEn: "Smart Classrooms",
      titleAr: "غرف صفية تفاعلية ذكية",
      descEn: "High-speed network linkages, smart screens, and modern computer labs.",
      descAr: "أنظمة عرض تفاعلية، اتصال سريع وشاشات مساندة لغرس المهارات التقنية."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      titleEn: "Safe Campus Environment",
      titleAr: "بيئة مدرسية آمنة",
      descEn: "Safe enclosed yards, healthy play courts, and secure transportation fleets.",
      descAr: "ساحات وملاعب خضراء مجهزة ومراقبة بالكامل لضمان السلامة والحركة الحرة."
    }
  ];

  // Configure Gallery Categories
  const categories = isRtl
    ? [
        { id: "All", label: "الكل" },
        { id: "Facilities", label: "المرافق المدرسية" },
        { id: "Activities", label: "الأنشطة المدرسية" }
      ]
    : [
        { id: "All", label: "All Photos" },
        { id: "Facilities", label: "Facilities" },
        { id: "Activities", label: "Activities" }
      ];

  // Filter and sort items to display
  const filteredGallery = (gallery || []).filter((item) => {
    if (selectedCategory === "All") return true;
    return item.categoryEn === selectedCategory;
  });

  return (
    <section 
      id="about" 
      className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-950 bg-dot-matrix transition-colors duration-300 relative overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/10 dark:bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-100/10 dark:bg-amber-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 space-y-4">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 tracking-widest uppercase bg-sky-100/50 dark:bg-sky-950/40 px-4 py-2 rounded-full border border-sky-200/20">
            {isRtl ? "لمحة تعريفية" : "Introduction Portal"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight pt-2">
            {t.aboutHeadline}
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-sky-500 to-[#1565C0] mx-auto rounded-full mt-3" />
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-semibold max-w-2xl mx-auto md:pt-2">
            {t.aboutSubheadline}
          </p>
        </div>

        {/* Vision & Mission Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          
          {/* Card 1: Vision (Large Bento Grid Unit - col-span-2) */}
          <motion.div 
            id="bento-vision"
            className="lg:col-span-2 relative group p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#131313] shadow-[0_4px_30px_rgba(21,101,192,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-white/5 transition-all overflow-hidden"
            whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(13,71,161,0.08)" }}
          >
            {/* Ambient accent background glow */}
            <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-2xl group-hover:scale-120 transition-transform duration-500" />
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-sky-500 to-[#1565C0] rounded-l-3xl rtl:rounded-r-3xl rtl:rounded-l-none" />
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-50 dark:bg-sky-950/60 rounded-xl text-sky-600 dark:text-sky-400">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0D47A1] dark:text-[#E3F2FD] tracking-tight">
                  {t.visionTitle}
                </h3>
              </div>
              
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                {t.visionText}
              </p>
              
              <div className="pt-4 grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-white/5 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                  <span>{isRtl ? "مستقبل تقني متطور" : "Advanced Tech Focus"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                  <span>{isRtl ? "قيم أخلاقية متأصلة" : "Values-Driven System"}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Mission (Standard Bento Grid Unit) */}
          <motion.div 
            id="bento-mission"
            className="relative group p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#131313] shadow-[0_4px_30px_rgba(21,101,192,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-white/5 transition-all overflow-hidden"
            whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(99,102,241,0.08)" }}
          >
            {/* Ambient accent background glow */}
            <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-120 transition-transform duration-500" />
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-indigo-500 to-violet-600 rounded-l-3xl rtl:rounded-r-3xl rtl:rounded-l-none" />
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#1565C0] dark:text-[#E8EAF6] tracking-tight">
                  {t.missionTitle}
                </h3>
              </div>
              
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                {t.missionText}
              </p>
            </div>
          </motion.div>

          {/* Card 3: Values & Pride Flags (Full screen width bento banner - spans all 3 columns) */}
          <motion.div 
            id="bento-values"
            className="lg:col-span-3 relative group p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#131313] shadow-[0_4px_30px_rgba(21,101,192,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-white/5 transition-all overflow-hidden"
            whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(16,185,129,0.08)" }}
          >
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-emerald-500 to-teal-600 rounded-l-3xl rtl:rounded-r-3xl rtl:rounded-l-none" />
            
            <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-emerald-800 dark:text-[#E8F5E9] tracking-tight">
                    {t.valuesTitle}
                  </h3>
                </div>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  {t.valuesText}
                </p>
              </div>

              {/* Enhanced Visual Bullet badges for the values card */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {[
                  { en: "Responsibility", ar: "الالتماس والمسؤولية" },
                  { en: "Mutual Respect", ar: "الاحترام المتبادل" },
                  { en: "Continuous Growth", ar: "التطوير الذاتي المستمر" },
                  { en: "Social Leadership", ar: "الريادة والمبادرة" }
                ].map((val, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex items-center gap-2.5 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                      {isRtl ? val.ar : val.en}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* --- SCHOOL LIFE AND ACTIVITIES GALLERY SECTION --- */}
        <div className="mt-28 mb-24 space-y-12">
          {/* Gallery Header */}
          <div className="text-center md:text-start flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 dark:border-white/5 pb-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#1565C0] dark:text-sky-400 tracking-wider uppercase bg-[#1565C0]/10 dark:bg-sky-950/50 px-3.5 py-1.5 rounded-full border border-sky-400/10 inline-flex items-center gap-2">
                <ImageIcon size={12} />
                {isRtl ? "البيئة والأنشطة" : "School Life Visuals"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                {isRtl ? "معرض صور المدرسة والأنشطة" : "School Campus & Activity Gallery"}
              </h3>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
                {isRtl 
                  ? "جولة بصرية تفاعلية تستعرض مرافقنا الحديثة، مختبراتنا، وعصارة نشاط برامجنا." 
                  : "An interactive journey through our state-of-the-art facilities, safe labs, and vibrant student activities."}
              </p>
            </div>

            {/* Local Pill Filtering Buttons */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border shadow-sm ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-[#1565C0] to-sky-600 text-white border-transparent scale-105"
                      : "bg-white dark:bg-[#111111] text-slate-600 dark:text-slate-350 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Cards Grid Layout */}
          {filteredGallery.length === 0 ? (
            <div className="py-12 text-center text-slate-450 dark:text-slate-500 font-medium border border-dashed border-slate-250/50 dark:border-white/5 rounded-2xl bg-white/40 dark:bg-slate-900/10">
              {isRtl ? "لا توجد صور متوفرة في هذا القسم حالياً." : "No photos uploaded in this category yet."}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredGallery.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layoutId={`gallery-card-${item.id}`}
                    className="relative group rounded-3xl overflow-hidden bg-white dark:bg-[#121212] border border-slate-100 dark:border-white/5 shadow-md flex flex-col h-[320px] justify-between cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setLightboxItem(item)}
                  >
                    {/* Hover Zoom Photo Wrapper */}
                    <div className="relative w-full h-[220px] overflow-hidden bg-slate-100 dark:bg-slate-900">
                      <img
                        src={item.image}
                        alt={isRtl ? item.titleAr : item.titleEn}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      {/* Dark overlay banner with prompt eye icon */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                        <div className="p-3.5 bg-white/95 text-slate-950 rounded-full scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
                          <Eye size={20} className="text-sky-600 animate-pulse" />
                        </div>
                      </div>

                      {/* Floating pill badge showing category */}
                      <span className="absolute top-4 left-4 right-auto text-[10px] font-extrabold uppercase bg-[#1565C0]/90 text-white backdrop-blur px-3 py-1 rounded-full border border-white/20">
                        {isRtl ? item.categoryAr : item.categoryEn}
                      </span>
                    </div>

                    {/* Footer text content of image cards */}
                    <div className="p-5 flex-1 flex flex-col justify-center border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#121212] transition-colors">
                      <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-blue-400 transition-colors">
                        {isRtl ? item.titleAr : item.titleEn}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* --- DYNAMIC INTERACTIVE LIGHTBOX POPUP MODAL --- */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxItem(null)}
            >
              {/* Close Button top-right */}
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxItem(null); }}
                className="absolute top-6 right-6 p-3 bg-white/10 text-white hover:bg-white/20 rounded-full transition-all focus:outline-none"
                title="Close"
              >
                <X size={24} />
              </button>

              {/* Box frame */}
              <motion.div
                className="relative max-w-4xl w-full bg-[#18181b] rounded-3xl border border-white/10 shadow-2xl overflow-hidden cursor-default"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image panel */}
                <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden bg-black relative">
                  <img
                    src={lightboxItem.image}
                    alt={isRtl ? lightboxItem.titleAr : lightboxItem.titleEn}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[70vh] object-contain block mx-auto py-1"
                  />
                  
                  {/* Tag overlay */}
                  <span className="absolute bottom-4 left-4 right-auto bg-black/65 text-white text-xs px-3.5 py-1.5 rounded-full backdrop-blur border border-white/10 font-bold uppercase">
                    {isRtl ? lightboxItem.categoryAr : lightboxItem.categoryEn}
                  </span>
                </div>

                {/* Info Text Footer bar */}
                <div className="p-6 sm:p-8 bg-[#18181b] border-t border-white/5 space-y-2 text-center sm:text-start flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <h4 className="text-lg sm:text-xl font-black text-white leading-relaxed">
                    {isRtl ? lightboxItem.titleAr : lightboxItem.titleEn}
                  </h4>
                  <button
                    onClick={() => setLightboxItem(null)}
                    className="px-5 py-2 text-xs bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-100 transition"
                  >
                    {isRtl ? "إغلاق" : "Close Viewer"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Highlight Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-12 border-t border-slate-200 dark:border-white/5">
          {highlightingFeatures.map((item, idx) => (
            <motion.div 
              key={idx} 
              className="flex items-start gap-4 p-5 rounded-2xl bg-white/40 dark:bg-[#111111]/40 border border-transparent hover:bg-white dark:hover:bg-[#131313] hover:shadow-[0_4px_20px_rgba(13,71,161,0.03)] dark:hover:shadow-none hover:border-slate-100 dark:hover:border-white/5 transition-all duration-300"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className="flex-shrink-0 p-3 bg-slate-100 dark:bg-[#1a1a1a] rounded-xl group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-850 dark:text-white leading-tight">
                  {currentLang === "en" ? item.titleEn : item.titleAr}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {currentLang === "en" ? item.descEn : item.descAr}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
