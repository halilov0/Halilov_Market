import type { OrderStatus } from '../api'

const HE: Record<OrderStatus, string> = {
  PENDING: 'ממתין',
  PAID: 'שולם',
  FULFILLED: 'הוכן',
  SHIPPED: 'נשלח',
  DELIVERED: 'נמסר',
  CANCELLED: 'בוטל',
  REFUNDED: 'הוחזר',
}

export function StatusPill({ s }: { s: OrderStatus }) {
  return <span className={`hm-status hm-status-${s.toLowerCase()}`}>{HE[s] ?? s}</span>
}
