import { ColaboradorForm } from '@/components/admin/colaborador-form'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import type { Colaborador } from '@/lib/types/colaborador'

interface Props {
  params: {
    id: string
  }
}

export default async function EditarColaboradorPage({ params }: Props) {
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: colaborador } = await supabase
    .from('colaboradores')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!colaborador && service) {
    const { data } = await service
      .from('colaboradores')
      .select('*')
      .eq('id', params.id)
      .single()
    colaborador = data
  }

  if (!colaborador) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Colaborador</h1>
      <ColaboradorForm colaborador={colaborador as Colaborador} isEditing />
    </div>
  )
}
