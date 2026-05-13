import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <div className="hm-hero">
      <div>
        <div className="kicker">קטלוג · 2026</div>
        <h1>כל מה שמסביב,<br />במקום אחד.</h1>
        <p className="lede">
          סופר ישראלי און-ליין — מצרכי בית, מזון ומשקאות. הזמנה מהירה,
          משלוח ביום העסקים הבא לדלת.
        </p>
        <div className="cta-row">
          <Link to="/" className="cta-primary">לקטלוג המלא ↗</Link>
          <a className="cta-ghost" onClick={(e) => { e.preventDefault() }}>מה חדש השבוע</a>
        </div>
      </div>
      <div className="art">
        <div className="stamp">EST · 2026</div>
      </div>
    </div>
  )
}
