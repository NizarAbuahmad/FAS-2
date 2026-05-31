/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { SiteText, UserRole } from "../types";
import { translations } from "../utils/translations";
import { 
  ALargeSmall, 
  Search, 
  Save, 
  RotateCcw, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Filter
} from "lucide-react";

interface SiteTextsManagerProps {
  currentLang: "en" | "ar";
  siteTexts: SiteText[];
  userRole: UserRole;
  onSaveTexts: (texts: SiteText[]) => Promise<boolean>;
}

interface TextDefinition {
  key: string;
  category: "General" | "About Us" | "Academic Tracks" | "Contact";
  labelEn: string;
  labelAr: string;
  defaultEn: string;
  defaultAr: string;
}

// Full index of all static site texts of interest that the user can translate and override
const TEXTS_MANIFEST: TextDefinition[] = [
  // General
  { key: "schoolName", category: "General", labelEn: "School Display Name (English)", labelAr: "اسم المدرسة (إنجليزي)", defaultEn: "First Academy School", defaultAr: "مدرسة الأكاديمية الأولى" },
  { key: "schoolSubname", category: "General", labelEn: "Location/Subname (English)", labelAr: "موقع المدرسة/فرع (إنجليزي)", defaultEn: "Amman", defaultAr: "عمان" },
  { key: "tagline", category: "General", labelEn: "Curriculum Tagline", labelAr: "الحساب الفرعي/المناهج المعتمدة", defaultEn: "Dual Curriculum IGCSE & National", defaultAr: "روضة ومدارس الأكاديمية الأولى" },
  
  // About Section
  { key: "aboutHeadline", category: "About Us", labelEn: "Headline Text", labelAr: "العنوان الرئيسي لقسم التعريف", defaultEn: "Welcome to First Academy School Amman", defaultAr: "روضة ومدارس الأكاديمية الأولى ترحب بكم" },
  { key: "aboutSubheadline", category: "About Us", labelEn: "Subheadline description", labelAr: "الوصف الفرعي لقسم التعريف والمزايا", defaultEn: "Where individual talents are nurtured with academic rigors and deep-rooted moral values.", defaultAr: "نبني جيلاً متمسكاً بالقيم الراسخة والتميز الأكاديمي." },
  { key: "visionTitle", category: "About Us", labelEn: "Vision Tab Title", labelAr: "عنوان تبويب الرؤية", defaultEn: "🎯 Our Vision", defaultAr: "🎯 رؤيتنا" },
  { key: "visionText", category: "About Us", labelEn: "Vision Paragraph", labelAr: "تفاصيل الرؤية والرسالة التربوية", defaultEn: "To lead as a premier academic hub that blends modern global standards with a values-driven environment, enabling students to become highly-capable global citizens.", defaultAr: "التميز والريادة في تقديم تعليم وتربية عالية الجودة تضمن لطلابنا مواكبة المعايير الدولية." },
  { key: "missionTitle", category: "About Us", labelEn: "Mission Tab Title", labelAr: "عنوان تبويب الرسالة", defaultEn: "🌱 Our Mission", defaultAr: "🌱 رسالتنا" },
  { key: "missionText", category: "About Us", labelEn: "Mission Paragraph", labelAr: "مضمون رسالة المدرسة وأهدافها", defaultEn: "To offer a caring bilingual community that integrates state-of-the-art facilities, innovative teaching methods, and dual curricula to unleash every student's native potential.", defaultAr: "رعاية طاقات أطفالنا وتدريبهم بخصائص تعليمية فريدة وتطوير قدراتهم الفردية بالبرنامج الوطني والدولي." },
  { key: "valuesTitle", category: "About Us", labelEn: "Values Tab Title", labelAr: "عنوان تبويب القيم", defaultEn: "✨ Core Morals & Pride", defaultAr: "✨ قيمنا وفخرنا" },
  { key: "valuesText", category: "About Us", labelEn: "Values Detail Paragraph", labelAr: "تفاصيل القيم الأخلاقية الأساسية", defaultEn: "Responsibility, mutual respect, continuous self-improvement, and social leadership form the core pillars of our daily education stream.", defaultAr: "الاحترام المتبادل، المسؤولية، الإبداع والقيادة الاجتماعية هي أسس تكوين طلابنا وبراعمنا." },

  // Academic Tracks Segment
  { key: "tracksHeadline", category: "Academic Tracks", labelEn: "Programs Main Header", labelAr: "العنوان الرئيسي للمسارات التعليمية", defaultEn: "Three Paths For Your Child's Expectations", defaultAr: "ثلاثة مسارات تعليمية تلبي تطلعات طفلك" },
  { key: "tracksSubheadline", category: "Academic Tracks", labelEn: "Programs Subheader", labelAr: "الوصف الفرعي للمسارات والبرامج", defaultEn: "FAS delivers custom tailored streams suited for modern regional and international academic futures.", defaultAr: "نقدم برامج مخصصة ومعمقة لكل مرحلة دراسية لبناء مستقبل متميز." },
  { key: "trackKgTitle", category: "Academic Tracks", labelEn: "KG Track Header Text", labelAr: "مسمى عنوان مسار الروضة", defaultEn: "Preschool & Kindergarten (KG)", defaultAr: "قسم الروضة وبراعم التميز والطفولة المبكرة" },
  { key: "trackKgDesc", category: "Academic Tracks", labelEn: "KG Division Details", labelAr: "تفاصيل ووصف قسم الروضة", defaultEn: "Injecting joyful interactive play, phonics, and tactile motor skill coaching to build a loving first foundation.", defaultAr: "نتبنى أسلوب التعليم التفاعلي والمرح لتأسيس المهارات اللغوية والذهنية السليمة." },
  { key: "trackNationalTitle", category: "Academic Tracks", labelEn: "National Track Name Header", labelAr: "مسمى عنوان قسم البرنامج الوطني", defaultEn: "National Curriculum Stream", defaultAr: "البرنامج الوطني الأكاديمي (وزارة التربية)" },
  { key: "trackNationalDesc", category: "Academic Tracks", labelEn: "National Stream Details Description", labelAr: "تفاصيل منهاج قسم البرنامج الوطني", defaultEn: "Comprehensive Jordanian curriculum from Grade 1 to Tawjihi (Grade 12), ensuring competitive academic prowess.", defaultAr: "تغطية شاملة ومعمقة لمستويات مناهج المملكة وتأهيل متفوقين للتوجيهي والجامعة." },
  { key: "trackIgcseTitle", category: "Academic Tracks", labelEn: "Cambridge British Track Header", labelAr: "مسمى عنوان برنامج كامبريدج الدولي", defaultEn: "Cambridge International Stream", defaultAr: "البرنامج الدولي البريطاني (Cambridge IGCSE)" },
  { key: "trackIgcseDesc", category: "Academic Tracks", labelEn: "Cambridge Division Details Description", labelAr: "وصف وتفاصيل منهاج كامبريدج IGCSE", defaultEn: "British curriculum offering IGCSE, AS & A-Levels, supported by modern digital science laboratories and global testing standards.", defaultAr: "أرقى المناهج الإنجليزية المعتمدة عالمياً بإشراف معلمين متمرسين ومختبرات تكنولوجية معاصرة." },
  { key: "learnMoreBtn", category: "Academic Tracks", labelEn: "Action button callout", labelAr: "عنوان زر التفاصيل والمسارات", defaultEn: "Stream Details", defaultAr: "استكشف تفاصيل المسار" },

  // Contact Page Segment
  { key: "contactHeader", category: "Contact", labelEn: "Contact Section Headline", labelAr: "العنوان الرئيسي لقسم اتصل بنا", defaultEn: "Get In Touch", defaultAr: "تواصل معنا واستفسر الآن" },
  { key: "contactSub", category: "Contact", labelEn: "Contact Sub-paragraph", labelAr: "الوصف الموضح للاستمارات والقبول", defaultEn: "Have questions about school fees, registration procedures, or want to schedule a physical tour?", defaultAr: "هل لديك أي تساؤل يتعلق برسوم التسجيل، أو ترغب بطلب حجز موعد لجولة ميدانية بالحرم؟" }
];

