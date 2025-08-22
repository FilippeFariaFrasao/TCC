import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { ServiceActions } from '@/components/admin/service-actions'
import { Scissors, Clock, DollarSign, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ServicosPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: servicos } = await supabase
    .from('servicos')
    .select('*')
    .order('nome', { ascending: true })

  if (!servicos && service) {
    const { data } = await service
      .from('servicos')
      .select('*')
      .order('nome', { ascending: true })
    servicos = data || []
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Serviços</h1>
        <Link href="/servicos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicos?.map((servico) => (
          <Card key={servico.id} className={`${!servico.ativo ? 'opacity-60 border-gray-300' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                {servico.nome}
                {!servico.ativo && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    Inativo
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">R$ {servico.preco.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{servico.duracao_minutos} minutos</span>
                </div>
                {servico.descricao && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                    <p className="text-gray-600">{servico.descricao}</p>
                  </div>
                )}
                <ServiceActions serviceId={servico.id} isActive={servico.ativo} />
              </div>
            </CardContent>
          </Card>
        )) || (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Scissors className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Nenhum serviço encontrado</p>
                <Link href="/servicos/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar primeiro serviço
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}