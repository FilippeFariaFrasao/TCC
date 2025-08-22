import { BloqueioForm } from '@/components/admin/bloqueio-form'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'

interface EditarBloqueioPageProps {
  params: { id: string }
}

export default async function EditarBloqueioPage({ params }: EditarBloqueioPageProps) {
  const { id } = params
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: bloqueio } = await supabase
    .from('bloqueios_agenda')
    .select('*')
    .eq('id', id)
    .single()

  if (!bloqueio && service) {
    const { data } = await service
      .from('bloqueios_agenda')
      .select('*')
      .eq('id', id)
      .single()
    bloqueio = data
  }

  if (!bloqueio) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Bloqueio de Agenda</h1>
      <BloqueioForm bloqueio={bloqueio} isEditing={true} />
    </div>
  )
}