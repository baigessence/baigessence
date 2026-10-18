"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

type ProductGalleryProps = {
  name: string;
  images: string[];
  badge?: string | null;
};

export default function ProductGallery({
  name,
  images,
  badge,
}: ProductGalleryProps) {
  const gallery = useMemo(() => {
    const unique = Array.from(new Set(images.filter(Boolean)));
    return unique;
  }, [images]);

  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (gallery.length === 0) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <div className="flex h-full items-center justify-center text-sm text-muted">
          No image
        </div>
      </div>
    );
  }

  const current = Math.min(active, gallery.length - 1);

  const openAt = (index: number) => {
    setActive(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-md space-y-3 lg:max-w-lg">
        <button
          type="button"
          onClick={() => openAt(current)}
          className="group relative block aspect-[3/4] w-full overflow-hidden bg-cream text-left"
          aria-label={`View ${name} image larger`}
        >
          <Image
            src={gallery[current]}
            alt={name}
            fill
            priority
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02] md:p-8"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
          {badge && (
            <span className="absolute top-3 left-3 bg-gold px-2.5 py-1 text-[10px] font-bold tracking-wider text-charcoal uppercase">
              {badge}
            </span>
          )}
          <span className="absolute right-3 bottom-3 flex items-center gap-1.5 bg-charcoal/80 px-2.5 py-1.5 text-[10px] tracking-wider text-white uppercase backdrop-blur-sm">
            <Expand className="h-3.5 w-3.5" />
            Tap to enlarge
          </span>
        </button>

        {gallery.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {gallery.map((img, i) => (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => {
                  if (i === current) openAt(i);
                  else setActive(i);
                }}
                className={`relative aspect-[3/4] overflow-hidden bg-cream transition-opacity ${
                  i === current
                    ? "ring-2 ring-gold ring-offset-1"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === current}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-contain p-1.5"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <ImageLightbox
        images={gallery}
        alt={name}
        index={current}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setActive}
      />
    </>
  );
}
