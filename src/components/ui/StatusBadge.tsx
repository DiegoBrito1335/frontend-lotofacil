const statusConfig: Record<string, { label: string; className: string }> = {
  aberto: { label: 'Aberto', className: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30' },
  fechado: { label: 'Fechado', className: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30' },
  apurado: { label: 'Apurado', className: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30' },
  cancelado: { label: 'Cancelado', className: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30' },
  pendente: { label: 'Pendente', className: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30' },
  pago: { label: 'Pago', className: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30' },
  aprovado: { label: 'Aprovado', className: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30' },
  recusado: { label: 'Recusado', className: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: 'bg-white/10 text-white/60 ring-1 ring-white/20' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}
