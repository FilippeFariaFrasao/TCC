import { StockMovementForm } from '@/components/admin/stock-movement-form'

export default function SaidaEstoquePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Saída de Estoque</h1>
      <StockMovementForm tipo="saida" />
    </div>
  )
}
