# 🏗️ ObraCircular — Marketplace de Economia Circular da Construção Civil

> **"Sua sobra vale. Sua obra economiza."**

Plataforma SaaS web profissional desenvolvida para o mercado brasileiro, destinada à compra e venda de materiais de construção excedentes, sobras de reformas, pontas de estoque e materiais reutilizáveis (demolição nobre). Conecta pessoas físicas, empreiteiros, arquitetos, lojas e grandes construtoras a compradores interessados em economia e sustentabilidade.

---

## 🚀 Tecnologias Utilizadas

- **Framework:** Next.js 16 (App Router) com React 19 e TypeScript
- **Estilização:** Tailwind CSS v4 com sistema de design tokens (Verde-Floresta, Verde-Esmeralda, modo claro e escuro)
- **Ícones:** Lucide React
- **Banco de Dados & Storage:** Supabase (PostgreSQL 15+) com Row Level Security (RLS) completo
- **Dual-Engine Store:** Funcionamento imediato out-of-the-box com persistência reativa local e sincronização automática com Supabase
- **Pagamentos:** Arquitetura para Mercado Pago Sandbox & Produção (Pix instantâneo e Cartão até 12x com custódia segura)
- **Inteligência Artificial:** CivilTech AI Assistant para sugestão técnica de títulos, descrições para engenharia civil e estimativa de faixa de preço

---

## 📦 15 Categorias de Materiais Suportadas

1. **Pisos e revestimentos** (pisos vinílicos, laminados, pastilhas, rodapés)
2. **Porcelanatos e cerâmicas** (polidos, acetinados, rústicos, grandes formatos)
3. **Cimentos e argamassas** (CP-II, CP-IV, argamassas AC-I, AC-II, AC-III, rejuntes)
4. **Tijolos e blocos** (concreto estrutural, cerâmicos, blocos de gesso e ecológicos)
5. **Madeiras e MDF** (chapas de MDF, compensados, vigas, pontaletes, sarrafos)
6. **Tintas e acessórios** (acrílica fosca, esmalte sintético, rolos, pincéis)
7. **Materiais elétricos** (fios e cabos flexíveis, disjuntores, quadros DIN)
8. **Materiais hidráulicos** (tubos PVC esgoto, soldáveis tigre, registros)
9. **Portas e janelas** (madeira maciça, alumínio, blindex, pivotantes)
10. **Ferragens e ferramentas** (fechaduras digitais, dobradiças, betoneiras)
11. **Louças e metais sanitários** (bacias acopladas duo, cubas, torneiras gourmet)
12. **Telhas e coberturas** (termoacústicas sanduíche, cerâmicas, calhas)
13. **Pedras, granitos e mármores** (bancadas, soleiras, pingadeiras, travertino)
14. **Materiais de demolição** (peroba-rosa centenária, tijolos caipiras maciços)
15. **Outros materiais** (drywall, gesso acartonado, isolamento termoacústico)

---

## 🛠️ Instalação e Execução Local

### Pré-requisitos
- Node.js 18+ (recomendado Node 20+)
- npm ou yarn

### 1. Clonar o repositório
```bash
git clone https://github.com/faculdadeprojeto28-ai/trabalho.git
cd trabalho
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente (opcional para testes locais)
```bash
cp .env.example .env.local
```
*A plataforma já conta com dual-engine store que funciona de forma 100% interativa mesmo antes de plugar as chaves remotas.*

### 4. Executar em modo de desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 5. Executar testes automatizados
```bash
npm test
```

---

## 🛡️ Contas de Teste Integradas (1 Clique)

Na barra superior da plataforma, há um seletor rápido para alternar entre os papéis:

1. **👷 Comprador:** `Eng. Roberto Silva` — Permite buscar, filtrar, favoritar, negociar propostas, simular checkout com Pix/Cartão e acompanhar pedidos.
2. **🔨 Vendedor Particular:** `Mário Empreiteiro` — Acessa o dashboard do vendedor, responde propostas, pausa e gerencia estoque.
3. **🏢 Construtora B2B:** `Nova Era Engenharia S/A` — Simula grandes lotes, exportação fiscal e pontas de estoque certificadas.
4. **🛡️ Administrador Geral:** `Admin ObraCircular` — Acesso irrestrito a `/admin` para métricas de GMV, moderação de anúncios, alteração de comissão (padrão 8%) e exportação de CSV.

---

## 🗄️ Banco de Dados & Migração Supabase

O esquema PostgreSQL completo com as 20 tabelas relacionais, tipos enumerados, índices de alta performance e políticas de **Row Level Security (RLS)** está disponível em:

📁 `supabase/schema.sql`

Para aplicar no seu Supabase:
1. Abra o painel do seu projeto no Supabase (`https://app.supabase.com`).
2. Vá em **SQL Editor** -> **New Query**.
3. Cole o conteúdo de `supabase/schema.sql` e execute.

---

## 📋 Checklist de Configuração para Produção

- [ ] **Supabase:** Criar projeto, executar `supabase/schema.sql` e configurar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] **Mercado Pago:** Criar aplicação no portal de desenvolvedores do Mercado Pago, obter `MERCADOPAGO_ACCESS_TOKEN` e cadastrar o endpoint de webhook `https://seu-dominio.com.br/api/webhooks/mercadopago`.
- [ ] **Domínio & SSL:** Apontar DNS na Vercel ou provedor com HTTPS forçado.
- [ ] **Jurídico & LGPD:** Nomear Encarregado de Dados (DPO) e revisar a minuta de Termos de Uso em `/termos` e Política de Privacidade em `/privacidade`.
- [ ] **E-mails Transacionais:** Configurar serviço SMTP/Resend para notificações de aprovação de pedidos e novas propostas.

---

## 📄 Licença
Projeto desenvolvido para fins acadêmicos e demonstração tecnológica de marketplace SaaS de Economia Circular na Construção Civil.
