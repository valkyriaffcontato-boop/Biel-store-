"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// Registrar Usuário de Teste / Login
export async function authenticateMock(email: string, name: string, actionType: "login" | "register") {
  let user = await prisma.user.findUnique({ where: { email } });

  if (actionType === "register" && !user) {
    const isAdmin = email === "calvoeditofc@gmail.com" || email === "mafiosodashopping@gmail.com";
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: "default_password",
        role: isAdmin ? "ADMIN" : "USER",
      }
    });
  }

  if (!user) {
    throw new Error("Usuário não cadastrado.");
  }

  const { setSession } = await import("@/lib/session");
  await setSession(user.id, user.role, user.name);
  revalidatePath("/");
}

// Salvar Foto de Perfil
export async function updateProfileImage(base64Image: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");

  await prisma.user.update({
    where: { id: session.userId },
    data: { image: base64Image }
  });

  revalidatePath("/dashboard/profile");
}

// Criar Produto com Foto
export async function createProductWithImage(title: string, description: string, price: number, category: string, base64Image: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");

  await prisma.product.create({
    data: {
      title,
      description,
      price,
      category,
      image: base64Image,
      sellerId: session.userId
    }
  });

  revalidatePath("/");
}

// Comprar Produto e Criar Chat Automaticamente
export async function buyProduct(productId: string) {
  const session = await getSession();
  if (!session) throw new Error("Faça login para realizar a compra.");

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Produto não encontrado.");

  // Criar o pedido
  await prisma.order.create({
    data: {
      productId: product.id,
      buyerId: session.userId,
      sellerId: product.sellerId,
      amount: product.price,
      status: "PAID",
    }
  });

  // Criar a sala de chat entre comprador e vendedor
  try {
    await prisma.chatRoom.create({
      data: {
        buyerId: session.userId,
        sellerId: product.sellerId,
      }
    });
  } catch (err) {
    // Sala de chat já existe entre eles, ignorar
  }

  revalidatePath("/");
  revalidatePath("/chat");
}

// Moderar Anúncio (Aprovar / Rejeitar)
export async function moderateProduct(productId: string, action: "active" | "rejected") {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Não autorizado");

  await prisma.product.update({
    where: { id: productId },
    data: { status: action }
  });

  revalidatePath("/");
  revalidatePath("/dashboard/admin");
}

// Confirmar Recebimento (Liberação do saldo)
export async function confirmReceived(orderId: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.buyerId !== session.userId) throw new Error("Pedido inválido");

  const releaseDate = new Date();
  releaseDate.setDate(releaseDate.getDate() + 7);

  await prisma.order.update({
    where: { id: orderId },
    data: { acceptedByBuyer: true, status: "COMPLETED", payoutReadyAt: releaseDate }
  });

  await prisma.user.update({
    where: { id: order.sellerId },
    data: { frozenBalance: { increment: order.amount } }
  });

  revalidatePath("/");
}

// Enviar Mensagem no Chat
export async function sendMessage(roomId: string, text: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");

  await prisma.message.create({
    data: { roomId, text, senderId: session.userId }
  });

  revalidatePath(`/chat/${roomId}`);
}

// Solicitar se tornar Vendedor
export async function requestSellerRole(formData: { fullName: string; cpf: string; whatsapp: string; games: string; experience: string }) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");

  await prisma.sellerRequest.create({
    data: {
      userId: session.userId,
      fullName: formData.fullName,
      cpf: formData.cpf,
      whatsapp: formData.whatsapp,
      games: formData.games,
      experience: formData.experience,
    }
  });

  revalidatePath("/dashboard/profile");
}

// Aprovar Vendedor
export async function approveSeller(requestId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Acesso negado");

  const request = await prisma.sellerRequest.update({
    w
