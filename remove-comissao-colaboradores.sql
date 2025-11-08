-- Migration: Remove comissao_percentual from colaboradores table
-- Data: 2025-10-31
-- Descrição: Remove o campo de comissão dos colaboradores

-- Remove a coluna comissao_percentual da tabela colaboradores
ALTER TABLE colaboradores
DROP COLUMN IF EXISTS comissao_percentual;
