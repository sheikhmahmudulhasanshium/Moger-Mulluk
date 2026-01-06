'use client'
import React, { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from 'next/navigation';
import { MasterFAQ } from "@/lib/data";
import { Link } from "@/i18n/routing";

const Body = () => {
    const locale = useLocale();
    const t = useTranslations('FAQPage');
    const searchParams = useSearchParams();
    const sharedId = searchParams.get('id');
    
    const faqRefs = useRef<Map<string, HTMLDetailsElement>>(new Map());

    useEffect(() => {
        if (sharedId) {
            const element = faqRefs.current.get(sharedId);
            if (element) {
                element.open = true;
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [sharedId]);
    
    const activeFAQ = MasterFAQ[locale.toUpperCase()] || MasterFAQ.EN;

    const supportButtons = [
        { id: 1, icon: "💬", label: t('liveChat'), href: "/chat", color: "bg-orange-500" },
        { id: 2, icon: "📞", label: t('callUs'), href: "tel:+880123456789", color: "bg-blue-600" },
        { id: 3, icon: "📧", label: t('emailUs'), href: "mailto:support@moger.com", color: "bg-green-600" },
    ];

    const copyLink = (id: string) => {
        const url = `${window.location.origin}/${locale}/faq?id=${id}`;
        navigator.clipboard.writeText(url);
        alert(locale === 'bn' ? 'লিঙ্ক কপি হয়েছে!' : 'Link copied to clipboard!');
    };

    return (
        <section className="max-w-4xl mx-auto w-full px-4 py-12 md:py-20 text-foreground">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                    {activeFAQ.title}
                </h1>
                <div className="h-1.5 w-20 bg-foreground mx-auto mt-2 rounded-full" />
            </div>

            <div className="grid gap-4 mb-16">
                {activeFAQ.items.map((item) => (
                    <details 
                        key={item.id} 
                        id={item.id}
                        ref={(el) => {
                            if (el) faqRefs.current.set(item.id, el);
                            else faqRefs.current.delete(item.id);
                        }}
                        className="group bg-card border-2 border-border rounded-3xl overflow-hidden transition-all duration-300 open:border-primary dark:open:border-amber-500 open:shadow-2xl"
                    >
                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none outline-none select-none">
                            <span className="text-sm md:text-lg font-black uppercase tracking-tight group-open:text-amber-600 dark:group-open:text-amber-400 transition-colors pr-4">
                                {item.question}
                            </span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        copyLink(item.id);
                                    }}
                                    className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                </button>
                                <span className="transition-transform duration-500 group-open:rotate-180 bg-muted p-2 rounded-full shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </span>
                            </div>
                        </summary>
                        <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <p className="text-sm md:text-base font-bold text-muted-foreground leading-relaxed border-t border-border pt-4 italic text-left">
                                {item.answer}
                            </p>
                        </div>
                    </details>
                ))}
            </div>

            <div className="border-t-2 border-border pt-16 text-center">
                <h2 className="text-xl md:text-2xl font-black uppercase italic mb-8">
                    {t('helpTitle')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {supportButtons.map((btn) => (
                        <Link 
                            key={btn.id}
                            href={btn.href} 
                            className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] transition-all hover:brightness-110 hover:shadow-lg active:scale-95 border-b-4 border-black/20 dark:border-white/10 ${btn.color} text-white`}
                        >
                            <span className="text-4xl mb-3">{btn.icon}</span>
                            <span className="font-black uppercase tracking-tighter text-sm">
                                {btn.label}
                            </span>
                        </Link>
                    ))}
                </div>
                <p className="mt-8 text-[10px] md:text-xs font-bold text-muted-foreground uppercase opacity-50 tracking-widest">
                    {t('availability')}
                </p>
            </div>
        </section>
    );
};

export default Body;