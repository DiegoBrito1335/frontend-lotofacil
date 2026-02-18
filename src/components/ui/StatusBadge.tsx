const statusConfig: Record<string, { label: string; className: string }> = {
  aberto: { label: 'Aberto', className: 'bg-green-100 text-green-800 ring-1 ring-green-200' },
  fechado: { label: 'Fechado', className: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200' },
  apurado: { label: 'Apurado', className: 'bg-blue-100 text-blue-800 ring-1 ring-blue-200' },
  cancelado: { label: 'Cancelado', className: 'bg-red-100 text-red-800 ring-1 ring-red-200' },
  pendente: { label: 'Pendente', className: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200' },
  pago: { label: 'Pago', className: 'bg-green-100 text-green-800 ring-1 ring-green-200' },
  aprovado: { label: 'Aprovado', className: 'bg-green-100 text-green-800 ring-1 ring-green-200' },
  recusado: { label: 'Recusado', className: 'bg-red-100 text-red-800 ring-1 ring-red-200' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}
