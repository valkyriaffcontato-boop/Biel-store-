import { HelpCircle, Mail, ShieldAlert } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-xl mx-auto bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-6">
        <div className="text-center space-y-1">
          <HelpCircle className="w-8 h-8 text-emerald-400 mx-auto" />
          <h1 className="text-lg font-black">Central de Atendimento</h1>
          <p className="text-xs text-neutral-500">Fale com os donos ou reporte uma denúncia</p>
        </div>

        <div className="space-y-4">
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-start gap-3">
            <Mail className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Contato Comercial</p>
              <p className="text-[10px] text-neutral-400 leading-relaxed mt-0.5">Para questões financeiras, saques ou suporte prioritário envie um e-mail para os proprietários:</p>
              <code className="block text-[10px] text-emerald-400 mt-1">calvoeditofc@gmail.com</code>
              <code className="block text-[10px] text-emerald-400 mt-0.5">mafiosodashopping@gmail.com</code>
            </div>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-400">Contestação de Negociação (Disputas)</p>
              <p className="text-[10px] text-neutral-400 leading-relaxed mt-0.5">Caso tenha tido problemas na entrega, abra um chamado no próprio painel do seu pedido.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
