'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  PlusCircle,
  Heart,
  MessageSquare,
  Bell,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ShieldAlert,
  Building2,
  HardHat,
  ChevronDown,
  Sparkles,
  LogOut,
  SlidersHorizontal,
  Package,
} from 'lucide-react';
import { useMarketplace } from '@/lib/data-store';
import { CATEGORIES } from '@/lib/categories';

export const Header: React.FC = () => {
  const router = useRouter();
  const { currentUser, switchUser, favorites, conversations } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Verifica tema
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && !selectedCity) return;
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCity) params.set('cidade', selectedCity);
    router.push(`/busca?${params.toString()}`);
  };

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 transition-colors">
      {/* Barra superior de identificação e troca rápida de perfil demonstrativo */}
      <div className="bg-emerald-900 px-4 py-1.5 text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Ambiente de Testes
            </span>
            <span className="hidden sm:inline text-emerald-100">
              Simulador ativo de marketplace de economia circular da construção civil
            </span>
          </div>

          {/* Seletor rápido de papel para demonstração */}
          <div className="flex items-center gap-1.5">
            <span className="hidden md:inline text-emerald-200">Perfil atual:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => switchUser('buyer')}
                className={`rounded px-2 py-0.5 text-xs transition ${
                  currentUser.role === 'buyer'
                    ? 'bg-emerald-600 font-bold text-white shadow-xs'
                    : 'text-emerald-200 hover:bg-emerald-800'
                }`}
                title="Trocar para perfil Comprador"
              >
                👷 Comprador
              </button>
              <button
                onClick={() => switchUser('seller')}
                className={`rounded px-2 py-0.5 text-xs transition ${
                  currentUser.role === 'seller'
                    ? 'bg-emerald-600 font-bold text-white shadow-xs'
                    : 'text-emerald-200 hover:bg-emerald-800'
                }`}
                title="Trocar para perfil Vendedor"
              >
                🔨 Vendedor
              </button>
              <button
                onClick={() => switchUser('company')}
                className={`rounded px-2 py-0.5 text-xs transition ${
                  currentUser.role === 'company'
                    ? 'bg-emerald-600 font-bold text-white shadow-xs'
                    : 'text-emerald-200 hover:bg-emerald-800'
                }`}
                title="Trocar para perfil Construtora"
              >
                🏢 Construtora
              </button>
              <button
                onClick={() => switchUser('admin')}
                className={`rounded px-2 py-0.5 text-xs transition ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-500 font-bold text-slate-950 shadow-xs'
                    : 'text-amber-300 hover:bg-emerald-800'
                }`}
                title="Painel Administrativo Geral"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação principal */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logotipo ObraCircular */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-900/20">
            <HardHat className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Obra<span className="text-emerald-600 dark:text-emerald-400">Circular</span>
              </span>
            </div>
            <p className="hidden text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:block">
              Sua sobra vale. Sua obra economiza.
            </p>
          </div>
        </Link>

        {/* Barra de Pesquisa Central */}
        <form onSubmit={handleSearch} className="relative hidden max-w-xl flex-1 md:flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por porcelanato, vigas, cimento, fios, janelas..."
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pr-12 pl-11 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
            />
            <Search className="absolute top-3 left-4 h-4.5 w-4.5 text-slate-400" />
            <button
              type="submit"
              className="absolute top-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700"
              title="Pesquisar"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Ações da Direita */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão Anunciar Grátis */}
          <Link
            href="/anunciar"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Anunciar Grátis</span>
          </Link>

          {/* Alternar Tema */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Alternar modo claro e escuro"
          >
            {isDark ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Favoritos */}
          <Link
            href="/busca?favoritos=true"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            title="Meus Favoritos"
          >
            <Heart className="h-4.5 w-4.5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Mensagens / Chat */}
          <Link
            href="/mensagens"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            title="Minhas Conversas e Propostas"
          >
            <MessageSquare className="h-4.5 w-4.5" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {totalUnread}
              </span>
            )}
          </Link>

          {/* Menu do Usuário */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pl-2 transition hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                alt={currentUser.full_name}
                className="h-7 w-7 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="hidden lg:inline text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                {currentUser.full_name.split(' ')[0]}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>

            {/* Dropdown do Usuário */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="border-b border-slate-100 p-3 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {currentUser.full_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.email}
                  </p>
                  <span className="mt-1.5 inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Conta: {currentUser.role.toUpperCase()}
                  </span>
                </div>

                <div className="py-1 text-xs">
                  {currentUser.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Painel Administrativo
                    </Link>
                  )}
                  {(currentUser.role === 'seller' || currentUser.role === 'company') && (
                    <Link
                      href="/painel/vendedor"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Dashboard do Vendedor
                    </Link>
                  )}
                  <Link
                    href="/pedidos"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Package className="h-4 w-4" />
                    Meus Pedidos e Compras
                  </Link>
                  <Link
                    href="/mensagens"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat e Negociações
                  </Link>
                  <Link
                    href="/planos"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Building2 className="h-4 w-4" />
                    Planos para Construtoras
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Menu Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300 md:hidden"
            aria-label="Abrir menu de navegação"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Barra de Categorias e Atalhos */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2 dark:border-slate-800/80 dark:bg-slate-900/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs">
          {/* Todas as Categorias Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
            >
              <Menu className="h-3.5 w-3.5" />
              <span>Todas as Categorias</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {/* Menu Dropdown de Categorias */}
            {isCategoryOpen && (
              <div
                className="absolute top-8 left-0 z-50 grid w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                onClick={() => setIsCategoryOpen(false)}
              >
                <div className="mb-2 font-bold text-slate-900 dark:text-white border-b pb-1 dark:border-slate-800">
                  15 Categorias de Materiais
                </div>
                <div className="max-h-96 overflow-y-auto space-y-1 pr-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categorias/${cat.slug}`}
                      className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400 transition"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-[10px] text-slate-400">{cat.count} itens</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Links Rápidos das Categorias Principais no Desktop */}
          <div className="hidden lg:flex items-center gap-5 text-slate-600 dark:text-slate-400">
            <Link href="/categorias/porcelanatos-e-ceramicas" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Porcelanatos
            </Link>
            <Link href="/categorias/cimentos-e-argamassas" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Cimentos & Argamassas
            </Link>
            <Link href="/categorias/madeiras-e-mdf" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Madeiras & MDF
            </Link>
            <Link href="/categorias/tintas-e-acessorios" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Tintas
            </Link>
            <Link href="/categorias/materiais-eletricos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Elétricos
            </Link>
            <Link href="/categorias/materiais-de-demolicao" className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:underline">
              <Sparkles className="h-3 w-3" />
              Demolição & Rústicos
            </Link>
          </div>

          {/* Links institucionais chave */}
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <Link href="/como-funciona" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden sm:inline">
              Como funciona
            </Link>
            <Link href="/planos" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
              Para Construtoras
            </Link>
          </div>
        </div>
      </div>

      {/* Menu Mobile gaveta */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          {/* Campo de Busca no Mobile */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar materiais..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pr-10 pl-10 text-sm dark:border-slate-700 dark:bg-slate-900"
              />
              <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
            </div>
          </form>

          <div className="space-y-2 text-sm font-medium">
            <Link
              href="/anunciar"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 p-2.5 text-white font-semibold justify-center"
            >
              <PlusCircle className="h-4 w-4" />
              Anunciar Material Grátis
            </Link>
            <Link
              href="/busca"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Explorar Todos os Anúncios
            </Link>
            <Link
              href="/como-funciona"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Como Funciona a Plataforma
            </Link>
            <Link
              href="/planos"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Soluções para Construtoras e Lojas
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
