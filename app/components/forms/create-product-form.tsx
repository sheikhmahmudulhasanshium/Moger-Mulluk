"use client";

import React, { useState, useEffect, useCallback } from 'react';
// These imports will now work correctly
import { productApi, CreateProductDto, Product } from '../hooks/product-api';
import { languageApi, Language } from '../hooks/language-api';
import { 
  Loader2, Image as ImageIcon, CheckCircle2, 
  Trash2, Wand2, Save, Layers, Hash, Languages 
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const CACHE_KEY = 'moger_mulluk_product_draft';

const INITIAL_STATE: CreateProductDto = {
  position: 1,
  category: 'tea',
  tags: [],
  title: { en: '' },
  description: { en: '' },
  logistics: {
    stock: 100,
    isAvailable: true,
    grandTotal: 0,
    uKey: 'c',
    calories: 0
  }
};

export default function CreateProductForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [langs, setLangs] = useState<Language[]>([]);

  const [formData, setFormData] = useState<CreateProductDto>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CACHE_KEY);
      if (saved) {
        try { return JSON.parse(saved) as CreateProductDto; } 
        catch (e) { console.error("Draft parse error", e); }
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    const fetchLangs = async () => {
      try {
        const data = await languageApi.getLanguages();
        setLangs(data);
      } catch (e) {
        console.error("Langs fetch failed", e);
      }
    };
    fetchLangs();
  }, []);

  useEffect(() => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(formData));
  }, [formData]);

  const clearForm = useCallback(() => {
    setFormData(INITIAL_STATE);
    setThumbnail(null);
    localStorage.removeItem(CACHE_KEY);
  }, []);

  const fillSample = () => {
    setFormData({
      ...INITIAL_STATE,
      category: 'tea',
      tags: ['popular', 'classic'],
      title: { en: 'Masala Tea', bn: 'মসলা চা', hi: 'मसाला चाय', es: 'Té Masala' },
      description: { en: 'Authentic spiced tea', bn: 'আসল মসলা চা' },
      logistics: { ...INITIAL_STATE.logistics, grandTotal: 40 }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.en) return alert("English title is required.");
    
    setLoading(true);
    setSuccess(false);

    try {
      const product: Product = await productApi.create(formData);
      if (product?._id && thumbnail) {
        await productApi.uploadMedia(product._id, thumbnail);
      }
      setSuccess(true);
      clearForm();
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Operation failed";
      alert(msg);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8 bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl relative">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Product Architect</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-[9px] text-green-600 font-bold uppercase">
              <Save className="h-3 w-3" /> Auto-save active
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={fillSample} className="h-8 text-[10px] font-bold border-amber-200 text-amber-700">
            <Wand2 className="h-3 w-3 mr-1" /> Magic Wand
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearForm} className="h-8 text-[10px] font-bold border-red-100 text-red-600">
            <Trash2 className="h-3 w-3 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-xl border animate-in zoom-in duration-300">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-xs font-black uppercase">Realm Updated. Refreshing ecosystem...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4 p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border">
            <h3 className="text-[10px] font-black uppercase flex items-center gap-2 opacity-70">
              <Layers className="h-3 w-3 text-amber-600" /> Structure
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase opacity-60">Category</Label>
                <Select disabled={loading} value={formData.category} onValueChange={(v: CreateProductDto['category']) => setFormData({...formData, category: v})}>
                  <SelectTrigger className="h-10 font-bold bg-white dark:bg-black"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['tea', 'coffee', 'beverage', 'desert', 'snacks'].map(c => (
                      <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase opacity-60">Position</Label>
                <Input disabled={loading} type="number" value={formData.position} onChange={(e) => setFormData({...formData, position: parseInt(e.target.value)})} className="h-10 font-mono font-bold" />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-xl bg-white dark:bg-transparent">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 flex items-center gap-2">
                <Languages className="h-3 w-3" /> Dynamic Titles
            </h3>
            <div className="space-y-3">
              {langs.map((l) => (
                <div key={l.code} className="relative">
                  <span className="absolute right-3 top-2.5 text-[8px] font-black opacity-30 uppercase">{l.code}</span>
                  <Input 
                    disabled={loading}
                    placeholder={`${l.label} Title`} 
                    value={formData.title[l.code] || ''} 
                    onChange={(e) => setFormData({
                        ...formData, 
                        title: {...formData.title, [l.code]: e.target.value}
                    })} 
                    className={`h-10 pr-10 ${l.code === 'en' ? 'font-black border-amber-500/50' : 'font-medium'}`}
                    required={l.code === 'en'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border">
            <h3 className="text-[10px] font-black uppercase flex items-center gap-2 opacity-70">
              <Hash className="h-3 w-3 text-amber-600" /> Logistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase opacity-60">Price (BDT)</Label>
                <Input disabled={loading} type="number" required value={formData.logistics.grandTotal || ''} onChange={(e) => setFormData({ ...formData, logistics: {...formData.logistics, grandTotal: parseFloat(e.target.value)}})} className="h-10 font-mono font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase opacity-60">Unit</Label>
                <Select disabled={loading} value={formData.logistics.uKey} onValueChange={(v: 'c' | 'g') => setFormData({ ...formData, logistics: {...formData.logistics, uKey: v}})}>
                  <SelectTrigger className="h-10 font-bold bg-white dark:bg-black"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c">Cup / ছোট</SelectItem>
                    <SelectItem value="g">Glass / বড়</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t">
              <Label className="text-xs font-bold">Visibility</Label>
              <Switch disabled={loading} checked={formData.logistics.isAvailable} onCheckedChange={(v) => setFormData({ ...formData, logistics: {...formData.logistics, isAvailable: v}})} />
            </div>
          </div>

          <div className="relative group border-2 border-dashed border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-amber-500/50">
            <ImageIcon className="h-8 w-8 text-stone-400 mb-3 group-hover:text-amber-600" />
            <Label htmlFor="thumb-upload" className="cursor-pointer font-black text-xs uppercase text-amber-700">
              {thumbnail ? thumbnail.name : 'Select Product Photo'}
            </Label>
            <input disabled={loading} id="thumb-upload" type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded-xl">
        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70">Dynamic Descriptions</h3>
        {langs.map((l) => (
          <div key={l.code} className="relative">
             <span className="absolute right-3 bottom-3 text-[8px] font-black opacity-30 uppercase">{l.code}</span>
             <Textarea 
                disabled={loading}
                placeholder={`${l.label} Storytelling...`} 
                value={formData.description[l.code] || ''} 
                onChange={(e) => setFormData({
                    ...formData, 
                    description: {...formData.description, [l.code]: e.target.value}
                })} 
                className="text-xs min-h-20" 
              />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6 gap-4 border-t sticky bottom-0 bg-white/80 backdrop-blur-md pb-2 z-10">
        <Button variant="ghost" type="button" disabled={loading} onClick={clearForm} className="text-[10px] uppercase font-black tracking-widest">Discard</Button>
        <Button 
          type="submit" 
          disabled={loading || !formData.title.en || !formData.logistics.grandTotal} 
          className="bg-amber-900 hover:bg-black text-white px-12 h-12 rounded-full font-black uppercase text-xs tracking-widest"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Launch Product'}
        </Button>
      </div>
    </form>
  );
}