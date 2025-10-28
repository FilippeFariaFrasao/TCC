import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Calendar, Users, DollarSign, Clock, TrendingUp, CheckCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  // Buscar dados do dashboard
  const agora = new Date()
  const hoje = new Date(agora.getTime() - (agora.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString().split('T')[0]

  // Função helper para buscar dados com fallback para service client
  const buscarDados = async (query: any, serviceFallback: any) => {
    let resultado = await query
    if ((resultado.count === null || resultado.data === null) && service) {
      resultado = await serviceFallback
    }
    return resultado
  }

  // Agendamentos confirmados hoje
  let { count: agendamentosConfirmadosHoje } = await buscarDados(
    supabase.from('agendamentos').select('*', { count: 'exact', head: true }).eq('status', 'confirmado').gte('data_agendamento', hoje).lt('data_agendamento', new Date(new Date(hoje).getTime() + 24*60*60*1000).toISOString().split('T')[0]),
    service?.from('agendamentos').select('*', { count: 'exact', head: true }).eq('status', 'confirmado').gte('data_agendamento', hoje).lt('data_agendamento', new Date(new Date(hoje).getTime() + 24*60*60*1000).toISOString().split('T')[0])
  )

  // Agendamentos concluídos hoje
  let { count: agendamentosConcluidos } = await buscarDados(
    supabase.from('agendamentos').select('*', { count: 'exact', head: true }).eq('status', 'concluido').gte('data_agendamento', hoje).lt('data_agendamento', new Date(new Date(hoje).getTime() + 24*60*60*1000).toISOString().split('T')[0]),
    service?.from('agendamentos').select('*', { count: 'exact', head: true }).eq('status', 'concluido').gte('data_agendamento', hoje).lt('data_agendamento', new Date(new Date(hoje).getTime() + 24*60*60*1000).toISOString().split('T')[0])
  )

  // Receita do dia (agendamentos concluídos)
  let { data: receitaHoje } = await buscarDados(
    supabase.from('agendamentos').select('servicos(preco)').eq('status', 'concluido').gte('data_agendamento', hoje).lt('data_agendamento', new Date(new Date(hoje).getTime() + 24*60*60*1000).toISOString().split('T')[0]),
    service?.from('agendamentos').select('servicos(preco)').eq('status', 'concluido').gte('data_agendamento', hoje).lt('data_agendamento', new Date(new Date(hoje).getTime() + 24*60*60*1000).toISOString().split('T')[0])
  )

  // Receita do mês
  let { data: receitaMes } = await buscarDados(
    supabase.from('agendamentos').select('servicos(preco)').eq('status', 'concluido').gte('data_agendamento', inicioMes),
    service?.from('agendamentos').select('servicos(preco)').eq('status', 'concluido').gte('data_agendamento', inicioMes)
  )

  // Próximos agendamentos (hoje)
  let { count: proximosAgendamentos } = await buscarDados(
    supabase.from('agendamentos').select('*', { count: 'exact', head: true }).in('status', ['confirmado', 'pendente']).gte('data_agendamento', hoje).lt('data_agendamento', new Date(new Date(hoje).getTime() + 24*60*60*1000).toISOString().split('T')[0]),
    service?.from('agendamentos').select('*', { count: 'exact', head: true }).in('status', ['confirmado', 'pendente']).gte('data_agendamento', hoje).lt('data_agendamento', new Date(new Date(hoje).getTime() + 24*60*60*1000).toISOString().split('T')[0])
  )

  // Total de clientes
  let { count: totalClientes } = await buscarDados(
    supabase.from('clientes').select('*', { count: 'exact', head: true }),
    service?.from('clientes').select('*', { count: 'exact', head: true })
  )

  // Calcular valores
  const valorHoje = receitaHoje?.reduce((total, agendamento) => {
    return total + (agendamento.servicos?.preco || 0)
  }, 0) || 0

  const valorMes = receitaMes?.reduce((total, agendamento) => {
    return total + (agendamento.servicos?.preco || 0)
  }, 0) || 0

  const cardBaseClass =
    'group relative overflow-hidden border-border/60 bg-card/95 shadow-sm transition duration-300 hover:border-primary/40 hover:shadow-lg'

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card className={cardBaseClass}>
          <span className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atendimentos Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agendamentosConfirmadosHoje ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Confirmados
            </p>
          </CardContent>
        </Card>

        <Card className={cardBaseClass}>
          <span className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Concluídos Hoje
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agendamentosConcluidos ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Finalizados
            </p>
          </CardContent>
        </Card>

        <Card className={cardBaseClass}>
          <span className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Hoje
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valorHoje.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Arrecadado hoje
            </p>
          </CardContent>
        </Card>

        <Card className={cardBaseClass}>
          <span className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita do Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valorMes.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Mês atual
            </p>
          </CardContent>
        </Card>

        <Card className={cardBaseClass}>
          <span className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximos Hoje
            </CardTitle>
            <Clock className="h-4 w-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proximosAgendamentos ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Agendados
            </p>
          </CardContent>
        </Card>

        <Card className={cardBaseClass}>
          <span className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalClientes ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Adicione mais widgets aqui */}
    </div>
  )
}
