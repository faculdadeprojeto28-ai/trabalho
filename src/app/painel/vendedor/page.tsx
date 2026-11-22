'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  Eye,
  DollarSign,
  Clock,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pause,
  Play,
  Trash2,
  PlusCircle,
  MessageSquare,
  Star,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { useMarketplace } from '@/lib/data-store';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { ProposalStatus, Listing } from '@/types';

export default function SellerDashboardPage() {
  const {
    currentUser,
    listings,
    orders,
    proposals,
    updateListing,
    deleteListing,
    updateProposalStatus,
    settings,
  } = useMarketplace();

  // Anúncios do vendedor atual (ou todos se admin/teste)
  const myListings = listings.filter(
    (l) => l.seller_id === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'company'
  );

  // Pedidos vendidos
  const mySales = orders.filter(
    (o) => o.seller_id === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'company'
  );

  // Propostas recebidas
  const myProposals = proposals.filter(
    (p) => p.seller_id === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'company'
  );

  // Métricas calculadas
  const activeListingsCount = myListings.filter((l) => l.status === 'ativo').length;
  const totalViews = myListings.reduce((acc, l) => acc + l.views_count, 0);
  const totalGrossRevenue = mySales.reduce((acc, o) => acc + o.subtotal_amount, 0);
  const totalCommissions = mySales.reduce((acc, o) => acc + o.platform_fee_amount, 0);
  const netBalance = totalGrossRevenue - totalCommissions;

  // Estado das abas
  const [activeTab, setActiveTab] = useState<'anuncios' | 'propostas' | 'vendas' | 'promocoes'>('anuncios');

  const handleToggleStatus = (listing: Listing) => {
    const nextStatus = listing.status === 'ativo' ? 'pausado' : 'ativo';
    updateListing(listing.id, { status: nextStatus });
  };

  const handleFeatureListing = (listingId: string) => {
    updateListing(listingId, {
      is_featured: true,
      featured_until: new Date(Date.now() + 15 * 86400 * 1000).toISOString(),
    });
    alert('Anúncio destacado com sucesso como Patrocinado!');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Painel do Vendedor
            </h1>
            <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {currentUser.full_name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão de anúncios, estoque de sobras, propostas e faturamento com economia circular.
          </p>
        </div>

        <Link
          href="/anunciar"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Novo Anúncio</span>
        </Link>
      </div>

      {/* 6 Cards com Métricas Operacionais e Financeiras */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Anúncios Ativos</span>
            <Package className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {activeListingsCount}
          </div>
          <span className="text-[10px] text-slate-400">{myListings.length} total</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Visualizações</span>
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {totalViews.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">+18% este mês</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Itens Vendidos</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {mySales.length}
          </div>
          <span className="text-[10px] text-slate-400">transações</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Faturamento Bruto</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white truncate">
            {formatCurrency(totalGrossRevenue)}
          </div>
          <span className="text-[10px] text-slate-400">GMV gerado</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Taxa Plataforma ({settings.default_commission_percentage}%)</span>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white truncate">
            {formatCurrency(totalCommissions)}
          </div>
          <span className="text-[10px] text-slate-400">comissão</span>
        </div>

        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/40">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
            <span className="text-[11px] font-bold uppercase">Saldo a Receber</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
          <div className="mt-2 text-xl font-black text-emerald-700 dark:text-emerald-300 truncate">
            {formatCurrency(netBalance)}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Disponível</span>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('anuncios')}
          className={`pb-3 transition ${
            activeTab === 'anuncios'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          Meus Anúncios ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('propostas')}
          className={`pb-3 transition relative ${
            activeTab === 'propostas'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          Propostas Recebidas ({myProposals.length})
          {myProposals.some((p) => p.status === 'pendente') && (
            <span className="ml-1 rounded-full bg-amber-500 px-1.5 py-0.2 text-[9px] text-white">
              Nova
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('vendas')}
          className={`pb-3 transition ${
            activeTab === 'vendas'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          Pedidos & Vendas Concluídas ({mySales.length})
        </button>
      </div>

      {/* ABA 1: TABELA DE GESTÃO DE ANÚNCIOS */}
      {activeTab === 'anuncios' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="p-4">Material</th>
                  <th className="p-4">Estoque</th>
                  <th className="p-4">Preço</th>
                  <th className="p-4">Visualizações</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {myListings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0] || '/products/indisponivel.svg'}
                          alt=""
                          className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.includes('indisponivel.svg')) {
                              target.src = '/products/indisponivel.svg';
                            }
                          }}
                        />
                        <div>
                          <Link
                            href={`/anuncio/${item.id}`}
                            className="font-bold text-slate-900 hover:text-emerald-600 dark:text-white line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <div className="text-[10px] text-slate-400">
                            {item.category_name} • {item.city}, {item.state}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {item.quantity} {item.unit_measure}
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(item.current_price)}
                    </td>

                    <td className="p-4 text-slate-500">
                      {item.views_count} views
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          item.status === 'ativo'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.status === 'pausado'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800'
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.is_featured && (
                        <span className="ml-1.5 rounded-md bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          Patrocinado
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!item.is_featured && (
                          <button
                            onClick={() => handleFeatureListing(item.id)}
                            className="rounded-lg border border-amber-300 p-1.5 text-amber-600 hover:bg-amber-50"
                            title="Destacar como Patrocinado"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleStatus(item)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700"
                          title={item.status === 'ativo' ? 'Pausar anúncio' : 'Reativar anúncio'}
                        >
                          {item.status === 'ativo' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Tem certeza que deseja remover este anúncio?')) {
                              deleteListing(item.id);
                            }
                          }}
                          className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: PROPOSTAS DE PREÇO RECEBIDAS */}
      {activeTab === 'propostas' && (
        <div className="space-y-4">
          {myProposals.length > 0 ? (
            myProposals.map((prop) => (
              <div
                key={prop.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={prop.listing_image}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Proposta de: {prop.buyer_name}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {prop.listing_title}
                    </h4>
                    <div className="mt-1 flex items-baseline gap-2 text-xs">
                      <span className="text-slate-400 line-through">
                        Original: {formatCurrency(prop.original_price)}
                      </span>
                      <strong className="text-emerald-600 font-black text-sm dark:text-emerald-400">
                        Oferta: {formatCurrency(prop.proposed_price)}
                      </strong>
                      <span className="text-slate-500">({prop.quantity} un)</span>
                    </div>
                    {prop.message && (
                      <p className="mt-1 text-xs italic text-slate-600 dark:text-slate-400">
                        &quot;{prop.message}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {prop.status === 'pendente' ? (
                    <>
                      <button
                        onClick={() => updateProposalStatus(prop.id, 'aceita')}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                      >
                        Aceitar Oferta
                      </button>
                      <button
                        onClick={() => updateProposalStatus(prop.id, 'recusada')}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
                      >
                        Recusar
                      </button>
                    </>
                  ) : (
                    <span
                      className={`rounded-lg px-3 py-1 text-xs font-bold uppercase ${
                        prop.status === 'aceita'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      Proposta {prop.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
              Nenhuma proposta recebida no momento.
            </div>
          )}
        </div>
      )}

      {/* ABA 3: PEDIDOS E VENDAS CONCLUÍDAS */}
      {activeTab === 'vendas' && (
        <div className="space-y-4">
          {mySales.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    {order.order_code}
                  </span>
                  <p className="text-xs text-slate-500">Comprador: {order.buyer.full_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                    {order.status}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {order.listing.title} ({order.quantity} {order.listing.unit_measure})
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Modalidade: {order.delivery_method === 'pickup' ? 'Retirada no Local' : 'Entrega por Transportadora'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Código de Liberação do Comprador:</p>
                  <strong className="font-mono text-sm text-emerald-600">{order.pickup_verification_code}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
