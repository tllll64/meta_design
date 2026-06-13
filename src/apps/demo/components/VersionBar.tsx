import { useState } from 'react'
import { useWorkspaceStore, type DesignVersion } from '@/lib/workspaceStore'

const S = {
  border: 'oklch(0.82 0.004 260)',
  borderStrong: 'oklch(0.12 0.005 260)',
  text: 'oklch(0.12 0.005 260)',
  textMid: 'oklch(0.38 0.005 260)',
  textDim: 'oklch(0.58 0.004 260)',
  surface: 'oklch(0.965 0.002 260)',
  bg: 'oklch(0.99 0.001 260)',
  activeBg: 'oklch(0.14 0.005 260)',
  activeText: 'oklch(0.97 0.002 260)',
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  if (isToday) return `${hh}:${mm}`
  const mo = (d.getMonth() + 1).toString().padStart(2, '0')
  const dd = d.getDate().toString().padStart(2, '0')
  return `${mo}/${dd} ${hh}:${mm}`
}

function VersionChip({ version, isActive, onClick }: {
  version: DesignVersion
  isActive: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={version.taskGoal}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1,
        padding: '4px 8px',
        flexShrink: 0,
        border: `1px solid ${isActive ? S.borderStrong : hovered ? S.textMid : S.border}`,
        borderRadius: 2,
        background: isActive ? S.activeBg : hovered ? S.surface : 'transparent',
        cursor: 'pointer',
        transition: 'border-color 0.1s, background 0.1s',
      }}
    >
      <span style={{
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.06em',
        color: isActive ? S.activeText : S.textMid,
        lineHeight: 1.2,
      }}>
        {version.label}
      </span>
      <span style={{
        fontSize: 9,
        color: isActive ? 'oklch(0.72 0.003 260)' : S.textDim,
        lineHeight: 1.2,
        letterSpacing: '0.03em',
      }}>
        {formatTime(version.createdAt)}
      </span>
    </button>
  )
}

export default function VersionBar() {
  const { versions, activeVersionId, restoreVersion } = useWorkspaceStore()

  if (versions.length === 0) return null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '0 12px',
      height: 36,
      flexShrink: 0,
      borderBottom: `1px solid ${S.border}`,
      background: S.bg,
      overflowX: 'auto',
      scrollbarWidth: 'none',
    }}>
      <span style={{
        fontSize: 9, fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: S.textDim,
        flexShrink: 0,
        marginRight: 10,
      }}>
        历史
      </span>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {versions.map(v => (
          <VersionChip
            key={v.id}
            version={v}
            isActive={v.id === activeVersionId}
            onClick={() => restoreVersion(v.id)}
          />
        ))}
      </div>
    </div>
  )
}
