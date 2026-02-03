import { useState } from 'react'
import { Plus, RotateCcw } from 'lucide-react'

interface NumberPickerProps {
  onConfirm: (dezenas: number[]) => void
  disabled?: boolean
  buttonLabel?: string
  maxNumbers?: number
}

export default function NumberPicker({
  onConfirm,
  disabled = false,
  buttonLabel = 'Adicionar Jogo',
  maxNumbers = 15,
}: NumberPickerProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const toggle = (num: number) => {
    if (disabled) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(num)) {
        next.delete(num)
      } else if (next.size < maxNumbers) {
        next.add(num)
      }
      return next
    })
  }

  const handleConfirm = () => {
    if (selected.size !== maxNumbers) return
    const sorted = Array.from(selected).sort((a, b) => a - b)
    onConfirm(sorted)
    setSelected(new Set())
  }

  const handleClear = () => setSelected(new Set())

  return (
    <div>
      {/* Grid 5x5 */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => {
          const isSelected = selected.has(num)
          return (
            <button
              key={num}
              type="button"
              onClick={() => toggle(num)}
              disabled={disabled || (!isSelected && selected.size >= maxNumbers)}
              className={`
                w-full aspect-square rounded-full text-sm font-bold border-2 cursor-pointer transition-all
                flex items-center justify-center
                ${isSelected
                  ? 'bg-primary text-white border-primary shadow-md scale-105'
                  : 'bg-white text-text border-border hover:border-primary hover:text-primary'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${!isSelected && selected.size >= maxNumbers && !disabled ? 'opacity-40 cursor-not-allowed' : ''}
              `}
            >
              {String(num).padStart(2, '0')}
            </button>
          )
        })}
      </div>

      {/* Contador + ações */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm font-medium ${selected.size === maxNumbers ? 'text-primary' : 'text-text-muted'}`}>
          {selected.size}/{maxNumbers} selecionadas
        </span>

        <div className="flex gap-2">
          {selected.size > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-border text-text-muted hover:text-text hover:bg-bg transition-colors cursor-pointer bg-white"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={disabled || selected.size !== maxNumbers}
            className="flex items-center gap-1 px-4 py-1.5 text-xs rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold transition-colors border-0 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
