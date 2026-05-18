import { Link } from 'react-router-dom'
import type { Product } from '../api'
import { useCart } from '../cart/cartStore'
import { useFavorites } from '../favorites/favoritesStore'
import { Icon } from './Icon'
import { useToast } from './Toast'

export function ProductCard({ p, categoryName }: { p: Product; categoryName?: string }) {
  const add = useCart(s => s.add)
  const isFav = useFavorites(s => s.ids.includes(p.id))
  const toggleFav = useFavorites(s => s.toggle)
  const pushToast = useToast(s => s.push)
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
    const nowFav = toggleFav(p.id)
    pushToast(nowFav ? 'נוסף למועדפים' : 'הוסר מהמועדפים')
  }

  return (
    <Link to={`/p/${p.slug}`} className="cls-card">
      <div className="img-wrap">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.nameHe} loading="lazy" />
        ) : (
          <span className="ph">{p.sku}</span>
        )}
        <div className="badge-stack">
          {outOfStock && <span className="badge-pill out">אזל</span>}
          {!outOfStock && lowStock && <span className="badge-pill dark">מלאי אחרון</span>}
        </div>
        <button
          className={`fav cls-card-fav${isFav ? ' active' : ''}`}
          onClick={onFavorite}
          aria-label={isFav ? 'הסר ממועדפים' : 'הוסף למועדפים'}
          aria-pressed={isFav}
        >
          <Icon name="heart" size={14} />
        </button>
      </div>
      <div className="name">{p.nameHe}</div>
      {categoryName && <div className="unit">{categoryName}</div>}
      <div className="delivery-tag">
        <Icon name="truck" size={12} stroke={2} />
        משלוח מהיר
      </div>
      <div className="price-row">
        <div className="price">
          <span className="sym">₪</span>
          {shekels}
          <span className="agorot">.{agorot}</span>
        </div>
        <button className="add" onClick={onAdd} disabled={outOfStock} aria-label="הוסף לסל">
          <Icon name="plus" size={14} stroke={2.2} />
          הוסף
        </button>
      </div>
    </Link>
  )
}
