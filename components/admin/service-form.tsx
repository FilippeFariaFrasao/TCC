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

type Service = Tables<'servicos'>

interface ServiceFormProps {
  service?: Service
  isEditing?: boolean
}

export function ServiceForm({ service, isEditing = false }: ServiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: service?.nome || '',
    descricao: service?.descricao || '',
    preco: service?.preco || 0,
    duracao_minutos: service?.duracao_minutos || 30,
    ativo: service?.ativo ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      if (isEditing && service) {
        const { error } = await supabase
          .from('servicos')
          .update({
            nome: formData.nome,
            descricao: formData.descricao,
            preco: formData.preco,
            duracao_minutos: formData.duracao_minutos,
            ativo: formData.ativo,
            updated_at: new Date().toISOString(),
          })
          .eq('id', service.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('servicos')
          .insert({
            nome: formData.nome,
            descricao: formData.descricao,
            preco: formData.preco,
            duracao_minutos: formData.duracao_minutos,
            ativo: formData.ativo,
          })

        if (error) throw error
      }

      router.push('/servicos')
      router.refresh()
    } catch (error) {
      console.error('Erro ao salvar serviço:', error)
      alert('Erro ao salvar serviço. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Serviço *</Label>
              <Input
                id="nome"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Corte de cabelo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
                placeholder="25.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duracao">Duração (minutos) *</Label>
            <Input
              id="duracao"
              type="number"
              min="1"
              required
              value={formData.duracao_minutos}
              onChange={(e) => setFormData({ ...formData, duracao_minutos: parseInt(e.target.value) || 30 })}
              placeholder="30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição detalhada do serviço..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
            />
            <Label htmlFor="ativo">Serviço ativo</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? 'Atualizar' : 'Criar'} Serviço
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/servicos')}
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