'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  DollarSign,
  Package,
  MapPin,
  Camera,
  Eye,
  Info,
  Wand2,
  Layers,
  Check,
  X,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { useMarketplace } from '@/lib/data-store';
import { UnitMeasure, ListingCondition } from '@/types';
import { generateCivilTechAISuggestions } from '@/lib/ai-assistant';
import { formatCurrency, slugify } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function PublishListingPage() {
  const router = useRouter();
  const { addListing, currentUser } = useMarketplace();

  // Etapa atual (1 a 5)
  const [currentStep, setCurrentStep] = useState(1);

  // Estados dos campos do anúncio
  const [title, setTitle] = useState('');
  const [categorySlug, setCategorySlug] = useState('pisos-e-revestimentos');
  const [condition, setCondition] = useState<ListingCondition>('sobra_de_obra');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');

  // Etapa 2: Preços e Quantidades
  const [currentPrice, setCurrentPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [unitMeasure, setUnitMeasure] = useState<UnitMeasure>('m2');

  // Etapa 3: Localização e Entrega
  const [city, setCity] = useState(currentUser.city || 'São Paulo');
  const [state, setState] = useState(currentUser.state || 'SP');
  const [neighborhood, setNeighborhood] = useState('Jardins');
  const [postalCodePrefix, setPostalCodePrefix] = useState('01410');
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [pickupAvailable, setPickupAvailable] = useState(true);
  const [shippingNotes, setShippingNotes] = useState('Retirada no canteiro de obras em horário comercial ou frete a combinar.');

  // Etapa 4: Fotografias
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80',
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Assistente de IA
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<ReturnType<typeof generateCivilTechAISuggestions> | null>(null);

  const handleApplyAI = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const suggestions = generateCivilTechAISuggestions({
        rawTitle: title || 'Piso Porcelanato 60x60',
        rawDescription: description,
        categorySlug,
        condition,
        quantity: Number(quantity) || 1,
        unitMeasure,
        brand,
        currentPrice: Number(currentPrice) || 80,
      });

      setAiSuggestions(suggestions);
      if (suggestions.suggestedTitle) setTitle(suggestions.suggestedTitle);
      if (suggestions.improvedDescription) setDescription(suggestions.improvedDescription);
      setIsAiLoading(false);
    }, 800);
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim() && imageUrlInput.startsWith('http')) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCat = CATEGORIES.find((c) => c.slug === categorySlug) || CATEGORIES[0];

    const newListing = addListing({
      seller_id: currentUser.id,
      company_id: currentUser.role === 'company' ? 'comp-1' : undefined,
      category_id: selectedCat.id,
      category_slug: selectedCat.slug,
      category_name: selectedCat.name,
      title: title.trim(),
      slug: slugify(title) + '-' + Date.now().toString().slice(-4),
      description: description.trim(),
      current_price: Number(currentPrice) || 50,
      original_price: originalPrice ? Number(originalPrice) : undefined,
      quantity: Number(quantity) || 1,
      unit_measure: unitMeasure,
      condition,
      brand: brand || undefined,
      model: model || undefined,
      city,
      state,
      neighborhood,
      postal_code_prefix: postalCodePrefix,
      delivery_available: deliveryAvailable,
      pickup_available: pickupAvailable,
      shipping_notes: shippingNotes,
      status: 'ativo',
      is_featured: false,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80'],
    });

    // Confetti de comemoração
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignora caso canvas não esteja disponível
    }

    router.push(`/anuncio/${newListing.id}`);
  };

  const steps = [
    { number: 1, title: 'Dados Básicos' },
    { number: 2, title: 'Preço & Estoque' },
    { number: 3, title: 'Local & Entrega' },
    { number: 4, title: 'Fotografias' },
    { number: 5, title: 'Revisão Final' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Cabeçalho do Assistente de Publicação */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Assistente de Publicação
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Anunciar Material de Construção
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Publique suas sobras com rapidez, alcance milhares de compradores e ajude a evitar o desperdício na construção civil.
        </p>
      </div>

      {/* Stepper Visual de Progresso */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
        {steps.map((s) => {
          const isDone = currentStep > s.number;
          const isCurrent = currentStep === s.number;
          return (
            <div key={s.number} className="flex flex-col items-center flex-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'border border-slate-300 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800'
                }`}
              >
                {isDone ? <Check className="h-5 w-5" /> : s.number}
              </div>
              <span className={`mt-2 text-[11px] font-semibold hidden sm:block ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Formulário Dividido em Etapas */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        {/* ETAPA 1: INFORMAÇÕES BÁSICAS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Passo 1: Identificação do Material
              </h2>
              {/* Botão Assistente de IA */}
              <button
                type="button"
                onClick={handleApplyAI}
                disabled={isAiLoading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isAiLoading ? 'Analisando...' : 'Aprimorar com IA'}</span>
              </button>
            </div>

            {aiSuggestions && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs dark:border-emerald-950 dark:bg-emerald-950/30 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                  <Wand2 className="h-4 w-4" />
                  <span>Dicas da IA para Construção Civil</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-emerald-800 dark:text-emerald-300">
                  {aiSuggestions.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Título do Anúncio *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Porcelanato Portobello 60x120cm Bianco Di Lucca (Lote 45m²)"
                required
                className="w-full rounded-xl border border-slate-300 p-3 text-sm font-semibold focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Categoria do Produto *
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estado de Conservação *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ListingCondition)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="novo">Novo (lacrado/sem uso)</option>
                  <option value="sobra_de_obra">Sobra de Obra (aberto/intacto)</option>
                  <option value="seminovo">Seminovo (usado em showroom/pouco tempo)</option>
                  <option value="reutilizavel">Reutilizável / Madeira ou Tijolo de Demolição</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Marca / Fabricante (opcional)
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ex: Portobello, Suvinil, Tigre, Votoran..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Modelo ou Linha (opcional)
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ex: Polido 60x120, CP-II, Soldável..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Descrição Detalhada do Material *
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Informe o estado de armazenamento, se as caixas estão secas, lote de tonalidade, motivo da sobra..."
                required
                className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
        )}

        {/* ETAPA 2: QUANTIDADE E PREÇOS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Passo 2: Quantidade e Valores
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantidade Disponível *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm font-bold dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Unidade de Medida *
                </label>
                <select
                  value={unitMeasure}
                  onChange={(e) => setUnitMeasure(e.target.value as UnitMeasure)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="m2">m² (Metro Quadrado)</option>
                  <option value="unidade">Unidade (peça)</option>
                  <option value="saco">Saco</option>
                  <option value="caixa">Caixa</option>
                  <option value="lote">Lote Fechado</option>
                  <option value="m3">m³ (Metro Cúbico)</option>
                  <option value="kg">kg (Quilograma)</option>
                  <option value="litro">Litro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preço de Venda por {unitMeasure} (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(Number(e.target.value))}
                    placeholder="0,00"
                    required
                    className="w-full rounded-xl border border-slate-300 p-3 pl-10 text-base font-black text-emerald-600 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preço Original de Loja (R$ - opcional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    placeholder="Ex: 150,00"
                    className="w-full rounded-xl border border-slate-300 p-3 pl-10 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Utilizado para destacar o percentual de desconto economizado pelo comprador.
                </p>
              </div>
            </div>

            {/* Resumo de Faturamento Estimado */}
            {currentPrice && quantity && (
              <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-800 dark:text-emerald-300 font-semibold">
                    Valor total do lote se vendido por completo:
                  </span>
                  <strong className="text-base font-black text-emerald-700 dark:text-emerald-300">
                    {formatCurrency(Number(currentPrice) * Number(quantity))}
                  </strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ETAPA 3: LOCALIZAÇÃO E LOGÍSTICA */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Passo 3: Local de Retirada e Condições de Frete
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estado (UF) *
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  required
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs uppercase font-bold dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bairro ou Região
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Modalidades Disponíveis
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 cursor-pointer hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={pickupAvailable}
                    onChange={(e) => setPickupAvailable(e.target.checked)}
                    className="mt-1 rounded accent-emerald-600"
                  />
                  <div className="text-xs">
                    <strong className="block text-slate-800 dark:text-white">Retirada no Local (Grátis)</strong>
                    <span className="text-slate-500">O comprador retira no canteiro ou depósito.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 cursor-pointer hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={deliveryAvailable}
                    onChange={(e) => setDeliveryAvailable(e.target.checked)}
                    className="mt-1 rounded accent-emerald-600"
                  />
                  <div className="text-xs">
                    <strong className="block text-slate-800 dark:text-white">Entrega Disponível</strong>
                    <span className="text-slate-500">Frete próprio ou transportadora combinada.</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Instruções de Acesso para Carregamento
              </label>
              <textarea
                rows={3}
                value={shippingNotes}
                onChange={(e) => setShippingNotes(e.target.value)}
                placeholder="Ex: Local possui doca para caminhões, ajudamos no carregamento..."
                className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
        )}

        {/* ETAPA 4: FOTOGRAFIAS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Passo 4: Fotos do Material
            </h2>

            <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <Camera className="mx-auto h-10 w-10 text-emerald-600 mb-2" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Adicione fotos reais do material
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Anúncios com fotos nítidas vendem até 4x mais rápido. Inclua fotos das embalagens e lote.
              </p>

              {/* Inserir URL de Foto de Exemplo ou Upload */}
              <div className="mt-4 flex max-w-md mx-auto gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Cole o link da foto (URL)..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {/* Galeria de Fotos Adicionadas */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500">Fotos cadastradas ({images.length})</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white shadow-md opacity-90 hover:opacity-100"
                      title="Remover foto"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        Capa Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 5: REVISÃO E PRÉ-VISUALIZAÇÃO */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Passo 5: Revisão e Confirmação
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              {/* Miniatura de Como o Card Ficará no Marketplace */}
              <div className="sm:col-span-5 rounded-2xl border border-slate-200 p-4 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Pré-visualização do Anúncio</p>
                <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
                  <div className="aspect-4/3 w-full bg-slate-100 dark:bg-slate-800">
                    <img src={images[0]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600">{categorySlug}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{title || 'Sem título'}</h4>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {formatCurrency(Number(currentPrice) || 0)} <span className="text-[10px] font-normal text-slate-500">/{unitMeasure}</span>
                    </p>
                    <p className="text-[10px] text-slate-400">{city}, {state}</p>
                  </div>
                </div>
              </div>

              {/* Dados Estruturados */}
              <div className="sm:col-span-7 space-y-3 text-xs">
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Título:</span>
                    <strong className="text-slate-800 dark:text-slate-100">{title}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Condição:</span>
                    <strong className="text-slate-800 dark:text-slate-100">{condition}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantidade:</span>
                    <strong className="text-slate-800 dark:text-slate-100">{quantity} {unitMeasure}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Preço unitário:</span>
                    <strong className="text-emerald-600 font-bold dark:text-emerald-400">{formatCurrency(Number(currentPrice) || 0)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vendedor:</span>
                    <strong className="text-slate-800 dark:text-slate-100">{currentUser.full_name}</strong>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50 p-3 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  <Info className="h-3.5 w-3.5 inline mr-1 text-amber-600" />
                  Seu anúncio será ativado imediatamente e ficará visível em buscas geolocalizadas em {city} e todo o Brasil.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Navegação do Stepper */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1 && !title.trim()) {
                  alert('Por favor, informe o título do produto.');
                  return;
                }
                if (currentStep === 2 && !currentPrice) {
                  alert('Por favor, informe o preço do material.');
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
            >
              <span>Avançar</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Publicar Anúncio Agora</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
