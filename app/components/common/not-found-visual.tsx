"use client";

import { motion } from "framer-motion";

const COLORS = {
  primary: "#8A3D04", // Deep Brown
  accent: "#B28869",  // Tan
  policeBlue: "#1e3a8a",
  neon: "#bef264",    // Reflective Vest Yellow
  dark: "#1a1a1a",
  gold: "#d4af37"     // Whistle Gold
};

export default function NotFoundVisual() {
  return (
    <div className="relative flex items-center justify-center py-10 w-full max-w-100 mx-auto overflow-visible">
      <svg viewBox="0 0 400 400" className="w-full h-auto overflow-visible drop-shadow-2xl">
        
        {/* --- LEGS --- */}
        <g stroke={COLORS.dark} strokeWidth="12" strokeLinecap="round">
          <path d="M175 290 L165 335" />
          <path d="M225 290 L235 335" />
        </g>

        {/* --- MAIN BODY RIG --- */}
        <motion.g 
          animate={{ y: [-3, 3, -3] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          {/* Reflective Vest */}
          <path d="M130 140 Q130 290 200 290 Q270 290 270 140" fill={COLORS.neon} />
          <path d="M135 170 H265 M135 230 H265" stroke="white" strokeWidth="12" strokeOpacity="0.7" />
          
          {/* Mug Body */}
          <path d="M130 110 Q130 290 200 290 Q270 290 270 110" fill={COLORS.accent} stroke={COLORS.dark} strokeWidth="8" />

          {/* Traffic Police Cap */}
          <g transform="translate(130, 40)">
            <path d="M0 70 Q70 0 140 70 Z" fill={COLORS.policeBlue} stroke={COLORS.dark} strokeWidth="4" />
            <path d="M-5 70 H145 V82 H-5 Z" fill={COLORS.dark} />
            <circle cx="70" cy="45" r="8" fill="#fbbf24" /> 
          </g>

          {/* FACE GROUP (Stays still relative to body) */}
          <g transform="translate(200, 185)">
             <path d="M-45 -35 L-15 -25" stroke={COLORS.dark} strokeWidth="7" strokeLinecap="round" />
             <path d="M45 -35 L15 -25" stroke={COLORS.dark} strokeWidth="7" strokeLinecap="round" />
             <circle cx="-30" cy="-10" r="9" fill={COLORS.dark} />
             <circle cx="30" cy="-10" r="9" fill={COLORS.dark} />

             {/* THE PREMIUM WHISTLE RIG */}
             <motion.g 
                animate={{ 
                    rotate: [-3, 3, -3],
                    scale: [1, 1.05, 1] 
                }}
                transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
                style={{ originX: "0px", originY: "10px" }}
             >
                {/* Whistle Lanyard/Cord */}
                <path d="M0 -70 V15" stroke={COLORS.dark} strokeWidth="2" strokeDasharray="4 2" opacity="0.3" />
                
                {/* Whistle Body (Gold/Brass) */}
                {/* Mouthpiece */}
                <path d="M-8 15 H8 L12 35 H-12 Z" fill={COLORS.gold} stroke={COLORS.dark} strokeWidth="2" />
                {/* Chamber (The round part) */}
                <circle cx="0" cy="45" r="18" fill={COLORS.gold} stroke={COLORS.dark} strokeWidth="3" />
                {/* Air Slit */}
                <rect x="-6" y="32" width="12" height="4" rx="1" fill={COLORS.dark} />
                {/* Shading/Highlights */}
                <circle cx="-6" cy="40" r="4" fill="white" fillOpacity="0.3" />

                {/* Animated Sound/Air Waves */}
                <g stroke={COLORS.gold} strokeWidth="3" strokeLinecap="round" fill="none">
                    <motion.path 
                        d="M-25 40 Q-40 30 -50 45" 
                        animate={{ opacity: [0, 1, 0], x: [0, -10], scale: [0.8, 1.2] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                    />
                    <motion.path 
                        d="M25 40 Q40 30 50 45" 
                        animate={{ opacity: [0, 1, 0], x: [0, 10], scale: [0.8, 1.2] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0.25 }}
                    />
                </g>
             </motion.g>
          </g>

          {/* STOP Hand (Left) */}
          <g transform="translate(85, 170)">
            <rect x="-20" y="-25" width="40" height="50" rx="10" fill={COLORS.accent} stroke={COLORS.dark} strokeWidth="6" />
            <path d="M-10 -25 V-45 M0 -25 V-50 M10 -25 V-45" stroke={COLORS.dark} strokeWidth="5" strokeLinecap="round" />
          </g>
        </motion.g>

        {/* --- SIGNAL BATON --- */}
        <motion.g
          animate={{ rotate: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ originX: "270px", originY: "180px" }}
        >
          <rect x="270" y="170" width="12" height="80" fill={COLORS.dark} rx="4" />
          <circle cx="276" cy="150" r="35" fill="#ef4444" stroke={COLORS.dark} strokeWidth="6" />
          <text x="276" y="160" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" style={{fontFamily: 'sans-serif'}}>404</text>
        </motion.g>

        {/* --- SHOES --- */}
        <g fill="#000">
          <ellipse cx="165" cy="335" rx="22" ry="10" />
          <ellipse cx="235" cy="335" rx="22" ry="10" />
        </g>
      </svg>
    </div>
  );
}