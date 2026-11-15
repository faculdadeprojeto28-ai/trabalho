'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  MapPin,
  Sparkles,
  ArrowUpDown,
  Layers,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useMarketplace } from '@/lib/data-store';
import { CATEGORIES } from '@/lib/categories';
import { ProductCard } from '@/components/ui/ProductCard';
import { ListingCondition } from '@/types';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('categoria') || '';
  const initialCity = searchParams.get('cidade') || '';
  const initialFavoritesOnly = searchParams.get('favoritos') === 'true';
  const initialFeaturedOnly = searchParams.get('destaque') === 'true';
  const initialSort = searchParams.get('ordenar') || 'relevancia';

  const { listings, favorites } = useMarketplace();

  // Estados dos filtros
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [pickupOnly, setPickupOnly] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(initialFavoritesOnly);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(initialFeaturedOnly);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lista de cidades disponíveis
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((l) => set.add(l.city));
    return Array.from(set).sort();
  }, [listings]);

  // Filtragem e ordenação combinada
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Busca textual
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesBrand = item.brand?.toLowerCase().includes(q);
        const matchesCity = item.city.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesBrand && !matchesCity) {
          return false;
        }
      }

      // Categoria
      if (selectedCategory && item.category_slug !== selectedCategory) {
        return false;
      }

      // Cidade
      if (selectedCity && item.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Condição
      if (selectedCondition && item.condition !== selectedCondition) {
        return false;
      }

      // Faixa de preço
      if (minPrice && item.current_price < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice && item.current_price > parseFloat(maxPrice)) {
        return false;
      }

      // Entrega / Retirada
      if (deliveryOnly && !item.delivery_available) {
        return false;
      }
      if (pickupOnly && !item.pickup_available) {
        return false;
      }

      // Favoritos
      if (showOnlyFavorites && !favorites.includes(item.id)) {
        return false;
      }

      // Apenas Patrocinados/Destaque
      if (showOnlyFeatured && !item.is_featured) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'menor_preco') return a.current_price - b.current_price;
      if (sortBy === 'maior_preco') return b.current_price - a.current_price;
      if (sortBy === 'maior_desconto') {
        const descA = a.original_price ? (a.original_price - a.current_price) / a.original_price : 0;
        const descB = b.original_price ? (b.original_price - b.current_price) / b.original_price : 0;
        return descB - descA;
      }
      if (sortBy === 'recentes') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // Relevância padrão: itens patrocinados primeiro, depois mais recentes
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [
    listings,
    query,
    selectedCategory,
    selectedCity,
    selectedCondition,
    minPrice,
    maxPrice,
    deliveryOnly,
    pickupOnly,
    showOnlyFavorites,
    showOnlyFeatured,
    sortBy,
    favorites,
  ]);

  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setSelectedCondition('');
    setMinPrice('');
    setMaxPrice('');
    setDeliveryOnly(false);
    setPickupOnly(false);
    setShowOnlyFavorites(false);
    setShowOnlyFeatured(false);
    setSortBy('relevancia');
  };

  const hasActiveFilters =
    Boolean(query) ||
    Boolean(selectedCategory) ||
    Boolean(selectedCity) ||
    Boolean(selectedCondition) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    deliveryOnly ||
    pickupOnly ||
    showOnlyFavorites ||
    showOnlyFeatured;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Barra de Título e Pesquisa */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {showOnlyFavorites ? 'Meus Materiais Salvos nos Favoritos' : 'Explorar Materiais de Construção'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Encontrados <strong className="text-slate-900 dark:text-white">{filteredListings.length}</strong> anúncios disponíveis
            </p>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, marca ou cidade..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-10 pl-10 text-sm shadow-xs focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900"
            />
            <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tags de Filtros Ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Filtros ativos:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Categoria: {CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Cidade: {selectedCity}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCity('')} />
              </span>
            )}
            {selectedCondition && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Condição: {selectedCondition}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCondition('')} />
              </span>
            )}
            {showOnlyFavorites && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                Apenas Favoritos
                <X className="h-3 w-3 cursor-pointer" onClick={() => setShowOnlyFavorites(false)} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline ml-2"
            >
              <RotateCcw className="h-3 w-3" />
              Limpar todos
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Painel Lateral de Filtros (Desktop) */}
        <div className="hidden lg:block space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
              <span>Filtrar Resultados</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-emerald-600 hover:underline font-semibold"
              >
                Resetar
              </button>
            )}
          </div>

          {/* Filtro: Categorias */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2.5">Categoria</h4>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                  selectedCategory === ''
                    ? 'bg-emerald-600 font-bold text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span>Todas as categorias</span>
                <span>{listings.length}</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                    selectedCategory === cat.slug
                      ? 'bg-emerald-600 font-bold text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate max-w-[170px] text-left">{cat.name}</span>
                  <span className="text-[11px] opacity-75">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtro: Cidade */}
          <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Cidade</h4>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">Todas as cidades</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro: Condição do Material */}
          <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Condição do Material</h4>
            <div className="space-y-1.5 text-xs">
              {[
                { id: '', label: 'Qualquer condição' },
                { id: 'novo', label: 'Novo (lacrado/sem uso)' },
                { id: 'sobra_de_obra', label: 'Sobra de Obra' },
                { id: 'seminovo', label: 'Seminovo' },
                { id: 'reutilizavel', label: 'Reutilizável / Demolição' },
              ].map((cond) => (
                <label
                  key={cond.id}
                  className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-emerald-600"
                >
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === cond.id}
                    onChange={() => setSelectedCondition(cond.id)}
                    className="accent-emerald-600"
                  />
                  <span>{cond.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtro: Faixa de Preço */}
          <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Faixa de Preço (R$)</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
              <input
                type="number"
                placeholder="Máximo"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Filtro: Entrega e Retirada */}
          <div className="border-t border-slate-100 pt-4 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Disponibilidade</h4>
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={deliveryOnly}
                onChange={(e) => setDeliveryOnly(e.target.checked)}
                className="rounded accent-emerald-600"
              />
              <span>Disponível para Entrega</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={pickupOnly}
                onChange={(e) => setPickupOnly(e.target.checked)}
                className="rounded accent-emerald-600"
              />
              <span>Disponível para Retirada no Local</span>
            </label>
          </div>
        </div>

        {/* Grade de Resultados de Produtos */}
        <div className="lg:col-span-3 space-y-6">
          {/* Barra de Ordenação e Ações */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            {/* Botão de Filtro Mobile */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="inline-flex lg:hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              <Filter className="h-4 w-4 text-emerald-600" />
              <span>Filtros ({hasActiveFilters ? 'Ativos' : 'Todos'})</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="relevancia">Relevância / Destaques</option>
                <option value="menor_preco">Menor Preço</option>
                <option value="maior_preco">Maior Preço</option>
                <option value="maior_desconto">Maior Desconto (%)</option>
                <option value="recentes">Mais Recentes</option>
              </select>
            </div>
          </div>

          {/* Lista / Grade de Cards de Produtos */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ProductCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            /* Estado Vazio (Empty State amigável) */
            <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                Nenhum anúncio encontrado
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Tente ajustar os filtros de categoria, faixa de preço ou limpar a palavra-chave pesquisada.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={clearAllFilters}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                >
                  Limpar todos os filtros
                </button>
                <Link
                  href="/anunciar"
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
                >
                  Publicar este material
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Carregando catálogo de materiais...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
