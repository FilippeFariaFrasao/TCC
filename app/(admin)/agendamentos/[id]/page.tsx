import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Calendar, Clock, User, Phone, DollarSign, Package } from 'lucide-react'
import { notFound } from 'next/navigation'

interface AgendamentoPageProps {
  params: Promise<{ id: string }>
}

export default async function AgendamentoPage({ params }: AgendamentoPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: agendamento } = await supabase
    .from('agendamentos')
    .select(`
      *,
      clientes (nome, telefone, email),
      servicos (nome, duracao_minutos, preco, descricao)
    `)
    .eq('id', id)
    .single()

  if (!agendamento && service) {
    const { data } = await service
      .from('agendamentos')
      .select(`
        *,
        clientes (nome, telefone, email),
        servicos (nome, duracao_minutos, preco, descricao)
      `)
      .eq('id', id)
      .single()
    agendamento = data as any
  }

  if (!agendamento) {
    notFound()
  }

  // Fetch agendamento produtos
  let { data: produtos } = await supabase
    .from('agendamento_produtos')
    .select(`
      quantidade,
      produtos:produto_id (
        id,
        nome,
        preco_venda,
        unidade_medida
      )
    `)
    .eq('agendamento_id', id)

  if (!produtos && service) {
    const { data } = await service
      .from('agendamento_produtos')
      .select(`
        quantidade,
        produtos:produto_id (
          id,
          nome,
          preco_venda,
          unidade_medida
        )
      `)
      .eq('agendamento_id', id)
    produtos = data as any
  }

  const produtosFormatados = produtos?.map((item: any) => ({
    nome: item.produtos.nome,
    quantidade: item.quantidade,
    preco_unitario: item.produtos.preco_venda || 0,
    subtotal: item.quantidade * (item.produtos.preco_venda || 0),
    unidade_medida: item.produtos.unidade_medida
  })) || []

  const totalProdutos = produtosFormatados.reduce((acc: number, p: any) => acc + p.subtotal, 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Detalhes do Agendamento</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações do Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Data:</span>
              <span>{agendamento.data_agendamento.split('-').reverse().join('/')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Horário:</span>
              <span>{agendamento.hora_inicio} - {agendamento.hora_fim}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded text-xs ${agendamento.status === 'confirmado'
                  ? 'bg-green-100 text-green-800'
                  : agendamento.status === 'cancelado'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                {agendamento.status || 'Pendente'}
              </span>
            </div>
            {agendamento.valor_total && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Valor:</span>
                <span>R$ {agendamento.valor_total.toFixed(2)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agendamento.clientes ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Nome:</span>
                  <span>{agendamento.clientes.nome}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Telefone:</span>
                  <span>{agendamento.clientes.telefone}</span>
                </div>
                {agendamento.clientes.email && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>{agendamento.clientes.email}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">Cliente não encontrado</p>
            )}
          </CardContent>
        </Card>

        {agendamento.servicos && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-medium">{agendamento.servicos.nome}</h3>
                <p className="text-sm text-gray-600">
                  Duração: {agendamento.servicos.duracao_minutos} minutos
                </p>
                <p className="text-sm text-gray-600">
                  Preço: R$ {agendamento.servicos.preco.toFixed(2)}
                </p>
                {agendamento.servicos.descricao && (
                  <p className="text-sm text-gray-600">{agendamento.servicos.descricao}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {produtosFormatados.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produtos Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Produto</th>
                        <th className="text-center py-2 px-2">Quantidade</th>
                        <th className="text-right py-2 px-2">Preço Unit.</th>
                        <th className="text-right py-2 px-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtosFormatados.map((produto: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-2">{produto.nome}</td>
                          <td className="text-center py-3 px-2">
                            {produto.quantidade} {produto.unidade_medida}
                          </td>
                          <td className="text-right py-3 px-2">
                            R$ {produto.preco_unitario.toFixed(2)}
                          </td>
                          <td className="text-right py-3 px-2 font-medium">
                            R$ {produto.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold">
                        <td colSpan={3} className="text-right py-3 px-2">
                          Total dos Produtos:
                        </td>
                        <td className="text-right py-3 px-2 text-primary">
                          R$ {totalProdutos.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {agendamento.servicos && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Serviço:</span>
                      <span>R$ {agendamento.servicos.preco.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Produtos:</span>
                      <span>R$ {totalProdutos.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total Geral:</span>
                      <span className="text-primary">
                        R$ {(agendamento.servicos.preco + totalProdutos).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {agendamento.observacoes && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{agendamento.observacoes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}