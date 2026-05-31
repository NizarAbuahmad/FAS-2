import React from "react";

interface SchoolLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export default function SchoolLogo({ className = "", size = "100%", showText = false }: SchoolLogoProps) {
  return (
    <div className={`flex ${showText ? "flex-col items-center text-center" : "items-center"} ${className}`}>
      {/* Visual Logo SVG Icon */}
      <svg
        viewBox="0 0 100 100"
        width={typeof size === "number" ? size : undefined}
        height={typeof size === "number" ? size : undefined}
        className={typeof size === "string" ? size : undefined}
        style={{ minWidth: typeof size === "number" ? size : undefined }}
      >
        <defs>
          {/* Subtle drop shadow for the globe */}
          <filter id="globe-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Blue gradient for the globe ocean */}
          <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#29B6F6" />
            <stop offset="60%" stopColor="#1565C0" />
            <stop offset="100%" stopColor="#0D47A1" />
          </linearGradient>

          {/* Green gradient for continents */}
          <linearGradient id="land-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#AEEA00" />
            <stop offset="100%" stopColor="#689F38" />
          </linearGradient>
          
          {/* Drop shadow for the orbital tracks */}
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* --- white background circle to block out background noise --- */}
        <circle cx="50" cy="50" r="46" fill="#FFFFFF" />

        {/* --- 1. DETAILED 3D GLOBE IN CENTER --- */}
        <g filter="url(#globe-glow)">
          {/* Ocean Sphere */}
          <circle cx="50" cy="50" r="21" fill="url(#ocean-gradient)" />
          
          {/* Europe, Africa, Middle East & Asia Shapes */}
          {/* Europe */}
          <path 
            d="M 45,31 C 47,32 50,30 52,31 C 55,32 54,34 50,35 C 47,35 44,33 45,31 Z" 
            fill="url(#land-gradient)" 
          />
          <path 
            d="M 53,30 C 51,29 55,27 57,28 C 58,29 55,30 53,30 Z" 
            fill="url(#land-gradient)" 
          />
          {/* UK / Islands */}
          <circle cx="41" cy="31" r="1.2" fill="url(#land-gradient)" />

          {/* Africa */}
          <path 
            d="M 41,35 C 44,34 49,36 51,37 C 54,38 56,41 55,44 C 53,49 52,52 50,55 C 48,58 48,60 48,64 C 47,62 46,55 45,52 C 44,50 42,49 41,47 C 39,45 38,41 41,35 Z" 
            fill="url(#land-gradient)" 
          />
          
          {/* Middle East */}
          <path 
            d="M 54,37 C 56,36 59,36 60,38 C 60,40 57,43 55,42 C 54,41 52,39 54,37 Z" 
            fill="url(#land-gradient)" 
          />
          
          {/* Asia / Russia */}
          <path 
            d="M 58,29 C 61,29 65,30 67,32 C 69,33 67,36 64,36 C 61,36 59,33 58,29 Z" 
            fill="url(#land-gradient)" 
          />
          <path 
            d="M 64,36 C 66,37 69,38 69,42 C 68,44 65,47 62,45 C 59,44 58,40 64,36 Z" 
            fill="url(#land-gradient)" 
          />
          
          {/* India / South Asia */}
          <path 
            d="M 62,42 C 63,43 64,45 64,48 C 63,49 61,46 62,42 Z" 
            fill="url(#land-gradient)" 
          />

          {/* Madagascar */}
          <path d="M54.5,52.5 C55,53.5 54.5,56 54,54.5 Z" fill="url(#land-gradient)" />

          {/* Antarctica sliver at bottom */}
          <path d="M 42,68 C 46,67 52,67 55,69 C 48,70 44,69 42,68 Z" fill="#E3F2FD" opacity="0.6" />
        </g>

        {/* --- 2. DYNAMIC ORBITAL SWOOSHES --- */}
        {/* Top: Blue Swoosh starting near orange node & curving down left */}
        <path
          d="M 50,11 C 38,12 28,18 20,28 C 30,22 40,16 53,16"
          fill="none"
          stroke="#00B0FF"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#shadow)"
        />

        {/* Right: Red Swoosh curving from right-indigo node down-left */}
        <path
          d="M 89,50 C 88,62 82,72 72,80 C 78,70 84,60 84,47"
          fill="none"
          stroke="#EF5350"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#shadow)"
        />

        {/* Bottom: Green Swoosh starting near bottom-yellow node & curving up left */}
        <path
          d="M 50,89 C 38,88 28,82 20,72 C 30,78 40,84 53,84"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#shadow)"
        />

        {/* Left: Purple Swoosh curving from left-cyan node up-right */}
        <path
          d="M 11,50 C 12,38 18,28 28,20 C 22,30 16,40 16,53"
          fill="none"
          stroke="#9C27B0"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#shadow)"
        />

        {/* --- 3. FOUR MAJESTIC NODE CIRCLES --- */}
        {/* Top Orange Node */}
        <circle cx="50" cy="11" r="4.2" fill="#FF8F00" stroke="#FFFFFF" strokeWidth="1" filter="url(#shadow)" />
        
        {/* Right Indigo Node */}
        <circle cx="89" cy="50" r="4.2" fill="#1A237E" stroke="#FFFFFF" strokeWidth="1" filter="url(#shadow)" />

        {/* Bottom Yellow Node */}
        <circle cx="50" cy="89" r="4.2" fill="#FFEB3B" stroke="#FFFFFF" strokeWidth="1" filter="url(#shadow)" />

        {/* Left Cyan Node */}
        <circle cx="11" cy="50" r="4.2" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1" filter="url(#shadow)" />

        {/* Little accent beads around the orbits */}
        <circle cx="28" cy="18" r="1.5" fill="#EF5350" opacity="0.8" />
        <circle cx="72" cy="82" r="1.5" fill="#00B0FF" opacity="0.8" />
        <circle cx="82" cy="28" r="1.5" fill="#4CAF50" opacity="0.8" />
        <circle cx="18" cy="72" r="1.5" fill="#9C27B0" opacity="0.8" />
      </svg>

      {/* Optional Large Branding Text */}
      {showText && (
        <div className="mt-4 flex flex-col items-center">
          <span className="text-xl md:text-2xl font-black text-[#0D47A1] dark:text-[#E3F2FD] tracking-tight leading-tight">
            روضة ومدارس الأكاديمية الأولى
          </span>
          <span className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-250 tracking-wide mt-1 font-serif">
            First Academy School
          </span>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#FFB300] to-transparent my-1.5" />
          <span className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest leading-none">
            KINDERGARTEN & SCHOOLS
          </span>
        </div>
      )}
    </div>
  );
}
