"use client";

import React, { useState } from 'react';
import { mediaApi } from '../hooks/media-api';
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { MediaPurpose } from '../types';
// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UploadMediaForm() {
  const [purpose, setPurpose] = useState<MediaPurpose>(MediaPurpose.GENERAL);
  const [loading, setLoading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await mediaApi.uploadFile(file, purpose);
      alert(`Success: ${result.name}`);
    } catch (err: unknown) {
      // Fix: @typescript-eslint/no-explicit-any
      const msg = err instanceof Error ? err.message : 'File upload failed';
      alert(msg);
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleLinkUpload = async () => {
    if (!linkUrl) return;
    setLoading(true);
    try {
      await mediaApi.uploadLink(linkUrl, purpose);
      setLinkUrl('');
      alert('Link uploaded successfully!');
    } catch (err: unknown) {
      // Fix: @typescript-eslint/no-explicit-any
      const msg = err instanceof Error ? err.message : 'Link upload failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-8">
        
        {/* Header & Purpose Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Media Manager</h2>
            <p className="text-xs text-muted-foreground">Upload assets to your serverless Cloudinary storage</p>
          </div>
          
          <div className="flex flex-col gap-2 min-w-50">
            <Label htmlFor="purpose" className="text-[10px] uppercase font-black opacity-50">Upload Category</Label>
            <Select 
              value={purpose} 
              onValueChange={(val) => setPurpose(val as MediaPurpose)}
              disabled={loading}
            >
              <SelectTrigger id="purpose" className="h-9">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MediaPurpose).map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p.replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Option 1: Binary File Upload */}
          <div className="group relative border-2 border-dashed border-stone-200 dark:border-stone-800 hover:border-amber-500/50 p-10 rounded-2xl text-center flex flex-col items-center gap-4 transition-all bg-stone-50/50 dark:bg-stone-950/50">
            <div className="p-4 bg-white dark:bg-stone-900 rounded-full shadow-sm">
              <Upload className="h-6 w-6 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm">Local Asset</h3>
              <p className="text-[10px] text-muted-foreground">Images or Videos (Max 4.5MB)</p>
            </div>
            
            <input 
              type="file" 
              className="hidden" 
              id="media-file-input" 
              onChange={handleFileChange} 
              disabled={loading}
              accept="image/*,video/*"
            />
            
            <Button asChild variant="outline" className="w-full" disabled={loading}>
              <label htmlFor="media-file-input" className="cursor-pointer">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Processing...' : 'Browse Files'}
              </label>
            </Button>
          </div>

          {/* Option 2: Remote Link / Base64 */}
          <div className="group relative border-2 border-dashed border-stone-200 dark:border-stone-800 hover:border-amber-500/50 p-10 rounded-2xl text-center flex flex-col items-center gap-4 transition-all bg-stone-50/50 dark:bg-stone-950/50">
            <div className="p-4 bg-white dark:bg-stone-900 rounded-full shadow-sm">
              <LinkIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm">Remote URL</h3>
              <p className="text-[10px] text-muted-foreground">Direct link or Base64 string</p>
            </div>

            <Input 
              type="text" 
              placeholder="https://images.com/photo.jpg" 
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              disabled={loading}
              className="h-9 text-xs focus-visible:ring-amber-500"
            />
            
            <Button 
              onClick={handleLinkUpload}
              disabled={!linkUrl || loading}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Uploading...' : 'Upload Link'}
            </Button>
          </div>

        </div>

        <div className="text-center">
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
            Powered by Cloudinary & Moger Mulluk Backend
          </p>
        </div>
      </div>
    </div>
  );
}