/* eslint-disable */
// ---- Shared UI primitives for the Halilov Market mockup ----

const Icon = ({ name, size = 18, stroke = 1.6 }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></>,
    cart:   <><path d="M3 5h2l2.5 11h11L21 8H6" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></>,
    user:   <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></>,
    heart:  <><path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" /></>,
    plus:   <><path d="M12 5v14M5 12h14" /></>,
    minus:  <><path d="M5 12h14" /></>,
    chev:   <><path d="m9 6 6 6-6 6" /></>,
    leaf:   <><path d="M5 19c0-7 6-13 14-13 0 8-6 14-14 14z" /><path d="M5 19 14 10" /></>,
    arrow:  <><path d="m5 12h14M13 5l7 7-7 7" /></>,
    bag:    <><path d="M6 7h12l-1 13H7zM9 7a3 3 0 0 1 6 0" /></>,
    check:  <><path d="m5 12 5 5 9-11" /></>,
    truck:  <><path d="M2 7h11v9H2zM13 11h5l3 3v2h-8" /><circle cx="6" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
    secure: <><path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-5" /></>,
    pkg:    <><path d="M3 7 12 3l9 4-9 4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

const Header = ({ active = 'catalog', cart = 3, user = true }) => (
  <header className="hm-header">
    <div className="hm-logo">
      <span className="mark">ח</span>
      <span>חלילוב מרקט</span>
    </div>
    <nav className="hm-nav">
      <a className={active==='catalog'?'active':''}>קטלוג</a>
      <a>טריות השבוע</a>
      <a>מבצעים</a>
      <a>חדש בקטלוג</a>
      <a>עלינו</a>
    </nav>
    <div className="hm-header-actions">
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        background:'var(--card)', border:'1px solid var(--line)',
        borderRadius:'var(--r-pill)', padding:'9px 16px',
        width: 260, color:'var(--ink-3)', fontSize:14
      }}>
        <Icon name="search" size={16} />
        <span>חפש מוצר, מותג, קטגוריה…</span>
      </div>
      <button className="hm-icon-btn"><Icon name="heart" /></button>
      <button className="hm-icon-btn">
        <Icon name="bag" />
        {cart>0 && <span className="badge">{cart}</span>}
      </button>
      {user ? (
        <div style={{display:'flex', alignItems:'center', gap:8, marginInlineStart:8}}>
          <div style={{
            width:36, height:36, borderRadius:'50%',
            background:'var(--terra-soft)', color:'var(--terracotta)',
            display:'grid', placeItems:'center', fontWeight:700, fontSize:14
          }}>נ</div>
          <div style={{lineHeight:1.15}}>
            <div style={{fontSize:13, fontWeight:600}}>שלום, נועה</div>
            <div style={{fontSize:11, color:'var(--ink-3)'}}>חברה ב־VIP</div>
          </div>
        </div>
      ) : (
        <button className="hm-btn hm-btn-quiet">התחברות</button>
      )}
    </div>
  </header>
);

const Footer = () => (
  <footer className="hm-footer">
    <div style={{display:'flex', alignItems:'center', gap:14}}>
      <span className="brand">חלילוב מרקט</span>
      <span style={{opacity:.6, fontSize:12}}>· מרכז ת"א · נוסד 2007</span>
    </div>
    <div style={{display:'flex', gap:24, fontSize:13, opacity:.85}}>
      <span>משלוחים</span><span>החזרות</span><span>צור קשר</span><span>תנאים</span>
    </div>
  </footer>
);

const ProductCard = ({ p }) => (
  <div className="hm-product">
    <div className="img">
      <span className="glyph">{p.code}</span>
      {p.badge && (
        <div className="badge-stack">
          <span className={`hm-badge hm-badge-${p.badge}`}>{p.badgeText}</span>
        </div>
      )}
      <button style={{
        position:'absolute', top:14, insetInlineEnd:14,
        width:32, height:32, borderRadius:'50%',
        background:'var(--card)', border:'1px solid var(--line)',
        display:'grid', placeItems:'center', color:'var(--ink-2)'
      }}><Icon name="heart" size={14} /></button>
    </div>
    <div>
      <div className="name">{p.name}</div>
      <div className="sub">{p.sub}</div>
    </div>
    <div style={{fontFamily:'var(--mono)', fontSize:10.5, letterSpacing:'0.16em', color:'var(--ink-3)', textTransform:'uppercase', marginTop:-4}}>{p.cat}</div>
    <div className="row">
      <div className="price">
        <span style={{color:'var(--ink-3)', fontSize:12, marginInlineEnd:2}}>₪</span>
        {(p.price/100).toFixed(2).split('.')[0]}
        <span className="agorot">.{(p.price/100).toFixed(2).split('.')[1]}</span>
      </div>
      <button className="add"><Icon name="plus" size={16} stroke={2.2} /></button>
    </div>
  </div>
);

const Hero = () => (
  <div className="hm-hero">
    <div>
      <div className="kicker">קולקציית אביב · 2026</div>
      <h1>כל מה שמסביב,<br />במקום אחד.</h1>
      <p className="lede">
        קטלוג מאוצר של פריטים שעוברים אצלנו בדיקת איכות לפני שהם מגיעים אליך —
        מבגדים ועד אלקטרוניקה, ביום העסקים הבא בדלת.
      </p>
      <div className="cta-row">
        <button className="cta-primary">לקטלוג המלא ↗</button>
        <button className="cta-ghost">מה חדש השבוע</button>
      </div>
    </div>
    <div className="art">
      <div className="stamp">EST · 2018</div>
    </div>
  </div>
);

Object.assign(window, { Icon, Header, Footer, ProductCard, Hero });
