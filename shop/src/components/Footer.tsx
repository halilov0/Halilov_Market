import { comingSoon } from './Toast'

export function Footer() {
  return (
    <footer className="hm-footer">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span className="brand">חלילוב מרקט</span>
        <span style={{ opacity: .6, fontSize: 12 }}>· נוסד 2026</span>
      </div>
      <div className="links">
        <a onClick={() => comingSoon('משלוחים')}>משלוחים</a>
        <a onClick={() => comingSoon('החזרות')}>החזרות</a>
        <a onClick={() => comingSoon('צור קשר')}>צור קשר</a>
        <a onClick={() => comingSoon('תנאים')}>תנאים</a>
      </div>
    </footer>
  )
}
