import "./globals.css";
import { getSession, destroySession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  let userDetails = null;

  // Se o usuário estiver logado, buscamos os dados mais atualizados do banco
  if (session) {
    const userFromDb = await prisma.user.findUnique({
      where: { id: session.userId }
    });
    if (userFromDb) {
      userDetails = {
        id: userFromDb.id,
        name: userFromDb.name,
        email: userFromDb.email,
        role: userFromDb.role,
        isVerified: userFromDb.isVerified,
      };
    }
  }

  // Ação de Logout do servidor chamada pela Navbar do cliente
  async function handleLogout() {
    "use server";
    await destroySession();
  }

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#08080c] text-white flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {/* A nova barra superior e menu lateral unificados */}
          <Navbar user={userDetails} onLogout={handleLogout} />
          
          <main className="flex-1">{children}</main>
        </div>

        <footer className="border-t border-neutral-900 py-6 text-center text-[10px] text-neutral-500 bg-black/40">
          &copy; 2026 BIEL STORE. Administradores: calvoeditofc@gmail.com | mafiosodashopping@gmail.com
        </footer>
      </body>
    </html>
  );
}
