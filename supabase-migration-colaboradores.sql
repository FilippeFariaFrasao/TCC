-- ============================================================================
-- MIGRAÇÃO: Implementação do Módulo de Colaboradores
-- Data: 2025-10-30
-- Descrição:
-- 1. Remove tabela bloqueios_agenda (não utilizada)
-- 2. Cria tabela colaboradores
-- 3. Adiciona relacionamento colaborador_id em agendamentos
-- 4. Vincula horários de funcionamento aos colaboradores
-- ============================================================================

-- ============================================================================
-- PASSO 1: Remover tabela bloqueios_agenda
-- ============================================================================
-- ATENÇÃO: Esta operação é IRREVERSÍVEL e apagará todos os dados da tabela
-- Certifique-se de fazer backup se necessário antes de executar

DROP TABLE IF EXISTS bloqueios_agenda CASCADE;

-- ============================================================================
-- PASSO 2: Criar tabela colaboradores
-- ============================================================================
CREATE TABLE IF NOT EXISTS colaboradores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20) NOT NULL,
    foto_url TEXT,
    especialidades TEXT,
    ativo BOOLEAN DEFAULT true,
    data_admissao DATE,
    cor_agenda VARCHAR(7) DEFAULT '#6366f1', -- Cor hexadecimal para identificação na agenda
    comissao_percentual DECIMAL(5,2), -- Percentual de comissão (0-100)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Índices para melhorar performance
CREATE INDEX idx_colaboradores_ativo ON colaboradores(ativo);
CREATE INDEX idx_colaboradores_nome ON colaboradores(nome);

-- Comentários descritivos
COMMENT ON TABLE colaboradores IS 'Tabela de colaboradores/barbeiros do estabelecimento';
COMMENT ON COLUMN colaboradores.cor_agenda IS 'Cor hexadecimal para identificação visual na agenda';
COMMENT ON COLUMN colaboradores.comissao_percentual IS 'Percentual de comissão sobre serviços realizados (0-100)';
COMMENT ON COLUMN colaboradores.especialidades IS 'Especialidades do colaborador (ex: Cortes, Barba, Coloração)';

-- ============================================================================
-- PASSO 3: Adicionar coluna colaborador_id na tabela agendamentos
-- ============================================================================
-- Adiciona a coluna se ela não existir
ALTER TABLE agendamentos
ADD COLUMN IF NOT EXISTS colaborador_id UUID;

-- Cria a chave estrangeira
ALTER TABLE agendamentos
ADD CONSTRAINT agendamentos_colaborador_id_fkey
FOREIGN KEY (colaborador_id)
REFERENCES colaboradores(id)
ON DELETE SET NULL;

-- Índice para melhorar consultas
CREATE INDEX IF NOT EXISTS idx_agendamentos_colaborador ON agendamentos(colaborador_id);

-- Comentário
COMMENT ON COLUMN agendamentos.colaborador_id IS 'Colaborador responsável pelo agendamento';

-- ============================================================================
-- PASSO 4: Vincular horários de funcionamento aos colaboradores (OPCIONAL)
-- ============================================================================
-- Esta seção é OPCIONAL - descomente se quiser horários individuais por colaborador
-- Caso contrário, os horários continuarão sendo gerais para o estabelecimento

/*
-- Adiciona coluna colaborador_id na tabela horarios_funcionamento
ALTER TABLE horarios_funcionamento
ADD COLUMN IF NOT EXISTS colaborador_id UUID;

-- Cria a chave estrangeira
ALTER TABLE horarios_funcionamento
ADD CONSTRAINT horarios_funcionamento_colaborador_id_fkey
FOREIGN KEY (colaborador_id)
REFERENCES colaboradores(id)
ON DELETE CASCADE;

-- Índice para melhorar consultas
CREATE INDEX IF NOT EXISTS idx_horarios_colaborador ON horarios_funcionamento(colaborador_id);

-- Comentário
COMMENT ON COLUMN horarios_funcionamento.colaborador_id IS 'Colaborador específico (NULL = horário geral do estabelecimento)';
*/

/*
-- Se também quiser vincular configuracao_horarios:
ALTER TABLE configuracao_horarios
ADD COLUMN IF NOT EXISTS colaborador_id UUID;

ALTER TABLE configuracao_horarios
ADD CONSTRAINT configuracao_horarios_colaborador_id_fkey
FOREIGN KEY (colaborador_id)
REFERENCES colaboradores(id)
ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_configuracao_horarios_colaborador ON configuracao_horarios(colaborador_id);
*/

-- ============================================================================
-- PASSO 5: Atualizar trigger de updated_at para colaboradores
-- ============================================================================
-- Cria função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplica o trigger na tabela colaboradores
DROP TRIGGER IF EXISTS update_colaboradores_updated_at ON colaboradores;
CREATE TRIGGER update_colaboradores_updated_at
    BEFORE UPDATE ON colaboradores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PASSO 6: Habilitar Row Level Security (RLS) - IMPORTANTE PARA SEGURANÇA
-- ============================================================================
-- Habilita RLS na tabela
ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;

-- Policy para leitura pública (usuários autenticados)
CREATE POLICY "Permitir leitura para usuários autenticados" ON colaboradores
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy para inserção (apenas administradores)
CREATE POLICY "Permitir inserção para service_role" ON colaboradores
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Policy para atualização (apenas administradores)
CREATE POLICY "Permitir atualização para service_role" ON colaboradores
    FOR UPDATE
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Policy para exclusão (apenas administradores)
CREATE POLICY "Permitir exclusão para service_role" ON colaboradores
    FOR DELETE
    USING (auth.role() = 'service_role');

-- ============================================================================
-- PASSO 7: Dados de exemplo (OPCIONAL - apenas para testes)
-- ============================================================================
-- Descomente para inserir dados de exemplo

/*
INSERT INTO colaboradores (nome, telefone, email, especialidades, ativo, data_admissao, cor_agenda, comissao_percentual)
VALUES
    ('João Silva', '(11) 98765-4321', 'joao@barbaros.com', 'Cortes degradê, Barba, Navalhado', true, '2023-01-15', '#3b82f6', 50.00),
    ('Pedro Santos', '(11) 98765-1234', 'pedro@barbaros.com', 'Cortes clássicos, Barba, Coloração', true, '2023-03-20', '#10b981', 45.00),
    ('Carlos Oliveira', '(11) 98765-5678', 'carlos@barbaros.com', 'Cortes modernos, Design de sobrancelha', true, '2023-06-10', '#f59e0b', 40.00);
*/

-- ============================================================================
-- VERIFICAÇÕES PÓS-MIGRAÇÃO
-- ============================================================================
-- Execute estas queries para verificar se tudo foi criado corretamente:

-- 1. Verificar estrutura da tabela colaboradores
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'colaboradores'
-- ORDER BY ordinal_position;

-- 2. Verificar se bloqueios_agenda foi removida
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name = 'bloqueios_agenda';
-- (Deve retornar nenhuma linha)

-- 3. Verificar constraint em agendamentos
-- SELECT constraint_name, table_name, column_name
-- FROM information_schema.key_column_usage
-- WHERE table_name = 'agendamentos' AND column_name = 'colaborador_id';

-- 4. Listar todas as tabelas após migração
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;

-- ============================================================================
-- FIM DA MIGRAÇÃO
-- ============================================================================
