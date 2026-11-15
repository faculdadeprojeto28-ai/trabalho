'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, notFound, useParams } from 'next/navigation';
import {
  ShieldCheck,
  Package,
  QrCode,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  MapPin,
  Truck,
  Copy,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = routeParams?.id as string;
  const { listings, currentUser, createOrder, settings } = useMarketplace();

  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    notFound();
  }

  // Estados do Checkout
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('Av. Paulista, 1578 - Bela Vista, São Paulo - SP');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito'>('pix');
  const [installments, setInstallments] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  // Campos de Cartão
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(currentUser.full_name.toUpperCase());
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');

  // Cálculos financeiros
  const subtotal = listing.current_price * quantity;
  const platformFee = Math.round(subtotal * (settings.default_commission_percentage / 100) * 100) / 100;
  const shippingAmount = deliveryMethod === 'delivery' ? 45.0 : 0.0;
  const totalAmount = subtotal + shippingAmount;

  const mockPixKey = '00020126580014br.gov.bcb.pix0136obracircular-sandbox-pix-mock-key520400005303986540' + totalAmount.toFixed(2) + '5802BR5916OBRACIRCULAR6009SAO PAULO62070503***6304';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder(
        listing,
        quantity,
        deliveryMethod,
        paymentMethod,
        deliveryMethod === 'delivery' ? deliveryAddress : undefined
      );

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setIsProcessing(false);
      router.push(`/pedidos/${order.id}`);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Banner de Modo de Demonstração / Sandbox do Mercado Pago */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong className="block text-sm">Ambiente de Demonstração — Mercado Pago Sandbox</strong>
            <p className="mt-0.5 leading-relaxed">
              Este checkout opera em modo de simulação protegida. Nenhuma cobrança financeira real será emitida no seu cartão. Você pode testar livremente o fluxo completo de Pix ou Cartão.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna da Esquerda: Dados do Pedido, Entrega e Método de Pagamento */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Quantidade e Produto */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              1. Produto e Quantidade
            </h2>

            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="h-16 w-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="flex-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  {listing.category_name}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                  {listing.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Preço unitário: {formatCurrency(listing.current_price)} /{listing.unit_measure}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quantidade desejada ({listing.unit_measure}):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={listing.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(listing.quantity, Number(e.target.value))))}
                  className="w-20 rounded-xl border border-slate-300 p-2 text-center text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-400">máx: {listing.quantity}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Forma de Retirada ou Entrega */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Como deseja receber o material?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                  deliveryMethod === 'pickup'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                  className="mt-1 accent-emerald-600"
                />
                <div className="text-xs">
                  <strong className="block text-slate-900 dark:text-white">
                    Retirada no Canteiro / Local
                  </strong>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Grátis</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {listing.city}, {listing.state} ({listing.neighborhood || 'Local indicado'})
                  </p>
                </div>
              </label>

              <label
                onClick={() => setDeliveryMethod('delivery')}
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                  deliveryMethod === 'delivery'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={deliveryMethod === 'delivery'}
                  onChange={() => setDeliveryMethod('delivery')}
                  className="mt-1 accent-emerald-600"
                />
                <div className="text-xs">
                  <strong className="block text-slate-900 dark:text-white">
                    Entrega Combinada / Frete
                  </strong>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">R$ 45,00 estimado</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Entregue no seu endereço de obra.
                  </p>
                </div>
              </label>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Endereço Completo de Entrega
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Rua, número, complemento, bairro, cidade - UF"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            )}
          </div>

          {/* Card 3: Escolha do Método de Pagamento */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. Forma de Pagamento Protegido
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`flex flex-col items-center justify-center rounded-2xl border p-4 transition ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                <QrCode className="h-6 w-6 mb-1 text-emerald-600" />
                <span className="text-xs">Pix Instantâneo</span>
                <span className="text-[10px] text-emerald-600 font-bold">Aprovação Imediata</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao_credito')}
                className={`flex flex-col items-center justify-center rounded-2xl border p-4 transition ${
                  paymentMethod === 'cartao_credito'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                <CreditCard className="h-6 w-6 mb-1 text-emerald-600" />
                <span className="text-xs">Cartão de Crédito</span>
                <span className="text-[10px] text-slate-400">Até 12x</span>
              </button>
            </div>

            {/* Visualização de Pagamento por Pix */}
            {paymentMethod === 'pix' && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800 space-y-4 text-center">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Escaneie o QR Code no seu aplicativo do banco ou use o Pix Copia e Cola:
                </p>

                {/* QR Code Simulado em SVG */}
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl bg-white p-3 shadow-md border border-slate-200 dark:border-slate-700">
                  <div className="relative flex h-full w-full items-center justify-center bg-slate-900 text-white rounded-lg p-2 font-mono text-[9px] break-all leading-none select-none">
                    <QrCode className="h-28 w-28 text-slate-900 bg-white p-1 rounded" />
                  </div>
                </div>

                <div className="flex items-center gap-2 max-w-sm mx-auto">
                  <input
                    type="text"
                    readOnly
                    value={mockPixKey}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-[10px] font-mono text-slate-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-black shrink-0 flex items-center gap-1"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{pixCopied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Visualização de Pagamento por Cartão */}
            {paymentMethod === 'cartao_credito' && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-mono dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Validade
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-center dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-center dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Parcelamento
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value={1}>1x de {formatCurrency(totalAmount)} (sem juros)</option>
                    <option value={2}>2x de {formatCurrency(totalAmount / 2)} (sem juros)</option>
                    <option value={3}>3x de {formatCurrency(totalAmount / 3)} (sem juros)</option>
                    <option value={6}>6x de {formatCurrency(totalAmount / 6)} (sem juros)</option>
                    <option value={12}>12x de {formatCurrency(totalAmount / 12)}</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coluna da Direita: Resumo Financeiro e Finalização */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Resumo do Pedido
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal ({quantity} {listing.unit_measure}):</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  Proteção & Custódia ObraCircular:
                  <Info className="h-3 w-3 text-slate-400" />
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Incluso (0%)
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Frete / Retirada:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {deliveryMethod === 'pickup' ? 'Grátis' : formatCurrency(shippingAmount)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total a Pagar:</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {formatCurrency(totalAmount)}
                  </span>
                  {paymentMethod === 'cartao_credito' && installments > 1 && (
                    <p className="text-[10px] text-slate-400">
                      em {installments}x de {formatCurrency(totalAmount / installments)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Botão de Finalização da Compra */}
            <button
              onClick={handleCompleteOrder}
              disabled={isProcessing}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 hover:shadow-xl disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Validando transação segura...</span>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Concluir Compra Segura</span>
                </>
              )}
            </button>

            <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-800/60 leading-relaxed text-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600 inline mr-1" />
              Garantia ObraCircular: o vendedor só recebe o repasse após você conferir e aprovar o material retirado.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
