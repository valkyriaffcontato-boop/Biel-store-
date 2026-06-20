"use client";

import { useState, useTransition } from "react";
import { Gamepad2, Upload } from "lucide-react";

interface Props {
  onPublish: (title: string, description: string, price: number, category: string, base64: string) => Promise<void>;
}

export default function ClientProductUploader({ onPublish }: Props) {
  const [isPending, startTransition] = useTransition();
  const [base64, setBase64] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;

    startTransition(async () => {
      await onPublish(title, description, price, category, base64 || "");
      alert("Produto publicado com sucesso!");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="title" placeholder="Título do anúncio" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
        <input name="category" placeholder="Categoria (Roblox, FF, Valorant...)" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input name="price" type="number" step="0.01" placeholder="Preço (R$)" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
        <input name="stock" type="number" defaultValue="1" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
      </div>

      <textarea name="description" placeholder="Descrição detalhada..." className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs h-24" required />

      <div className="space-y-2">
        <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Imagens do anúncio</label>
        <div className="border border-dashed border-neutral-850 rounded-xl p-6 text-center bg-neutral-950/40 relative flex flex-col items-center justify-center cursor-pointer">
          {base64 ? (
            <img src={base64} className="max-h-32 object-contain rounded" />
          ) : (
            <div className="space-y-1">
              <Upload className="w-6 h-6 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-500">Toque aqui para escolher uma foto no seu celular</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </div>

      <button type="submit" disabled={isPending} className="w-full bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold py-3 rounded-xl text-xs transition">
        {isPending ? "Publicando..." : "Criar anúncio oficial"}
      </button>
    </form>
  );
}
