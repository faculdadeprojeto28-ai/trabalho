'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Truck,
  Leaf,
  DollarSign,
  PackageCheck,
  Star,
  MapPin,
  HardHat,
  RefreshCw,
  Boxes,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { useMarketplace } from '@/lib/data-store';
import { ProductCard } from '@/components/ui/ProductCard';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { MOCK_REVIEWS } from '@/lib/mock-data';

export default function HomePage() {
  const router = useRouter();
  const { listings } = useMarketplace();
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtros para seções da Homepage
  const featuredListings = listings.filter((l) => l.is_featured).slice(0, 4);
  const recentListings = [...listings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4);
  const stockClearance = listings.filter((l) => (l.original_price && l.original_price > l.current_price * 1.3) || l.unit_measure === 'lote').slice(0, 4);

  const nearbyListings = selectedCity === 'Todas'
    ? listings.slice(0, 4)
    : listings.filter((l) => l.city.toLowerCase().includes(selectedCity.toLowerCase())).slice(0, 4);

  const cities = ['Todas', 'São Paulo', 'Curitiba', 'Campinas', 'Belo Horizonte', 'Rio de Janeiro'];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/busca');
    }
  };

  const faqs = [
    {
      q: 'Como funciona a segurança e o pagamento dos materiais na ObraCircular?',
      a: 'Nosso sistema utiliza custódia protegida de pagamento. Quando o comprador paga via Pix ou Cartão, o valor fica retido com segurança na plataforma. O vendedor só recebe o repasse após a conferência e confirmação de retirada do material pelo comprador via código de liberação seguro.',
    },
    {
      q: 'Quem é responsável pela retirada ou frete dos materiais?',
      a: 'Cada anúncio informa claramente se o produto está disponível para retirada no canteiro/galpão ou se o vendedor oferece frete. Compradores e vendedores também podem combinar transportadora parceira diretamente pelo chat interno da plataforma.',
    },
    {
      q: 'Construtoras podem emitir nota fiscal e vender lotes inteiros?',
      a: 'Sim! Temos uma modalidade B2B dedicada a construtoras, incorporadoras e lojas de material. As empresas podem cadastrar CNPJ, anunciar paletes ou lotes inteiros de sobras e emitir nota fiscal de venda ou remessa de mercadoria.',
    },
    {
      q: 'Qual é o custo para anunciar na plataforma?',
      a: 'O cadastro e a publicação de anúncios são 100% gratuitos para usuários individuais. A ObraCircular cobra apenas uma taxa de serviço administrativa de 8% sobre transações concluídas com sucesso. Para construtoras com alto volume, oferecemos assinaturas com ferramentas avançadas.',
    },
    {
      q: 'O que acontece se o material retirado for diferente do anunciado?',
      a: 'Se o produto não conferir com a descrição no momento da conferência física, o comprador pode recusar o recebimento no local e abrir uma disputa imediata pelo painel. O valor retido é integralmente reembolsado sem complicações.',
    },
  ];

  return (
    <div className="flex flex-col gap-14 sm:gap-20 pb-16">
      {/* 1. HERO BANNER PRINCIPAL */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 py-16 sm:py-24 text-white">
        {/* Padrão geométrico sutil de fundo */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texto e Chamadas */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                <Leaf className="h-4 w-4 text-emerald-400" />
                <span>Economia Circular na Construção Civil</span>
                <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px]">Brasil</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Materiais que sobraram.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                  Oportunidades que começaram.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                O marketplace nacional que conecta construtoras, empreiteiros e reformadores. Venda sobras de canteiro paradas e compre materiais de primeira linha com até <strong className="text-white underline decoration-emerald-400 decoration-2">60% de economia real</strong>.
              </p>

              {/* Formulário de Busca Rápida na Hero */}
              <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="flex flex-col sm:flex-row gap-2 rounded-2xl bg-white p-2 shadow-2xl">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 text-slate-800">
                    <Search className="h-5 w-5 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ex: porcelanato portobello, tijolo maciço, viga peroba..."
                      className="w-full text-sm font-medium focus:outline-hidden placeholder-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Buscar</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>

              {/* Botões de Ação Direta */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/busca"
                  className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 flex items-center gap-2"
                >
                  <Boxes className="h-4 w-4" />
                  Explorar materiais
                </Link>
                <Link
                  href="/anunciar"
                  className="rounded-xl border border-emerald-400/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4 text-emerald-300" />
                  Vender meus materiais
                </Link>
              </div>

              {/* Métricas de Impacto em Tempo Real */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/80 max-w-xl mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl font-black text-emerald-300">1.840 t</div>
                  <div className="text-xs text-emerald-200/80">Entulho evitado</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-300">R$ 5.4M</div>
                  <div className="text-xs text-emerald-200/80">Economizados</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-300">100%</div>
                  <div className="text-xs text-emerald-200/80">Pagamento Seguro</div>
                </div>
              </div>
            </div>

            {/* Imagem Profissional em Destaque */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="overflow-hidden rounded-3xl border border-emerald-500/20 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1000&q=80"
                    alt="Materiais de construção e canteiro de obras sustentável"
                    className="h-[420px] w-full object-cover"
                  />
                </div>

                {/* Card Flutuante de Oferta Verificada */}
                <div className="absolute -bottom-6 -left-6 rounded-2xl border border-slate-200/50 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 max-w-xs text-slate-800 dark:text-slate-100 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Sobra Certificada</p>
                      <p className="text-sm font-bold">Porcelanatos & Revestimentos</p>
                      <p className="text-xs text-emerald-600 font-semibold dark:text-emerald-400">Até -55% de desconto</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIAS DE MATERIAIS (15 CATEGORIAS COMPLETAS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Catálogo Especializado
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              15 Categorias de Materiais
            </h2>
          </div>
          <Link
            href="/busca"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <span>Ver todos</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600"
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/60 dark:text-emerald-300 dark:group-hover:bg-emerald-600">
                <CategoryIcon name={category.icon} className="h-7 w-7" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400">
                {category.name}
              </h3>
              <span className="mt-1 text-[11px] font-medium text-slate-400">
                {category.count} anúncios
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. OFERTAS EM DESTAQUE (PATROCINADOS / TOP DISCOUNTS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              Seleção Premium
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Ofertas em Destaque
            </h2>
          </div>
          <Link
            href="/busca?destaque=true"
            className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <span>Ver mais ofertas</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* 4. MATERIAIS PRÓXIMOS AO COMPRADOR (FILTRO GEOGRÁFICO INTERATIVO) */}
      <section className="bg-slate-100/70 py-12 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <MapPin className="h-3.5 w-3.5" />
                Economize no Frete e Retire Perto
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Materiais Próximos de Você
              </h2>
            </div>

            {/* Chips de Cidades */}
            <div className="flex flex-wrap items-center gap-1.5">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    selectedCity === city
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyListings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. ANÚNCIOS ADICIONADOS RECENTEMENTE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Chegaram Hoje
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Anúncios Adicionados Recentemente
            </h2>
          </div>
          <Link
            href="/busca?ordenar=recentes"
            className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <span>Ver todos recentes</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentListings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* 6. OPORTUNIDADES DE PONTA DE ESTOQUE & LOTES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-tr from-emerald-950 via-emerald-900 to-teal-900 p-8 sm:p-12 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
                <TrendingDown className="h-4 w-4" />
                Descontos Agressivos de Liquidação
              </div>
              <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">
                Ponta de Estoque & Lotes Fechados
              </h2>
              <p className="mt-1 text-sm text-emerald-100 max-w-xl">
                Oportunidades em grandes volumes para quem está construindo do zero ou reformando múltiplos ambientes.
              </p>
            </div>
            <Link
              href="/busca?tipo=lote"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50 shadow-md shrink-0"
            >
              Ver todos os lotes
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-slate-900">
            {stockClearance.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMO FUNCIONA A PLATAFORMA (4 PASSOS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Simples, Seguro e Sustentável
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Como Funciona a ObraCircular
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Nossa plataforma cuida de ponta a ponta: do anúncio com inteligência artificial até a custódia do pagamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 text-xl font-black mb-4 dark:bg-emerald-950 dark:text-emerald-300">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Anuncie em Minutos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Fotografe as sobras da sua obra, use nosso assistente para preencher os dados técnicos e publique gratuitamente.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 text-xl font-black mb-4 dark:bg-emerald-950 dark:text-emerald-300">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Negocie pelo Chat
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Converse com compradores interessados, tire dúvidas sobre retirada e receba propostas de preço formais com 1 clique.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 text-xl font-black mb-4 dark:bg-emerald-950 dark:text-emerald-300">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Pagamento em Custódia
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              O comprador paga com Pix ou Cartão em até 12x. O dinheiro fica seguro e protegido na plataforma ObraCircular.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 text-xl font-black mb-4 dark:bg-emerald-950 dark:text-emerald-300">
              4
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Retirada & Liberação
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              O comprador confere o material no local e informa o código de confirmação. O valor é liberado na hora para o vendedor!
            </p>
          </div>
        </div>
      </section>

      {/* 8. SEÇÃO DEDICADA A CONSTRUTORAS & LOJAS (B2B) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-8 sm:p-12 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                <Building2 className="h-4 w-4" />
                Soluções Corporativas
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                Sua construtora com descarte zero e faturamento extra.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Mais de 15% do material comprado em grandes obras acaba como resíduo ou fica esquecido em depósitos. Com a ObraCircular, você cadastra paletes inteiros em lote, conta com múltiplos operadores autorizados e gera relatórios ambientais ESG.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Emissão de Nota Fiscal de Venda de Sobras</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Cadastro e Desova em Lote (CSV / API)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Selo ESG de Economia Circular Certificada</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Gerente de Conta e Suporte Prioritário</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/planos"
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 shadow-md"
                >
                  Conhecer Planos Empresariais
                </Link>
                <Link
                  href="/como-funciona#esg"
                  className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                >
                  Saiba mais sobre ESG
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500">Exemplo de Construtora Parceira</p>
                    <p className="font-bold text-slate-900 dark:text-white">Nova Era Engenharia S/A</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Plano Enterprise
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Sobras recirculadas este mês:</span>
                    <strong className="text-slate-900 dark:text-white">42 toneladas</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Capital recuperado no caixa:</span>
                    <strong className="text-emerald-600 font-bold dark:text-emerald-400">R$ 148.200,00</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Avaliação média dos compradores:</span>
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      4.95 / 5.0
                    </strong>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-900">
                  &quot;Antes pagávamos para alugar caçambas e descartar pontas de estoque perfeitamente utilizáveis. Hoje geramos receita e ajudamos pequenas obras.&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. DEPOIMENTOS DE USUÁRIOS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Casos Verificados
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Depoimentos de Quem Usa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  &quot;{review.comment}&quot;
                </p>
                <div className="mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Item: {review.listing_title}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <img
                  src={review.buyer_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={review.buyer_name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{review.buyer_name}</h4>
                  <p className="text-[10px] text-slate-400">Comprador Verificado</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. PERGUNTAS FREQUENTES (FAQ ACCORDION) */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Tire Suas Dúvidas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
