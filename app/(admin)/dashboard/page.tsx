import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { LucideIcon } from 'lucide-react'
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle,
  CalendarPlus,
  UserPlus,
  Scissors,
  FileText,
} from 'lucide-react'

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
  let { count: proximosAgendamentosHoje } = await buscarDados(
    supabase.from('agendamentos').select('*', { count: 'exact', head: true }).in('status', ['confirmado', 'pendente']).gte('data_agendamento', hoje).lt('data_agendamento', new Date(new Date(hoje).getTime() + 24*60*60*1000).toISOString().split('T')[0]),
    service?.from('agendamentos').select('*', { count: 'exact', head: true }).in('status', ['confirmado', 'pendente']).gte('data_agendamento', hoje).lt('data_agendamento', new Date(new Date(hoje).getTime() + 24*60*60*1000).toISOString().split('T')[0])
  )

  // Total de clientes
  let { count: totalClientes } = await buscarDados(
    supabase.from('clientes').select('*', { count: 'exact', head: true }),
    service?.from('clientes').select('*', { count: 'exact', head: true })
  )

  // Próximos agendamentos detalhados
  const { data: proximosAgendamentosDetalhados } = await buscarDados(
    supabase
      .from('agendamentos')
      .select(`
        id,
        data_agendamento,
        hora_inicio,
        status,
        clientes (nome),
        servicos (nome, preco)
      `)
      .in('status', ['confirmado', 'pendente'])
      .gte('data_agendamento', hoje)
      .order('data_agendamento', { ascending: true })
      .order('hora_inicio', { ascending: true })
      .limit(5),
    service
      ?.from('agendamentos')
      .select(`
        id,
        data_agendamento,
        hora_inicio,
        status,
        clientes (nome),
        servicos (nome, preco)
      `)
      .in('status', ['confirmado', 'pendente'])
      .gte('data_agendamento', hoje)
      .order('data_agendamento', { ascending: true })
      .order('hora_inicio', { ascending: true })
      .limit(5)
  )

  // Serviços mais realizados no mês
  const { data: servicosMesData } = await buscarDados(
    supabase
      .from('agendamentos')
      .select(`
        id,
        status,
        servicos (nome, preco)
      `)
      .gte('data_agendamento', inicioMes),
    service
      ?.from('agendamentos')
      .select(`
        id,
        status,
        servicos (nome, preco)
      `)
      .gte('data_agendamento', inicioMes)
  )

  // Clientes mais recentes
  const { data: clientesRecentesData } = await buscarDados(
    supabase
      .from('clientes')
      .select('id, nome, telefone, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    service
      ?.from('clientes')
      .select('id, nome, telefone, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
  )

  // Calcular valores
  const valorHoje = receitaHoje?.reduce((total, agendamento) => {
    return total + (agendamento.servicos?.preco || 0)
  }, 0) || 0

  const valorMes = receitaMes?.reduce((total, agendamento) => {
    return total + (agendamento.servicos?.preco || 0)
  }, 0) || 0

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })

  const proximosAgendamentosLista = proximosAgendamentosDetalhados ?? []

  const rankingPorServico = new Map<string, { nome: string; total: number; valor: number }>()

  ;(servicosMesData ?? []).forEach((agendamento: any) => {
    if (!agendamento?.servicos?.nome) {
      return
    }

    if (['cancelado'].includes(agendamento.status)) {
      return
    }

    const nomeServico = agendamento.servicos.nome as string
    const precoServico = agendamento.servicos.preco as number | null
    const registroAtual = rankingPorServico.get(nomeServico) ?? {
      nome: nomeServico,
      total: 0,
      valor: 0,
    }

    rankingPorServico.set(nomeServico, {
      nome: nomeServico,
      total: registroAtual.total + 1,
      valor: registroAtual.valor + (precoServico || 0),
    })
  })

  const servicosPopulares = Array.from(rankingPorServico.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  const totalServicosNoMes = Array.from(rankingPorServico.values()).reduce(
    (acc, item) => acc + item.total,
    0
  )

  const ticketMedioMes = totalServicosNoMes > 0 ? valorMes / totalServicosNoMes : 0

  const clientesRecentes = clientesRecentesData ?? []

  const statusStyles: Record<string, string> = {
    confirmado: 'bg-emerald-100 text-emerald-700',
    pendente: 'bg-amber-100 text-amber-700',
    concluido: 'bg-sky-100 text-sky-700',
  }

  const acoesRapidas: {
    title: string
    description: string
    href: string
    icon: LucideIcon
  }[] = [
    {
      title: 'Novo agendamento',
      description: 'Cadastre um horário sem sair do dashboard',
      href: '/agendamentos/novo',
      icon: CalendarPlus,
    },
    {
      title: 'Adicionar cliente',
      description: 'Mantenha sua base sempre atualizada',
      href: '/clientes/novo',
      icon: UserPlus,
    },
    {
      title: 'Cadastrar serviço',
      description: 'Atualize valores ou inclua novas opções',
      href: '/servicos/novo',
      icon: Scissors,
    },
    {
      title: 'Ver relatórios',
      description: 'Acompanhe tendências e desempenho geral',
      href: '/relatorios',
      icon: FileText,
    },
  ]

  const cardBaseClass =
    'group relative overflow-hidden border-border/60 bg-card/95 shadow-sm transition duration-300 hover:border-primary/40 hover:shadow-lg'

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe os indicadores principais e agilize as próximas ações.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12">
        <Card className={`${cardBaseClass} xl:col-span-2`}>
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

        <Card className={`${cardBaseClass} xl:col-span-2`}>
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

        <Card className={`${cardBaseClass} xl:col-span-2`}>
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

        <Card className={`${cardBaseClass} xl:col-span-2`}>
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

        <Card className={`${cardBaseClass} xl:col-span-2`}>
          <span className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximos Hoje
            </CardTitle>
            <Clock className="h-4 w-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proximosAgendamentosHoje ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Agendados
            </p>
          </CardContent>
        </Card>

        <Card className={`${cardBaseClass} xl:col-span-2`}>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="relative overflow-hidden border-border/60 bg-card/95 shadow-sm lg:col-span-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Próximos agendamentos
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Os 5 próximos horários confirmados ou pendentes.
            </p>
          </CardHeader>
          <CardContent className="px-0">
            {proximosAgendamentosLista.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="px-6">
                    <TableHead className="pl-6">Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead className="pr-6 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proximosAgendamentosLista.map((agendamento: any) => (
                    <TableRow key={agendamento.id} className="px-6">
                      <TableCell className="pl-6 font-medium">
                        {agendamento.data_agendamento
                          ? agendamento.data_agendamento.split('-').reverse().join('/')
                          : '--'}
                      </TableCell>
                      <TableCell>
                        {agendamento.hora_inicio
                          ? agendamento.hora_inicio.slice(0, 5)
                          : '--:--'}
                      </TableCell>
                      <TableCell>
                        {agendamento.clientes?.nome ?? 'Cliente não informado'}
                      </TableCell>
                      <TableCell>
                        {agendamento.servicos?.nome ?? 'Serviço não informado'}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <span
                          className={`inline-flex items-center justify-end rounded-full px-2 py-1 text-xs font-medium capitalize ${statusStyles[agendamento.status] ?? 'bg-muted text-muted-foreground'}`}
                        >
                          {agendamento.status ?? '—'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-36 flex-col items-center justify-center px-6 text-sm text-muted-foreground">
                Nenhum agendamento para o restante do dia.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/60 bg-card/95 shadow-sm lg:col-span-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Atalhos rápidos
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Acesse os fluxos mais usados em poucos cliques.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {acoesRapidas.map((acao) => (
              <Link
                key={acao.href}
                href={acao.href}
                className="group flex items-center justify-between rounded-lg border border-border/60 bg-secondary/10 px-4 py-3 transition hover:border-primary/40 hover:bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <acao.icon className="h-5 w-5 text-primary transition duration-200 group-hover:scale-105" />
                  <div>
                    <p className="font-medium leading-tight">{acao.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {acao.description}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-primary transition duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="relative overflow-hidden border-border/60 bg-card/95 shadow-sm lg:col-span-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Serviços mais solicitados
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Mês atual · {totalServicosNoMes} atendimentos registrados
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {servicosPopulares.length > 0 ? (
              servicosPopulares.map((servico) => (
                <div key={servico.nome} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{servico.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {servico.total} atendimento(s) · {currencyFormatter.format(servico.valor)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {[...Array(Math.min(servico.total, 5)).keys()].map((index) => (
                      <span
                        key={`${servico.nome}-${index}`}
                        className="inline-block h-2 w-6 rounded-sm bg-primary/60"
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Sem dados suficientes para exibir o ranking deste mês.
              </p>
            )}
            <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-sm">
              Ticket médio do mês: <span className="font-semibold">{currencyFormatter.format(ticketMedioMes)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/60 bg-card/95 shadow-sm lg:col-span-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Clientes recentes
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Últimos cadastros realizados na plataforma.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientesRecentes.length > 0 ? (
              clientesRecentes.map((cliente: any) => (
                <div
                  key={cliente.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-card/70 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{cliente.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {cliente.telefone || 'Telefone não informado'}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {cliente.created_at
                      ? new Intl.DateTimeFormat('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        }).format(new Date(cliente.created_at))
                      : '--'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum cliente cadastrado recentemente.
              </p>
            )}
            <Link
              href="/clientes"
              className="inline-flex items-center justify-center rounded-lg border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary/10"
            >
              Ver todos os clientes
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
