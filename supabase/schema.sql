-- ==============================================================================
-- OBRACIRCULAR - ESQUEMA DE BANCO DE DADOS POSTGRESQL / SUPABASE
-- Plataforma SaaS de Economia Circular para a Construção Civil
-- ==============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. TIPOS ENUMERADOS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'company', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_condition AS ENUM ('novo', 'sobra_de_obra', 'seminovo', 'reutilizavel');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE unit_measure AS ENUM ('unidade', 'm2', 'm3', 'litro', 'kg', 'saco', 'caixa', 'lote');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('ativo', 'pausado', 'vendido', 'sob_analise', 'removido');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('aguardando_pagamento', 'pago', 'em_separacao', 'pronto_retirada', 'enviado', 'concluido', 'cancelado', 'em_disputa');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('pix', 'cartao_credito', 'boleto');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pendente', 'aprovado', 'recusado', 'reembolsado', 'estornado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proposal_status AS ENUM ('pendente', 'aceita', 'recusada', 'contraproposta', 'expirada');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pendente', 'em_analise', 'resolvido', 'descartado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABELA DE PERFIS DE USUÁRIOS
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30),
    document VARCHAR(30), -- CPF ou CNPJ
    avatar_url TEXT,
    bio TEXT,
    role user_role NOT NULL DEFAULT 'buyer',
    is_verified BOOLEAN DEFAULT false,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    total_reviews INT DEFAULT 0,
    city VARCHAR(100),
    state VARCHAR(2),
    postal_code VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE EMPRESAS E CONSTRUTORAS (B2B)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    cnpj VARCHAR(30) NOT NULL UNIQUE,
    state_registration VARCHAR(50),
    corporate_email VARCHAR(255) NOT NULL,
    corporate_phone VARCHAR(30),
    website VARCHAR(255),
    logo_url TEXT,
    plan_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'enterprise'
    subscription_status VARCHAR(50) DEFAULT 'active',
    subscription_expires_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEMBROS DA EMPRESA
CREATE TABLE IF NOT EXISTS company_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'operator', -- 'owner', 'manager', 'operator'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- 4. TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    image_url TEXT,
    display_order INT DEFAULT 0,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE ANÚNCIOS (LISTINGS)
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    current_price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    quantity NUMERIC(12, 2) NOT NULL DEFAULT 1,
    unit_measure unit_measure NOT NULL DEFAULT 'unidade',
    condition listing_condition NOT NULL DEFAULT 'sobra_de_obra',
    brand VARCHAR(150),
    model VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    neighborhood VARCHAR(150),
    postal_code_prefix VARCHAR(10),
    delivery_available BOOLEAN DEFAULT false,
    pickup_available BOOLEAN DEFAULT true,
    shipping_notes TEXT,
    status listing_status NOT NULL DEFAULT 'ativo',
    is_featured BOOLEAN DEFAULT false,
    featured_until TIMESTAMPTZ,
    views_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE FOTOGRAFIAS DO ANÚNCIO
CREATE TABLE IF NOT EXISTS listing_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_cover BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELA DE ESTOQUE / MOVIMENTAÇÃO
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    quantity_available NUMERIC(12, 2) NOT NULL,
    quantity_reserved NUMERIC(12, 2) DEFAULT 0,
    quantity_sold NUMERIC(12, 2) DEFAULT 0,
    batch_code VARCHAR(100),
    warehouse_location TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABELA DE FAVORITOS
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- 9. TABELA DE CONVERSAS (CHAT)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    buyer_unread_count INT DEFAULT 0,
    seller_unread_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(listing_id, buyer_id, seller_id)
);

