import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { buyProduct } from "@/app/actions/market";
import { ArrowLeft, ShieldCheck, Wallet, QrCode, AlertTriangle } from "lucide-react";
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

  // Verifica se o usuário atual é o proprietário do anúncio
  const isOwner = session.userId === product.sellerId;

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

        {/* COMPRADOR TENTA COMPRAR DE SI MESMO (BLOQUEIO VISUAL AMIGÁVEL) */}
        {isOwner ? (
          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex flex-col items-center text-center gap-3 text-xs text-amber-300">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-black text-sm">Você é o proprietário!</p>
              <p className="mt-1 text-[11px] text-neutral-400 leading-relaxed">
                Não é possível comprar o seu próprio anúncio. Para simular e testar a entrega automática, utilize o painel do rodapé na página inicial e entre com uma conta de comprador fictício (ex: <code className="text-amber-300">comprador@teste.com</code>).
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* QR CODE SIMULADO PIX */}
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 text-center space-y-4">
              <div className="w-40 h-40 bg-white rounded-xl mx-auto flex items-center justify-center text-black">
                <QrCode className="w-32 h-32" />
              </div>
              <p className="text-[10px] text-neutral-400">Escaneie o QR Code acima ou aperte no botão abaixo para aprovar o pagamento simulado na hora.</p>
            </div>

            {/* CHAMADA DIRETA DA SERVER ACTION VIA BIND (PREVINE CRASH DO NEXT.JS) */}
            <form action={buyProduct.bind(null, product.id)}>
              <button type="submit" className="w-full bg-[#00e676] hover:bg-emerald-400 text-black font-black py-4 rounded-xl text-xs transition duration-200 shadow-md">
                Confirmar Pagamento (PIX Simulador)
              </button>
            </form>
          </>
        )}

        <div className="flex items-start gap-2 text-[9px] text-neutral-400 bg-neutral-900 p-3 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Dinheiro retido por 7 dias. O vendedor não pode retirar o valor até você receber e confirmar o item.</span>
        </div>
      </div>
    </div>
  );
}
