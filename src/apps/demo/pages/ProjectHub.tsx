import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useProjectsStore, type Project } from '@/lib/projectsStore'
import {
  useGlobalMetaStore,
  type GlobalPrinciple,
  type GlobalStylePreset,
  type GlobalLayoutPreset,
  type GlobalSpec,
} from '@/lib/globalMetaStore'

const S = {
  bg: 'oklch(0.985 0.002 260)',
  bgPage: 'oklch(0.965 0.003 260)',
  border: 'oklch(0.82 0.004 260)',
  borderStrong: 'oklch(0.12 0.005 260)',
  text: 'oklch(0.12 0.005 260)',
  textMid: 'oklch(0.38 0.005 260)',
  textDim: 'oklch(0.58 0.004 260)',
  surface: 'oklch(0.99 0.001 260)',
  accent: 'oklch(0.52 0.18 55)',
  accentBg: 'oklch(0.97 0.04 55)',
}

// ─── Shared utils ─────────────────────────────────────────────────────────────

function formatDate(ts: number): string {
  const d = new Date(ts)
  const mo = (d.getMonth() + 1).toString().padStart(2, '0')
  const dd = d.getDate().toString().padStart(2, '0')
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  return `${d.getFullYear()}.${mo}.${dd}  ${hh}:${mm}`
}

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '7px 10px', fontSize: 12, fontFamily: 'inherit',
    color: S.text, lineHeight: 1.5,
    background: focused ? S.surface : S.bg,
    border: `1px solid ${focused ? S.borderStrong : S.border}`,
    borderRadius: 3, outline: 'none',
    transition: 'border-color 0.12s, background 0.12s',
    boxSizing: 'border-box',
  }
}

function EmptyState({ label, action }: { label: string; action?: string }) {
  return (
    <div style={{ padding: '24px 16px', textAlign: 'center', border: `1px dashed ${S.border}`, borderRadius: 3 }}>
      <p style={{ fontSize: 12, color: S.textDim, margin: '0 0 4px' }}>{label}</p>
      {action && <p style={{ fontSize: 11, color: S.textDim, margin: 0, opacity: 0.7 }}>{action}</p>}
    </div>
  )
}

// ─── Project Library ──────────────────────────────────────────────────────────

function NewProjectDialog({ onClose }: { onClose: () => void }) {
  const { createProject } = useProjectsStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [nf, setNf] = useState(false)
  const [df, setDf] = useState(false)

  const handleCreate = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = createProject(trimmed, desc.trim())
    navigate(`/project/${id}`)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'oklch(0.12 0.005 260 / 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ width: 440, background: S.surface, border: `1px solid ${S.borderStrong}`, borderRadius: 3, padding: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 24 }}>新建项目</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.textDim, marginBottom: 6 }}>项目名称</div>
          <input autoFocus value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') onClose() }}
            onFocus={() => setNf(true)} onBlur={() => setNf(false)}
            placeholder="如：年度报告海报 / 618 活动主视觉"
            style={inputStyle(nf)}
          />
        </div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.textDim, marginBottom: 6 }}>描述（可选）</div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
            onFocus={() => setDf(true)} onBlur={() => setDf(false)}
            placeholder="项目背景、目标受众、交付形式…"
            style={{ ...inputStyle(df), resize: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '7px 16px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', background: 'none', border: `1px solid ${S.border}`, borderRadius: 3, color: S.textMid }}>取消</button>
          <button onClick={handleCreate} disabled={!name.trim()} style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: name.trim() ? 'pointer' : 'not-allowed', background: name.trim() ? S.borderStrong : S.border, color: name.trim() ? S.surface : S.textDim, border: 'none', borderRadius: 3 }}>
            创建并进入
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  const { deleteProject } = useProjectsStore()
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
      style={{ border: `1px solid ${hovered ? S.borderStrong : S.border}`, borderRadius: 3, background: S.surface, cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'border-color 0.12s' }}
    >
      <div onClick={() => navigate(`/project/${project.id}`)} style={{ height: 120, background: S.bg, borderBottom: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {project.thumbnail ? (
          <iframe srcDoc={project.thumbnail} sandbox="allow-scripts" style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }} title="缩略图" />
        ) : (
          <span style={{ fontSize: 10, color: S.textDim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>暂无预览</span>
        )}
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }} onClick={() => navigate(`/project/${project.id}`)}>
        <div style={{ fontSize: 13, fontWeight: 600, color: S.text, lineHeight: 1.3, marginBottom: 4 }}>{project.name}</div>
        {project.description && (
          <div style={{ fontSize: 11, color: S.textDim, lineHeight: 1.5, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{project.description}</div>
        )}
        <div style={{ fontSize: 9, color: S.textDim, letterSpacing: '0.04em' }}>{formatDate(project.updatedAt)}</div>
      </div>
      {hovered && (
        <div style={{ padding: '0 14px 12px', display: 'flex', justifyContent: 'flex-end' }}>
          {confirmDelete ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: S.textMid }}>确认删除？</span>
              <button onClick={e => { e.stopPropagation(); deleteProject(project.id) }} style={{ padding: '2px 8px', fontSize: 10, fontFamily: 'inherit', cursor: 'pointer', background: S.borderStrong, color: S.surface, border: 'none', borderRadius: 2 }}>删除</button>
              <button onClick={e => { e.stopPropagation(); setConfirmDelete(false) }} style={{ padding: '2px 8px', fontSize: 10, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 2 }}>取消</button>
            </div>
          ) : (
            <button onClick={e => { e.stopPropagation(); setConfirmDelete(true) }} style={{ padding: '2px 8px', fontSize: 10, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 2 }}>删除</button>
          )}
        </div>
      )}
    </div>
  )
}

