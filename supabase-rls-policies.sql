-- Políticas RLS para permitir acesso completo aos dados do admin
-- Execute estes comandos no SQL Editor do Supabase para resolver os problemas de acesso

-- OPÇÃO 1: Desabilitar RLS temporariamente (mais simples)
-- Descomente as linhas abaixo se preferir desabilitar RLS completamente

-- ALTER TABLE agendamentos DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE servicos DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE horarios_funcionamento DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE bloqueios_agenda DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE feriados DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE configuracao_horarios DISABLE ROW LEVEL SECURITY;

-- OPÇÃO 2: Manter RLS ativo com políticas permissivas (mais seguro)

-- Política para tabela agendamentos
DROP POLICY IF EXISTS "Enable all access for admin" ON agendamentos;
CREATE POLICY "Enable all access for admin" ON agendamentos
FOR ALL USING (true) WITH CHECK (true);

-- Política para tabela clientes
DROP POLICY IF EXISTS "Enable all access for admin" ON clientes;
CREATE POLICY "Enable all access for admin" ON clientes
FOR ALL USING (true) WITH CHECK (true);

-- Política para tabela servicos
DROP POLICY IF EXISTS "Enable all access for admin" ON servicos;
CREATE POLICY "Enable all access for admin" ON servicos
FOR ALL USING (true) WITH CHECK (true);

-- Política para tabela horarios_funcionamento
DROP POLICY IF EXISTS "Enable all access for admin" ON horarios_funcionamento;
CREATE POLICY "Enable all access for admin" ON horarios_funcionamento
FOR ALL USING (true) WITH CHECK (true);

-- Política para tabela bloqueios_agenda
DROP POLICY IF EXISTS "Enable all access for admin" ON bloqueios_agenda;
CREATE POLICY "Enable all access for admin" ON bloqueios_agenda
FOR ALL USING (true) WITH CHECK (true);

-- Política para tabela feriados
DROP POLICY IF EXISTS "Enable all access for admin" ON feriados;
CREATE POLICY "Enable all access for admin" ON feriados
FOR ALL USING (true) WITH CHECK (true);

-- Política para tabela configuracao_horarios
DROP POLICY IF EXISTS "Enable all access for admin" ON configuracao_horarios;
CREATE POLICY "Enable all access for admin" ON configuracao_horarios
FOR ALL USING (true) WITH CHECK (true);

-- Verificar e recriar tabelas se necessário
-- Execute apenas se as tabelas não existirem

CREATE TABLE IF NOT EXISTS agendamentos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id uuid REFERENCES clientes(id),
    servico_id uuid REFERENCES servicos(id),
    data_agendamento date NOT NULL,
    hora_inicio time NOT NULL,
    hora_fim time NOT NULL,
    status varchar DEFAULT 'confirmado',
    observacoes text,
    valor_total numeric,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome varchar NOT NULL,
    telefone varchar NOT NULL UNIQUE,
    email varchar,
    data_nascimento date,
    observacoes text,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servicos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome varchar NOT NULL,
    descricao text,
    duracao_minutos integer NOT NULL,
    preco numeric NOT NULL,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Inserir alguns dados de exemplo para horários de funcionamento (se não existirem)
INSERT INTO horarios_funcionamento (dia_semana, hora_abertura, hora_fechamento, ativo)
VALUES 
  (1, '08:00:00', '18:00:00', true), -- Segunda
  (2, '08:00:00', '18:00:00', true), -- Terça
  (3, '08:00:00', '18:00:00', true), -- Quarta
  (4, '08:00:00', '18:00:00', true), -- Quinta
  (5, '08:00:00', '18:00:00', true), -- Sexta
  (6, '08:00:00', '16:00:00', true)  -- Sábado
ON CONFLICT DO NOTHING;

-- Inserir alguns serviços de exemplo (se não existirem)
INSERT INTO servicos (nome, descricao, duracao_minutos, preco, ativo)
VALUES 
  ('Corte Masculino', 'Corte de cabelo masculino tradicional', 30, 25.00, true),
  ('Barba', 'Aparar e fazer a barba', 20, 15.00, true),
  ('Corte + Barba', 'Combo completo de corte e barba', 45, 35.00, true),
  ('Corte Infantil', 'Corte de cabelo para crianças', 25, 20.00, true)
ON CONFLICT DO NOTHING;