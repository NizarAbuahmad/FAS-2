/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { translations } from "../utils/translations";
import { CheckCircle2, Award, Compass, Heart, ChevronDown, ChevronUp, Sparkles, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TracksSectionProps {
  currentLang: "en" | "ar";
}

export default function TracksSection({ currentLang }: TracksSectionProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";
  
  // Track expanded points state to allow interactive study peek
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

  const toggleTrackPeek = (trackId: string) => {
    setExpandedTrack(expandedTrack === trackId ? null : trackId);
  };

  const tracks = [
    {
      id: "track-kg",
      title: t.trackKgTitle,
      desc: t.trackKgDesc,
      icon: <Heart className="w-7 h-7 text-rose-500" />,
      tagEn: "KG & Early Childhood",
      tagAr: "مرحلة الطفولة المبكرة والروضة",
      badgeEn: "Age 3-5 Years",
      badgeAr: "الأعمار ٣ - ٥ سنوات",
      bulletsEn: [
        "Play-based learning matching physical milestones",
        "Dual English & Arabic phonics foundational training",
        "Tactile artistic exploration workshops",
        "Kind, motherly attention in secure classrooms",
        "Interactive speech logic development"
      ],
      bulletsAr: [
        "التعلم القائم على اللعب لتنمية المهارات البدنية الحركية",
        "تأسيس لغوي مزدوج (العربية والإنجليزية) بالصوتيات الحديثة",
        "ورشات العمل الفنية واليدوية الصديقة للبشرة للبراعم",
        "رعاية وحنان دافئ في غرف صفية مهيأة وآمنة بالكامل",
        "تنمية النطق والمحادثة المنطقية الموجهة"
      ],
      colorStyle: "border-rose-100 hover:border-rose-400 dark:border-rose-950/40 dark:hover:border-rose-800 bg-rose-50/10 dark:bg-rose-950/5 text-rose-600 dark:text-rose-450",
      accentGrad: "from-rose-500 to-pink-500"
    },
    {
      id: "track-national",
      title: t.trackNationalTitle,
      desc: t.trackNationalDesc,
      icon: <Compass className="w-7 h-7 text-sky-600" />,
      tagEn: "National Program",
      tagAr: "البرنامج والمنهاج الوطني",
      badgeEn: "Grades 1 - 12",
      badgeAr: "الصفوف ١ - ١٢",
      bulletsEn: [
        "Full Ministry of Education approved textbooks",
        "Grade 1 to Scientific / Literary fields for Tawjihi",
        "Arabic culture & deep islamic/social values education",
        "Supportive extra-curricular science club integration",
        "Intensive national exam prep diagnostics"
      ],
      bulletsAr: [
        "مناهج معتمدة بالكامل من وزارة التربية والتعليم الأردنية",
        "من الصف الأول والتهيئة للفروع العلمية والأدبية في التوجيهي",
        "تركيز عميق على الهوية العربية والتربية الأخلاقية الإسلامية",
        "نوادٍ علمية تفاعلية للفيزياء والكيمياء والأحياء",
        "مراجعات وتقييمات دورية مكثفة للاختبارات الوزارية"
      ],
      colorStyle: "border-sky-100 hover:border-sky-400 dark:border-sky-950/40 dark:hover:border-sky-800 bg-sky-50/15 dark:bg-sky-950/5 text-sky-600 dark:text-sky-450",
      accentGrad: "from-sky-500 to-[#1565C0]"
    },
    {
      id: "track-igcse",
      title: t.trackIgcseTitle,
      desc: t.trackIgcseDesc,
      icon: <Award className="w-7 h-7 text-indigo-600" />,
      tagEn: "Cambridge Stream",
      tagAr: "البرنامج البريطاني الدولي",
      badgeEn: "Primary to A-Level",
      badgeAr: "البرنامج الدولي المعتمد",
      bulletsEn: [
        "Cambridge Assessment International Education IGCSE",
        "Advanced AS & A-Level examinations coaching",
        "Modern progressive science labs & smart testing center",
        "Trilingual language exposures & research projects",
        "Global study counsel university placements support"
      ],
      bulletsAr: [
        "تعليم بريطاني معتمد من كامبريدج للاختبارات الدولية IGCSE",
        "تهيئة شاملة لمستويات AS & A-Level المتقدمة بدراسات تطبيقية",
        "مختبرات رقمية متكاملة لعلوم الكيمياء الصيدلانية وتجارب الأحياء",
        "برامج تفاعلية للغات الحية والأبحاث العملية المستقلة",
        "إرشاد جامعي مخصص للقبول في أفضل الجامعات العالمية والمحلية"
      ],
      colorStyle: "border-indigo-100 hover:border-indigo-400 dark:border-indigo-950/40 dark:hover:border-indigo-805 bg-indigo-50/10 dark:bg-indigo-950/5 text-indigo-600 dark:text-indigo-450",
      accentGrad: "from-indigo-600 to-violet-600"
    }
  ];

  return (
    <section 
      id="tracks" 
      className="py-20 sm:py-28 bg-white dark:bg-slate-900 bg-dot-matrix transition-colors duration-300 relative"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 space-y-4">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-450 tracking-widest uppercase bg-sky-50 dark:bg-sky-950/60 px-4 py-2 rounded-full border border-sky-200/20">
            {isRtl ? "البرامج والمسارات التعليمية" : "Educational Pathways"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight pt-2">
            {t.tracksHeadline}
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-sky-500 to-[#1565C0] mx-auto rounded-full mt-3" />
          <p className="text-base sm:text-lg text-slate-550 dark:text-slate-400 leading-relaxed font-semibold max-w-2xl mx-auto">
            {t.tracksSubheadline}
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          {tracks.map((track) => {
            const isExpanded = expandedTrack === track.id;
            return (
              <motion.div
                key={track.id}
                layout="position"
                className={`flex flex-col h-full rounded-3xl border bg-white dark:bg-[#131313] hover:shadow-[0_25px_60px_-15px_rgba(21,101,192,0.12)] duration-500 transition-all ${track.colorStyle}`}
                transition={{ duration: 0.4 }}
              >
                {/* Visual Accent Top Bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${track.accentGrad} rounded-t-3xl`} />
                
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Upper Metadata Flag Layout */}
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100/50 dark:border-white/5 shadow-sm">
                        {track.icon}
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 dark:text-slate-500 leading-none">
                          {currentLang === "en" ? track.tagEn : track.tagAr}
                        </span>
                        <span className="text-xs font-bold text-amber-500 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 px-2.5 py-1 rounded-full mt-1.5 border border-amber-500/10 inline-block leading-none">
                          {currentLang === "en" ? track.badgeEn : track.badgeAr}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-3">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        {track.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                        {track.desc}
                      </p>
                    </div>

                    {/* Expandable Bullet Section to keep screen spaces light & premium */}
                    <div className="mt-8 pt-4 border-t border-slate-50 dark:border-white/5">
                      <button
                        onClick={() => toggleTrackPeek(track.id)}
                        className="flex items-center justify-between w-full py-2 hover:text-sky-600 transition-colors text-xs font-black uppercase text-slate-400 tracking-wider"
                      >
                        <span>{isRtl ? "مخرجات البرنامج والمميزات" : "Track Outcomes & Goals"}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <ul className="pt-4 space-y-4">
                              {(currentLang === "en" ? track.bulletsEn : track.bulletsAr).map((bullet, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <div className="p-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-full mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                  </div>
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                                    {bullet}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Program Landing Contact Links */}
                  <div className="pt-8 mt-6">
                    <a
                      href="#contact"
                      className={`block w-full py-4 text-center text-sm font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 group-hover:scale-102 border border-slate-100 dark:border-white/5 hover:bg-sky-600 hover:text-white hover:border-transparent ${
                        isExpanded
                          ? "bg-slate-100 text-slate-800 dark:bg-zinc-900 dark:text-zinc-200"
                          : "bg-slate-50 text-slate-600 dark:bg-zinc-900/60 dark:text-zinc-300"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>{t.learnMoreBtn || "Stream Details"}</span>
                    </a>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
