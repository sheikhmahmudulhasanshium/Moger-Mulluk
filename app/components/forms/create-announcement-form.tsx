"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { announcementApi, CreateAnnouncementDto, Announcement } from '../hooks/announcement-api';
import { languageApi, Language } from '../hooks/language-api';
import { 
  Loader2, Image as ImageIcon, CheckCircle2, 
  Trash2, Wand2, Save, Layers, Languages, 
  Megaphone, ListTodo, FileText, Link as LinkIcon, X
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const CACHE_KEY = 'moger_mulluk_announcement_draft';

const INITIAL_STATE: CreateAnnouncementDto = {
  category: 'notice',
  priority: 0,
  isAvailable: true,
  title: { en: '' },
  subtitle: { en: '' },
  shortDescription: { en: '' },
  longDescription: { en: '' },
  attachments: {
    pdfs: [],
    externalUrls: []
  }
};

export default function CreateAnnouncementForm() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [langs, setLangs] = useState<Language[]>([]);
  const [formData, setFormData] = useState<CreateAnnouncementDto>(INITIAL_STATE);
  
  const [pdfInput, setPdfInput] = useState('');
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const data = await languageApi.getLanguages();
        setLangs(data);
      } catch (e) { console.error("Langs fetch failed", e); }

      const saved = localStorage.getItem(CACHE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Merge with INITIAL_STATE to ensure no null fields from old drafts
          setFormData({ ...INITIAL_STATE, ...parsed });
        } catch (e) { console.error("Draft parse error", e); }
      }
      setIsMounted(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(formData));
    }
  }, [formData, isMounted]);

  const clearForm = useCallback(() => {
    setFormData(INITIAL_STATE);
    setThumbnail(null);
    setPdfInput('');
    setUrlInput('');
    localStorage.removeItem(CACHE_KEY);
  }, []);
