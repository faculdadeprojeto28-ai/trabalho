'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, notFound, useParams } from 'next/navigation';
import {
  Heart,
  Share2,
  ShieldCheck,
  MapPin,
  Truck,
  PackageCheck,
  CheckCircle2,
  Star,
  MessageSquare,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  Send,
  X,
} from 'lucide-react';
import { useMarketplace } from '@/lib/data-store';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import { ProductCard } from '@/components/ui/ProductCard';
import { MOCK_LISTINGS } from '@/lib/mock-data';

export default function ListingDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = routeParams?.id as string;
  const { listings, currentUser, favorites, toggleFavorite, createProposal } = useMarketplace();

  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    notFound();
  }

  // Estados locais da página
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [proposalPrice, setProposalPrice] = useState(listing.current_price * 0.9);
  const [proposalQuantity, setProposalQuantity] = useState(1);
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [reportReason, setReportReason] = useState('preco_abusivo');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const isFavorite = favorites.includes(listing.id);
  const discount = calculateDiscount(listing.original_price, listing.current_price);

  // Produtos semelhantes na mesma categoria
  const similarProducts = listings
    .filter((l) => l.category_id === listing.category_id && l.id !== listing.id)
    .slice(0, 4);

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    createProposal(listing, Number(proposalPrice), Number(proposalQuantity), proposalMessage);
    setProposalSuccess(true);
    setTimeout(() => {
      setIsProposalModalOpen(false);
      setProposalSuccess(false);
      router.push('/mensagens');
    }, 1500);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSuccess(true);
    setTimeout(() => {
      setIsReportModalOpen(false);
      setReportSuccess(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-600 transition">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/categorias/${listing.category_slug}`} className="hover:text-emerald-600 transition">
          {listing.category_name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
          {listing.title}
        </span>
      </nav>

      {/* Grid Principal do Produto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Coluna da Esquerda: Galeria de Fotos */}
        <div className="lg:col-span-7 space-y-4">
          {/* Foto Principal */}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 shadow-md">
            <img
              src={listing.images[selectedImageIndex] || listing.images[0]}
              alt={listing.title}
              className="h-full w-full object-cover"
            />

            {/* Badges Flutuantes */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {listing.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  Patrocinado
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-lg bg-red-600 px-3 py-1 text-xs font-black text-white shadow-md">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Botão de Favorito no topo da imagem */}
            <button
              onClick={() => toggleFavorite(listing.id)}
              className={`absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition ${
                isFavorite
                  ? 'bg-rose-50 text-rose-500 dark:bg-rose-950'
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500 dark:bg-slate-900/90 dark:text-slate-200'
              }`}
              title="Salvar nos favoritos"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Miniaturas da Galeria */}
          {listing.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    selectedImageIndex === idx
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Descrição Detalhada do Material */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Descrição do Material
            </h2>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </div>

            {/* Tabela de Especificações Técnicas */}
            {listing.specifications && Object.keys(listing.specifications).length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Especificações Técnicas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(listing.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">{key}:</span>
                      <strong className="text-slate-800 dark:text-slate-100">{val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coluna da Direita: Preços, Compra, Vendedor e Localização */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Principal de Preço e Ações de Compra */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider dark:text-emerald-400">
                {listing.category_name}
              </span>
              <h1 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {listing.title}
              </h1>

              {/* Informações de Localização e Condição */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  {listing.city}, {listing.state} ({listing.neighborhood || 'Região Central'})
                </span>
                <span>•</span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Condição: {listing.condition.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Bloco de Preço */}
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
              {listing.original_price && listing.original_price > listing.current_price && (
                <div className="flex items-center gap-2 text-xs text-slate-400 line-through">
                  <span>Preço original em loja: {formatCurrency(listing.original_price)}</span>
                </div>
              )}
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(listing.current_price)}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  / {listing.unit_measure}
                </span>
              </div>
              <p className="mt-1 text-xs text-emerald-600 font-semibold dark:text-emerald-400">
                Disponível em estoque: {listing.quantity} {listing.unit_measure}
              </p>
            </div>

            {/* Botões de Ação de Compra e Negociação */}
            <div className="space-y-3">
              <Link
                href={`/checkout/${listing.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 hover:shadow-xl"
              >
                <PackageCheck className="h-5 w-5" />
                <span>Comprar Agora com Proteção</span>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsProposalModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 py-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Fazer Proposta</span>
                </button>

                <Link
                  href="/mensagens"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Conversar</span>
                </Link>
              </div>
            </div>

            {/* Selo de Garantia e Custódia Segura */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs dark:border-emerald-950 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Compra Protegida ObraCircular</span>
              </div>
              <p className="text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed text-[11px]">
                Seu dinheiro fica em custódia segura até você conferir o material pessoalmente na retirada. Sem riscos de golpe.
              </p>
            </div>
          </div>

          {/* Card do Vendedor */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Informações do Vendedor
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={listing.seller.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}
                alt={listing.seller.full_name}
                className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {listing.seller.full_name}
                  </h4>
                  {listing.seller.is_verified && (
                    <span title="Vendedor Verificado">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {listing.seller.role === 'company' ? 'Construtora / Loja B2B' : 'Profissional / Particular'}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{listing.seller.rating || 5.0}</span>
                  <span className="text-slate-400 font-normal">({listing.seller.total_reviews} avaliações)</span>
                </div>
              </div>
            </div>

            {listing.seller.bio && (
              <p className="text-xs text-slate-500 leading-relaxed italic border-t border-slate-100 pt-3 dark:border-slate-800">
                &quot;{listing.seller.bio}&quot;
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                <span>Responde em até 1h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Identidade Verificada</span>
              </div>
            </div>
          </div>

          {/* Localização Aproximada (com Proteção de Privacidade) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Localização para Retirada
            </h3>
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">
                  {listing.city} - {listing.state} ({listing.neighborhood || 'Região Metropolitana'})
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  CEP inicial: {listing.postal_code_prefix ? `${listing.postal_code_prefix}-***` : 'Disponível após confirmação'}
                </p>
              </div>
            </div>

            {/* Aviso de Privacidade LGPD */}
            <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-800/60 leading-relaxed">
              <Info className="h-3.5 w-3.5 text-slate-400 inline mr-1" />
              Por motivos de privacidade e conformidade com a LGPD, o endereço exato com número do lote é liberado após a confirmação do pedido ou agendamento de visita no chat.
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-slate-400 hover:text-red-500 transition flex items-center gap-1"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Denunciar este anúncio</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Produtos Semelhantes */}
      {similarProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Produtos Semelhantes em {listing.category_name}
            </h2>
            <Link
              href={`/categorias/${listing.category_slug}`}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Ver mais nesta categoria
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} listing={p} />
            ))}
          </div>
        </section>
      )}

      {/* Modal: Fazer Proposta de Preço */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Enviar Proposta de Preço
              </h3>
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {proposalSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Proposta enviada com sucesso!
                </h4>
                <p className="text-xs text-slate-500">
                  O vendedor foi notificado no chat. Redirecionando para a conversa...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="mt-4 space-y-4">
                <div className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{listing.title}</p>
                  <p className="text-slate-500 mt-0.5">Preço anunciado: {formatCurrency(listing.current_price)}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sua oferta de valor por {listing.unit_measure} (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={proposalPrice}
                    onChange={(e) => setProposalPrice(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Quantidade desejada ({listing.unit_measure})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={listing.quantity}
                    value={proposalQuantity}
                    onChange={(e) => setProposalQuantity(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mensagem explicativa para o vendedor (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                    placeholder="Ex: Tenho interesse em retirar o lote completo amanhã à vista..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProposalModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                  >
                    Enviar Proposta
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Denunciar Anúncio */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Denunciar Anúncio
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <p className="font-bold text-sm text-slate-900 dark:text-white">Denúncia recebida</p>
                <p className="text-xs text-slate-500">Nossa equipe de moderação irá avaliar o anúncio.</p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Motivo da Denúncia
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="produto_enganoso">Material não condiz com as fotos</option>
                    <option value="preco_abusivo">Preço enganoso ou fraudulento</option>
                    <option value="contato_indevido">Tentativa de golpe ou pagamento fora da plataforma</option>
                    <option value="produto_proibido">Material ilícito ou danificado sem utilidade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Detalhes adicionais
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Descreva o que ocorreu..."
                    required
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-red-700"
                  >
                    Confirmar Denúncia
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
