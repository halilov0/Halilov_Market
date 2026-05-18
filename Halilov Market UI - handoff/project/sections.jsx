// Section components — general marketplace edition.

const { Icon } = window;

function formatPrice(agorot) {
  const v = (agorot / 100).toFixed(2);
  const [s, a] = v.split('.');
  return { shekels: s, agorot: a };
}

function StarRow({ value }) {
  // 5 outline stars overlaid with filled fraction
  const pct = Math.max(0, Math.min(5, value)) / 5 * 100;
  return (
    <span className="stars" aria-label={`${value} / 5`} style={{ position: 'relative', display: 'inline-flex' }}>
      <span style={{ display: 'inline-flex', gap: 1, color: 'var(--line-2)' }}>
        {[0,1,2,3,4].map(i => <Icon key={i} name="star_f" size={12} />)}
      </span>
      <span style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        width: `${pct}%`, display: 'inline-flex', gap: 1,
        color: 'oklch(0.72 0.16 75)',
      }}>
        {[0,1,2,3,4].map(i => <Icon key={i} name="star_f" size={12} />)}
      </span>
    </span>
  );
}

function UtilityBar() {
  return (
    <div className="util-bar">
      <div className="util-inner">
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="pin" size={12} />
          משלוח לאזור 5290002
        </span>
        <span className="sep"></span>
        <a>שירות לקוחות 24/7</a>
        <span className="sep"></span>
        <a>מעקב הזמנה</a>
        <span className="sep"></span>
        <a>חנויות מורשות</a>
        <div className="util-end">
          <a style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="phone" size={12} />
            *6500
          </a>
          <span className="sep"></span>
          <a>EN</a>
          <span className="sep"></span>
          <a>ILS ₪</a>
        </div>
      </div>
    </div>
  );
}

