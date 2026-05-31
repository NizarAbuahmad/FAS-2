/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Zap, CheckCircle } from "lucide-react";
import { CarouselSlide } from "../types";
import { translations } from "../utils/translations";

interface HeroCarouselProps {
  slides: CarouselSlide[];
  currentLang: "en" | "ar";
}

export default function HeroCarousel({ slides, currentLang }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  // Minimum distance required to registers a swipe gesture
  const minSwipeDistance = 50;

  // Auto scroll effect
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentIndex, slides.length]);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (slides.length > 1) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 6000); // 6s rotation
    }
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handlePrev = () => {
    stopAutoPlay();
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    startAutoPlay();
  };

  const handleNext = () => {
    stopAutoPlay();
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    startAutoPlay();
  };

  const handleDotClick = (index: number) => {
    stopAutoPlay();
    setCurrentIndex(index);
    startAutoPlay();
  };

  // Touch handlers for mobile swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swiped Left. If RTL, go back, else go next
      isRtl ? handlePrev() : handleNext();
    } else if (isRightSwipe) {
      // Swiped Right. If RTL, go next, else go back
      isRtl ? handleNext() : handlePrev();
    }
  };

  // Support Mouse Drag Swipe simulation too for testing on desktops!
  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const onMouseUp = () => {
    if (!touchStart || !touchEnd) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      isRtl ? handlePrev() : handleNext();
    } else if (isRightSwipe) {
      isRtl ? handleNext() : handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-slate-100 dark:bg-slate-800">
        <span className="text-slate-500 font-medium">No slides active in database. Manage slides in CMS.</span>
      </div>
    );
  }

  return (
    <section 
      id="home"
      className="relative h-[80vh] sm:h-[85vh] w-full overflow-hidden bg-slate-900 group select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => { setTouchStart(null); setTouchEnd(null); }}
    >
      {/* Slide Stack Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive 
                  ? "opacity-100 scale-100 pointer-events-auto" 
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              {/* Overlay Backdrop to increase contrast */}
              <div className="absolute inset-0 bg-slate-950/60 z-10 transition-colors duration-500" />
              
              {/* Background Images with LAZY LOADING SUPPORT built-in */}
              <img
                src={slide.image}
                alt={currentLang === "en" ? slide.titleEn : slide.titleAr}
                // Only load high res for active, preceding, or succeeding for optimal performance (lazy loading simulation/real structure)
                loading={index === 0 ? "eager" : "lazy"}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-10000 ease-linear"
              />

              {/* Dynamic Content Overlay centered nicely */}
              <div className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-8">
                <div className="max-w-4xl text-center text-white space-y-5 sm:space-y-6">
                  
                  {/* Highly responsive tag demonstrating progressive optimization performance */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white font-sans text-xs font-bold leading-none tracking-wide shadow-sm transform transition-all duration-500 animate-pulse">
                    <CheckCircle size={12} />
                    <span>{t.carouselOptimized}</span>
                  </div>

                  {/* Responsive Heading */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                    {currentLang === "en" ? slide.titleEn : slide.titleAr}
                  </h1>

                  {/* Responsive Subtitle */}
                  <p className="text-base sm:text-xl text-slate-100 max-w-2xl mx-auto font-medium leading-relaxed">
                    {currentLang === "en" ? slide.subtitleEn : slide.subtitleAr}
                  </p>

                  {/* Call to Actions buttons */}
                  <div className="pt-2 flex flex-wrap justify-center gap-4">
                    <a
                      href="#tracks"
                      className="px-6 py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-lg text-sm transition-all transform hover:-translate-y-0.5 shadow-md shadow-sky-500/20"
                    >
                      {t.exploreFeatures}
                    </a>
                    <a
                      href="#contact"
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold rounded-lg text-sm transition-all transform hover:-translate-y-0.5"
                    >
                      {t.registerNow}
                    </a>
                  </div>

                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Swipe Overlay Help Text (Fades out) */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none hidden sm:block">
        <span className="text-[10px] text-slate-400 font-sans tracking-widest uppercase">
          {isRtl ? "اسحب لليمين/اليسار أو استخدم الأسهم للتنقل" : "Swipe Left/Right or click arrows to browse"}
        </span>
      </div>

      {/* Manual Control Trigger Arrows (Desktop) */}
      <button
        id="btn-carousel-prev"
        onClick={handlePrev}
        className="absolute top-1/2 -translate-y-1/2 left-4 z-30 p-3 rounded-full bg-white/10 dark:bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-sky-600/90 dark:hover:bg-sky-600/90 hover:scale-105 transition-all duration-300"
        aria-label={t.prevSlide}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        id="btn-carousel-next"
        onClick={handleNext}
        className="absolute top-1/2 -translate-y-1/2 right-4 z-30 p-3 rounded-full bg-white/10 dark:bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-sky-600/90 dark:hover:bg-sky-600/90 hover:scale-105 transition-all duration-300"
        aria-label={t.nextSlide}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dynamic Indicators / Dot navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-2.5 rtl:space-x-reverse">
        {slides.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive ? "w-8 bg-sky-500" : "w-2.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}
