'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Power, PowerOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ProductActionsProps {
  productId: string
  isActive: boolean
}

export function ProductActions({ productId, isActive }: ProductActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleToggleActive = async () => {
    const action = isActive ? 'inativar' : 'reativar'
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('produtos')
        .update({ ativo: !isActive })
        .eq('id', productId)

      if (error) throw error

      setShowConfirm(false)
      router.refresh()
    } catch (error) {
      console.error(`Erro ao ${action} produto:`, error)
      alert(`Erro ao ${action} produto. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex gap-2 mt-4">
        <Link href={`/produtos/${productId}/editar`}>
          <Button variant="outline" size="sm">
            <Pencil className="h-3 w-3 mr-1" />
            Editar
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className={isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
          onClick={() => setShowConfirm(true)}
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

      <ConfirmDialog
        open={showConfirm}
        onCancel={() => {
          if (!loading) {
            setShowConfirm(false)
          }
        }}
        onConfirm={handleToggleActive}
        loading={loading}
        icon={isActive ? <PowerOff className="h-5 w-5 text-destructive" /> : <Power className="h-5 w-5 text-emerald-500" />}
        title={`${isActive ? 'Inativar' : 'Reativar'} produto`}
        description={`Tem certeza que deseja ${isActive ? 'inativar' : 'reativar'} este produto?`}
        confirmText={isActive ? 'Inativar' : 'Reativar'}
      />
    </>
  )
}
