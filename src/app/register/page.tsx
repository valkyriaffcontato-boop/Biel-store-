import { Gamepad2, Shield } from "lucide-react";
import Link from "next/link";
import { authenticateMock } from "../actions/market";

export default function RegisterPage() {
  async function handleRegister(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    await authenticateMock(email, name, "register");
  }

  return (
    <div className="min-h-screen bg-[#08080c] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-neutral-900/80 border border-neutral-800/80 rounded-3xl p-6 space-y-6 shadow-2xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Gamepad2 className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1.5 pt-4">
          <h1 className="text-xl font-bold">Criar conta</h1>
          <p className="text-xs text-neutral-400">Junte-se à maior comunidade gamer do Brasil</p>
        </div>

        <form action={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Nome completo</label>
            <input name="name" placeholder="Seu nome" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Usuário</label>
            <input name="username" placeholder="@usuario" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Email</label>
            <input name="email" type="email" placeholder="voce@email.com" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Senha</label>
            <input name="password" type="password" placeholder="Mínimo 6 caracteres" className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" required />
          </div>

          <div className="flex items-center gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800/60">
            <input type="checkbox" id="rls" defaultChecked className="accent-emerald-500" />
            <label htmlFor="rls" className="text-[10px] text-neutral-400 cursor-pointer flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Seus dados estão protegidos com RLS
            </label>
          </div>

          <button className="w-full bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold py-3 rounded-xl text-xs transition duration-200 shadow-md">
            Criar conta
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 pt-2">
          Já tem conta? <Link href="/login" className="text-emerald-400 font-bold hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
