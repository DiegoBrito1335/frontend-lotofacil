import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer bg-transparent border-none"
      >
        <span className="font-semibold text-text text-lg pr-4">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 mb-5' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-text-muted leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}
