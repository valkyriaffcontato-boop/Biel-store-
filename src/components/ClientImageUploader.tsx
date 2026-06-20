"use client";

import { Camera } from "lucide-react";
import { useTransition } from "react";

interface Props {
  onUploadComplete: (base64: string) => Promise<void>;
}

export default function ClientImageUploader({ onUploadComplete }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      startTransition(async () => {
        await onUploadComplete(base64String);
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <label className="absolute bottom-0 inset-x-0 bg-black/70 py-1.5 text-center text-[8px] font-black text-neutral-200 cursor-pointer flex items-center justify-center gap-1">
      <Camera className="w-2.5 h-2.5" />
      <span className="uppercase">{isPending ? "Salvando..." : "ALTERAR"}</span>
      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </label>
  );
}
