"use client";

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { productApi, ProductDetail } from "@/app/components/hooks/product-api";
import { Loader2, ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

interface BodyProps {
  id: string;
  lang: string;
}

const Body = ({ id, lang }: BodyProps) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // PREVENT FETCH ON UNDEFINED
    if (!id || id === "undefined" || !lang || lang === "undefined") return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await productApi.getDetail(lang, id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, lang]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-amber-900" />
      </div>
    );
  }

  if (!product) return <div className="py-20 text-center">Product not found.</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 md:py-20">
      <Link href="/menu" className="inline-flex items-center gap-2 mb-8 group">
        <ArrowLeft className="h-4 w-4" />
        <span className="text-[10px] font-black uppercase opacity-60">Back to Library</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="relative aspect-square w-full rounded-4xl overflow-hidden border shadow-2xl">
          <Image 
            src={product.media?.thumbnail||''} 
            alt={product.title} 
            fill 
            className="object-cover"
            priority 
          />
        </div>

        <div className="flex flex-col justify-center gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-700 tracking-widest flex items-center gap-2">
               <Sparkles className="h-3 w-3" /> Signature Selection
            </span>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
              {product.title}
            </h1>
            <p className="text-2xl font-mono font-black text-amber-900">৳{product.price}</p>
          </div>

          <p className="text-lg font-medium italic text-stone-600 leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-4 pt-6">
            <Link href="/pre-order" className="flex-1">
                <Button className="w-full h-14 bg-amber-900 text-white rounded-xl font-black uppercase text-xs">
                    Order Now
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;