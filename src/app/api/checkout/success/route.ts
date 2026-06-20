import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Consulta os servidores do Stripe para ter certeza que foi pago
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      throw new Error("Pagamento não aprovado.");
    }

    const { productId, buyerId, sellerId, amount } = session.metadata!;

    // Evita duplicar pedidos caso o cliente atualize a página de sucesso
    let order = await prisma.order.findFirst({
      where: { productId, buyerId, status: "PAID" }
    });

    if (!order) {
      order = await prisma.order.create({
        data: {
          productId,
          buyerId,
          sellerId,
          amount: parseFloat(amount),
          status: "PAID",
        }
      });
    }

    // Abre a sala de chat segura automaticamente
    let chatRoom = await prisma.chatRoom.findFirst({
      where: { buyerId, sellerId }
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: { buyerId, sellerId }
      });
    }

    // Redireciona o comprador direto para o chat de entrega
    return NextResponse.redirect(new URL(`/chat/${chatRoom.id}`, request.url));

  } catch (error) {
    console.error("Erro no processamento do Stripe:", error);
    return NextResponse.redirect(new URL("/?error=payment_failed", request.url));
  }
}
