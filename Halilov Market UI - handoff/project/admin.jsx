/* eslint-disable */
// ---- Admin panel mockups ----

const AdmSide = ({active}) => {
  const items = [
    ['dash',  'דשבורד',     '⌂', null],
    ['ord',   'הזמנות',     '◫', '12'],
    ['prod',  'מוצרים',     '◇', '124'],
    ['cat',   'קטגוריות',   '☰', '8'],
    ['cust',  'לקוחות',     '⏿', null],
    ['mkt',   'שיווק',      '◊', null],
    ['rep',   'דו"חות',     '↗', null],
    ['set',   'הגדרות',     '⚙', null],
  ];
  return (
    <aside className="adm-side">
      <div className="brand">
        <span className="mark">ח</span>
        <span>חלילוב · ניהול</span>
      </div>
      <div className="label">תפעול</div>
      {items.slice(0,4).map(([id,t,i,c])=>(
        <div key={id} className={`adm-nav-item ${active===id?'active':''}`}>
          <span style={{fontSize:14, width:18, textAlign:'center', opacity:.8}}>{i}</span>
          <span>{t}</span>
          {c && <span className="count">{c}</span>}
        </div>
      ))}
      <div className="label">צמיחה</div>
      {items.slice(4).map(([id,t,i,c])=>(
        <div key={id} className={`adm-nav-item ${active===id?'active':''}`}>
          <span style={{fontSize:14, width:18, textAlign:'center', opacity:.8}}>{i}</span>
          <span>{t}</span>
          {c && <span className="count">{c}</span>}
        </div>
      ))}
      <div style={{
        marginTop:'auto', padding:14, borderRadius:'var(--r-md)',
        background:'oklch(0.22 0.01 80)', display:'flex', gap:10, alignItems:'center'
      }}>
        <div style={{
          width:34, height:34, borderRadius:'50%', background:'var(--terracotta)',
          color:'var(--paper)', fontWeight:700, fontSize:13,
          display:'grid', placeItems:'center'
        }}>א</div>
        <div style={{fontSize:12.5, lineHeight:1.3}}>
          <div style={{color:'var(--paper)', fontWeight:600}}>אריאל ח׳</div>
          <div style={{color:'oklch(0.6 0.02 80)', fontSize:11}}>סופר-אדמין</div>
        </div>
      </div>
    </aside>
  );
};

const AdmTop = ({crumb}) => (
  <div className="adm-top">
    <div className="crumb">
      <span>חלילוב</span><span style={{opacity:.4}}>›</span>
      <b>{crumb}</b>
    </div>
    <div className="search">
      <Icon name="search" size={14}/>
      <span>חפש הזמנה, מוצר, לקוח…</span>
      <span className="mono" style={{
        marginInlineStart:'auto', fontSize:10.5,
        padding:'2px 6px', border:'1px solid var(--line)',
        borderRadius:4, color:'var(--ink-3)'
      }}>⌘K</span>
    </div>
    <button className="hm-btn hm-btn-quiet" style={{padding:'8px 14px', fontSize:12.5}}>צפה בחנות</button>
    <div className="who">
      <div className="avatar">א</div>
      <span style={{fontWeight:600}}>אריאל</span>
      <Icon name="chev" size={12}/>
    </div>
  </div>
);

const Stat = ({k, v, delta, dir, hint}) => (
  <div className="adm-stat">
    <div className="k">{k}</div>
    <div className="v">{v}</div>
    {delta && <div className={`delta ${dir}`}>
      <span>{dir==='up'?'↑':'↓'}</span> {delta} <span style={{color:'var(--ink-3)', fontWeight:400, marginInlineStart:4}}>{hint}</span>
    </div>}
  </div>
);

const StatusPill = ({s}) => (
  <span className={`hm-status hm-status-${s.toLowerCase()}`}>{s}</span>
);

