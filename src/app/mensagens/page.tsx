'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  MessageSquare,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Paperclip,
  Check,
  Package,
} from 'lucide-react';
import { useMarketplace } from '@/lib/data-store';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { Proposal } from '@/types';

export default function MessagesPage() {
  const {
    currentUser,
    conversations,
    messages,
    sendMessage,
    updateProposalStatus,
  } = useMarketplace();

  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations.length > 0 ? conversations[0].id : ''
  );
  const [inputText, setInputText] = useState('');

  const activeConversation = conversations.find((c) => c.id === selectedConvId);
  const activeMessages = selectedConvId ? messages[selectedConvId] || [] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId) return;
    sendMessage(selectedConvId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Chat e Negociações
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Comunicação direta, propostas formais de preço e alinhamento de retiradas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden min-h-[600px]">
        {/* Painel da Esquerda: Lista de Conversas */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs uppercase text-slate-400">
            Conversas Ativas ({conversations.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {conversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full text-left p-4 transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <img
                    src={conv.listing_image}
                    alt=""
                    className="h-12 w-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {conv.buyer_id === currentUser.id ? conv.seller_name : conv.buyer_name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatRelativeTime(conv.last_message_at)}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-600 truncate mt-0.5">
                      {conv.listing_title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {conv.last_message}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Painel da Direita: Chat Room e Negociação */}
        <div className="md:col-span-8 flex flex-col">
          {activeConversation ? (
            <>
              {/* Header do Chat */}
              <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConversation.listing_image}
                    alt=""
                    className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <Link
                      href={`/anuncio/${activeConversation.listing_id}`}
                      className="text-xs font-bold text-slate-900 dark:text-white hover:text-emerald-600 line-clamp-1"
                    >
                      {activeConversation.listing_title}
                    </Link>
                    <p className="text-[11px] text-slate-400">
                      Preço anunciado: {formatCurrency(activeConversation.listing_price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/checkout/${activeConversation.listing_id}`}
                    className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                  >
                    Comprar Anúncio
                  </Link>
                </div>
              </div>

              {/* Área de Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Banner de Segurança */}
                <div className="rounded-xl bg-slate-50 p-2.5 text-center text-[11px] text-slate-500 dark:bg-slate-800">
                  <ShieldAlert className="h-3.5 w-3.5 inline mr-1 text-emerald-600" />
                  Mantenha as negociações e pagamentos dentro da ObraCircular para ter a proteção de custódia.
                </div>

                {activeMessages.map((msg) => {
                  const isMe = msg.sender_id === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      {/* Se houver Proposta formal anexada */}
                      {msg.proposal && (
                        <div className="mb-2 max-w-sm rounded-2xl border-2 border-emerald-500/50 bg-emerald-50/70 p-4 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              Proposta de Preço Formal
                            </span>
                            <span className="uppercase text-[10px] rounded bg-emerald-200 px-1.5 py-0.5 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                              {msg.proposal.status}
                            </span>
                          </div>

                          <div className="text-xs space-y-1">
                            <p className="text-slate-600 dark:text-slate-300">
                              Preço proposto:{' '}
                              <strong className="text-base text-slate-900 dark:text-white">
                                {formatCurrency(msg.proposal.proposed_price)}
                              </strong>
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Quantidade: {msg.proposal.quantity} un
                            </p>
                          </div>

                          {/* Ações da Proposta para o Vendedor */}
                          {msg.proposal.status === 'pendente' && (
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => updateProposalStatus(msg.proposal!.id, 'aceita')}
                                className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                              >
                                Aceitar Proposta
                              </button>
                              <button
                                onClick={() => updateProposalStatus(msg.proposal!.id, 'recusada')}
                                className="flex-1 rounded-lg border border-slate-300 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
                              >
                                Recusar
                              </button>
                            </div>
                          )}

                          {msg.proposal.status === 'aceita' && (
                            <Link
                              href={`/checkout/${msg.proposal.listing_id}`}
                              className="block text-center rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white shadow-sm"
                            >
                              Ir para o Checkout com o Desconto
                            </Link>
                          )}
                        </div>
                      )}

                      {/* Balão de Mensagem de Texto */}
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-xs ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-slate-100 text-slate-800 rounded-bl-xs dark:bg-slate-800 dark:text-slate-100'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                      <span className="mt-1 text-[10px] text-slate-400">
                        {formatRelativeTime(msg.created_at)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Barra de Entrada de Mensagem */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-slate-800"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escreva sua mensagem ou proposta de retirada..."
                  className="flex-1 rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                  title="Enviar mensagem"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="h-12 w-12 text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Selecione uma conversa para começar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
