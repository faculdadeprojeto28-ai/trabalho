'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Package,
  QrCode,
  MapPin,
  Clock,
  Star,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Truck,
  Copy,
  Printer,
} from 'lucide-react';
import { useMarketplace } from '@/lib/data-store';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

export default function OrderDetailPage() {
  const routeParams = useParams();
  const id = routeParams?.id as string;
  const { orders } = useMarketplace();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  // Estados de Avaliação e Disputa
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [isDisputeSubmitted, setIsDisputeSubmitted] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Botão Voltar */}
      <Link
        href="/pedidos"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Meus Pedidos</span>
      </Link>

      {/* Cabeçalho do Pedido */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Comprovante de Transação
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Pedido</span>
              <span className="font-mono text-emerald-600">{order.order_code}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Criado em {new Date(order.created_at).toLocaleDateString('pt-BR')} às{' '}
              {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir</span>
            </button>
            <span className="rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
              {order.status}
            </span>
          </div>
        </div>

        {/* Código de Liberação do Material (Segurança Anti-Golpe) */}
        <div className="rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/60 p-5 dark:border-emerald-800 dark:bg-emerald-950/20 text-center space-y-2">
          <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
            Código Secreto de Liberação para Retirada
          </p>
          <div className="font-mono text-3xl font-black text-emerald-700 dark:text-emerald-400 tracking-widest select-all">
            {order.pickup_verification_code}
          </div>
          <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 max-w-md mx-auto">
            Apresente este código ao vendedor somente após verificar fisicamente o produto no local e atestar suas condições.
          </p>
        </div>
      </div>

      {/* Detalhes do Produto e do Vendedor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card do Produto */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Item Adquirido</h3>
          <div className="flex items-center gap-3">
            <img
              src={order.listing.images[0] || '/products/indisponivel.svg'}
              alt=""
              className="h-16 w-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('indisponivel.svg')) {
                  target.src = '/products/indisponivel.svg';
                }
              }}
            />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                {order.listing.title}
              </h4>
              <p className="text-xs text-slate-500">
                Quantidade: {order.quantity} {order.listing.unit_measure}
              </p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Total: {formatCurrency(order.total_amount)}
              </p>
            </div>
          </div>
        </div>

        {/* Card do Vendedor e Retirada */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Vendedor & Local</h3>
          <div className="text-xs space-y-1.5">
            <p className="font-bold text-slate-900 dark:text-white">{order.seller.full_name}</p>
            <p className="text-slate-500">
              Local: {order.listing.city}, {order.listing.state} ({order.listing.neighborhood || 'Canteiro'})
            </p>
            <p className="text-slate-500">
              Modalidade: {order.delivery_method === 'pickup' ? 'Retirada no Local' : 'Entrega por Frete'}
            </p>
          </div>
        </div>
      </div>

      {/* Avaliação do Vendedor (após conclusão) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Avaliar a Experiência com o Vendedor
        </h3>

        {isReviewSubmitted ? (
          <div className="rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Obrigado! Sua avaliação foi registrada e contribui para a confiança do marketplace.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition"
                >
                  <Star className={`h-6 w-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                {rating} de 5 estrelas
              </span>
            </div>

            <textarea
              rows={2}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Descreva o atendimento, pontualidade e estado do material..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
            />

            <button
              onClick={() => setIsReviewSubmitted(true)}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              Publicar Avaliação
            </button>
          </div>
        )}
      </div>

      {/* Abertura de Disputa e Reembolso */}
      <div className="flex items-center justify-between pt-4 text-xs border-t border-slate-200 dark:border-slate-800">
        <span className="text-slate-500">Teve algum problema com o material ou retirada?</span>
        <button
          onClick={() => setIsDisputeOpen(!isDisputeOpen)}
          className="font-bold text-red-600 hover:underline flex items-center gap-1"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Solicitar Disputa ou Reembolso</span>
        </button>
      </div>

      {isDisputeOpen && (
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 text-xs dark:border-red-950 dark:bg-red-950/20 space-y-3">
          <strong className="block text-red-900 dark:text-red-300">
            Abertura de Protocolo de Mediação
          </strong>
          <p className="text-red-800/80 dark:text-red-300/80">
            Ao abrir uma disputa, o repasse ao vendedor permanece retido até a resolução pela equipe de governança da ObraCircular.
          </p>
          <textarea
            rows={3}
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            placeholder="Explique detalhadamente o ocorrido..."
            className="w-full rounded-xl border border-red-300 p-2.5 text-xs dark:border-red-800 dark:bg-slate-900"
          />
          <button
            onClick={() => {
              setIsDisputeSubmitted(true);
              setIsDisputeOpen(false);
              alert('Protocolo de disputa aberto com sucesso. Nossa equipe entrará em contato.');
            }}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
          >
            Confirmar Solicitação de Mediação
          </button>
        </div>
      )}
    </div>
  );
}
