// ==============================================================================
// OBRACIRCULAR - DEFINIÇÕES DE TIPOS TYPESCRIPT
// ==============================================================================

export type UserRole = 'buyer' | 'seller' | 'company' | 'admin';

export type ListingCondition = 'novo' | 'sobra_de_obra' | 'seminovo' | 'reutilizavel';

export type UnitMeasure = 'unidade' | 'm2' | 'm3' | 'litro' | 'kg' | 'saco' | 'caixa' | 'lote';

export type ListingStatus = 'ativo' | 'pausado' | 'vendido' | 'sob_analise' | 'removido';

export type OrderStatus =
  | 'aguardando_pagamento'
  | 'pago'
  | 'em_separacao'
  | 'pronto_retirada'
  | 'enviado'
  | 'concluido'
  | 'cancelado'
  | 'em_disputa';

export type PaymentMethod = 'pix' | 'cartao_credito' | 'boleto';

export type PaymentStatus = 'pendente' | 'aprovado' | 'recusado' | 'reembolsado';

export type ProposalStatus = 'pendente' | 'aceita' | 'recusada' | 'contraproposta' | 'expirada';

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  document?: string; // CPF ou CNPJ
  avatar_url?: string;
  bio?: string;
  role: UserRole;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  city: string;
  state: string;
  postal_code?: string;
  company_name?: string;
  plan_tier?: 'free' | 'pro' | 'enterprise';
  created_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image_url: string;
  subcategories: string[];
  count?: number;
}

export interface Listing {
  id: string;
  seller_id: string;
  seller: UserProfile;
  company_id?: string;
  category_id: string;
  category_slug: string;
  category_name: string;
  title: string;
  slug: string;
  description: string;
  current_price: number;
  original_price?: number;
  quantity: number;
  unit_measure: UnitMeasure;
  condition: ListingCondition;
  brand?: string;
  model?: string;
  city: string;
  state: string;
  neighborhood?: string;
  postal_code_prefix?: string;
  delivery_available: boolean;
  pickup_available: boolean;
  shipping_notes?: string;
  status: ListingStatus;
  is_featured: boolean;
  featured_until?: string;
  views_count: number;
  favorites_count: number;
  images: string[];
  created_at: string;
  updated_at: string;
  specifications?: Record<string, string>;
}

export interface Order {
  id: string;
  order_code: string;
  buyer_id: string;
  buyer: UserProfile;
  seller_id: string;
  seller: UserProfile;
  listing_id: string;
  listing: Listing;
  quantity: number;
  unit_price: number;
  subtotal_amount: number;
  platform_fee_amount: number;
  shipping_amount: number;
  total_amount: number;
  status: OrderStatus;
  delivery_method: 'pickup' | 'delivery';
  delivery_address?: string;
  pickup_verification_code: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  paid_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface Proposal {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_image: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  proposed_price: number;
  original_price: number;
  quantity: number;
  status: ProposalStatus;
  counter_price?: number;
  message?: string;
  created_at: string;
  expires_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  proposal?: Proposal;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_image: string;
  listing_price: number;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export interface Review {
  id: string;
  order_id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_avatar?: string;
  seller_id: string;
  listing_title: string;
  rating: number;
  comment: string;
  seller_reply?: string;
  created_at: string;
}

export interface PlatformSettings {
  default_commission_percentage: number; // ex: 8.0
  featured_pricing: {
    '7_days': number;
    '15_days': number;
    '30_days': number;
  };
  plans_pricing: {
    free: { max_listings: number; price: number };
    pro: { max_listings: number; price: number };
    enterprise: { max_listings: number; price: number };
  };
  buyer_protection_fee_percentage: number; // ex: 3.5
}
