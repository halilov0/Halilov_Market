import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Category, type Product } from '../api'
import { ProductCard } from '../components/ProductCard'
import { Footer } from '../components/Footer'
import { Icon } from '../components/Icon'
import { useFavorites } from '../favorites/favoritesStore'

export function FavoritesPage() {
  const ids = useFavorites(s => s.ids)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([
      api<{ content: Product[] }>(`/api/products?size=200`),
      api<Category[]>('/api/categories'),
    ])
      .then(([page, cats]) => {
        setCategories(cats)
        const map = new Map(page.content.map(p => [p.id, p]))
        setProducts(ids.map(id => map.get(id)).filter((p): p is Product => !!p))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [ids])

  return (
    <>
      <div className="hm-fav-page">
        <div className="head">
          <h1>המועדפים שלי</h1>
          <span className="count">{ids.length} {ids.length === 1 ? 'מוצר' : 'מוצרים'}</span>
        </div>

        {loading ? (
          <p style={{ color: 'var(--ink-3)' }}>טוען…</p>
        ) : products.length === 0 ? (
          <div className="hm-fav-empty">
            <div className="ico"><Icon name="heart" size={26} /></div>
            <h2>אין עדיין מועדפים</h2>
            <p>סמנו מוצרים שאהבתם עם הלב כדי לשמור אותם כאן.</p>
            <Link to="/" className="cta">
              <Icon name="arrow" size={14} stroke={2.2} />
              חזרה לקטלוג
            </Link>
          </div>
        ) : (
          <div className="cls-grid">
            {products.map(p => {
              const cat = categories.find(c => c.id === p.categoryId)
              return <ProductCard key={p.id} p={p} categoryName={cat?.nameHe} />
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
