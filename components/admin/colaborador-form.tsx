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
import { Colaborador } from '@/lib/types/colaborador'
import { Loader2 } from 'lucide-react'

interface ColaboradorFormProps {
  colaborador?: Colaborador
  isEditing?: boolean
}

export function ColaboradorForm({ colaborador, isEditing = false }: ColaboradorFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: colaborador?.nome || '',
    telefone: colaborador?.telefone || '',
    email: colaborador?.email || '',
    especialidades: colaborador?.especialidades || '',
    data_admissao: colaborador?.data_admissao || '',
    cor_agenda: colaborador?.cor_agenda || '#6366f1',
    ativo: colaborador?.ativo ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const dataToSave = {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email || null,
        especialidades: formData.especialidades || null,
        data_admissao: formData.data_admissao || null,
        cor_agenda: formData.cor_agenda || '#6366f1',
        ativo: formData.ativo,
      }

      if (isEditing && colaborador) {
        const { error } = await supabase
          .from('colaboradores')
          .update({
            ...dataToSave,
            updated_at: new Date().toISOString(),
          })
          .eq('id', colaborador.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('colaboradores')
          .insert(dataToSave)

        if (error) throw error
      }

      router.push('/colaboradores')
      router.refresh()
    } catch (error) {
      console.error('Erro ao salvar colaborador:', error)
      alert('Erro ao salvar colaborador. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Editar Colaborador' : 'Novo Colaborador'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: João Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                type="tel"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_admissao">Data de Admissão</Label>
              <Input
                id="data_admissao"
                type="date"
                value={formData.data_admissao || ''}
                onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="especialidades">Especialidades</Label>
            <Textarea
              id="especialidades"
              value={formData.especialidades || ''}
              onChange={(e) => setFormData({ ...formData, especialidades: e.target.value })}
              placeholder="Ex: Cortes degradê, Barba, Coloração..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cor_agenda">Cor na Agenda</Label>
            <div className="flex gap-2">
              <Input
                id="cor_agenda"
                type="color"
                value={formData.cor_agenda}
                onChange={(e) => setFormData({ ...formData, cor_agenda: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={formData.cor_agenda}
                onChange={(e) => setFormData({ ...formData, cor_agenda: e.target.value })}
                placeholder="#6366f1"
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
            />
            <Label htmlFor="ativo">Colaborador ativo</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? 'Atualizar' : 'Criar'} Colaborador
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/colaboradores')}
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
