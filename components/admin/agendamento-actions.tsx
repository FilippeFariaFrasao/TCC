'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface AgendamentoActionsProps {
  agendamentoId: string
}

export function AgendamentoActions({ agendamentoId }: AgendamentoActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) {
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', agendamentoId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error)
      alert('Erro ao excluir agendamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Link href={`/agendamentos/${agendamentoId}/editar`}>
        <Button variant="outline" size="sm">
          <Pencil className="h-3 w-3 mr-1" />
          Editar
        </Button>
      </Link>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-600 hover:text-red-700"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
        ) : (
          <Trash2 className="h-3 w-3 mr-1" />
        )}
        Excluir
      </Button>
    </div>
  )
}