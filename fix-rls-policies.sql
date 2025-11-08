-- ============================================================================
-- CORREÇÃO: Políticas RLS para Tabela Colaboradores
-- Data: 2025-10-30
-- Problema: Colaboradores não apareciam na interface devido a RLS restritiva
-- ============================================================================

-- ============================================================================
-- REMOVER POLICIES ANTIGAS (muito restritivas)
-- ============================================================================
DROP POLICY IF EXISTS "Permitir leitura para usuários autenticados" ON colaboradores;
DROP POLICY IF EXISTS "Permitir inserção para service_role" ON colaboradores;
DROP POLICY IF EXISTS "Permitir atualização para service_role" ON colaboradores;
DROP POLICY IF EXISTS "Permitir exclusão para service_role" ON colaboradores;

-- ============================================================================
-- CRIAR NOVAS POLICIES (acesso público - adequado para sistema admin)
-- ============================================================================

-- Leitura (SELECT) - Acesso público
CREATE POLICY "Permitir leitura pública" ON colaboradores
    FOR SELECT
    USING (true);

-- Inserção (INSERT) - Acesso público
CREATE POLICY "Permitir inserção pública" ON colaboradores
    FOR INSERT
    WITH CHECK (true);

-- Atualização (UPDATE) - Acesso público
CREATE POLICY "Permitir atualização pública" ON colaboradores
    FOR UPDATE
    USING (true);

-- Exclusão (DELETE) - Acesso público
CREATE POLICY "Permitir exclusão pública" ON colaboradores
    FOR DELETE
    USING (true);

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================
-- Executar esta query para confirmar que as policies foram criadas:
/*
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'colaboradores'
ORDER BY cmd, policyname;
*/

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Estas policies permitem acesso total (CRUD) sem autenticação
-- 2. Adequado para sistemas admin internos onde não há login público
-- 3. Se precisar de segurança adicional no futuro, substitua por:
--    USING (auth.role() = 'authenticated') ou
--    USING (auth.role() = 'service_role')
--
-- 4. O RLS continua HABILITADO, mas com policies permissivas
-- 5. Isso resolve o problema de colaboradores não aparecerem na interface
-- ============================================================================
