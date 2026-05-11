const TOKEN_KEY = 'halilov.token'

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
  if (init.body && !headers.has('Content-Type')) {
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

// ----- types -----
export type Category = {
  id: number
  slug: string
  nameHe: string
  parentId: number | null
  sortOrder: number
}

export type Product = {
  id: number
  sku: string
  slug: string
  nameHe: string
  descriptionHe: string | null
  categoryId: number | null
  priceAgorot: number
  stockQty: number
  imageUrl: string | null
  active: boolean
}

export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export type AuthResponse = {
  token: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
  fullName: string
}

export type Me = {
  id: number
  email: string
  fullName: string
  phone: string | null
  role: 'CUSTOMER' | 'ADMIN'
}

export function formatPrice(agorot: number): string {
  return `₪${(agorot / 100).toFixed(2)}`
}

export type OrderItemRequest = { productId: number; quantity: number }

export type ShippingRequest = {
  fullName: string
  phone: string
  street: string
  houseNo?: string
  apartment?: string
  city: string
  postalCode?: string
  notes?: string
}

export type CreateOrderRequest = {
  items: OrderItemRequest[]
  shipping: ShippingRequest
  shippingAgorot: number
}

export type OrderItemView = {
  productId: number
  nameHe: string
  sku: string
  unitPriceAgorot: number
  quantity: number
  lineTotalAgorot: number
}

export type ShippingView = {
  fullName: string
  phone: string
  street: string
  houseNo: string | null
  apartment: string | null
  city: string
  postalCode: string | null
  notes: string | null
}

export type OrderView = {
  orderNumber: string
  status: 'PENDING' | 'PAID' | 'FULFILLED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  subtotalAgorot: number
  shippingAgorot: number
  vatAgorot: number
  totalAgorot: number
  items: OrderItemView[]
  shipping: ShippingView | null
  createdAt: string
}
