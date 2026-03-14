"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Sheet, SheetContent, SheetDescription, 
    SheetFooter, SheetHeader, SheetTitle, SheetTrigger 
} from "@/components/ui/sheet";
import { ImagePlusIcon, Loader2 } from "lucide-react";
import { productApi } from "../hooks/product-api";

type UploadPurpose = "thumbnail" | "gallery";
type UploadSource = "local" | "url";

interface Props {
    productId: string;
    onSuccess?: () => void;
}

const UploadProductPhotoForm = ({ productId, onSuccess }: Props) => {
    const [purpose, setPurpose] = useState<UploadPurpose>("thumbnail");
    const [source, setSource] = useState<UploadSource>("local");
    const [file, setFile] = useState<File | null>(null);
    
    // FIX 1: Initialize with "" to prevent "uncontrolled to controlled" error
    const [url, setUrl] = useState<string>(""); 
    
    const [isPending, setIsPending] = useState(false);

    const handleConfirm = async () => {
        if (source === "url" && !url.trim()) return alert("Please enter a valid URL");
        if (source === "local" && !file) return alert("Please select a file");

        setIsPending(true);
        try {
            if (source === "local") {
                if (purpose === "thumbnail") {
                    await productApi.uploadMedia(productId, file!);
                } else {
                    await productApi.uploadGalleryFile(productId, file!);
                }
            } else {
                // This calls apiRequest with a JSON body
                if (purpose === "thumbnail") {
                    await productApi.uploadMediaLink(productId, url);
                } else {
                    await productApi.uploadGalleryLink(productId, url);
                }
            }
            
            alert("Upload successful");
            setUrl(""); // Reset
            setFile(null);
            onSuccess?.();
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Failed to connect to server. Check CORS settings or Server status.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={'outline'}>
                    Add Media <ImagePlusIcon className="ml-2 h-4 w-4"/>
                </Button>
            </SheetTrigger>
            
            <SheetContent side="bottom" className="sm:max-w-md mx-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">            
                        <ImagePlusIcon/> Media Upload
                    </SheetTitle>
                    <SheetDescription>
                        Select the media type and source.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-4 py-4">
                    <Select value={purpose} onValueChange={(v) => setPurpose(v as UploadPurpose)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="thumbnail">Thumbnail</SelectItem>
                            <SelectItem value="gallery">Gallery</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={source} onValueChange={(v) => setSource(v as UploadSource)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="local">Local File</SelectItem>
                            <SelectItem value="url">Remote URL</SelectItem>
                        </SelectContent>
                    </Select>

                    {source === "local" ? (
                        <Input 
                            type="file" 
                            onChange={(e) => setFile(e.target.files?.[0] || null)} 
                        />
                    ) : (
                        <Input 
                            type="text"
                            placeholder="https://..."
                            // FIX 2: Fallback to "" to ensure it's always controlled
                            value={url || ""} 
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    )}
                </div>

                <SheetFooter>
                    <Button onClick={handleConfirm} disabled={isPending} className="w-full">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>  
    );
}

export default UploadProductPhotoForm;