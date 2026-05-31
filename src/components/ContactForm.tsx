/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { translations } from "../utils/translations";
import { ContactDetails } from "../types";
import { 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Send, 
  AlertCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from "lucide-react";

interface ContactFormProps {
  currentLang: "en" | "ar";
  settings: ContactDetails;
  onSubmitMessage: (msg: { name: string; email: string; phone: string; subject: string; message: string }) => Promise<boolean>;
}

export default function ContactForm({ currentLang, settings, onSubmitMessage }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "server_error">("idle");
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      const success = await onSubmitMessage(formData);
      if (success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setSubmitStatus("server_error");
      }
    } catch (err) {
      setSubmitStatus("server_error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-16 sm:py-24 bg-white dark:bg-slate-900 bg-dot-matrix transition-colors duration-300"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 tracking-wider uppercase bg-sky-50 dark:bg-sky-950 px-3.5 py-1.5 rounded-full">
            {isRtl ? "تواصل مباشر مع قسم القبول" : "Admission & General Queries"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
            {t.contactHeader}
          </h2>
          <div className="h-1 w-20 bg-sky-600 mx-auto rounded-full mt-2" />
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
            {t.contactSub}
          </p>
        </div>

        {/* Contact Info Grid and Form layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Columns 1-5: Contact details and interactive map placeholder */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-3xl p-8 border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <div className="space-y-8">
              
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
                {t.contactDetailsTitle}
              </h3>

              {/* Items */}
              <div className="space-y-6">
                
                {/* Location */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      {isRtl ? "عنوان الحرم" : "Campus Location"}
                    </h4>
                    <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                      {currentLang === "en" ? settings.addressEn : settings.addressAr}
                    </p>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      {isRtl ? "الهواتف الرسمية" : "Phone Lines"}
                    </h4>
                    <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5" dir="ltr">
                      <span className="text-[11px] text-slate-400 font-normal">{isRtl ? "هاتف:" : "Tel:"}</span> 
                      <a href={`tel:${settings.phone}`} className="hover:text-[#1565C0] transition-colors">{settings.phone}</a>
                    </p>
                    <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5" dir="ltr">
                      <span className="text-[11px] text-slate-400 font-normal">{isRtl ? "موبايل:" : "Mob:"}</span> 
                      <a href={`tel:${settings.altPhone}`} className="hover:text-[#1565C0] transition-colors">{settings.altPhone}</a>
                    </p>
                  </div>
                </div>

                {/* Email inboxes */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      {isRtl ? "البريد الإلكتروني للقبول" : "Admission Sinks"}
                    </h4>
                    <p className="text-sm sm:text-base font-bold text-sky-600 dark:text-sky-400 select-all">
                      {settings.email}
                    </p>
                  </div>
                </div>

                {/* Working hours */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      {t.workingHoursTitle}
                    </h4>
                    <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                      {currentLang === "en" ? settings.workingHoursEn : settings.workingHoursAr}
                    </p>
                  </div>
                </div>

              </div>

              {/* Dynamic Notification Dispatch Alert Box */}
              <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={16} />
                <div className="text-xs">
                  <p className="font-bold text-slate-700 dark:text-slate-200">
                    {t.alertRecipientTitle}
                  </p>
                  <p className="font-mono text-emerald-600 dark:text-emerald-400 mt-1 select-all font-semibold">
                    {settings.notificationEmail}
                  </p>
                </div>
              </div>

            </div>

            {/* Social Branding Media */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:scale-105 transition-all rounded-xl"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={settings.socialInstagram}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:scale-105 transition-all rounded-xl"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={settings.socialLinkedin}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 transition-all rounded-xl"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={settings.socialX}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-105 transition-all rounded-xl"
                aria-label="X (Twitter)"
              >
                <Twitter size={18} />
              </a>
            </div>

          </div>

          {/* Columns 6-12: The submission form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-between">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name-input" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t.formName} *
                  </label>
                  <input
                    type="text"
                    id="name-input"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={isRtl ? "مثال: رائد محمد" : "e.g. Raed Mohammad"}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email-input" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t.formEmail} *
                  </label>
                  <input
                    type="email"
                    id="email-input"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone-input" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t.formPhone}
                  </label>
                  <input
                    type="text"
                    id="phone-input"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+962 79 123 4567"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                {/* Subject Grade */}
                <div className="space-y-2">
                  <label htmlFor="subject-input" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t.formSubject}
                  </label>
                  <input
                    type="text"
                    id="subject-input"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={isRtl ? "مثال: الصف التاسع - دولي" : "e.g. Grade 9 - International"}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message-textarea" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.formMessage} *
                </label>
                <textarea
                  id="message-textarea"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={isRtl ? "تفضل بكتابة تفاصيل استفسارك الأكاديمي..." : "Provide academic questions or tour request comments..."}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 transition-colors resize-none"
                />
              </div>

              {/* Status reporting feedback */}
              {submitStatus === "success" && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-800 dark:text-emerald-400 text-sm font-semibold flex items-start gap-2.5">
                  <span className="mt-0.5">✓</span>
                  <span>{t.formSuccess}</span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-800 dark:text-rose-400 text-sm font-semibold flex items-start gap-2.5">
                  <span className="mt-0.5">⚠</span>
                  <span>{t.formError}</span>
                </div>
              )}

              {submitStatus === "server_error" && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-800 dark:text-rose-400 text-sm font-semibold flex items-start gap-2.5">
                  <span className="mt-0.5">⚠</span>
                  <span>{(t as any).formServerError || "Failed to submit message due to a server error. Please try again later."}</span>
                </div>
              )}

              <button
                type="submit"
                id="btn-submit-message"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-sky-600 to-indigo-650 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl text-sm transition-all shadow-md shadow-sky-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={15} />
                <span>{isSubmitting ? t.formSubmitting : t.formSubmit}</span>
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
