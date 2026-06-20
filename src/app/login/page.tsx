import { Gamepad2 } from "lucide-react";
import Link from "next/link";
import { authenticateMock } from "../actions/market";

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    await authenticateMock(email, "Jogador", "login");
  }

  return (
    <div className="min-h-screen bg-[#08080c] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-neutral-900/80 border border-neutral-800/80 rounded-3xl p-6 space-y-6 shadow-2xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Gamepad2 className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1.5 pt-4">
          <h1 className="text-xl font-bold">Entrar na BIEL STORE</h1>
          <p className="text-xs text-neutral-400">Acesse sua conta para comprar e vender</p>
        </div>

        <form action={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Email</label>
            <input name="email" type="email" placeholder="voce@email.com" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Senha</label>
            <input name="password" type="password" placeholder="********" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
          </div>

          <button className="w-full bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold py-3 rounded-xl text-xs transition duration-200 shadow-md">
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 pt-2">
          Não tem conta? <Link href="/register" className="text-emerald-400 font-bold hover:underline">Criar agora</Link>
        </p>
      </div>
    </div>
  );
}
