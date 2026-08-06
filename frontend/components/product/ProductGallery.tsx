"use client";

import { useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export default function ProductGallery({
  images,
  name,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="w-full">

      {/* Main Image */}

      <div className="relative flex h-[550px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">

        <Image
          src={selectedImage}
          alt={name}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-contain p-10 transition duration-500 hover:scale-105"
        />

      </div>

      {/* Thumbnails */}

      <div className="mt-6 grid grid-cols-4 gap-4">

        {images.map((image, index) => (

          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`relative h-24 overflow-hidden rounded-2xl border transition ${
              selectedImage === image
                ? "border-[#D4AF37]"
                : "border-white/10"
            }`}
          >

            <Image
              src={image}
              alt={`${name}-${index}`}
              fill
              sizes="96px"
              className="object-contain p-2"
            />

          </button>

        ))}

      </div>

    </div>
  );
}