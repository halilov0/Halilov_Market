/* eslint-disable */
// ---- Page-level mockups for Halilov Market ----

const CatalogPage = () => {
  const PRODUCTS = window.HM_PRODUCTS;
  const CATEGORIES = window.HM_CATEGORIES;
  return (
    <div className="hm" style={{overflow:'auto'}}>
      <Header active="catalog" />
      <div className="hm-page">
        <Hero />

        <div className="hm-section-head">
          <div>
            <div className="label">קטלוג · אביב 2026</div>
            <h2 style={{marginTop:6}}>נבחר השבוע</h2>
          </div>
          <div className="hm-meta">מציג 124 מוצרים · ממוין לפי פופולריות</div>
        </div>

        <div style={{display:'flex', gap:16, alignItems:'center', marginBottom:18}}>
          <div className="hm-chips" style={{flex:1}}>
            {CATEGORIES.map((c,i)=>(
              <button key={c.id} className={`hm-chip ${i===0?'active':''}`}>{c.name}</button>
            ))}
          </div>
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            border:'1px solid var(--line)', borderRadius:'var(--r-pill)',
            padding:'8px 14px', background:'var(--card)', fontSize:13
          }}>
            <span style={{color:'var(--ink-3)'}}>מיון:</span>
            <strong>הכי פופולרי</strong>
            <Icon name="chev" size={14} />
          </div>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(4, 1fr)',
          gap:18
        }}>
          {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
        </div>

        {/* trust strip */}
        <div style={{
          marginTop:36, padding:'22px 28px',
          background:'var(--card)', border:'1px solid var(--line)',
          borderRadius:'var(--r-lg)',
          display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24
        }}>
          {[
            ['truck','משלוח באותו יום','הזמנה עד 11:00 — מגיע עד הערב.'],
            ['leaf','טריות מובטחת','החזר מלא אם לא מרוצים מהטריות.'],
            ['secure','תשלום מוגן','ב־PCI עם כרטיס, ביט או PayBox.'],
          ].map(([i,t,s])=>(
            <div key={i} style={{display:'flex', gap:14, alignItems:'flex-start'}}>
              <div style={{
                width:42, height:42, borderRadius:'50%',
                background:'var(--olive-soft)', color:'var(--olive-2)',
                display:'grid', placeItems:'center', flexShrink:0
              }}><Icon name={i} size={20} /></div>
              <div>
                <div style={{fontWeight:600, marginBottom:2}}>{t}</div>
                <div className="hm-meta">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const ProductPage = () => {
  const p = window.HM_PRODUCTS[0];
  return (
    <div className="hm" style={{overflow:'auto'}}>
      <Header active="catalog" />
      <div className="hm-page">
        <div className="hm-crumb">
          <span>קטלוג</span><span className="sep">›</span>
          <span>{p.cat}</span><span className="sep">›</span>
          <span style={{color:'var(--ink)'}}>{p.name}</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:36}}>
          {/* gallery */}
          <div>
            <div style={{
              aspectRatio:'1/1', borderRadius:'var(--r-xl)',
              background:'var(--card)', border:'1px solid var(--line)',
              position:'relative', overflow:'hidden',
              display:'grid', placeItems:'center'
            }}>
              <div style={{position:'absolute', inset:0,
                background:'repeating-linear-gradient(135deg, transparent 0 18px, rgba(26,22,18,.025) 18px 19px)'}}/>
              <span style={{fontFamily:'var(--mono)', fontSize:13, letterSpacing:'0.2em', color:'var(--ink-3)', background:'var(--paper)', padding:'10px 18px', border:'1px solid var(--line)', borderRadius:'var(--r-pill)', textTransform:'uppercase'}}>product photography</span>
              <span className="hm-badge hm-badge-gold" style={{position:'absolute', top:22, insetInlineStart:22}}>הבחירה שלנו</span>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginTop:12}}>
              {[0,1,2,3].map(i=>(
                <div key={i} style={{
                  aspectRatio:'1/1', borderRadius:'var(--r-md)',
                  background:'var(--card)',
                  border:`1px solid ${i===0?'var(--olive)':'var(--line)'}`,
                  display:'grid', placeItems:'center',
                  fontFamily:'var(--mono)', fontSize:11, color:'var(--ink-3)', opacity: i===0?1:.7, letterSpacing:'0.16em'
                }}>0{i+1}</div>
              ))}
            </div>
          </div>

          {/* info */}
          <div style={{display:'flex', flexDirection:'column', gap:18}}>
            <div>
              <div className="hm-meta" style={{textTransform:'uppercase', letterSpacing:'0.16em', color:'var(--terracotta)', fontFamily:'var(--mono)'}}>{p.cat} · {p.code}</div>
              <h1 style={{fontSize:46, marginTop:8}}>{p.name}</h1>
              <div style={{display:'flex', gap:8, alignItems:'center', marginTop:8}}>
                <div style={{display:'flex', gap:2}}>
                  {[0,0,0,0,1].map((_,i)=>(
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i<4?'var(--gold)':'none'} stroke="var(--gold)" strokeWidth="1.5">
                      <path d="m12 3 2.6 6 6.4.6-4.9 4.3 1.5 6.3L12 17l-5.6 3.2L8 14l-5-4.4 6.4-.6z"/>
                    </svg>
                  ))}
                </div>
                <span className="hm-meta">4.8 · 142 ביקורות</span>
                <span style={{color:'var(--line-2)'}}>|</span>
                <span className="hm-meta mono">SKU: HM-{p.code.replace(/[^A-Z0-9]/g,'')}-01</span>
              </div>
            </div>

            <p style={{color:'var(--ink-2)', lineHeight:1.65}}>
              תיק גב יומיומי בנפח 18 ליטר, תפור מבד פוליאסטר ממוחזר עמיד למים.
              תא ראשי עם רוכסן YKK, כיס למחשב נייד עד 15.6 אינץ׳, ורצועות
              סגירת חזה מתכווננות. צבע אפור פחם, מתאים גם לעיר וגם לטיולים קצרים.
            </p>

            <div style={{
              padding:'16px 18px', background:'var(--paper-2)',
              borderRadius:'var(--r-md)', display:'flex', justifyContent:'space-between', alignItems:'center'
            }}>
              <div>
                <div className="hm-meta">מחיר ליחידה</div>
                <div style={{display:'flex', alignItems:'baseline', gap:6, marginTop:4}}>
                  <span style={{fontFamily:'var(--mono)', fontSize:34, fontWeight:500}}>₪{(p.price/100).toFixed(2)}</span>
                  <span className="hm-meta">/ יחידה</span>
                </div>
              </div>
              <div style={{textAlign:'left'}}>
                <span className="hm-badge hm-badge-leaf">
                  <span style={{width:6, height:6, borderRadius:'50%', background:'var(--leaf)'}}/>
                  במלאי · 24 יח׳
                </span>
                <div className="hm-meta" style={{marginTop:6}}>משלוח חינם מעל ₪150</div>
              </div>
            </div>

            <div style={{display:'flex', gap:10, alignItems:'center'}}>
              <div style={{
                display:'flex', alignItems:'center',
                border:'1px solid var(--line)', borderRadius:'var(--r-pill)',
                background:'var(--card)', overflow:'hidden'
              }}>
                <button style={{width:42, height:44, background:'none', border:'none', cursor:'pointer'}}><Icon name="minus" size={16}/></button>
                <span className="mono" style={{padding:'0 14px', fontWeight:600}}>2</span>
                <button style={{width:42, height:44, background:'none', border:'none', cursor:'pointer'}}><Icon name="plus" size={16}/></button>
              </div>
              <button className="hm-btn hm-btn-primary hm-btn-lg" style={{flex:1}}>
                <Icon name="bag" size={16}/> הוספה לסל · ₪49.80
              </button>
              <button className="hm-icon-btn" style={{width:48, height:48}}><Icon name="heart"/></button>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10}}>
              {[
                ['truck','משלוח חינם','מעל ₪200 · עד 2 ימי עסקים'],
                ['leaf','החזרה חופשית','30 יום ללא שאלות'],
                ['secure','אחריות יצרן','שנתיים מלאות'],
              ].map(([i,t,s])=>(
                <div key={i} style={{
                  padding:12, borderRadius:'var(--r-md)',
                  background:'var(--card)', border:'1px solid var(--line)'
                }}>
                  <div style={{color:'var(--olive-2)', marginBottom:6}}><Icon name={i} size={18}/></div>
                  <div style={{fontWeight:600, fontSize:13}}>{t}</div>
                  <div className="hm-meta" style={{fontSize:11.5}}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const lines = window.HM_PRODUCTS.slice(0,3).map((p,i)=>({...p, qty:[2,1,3][i]}));
  const subtotal = lines.reduce((s,l)=>s+l.price*l.qty, 0);
  const shipping = 1990;
  const total = subtotal + shipping;
  return (
    <div className="hm" style={{overflow:'auto'}}>
      <Header active="catalog" />
      <div className="hm-page" style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:30}}>
        <div>
          <div className="hm-crumb">
            <span>קטלוג</span><span className="sep">›</span>
            <span style={{color:'var(--ink)'}}>סל קניות</span>
          </div>
          <h1 style={{fontSize:44}}>סל קניות</h1>
          <p className="hm-meta" style={{marginTop:8}}>{lines.length} פריטים · משלוח משוער בין 14.05–16.05</p>

          <div style={{display:'grid', gap:12, marginTop:24}}>
            {lines.map(l=>(
              <div key={l.id} style={{
                display:'grid', gridTemplateColumns:'80px 1fr auto auto',
                gap:18, alignItems:'center',
                padding:14, background:'var(--card)',
                border:'1px solid var(--line)', borderRadius:'var(--r-lg)'
              }}>
                <div style={{
                  width:80, height:80, borderRadius:'var(--r-md)',
                  background:'var(--paper-2)', display:'grid', placeItems:'center',
                  fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.14em', color:'var(--ink-3)', textAlign:'center', textTransform:'uppercase', padding:6
                }}>{l.code}</div>
                <div>
                  <div style={{fontFamily:'var(--serif)', fontSize:19}}>{l.name}</div>
                  <div className="hm-meta">{l.sub}</div>
                  <div style={{marginTop:6, display:'flex', gap:10, fontSize:12.5}}>
                    <span style={{color:'var(--ink-3)'}}>₪{(l.price/100).toFixed(2)} ליחידה</span>
                    <a style={{color:'var(--terracotta)', textDecoration:'underline'}}>הסר</a>
                  </div>
                </div>
                <div style={{
                  display:'flex', alignItems:'center',
                  border:'1px solid var(--line)', borderRadius:'var(--r-pill)',
                  background:'var(--paper)'
                }}>
                  <button style={{width:32, height:36, background:'none', border:'none'}}><Icon name="minus" size={14}/></button>
                  <span className="mono" style={{padding:'0 10px', fontWeight:600, minWidth:24, textAlign:'center'}}>{l.qty}</span>
                  <button style={{width:32, height:36, background:'none', border:'none'}}><Icon name="plus" size={14}/></button>
                </div>
                <div style={{fontFamily:'var(--mono)', fontSize:17, fontWeight:600, minWidth:90, textAlign:'left'}}>
                  ₪{(l.price*l.qty/100).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop:18, display:'flex', gap:12,
            padding:14, borderRadius:'var(--r-md)',
            background:'var(--olive-soft)', alignItems:'center'
          }}>
            <span style={{color:'var(--olive-2)'}}><Icon name="leaf" size={20}/></span>
            <div style={{flex:1, fontSize:13.5}}>
              עוד <strong>₪32.50</strong> ותקבלי משלוח חינם · מומלץ: מזרן יוגה.
            </div>
            <button className="hm-btn hm-btn-quiet">להוסיף</button>
          </div>
        </div>

        {/* summary */}
        <aside style={{
          position:'sticky', top:24, height:'fit-content',
          background:'var(--card)', border:'1px solid var(--line)',
          borderRadius:'var(--r-lg)', padding:24
        }}>
          <h3 style={{marginBottom:14}}>סיכום הזמנה</h3>
          <div style={{display:'grid', gap:8, fontSize:14}}>
            <Row k="סך ביניים" v={`₪${(subtotal/100).toFixed(2)}`}/>
            <Row k="משלוח" v={`₪${(shipping/100).toFixed(2)}`}/>
            <Row k='מע"מ (18%, כלול)' v={`₪${(total*0.18/1.18/100).toFixed(2)}`} muted/>
          </div>
          <hr className="hm-rule"/>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <span style={{fontWeight:600}}>סך הכל לתשלום</span>
            <span style={{fontFamily:'var(--mono)', fontSize:26, fontWeight:600}}>₪{(total/100).toFixed(2)}</span>
          </div>
          <button className="hm-btn hm-btn-primary hm-btn-lg" style={{width:'100%', justifyContent:'center', marginTop:14}}>
            למעבר לקופה <Icon name="chev" size={16}/>
          </button>
          <div style={{
            marginTop:14, display:'flex', alignItems:'center', gap:10,
            padding:'10px 12px', borderRadius:'var(--r-md)',
            background:'var(--paper-2)'
          }}>
            <Icon name="secure" size={16}/>
            <div style={{fontSize:12, color:'var(--ink-2)'}}>
              תשלום מאובטח · Visa · Mastercard · Bit · PayBox
            </div>
          </div>
          <div style={{marginTop:16}}>
            <div className="hm-label" style={{marginBottom:6}}>קוד הטבה</div>
            <div style={{display:'flex', gap:6}}>
              <input className="hm-input" defaultValue="SHUK20" style={{flex:1}} />
              <button className="hm-btn hm-btn-ghost">החל</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Row = ({k,v,muted}) => (
  <div style={{display:'flex', justifyContent:'space-between', color:muted?'var(--ink-3)':'var(--ink)'}}>
    <span>{k}</span><span className="mono">{v}</span>
  </div>
);

const CheckoutPage = () => (
  <div className="hm" style={{overflow:'auto'}}>
    <Header active="catalog" />
    <div className="hm-page" style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:30}}>
      <div>
        <div className="hm-crumb">
          <span>סל</span><span className="sep">›</span>
          <span style={{color:'var(--ink)'}}>קופה</span><span className="sep">›</span>
          <span>תשלום</span>
        </div>

        {/* stepper */}
        <div style={{display:'flex', alignItems:'center', gap:14, margin:'12px 0 22px'}}>
          {[['1','משלוח','done'],['2','תשלום','active'],['3','אישור','']].map(([n,t,s])=>(
            <React.Fragment key={n}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{
                  width:30, height:30, borderRadius:'50%',
                  background: s==='active'?'var(--ink)': s==='done'?'var(--olive)':'var(--card)',
                  color: s? 'var(--paper)':'var(--ink-3)',
                  border: s?'none':'1px solid var(--line)',
                  display:'grid', placeItems:'center', fontWeight:600, fontSize:13
                }}>{s==='done'?<Icon name="check" size={14}/>:n}</div>
                <span style={{fontSize:14, fontWeight: s?600:400, color: s?'var(--ink)':'var(--ink-3)'}}>{t}</span>
              </div>
              {n!=='3' && <div style={{flex:1, height:1, background:'var(--line)'}}/>}
            </React.Fragment>
          ))}
        </div>

        <h2 style={{marginBottom:18}}>פרטי משלוח</h2>

        <div style={{display:'grid', gap:14}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <Field label="שם מלא" value="נועה חליבוב"/>
            <Field label="טלפון" value="050-123-4567" mono/>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:12}}>
            <Field label="רחוב" value="הירקון"/>
            <Field label="מספר" value="148"/>
            <Field label="דירה" value="6"/>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:12}}>
            <Field label="עיר" value="תל אביב-יפו"/>
            <Field label="מיקוד" value="6340101" mono/>
          </div>
          <Field label="חלון משלוח" value="יום ה׳ 13.05 · 16:00–19:00" select/>
          <Field label="הערות לשליח" value="פעמון לא עובד — אנא צלצלו בנייד" rows/>
        </div>

        <div style={{
          marginTop:18, padding:14, background:'var(--olive-soft)',
          borderRadius:'var(--r-md)', display:'flex', gap:10, alignItems:'center'
        }}>
          <Icon name="truck" size={18}/>
          <div style={{fontSize:13.5}}>
            השליחה תיצור איתך קשר 30 דקות לפני הגעה.
          </div>
        </div>
      </div>

      <aside style={{
        background:'var(--card)', border:'1px solid var(--line)',
        borderRadius:'var(--r-lg)', padding:22, height:'fit-content'
      }}>
        <h3 style={{marginBottom:14}}>סיכום</h3>
        <div style={{display:'grid', gap:10}}>
          {window.HM_PRODUCTS.slice(0,3).map((p,i)=>(
            <div key={p.id} style={{display:'flex', gap:10, alignItems:'center'}}>
              <div style={{
                width:46, height:46, borderRadius:'var(--r-sm)',
                background:'var(--paper-2)', display:'grid', placeItems:'center',
                fontFamily:'var(--mono)', fontSize:10, color:'var(--ink-3)', opacity:.7, letterSpacing:'0.12em', textAlign:'center', textTransform:'uppercase', padding:4
              }}>{p.code.split(' ')[0]}</div>
              <div style={{flex:1, fontSize:13}}>
                <div style={{fontWeight:500}}>{p.name}</div>
                <div className="hm-meta" style={{fontSize:11.5}}>× {[2,1,3][i]}</div>
              </div>
              <div className="mono" style={{fontSize:13}}>₪{(p.price*[2,1,3][i]/100).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <hr className="hm-rule"/>
        <Row k="סך ביניים" v="₪127.60"/>
        <Row k="משלוח" v="₪19.90"/>
        <Row k='מע"מ (18%)' v="₪22.50" muted/>
        <hr className="hm-rule"/>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:6}}>
          <span style={{fontWeight:600}}>סך הכל</span>
          <span style={{fontFamily:'var(--mono)', fontSize:24, fontWeight:600}}>₪147.50</span>
        </div>
        <button className="hm-btn hm-btn-primary hm-btn-lg" style={{width:'100%', justifyContent:'center', marginTop:14}}>
          המשך לתשלום
        </button>
        <div className="hm-meta" style={{marginTop:10, textAlign:'center', fontSize:11.5}}>
          לחיצה על "המשך" מהווה הסכמה ל<u>תקנון</u> ו<u>מדיניות הפרטיות</u>.
        </div>
      </aside>
    </div>
  </div>
);

const Field = ({label, value, mono, rows, select}) => (
  <div className="hm-field">
    <label>{label}</label>
    {rows ? (
      <textarea className="hm-input" rows={2} defaultValue={value} />
    ) : (
      <div className="hm-input" style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        fontFamily: mono?'var(--mono)':'inherit'
      }}>
        <span>{value}</span>
        {select && <Icon name="chev" size={14}/>}
      </div>
    )}
  </div>
);