function Header({ cartCount = 3 }) {
  return (
    <header className="header" data-screen-label="01 Header">
      <div className="header-inner">
        <a className="logo">
          <span className="mark">ח</span>
          <span>
            חלילוב מרקט
            <span className="sub">כל מה שצריך · במקום אחד</span>
          </span>
        </a>
        <form className="search" onSubmit={(e) => e.preventDefault()}>
          <select defaultValue="all">
            <option value="all">כל המחלקות</option>
            <option value="electronics">אלקטרוניקה</option>
            <option value="home">בית ומטבח</option>
            <option value="fashion">אופנה</option>
          </select>
          <input type="search" placeholder="חיפוש מוצר, מותג או מק״ט…" />
          <button type="submit" className="go">
            <Icon name="search" size={16} stroke={2.2} />
            חיפוש
          </button>
        </form>
        <div className="header-actions">
          <a className="icon-btn">
            <Icon name="user" size={20} />
            <span className="label">
              <span className="top">שלום, אורח</span>
              <span className="bot">חשבון שלי</span>
            </span>
          </a>
          <a className="icon-btn">
            <Icon name="heart" size={20} />
            <span className="label">
              <span className="top">רשימת</span>
              <span className="bot">מועדפים</span>
            </span>
          </a>
          <a className="icon-btn" style={{ background: 'var(--surface)' }}>
            <Icon name="bag" size={20} />
            <span className="label">
              <span className="top">הסל שלי</span>
              <span className="bot">₪498.80</span>
            </span>
            <span className="cart-pill">{cartCount}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function DepartmentNav() {
  const { NAV_DEPARTMENTS } = window.MARKET_DATA;
  return (
    <nav className="deptnav" data-screen-label="02 Department Nav">
      <div className="deptnav-inner">
        <button className="all-btn">
          <Icon name="grid" size={14} stroke={2.2} />
          כל המחלקות
        </button>
        {NAV_DEPARTMENTS.map((d, i) => (
          <a key={d.name} className={i === 0 ? 'active' : ''}>
            {d.name}
            {d.hot && <span className="hot-dot" />}
          </a>
        ))}
        <div className="end">
          <span>משלוח חינם מעל ₪199</span>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" data-screen-label="03 Hero">
      <div className="hero-main">
        <div>
          <span className="eyebrow">
            <span className="dot"></span>
            דיל השבוע · עד מחר 23:59
          </span>
          <h1>מבצעי הטכנולוגיה<br/>של <span className="hl">השנה.</span></h1>
          <p>אוזניות, מחשבים נישאים, גיימינג ועוד אלפי מוצרים בהנחות של עד 60%. משלוח מהיר לדלת.</p>
          <div className="cta">
            <button className="primary">לקנייה עכשיו <Icon name="chev_l" size={14} stroke={2.4} /></button>
            <button className="ghost">כל המבצעים</button>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="num">85K+</div>
              <div className="lbl">מוצרים</div>
            </div>
            <div className="stat">
              <div className="num">2,400</div>
              <div className="lbl">מותגים</div>
            </div>
            <div className="stat">
              <div className="num">4.8★</div>
              <div className="lbl">12K ביקורות</div>
            </div>
          </div>
        </div>
        <div className="hero-art">
          <span className="tag">PRODUCT HERO · LIFESTYLE</span>
        </div>
      </div>

      <div className="hero-side">
        <div className="eyebrow">חיסכון 33%</div>
        <h3>אוזניות אלחוטיות AirPro</h3>
        <div className="side-art"><span className="mini-tag">SHOT</span></div>
        <div className="price-strike">
          <span className="now">₪399</span>
          <span className="old">₪599</span>
        </div>
        <div className="pill-row"><span className="pill">משלוח חינם</span></div>
      </div>

      <div className="hero-side">
        <div className="eyebrow">חדש בקטלוג</div>
        <h3>גיימינג · קונסולות וציוד</h3>
        <div className="side-art"><span className="mini-tag">SHOT</span></div>
        <div className="pill-row">
          <span className="pill info">240+ פריטים</span>
          <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>גלה ›</span>
        </div>
      </div>
    </section>
  );
}

function BrandStrip() {
  const { BRANDS } = window.MARKET_DATA;
  return (
    <div className="brand-strip" data-screen-label="04 Brand Strip">
      <span className="label">מותגים שאוהבים</span>
      <div className="brands">
        {BRANDS.map(b => <a key={b} className="brand">{b}</a>)}
      </div>
    </div>
  );
}

function DepartmentTiles() {
  const { CATEGORIES } = window.MARKET_DATA;
  return (
    <section data-screen-label="05 Department Tiles">
      <div className="section-head">
        <div className="title">
          <h2>קונים לפי מחלקה</h2>
          <span className="meta">6 מחלקות עיקריות · 8,200+ מוצרים</span>
        </div>
        <a className="see-all">לכל המחלקות <Icon name="chev_l" size={12} stroke={2.4} /></a>
      </div>
      <div className="dept-tiles">
        {CATEGORIES.map(c => (
          <a key={c.id} className="dept-tile">
            <div className="swatch" style={{ background: c.accent }}></div>
            <div className="swatch-2"></div>
            <div>
              <h3>{c.name}</h3>
              <div className="count">{c.count.toLocaleString('he-IL')} פריטים</div>
            </div>
            <span className="cta-link">לקטגוריה <Icon name="chev_l" size={11} stroke={2.6} /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function FlashDeals() {
  const { FLASH_DEALS } = window.MARKET_DATA;
  return (
    <section className="flash-wrap" data-screen-label="06 Flash Deals">
      <div className="flash-head">
        <div className="title-row">
          <span className="lbl">
            <Icon name="bolt" size={14} stroke={2.4} fill="currentColor" />
            דילים בזק
          </span>
          <h2>מסתיים תוך 02:14:38</h2>
        </div>
        <div className="timer">
          <span style={{ color: 'var(--ink-3)' }}>נסגר ב</span>
          <span className="digits">
            <span className="digit">02</span>
            <span className="digit">14</span>
            <span className="digit">38</span>
          </span>
        </div>
      </div>
      <div className="flash-grid">
        {FLASH_DEALS.map(p => {
          const { shekels, agorot } = formatPrice(p.price);
          const oldP = formatPrice(p.old);
          const total = p.stock + p.sold;
          const pct = (p.sold / total) * 100;
          const saved = Math.round((1 - p.price / p.old) * 100);
          return (
            <a key={p.sku} className="flash-card">
              <span className="save-tag">−{saved}%</span>
              <div className="img-wrap">
                <span className="ph">{p.sku}</span>
              </div>
              <div className="name">{p.name}</div>
              <div className="price-row">
                <span className="price">₪{shekels}<span style={{ fontSize: 12 }}>.{agorot}</span></span>
                <span className="old">₪{oldP.shekels}</span>
              </div>
              <div className="progress">
                <div className="bar" style={{ width: `${pct}%` }}></div>
              </div>
              <div className="stock-row">
                <span className="left">נמכרו {p.sold}</span>
                <span>נשארו {p.stock}</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ProductCard({ p, showDelivery }) {
  const { shekels, agorot } = formatPrice(p.price);
  const old = p.old ? formatPrice(p.old) : null;
  const out = p.stock === 0;
  const lowStock = p.stock > 0 && p.stock < 8;
  const sale = p.badge === 'sale';

  // pick a primary badge slot
  let badge = null;
  if (out) badge = { cls: 'out', text: 'אזל' };
  else if (p.badgeText === 'BEST SELLER') badge = { cls: 'dark', text: 'BEST SELLER' };
  else if (p.badgeText === 'TOP RATED')   badge = { cls: 'good', text: 'TOP RATED' };
  else if (p.badgeText === 'PRIME')       badge = { cls: 'info', text: 'PRIME' };
  else if (p.badgeText === 'NEW')         badge = { cls: 'dark', text: 'NEW' };

  return (
    <a className="card">
      <div className="img-wrap">
        <span className="ph">{p.sku}</span>
        <div className="badge">
          {sale && <span className="badge-pill">מבצע</span>}
          {badge && <span className={`badge-pill ${badge.cls}`}>{badge.text}</span>}
        </div>
        <button className="fav" aria-label="הוסף למועדפים" onClick={(e) => e.preventDefault()}>
          <Icon name="heart" size={14} />
        </button>
      </div>
      <div className="rating">
        <StarRow value={p.rating} />
        <span style={{ marginInlineStart: 2 }}>{p.rating}</span>
        <span className="count">({p.reviews.toLocaleString('he-IL')})</span>
      </div>
      <div className="name">{p.name}</div>
      <div className="unit">{p.unit}</div>
      {showDelivery && !out && (
        <div className="delivery-tag">
          <Icon name="truck" size={11} stroke={2} />
          משלוח חינם · {lowStock ? 'מחר' : 'מחר עד הערב'}
        </div>
      )}
      <div className="price-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className={`price ${sale ? 'sale' : ''}`}>
            <span className="sym">₪</span>{shekels}<span className="agorot">.{agorot}</span>
          </span>
          {old && <span className="old-price">₪{old.shekels}.{old.agorot}</span>}
          {!old && lowStock && !out && (
            <span style={{ fontSize: 10.5, color: 'var(--warn)', fontWeight: 700 }}>
              מלאי אחרון · {p.stock}
            </span>
          )}
        </div>
        <button
          className={`add ${out ? 'disabled' : ''}`}
          onClick={(e) => e.preventDefault()}
          disabled={out}
        >
          <Icon name="plus" size={13} stroke={2.6} />
          {out ? 'אזל' : 'הוסף'}
        </button>
      </div>
    </a>
  );
}

function ProductGrid({ title, meta, products, density, showDelivery, label }) {
  return (
    <section data-screen-label={label}>
      <div className="section-head">
        <div className="title">
          <h2>{title}</h2>
          <span className="meta">{meta}</span>
        </div>
        <a className="see-all">לכל המוצרים <Icon name="chev_l" size={12} stroke={2.4} /></a>
      </div>
      <div className={`grid ${density === 'dense' ? 'dense' : density === 'spacious' ? 'spacious' : ''}`}>
        {products.map(p => (
          <ProductCard key={p.sku} p={p} showDelivery={showDelivery} />
        ))}
      </div>
    </section>
  );
}

function DualPromo() {
  return (
    <section className="promo-2" data-screen-label="07 Dual Promo">
      <div className="promo-card dark">
        <div>
          <div className="eyebrow" style={{ color: 'var(--accent)' }}>גיימרים בלבד</div>
          <h3>קונסולות, מקלדות,<br/>וצגי גיימינג.</h3>
          <p className="lede">מאות מוצרי גיימינג נבחרים — עד 40% הנחה.</p>
          <button className="promo-cta">לחנות הגיימינג <Icon name="chev_l" size={12} stroke={2.4} /></button>
        </div>
        <div className="promo-art"><span className="mini-tag">GAMING SHOT</span></div>
      </div>
      <div className="promo-card">
        <div>
          <div className="eyebrow">חדש בחנות</div>
          <h3>סלון, מטבח<br/>ועיצוב הבית.</h3>
          <p className="lede">קולקציית הסתיו · מאות פריטים שהגיעו השבוע.</p>
          <button className="promo-cta">לקטלוג הבית <Icon name="chev_l" size={12} stroke={2.4} /></button>
        </div>
        <div className="promo-art"><span className="mini-tag">HOME SHOT</span></div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { i: 'truck',   t: 'משלוח חינם מעל ₪199',  s: 'הזמנה עד 14:00 — מגיע מחר.' },
    { i: 'shield',  t: 'תשלום מאובטח · SSL',  s: 'אשראי · ביט · PayPal · Apple Pay' },
    { i: 'refresh', t: 'החזרה ב־30 יום',      s: 'לא אוהבים? מחזירים — בלי שאלות.' },
    { i: 'star',    t: '4.8 · 12,400 ביקורות', s: 'דירוג ממוצע · 12 חודשים אחרונים' },
  ];
  return (
    <div className="trust" data-screen-label="09 Trust Strip">
      {items.map(it => (
        <div key={it.i} className="trust-item">
          <div className="ico"><Icon name={it.i} size={20} stroke={1.8} /></div>
          <div>
            <div className="t">{it.t}</div>
            <div className="s">{it.s}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  const cols = [
    { h: 'קנייה',   items: ['כל המחלקות', 'מבצעי השבוע', 'דילים בזק', 'מותגים', 'כרטיסי מתנה'] },
    { h: 'שירות',   items: ['צור קשר', 'מעקב הזמנה', 'מדיניות החזרה', 'אחריות', 'שאלות נפוצות'] },
    { h: 'חשבון',   items: ['התחברות', 'הרשמה', 'הזמנות שלי', 'מועדפים', 'חלילוב פלוס'] },
    { h: 'החברה',   items: ['עלינו', 'קריירה', 'בלוג', 'תקנון', 'מדיניות פרטיות'] },
  ];
  return (
    <footer className="footer" data-screen-label="10 Footer">
      <div className="footer-inner">
        <div className="brand-col">
          <a className="logo">
            <span className="mark">ח</span>
            <span>
              חלילוב מרקט
              <span className="sub">כל מה שצריך · במקום אחד</span>
            </span>
          </a>
          <p>המרקט המקוון של ישראל לכל מה שצריך — אלקטרוניקה, בית, אופנה, ספורט ועוד. אלפי מוצרים, מאות מותגים.</p>
          <div className="socials">
            <a aria-label="Facebook"><Icon name="user" size={16} /></a>
            <a aria-label="Instagram"><Icon name="eye" size={16} /></a>
            <a aria-label="WhatsApp"><Icon name="phone" size={16} /></a>
          </div>
        </div>
        {cols.map(c => (
          <div key={c.h} className="col">
            <h4>{c.h}</h4>
            {c.items.map(i => <a key={i}>{i}</a>)}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2026 חלילוב מרקט בע״מ · ח.פ. 515-555-555</span>
        <span className="pays">
          <span className="pay-chip">VISA</span>
          <span className="pay-chip">MC</span>
          <span className="pay-chip">ביט</span>
          <span className="pay-chip">PAYPAL</span>
          <span className="pay-chip">APPLE</span>
        </span>
      </div>
    </footer>
  );
}

Object.assign(window, {
  UtilityBar, Header, DepartmentNav, Hero, BrandStrip,
  DepartmentTiles, FlashDeals, ProductCard, ProductGrid,
  DualPromo, TrustStrip, Footer,
});
