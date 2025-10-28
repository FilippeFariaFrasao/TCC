/**
 * Histórico completo de versões do sistema
 * Mantenha sempre ordenado da mais recente para a mais antiga
 */

export interface VersionInfo {
  version: string
  name: string
  releaseDate: string
  description: string
  features: string[]
  type: 'major' | 'minor' | 'patch'
  breaking?: boolean
}

export const VERSION_HISTORY: VersionInfo[] = [
  {
    version: '2.3.0',
    name: 'Dashboard Enriquecido',
    releaseDate: '2025-10-28',
    type: 'minor',
    description: 'Dashboard mais completo com widgets operacionais, ranking de serviços e atalhos rápidos',
    features: [
      'Painel superior com cartões alinhados em grid responsiva (6 métricas)',
      'Tabela de próximos agendamentos com status destacados',
      'Seção de atalhos rápidos para ações frequentes do admin',
      'Ranking de serviços do mês com ticket médio automático',
      'Lista de clientes recentes com data e telefone formatados',
      'Novas consultas Supabase otimizadas para suportar os widgets'
    ]
  },
  {
    version: '2.2.0',
    name: 'Dashboard Avançado e Correções',
    releaseDate: '2025-08-23',
    type: 'minor',
    description: 'Dashboard expandido com métricas detalhadas, correção de bugs críticos e melhorias na sidebar',
    features: [
      'Dashboard expandido com 6 métricas detalhadas (atendimentos, receita, etc.)',
      'Correção crítica: status "Finalizado" agora funciona corretamente',
      'Padronização de status nos agendamentos (concluido vs finalizado)',
      'Correção de queries do dashboard (campo data_agendamento)',
      'Sidebar colapsada com alinhamento centralizado perfeito',
      'Métricas de receita diária e mensal em tempo real',
      'Contadores de atendimentos concluídos e próximos agendamentos',
      'Layout responsivo otimizado (1-6 colunas conforme tela)'
    ]
  },
  {
    version: '2.1.0',
    name: 'Interface Moderna e Responsiva',
    releaseDate: '2025-08-22',
    type: 'minor',
    description: 'Sidebar recolhível, sistema de tema dark/light, correções de timezone e otimizações de UX',
    features: [
      'Sidebar recolhível com animações suaves e tooltips informativos',
      'Sistema de tema dark/light completo com persistência',
      'Correção de problemas de timezone em datas de agendamentos',
      'Interface de horários simplificada (removido criar/excluir)',
      'Melhorias gerais de UX e performance',
      'Transições mais fluidas (500ms) em toda a interface',
      'Alinhamento perfeito de elementos da sidebar'
    ]
  },
  {
    version: '2.0.0',
    name: 'Sistema CRUD Completo',
    releaseDate: '2025-08-15',
    type: 'major',
    breaking: true,
    description: 'Implementação completa do sistema CRUD para todas as entidades com sistema ativo/inativo',
    features: [
      'CRUD completo para agendamentos com formulários inteligentes',
      'CRUD completo para clientes com sistema ativo/inativo',
      'CRUD completo para serviços com sistema ativo/inativo',
      'CRUD para horários de funcionamento',
      'CRUD para bloqueios de agenda',
      'Sistema de preservação de dados (sem exclusão definitiva)',
      'Interface moderna com cards responsivos',
      'Feedback visual para estados ativos/inativos',
      'Formulários com validação completa'
    ]
  },
  {
    version: '1.2.0',
    name: 'Dashboard e Navegação',
    releaseDate: '2025-08-10',
    type: 'minor',
    description: 'Implementação do dashboard principal e sistema de navegação',
    features: [
      'Dashboard com estatísticas e resumos',
      'Sistema de navegação completo',
      'Menu lateral com ícones',
      'Páginas estruturadas para todas as seções',
      'Layout responsivo',
      'Integração com Supabase completa'
    ]
  },
  {
    version: '1.1.0',
    name: 'Configuração Supabase',
    releaseDate: '2025-08-05',
    type: 'minor',
    description: 'Configuração completa do banco de dados e autenticação',
    features: [
      'Schema completo do banco de dados',
      'Políticas RLS (Row Level Security)',
      'Sistema de autenticação via Supabase Auth',
      'Funções SQL personalizadas',
      'Tipos TypeScript gerados automaticamente',
      'Configuração de clientes server e client'
    ]
  },
  {
    version: '1.0.0',
    name: 'Versão Inicial',
    releaseDate: '2025-08-01',
    type: 'major',
    description: 'Lançamento inicial do sistema de administração da barbearia',
    features: [
      'Estrutura inicial do projeto Next.js 15',
      'Configuração do Tailwind CSS',
      'Componentes UI básicos (shadcn/ui)',
      'Estrutura de pastas organizada',
      'Configuração TypeScript',
      'Layout básico da aplicação'
    ]
  }
]

// Função para obter a versão atual (primeira do array)
export const getCurrentVersion = () => VERSION_HISTORY[0]

// Função para obter versão específica
export const getVersionByNumber = (version: string) => 
  VERSION_HISTORY.find(v => v.version === version)

// Função para obter histórico completo
export const getVersionHistory = () => VERSION_HISTORY

// Função para obter apenas versões major
export const getMajorVersions = () => 
  VERSION_HISTORY.filter(v => v.type === 'major')

// Função para obter changelog simplificado
export const getChangelogSummary = () => 
  VERSION_HISTORY.map(v => ({
    version: v.version,
    name: v.name,
    date: v.releaseDate,
    type: v.type,
    featuresCount: v.features.length
  }))
