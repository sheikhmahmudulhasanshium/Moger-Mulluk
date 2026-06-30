// app/[lang]/(routes)/menu/[id]/body.tsx
"use client";

import { useEffect, useState } from 'react';
import { productApi, ProductDetail } from "@/app/components/hooks/product-api";
import { offerApi } from "@/app/components/hooks/offer-api"; // 1. Import offerApi
import { Offer, Locale,  } from "@/app/components/types";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import UploadProductPhotoForm from '@/app/components/forms/upload-product-photo';
import ProductGallery, { ProductGalleryData } from './gallery';
import AvailableProductOffers from './offers';

interface BodyProps {
  id: string; // This is the shortId
  lang: string;
}

const Body = ({ id, lang }: BodyProps) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]); // 3. State for offers
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || id === "undefined" || !lang || lang === "undefined") return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Fetch Product
        const data = await productApi.getDetail(lang, id);
        setProduct(data);
        
        // 4. Fetch Offers using the database id (data.id)
        if (data.id) {
          const offerData = await offerApi.getByProduct(data.id);
          setOffers(offerData);
        }
      } catch (error) {
        console.error("Failed to load details", error);
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

  if (!product) return <div className="py-20 text-center font-black uppercase">Product not found.</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 md:py-20">
      <Link href="/menu" className="inline-flex items-center gap-2 mb-8 group">
        <ArrowLeft className="h-4 w-4" />
        <span className="text-[10px] font-black uppercase opacity-60 dark:text-white">Back to Library</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <ProductGallery product={product as ProductGalleryData}/>

        <div className="flex flex-col justify-center gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-500 tracking-widest flex items-center gap-2">
               <Sparkles className="h-3 w-3" /> Signature Selection
            </span>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black dark:text-white leading-none">
              {product.title}
            </h1>
            <p className="text-2xl font-mono font-black text-amber-900 dark:text-amber-500">৳{product.price}</p>
          </div>

          <p className="text-lg font-medium italic text-stone-600 dark:text-stone-300 leading-relaxed">
            {product.description}
          </p>

          {/* 5. PASS OFFERS HERE */}
          <AvailableProductOffers offers={offers} locale={lang as Locale} />

          <div className="flex gap-4 pt-6">
            <Link href="/pre-order" className="flex-1">
                <Button className="w-full h-14 bg-amber-900 text-white dark:bg-stone-200 dark:text-black rounded-xl font-black uppercase text-xs shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] active:shadow-none transition-all">
                    Order Now
                </Button>
            </Link>
          </div>
          <div className="mt-8 border-t-2 border-black/5 dark:border-white/5 pt-8">
            <UploadProductPhotoForm productId={id}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;