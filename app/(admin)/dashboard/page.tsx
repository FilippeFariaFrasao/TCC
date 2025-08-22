import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Calendar, Users } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  // Buscar dados do dashboard
  const hoje = new Date().toISOString().split('T')[0]

  // Primeiro tentamos com o client normal (respeita RLS). Se vier null, fazemos fallback para service role
  let { count: agendamentosConfirmadosHoje } = await supabase
    .from('agendamentos')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'confirmado')

  if (agendamentosConfirmadosHoje == null && service) {
    const { count } = await service
      .from('agendamentos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmado')
    agendamentosConfirmadosHoje = count ?? 0
  }

  let { count: totalClientes } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true })

  if (totalClientes == null && service) {
    const { count } = await service
      .from('clientes')
      .select('*', { count: 'exact', head: true })
    totalClientes = count ?? 0
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos Confirmados
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agendamentosConfirmadosHoje ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalClientes ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adicione mais widgets aqui */}
    </div>
  )
}