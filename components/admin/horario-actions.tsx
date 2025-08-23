'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface HorarioActionsProps {
  horarioId: string
  isActive?: boolean
}

export function HorarioActions({ horarioId, isActive = true }: HorarioActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggleActive = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('horarios_funcionamento')
        .update({ ativo: !isActive })
        .eq('id', horarioId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className={isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
        onClick={handleToggleActive}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
        ) : null}
        {isActive ? 'Inativar' : 'Ativar'}
      </Button>
      <Link href={`/horarios/${horarioId}/editar`}>
        <Button variant="outline" size="sm">
          <Pencil className="h-3 w-3 mr-1" />
          Editar
        </Button>
      </Link>
    </div>
  )
}