const fillSample = () => {
    setFormData({
      category: 'alert', // Set as Alert for maximum visibility
      priority: 100,    // Top priority
      isAvailable: true,
      title: { 
        en: 'Urgent Directive: Strategic Council at High Command', 
        bn: 'জরুরি নির্দেশনা: সদর দপ্তরে কৌশলগত বৈঠক', 
        es: 'Directiva Urgente: Consejo Estratégico en el Alto Mando', 
        hi: 'तत्काल निर्देश: मुख्यालय में रणनीतिक बैठक' 
      },
      subtitle: { 
        en: 'Mandatory Coordination for All Branch Wardens', 
        bn: 'সকল শাখা প্রধানদের জন্য বিশেষ সমন্বয় বার্তা', 
        es: 'Coordinación Obligatoria para Jefes de Sucursal', 
        hi: 'सभी शाखा प्रमुखों के लिए अनिवार्य समन्वय' 
      },
      shortDescription: { 
        en: 'All branch managers must contact Global Headquarters (Uttara or Madrid) immediately to schedule the upcoming Strategic Alignment Session.', 
        bn: 'সকল শাখা ব্যবস্থাপকদের অবিলম্বে গ্লোবাল হেডকোয়ার্টার্সের (উত্তরা/মাদ্রিদ) সাথে যোগাযোগ করার নির্দেশ দেওয়া হচ্ছে।', 
        es: 'Todos los gerentes de sucursal deben contactar a la Sede Global inmediatamente para programar la Sesión de Alineación Estratégica.',
        hi: 'सभी शाखा प्रबंधकों को रणनीतिक संरेखण सत्र निर्धारित करने के लिए तुरंत वैश्विक मुख्यालय से संपर्क करना चाहिए।'
      },
      longDescription: { 
        en: "### Command Mandate\nBy order of the High Council, all regional branch leaders are summoned to coordinate with their respective Command Hubs for the Q2 Strategic Alignment.\n\n*   **Primary Objective:** Supply chain fortification and global expansion roadmap.\n*   **Action Required:** Contact the HQ Secretariat via the encrypted hotline or secure mail within the next 24 hours.\n*   **Date of Council:** April 20, 2026.\n\nFail not to report. The future of the realm depends on our unified front.", 
        bn: "### সদর দপ্তরের আদেশ\nহাই কাউন্সিলের নির্দেশে, সকল আঞ্চলিক শাখা প্রধানদের ২য় প্রান্তিকের কৌশলগত সমন্বয়ের জন্য যোগাযোগ করার নির্দেশ দেওয়া হয়েছে।\n\n*   **প্রধান উদ্দেশ্য:** সাপ্লাই চেইন শক্তিশালীকরণ এবং বৈশ্বিক সম্প্রসারণ রোডম্যাপ।\n*   **করণীয়:** আগামী ২৪ ঘণ্টার মধ্যে এনক্রিপ্টেড হটলাইন বা সিকিউর মেইলের মাধ্যমে সদর দপ্তরের সচিবালয়ে যোগাযোগ করুন।\n*   **সভার তারিখ:** ২০শে এপ্রিল, ২০২৬।\n\nঅবহেলা কাম্য নয়। সাম্রাজ্যের ভবিষ্যৎ আমাদের ঐক্যবদ্ধ প্রচেষ্টার ওপর নির্ভরশীল।",
        es: "### Mandato del Alto Mando\nPor orden del Alto Consejo, todos los líderes de sucursales regionales deben coordinar con la Sede Global para la Alineación Estratégica del segundo trimestre.\n\n*   **Objetivo Principal:** Fortalecimiento de la cadena de suministro.\n*   **Acción requerida:** Contactar a la Secretaría de la Sede dentro de las próximas 24 horas.",
        hi: "### कमान अधिदेश\nउच्च परिषद के आदेश से, सभी क्षेत्रीय शाखा प्रमुखों को Q2 रणनीतिक संरेखण के लिए अपने मुख्यालय के साथ समन्वय करने का आदेश दिया गया है।\n\n*   **मुख्य उद्देश्य:** आपूर्ति श्रृंखला सुदृढ़ीकरण और वैश्विक विस्तार रोडमैप।\n*   **आवश्यक कार्रवाई:** अगले 24 घंटों के भीतर मुख्यालय सचिवालय से संपर्क करें।"
      },
      attachments: {
        pdfs: ['https://moger-mulluk.vercel.app/assets/strategic-brief-2026.pdf'],
        externalUrls: ['https://moger-mulluk.vercel.app/internal/secure-portal']
      }
    });
  };

  const addAttachment = (type: 'pdfs' | 'externalUrls', value: string) => {
    if (!value) return;
    const current = formData.attachments?.[type] || [];
    setFormData(prev => ({
      ...prev,
      attachments: { ...prev.attachments, [type]: [...current, value] }
    }));
    if (type === 'pdfs') setPdfInput(''); else setUrlInput('');
  };

  const removeAttachment = (type: 'pdfs' | 'externalUrls', index: number) => {
    const current = formData.attachments?.[type] || [];
    setFormData(prev => ({
      ...prev,
      attachments: { ...prev.attachments, [type]: current.filter((_, i) => i !== index) }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.en) return alert("English title is required.");
    setLoading(true);
    setSuccess(false);

    try {
      const announcement: Announcement = await announcementApi.create(formData);
      if (announcement?._id && thumbnail) {
        await announcementApi.uploadMedia(announcement._id, thumbnail);
      }
      setSuccess(true);
      clearForm();
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Operation failed");
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="max-w-5xl mx-auto p-20 flex flex-col items-center justify-center space-y-4 opacity-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#8A3D04]" />
        <p className="text-[10px] font-black uppercase tracking-widest">Initializing Dispatch Architect...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-8 bg-[#fcfaf7] dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl relative animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-[#8A3D04]" /> Dispatch Architect
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-[9px] text-green-600 font-bold uppercase tracking-widest">
              <Save className="h-3 w-3" /> System Synchronized
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={fillSample} className="h-8 text-[10px] font-bold border-amber-200 text-amber-700 bg-amber-50/50">
            <Wand2 className="h-3 w-3 mr-1" /> Magic Sample
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearForm} className="h-8 text-[10px] font-bold border-red-100 text-red-600 hover:bg-red-50">
            <Trash2 className="h-3 w-3 mr-1" /> Purge Draft
          </Button>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-xl border border-green-200 animate-in zoom-in duration-300">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-xs font-black uppercase tracking-widest">Announcement Dispatched to the Realm...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-4 p-5 bg-white dark:bg-stone-900 rounded-xl border shadow-sm">
                <h3 className="text-[10px] font-black uppercase flex items-center gap-2 opacity-70 tracking-widest">
                  <Layers className="h-3 w-3 text-[#8A3D04]" /> Metadata
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase opacity-60">Category</Label>
                        <Select disabled={loading} value={formData.category ?? 'notice'} onValueChange={(v: CreateAnnouncementDto['category']) => setFormData({...formData, category: v})}>
                            <SelectTrigger className="h-10 font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {['notice', 'update', 'alert', 'directive', 'news'].map(c => (
                                    <SelectItem key={c} value={c} className="capitalize font-bold">{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase opacity-60">Priority</Label>
                            <Input 
                                disabled={loading} 
                                type="number" 
                                // FORCE string to prevent null errors
                                value={(formData.priority ?? 0).toString()} 
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setFormData({...formData, priority: isNaN(val) ? 0 : val});
                                }} 
                                className="h-10 font-mono font-bold" 
                            />
                        </div>
                        <div className="space-y-2 flex flex-col justify-end">
                            <Label className="text-[10px] font-bold uppercase opacity-60 mb-2">Visible</Label>
                            <Switch checked={formData.isAvailable ?? true} onCheckedChange={(v) => setFormData({...formData, isAvailable: v})} />
                        </div>
                    </div>
                </div>
             </div>

             <div className="relative group border-2 border-dashed border-stone-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all hover:border-[#8A3D04]/50 bg-white dark:bg-stone-900">
                <ImageIcon className="h-8 w-8 text-stone-400 mb-2 group-hover:text-[#8A3D04]" />
                <Label htmlFor="thumb-upload" className="cursor-pointer font-black text-[10px] uppercase text-[#8A3D04] tracking-tighter underline">
                  {thumbnail ? thumbnail.name : 'Upload Feature Image'}
                </Label>
                <input disabled={loading} id="thumb-upload" type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
             </div>
          </div>

          <div className="space-y-4 p-5 border rounded-xl bg-white dark:bg-stone-900 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 flex items-center gap-2">
                <Languages className="h-3 w-3 text-[#8A3D04]" /> Header Content
            </h3>
            <div className="space-y-6">
               {langs.map((l) => (
                 <div key={l.code} className="space-y-3 p-3 border border-stone-100 dark:border-stone-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black px-2 py-0.5 bg-stone-100 rounded uppercase">{l.code}</span>
                        <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">{l.label}</span>
                    </div>
                    <Input 
                        disabled={loading}
                        placeholder="Main Headline..." 
                        value={formData.title[l.code] ?? ""} 
                        onChange={(e) => setFormData({...formData, title: {...formData.title, [l.code]: e.target.value}})} 
                        className={`h-10 ${l.code === 'en' ? 'font-black border-amber-500/50' : 'font-medium'}`}
                    />
                    <Input 
                        disabled={loading}
                        placeholder="Sub-headline (Optional)..." 
                        value={formData.subtitle?.[l.code] ?? ""} 
                        onChange={(e) => setFormData({...formData, subtitle: {...(formData.subtitle || {}), [l.code]: e.target.value}})} 
                        className="h-9 text-xs italic"
                    />
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
            <div className="space-y-4 p-5 bg-white dark:bg-stone-900 rounded-xl border shadow-sm">
                <h3 className="text-[10px] font-black uppercase flex items-center gap-2 opacity-70 tracking-widest">
                  <ListTodo className="h-3 w-3 text-[#8A3D04]" /> Resources
                </h3>
                <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase opacity-50 flex items-center gap-1"><FileText size={10} /> PDF Documentation</Label>
                    <div className="flex gap-2">
                        <Input placeholder="URL to PDF" value={pdfInput ?? ""} onChange={(e) => setPdfInput(e.target.value)} className="h-8 text-xs font-mono" />
                        <Button type="button" size="sm" onClick={() => addAttachment('pdfs', pdfInput)} className="h-8 px-2 bg-stone-800 text-white">+</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {(formData.attachments?.pdfs ?? []).map((url, i) => (
                            <div key={i} className="group text-[8px] font-bold bg-red-50 text-red-700 px-2 py-1 rounded flex items-center gap-1 border border-red-100">
                                PDF {i+1} <X size={10} className="cursor-pointer hover:text-black" onClick={() => removeAttachment('pdfs', i)} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                    <Label className="text-[9px] font-black uppercase opacity-50 flex items-center gap-1"><LinkIcon size={10} /> Action Links</Label>
                    <div className="flex gap-2">
                        <Input placeholder="HTTP URL" value={urlInput ?? ""} onChange={(e) => setUrlInput(e.target.value)} className="h-8 text-xs font-mono" />
                        <Button type="button" size="sm" onClick={() => addAttachment('externalUrls', urlInput)} className="h-8 px-2 bg-stone-800 text-white">+</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {(formData.attachments?.externalUrls ?? []).map((url, i) => (
                            <div key={i} className="group text-[8px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center gap-1 border border-blue-100">
                                LINK {i+1} <X size={10} className="cursor-pointer hover:text-black" onClick={() => removeAttachment('externalUrls', i)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4 p-5 border rounded-xl bg-white dark:bg-stone-900 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70">Narrative</h3>
                {langs.map((l) => (
                  <div key={l.code} className="space-y-3">
                     <span className="text-[8px] font-black bg-stone-100 px-1 rounded uppercase">{l.label}</span>
                     <Input 
                        disabled={loading}
                        placeholder="Short summary..." 
                        value={formData.shortDescription?.[l.code] ?? ""} 
                        onChange={(e) => setFormData({...formData, shortDescription: {...(formData.shortDescription || {}), [l.code]: e.target.value}})} 
                        className="text-xs h-8" 
                      />
                     <Textarea 
                        disabled={loading}
                        placeholder="Directive details..." 
                        value={formData.longDescription?.[l.code] ?? ""} 
                        onChange={(e) => setFormData({...formData, longDescription: {...(formData.longDescription || {}), [l.code]: e.target.value}})} 
                        className="text-xs min-h-30 bg-stone-50/30 font-serif" 
                      />
                  </div>
                ))}
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 gap-4 border-t sticky bottom-0 bg-[#fcfaf7]/90 dark:bg-transparent backdrop-blur-md pb-2 z-10 items-center-safe">
        <Button variant="secondary" type="button" disabled={loading} onClick={clearForm} className="text-[10px] uppercase font-black tracking-widest items-center-safe">Discard</Button>
        <Button 
          type="submit" 
          disabled={loading || !formData.title.en} 
          className="bg-[#8A3D04] hover:bg-black text-white px-16 h-14 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-xl"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Authorize Dispatch'}
        </Button>
      </div>
    </form>
  );
}