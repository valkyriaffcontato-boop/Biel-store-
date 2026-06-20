"use client";

import { useState } from "react";
import { 
  Menu, X, ShoppingCart, MessageSquare, User, LogOut, 
  BadgeCheck, ShieldAlert, Gamepad2, LayoutDashboard, ShoppingBag
} from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
  } | null;
  onLogout: () => Promise<void>;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {/* BARRA SUPERIOR (HEADER) */}
      <header className="sticky top-0 z-50 bg-[#08080c] border-b border-neutral-900 px-4 py-3.5 backdrop-blur-md bg-opacity-95">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* LADO ESQUERDO: HAMBÚRGUER E LOGO */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-neutral-400 hover:text-white transition p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <Link href="/" className="flex flex-col select-none">
              <span className="text-sm font-black tracking-widest text-emerald-400 leading-none">BIEL STORE</span>
              <span className="text-[8px] font-bold text-neutral-500 tracking-wider">MARKETPLACE GAMER</span>
            </Link>
          </div>

          {/* LADO DIREITO: ÍCONES E PERFIL */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-neutral-400 hover:text-white transition relative">
              <ShoppingCart className="w-4.5 h-4.5" />
            </Link>
            
            <Link href="/chat" className="text-neutral-400 hover:text-white transition relative">
              <MessageSquare className="w-4.5 h-4.5" />
            </Link>

            {user ? (
              /* USUÁRIO AUTENTICADO: AVATAR DROPDOWN */
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:border-emerald-500/50 transition"
                >
                  <User className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3.5 w-60 bg-[#0d0e15] border border-neutral-850 rounded-2xl p-4 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Informações básicas do usuário no menu */}
                    <div className="space-y-1">
                      <p className="font-extrabold text-xs text-neutral-100 flex items-center gap-1">
                        {user.name}
                        {user.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate">{user.email}</p>
                      
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {user.isVerified && (
                          <span className="text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full font-bold">
                            Verificado
                          </span>
                        )}
                        {user.role === "SELLER" && (
                          <span className="text-[8px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full font-bold">
                            Vendedor
                          </span>
                        )}
                        {user.role === "ADMIN" && (
                          <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="h-[1px] bg-neutral-900" />

                    {/* Links do Menu */}
                    <ul className="space-y-2.5 text-xs text-neutral-300">
                      <li>
                        <Link href="/dashboard/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 hover:text-white transition">
                          <User className="w-4 h-4 text-neutral-500" /> Meu Perfil
                        </Link>
                      </li>
                      <li>
                        <Link href="/chat" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 hover:text-white transition">
                          <MessageSquare className="w-4 h-4 text-neutral-500" /> Conversas
                        </Link>
                      </li>
                      <li>
                        <Link href="/cart" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 hover:text-white transition">
                          <ShoppingCart className="w-4 h-4 text-neutral-500" /> Carrinho
                        </Link>
                      </li>
                      {(user.role === "SELLER" || user.role === "ADMIN") && (
                        <li>
                          <Link href="/dashboard/seller/create" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 hover:text-white transition">
                            <ShoppingBag className="w-4 h-4 text-neutral-500" /> Painel Vendedor
                          </Link>
                        </li>
                      )}
                      {user.role === "ADMIN" && (
                        <li>
                          <Link href="/dashboard/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 hover:text-white transition">
                            <LayoutDashboard className="w-4 h-4 text-neutral-500" /> Painel Admin
                          </Link>
                        </li>
                      )}
                    </ul>

                    <div className="h-[1px] bg-neutral-900" />

                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* VISITANTE: BOTÕES DE LOGIN / CADASTRO */
              <div className="flex items-center gap-2 text-xs">
                <Link href="/login" className="hover:text-white text-neutral-300 px-3 py-1.5 transition">
                  Entrar
                </Link>
                <Link href="/register" className="bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold px-3.5 py-1.5 rounded-lg transition active:scale-95 shadow-md">
                  Criar conta
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* MENU LATERAL (DRAWER SIDEBAR) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fundo preto semitransparente que fecha ao clicar fora */}
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* O painel lateral propriamente dito */}
          <div className="relative w-64 max-w-xs bg-[#0b0c13] border-r border-neutral-900 p-6 flex flex-col justify-between h-full shadow-2xl animate-in slide-in-from-left duration-250">
            <div className="space-y-6">
              
              {/* Cabeçalho da Sidebar */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-widest text-emerald-400 leading-none">BIEL STORE</span>
                  <span className="text-[8px] font-bold text-neutral-500">MARKETPLACE GAMER</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-neutral-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links de Navegação da Sidebar */}
              <nav className="space-y-4 pt-4">
                <div className="space-y-2.5">
                  <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold">Navegação</p>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    <li>
                      <Link href="/" onClick={() => setIsSidebarOpen(false)} className="block py-1.5 hover:text-emerald-400 transition">Início</Link>
                    </li>
                    <li>
                      <Link href="#vitrine" onClick={() => setIsSidebarOpen(false)} className="block py-1.5 hover:text-emerald-400 transition">Buscar anúncios</Link>
                    </li>
                    {user && (
                      <li>
                        <Link href="/dashboard/profile" onClick={() => setIsSidebarOpen(false)} className="block py-1.5 hover:text-emerald-400 transition">Meu perfil</Link>
                      </li>
                    )}
                    <li>
                      <Link href="/dashboard/profile" onClick={() => setIsSidebarOpen(false)} className="block py-1.5 hover:text-emerald-400 transition">Quero vender</Link>
                    </li>
                  </ul>
                </div>

                <div className="h-[1px] bg-neutral-900" />

                <div className="space-y-2.5">
                  <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold">Suporte</p>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    <li className="text-[10px] text-neutral-500">BielStoreSuporte@gmail.com</li>
                    <li>
                      <Link href="/" onClick={() => setIsSidebarOpen(false)} className="block py-1.5 hover:text-emerald-400 transition">Central de ajuda</Link>
                    </li>
                    <li>
                      <Link href="/" onClick={() => setIsSidebarOpen(false)} className="block py-1.5 hover:text-rose-400 transition flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4 text-rose-500" /> Denúncias
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>

            </div>

            <p className="text-[9px] text-neutral-600 text-center">BIEL STORE &copy; 2026</p>
          </div>
        </div>
      )}
    </>
  );
}
