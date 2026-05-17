import { useEffect, useRef, useState, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, formatPrice, type CouponValidateResponse, type CreateOrderRequest, type OrderView } from '../api'
import { useCart } from '../cart/cartStore'
import { useAuth } from '../auth/authStore'
import { Field } from '../components/Field'
import { Autocomplete, fetchCities, fetchStreets } from '../components/Autocomplete'
import { Icon } from '../components/Icon'
import { Footer } from '../components/Footer'

const SHIPPING_AGOROT = 1990

const STEPS = [
  ['1', 'משלוח'],
  ['2', 'תשלום'],
  ['3', 'אישור'],
] as const

type Errors = Partial<Record<
  'fullName' | 'phone' | 'city' | 'street' | 'houseNo' | 'postalCode',
  string
>>

// Strip everything that isn't a digit, then check Israeli mobile/landline pattern.
// Mobile: 05X (10 digits), Landline: 02/03/04/08/09/07X (9-10 digits).
function validatePhone(raw: string): string | null {
  const digits = raw.replace(/\D+/g, '')
  if (!digits) return 'נדרש מספר טלפון'
  if (!/^0[2-9]\d{7,8}$/.test(digits)) return 'מספר טלפון לא תקין'
  return null
}

function validateField(name: keyof Errors, value: string): string | null {
  const v = value.trim()
  switch (name) {
    case 'fullName':   return v.length < 2 ? 'נדרש שם מלא' : null
    case 'phone':      return validatePhone(v)
    case 'city':       return v ? null : 'נדרשת עיר'
    case 'street':     return v ? null : 'נדרש רחוב'
    case 'houseNo':    return v ? null : 'נדרש מספר בית'
    case 'postalCode': {
      if (!v) return null // optional
      const digits = v.replace(/\D+/g, '')
      return /^(\d{5}|\d{7})$/.test(digits) ? null : 'מיקוד 5 או 7 ספרות'
    }
  }
}

