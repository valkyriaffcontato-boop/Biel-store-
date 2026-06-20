import { getSession } from "@/lib/session";
import { FolderSync, PlusCircle } from "lucide-react";
import Link from "next/link";
import { createProductWithImage } from "../../../actions/market";
import ClientProductUploader from "@/components/ClientProductUploader";

export default async function CreateProductPage() {
  const session = await getSession();

  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
        <p className="text-xs text-neutral-500">Acesso negado.</p>
      </div>
    );
  }

  async function handleAddProduct(title: string, description: string, price: number, category: string, base64: string) {
    "use server";
    await createProductWithImage(title, description, price, category, base64);
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-2xl mx-auto bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 space-y-6">
        
        <div className="space-y-1">
          <h1 className="text-lg font-black text-emerald-400 flex items-center gap-1.5">
            <PlusCircle className="w-5 h-5" /> Novo anúncio com Imagem
          </h1>
          <p className="text-xs text-neutral-500">Selecione uma foto da sua galeria pelo seu celular</p>
        </div>

        {/* COMPONENTE INTERATIVO PARA ENVIAR PRODUTO */}
        <ClientProductUploader onPublish={handleAddProduct} />

      </div>
    </div>
  );
}
