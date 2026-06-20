import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-neutral-600 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-sm font-black">Seu carrinho está vazio</h1>
          <p className="text-[10px] text-neutral-500 mt-1">Navegue pelas ofertas no nosso catálogo e escolha o que deseja comprar.</p>
        </div>
        <Link href="/" className="inline-block bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl transition">
          Ver anúncios
        </Link>
      </div>
    </div>
  );
}