export function CheckoutPage() {
  const { lines, subtotalAgorot, clear } = useCart()
  const { user } = useAuth()
  const nav = useNavigate()

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [street, setStreet] = useState('')
  const [houseNo, setHouseNo] = useState('')
  const [apartment, setApartment] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Errors, boolean>>>({})
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState<CouponValidateResponse | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  useEffect(() => {
    if (!user) nav('/login?next=/checkout')
  }, [user, nav])

  // Mount-only guard: if user lands on /checkout with an empty cart, bounce to /cart.
  // After mount we DON'T re-bounce — otherwise clearing the cart at submit time
  // races with the nav-to-payment and the SPA renders a white page until refresh.
  const emptyCartChecked = useRef(false)
  useEffect(() => {
    if (emptyCartChecked.current) return
    emptyCartChecked.current = true
    if (lines.length === 0) nav('/cart')
  }, [lines.length, nav])

  if (!user || (lines.length === 0 && !submitting)) return null

  const subtotal = subtotalAgorot()
  const discount = coupon ? Math.min(coupon.discountAgorot, subtotal) : 0
  const total = subtotal - discount + SHIPPING_AGOROT
  const vat = Math.round((total * 18) / 118)

  // If cart changes after a coupon was applied, recompute / drop coupon if no longer valid.
  useEffect(() => {
    if (!coupon) return
    if (subtotal === 0) { setCoupon(null); return }
    api<CouponValidateResponse>('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: coupon.code, subtotalAgorot: subtotal }),
    }).then(setCoupon).catch(e => {
      setCoupon(null)
      setCouponError(e instanceof Error ? e.message : 'הקוד אינו תקף יותר')
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal])

  async function applyCoupon() {
    const code = couponInput.trim()
    if (!code) return
    setApplyingCoupon(true); setCouponError(null)
    try {
      const res = await api<CouponValidateResponse>('/api/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotalAgorot: subtotal }),
      })
      setCoupon(res)
      setCouponInput('')
    } catch (e) {
      setCoupon(null)
      setCouponError(e instanceof Error ? e.message : 'קוד לא תקין')
    } finally {
      setApplyingCoupon(false)
    }
  }

  function removeCoupon() {
    setCoupon(null); setCouponError(null); setCouponInput('')
  }

  function markBlur(name: keyof Errors, value: string) {
    setTouched(t => ({ ...t, [name]: true }))
    setErrors(e => ({ ...e, [name]: validateField(name, value) }))
  }

  function patchOnChange<T extends keyof Errors>(name: T, value: string) {
    if (touched[name]) {
      setErrors(e => ({ ...e, [name]: validateField(name, value) }))
    }
  }

  function validateAll(): Errors {
    return {
      fullName:   validateField('fullName',   fullName)   ?? undefined,
      phone:      validateField('phone',      phone)      ?? undefined,
      city:       validateField('city',       city)       ?? undefined,
      street:     validateField('street',     street)     ?? undefined,
      houseNo:    validateField('houseNo',    houseNo)    ?? undefined,
      postalCode: validateField('postalCode', postalCode) ?? undefined,
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const validated = validateAll()
    const hasErrors = Object.values(validated).some(Boolean)
    if (hasErrors) {
      setErrors(validated)
      setTouched({
        fullName: true, phone: true, city: true,
        street: true, houseNo: true, postalCode: true,
      })
      setError('בדקו את השדות המסומנים באדום')
      return
    }

    setSubmitting(true)
    try {
      const body: CreateOrderRequest = {
        items: lines.map(l => ({ productId: l.productId, quantity: l.quantity })),
        shipping: {
          fullName,
          phone: phone.replace(/\D+/g, ''),
          street,
          houseNo,
          apartment: apartment || undefined,
          city,
          postalCode: postalCode || undefined,
          notes: notes || undefined,
        },
        shippingAgorot: SHIPPING_AGOROT,
        couponCode: coupon?.code,
      }
      const order = await api<OrderView>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      const pay = await api<{ provider: string; redirectUrl: string; orderNumber: string }>(
        `/api/orders/${order.orderNumber}/pay`,
        { method: 'POST' }
      )
      // Clear cart AFTER nav so the empty-cart guard (even mount-only) and any
      // other cart-derived UI doesn't flicker on the way out.
      if (pay.redirectUrl.startsWith('http://') || pay.redirectUrl.startsWith('https://')) {
        clear()
        window.location.href = pay.redirectUrl
      } else {
        nav(pay.redirectUrl)
        // Tiny defer so React Router commits the route transition before the cart store mutates.
        setTimeout(clear, 50)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה ביצירת ההזמנה')
      setSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <div className="cls-page">
          <div className="cls-crumb">
            <Link to="/cart">סל</Link>
            <span className="sep">›</span>
            <span className="current">קופה</span>
          </div>

          <div className="cls-sidebar-layout">
            <div>
              <div className="cls-stepper">
                {STEPS.map(([n, t], i) => {
                  const isActive = i === 0
                  return (
                    <Fragment key={n}>
                      <div className={`step${isActive ? ' active' : ''}`}>
                        <div className="dot">{n}</div>
                        <span className="lbl">{t}</span>
                      </div>
                      {n !== '3' && <div className="bar" />}
                    </Fragment>
                  )
                })}
              </div>

              <div className="cls-checkout-section-title">פרטי משלוח</div>

              <div style={{ display: 'grid', gap: 12 }}>
                <div className="cls-row-2">
                  <Field
                    label="שם מלא" required value={fullName}
                    onChange={e => { setFullName(e.target.value); patchOnChange('fullName', e.target.value) }}
                    onBlur={() => markBlur('fullName', fullName)}
                    error={errors.fullName}
                  />
                  <Field
                    label="טלפון" required mono value={phone}
                    placeholder="050-1234567"
                    inputMode="tel"
                    onChange={e => { setPhone(e.target.value); patchOnChange('phone', e.target.value) }}
                    onBlur={() => markBlur('phone', phone)}
                    error={errors.phone}
                  />
                </div>
                <div className="cls-row-21">
                  <Autocomplete
                    label="עיר"
                    required
                    value={city}
                    onChange={v => { setCity(v); patchOnChange('city', v) }}
                    onBlur={() => markBlur('city', city)}
                    fetchSuggestions={fetchCities}
                    placeholder="לחצו לבחירה או הקלידו"
                    error={errors.city}
                  />
                  <Field
                    label="מיקוד" mono value={postalCode}
                    placeholder="5 או 7 ספרות"
                    inputMode="numeric"
                    onChange={e => { setPostalCode(e.target.value); patchOnChange('postalCode', e.target.value) }}
                    onBlur={() => markBlur('postalCode', postalCode)}
                    error={errors.postalCode}
                  />
                </div>
                <div className="cls-row-3">
                  <Autocomplete
                    label="רחוב"
                    required
                    value={street}
                    onChange={v => { setStreet(v); patchOnChange('street', v) }}
                    onBlur={() => markBlur('street', street)}
                    fetchSuggestions={q => fetchStreets(city, q)}
                    resetKey={city}
                    disabled={!city.trim()}
                    placeholder={city.trim() ? 'לחצו לבחירה או הקלידו' : 'בחר/י עיר תחילה'}
                    error={errors.street}
                  />
                  <Field
                    label="מספר" required value={houseNo}
                    inputMode="numeric"
                    onChange={e => { setHouseNo(e.target.value); patchOnChange('houseNo', e.target.value) }}
                    onBlur={() => markBlur('houseNo', houseNo)}
                    error={errors.houseNo}
                  />
                  <Field label="דירה" value={apartment} onChange={e => setApartment(e.target.value)} />
                </div>
                <Field
                  label="הערות לשליח"
                  multiline
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <div className="cls-info-banner">
                <span className="ico"><Icon name="truck" size={16} /></span>
                <div>השליח יצור איתך קשר ~30 דקות לפני הגעה.</div>
              </div>

              {error && <div className="hm-error" style={{ marginTop: 14 }}>{error}</div>}
            </div>

            <aside className="cls-summary">
              <h3>סיכום</h3>
              <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
                {lines.map(l => (
                  <div key={l.productId} className="cls-mini-line">
                    <div className="thumb">
                      {l.imageUrl ? <img src={l.imageUrl} alt={l.nameHe} /> : <span className="ph">{l.slug.slice(0, 6)}</span>}
                    </div>
                    <div className="info">
                      <div className="n">{l.nameHe}</div>
                      <div className="q">× {l.quantity}</div>
                    </div>
                    <div className="v">{formatPrice(l.priceAgorot * l.quantity)}</div>
                  </div>
                ))}
              </div>
              <hr />
              <div className="coupon-row">
                <div className="lbl">קוד הנחה</div>
                {coupon ? (
                  <div className="applied">
                    <span className="tag">{coupon.code}</span>
                    <span className="meta">
                      {coupon.type === 'PERCENT' ? `${coupon.value}% הנחה` : 'הנחה'}
                    </span>
                    <button type="button" className="rm" onClick={removeCoupon} aria-label="הסר קוד">
                      <Icon name="x" size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="inputs">
                    <input
                      type="text"
                      placeholder="הזן קוד"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value); setCouponError(null) }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon() } }}
                    />
                    <button type="button" onClick={applyCoupon}
                            disabled={applyingCoupon || !couponInput.trim()}>
                      {applyingCoupon ? '…' : 'החל'}
                    </button>
                  </div>
                )}
                {couponError && <div className="err">{couponError}</div>}
              </div>
              <hr />
              <div className="row">
                <span>סך ביניים</span>
                <span className="v">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="row" style={{ color: 'var(--olive, #5d7a3a)' }}>
                  <span>הנחה{coupon ? ` (${coupon.code})` : ''}</span>
                  <span className="v">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="row">
                <span>משלוח</span>
                <span className="v">{formatPrice(SHIPPING_AGOROT)}</span>
              </div>
              <div className="row muted">
                <span>מע"מ (18%, כלול)</span>
                <span className="v">{formatPrice(vat)}</span>
              </div>
              <hr />
              <div className="total-row">
                <span className="lbl">סך הכל</span>
                <span className="v">{formatPrice(total)}</span>
              </div>
              <button type="submit" className="cta" disabled={submitting}>
                {submitting ? 'יוצר הזמנה…' : 'אישור הזמנה'}
                {!submitting && <Icon name="arrow" size={14} stroke={2.2} />}
              </button>
              <div className="secure-note">
                <Icon name="secure" size={16} />
                תשלום מאובטח · Grow / Meshulam
              </div>
            </aside>
          </div>
        </div>
      </form>
      <Footer />
    </>
  )
}
