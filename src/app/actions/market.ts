"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function authenticateMock(email: string, name: string, actionType: "login" | "register") {
  let user = await prisma.user.findUnique({ where: { email } });
  if (actionType === "register" && !user) {
    const isAdmin = email === "calvoeditofc@gmail.com" || email === "mafiosodashopping@gmail.com";
    user = await prisma.user.create({ data: { email, name, password: "default_password", role: isAdmin ? "ADMIN" : "USER" } });
  }
  if (!user) throw new Error("Usuário não cadastrado.");
  const { setSession } = await import("@/lib/session");
  await setSession(user.id, user.role, user.name);
  revalidatePath("/");
}

export async function updateProfileImage(base64Image: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  await prisma.user.update({ where: { id: session.userId }, data: { image: base64Image } });
  revalidatePath("/dashboard/profile");
}

export async function createProductWithImage(title: string, description: string, price: number, category: string, base64Image: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  await prisma.product.create({ data: { title, description, price, category, image: base64Image, sellerId: session.userId } });
  revalidatePath("/");
  redirect("/dashboard/profile");
}

export async function buyProduct(productId: string) {
  const session = await getSession();
  if (!session) throw new Error("Faça login para realizar a compra.");
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Produto não encontrado.");
  await prisma.order.create({ data: { productId: product.id, buyerId: session.userId, sellerId: product.sellerId, amount: product.price, status: "PAID" } });
  let chatRoom = await prisma.chatRoom.findUnique({ where: { buyerId_sellerId: { buyerId: session.userId, sellerId: product.sellerId } } });
  if (!chatRoom) chatRoom = await prisma.chatRoom.create({ data: { buyerId: session.userId, sellerId: product.sellerId } });
  revalidatePath("/");
  revalidatePath("/chat");
  redirect(`/chat/${chatRoom.id}`);
}

export async function createQuestion(productId: string, text: string) {
  const session = await getSession();
  if (!session) throw new Error("Faça login para perguntar.");
  await (prisma as any).question.create({ data: { productId, userId: session.userId, text } });
  revalidatePath(`/products/${productId}`);
}

export async function answerQuestion(questionId: string, answer: string, productId: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  await (prisma as any).question.update({ where: { id: questionId }, data: { answer } });
  revalidatePath(`/products/${productId}`);
}

export async function moderateProduct(productId: string, action: "active" | "rejected") {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Não autorizado");
  await prisma.product.update({ where: { id: productId }, data: { status: action } });
  revalidatePath("/");
  revalidatePath("/dashboard/admin");
}

export async function deleteProduct(productId: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  await prisma.product.update({ where: { id: productId }, data: { status: "deleted" } });
  revalidatePath("/dashboard/profile");
}

export async function toggleProductStatus(productId: string, currentStatus: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  const nextStatus = currentStatus === "active" ? "hidden" : "active";
  await prisma.product.update({ where: { id: productId }, data: { status: nextStatus } });
  revalidatePath("/dashboard/profile");
}

export async function boostProduct(productId: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  await prisma.product.update({ where: { id: productId }, data: { isBoosted: true } });
  revalidatePath("/dashboard/profile");
}

export async function confirmReceived(orderId: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.buyerId !== session.userId) throw new Error("Pedido inválido");
  const releaseDate = new Date();
  releaseDate.setDate(releaseDate.getDate() + 7);
  await prisma.order.update({ where: { id: orderId }, data: { acceptedByBuyer: true, status: "COMPLETED", payoutReadyAt: releaseDate } });
  await prisma.user.update({ where: { id: order.sellerId }, data: { frozenBalance: { increment: order.amount } } });
  revalidatePath("/");
}

export async function sendMessage(roomId: string, text: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  await prisma.message.create({ data: { roomId, text, senderId: session.userId } });
  revalidatePath(`/chat/${roomId}`);
}

export async function requestSellerRole(formData: { fullName: string; cpf: string; whatsapp: string; games: string; experience: string }) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  await prisma.sellerRequest.create({ data: { userId: session.userId, fullName: formData.fullName, cpf: formData.cpf, whatsapp: formData.whatsapp, games: formData.games, experience: formData.experience } });
  revalidatePath("/dashboard/profile");
}

export async function approveSeller(requestId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Acesso negado");
  const request = await prisma.sellerRequest.update({ where: { id: requestId }, data: { status: "APPROVED" } });
  await prisma.user.update({ where: { id: request.userId }, data: { role: "SELLER" } });
  revalidatePath("/dashboard/admin");
}

export async function submitReview(orderId: string, rating: number, comment: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  await (prisma as any).review.create({ data: { orderId, userId: session.userId, rating, comment } });
  revalidatePath("/chat");
}

export async function createSupportTicket(name: string, email: string, message: string) {
  await (prisma as any).supportTicket.create({ data: { name, email, message } });
  revalidatePath("/support");
}

export async function resolveSupportTicket(ticketId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Não autorizado");
  await (prisma as any).supportTicket.update({ where: { id: ticketId }, data: { status: "RESOLVED" } });
  revalidatePath("/dashboard/admin");
}

export async function markAsDelivered(orderId: string) {
  const session = await getSession();
  if (!session) throw new Error("Não autorizado");
  await prisma.order.update({ where: { id: orderId }, data: { deliveredBySeller: true, status: "DELIVERED" } });
  revalidatePath("/chat");
}
