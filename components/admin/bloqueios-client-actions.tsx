'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { createClient } from '@/lib/supabase/client'
import { Edit, Plus, Trash2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface BloqueiosClientActionsProps {
  bloqueioId?: string
  showCreateButton?: boolean
}

const tiposBloqueio = [
  { value: 'feriado', label: 'Feriado', color: 'bg-blue-100 text-blue-800' },
  { value: 'manutencao', label: 'Manutenção', color: 'bg-orange-100 text-orange-800' },
  { value: 'pessoal', label: 'Pessoal', color: 'bg-purple-100 text-purple-800' },
  { value: 'outro', label: 'Outro', color: 'bg-gray-100 text-gray-800' }
]

export function BloqueiosClientActions({ bloqueioId, showCreateButton }: BloqueiosClientActionsProps) {
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [bloqueio, setBloqueio] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const [formData, setFormData] = useState({
    hora_inicio: '',
    hora_fim: '',
    motivo: '',
    tipo: 'outro'
  })
  
  const router = useRouter()
  const supabase = createClient()

  const resetForm = () => {
    setFormData({
      hora_inicio: '',
      hora_fim: '',
      motivo: '',
      tipo: 'outro'
    })
    setSelectedDate(undefined)
  }

  const loadBloqueio = async () => {
    if (!bloqueioId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bloqueios_agenda')
        .select('*')
        .eq('id', bloqueioId)
        .single()

      if (error) throw error
      
      setFormData({
        hora_inicio: data.hora_inicio || '',
        hora_fim: data.hora_fim || '',
        motivo: data.motivo || '',
        tipo: data.tipo || 'outro'
      })
      setSelectedDate(data.data_bloqueio ? new Date(data.data_bloqueio) : undefined)
      setBloqueio(data)
    } catch (error) {
      console.error('Erro ao carregar bloqueio:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDate) {
      alert('Por favor, selecione uma data')
      return
    }

    try {
      const bloqueioData = {
        data_bloqueio: format(selectedDate, 'yyyy-MM-dd'),
        hora_inicio: formData.hora_inicio || null,
        hora_fim: formData.hora_fim || null,
        motivo: formData.motivo || null,
        tipo: formData.tipo
      }

      console.log('Salvando bloqueio:', { formMode, bloqueioId, bloqueioData })

      if (formMode === 'edit' && bloqueioId) {
        const { data, error } = await supabase
          .from('bloqueios_agenda')
          .update(bloqueioData)
          .eq('id', bloqueioId)
          .select()
        
        if (error) throw error
        console.log('Bloqueio atualizado:', data)
      } else {
        const { data, error } = await supabase
          .from('bloqueios_agenda')
          .insert([bloqueioData])
          .select()
        
        if (error) throw error
        console.log('Bloqueio criado:', data)
      }

      setShowForm(false)
      resetForm()
      router.refresh()
    } catch (error: any) {
      console.error('Erro ao salvar bloqueio:', error)
      const errorMessage = error.message || error.details || 'Erro desconhecido ao salvar bloqueio'
      alert(`Erro ao salvar bloqueio: ${errorMessage}`)
    }
  }

  const handleDelete = async () => {
    if (!bloqueioId) return

    try {
      console.log('Tentando deletar bloqueio:', bloqueioId)
      
      const { data, error } = await supabase
        .from('bloqueios_agenda')
        .delete()
        .eq('id', bloqueioId)
        .select()

      if (error) {
        console.error('Erro do Supabase:', error)
        throw error
      }

      console.log('Bloqueio deletado com sucesso:', data)
      setShowDeleteDialog(false)
      router.refresh()
    } catch (error: any) {
      console.error('Erro ao deletar bloqueio:', error)
      const errorMessage = error.message || error.details || 'Erro desconhecido ao deletar bloqueio'
      alert(`Erro ao deletar bloqueio: ${errorMessage}`)
    }
  }

  const openEditForm = async () => {
    setFormMode('edit')
    await loadBloqueio()
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
          Criar Primeiro Bloqueio
        </Button>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Novo Bloqueio
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Data do Bloqueio</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hora_inicio">Hora Início (Opcional)</Label>
                  <Input
                    type="time"
                    id="hora_inicio"
                    value={formData.hora_inicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">Deixe vazio para bloquear o dia inteiro</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora_fim">Hora Fim (Opcional)</Label>
                  <Input
                    type="time"
                    id="hora_fim"
                    value={formData.hora_fim}
                    onChange={(e) => setFormData(prev => ({ ...prev, hora_fim: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Bloqueio</Label>
                <select
                  id="tipo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                >
                  {tiposBloqueio.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo</Label>
                <Input
                  id="motivo"
                  placeholder="Ex: Feriado nacional, manutenção do equipamento..."
                  value={formData.motivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                />
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

  if (!bloqueioId) {
    return (
      <>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Bloqueio
        </Button>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Novo Bloqueio
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Data do Bloqueio</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hora_inicio">Hora Início (Opcional)</Label>
                  <Input
                    type="time"
                    id="hora_inicio"
                    value={formData.hora_inicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">Deixe vazio para bloquear o dia inteiro</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora_fim">Hora Fim (Opcional)</Label>
                  <Input
                    type="time"
                    id="hora_fim"
                    value={formData.hora_fim}
                    onChange={(e) => setFormData(prev => ({ ...prev, hora_fim: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Bloqueio</Label>
                <select
                  id="tipo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                >
                  {tiposBloqueio.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo</Label>
                <Input
                  id="motivo"
                  placeholder="Ex: Feriado nacional, manutenção do equipamento..."
                  value={formData.motivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                />
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Bloqueio
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Data do Bloqueio</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="rounded-md border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Hora Início (Opcional)</Label>
                <Input
                  type="time"
                  id="hora_inicio"
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
                />
                <p className="text-xs text-gray-500">Deixe vazio para bloquear o dia inteiro</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora_fim">Hora Fim (Opcional)</Label>
                <Input
                  type="time"
                  id="hora_fim"
                  value={formData.hora_fim}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora_fim: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Bloqueio</Label>
              <select
                id="tipo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
              >
                {tiposBloqueio.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo</Label>
              <Input
                id="motivo"
                placeholder="Ex: Feriado nacional, manutenção do equipamento..."
                value={formData.motivo}
                onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
              />
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
            <p>Tem certeza que deseja excluir este bloqueio de agenda?</p>
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