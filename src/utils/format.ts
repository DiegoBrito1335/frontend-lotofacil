/**
 * Formata um valor numérico como moeda brasileira.
 * Exemplo: 50.5 → "R$ 50,50"
 */
export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
