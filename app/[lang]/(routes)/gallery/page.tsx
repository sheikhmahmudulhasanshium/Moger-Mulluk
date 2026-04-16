"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Next.js Image

interface CategoryGallery {
  _id: string;
  thumbnails: string[];
  count: number;
}

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [galleryData, setGalleryData] = useState<CategoryGallery[]>([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    title: "Visuals from the Realm",
    subtitle: "Explore our handcrafted brews and specialized zones",
    filters: {
      all: "All",
      zones: "Zones",
      tea: "Tea",
      coffee: "Coffee",
      beverage: "Beverage",
      snacks: "Snacks"
    }
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products/gallery');
        const data = await response.json();
        setGalleryData(data);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = () => {
    const images: string[] = []; // FIXED: Changed let to const
    
    galleryData.forEach(cat => {
      if (activeFilter === 'all' || activeFilter === cat._id) {
        images.push(...cat.thumbnails);
      }
    });

    if (activeFilter === 'all' || activeFilter === 'zones') {
        const zoneMocks = [
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24", 
            "https://images.unsplash.com/photo-1537180244301-a11f5eeba662", 
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b", 
        ];
        images.push(...zoneMocks);
    }

    return images;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-serif mb-4 text-amber-500 uppercase tracking-widest">
          {translations.title}
        </h1>
        <p className="text-neutral-400 text-lg italic">{translations.subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {Object.entries(translations.filters).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-6 py-2 rounded-full border transition-all duration-300 ${
              activeFilter === key 
              ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-900/20' 
              : 'border-neutral-700 text-neutral-400 hover:border-amber-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages().map((url, index) => (
            <div 
              key={index} 
              className="group relative aspect-square overflow-hidden bg-neutral-900 rounded-xl border border-neutral-800 hover:border-amber-500/50 transition-all"
            >
              {/* FIXED: Replaced <img> with Next.js <Image /> */}
              <Image
                src={url}
                alt={`Gallery image ${index}`}
                fill
                className="object-cover transform transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* FIXED: Changed bg-gradient-to-t to bg-linear-to-t */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-end p-4">
                <span className="text-sm text-amber-200">View Detail</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredImages().length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          No images found in this category.
        </div>
      )}
    </div>
  );
};

export default GalleryPage;