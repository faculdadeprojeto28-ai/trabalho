'use client';

import React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ChevronRight, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { useMarketplace } from '@/lib/data-store';
import { ProductCard } from '@/components/ui/ProductCard';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

export default function CategoryPage() {
  const routeParams = useParams();
  const slug = routeParams?.slug as string;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const { listings } = useMarketplace();

  if (!category) {
    notFound();
  }

  const categoryListings = listings.filter((l) => l.category_slug === slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb de navegação */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-600 transition">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/busca" className="hover:text-emerald-600 transition">
          Categorias
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {category.name}
        </span>
      </nav>

      {/* Banner da Categoria */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: `url(${category.image_url})` }} />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur-md">
            <CategoryIcon name={category.icon} className="h-4 w-4" />
            <span>Categoria Oficial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {category.name}
          </h1>

          <p className="text-sm text-emerald-100 leading-relaxed">
            {category.description}
          </p>

          {/* Subcategorias em chips */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {category.subcategories.map((sub, i) => (
              <Link
                key={i}
                href={`/busca?categoria=${category.slug}&q=${encodeURIComponent(sub)}`}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-200 backdrop-blur-md transition hover:bg-white/25 hover:text-white"
              >
                {sub}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Listagem de Anúncios da Categoria */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Anúncios de {category.name}
            </h2>
            <p className="text-xs text-slate-500">
              {categoryListings.length} materiais disponíveis nesta categoria
            </p>
          </div>

          <Link
            href="/anunciar"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            Anunciar nesta categoria
          </Link>
        </div>

        {categoryListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryListings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Ainda não há materiais cadastrados nesta categoria.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Seja o primeiro a vender e aproveite a alta procura de compradores locais!
            </p>
            <Link
              href="/anunciar"
              className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              Publicar primeiro anúncio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
