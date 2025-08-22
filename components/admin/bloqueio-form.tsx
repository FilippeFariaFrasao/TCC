'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/lib/supabase/types'
import { Loader2 } from 'lucide-react'

type BloqueioAgenda = Tables<'bloqueios_agenda'>

interface BloqueioFormProps {
  bloqueio?: BloqueioAgenda
  isEditing?: boolean
}

const tiposBloqueio = [
  { value: 'feriado', label: 'Feriado' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'pessoal', label: 'Pessoal' },
  { value: 'outro', label: 'Outro' },
]

export function BloqueioForm({ bloqueio, isEditing = false }: BloqueioFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    data_bloqueio: bloqueio?.data_bloqueio || '',
    hora_inicio: bloqueio?.hora_inicio || '',
    hora_fim: bloqueio?.hora_fim || '',
    tipo: bloqueio?.tipo || 'outro',
    motivo: bloqueio?.motivo || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      if (isEditing && bloqueio) {
        const { error } = await supabase
          .from('bloqueios_agenda')
          .update({
            data_bloqueio: formData.data_bloqueio || null,
            hora_inicio: formData.hora_inicio || null,
            hora_fim: formData.hora_fim || null,
            tipo: formData.tipo || null,
            motivo: formData.motivo || null,
          })
          .eq('id', bloqueio.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('bloqueios_agenda')
          .insert({
            data_bloqueio: formData.data_bloqueio || null,
            hora_inicio: formData.hora_inicio || null,
            hora_fim: formData.hora_fim || null,
            tipo: formData.tipo || null,
            motivo: formData.motivo || null,
          })

        if (error) throw error
      }

      router.push('/bloqueios')
      router.refresh()
    } catch (error) {
      console.error('Erro ao salvar bloqueio:', error)
      alert('Erro ao salvar bloqueio. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!bloqueio || !confirm('Tem certeza que deseja excluir este bloqueio?')) {
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('bloqueios_agenda')
        .delete()
        .eq('id', bloqueio.id)

      if (error) throw error

      router.push('/bloqueios')
      router.refresh()
    } catch (error) {
      console.error('Erro ao excluir bloqueio:', error)
      alert('Erro ao excluir bloqueio. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Editar Bloqueio de Agenda' : 'Novo Bloqueio de Agenda'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_bloqueio">Data do Bloqueio</Label>
              <Input
                id="data_bloqueio"
                type="date"
                value={formData.data_bloqueio || ''}
                onChange={(e) => setFormData({ ...formData, data_bloqueio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Bloqueio</Label>
              <Select
                value={formData.tipo || 'outro'}
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposBloqueio.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Hora de Início (opcional)</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio || ''}
                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                placeholder="Deixe em branco para dia inteiro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_fim">Hora de Fim (opcional)</Label>
              <Input
                id="hora_fim"
                type="time"
                value={formData.hora_fim || ''}
                onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
                placeholder="Deixe em branco para dia inteiro"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo/Descrição</Label>
            <Textarea
              id="motivo"
              value={formData.motivo || ''}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              placeholder="Descreva o motivo do bloqueio..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? 'Atualizar' : 'Criar'} Bloqueio
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/bloqueios')}
              disabled={loading}
            >
              Cancelar
            </Button>

            {isEditing && bloqueio && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="ml-auto"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Excluir
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}