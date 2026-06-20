import { prisma } from "@/lib/prisma";
import { buyProduct } from "@/app/actions/market";
import { ShieldCheck, Calendar, ArrowLeft, Gamepad } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: { seller: true }
  });

  if (!product) notFound();

  async function handlePurchase() {
    "use server";
    await buyProduct(product.id);
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/" className="text-xs text-neutral-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para a Loja
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900/40 border border-neutral-800/85 p-6 rounded-3xl">
          {/* FOTO DO PRODUTO */}
          <div className="aspect-video sm:aspect-square bg-neutral-950 rounded-2xl border border-neutral-800 flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <Gamepad className="w-12 h-12 text-neutral-800" />
            )}
          </div>

          {/* DETALHES E COMPRA */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {product.category}
              </span>
              <h1 className="text-xl md:text-2xl font-black">{product.title}</h1>
              <p className="text-xs text-neutral-400 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-800/60">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Preço</p>
                  <p className="text-2xl font-black text-emerald-400">R$ {product.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Vendedor</p>
                  <p className="text-xs font-bold text-neutral-200">@{product.seller.name}</p>
                </div>
              </div>

              <form action={handlePurchase}>
                <button className="w-full bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold py-3.5 rounded-xl text-xs transition duration-200 shadow-md">
                  Comprar Agora
                </button>
              </form>

              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex items-start gap-2 text-[10px] text-emerald-400 leading-relaxed">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Intermediação Biel Store: Seus dados e seu saldo estão 100% protegidos por 7 dias contra golpes.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