const AdminDashboard = () => {
  const orders = window.HM_ORDERS;
  const bars = [12, 18, 14, 22, 28, 25, 31, 38, 33, 41, 36, 48, 44, 52];
  const max = Math.max(...bars);
  return (
    <div className="adm">
      <AdmSide active="dash"/>
      <div className="adm-main">
        <AdmTop crumb="דשבורד"/>
        <div className="adm-page">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h1>בוקר טוב, אריאל ✿</h1>
              <div className="sub">סקירה של 14 הימים האחרונים · מתעדכן עכשיו</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="hm-btn hm-btn-quiet">ייצוא CSV</button>
              <button className="hm-btn hm-btn-primary">+ מוצר חדש</button>
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:20}}>
            <Stat k="הכנסות (14י׳)" v="₪48,920" delta="12.4%" dir="up" hint="מול תקופה קודמת"/>
            <Stat k="הזמנות" v="142"     delta="8.1%"  dir="up" hint="69 שולמו"/>
            <Stat k="ערך הזמנה ממוצע" v="₪344" delta="3.2%" dir="down" hint="ממוצע ל-30 יום"/>
            <Stat k="מלאי נמוך" v="7" delta="2 חדשים" dir="down" hint="< 10 יח׳"/>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14, marginBottom:20}}>
            <div className="adm-card">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
                <div>
                  <h3 style={{fontFamily:'var(--serif)', fontSize:18}}>הכנסות יומיות</h3>
                  <div className="sub" style={{marginBottom:0}}>30 אפריל – 13 מאי</div>
                </div>
                <div style={{display:'flex', gap:6, fontSize:12}}>
                  <button className="hm-chip active" style={{padding:'5px 12px'}}>14 ימים</button>
                  <button className="hm-chip" style={{padding:'5px 12px'}}>חודש</button>
                  <button className="hm-chip" style={{padding:'5px 12px'}}>רבעון</button>
                </div>
              </div>
              <div className="adm-bars">
                {bars.map((v,i)=>(
                  <div key={i} className={`bar ${v===max?'peak':''}`}>
                    <div className="fill" style={{height:`${v/max*100}%`}}/>
                  </div>
                ))}
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:8, fontSize:11, color:'var(--ink-3)', fontFamily:'var(--mono)'}}>
                <span>30/04</span><span>06/05</span><span>13/05</span>
              </div>
            </div>

            <div className="adm-card">
              <h3 style={{fontFamily:'var(--serif)', fontSize:18, marginBottom:14}}>טופ קטגוריות</h3>
              {[
                ['אלקטרוניקה', 38, '₪18,200'],
                ['תיקים ואביזרים', 28, '₪13,400'],
                ['ספורט ופנאי', 18, '₪9,150'],
                ['בית וסלון', 16, '₪8,170'],
              ].map(([n,p,t])=>(
                <div key={n} style={{marginBottom:14}}>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6}}>
                    <span>{n}</span>
                    <span className="mono">{t}</span>
                  </div>
                  <div style={{height:6, background:'var(--paper-2)', borderRadius:3}}>
                    <div style={{
                      height:'100%', width:`${p}%`,
                      background:'var(--olive)', borderRadius:3
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="adm-card" style={{padding:0}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 22px', borderBottom:'1px solid var(--line)'}}>
              <div>
                <h3 style={{fontFamily:'var(--serif)', fontSize:18}}>הזמנות אחרונות</h3>
                <div className="sub" style={{marginBottom:0}}>5 הזמנות עדכניות</div>
              </div>
              <a style={{color:'var(--terracotta)', fontSize:13, fontWeight:600}}>הצג הכול ←</a>
            </div>
            <table className="adm-table" style={{border:'none', borderRadius:0}}>
              <thead>
                <tr><th>הזמנה</th><th>תאריך</th><th>לקוח</th><th>פריטים</th><th>סטטוס</th><th style={{textAlign:'left'}}>סכום</th></tr>
              </thead>
              <tbody>
                {orders.slice(0,5).map(o=>(
                  <tr key={o.num}>
                    <td className="num"><b>{o.num}</b></td>
                    <td style={{color:'var(--ink-3)'}}>{o.date}</td>
                    <td>{o.customer} <span style={{color:'var(--ink-3)'}}>· {o.city}</span></td>
                    <td className="num">{o.items}</td>
                    <td><StatusPill s={o.status}/></td>
                    <td className="num" style={{textAlign:'left', fontWeight:600}}>₪{(o.total/100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const orders = window.HM_ORDERS;
  return (
    <div className="adm">
      <AdmSide active="ord"/>
      <div className="adm-main">
        <AdmTop crumb="הזמנות"/>
        <div className="adm-page">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:18}}>
            <div>
              <h1>הזמנות</h1>
              <div className="sub">{orders.length} הזמנות · 2 ממתינות לטיפול</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="hm-btn hm-btn-quiet">ייצוא</button>
              <button className="hm-btn hm-btn-primary">+ הזמנה ידנית</button>
            </div>
          </div>

          {/* tabs */}
          <div style={{display:'flex', gap:24, borderBottom:'1px solid var(--line)', marginBottom:18}}>
            {[['הכול',8],['ממתינות',1],['שולמו',2],['נשלחו',1],['נמסרו',2],['בעיות',2]].map(([n,c],i)=>(
              <div key={n} style={{
                padding:'12px 2px', fontSize:14,
                color: i===0?'var(--ink)':'var(--ink-3)',
                fontWeight: i===0?600:400,
                borderBottom: i===0?'2px solid var(--ink)':'2px solid transparent',
                marginBottom:-1, display:'flex', alignItems:'center', gap:8
              }}>
                {n}
                <span className="mono" style={{
                  fontSize:11, padding:'1px 7px',
                  background: i===0?'var(--ink)':'var(--paper-2)',
                  color: i===0?'var(--paper)':'var(--ink-3)',
                  borderRadius:'var(--r-pill)'
                }}>{c}</span>
              </div>
            ))}
          </div>

          {/* filter bar */}
          <div style={{display:'flex', gap:10, marginBottom:14, flexWrap:'wrap', alignItems:'center'}}>
            <div style={{
              display:'flex', alignItems:'center', gap:8,
              background:'var(--card)', border:'1px solid var(--line)',
              borderRadius:'var(--r-pill)', padding:'8px 14px',
              width:280, color:'var(--ink-3)', fontSize:13
            }}>
              <Icon name="search" size={14}/>
              <span>מספר הזמנה, שם לקוח…</span>
            </div>
            {['טווח תאריכים','אמצעי תשלום','עיר','מיון: חדש קודם'].map(f=>(
              <div key={f} style={{
                display:'flex', alignItems:'center', gap:8,
                border:'1px solid var(--line)', borderRadius:'var(--r-pill)',
                padding:'8px 14px', background:'var(--card)', fontSize:13
              }}>
                {f}<Icon name="chev" size={12}/>
              </div>
            ))}
          </div>

          <table className="adm-table">
            <thead>
              <tr>
                <th style={{width:28}}><input type="checkbox"/></th>
                <th>הזמנה</th><th>תאריך</th><th>לקוח</th>
                <th>פריטים</th><th>תשלום</th><th>סטטוס</th>
                <th style={{textAlign:'left'}}>סכום</th>
                <th style={{width:80}}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o.num}>
                  <td><input type="checkbox"/></td>
                  <td className="num"><b>{o.num}</b></td>
                  <td style={{color:'var(--ink-3)', whiteSpace:'nowrap'}}>{o.date}</td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div style={{
                        width:30, height:30, borderRadius:'50%',
                        background:'var(--terra-soft)', color:'var(--terracotta)',
                        fontSize:11, fontWeight:700, display:'grid', placeItems:'center'
                      }}>{o.customer[0]}</div>
                      <div>
                        <div style={{fontWeight:500}}>{o.customer}</div>
                        <div style={{fontSize:11.5, color:'var(--ink-3)'}}>{o.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="num">{o.items}</td>
                  <td><span style={{fontSize:11.5, color:'var(--ink-3)'}}>VISA •••• 4421</span></td>
                  <td><StatusPill s={o.status}/></td>
                  <td className="num" style={{textAlign:'left', fontWeight:600}}>₪{(o.total/100).toFixed(2)}</td>
                  <td>
                    <button className="hm-btn hm-btn-quiet" style={{padding:'5px 12px', fontSize:12}}>פתח</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14, fontSize:13, color:'var(--ink-3)'}}>
            <span>מציג 1–8 מתוך 142</span>
            <div style={{display:'flex', gap:6}}>
              {['‹','1','2','3','…','18','›'].map((p,i)=>(
                <button key={i} className={`hm-chip ${p==='1'?'active':''}`} style={{padding:'5px 11px', minWidth:32}}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOrderDetail = () => {
  const o = window.HM_ORDERS[0];
  const items = window.HM_PRODUCTS.slice(0,3);
  const qtys = [2,1,3];
  return (
    <div className="adm">
      <AdmSide active="ord"/>
      <div className="adm-main">
        <AdmTop crumb="הזמנות › HLV-24081"/>
        <div className="adm-page">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:18}}>
            <div>
              <div className="hm-meta" style={{fontFamily:'var(--mono)', letterSpacing:'0.16em', textTransform:'uppercase'}}>← חזרה לרשימה</div>
              <h1 style={{marginTop:4}}>הזמנה {o.num}</h1>
              <div className="sub" style={{display:'flex', alignItems:'center', gap:10}}>
                <span>{o.date}</span>
                <span style={{color:'var(--line-2)'}}>·</span>
                <StatusPill s={o.status}/>
              </div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="hm-btn hm-btn-quiet">⎙ הדפסת תווית</button>
              <button className="hm-btn hm-btn-quiet">החזר תשלום</button>
              <button className="hm-btn hm-btn-primary">סמן כשולם</button>
            </div>
          </div>

          {/* timeline */}
          <div className="adm-card" style={{marginBottom:14}}>
            <h3 style={{fontFamily:'var(--serif)', fontSize:18, marginBottom:18}}>מסלול הזמנה</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, position:'relative'}}>
              {[
                ['הוזמן','13/05 09:24','done'],
                ['שולם','13/05 09:25','done'],
                ['מוכן','—','active'],
                ['נשלח','—',''],
                ['נמסר','—',''],
              ].map(([t,d,s],i)=>(
                <div key={i} style={{textAlign:'center', position:'relative'}}>
                  {i<4 && <div style={{
                    position:'absolute', top:14, insetInlineStart:'-50%', width:'100%', height:2,
                    background: s==='done'?'var(--olive)':'var(--line)', zIndex:0
                  }}/>}
                  <div style={{
                    width:30, height:30, borderRadius:'50%',
                    background: s==='active'?'var(--ink)': s==='done'?'var(--olive)':'var(--card)',
                    color: s? 'var(--paper)':'var(--ink-3)',
                    border: s?'none':'1px solid var(--line)',
                    margin:'0 auto', position:'relative', zIndex:1,
                    display:'grid', placeItems:'center', fontSize:13, fontWeight:600
                  }}>{s==='done'?'✓': i+1}</div>
                  <div style={{fontSize:13, fontWeight: s?600:400, marginTop:8}}>{t}</div>
                  <div style={{fontSize:11.5, color:'var(--ink-3)', fontFamily:'var(--mono)'}}>{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1.7fr 1fr', gap:14}}>
            <div className="adm-card" style={{padding:0}}>
              <div style={{padding:'18px 22px', borderBottom:'1px solid var(--line)'}}>
                <h3 style={{fontFamily:'var(--serif)', fontSize:18}}>פריטים ({items.length})</h3>
              </div>
              <div>
                {items.map((p,i)=>(
                  <div key={p.id} style={{
                    display:'grid', gridTemplateColumns:'60px 1fr auto auto auto',
                    gap:16, alignItems:'center',
                    padding:'14px 22px', borderBottom:'1px solid var(--line)'
                  }}>
                    <div style={{
                      width:60, height:60, borderRadius:'var(--r-md)',
                      background:'var(--paper-2)', display:'grid', placeItems:'center',
                      fontFamily:'var(--mono)', fontSize:10, color:'var(--ink-3)', letterSpacing:'0.1em'
                    }}>{p.code.split(' ')[0]}</div>
                    <div>
                      <div style={{fontWeight:500}}>{p.name}</div>
                      <div style={{fontSize:12, color:'var(--ink-3)'}}>{p.sub}</div>
                      <div className="mono" style={{fontSize:11, color:'var(--ink-3)', marginTop:2}}>SKU: HM-{p.code.replace(/[^A-Z0-9]/g,'')}</div>
                    </div>
                    <div className="mono" style={{color:'var(--ink-3)'}}>₪{(p.price/100).toFixed(2)}</div>
                    <div className="mono">× {qtys[i]}</div>
                    <div className="mono" style={{fontWeight:600, minWidth:80, textAlign:'left'}}>
                      ₪{(p.price*qtys[i]/100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:'14px 22px', display:'grid', gap:6}}>
                <Row k="סך ביניים" v="₪127.60"/>
                <Row k="משלוח" v="₪19.90"/>
                <Row k='מע"מ (18%, כלול)' v="₪22.50" muted/>
                <div style={{display:'flex', justifyContent:'space-between', marginTop:6, paddingTop:10, borderTop:'1px solid var(--line)'}}>
                  <strong>סך הכל</strong>
                  <strong className="mono" style={{fontSize:18}}>₪147.50</strong>
                </div>
              </div>
            </div>

            <div style={{display:'grid', gap:14, height:'fit-content'}}>
              <div className="adm-card">
                <div className="hm-label" style={{marginBottom:10}}>לקוח</div>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <div style={{
                    width:42, height:42, borderRadius:'50%',
                    background:'var(--terra-soft)', color:'var(--terracotta)',
                    fontWeight:700, display:'grid', placeItems:'center'
                  }}>נ</div>
                  <div>
                    <div style={{fontWeight:600}}>נועה חליבוב</div>
                    <div style={{fontSize:12, color:'var(--ink-3)'}}>noa@halilov.co.il</div>
                  </div>
                </div>
                <hr className="hm-rule"/>
                <div style={{fontSize:12.5, color:'var(--ink-3)'}}>5 הזמנות · לקוחה מ-2024</div>
                <div className="mono" style={{fontSize:12.5, marginTop:6}}>LTV ₪1,290.40</div>
              </div>

              <div className="adm-card">
                <div className="hm-label" style={{marginBottom:10}}>כתובת למשלוח</div>
                <div style={{fontSize:13, lineHeight:1.6}}>
                  נועה חליבוב<br/>
                  <span className="mono">050-123-4567</span><br/>
                  רחוב הירקון 148, דירה 6<br/>
                  תל אביב-יפו <span className="mono">6340101</span>
                </div>
                <div style={{
                  marginTop:10, padding:10, fontSize:12,
                  background:'var(--paper-2)', borderRadius:'var(--r-sm)',
                  color:'var(--ink-2)'
                }}>
                  פעמון לא עובד — אנא צלצלו בנייד
                </div>
              </div>

              <div className="adm-card">
                <div className="hm-label" style={{marginBottom:10}}>תשלום</div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13}}>
                  <span>VISA •••• 4421</span>
                  <span className="hm-status hm-status-paid">PAID</span>
                </div>
                <hr className="hm-rule"/>
                <div className="mono" style={{fontSize:11.5, color:'var(--ink-3)'}}>
                  TXN: grw_2x9P_91k20A<br/>
                  Webhook 13/05 09:25:14
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const products = window.HM_PRODUCTS;
  return (
    <div className="adm">
      <AdmSide active="prod"/>
      <div className="adm-main">
        <AdmTop crumb="מוצרים"/>
        <div className="adm-page">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:18}}>
            <div>
              <h1>מוצרים</h1>
              <div className="sub">124 מוצרים פעילים · 7 במלאי נמוך</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="hm-btn hm-btn-quiet">ייבוא CSV</button>
              <button className="hm-btn hm-btn-primary">+ מוצר חדש</button>
            </div>
          </div>

          <div style={{display:'flex', gap:10, marginBottom:14, alignItems:'center', flexWrap:'wrap'}}>
            <div style={{
              display:'flex', alignItems:'center', gap:8,
              background:'var(--card)', border:'1px solid var(--line)',
              borderRadius:'var(--r-pill)', padding:'8px 14px',
              width:280, color:'var(--ink-3)', fontSize:13
            }}>
              <Icon name="search" size={14}/><span>חפש מק״ט, שם מוצר…</span>
            </div>
            {['קטגוריה: הכול','סטטוס: פעיל','מלאי: הכול'].map(f=>(
              <div key={f} style={{
                display:'flex', alignItems:'center', gap:8,
                border:'1px solid var(--line)', borderRadius:'var(--r-pill)',
                padding:'8px 14px', background:'var(--card)', fontSize:13
              }}>{f}<Icon name="chev" size={12}/></div>
            ))}
            <div style={{marginInlineStart:'auto', display:'flex', gap:4, border:'1px solid var(--line)', borderRadius:'var(--r-md)', background:'var(--card)'}}>
              <button style={{padding:'7px 12px', background:'var(--paper-2)', border:'none', borderRadius:'var(--r-md)', fontSize:12}}>טבלה</button>
              <button style={{padding:'7px 12px', background:'none', border:'none', fontSize:12, color:'var(--ink-3)'}}>כרטיסיות</button>
            </div>
          </div>

          <table className="adm-table">
            <thead>
              <tr>
                <th style={{width:28}}><input type="checkbox"/></th>
                <th style={{width:56}}></th>
                <th>שם</th>
                <th>מק״ט</th>
                <th>קטגוריה</th>
                <th style={{textAlign:'left'}}>מחיר</th>
                <th>מלאי</th>
                <th>סטטוס</th>
                <th style={{width:120}}></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p=>(
                <tr key={p.id}>
                  <td><input type="checkbox"/></td>
                  <td>
                    <div style={{
                      width:42, height:42, borderRadius:'var(--r-sm)',
                      background:'var(--paper-2)', display:'grid', placeItems:'center',
                      fontFamily:'var(--mono)', fontSize:9, color:'var(--ink-3)',
                      letterSpacing:'0.1em', textAlign:'center'
                    }}>{p.code.split(' ')[0]}</div>
                  </td>
                  <td>
                    <div style={{fontWeight:500}}>{p.name}</div>
                    <div style={{fontSize:11.5, color:'var(--ink-3)'}}>{p.sub}</div>
                  </td>
                  <td className="num">HM-{p.code.replace(/[^A-Z0-9]/g,'')}</td>
                  <td><span className="hm-chip" style={{padding:'3px 10px', fontSize:11.5}}>{p.cat}</span></td>
                  <td className="num" style={{textAlign:'left', fontWeight:600}}>₪{(p.price/100).toFixed(2)}</td>
                  <td className="num" style={{color: p.id===5 ? 'var(--terracotta)':'var(--ink)'}}>
                    {p.id===5 ? '3 ⚠' : Math.floor(20+p.id*7)}
                  </td>
                  <td>
                    <span className="hm-status hm-status-paid" style={{textTransform:'none'}}>פעיל</span>
                  </td>
                  <td style={{display:'flex', gap:6}}>
                    <button className="hm-btn hm-btn-quiet" style={{padding:'5px 10px', fontSize:12}}>עריכה</button>
                    <button className="hm-icon-btn" style={{width:28, height:28}}>⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminProductEdit = () => {
  const p = window.HM_PRODUCTS[0];
  return (
    <div className="adm">
      <AdmSide active="prod"/>
      <div className="adm-main">
        <AdmTop crumb={`מוצרים › ${p.name}`}/>
        <div className="adm-page">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:18}}>
            <div>
              <div className="hm-meta" style={{fontFamily:'var(--mono)', letterSpacing:'0.16em', textTransform:'uppercase'}}>← חזרה למוצרים</div>
              <h1 style={{marginTop:4}}>עריכת מוצר</h1>
              <div className="sub">עודכן לאחרונה 11/05/2026 · אריאל ח׳</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="hm-btn hm-btn-quiet">תצוגה מקדימה</button>
              <button className="hm-btn hm-btn-quiet">שמור כטיוטה</button>
              <button className="hm-btn hm-btn-primary">פרסום</button>
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:14}}>
            <div style={{display:'grid', gap:14}}>
              <div className="adm-card">
                <h3 style={{fontFamily:'var(--serif)', fontSize:18, marginBottom:14}}>פרטים בסיסיים</h3>
                <div style={{display:'grid', gap:14}}>
                  <Field label="שם המוצר" value={p.name}/>
                  <Field label="תיאור קצר" value={p.sub}/>
                  <div className="hm-field">
                    <label>תיאור מלא</label>
                    <textarea className="hm-input" rows={4}
                      defaultValue="תיק גב יומיומי בנפח 18 ליטר, תפור מבד פוליאסטר ממוחזר עמיד למים. תא ראשי עם רוכסן YKK, כיס למחשב נייד עד 15.6 אינץ׳, ורצועות סגירת חזה מתכווננות."/>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                    <Field label="מק״ט" value="HM-BAG18L" mono/>
                    <Field label="ברקוד" value="7290017824391" mono/>
                  </div>
                </div>
              </div>

              <div className="adm-card">
                <h3 style={{fontFamily:'var(--serif)', fontSize:18, marginBottom:14}}>תמונות</h3>
                <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', gap:10}}>
                  {[0,1,2,3].map(i=>(
                    <div key={i} style={{
                      aspectRatio: i===0?'1.4/1':'1/1',
                      borderRadius:'var(--r-md)',
                      background:'var(--paper-2)',
                      border: i===0?'2px solid var(--olive)':'1px dashed var(--line-2)',
                      display:'grid', placeItems:'center',
                      fontFamily:'var(--mono)', fontSize:10, color:'var(--ink-3)',
                      letterSpacing:'0.14em', textTransform:'uppercase',
                      position:'relative'
                    }}>
                      {i<2 ? `IMG ·  0${i+1}` : i===2 ? '+ העלאה' : 'גרירה'}
                      {i===0 && <span style={{
                        position:'absolute', top:8, insetInlineStart:8,
                        fontSize:9, background:'var(--ink)', color:'var(--paper)',
                        padding:'2px 6px', borderRadius:'var(--r-pill)'
                      }}>ראשי</span>}
                    </div>
                  ))}
                </div>
                <div className="hm-meta" style={{marginTop:10, fontSize:11.5}}>
                  פורמט: JPG/PNG/WebP · גודל מקסימלי 5MB · רזולוציה מומלצת 2000×2000
                </div>
              </div>

              <div className="adm-card">
                <h3 style={{fontFamily:'var(--serif)', fontSize:18, marginBottom:14}}>וריאנטים</h3>
                <div style={{display:'grid', gap:8}}>
                  {[
                    ['אפור פחם · S', 'HM-BAG18L-CHA-S', 12, 24900],
                    ['אפור פחם · M', 'HM-BAG18L-CHA-M', 8,  24900],
                    ['חול · S',      'HM-BAG18L-SND-S', 3,  24900],
                    ['חול · M',      'HM-BAG18L-SND-M', 0,  24900],
                  ].map(([n,s,q,pr])=>(
                    <div key={s} style={{
                      display:'grid', gridTemplateColumns:'1.5fr 1.5fr auto auto auto',
                      gap:14, alignItems:'center',
                      padding:'10px 14px', background:'var(--paper-2)',
                      borderRadius:'var(--r-sm)'
                    }}>
                      <span style={{fontWeight:500}}>{n}</span>
                      <span className="mono" style={{fontSize:12, color:'var(--ink-3)'}}>{s}</span>
                      <span className="mono" style={{fontSize:12, color: q===0?'var(--terracotta)':'var(--ink)'}}>מלאי: {q}</span>
                      <span className="mono">₪{(pr/100).toFixed(2)}</span>
                      <button className="hm-icon-btn" style={{width:28, height:28}}>⋮</button>
                    </div>
                  ))}
                </div>
                <button className="hm-btn hm-btn-quiet" style={{marginTop:10}}>+ הוסף וריאנט</button>
              </div>
            </div>

            <div style={{display:'grid', gap:14, height:'fit-content'}}>
              <div className="adm-card">
                <div className="hm-label" style={{marginBottom:6}}>סטטוס</div>
                <div style={{display:'flex', gap:6, background:'var(--paper-2)', padding:4, borderRadius:'var(--r-pill)'}}>
                  {['פעיל','טיוטה','מוסתר'].map((s,i)=>(
                    <button key={s} style={{
                      flex:1, padding:'7px', fontSize:12, border:'none',
                      borderRadius:'var(--r-pill)',
                      background: i===0?'var(--card)':'transparent',
                      fontWeight: i===0?600:400,
                      boxShadow: i===0?'var(--shadow-1)':'none'
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="adm-card">
                <h3 style={{fontFamily:'var(--serif)', fontSize:17, marginBottom:12}}>תמחור</h3>
                <div style={{display:'grid', gap:12}}>
                  <Field label="מחיר (₪)" value="249.00" mono/>
                  <Field label="מחיר מבצע" value="211.65" mono/>
                  <Field label="עלות (₪)" value="98.40" mono/>
                  <div style={{display:'flex', justifyContent:'space-between', padding:'10px 12px', background:'var(--olive-soft)', borderRadius:'var(--r-sm)', fontSize:13}}>
                    <span>שולי רווח</span>
                    <span className="mono" style={{fontWeight:600, color:'var(--olive-2)'}}>54.1%</span>
                  </div>
                </div>
              </div>

              <div className="adm-card">
                <h3 style={{fontFamily:'var(--serif)', fontSize:17, marginBottom:12}}>ארגון</h3>
                <div style={{display:'grid', gap:12}}>
                  <Field label="קטגוריה" value="תיקים ואביזרים" select/>
                  <Field label="ספק" value="Studio Backline · ת״א" select/>
                  <div className="hm-field">
                    <label>תגיות</label>
                    <div style={{display:'flex', gap:6, flexWrap:'wrap', padding:8, border:'1px solid var(--line)', borderRadius:'var(--r-md)', background:'var(--card)'}}>
                      {['ממוחזר','עמיד-למים','עירוני'].map(t=>(
                        <span key={t} style={{
                          fontSize:12, padding:'3px 9px', background:'var(--paper-2)',
                          borderRadius:'var(--r-pill)', display:'flex', gap:6
                        }}>{t} <span style={{opacity:.5}}>×</span></span>
                      ))}
                      <span style={{fontSize:12, color:'var(--ink-3)', padding:'3px 4px'}}>+ הוסף</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AdminDashboard, AdminOrders, AdminOrderDetail, AdminProducts, AdminProductEdit });
