import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { ProductActions } from '@/components/admin/product-actions'
import { Package, Barcode, Tag, AlertTriangle, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ProdutosPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  // Buscar produtos com saldo atual da view
  let { data: produtos } = await supabase
    .from('view_estoque_atual')
    .select('*')
    .order('nome', { ascending: true })

  if (!produtos && service) {
    const { data } = await service
      .from('view_estoque_atual')
      .select('*')
      .order('nome', { ascending: true })
    produtos = data || []
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Link href="/produtos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos && produtos.length > 0 ? (
          produtos.map((produto) => (
            <Card key={produto.id} className={`${!produto.ativo ? 'opacity-60 border-gray-300' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  <Package className="h-5 w-5" />
                  {produto.nome}
                  {!produto.ativo && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Inativo
                    </span>
                  )}
                  {produto.estoque_baixo && produto.ativo && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Estoque Baixo
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {produto.codigo_barras && (
                    <div className="flex items-center gap-2 text-sm">
                      <Barcode className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{produto.codigo_barras}</span>
                    </div>
                  )}
                  {(produto.marca || produto.categoria) && (
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {[produto.marca, produto.categoria].filter(Boolean).join(' • ')}
                      </span>
                    </div>
                  )}
                  <div className="mt-3 p-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-600">Saldo Atual:</span>
                      <span className={`font-semibold ${
                        (produto.saldo_atual || 0) === 0 ? 'text-red-600' :
                        produto.estoque_baixo ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {produto.saldo_atual || 0} {produto.unidade_medida}
                      </span>
                    </div>
                    {produto.estoque_minimo !== null && produto.estoque_minimo > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Mínimo:</span>
                        <span className="text-gray-500">{produto.estoque_minimo} {produto.unidade_medida}</span>
                      </div>
                    )}
                  </div>
                  {produto.descricao && (
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <p className="text-gray-600 line-clamp-2">{produto.descricao}</p>
                    </div>
                  )}
                  <ProductActions productId={produto.id!} isActive={produto.ativo ?? false} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum produto encontrado</p>
              <Link href="/produtos/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar primeiro produto
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
