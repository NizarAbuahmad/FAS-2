/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  GraduationCap, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Globe, 
  LayoutDashboard, 
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { translations } from "../utils/translations";
import SchoolLogo from "./SchoolLogo";
import { CustomPage } from "../types";

interface NavbarProps {
  currentLang: "en" | "ar";
  setLang: (lang: "en" | "ar") => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  isAdminMode: boolean;
  setAdminMode: (admin: boolean) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  openLoginModal: () => void;
  pages?: CustomPage[];
  activePageSlug?: string;
  onNavigate?: (slug: string) => void;
}

export default function Navbar({
  currentLang,
  setLang,
  isDark,
  toggleDarkMode,
  isAdminMode,
  setAdminMode,
  isLoggedIn,
  onLogout,
  openLoginModal,
  pages = [],
  activePageSlug = "",
  onNavigate
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  const navItems = [
    { name: t.navHome, href: "#home", isStatic: true, slug: "" },
    { name: t.navAbout, href: "#about", isStatic: true, slug: "" },
    { name: t.navTracks, href: "#tracks", isStatic: true, slug: "" },
    { name: t.navNews, href: "#news", isStatic: true, slug: "" },
    ...pages.map(p => ({
      name: isRtl ? p.titleAr : p.titleEn,
      href: `#page-${p.slug}`,
      isStatic: false,
      slug: p.slug
    })),
    { name: t.navContact, href: "#contact", isStatic: true, slug: "" }
  ];

  const handleLinkClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (!item.isStatic) {
      e.preventDefault();
      if (onNavigate && item.slug) {
        onNavigate(item.slug);
      }
    } else {
      if (activePageSlug && onNavigate) {
        onNavigate("");
        setTimeout(() => {
          const el = document.querySelector(item.href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const handleLangToggle = () => {
    setLang(currentLang === "en" ? "ar" : "en");
  };

  return (
    <header 
      id="main-nav-bar"
      className="sticky top-0 z-50 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border-b border-sky-100 dark:border-white/10 shadow-sm transition-all duration-300"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand/Logo Area */}
          <div className="flex items-center space-x-2.5 space-x-reverse">
            <a href="#" className="flex-shrink-0 group" aria-label="First Academy School Homepage">
              <SchoolLogo 
                className="w-13 h-13 object-contain rounded-full p-[1.5px] bg-white border border-[#1565C0]/30 shadow-[0_2px_10px_rgba(21,101,192,0.12)] group-hover:scale-105 transition-all duration-300"
                size={52}
                showText={false}
              />
            </a>
            <div className="flex flex-col justify-center">
              <span className="text-sm sm:text-base font-black text-[#0D47A1] dark:text-[#E3F2FD] tracking-tight leading-tight font-sans">
                {currentLang === "en" ? t.schoolName : "روضة ومدارس الأكاديمية الأولى"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#1565C0] dark:text-[#64B5F6] tracking-wider leading-none mt-1 uppercase font-sans">
                {currentLang === "en" ? t.tagline : "FIRST ACADEMY SCHOOL — AMMAN"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-x-4 lg:gap-x-6 xl:gap-x-7">
            {!isAdminMode ? (
              navItems.map((item) => {
                const isContact = item.href === "#contact";
                if (isContact) {
                  return (
                    <a
                      key={item.href}
                      id={`nav-link-${item.href.replace('#', '')}`}
                      href={item.href}
                      onClick={(e) => handleLinkClick(item, e)}
                      className="text-xs sm:text-[13px] font-black tracking-wide bg-amber-550/10 hover:bg-amber-500 text-amber-600 hover:text-black dark:text-amber-450 dark:hover:text-black border border-amber-500/40 px-3.5 py-1.5 rounded-full transition-all duration-300 shadow-sm whitespace-nowrap leading-none ltr:ml-2 rtl:mr-2"
                    >
                      {item.name}
                    </a>
                  );
                }
                return (
                  <a
                    key={item.href}
                    id={`nav-link-${item.href.replace('#', '')}`}
                    href={item.href}
                    onClick={(e) => handleLinkClick(item, e)}
                    className={`text-[15px] font-semibold transition-colors py-2 whitespace-nowrap ${
                      (item.slug && activePageSlug === item.slug)
                        ? "text-amber-500 font-extrabold dark:text-amber-400 border-b-2 border-amber-500"
                        : "text-slate-600 hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400"
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })
            ) : (
              <button
                id="btn-return-site"
                onClick={() => setAdminMode(false)}
                className="flex items-center gap-2 text-slate-600 hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400 transition-colors font-semibold text-sm py-2"
              >
                {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {isRtl ? "العودة لتصفح الموقع" : "Return to Public Portal"}
              </button>
            )}
          </nav>

          {/* Action Tools Utilities (Lang/Admin Console) */}
          <div className="hidden md:flex items-center gap-x-3 lg:gap-x-4 ltr:pl-4 rtl:pr-4">
            {/* Language toggle */}
            <button
              id="lang-toggle-btn"
              onClick={handleLangToggle}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-slate-200 dark:border-white/10 rounded-lg text-slate-705 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <Globe size={15} />
              <span className="font-sans text-xs tracking-wider uppercase">
                {currentLang === "en" ? "العربية" : "English"}
              </span>
            </button>

            {/* Admin Console Entry */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-nav-dashboard"
                  onClick={() => setAdminMode(!isAdminMode)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isAdminMode
                      ? "bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10"
                      : "bg-amber-500 hover:bg-amber-600 text-black font-extrabold shadow-sm hover:shadow"
                  }`}
                >
                  <LayoutDashboard size={15} />
                  <span>{isAdminMode ? t.navHome : t.navDashboard}</span>
                </button>
                <button
                  id="btn-nav-logout"
                  onClick={onLogout}
                  className="px-3 py-2 text-sm text-[13px] font-semibold text-rose-605 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-950/50"
                >
                  {t.logoutCTA}
                </button>
              </div>
            ) : (
              <button
                id="btn-nav-login"
                onClick={openLoginModal}
                className="flex items-center gap-2 px-[15px] py-2 text-sm font-extrabold bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-black rounded-lg shadow-sm hover:shadow transition-all"
              >
                <LayoutDashboard size={15} />
                <span>{t.loginCTA}</span>
              </button>
            )}
          </div>

          {/* Hamburger / Mobile Area Toggle */}
          <div className="flex items-center md:hidden space-x-3 space-x-reverse">
            <button
              id="mobile-theme-toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              id="mobile-lang-toggle"
              onClick={handleLangToggle}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 text-xs font-bold px-2.5 py-1"
            >
              {currentLang === "en" ? "Ar" : "En"}
            </button>
            <button
              id="mobile-menu-burger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-t border-sky-50 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 shadow-inner space-y-3">
          {!isAdminMode ? (
            navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleLinkClick(item, e);
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2.5 rounded-lg font-medium text-sm leading-none ${
                  (item.slug && activePageSlug === item.slug)
                    ? "text-amber-550 font-extrabold bg-amber-500/5 dark:text-amber-450 dark:bg-amber-500/10 border-r-4 border-amber-500"
                    : "text-slate-700 hover:bg-sky-50 dark:text-slate-300 dark:hover:bg-slate-800 hover:text-amber-500 dark:hover:text-amber-400"
                }`}
              >
                {item.name}
              </a>
            ))
          ) : (
            <button
              onClick={() => {
                setAdminMode(false);
                setMobileMenuOpen(false);
              }}
              className="w-full text-right px-3 py-2.5 rounded-lg font-medium text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2"
            >
              {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span>{isRtl ? "العودة لتصفح الموقع" : "Return to Public Portal"}</span>
            </button>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setAdminMode(!isAdminMode);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-sky-600 text-white font-bold rounded-lg text-sm"
                >
                  <LayoutDashboard size={15} />
                  <span>{isAdminMode ? t.navHome : t.navDashboard}</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg"
                >
                  {t.logoutCTA}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  openLoginModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-sky-600 text-white font-bold rounded-lg text-sm"
              >
                <LayoutDashboard size={15} />
                <span>{t.loginCTA}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
