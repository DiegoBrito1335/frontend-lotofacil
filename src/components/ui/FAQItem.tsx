import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

export default function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer bg-transparent border-none group"
      >
        <span className="font-semibold text-text text-lg pr-4 group-hover:text-primary transition-colors">{question}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
          isOpen 
            ? 'bg-primary text-white rotate-0' 
            : 'bg-green-50 text-primary rotate-0'
        }`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'max-h-96 opacity-100 mb-5' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-text-muted leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}
