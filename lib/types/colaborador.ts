// Tipos para o módulo de Colaboradores
export interface Colaborador {
  id: string
  nome: string
  email: string | null
  telefone: string
  foto_url: string | null
  especialidades: string | null
  ativo: boolean
  data_admissao: string | null
  cor_agenda: string | null
  created_at: string
  updated_at: string
}

export interface ColaboradorInsert {
  id?: string
  nome: string
  email?: string | null
  telefone: string
  foto_url?: string | null
  especialidades?: string | null
  ativo?: boolean
  data_admissao?: string | null
  cor_agenda?: string | null
}

export interface ColaboradorUpdate {
  nome?: string
  email?: string | null
  telefone?: string
  foto_url?: string | null
  especialidades?: string | null
  ativo?: boolean
  data_admissao?: string | null
  cor_agenda?: string | null
}

// Para uso em formulários
export interface ColaboradorFormData {
  nome: string
  email: string
  telefone: string
  foto_url?: string
  especialidades: string
  data_admissao: string
  cor_agenda: string
}
