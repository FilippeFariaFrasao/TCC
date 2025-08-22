'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { Edit, Plus, Trash2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HorariosClientActionsProps {
  horarioId?: string
  horarioAtivo?: boolean
  showCreateButton?: boolean
}

const diasSemana = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
]

export function HorariosClientActions({ horarioId, horarioAtivo, showCreateButton }: HorariosClientActionsProps) {
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [horario, setHorario] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const [formData, setFormData] = useState({
    dia_semana: 0,
    hora_abertura: '',
    hora_fechamento: '',
    intervalo_inicio: '',
    intervalo_fim: '',
    ativo: true
  })
  
  const router = useRouter()
  const supabase = createClient()

  const resetForm = () => {
    setFormData({
      dia_semana: 0,
      hora_abertura: '',
      hora_fechamento: '',
      intervalo_inicio: '',
      intervalo_fim: '',
      ativo: true
    })
  }

  const loadHorario = async () => {
    if (!horarioId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('horarios_funcionamento')
        .select('*')
        .eq('id', horarioId)
        .single()

      if (error) throw error
      
      setFormData({
        dia_semana: data.dia_semana,
        hora_abertura: data.hora_abertura,
        hora_fechamento: data.hora_fechamento,
        intervalo_inicio: data.intervalo_inicio || '',
        intervalo_fim: data.intervalo_fim || '',
        ativo: data.ativo
      })
      setHorario(data)
    } catch (error) {
      console.error('Erro ao carregar horário:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const horarioData = {
        ...formData,
        intervalo_inicio: formData.intervalo_inicio || null,
        intervalo_fim: formData.intervalo_fim || null
      }

      console.log('Salvando horário:', { formMode, horarioId, horarioData })

      if (formMode === 'edit' && horarioId) {
        const { data, error } = await supabase
          .from('horarios_funcionamento')
          .update(horarioData)
          .eq('id', horarioId)
          .select()
        
        if (error) throw error
        console.log('Horário atualizado:', data)
      } else {
        const { data, error } = await supabase
          .from('horarios_funcionamento')
          .insert([horarioData])
          .select()
        
        if (error) throw error
        console.log('Horário criado:', data)
      }

      setShowForm(false)
      resetForm()
      router.refresh()
    } catch (error: any) {
      console.error('Erro ao salvar horário:', error)
      const errorMessage = error.message || error.details || 'Erro desconhecido ao salvar horário'
      alert(`Erro ao salvar horário: ${errorMessage}`)
    }
  }

  const handleDelete = async () => {
    if (!horarioId) return

    try {
      console.log('Tentando deletar horário:', horarioId)
      
      const { data, error } = await supabase
        .from('horarios_funcionamento')
        .delete()
        .eq('id', horarioId)
        .select()

      if (error) {
        console.error('Erro do Supabase:', error)
        throw error
      }

      console.log('Horário deletado com sucesso:', data)
      setShowDeleteDialog(false)
      router.refresh()
    } catch (error: any) {
      console.error('Erro ao deletar horário:', error)
      const errorMessage = error.message || error.details || 'Erro desconhecido ao deletar horário'
      alert(`Erro ao deletar horário: ${errorMessage}`)
    }
  }

  const toggleAtivo = async () => {
    if (!horarioId) return

    try {
      const { error } = await supabase
        .from('horarios_funcionamento')
        .update({ ativo: !horarioAtivo })
        .eq('id', horarioId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const openEditForm = async () => {
    setFormMode('edit')
    await loadHorario()
    setShowForm(true)
  }

  const openCreateForm = () => {
    setFormMode('create')
    resetForm()
    setShowForm(true)
  }

  if (showCreateButton) {
    return (
      <>
        <Button onClick={openCreateForm} className="mt-4">
          Configurar Horários
        </Button>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Novo Horário
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
                  Criar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  if (!horarioId) {
    return (
      <>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Horário
        </Button>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Novo Horário
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
                  Criar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAtivo}
          className={horarioAtivo ? "text-orange-600" : "text-green-600"}
        >
          {horarioAtivo ? 'Desativar' : 'Ativar'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={openEditForm}
          disabled={loading}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Horário
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
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Tem certeza que deseja excluir este horário de funcionamento?</p>
            <p className="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}