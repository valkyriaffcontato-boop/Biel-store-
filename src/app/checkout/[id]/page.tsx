import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { buyProduct } from "@/app/actions/market";
import { ArrowLeft, ShieldCheck, Wallet, QrCode } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center p-4">
        <p className="text-sm text-neutral-400">Você precisa estar logado para comprar.</p>
      </div>
    );
  }

  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: { seller: true }
  });

  if (!product) notFound();

  async function handleCompletePayment() {
    "use server";
    if (product) await buyProduct(product.id);
  }

  return (
    <div className="min-h-screen bg-[#080a10] text-white py-12 px-4">
      <div className="max-w-md mx-auto bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h1 className="text-sm font-black text-neutral-100 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-400" /> Pagamento Seguro
          </h1>
          <Link href={`/products/${product.id}`} className="text-xs text-neutral-400 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Cancelar
          </Link>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-neutral-400 uppercase">Item selecionado</p>
          <p className="font-extrabold text-sm">{product.title}</p>
          <p className="text-xl font-black text-emerald-400">R$ {product.price.toFixed(2)}</p>
        </div>

        {/* QR CODE SIMULADO DO PIX */}
        <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 text-center space-y-4">
          <div className="w-40 h-40 bg-white rounded-xl mx-auto flex items-center justify-center text-black">
            <QrCode className="w-32 h-32" />
          </div>
          <p className="text-[10px] text-neutral-400">Escaneie o QR Code acima ou aperte no botão abaixo para aprovar o pagamento simulado na hora.</p>
        </div>

        <form action={handleCompletePayment}>
          <button className="w-full bg-[#00e676] hover:bg-emerald-400 text-black font-black py-4 rounded-xl text-xs transition duration-200">
            Confirmar Pagamento (PIX Simulador)
          </button>
        </form>

        <div className="flex items-start gap-2 text-[9px] text-neutral-400 bg-neutral-900 p-3 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Dinheiro retido por 7 dias. O vendedor não pode retirar o valor até você receber e confirmar o item.</span>
        </div>
      </div>
    </div>
  );
}
