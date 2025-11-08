import { CalendarioView } from '@/components/admin/calendario-view'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export default async function CalendarioPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Calendário de Agendamentos</h1>
      </div>

      <CalendarioView agendamentos={agendamentos || []} />
    </div>
  )
}
