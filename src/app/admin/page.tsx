'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Settings,
  Download,
  CheckCircle2,
  XCircle,
  FileText,
  Sliders,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useMarketplace } from '@/lib/data-store';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { CATEGORIES } from '@/lib/categories';
import { MOCK_USERS } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const {
    currentUser,
    switchUser,
    listings,
    orders,
    settings,
    updateSettings,
    updateListing,
    deleteListing,
  } = useMarketplace();

  // Estados locais do painel de administração
  const [activeAdminTab, setActiveAdminTab] = useState<'visao_geral' | 'anuncios' | 'pedidos' | 'denuncias' | 'configuracoes'>('visao_geral');
  const [commissionRate, setCommissionRate] = useState(settings.default_commission_percentage);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Verificação de permissão de administrador
  const isAdmin = currentUser.role === 'admin';

  // Cálculos consolidados da plataforma
  const totalGMV = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalPlatformCommissions = orders.reduce((acc, o) => acc + o.platform_fee_amount, 0);
  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.status === 'ativo').length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ default_commission_percentage: Number(commissionRate) });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportCSV = (type: 'anuncios' | 'pedidos') => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'anuncios') {
      csvContent += 'ID,Titulo,Categoria,Preco,Quantidade,Unidade,Cidade,Estado,Status\n';
      listings.forEach((l) => {
        csvContent += `"${l.id}","${l.title.replace(/"/g, '""')}","${l.category_name}",${l.current_price},${l.quantity},"${l.unit_measure}","${l.city}","${l.state}","${l.status}"\n`;
      });
    } else {
      csvContent += 'ID,Codigo,Comprador,Vendedor,ValorTotal,TaxaComissao,Metodo,Status\n';
      orders.forEach((o) => {
        csvContent += `"${o.id}","${o.order_code}","${o.buyer.full_name}","${o.seller.full_name}",${o.total_amount},${o.platform_fee_amount},"${o.payment_method}","${o.status}"\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `obracircular_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Acesso Restrito ao Administrador
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Você está conectado como <strong className="text-slate-800 dark:text-slate-200">{currentUser.full_name} ({currentUser.role})</strong>.
          Para gerenciar o marketplace, alterne para a conta de administrador de testes.
        </p>
        <div className="pt-2">
          <button
            onClick={() => switchUser('admin')}
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400"
          >
            🛡️ Acessar como Administrador (1 Clique)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Cabeçalho do Painel Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Painel Administrativo Geral
            </h1>
            <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-black text-slate-950">
              GOVERNANÇA & SEGURANÇA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão operacional, regras financeiras, auditoria e moderação de conteúdo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV('anuncios')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Anúncios (CSV)</span>
          </button>

          <button
            onClick={() => handleExportCSV('pedidos')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Transações (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 Cards Principais de Indicadores Operacionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Volume Total Transacionado (GMV)</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(totalGMV)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">{orders.length} pedidos processados</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Receita Líquida do Marketplace</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalPlatformCommissions)}
          </div>
          <span className="text-[10px] text-slate-400">Alíquota atual: {settings.default_commission_percentage}%</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Anúncios no Ar</span>
            <Package className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {activeListings} / {totalListings}
          </div>
          <span className="text-[10px] text-slate-400">em 15 categorias</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Usuários & Construtoras</span>
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {Object.keys(MOCK_USERS).length + 24}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% verificados</span>
        </div>
      </div>

      {/* Abas Administrativas */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveAdminTab('visao_geral')}
          className={`pb-3 transition ${
            activeAdminTab === 'visao_geral'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          Visão Geral & Usuários
        </button>
        <button
          onClick={() => setActiveAdminTab('anuncios')}
          className={`pb-3 transition ${
            activeAdminTab === 'anuncios'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          Moderação de Anúncios ({listings.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('pedidos')}
          className={`pb-3 transition ${
            activeAdminTab === 'pedidos'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          Transações & Custódia ({orders.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('configuracoes')}
          className={`pb-3 transition ${
            activeAdminTab === 'configuracoes'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          Taxas & Configurações
        </button>
      </div>

      {/* CONTEÚDO DAS ABAS */}

      {/* ABA: MODERAÇÃO DE ANÚNCIOS */}
      {activeAdminTab === 'anuncios' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="p-4">Material</th>
                  <th className="p-4">Vendedor</th>
                  <th className="p-4">Preço Unitário</th>
                  <th className="p-4">Status Atual</th>
                  <th className="p-4 text-right">Ação Moderadora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.category_name} • {item.city}/{item.state}
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      {item.seller.full_name}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(item.current_price)}
                    </td>
                    <td className="p-4">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'ativo' ? (
                          <button
                            onClick={() => updateListing(item.id, { status: 'pausado' })}
                            className="rounded-lg border border-amber-300 px-2.5 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-50"
                          >
                            Suspender
                          </button>
                        ) : (
                          <button
                            onClick={() => updateListing(item.id, { status: 'ativo' })}
                            className="rounded-lg border border-emerald-300 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50"
                          >
                            Aprovar
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Remover definitivamente este anúncio?')) {
                              deleteListing(item.id);
                            }
                          }}
                          className="rounded-lg border border-red-200 p-1 text-red-600 hover:bg-red-50"
                          title="Remover"
                        >
                          <XCircle className="h-4 w-4" />
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

      {/* ABA: CONFIGURAÇÕES E TAXAS */}
      {activeAdminTab === 'configuracoes' && (
        <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Parâmetros Comerciais e Monetização
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Defina a alíquota de comissão sobre vendas e valores de patrocínio.
            </p>
          </div>

          {saveSuccess && (
            <div className="rounded-xl bg-emerald-100 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Configurações salvas e aplicadas em toda a plataforma!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Comissão Padrão do Marketplace sobre Vendas Concluídas (%)
              </label>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="30"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="absolute right-3 top-2.5 text-sm font-bold text-slate-400">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Valor inicial recomendado: 8.0%. Pode ser ajustado a qualquer momento.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABA: VISÃO GERAL & USUÁRIOS */}
      {activeAdminTab === 'visao_geral' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Contas de Usuários e Construtoras em Destaque
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.values(MOCK_USERS).map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{user.full_name}</p>
                      <p className="text-[10px] text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                      {user.role}
                    </span>
                    <button
                      onClick={() => switchUser(user.role)}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Alternar Sessão
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA: PEDIDOS E TRANSAÇÕES */}
      {activeAdminTab === 'pedidos' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="p-4">Código</th>
                  <th className="p-4">Material</th>
                  <th className="p-4">Comprador</th>
                  <th className="p-4">Valor Total</th>
                  <th className="p-4">Comissão ObraCircular</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="p-4 font-mono font-bold text-emerald-600">{ord.order_code}</td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{ord.listing.title}</td>
                    <td className="p-4 text-slate-500">{ord.buyer.full_name}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{formatCurrency(ord.total_amount)}</td>
                    <td className="p-4 text-emerald-600 font-bold">{formatCurrency(ord.platform_fee_amount)}</td>
                    <td className="p-4">
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