const AuthPage = () => (
  <div className="hm" style={{overflow:'auto'}}>
    <Header user={false} />
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'calc(100% - 75px)'}}>
      <div style={{
        padding:'56px 64px', display:'flex', flexDirection:'column', justifyContent:'center'
      }}>
        <div className="hm-meta" style={{fontFamily:'var(--mono)', letterSpacing:'0.18em', color:'var(--terracotta)', textTransform:'uppercase'}}>ברוכים הבאים</div>
        <h1 style={{fontSize:54, marginTop:10}}>להתחבר לחשבון.</h1>
        <p style={{color:'var(--ink-2)', marginTop:14, lineHeight:1.6, maxWidth:'42ch'}}>
          שמרו מוצרים במועדפים, עקבו אחרי ההזמנות שלכם, וקבלו התראה כשהמוצר חוזר
          למלאי — הכל במקום אחד.
        </p>

        <div style={{maxWidth:380, marginTop:30, display:'grid', gap:14}}>
          <Field label="אימייל" value="noa@halilov.co.il"/>
          <div>
            <Field label="סיסמה" value="••••••••••" mono/>
            <div style={{textAlign:'left', marginTop:6}}>
              <a style={{fontSize:12.5, color:'var(--ink-3)', textDecoration:'underline'}}>שכחתי סיסמה</a>
            </div>
          </div>
          <button className="hm-btn hm-btn-primary hm-btn-lg" style={{justifyContent:'center'}}>
            כניסה לחשבון
          </button>
          <div style={{
            display:'flex', alignItems:'center', gap:12,
            color:'var(--ink-3)', fontSize:12, margin:'4px 0'
          }}>
            <div style={{flex:1, height:1, background:'var(--line)'}}/>
            <span>או</span>
            <div style={{flex:1, height:1, background:'var(--line)'}}/>
          </div>
          <button className="hm-btn hm-btn-quiet" style={{justifyContent:'center'}}>
            כניסה עם Google
          </button>
          <p className="hm-meta" style={{textAlign:'center', marginTop:6}}>
            חדש אצלנו? <a style={{color:'var(--terracotta)', textDecoration:'underline'}}>פתחי חשבון</a>
          </p>
        </div>
      </div>

      <div style={{
        background:'var(--olive)', color:'var(--paper)',
        padding:'56px 64px', position:'relative', overflow:'hidden',
        display:'flex', flexDirection:'column', justifyContent:'flex-end'
      }}>
        <div style={{position:'absolute', inset:0, opacity:.35,
          background: `radial-gradient(circle at 25% 35%, oklch(0.7 0.12 85) 0 22%, transparent 23%),
                       radial-gradient(circle at 75% 70%, oklch(0.6 0.13 40) 0 16%, transparent 17%),
                       radial-gradient(circle at 35% 80%, oklch(0.55 0.13 25) 0 12%, transparent 13%)`,
          filter:'blur(2px)'
        }}/>
        <div style={{position:'relative'}}>
          <div className="hm-meta" style={{fontFamily:'var(--mono)', color:'oklch(0.82 0.04 85)', letterSpacing:'0.18em', textTransform:'uppercase'}}>קהילת הלקוחות</div>
          <div style={{fontFamily:'var(--serif)', fontSize:42, lineHeight:1.1, marginTop:14, color:'var(--paper)'}}>
            "האתר ההוא נקי, נדיב, והמשלוחים מגיעים מהר."
          </div>
          <div style={{marginTop:18, fontSize:14, opacity:.85}}>— מירה ר., לקוחה מאז 2019</div>
        </div>
      </div>
    </div>
  </div>
);

