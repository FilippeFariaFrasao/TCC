import { AgendamentoForm } from '@/components/admin/agendamento-form'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'

interface EditarAgendamentoPageProps {
  params: { id: string }
}

export default async function EditarAgendamentoPage({ params }: EditarAgendamentoPageProps) {
  const { id } = params
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: agendamento } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('id', id)
    .single()

  if (!agendamento && service) {
    const { data } = await service
      .from('agendamentos')
      .select('*')
      .eq('id', id)
      .single()
    agendamento = data
  }

  if (!agendamento) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Agendamento</h1>
      <AgendamentoForm agendamento={agendamento} isEditing={true} />
    </div>
  )
}