'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  const [requestType, setRequestType] = useState('acesso');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCpf, setUserCpf] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setUserName('');
      setUserEmail('');
      setUserCpf('');
      alert('Solicitação de direitos do titular LGPD registrada com sucesso. Prazo legal de resposta: até 15 dias.');
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Aviso de Minuta Jurídica */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        <strong className="block text-sm mb-1">Nota de Conformidade LGPD (Lei 13.709/2018)</strong>
        Este documento é uma minuta de Política de Privacidade e Proteção de Dados para fins demonstrativos e deve ser adaptado e revisado pelo Encarregado de Proteção de Dados (DPO) antes da operação comercial.
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Política de Privacidade e Proteção de Dados
        </h1>
        <p className="text-xs text-slate-500">
          Em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Dados Pessoais Coletados</h2>
          <p>
            Coletamos apenas os dados estritamente necessários para viabilizar as transações no marketplace: nome completo, e-mail, telefone para contato pós-acordo, CPF/CNPJ para emissão de comprovantes de pagamento e endereço aproximado (cidade, estado e bairro) para fins de geolocalização dos materiais.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Não Exposição de Endereços Residenciais</h2>
          <p>
            Nenhum endereço residencial ou canteiro privado tem seu número e complemento expostos publicamente nas páginas de busca da plataforma. A liberação do endereço detalhado para carregamento ocorre exclusivamente após a confirmação do pagamento e geração do código de retirada.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Segurança Financeira e Dados de Pagamento</h2>
          <p>
            A ObraCircular não armazena dados completos de cartão de crédito. Todas as transações com cartão e Pix são processadas por meio de instituições autorizadas pelo Banco Central do Brasil com criptografia ponta a ponta e certificação PCI-DSS.
          </p>
        </section>
      </div>

      {/* Formulário Interativo de Direitos do Titular de Dados (LGPD Art. 18) */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 dark:border-emerald-900 dark:bg-emerald-950/20 space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">
            <UserCheck className="h-4 w-4" />
            Canal do Titular de Dados
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            Exercício de Direitos LGPD (Art. 18)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Você tem o direito de solicitar a qualquer momento a confirmação de tratamento, acesso, correção ou exclusão definitiva de seus dados.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tipo de Solicitação *
            </label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="acesso" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Acessar todos os meus dados armazenados</option>
              <option value="correcao" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Corrigir dados cadastrais incorretos</option>
              <option value="exclusao" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Excluir permanentemente minha conta e dados (Direito ao Esquecimento)</option>
              <option value="portabilidade" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Portabilidade de dados para outro serviço</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                E-mail Cadastrado *
              </label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
          >
            {isSent ? 'Processando...' : 'Enviar Solicitação Formal ao DPO'}
          </button>
        </form>
      </div>
    </div>
  );
}
