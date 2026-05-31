/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { translations } from "../utils/translations";
import { Users, GraduationCap, Laptop, Award } from "lucide-react";
import { motion } from "motion/react";

interface StatsCounterBarProps {
  currentLang: "en" | "ar";
}

interface StatItem {
  id: string;
  icon: React.ReactNode;
  targetValue: number;
  suffix: string;
  labelEn: string;
  labelAr: string;
  colorClass: string;
}

export default function StatsCounterBar({ currentLang }: StatsCounterBarProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  const statItems: StatItem[] = [
    {
      id: "stat-students",
      icon: <Users className="w-7 h-7" />,
      targetValue: 1250,
      suffix: "+",
      labelEn: t.statsStudents || "Active Students",
      labelAr: t.statsStudents || "طالب نشط",
      colorClass: "from-sky-500 to-blue-600 text-sky-500 dark:text-sky-400"
    },
    {
      id: "stat-teachers",
      icon: <GraduationCap className="w-7 h-7" />,
      targetValue: 98,
      suffix: "%",
      labelEn: t.statsTeachers || "Qualified Educators",
      labelAr: t.statsTeachers || "كادر مؤهل كلياً",
      colorClass: "from-amber-500 to-orange-600 text-amber-500 dark:text-amber-400"
    },
    {
      id: "stat-labs",
      icon: <Laptop className="w-7 h-7" />,
      targetValue: 18,
      suffix: "+",
      labelEn: t.statsLabs || "Smart Science Classrooms",
      labelAr: t.statsLabs || "غرف صفية ومختبرات ذكية",
      colorClass: "from-indigo-500 to-violet-600 text-indigo-500 dark:text-indigo-405"
    },
    {
      id: "stat-success",
      icon: <Award className="w-7 h-7" />,
      targetValue: 100,
      suffix: "%",
      labelEn: t.statsSuccess || "University Acceptance",
      labelAr: t.statsSuccess || "معدل القبول الجامعي",
      colorClass: "from-emerald-500 to-teal-600 text-emerald-500 dark:text-emerald-400"
    }
  ];

  return (
    <div id="school-stats-bar" className="relative z-10 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/80 dark:bg-[#151515]/80 backdrop-blur-xl border border-sky-100/60 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(13,71,161,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x dark:divide-white/10 divide-slate-100 divide-x-reverse">
          {statItems.map((stat, idx) => (
            <StatCounterItem
              key={stat.id}
              stat={stat}
              index={idx}
              isRtl={isRtl}
              currentLang={currentLang}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCounterItem({
  stat,
  index,
  isRtl,
  currentLang
}: {
  key?: string;
  stat: StatItem;
  index: number;
  isRtl: boolean;
  currentLang: "en" | "ar";
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = stat.targetValue;
    if (start === end) return;

    // Fast animation matching total duration of 1.5 seconds
    const duration = 1500;
    const incrementTime = Math.max(Math.floor(duration / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [stat.targetValue]);

  // Adjust borders on grid items cleanly
  const borderClasses = `flex flex-col items-center text-center p-4 transition-all duration-300 hover:scale-103 group ${
    index > 1 ? "pt-6 lg:pt-4" : "pt-4"
  }`;

  return (
    <motion.div
      id={stat.id}
      className={borderClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={`p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 group-hover:bg-gradient-to-tr ${stat.colorClass} group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100/50 dark:border-white/5 mb-4`}>
        {stat.icon}
      </div>
      <div className="flex items-baseline justify-center">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D47A1] dark:text-white tracking-tight tabular-nums font-mono">
          {count.toLocaleString(currentLang === "ar" ? "ar-EG" : "en-US")}
        </span>
        <span className="text-xl sm:text-2xl font-black text-amber-500 ml-0.5 mr-0.5">
          {stat.suffix}
        </span>
      </div>
      <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-2 hover:text-sky-600 transition-colors">
        {currentLang === "en" ? stat.labelEn : stat.labelAr}
      </p>
    </motion.div>
  );
}
