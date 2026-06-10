export function formatCurrency(value: string | number) {
  const n = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(n)) return String(value)
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}
