'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { Clock, Calendar, Edit, Plus } from 'lucide-react'

interface HorarioFuncionamento {
  id: string
  dia_semana: number
  hora_abertura: string
  hora_fechamento: string
  intervalo_inicio?: string
  intervalo_fim?: string
  ativo: boolean
}

const diasSemana = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
]

export function HorariosList() {
  const [horarios, setHorarios] = useState<HorarioFuncionamento[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingHorario, setEditingHorario] = useState<HorarioFuncionamento | null>(null)

  const [formData, setFormData] = useState({
    dia_semana: 0,
    hora_abertura: '',
    hora_fechamento: '',
    intervalo_inicio: '',
    intervalo_fim: '',
    ativo: true
  })

  const supabase = createClient()

  useEffect(() => {
    loadHorarios()
  }, [])

  const loadHorarios = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('horarios_funcionamento')
        .select('*')
        .order('dia_semana', { ascending: true })

      if (error) throw error
      setHorarios(data || [])
    } catch (error) {
      console.error('Erro ao carregar horários:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      dia_semana: 0,
      hora_abertura: '',
      hora_fechamento: '',
      intervalo_inicio: '',
      intervalo_fim: '',
      ativo: true
    })
    setEditingHorario(null)
  }

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (horario: HorarioFuncionamento) => {
    setFormData({
      dia_semana: horario.dia_semana,
      hora_abertura: horario.hora_abertura,
      hora_fechamento: horario.hora_fechamento,
      intervalo_inicio: horario.intervalo_inicio || '',
      intervalo_fim: horario.intervalo_fim || '',
      ativo: horario.ativo
    })
    setEditingHorario(horario)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const horarioData = {
        ...formData,
        intervalo_inicio: formData.intervalo_inicio || null,
        intervalo_fim: formData.intervalo_fim || null
      }

      if (editingHorario) {
        const { error } = await supabase
          .from('horarios_funcionamento')
          .update(horarioData)
          .eq('id', editingHorario.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('horarios_funcionamento')
          .insert([horarioData])
        
        if (error) throw error
      }

      loadHorarios()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar horário:', error)
      alert('Erro ao salvar horário')
    }
  }


  const toggleAtivo = async (horarioId: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('horarios_funcionamento')
        .update({ ativo: !ativo })
        .eq('id', horarioId)

      if (error) throw error
      loadHorarios()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Horários de Funcionamento</h1>
      </div>

      <div className="grid gap-4">
        {horarios.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum horário configurado</p>
            </CardContent>
          </Card>
        ) : (
          horarios.map((horario) => (
            <Card key={horario.id} className={`${!horario.ativo ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {diasSemana[horario.dia_semana]}
                    {!horario.ativo && <span className="text-red-500 text-sm">(Inativo)</span>}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAtivo(horario.id, horario.ativo)}
                      className={horario.ativo ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                    >
                      {horario.ativo ? 'Inativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(horario)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Funcionamento:</span>
                    <span>{horario.hora_abertura} - {horario.hora_fechamento}</span>
                  </div>
                  {horario.intervalo_inicio && horario.intervalo_fim && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Intervalo:</span>
                      <span>{horario.intervalo_inicio} - {horario.intervalo_fim}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingHorario ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingHorario ? 'Editar Horário' : 'Novo Horário'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dia_semana">Dia da Semana</Label>
              <select
                id="dia_semana"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.dia_semana}
                onChange={(e) => setFormData(prev => ({ ...prev, dia_semana: parseInt(e.target.value) }))}
              >
                {diasSemana.map((dia, index) => (
                  <option key={index} value={index}>{dia}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora_abertura">Hora Abertura</Label>
                <Input
                  type="time"
                  id="hora_abertura"
                  value={formData.hora_abertura}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora_abertura: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora_fechamento">Hora Fechamento</Label>
                <Input
                  type="time"
                  id="hora_fechamento"
                  value={formData.hora_fechamento}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora_fechamento: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="intervalo_inicio">Intervalo Início (Opcional)</Label>
                <Input
                  type="time"
                  id="intervalo_inicio"
                  value={formData.intervalo_inicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, intervalo_inicio: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intervalo_fim">Intervalo Fim (Opcional)</Label>
                <Input
                  type="time"
                  id="intervalo_fim"
                  value={formData.intervalo_fim}
                  onChange={(e) => setFormData(prev => ({ ...prev, intervalo_fim: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <Label htmlFor="ativo">Ativo</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingHorario ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}