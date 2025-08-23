# 💈 Sistema de Administração - Barbearia

Sistema completo de gerenciamento para barbearias desenvolvido com **Next.js 15** e **Supabase**. Interface moderna com tema dark/light, sidebar recolhível e controle total de agendamentos, clientes, serviços, horários de funcionamento e bloqueios de agenda.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Por que Supabase?](#por-que-supabase)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Configuração do Projeto](#configuração-do-projeto)
- [Backend - Supabase](#backend---supabase)
- [Funcionalidades](#funcionalidades)
- [Sistema de Versionamento](#sistema-de-versionamento)
- [Como Executar](#como-executar)
- [Estrutura Detalhada do Projeto](#estrutura-detalhada-do-projeto)
- [Deploy](#deploy)
- [Atualizações Recentes](#atualizações-recentes)

---

## 🔍 Visão Geral

Este é um **sistema administrativo completo** para barbearias que oferece:

- ✅ **Dashboard** com estatísticas e resumos em tempo real
- ✅ **Gestão completa de agendamentos** com correção de timezone
- ✅ **Gestão de clientes e serviços** com sistema ativo/inativo
- ✅ **Configuração de horários** otimizada e simplificada
- ✅ **Sistema de bloqueios** para feriados e manutenção
- ✅ **Interface moderna** com sidebar recolhível e tema dark/light
- ✅ **Sistema de versionamento** com histórico completo
- ✅ **Autenticação segura** via Supabase Auth
- ✅ **Responsivo** - funciona perfeitamente em mobile e desktop
- ❌ **Relatórios** (planejado - não implementado)

### 🎯 Público-Alvo
Donos de barbearias, gerentes e funcionários que precisam de uma ferramenta moderna, rápida e eficiente para gerenciar o negócio.

---

## 🤔 Por que Supabase?

### **Supabase como Backend-as-a-Service (BaaS)**

O **Supabase** foi escolhido como nossa solução de backend pelos seguintes motivos:

#### **✅ Vantagens Técnicas:**
- **PostgreSQL Real**: Banco relacional robusto, não NoSQL limitado
- **Tipagem Automática**: Gera tipos TypeScript automaticamente
- **Real-time**: Subscriptions em tempo real sem configuração complexa  
- **RLS (Row Level Security)**: Segurança a nível de linha built-in
- **API REST Auto-gerada**: CRUD automático baseado no schema
- **Auth Completo**: Sistema de autenticação robusto incluso

#### **⚡ Benefícios para o Projeto:**
- **Desenvolvimento Rápido**: Sem necessidade de desenvolver backend do zero
- **Escalabilidade**: Infraestrutura gerenciada automaticamente
- **Custo-Benefício**: Plano gratuito generoso para MVPs
- **Developer Experience**: Dashboard intuitivo e ótima documentação
- **Migrações Fáceis**: Sistema de versionamento de schema integrado

#### **🏗️ Como Funciona no Projeto:**
1. **Schema SQL**: Definimos tabelas e relacionamentos em SQL puro
2. **Políticas RLS**: Controlamos acesso a dados com políticas de segurança
3. **Tipos TypeScript**: Gerados automaticamente a partir do schema
4. **Multiple Clients**: Client browser, server e service role para diferentes cenários
5. **Fallback Strategy**: Se RLS falhar, fallback para service role automaticamente

#### **🆚 Alternativas Consideradas:**
- **Firebase**: Limitado para dados relacionais complexos
- **PlanetScale**: Ótimo, mas mais caro para hobby projects  
- **Prisma + PostgreSQL**: Require infraestrutura própria
- **MongoDB**: Não ideal para dados estruturados como agendamentos

**Resultado**: Supabase oferece o melhor equilíbrio entre funcionalidades, facilidade de uso e custo para este tipo de aplicação.

---

## 🚀 Tecnologias Utilizadas

### **Frontend & Framework**
- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router e Server Components
- **[React 19](https://reactjs.org/)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática forte
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS utilitário com CSS Variables

### **Backend & Database**
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service (BaaS) completo
  - **PostgreSQL 15** - Banco de dados relacional robusto
  - **Supabase Auth** - Sistema de autenticação completo
  - **Row Level Security (RLS)** - Segurança a nível de linha
  - **Real-time subscriptions** - Atualizações em tempo real
  - **PostgREST** - API REST auto-gerada
  - **Supabase Edge Functions** - Serverless functions (futuro)

### **UI Components & Styling**
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes React reutilizáveis de alta qualidade
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos de UI acessíveis e composáveis
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones SVG moderna
- **[class-variance-authority](https://cva.style/)** - Criação de variantes de componentes
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge inteligente de classes CSS
- **[clsx](https://github.com/lukeed/clsx)** - Utilitário para classes condicionais

### **Forms & Validation**
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento performático de formulários
- **[Zod](https://zod.dev/)** - Validação de schema TypeScript-first
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Resolvers para integração

### **State Management & Data Fetching**
- **[TanStack React Query](https://tanstack.com/query/)** - Cache inteligente e sincronização de dados
- **[TanStack React Table](https://tanstack.com/table/)** - Tabelas avançadas e interativas (futuro)
- **React Context** - Gerenciamento de estado local (tema, sidebar)

### **Date & Time**
- **[date-fns](https://date-fns.org/)** - Manipulação de datas moderna e modular
- **[React Day Picker](https://react-day-picker.js.org/)** - Seletor de datas customizável

### **Charts & Visualization**
- **[Recharts](https://recharts.org/)** - Gráficos React baseados em D3 (dashboard)

### **Development Tools**
- **[PostCSS](https://postcss.org/)** - Transformações CSS com plugins
- **[ESLint](https://eslint.org/)** - Linter JavaScript/TypeScript
- **[@tailwindcss/postcss](https://tailwindcss.com/)** - Plugin PostCSS do Tailwind
- **[tw-animate-css](https://github.com/jjranalli/tailwind-animate)** - Animações CSS com Tailwind

---

## 🏗️ Arquitetura do Sistema

### **Padrão de Arquitetura**
O sistema utiliza uma arquitetura **Client-Server** moderna:

- **App Router** (Next.js 15) - Roteamento baseado em sistema de arquivos
- **Server-Side Rendering (SSR)** - Renderização no servidor para SEO e performance
- **Client-Side Rendering (CSR)** - Componentes interativos no browser
- **Static Site Generation (SSG)** - Geração estática quando possível
- **API Routes** - Endpoints internos para integrações

### **Estrutura de Camadas**

```
┌─────────────────────────────────────────────────────┐
│                 CLIENT (Browser)                    │
├─────────────────────────────────────────────────────┤
│           React Components + UI (shadcn/ui)        │
├─────────────────────────────────────────────────────┤
│         State Management (Context + React Query)   │
├─────────────────────────────────────────────────────┤
│               Next.js 15 (App Router)              │
├─────────────────────────────────────────────────────┤
│        Supabase Client (Multiple Configurations)   │
│  • Browser Client (RLS) • Server Client • Service  │
├─────────────────────────────────────────────────────┤
│                 SUPABASE (BaaS)                     │
│     • Auth • PostgREST API • Realtime • Storage    │
├─────────────────────────────────────────────────────┤
│              PostgreSQL 15 (Database)              │
│        • Tables • RLS Policies • Functions         │
└─────────────────────────────────────────────────────┘
```

### **Fluxo de Dados**

1. **Usuário interage** com componentes React (páginas/formulários)
2. **Componentes** fazem requisições via hooks do React Query + Supabase Client
3. **Next.js** determina se renderiza no servidor (SSR) ou cliente (CSR)
4. **Supabase Client** comunica com a API PostgREST (respeita RLS)
5. **Fallback Strategy** - Se RLS falhar, usa Service Role automaticamente
6. **PostgreSQL** processa queries e retorna dados estruturados
7. **UI atualizada** automaticamente via cache do React Query
8. **Real-time** - Mudanças no banco refletem instantaneamente (futuro)

---

## ⚙️ Configuração do Projeto

### **Pré-requisitos**
- **Node.js 18+** (recomendado: Node.js 20 LTS)
- **npm**, **yarn**, **pnpm** ou **bun**
- **Conta no Supabase** (gratuita)
- **Editor recomendado**: VS Code com extensões TypeScript

### **1. Clone o Repositório**
```bash
git clone <url-do-repositorio>
cd barbearia-admin
```

### **2. Instale as Dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### **3. Configure as Variáveis de Ambiente**

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
```

**⚠️ Importante**: 
- Obtenha essas chaves no [Dashboard do Supabase](https://supabase.com/dashboard)
- Vá em **Settings** → **API** → **Project API keys**
- **NUNCA** compartilhe ou committe a `SERVICE_ROLE_KEY`

### **4. Configure o Banco de Dados**

Execute o script SQL no **SQL Editor** do Supabase:

```sql
-- Execute o arquivo completo: supabase-rls-policies.sql
-- Ele contém:
-- • Schema completo das tabelas
-- • Políticas RLS configuradas
-- • Funções SQL personalizadas  
-- • Dados de exemplo (opcional)
```

### **5. Execute o Projeto**
```bash
# Com Turbopack (recomendado - mais rápido)
npm run dev --turbopack

# Sem Turbopack
npm run dev

# Produção
npm run build && npm run start
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🗄️ Backend - Supabase

### **Arquitetura do Supabase**

O Supabase funciona como nosso backend completo, oferecendo:

```
┌─────────────────────────────────────────┐
│            SUPABASE STACK               │
├─────────────────────────────────────────┤
│  Dashboard Web  │  CLI Tools  │  APIs   │
├─────────────────────────────────────────┤
│           Supabase Auth                 │
│    (JWT, OAuth, Magic Links)           │
├─────────────────────────────────────────┤
│            PostgREST                    │
│     (Auto-generated REST API)          │
├─────────────────────────────────────────┤
│          Realtime Server               │
│      (WebSocket subscriptions)         │
├─────────────────────────────────────────┤
│         PostgreSQL 15                  │
│  (Tables, RLS, Functions, Triggers)    │
├─────────────────────────────────────────┤
│          Cloud Infrastructure          │
│        (AWS/GCP managed)               │
└─────────────────────────────────────────┘
```

### **Configurações de Cliente**

O projeto utiliza **3 configurações diferentes** do cliente Supabase:

#### **1. Browser Client (`lib/supabase/client.ts`)**
```typescript
// Para uso em componentes client-side
// Respeita RLS e autenticação do usuário
createClient(url, anonKey)
```

#### **2. Server Client (`lib/supabase/server.ts`)**
```typescript
// Para uso em Server Components e API Routes
// Respeita RLS mas acessa cookies do servidor
createServerClient(url, anonKey, { cookies })
```

#### **3. Service Role Client (`lib/supabase/service.ts`)**
```typescript
// Para operações administrativas (fallback)
// Bypassa RLS - usado quando auth falha
createClient(url, serviceRoleKey, { 
  auth: { persistSession: false } 
})
```

### **Estratégia de Fallback**

O sistema implementa uma estratégia inteligente de fallback:

```typescript
// Exemplo do Dashboard
let { data } = await supabase
  .from('agendamentos')
  .select('*')

// Se data for null (RLS bloqueou), tenta service role
if (!data && service) {
  const { data: fallbackData } = await service
    .from('agendamentos')  
    .select('*')
  data = fallbackData
}
```

**Benefícios:**
- ✅ **Segurança**: RLS ativo por padrão
- ✅ **Confiabilidade**: Fallback automático se auth falhar  
- ✅ **Flexibilidade**: Diferentes níveis de acesso conforme necessário
- ✅ **Performance**: Cache no React Query funciona com ambos

### **Schema do Banco de Dados**

#### **Tabelas Principais**

```sql
-- Clientes da barbearia
clientes (
  id uuid PRIMARY KEY,
  nome varchar NOT NULL,
  telefone varchar UNIQUE,
  email varchar,
  data_nascimento date,
  observacoes text,
  ativo boolean DEFAULT true,
  created_at timestamptz,
  updated_at timestamptz
)

-- Serviços oferecidos
servicos (
  id uuid PRIMARY KEY,
  nome varchar NOT NULL,
  descricao text,
  duracao_minutos integer NOT NULL,
  preco numeric NOT NULL,
  ativo boolean DEFAULT true,
  created_at timestamptz,
  updated_at timestamptz
)

-- Agendamentos realizados
agendamentos (
  id uuid PRIMARY KEY,
  cliente_id uuid REFERENCES clientes(id),
  servico_id uuid REFERENCES servicos(id),
  data_agendamento date NOT NULL,
  hora_inicio time NOT NULL,
  hora_fim time NOT NULL,
  status varchar DEFAULT 'confirmado',
  observacoes text,
  valor_total numeric,
  created_at timestamptz,
  updated_at timestamptz
)

-- Horários de funcionamento
horarios_funcionamento (
  id uuid PRIMARY KEY,
  dia_semana integer NOT NULL, -- 0=Domingo, 6=Sábado
  hora_abertura time NOT NULL,
  hora_fechamento time NOT NULL,
  intervalo_inicio time,
  intervalo_fim time,
  ativo boolean DEFAULT true,
  created_at timestamptz,
  updated_at timestamptz
)

-- Bloqueios de agenda
bloqueios_agenda (
  id uuid PRIMARY KEY,
  data_bloqueio date,
  hora_inicio time,
  hora_fim time,
  motivo varchar,
  tipo varchar, -- 'feriado', 'manutencao', etc.
  created_at timestamptz
)
```

#### **Funções SQL Customizadas**

```sql
-- Buscar horários disponíveis para agendamento
CREATE FUNCTION buscar_horarios_disponiveis(
  p_data date, 
  p_servico_id uuid
) RETURNS TABLE(horario_inicio time, horario_fim time);

-- Consulta avançada de disponibilidade  
CREATE FUNCTION consultar_horarios_disponiveis_v2(
  data_param date
) RETURNS json;

-- Limpeza automática de sessões expiradas
CREATE FUNCTION limpar_sessoes_expiradas() RETURNS void;
```

#### **Políticas RLS**

Todas as tabelas possuem RLS ativo com políticas administrativas:

```sql
-- Exemplo: Acesso total para operações administrativas
CREATE POLICY "Enable all access for admin" 
ON agendamentos FOR ALL 
USING (true) WITH CHECK (true);
```

---

## ✨ Funcionalidades

### **🏠 Dashboard**
- **Estatísticas em tempo real**: Agendamentos confirmados hoje, total de clientes
- **Cards informativos**: Visual clean com ícones e números destacados
- **Fallback strategy**: Dados sempre carregam, mesmo com problemas de auth
- **Responsivo**: Layout adaptado para mobile e desktop

### **📅 Gestão de Agendamentos**
- ✅ **CRUD Completo**: Criar, visualizar, editar e excluir agendamentos
- ✅ **Formulário inteligente**: Auto-completa horário fim e preço baseado no serviço
- ✅ **Dropdowns dinâmicos**: Carrega clientes e serviços ativos automaticamente
- ✅ **Status personalizáveis**: Pendente, confirmado, cancelado, finalizado
- ✅ **Correção de timezone**: Datas exibidas corretamente (formato DD/MM/YYYY)
- ✅ **Validação robusta**: Formulários com validação em tempo real
- ✅ **Roteamento RESTful**: `/agendamentos/novo`, `/agendamentos/[id]`, `/agendamentos/[id]/editar`
- ✅ **Interface moderna**: Cards responsivos com ações rápidas inline

### **👥 Gestão de Clientes**
- ✅ **CRUD Completo**: Criar, visualizar, editar e ativar/inativar
- ✅ **Sistema ativo/inativo**: Preserva dados históricos sem exclusão definitiva
- ✅ **Feedback visual**: Clientes inativos com opacidade 60% e badge vermelho
- ✅ **Formulário completo**: Nome, telefone, email, data nascimento, observações
- ✅ **Reativação simples**: Botão verde para reativar clientes inativos
- ✅ **Validação de dados**: Email formato correto, telefone brasileiro
- ✅ **Busca futura**: Preparado para implementar filtros e busca

### **💼 Gestão de Serviços**
- ✅ **CRUD Completo**: Criar, visualizar, editar e ativar/inativar  
- ✅ **Sistema ativo/inativo**: Preserva histórico sem perder dados
- ✅ **Feedback visual**: Serviços inativos claramente identificados
- ✅ **Campos específicos**: Nome, preço (R$), duração (minutos), descrição
- ✅ **Validação financeira**: Preços sempre positivos e formatados
- ✅ **Integração com agendamentos**: Serviços inativos não aparecem em formulários

### **⏰ Configuração de Horários**
- ✅ **Interface simplificada**: Apenas editar e ativar/inativar (sem criar/excluir)
- ✅ **7 dias da semana**: Configuração independente para cada dia
- ✅ **Intervalos opcionais**: Configuração de almoço/descanso por dia
- ✅ **Sistema ativo/inativo**: Dias podem ser desativados (fechado)
- ✅ **Validação temporal**: Hora fim sempre após hora início
- ✅ **Interface otimizada**: Sem botões desnecessários, foco na edição

### **🚫 Bloqueios de Agenda**
- ✅ **CRUD Completo**: Criar, visualizar, editar e excluir bloqueios
- ✅ **Flexibilidade temporal**: Dia inteiro ou horários específicos
- ✅ **Categorização**: Feriado, manutenção, pessoal, outros
- ✅ **Descrição detalhada**: Campo motivo para explicar o bloqueio
- ✅ **Calendar picker**: Seleção visual de datas com date-fns
- ✅ **Validação de período**: Horário fim sempre após horário início

### **🎨 Interface e UX Modernas**

#### **🎯 Sidebar Recolhível**
- ✅ **Animações suaves**: Transições de 500ms com easing
- ✅ **Tooltips informativos**: Aparecem quando sidebar colapsada
- ✅ **Alinhamento perfeito**: Botão toggle sempre no mesmo lugar
- ✅ **Título limpo**: Apenas "Admin" quando expandida
- ✅ **Rodapé com versão**: Informações de versão sempre visíveis

#### **🌙 Sistema de Tema Dark/Light**
- ✅ **Toggle no header**: Botão com ícones animados (Sol/Lua)
- ✅ **Persistência**: Salva preferência no localStorage
- ✅ **Suporte ao sistema**: Detecta preferência do OS automaticamente
- ✅ **CSS Variables**: Cores consistentes em ambos os temas
- ✅ **Transições suaves**: Mudança de tema animada
- ✅ **Componentes adaptados**: Todos os componentes suportam ambos os temas

#### **🎭 Funcionalidades Visuais**
- ✅ **Design consistente**: Padrão unificado em todas as páginas
- ✅ **Feedback visual**: Loading states, confirmações, alertas contextuais
- ✅ **Estados vazios**: CTAs e ilustrações quando não há dados
- ✅ **Responsividade total**: Mobile-first, funciona em qualquer tela
- ✅ **Navegação intuitiva**: Breadcrumbs e botões de ação sempre claros
- ✅ **Micro-interações**: Hover effects e estados de foco bem definidos

### **📊 Sistema de Versionamento**
- ✅ **Histórico completo**: Todas as versões documentadas desde v1.0.0
- ✅ **Modal interativo**: Clique na versão (sidebar) abre detalhes
- ✅ **Informações detalhadas**: Nome, data, descrição e lista de features
- ✅ **Navegação no histórico**: Botão para ver todas as versões anteriores
- ✅ **Categorização**: Major, minor, patch e breaking changes identificados
- ✅ **Fácil manutenção**: Apenas um arquivo para atualizar (`lib/version-history.ts`)

### **🔐 Sistema de Autenticação**
- **Login seguro**: Via Supabase Auth com JWT tokens
- **Sessões persistentes**: Mantém login entre sessões do browser
- **Logout automático**: Por inatividade (configurável)
- **Proteção de rotas**: Middleware automático para páginas administrativas
- **Callback handling**: Tratamento correto de redirects pós-login

---

## 📈 Sistema de Versionamento

### **🎯 Como Funciona**

O sistema possui **versionamento integrado** que permite:

1. **Ver versão atual**: Sempre visível no rodapé da sidebar
2. **Detalhes da versão**: Modal com informações completas ao clicar
3. **Histórico completo**: Navegação por todas as versões já lançadas
4. **Fácil manutenção**: Sistema centralizado em arquivos dedicados

### **📁 Arquivos do Sistema**

```
lib/
├── version.ts              # Configuração da versão atual
└── version-history.ts      # Histórico completo de todas as versões

components/
└── version-info.tsx        # Componente modal interativo
```

### **🔄 Como Adicionar Nova Versão**

Para lançar uma nova versão:

1. **Edite `lib/version-history.ts`**:
```typescript
export const VERSION_HISTORY: VersionInfo[] = [
  {
    version: '2.2.0', // ← Nova versão (sempre no topo)
    name: 'Nome da Nova Release',
    releaseDate: '2025-XX-XX',
    type: 'minor', // 'major' | 'minor' | 'patch'
    breaking: false, // true se quebrar compatibilidade
    description: 'Resumo das principais mudanças...',
    features: [
      'Nova funcionalidade 1',
      'Nova funcionalidade 2', 
      'Correção importante X',
      'Melhoria de performance Y'
    ]
  },
  // versões anteriores automaticamente ficam abaixo...
]
```

2. **Atualize `package.json`**:
```json
{
  "version": "2.2.0"
}
```

**Pronto!** A versão aparecerá automaticamente em todo o sistema.

### **🏷️ Convenções de Versionamento**

Seguimos o **Semantic Versioning (SemVer)**:

- **Major** (2.0.0): Mudanças que quebram compatibilidade
- **Minor** (2.1.0): Novas funcionalidades retrocompatíveis  
- **Patch** (2.1.1): Correções de bugs apenas

**Exemplos no projeto:**
- `v1.0.0` - Versão inicial (Major)
- `v2.0.0` - Sistema CRUD completo (Major - mudança arquitetural)
- `v2.1.0` - Interface moderna + sidebar (Minor - novas features)
- `v2.2.0` - Próxima release planejada (Minor)

---

## 🏃 Como Executar

### **Desenvolvimento**
```bash
# Método recomendado (mais rápido com Turbopack)
npm run dev --turbopack

# Método tradicional
npm run dev

# Especificar porta
npm run dev --turbopack -- --port 3001
```

### **Build de Produção**
```bash
# Gerar build otimizado
npm run build

# Executar build de produção
npm run start

# Build + Start em um comando
npm run build && npm run start
```

### **Linting e Qualidade**
```bash
# Executar ESLint
npm run lint

# Corrigir problemas automaticamente
npm run lint --fix

# Verificar tipos TypeScript
npx tsc --noEmit

# Verificar tipos em modo watch
npx tsc --noEmit --watch
```

### **Comandos Úteis para Desenvolvimento**

```bash
# Limpar cache do Next.js
rm -rf .next
# ou no Windows
rmdir /s .next

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Gerar tipos do Supabase (quando schema mudar)
npx supabase gen types typescript \
  --project-id SEU_PROJECT_ID \
  --schema public > lib/supabase/types.ts

# Ver estatísticas do bundle
npm run build -- --analyze

# Executar em modo debug  
NODE_OPTIONS='--inspect' npm run dev
```

### **Variáveis de Ambiente para Diferentes Ambientes**

```bash
# .env.local (desenvolvimento)
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key

# .env.production (produção)
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co  
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=prod-service-key

# .env.staging (staging)
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-anon-key
```

---

## 📁 Estrutura Detalhada do Projeto

```
barbearia-admin/
├── 📄 README.md                     # Documentação principal do projeto
├── 📄 CLAUDE.md                     # Instruções para Claude Code AI
├── 📄 CONFIGURAR-SUPABASE.md        # Guia detalhado de configuração do Supabase
├── 📄 TESTE-CRUD.md                 # Documentação dos testes de CRUD
├── 📄 package.json                  # Dependências e scripts (v2.1.0)
├── 📄 tsconfig.json                 # Configuração TypeScript stricta
├── 📄 next.config.ts                # Configuração Next.js 15
├── 📄 postcss.config.mjs           # Configuração PostCSS para Tailwind
├── 📄 components.json               # Configuração shadcn/ui
├── 📄 supabase-rls-policies.sql     # Schema completo + políticas RLS
│
├── 📂 app/                          # App Router (Next.js 15)
│   ├── 📄 layout.tsx               # Layout raiz com providers globais
│   ├── 📄 page.tsx                 # Página inicial (redirecionamento)
│   ├── 📄 globals.css              # Estilos globais + variáveis CSS para temas
│   ├── 📄 favicon.ico              # Ícone da aplicação
│   │
│   ├── 📂 (admin)/                 # Grupo de rotas administrativas
│   │   ├── 📄 layout.tsx           # Layout admin (Sidebar + Header + Theme)
│   │   │
│   │   ├── 📂 dashboard/           # Dashboard principal
│   │   │   └── 📄 page.tsx         # Estatísticas, resumos e métricas
│   │   │
│   │   ├── 📂 agendamentos/        # Gestão completa de agendamentos
│   │   │   ├── 📄 page.tsx         # Lista de agendamentos com filtros
│   │   │   ├── 📂 [id]/            # Agendamento específico
│   │   │   │   ├── 📄 page.tsx     # Visualização detalhada
│   │   │   │   └── 📂 editar/
│   │   │   │       └── 📄 page.tsx # Formulário de edição
│   │   │   └── 📂 novo/
│   │   │       └── 📄 page.tsx     # Formulário de criação
│   │   │
│   │   ├── 📂 clientes/            # Gestão de clientes
│   │   │   ├── 📄 page.tsx         # Lista com sistema ativo/inativo
│   │   │   ├── 📂 [id]/
│   │   │   │   └── 📂 editar/
│   │   │   │       └── 📄 page.tsx # Edição de cliente
│   │   │   └── 📂 novo/
│   │   │       └── 📄 page.tsx     # Cadastro de novo cliente
│   │   │
│   │   ├── 📂 servicos/            # Gestão de serviços
│   │   │   ├── 📄 page.tsx         # Lista com sistema ativo/inativo  
│   │   │   ├── 📂 [id]/
│   │   │   │   └── 📂 editar/
│   │   │   │       └── 📄 page.tsx # Edição de serviço
│   │   │   └── 📂 novo/
│   │   │       └── 📄 page.tsx     # Cadastro de novo serviço
│   │   │
│   │   ├── 📂 horarios/            # Configuração de horários
│   │   │   ├── 📄 page.tsx         # Lista simplificada (só editar/ativar)
│   │   │   ├── 📂 [id]/
│   │   │   │   └── 📂 editar/
│   │   │   │       └── 📄 page.tsx # Edição de horário
│   │   │   └── 📂 novo/            # Mantido para compatibilidade
│   │   │       └── 📄 page.tsx
│   │   │
│   │   ├── 📂 bloqueios/           # Bloqueios de agenda
│   │   │   ├── 📄 page.tsx         # Lista de bloqueios
│   │   │   ├── 📂 [id]/
│   │   │   │   └── 📂 editar/
│   │   │   │       └── 📄 page.tsx # Edição de bloqueio
│   │   │   └── 📂 novo/
│   │   │       └── 📄 page.tsx     # Novo bloqueio
│   │   │
│   │   └── 📂 teste/               # Página de testes do Supabase
│   │       └── 📄 page.tsx         # Teste de conexão e operações
│   │
│   ├── 📂 (auth)/                  # Grupo de rotas de autenticação
│   │   ├── 📄 layout.tsx           # Layout específico para auth
│   │   └── 📂 login/
│   │       └── 📄 page.tsx         # Página de login
│   │
│   └── 📂 api/                     # API Routes do Next.js
│       └── 📂 auth/
│           └── 📂 callback/
│               └── 📄 route.ts     # Callback do Supabase Auth
│
├── 📂 components/                   # Componentes React reutilizáveis
│   ├── 📄 theme-provider.tsx       # Context Provider para tema dark/light
│   ├── 📄 theme-toggle.tsx         # Botão toggle de tema (Sol/Lua)
│   ├── 📄 version-info.tsx         # Modal de informações de versão
│   │
│   ├── 📂 admin/                   # Componentes específicos do admin
│   │   ├── 📄 header.tsx           # Cabeçalho com tema toggle
│   │   ├── 📄 sidebar.tsx          # Menu lateral recolhível
│   │   ├── 📄 sidebar-provider.tsx # Context para estado da sidebar
│   │   │
│   │   ├── 📄 agendamento-form.tsx        # Formulário inteligente de agendamentos
│   │   ├── 📄 agendamento-actions.tsx     # Ações (editar/excluir) para agendamentos
│   │   ├── 📄 agendamentos-list.tsx       # Lista de agendamentos (legacy)
│   │   ├── 📄 agendamentos-client-actions.tsx # Client actions (legacy)
│   │   │
│   │   ├── 📄 client-form.tsx             # Formulário de clientes
│   │   ├── 📄 client-actions.tsx          # Ações para clientes (ativar/inativar)
│   │   │
│   │   ├── 📄 service-form.tsx            # Formulário de serviços
│   │   ├── 📄 service-actions.tsx         # Ações para serviços (ativar/inativar)
│   │   │
│   │   ├── 📄 horario-form.tsx            # Formulário de horários
│   │   ├── 📄 horario-actions.tsx         # Ações para horários (ativar/inativar)
│   │   ├── 📄 horarios-list.tsx           # Lista simplificada de horários
│   │   ├── 📄 horarios-client-actions.tsx # Client actions para horários
│   │   │
│   │   ├── 📄 bloqueio-form.tsx           # Formulário de bloqueios
│   │   ├── 📄 bloqueio-actions.tsx        # Ações para bloqueios
│   │   ├── 📄 bloqueios-list.tsx          # Lista de bloqueios (legacy)
│   │   ├── 📄 bloqueios-client-actions.tsx # Client actions para bloqueios
│   │   │
│   │   └── 📄 supabase-test.tsx           # Componente de teste do Supabase
│   │
│   └── 📂 ui/                      # Componentes UI base (shadcn/ui)
│       ├── 📄 badge.tsx            # Badge para status/versões
│       ├── 📄 button.tsx           # Botão com variantes
│       ├── 📄 calendar.tsx         # Seletor de datas
│       ├── 📄 card.tsx             # Cards para layout
│       ├── 📄 dialog.tsx           # Modais e diálogos
│       ├── 📄 form.tsx             # Componentes de formulário
│       ├── 📄 input.tsx            # Input com variantes
│       ├── 📄 label.tsx            # Labels acessíveis
│       ├── 📄 select.tsx           # Dropdowns customizados
│       ├── 📄 switch.tsx           # Toggle switches
│       ├── 📄 table.tsx            # Tabelas responsivas
│       └── 📄 textarea.tsx         # Textarea multilinha
│
├── 📂 lib/                         # Bibliotecas e utilitários
│   ├── 📄 utils.ts                 # Utilitários gerais (cn, formatters)
│   ├── 📄 version.ts               # Configuração da versão atual
│   ├── 📄 version-history.ts       # Histórico completo de versões
│   │
│   └── 📂 supabase/                # Configurações do Supabase
│       ├── 📄 client.ts            # Cliente para browser (RLS ativo)
│       ├── 📄 server.ts            # Cliente para servidor (SSR)
│       ├── 📄 service.ts           # Service role client (admin)
│       └── 📄 types.ts             # Tipos TypeScript auto-gerados
│
├── 📂 public/                      # Arquivos estáticos
│   ├── 📄 next.svg                 # Logo do Next.js
│   ├── 📄 vercel.svg               # Logo da Vercel
│   ├── 📄 file.svg                 # Ícones diversos
│   ├── 📄 globe.svg
│   └── 📄 window.svg
│
└── 📂 node_modules/                # Dependências instaladas (auto-gerado)
```

### **🎯 Principais Diferenciais da Estrutura**

#### **📱 App Router (Next.js 15)**
- **Roteamento baseado em arquivos**: Cada pasta = rota
- **Grupos de rotas**: `(admin)` e `(auth)` não afetam URL
- **Layouts aninhados**: Layout admin apenas para páginas administrativas
- **Server Components**: Renderização no servidor por padrão

#### **🎨 Componentes Organizados**
- **`/ui`**: Componentes base reutilizáveis (design system)
- **`/admin`**: Componentes específicos do contexto administrativo
- **Separação clara**: Forms, Actions, Lists em arquivos dedicados

#### **⚙️ Configuração Centralizada**
- **Versionamento**: Sistema completo em `lib/version*`
- **Supabase**: 3 clientes diferentes para diferentes contextos
- **Temas**: Provider centralizado com persistência

#### **📊 Estratégia de Dados**
- **Multiple Clients**: Browser, Server, Service Role
- **Fallback automático**: Se RLS falhar, usa Service Role
- **Tipos seguros**: TypeScript em 100% do código

---

## 🚀 Deploy

### **Vercel (Recomendado)**

A **Vercel** é a plataforma ideal para este projeto:

#### **🎯 Por que Vercel?**
- **Integração nativa**: Criada pelo time do Next.js
- **Zero configuração**: Deploy automático do repositório
- **Edge Functions**: Performance global otimizada
- **Preview deploys**: Cada PR gera URL de teste
- **Analytics**: Métricas de performance integradas

#### **📋 Passos para Deploy**

1. **Conecte o Repositório**:
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório do GitHub
   - Autorize acesso aos repositórios

2. **Configure Variáveis de Ambiente**:
   ```bash
   # No dashboard da Vercel → Settings → Environment Variables
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
   ```

3. **Configure o Build**:
   ```bash
   # Build Command (automático)
   npm run build
   
   # Output Directory (automático)  
   .next
   
   # Node.js Version
   18.x (ou 20.x)
   ```

4. **Deploy**:
   - Clique em **Deploy**
   - Aguarde ~2-3 minutos
   - Receba URL de produção: `https://seu-app.vercel.app`

#### **🔄 CI/CD Automático**
```bash
# Cada push para main = deploy automático
git push origin main

# Pull Requests = preview deploy
# URL de preview gerada automaticamente
```

### **Outras Plataformas**

#### **Netlify**
```bash
# Build settings
Build command: npm run build
Publish directory: .next

# Environment variables (mesmo da Vercel)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

#### **Railway**
```bash
# railway.json
{
  "build": {
    "builder": "NIXPACKS"  
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### **Docker (Self-hosted)**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .
RUN npm run build

# Expose port  
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

```bash
# Build & Run
docker build -t barbearia-admin .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  barbearia-admin
```

### **🔧 Configurações de Produção**

#### **Next.js Config para Produção**
```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizações de produção
  compress: true,
  poweredByHeader: false,
  
  // Imagens otimizadas
  images: {
    domains: ['supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

#### **Variáveis de Ambiente Organizadas**
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=prod-service-key

# Analytics (opcional)
NEXT_PUBLIC_VERCEL_ANALYTICS=1
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Monitoring (opcional)  
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## 🚀 Atualizações Recentes

### **v2.1.0 - Interface Moderna e Responsiva** 
*Lançado em 22 de Agosto de 2025*

#### **🎨 Principais Novidades**
- **Sidebar Recolhível**: Menu lateral com animações suaves de 500ms e tooltips informativos
- **Sistema de Tema Completo**: Dark/Light mode com toggle animado e persistência no localStorage  
- **Correção de Timezone**: Resolução definitiva dos problemas de data em agendamentos
- **Interface de Horários Otimizada**: Removidos botões desnecessários, foco na edição e ativação
- **Sistema de Versionamento**: Modal interativo com histórico completo de versões

#### **⚡ Melhorias Técnicas**
1. **UX Aprimorada**:
   - Transições mais fluidas em toda a interface
   - Alinhamento perfeito de elementos da sidebar
   - Título simplificado e design clean
   - Tooltips contextuais quando sidebar colapsada

2. **Temas Avançados**:  
   - CSS Variables para cores consistentes
   - Suporte automático à preferência do sistema operacional
   - Ícones animados no toggle (Sol → Lua)
   - Todos os componentes adaptados para ambos os temas

3. **Correções Críticas**:
   - Datas sempre no formato brasileiro (DD/MM/YYYY)
   - Eliminação total de problemas de fuso horário
   - Consistência entre formulários e visualizações
   - Performance melhorada na renderização

#### **🔧 Arquivos Modificados/Criados**
```
components/
├── theme-provider.tsx          # Novo: Sistema de tema
├── theme-toggle.tsx            # Novo: Toggle dark/light  
├── version-info.tsx            # Novo: Modal de versão
├── admin/
│   ├── header.tsx              # Atualizado: Toggle de tema
│   ├── sidebar.tsx             # Atualizado: Recolhível + versão
│   └── sidebar-provider.tsx    # Novo: Context da sidebar

lib/
├── version.ts                  # Novo: Config da versão atual
└── version-history.ts          # Novo: Histórico completo
```

---

## 🤝 Contribuição e Desenvolvimento

### **Como Contribuir**

1. **Fork o repositório**
2. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Commit suas mudanças**:
   ```bash
   git commit -m 'feat: adiciona nova funcionalidade X'
   ```
4. **Push para a branch**:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. **Abra um Pull Request**

### **Padrões de Commit**
```bash
feat: nova funcionalidade
fix: correção de bug  
docs: atualização de documentação
style: mudanças de formatação
refactor: refatoração de código
test: adição de testes
chore: tarefas de manutenção
```

### **Roadmap Futuro**
- [ ] **Sistema de Relatórios** completo
- [ ] **Notificações Push** para agendamentos
- [ ] **API pública** para integrações
- [ ] **Aplicativo mobile** (React Native)
- [ ] **Multi-tenancy** para múltiplas barbearias
- [ ] **Integração com pagamentos**
- [ ] **Chatbot WhatsApp** para agendamentos

---

## 📝 Licença

Este projeto está licenciado sob a **MIT License**.

```
MIT License

Copyright (c) 2025 Bárbaros Barbearia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🆘 Suporte e Documentação

### **📚 Documentação Adicional**
- **[CLAUDE.md](./CLAUDE.md)** - Instruções específicas para Claude Code AI
- **[CONFIGURAR-SUPABASE.md](./CONFIGURAR-SUPABASE.md)** - Guia detalhado de configuração do Supabase
- **[TESTE-CRUD.md](./TESTE-CRUD.md)** - Documentação de testes e validações
- **[supabase-rls-policies.sql](./supabase-rls-policies.sql)** - Schema completo e políticas de segurança

### **🔗 Links Úteis**
- **[Supabase Docs](https://supabase.com/docs)** - Documentação oficial
- **[Next.js Docs](https://nextjs.org/docs)** - Guias do framework
- **[shadcn/ui](https://ui.shadcn.com)** - Biblioteca de componentes
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Framework CSS

### **💬 Suporte**
Para dúvidas ou problemas:
1. Consulte a documentação nos arquivos `.md`
2. Verifique as configurações do Supabase
3. Abra uma **issue** no repositório com:
   - Descrição detalhada do problema
   - Steps para reproduzir
   - Screenshots se aplicável
   - Logs de erro (se houver)

---

**💈 Desenvolvido com ❤️ para modernizar a gestão da Bárbaros Barbearia**

*Sistema v2.1.0 - Interface Moderna e Responsiva*