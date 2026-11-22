'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle2, ChevronRight, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { useMarketplace } from '@/lib/data-store';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

export default function OrdersListPage() {
  const { orders, currentUser } = useMarketplace();

  // Pedidos do comprador atual (ou todos para testes)
  const myOrders = orders.filter((o) => o.buyer_id === currentUser.id || currentUser.role === 'admin');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Meus Pedidos e Compras
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Acompanhe o status de retirada, códigos de liberação e histórico de materiais adquiridos.
        </p>
      </div>

      <div className="space-y-4">
        {myOrders.length > 0 ? (
          myOrders.map((order) => (
            <Link
              key={order.id}
              href={`/pedidos/${order.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    {order.order_code}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{formatRelativeTime(order.created_at)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      order.status === 'concluido'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : order.status === 'pago'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={order.listing.images[0] || '/products/indisponivel.svg'}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('indisponivel.svg')) {
                        target.src = '/products/indisponivel.svg';
                      }
                    }}
                  />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {order.listing.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Quantidade: {order.quantity} {order.listing.unit_measure} • Vendedor: {order.seller.full_name}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      Código de Liberação: <strong className="font-mono">{order.pickup_verification_code}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 shrink-0">
                  <span>Ver Detalhes</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            <Package className="mx-auto h-12 w-12 text-slate-300 mb-2" />
            <p className="font-bold text-slate-800 dark:text-slate-200">Você ainda não realizou compras</p>
            <p className="text-xs mt-1">Navegue pelas 15 categorias e encontre materiais com até 60% de economia.</p>
            <Link
              href="/busca"
              className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              Explorar Ofertas
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
