import { HorarioForm } from '@/components/admin/horario-form'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'

interface EditarHorarioPageProps {
  params: { id: string }
}

export default async function EditarHorarioPage({ params }: EditarHorarioPageProps) {
  const { id } = params
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: horario } = await supabase
    .from('horarios_funcionamento')
    .select('*')
    .eq('id', id)
    .single()

  if (!horario && service) {
    const { data } = await service
      .from('horarios_funcionamento')
      .select('*')
      .eq('id', id)
      .single()
    horario = data
  }

  if (!horario) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Horário de Funcionamento</h1>
      <HorarioForm horario={horario} isEditing={true} />
    </div>
  )
}