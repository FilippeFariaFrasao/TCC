'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { createClient } from '@/lib/supabase/client'
import { Ban, Clock, AlertTriangle, Edit, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface BloqueioAgenda {
  id: string
  data_bloqueio?: string
  hora_inicio?: string
  hora_fim?: string
  motivo?: string
  tipo?: string
  created_at: string
}

const tiposBloqueio = [
  { value: 'feriado', label: 'Feriado', color: 'bg-blue-100 text-blue-800' },
  { value: 'manutencao', label: 'Manutenção', color: 'bg-orange-100 text-orange-800' },
  { value: 'pessoal', label: 'Pessoal', color: 'bg-purple-100 text-purple-800' },
  { value: 'outro', label: 'Outro', color: 'bg-gray-100 text-gray-800' }
]

export function BloqueiosList() {
  const [bloqueios, setBloqueios] = useState<BloqueioAgenda[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBloqueio, setEditingBloqueio] = useState<BloqueioAgenda | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [bloqueioToDelete, setBloqueioToDelete] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const [formData, setFormData] = useState({
    hora_inicio: '',
    hora_fim: '',
    motivo: '',
    tipo: 'outro'
  })

  const supabase = createClient()

  useEffect(() => {
    loadBloqueios()
  }, [])

  const loadBloqueios = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bloqueios_agenda')
        .select('*')
        .order('data_bloqueio', { ascending: false })

      if (error) throw error
      setBloqueios(data || [])
    } catch (error) {
      console.error('Erro ao carregar bloqueios:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      hora_inicio: '',
      hora_fim: '',
      motivo: '',
      tipo: 'outro'
    })
    setSelectedDate(undefined)
    setEditingBloqueio(null)
  }

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (bloqueio: BloqueioAgenda) => {
    setFormData({
      hora_inicio: bloqueio.hora_inicio || '',
      hora_fim: bloqueio.hora_fim || '',
      motivo: bloqueio.motivo || '',
      tipo: bloqueio.tipo || 'outro'
    })
    setSelectedDate(bloqueio.data_bloqueio ? new Date(bloqueio.data_bloqueio) : undefined)
    setEditingBloqueio(bloqueio)
    setShowForm(true)
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

      if (editingBloqueio) {
        const { error } = await supabase
          .from('bloqueios_agenda')
          .update(bloqueioData)
          .eq('id', editingBloqueio.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('bloqueios_agenda')
          .insert([bloqueioData])
        
        if (error) throw error
      }

      loadBloqueios()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar bloqueio:', error)
      alert('Erro ao salvar bloqueio')
    }
  }

  const handleDelete = async (bloqueioId: string) => {
    try {
      const { error } = await supabase
        .from('bloqueios_agenda')
        .delete()
        .eq('id', bloqueioId)

      if (error) throw error
      
      setBloqueios(prev => prev.filter(b => b.id !== bloqueioId))
      setShowDeleteDialog(false)
      setBloqueioToDelete(null)
    } catch (error) {
      console.error('Erro ao deletar bloqueio:', error)
      alert('Erro ao deletar bloqueio')
    }
  }

  const getTipoConfig = (tipo: string) => {
    return tiposBloqueio.find(t => t.value === tipo) || tiposBloqueio[3]
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
        <h1 className="text-3xl font-bold">Bloqueios de Agenda</h1>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Bloqueio
        </Button>
      </div>

      <div className="grid gap-4">
        {bloqueios.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum bloqueio encontrado</p>
              <Button onClick={openCreateForm} className="mt-4">
                Criar Primeiro Bloqueio
              </Button>
            </CardContent>
          </Card>
        ) : (
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(bloqueio)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBloqueioToDelete(bloqueio.id)
                          setShowDeleteDialog(true)
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingBloqueio ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingBloqueio ? 'Editar Bloqueio' : 'Novo Bloqueio'}
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
                {editingBloqueio ? 'Salvar' : 'Criar'}
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
              onClick={() => bloqueioToDelete && handleDelete(bloqueioToDelete)}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}