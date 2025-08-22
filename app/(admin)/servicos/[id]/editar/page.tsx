import { ServiceForm } from '@/components/admin/service-form'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'

interface EditarServicoPageProps {
  params: { id: string }
}

export default async function EditarServicoPage({ params }: EditarServicoPageProps) {
  const { id } = params
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: servico } = await supabase
    .from('servicos')
    .select('*')
    .eq('id', id)
    .single()

  if (!servico && service) {
    const { data } = await service
      .from('servicos')
      .select('*')
      .eq('id', id)
      .single()
    servico = data
  }

  if (!servico) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Serviço</h1>
      <ServiceForm service={servico} isEditing={true} />
    </div>
  )
}