/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AdminUser, UserRole } from "../types";
import { translations } from "../utils/translations";
import { 
  FileText, 
  Image as ImageIcon, 
  FolderOpen, 
  Inbox, 
  Settings, 
  Users, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  X, 
  MapPin, 
  BookOpen, 
  ALargeSmall, 
  Images 
} from "lucide-react";

interface DashboardLayoutProps {
  currentLang: "en" | "ar";
  currentUser: AdminUser | null;
  activeTab: "posts" | "carousel" | "media" | "messages" | "settings" | "users" | "pages" | "siteTexts" | "gallery";
  setActiveTab: (tab: "posts" | "carousel" | "media" | "messages" | "settings" | "users" | "pages" | "siteTexts" | "gallery") => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({
  currentLang,
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  children
}: DashboardLayoutProps) {
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  const menuItems = [
    { id: "posts", label: t.dashPosts, icon: <FileText size={16} /> },
    { id: "gallery", label: (t as any).dashGallery || (currentLang === "ar" ? "معرض الصور والأنشطة" : "School & Activity Gallery"), icon: <Images size={16} /> },
    { id: "pages", label: (t as any).dashPages || "Dynamic Pages", icon: <BookOpen size={16} /> },
    { id: "siteTexts", label: (t as any).dashSiteTexts || "Site Texts", icon: <ALargeSmall size={16} /> },
    { id: "carousel", label: t.dashCarousel, icon: <ImageIcon size={16} /> },
    { id: "media", label: t.dashMedia, icon: <FolderOpen size={16} /> },
    { id: "messages", label: t.dashMessages, icon: <Inbox size={16} /> },
    { id: "settings", label: t.dashSettings, icon: <Settings size={16} /> },
    { id: "users", label: t.dashUsers, icon: <Users size={16} /> }
  ] as const;

  let displayRole = currentUser?.role || "Viewer";
  if (currentLang === "ar") {
    if (currentUser?.role === "Admin") displayRole = "مدير نظام" as any;
    else if (currentUser?.role === "Editor") displayRole = "محرر محتوى" as any;
    else if (currentUser?.role === "Viewer") displayRole = "مستعرض تقارير" as any;
  }

  return (
    <div 
      className="min-h-screen bg-[#0a0a0a] text-gray-200 flex flex-col md:flex-row transition-colors duration-300" 
      dir={isRtl ? "rtl" : "ltr"}
    >
      
      {/* SIDEBAR NAVIGATION COLUMN */}
      <aside className="w-full md:w-68 bg-[#111111] border-b md:border-b-0 md:border-r rtl:md:border-r-0 rtl:md:border-l border-white/10 flex flex-col justify-between p-6">
        
        <div className="space-y-8">
          
          {/* Headline branding */}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
            <div>
              <p className="text-sm font-bold tracking-tighter text-white leading-none font-sans uppercase">
                {t.dashTitle} <span className="font-light opacity-50">CMS</span>
              </p>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-sans">{t.arabicName}</p>
            </div>
          </div>

          {/* ACTIVE LOGGED-IN ADMIN ROW ROLE-BASED */}
          {currentUser && (
            <div className="p-4 bg-[#151515] border border-white/5 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-tr from-amber-500 to-orange-300 flex-shrink-0" />
                <span className="text-xs font-semibold text-white">
                  @{currentUser.username}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/5 text-[10px] text-gray-400 uppercase tracking-wider">
                <span>{t.dashUserRole}:</span>
                <span className="text-amber-450 font-sans font-extrabold">{displayRole}</span>
              </div>
            </div>
          )}

          {/* Nav Items menu */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-3 px-3">
              {isRtl ? "إدارة النظام" : "Management"}
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                
                // Direct lock symbol indicators for Viewer on sensitive fields
                const isViewerRestricted = currentUser?.role === "Viewer" && ["posts", "carousel", "media", "settings", "users", "pages", "siteTexts"].includes(item.id);
                
                return (
                  <button
                    key={item.id}
                    id={`sidebar-link-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white/5 text-white border border-white/10 shadow-md text-amber-400"
                        : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`transition-opacity ${isActive ? "opacity-100 text-amber-400" : "opacity-50"}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {isViewerRestricted && (
                      <span className="text-[9px] uppercase tracking-wider bg-white/5 text-gray-500 px-1.5 py-0.5 rounded font-bold font-mono border border-white/5">
                        {isRtl ? "قراءة" : "Read Only"}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

        </div>

        {/* Sidebar buttons bottom (Logout / exit) */}
        <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
          
          <button
            id="btn-sidebar-logout"
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-amber-200/70 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-white/5"
          >
            <LogOut size={14} className="text-amber-500/80" />
            <span>{t.logoutCTA}</span>
          </button>

          <span className="text-[9px] font-mono text-center text-gray-600 block mt-2 uppercase tracking-widest">
            FAS CMS v2.4.1 (STABLE)
          </span>
        </div>

      </aside>

      {/* MAIN LAYOUT CANVAS WINDOW */}
      <main className="flex-grow p-4 sm:p-8 md:p-10 max-h-screen overflow-y-auto bg-[#0a0a0a]">
        {children}
      </main>

    </div>
  );
}
