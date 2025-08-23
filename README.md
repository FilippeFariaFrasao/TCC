# 💈 Sistema de Administração - Barbearia

Sistema completo de gerenciamento para barbearias desenvolvido com **Next.js 15** e **Supabase**. Permite controle total de agendamentos, clientes, serviços, horários de funcionamento e bloqueios de agenda.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Configuração do Projeto](#configuração-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Funcionalidades](#funcionalidades)
- [Como Executar](#como-executar)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Deploy](#deploy)

---

## 🔍 Visão Geral

Este é um **sistema administrativo completo** para barbearias que oferece:

- ✅ **Dashboard** com estatísticas e resumos
- ✅ **Gestão completa de agendamentos** (CRUD completo com formulários inteligentes)
- ✅ **Gestão completa de clientes** (CRUD completo com sistema ativo/inativo)
- ✅ **Gestão completa de serviços** (CRUD completo com sistema ativo/inativo)
- ✅ **Configuração de horários de funcionamento** (CRUD completo)
- ✅ **Sistema de bloqueios de agenda** (CRUD completo - feriados, manutenção, etc.)
- ✅ **Sistema inteligente de ativação/inativação** (preserva dados sem exclusão definitiva)
- ✅ **Interface moderna e responsiva** com feedback visual completo
- ✅ **Autenticação segura** via Supabase Auth
- ❌ **Relatórios** (planejado - não implementado)

### 🎯 Público-Alvo
Donos de barbearias, gerentes e funcionários que precisam de uma ferramenta moderna e eficiente para gerenciar o negócio.

---

## 🚀 Tecnologias Utilizadas

### **Frontend & Framework**
- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://reactjs.org/)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário

### **Backend & Database**
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service (BaaS)
  - **PostgreSQL** - Banco de dados relacional
  - **Supabase Auth** - Sistema de autenticação
  - **Row Level Security (RLS)** - Segurança a nível de linha
  - **Real-time subscriptions** - Atualizações em tempo real

### **UI Components & Styling**
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes React reutilizáveis
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos de UI acessíveis
- **[Lucide React](https://lucide.dev/)** - Ícones SVG
- **[Tailwind Merge](https://github.com/dcastil/tailwind-merge)** - Utilitário para merge de classes CSS

### **Forms & Validation**
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schema TypeScript-first
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Resolvers para validação

### **State Management & Data Fetching**
- **[TanStack React Query](https://tanstack.com/query/)** - Cache e sincronização de dados
- **[TanStack React Table](https://tanstack.com/table/)** - Tabelas avançadas e interativas

### **Date & Time**
- **[date-fns](https://date-fns.org/)** - Manipulação de datas
- **[React Day Picker](https://react-day-picker.js.org/)** - Seletor de datas

### **Charts & Visualization**
- **[Recharts](https://recharts.org/)** - Gráficos React para dashboard

### **Development Tools**
- **[PostCSS](https://postcss.org/)** - Transformações CSS
- **[ESLint](https://eslint.org/)** - Linter JavaScript/TypeScript

---

## 🏗️ Arquitetura do Sistema

### **Padrão de Arquitetura**
- **App Router** (Next.js 15) - Roteamento baseado em diretórios
- **Server-Side Rendering (SSR)** - Renderização no servidor
- **Client-Side Rendering (CSR)** - Componentes interativos
- **API Routes** - Endpoints internos do Next.js

### **Estrutura de Camadas**

```
┌─────────────────────────────────────────┐
│             FRONTEND (Next.js)          │
├─────────────────────────────────────────┤
│        UI Components (shadcn/ui)        │
├─────────────────────────────────────────┤
│     State Management (React Query)      │
├─────────────────────────────────────────┤
│       Supabase Client (JavaScript)      │
├─────────────────────────────────────────┤
│           SUPABASE (Backend)            │
├─────────────────────────────────────────┤
│        PostgreSQL (Database)           │
└─────────────────────────────────────────┘
```

### **Fluxo de Dados**

1. **Usuário interage** com a interface (páginas React)
2. **Componentes** fazem requisições via hooks do React Query
3. **Supabase Client** comunica com a API do Supabase
4. **Supabase** processa e retorna dados do PostgreSQL
5. **UI é atualizada** automaticamente via cache do React Query

---

## ⚙️ Configuração do Projeto

### **Pré-requisitos**
- Node.js 18+ 
- npm, yarn, pnpm ou bun
- Conta no Supabase

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
- Vá em **Settings** → **API**
- **NUNCA** compartilhe a `SERVICE_ROLE_KEY`

### **4. Configure o Banco de Dados**

Execute o script SQL no **SQL Editor** do Supabase:

```sql
-- Veja o arquivo: supabase-rls-policies.sql
-- Ele contém todas as tabelas, políticas RLS e dados iniciais
```

### **5. Execute o Projeto**
```bash
npm run dev --turbopack
# ou
yarn dev
# ou
pnpm dev --turbopack
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🗄️ Banco de Dados

### **Tecnologia**
- **PostgreSQL** via Supabase
- **Row Level Security (RLS)** ativado
- **Políticas de segurança** configuradas
- **Funções SQL** personalizadas

### **Esquema do Banco (`public`)**

#### **Tabelas Principais**

```sql
-- Clientes da barbearia
CREATE TABLE clientes (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome            varchar NOT NULL,
    telefone        varchar NOT NULL UNIQUE,
    email           varchar NULL,
    data_nascimento date NULL,
    observacoes     text NULL,
    ativo           boolean DEFAULT true,
    created_at      timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at      timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Serviços oferecidos
CREATE TABLE servicos (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome             varchar NOT NULL,
    descricao        text NULL,
    duracao_minutos  integer NOT NULL,
    preco            numeric NOT NULL,
    ativo            boolean DEFAULT true,
    created_at       timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at       timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Agendamentos realizados
CREATE TABLE agendamentos (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id        uuid REFERENCES clientes(id),
    servico_id        uuid REFERENCES servicos(id),
    data_agendamento  date NOT NULL,
    hora_inicio       time NOT NULL,
    hora_fim          time NOT NULL,
    status            varchar DEFAULT 'confirmado',
    observacoes       text NULL,
    valor_total       numeric NULL,
    created_at        timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at        timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Horários de funcionamento
CREATE TABLE horarios_funcionamento (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dia_semana        integer NOT NULL, -- 0=Domingo, 6=Sábado
    hora_abertura     time NOT NULL,
    hora_fechamento   time NOT NULL,
    intervalo_inicio  time NULL,
    intervalo_fim     time NULL,
    ativo             boolean DEFAULT true,
    created_at        timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at        timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Bloqueios de agenda (feriados, manutenção)
CREATE TABLE bloqueios_agenda (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    data_bloqueio  date NULL,
    hora_inicio    time NULL,
    hora_fim       time NULL,
    motivo         varchar NULL,
    tipo           varchar NULL, -- 'feriado', 'manutencao', etc.
    created_at     timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Feriados
CREATE TABLE feriados (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    data           date NULL,
    descricao      varchar NULL,
    tipo           varchar NULL,
    funcionamento  varchar DEFAULT 'fechado'
);

-- Sessões de conversa (para futura integração com chatbot)
CREATE TABLE sessoes_conversa (
    id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id             uuid REFERENCES clientes(id),
    telefone               varchar NOT NULL,
    estado_atual           varchar DEFAULT 'inicial',
    contexto               jsonb DEFAULT '{}',
    ultima_mensagem        text NULL,
    aguardando_resposta    boolean DEFAULT false,
    servico_selecionado    uuid REFERENCES servicos(id),
    data_selecionada       date NULL,
    horario_selecionado    time NULL,
    criado_em              timestamptz DEFAULT CURRENT_TIMESTAMP,
    atualizado_em          timestamptz DEFAULT CURRENT_TIMESTAMP,
    expira_em              timestamptz DEFAULT CURRENT_TIMESTAMP + interval '30 minutes'
);
```

#### **Funções SQL Personalizadas**

```sql
-- Buscar horários disponíveis para agendamento
CREATE OR REPLACE FUNCTION buscar_horarios_disponiveis(
    p_data date, 
    p_servico_id uuid
) RETURNS TABLE(horario_inicio time, horario_fim time);

-- Versão aprimorada da consulta de horários
CREATE OR REPLACE FUNCTION consultar_horarios_disponiveis_v2(
    data_param date
) RETURNS json;

-- Limpeza automática de sessões expiradas
CREATE OR REPLACE FUNCTION limpar_sessoes_expiradas() 
RETURNS void;
```

#### **Políticas RLS (Row Level Security)**

Todas as tabelas principais possuem RLS ativado com políticas que permitem acesso total para operações de administração:

```sql
-- Exemplo de política para agendamentos
CREATE POLICY "Enable all access for admin" ON agendamentos
FOR ALL USING (true) WITH CHECK (true);
```

#### **Relacionamentos**

```
clientes (1) ──── (N) agendamentos
servicos (1) ──── (N) agendamentos
clientes (1) ──── (N) sessoes_conversa
servicos (1) ──── (N) sessoes_conversa
```

---

## ✨ Funcionalidades

### **🏠 Dashboard**
- Resumo de agendamentos do dia
- Estatísticas de clientes
- Gráficos de desempenho
- Próximos agendamentos

### **📅 Gestão de Agendamentos**
- ✅ **CRUD Completo**: Criar, visualizar, editar e excluir agendamentos
- ✅ **Formulário inteligente**: Auto-completa horário de fim e preço baseado no serviço
- ✅ **Dropdowns dinâmicos**: Carrega clientes e serviços automaticamente
- ✅ **Roteamento dedicado**: `/agendamentos/novo` e `/agendamentos/[id]/editar`
- ✅ **Status personalizáveis**: pendente, confirmado, cancelado, finalizado
- ✅ **Visualização individual** por ID com detalhes completos
- ✅ **Interface moderna**: Cards responsivos com ações rápidas

### **👥 Gestão de Clientes**
- ✅ **CRUD Completo**: Criar, visualizar, editar e ativar/inativar clientes
- ✅ **Sistema ativo/inativo**: Preserva dados sem exclusão definitiva
- ✅ **Feedback visual**: Clientes inativos aparecem com opacidade reduzida e badge
- ✅ **Formulário completo**: Nome, telefone, email, data nascimento, observações
- ✅ **Reativação fácil**: Botão para reativar clientes inativos
- ✅ **Roteamento dedicado**: `/clientes/novo` e `/clientes/[id]/editar`

### **💼 Gestão de Serviços** 
- ✅ **CRUD Completo**: Criar, visualizar, editar e ativar/inativar serviços
- ✅ **Sistema ativo/inativo**: Preserva dados sem exclusão definitiva
- ✅ **Feedback visual**: Serviços inativos aparecem com opacidade reduzida e badge
- ✅ **Formulário completo**: Nome, preço, duração, descrição, status ativo
- ✅ **Reativação fácil**: Botão para reativar serviços inativos
- ✅ **Roteamento dedicado**: `/servicos/novo` e `/servicos/[id]/editar`

### **⏰ Configuração de Horários**
- ✅ **CRUD Completo**: Criar, visualizar, editar e excluir horários
- ✅ **Configuração por dia**: 7 dias da semana independentes
- ✅ **Intervalos opcionais**: Almoço/descanso configuráveis
- ✅ **Formulário inteligente**: Dropdown de dias da semana
- ✅ **Roteamento dedicado**: `/horarios/novo` e `/horarios/[id]/editar`

### **🚫 Bloqueios de Agenda**
- ✅ **CRUD Completo**: Criar, visualizar, editar e excluir bloqueios
- ✅ **Bloqueios flexíveis**: Dia inteiro ou horários específicos
- ✅ **Tipos configuráveis**: Feriado, manutenção, pessoal, outros
- ✅ **Descrição detalhada**: Motivo e observações do bloqueio
- ✅ **Roteamento dedicado**: `/bloqueios/novo` e `/bloqueios/[id]/editar`

### **🎨 Interface e UX**
- ✅ **Design consistente**: Padrão unified em todas as páginas
- ✅ **Feedback visual**: Loading states, confirmações, alertas
- ✅ **Estados vazios**: CTAs e ícones quando não há dados
- ✅ **Responsividade**: Funciona perfeitamente em mobile e desktop
- ✅ **Navegação intuitiva**: Breadcrumbs e botões de ação claros

### **🔐 Sistema de Autenticação**
- Login seguro via Supabase Auth
- Sessões persistentes
- Logout automático por inatividade
- Proteção de rotas administrativas

---

## 🏃 Como Executar

### **Desenvolvimento**
```bash
# Com Turbopack (recomendado - mais rápido)
npm run dev --turbopack

# Sem Turbopack
npm run dev
```

### **Build de Produção**
```bash
npm run build
npm run start
```

### **Linting**
```bash
npm run lint
```

### **Comandos Úteis**

```bash
# Instalar dependências
npm install

# Limpar cache do Next.js
rm -rf .next

# Verificar tipos TypeScript
npx tsc --noEmit

# Gerar tipos do Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

---

## 📁 Estrutura de Pastas

```
barbearia-admin/
├── app/                          # App Router (Next.js 15)
│   ├── (admin)/                  # Rotas administrativas
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── agendamentos/         # Gestão de agendamentos
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx     # Agendamento individual
│   │   │   │   └── editar/      
│   │   │   │       └── page.tsx # Editar agendamento
│   │   │   ├── novo/
│   │   │   │   └── page.tsx     # Criar agendamento
│   │   │   └── page.tsx         # Lista de agendamentos
│   │   ├── clientes/            # Gestão de clientes
│   │   │   ├── [id]/
│   │   │   │   └── editar/
│   │   │   │       └── page.tsx # Editar cliente
│   │   │   ├── novo/
│   │   │   │   └── page.tsx     # Criar cliente
│   │   │   └── page.tsx         # Lista de clientes
│   │   ├── servicos/            # Gestão de serviços
│   │   │   ├── [id]/
│   │   │   │   └── editar/
│   │   │   │       └── page.tsx # Editar serviço
│   │   │   ├── novo/
│   │   │   │   └── page.tsx     # Criar serviço
│   │   │   └── page.tsx         # Lista de serviços
│   │   ├── horarios/            # Configuração de horários
│   │   │   ├── [id]/
│   │   │   │   └── editar/
│   │   │   │       └── page.tsx # Editar horário
│   │   │   ├── novo/
│   │   │   │   └── page.tsx     # Criar horário
│   │   │   └── page.tsx         # Lista de horários
│   │   ├── bloqueios/           # Bloqueios de agenda
│   │   │   ├── [id]/
│   │   │   │   └── editar/
│   │   │   │       └── page.tsx # Editar bloqueio
│   │   │   ├── novo/
│   │   │   │   └── page.tsx     # Criar bloqueio
│   │   │   └── page.tsx         # Lista de bloqueios
│   │   ├── teste/               # Página de testes
│   │   └── layout.tsx           # Layout do admin
│   ├── (auth)/                  # Rotas de autenticação
│   │   ├── login/               # Página de login
│   │   └── layout.tsx           # Layout de auth
│   ├── api/                     # API Routes
│   │   └── auth/
│   │       └── callback/        # Callback do Supabase Auth
│   ├── globals.css              # Estilos globais
│   ├── layout.tsx               # Layout raiz
│   └── page.tsx                 # Página inicial
├── components/                   # Componentes React
│   ├── admin/                   # Componentes específicos do admin
│   │   ├── agendamento-form.tsx         # Formulário de agendamentos
│   │   ├── agendamento-actions.tsx      # Ações de agendamentos
│   │   ├── agendamentos-list.tsx        # Lista de agendamentos (legacy)
│   │   ├── agendamentos-client-actions.tsx # Ações legacy
│   │   ├── client-form.tsx              # Formulário de clientes
│   │   ├── client-actions.tsx           # Ações de clientes
│   │   ├── service-form.tsx             # Formulário de serviços
│   │   ├── service-actions.tsx          # Ações de serviços
│   │   ├── horario-form.tsx             # Formulário de horários
│   │   ├── horario-actions.tsx          # Ações de horários
│   │   ├── bloqueio-form.tsx            # Formulário de bloqueios
│   │   ├── bloqueio-actions.tsx         # Ações de bloqueios
│   │   ├── bloqueios-list.tsx           # Lista de bloqueios (legacy)
│   │   ├── bloqueios-client-actions.tsx # Ações legacy
│   │   ├── horarios-list.tsx            # Lista de horários (legacy)
│   │   ├── horarios-client-actions.tsx  # Ações legacy
│   │   ├── header.tsx                   # Cabeçalho do admin
│   │   ├── sidebar.tsx                  # Menu lateral
│   │   └── supabase-test.tsx            # Componente de teste
│   └── ui/                              # Componentes UI (shadcn/ui)
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── switch.tsx                   # Componente Switch
│       ├── textarea.tsx                 # Componente Textarea
│       └── table.tsx
├── lib/                         # Bibliotecas e utilitários
│   ├── supabase/               # Configuração do Supabase
│   │   ├── client.ts           # Cliente para uso no browser
│   │   ├── server.ts           # Cliente para uso no servidor
│   │   ├── service.ts          # Cliente com service role
│   │   └── types.ts            # Tipos TypeScript gerados
│   └── utils.ts                # Utilitários gerais
├── public/                     # Arquivos estáticos
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .env.local                  # Variáveis de ambiente (não commitado)
├── CLAUDE.md                   # Instruções para o Claude Code
├── CONFIGURAR-SUPABASE.md      # Guia de configuração do Supabase
├── TESTE-CRUD.md               # Documentação de testes CRUD
├── components.json             # Configuração do shadcn/ui
├── next.config.ts              # Configuração do Next.js
├── package.json                # Dependências e scripts
├── postcss.config.mjs          # Configuração do PostCSS
├── supabase-rls-policies.sql   # Script SQL com schema completo
├── tailwind.config.js          # Configuração do Tailwind CSS
├── tsconfig.json               # Configuração do TypeScript
└── README.md                   # Este arquivo
```

---

## 🚀 Deploy

### **Vercel (Recomendado)**

1. **Conecte seu repositório** ao Vercel
2. **Configure as variáveis de ambiente**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. **Deploy automático** a cada push

```bash
# CLI da Vercel
npm i -g vercel
vercel --prod
```

### **Outras Plataformas**

#### **Netlify**
```bash
npm run build
# Deploy da pasta .next/
```

#### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 Configurações Importantes

### **Variáveis de Ambiente Obrigatórias**

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### **Configuração do Supabase**

1. **RLS Policies**: Configuradas para permitir acesso total ao admin
2. **Auth Settings**: Configurar URLs de callback no dashboard
3. **Database Schema**: Executar `supabase-rls-policies.sql`

### **Next.js Config**

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Configurações experimentais se necessário
  }
};

export default nextConfig;
```

---

## 📚 Documentação Adicional

- **[CLAUDE.md](./CLAUDE.md)** - Instruções para o Claude Code
- **[CONFIGURAR-SUPABASE.md](./CONFIGURAR-SUPABASE.md)** - Guia detalhado do Supabase
- **[TESTE-CRUD.md](./TESTE-CRUD.md)** - Documentação de testes
- **[supabase-rls-policies.sql](./supabase-rls-policies.sql)** - Schema completo do banco

---

## 🤝 Equipe de Desenvolvimento

Este projeto foi desenvolvido como parte de um trabalho acadêmico. Para contribuições:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação no diretório `/docs`
2. Consulte os arquivos `CONFIGURAR-SUPABASE.md` e `TESTE-CRUD.md`
3. Abra uma issue no repositório

---

**💈 Desenvolvido com ❤️ para modernizar a gestão da Bárbaros Barbearia**