import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Send, User, ShieldAlert, ArrowLeft } from "lucide-react";
import { sendMessage, markAsDelivered, confirmReceived, submitReview } from "@/app/actions/market";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const session = await getSession();
  if (!session) return notFound();

  const resolvedParams = await params;
  const room = await prisma.chatRoom.findUnique({
    where: { id: resolvedParams.roomId },
    include: {
      buyer: true,
      seller: true,
      messages: { include: { sender: true }, orderBy: { createdAt: "asc" } }
    }
  });

  if (!room) notFound();

  // 1. Busca o último pedido de forma simples (sem include para não travar o compilador)
  const order = await prisma.order.findFirst({
    where: { productId: { in: await prisma.product.findMany({ where: { sellerId: room.sellerId } }).then(p => p.map(x => x.id)) } },
    orderBy: { createdAt: "desc" }
  });

  // 2. Busca a avaliação correspondente de forma separada usando o bypass de tipo
  const review = order 
    ? await (prisma as any).review.findUnique({ where: { orderId: order.id } }) 
    : null;

  async function handleSend(formData: FormData) {
    "use server";
    const text = formData.get("messageText") as string;
    if (room) await sendMessage(room.id, text);
  }

  async function handleDelivered() {
    "use server";
    if (order) await markAsDelivered(order.id);
  }

  async function handleAccept() {
    "use server";
    if (order) await confirmReceived(order.id);
  }

  async function handleReview(formData: FormData) {
    "use server";
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;
    if (order) await submitReview(order.id, rating, comment);
  }

  const isSeller = session.userId === room.sellerId;
  const isBuyer = session.userId === room.buyerId;
  const otherUser = isBuyer ? room.seller : room.buyer;

  return (
    <div className="min-h-screen bg-[#080a10] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Link href="/chat" className="text-xs text-neutral-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para conversas
        </Link>

        {/* CONTROLES DE ENTREGA E AVALIAÇÃO DA COMPRA */}
        {order && (
          <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-3xl space-y-4">
            <p className="text-xs font-bold text-neutral-300">Status da Transação: <span className="text-[#00e676]">{order.status}</span></p>
            
            <div className="flex flex-wrap gap-2">
              {/* VENDEDOR CONFIRMA A ENTREGA */}
              {isSeller && !order.deliveredBySeller && (
                <form action={handleDelivered}>
                  <button className="bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold text-xs px-4 py-2 rounded-xl transition">
                    Confirmar Envio / Marcar como Entregue
                  </button>
                </form>
              )}

              {/* COMPRADOR CONFIRMA O RECEBIMENTO */}
              {isBuyer && order.status === "DELIVERED" && (
                <form action={handleAccept}>
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition">
                    Confirmar Recebimento (Tudo ok!)
                  </button>
                </form>
              )}
            </div>

            {/* SEÇÃO DE AVALIAÇÃO DO VENDEDOR (UTILIZA O VALOR DA BUSCA SEPARADA) */}
            {isBuyer && order.status === "COMPLETED" && !review && (
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-3">
                <p className="text-xs font-bold text-[#00e676]">Deixe uma Avaliação para o Vendedor</p>
                <form action={handleReview} className="space-y-3">
                  <div className="flex gap-2">
                    <select name="rating" className="bg-neutral-900 text-xs p-2 rounded-lg border border-neutral-800 text-yellow-500 font-bold">
                      <option value="5">⭐⭐⭐⭐★ (5 Estrelas)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Estrelas)</option>
                      <option value="3">⭐⭐⭐ (3 Estrelas)</option>
                      <option value="2">⭐⭐ (2 Estrelas)</option>
                      <option value="1">⭐ (1 Estrela)</option>
                    </select>
                  </div>
                  <input name="comment" placeholder="Como foi o atendimento do vendedor?" className="w-full bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 text-xs text-white" required />
                  <button className="bg-[#00e676] text-black font-extrabold text-[10px] px-3 py-1.5 rounded-lg">Enviar Avaliação</button>
                </form>
              </div>
            )}
          </div>
        )}

        <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col h-[500px] shadow-2xl">
          <div className="bg-neutral-950 p-4 border-b border-neutral-850 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-xs">@{otherUser.name}</p>
                <p className="text-[9px] text-neutral-500">Chat seguro de entrega</p>
              </div>
            </div>
          </div>

          {/* MENSAGENS */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-950/20">
            {room.messages.map((msg) => {
              const isMe = msg.senderId === session.userId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${isMe ? "bg-[#00e676] text-black font-semibold rounded-br-none" : "bg-neutral-900 text-neutral-100 rounded-bl-none border border-neutral-800"}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INPUT DO CHAT */}
          <form action={handleSend} className="bg-neutral-950 p-4 border-t border-neutral-850 flex gap-2">
            <input name="messageText" placeholder="Digite sua mensagem de entrega..." className="flex-1 bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-xs text-white" required />
            <button className="bg-[#00e676] text-black font-extrabold px-5 rounded-xl transition"><Send className="w-4 h-4" /></button>
          </form>
        </div>

      </div>
    </div>
  );
}
