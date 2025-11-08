import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Scissors, Phone, Mail, Calendar, Plus, Badge } from 'lucide-react'
import Link from 'next/link'
import type { Colaborador } from '@/lib/types/colaborador'

export default async function ColaboradoresPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: colaboradores } = await supabase
    .from('colaboradores')
    .select('*')
    .order('nome', { ascending: true })

  if (!colaboradores && service) {
    const { data } = await service
      .from('colaboradores')
      .select('*')
      .order('nome', { ascending: true })
    colaboradores = data || []
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Colaboradores</h1>
        <Link href="/colaboradores/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Colaborador
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colaboradores && colaboradores.length > 0 ? (
          colaboradores.map((colaborador: Colaborador) => (
            <Card
              key={colaborador.id}
              className={`${!colaborador.ativo ? 'opacity-60 border-gray-300' : ''}`}
              style={{ borderLeftColor: colaborador.cor_agenda || '#6366f1', borderLeftWidth: '4px' }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  {colaborador.nome}
                  {!colaborador.ativo && (
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
                    <span>{colaborador.telefone}</span>
                  </div>
                  {colaborador.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{colaborador.email}</span>
                    </div>
                  )}
                  {colaborador.data_admissao && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Desde {new Date(colaborador.data_admissao).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  {colaborador.especialidades && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                      <div className="flex items-center gap-1 mb-1">
                        <Badge className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-700 font-medium">Especialidades:</span>
                      </div>
                      <p className="text-gray-600">{colaborador.especialidades}</p>
                    </div>
                  )}
                  {colaborador.comissao_percentual && (
                    <div className="text-sm text-gray-600">
                      Comissão: {colaborador.comissao_percentual}%
                    </div>
                  )}
                  <div className="pt-3">
                    <Link href={`/colaboradores/${colaborador.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="text-center py-8">
              <Scissors className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum colaborador encontrado</p>
              <Link href="/colaboradores/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar primeiro colaborador
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
