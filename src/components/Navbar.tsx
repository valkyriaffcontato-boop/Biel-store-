"use client";
import { useState } from "react";
import { Menu, X, ShoppingCart, MessageSquare, User, LogOut, BadgeCheck, ShieldAlert, ShoppingBag, LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  user: { id: string; name: string; email: string; role: string; isVerified: boolean } | null;
  onLogout: () => Promise<void>;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#08080c] border-b border-neutral-900 px-4 py-3.5 backdrop-blur-md bg-opacity-95">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="text-neutral-400 hover:text-white p-1">
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex flex-col">
              <span className="text-sm font-black tracking-widest text-emerald-400">BIEL STORE</span>
              <span className="text-[8px] font-bold text-neutral-500">MARKETPLACE GAMER</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-neutral-400 hover:text-white transition"><ShoppingCart className="w-4.5 h-4.5" /></Link>
            <Link href="/chat" className="text-neutral-400 hover:text-white transition"><MessageSquare className="w-4.5 h-4.5" /></Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:border-emerald-500/50 transition">
                  <User className="w-4 h-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3.5 w-60 bg-[#0d0e15] border border-neutral-800 rounded-2xl p-4 shadow-2xl space-y-4">
                    <div className="space-y-1">
                      <p className="font-extrabold text-xs flex items-center gap-1">{user.name} {user.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{user.email}</p>
                    </div>
                    <div className="h-[1px] bg-neutral-900" />
                    <ul className="space-y-2.5 text-xs text-neutral-300">
                      <li><Link href="/dashboard/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 hover:text-white"><User className="w-4 h-4 text-neutral-500" /> Meu Perfil</Link></li>
                      <li><Link href="/chat" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 hover:text-white"><MessageSquare className="w-4 h-4 text-neutral-500" /> Conversas</Link></li>
                      {(user.role === "SELLER" || user.role === "ADMIN") && (
                        <li><Link href="/dashboard/seller/listings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 hover:text-white"><ShoppingBag className="w-4 h-4 text-neutral-500" /> Painel Vendedor</Link></li>
                      )}
                      {user.role === "ADMIN" && (
                        <li><Link href="/dashboard/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 hover:text-white"><LayoutDashboard className="w-4 h-4 text-neutral-500" /> Painel Admin</Link></li>
                      )}
                    </ul>
                    <div className="h-[1px] bg-neutral-900" />
                    <button onClick={() => { setIsDropdownOpen(false); onLogout(); }} className="w-full flex items-center gap-2 text-xs text-rose-400"><LogOut className="w-4 h-4 text-rose-500" /> Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <Link href="/login" className="text-neutral-300 px-2 py-1.5">Entrar</Link>
                <Link href="/register" className="bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold px-3 py-1.5 rounded-lg">Criar conta</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MENU LATERAL DRAWER COM Z-INDEX MÁXIMO */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[9999] flex">
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative w-64 max-w-xs bg-[#0b0c13] border-r border-neutral-900 p-6 flex flex-col justify-between h-full shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-widest text-emerald-400 leading-none">BIEL STORE</span>
                  <span className="text-[8px] font-bold text-neutral-500">MARKETPLACE GAMER</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <nav className="space-y-4 pt-4">
                <div className="space-y-2.5">
                  <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold">Navegação</p>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    <li><Link href="/" onClick={() => setIsSidebarOpen(false)} className="block py-1.5 hover:text-emerald-400">Início</Link></li>
                    <li><Link href="/dashboard/profile" onClick={() => setIsSidebarOpen(false)} className="block py-1.5 hover:text-emerald-400">Quero vender</Link></li>
                  </ul>
                </div>
                <div className="h-[1px] bg-neutral-900" />
                <div className="space-y-2.5">
                  <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold">Suporte</p>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    <li className="text-[10px] text-neutral-500">BielStoreSuporte@gmail.com</li>
                    <li><Link href="/support" onClick={() => setIsSidebarOpen(false)} className="block py-1.5 hover:text-emerald-400">Central de ajuda</Link></li>
                    <li><Link href="/support" onClick={() => setIsSidebarOpen(false)} className="block py-1.5 hover:text-rose-400 flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-rose-500" /> Denúncias</Link></li>
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
