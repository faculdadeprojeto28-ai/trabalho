import React from 'react';
import Link from 'next/link';
import { Leaf, RefreshCw, ShieldCheck, DollarSign, Building2, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Manual da Economia Circular
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          Como Funciona a ObraCircular
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          O marketplace que revoluciona o setor da construção civil conectando pontas de estoque, resíduos nobres e quem deseja construir gastando menos.
        </p>
      </div>

      {/* Grid Duplo: Para Quem Compra vs Para Quem Vende */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lado do Comprador */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <DollarSign className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Para Quem Compra</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Economize de 30% a 60% em pisos, porcelanatos, tintas, madeiras nobres e cimento de primeira linha com procedência comprovada.
          </p>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Busca por proximidade no seu bairro ou cidade</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Chat direto para tirar dúvidas de metragem e estado</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Pagamento em Pix ou até 12x no cartão com custódia segura</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Garantia de conferência física antes de liberar o dinheiro</span>
            </li>
          </ul>
        </div>

        {/* Lado do Vendedor */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <RefreshCw className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Para Quem Vende</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Desocupe espaço no canteiro, evite custos de caçambas de descarte e recupere o investimento parado no depósito.
          </p>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Anúncio 100% gratuito com auxílio de Inteligência Artificial</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Receba propostas formais e responda com 1 clique</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Venda lotes inteiros para construtoras e empreiteiros</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Repasse garantido na conta após validação do código</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Seção ESG & Sustentabilidade */}
      <div id="esg" className="rounded-3xl bg-gradient-to-tr from-emerald-950 via-emerald-900 to-teal-900 p-8 sm:p-12 text-white space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-300">
          <Leaf className="h-4 w-4" />
          Impacto Ambiental e Certificação ESG
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white max-w-xl">
          A construção civil gera mais de 50% dos resíduos sólidos urbanos do Brasil.
        </h2>

        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl">
          Grande parte desse volume não é entulho degradado, mas sobras intactas de reformas, trocas de especificação e excesso de compra. A ObraCircular cria o ciclo virtuoso de recirculação, emitindo relatórios de CO2 evitado e descarte zero para construtoras parceiras.
        </p>

        <div className="pt-4">
          <Link
            href="/planos"
            className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-emerald-950 shadow-md hover:bg-emerald-50 transition"
          >
            Conhecer Planos Corporativos com Selo ESG
          </Link>
        </div>
      </div>
    </div>
  );
}
