export function SummaryRow({ k, v, muted = false }: { k: string; v: string; muted?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      color: muted ? 'var(--ink-3)' : 'var(--ink)',
      fontSize: 14,
    }}>
      <span>{k}</span>
      <span className="mono">{v}</span>
    </div>
  )
}