const ConfirmationPage = () => (
  <div className="hm" style={{overflow:'auto'}}>
    <Header />
    <div className="hm-page-narrow">
      <div style={{textAlign:'center', marginBottom:30}}>
        <div style={{
          width:72, height:72, borderRadius:'50%',
          background:'var(--olive-soft)', color:'var(--olive-2)',
          display:'grid', placeItems:'center', margin:'0 auto 18px'
        }}><Icon name="check" size={32} stroke={2.4}/></div>
        <div className="hm-meta" style={{fontFamily:'var(--mono)', letterSpacing:'0.18em', color:'var(--terracotta)', textTransform:'uppercase'}}>הזמנה התקבלה</div>
        <h1 style={{fontSize:42, marginTop:10}}>תודה, נועה ✿</h1>
        <p style={{color:'var(--ink-2)', marginTop:8}}>
          הזמנה <span className="mono" style={{color:'var(--ink)'}}>#HLV-24081</span> · נשלחה אישור אל noa@halilov.co.il
        </p>
      </div>

      <div style={{
        background:'var(--card)', border:'1px solid var(--line)',
        borderRadius:'var(--r-lg)', padding:24
      }}>
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          paddingBottom:16, borderBottom:'1px solid var(--line)'
        }}>
          <div>
            <h3>תאריך משלוח</h3>
            <div style={{color:'var(--ink-2)', marginTop:4}}>יום חמישי · 13 מאי 2026 · 16:00–19:00</div>
          </div>
          <div className="hm-badge hm-badge-leaf">
            <span style={{width:6, height:6, borderRadius:'50%', background:'var(--leaf)'}}/>
            שולמה
          </div>
        </div>

        <div style={{display:'grid', gap:14, marginTop:18}}>
          {window.HM_PRODUCTS.slice(0,3).map((p,i)=>(
            <div key={p.id} style={{display:'flex', gap:14, alignItems:'center'}}>
              <div style={{
                width:54, height:54, borderRadius:'var(--r-md)',
                background:'var(--paper-2)', display:'grid', placeItems:'center',
                fontFamily:'var(--mono)', fontSize:11, color:'var(--ink-3)', opacity:.7, letterSpacing:'0.14em', textAlign:'center', textTransform:'uppercase', padding:4
              }}>{p.code.split(' ')[0]}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:'var(--serif)', fontSize:17}}>{p.name}</div>
                <div className="hm-meta">{p.sub} · × {[2,1,3][i]}</div>
              </div>
              <div className="mono" style={{fontWeight:600}}>₪{(p.price*[2,1,3][i]/100).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <hr className="hm-rule"/>
        <Row k="סך ביניים" v="₪127.60"/>
        <Row k="משלוח" v="₪19.90"/>
        <Row k='מע"מ (18%, כלול)' v="₪22.50" muted/>
        <div style={{display:'flex', justifyContent:'space-between', marginTop:10, paddingTop:10, borderTop:'1px solid var(--line)'}}>
          <strong>סך הכל</strong>
          <strong className="mono" style={{fontSize:22}}>₪147.50</strong>
        </div>
      </div>

      <div style={{
        marginTop:18, padding:20, borderRadius:'var(--r-lg)',
        background:'var(--card)', border:'1px solid var(--line)',
        display:'flex', gap:16, alignItems:'flex-start'
      }}>
        <div style={{
          width:42, height:42, borderRadius:'50%',
          background:'var(--terra-soft)', color:'var(--terracotta)',
          display:'grid', placeItems:'center', flexShrink:0
        }}><Icon name="truck" size={20}/></div>
        <div style={{flex:1}}>
          <h4 style={{marginBottom:4}}>מסלול המשלוח</h4>
          <div className="hm-meta">
            רחוב הירקון 148, דירה 6, תל אביב-יפו · השליחה תיצור איתך קשר 30 דק׳ לפני הגעה.
          </div>
        </div>
        <button className="hm-btn hm-btn-ghost">עקוב</button>
      </div>

      <div style={{display:'flex', gap:10, marginTop:24, justifyContent:'center'}}>
        <button className="hm-btn hm-btn-primary">המשך קניות</button>
        <button className="hm-btn hm-btn-quiet">הורד חשבונית</button>
      </div>
    </div>
  </div>
);

Object.assign(window, { CatalogPage, ProductPage, CartPage, CheckoutPage, AuthPage, ConfirmationPage, Row, Field });
