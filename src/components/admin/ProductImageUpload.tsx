"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Link as LinkIcon, Loader2 } from "lucide-react";

type ProductImageUploadProps = {
  mainImage: string;
  additionalImages: string;
  onMainImageChange: (url: string) => void;
  onAdditionalImagesChange: (urls: string) => void;
};

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

export default function ProductImageUpload({
  mainImage,
  additionalImages,
  onMainImageChange,
  onAdditionalImagesChange,
}: ProductImageUploadProps) {
  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const galleryUrls = additionalImages
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadingMain(true);
    try {
      const url = await uploadFile(file);
      onMainImageChange(url);
      if (!galleryUrls.includes(url)) {
        onAdditionalImagesChange([url, ...galleryUrls.filter((u) => u !== url)].join("\n"));
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingMain(false);
      if (mainInputRef.current) mainInputRef.current.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploadError("");
    setUploadingGallery(true);
    try {
      const urls = [...galleryUrls];
      for (const file of files) {
        const url = await uploadFile(file);
        if (!urls.includes(url)) urls.push(url);
      }
      onAdditionalImagesChange(urls.join("\n"));
      if (!mainImage && urls.length > 0) {
        onMainImageChange(urls[0]);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const removeGalleryImage = (url: string) => {
    const next = galleryUrls.filter((u) => u !== url);
    onAdditionalImagesChange(next.join("\n"));
    if (mainImage === url) {
      onMainImageChange(next[0] ?? "");
    }
  };

  const setAsMain = (url: string) => {
    onMainImageChange(url);
  };

  return (
    <div className="space-y-6 sm:col-span-2">
      <div>
        <label className="mb-2 block text-sm font-medium">Product Image *</label>

        {/* Main image preview */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative h-48 w-40 shrink-0 overflow-hidden border border-charcoal/10 bg-cream">
            {mainImage ? (
              <>
                <Image
                  src={mainImage}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  sizes="160px"
                  unoptimized={mainImage.includes("supabase.co")}
                />
                <button
                  type="button"
                  onClick={() => onMainImageChange("")}
                  className="absolute top-2 right-2 rounded-full bg-white/90 p-1 shadow hover:bg-white"
                  aria-label="Remove main image"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-muted">
                <Upload className="h-8 w-8 opacity-40" />
                <p className="mt-2 text-[10px] tracking-wider uppercase">No image</p>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <input
              ref={mainInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleMainUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => mainInputRef.current?.click()}
              disabled={uploadingMain}
              className="btn-outline inline-flex w-full sm:w-auto disabled:opacity-50"
            >
              {uploadingMain ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Main Image
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-2 text-xs text-muted hover:text-charcoal"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              {showUrlInput ? "Hide URL input" : "Or paste image URL"}
            </button>
            {showUrlInput && (
              <input
                value={mainImage}
                onChange={(e) => onMainImageChange(e.target.value)}
                className="input-field"
                placeholder="https://..."
              />
            )}
            <p className="text-xs text-muted">JPEG, PNG, WebP or GIF · Max 5MB</p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div>
        <label className="mb-2 block text-sm font-medium">Additional Images</label>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleGalleryUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          disabled={uploadingGallery}
          className="btn-outline mb-4 inline-flex disabled:opacity-50"
        >
          {uploadingGallery ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload More Images
            </>
          )}
        </button>

        {galleryUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {galleryUrls.map((url) => (
              <div
                key={url}
                className={`group relative aspect-square overflow-hidden border bg-cream ${
                  url === mainImage ? "border-gold ring-2 ring-gold/30" : "border-charcoal/10"
                }`}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized={url.includes("supabase.co")}
                />
                {url === mainImage && (
                  <span className="absolute top-1 left-1 bg-gold px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-charcoal uppercase">
                    Main
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {url !== mainImage && (
                    <button
                      type="button"
                      onClick={() => setAsMain(url)}
                      className="bg-white px-2 py-1 text-[9px] font-medium tracking-wider uppercase hover:bg-gold"
                    >
                      Set Main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    className="rounded-full bg-white p-1 hover:bg-red-50"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
    </div>
  );
}
