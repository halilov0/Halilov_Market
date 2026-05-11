import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../cart/cartStore'
import { formatPrice } from '../api'

export function CartPage() {
  const { lines, setQty, remove, subtotalAgorot } = useCart()
  const nav = useNavigate()
  const subtotal = subtotalAgorot()

  if (lines.length === 0) {
    return (
      <div className="container">
        <h1>הסל ריק</h1>
        <p><Link to="/">← חזרה לקטלוג</Link></p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>סל קניות</h1>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {lines.map(line => (
          <div
            key={line.productId}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto auto',
              alignItems: 'center',
              gap: '1rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.75rem 1rem',
            }}
          >
            <div>
              <Link to={`/p/${line.slug}`} style={{ fontWeight: 600, color: 'inherit' }}>
                {line.nameHe}
              </Link>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                {formatPrice(line.priceAgorot)} ליחידה
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button
                className="secondary"
                style={{ padding: '0.25rem 0.6rem' }}
                onClick={() => setQty(line.productId, line.quantity - 1)}
                disabled={line.quantity <= 1}
              >−</button>
              <input
                type="number"
                min={1}
                max={99}
                value={line.quantity}
                onChange={e => setQty(line.productId, parseInt(e.target.value, 10) || 1)}
                style={{ width: 60, textAlign: 'center' }}
              />
              <button
                className="secondary"
                style={{ padding: '0.25rem 0.6rem' }}
                onClick={() => setQty(line.productId, line.quantity + 1)}
                disabled={line.quantity >= 99}
              >+</button>
            </div>
            <strong>{formatPrice(line.priceAgorot * line.quantity)}</strong>
            <button
              className="secondary"
              style={{ padding: '0.3rem 0.7rem' }}
              onClick={() => remove(line.productId)}
            >הסר</button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginBlockStart: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1rem 1.25rem',
        }}
      >
        <div>
          <div style={{ color: 'var(--muted)' }}>סך הביניים</div>
          <strong style={{ fontSize: '1.4rem' }}>{formatPrice(subtotal)}</strong>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>משלוח ייחושב בקופה</div>
        </div>
        <button onClick={() => nav('/checkout')}>למעבר לקופה</button>
      </div>
    </div>
  )
}
