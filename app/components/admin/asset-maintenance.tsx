"use client";

import  { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  ImagePlus, 
  Loader2, 
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Product, productApi } from '../hooks/product-api';

export default function AssetMaintenance() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIncomplete = async () => {
    setLoading(true);
    try {
      const data = await productApi.getIncompleteProducts();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch incomplete assets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomplete();
  }, []);

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
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-black italic uppercase tracking-tighter">Asset Registry</SheetTitle>
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
              <p className="text-[10px] font-black uppercase">Scanning Database...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-xs font-bold uppercase">All assets synced</p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-2">
              {items.map((product) => (
                <div 
                  key={product._id}
                  className="group flex items-center justify-between p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-amber-500 transition-all cursor-default"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{product.category}</span>
                    <span className="text-sm font-bold uppercase leading-tight truncate max-w-50">
                      {product.title.en}
                    </span>
                    <span className="text-[10px] text-muted-foreground italic">ShortID: {product.shortId}</span>
                  </div>
                  
                  <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-amber-600 hover:text-white group-hover:scale-110 transition-all">
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-6 left-6 right-6 p-4 bg-amber-900 rounded-2xl text-white shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Architect Tip</p>
          <p className="text-xs font-medium leading-tight mt-1">Items in this list will display a placeholder on the live menu. Prioritize uploading high-quality thumbnails.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Internal icon for the empty state
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);