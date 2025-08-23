'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AgendamentoForm } from './agendamento-form'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Clock, User, Trash2, Edit, Plus, MoreHorizontal, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface AgendamentoWithRelations {
  id: string
  cliente_id: string
  servico_id: string
  data_agendamento: string
  hora_inicio: string
  hora_fim: string
  status: string
  observacoes?: string
  valor_total?: number
  created_at: string
  updated_at: string
  clientes: {
    nome: string
    telefone: string
  } | null
  servicos: {
    nome: string
    duracao_minutos: number
    preco: number
  } | null
}

const statusOptions = [
  { value: 'confirmado', label: 'Confirmado', color: 'bg-green-100 text-green-800' },
  { value: 'pendente', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  { value: 'finalizado', label: 'Finalizado', color: 'bg-blue-100 text-blue-800' },
]

export function AgendamentosList() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAgendamento, setSelectedAgendamento] = useState<AgendamentoWithRelations | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [agendamentoToDelete, setAgendamentoToDelete] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadAgendamentos()
  }, [])

  const loadAgendamentos = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes (nome, telefone),
          servicos (nome, duracao_minutos, preco)
        `)
        .order('data_agendamento', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (error) throw error
      setAgendamentos(data || [])
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (agendamentoId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', agendamentoId)

      if (error) throw error
      
      // Atualizar o estado local
      setAgendamentos(prev => 
        prev.map(ag => 
          ag.id === agendamentoId 
            ? { ...ag, status: newStatus, updated_at: new Date().toISOString() }
            : ag
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do agendamento')
    }
  }

  const handleDelete = async (agendamentoId: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', agendamentoId)

      if (error) throw error
      
      setAgendamentos(prev => prev.filter(ag => ag.id !== agendamentoId))
      setShowDeleteDialog(false)
      setAgendamentoToDelete(null)
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error)
      alert('Erro ao deletar agendamento')
    }
  }

  const openEditForm = (agendamento: AgendamentoWithRelations) => {
    setSelectedAgendamento(agendamento)
    setFormMode('edit')
    setShowForm(true)
  }

  const openCreateForm = () => {
    setSelectedAgendamento(null)
    setFormMode('create')
    setShowForm(true)
  }

  const getStatusConfig = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[1]
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
      {/* Header com botão de criar */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agendamentos</h1>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Lista de agendamentos */}
      <div className="grid gap-4">
        {agendamentos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum agendamento encontrado</p>
              <Button onClick={openCreateForm} className="mt-4">
                Criar Primeiro Agendamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          agendamentos.map((agendamento) => {
            const statusConfig = getStatusConfig(agendamento.status)
            return (
              <Card key={agendamento.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <Link 
                        href={`/agendamentos/${agendamento.id}`} 
                        className="hover:underline"
                      >
                        {agendamento.data_agendamento.split('-').reverse().join('/')}
                      </Link>
                    </CardTitle>
                    
                    <div className="flex items-center gap-2">
                      {/* Status com possibilidade de alteração rápida */}
                      <Select 
                        value={agendamento.status} 
                        onValueChange={(value) => handleStatusChange(agendamento.id, value)}
                      >
                        <SelectTrigger className="w-auto h-8">
                          <span className={`px-2 py-1 rounded text-xs ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <span className={`px-2 py-1 rounded text-xs ${status.color}`}>
                                {status.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Botões de ação */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(agendamento)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAgendamentoToDelete(agendamento.id)
                            setShowDeleteDialog(true)
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {agendamento.hora_inicio} - {agendamento.hora_fim}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>
                        {agendamento.clientes?.nome || 'Cliente não encontrado'}
                        {agendamento.clientes?.telefone && (
                          <span className="text-gray-500 text-sm ml-2">
                            ({agendamento.clientes.telefone})
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {agendamento.servicos?.nome || 'Serviço não encontrado'}
                      </span>
                      {agendamento.valor_total && (
                        <span className="text-green-600 font-semibold">
                          R$ {agendamento.valor_total.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {agendamento.observacoes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Observações:</strong> {agendamento.observacoes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Dialog do formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AgendamentoForm
            agendamento={selectedAgendamento ? {
              id: selectedAgendamento.id,
              cliente_id: selectedAgendamento.cliente_id,
              servico_id: selectedAgendamento.servico_id,
              data_agendamento: selectedAgendamento.data_agendamento,
              hora_inicio: selectedAgendamento.hora_inicio,
              hora_fim: selectedAgendamento.hora_fim,
              status: selectedAgendamento.status,
              observacoes: selectedAgendamento.observacoes,
              valor_total: selectedAgendamento.valor_total
            } : undefined}
            mode={formMode}
            onClose={() => setShowForm(false)}
            onSave={loadAgendamentos}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
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
              onClick={() => agendamentoToDelete && handleDelete(agendamentoToDelete)}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}