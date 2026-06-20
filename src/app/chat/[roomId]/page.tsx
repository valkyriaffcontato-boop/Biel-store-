import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Send, User, ShieldAlert, ArrowLeft } from "lucide-react";
import { sendMessage } from "@/app/actions/market";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const session = await getSession();
  if (!session) return notFound();

  const resolvedParams = await params;
  const room = await prisma.chatRoom.findUnique({
    where: { id: resolvedParams.id },
    include: {
      buyer: true,
      seller: true,
      messages: { include: { sender: true }, orderBy: { createdAt: "asc" } }
    }
  });

  if (!room) notFound();

  async function handleSend(formData: FormData) {
    "use server";
    const text = formData.get("messageText") as string;
    if (room) await sendMessage(room.id, text);
  }

  const otherUser = room.buyerId === session.userId ? room.seller : room.buyer;

  return (
    <div className="min-h-screen bg-[#080a10] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Link href="/chat" className="text-xs text-neutral-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para conversas
        </Link>

        <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col h-[550px] shadow-2xl">
          {/* TOPO DO CHAT */}
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
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-bold">
              Negociação Ativa
            </span>
          </div>

          {/* ÁREA DE MENSAGENS */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-950/20">
            <div className="bg-neutral-900/30 border border-neutral-800 p-3.5 rounded-xl text-[10px] text-neutral-400 flex items-start gap-2 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dica de Segurança: Envie todos os dados de acesso do jogo por este chat. Ele serve como registro oficial para fins de auditoria do suporte se necessário.</span>
            </div>

            {room.messages.map((msg) => {
              const isMe = msg.senderId === session.userId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs space-y-1 ${isMe ? "bg-[#00e676] text-black font-semibold rounded-br-none" : "bg-neutral-900 text-neutral-100 rounded-bl-none border border-neutral-800"}`}>
                    <p className="text-[9px] opacity-60">@{msg.sender.name}</p>
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INPUT DO CHAT */}
          <form action={handleSend} className="bg-neutral-950 p-4 border-t border-neutral-850 flex gap-2">
            <input 
              name="messageText" 
              placeholder="Digite sua mensagem de entrega..." 
              className="flex-1 bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
              required 
            />
            <button className="bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold px-5 rounded-xl transition flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