function ProjectLibrary() {
  const { projects } = useProjectsStore()
  const [showNew, setShowNew] = useState(false)

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.textDim }}>
          项目库 {projects.length > 0 ? projects.length : ''}
        </span>
        <button
          onClick={() => setShowNew(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', fontFamily: 'inherit', cursor: 'pointer', background: S.borderStrong, color: S.surface, border: 'none', borderRadius: 3 }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'oklch(0.28 0.005 260)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = S.borderStrong)}
        >
          + 新建项目
        </button>
      </div>

      {projects.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, gap: 10 }}>
          <div style={{ fontSize: 28, color: S.border, fontWeight: 300 }}>✦</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: S.textMid, margin: 0 }}>还没有项目</p>
          <p style={{ fontSize: 12, color: S.textDim, margin: 0 }}>新建一个项目，开始元设计协作</p>
          <button onClick={() => setShowNew(true)} style={{ marginTop: 12, padding: '8px 18px', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', border: `1px solid ${S.borderStrong}`, borderRadius: 3, background: 'transparent', color: S.text }}>
            + 新建项目
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}

      {showNew && <NewProjectDialog onClose={() => setShowNew(false)} />}
    </div>
  )
}

// ─── Global Meta Space ────────────────────────────────────────────────────────

function PrincipleRow({ p }: { p: GlobalPrinciple }) {
  const { removePrinciple, updatePrinciple } = useGlobalMetaStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(p.content)
  const [scope, setScope] = useState(p.scope)
  const [cf, setCf] = useState(false)

  const save = () => {
    if (draft.trim()) updatePrinciple(p.id, { content: draft.trim(), scope: scope.trim() })
    setEditing(false)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', border: `1px solid ${S.border}`, borderRadius: 3, background: S.surface }}>
      {editing ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <textarea autoFocus value={draft} onChange={e => setDraft(e.target.value)} rows={2}
            onFocus={() => setCf(true)} onBlur={() => setCf(false)}
            style={{ ...inputStyle(cf), resize: 'none' }}
          />
          <input value={scope} onChange={e => setScope(e.target.value)} placeholder="适用范围（如：信息设计通用）" style={inputStyle(false)} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={save} style={{ padding: '4px 10px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: S.borderStrong, color: S.surface, border: 'none', borderRadius: 2 }}>保存</button>
            <button onClick={() => setEditing(false)} style={{ padding: '4px 10px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 2 }}>取消</button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, cursor: 'text' }} onDoubleClick={() => setEditing(true)}>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: S.text }}>{p.content}</div>
          {p.scope && <div style={{ fontSize: 10, color: S.textDim, marginTop: 3 }}>{p.scope}</div>}
        </div>
      )}
      {!editing && (
        <button onClick={() => removePrinciple(p.id)} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: S.textDim, padding: 2, opacity: 0.4, flexShrink: 0 }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.4')}
        ><X size={11} /></button>
      )}
    </div>
  )
}

function StylePresetCard({ p }: { p: GlobalStylePreset }) {
  const { removeStylePreset } = useGlobalMetaStore()
  return (
    <div style={{ padding: '12px 14px', border: `1px solid ${S.border}`, borderRadius: 3, background: S.surface }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: S.text }}>{p.name}</div>
          {p.description && <div style={{ fontSize: 11, color: S.textDim, marginTop: 2 }}>{p.description}</div>}
        </div>
        <button onClick={() => removeStylePreset(p.id)} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: S.textDim, padding: 2, opacity: 0.4 }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.4')}
        ><X size={11} /></button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: p.colorDirection ? 8 : 0 }}>
        {p.keywords.map((kw, i) => (
          <span key={i} style={{ fontSize: 10, padding: '2px 7px', border: `1px solid ${S.border}`, borderRadius: 2, color: S.textMid, background: S.bg }}>{kw}</span>
        ))}
      </div>
      {p.colorDirection && <div style={{ fontSize: 11, color: S.textDim }}>{p.colorDirection}</div>}
    </div>
  )
}

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
          <button onClick={e => { e.stopPropagation(); removeLayoutPreset(p.id) }} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: S.textDim, padding: 2, opacity: 0.4 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.4')}
          ><X size={11} /></button>
          {expanded ? <ChevronUp size={12} color={S.textDim} /> : <ChevronDown size={12} color={S.textDim} />}
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '0 14px 12px', borderTop: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 10, color: S.textDim, marginTop: 10, marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>注入 Prompt</div>
          <pre style={{ fontSize: 11, lineHeight: 1.55, color: S.textMid, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{p.prompt}</pre>
        </div>
      )}
    </div>
  )
}

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
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle(false)} />
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={5}
            onFocus={() => setCf(true)} onBlur={() => setCf(false)}
            style={{ ...inputStyle(cf), resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={save} style={{ padding: '4px 10px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: S.borderStrong, color: S.surface, border: 'none', borderRadius: 2 }}>保存</button>
            <button onClick={() => setEditing(false)} style={{ padding: '4px 10px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 2 }}>取消</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>{s.name}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setEditing(true)} style={{ fontSize: 10, color: S.textDim, background: 'none', border: `1px solid ${S.border}`, borderRadius: 2, padding: '2px 7px', cursor: 'pointer', fontFamily: 'inherit' }}>编辑</button>
              <button onClick={() => removeSpec(s.id)} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: S.textDim, padding: 2, opacity: 0.4 }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.4')}
              ><X size={11} /></button>
            </div>
          </div>
          <pre style={{ fontSize: 11, lineHeight: 1.65, color: S.textMid, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', maxHeight: 140, overflow: 'auto' }}>{s.content}</pre>
        </>
      )}
    </div>
  )
}

type MetaSection = 'principles' | 'styles' | 'layouts' | 'specs'

const META_NAV: { key: MetaSection; label: string }[] = [
  { key: 'principles', label: '设计原则' },
  { key: 'styles', label: '风格预设' },
  { key: 'layouts', label: '版式预设' },
  { key: 'specs', label: '设计规范' },
]

function GlobalMetaSpace() {
  const store = useGlobalMetaStore()
  const [section, setSection] = useState<MetaSection>('principles')
  const [addOpen, setAddOpen] = useState(false)

  // add form state
  const [content, setContent] = useState('')
  const [scope, setScope] = useState('')
  const [styleName, setStyleName] = useState('')
  const [styleDesc, setStyleDesc] = useState('')
  const [styleKwInput, setStyleKwInput] = useState('')
  const [styleKws, setStyleKws] = useState<string[]>([])
  const [styleColor, setStyleColor] = useState('')
  const [layoutName, setLayoutName] = useState('')
  const [layoutDesc, setLayoutDesc] = useState('')
  const [layoutPrompt, setLayoutPrompt] = useState('')
  const [specName, setSpecName] = useState('')
  const [specContent, setSpecContent] = useState('')
  const [cf1, setCf1] = useState(false)
  const [cf2, setCf2] = useState(false)

  const counts: Record<MetaSection, number> = {
    principles: store.principles.length,
    styles: store.stylePresets.length,
    layouts: store.layoutPresets.length,
    specs: store.specs.length,
  }

  const handleAdd = () => {
    if (section === 'principles' && content.trim()) {
      store.addPrinciple(content.trim(), scope.trim()); setContent(''); setScope('')
    }
    if (section === 'styles' && styleName.trim()) {
      store.addStylePreset(styleName.trim(), styleDesc.trim(), styleKws, styleColor.trim())
      setStyleName(''); setStyleDesc(''); setStyleKws([]); setStyleKwInput(''); setStyleColor('')
    }
    if (section === 'layouts' && layoutName.trim() && layoutPrompt.trim()) {
      store.addLayoutPreset(layoutName.trim(), layoutDesc.trim(), layoutPrompt.trim())
      setLayoutName(''); setLayoutDesc(''); setLayoutPrompt('')
    }
    if (section === 'specs' && specName.trim() && specContent.trim()) {
      store.addSpec(specName.trim(), specContent.trim()); setSpecName(''); setSpecContent('')
    }
    setAddOpen(false)
  }

  const canAdd = section === 'principles' ? !!content.trim()
    : section === 'styles' ? !!styleName.trim()
    : section === 'layouts' ? !!(layoutName.trim() && layoutPrompt.trim())
    : !!(specName.trim() && specContent.trim())

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* meta sub-nav */}
      <div style={{ width: 160, flexShrink: 0, borderRight: `1px solid ${S.border}`, padding: '28px 0', background: S.bgPage }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.textDim, padding: '0 20px', marginBottom: 8 }}>分类</div>
        {META_NAV.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setSection(key); setAddOpen(false) }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '7px 20px', fontSize: 12,
              fontWeight: section === key ? 600 : 400, fontFamily: 'inherit', cursor: 'pointer',
              background: section === key ? S.surface : 'transparent',
              border: 'none', borderRight: section === key ? `2px solid ${S.borderStrong}` : '2px solid transparent',
              color: section === key ? S.text : S.textMid, textAlign: 'left',
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => { if (section !== key) (e.currentTarget as HTMLElement).style.color = S.text }}
            onMouseLeave={e => { if (section !== key) (e.currentTarget as HTMLElement).style.color = S.textMid }}
          >
            {label}
            {counts[key] > 0 && <span style={{ fontSize: 10, color: S.textDim, fontWeight: 400 }}>{counts[key]}</span>}
          </button>
        ))}
      </div>

      {/* meta content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', margin: 0, color: S.text }}>
            {META_NAV.find(n => n.key === section)?.label}
          </h2>
          <button
            onClick={() => setAddOpen(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', background: addOpen ? S.borderStrong : 'none', color: addOpen ? S.surface : S.textMid, border: `1px solid ${addOpen ? S.borderStrong : S.border}`, borderRadius: 3, transition: 'all 0.12s' }}
          >
            <Plus size={12} />{addOpen ? '取消' : '新增'}
          </button>
        </div>
        <div style={{ fontSize: 11, color: S.textDim, lineHeight: 1.6, marginBottom: 20, maxWidth: '60ch' }}>
          {section === 'principles' && '跨项目复用的高层判断标准。双击条目可编辑。在此沉淀的原则可在进入工作台时注入生成上下文。'}
          {section === 'styles' && '可复用的视觉风格包：关键词组合 + 主视觉方向。可在工作台资产库中一键注入到当前项目。'}
          {section === 'layouts' && '常用版式结构配方，调用时作为结构约束注入生成 prompt。点击展开查看注入内容。'}
          {section === 'specs' && '品牌规范、视觉约束文档。可在工作台资产库中注入到对话上下文，约束 AI 的输出。'}
        </div>

        {/* add form */}
        {addOpen && (
          <div style={{ padding: 16, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 3, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {section === 'principles' && (
              <>
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={2}
                  onFocus={() => setCf1(true)} onBlur={() => setCf1(false)}
                  placeholder="如：主标题始终占据视觉最高权重，不可被任何装饰元素遮挡"
                  style={{ ...inputStyle(cf1), resize: 'none' }}
                />
                <input value={scope} onChange={e => setScope(e.target.value)} placeholder="适用范围（可选）" style={inputStyle(false)} />
              </>
            )}
            {section === 'styles' && (
              <>
                <input value={styleName} onChange={e => setStyleName(e.target.value)} placeholder="预设名称（如：极简线条风）" style={inputStyle(false)} />
                <input value={styleDesc} onChange={e => setStyleDesc(e.target.value)} placeholder="描述（可选）" style={inputStyle(false)} />
                <input value={styleColor} onChange={e => setStyleColor(e.target.value)} placeholder="主视觉方向（如：白底黑字，高对比）" style={inputStyle(false)} />
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                    {styleKws.map((w, i) => (
                      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '2px 7px', border: `1px solid ${S.border}`, borderRadius: 2, color: S.textMid }}>
                        {w}<button onClick={() => setStyleKws(prev => prev.filter((_, j) => j !== i))} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: S.textDim }}><X size={9} /></button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input value={styleKwInput} onChange={e => setStyleKwInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { const w = styleKwInput.trim(); if (w) { setStyleKws(prev => [...prev, w]); setStyleKwInput('') } } }}
                      placeholder="风格关键词，回车添加" style={{ ...inputStyle(false), flex: 1 }}
                    />
                    <button onClick={() => { const w = styleKwInput.trim(); if (w) { setStyleKws(prev => [...prev, w]); setStyleKwInput('') } }} style={{ padding: '7px 10px', background: 'none', border: `1px solid ${S.border}`, borderRadius: 3, cursor: 'pointer', color: S.textMid, fontFamily: 'inherit' }}><Plus size={12} /></button>
                  </div>
                </div>
              </>
            )}
            {section === 'layouts' && (
              <>
                <input value={layoutName} onChange={e => setLayoutName(e.target.value)} placeholder="预设名称（如：三段式海报）" style={inputStyle(false)} />
                <input value={layoutDesc} onChange={e => setLayoutDesc(e.target.value)} placeholder="描述（可选）" style={inputStyle(false)} />
                <textarea value={layoutPrompt} onChange={e => setLayoutPrompt(e.target.value)} rows={4}
                  onFocus={() => setCf2(true)} onBlur={() => setCf2(false)}
                  placeholder="注入 Prompt：请使用三段式结构…"
                  style={{ ...inputStyle(cf2), resize: 'vertical' }}
                />
              </>
            )}
            {section === 'specs' && (
              <>
                <input value={specName} onChange={e => setSpecName(e.target.value)} placeholder="规范名称（如：电商品牌视觉规范）" style={inputStyle(false)} />
                <textarea value={specContent} onChange={e => setSpecContent(e.target.value)} rows={5}
                  onFocus={() => setCf2(true)} onBlur={() => setCf2(false)}
                  placeholder="主色为 #1A73E8，字体统一用 Google Sans…"
                  style={{ ...inputStyle(cf2), resize: 'vertical' }}
                />
              </>
            )}
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={handleAdd} disabled={!canAdd} style={{ padding: '6px 14px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: canAdd ? 'pointer' : 'not-allowed', background: canAdd ? S.borderStrong : S.border, color: canAdd ? S.surface : S.textDim, border: 'none', borderRadius: 3 }}>保存</button>
              <button onClick={() => setAddOpen(false)} style={{ padding: '6px 14px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 3 }}>取消</button>
            </div>
          </div>
        )}

        {/* content list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: section === 'styles' ? 0 : 6 }}>
          {section === 'principles' && (
            store.principles.length === 0
              ? <EmptyState label="还没有设计原则" action="添加你认为应该在所有项目中遵守的判断标准" />
              : store.principles.map(p => <PrincipleRow key={p.id} p={p} />)
          )}
          {section === 'styles' && (
            store.stylePresets.length === 0
              ? <EmptyState label="还没有风格预设" action="添加你常用的视觉风格包" />
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                  {store.stylePresets.map(p => <StylePresetCard key={p.id} p={p} />)}
                </div>
          )}
          {section === 'layouts' && (
            store.layoutPresets.length === 0
              ? <EmptyState label="还没有版式预设" action="添加你常用的版式结构配方" />
              : store.layoutPresets.map(p => <LayoutPresetCard key={p.id} p={p} />)
          )}
          {section === 'specs' && (
            store.specs.length === 0
              ? <EmptyState label="还没有设计规范" action="添加品牌规范或视觉约束文档" />
              : store.specs.map(s => <SpecCard key={s.id} s={s} />)
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type HubTab = 'meta' | 'projects'

export default function ProjectHub() {
  const [tab, setTab] = useState<HubTab>('projects')

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: '"Hanken Grotesk", -apple-system, sans-serif', color: S.text,
      background: S.bgPage,
    }}>
      {/* top bar */}
      <div style={{ height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: `1px solid ${S.border}`, background: S.surface }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.text }}>Meta Design</span>
      </div>

      {/* body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* left nav */}
        <div style={{ width: 200, flexShrink: 0, borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', background: S.surface, padding: '24px 0' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.textDim, padding: '0 20px', marginBottom: 8 }}>导航</div>
          {([
            { key: 'meta', label: '元设计空间', desc: '全局原则与资产' },
            { key: 'projects', label: '项目库', desc: '所有设计项目' },
          ] as const).map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                width: '100%', padding: '10px 20px', gap: 1,
                fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left',
                background: tab === key ? S.bgPage : 'transparent',
                border: 'none', borderRight: tab === key ? `2px solid ${S.borderStrong}` : '2px solid transparent',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (tab !== key) (e.currentTarget as HTMLElement).style.background = S.bg }}
              onMouseLeave={e => { if (tab !== key) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ fontSize: 12, fontWeight: tab === key ? 600 : 400, color: tab === key ? S.text : S.textMid }}>{label}</span>
              <span style={{ fontSize: 10, color: S.textDim }}>{desc}</span>
            </button>
          ))}
        </div>

        {/* content area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {tab === 'projects' && <ProjectLibrary />}
          {tab === 'meta' && <GlobalMetaSpace />}
        </div>
      </div>
    </div>
  )
}
