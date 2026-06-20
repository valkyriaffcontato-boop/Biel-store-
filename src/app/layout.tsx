import "./globals.css";
import { getSession, destroySession } from "@/lib/session";
import Link from "next/link";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  async function handleLogout() {
    "use server";
    await destroySession();
  }

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between">
        <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-extrabold tracking-wider text-purple-500">
              BIEL STORE
            </Link>
            
            <nav className="flex items-center gap-4 text-sm">
              {session ? (
                <>
                  <span className="text-neutral-400">Olá, <strong className="text-white">{session.name}</strong> ({session.role})</span>
                  <form action={handleLogout}>
                    <button className="bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded transition">Sair</button>
                  </form>
                </>
              ) : (
                <span className="text-xs text-neutral-400">Use os formulários abaixo para testar o sistema</span>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500 bg-black">
          &copy; 2026 BIEL STORE. Administradores: calvoeditofc@gmail.com | mafiosodashopping@gmail.com
        </footer>
      </body>
    </html>
  );
}