export default function SiteTextsManager({
  currentLang,
  siteTexts,
  userRole,
  onSaveTexts
}: SiteTextsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [editingTextsState, setEditingTextsState] = useState<Record<string, { valueEn: string, valueAr: string }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  // Initialize overrides state when static manifesting or DB values load
  useEffect(() => {
    const initialState: Record<string, { valueEn: string, valueAr: string }> = {};
    
    TEXTS_MANIFEST.forEach((manifestItem) => {
      // Find database item override if it exists
      const dbOverride = siteTexts.find((st) => st.key === manifestItem.key);
      initialState[manifestItem.key] = {
        valueEn: dbOverride ? dbOverride.valueEn : manifestItem.defaultEn,
        valueAr: dbOverride ? dbOverride.valueAr : manifestItem.defaultAr
      };
    });

    setEditingTextsState(initialState);
  }, [siteTexts]);

  const handleInputChange = (key: string, field: "valueEn" | "valueAr", textValue: string) => {
    setEditingTextsState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: textValue
      }
    }));
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleResetDefaults = () => {
    if (userRole === "Viewer") return;
    if (window.confirm(isRtl ? "هل تريد إعادة تعيين كافة قيم النصوص إلى الحالات الافتراضية؟" : "Reset all website texts back to system default strings?")) {
      const resetState: Record<string, { valueEn: string, valueAr: string }> = {};
      TEXTS_MANIFEST.forEach((manifestItem) => {
        resetState[manifestItem.key] = {
          valueEn: manifestItem.defaultEn,
          valueAr: manifestItem.defaultAr
        };
      });
      setEditingTextsState(resetState);
      setSuccessMsg("");
    }
  };

  const handleCommitBatchSave = async () => {
    if (userRole === "Viewer") {
      alert(t.umRestriction);
      return;
    }

    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // Compose site override array payload
      const payload: SiteText[] = Object.keys(editingTextsState).map((key) => ({
        key,
        valueEn: editingTextsState[key].valueEn,
        valueAr: editingTextsState[key].valueAr
      }));

      const success = await onSaveTexts(payload);
      if (success) {
        setSuccessMsg(isRtl ? "تم حفظ التعديلات وتحديث نصوص الموقع بالكامل بنجاح!" : "All website text changes successfully committed to the database and updated globally!");
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        setErrorMsg(isRtl ? "الرمز البريدي أرجع فشلاً عند محاولة تحديث نصوص الموقع" : "Server returned an error while committing website texts overrides.");
      }
    } catch (err) {
      setErrorMsg(isRtl ? "حدث خطأ غير متوقع أثناء الاتصال بالخادم" : "Unexpected error saving localization changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter manifesting variables based on filters & search
  const filteredManifest = TEXTS_MANIFEST.filter((item) => {
    const categoryMatches = activeCategoryFilter === "All" || item.category === activeCategoryFilter;
    
    const searchString = `${item.key} ${item.labelEn} ${item.labelAr} ${item.defaultEn} ${item.defaultAr}`.toLowerCase();
    const searchMatches = searchString.includes(searchTerm.toLowerCase());

    return categoryMatches && searchMatches;
  });

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* HEADER ROW ACTION HUB */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-[#111111] p-6 border border-white/5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-black text-white px-1 flex items-center gap-2">
            <ALargeSmall className="text-amber-500" size={22} />
            <span>{isRtl ? "محاذاة وتهجئة نصوص الموقع التفاعلية" : "Interactive Website Texts Editor"}</span>
          </h1>
          <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider px-1">
            {isRtl ? "قم بتخصيص وتغيير أي كتل نصية أو عناوين تفاعلية على الموقع دون أي كود" : "Customize, localize or translate any header text or titles on the site seamlessly"}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetDefaults}
            disabled={userRole === "Viewer" || isSaving}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-xs rounded-xl shadow-inner transition-colors border border-white/10 disabled:opacity-50 flex items-center gap-1.5"
            title={isRtl ? "استعادة الأساسي" : "Restore Defaults"}
          >
            <RotateCcw size={13} />
            <span>{isRtl ? "افتراضيات النظام" : "Restore Defaults"}</span>
          </button>
          <button
            onClick={handleCommitBatchSave}
            disabled={isSaving || userRole === "Viewer"}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 font-extrabold text-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>{isRtl ? "تأكيد وتحديث نصوص الموقع" : "Commit Text Changes"}</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK STATUS ALERTS */}
      {successMsg && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-900/50 rounded-xl text-emerald-400 text-xs flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-455 text-xs flex items-center gap-3 animate-fade-in">
          <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FILTER SEARCH UTILITIES TAB */}
      <div className="bg-[#111111] p-4 border border-white/5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        
        {/* Category filtering selectors */}
        <div className="flex flex-wrap items-center gap-1 w-full md:w-auto overflow-x-auto">
          {["All", "General", "About Us", "Academic Tracks", "Contact"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight uppercase transition-all ${
                activeCategoryFilter === cat
                  ? "bg-amber-500 text-black shadow-sm"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat === "All" ? (isRtl ? "الكل" : "All") 
                : cat === "General" ? (isRtl ? "بيانات التعريف" : "General Hub")
                : cat === "About Us" ? (isRtl ? "قسم التعريف" : "About Us")
                : cat === "Academic Tracks" ? (isRtl ? "المسارات الأكاديمية" : "Academic Tracks")
                : (isRtl ? "بيانات التواصل" : "Contact")
              }
            </button>
          ))}
        </div>

        {/* Dynamic Search queries Input */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 rtl:left-auto rtl:right-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? "ابحث عن عبارة أو كلمة مفتاحية..." : "Search static keys, descriptions or texts..."}
            className="w-full bg-[#161616] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:border-amber-500 focus:outline-none transition-all placeholder:text-gray-600 rtl:pl-4 rtl:pr-10 text-right"
          />
        </div>

      </div>

      {/* TEXT KEYLIST CARDS GRID */}
      <div className="space-y-4">
        {filteredManifest.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-[#111111] border border-white/5 rounded-2xl">
            <Filter className="mx-auto opacity-25 mb-2" size={32} />
            <p className="text-xs font-bold text-white">
              {isRtl ? "لا توجد نتائج مطابقة لفلتر البحث المحدد" : "No Matching Localizable Constants Found"}
            </p>
          </div>
        ) : (
          filteredManifest.map((item) => {
            const values = editingTextsState[item.key] || { valueEn: "", valueAr: "" };
            
            return (
              <div 
                key={item.key} 
                className="bg-[#111111] border border-white/10 hover:border-white/15 rounded-2xl p-5 md:p-6 transition-all shadow-md group space-y-4"
              >
                {/* Meta identifiers label key */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-white/5 gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-amber-500 tracking-tight font-mono">
                      {item.key}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {isRtl ? item.labelAr : item.labelEn}
                    </p>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/5">
                    {item.category}
                  </span>
                </div>

                {/* Double localization texts writing cells grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* English override textarea */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 font-sans block">
                      English Value (Public view)
                    </span>
                    <textarea
                      value={values.valueEn}
                      onChange={(e) => handleInputChange(item.key, "valueEn", e.target.value)}
                      rows={Math.max(2, Math.ceil(values.valueEn.length / 80))}
                      className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500/50 focus:outline-none transition-all font-sans leading-relaxed"
                    />
                  </div>

                  {/* Arabic override textarea */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 font-sans block text-right">
                      Arabic Value (Public view)
                    </span>
                    <textarea
                      value={values.valueAr}
                      onChange={(e) => handleInputChange(item.key, "valueAr", e.target.value)}
                      rows={Math.max(2, Math.ceil(values.valueAr.length / 80))}
                      className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500/50 focus:outline-none transition-all font-sans leading-relaxed text-right"
                    />
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* FOOTER MASTER ACTION TRIGGER */}
      {filteredManifest.length > 0 && (
        <div className="p-6 bg-[#111111] border border-white/5 rounded-2xl flex items-center justify-between shadow-xl">
          <p className="text-[10px] text-gray-500 max-w-md hidden sm:block">
            {isRtl 
              ? "جميع التغييرات المدخلة في الحقول أعلاه يتم تجميعها وحفظها بشكل آمن بمسار مشفر في قاعدة البيانات بمجرد التأكيد."
              : "All texts altered above are batch uploaded and cached into translations. Let's hit save to push them live."
            }
          </p>
          <button
            onClick={handleCommitBatchSave}
            disabled={isSaving || userRole === "Viewer"}
            className="w-full sm:w-auto px-10 py-3 bg-amber-500 hover:bg-amber-600 font-extrabold text-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>{isRtl ? "تطبيق وتأكيد جميع التعديلات" : "Apply All Overrides Now"}</span>
          </button>
        </div>
      )}

    </div>
  );
}
