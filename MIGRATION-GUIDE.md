# Guia de Migração - Módulo de Colaboradores

## Sumário
Este guia explica como aplicar a migração do banco de dados do Supabase para implementar o módulo de colaboradores.

## 📋 O que será feito?

1. ❌ **Remover** a tabela `bloqueios_agenda` (não utilizada)
2. ✅ **Criar** a tabela `colaboradores` com todos os campos necessários
3. ✅ **Adicionar** relacionamento `colaborador_id` na tabela `agendamentos`
4. ✅ **Configurar** segurança (RLS) e índices de performance
5. ⚠️ **Opcional**: Vincular horários de funcionamento aos colaboradores

## ⚠️ IMPORTANTE - Antes de Começar

### Backup de Dados
**A remoção da tabela `bloqueios_agenda` é IRREVERSÍVEL!**

Se você tem dados importantes nesta tabela:
1. Faça backup antes de executar a migração
2. No Supabase Dashboard, vá em Table Editor > bloqueios_agenda
3. Export to CSV para salvar os dados

### Verificar Ambiente
- ✅ Certifique-se de estar no projeto correto do Supabase
- ✅ Tenha permissões de administrador
- ✅ Faça a migração primeiro em ambiente de desenvolvimento/staging

## 🚀 Passo a Passo - Aplicação no Supabase

### Opção 1: Via Supabase Dashboard (Recomendado)

#### 1. Acessar o SQL Editor
1. Acesse [app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**

#### 2. Copiar o Script SQL
1. Abra o arquivo `supabase-migration-colaboradores.sql`
2. Copie TODO o conteúdo do arquivo
3. Cole no editor SQL do Supabase

#### 3. Revisar Opções (Importante!)

**Horários Individuais por Colaborador:**
- Se você quer que cada colaborador tenha seus próprios horários de trabalho:
  - **Descomente** a seção "PASSO 4" no SQL (remova os `/*` e `*/`)
- Se os horários são gerais para todo o estabelecimento:
  - **Mantenha comentado** (padrão)

**Dados de Exemplo:**
- Se quiser inserir colaboradores de exemplo para teste:
  - **Descomente** a seção "PASSO 7" no SQL

#### 4. Executar a Migração
1. Clique no botão **Run** (ou pressione `Ctrl/Cmd + Enter`)
2. Aguarde a execução completar
3. Verifique se não há erros na saída

#### 5. Verificar o Resultado
Execute estas queries para confirmar que tudo funcionou:

```sql
-- Ver estrutura da tabela colaboradores
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'colaboradores'
ORDER BY ordinal_position;

-- Confirmar que bloqueios_agenda foi removida (deve retornar vazio)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'bloqueios_agenda';

-- Listar todas as tabelas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Opção 2: Via Supabase CLI

```bash
# 1. Login no Supabase
npx supabase login

# 2. Link com seu projeto
npx supabase link --project-ref SEU_PROJECT_REF

# 3. Executar o script
npx supabase db push --file supabase-migration-colaboradores.sql
```

## 🔄 Atualizar Tipos TypeScript no Sistema

Após executar a migração no Supabase, você precisa atualizar os tipos do TypeScript:

### 1. Gerar Novos Tipos

```bash
# Via CLI do Supabase
npx supabase gen types typescript --project-id "SEU_PROJECT_REF" > lib/supabase/types.ts

# OU via web (se não tiver CLI configurado)
# 1. Acesse: Supabase Dashboard > Project Settings > API
# 2. Copie o comando de geração de tipos
# 3. Execute no terminal do projeto
```

### 2. Reiniciar o Servidor de Desenvolvimento

```bash
npm run dev --turbopack
```

## ✅ Validação da Migração

### 1. Testar a Interface
1. Acesse: `http://localhost:3000/colaboradores`
2. Clique em "Novo Colaborador"
3. Preencha o formulário e salve
4. Verifique se o colaborador aparece na listagem

### 2. Verificar no Banco
No Supabase Dashboard > Table Editor:
- ✅ Tabela `colaboradores` existe
- ✅ Tabela `bloqueios_agenda` não existe mais
- ✅ Tabela `agendamentos` tem a coluna `colaborador_id`

### 3. Testar Agendamentos com Colaborador
1. Vá em Agendamentos
2. Ao criar um novo agendamento, agora você poderá associar um colaborador
3. (Nota: Pode ser necessário atualizar o formulário de agendamentos)

## 🛠️ Próximas Alterações Recomendadas

Após a migração, considere implementar:

### 1. Atualizar Formulário de Agendamentos
Adicionar seleção de colaborador no formulário de criar/editar agendamento:

```typescript
// Em app/(admin)/agendamentos/novo/page.tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecione o colaborador" />
  </SelectTrigger>
  <SelectContent>
    {colaboradores?.map(col => (
      <SelectItem key={col.id} value={col.id}>
        {col.nome}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

### 2. Exibir Colaborador na Listagem de Agendamentos
Incluir o nome do colaborador na lista de agendamentos:

```typescript
// Adicionar join na query
.select(`
  *,
  clientes (*),
  servicos (*),
  colaboradores (*)
`)
```

### 3. Dashboard de Colaboradores
- Métricas por colaborador (atendimentos, faturamento)
- Gráficos de performance
- Ranking de colaboradores

### 4. Agenda Separada por Colaborador
- Filtro por colaborador na agenda
- Visualização de múltiplas agendas
- Cores diferentes por colaborador

## ⚠️ Troubleshooting

### Erro: "relation bloqueios_agenda does not exist"
**Solução**: A tabela já foi removida anteriormente. Ignore este erro e continue.

### Erro: "role authenticated does not exist"
**Solução**: Ajuste as policies RLS no script SQL ou execute apenas a parte de criação da tabela.

### Erro: "permission denied"
**Solução**: Certifique-se de estar usando credenciais de administrador no Supabase.

### Tipos TypeScript desatualizados
**Solução**:
1. Regenere os tipos com `npx supabase gen types`
2. Reinicie o servidor de desenvolvimento
3. Limpe o cache do Next.js: `rm -rf .next`

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Supabase Dashboard > Logs
2. Consulte a documentação: https://supabase.com/docs
3. Revise o script SQL para verificar se há alguma customização necessária

## 📝 Checklist Final

- [ ] Backup da tabela `bloqueios_agenda` (se necessário)
- [ ] Script SQL revisado e customizado (horários por colaborador?)
- [ ] Migração executada no Supabase sem erros
- [ ] Tipos TypeScript regenerados
- [ ] Servidor de desenvolvimento reiniciado
- [ ] Testado criar/listar/editar colaboradores
- [ ] (Opcional) Formulário de agendamentos atualizado
- [ ] (Opcional) Listagem de agendamentos mostrando colaborador

---

**Data da Migração**: 2025-10-30
**Versão do Sistema**: v2.2.0+
**Autor**: Sistema Bárbaros Barbearia
