import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import {
  useGlobalMetaStore,
  type GlobalPrinciple,
  type GlobalStylePreset,
  type GlobalLayoutPreset,
  type GlobalSpec,
} from '@/lib/globalMetaStore'

const S = {
  bg: 'oklch(0.985 0.002 260)',
  bgPage: 'oklch(0.97 0.002 260)',
  border: 'oklch(0.82 0.004 260)',
  borderStrong: 'oklch(0.12 0.005 260)',
  text: 'oklch(0.12 0.005 260)',
  textMid: 'oklch(0.38 0.005 260)',
  textDim: 'oklch(0.58 0.004 260)',
  surface: 'oklch(0.99 0.001 260)',
  accent: 'oklch(0.52 0.18 55)',
  accentBg: 'oklch(0.97 0.04 55)',
}

// ─── Shared input styles ──────────────────────────────────────────────────────

function useInputStyle(focused: boolean) {
  return {
    width: '100%', padding: '7px 10px', fontSize: 12, fontFamily: 'inherit',
    color: S.text, lineHeight: 1.5,
    background: focused ? S.surface : S.bg,
    border: `1px solid ${focused ? S.borderStrong : S.border}`,
    borderRadius: 3, outline: 'none',
    transition: 'border-color 0.12s, background 0.12s',
    boxSizing: 'border-box' as const,
  }
}

function EmptyState({ label, action }: { label: string; action?: string }) {
  return (
    <div style={{
      padding: '24px 16px', textAlign: 'center',
      border: `1px dashed ${S.border}`, borderRadius: 3,
    }}>
      <p style={{ fontSize: 12, color: S.textDim, margin: '0 0 4px' }}>{label}</p>
      {action && <p style={{ fontSize: 11, color: S.textDim, margin: 0, opacity: 0.7 }}>{action}</p>}
    </div>
  )
}

// ─── Design Principles ────────────────────────────────────────────────────────

function PrincipleRow({ p }: { p: GlobalPrinciple }) {
  const { removePrinciple, updatePrinciple } = useGlobalMetaStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(p.content)
  const [scope, setScope] = useState(p.scope)
  const [focused, setFocused] = useState(false)

  const save = () => {
    if (draft.trim()) updatePrinciple(p.id, { content: draft.trim(), scope: scope.trim() })
    setEditing(false)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 12px',
      border: `1px solid ${S.border}`, borderRadius: 3, background: S.surface,
    }}>
      {editing ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <textarea
            autoFocus value={draft} onChange={e => setDraft(e.target.value)}
            rows={2}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ ...useInputStyle(focused), resize: 'none' as const }}
          />
          <input
            value={scope} onChange={e => setScope(e.target.value)}
            placeholder="适用范围（如：信息设计通用 / 品牌合规）"
            style={useInputStyle(false)}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={save} style={{ padding: '4px 10px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: S.borderStrong, color: S.surface, border: 'none', borderRadius: 2 }}>保存</button>
            <button onClick={() => setEditing(false)} style={{ padding: '4px 10px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 2 }}>取消</button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, cursor: 'text' }} onDoubleClick={() => setEditing(true)}>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: S.text }}>{p.content}</div>
          {p.scope && (
            <div style={{ fontSize: 10, color: S.textDim, marginTop: 3, letterSpacing: '0.04em' }}>{p.scope}</div>
          )}
        </div>
      )}
      {!editing && (
        <button
          onClick={() => removePrinciple(p.id)}
          style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: S.textDim, padding: 2, flexShrink: 0, opacity: 0.5 }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.5')}
        >
          <X size={11} />
        </button>
      )}
    </div>
  )
}

