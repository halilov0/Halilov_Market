/* eslint-disable */
// System card: shows the visual vocabulary at a glance

const SystemCard = () => (
  <div className="hm" style={{padding:36, overflow:'auto'}}>
    <div className="hm-meta" style={{fontFamily:'var(--mono)', letterSpacing:'0.2em', color:'var(--terracotta)', textTransform:'uppercase'}}>מערכת עיצוב · v1</div>
    <h1 style={{fontSize:48, marginTop:8}}>חלילוב מרקט — שפה ויזואלית</h1>
    <p style={{color:'var(--ink-2)', marginTop:8, maxWidth:'68ch'}}>
      שוק ים-תיכוני אותנטי בכריכה דיגיטלית: נייר חם, דיו זית, ניחוח טרקוטה.
      טיפוגרפיה בעברית — כותרות בסריף ספרותי, גוף נקי וקריא, מספרים במונוספייס.
    </p>

    {/* COLOR */}
    <h2 style={{marginTop:36, marginBottom:14}}>פלטה</h2>
    <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12}}>
      {[
        ['Paper','#f6f0e4','var(--ink)'],
        ['Card','#fffbf3','var(--ink)'],
        ['Ink','#1a1612','#f6f0e4'],
        ['Olive','oklch(0.42 0.06 130)','#f6f0e4'],
        ['Terracotta','oklch(0.62 0.13 40)','#f6f0e4'],
        ['Gold','oklch(0.78 0.10 85)','var(--ink)'],
      ].map(([name,c,fg])=>(
        <div key={name} style={{
          aspectRatio:'1/1.05', borderRadius:'var(--r-lg)',
          background:c, color:fg, padding:14,
          border:'1px solid var(--line)',
          display:'flex', flexDirection:'column', justifyContent:'space-between'
        }}>
          <div style={{fontFamily:'var(--serif)', fontSize:22}}>{name}</div>
          <div style={{fontFamily:'var(--mono)', fontSize:11, opacity:.75}}>{c}</div>
        </div>
      ))}
    </div>

    {/* TYPE */}
    <h2 style={{marginTop:36, marginBottom:14}}>טיפוגרפיה</h2>
    <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20}}>
      <div style={{background:'var(--card)', border:'1px solid var(--line)', borderRadius:'var(--r-lg)', padding:24}}>
        <div className="hm-meta" style={{fontFamily:'var(--mono)', letterSpacing:'0.16em', textTransform:'uppercase'}}>Frank Ruhl Libre · כותרות</div>
        <div style={{fontFamily:'var(--serif)', fontSize:64, marginTop:8, lineHeight:1}}>כותרת ראשית.</div>
        <div style={{fontFamily:'var(--serif)', fontSize:32, marginTop:12, lineHeight:1.1}}>הטעם החדש של הקטלוג.</div>
        <div style={{fontFamily:'var(--serif)', fontSize:22, marginTop:8}}>כותרת קטגוריה</div>
      </div>
      <div style={{background:'var(--card)', border:'1px solid var(--line)', borderRadius:'var(--r-lg)', padding:24}}>
        <div className="hm-meta" style={{fontFamily:'var(--mono)', letterSpacing:'0.16em', textTransform:'uppercase'}}>Heebo · גוף</div>
        <p style={{marginTop:8, lineHeight:1.6}}>
          תיק גב יומיומי, 18 ליטר, תפור מבד ממוחזר עמיד למים.
          מתאים למחשב 15.6 אינץ′, גם למשרד וגם לטיולים קצרים.
        </p>
        <div style={{
          marginTop:14, paddingTop:14, borderTop:'1px solid var(--line)',
          display:'flex', justifyContent:'space-between'
        }}>
          <span className="hm-meta">SKU מספר</span>
          <span className="mono" style={{fontWeight:600}}>HM-24081-AB</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginTop:6}}>
          <span className="hm-meta">סך הכל</span>
          <span className="mono" style={{fontSize:22, fontWeight:600}}>₪147.50</span>
        </div>
      </div>
    </div>

    {/* COMPONENTS */}
    <h2 style={{marginTop:36, marginBottom:14}}>רכיבים</h2>
    <div style={{
      background:'var(--card)', border:'1px solid var(--line)',
      borderRadius:'var(--r-lg)', padding:24,
      display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24
    }}>
      <div>
        <div className="hm-label" style={{marginBottom:10}}>כפתורים</div>
        <div style={{display:'grid', gap:8, alignItems:'flex-start'}}>
          <button className="hm-btn hm-btn-primary">לקנות עכשיו</button>
          <button className="hm-btn hm-btn-ghost">חזרה לסל</button>
          <button className="hm-btn hm-btn-quiet">פעולה משנית</button>
        </div>
      </div>
      <div>
        <div className="hm-label" style={{marginBottom:10}}>תגיות</div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <span className="hm-badge hm-badge-leaf">אורגני</span>
          <span className="hm-badge hm-badge-sale">15%-</span>
          <span className="hm-badge hm-badge-gold">נבחר השף</span>
          <span className="hm-badge hm-badge-leaf">
            <span style={{width:6, height:6, borderRadius:'50%', background:'var(--leaf)'}}/>
            במלאי
          </span>
        </div>
        <div className="hm-label" style={{marginBottom:10, marginTop:18}}>צ׳יפים</div>
        <div className="hm-chips">
          <button className="hm-chip active">הכול</button>
          <button className="hm-chip">תיקים</button>
          <button className="hm-chip">אלקטרוניקה</button>
        </div>
      </div>
      <div>
        <div className="hm-label" style={{marginBottom:10}}>שדה</div>
        <div className="hm-field">
          <label>אימייל</label>
          <input className="hm-input" defaultValue="noa@halilov.co.il"/>
        </div>
        <div className="hm-label" style={{marginBottom:10, marginTop:18}}>סכום</div>
        <div style={{
          padding:14, borderRadius:'var(--r-md)', background:'var(--paper-2)',
          display:'flex', justifyContent:'space-between', alignItems:'baseline'
        }}>
          <span style={{fontFamily:'var(--serif)', fontSize:18}}>סך הכל</span>
          <span className="mono" style={{fontSize:24, fontWeight:600}}>₪147.50</span>
        </div>
      </div>
    </div>
  </div>
);

window.SystemCard = SystemCard;
