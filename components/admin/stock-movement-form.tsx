'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertCircle } from 'lucide-react'

interface StockMovementFormProps {
  tipo: 'entrada' | 'saida'
}

interface Produto {
  id: string
  nome: string
  unidade_medida: string
  saldo_atual: number | null
}

const motivosEntrada = [
  'Compra',
  'Doação',
  'Devolução',
  'Ajuste',
  'Transferência',
  'Outro'
]

const motivosSaida = [
  'Venda',
  'Consumo',
  'Perda',
  'Doação',
  'Ajuste',
  'Transferência',
  'Outro'
]

export function StockMovementForm({ tipo }: StockMovementFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingProdutos, setLoadingProdutos] = useState(true)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)

  const [formData, setFormData] = useState({
    produto_id: '',
    quantidade: 1,
    motivo: '',
    observacoes: '',
  })

  // Carregar produtos
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('view_estoque_atual')
          .select('id, nome, unidade_medida, saldo_atual')
          .eq('ativo', true)
          .order('nome', { ascending: true })

        if (error) throw error
        setProdutos(data || [])
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        alert('Erro ao carregar produtos.')
      } finally {
        setLoadingProdutos(false)
      }
    }

    carregarProdutos()
  }, [])

  // Atualizar produto selecionado
  useEffect(() => {
    if (formData.produto_id) {
      const produto = produtos.find(p => p.id === formData.produto_id)
      setProdutoSelecionado(produto || null)
    } else {
      setProdutoSelecionado(null)
    }
  }, [formData.produto_id, produtos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.produto_id) {
      alert('Selecione um produto.')
      return
    }

    if (formData.quantidade <= 0) {
      alert('A quantidade deve ser maior que zero.')
      return
    }

    // Validar saída maior que saldo
    if (tipo === 'saida' && produtoSelecionado) {
      const saldoAtual = produtoSelecionado.saldo_atual || 0
      if (formData.quantidade > saldoAtual) {
        alert(`Quantidade de saída (${formData.quantidade}) não pode ser maior que o saldo disponível (${saldoAtual}).`)
        return
      }
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('movimentacoes_estoque')
        .insert({
          produto_id: formData.produto_id,
          tipo: tipo,
          quantidade: formData.quantidade,
          motivo: formData.motivo,
          observacoes: formData.observacoes || null,
        })

      if (error) throw error

      router.push('/estoque')
      router.refresh()
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error)
      alert('Erro ao registrar movimentação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const motivos = tipo === 'entrada' ? motivosEntrada : motivosSaida

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {tipo === 'entrada' ? 'Nova Entrada' : 'Nova Saída'} de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="produto_id">Produto *</Label>
            {loadingProdutos ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando produtos...
              </div>
            ) : (
              <select
                id="produto_id"
                required
                value={formData.produto_id}
                onChange={(e) => setFormData({ ...formData, produto_id: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Selecione um produto</option>
                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - Saldo: {produto.saldo_atual || 0} {produto.unidade_medida}
                  </option>
                ))}
              </select>
            )}
          </div>

          {produtoSelecionado && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Saldo Atual</p>
                  <p className="text-sm text-blue-700">
                    {produtoSelecionado.saldo_atual || 0} {produtoSelecionado.unidade_medida}
                  </p>
                  {tipo === 'saida' && (
                    <p className="text-xs text-blue-600 mt-1">
                      Após esta saída: {(produtoSelecionado.saldo_atual || 0) - formData.quantidade} {produtoSelecionado.unidade_medida}
                    </p>
                  )}
                  {tipo === 'entrada' && (
                    <p className="text-xs text-blue-600 mt-1">
                      Após esta entrada: {(produtoSelecionado.saldo_atual || 0) + formData.quantidade} {produtoSelecionado.unidade_medida}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                required
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 1 })}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo *</Label>
              <select
                id="motivo"
                required
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Selecione o motivo</option>
                {motivos.map((motivo) => (
                  <option key={motivo} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações adicionais sobre esta movimentação..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading || loadingProdutos}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Registrar {tipo === 'entrada' ? 'Entrada' : 'Saída'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/estoque')}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
