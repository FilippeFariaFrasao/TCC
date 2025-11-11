import { StockMovementForm } from '@/components/admin/stock-movement-form'

export default function EntradaEstoquePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Entrada de Estoque</h1>
      <StockMovementForm tipo="entrada" />
    </div>
  )
}