-- 10. TABELA DE MENSAGENS
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    proposal_id UUID, -- Referência opcional para proposta embutida
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABELA DE PROPOSTAS DE PREÇO
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    proposed_price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2) NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL DEFAULT 1,
    status proposal_status NOT NULL DEFAULT 'pendente',
    counter_price NUMERIC(12, 2),
    message TEXT,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(30) NOT NULL UNIQUE,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    total_amount NUMERIC(12, 2) NOT NULL,
    subtotal_amount NUMERIC(12, 2) NOT NULL,
    platform_fee_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shipping_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status order_status NOT NULL DEFAULT 'aguardando_pagamento',
    delivery_method VARCHAR(50) NOT NULL DEFAULT 'pickup', -- 'pickup', 'delivery'
    delivery_address TEXT,
    pickup_verification_code VARCHAR(20),
    paid_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
    quantity NUMERIC(12, 2) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    listing_title_snapshot VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TABELA DE PAGAMENTOS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    gateway_provider VARCHAR(50) DEFAULT 'mercadopago',
    gateway_transaction_id VARCHAR(150),
    payment_method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'pendente',
    amount NUMERIC(12, 2) NOT NULL,
    pix_qr_code TEXT,
    pix_copia_e_cola TEXT,
    installments INT DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TABELA DE COMISSÕES DO MARKETPLACE
CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    gross_amount NUMERIC(12, 2) NOT NULL,
    commission_percentage NUMERIC(5, 2) NOT NULL, -- ex: 8.00%
    commission_amount NUMERIC(12, 2) NOT NULL,
    net_seller_amount NUMERIC(12, 2) NOT NULL,
    is_settled BOOLEAN DEFAULT false,
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. TABELA DE ASSINATURAS B2B
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL, -- 'pro', 'enterprise'
    monthly_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. TABELA DE DESTAQUES PATROCINADOS
CREATE TABLE IF NOT EXISTS sponsored_promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    duration_days INT NOT NULL, -- 7, 15, 30
    price_paid NUMERIC(10, 2) NOT NULL,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. TABELA DE AVALIAÇÕES
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    seller_reply TEXT,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(order_id, buyer_id)
);

-- 19. TABELA DE NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT false,
    type VARCHAR(50) DEFAULT 'general', -- 'order', 'proposal', 'message', 'system'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. TABELA DE DENÚNCIAS E MODERAÇÃO
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reported_listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    reported_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status report_status NOT NULL DEFAULT 'pendente',
    admin_notes TEXT,
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. CONFIGURAÇÕES DA PLATAFORMA (ADMIN)
CREATE TABLE IF NOT EXISTS platform_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO platform_settings (key, value, description)
VALUES 
    ('default_commission_percentage', '{"value": 8.0}', 'Comissão padrão sobre vendas concluídas (%)'),
    ('featured_pricing', '{"7_days": 19.90, "15_days": 34.90, "30_days": 59.90}', 'Valores para destacar anúncios patrocinados (R$)'),
    ('plans_pricing', '{"free": {"max_listings": 3, "price": 0}, "pro": {"max_listings": 30, "price": 79.90}, "enterprise": {"max_listings": -1, "price": 199.90}}', 'Valores e limites de assinaturas de construtoras')
ON CONFLICT (key) DO NOTHING;

-- 22. LOGS DE AUDITORIA
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. ÍNDICES DE ALTA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_city_state ON listings(city, state);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(current_price);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- 24. POLÍTICAS DE ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de perfis: todos podem ver dados públicos, dono edita o seu
CREATE POLICY "Public profiles are visible to all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = auth_user_id);

-- Políticas de anúncios: qualquer um vê anúncios ativos, vendedor gerencia os seus
CREATE POLICY "Anyone can view active listings" ON listings FOR SELECT USING (status = 'ativo' OR auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = seller_id));
CREATE POLICY "Sellers can manage own listings" ON listings FOR ALL USING (auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = seller_id));

-- Políticas de mensagens e conversas: apenas participantes
CREATE POLICY "Participants can view conversations" ON conversations FOR SELECT USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = buyer_id OR id = seller_id)
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = sender_id)
);

-- Políticas de pedidos: apenas comprador, vendedor e admin
CREATE POLICY "Order participants can view orders" ON orders FOR SELECT USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = buyer_id OR id = seller_id)
);
