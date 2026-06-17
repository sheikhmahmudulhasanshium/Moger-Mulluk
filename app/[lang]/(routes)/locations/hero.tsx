'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Coffee, MapPin, ChevronDown } from "lucide-react";

const HeroSection = () => {
    const locale = useLocale();

    // Image state with fallback logic
    const primaryImg = "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=2070&auto=format&fit=crop";
    const fallbackImg = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop";
    const [bgUrl, setBgUrl] = useState(primaryImg);

    useEffect(() => {
        const img = new window.Image();
        img.src = primaryImg;
        // If primary image returns 404 or fails, switch to fallback
        img.onerror = () => setBgUrl(fallbackImg);
    }, []);

    const getLocalizedContent = () => {
        switch(locale) {
            case 'bn': return { title: 'আমাদের গন্তব্য', sub: 'আপনার কাছের ক্যাফেটি খুঁজে নিন' };
            case 'es': return { title: 'Nuestros Destinos', sub: 'Encuentra tu lugar favorito' };
            case 'hi': return { title: 'हमारे ठिकाने', sub: 'अपने पास का कैफे खोजें' };
            default: return { title: 'Our Destinations', sub: 'Discover your local sanctuary' };
        }
    };

    const content = getLocalizedContent();

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.08 } 
        }
    };

    const letterVariants = {
        hidden: { opacity: 0, display: 'none' },
        visible: { 
            opacity: 1, 
            display: 'inline', 
            transition: { duration: 0 } 
        }
    };

    return (
        <section className="relative w-full h-[70vh] md:h-[85vh] bg-[#FFFBF8] dark:bg-zinc-950 overflow-hidden flex flex-col items-center justify-center pt-20">
            
            {/* Background Atmosphere - Re-animates scale on view */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#FFFBF8] dark:to-zinc-950 z-10" />
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.4 }}
                    viewport={{ once: false }}
                    transition={{ duration: 2 }}
                    className="w-full h-full bg-cover bg-center grayscale-30"
                    style={{ backgroundImage: `url('${bgUrl}')` }}
                />
            </div>

            {/* Main Content Container */}
            <div className="relative z-20 text-center px-6">
                
                {/* Localized Sub-headline */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center justify-center gap-3 mb-6 text-[#8A3D04] dark:text-amber-500/60"
                >
                    <div className="h-px w-8 md:w-12 bg-current" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">{content.sub}</span>
                    <div className="h-px w-8 md:w-12 bg-current" />
                </motion.div>

                {/* Typewriter Title - Re-types every time it is in view */}
                <motion.h1 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-6xl sm:text-7xl md:text-9xl font-black text-[#8A3D04] dark:text-amber-200 tracking-tighter leading-none mb-8"
                >
                    {content.title.split("").map((char, i) => (
                        <motion.span key={i} variants={letterVariants}>{char}</motion.span>
                    ))}
                    
                    {/* Blinking Cursor */}
                    <motion.span 
                        animate={{ opacity: [1, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-12 md:w-3 md:h-24 bg-amber-500 ml-2 -mb-1"
                    />
                </motion.h1>

                {/* Features - Fade in every time */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    {[
                        { icon: Coffee, label: "Artisanal Spaces" },
                        { icon: MapPin, label: "Global Footprint" }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: false }}
                            transition={{ delay: 0.5 + (i * 0.2) }}
                            className="flex items-center gap-2 text-[#B28869] dark:text-zinc-500 font-bold uppercase text-[10px] md:text-xs tracking-widest"
                        >
                            <item.icon size={14} className="text-[#8A3D04] dark:text-amber-600" />
                            {item.label}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator - Re-appears every time */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 1 }}
                className="absolute bottom-10 flex flex-col items-center gap-2"
            >
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B28869] dark:text-zinc-600">Explore Map</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <ChevronDown size={20} className="text-[#8A3D04] dark:text-amber-700" />
                </motion.div>
            </motion.div>
        </section>
    );
}

export default HeroSection;