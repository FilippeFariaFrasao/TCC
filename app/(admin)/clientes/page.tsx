import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { ClientActions } from '@/components/admin/client-actions'
import { User, Phone, Mail, Calendar, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ClientesPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: clientes } = await supabase
    .from('clientes')
    .select('*')
    .order('nome', { ascending: true })

  if (!clientes && service) {
    const { data } = await service
      .from('clientes')
      .select('*')
      .order('nome', { ascending: true })
    clientes = data || []
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Link href="/clientes/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes?.map((cliente) => (
          <Card key={cliente.id} className={`${!cliente.ativo ? 'opacity-60 border-gray-300' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {cliente.nome}
                {!cliente.ativo && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    Inativo
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{cliente.telefone}</span>
                </div>
                {cliente.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{cliente.email}</span>
                  </div>
                )}
                {cliente.data_nascimento && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(cliente.data_nascimento).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {cliente.observacoes && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                    <p className="text-gray-600">{cliente.observacoes}</p>
                  </div>
                )}
                <ClientActions clienteId={cliente.id} isActive={cliente.ativo} />
              </div>
            </CardContent>
          </Card>
        )) || (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Nenhum cliente encontrado</p>
                <Link href="/clientes/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar primeiro cliente
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}