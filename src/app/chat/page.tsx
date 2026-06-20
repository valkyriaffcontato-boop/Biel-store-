import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MessageSquare, Send, User } from "lucide-react";
import { sendMessage } from "../actions/market";
import Link from "next/link";

export default async function ChatListPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
        <p className="text-xs text-neutral-500">Faça login para acessar o chat.</p>
      </div>
    );
  }

  // Buscar conversas ativas do usuário logado
  const rooms = await prisma.chatRoom.findMany({
    where: {
      OR: [{ buyerId: session.userId }, { sellerId: session.userId }]
    },
    include: {
      buyer: true,
      seller: true,
      messages: { orderBy: { createdAt: "asc" } }
    }
  });

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-900/20 border border-neutral-800 p-6 rounded-3xl min-h-[500px]">
        
        {/* LISTA DE CONVERSAS */}
        <div className="border-r border-neutral-800/60 pr-4 space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-300">
            <MessageSquare className="w-4 h-4 text-emerald-400" /> Conversas ativas
          </h2>
          {rooms.length === 0 ? (
            <p className="text-[10px] text-neutral-500">Nenhuma entrega ou conversa ativa ainda.</p>
          ) : (
            <div className="space-y-2">
              {rooms.map((room) => {
                const otherUser = room.buyerId === session.userId ? room.seller : room.buyer;
                return (
                  <Link href={`/chat?roomId=${room.id}`} key={room.id} className="block bg-neutral-900/40 p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 transition">
                    <p className="text-xs font-bold">@{otherUser.name}</p>
                    <p className="text-[9px] text-neutral-500 truncate">Clique para abrir o chat de entrega</p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* CHAT SELECIONADO */}
        <div className="md:col-span-2 flex flex-col justify-between h-full">
          <div className="text-center py-20 text-neutral-600 text-xs">
            Selecione uma conversa ao lado para ver o chat de entrega.
          </div>
        </div>

      </div>
    </div>
  );
}
