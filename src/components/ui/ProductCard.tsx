'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { Listing } from '@/types';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import { useMarketplace } from '@/lib/data-store';

interface ProductCardProps {
  listing: Listing;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ listing }) => {
  const { favorites, toggleFavorite } = useMarketplace();
  const isFavorite = favorites.includes(listing.id);
  const discount = calculateDiscount(listing.original_price, listing.current_price);

  const conditionLabels: Record<string, { text: string; bg: string; color: string }> = {
    novo: { text: 'Novo', bg: 'bg-emerald-500/10', color: 'text-emerald-700 dark:text-emerald-400' },
    sobra_de_obra: { text: 'Sobra de Obra', bg: 'bg-amber-500/10', color: 'text-amber-700 dark:text-amber-400' },
    seminovo: { text: 'Seminovo', bg: 'bg-blue-500/10', color: 'text-blue-700 dark:text-blue-400' },
    reutilizavel: { text: 'Reutilizável', bg: 'bg-teal-500/10', color: 'text-teal-700 dark:text-teal-400' },
  };

  const conditionInfo = conditionLabels[listing.condition] || conditionLabels.sobra_de_obra;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700">
      {/* Imagem do Produto */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link href={`/anuncio/${listing.id}`} className="block h-full w-full">
          <img
            src={listing.images[0] || 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80'}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges superiores */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
          {listing.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow-xs">
              <Sparkles className="h-3 w-3" />
              Patrocinado
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
              -{discount}%
            </span>
          )}
        </div>

        {/* Botão de Favorito */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(listing.id);
          }}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={`absolute top-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
            isFavorite
              ? 'bg-rose-50 text-rose-500 shadow-sm dark:bg-rose-950/80 dark:text-rose-400'
              : 'bg-white/80 text-slate-600 backdrop-blur-xs hover:bg-white hover:text-rose-500 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-900'
          }`}
        >
          <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Badge de Condição */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium backdrop-blur-md ${conditionInfo.bg} ${conditionInfo.color} border border-white/20 dark:border-slate-700/40`}>
            {conditionInfo.text}
          </span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col p-4">
        {/* Categoria e Localização */}
        <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-emerald-700 dark:text-emerald-400 truncate max-w-[55%]">
            {listing.category_name}
          </span>
          <span className="inline-flex items-center gap-1 truncate max-w-[45%]">
            <MapPin className="h-3 w-3 shrink-0" />
            {listing.city}, {listing.state}
          </span>
        </div>

        {/* Título do Anúncio */}
        <Link href={`/anuncio/${listing.id}`} className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors dark:text-slate-100 leading-snug">
            {listing.title}
          </h3>
        </Link>

        {/* Quantidade e Unidade */}
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Disponível: <strong className="text-slate-700 dark:text-slate-200">{listing.quantity} {listing.unit_measure}</strong>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {/* Preços */}
          <div className="flex items-baseline justify-between">
            <div>
              {listing.original_price && listing.original_price > listing.current_price && (
                <span className="block text-xs text-slate-400 line-through">
                  {formatCurrency(listing.original_price)}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatCurrency(listing.current_price)}
                </span>
                <span className="text-xs text-slate-500">/{listing.unit_measure}</span>
              </div>
            </div>

            {/* Informação do Vendedor */}
            <div className="text-right text-xs">
              <span className="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                {listing.seller.role === 'company' ? 'Empresa' : 'Particular'}
                {listing.seller.is_verified && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
