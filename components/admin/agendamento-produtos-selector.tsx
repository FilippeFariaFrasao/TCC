'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Plus, X, AlertCircle, Package } from 'lucide-react'

export interface ProdutoAgendamento {
  produto_id: string
  produto_nome: string
  quantidade: number
  preco_unitario: number
  subtotal: number
  saldo_disponivel: number
  unidade_medida: string
}

interface AgendamentoProdutosSelectorProps {
  produtosSelecionados: ProdutoAgendamento[]
  onChange: (produtos: ProdutoAgendamento[]) => void
  disabled?: boolean
}

interface ProdutoEstoque {
  id: string
  nome: string
  preco_venda: number
  saldo_atual: number
  unidade_medida: string
}

export function AgendamentoProdutosSelector({
  produtosSelecionados,
  onChange,
  disabled = false
}: AgendamentoProdutosSelectorProps) {
  const [loadingProdutos, setLoadingProdutos] = useState(true)
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [erro, setErro] = useState('')

  // Carregar produtos disponíveis
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('view_estoque_atual')
          .select('id, nome, preco_venda, saldo_atual, unidade_medida')
          .eq('ativo', true)
          .gt('saldo_atual', 0)
          .order('nome', { ascending: true })

        if (error) throw error
        setProdutos(data || [])
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      } finally {
        setLoadingProdutos(false)
      }
    }

    carregarProdutos()
  }, [])

  const handleAdicionarProduto = () => {
    setErro('')

    if (!produtoSelecionado) {
      setErro('Selecione um produto')
      return
    }

    if (quantidade <= 0) {
      setErro('Quantidade deve ser maior que zero')
      return
    }

    const produto = produtos.find(p => p.id === produtoSelecionado)
    if (!produto) return

    // Verificar se já foi adicionado
    if (produtosSelecionados.some(p => p.produto_id === produtoSelecionado)) {
      setErro('Produto já foi adicionado')
      return
    }

    // Verificar estoque
    if (quantidade > (produto.saldo_atual || 0)) {
      setErro(`Estoque insuficiente. Disponível: ${produto.saldo_atual} ${produto.unidade_medida}`)
      return
    }

    const novoProduto: ProdutoAgendamento = {
      produto_id: produto.id,
      produto_nome: produto.nome,
      quantidade: quantidade,
      preco_unitario: produto.preco_venda || 0,
      subtotal: quantidade * (produto.preco_venda || 0),
      saldo_disponivel: produto.saldo_atual || 0,
      unidade_medida: produto.unidade_medida
    }

    onChange([...produtosSelecionados, novoProduto])

    // Limpar seleção
    setProdutoSelecionado('')
    setQuantidade(1)
  }

  const handleRemoverProduto = (produtoId: string) => {
    onChange(produtosSelecionados.filter(p => p.produto_id !== produtoId))
  }

  const calcularTotal = () => {
    return produtosSelecionados.reduce((acc, p) => acc + p.subtotal, 0)
  }

  const produtoAtual = produtos.find(p => p.id === produtoSelecionado)

  return (
    <div className="space-y-4">
      {/* Adicionar Produto */}
      <div className="p-4 border border-border rounded-lg bg-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="produto">Produto</Label>
            {loadingProdutos ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando produtos...
              </div>
            ) : (
              <select
                id="produto"
                value={produtoSelecionado}
                onChange={(e) => {
                  setProdutoSelecionado(e.target.value)
                  setErro('')
                }}
                disabled={disabled || loadingProdutos}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Selecione um produto</option>
                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - R$ {(produto.preco_venda || 0).toFixed(2)} - Estoque: {produto.saldo_atual || 0} {produto.unidade_medida}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <div className="flex gap-2">
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => {
                  setQuantidade(parseInt(e.target.value) || 1)
                  setErro('')
                }}
                disabled={disabled}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAdicionarProduto}
                disabled={disabled || loadingProdutos || !produtoSelecionado}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Info do produto selecionado */}
        {produtoAtual && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-blue-900">
                  <strong>Estoque disponível:</strong> {produtoAtual.saldo_atual} {produtoAtual.unidade_medida}
                </p>
                <p className="text-blue-700">
                  <strong>Subtotal:</strong> R$ {((produtoAtual.preco_venda || 0) * quantidade).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {erro}
          </div>
        )}
      </div>

      {/* Lista de Produtos Adicionados */}
      {produtosSelecionados.length > 0 && (
        <div className="p-4 border border-border rounded-lg bg-card">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos Adicionados ({produtosSelecionados.length})
          </h4>

          <div className="space-y-2">
            {produtosSelecionados.map((produto) => (
              <div
                key={produto.produto_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{produto.produto_nome}</p>
                  <p className="text-xs text-gray-600">
                    {produto.quantidade} {produto.unidade_medida} × R$ {produto.preco_unitario.toFixed(2)} =
                    <span className="font-semibold ml-1">R$ {produto.subtotal.toFixed(2)}</span>
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoverProduto(produto.produto_id)}
                  disabled={disabled}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total dos Produtos:</span>
              <span className="text-lg font-bold text-primary">
                R$ {calcularTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {produtosSelecionados.length === 0 && !loadingProdutos && (
        <div className="p-8 text-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg">
          <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p>Nenhum produto adicionado</p>
          <p className="text-xs">Selecione um produto acima para adicionar ao agendamento</p>
        </div>
      )}
    </div>
  )
}
