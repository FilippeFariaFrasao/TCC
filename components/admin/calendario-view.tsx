'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Agendamento {
  id: string
  data_agendamento: string
  hora_inicio: string
  hora_fim: string
  status: string
  valor_total: number
  observacoes?: string
  clientes?: { nome: string; telefone?: string }
  servicos?: { nome: string; duracao_minutos?: number; preco?: number }
}

interface CalendarioViewProps {
  agendamentos: Agendamento[]
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export function CalendarioView({ agendamentos }: CalendarioViewProps) {
  const hoje = new Date()
  const [mesAtual, setMesAtual] = useState(hoje.getMonth())
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear())
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null)

  // Função para obter os dias do mês
  const getDiasDoMes = (mes: number, ano: number) => {
    const primeiroDia = new Date(ano, mes, 1).getDay()
    const ultimoDia = new Date(ano, mes + 1, 0).getDate()
    const diasMesAnterior = new Date(ano, mes, 0).getDate()

    const dias: (number | null)[] = []

    // Adiciona dias do mês anterior
    for (let i = primeiroDia - 1; i >= 0; i--) {
      dias.push(null)
    }

    // Adiciona dias do mês atual
    for (let dia = 1; dia <= ultimoDia; dia++) {
      dias.push(dia)
    }

    return dias
  }

  // Agrupar agendamentos por data
  const agendamentosPorDia = useMemo(() => {
    const grupos: { [key: string]: Agendamento[] } = {}

    agendamentos.forEach(agendamento => {
      if (!grupos[agendamento.data_agendamento]) {
        grupos[agendamento.data_agendamento] = []
      }
      grupos[agendamento.data_agendamento].push(agendamento)
    })

    return grupos
  }, [agendamentos])

  // Navegar entre meses
  const mesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11)
      setAnoAtual(anoAtual - 1)
    } else {
      setMesAtual(mesAtual - 1)
    }
  }

  const proximoMes = () => {
    if (mesAtual === 11) {
      setMesAtual(0)
      setAnoAtual(anoAtual + 1)
    } else {
      setMesAtual(mesAtual + 1)
    }
  }

  const mesHoje = () => {
    setMesAtual(hoje.getMonth())
    setAnoAtual(hoje.getFullYear())
  }

  // Obter agendamentos do dia selecionado
  const agendamentosDoDia = diaSelecionado ? agendamentosPorDia[diaSelecionado] || [] : []

  const dias = getDiasDoMes(mesAtual, anoAtual)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-500'
      case 'cancelado':
        return 'bg-red-500'
      case 'concluido':
        return 'bg-blue-500'
      default:
        return 'bg-yellow-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado'
      case 'cancelado':
        return 'Cancelado'
      case 'concluido':
        return 'Concluído'
      default:
        return 'Pendente'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendário */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            {/* Header do calendário */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {MESES[mesAtual]} {anoAtual}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={mesAnterior}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={mesHoje}>
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={proximoMes}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Grid do calendário */}
            <div className="grid grid-cols-7 gap-2">
              {/* Cabeçalho dos dias da semana */}
              {DIAS_SEMANA.map(dia => (
                <div key={dia} className="text-center font-semibold text-sm text-muted-foreground py-2">
                  {dia}
                </div>
              ))}

              {/* Dias do mês */}
              {dias.map((dia, index) => {
                if (dia === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const dataFormatada = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
                const agendamentosNoDia = agendamentosPorDia[dataFormatada] || []
                const ehHoje = dia === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear()
                const ehSelecionado = diaSelecionado === dataFormatada

                return (
                  <button
                    key={dia}
                    onClick={() => setDiaSelecionado(dataFormatada)}
                    className={cn(
                      "aspect-square p-2 rounded-lg border-2 transition-all hover:border-primary/50",
                      ehHoje && "border-primary bg-primary/5",
                      ehSelecionado && "border-primary bg-primary/10",
                      !ehHoje && !ehSelecionado && "border-transparent hover:bg-accent"
                    )}
                  >
                    <div className="h-full flex flex-col">
                      <span className={cn(
                        "text-sm font-medium",
                        ehHoje && "text-primary font-bold"
                      )}>
                        {dia}
                      </span>

                      {/* Indicadores de agendamentos */}
                      {agendamentosNoDia.length > 0 && (
                        <div className="flex-1 flex flex-col gap-0.5 mt-1 overflow-hidden">
                          {agendamentosNoDia.slice(0, 3).map((agendamento, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-1 rounded-full",
                                getStatusColor(agendamento.status)
                              )}
                            />
                          ))}
                          {agendamentosNoDia.length > 3 && (
                            <span className="text-[10px] text-muted-foreground mt-0.5">
                              +{agendamentosNoDia.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel lateral com detalhes */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {diaSelecionado
                ? `Agendamentos - ${new Date(diaSelecionado + 'T00:00:00').toLocaleDateString('pt-BR')}`
                : 'Selecione um dia'}
            </h3>

            {diaSelecionado && agendamentosDoDia.length > 0 ? (
              <div className="space-y-3">
                {agendamentosDoDia
                  .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
                  .map((agendamento) => (
                    <Link
                      key={agendamento.id}
                      href={`/agendamentos/${agendamento.id}`}
                      className="block"
                    >
                      <Card className="hover:shadow-md transition-shadow border-l-4" style={{
                        borderLeftColor: getStatusColor(agendamento.status).replace('bg-', '#').replace('500', '')
                      }}>
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {agendamento.hora_inicio} - {agendamento.hora_fim}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {agendamento.clientes?.nome || 'Cliente não encontrado'}
                              </span>
                            </div>

                            <div className="text-sm text-muted-foreground">
                              {agendamento.servicos?.nome || 'Serviço não encontrado'}
                            </div>

                            <div className="flex items-center justify-between">
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded",
                                agendamento.status === 'confirmado' && "bg-green-100 text-green-800",
                                agendamento.status === 'cancelado' && "bg-red-100 text-red-800",
                                agendamento.status === 'concluido' && "bg-blue-100 text-blue-800",
                                !agendamento.status && "bg-yellow-100 text-yellow-800"
                              )}>
                                {getStatusLabel(agendamento.status)}
                              </span>

                              {agendamento.valor_total && (
                                <span className="text-sm font-semibold text-green-600">
                                  R$ {agendamento.valor_total.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            ) : diaSelecionado ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum agendamento neste dia
              </p>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Clique em um dia no calendário para ver os agendamentos
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
