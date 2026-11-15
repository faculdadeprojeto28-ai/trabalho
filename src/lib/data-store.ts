'use client';

import { useState, useEffect } from 'react';
import {
  Listing,
  UserProfile,
  Order,
  Proposal,
  Conversation,
  Message,
  PlatformSettings,
  UserRole,
} from '@/types';
import {
  MOCK_LISTINGS,
  MOCK_USERS,
  MOCK_ORDERS,
  MOCK_PROPOSALS,
  MOCK_CONVERSATIONS,
  MOCK_SETTINGS,
} from './mock-data';

const STORAGE_KEYS = {
  CURRENT_USER: 'obracircular_current_user',
  LISTINGS: 'obracircular_listings',
  ORDERS: 'obracircular_orders',
  PROPOSALS: 'obracircular_proposals',
  CONVERSATIONS: 'obracircular_conversations',
  MESSAGES: 'obracircular_messages',
  FAVORITES: 'obracircular_favorites',
  SETTINGS: 'obracircular_settings',
};

export class MarketplaceStore {
  private static instance: MarketplaceStore;
  private listeners: Set<() => void> = new Set();

  currentUser: UserProfile = MOCK_USERS.buyer;
  listings: Listing[] = MOCK_LISTINGS;
  orders: Order[] = MOCK_ORDERS;
  proposals: Proposal[] = MOCK_PROPOSALS;
  conversations: Conversation[] = MOCK_CONVERSATIONS;
  messages: Record<string, Message[]> = {
    'conv-1': [
      {
        id: 'msg-1',
        conversation_id: 'conv-1',
        sender_id: 'user-buyer-1',
        sender_name: 'Eng. Roberto Silva',
        content: 'Olá! As vigas de peroba rosa ainda estão disponíveis para retirada no local?',
        is_read: true,
        created_at: '2026-11-14T10:45:00Z',
      },
      {
        id: 'msg-2',
        conversation_id: 'conv-1',
        sender_id: 'user-company-1',
        sender_name: 'Nova Era Engenharia S/A',
        content: 'Olá Roberto! Sim, temos o lote de 12 peças pronto para retirada no nosso pátio em Curitiba.',
        is_read: true,
        created_at: '2026-11-14T10:52:00Z',
      },
      {
        id: 'msg-3',
        conversation_id: 'conv-1',
        sender_id: 'user-buyer-1',
        sender_name: 'Eng. Roberto Silva',
        content: 'Excelente. Enviei uma proposta pelo lote fechado!',
        is_read: false,
        created_at: '2026-11-14T11:00:00Z',
      },
    ],
    'conv-2': [
      {
        id: 'msg-4',
        conversation_id: 'conv-2',
        sender_id: 'user-buyer-1',
        sender_name: 'Eng. Roberto Silva',
        content: 'Olá Mário! Já efetuei o pagamento do pedido via Pix.',
        is_read: true,
        created_at: '2026-11-14T10:16:00Z',
      },
      {
        id: 'msg-5',
        conversation_id: 'conv-2',
        sender_id: 'user-seller-1',
        sender_name: 'Mário Empreiteiro & Reformas',
        content: 'Perfeito Roberto, o produto já está separado para retirada.',
        is_read: true,
        created_at: '2026-11-14T10:20:00Z',
      },
    ],
  };
  favorites: string[] = ['prod-1', 'prod-3', 'prod-4'];
  settings: PlatformSettings = MOCK_SETTINGS;
  isInitialized = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): MarketplaceStore {
    if (!MarketplaceStore.instance) {
      MarketplaceStore.instance = new MarketplaceStore();
    }
    return MarketplaceStore.instance;
  }

  private init() {
    if (typeof window === 'undefined') return;

    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) this.currentUser = JSON.parse(storedUser);

      const storedListings = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      if (storedListings) this.listings = JSON.parse(storedListings);

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) this.orders = JSON.parse(storedOrders);

      const storedProposals = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
      if (storedProposals) this.proposals = JSON.parse(storedProposals);

      const storedConversations = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (storedConversations) this.conversations = JSON.parse(storedConversations);

      const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (storedMessages) this.messages = JSON.parse(storedMessages);

      const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (storedFavorites) this.favorites = JSON.parse(storedFavorites);

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) this.settings = JSON.parse(storedSettings);

      this.isInitialized = true;
    } catch (e) {
      console.warn('Erro ao carregar dados do LocalStorage:', e);
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(this.listings));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
      localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(this.proposals));
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(this.conversations));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.messages));
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(this.favorites));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.error('Falha ao persistir no LocalStorage:', e);
    }
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Ações de Usuário e Autenticação
  switchUser(role: UserRole | string) {
    if (role === 'buyer') this.currentUser = MOCK_USERS.buyer;
    else if (role === 'seller') this.currentUser = MOCK_USERS.seller;
    else if (role === 'company') this.currentUser = MOCK_USERS.company;
    else if (role === 'admin') this.currentUser = MOCK_USERS.admin;
    this.persist();
  }

  setUser(user: UserProfile) {
    this.currentUser = user;
    this.persist();
  }

  // Ações de Anúncios
  addListing(listingData: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'favorites_count' | 'seller'>): Listing {
    const newListing: Listing = {
      ...listingData,
      id: `prod-${Date.now()}`,
      seller_id: this.currentUser.id,
      seller: this.currentUser,
      views_count: 1,
      favorites_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.listings = [newListing, ...this.listings];
    this.persist();
    return newListing;
  }

  updateListing(id: string, updates: Partial<Listing>): Listing | null {
    const index = this.listings.findIndex((item) => item.id === id);
    if (index === -1) return null;

    this.listings[index] = {
      ...this.listings[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.persist();
    return this.listings[index];
  }

  deleteListing(id: string): boolean {
    const initialLen = this.listings.length;
    this.listings = this.listings.filter((item) => item.id !== id);
    this.persist();
    return this.listings.length < initialLen;
  }

  toggleFavorite(listingId: string): boolean {
    const exists = this.favorites.includes(listingId);
    if (exists) {
      this.favorites = this.favorites.filter((id) => id !== listingId);
    } else {
      this.favorites = [...this.favorites, listingId];
    }

    // Atualiza contador no anúncio
    this.listings = this.listings.map((item) => {
      if (item.id === listingId) {
        return {
          ...item,
          favorites_count: Math.max(0, item.favorites_count + (exists ? -1 : 1)),
        };
      }
      return item;
    });

    this.persist();
    return !exists;
  }

  incrementViews(listingId: string) {
    this.listings = this.listings.map((item) => {
      if (item.id === listingId) {
        return { ...item, views_count: item.views_count + 1 };
      }
      return item;
    });
    this.persist();
  }

  // Ações de Propostas
  createProposal(
    listing: Listing,
    proposedPrice: number,
    quantity: number,
    message?: string
  ): Proposal {
    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      listing_id: listing.id,
      listing_title: listing.title,
      listing_image: listing.images[0] || '',
      buyer_id: this.currentUser.id,
      buyer_name: this.currentUser.full_name,
      seller_id: listing.seller_id,
      seller_name: listing.seller.full_name,
      proposed_price: proposedPrice,
      original_price: listing.current_price,
      quantity,
      status: 'pendente',
      message,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    };

    this.proposals = [newProposal, ...this.proposals];

    // Cria ou atualiza conversa
    let conv = this.conversations.find(
      (c) => c.listing_id === listing.id && c.buyer_id === this.currentUser.id
    );

    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        listing_id: listing.id,
        listing_title: listing.title,
        listing_image: listing.images[0] || '',
        listing_price: listing.current_price,
        buyer_id: this.currentUser.id,
        buyer_name: this.currentUser.full_name,
        seller_id: listing.seller_id,
        seller_name: listing.seller.full_name,
        last_message: `Proposta de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposedPrice)} enviada.`,
        last_message_at: new Date().toISOString(),
        unread_count: 1,
      };
      this.conversations = [conv, ...this.conversations];
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conv.id,
      sender_id: this.currentUser.id,
      sender_name: this.currentUser.full_name,
      content: message || `Enviei uma proposta de preço: R$ ${proposedPrice}`,
      proposal: newProposal,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    this.messages[conv.id] = [...(this.messages[conv.id] || []), newMsg];
    this.persist();
    return newProposal;
  }

  updateProposalStatus(proposalId: string, status: Proposal['status'], counterPrice?: number): Proposal | null {
    const idx = this.proposals.findIndex((p) => p.id === proposalId);
    if (idx === -1) return null;

    this.proposals[idx] = {
      ...this.proposals[idx],
      status,
      counter_price: counterPrice,
    };
    this.persist();
    return this.proposals[idx];
  }

  // Ações de Pedidos e Checkout
  createOrder(
    listing: Listing,
    quantity: number,
    deliveryMethod: 'pickup' | 'delivery',
    paymentMethod: Order['payment_method'],
    deliveryAddress?: string
  ): Order {
    const subtotal = listing.current_price * quantity;
    const platformFee = Math.round(subtotal * (this.settings.default_commission_percentage / 100) * 100) / 100;
    const shippingAmount = deliveryMethod === 'delivery' ? 45.0 : 0.0;
    const total = subtotal + shippingAmount;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_code: `OC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      buyer_id: this.currentUser.id,
      buyer: this.currentUser,
      seller_id: listing.seller_id,
      seller: listing.seller,
      listing_id: listing.id,
      listing,
      quantity,
      unit_price: listing.current_price,
      subtotal_amount: subtotal,
      platform_fee_amount: platformFee,
      shipping_amount: shippingAmount,
      total_amount: total,
      status: 'pago',
      delivery_method: deliveryMethod,
      delivery_address: deliveryAddress,
      pickup_verification_code: `OC-${Math.floor(1000 + Math.random() * 9000)}`,
      payment_method: paymentMethod,
      payment_status: 'aprovado',
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    this.orders = [newOrder, ...this.orders];

    // Atualiza estoque do anúncio
    const remainingQty = Math.max(0, listing.quantity - quantity);
    this.updateListing(listing.id, {
      quantity: remainingQty,
      status: remainingQty === 0 ? 'vendido' : listing.status,
    });

    this.persist();
    return newOrder;
  }

  // Mensagens
  sendMessage(conversationId: string, content: string): Message {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: this.currentUser.id,
      sender_name: this.currentUser.full_name,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    this.messages[conversationId] = [...(this.messages[conversationId] || []), newMsg];

    this.conversations = this.conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          last_message: content,
          last_message_at: new Date().toISOString(),
        };
      }
      return c;
    });

    this.persist();
    return newMsg;
  }

  // Configurações Administrativas
  updateSettings(newSettings: Partial<PlatformSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.persist();
  }

  resetToDefault() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.currentUser = MOCK_USERS.buyer;
    this.listings = MOCK_LISTINGS;
    this.orders = MOCK_ORDERS;
    this.proposals = MOCK_PROPOSALS;
    this.conversations = MOCK_CONVERSATIONS;
    this.favorites = ['prod-1', 'prod-3', 'prod-4'];
    this.settings = MOCK_SETTINGS;
    this.persist();
  }
}

// React Hook personalizado para sincronização reativa com o Store
export function useMarketplace() {
  const store = MarketplaceStore.getInstance();
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return () => {
      unsubscribe();
    };
  }, [store]);

  return {
    currentUser: store.currentUser,
    listings: store.listings,
    orders: store.orders,
    proposals: store.proposals,
    conversations: store.conversations,
    messages: store.messages,
    favorites: store.favorites,
    settings: store.settings,
    switchUser: (role: UserRole | string) => store.switchUser(role),
    setUser: (u: UserProfile) => store.setUser(u),
    addListing: (l: Parameters<typeof store.addListing>[0]) => store.addListing(l),
    updateListing: (id: string, u: Partial<Listing>) => store.updateListing(id, u),
    deleteListing: (id: string) => store.deleteListing(id),
    toggleFavorite: (id: string) => store.toggleFavorite(id),
    incrementViews: (id: string) => store.incrementViews(id),
    createProposal: (l: Listing, price: number, qty: number, msg?: string) =>
      store.createProposal(l, price, qty, msg),
    updateProposalStatus: (id: string, s: Proposal['status'], c?: number) =>
      store.updateProposalStatus(id, s, c),
    createOrder: (
      l: Listing,
      qty: number,
      deliveryMethod: 'pickup' | 'delivery',
      paymentMethod: Order['payment_method'],
      addr?: string
    ) => store.createOrder(l, qty, deliveryMethod, paymentMethod, addr),
    sendMessage: (convId: string, content: string) => store.sendMessage(convId, content),
    updateSettings: (s: Partial<PlatformSettings>) => store.updateSettings(s),
    resetToDefault: () => store.resetToDefault(),
  };
}
