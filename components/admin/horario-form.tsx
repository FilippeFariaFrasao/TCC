'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/lib/supabase/types'
import { Loader2 } from 'lucide-react'

type HorarioFuncionamento = Tables<'horarios_funcionamento'>

interface HorarioFormProps {
  horario?: HorarioFuncionamento
  isEditing?: boolean
}

const diasSemana = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
]

export function HorarioForm({ horario, isEditing = false }: HorarioFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    dia_semana: horario?.dia_semana ?? 1,
    hora_abertura: horario?.hora_abertura || '09:00',
    hora_fechamento: horario?.hora_fechamento || '18:00',
    intervalo_inicio: horario?.intervalo_inicio || '',
    intervalo_fim: horario?.intervalo_fim || '',
    ativo: horario?.ativo ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      if (isEditing && horario) {
        const { error } = await supabase
          .from('horarios_funcionamento')
          .update({
            dia_semana: formData.dia_semana,
            hora_abertura: formData.hora_abertura,
            hora_fechamento: formData.hora_fechamento,
            intervalo_inicio: formData.intervalo_inicio || null,
            intervalo_fim: formData.intervalo_fim || null,
            ativo: formData.ativo,
            updated_at: new Date().toISOString(),
          })
          .eq('id', horario.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('horarios_funcionamento')
          .insert({
            dia_semana: formData.dia_semana,
            hora_abertura: formData.hora_abertura,
            hora_fechamento: formData.hora_fechamento,
            intervalo_inicio: formData.intervalo_inicio || null,
            intervalo_fim: formData.intervalo_fim || null,
            ativo: formData.ativo,
          })

        if (error) throw error
      }

      router.push('/horarios')
      router.refresh()
    } catch (error) {
      console.error('Erro ao salvar horário:', error)
      alert('Erro ao salvar horário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!horario || !confirm('Tem certeza que deseja excluir este horário?')) {
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('horarios_funcionamento')
        .delete()
        .eq('id', horario.id)

      if (error) throw error

      router.push('/horarios')
      router.refresh()
    } catch (error) {
      console.error('Erro ao excluir horário:', error)
      alert('Erro ao excluir horário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Editar Horário de Funcionamento' : 'Novo Horário de Funcionamento'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dia_semana">Dia da Semana *</Label>
            <Select
              value={formData.dia_semana.toString()}
              onValueChange={(value) => setFormData({ ...formData, dia_semana: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia da semana" />
              </SelectTrigger>
              <SelectContent>
                {diasSemana.map((dia) => (
                  <SelectItem key={dia.value} value={dia.value.toString()}>
                    {dia.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hora_abertura">Hora de Abertura *</Label>
              <Input
                id="hora_abertura"
                type="time"
                required
                value={formData.hora_abertura}
                onChange={(e) => setFormData({ ...formData, hora_abertura: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_fechamento">Hora de Fechamento *</Label>
              <Input
                id="hora_fechamento"
                type="time"
                required
                value={formData.hora_fechamento}
                onChange={(e) => setFormData({ ...formData, hora_fechamento: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intervalo_inicio">Início do Intervalo (opcional)</Label>
              <Input
                id="intervalo_inicio"
                type="time"
                value={formData.intervalo_inicio || ''}
                onChange={(e) => setFormData({ ...formData, intervalo_inicio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intervalo_fim">Fim do Intervalo (opcional)</Label>
              <Input
                id="intervalo_fim"
                type="time"
                value={formData.intervalo_fim || ''}
                onChange={(e) => setFormData({ ...formData, intervalo_fim: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
            />
            <Label htmlFor="ativo">Horário ativo</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? 'Atualizar' : 'Criar'} Horário
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/horarios')}
              disabled={loading}
            >
              Cancelar
            </Button>

            {isEditing && horario && (
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