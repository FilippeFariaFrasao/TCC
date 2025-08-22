# 🔧 CONFIGURAR SUPABASE API KEYS

## ❌ **Problema Atual**
Erro: `invalid api key` ao tentar deletar/modificar dados

## ✅ **Solução**

### **1. Localize suas chaves do Supabase**

1. Abra o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie as seguintes informações:

   - **Project URL** (exemplo: `https://abc123.supabase.co`)
   - **anon public** key (começa com `eyJhbGc...`)
   - **service_role** key (começa com `eyJhbGc...` - **⚠️ SECRETA!**)

### **2. Configure o arquivo `.env.local`**

Crie/edite o arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...SUA-ANON-KEY-AQUI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...SUA-SERVICE-ROLE-KEY-AQUI
```

**⚠️ IMPORTANTE:**
- Substitua `SEU-PROJETO-ID` pelo ID real do seu projeto
- Substitua as chaves pelos valores reais copiados do dashboard
- **NÃO** compartilhe a `SERVICE_ROLE_KEY` (ela tem permissões de admin)

### **3. Exemplo de configuração correta:**

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123def.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyM2RlZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc4OTAyNDAwLCJleHAiOjE5OTQ0NzgzOTl9.EXEMPLO-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyM2RlZiIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2Nzg5MDI0MDAsImV4cCI6MTk5NDQ3ODM5OX0.EXEMPLO-SERVICE-KEY
```

### **4. Reinicie a aplicação**

Após salvar o `.env.local`:

```bash
# Pare a aplicação (Ctrl+C)
# Inicie novamente:
npm run dev --turbopack
```

## 🧪 **Teste a Configuração**

### **Verificar se as variáveis estão carregando:**

1. Abra o Console do navegador (F12)
2. Digite no console:
   ```javascript
   console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
   console.log('ANON KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'MISSING')
   ```

### **Teste de Conexão:**

1. Vá para qualquer página do admin
2. Se você vir dados nas listas = Conexão OK ✅
3. Se ver "Nenhum [item] encontrado" = Problema de conexão ❌

## 🚨 **Troubleshooting**

### **❌ Erro: "invalid api key"**
- Verifique se as chaves estão corretas no dashboard
- Confirme que não há espaços extras no `.env.local`
- Reinicie a aplicação após alterar `.env.local`

### **❌ Erro: "Missing environment variables"**
- Verifique se `.env.local` está na raiz do projeto
- Confirme que as variáveis começam com `NEXT_PUBLIC_`
- Não use aspas nas variáveis: ❌ `"valor"` ✅ `valor`

### **❌ Dados não carregam**
- Verifique URL do projeto (deve terminar com `.supabase.co`)
- Confirme que o projeto existe no dashboard
- Verifique se RLS está desabilitado ou com políticas corretas

## 📁 **Estrutura de Arquivos**

```
barbearia-admin/
├── .env.local          ← AQUI ficam as chaves
├── lib/
│   └── supabase/
│       ├── client.ts   ← Usa NEXT_PUBLIC_SUPABASE_*
│       ├── server.ts   ← Usa NEXT_PUBLIC_SUPABASE_*  
│       └── service.ts  ← Usa SUPABASE_SERVICE_ROLE_KEY
└── ...
```

## ✅ **Após Configurar**

Você deve conseguir:
- ✅ Ver dados nas páginas
- ✅ Criar novos registros
- ✅ Editar registros existentes  
- ✅ **Deletar registros sem erro**

---

**💡 Dica**: Mantenha o `.env.local` sempre atualizado e **nunca** comite ele no Git!