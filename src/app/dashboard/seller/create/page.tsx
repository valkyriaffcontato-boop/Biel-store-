import { getSession } from "@/lib/session";
import { FolderSync, PlusCircle } from "lucide-react";
import Link from "next/link";
import { createProduct } from "../../../actions/market";

export default async function CreateProductPage() {
  const session = await getSession();

  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
        <p className="text-xs text-neutral-500">Apenas vendedores e administradores podem acessar esta página.</p>
      </div>
    );
  }

  async function handleAddProduct(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    await createProduct(title, description, price, category);
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-2xl mx-auto bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 space-y-6">
        
        <div className="space-y-1">
          <h1 className="text-lg font-black text-emerald-400 flex items-center gap-1.5">
            <PlusCircle className="w-5 h-5" /> Novo anúncio
          </h1>
          <p className="text-xs text-neutral-500">Preencha os detalhes do seu item com atenção</p>
        </div>

        <form action={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Título *</label>
              <input name="title" placeholder="Ex: Conta Roblox 90 skins" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Categoria *</label>
              <input name="category" placeholder="Roblox, Free Fire, Valorant..." className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Preço (R$) *</label>
              <input name="price" type="number" step="0.01" placeholder="R$ 10.00" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Estoque *</label>
              <input name="stock" type="number" defaultValue="1" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Descrição *</label>
            <textarea name="description" placeholder="Descreva os itens inclusos na venda e condições..." className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs h-24 focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
          </div>

          {/* DRAG-AND-DROP SIMULADO */}
          <div className="space-y-2">
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Imagens do anúncio</label>
            <div className="border border-dashed border-neutral-800 rounded-xl py-6 text-center text-xs text-neutral-500 bg-neutral-950/40">
              Arraste as imagens aqui ou toque para enviar
            </div>
          </div>

          <button className="w-full bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold py-3 rounded-xl text-xs transition shadow-lg">
            Criar anúncio oficial
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-400 font-bold flex items-center justify-center gap-1">
            <FolderSync className="w-3.5 h-3.5" /> Voltar para a Loja
          </Link>
        </div>

      </div>
    </div>
  );
}
