/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ContactDetails, UserRole } from "../types";
import { translations } from "../utils/translations";
import { 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Globe, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Twitter,
  AlertCircle,
  BellRing
} from "lucide-react";

interface SettingsManagerProps {
  currentLang: "en" | "ar";
  settings: ContactDetails;
  userRole: UserRole;
  onUpdateSettings: (settings: Partial<ContactDetails>) => Promise<boolean>;
}

export default function SettingsManager({
  currentLang,
  settings,
  userRole,
  onUpdateSettings
}: SettingsManagerProps) {
  const [formData, setFormData] = useState<ContactDetails>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === "Viewer") {
      setErrorText(t.umRestriction);
      return;
    }

    setIsSaving(true);
    setSuccess(false);
    setErrorText("");

    try {
      const result = await onUpdateSettings(formData);
      if (result) {
        setSuccess(true);
      } else {
        setErrorText("Failure saving settings file to backend.");
      }
    } catch {
      setErrorText("Error routing settings configurations.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Header section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {t.smHeader}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isRtl 
            ? "حدث أرقام الهواتف، البريد المخصص لاستلام استمارات التسجيل، وروابط حسابات السوشيال ميديا للمدرسة." 
            : "Update phones, location coordinates, administrative alert recipient and branch branding links."}
        </p>
      </div>

      {userRole === "Viewer" && (
        <div className="p-4 bg-amber-500/10 border border-amber-550/20 text-amber-800 dark:text-amber-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{t.umRestriction} (Viewer Mode ONLY)</span>
        </div>
      )}

      {/* Main Configurations Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Core details block */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-850 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-850 dark:text-white pb-3 border-b border-light dark:border-slate-850 flex items-center gap-2">
            <Globe className="text-sky-600 animate-pulse" size={16} />
            <span>{isRtl ? "بيانات الاتصال ومستلم استمارات التسجيل" : "General Contact Credentials"}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.smPhone}</label>
              <div className="relative">
                <input
                  type="text"
                  id="phone-settings"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
                <Phone className="absolute left-3 top-3.5 text-slate-405" size={14} />
              </div>
            </div>

            {/* Alt Phone */}
            <div className="space-y-2">
              <label htmlFor="altPhone-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.smAltPhone}</label>
              <div className="relative">
                <input
                  type="text"
                  id="altPhone-settings"
                  name="altPhone"
                  value={formData.altPhone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
                <Phone className="absolute left-3 top-3.5 text-slate-405" size={14} />
              </div>
            </div>

            {/* Public Email */}
            <div className="space-y-2">
              <label htmlFor="email-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.smEmail}</label>
              <div className="relative">
                <input
                  type="email"
                  id="email-settings"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
                <Mail className="absolute left-3 top-3.5 text-slate-405" size={14} />
              </div>
            </div>

            {/* CONFIGURATION NOTIFICATION EMAIL TRIGGERS (satisfies "change the email for contact form submission notifications easily") */}
            <div className="space-y-2">
              <label htmlFor="notificationEmail-settings" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1">
                <BellRing size={12} />
                <span>{t.smAlertEmail} *</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="notificationEmail-settings"
                  name="notificationEmail"
                  required
                  value={formData.notificationEmail}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-indigo-200 dark:border-indigo-900 rounded-xl bg-indigo-50/10 dark:bg-indigo-950/10 text-slate-800 dark:text-indigo-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-bold font-semibold"
                />
                <BellRing className="absolute left-3 top-3.5 text-indigo-455 animate-bounce" size={14} />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {t.smAlertHint}
              </p>
            </div>

          </div>

          {/* Bilingual locations details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-850">
            
            <div className="space-y-2">
              <label htmlFor="addressEn-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Campus Address (English)</label>
              <div className="relative">
                <input
                  type="text"
                  id="addressEn-settings"
                  name="addressEn"
                  value={formData.addressEn}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
                <MapPin className="absolute left-3 top-3.5 text-slate-405" size={14} />
              </div>
            </div>

            <div className="space-y-2" dir="rtl">
              <label htmlFor="addressAr-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide text-right block">عنوان وقرية الحرم (بالعربية)</label>
              <div className="relative">
                <input
                  type="text"
                  id="addressAr-settings"
                  name="addressAr"
                  value={formData.addressAr}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-sm focus:outline-none text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="workingHoursEn-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Academic Hours Description (EN)</label>
              <div className="relative">
                <input
                  type="text"
                  id="workingHoursEn-settings"
                  name="workingHoursEn"
                  value={formData.workingHoursEn}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
                <Clock className="absolute left-3 top-3.5 text-slate-405" size={14} />
              </div>
            </div>

            <div className="space-y-2" dir="rtl">
              <label htmlFor="workingHoursAr-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide text-right block">أوقات وساعات الدوام الرسمي (العربية)</label>
              <div className="relative">
                <input
                  type="text"
                  id="workingHoursAr-settings"
                  name="workingHoursAr"
                  value={formData.workingHoursAr}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none text-right"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Branding Social Icons Link Settings (satisfies "adding and changing soical media icons links to match our branding requirements.") */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-850 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-850 dark:text-white pb-3 border-b border-light dark:border-slate-850 flex items-center gap-2">
            <Facebook className="text-indigo-600" size={16} />
            <span>{t.smSocialHeader}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Facebook */}
            <div className="space-y-2">
              <label htmlFor="socialFacebook-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.smFacebook}</label>
              <div className="relative">
                <input
                  type="text"
                  id="socialFacebook-settings"
                  name="socialFacebook"
                  value={formData.socialFacebook}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
                <Facebook className="absolute left-3 top-3.5 text-slate-405" size={14} />
              </div>
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <label htmlFor="socialInstagram-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.smInstagram}</label>
              <div className="relative">
                <input
                  type="text"
                  id="socialInstagram-settings"
                  name="socialInstagram"
                  value={formData.socialInstagram}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
                <Instagram className="absolute left-3 top-3.5 text-slate-405" size={14} />
              </div>
            </div>

            {/* Linkedin */}
            <div className="space-y-2">
              <label htmlFor="socialLinkedin-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.smLinkedin}</label>
              <div className="relative">
                <input
                  type="text"
                  id="socialLinkedin-settings"
                  name="socialLinkedin"
                  value={formData.socialLinkedin}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
                <Linkedin className="absolute left-3 top-3.5 text-slate-405" size={14} />
              </div>
            </div>

            {/* Youtube */}
            <div className="space-y-2">
              <label htmlFor="socialYoutube-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.smYoutube}</label>
              <div className="relative">
                <input
                  type="text"
                  id="socialYoutube-settings"
                  name="socialYoutube"
                  value={formData.socialYoutube}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
                <Youtube className="absolute left-3 top-3.5 text-slate-455 hover:text-red-500" size={14} />
              </div>
            </div>

            {/* Twitter / X */}
            <div className="space-y-2">
              <label htmlFor="socialX-settings" className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.smX}</label>
              <div className="relative">
                <input
                  type="text"
                  id="socialX-settings"
                  name="socialX"
                  value={formData.socialX}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                />
                <Twitter className="absolute left-3 top-3.5 text-slate-405" size={14} />
              </div>
            </div>

          </div>
        </div>

        {/* Form notification flags */}
        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-sm font-semibold rounded-xl">
            ✓ General configurations and alert mail successfully committed and updated.
          </div>
        )}

        {errorText && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-455 text-sm font-bold rounded-xl flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorText}</span>
          </div>
        )}

        {/* Submit button row */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
          <button
            type="submit"
            disabled={isSaving || userRole === "Viewer"}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-sky-600 to-indigo-650 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-sky-500/15 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Save size={15} />
            <span>{isSaving ? "Saving details..." : "Commit Site Configurations"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
