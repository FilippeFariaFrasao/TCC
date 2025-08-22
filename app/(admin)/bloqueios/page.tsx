import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { BloqueiosClientActions } from '@/components/admin/bloqueios-client-actions'
import { BloqueioActions } from '@/components/admin/bloqueio-actions'
import { Ban, Calendar, Clock, AlertTriangle, Plus } from 'lucide-react'
import Link from 'next/link'

const tiposBloqueio = [
  { value: 'feriado', label: 'Feriado', color: 'bg-blue-100 text-blue-800' },
  { value: 'manutencao', label: 'Manutenção', color: 'bg-orange-100 text-orange-800' },
  { value: 'pessoal', label: 'Pessoal', color: 'bg-purple-100 text-purple-800' },
  { value: 'outro', label: 'Outro', color: 'bg-gray-100 text-gray-800' }
]

export default async function BloqueiosPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  let { data: bloqueios } = await supabase
    .from('bloqueios_agenda')
    .select('*')
    .order('data_bloqueio', { ascending: false })

  if (!bloqueios && service) {
    const { data } = await service
      .from('bloqueios_agenda')
      .select('*')
      .order('data_bloqueio', { ascending: false })
    bloqueios = data || []
  }

  const getTipoConfig = (tipo: string) => {
    return tiposBloqueio.find(t => t.value === tipo) || tiposBloqueio[3]
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bloqueios de Agenda</h1>
        <Link href="/bloqueios/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Bloqueio
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {bloqueios && bloqueios.length > 0 ? (
          bloqueios.map((bloqueio) => {
            const tipoConfig = getTipoConfig(bloqueio.tipo || 'outro')
            return (
              <Card key={bloqueio.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Ban className="h-5 w-5 text-red-500" />
                      {bloqueio.data_bloqueio ?
                        new Date(bloqueio.data_bloqueio).toLocaleDateString('pt-BR') :
                        'Data não definida'
                      }
                    </CardTitle>
                    <BloqueioActions bloqueioId={bloqueio.id} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {bloqueio.hora_inicio && bloqueio.hora_fim ?
                          `${bloqueio.hora_inicio} - ${bloqueio.hora_fim}` :
                          'Dia inteiro'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                      <span className={`px-2 py-1 rounded text-xs ${tipoConfig.color}`}>
                        {tipoConfig.label}
                      </span>
                    </div>
                    <div>
                      {bloqueio.motivo && (
                        <p className="text-sm text-gray-600 font-medium">
                          {bloqueio.motivo}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Ban className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum bloqueio de agenda encontrado</p>
              <Link href="/bloqueios/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeiro bloqueio
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}