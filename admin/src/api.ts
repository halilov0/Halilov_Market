const TOKEN_KEY = 'halilov.admin.token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const isFormData = init.body instanceof FormData
  if (init.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(path, { ...init, headers })
  const text = await res.text()
  const body = text ? (() => { try { return JSON.parse(text) } catch { return text } })() : null

  if (!res.ok) {
    const msg = typeof body === 'object' && body?.message ? body.message : (body || res.statusText)
    throw new ApiError(String(msg), res.status)
  }
  return body as T
}

export type Role = 'CUSTOMER' | 'ADMIN'

export type AuthResponse = { token: string; email: string; role: Role; fullName: string }
export type Me = { id: number; email: string; fullName: string; phone: string | null; role: Role }

export type Category = { id: number; slug: string; nameHe: string; parentId: number | null; sortOrder: number }
export type CategoryUpsert = { slug: string; nameHe: string; parentId: number | null; sortOrder: number }

export type Product = {
  id: number; sku: string; slug: string; nameHe: string; descriptionHe: string | null
  categoryId: number | null; priceAgorot: number; stockQty: number; imageUrl: string | null; active: boolean
}
export type ProductUpsert = Omit<Product, 'id'>

export type OrderStatus = 'PENDING' | 'PAID' | 'FULFILLED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

export type OrderItemView = {
  productId: number; nameHe: string; sku: string
  unitPriceAgorot: number; quantity: number; lineTotalAgorot: number
}
export type ShippingView = {
  fullName: string; phone: string; street: string; houseNo: string | null
  apartment: string | null; city: string; postalCode: string | null; notes: string | null
}
export type OrderView = {
  orderNumber: string; status: OrderStatus
  subtotalAgorot: number; shippingAgorot: number; vatAgorot: number
  discountAgorot: number; couponCode: string | null
  totalAgorot: number
  items: OrderItemView[]; shipping: ShippingView | null; createdAt: string
}

export type CouponType = 'PERCENT' | 'FIXED'

export type Coupon = {
  id: number
  code: string
  type: CouponType
  value: number
  minSubtotalAgorot: number
  maxUses: number | null
  usedCount: number
  expiresAt: string | null
  active: boolean
  createdAt: string
}

export type CouponUpsert = {
  code: string
  type: CouponType
  value: number
  minSubtotalAgorot: number
  maxUses: number | null
  expiresAt: string | null
  active: boolean
}

export function formatPrice(agorot: number): string {
  return `₪${(agorot / 100).toFixed(2)}`
}

export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING', 'PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
]
