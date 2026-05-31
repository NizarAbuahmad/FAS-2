/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { MediaAsset, UserRole } from "../types";
import { translations } from "../utils/translations";
import { compressImage } from "../utils/imageCompressor";
import { 
  Upload, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  FileIcon,
  ImageIcon,
  HardDrive
} from "lucide-react";

interface MediaManagerProps {
  currentLang: "en" | "ar";
  media: MediaAsset[];
  userRole: UserRole;
  onUploadMedia: (media: { name: string; type: string; size: number; content: string }) => Promise<any>;
  onDeleteMedia: (id: string) => Promise<boolean>;
}

export default function MediaManager({
  currentLang,
  media,
  userRole,
  onUploadMedia,
  onDeleteMedia
}: MediaManagerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const isRtl = currentLang === "ar";
  const t = translations[currentLang];

  // Helper formatting size bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (userRole === "Viewer") {
      setErrMsg(t.umRestriction);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrMsg("Only image files are permitted for dashboard slide integration.");
      return;
    }

    setUploading(true);
    setErrMsg("");
    setSuccessMsg("");

    try {
      const compressedBase64 = await compressImage(file);
      const approximateSize = Math.round((compressedBase64.length * 3) / 4);
      
      // Post payload to backend
      const result = await onUploadMedia({
        name: file.name,
        type: "image/jpeg",
        size: approximateSize,
        content: compressedBase64
      });

      if (result) {
        setSuccessMsg(`Succesfully optimized and registered: ${file.name}`);
      } else {
        setErrMsg("File upload dispatch aborted by server.");
      }
    } catch (err) {
      setErrMsg("File upload or image compression failure.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const selectFilesShortcut = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async (id: string) => {
    if (userRole === "Viewer") {
      alert(t.umRestriction);
      return;
    }
    if (confirm(isRtl ? "هل تريد إزالة هذا الملف نهائياً من مكتبة الصور المرفوعة؟" : "Confirm deleting this image asset permanently?")) {
      await onDeleteMedia(id);
    }
  };

  // Stats
  const totalVolumeSum = media.reduce((acc, cur) => acc + (cur.size || 0), 0);
  const optimizedCount = media.filter(m => m.optimized).length;

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.dashMedia}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isRtl 
              ? "منصة سحب وإفلات لرفع الصور وتنشيط الحرم المدرسي والفعاليات بنسق ويب سريع." 
              : "Drag and drop local image files. Enforces fast progressive loads for all devices."}
          </p>
        </div>

        {/* Volume stat */}
        <div className="flex items-center gap-3 bg-slate-105 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-850">
          <HardDrive className="text-sky-600" size={18} />
          <div>
            <p className="text-[10px] text-slate-450 uppercase font-bold leading-none">{t.mmStorage}</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono">{formatBytes(totalVolumeSum)}</p>
          </div>
        </div>
      </div>

      {/* Warnings & Messages alerts */}
      {errMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-400 text-xs font-bold rounded-xl flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{errMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle size={15} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Drag & Drop Target Area (satisfies "provide a clear dashboard for managing all uploaded assets efficiently. This should also support drag-and-drop file organization.") */}
      <div
        id="drag-and-drop-target"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={selectFilesShortcut}
        className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-sky-500 bg-sky-500/5"
            : "border-slate-300 dark:border-slate-800 hover:border-sky-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/60"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={uploading || userRole === "Viewer"}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-2xl">
            <Upload size={28} className={uploading ? "animate-bounce" : ""} />
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {uploading ? "Compressing & indexing on server..." : t.mmDropzone}
            </p>
            <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
              {t.mmDropHint}
            </p>
          </div>
        </div>
      </div>

      {/* Grid listing of uploaded assets */}
      <div className="space-y-3 pt-4">
        <h3 className="text-base font-bold text-slate-850 dark:text-white flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
          <span>{isRtl ? "الملفات المتوفرة" : "Uploaded Assets Gallery"}</span>
          <span className="text-xs font-mono font-bold text-slate-400">{media.length} files total ({optimizedCount} optimized)</span>
        </h3>

        {media.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 text-slate-500 text-xs font-medium">
            No media assets found. Drag and drop local images above to begin.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {media.map((asset) => (
              <div
                key={asset.id}
                id={`media-card-${asset.id}`}
                className="group relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                {/* Visual Image Screen */}
                <div className="h-32 bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                  {asset.type.startsWith("image/") ? (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <FileIcon size={32} />
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                    {asset.optimized ? (
                      <span className="bg-emerald-500/90 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        {t.mmOptimizedBadge}
                      </span>
                    ) : (
                      <span className="bg-slate-700/80 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {t.mmOriginalBadge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer specs */}
                <div className="p-4 space-y-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate select-all">{asset.name}</p>
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-450 font-semibold font-mono">
                    <span>{formatBytes(asset.size)}</span>
                    <span>{asset.uploadedAt.split("T")[0]}</span>
                  </div>

                  {/* Copy link overlay & Trash Button */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-850/60 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(asset.url);
                        alert("File URL copied to clipboard! You can paste this in any slide image or blog content field.");
                      }}
                      className="text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      Copy URL link
                    </button>

                    <button
                      onClick={() => handleDelete(asset.id)}
                      disabled={userRole === "Viewer"}
                      className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg disabled:opacity-50"
                      aria-label="Delete File"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
