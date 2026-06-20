import { HelpCircle, Mail, ShieldAlert } from "lucide-react";
import { createSupportTicket } from "../actions/market";

export default function SupportPage() {
  async function handleSendTicket(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    await createSupportTicket(name, email, message);
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-6">
          <div className="text-center space-y-1">
            <HelpCircle className="w-8 h-8 text-[#00e676] mx-auto" />
            <h1 className="text-lg font-black">Central de Atendimento</h1>
            <p className="text-xs text-neutral-500">Envie uma mensagem de suporte para a administração</p>
          </div>

          {/* FORMULÁRIO DE ENVIAR REPORT */}
          <form action={handleSendTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="name" placeholder="Seu Nome" className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-xs" required />
              <input name="email" type="email" placeholder="Seu E-mail" className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-xs" required />
            </div>
            <textarea name="message" placeholder="Descreva com detalhes o que aconteceu ou sua dúvida..." className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-xs h-24" required />
            <button className="w-full bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold py-3 rounded-xl text-xs transition">
              Enviar Mensagem para o Admin
            </button>
          </form>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl flex items-start gap-3">
          <Mail className="w-5 h-5 text-[#00e676] mt-0.5" />
          <div>
            <p className="text-xs font-bold">Contato Comercial</p>
            <p className="text-[10px] text-neutral-400 mt-1">E-mails oficiais dos proprietários:</p>
            <code className="block text-[10px] text-[#00e676] mt-1">calvoeditofc@gmail.com</code>
            <code className="block text-[10px] text-[#00e676] mt-0.5">mafiosodashopping@gmail.com</code>
          </div>
        </div>

      </div>
    </div>
  );
}
