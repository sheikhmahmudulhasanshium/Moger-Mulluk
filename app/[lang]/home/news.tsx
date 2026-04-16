"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { ChevronRight, Newspaper, Filter, SortDesc, FileText, ExternalLink, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { announcementApi, AnnouncementFeedItem } from "@/app/components/hooks/announcement-api";
import CreateAnnouncementForm from "@/app/components/forms/create-announcement-form";

// --- TEXT PARSER HELPER ---
const FormattedText = ({ text }: { text: string }) => {
  const lines = text.split("\n");

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        // Headers (###)
        if (line.startsWith("### ")) {
          return <h4 key={i} className="text-lg font-black text-[#8A3D04] dark:text-amber-500 uppercase mt-4 mb-2">{line.replace("### ", "")}</h4>;
        }
        
        // Unordered Lists (* )
        if (line.trim().startsWith("* ")) {
            const content = line.trim().replace("* ", "");
            return (
              <div key={i} className="flex gap-2 ml-2">
                <span className="text-[#8A3D04]">•</span>
                <p className="text-stone-700 dark:text-stone-300" dangerouslySetInnerHTML={{ 
                    __html: content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-stone-900 dark:text-white">$1</strong>') 
                }} />
              </div>
            );
        }

        // Regular Bold (**bold**)
        const parsedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-stone-900 dark:text-white">$1</strong>');
        
        return (
          <p 
            key={i} 
            className="text-stone-700 dark:text-stone-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parsedLine }}
          />
        );
      })}
    </div>
  );
};

const staticText = {
  en: {
    title: "The \n Dispatch",
    subtitle: "Directives from the Realm",
    archiveCta: "View Archive",
    loading: "Decrypting Feed...",
    filterLabel: "Category",
    sortLabel: "Order",
    all: "All Records",
    links: "Links",
    docs: "PDF",
    sorts: { latest: "Latest", oldest: "Oldest", az: "A-Z", za: "Z-A", priority: "Priority" }
  },
  bn: {
    title: "দ্য \n ডিসপ্যাচ",
    subtitle: "সাম্রাজ্য থেকে সরাসরি বার্তা",
    archiveCta: "আর্কাইভ দেখুন",
    loading: "বার্তা লোড হচ্ছে...",
    filterLabel: "বিভাগ",
    sortLabel: "ক্রম",
    all: "সব রেকর্ড",
    links: "লিঙ্ক",
    docs: "পিডিএফ",
    sorts: { latest: "সর্বশেষ", oldest: "পুরাতন", az: "অ-ক্ষ", za: "ক্ষ-অ", priority: "অগ্রাধিকার" }
  },
  hi: { title: "द \n डिस्पैच", subtitle: "साम्राज्य के निर्देश", archiveCta: "पुरालेख", loading: "लोड हो रहा है...", filterLabel: "वर्ग", sortLabel: "क्रम", all: "सभी", links: "लिंक", docs: "पीडीएफ", sorts: { latest: "नवीनतम", oldest: "पुराना", az: "A-Z", za: "Z-A", priority: "प्राथमिकता" } },
  es: { title: "El \n Despacho", subtitle: "Directivas Reales", archiveCta: "Ver Archivo", loading: "Cargando...", filterLabel: "Categoría", sortLabel: "Orden", all: "Todos", links: "Links", docs: "PDF", sorts: { latest: "Reciente", oldest: "Antiguo", az: "A-Z", za: "Z-A", priority: "Prioridad" } }
};

