"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export async function createStripeSession(productId: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Produto não encontrado.");

  if (session.userId === product.sellerId) {
    throw new Error("Você não pode comprar seu próprio produto.");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Criar checkout do Stripe com suporte a Cartão de Crédito e PIX do Brasil
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "pix"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: product.title,
            description: product.description.slice(0, 100),
          },
          unit_amount: Math.round(product.price * 100), // Stripe trabalha em centavos
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      productId: product.id,
      buyerId: session.userId,
      sellerId: product.sellerId,
      amount: product.price.toString(),
    },
    success_url: `${appUrl}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/products/${product.id}`,
  });

  if (checkoutSession.url) {
    redirect(checkoutSession.url); // Redireciona o cliente para a tela oficial do Stripe!
  }
          }
