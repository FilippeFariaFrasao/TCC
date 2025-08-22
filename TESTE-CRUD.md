# 🧪 GUIA DE TESTES - CRUD Barbearia Admin

## 🚀 Preparação

### 1. **Executar Políticas RLS no Supabase**

Abra o Supabase Dashboard → SQL Editor e execute:

```sql
-- OPÇÃO 1: Desabilitar RLS (mais simples para teste)
ALTER TABLE agendamentos DISABLE ROW LEVEL SECURITY;
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE servicos DISABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_funcionamento DISABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueios_agenda DISABLE ROW LEVEL SECURITY;
ALTER TABLE feriados DISABLE ROW LEVEL SECURITY;
ALTER TABLE configuracao_horarios DISABLE ROW LEVEL SECURITY;
```

### 2. **Iniciar Aplicação**
```bash
npm run dev --turbopack
```

### 3. **Abrir Console do Navegador**
- Pressione F12
- Vá na aba "Console"
- Mantenha aberto para ver logs de erro

---

## 📋 **TESTES DE AGENDAMENTOS** (`/agendamentos`)

### ✅ **CRIAR Agendamento**
1. Clique em "Novo Agendamento"
2. Preencha todos os campos obrigatórios:
   - Cliente ✓
   - Serviço ✓
   - Data ✓
   - Horário ✓
3. Clique "Salvar"
4. **Verificar**: Console mostra "Agendamento criado: [...]"
5. **Verificar**: Lista atualiza automaticamente

### ✅ **EDITAR Agendamento**
1. Clique no ícone de "Editar" (lápis)
2. Altere campos (ex: status, observações)
3. Clique "Salvar"
4. **Verificar**: Console mostra "Agendamento atualizado: [...]"
5. **Verificar**: Mudanças aparecem na lista

### ✅ **EXCLUIR Agendamento**
1. Clique no ícone de "Lixeira"
2. Confirme a exclusão
3. **Verificar**: Console mostra "Agendamento deletado com sucesso: [...]"
4. **Verificar**: Item desaparece da lista

### 🔍 **Se der erro:**
- Verifique console: erro de RLS? → Execute políticas SQL acima
- Erro de validação? → Verifique campos obrigatórios
- Erro de conexão? → Verifique `.env.local`

---

## 📋 **TESTES DE HORÁRIOS** (`/horarios`)

### ✅ **CRIAR Horário**
1. Clique "Adicionar Horário"
2. Selecione dia da semana
3. Defina horários (abertura/fechamento)
4. Clique "Criar"
5. **Verificar**: Console mostra "Horário criado: [...]"

### ✅ **EDITAR Horário**
1. Clique ícone "Editar"
2. Altere horários ou intervalos
3. Clique "Salvar"
4. **Verificar**: Console mostra "Horário atualizado: [...]"

### ✅ **ATIVAR/DESATIVAR**
1. Clique "Ativar/Desativar"
2. **Verificar**: Status muda visualmente

### ✅ **EXCLUIR Horário**
1. Clique ícone "Lixeira"
2. Confirme exclusão
3. **Verificar**: Console mostra "Horário deletado com sucesso: [...]"

---

## 📋 **TESTES DE BLOQUEIOS** (`/bloqueios`)

### ✅ **CRIAR Bloqueio**
1. Clique "Novo Bloqueio"
2. Selecione data no calendário
3. Defina tipo (feriado, manutenção, etc.)
4. Adicione motivo
5. Clique "Criar"
6. **Verificar**: Console mostra "Bloqueio criado: [...]"

### ✅ **EDITAR Bloqueio**
1. Clique ícone "Editar"
2. Altere data, tipo ou motivo
3. Clique "Salvar"
4. **Verificar**: Console mostra "Bloqueio atualizado: [...]"

### ✅ **EXCLUIR Bloqueio**
1. Clique ícone "Lixeira"
2. Confirme exclusão
3. **Verificar**: Console mostra "Bloqueio deletado com sucesso: [...]"

---

## 🐛 **TROUBLESHOOTING**

### **Erro: "Row Level Security"**
```sql
-- Execute no Supabase SQL Editor:
ALTER TABLE [nome_da_tabela] DISABLE ROW LEVEL SECURITY;
```

### **Erro: "Missing environment variables"**
- Verifique se `.env.local` existe
- Confirme valores de `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **Erro: "Table doesn't exist"**
- Execute `supabase-rls-policies.sql` completo no Supabase

### **Dados não aparecem**
- Verifique se tabelas têm dados no Supabase Dashboard
- Execute parte final do `supabase-rls-policies.sql` para inserir dados exemplo

---

## 📊 **LOGS ESPERADOS NO CONSOLE**

### ✅ **Sucesso - Criação:**
```
Salvando [item]: { formMode: "create", data: {...} }
[Item] criado: [dados]
```

### ✅ **Sucesso - Edição:**
```
Salvando [item]: { formMode: "edit", id: "...", data: {...} }
[Item] atualizado: [dados]
```

### ✅ **Sucesso - Exclusão:**
```
Tentando deletar [item]: [id]
[Item] deletado com sucesso: [dados]
```

### ❌ **Erro:**
```
Erro do Supabase: { message: "...", details: "..." }
Erro ao [operação] [item]: [detalhes]
```

---

## 🎯 **RESULTADO ESPERADO**

Após todos os testes, você deve conseguir:
- ✅ Ver dados do banco em todas as páginas
- ✅ Criar novos registros
- ✅ Editar registros existentes
- ✅ Excluir registros
- ✅ Ver mudanças refletidas imediatamente

Se algum teste falhar, verifique o console e siga o troubleshooting! 🔧