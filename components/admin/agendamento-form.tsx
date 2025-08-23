'use client'

import { useState, useEffect } from 'react'
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

type Agendamento = Tables<'agendamentos'>
type Cliente = Tables<'clientes'>
type Servico = Tables<'servicos'>

interface AgendamentoFormProps {
  agendamento?: Agendamento
  isEditing?: boolean
}

const statusOptions = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'concluido', label: 'Finalizado' },
]

export function AgendamentoForm({ agendamento, isEditing = false }: AgendamentoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [formData, setFormData] = useState({
    data_agendamento: agendamento?.data_agendamento || '',
    hora_inicio: agendamento?.hora_inicio || '',
    hora_fim: agendamento?.hora_fim || '',
    cliente_id: agendamento?.cliente_id || '',
    servico_id: agendamento?.servico_id || '',
    status: agendamento?.status || 'pendente',
    valor_total: agendamento?.valor_total || 0,
    observacoes: agendamento?.observacoes || '',
  })

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()

      // Load clientes
      const { data: clientesData } = await supabase
        .from('clientes')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true })

      if (clientesData) setClientes(clientesData)

      // Load servicos
      const { data: servicosData } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true })

      if (servicosData) setServicos(servicosData)
    }

    loadData()
  }, [])

  // Auto-calculate end time and price based on service
  useEffect(() => {
    if (formData.servico_id && formData.hora_inicio) {
      const servico = servicos.find(s => s.id === formData.servico_id)
      if (servico) {
        const [hours, minutes] = formData.hora_inicio.split(':').map(Number)
        const startDate = new Date()
        startDate.setHours(hours, minutes, 0, 0)
        
        const endDate = new Date(startDate.getTime() + servico.duracao_minutos * 60000)
        const endTime = endDate.toTimeString().slice(0, 5)

        setFormData(prev => ({
          ...prev,
          hora_fim: endTime,
          valor_total: servico.preco
        }))
      }
    }
  }, [formData.servico_id, formData.hora_inicio, servicos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      if (isEditing && agendamento) {
        const { error } = await supabase
          .from('agendamentos')
          .update({
            data_agendamento: formData.data_agendamento,
            hora_inicio: formData.hora_inicio,
            hora_fim: formData.hora_fim,
            cliente_id: formData.cliente_id || null,
            servico_id: formData.servico_id || null,
            status: formData.status,
            valor_total: formData.valor_total || null,
            observacoes: formData.observacoes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', agendamento.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('agendamentos')
          .insert({
            data_agendamento: formData.data_agendamento,
            hora_inicio: formData.hora_inicio,
            hora_fim: formData.hora_fim,
            cliente_id: formData.cliente_id || null,
            servico_id: formData.servico_id || null,
            status: formData.status,
            valor_total: formData.valor_total || null,
            observacoes: formData.observacoes || null,
          })

        if (error) throw error
      }

      router.push('/agendamentos')
      router.refresh()
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error)
      alert('Erro ao salvar agendamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!agendamento || !confirm('Tem certeza que deseja excluir este agendamento?')) {
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', agendamento.id)

      if (error) throw error

      router.push('/agendamentos')
      router.refresh()
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error)
      alert('Erro ao excluir agendamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_agendamento">Data *</Label>
              <Input
                id="data_agendamento"
                type="date"
                required
                value={formData.data_agendamento}
                onChange={(e) => setFormData({ ...formData, data_agendamento: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Hora de Início *</Label>
              <Input
                id="hora_inicio"
                type="time"
                required
                value={formData.hora_inicio}
                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_fim">Hora de Fim *</Label>
              <Input
                id="hora_fim"
                type="time"
                required
                value={formData.hora_fim}
                onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente_id">Cliente</Label>
              <Select
                value={formData.cliente_id || ''}
                onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.telefone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="servico_id">Serviço</Label>
              <Select
                value={formData.servico_id || ''}
                onValueChange={(value) => setFormData({ ...formData, servico_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicos.map((servico) => (
                    <SelectItem key={servico.id} value={servico.id}>
                      {servico.nome} - R$ {servico.preco.toFixed(2)} ({servico.duracao_minutos}min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || 'pendente'}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_total">Valor Total (R$)</Label>
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_total || 0}
                onChange={(e) => setFormData({ ...formData, valor_total: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes || ''}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações sobre o agendamento..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? 'Atualizar' : 'Criar'} Agendamento
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/agendamentos')}
              disabled={loading}
            >
              Cancelar
            </Button>

            {isEditing && agendamento && (
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