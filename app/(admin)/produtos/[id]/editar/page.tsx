import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { ProductForm } from '@/components/admin/product-form'

interface EditarProdutoPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarProdutoPage({ params }: EditarProdutoPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: produto } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()

  if (!produto && service) {
    const { data } = await service
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single()
    produto = data
  }

  if (!produto) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Produto</h1>
      <ProductForm produto={produto} isEditing={true} />
    </div>
  )
}
