import { ClientForm } from '@/components/admin/client-form'

export default function NovoClientePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Novo Cliente</h1>
      <ClientForm />
    </div>
  )
}