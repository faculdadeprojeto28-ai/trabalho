'use client';

import React from 'react';
import Link from 'next/link';
import { HardHat, ShieldCheck, Leaf, RefreshCw, FileText, Lock, Mail, Phone, MapPin } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800 dark:bg-black">
      {/* Banner de Sustentabilidade e Impacto Circular */}
      <div className="border-b border-slate-800 bg-slate-950/70 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Economia Circular na Prática</h4>
              <p className="text-xs text-slate-400">Reduza o entulho da construção civil e evite emissões de CO2.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Monetização de Sobras</h4>
              <p className="text-xs text-slate-400">Transforme materiais parados no canteiro em capital de giro imediato.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Transação Segura & Custódia</h4>
              <p className="text-xs text-slate-400">Pagamento retido até a conferência e liberação na retirada do produto.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal do Rodapé */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Coluna 1: Marca e Missão */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                <HardHat className="h-6 w-6" />
              </div>
              <span className="text-xl font-black text-white">
                Obra<span className="text-emerald-400">Circular</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-emerald-400">
              &quot;Sua sobra vale. Sua obra economiza.&quot;
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              O primeiro ecossistema marketplace do Brasil dedicado exclusivamente à recirculação sustentável de excedentes, pontas de estoque e sobras de obras da construção civil. Conectamos construtoras, empreiteiros e proprietários.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>Atendimento Nacional • Hubs em SP, PR, RJ e MG</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-500" />
                <span>contato@obracircular.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                <span>(11) 4004-9000 • Seg a Sex das 8h às 18h</span>
              </div>
            </div>
          </div>

          {/* Coluna 2: Categorias Populares */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Categorias Populares</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categorias/${cat.slug}`}
                    className="hover:text-emerald-400 transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Mais Categorias */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Outras Linhas</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(7, 15).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categorias/${cat.slug}`}
                    className="hover:text-emerald-400 transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Institucional e Jurídico */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Institucional & LGPD</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/como-funciona" className="hover:text-emerald-400 transition">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/planos" className="hover:text-emerald-400 transition font-medium text-emerald-400">
                  Planos para Construtoras
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-emerald-400 transition">
                  Termos e Condições de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-emerald-400 transition">
                  Política de Privacidade & LGPD
                </Link>
              </li>
              <li>
                <Link href="/reembolso" className="hover:text-emerald-400 transition">
                  Cancelamento e Disputas
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-amber-400 transition">
                  Acesso Administrativo
                </Link>
              </li>
            </ul>

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                Segurança Garantida
              </div>
              Pagamento via Pix e Cartão com custódia segura e conformidade com a LGPD (Lei 13.709/2018).
            </div>
          </div>
        </div>

        {/* Rodapé inferior de copyright e aviso legal de ambiente de testes */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © 2026 ObraCircular Intermediação de Negócios S.A. CNPJ 00.000.000/0001-00. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Mercado Pago Sandbox</span>
            <span>•</span>
            <span>PostgreSQL & Supabase Ready</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% Responsivo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
