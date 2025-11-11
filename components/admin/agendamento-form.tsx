'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/lib/supabase/types'
import { Loader2, Trash2 } from 'lucide-react'
import { AgendamentoProdutosSelector, ProdutoAgendamento } from './agendamento-produtos-selector'

type Agendamento = Tables<'agendamentos'>
type Cliente = Tables<'clientes'>
type Servico = Tables<'servicos'>
type Colaborador = Tables<'colaboradores'>

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [formData, setFormData] = useState({
    data_agendamento: agendamento?.data_agendamento || '',
    hora_inicio: agendamento?.hora_inicio || '',
    hora_fim: agendamento?.hora_fim || '',
    cliente_id: agendamento?.cliente_id || '',
    servico_id: agendamento?.servico_id || '',
    colaborador_id: agendamento?.colaborador_id || '',
    status: agendamento?.status || 'pendente',
    valor_total: agendamento?.valor_total || 0,
    observacoes: agendamento?.observacoes || '',
  })
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoAgendamento[]>([])

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

      // Load colaboradores
      const { data: colaboradoresData } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true })

      if (colaboradoresData) setColaboradores(colaboradoresData)

      // Load existing products if editing
      if (isEditing && agendamento) {
        const { data: produtosData } = await supabase
          .from('agendamento_produtos')
          .select(`
            quantidade,
            produtos:produto_id (
              id,
              nome,
              preco_venda,
              unidade_medida
            )
          `)
          .eq('agendamento_id', agendamento.id)

        if (produtosData && produtosData.length > 0) {
          const produtosFormatados: ProdutoAgendamento[] = produtosData.map((item: any) => ({
            produto_id: item.produtos.id,
            produto_nome: item.produtos.nome,
            quantidade: item.quantidade,
            preco_unitario: item.produtos.preco_venda || 0,
            subtotal: item.quantidade * (item.produtos.preco_venda || 0),
            saldo_disponivel: 0, // Will be loaded by the selector component
            unidade_medida: item.produtos.unidade_medida
          }))
          setProdutosSelecionados(produtosFormatados)
        }
      }
    }

    loadData()
  }, [isEditing, agendamento])

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

        // Calculate total including products
        const produtosTotal = produtosSelecionados.reduce((acc, p) => acc + p.subtotal, 0)
        const valorTotal = servico.preco + produtosTotal

        setFormData(prev => ({
          ...prev,
          hora_fim: endTime,
          valor_total: valorTotal
        }))
      }
    }
  }, [formData.servico_id, formData.hora_inicio, servicos, produtosSelecionados])

  // Recalculate total when products change
  useEffect(() => {
    const servico = servicos.find(s => s.id === formData.servico_id)
    const servicoPreco = servico?.preco || 0
    const produtosTotal = produtosSelecionados.reduce((acc, p) => acc + p.subtotal, 0)
    setFormData(prev => ({ ...prev, valor_total: servicoPreco + produtosTotal }))
  }, [produtosSelecionados, formData.servico_id, servicos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      let agendamentoId: string

      if (isEditing && agendamento) {
        // Update existing agendamento
        const { error } = await supabase
          .from('agendamentos')
          .update({
            data_agendamento: formData.data_agendamento,
            hora_inicio: formData.hora_inicio,
            hora_fim: formData.hora_fim,
            cliente_id: formData.cliente_id || null,
            servico_id: formData.servico_id || null,
            colaborador_id: formData.colaborador_id || null,
            status: formData.status,
            valor_total: formData.valor_total || null,
            observacoes: formData.observacoes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', agendamento.id)

        if (error) throw error
        agendamentoId = agendamento.id

        // Delete old products
        const { error: deleteError } = await supabase
          .from('agendamento_produtos')
          .delete()
          .eq('agendamento_id', agendamentoId)

        if (deleteError) throw deleteError
      } else {
        // Create new agendamento
        const { data: newAgendamento, error } = await supabase
          .from('agendamentos')
          .insert({
            data_agendamento: formData.data_agendamento,
            hora_inicio: formData.hora_inicio,
            hora_fim: formData.hora_fim,
            cliente_id: formData.cliente_id || null,
            servico_id: formData.servico_id || null,
            colaborador_id: formData.colaborador_id || null,
            status: formData.status,
            valor_total: formData.valor_total || null,
            observacoes: formData.observacoes || null,
          })
          .select()
          .single()

        if (error) throw error
        if (!newAgendamento) throw new Error('Erro ao criar agendamento')
        agendamentoId = newAgendamento.id
      }

      // Insert new products if any
      if (produtosSelecionados.length > 0) {
        const produtosToInsert = produtosSelecionados.map(p => ({
          agendamento_id: agendamentoId,
          produto_id: p.produto_id,
          quantidade: p.quantidade
        }))

        const { error: produtosError } = await supabase
          .from('agendamento_produtos')
          .insert(produtosToInsert)

        if (produtosError) throw produtosError

        // Create stock movements if status is 'concluido'
        if (formData.status === 'concluido') {
          const movimentacoes = produtosSelecionados.map(p => ({
            produto_id: p.produto_id,
            tipo: 'saida' as const,
            quantidade: p.quantidade,
            motivo: 'Venda',
            observacoes: `Venda no agendamento`,
            agendamento_id: agendamentoId
          }))

          const { error: movimentacoesError } = await supabase
            .from('movimentacoes_estoque')
            .insert(movimentacoes)

          if (movimentacoesError) throw movimentacoesError
        }
      }

      // Success message
      if (produtosSelecionados.length > 0) {
        if (formData.status === 'concluido') {
          alert(`✅ Agendamento salvo com sucesso!\n\n📦 ${produtosSelecionados.length} produto(s) adicionado(s)\n📊 Estoque atualizado automaticamente`)
        } else {
          alert(`✅ Agendamento salvo com sucesso!\n\n📦 ${produtosSelecionados.length} produto(s) adicionado(s)\n⚠️ Estoque será baixado quando marcar como "Finalizado"`)
        }
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
    if (!agendamento) {
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

      setShowDeleteConfirm(false)
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="colaborador_id">Colaborador *</Label>
              <Select
                value={formData.colaborador_id || ''}
                onValueChange={(value) => setFormData({ ...formData, colaborador_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {colaboradores.map((colaborador) => (
                    <SelectItem key={colaborador.id} value={colaborador.id}>
                      {colaborador.nome}
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

          <div className="space-y-2">
            <Label>Produtos (Opcional)</Label>
            <AgendamentoProdutosSelector
              produtosSelecionados={produtosSelecionados}
              onChange={setProdutosSelecionados}
              disabled={loading}
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
                onClick={() => setShowDeleteConfirm(true)}
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

      {isEditing && agendamento && (
        <ConfirmDialog
          open={showDeleteConfirm}
          onCancel={() => {
            if (!loading) {
              setShowDeleteConfirm(false)
            }
          }}
          onConfirm={handleDelete}
          loading={loading}
          icon={<Trash2 className="h-5 w-5 text-destructive" />}
          title="Excluir agendamento"
          description="Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita."
          confirmText="Excluir"
        />
      )}
    </form>
  )
}
