/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Post } from "../types";
import { translations } from "../utils/translations";
import { 
  Calendar, 
  User, 
  Eye, 
  BookOpen, 
  X, 
  Search,
  Filter
} from "lucide-react";

interface MediaPostsProps {
  posts: Post[];
  currentLang: "en" | "ar";
  onPostOpened: (id: string) => void;
}

export default function MediaPosts({ posts, currentLang, onPostOpened }: MediaPostsProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  // Dynamic Categories list based on language
  const categories = ["All", ...Array.from(new Set(posts.map(p => p.categoryEn)))];

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    // Increment view metric on server
    onPostOpened(post.id);
  };

  const getFilteredPosts = () => {
    return posts.filter(post => {
      const matchCategory = activeCategory === "All" || post.categoryEn === activeCategory;
      const targetQuery = searchQuery.toLowerCase();
      const matchSearch = 
        post.titleEn.toLowerCase().includes(targetQuery) ||
        post.titleAr.includes(targetQuery) ||
        post.contentEn.toLowerCase().includes(targetQuery) ||
        post.contentAr.includes(targetQuery);
      return matchCategory && matchSearch;
    });
  };

  const filtered = getFilteredPosts();

  return (
    <section 
      id="news" 
      className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950/80 bg-dot-matrix transition-colors duration-300"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 tracking-wider uppercase bg-sky-50 dark:bg-sky-950 px-3.5 py-1.5 rounded-full">
            {isRtl ? "أخبار وفعاليات مدرسة الأكاديمية الأولى" : "School Life & Highlights"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.navNews}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-semibold max-w-2xl mx-auto mt-2 text-sm sm:text-base">
            {isRtl 
              ? "تابع آخر الإعلانات والأنشطة الطلابية والفعاليات اللامنهجية في مدرستنا." 
              : "Stay updated with the latest news, academic events, and student highlights at FAS Amman."}
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              // Translate categories if Arabic
              let label = cat;
              if (currentLang === "ar") {
                if (cat === "All") label = "الكل";
                else {
                  // Find corresponding post and take categoryAr
                  const matchingPost = posts.find(p => p.categoryEn === cat);
                  if (matchingPost) label = matchingPost.categoryAr;
                }
              }
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                    isSelected
                      ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder={isRtl ? "ابحث عن المقالات أو الأخبار..." : "Search publications..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:border-sky-500"
            />
            <Search className={`absolute ${isRtl ? "right-3" : "left-3"} top-2.5 text-slate-400`} size={16} />
          </div>

        </div>

        {/* Posts Grid List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 font-medium font-sans">
              {isRtl ? "لا توجد منشورات تطابق بحثك حالياً." : "No posts match current filters or search query."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <article
                key={post.id}
                id={`post-card-${post.id}`}
                onClick={() => handlePostClick(post)}
                className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                
                {/* Thumb Container */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={currentLang === "en" ? post.titleEn : post.titleAr}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/95 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-sky-600 dark:text-sky-450 rounded-md uppercase tracking-wider shadow-sm">
                    {currentLang === "en" ? post.categoryEn : post.categoryAr}
                  </span>
                </div>

                {/* Information content */}
                <div className="p-6 flex flex-col flex-grow space-y-3">
                  
                  {/* Meta items */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-sans font-semibold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{post.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      <span>{currentLang === "en" ? post.authorEn : post.authorAr}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      <span>{post.views || 0}</span>
                    </span>
                  </div>

                  {/* Heading */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
                    {currentLang === "en" ? post.titleEn : post.titleAr}
                  </h3>

                  {/* Description Summary */}
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed flex-grow">
                    {currentLang === "en" ? post.descriptionEn : post.descriptionAr}
                  </p>

                  {/* Core Read trigger */}
                  <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:underline">
                    <BookOpen size={14} />
                    <span>{isRtl ? "اقرأ الملخص بالكامل" : "Read Full Article"}</span>
                  </div>

                </div>

              </article>
            ))}
          </div>
        )}

      </div>

      {/* Full Detail Modal Overlay Popup */}
      {selectedPost && (
        <div 
          id="post-preview-modal"
          className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all"
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-y-auto border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100" dir={isRtl ? "rtl" : "ltr"}>
            
            {/* Header / Dismiss */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
              aria-label="Dismiss Modal"
            >
              <X size={18} />
            </button>

            {/* Main Cover Image */}
            <div className="h-64 sm:h-80 w-full relative bg-slate-100">
              <img
                src={selectedPost.image}
                alt={currentLang === "en" ? selectedPost.titleEn : selectedPost.titleAr}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <span className="absolute bottom-4 left-4 bg-sky-600 text-white font-sans text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                {currentLang === "en" ? selectedPost.categoryEn : selectedPost.categoryAr}
              </span>
            </div>

            {/* Text Information block */}
            <div className="p-6 sm:p-8 space-y-5">
              
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 text-xs font-semibold py-1 border-b border-slate-100 dark:border-slate-850">
                <span className="flex items-center gap-2">
                  <Calendar size={13} />
                  <span>{selectedPost.date}</span>
                </span>
                <span className="flex items-center gap-2">
                  <User size={13} />
                  <span>{currentLang === "en" ? selectedPost.authorEn : selectedPost.authorAr}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Eye size={13} />
                  <span>{(selectedPost.views || 0) + 1} {isRtl ? "مشاهدة" : "VIEWS"}</span>
                </span>
              </div>

              {/* Precise Bilingual Header */}
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-snug text-slate-900 dark:text-white">
                {currentLang === "en" ? selectedPost.titleEn : selectedPost.titleAr}
              </h1>

              {/* Body Text */}
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                {currentLang === "en" ? selectedPost.contentEn : selectedPost.contentAr}
              </p>

              {/* Close CTAs */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-sm transition-all"
                >
                  {isRtl ? "إغلاق" : "Close"}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
