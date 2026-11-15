import React from 'react';
import Link from 'next/link';
import { FileText, ShieldAlert } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Aviso de Minuta Jurídica */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        <div className="flex items-center gap-2 font-bold mb-1">
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          <span>Nota Legal de Ambiente de Demonstração</span>
        </div>
        Este documento constitui uma minuta referencial de Termos de Uso para a plataforma ObraCircular e está sujeito à revisão e validação jurídica definitiva antes da publicação e operação em ambiente de produção com transações bancárias reais.
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Termos e Condições Gerais de Uso
        </h1>
        <p className="text-xs text-slate-500">
          Última atualização: 14 de Novembro de 2026 • ObraCircular Intermediação de Negócios S.A.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Objeto e Natureza dos Serviços</h2>
          <p>
            A ObraCircular é uma plataforma de tecnologia que atua como intermediadora digital de negócios, conectando vendedores (pessoas físicas, arquitetos, empreiteiros e construtoras) a compradores interessados na aquisição de materiais excedentes, pontas de estoque, sobras de obras e materiais reutilizáveis da construção civil.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Cadastro e Responsabilidade das Partes</h2>
          <p>
            O usuário declara que todas as informações prestadas são verídicas. Os vendedores respondem pela procedência lícita dos materiais anunciados, garantindo que não são frutos de furtos, desvios ou infrações ambientais. É expressamente vedado anunciar materiais perigosos, tóxicos ou que violem normas técnicas da ABNT.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Sistema de Custódia e Pagamentos</h2>
          <p>
            Para garantir a integridade das transações, os pagamentos realizados por compradores permanecem em custódia temporária no intermediador de pagamentos parceiro. A liberação do saldo ao vendedor ocorre após a validação física no momento da retirada, mediante conferência do material e apresentação do código de confirmação.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Comissões e Remuneração da Plataforma</h2>
          <p>
            A publicação básica de anúncios é gratuita. A ObraCircular cobrará uma taxa de intermediação operacional (comissão percentual) previamente informada sobre o valor das transações concluídas com sucesso através da plataforma.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Retirada, Transporte e Frete</h2>
          <p>
            Salvo estipulação expressa em contrário no anúncio, o comprador é o responsável pela conferência, carregamento e transporte dos materiais a partir do local indicado pelo vendedor.
          </p>
        </section>
      </div>
    </div>
  );
}
