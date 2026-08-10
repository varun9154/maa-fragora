"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { uploadImage } from "../../services/uploadService";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0)
      return;

    try {
      setLoading(true);

      const imageUrl = await uploadImage(
        e.target.files[0]
      );

      onChange(imageUrl);

      toast.success("Image Uploaded Successfully");
    } catch (error) {
      console.error(error);

      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      {!value ? (

        <div
          onClick={() => inputRef.current?.click()}
          className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#D4AF37]/40 bg-[#181818] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#1f1f1f]"
        >

          {loading ? (
            <Loader2
              size={45}
              className="animate-spin text-[#D4AF37]"
            />
          ) : (
            <Upload
              size={45}
              className="text-[#D4AF37]"
            />
          )}

          <p className="mt-5 text-lg text-gray-300">

            {loading
              ? "Uploading Image..."
              : "Click to Upload Product Image"}

          </p>

          <p className="mt-2 text-sm text-gray-500">

            PNG • JPG • JPEG • WEBP

          </p>

          <input
            ref={inputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleUpload}
          />

        </div>

      ) : (

        <div className="relative overflow-hidden rounded-3xl">

          <Image
            src={value}
            alt="Product"
            width={800}
            height={600}
            className="h-80 w-full object-cover"
          />

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-4 top-4 rounded-full bg-red-600 p-2 transition hover:bg-red-700"
          >

            <X size={18} color="white" />

          </button>

        </div>

      )}

    </div>
  );
}