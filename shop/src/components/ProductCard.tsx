import { Link } from 'react-router-dom'
import type { Product } from '../api'
import { useCart } from '../cart/cartStore'
import { Icon } from './Icon'
import { comingSoon } from './Toast'

export function ProductCard({ p, categoryName }: { p: Product; categoryName?: string }) {
  const add = useCart(s => s.add)
  const outOfStock = p.stockQty <= 0
  const lowStock = p.stockQty > 0 && p.stockQty < 10

  const [shekels, agorot] = (p.priceAgorot / 100).toFixed(2).split('.')

  function onAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    add(p, 1)
  }

  function onFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    comingSoon('מועדפים')
  }

  return (
    <Link to={`/p/${p.slug}`} className="hm-product">
      <div className="img">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.nameHe} loading="lazy" />
        ) : (
          <span className="glyph">{p.sku}</span>
        )}
        <div className="badge-stack">
          {outOfStock && <span className="hm-badge hm-badge-out">אזל</span>}
          {!outOfStock && lowStock && <span className="hm-badge hm-badge-sale">מלאי אחרון</span>}
        </div>
        <button
          onClick={onFavorite}
          aria-label="הוסף למועדפים"
          style={{
            position: 'absolute', top: 14, insetInlineEnd: 14,
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--card)', border: '1px solid var(--line)',
            display: 'grid', placeItems: 'center', color: 'var(--ink-2)',
          }}
        >
          <Icon name="heart" size={14} />
        </button>
      </div>
      <div>
        <div className="name">{p.nameHe}</div>
        {p.descriptionHe && <div className="sub">{p.descriptionHe}</div>}
      </div>
      {categoryName && <div className="cat-tag">{categoryName}</div>}
      <div className="row">
        <div className="price">
          <span style={{ color: 'var(--ink-3)', fontSize: 12, marginInlineEnd: 2 }}>₪</span>
          {shekels}
          <span className="agorot">.{agorot}</span>
        </div>
        <button className="add" onClick={onAdd} disabled={outOfStock} aria-label="הוסף לסל">
          <Icon name="plus" size={16} stroke={2.2} />
        </button>
      </div>
    </Link>
  )
}
