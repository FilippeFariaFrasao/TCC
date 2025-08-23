# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Lembretes

o arquivo .env.local ja esta criado e configurado, voce nao consegue visualizar ele, mas esta feito

## Development Commands

- `npm run dev --turbopack`: Start development server with Turbopack
- `npm run build`: Build production version
- `npm run start`: Start production server  
- `npm run lint`: Run ESLint

## Project Architecture

This is a barbershop admin system built with Next.js 15 and Supabase. The application uses:

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack React Query

### File Structure
- `app/(admin)/`: Admin panel pages (dashboard, agendamentos, clientes, horarios, bloqueios)
- `app/(auth)/`: Authentication pages (login)
- `components/admin/`: Admin-specific components (sidebar, header)
- `components/ui/`: Reusable UI components (shadcn/ui)
- `lib/supabase/`: Supabase client configuration and type definitions

### Admin Pages Status
- ✅ **Dashboard** (`/dashboard`): Functional with appointment and client statistics
- ✅ **Agendamentos** (`/agendamentos`): List view with appointment details, client info, and status
- ✅ **Agendamento Individual** (`/agendamentos/[id]`): Detailed view of specific appointment
- ✅ **Clientes** (`/clientes`): Client management with contact information and notes
- ✅ **Horários** (`/horarios`): Operating hours configuration by day of week
- ✅ **Bloqueios** (`/bloqueios`): Schedule blocking management for holidays/maintenance
- ❌ **Relatórios** (`/relatorios`): Not implemented (referenced in sidebar but no page exists)

### Database Schema
The Supabase database includes these main tables:
- `agendamentos`: Appointments with client and service relationships
- `clientes`: Customer information
- `servicos`: Services offered
- `configuracao_horarios`/`horarios_funcionamento`: Operating hours configuration
- `bloqueios_agenda`: Schedule blocks/blackouts
- `feriados`: Holidays
- `sessoes_conversa`: Conversation sessions (possibly for chatbot/booking)

### Key Features
- Dashboard with appointment overview
- Client management
- Service scheduling
- Operating hours configuration
- Schedule blocking/availability management
- Authentication via Supabase Auth

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

### Code Conventions
- Uses TypeScript with strict typing
- Component file names use kebab-case
- Supabase types are auto-generated in `lib/supabase/types.ts`
- Client-side Supabase client in `lib/supabase/client.ts`
- Server-side client in `lib/supabase/server.ts`

### Versioning System
This project uses **Semantic Versioning (SemVer)** for version control:

- **MAJOR** (X.0.0): Breaking changes that may break existing functionality
- **MINOR** (X.Y.0): New features that are backward compatible
- **PATCH** (X.Y.Z): Bug fixes only, no new features

**Version Management Files:**
- `lib/version-history.ts`: Complete version history with features and changelog
- `package.json`: Current version number
- `README.md`: Contains detailed versioning documentation

**Current Version: v2.2.0** (Dashboard Avançado e Correções)

**When updating versions:**
1. Add new version entry to the TOP of `VERSION_HISTORY` array in `lib/version-history.ts`
2. Update version number in `package.json`
3. Update README.md with new features and changelog
4. Follow semantic versioning rules for version type classification

### Current Issues to Address

**Critical:**
- Missing `.env.local` file with Supabase credentials
- Authentication pages (`/login`, callback route) not implemented
- No root page (`app/page.tsx`) - will show 404 on home route

**Missing Features:**
- Relatórios page (referenced in sidebar)
- Authentication flow implementation
- CRUD operations for all entities
- Form components for data entry
- Error handling and loading states

### Getting Started
1. Create `.env.local` with Supabase credentials
2. Run `npm install` to install dependencies  
3. Start development server: `npm run dev --turbopack`
4. Navigate to `/dashboard` to see the admin interface