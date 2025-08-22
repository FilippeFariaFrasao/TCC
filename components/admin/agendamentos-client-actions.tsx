'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AgendamentoForm } from './agendamento-form'
import { createClient } from '@/lib/supabase/client'
import { Edit, Plus, Trash2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AgendamentosClientActionsProps {
  agendamentoId?: string
  showCreateButton?: boolean
}

const statusOptions = [
  { value: 'confirmado', label: 'Confirmado', color: 'bg-green-100 text-green-800' },
  { value: 'pendente', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  { value: 'finalizado', label: 'Finalizado', color: 'bg-blue-100 text-blue-800' },
]

export function AgendamentosClientActions({ agendamentoId, showCreateButton }: AgendamentosClientActionsProps) {
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [agendamento, setAgendamento] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const loadAgendamento = async () => {
    if (!agendamentoId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('id', agendamentoId)
        .single()

      if (error) throw error
      setAgendamento(data)
    } catch (error) {
      console.error('Erro ao carregar agendamento:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!agendamentoId) return

    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', agendamentoId)

      if (error) throw error
      
      // Recarregar a página para mostrar a mudança
      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do agendamento')
    }
  }

  const handleDelete = async () => {
    if (!agendamentoId) return

    try {
      console.log('Tentando deletar agendamento:', agendamentoId)
      
      const { data, error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', agendamentoId)
        .select()

      if (error) {
        console.error('Erro do Supabase:', error)
        throw error
      }

      console.log('Agendamento deletado com sucesso:', data)
      setShowDeleteDialog(false)
      router.refresh()
    } catch (error: any) {
      console.error('Erro ao deletar agendamento:', error)
      const errorMessage = error.message || error.details || 'Erro desconhecido ao deletar agendamento'
      alert(`Erro ao deletar agendamento: ${errorMessage}`)
    }
  }

  const openEditForm = async () => {
    await loadAgendamento()
    setShowForm(true)
  }

  const openCreateForm = () => {
    setAgendamento(null)
    setShowForm(true)
  }

  const handleFormSave = () => {
    setShowForm(false)
    router.refresh()
  }

  if (showCreateButton) {
    return (
      <>
        <Button onClick={openCreateForm} className="mt-4">
          Criar Primeiro Agendamento
        </Button>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AgendamentoForm
              mode="create"
              onClose={() => setShowForm(false)}
              onSave={handleFormSave}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  if (!agendamentoId) {
    return (
      <>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Button>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AgendamentoForm
              mode="create"
              onClose={() => setShowForm(false)}
              onSave={handleFormSave}
            />
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
          className="h-8 w-8 p-0"
          disabled={loading}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {agendamento && (
            <AgendamentoForm
              agendamento={{
                id: agendamento.id,
                cliente_id: agendamento.cliente_id,
                servico_id: agendamento.servico_id,
                data_agendamento: agendamento.data_agendamento,
                hora_inicio: agendamento.hora_inicio,
                hora_fim: agendamento.hora_fim,
                status: agendamento.status,
                observacoes: agendamento.observacoes,
                valor_total: agendamento.valor_total
              }}
              mode="edit"
              onClose={() => setShowForm(false)}
              onSave={handleFormSave}
            />
          )}
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
            <p>Tem certeza que deseja excluir este agendamento?</p>
            <p className="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
            >
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