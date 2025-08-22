import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { HorariosClientActions } from '@/components/admin/horarios-client-actions'
import { HorarioActions } from '@/components/admin/horario-actions'
import { Clock, Calendar, Plus } from 'lucide-react'
import Link from 'next/link'

const diasSemana = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
]

export default async function HorariosPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: horarios } = await supabase
    .from('horarios_funcionamento')
    .select('*')
    .order('dia_semana', { ascending: true })

  if (!horarios && service) {
    const { data } = await service
      .from('horarios_funcionamento')
      .select('*')
      .order('dia_semana', { ascending: true })
    horarios = data || []
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Horários de Funcionamento</h1>
        <Link href="/horarios/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Horário
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {horarios && horarios.length > 0 ? (
          horarios.map((horario) => (
            <Card key={horario.id} className={`${!horario.ativo ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {diasSemana[horario.dia_semana] || `Dia ${horario.dia_semana}`}
                    {!horario.ativo && <span className="text-red-500 text-sm">(Inativo)</span>}
                  </CardTitle>
                  <HorarioActions horarioId={horario.id} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Funcionamento:</span>
                    <span>{horario.hora_abertura} - {horario.hora_fechamento}</span>
                  </div>
                  {horario.intervalo_inicio && horario.intervalo_fim && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Intervalo:</span>
                      <span>{horario.intervalo_inicio} - {horario.intervalo_fim}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum horário de funcionamento configurado</p>
              <Link href="/horarios/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Configurar primeiro horário
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}