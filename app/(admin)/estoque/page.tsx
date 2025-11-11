import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Package, AlertTriangle, TrendingUp, Clock, ArrowUp, ArrowDown, History } from 'lucide-react'
import Link from 'next/link'

export default async function EstoquePage() {
  const supabase = await createClient()
  const service = createServiceClient()

  // Buscar produtos da view
  let { data: produtos } = await supabase
    .from('view_estoque_atual')
    .select('*')
    .eq('ativo', true)
    .order('nome', { ascending: true })

  if (!produtos && service) {
    const { data } = await service
      .from('view_estoque_atual')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true })
    produtos = data || []
  }

  // Buscar última movimentação
  let { data: ultimaMovimentacao } = await supabase
    .from('movimentacoes_estoque')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!ultimaMovimentacao && service) {
    const { data } = await service
      .from('movimentacoes_estoque')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    ultimaMovimentacao = data
  }

  // Calcular indicadores
  const totalProdutos = produtos?.length || 0
  const produtosEstoqueBaixo = produtos?.filter(p => p.estoque_baixo).length || 0
  const valorTotalEstoque = produtos?.reduce((acc, p) => acc + (p.valor_total_estoque || 0), 0) || 0

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Controle de Estoque</h1>
        <div className="flex gap-2">
          <Link href="/estoque/movimentacoes">
            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </Button>
          </Link>
          <Link href="/estoque/entrada">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowUp className="h-4 w-4 mr-2" />
              Nova Entrada
            </Button>
          </Link>
          <Link href="/estoque/saida">
            <Button className="bg-red-600 hover:bg-red-700">
              <ArrowDown className="h-4 w-4 mr-2" />
              Nova Saída
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos}</div>
            <p className="text-xs text-muted-foreground">produtos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${produtosEstoqueBaixo > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
              {produtosEstoqueBaixo}
            </div>
            <p className="text-xs text-muted-foreground">produtos abaixo do mínimo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {valorTotalEstoque.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">valor em estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Movimentação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {ultimaMovimentacao
                ? new Date(ultimaMovimentacao.created_at).toLocaleDateString('pt-BR')
                : 'Nenhuma'}
            </div>
            <p className="text-xs text-muted-foreground">
              {ultimaMovimentacao
                ? new Date(ultimaMovimentacao.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'movimentação registrada'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Produtos com Saldo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produtos em Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          {produtos && produtos.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-4 p-3 bg-gray-100 rounded-lg font-semibold text-sm">
                <div className="col-span-2">Produto</div>
                <div className="text-center">Categoria</div>
                <div className="text-center">Saldo</div>
                <div className="text-center">Status</div>
              </div>

              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="grid grid-cols-5 gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors items-center"
                >
                  <div className="col-span-2 font-medium">{produto.nome}</div>
                  <div className="text-center text-sm text-gray-600">
                    {produto.categoria || '-'}
                  </div>
                  <div className="text-center">
                    <span className={`font-semibold ${
                      (produto.saldo_atual || 0) === 0 ? 'text-red-600' :
                      produto.estoque_baixo ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {produto.saldo_atual || 0} {produto.unidade_medida}
                    </span>
                  </div>
                  <div className="text-center">
                    {(produto.saldo_atual || 0) === 0 ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                        Zerado
                      </span>
                    ) : produto.estoque_baixo ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Baixo
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        OK
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum produto no estoque</p>
              <Link href="/produtos/novo">
                <Button>Cadastrar Primeiro Produto</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
