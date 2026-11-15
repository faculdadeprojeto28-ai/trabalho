'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Building2, HardHat, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useMarketplace } from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';

export default function PlansPage() {
  const { settings, currentUser } = useMarketplace();

  const plans = [
    {
      name: 'Plano Grátis',
      description: 'Ideal para proprietários e pequenas reformas residenciais pontuais.',
      price: settings.plans_pricing.free.price,
      period: 'sempre gratuito',
      features: [
        `Até ${settings.plans_pricing.free.max_listings} anúncios simultâneos`,
        'Taxa padrão de 8% apenas ao vender',
        'Chat interno e negociação de propostas',
        'Custódia segura de pagamentos',
        'Suporte padrão por e-mail',
      ],
      isPopular: false,
      cta: 'Começar Grátis',
      tier: 'free',
    },
    {
      name: 'Profissional',
      description: 'Para mestres de obras, empreiteiros e arquitetos com fluxo recorrente.',
      price: settings.plans_pricing.pro.price,
      period: 'por mês',
      features: [
        `Até ${settings.plans_pricing.pro.max_listings} anúncios simultâneos`,
        '1 destaque patrocinado gratuito por mês',
        'Painel com métricas de visualização e conversão',
        'Taxa reduzida sobre vendas concluídas',
        'Selo de Profissional Verificado no perfil',
        'Suporte prioritário via WhatsApp',
      ],
      isPopular: true,
      cta: 'Assinar Plano Pro',
      tier: 'pro',
    },
    {
      name: 'Construtora & Empresa',
      description: 'Para construtoras, incorporadoras, fábricas e lojas de materiais.',
      price: settings.plans_pricing.enterprise.price,
      period: 'por mês',
      features: [
        'Anúncios ilimitados em catálogo',
        'Importação em lote de pontas de estoque (CSV / Excel)',
        'Múltiplos operadores autorizados por canteiro',
        'Emissão de Nota Fiscal integrada',
        'Relatórios ESG de descarte zero e CO2 evitado',
        'Gerente de conta e equipe de apoio logístico dedicada',
      ],
      isPopular: false,
      cta: 'Falar com Consultor B2B',
      tier: 'enterprise',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Soluções Comerciais e B2B
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Planos para Quem Constrói e Vende
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Transforme resíduos em receita. Escolha o plano adequado para o porte da sua construtora ou empreendimento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
              plan.isPopular
                ? 'border-2 border-emerald-500 bg-white shadow-xl dark:border-emerald-600 dark:bg-slate-900'
                : 'border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                Mais Escolhido
              </span>
            )}

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{plan.description}</p>

              <div className="my-6">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-xs text-slate-400 ml-1.5">/{plan.period}</span>
              </div>

              <ul className="space-y-3 text-xs border-t border-slate-100 pt-6 dark:border-slate-800">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/anunciar"
                className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition ${
                  plan.isPopular
                    ? 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700'
                    : 'border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