function PrinciplesSection() {
  const { principles, addPrinciple } = useGlobalMetaStore()
  const [content, setContent] = useState('')
  const [scope, setScope] = useState('')
  const [cf, setCf] = useState(false)
  const [sf, setSf] = useState(false)

  const handleAdd = () => {
    if (!content.trim()) return
    addPrinciple(content.trim(), scope.trim())
    setContent(''); setScope('')
  }

  return (
    <div>
      <div style={{ fontSize: 11, color: S.textDim, lineHeight: 1.6, marginBottom: 16, maxWidth: '60ch' }}>
        跨项目复用的高层判断标准。双击条目可编辑，在此沉淀的原则可在进入工作台时注入生成上下文。
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {principles.length === 0 && (
          <EmptyState label="还没有设计原则" action="添加你认为应该在所有项目中遵守的判断标准" />
        )}
        {principles.map(p => <PrincipleRow key={p.id} p={p} />)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 3 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.textDim, marginBottom: 2 }}>添加原则</div>
        <textarea
          value={content} onChange={e => setContent(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleAdd() }}
          onFocus={() => setCf(true)} onBlur={() => setCf(false)}
          placeholder="如：主标题始终占据视觉最高权重，不可被任何装饰元素遮挡"
          rows={2}
          style={{ ...useInputStyle(cf), resize: 'none' as const }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={scope} onChange={e => setScope(e.target.value)}
            onFocus={() => setSf(true)} onBlur={() => setSf(false)}
            placeholder="适用范围（可选）"
            style={{ ...useInputStyle(sf), flex: 1 }}
          />
          <button
            onClick={handleAdd} disabled={!content.trim()}
            style={{
              padding: '7px 14px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
              cursor: content.trim() ? 'pointer' : 'not-allowed',
              background: content.trim() ? S.borderStrong : S.border,
              color: content.trim() ? S.surface : S.textDim,
              border: 'none', borderRadius: 3, flexShrink: 0,
            }}
          >
            添加
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Style Presets ────────────────────────────────────────────────────────────

function StylePresetCard({ p }: { p: GlobalStylePreset }) {
  const { removeStylePreset } = useGlobalMetaStore()
  return (
    <div style={{ padding: '12px 14px', border: `1px solid ${S.border}`, borderRadius: 3, background: S.surface, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>{p.name}</div>
          {p.description && <div style={{ fontSize: 11, color: S.textDim, marginTop: 2, lineHeight: 1.4 }}>{p.description}</div>}
        </div>
        <button onClick={() => removeStylePreset(p.id)} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: S.textDim, padding: 2, flexShrink: 0, opacity: 0.5 }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.5')}
        >
          <X size={11} />
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: p.colorDirection ? 8 : 0 }}>
        {p.keywords.map((kw, i) => (
          <span key={i} style={{ fontSize: 10, padding: '2px 7px', border: `1px solid ${S.border}`, borderRadius: 2, color: S.textMid, background: S.bg }}>
            {kw}
          </span>
        ))}
      </div>
      {p.colorDirection && (
        <div style={{ fontSize: 11, color: S.textDim, lineHeight: 1.4 }}>{p.colorDirection}</div>
      )}
    </div>
  )
}

function StylePresetsSection() {
  const { stylePresets, addStylePreset } = useGlobalMetaStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [kwInput, setKwInput] = useState('')
  const [kws, setKws] = useState<string[]>([])
  const [colorDir, setColorDir] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    addStylePreset(name.trim(), desc.trim(), kws, colorDir.trim())
    setName(''); setDesc(''); setKws([]); setKwInput(''); setColorDir(''); setOpen(false)
  }
  const addKw = () => {
    const w = kwInput.trim(); if (!w) return
    setKws(prev => [...prev, w]); setKwInput('')
  }

  return (
    <div>
      <div style={{ fontSize: 11, color: S.textDim, lineHeight: 1.6, marginBottom: 16, maxWidth: '60ch' }}>
        可复用的视觉风格包：关键词组合 + 主视觉方向。在工作台资产库中可一键注入到当前项目。
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10, marginBottom: 16 }}>
        {stylePresets.length === 0 && <EmptyState label="还没有风格预设" action="添加你常用的视觉风格包" />}
        {stylePresets.map(p => <StylePresetCard key={p.id} p={p} />)}
      </div>

      {!open ? (
        <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', border: `1px solid ${S.border}`, borderRadius: 3, color: S.textMid }}>
          <Plus size={12} />新建风格预设
        </button>
      ) : (
        <div style={{ padding: 14, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.textDim }}>新建风格预设</div>
          {[
            { label: '预设名称', val: name, set: setName, ph: '如：极简线条风' },
            { label: '描述（可选）', val: desc, set: setDesc, ph: '一句话描述风格调性' },
            { label: '主视觉方向', val: colorDir, set: setColorDir, ph: '白底黑字，高对比，克制用色' },
          ].map(({ label, val, set, ph }) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: S.textDim, marginBottom: 4 }}>{label}</div>
              <input value={val} onChange={e => set(e.target.value)} placeholder={ph} style={useInputStyle(false)} />
            </div>
          ))}
          <div>
            <div style={{ fontSize: 10, color: S.textDim, marginBottom: 4 }}>风格关键词</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
              {kws.map((w, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '2px 7px', border: `1px solid ${S.border}`, borderRadius: 2, color: S.textMid }}>
                  {w}
                  <button onClick={() => setKws(prev => prev.filter((_, j) => j !== i))} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: S.textDim }}><X size={9} /></button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value={kwInput} onChange={e => setKwInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addKw()} placeholder="关键词后回车" style={{ ...useInputStyle(false), flex: 1 }} />
              <button onClick={addKw} style={{ padding: '7px 10px', background: 'none', border: `1px solid ${S.border}`, borderRadius: 3, cursor: 'pointer', color: S.textMid, fontFamily: 'inherit' }}><Plus size={12} /></button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <button onClick={handleAdd} disabled={!name.trim()} style={{ padding: '6px 14px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: name.trim() ? 'pointer' : 'not-allowed', background: name.trim() ? S.borderStrong : S.border, color: name.trim() ? S.surface : S.textDim, border: 'none', borderRadius: 3 }}>保存</button>
            <button onClick={() => setOpen(false)} style={{ padding: '6px 14px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 3 }}>取消</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Layout Presets ───────────────────────────────────────────────────────────

function LayoutPresetCard({ p }: { p: GlobalLayoutPreset }) {
  const { removeLayoutPreset } = useGlobalMetaStore()
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{ border: `1px solid ${S.border}`, borderRadius: 3, background: S.surface, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', cursor: 'pointer' }} onClick={() => setExpanded(v => !v)}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: S.text }}>{p.name}</div>
          {p.description && <div style={{ fontSize: 11, color: S.textDim, marginTop: 2 }}>{p.description}</div>}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={e => { e.stopPropagation(); removeLayoutPreset(p.id) }} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: S.textDim, padding: 2, opacity: 0.5 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.5')}
          ><X size={11} /></button>
          {expanded ? <ChevronUp size={12} color={S.textDim} /> : <ChevronDown size={12} color={S.textDim} />}
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '0 14px 12px', borderTop: `1px solid ${S.border}`, marginTop: 0 }}>
          <div style={{ fontSize: 10, color: S.textDim, marginBottom: 4, marginTop: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>注入 Prompt</div>
          <pre style={{ fontSize: 11, lineHeight: 1.55, color: S.textMid, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{p.prompt}</pre>
        </div>
      )}
    </div>
  )
}

function LayoutPresetsSection() {
  const { layoutPresets, addLayoutPreset } = useGlobalMetaStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [prompt, setPrompt] = useState('')
  const [pf, setPf] = useState(false)

  const handleAdd = () => {
    if (!name.trim() || !prompt.trim()) return
    addLayoutPreset(name.trim(), desc.trim(), prompt.trim())
    setName(''); setDesc(''); setPrompt(''); setOpen(false)
  }

  return (
    <div>
      <div style={{ fontSize: 11, color: S.textDim, lineHeight: 1.6, marginBottom: 16, maxWidth: '60ch' }}>
        常用版式结构配方，调用时作为结构约束注入生成 prompt。点击展开查看注入内容。
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {layoutPresets.length === 0 && <EmptyState label="还没有版式预设" action="添加你常用的版式结构配方" />}
        {layoutPresets.map(p => <LayoutPresetCard key={p.id} p={p} />)}
      </div>

      {!open ? (
        <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', border: `1px solid ${S.border}`, borderRadius: 3, color: S.textMid }}>
          <Plus size={12} />新建版式预设
        </button>
      ) : (
        <div style={{ padding: 14, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.textDim }}>新建版式预设</div>
          <div>
            <div style={{ fontSize: 10, color: S.textDim, marginBottom: 4 }}>预设名称</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="如：三段式海报" style={useInputStyle(false)} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: S.textDim, marginBottom: 4 }}>描述（可选）</div>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="一句话描述版式结构" style={useInputStyle(false)} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: S.textDim, marginBottom: 4 }}>注入 Prompt（生成时作为结构约束）</div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              onFocus={() => setPf(true)} onBlur={() => setPf(false)}
              placeholder="请使用三段式结构：顶部大标题区（30%），中部核心内容区（50%），底部行动引导区（20%）。"
              rows={4} style={{ ...useInputStyle(pf), resize: 'vertical' as const }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleAdd} disabled={!name.trim() || !prompt.trim()} style={{ padding: '6px 14px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: (name.trim() && prompt.trim()) ? 'pointer' : 'not-allowed', background: (name.trim() && prompt.trim()) ? S.borderStrong : S.border, color: (name.trim() && prompt.trim()) ? S.surface : S.textDim, border: 'none', borderRadius: 3 }}>保存</button>
            <button onClick={() => setOpen(false)} style={{ padding: '6px 14px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 3 }}>取消</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Design Specs ─────────────────────────────────────────────────────────────

function SpecCard({ s }: { s: GlobalSpec }) {
  const { removeSpec, updateSpec } = useGlobalMetaStore()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(s.name)
  const [content, setContent] = useState(s.content)
  const [cf, setCf] = useState(false)

  const save = () => {
    if (name.trim()) updateSpec(s.id, { name: name.trim(), content: content.trim() })
    setEditing(false)
  }

  return (
    <div style={{ border: `1px solid ${S.border}`, borderRadius: 3, background: S.surface, padding: '12px 14px' }}>
      {editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="规范名称" style={useInputStyle(false)} />
          <textarea value={content} onChange={e => setContent(e.target.value)}
            onFocus={() => setCf(true)} onBlur={() => setCf(false)}
            rows={6} style={{ ...useInputStyle(cf), resize: 'vertical' as const }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={save} style={{ padding: '4px 10px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: S.borderStrong, color: S.surface, border: 'none', borderRadius: 2 }}>保存</button>
            <button onClick={() => setEditing(false)} style={{ padding: '4px 10px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 2 }}>取消</button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: S.text, cursor: 'text' }} onDoubleClick={() => setEditing(true)}>{s.name}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setEditing(true)} style={{ fontSize: 10, color: S.textDim, background: 'none', border: `1px solid ${S.border}`, borderRadius: 2, padding: '2px 7px', cursor: 'pointer', fontFamily: 'inherit' }}>编辑</button>
              <button onClick={() => removeSpec(s.id)} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: S.textDim, padding: 2, opacity: 0.5 }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.5')}
              ><X size={11} /></button>
            </div>
          </div>
          <pre style={{ fontSize: 11, lineHeight: 1.65, color: S.textMid, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', maxHeight: 160, overflow: 'auto' }}>{s.content}</pre>
        </div>
      )}
    </div>
  )
}

function DesignSpecsSection() {
  const { specs, addSpec } = useGlobalMetaStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [cf, setCf] = useState(false)

  const handleAdd = () => {
    if (!name.trim() || !content.trim()) return
    addSpec(name.trim(), content.trim())
    setName(''); setContent(''); setOpen(false)
  }

  return (
    <div>
      <div style={{ fontSize: 11, color: S.textDim, lineHeight: 1.6, marginBottom: 16, maxWidth: '60ch' }}>
        品牌规范、视觉约束文档。可在工作台资产库中注入到对话上下文，约束 AI 的输出。
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {specs.length === 0 && <EmptyState label="还没有设计规范" action="添加品牌规范或视觉约束文档" />}
        {specs.map(s => <SpecCard key={s.id} s={s} />)}
      </div>

      {!open ? (
        <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', border: `1px solid ${S.border}`, borderRadius: 3, color: S.textMid }}>
          <Plus size={12} />新建规范
        </button>
      ) : (
        <div style={{ padding: 14, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.textDim }}>新建设计规范</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="规范名称（如：电商品牌视觉规范）" style={useInputStyle(false)} />
          <textarea value={content} onChange={e => setContent(e.target.value)}
            onFocus={() => setCf(true)} onBlur={() => setCf(false)}
            placeholder="主色为 #1A73E8，字体统一用 Google Sans，图标使用 Material 风格，禁止使用插画元素…"
            rows={5} style={{ ...useInputStyle(cf), resize: 'vertical' as const }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleAdd} disabled={!name.trim() || !content.trim()} style={{ padding: '6px 14px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: (name.trim() && content.trim()) ? 'pointer' : 'not-allowed', background: (name.trim() && content.trim()) ? S.borderStrong : S.border, color: (name.trim() && content.trim()) ? S.surface : S.textDim, border: 'none', borderRadius: 3 }}>保存</button>
            <button onClick={() => setOpen(false)} style={{ padding: '6px 14px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 3 }}>取消</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: 'principles', label: '设计原则' },
  { key: 'styles', label: '风格预设' },
  { key: 'layouts', label: '版式预设' },
  { key: 'specs', label: '设计规范' },
] as const

type NavKey = typeof NAV_ITEMS[number]['key']

export default function GlobalMetaPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState<NavKey>('principles')
  const { principles, stylePresets, layoutPresets, specs } = useGlobalMetaStore()

  const counts: Record<NavKey, number> = {
    principles: principles.length,
    styles: stylePresets.length,
    layouts: layoutPresets.length,
    specs: specs.length,
  }

  return (
    <div style={{
      minHeight: '100vh', background: S.bgPage,
      fontFamily: '"Hanken Grotesk", -apple-system, sans-serif', color: S.text,
    }}>
      {/* top bar */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', borderBottom: `1px solid ${S.border}`, background: S.surface,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.text }}>Meta Design</span>
          <span style={{ fontSize: 10, color: S.textDim }}>·</span>
          <span style={{ fontSize: 11, color: S.textMid, letterSpacing: '0.04em' }}>全局元设计空间</span>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{ fontSize: 10, letterSpacing: '0.06em', color: S.textDim, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ← 工作台
        </button>
      </div>

      <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', padding: '48px 40px', gap: 48 }}>
        {/* left nav */}
        <div style={{ width: 180, flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.textDim, marginBottom: 12 }}>内容</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 10px', fontSize: 12,
                  fontWeight: active === key ? 600 : 400,
                  fontFamily: 'inherit', cursor: 'pointer',
                  background: active === key ? S.surface : 'transparent',
                  border: `1px solid ${active === key ? S.border : 'transparent'}`,
                  borderRadius: 3, color: active === key ? S.text : S.textMid,
                  textAlign: 'left', transition: 'color 0.1s',
                }}
                onMouseEnter={e => { if (active !== key) (e.currentTarget as HTMLElement).style.color = S.text }}
                onMouseLeave={e => { if (active !== key) (e.currentTarget as HTMLElement).style.color = S.textMid }}
              >
                {label}
                {counts[key] > 0 && (
                  <span style={{ fontSize: 10, color: S.textDim, fontWeight: 400 }}>{counts[key]}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 6px', color: S.text }}>
              {NAV_ITEMS.find(n => n.key === active)?.label}
            </h1>
          </div>

          {active === 'principles' && <PrinciplesSection />}
          {active === 'styles' && <StylePresetsSection />}
          {active === 'layouts' && <LayoutPresetsSection />}
          {active === 'specs' && <DesignSpecsSection />}
        </div>
      </div>
    </div>
  )
}