export default function TheDispatch() {
  const locale = useLocale() as keyof typeof staticText;
  const t = staticText[locale] || staticText.en;

  const [notices, setNotices] = useState<AnnouncementFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("priority");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await announcementApi.getFeed(locale, 1, filter);
        setNotices(response.data);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchNotices();
  }, [locale, filter]);

  const getLocaleNumber = (num: number) => new Intl.NumberFormat(locale, { useGrouping: false }).format(num);

  const processedNotices = useMemo(() => {
    const result = [...notices];
    result.sort((a, b) => {
      switch (sortOrder) {
        case "latest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "az": return a.title.localeCompare(b.title);
        case "za": return b.title.localeCompare(a.title);
        case "priority": return b.priority - a.priority;
        default: return 0;
      }
    });
    return result;
  }, [notices, sortOrder]);

  return (
    <section className="relative w-full bg-[#fcfaf7] dark:bg-zinc-950 py-32 overflow-hidden border-b border-stone-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-3 text-[#8A3D04] mb-6">
             <Newspaper size={24} />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.subtitle}</span>
          </div>
          <h2 className="text-[#8A3D04] dark:text-[#e7d9c1] text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase whitespace-pre-line">
            {t.title}
          </h2>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 pb-6 border-b border-stone-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Filter size={14} className="text-[#8A3D04]" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-45 bg-transparent border-none font-bold text-xs uppercase text-stone-600 dark:text-stone-400 focus:ring-0">
                <SelectValue placeholder={t.all} />
              </SelectTrigger>
              <SelectContent className="bg-[#fcfaf7] dark:bg-zinc-900">
                <SelectItem value="all" className="text-xs uppercase font-bold">{t.all}</SelectItem>
                <SelectItem value="news" className="text-xs uppercase font-bold">News</SelectItem>
                <SelectItem value="alert" className="text-xs uppercase font-bold">Alerts</SelectItem>
                <SelectItem value="notice" className="text-xs uppercase font-bold">Notices</SelectItem>
                <SelectItem value="update" className="text-xs uppercase font-bold">Updates</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto md:justify-end">
            <SortDesc size={14} className="text-[#8A3D04]" />
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-50 bg-transparent border-none font-bold text-xs uppercase text-stone-600 dark:text-stone-400 focus:ring-0">
                <SelectValue placeholder={t.sorts.priority} />
              </SelectTrigger>
              <SelectContent className="bg-[#fcfaf7] dark:bg-zinc-900">
                <SelectItem value="priority" className="text-xs uppercase font-bold">{t.sorts.priority}</SelectItem>
                <SelectItem value="latest" className="text-xs uppercase font-bold">{t.sorts.latest}</SelectItem>
                <SelectItem value="oldest" className="text-xs uppercase font-bold">{t.sorts.oldest}</SelectItem>
                <SelectItem value="az" className="text-xs uppercase font-bold">{t.sorts.az}</SelectItem>
                <SelectItem value="za" className="text-xs uppercase font-bold">{t.sorts.za}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-0 border-b border-stone-200 dark:border-zinc-800 min-h-100">
          <AnimatePresence mode="popLayout">
            {loading ? (
               <div key="loading" className="py-20 text-center text-stone-400 text-xs uppercase animate-pulse"> {t.loading} </div>
            ) : processedNotices.map((item, idx) => {
                const isExpanded = expandedId === item.id;
                // CLEANUP: Use media.thumbnail as source
                const displayImage = item.media?.thumbnail;

                return (
                  <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`border-t border-stone-200 dark:border-zinc-800 ${isExpanded ? 'bg-stone-50 dark:bg-zinc-900/50' : ''}`}>
                    <div onClick={() => setExpandedId(isExpanded ? null : item.id)} className="flex gap-6 py-10 px-4 cursor-pointer group">
                        <div className="flex flex-col items-center shrink-0 w-8">
                            <span className="text-[12px] font-black text-[#B28869]"> {getLocaleNumber(idx + 1)} </span>
                            <div className={`w-px h-full bg-stone-200 dark:bg-zinc-800 transition-colors ${isExpanded ? 'bg-[#8A3D04]' : 'group-hover:bg-[#8A3D04]'}`} />
                        </div>
                        <div className="flex flex-col grow gap-2">
                            <div className="flex justify-between items-start gap-4">
                                <p className="text-sm md:text-lg font-medium text-stone-600 dark:text-stone-300 leading-relaxed uppercase tracking-tight">
                                    <span className="font-black text-[#8A3D04] dark:text-amber-600 mr-2"> {item.category}: </span>
                                    {item.title}
                                </p>
                                <ChevronDown size={20} className={`text-stone-400 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-[#8A3D04]' : ''}`} />
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-10 pb-12 ml-8 flex flex-col md:flex-row gap-8 items-start border-l border-stone-200 dark:border-zinc-800">
                                    {displayImage && (
                                      <div className="relative w-full md:w-56 aspect-square shrink-0 rounded-lg overflow-hidden border border-stone-200 dark:border-zinc-700 bg-white">
                                        <Image 
                                          src={displayImage} 
                                          alt={item.title} 
                                          fill 
                                          className="object-cover" 
                                          sizes="(max-width: 768px) 100vw, 224px"
                                        />
                                      </div>
                                    )}
                                    <div className="flex flex-col gap-6 grow text-sm">
                                        <p className="text-stone-500 italic font-medium"> {item.shortDescription} </p>
                                        <FormattedText text={item.longDescription} />
                                        
                                        <div className="flex flex-wrap gap-4 pt-4">
                                            {/* UPDATED: Attachments Access */}
                                            {item.attachments?.pdfs?.map((url, i) => (
                                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded border border-red-100">
                                                    <FileText size={14} /> {t.docs} {i + 1}
                                                </a>
                                            ))}
                                            {item.attachments?.externalUrls?.map((url, i) => (
                                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 text-[10px] font-black uppercase tracking-widest rounded border border-stone-200">
                                                    <ExternalLink size={14} /> {t.links}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </motion.div>
                );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-16 flex justify-center">
           <Link href="/notice" className="group flex items-center gap-2 text-[#B28869]">
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">{t.archiveCta}</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </div>
      <CreateAnnouncementForm/>
    </section>
  );
}