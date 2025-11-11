import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { ArrowUp, ArrowDown, Package, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function MovimentacoesPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: movimentacoes } = await supabase
    .from('movimentacoes_estoque')
    .select(`
      *,
      produtos:produto_id (
        nome,
        unidade_medida
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (!movimentacoes && service) {
    const { data } = await service
      .from('movimentacoes_estoque')
      .select(`
        *,
        produtos:produto_id (
          nome,
          unidade_medida
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)
    movimentacoes = data || []
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Histórico de Movimentações</h1>
        <Link href="/estoque">
          <Button variant="outline">
            Voltar para Estoque
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Últimas 100 Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {movimentacoes && movimentacoes.length > 0 ? (
            <div className="space-y-3">
              {movimentacoes.map((mov: any) => (
                <div
                  key={mov.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-full ${
                      mov.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {mov.tipo === 'entrada' ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{mov.produtos?.nome}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          mov.tipo === 'entrada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {mov.tipo.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {mov.motivo}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          {mov.quantidade} {mov.produtos?.unidade_medida}
                        </span>
                        <span>
                          {new Date(mov.created_at).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(mov.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {mov.observacoes && (
                        <p className="text-sm text-gray-500 mt-1">{mov.observacoes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma movimentação registrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
