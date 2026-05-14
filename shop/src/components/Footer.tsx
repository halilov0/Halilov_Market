import { Link } from 'react-router-dom'
import { comingSoon } from './Toast'

export function Footer() {
  return (
    <footer className="cls-footer">
      <div className="cls-footer-inner">
        <div className="col brand-col">
          <div className="cls-logo">
            <span className="mark">ח</span>
            <span>
              חלילוב מרקט
              <span className="sub">כל מה שצריך · במקום אחד</span>
            </span>
          </div>
          <p>
            מרקט אונליין ישראלי. אלפי מוצרים, משלוח לכל הארץ,
            ושירות לקוחות שעובד גם בערב.
          </p>
          <div className="socials">
            <a onClick={() => comingSoon('Instagram')} aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a onClick={() => comingSoon('Facebook')} aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8h-2a2 2 0 0 0-2 2v12M9 13h6" />
              </svg>
            </a>
            <a onClick={() => comingSoon('WhatsApp')} aria-label="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.7-5A8 8 0 1 1 8 19z" />
                <path d="M9 10c.5 2 2 3.5 4 4l1-1 3 1v3a8 8 0 0 1-9-9z" />
              </svg>
            </a>
            <a onClick={() => comingSoon('TikTok')} aria-label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4c0 3 2 5 5 5" />
              </svg>
            </a>
          </div>
        </div>

        <div className="col">
          <h4>קנייה</h4>
          <Link to="/">קטלוג</Link>
          <a onClick={() => comingSoon('מבצעים חמים')}>מבצעים חמים</a>
          <a onClick={() => comingSoon('חדש בקטלוג')}>חדש בקטלוג</a>
          <a onClick={() => comingSoon('מועדפים')}>מועדפים</a>
          <a onClick={() => comingSoon('מותגים')}>מותגים</a>
        </div>

        <div className="col">
          <h4>שירות</h4>
          <a onClick={() => comingSoon('משלוחים')}>משלוחים</a>
          <a onClick={() => comingSoon('החזרות')}>החזרות וזיכויים</a>
          <a onClick={() => comingSoon('מעקב הזמנה')}>מעקב הזמנה</a>
          <a onClick={() => comingSoon('שאלות נפוצות')}>שאלות נפוצות</a>
          <a onClick={() => comingSoon('צור קשר')}>צור קשר</a>
        </div>

        <div className="col">
          <h4>חשבון</h4>
          <Link to="/login">התחברות</Link>
          <Link to="/register">פתיחת חשבון</Link>
          <Link to="/cart">סל קניות</Link>
          <a onClick={() => comingSoon('ההזמנות שלי')}>ההזמנות שלי</a>
        </div>

        <div className="col">
          <h4>על חלילוב</h4>
          <a onClick={() => comingSoon('עלינו')}>עלינו</a>
          <a onClick={() => comingSoon('קריירה')}>קריירה</a>
          <a onClick={() => comingSoon('עיתונות')}>עיתונות</a>
          <a onClick={() => comingSoon('תנאי שימוש')}>תנאי שימוש</a>
          <a onClick={() => comingSoon('פרטיות')}>פרטיות</a>
        </div>
      </div>

      <div className="cls-footer-bottom">
        <span>© {new Date().getFullYear()} חלילוב מרקט. כל הזכויות שמורות.</span>
        <div className="pays">
          <span className="pay-chip">VISA</span>
          <span className="pay-chip">MASTERCARD</span>
          <span className="pay-chip">AMEX</span>
          <span className="pay-chip">PAYPAL</span>
          <span className="pay-chip">BIT</span>
        </div>
      </div>
    </footer>
  )
}
