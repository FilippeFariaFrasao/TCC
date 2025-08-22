'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Power, PowerOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ServiceActionsProps {
  serviceId: string
  isActive: boolean
}

export function ServiceActions({ serviceId, isActive }: ServiceActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggleActive = async () => {
    const action = isActive ? 'inativar' : 'reativar'
    if (!confirm(`Tem certeza que deseja ${action} este serviço?`)) {
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('servicos')
        .update({ ativo: !isActive })
        .eq('id', serviceId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error(`Erro ao ${action} serviço:`, error)
      alert(`Erro ao ${action} serviço. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 mt-4">
      <Link href={`/servicos/${serviceId}/editar`}>
        <Button variant="outline" size="sm">
          <Pencil className="h-3 w-3 mr-1" />
          Editar
        </Button>
      </Link>
      <Button 
        variant="outline" 
        size="sm" 
        className={isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
        onClick={handleToggleActive}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
        ) : isActive ? (
          <PowerOff className="h-3 w-3 mr-1" />
        ) : (
          <Power className="h-3 w-3 mr-1" />
        )}
        {isActive ? 'Inativar' : 'Reativar'}
      </Button>
    </div>
  )
}