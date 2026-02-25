"use client";

import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { 
  AlertTriangle, 
  ImagePlus, 
  Loader2, 
  RefreshCw,
  CheckCircle2,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Product, productApi } from '../hooks/product-api';

export default function AssetMaintenance() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchIncomplete = async () => {
    setLoading(true);
    try {
      const data = await productApi.getIncompleteProducts();
      setItems(data);
    } catch (error) {
      console.error("Maintenance scan failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomplete();
  }, []);

  const handleFileChange = async (productId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(productId);
    try {
      await productApi.uploadMedia(productId, file);
      window.location.reload();
    } catch (error) {
      console.error("Local upload failed", error);
      alert("Local upload failed. Image might be too large.");
    } finally {
      setUploadingId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // app/components/admin/asset-maintenance.tsx

const handleLinkSubmit = async (productId: string) => {
  if (!linkUrl) return;

  setUploadingId(productId);
  try {
    await productApi.uploadMediaLink(productId, linkUrl);
    window.location.reload();
  } catch (error) {
    // This will now catch the "Failed to fetch"
    console.error("Linking failed", error);
    alert("Backend Error: This feature requires a backend update to support '/media-link' endpoints.");
  } finally {
    setUploadingId(null);
  }
};
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="relative border-amber-500/50 bg-amber-50/50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40"
        >
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
          <span className="text-xs font-black uppercase tracking-tight text-amber-700">
            Assets Needed
          </span>
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse border-2 border-white">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md bg-stone-50 dark:bg-stone-950 border-l border-stone-200 dark:border-stone-800">
        <SheetHeader className="border-b pb-4 text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-black italic uppercase tracking-tighter">
              Asset Registry
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={fetchIncomplete} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <SheetDescription className="text-[10px] uppercase font-bold text-amber-700">
            Products currently missing primary thumbnails
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center py-20 opacity-40">
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest">Scanning Database...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center bg-white/50">
              <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-xs font-bold uppercase">All assets synced</p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-2">
              {items.map((product) => (
                <div 
                  key={product._id}
                  className="group flex items-center justify-between p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-amber-500 transition-all cursor-default shadow-sm"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{product.category}</span>
                    <span className="text-sm font-bold uppercase leading-tight truncate max-w-45 text-stone-800 dark:text-stone-200">
                      {product.title?.en || "Unknown Product"}
                    </span>
                    <span className="text-[10px] text-muted-foreground italic">ID: {product.shortId}</span>
                  </div>
                  
                  <Popover onOpenChange={(open) => !open && setLinkUrl("")}>
                    <PopoverTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        disabled={uploadingId !== null}
                        className="h-8 w-8 rounded-full p-0 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                      >
                        {uploadingId === product._id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                        ) : (
                          <ImagePlus className="h-4 w-4 text-stone-600" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    
                    <PopoverContent className="w-72 flex flex-col gap-3 p-4 shadow-2xl border-stone-200 bg-white dark:bg-stone-900" align="end">
                      <div className="space-y-1 text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 leading-none">
                          Choose Upload Method
                        </p>
                        <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 truncate leading-none pb-2 border-b border-stone-100 dark:border-stone-800">
                          {product.title?.en}
                        </p>
                      </div>
                      
                      <div className="relative pt-1">
                        <input 
                          type="file" 
                          className="hidden" 
                          id={`file-${product._id}`} 
                          onChange={(e) => handleFileChange(product._id, e)} 
                          accept="image/*"
                        />
                        <Button variant="outline" className="w-full justify-start text-xs h-9 hover:bg-stone-50 dark:hover:bg-stone-800" asChild>
                          <label htmlFor={`file-${product._id}`} className="cursor-pointer">
                            <Upload className="h-3.5 w-3.5 mr-2 text-stone-500" /> 
                            Local Image File
                          </label>
                        </Button>
                      </div>

                      <div className="relative flex items-center py-1">
                        <div className="h-px bg-stone-100 dark:bg-stone-800 grow" />
                        <span className="px-2 text-[8px] font-black opacity-30 tracking-tighter text-stone-400">OR</span>
                        <div className="h-px bg-stone-100 dark:bg-stone-800 grow" />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Input 
                          placeholder="https://paste-image-url.com/..." 
                          className="h-9 text-[11px] focus-visible:ring-amber-500 dark:bg-stone-950" 
                          value={linkUrl} 
                          onChange={(e) => setLinkUrl(e.target.value)}
                        />
                        <Button 
                          className="h-9 text-[11px] font-bold bg-stone-900 hover:bg-black dark:bg-stone-100 dark:text-black dark:hover:bg-white text-white" 
                          onClick={() => handleLinkSubmit(product._id)}
                          disabled={!linkUrl}
                        >
                          <LinkIcon className="h-3.5 w-3.5 mr-2" /> 
                          Link Remote URL
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-6 left-6 right-6 p-4 bg-stone-900 dark:bg-stone-800 rounded-2xl text-white shadow-xl text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-amber-500">Architect Tip</p>
          <p className="text-xs font-medium leading-tight mt-1">
            Uploading updates the live database. Refresh is triggered to sync images across all cards.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}