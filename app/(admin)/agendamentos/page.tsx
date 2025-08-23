import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AgendamentoActions } from '@/components/admin/agendamento-actions'
import Link from 'next/link'
import { Calendar, Clock, User, Plus } from 'lucide-react'

export default async function AgendamentosPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: agendamentos } = await supabase
    .from('agendamentos')
    .select(`
      *,
      clientes (nome, telefone),
      servicos (nome, duracao_minutos, preco)
    `)
    .order('data_agendamento', { ascending: true })

  if (!agendamentos && service) {
    const { data } = await service
      .from('agendamentos')
      .select(`
        *,
        clientes (nome, telefone),
        servicos (nome, duracao_minutos, preco)
      `)
      .order('data_agendamento', { ascending: true })
    agendamentos = data || []
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      case 'finalizado':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de criar */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agendamentos</h1>
        <Link href="/agendamentos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </Link>
      </div>

      {/* Lista de agendamentos */}
      <div className="grid gap-4">
        {agendamentos && agendamentos.length > 0 ? (
          agendamentos.map((agendamento) => (
            <Card key={agendamento.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <Link 
                      href={`/agendamentos/${agendamento.id}`} 
                      className="hover:underline"
                    >
                      {agendamento.data_agendamento.split('-').reverse().join('/')}
                    </Link>
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    {/* Status */}
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(agendamento.status)}`}>
                      {agendamento.status || 'Pendente'}
                    </span>

                    {/* Componente client-side para ações */}
                    <AgendamentoActions agendamentoId={agendamento.id} />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {agendamento.hora_inicio} - {agendamento.hora_fim}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>
                      {agendamento.clientes?.nome || 'Cliente não encontrado'}
                      {agendamento.clientes?.telefone && (
                        <span className="text-gray-500 text-sm ml-2">
                          ({agendamento.clientes.telefone})
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {agendamento.servicos?.nome || 'Serviço não encontrado'}
                    </span>
                    {agendamento.valor_total && (
                      <span className="text-green-600 font-semibold">
                        R$ {agendamento.valor_total.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                
                {agendamento.observacoes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Observações:</strong> {agendamento.observacoes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum agendamento encontrado</p>
              <Link href="/agendamentos/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeiro agendamento
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}