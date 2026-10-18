"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type ImageLightboxProps = {
  images: string[];
  alt: string;
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function ImageLightbox({
  images,
  alt,
  index,
  open,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const count = images.length;
  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + count) % count);
  }, [count, index, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % count);
  }, [count, index, onIndexChange]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || count === 0) return null;

  const src = images[index] ?? images[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} image viewer`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Close image"
      >
        <X className="h-6 w-6" />
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        className="relative h-[75vh] w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={`${alt} ${index + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>

      {count > 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
          {index + 1} / {count}
        </p>
      )}
    </div>
  );
}
