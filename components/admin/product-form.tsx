'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/lib/supabase/types'
import { Loader2 } from 'lucide-react'

type Produto = Tables<'produtos'>

interface ProductFormProps {
  produto?: Produto
  isEditing?: boolean
}

export function ProductForm({ produto, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: produto?.nome || '',
    descricao: produto?.descricao || '',
    codigo_barras: produto?.codigo_barras || '',
    marca: produto?.marca || '',
    categoria: produto?.categoria || '',
    unidade_medida: produto?.unidade_medida || 'un',
    preco_compra: produto?.preco_compra || 0,
    preco_venda: produto?.preco_venda || 0,
    estoque_minimo: produto?.estoque_minimo || 0,
    ativo: produto?.ativo ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      if (isEditing && produto) {
        const { error } = await supabase
          .from('produtos')
          .update({
            nome: formData.nome,
            descricao: formData.descricao || null,
            codigo_barras: formData.codigo_barras || null,
            marca: formData.marca || null,
            categoria: formData.categoria || null,
            unidade_medida: formData.unidade_medida,
            preco_compra: formData.preco_compra || null,
            preco_venda: formData.preco_venda || null,
            estoque_minimo: formData.estoque_minimo,
            ativo: formData.ativo,
            updated_at: new Date().toISOString(),
          })
          .eq('id', produto.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert({
            nome: formData.nome,
            descricao: formData.descricao || null,
            codigo_barras: formData.codigo_barras || null,
            marca: formData.marca || null,
            categoria: formData.categoria || null,
            unidade_medida: formData.unidade_medida,
            preco_compra: formData.preco_compra || null,
            preco_venda: formData.preco_venda || null,
            estoque_minimo: formData.estoque_minimo,
            ativo: formData.ativo,
          })

        if (error) throw error
      }

      router.push('/produtos')
      router.refresh()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Pomada Modeladora"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo_barras">Código de Barras</Label>
              <Input
                id="codigo_barras"
                value={formData.codigo_barras}
                onChange={(e) => setFormData({ ...formData, codigo_barras: e.target.value })}
                placeholder="7891234567890"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                placeholder="Ex: Barber Shop"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                placeholder="Ex: Pomadas, Shampoos"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidade_medida">Unidade de Medida *</Label>
              <Input
                id="unidade_medida"
                required
                value={formData.unidade_medida}
                onChange={(e) => setFormData({ ...formData, unidade_medida: e.target.value })}
                placeholder="un, cx, L, kg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco_compra">Preço de Compra (R$)</Label>
              <Input
                id="preco_compra"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco_compra}
                onChange={(e) => setFormData({ ...formData, preco_compra: parseFloat(e.target.value) || 0 })}
                placeholder="25.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco_venda">Preço de Venda (R$)</Label>
              <Input
                id="preco_venda"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco_venda}
                onChange={(e) => setFormData({ ...formData, preco_venda: parseFloat(e.target.value) || 0 })}
                placeholder="35.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estoque_minimo">Estoque Mínimo (Alerta) *</Label>
            <Input
              id="estoque_minimo"
              type="number"
              min="0"
              required
              value={formData.estoque_minimo}
              onChange={(e) => setFormData({ ...formData, estoque_minimo: parseInt(e.target.value) || 0 })}
              placeholder="5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição detalhada do produto..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
            />
            <Label htmlFor="ativo">Produto ativo</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? 'Atualizar' : 'Criar'} Produto
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/produtos')}
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
