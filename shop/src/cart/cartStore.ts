import { create } from 'zustand'
import type { Product } from '../api'

const STORAGE_KEY = 'halilov.cart'

export type CartLine = {
  productId: number
  slug: string
  nameHe: string
  priceAgorot: number
  quantity: number
  imageUrl: string | null
}

type CartState = {
  lines: CartLine[]
  add: (p: Product, quantity?: number) => void
  setQty: (productId: number, quantity: number) => void
  remove: (productId: number) => void
  clear: () => void
  totalItems: () => number
  subtotalAgorot: () => number
}

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((l: Partial<CartLine>) => ({
      productId: l.productId!,
      slug: l.slug!,
      nameHe: l.nameHe!,
      priceAgorot: l.priceAgorot!,
      quantity: l.quantity!,
      imageUrl: l.imageUrl ?? null,
    }))
  } catch {
    return []
  }
}

function save(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
}

export const useCart = create<CartState>((set, get) => ({
  lines: load(),

  add(p, quantity = 1) {
    const lines = [...get().lines]
    const existing = lines.find(l => l.productId === p.id)
    if (existing) {
      existing.quantity = Math.min(99, existing.quantity + quantity)
    } else {
      lines.push({
        productId: p.id,
        slug: p.slug,
        nameHe: p.nameHe,
        priceAgorot: p.priceAgorot,
        quantity: Math.min(99, quantity),
        imageUrl: p.imageUrl,
      })
    }
    save(lines)
    set({ lines })
  },

  setQty(productId, quantity) {
    const q = Math.max(1, Math.min(99, quantity))
    const lines = get().lines.map(l =>
      l.productId === productId ? { ...l, quantity: q } : l
    )
    save(lines)
    set({ lines })
  },

  remove(productId) {
    const lines = get().lines.filter(l => l.productId !== productId)
    save(lines)
    set({ lines })
  },

  clear() {
    save([])
    set({ lines: [] })
  },

  totalItems() {
    return get().lines.reduce((sum, l) => sum + l.quantity, 0)
  },

  subtotalAgorot() {
    return get().lines.reduce((sum, l) => sum + l.priceAgorot * l.quantity, 0)
  },
}))
