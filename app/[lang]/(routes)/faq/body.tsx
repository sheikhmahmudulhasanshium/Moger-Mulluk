'use client'
import React from 'react';
import { useLocale, useTranslations } from "next-intl";
import { MasterFAQ } from "@/lib/data";
import { Link } from "@/i18n/routing";

const Body = () => {
    const locale = useLocale();
    const t = useTranslations('FAQPage');
    
    const activeFAQ = MasterFAQ[locale.toUpperCase()] || MasterFAQ.EN;

    const supportButtons = [
        { id: 1, icon: "💬", label: t('liveChat'), href: "/chat", color: "bg-orange-500" },
        { id: 2, icon: "📞", label: t('callUs'), href: "tel:+880123456789", color: "bg-blue-600" },
        { id: 3, icon: "📧", label: t('emailUs'), href: "mailto:support@moger.com", color: "bg-green-600" },
    ];

    return (
        <section className="max-w-4xl mx-auto w-full px-4 py-12 md:py-20 transition-colors duration-300">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground">
                    {activeFAQ.title}
                </h1>
                <div className="h-1.5 w-20 bg-primary mx-auto mt-2 rounded-full" />
            </div>

            {/* Questions Section */}
            <div className="grid gap-4 mb-16">
                {activeFAQ.items.map((item) => (
                    <details 
                        key={item.id} 
                        className="group bg-card border-2 border-border rounded-3xl overflow-hidden transition-all duration-300 open:border-primary open:shadow-2xl dark:open:shadow-amber-900/20"
                    >
                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none outline-none select-none">
                            <span className="text-sm md:text-lg font-black uppercase tracking-tight text-foreground group-open:text-amber-600 dark:group-open:text-amber-400 transition-colors pr-4">
                                {item.question}
                            </span>
                            <span className="transition-transform duration-500 group-open:rotate-180 bg-muted text-muted-foreground p-2 rounded-full shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <p className="text-sm md:text-base font-bold text-muted-foreground leading-relaxed border-t border-border pt-4 italic text-left">
                                {item.answer}
                            </p>
                        </div>
                    </details>
                ))}
            </div>

            {/* Support Center (E-commerce Style) */}
            <div className="border-t-2 border-border pt-16 text-center">
                <h2 className="text-xl md:text-2xl font-black uppercase italic mb-8 text-foreground">
                    {t('helpTitle')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {supportButtons.map((btn) => (
                        <Link 
                            key={btn.id}
                            href={btn.href} 
                            className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] transition-all hover:-translate-y-1 hover:brightness-110 active:scale-95 border-b-4 border-black/20 dark:border-white/10 ${btn.color} text-white shadow-lg`}
                        >
                            <span className="text-4xl mb-3">{btn.icon}</span>
                            <span className="font-black uppercase tracking-tighter text-sm">
                                {btn.label}
                            </span>
                        </Link>
                    ))}
                </div>
                <p className="mt-8 text-[10px] md:text-xs font-black text-muted-foreground uppercase opacity-40 tracking-[0.2em]">
                    {t('availability')}
                </p>
            </div>
        </section>
    );
};

export default Body;