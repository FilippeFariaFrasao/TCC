import { ClientForm } from '@/components/admin/client-form'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'

interface EditarClientePageProps {
  params: { id: string }
}

export default async function EditarClientePage({ params }: EditarClientePageProps) {
  const { id } = params
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: cliente } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (!cliente && service) {
    const { data } = await service
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single()
    cliente = data
  }

  if (!cliente) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Cliente</h1>
      <ClientForm cliente={cliente} isEditing={true} />
    </div>
  )
}