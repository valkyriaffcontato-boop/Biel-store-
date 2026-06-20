"use server";

import { prisma } from "@/lib/prisma";
import { getSession, setSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// Registrar Usuário de Teste / Login
export async function authenticateMock(email: string, name: string, actionType: "login" | "register") {
  let user = await prisma.user.findUnique({ where: { email } });

    if (actionType === "register" && !user) {
        // Configura proprietários como ADMIN automaticamente
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
                                                                        throw new Error("Usuário não encontrado.");
                                                                          }

                                                                            await setSession(user.id, user.role, user.name);
                                                                              revalidatePath("/");
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

                                                                                                                                    revalidatePath("/");
                                                                                                                                    }

                                                                                                                                    // Aprovar Vendedor (Apenas Administrador)
                                                                                                                                    export async function approveSeller(requestId: string) {
                                                                                                                                      const session = await getSession();
                                                                                                                                        if (!session || session.role !== "ADMIN") throw new Error("Acesso negado");

                                                                                                                                          const request = await prisma.sellerRequest.update({
                                                                                                                                              where: { id: requestId },
                                                                                                                                                  data: { status: "APPROVED" }
                                                                                                                                                    });

                                                                                                                                                      await prisma.user.update({
                                                                                                                                                          where: { id: request.userId },
                                                                                                                                                              data: { role: "SELLER" }
                                                                                                                                                                });

                                                                                                                                                                  revalidatePath("/");
                                                                                                                                                                  }

                                                                                                                                                                  // Criar Produto para Venda
                                                                                                                                                                  export async function createProduct(title: string, description: string, price: number, category: string) {
                                                                                                                                                                    const session = await getSession();
                                                                                                                                                                      if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
                                                                                                                                                                          throw new Error("Apenas vendedores podem anunciar.");
                                                                                                                                                                            }

                                                                                                                                                                              await prisma.product.create({
                                                                                                                                                                                  data: {
                                                                                                                                                                                        title,
                                                                                                                                                                                              description,
                                                                                                                                                                                                    price,
                                                                                                                                                                                                          category,
                                                                                                                                                                                                                sellerId: session.userId,
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                      });

                                                                                                                                                                                                                        revalidatePath("/");
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        // Comprar Produto (Inicia fluxo de dinheiro retido)
                                                                                                                                                                                                                        export async function buyProduct(productId: string) {
                                                                                                                                                                                                                          const session = await getSession();
                                                                                                                                                                                                                            if (!session) throw new Error("Faça login para comprar.");

                                                                                                                                                                                                                              const product = await prisma.product.findUnique({ where: { id: productId } });
                                                                                                                                                                                                                                if (!product) throw new Error("Produto não existe.");

                                                                                                                                                                                                                                  // Cria pedido com status Pago diretamente (Simulando checkout bem-sucedido)
                                                                                                                                                                                                                                    await prisma.order.create({
                                                                                                                                                                                                                                        data: {
                                                                                                                                                                                                                                              productId: product.id,
                                                                                                                                                                                                                                                    buyerId: session.userId,
                                                                                                                                                                                                                                                          sellerId: product.sellerId,
                                                                                                                                                                                                                                                                amount: product.price,
                                                                                                                                                                                                                                                                      status: "PAID",
                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                                              revalidatePath("/");
                                                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                                              // Confirmar recebimento do item (Liberação do saldo para o vendedor)
                                                                                                                                                                                                                                                                              export async function confirmReceived(orderId: string) {
                                                                                                                                                                                                                                                                                const session = await getSession();
                                                                                                                                                                                                                                                                                  if (!session) throw new Error("Não autorizado");

                                                                                                                                                                                                                                                                                    const order = await prisma.order.findUnique({ where: { id: orderId } });
                                                                                                                                                                                                                                                                                      if (!order || order.buyerId !== session.userId) throw new Error("Pedido inválido");

                                                                                                                                                                                                                                                                                        const releaseDate = new Date();
                                                                                                                                                                                                                                                                                          releaseDate.setDate(releaseDate.getDate() + 7); // Liberação programada para 7 dias

                                                                                                                                                                                                                                                                                            await prisma.order.update({
                                                                                                                                                                                                                                                                                                where: { id: orderId },
                                                                                                                                                                                                                                                                                                    data: {
                                                                                                                                                                                                                                                                                                          acceptedByBuyer: true,
                                                                                                                                                                                                                                                                                                                status: "COMPLETED",
                                                                                                                                                                                                                                                                                                                      payoutReadyAt: releaseDate
                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                                                                                              // Saldo entra retido (frozen) na conta do vendedor
                                                                                                                                                                                                                                                                                                                                await prisma.user.update({
                                                                                                                                                                                                                                                                                                                                    where: { id: order.sellerId },
                                                                                                                                                                                                                                                                                                                                        data: {
                                                                                                                                                                                                                                                                                                                                              frozenBalance: { increment: order.amount }
                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                                    });

                                                                                                                                                                                                                                                                                                                                                      revalidatePath("/");
                                                                                                                                                                                                                                                                                                                                                      }