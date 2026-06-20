import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MessageSquare, ArrowLeft, User } from "lucide-react";
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

  // Busca salas de negociação associadas a esse usuário logado
  const rooms = await prisma.chatRoom.findMany({
    where: {
      OR: [{ buyerId: session.userId }, { sellerId: session.userId }]
    },
    include: {
      buyer: true,
      seller: true,
    }
  });

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-xl mx-auto bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-300">
            <MessageSquare className="w-5 h-5 text-emerald-400" /> Seus Chats de Negociação
          </h2>
          <Link href="/" className="text-xs text-neutral-400 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
          </Link>
        </div>

        {rooms.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-10">Nenhuma entrega ou conversa ativa no momento.</p>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => {
              const otherUser = room.buyerId === session.userId ? room.seller : room.buyer;
              return (
                <Link href={`/chat/${room.id}`} key={room.id} className="flex items-center justify-between bg-neutral-950 p-4 rounded-2xl border border-neutral-850 hover:border-neutral-750 transition cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-neutral-100">@{otherUser.name}</p>
                      <p className="text-[9px] text-neutral-500">Tocar para abrir chat seguro</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md">Ativo</span>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
