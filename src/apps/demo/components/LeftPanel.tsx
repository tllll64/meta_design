import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useWorkspaceStore } from '@/lib/workspaceStore'
import { cn } from '@/lib/utils'

const S = {
  bg: 'oklch(0.99 0.001 260)',
  border: 'oklch(0.82 0.004 260)',
  borderFocus: 'oklch(0.12 0.005 260)',
  text: 'oklch(0.12 0.005 260)',
  textMid: 'oklch(0.38 0.005 260)',
  textDim: 'oklch(0.58 0.004 260)',
  surface: 'oklch(0.965 0.002 260)',
  accent: 'oklch(0.52 0.18 55)',
  accentBg: 'oklch(0.97 0.04 55)',
}

function Section({ title, children, highlight }: { title: string; children: React.ReactNode; highlight?: boolean }) {
  const [open, setOpen] = useState(true)
  return (
    <div
      style={{
        borderBottom: `1px solid ${S.border}`,
        outline: highlight ? `2px solid ${S.accent}` : 'none',
        outlineOffset: -1,
        transition: 'outline 0.3s',
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          color: S.textDim,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = S.text)}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = S.textDim)}
      >
        {title}
        {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>
      {open && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const inputStyle = {
    width: '100%',
    padding: '6px 10px',
    fontSize: 12,
    fontFamily: 'inherit',
    color: S.text,
    background: focused ? S.bg : S.surface,
    border: `1px solid ${focused ? S.borderFocus : S.border}`,
    borderRadius: 3,
    outline: 'none',
    resize: 'none' as const,
    transition: 'border-color 0.12s, background 0.12s',
  }
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: S.textDim, marginBottom: 4, letterSpacing: '0.04em' }}>{label}</div>
      {multiline ? (
        <textarea
          value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2}
          style={inputStyle} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={inputStyle} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      )}
    </div>
  )
}

function KeywordTag({ word, onRemove }: { word: string; onRemove: () => void }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', fontSize: 11, fontWeight: 500,
      border: `1px solid ${S.border}`, borderRadius: 2,
      background: S.surface, color: S.textMid,
    }}>
      {word}
      <button onClick={onRemove} style={{ display: 'flex', color: S.textDim, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <X size={9} />
      </button>
    </span>
  )
}

export default function LeftPanel() {
  const { metaSpace, updateTask, updateStyle, addPrinciple, removePrinciple, newPrincipleId } = useWorkspaceStore()
  const [newKeyword, setNewKeyword] = useState('')
  const [newPrinciple, setNewPrinciple] = useState('')
  const [kwFocused, setKwFocused] = useState(false)
  const [prFocused, setPrFocused] = useState(false)

  const handleAddKeyword = () => {
    const w = newKeyword.trim(); if (!w) return
    updateStyle({ keywords: [...metaSpace.style.keywords, w] }); setNewKeyword('')
  }
  const handleAddPrinciple = () => {
    const c = newPrinciple.trim(); if (!c) return
    addPrinciple(c, 'manual'); setNewPrinciple('')
  }

  const inputBase = (focused: boolean) => ({
    flex: 1, padding: '6px 10px', fontSize: 12, fontFamily: 'inherit',
    color: S.text, background: focused ? S.bg : S.surface,
    border: `1px solid ${focused ? S.borderFocus : S.border}`,
    borderRadius: 3, outline: 'none', transition: 'border-color 0.12s, background 0.12s',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: S.bg, color: S.text }}>
      <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${S.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.textDim }}>元设计空间</div>
      </div>

      <Section title="① 任务目标">
        <Field label="任务目标" value={metaSpace.task.goal} onChange={v => updateTask({ goal: v })} placeholder="这次设计为什么做" multiline />
        <Field label="目标受众" value={metaSpace.task.audience} onChange={v => updateTask({ audience: v })} placeholder="谁会看这个设计" />
        <Field label="渠道 / 平台" value={metaSpace.task.channel} onChange={v => updateTask({ channel: v })} placeholder="微信、H5、海报…" />
        <Field label="交付约束" value={metaSpace.task.constraints} onChange={v => updateTask({ constraints: v })} placeholder="尺寸、格式、颜色限制…" />
      </Section>

      <Section title="④ 视觉风格">
        <div style={{ fontSize: 10, color: S.textDim, marginBottom: 6, letterSpacing: '0.04em' }}>风格关键词</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
          {metaSpace.style.keywords.map((w, i) => (
            <KeywordTag key={i} word={w} onRemove={() => updateStyle({ keywords: metaSpace.style.keywords.filter((_, j) => j !== i) })} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <input value={newKeyword} onChange={e => setNewKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddKeyword()}
            onFocus={() => setKwFocused(true)} onBlur={() => setKwFocused(false)}
            placeholder="关键词后回车" style={inputBase(kwFocused)}
          />
          <button onClick={handleAddKeyword} style={{
            padding: '6px 10px', fontSize: 11, background: 'none',
            border: `1px solid ${S.border}`, borderRadius: 3, color: S.textMid, cursor: 'pointer',
          }}>
            <Plus size={12} />
          </button>
        </div>
        <Field label="主视觉方向" value={metaSpace.style.colorDirection} onChange={v => updateStyle({ colorDirection: v })} placeholder="深色背景、高对比、克制用色…" />
      </Section>

      <Section title="⑤ 设计原则" highlight={!!newPrincipleId}>
        <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {metaSpace.principles.length === 0 && (
            <div style={{
              padding: '12px 12px', fontSize: 11, color: S.textDim,
              border: `1px dashed ${S.border}`, borderRadius: 3, lineHeight: 1.5,
            }}>
              在对话中表达稳定意图，或在下方手动添加原则
            </div>
          )}
          {metaSpace.principles.map(p => (
            <div
              key={p.id}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '8px 10px', fontSize: 12, lineHeight: 1.55,
                border: `1px solid ${p.id === newPrincipleId ? S.accent : S.border}`,
                borderRadius: 3,
                background: p.id === newPrincipleId ? S.accentBg : S.surface,
                transition: 'border-color 0.4s, background 0.4s',
                color: S.text,
              }}
            >
              <div style={{ flex: 1 }}>{p.content}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                {p.source === 'extracted' && (
                  <span style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.06em',
                    padding: '1px 5px', border: `1px solid ${S.accent}`,
                    borderRadius: 2, color: S.accent,
                  }}>
                    AI
                  </span>
                )}
                <button
                  onClick={() => removePrinciple(p.id)}
                  style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: S.textDim, padding: 0 }}
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input value={newPrinciple} onChange={e => setNewPrinciple(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddPrinciple()}
            onFocus={() => setPrFocused(true)} onBlur={() => setPrFocused(false)}
            placeholder="手动添加设计原则…" style={inputBase(prFocused)}
          />
          <button onClick={handleAddPrinciple} style={{
            padding: '6px 10px', fontSize: 11, background: 'none',
            border: `1px solid ${S.border}`, borderRadius: 3, color: S.textMid, cursor: 'pointer',
          }}>
            <Plus size={12} />
          </button>
        </div>
      </Section>
    </div>
  )
}
