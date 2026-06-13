import { useState, useMemo, useRef, useCallback } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { useWorkspaceStore, type SkeletonModule, type ContentObject } from '@/lib/workspaceStore'
import VersionBar from './VersionBar'

const S = {
  bg: 'oklch(0.985 0.002 260)',
  border: 'oklch(0.82 0.004 260)',
  borderStrong: 'oklch(0.12 0.005 260)',
  text: 'oklch(0.12 0.005 260)',
  textMid: 'oklch(0.38 0.005 260)',
  textDim: 'oklch(0.58 0.004 260)',
  surface: 'oklch(0.965 0.002 260)',
  surfaceSelected: 'oklch(0.955 0.006 240)',
  accent: 'oklch(0.52 0.18 55)',
  fillActive: 'oklch(0.14 0.005 260)',
  fillActiveText: 'oklch(0.97 0.002 260)',
}

// ─── HTML Text Outline Parser ─────────────────────────────────────────────────

function parseHtmlOutline(html: string): Array<{ text: string; level: number }> {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const items: Array<{ text: string; level: number }> = []

    const walk = (el: Element) => {
      const tag = el.tagName.toLowerCase()
      if (['script', 'style', 'head', 'svg', 'path', 'noscript'].includes(tag)) return

      if (/^h[1-6]$/.test(tag)) {
        const text = el.textContent?.trim().replace(/\s+/g, ' ')
        if (text) items.push({ text, level: parseInt(tag[1]) - 1 })
        return
      }
      if (tag === 'p') {
        const text = el.textContent?.trim().replace(/\s+/g, ' ')
        if (text && text.length > 3)
          items.push({ text: text.length > 110 ? text.slice(0, 110) + '…' : text, level: 3 })
        return
      }
      if (tag === 'li') {
        const text = el.textContent?.trim().replace(/\s+/g, ' ')
        if (text) items.push({ text: text.length > 80 ? text.slice(0, 80) + '…' : text, level: 3 })
        return
      }
      for (const child of Array.from(el.children)) walk(child)
    }

    walk(doc.body)
    return items
  } catch {
    return []
  }
}

// ─── Canvas Size Presets ──────────────────────────────────────────────────────

interface CanvasPreset { key: string; label: string; w: number; h: number }

const CANVAS_PRESETS: CanvasPreset[] = [
  { key: 'a4',     label: 'A4',     w: 794,  h: 1123 },
  { key: 'poster', label: '海报',   w: 800,  h: 1200 },
  { key: 'ppt',    label: 'PPT',    w: 960,  h: 540  },
  { key: 'xhs',    label: '小红书', w: 1080, h: 1440 },
  { key: 'banner', label: 'Banner', w: 1200, h: 628  },
  { key: 'story',  label: 'Story',  w: 1080, h: 1920 },
]

// ─── Layer Slider ─────────────────────────────────────────────────────────────

const LAYER_LABELS = ['视觉', '结构', '内容']
type LayerMode = 0 | 1 | 2

function LayerSlider({ value, onChange }: { value: LayerMode; onChange: (v: LayerMode) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
      <input
        type="range" min={0} max={2} step={1} value={value}
        onChange={e => onChange(Number(e.target.value) as LayerMode)}
        style={{ width: 108, cursor: 'pointer', accentColor: S.borderStrong, margin: 0 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', width: 108 }}>
        {LAYER_LABELS.map((label, i) => (
          <span
            key={i}
            onClick={() => onChange(i as LayerMode)}
            style={{
              fontSize: 9, letterSpacing: '0.06em', cursor: 'pointer',
              fontWeight: value === i ? 700 : 400,
              color: value === i ? S.text : S.textDim,
              transition: 'color 0.15s, font-weight 0.15s',
            }}
          >{label}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Canvas Preset Bar ────────────────────────────────────────────────────────

const zoomBtnStyle: React.CSSProperties = {
  padding: '2px 6px', fontSize: 11, fontFamily: 'inherit',
  color: 'oklch(0.38 0.005 260)', background: 'transparent',
  border: `1px solid oklch(0.82 0.004 260)`, borderRadius: 2, cursor: 'pointer', lineHeight: 1.4,
}

function CanvasPresetBar({ active, onChange, zoom, onZoomIn, onZoomOut, onZoomReset }: {
  active: string; onChange: (p: CanvasPreset) => void
  zoom: number; onZoomIn: () => void; onZoomOut: () => void; onZoomReset: () => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', height: 34, borderBottom: `1px solid ${S.border}`, background: S.surface, gap: 0, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, overflow: 'hidden' }}>
        {CANVAS_PRESETS.map((p) => {
          const isActive = active === p.key
          return (
            <button key={p.key} onClick={() => onChange(p)} style={{
              padding: '3px 10px', fontSize: 11, fontWeight: isActive ? 600 : 400, fontFamily: 'inherit',
              color: isActive ? S.text : S.textDim, background: isActive ? S.bg : 'transparent',
              border: `1px solid ${isActive ? S.border : 'transparent'}`, borderRadius: 2,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.1s, background 0.1s',
            }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = S.textMid }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = S.textDim }}
            >
              {p.label}
              {p.key !== 'free' && <span style={{ marginLeft: 4, fontSize: 9, color: S.textDim, fontWeight: 400 }}>{p.w}×{p.h}</span>}
            </button>
          )
        })}
      </div>
      <div style={{ width: 1, height: 16, background: S.border, margin: '0 10px', flexShrink: 0 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        <button onClick={onZoomOut} style={zoomBtnStyle}>−</button>
        <button onClick={onZoomReset} style={{ ...zoomBtnStyle, minWidth: 42, fontSize: 10 }}>{Math.round(zoom * 100)}%</button>
        <button onClick={onZoomIn} style={zoomBtnStyle}>+</button>
      </div>
    </div>
  )
}

// ─── Object Param Panel ───────────────────────────────────────────────────────

const SEMANTICS_LABEL: Record<ContentObject['semantics'], string> = {
  headline: '主标题', subheadline: '副标题', conclusion: '核心结论',
  support: '支撑信息', source: '来源', brand: '品牌', decoration: '装饰',
}

const IMPORTANCE_DOT: Record<ContentObject['importance'], string> = {
  highest: 'oklch(0.52 0.18 25)', high: 'oklch(0.58 0.16 55)',
  medium: 'oklch(0.52 0.08 240)', low: 'oklch(0.72 0.004 260)',
}

function ObjectParamPanel({ obj, moduleId, onClose }: { obj: ContentObject; moduleId: string; onClose: () => void }) {
  const { updateObject } = useWorkspaceStore()
  return (
    <div style={{ position: 'absolute', zIndex: 50, left: '50%', top: 0, transform: 'translate(-50%, calc(-100% - 6px))', width: 210, background: 'oklch(0.99 0.001 260)', border: `1px solid ${S.borderStrong}`, borderRadius: 3, padding: 12, boxShadow: '0 4px 16px oklch(0.12 0.005 260 / 0.12)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.textDim }}>对象参数</span>
        <button onClick={onClose} style={{ fontSize: 11, color: S.textDim, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✕</button>
      </div>
      {([
        { label: '语义', key: 'semantics', options: Object.entries(SEMANTICS_LABEL).map(([k, v]) => ({ value: k, label: v })) },
        { label: '重要程度', key: 'importance', options: [{ value: 'highest', label: '最高' }, { value: 'high', label: '高' }, { value: 'medium', label: '中' }, { value: 'low', label: '低' }] },
        { label: '改动权限', key: 'editPermission', options: [{ value: 'free', label: '自由修改' }, { value: 'confirm', label: '需确认' }, { value: 'locked', label: '锁定' }] },
      ] as const).map(({ label, key, options }) => (
        <div key={key} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: S.textDim, marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
          <select value={(obj as any)[key]} onChange={e => updateObject(moduleId, obj.id, { [key]: e.target.value } as any)}
            style={{ width: '100%', fontSize: 11, fontFamily: 'inherit', padding: '4px 8px', color: S.text, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 2, outline: 'none' }}>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
    </div>
  )
}

// ─── Structure Overlay ────────────────────────────────────────────────────────

const MOD_BG = [
  'oklch(0.93 0.025 240 / 0.82)', 'oklch(0.93 0.025 55 / 0.82)',
  'oklch(0.93 0.025 150 / 0.82)', 'oklch(0.93 0.025 310 / 0.82)',
  'oklch(0.93 0.025 25 / 0.82)',  'oklch(0.93 0.025 200 / 0.82)',
]
const MOD_BORDER = [
  'oklch(0.68 0.07 240)', 'oklch(0.68 0.12 55)', 'oklch(0.68 0.09 150)',
  'oklch(0.68 0.09 310)', 'oklch(0.68 0.09 25)', 'oklch(0.68 0.07 200)',
]

function StructureOverlay({ modules }: { modules: SkeletonModule[] }) {
  const { updateModule, appendMessage, setSelectedModule, selectedModuleId } = useWorkspaceStore()
  const [selectedObj, setSelectedObj] = useState<{ moduleId: string; objId: string } | null>(null)

  const sorted = [...modules].sort((a, b) => a.order - b.order)

  if (sorted.length === 0) return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 12, color: S.textDim }}>生成内容后，结构层将在此显示</span>
    </div>
  )

  const heights = sorted.map(m => m.rect.height || 120)
  const totalH = heights.reduce((a, b) => a + b, 0)

  const handleToggleLock = (mod: SkeletonModule, e: React.MouseEvent) => {
    e.stopPropagation()
    const locked = !mod.locked
    updateModule(mod.id, { locked })
    appendMessage({ role: 'system', content: `🔧 结构调整\n· 模块「${mod.label}」已${locked ? '锁定' : '解锁'}`, isSystemAction: true })
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {sorted.map((mod, i) => {
        const isSelected = selectedModuleId === mod.id
        return (
          <div
            key={mod.id}
            onClick={() => setSelectedModule(isSelected ? null : mod.id)}
            style={{
              flex: heights[i] / totalH,
              background: MOD_BG[i % MOD_BG.length],
              border: `1px solid ${isSelected ? S.borderStrong : MOD_BORDER[i % MOD_BORDER.length]}`,
              display: 'flex', flexDirection: 'column',
              cursor: 'pointer',
              opacity: mod.locked ? 0.6 : 1,
              transition: 'border-color 0.12s',
              minHeight: 40, overflow: 'hidden',
            }}
          >
            {/* module header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 10px', flexShrink: 0, borderBottom: `1px solid ${MOD_BORDER[i % MOD_BORDER.length]}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: S.text }}>{mod.label}</span>
                <span style={{ fontSize: 9, color: S.textDim, letterSpacing: '0.04em' }}>#{mod.order + 1}</span>
              </div>
              <button onClick={e => handleToggleLock(mod, e)} style={{ display: 'flex', padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: mod.locked ? S.accent : S.textDim }}>
                {mod.locked ? <Lock size={10} /> : <Unlock size={10} />}
              </button>
            </div>

            {/* objects */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '6px 10px', flex: 1, alignContent: 'flex-start' }}>
              {mod.objects.map(obj => {
                const isObjSelected = selectedObj?.moduleId === mod.id && selectedObj?.objId === obj.id
                return (
                  <div key={obj.id} style={{ position: 'relative' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedObj(isObjSelected ? null : { moduleId: mod.id, objId: obj.id }) }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', fontSize: 10, fontWeight: 500, fontFamily: 'inherit', border: `1px solid ${isObjSelected ? S.borderStrong : S.border}`, borderRadius: 2, background: isObjSelected ? S.surface : 'transparent', color: S.textMid, cursor: 'pointer' }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: IMPORTANCE_DOT[obj.importance], flexShrink: 0 }} />
                      {SEMANTICS_LABEL[obj.semantics]}
                    </button>
                    {isObjSelected && (
                      <ObjectParamPanel obj={obj} moduleId={mod.id} onClose={() => setSelectedObj(null)} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Content Overlay ──────────────────────────────────────────────────────────

function ContentOverlay({ html }: { html: string }) {
  const outline = useMemo(() => parseHtmlOutline(html), [html])

  if (outline.length === 0) return (
    <div style={{ position: 'absolute', inset: 0, background: 'oklch(0.99 0.001 260 / 0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 12, color: S.textDim }}>暂无可提取的文字内容</span>
    </div>
  )

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'oklch(0.99 0.001 260 / 0.95)', overflow: 'auto', padding: '28px 36px' }}>
      {outline.map((item, i) => (
        <div key={i} style={{
          paddingLeft: item.level * 14,
          marginBottom: item.level <= 1 ? 16 : item.level === 2 ? 8 : 4,
          fontSize: item.level === 0 ? 17 : item.level === 1 ? 14 : item.level === 2 ? 12 : 11,
          fontWeight: item.level === 0 ? 700 : item.level === 1 ? 600 : 400,
          lineHeight: 1.45,
          color: item.level === 0 ? S.text : item.level <= 2 ? S.textMid : S.textDim,
        }}>
          {item.level >= 3 && <span style={{ marginRight: 6, color: S.border, fontWeight: 300 }}>—</span>}
          {item.text}
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PreviewArea() {
  const { generatedHtml, isGenerating, metaSpace, updateHtmlContent } = useWorkspaceStore()
  const [layer, setLayer] = useState<LayerMode>(0)
  const [preset, setPreset] = useState<CanvasPreset>(CANVAS_PRESETS[0])
  const [zoom, setZoom] = useState(1)
  const [editMode, setEditMode] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const TRANSITION = 'opacity 0.38s cubic-bezier(0.4,0,0.2,1), filter 0.38s cubic-bezier(0.4,0,0.2,1)'
  const layerLabel = layer === 0 ? '② 视觉完成态' : layer === 1 ? '③ 结构与模块关系' : '② 信息内容与层级'

  const enableEdit = useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    doc.body.contentEditable = 'true'
    doc.body.style.outline = 'none'
    // add subtle edit cursor hint via injected style
    const style = doc.createElement('style')
    style.id = '__edit_hint__'
    style.textContent = '[contenteditable]:focus { outline: 2px solid oklch(0.52 0.18 55) !important; outline-offset: 2px; }'
    doc.head.appendChild(style)
  }, [])

  const exitEdit = useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (doc) {
      doc.body.contentEditable = 'false'
      doc.getElementById('__edit_hint__')?.remove()
      const html = iframeRef.current?.contentDocument?.documentElement?.outerHTML
      if (html) updateHtmlContent(`<!DOCTYPE html>${html}`)
    }
    setEditMode(false)
  }, [updateHtmlContent])

  // exit edit mode when switching away from visual layer
  const handleLayerChange = (v: LayerMode) => {
    if (editMode) exitEdit()
    setLayer(v)
  }

  const handleIframeLoad = useCallback(() => {
    if (editMode) enableEdit()
  }, [editMode, enableEdit])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: S.bg }}>
      {/* row 1: layer slider + edit button + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', height: 50, flexShrink: 0, borderBottom: `1px solid ${S.border}`, background: 'oklch(0.99 0.001 260)' }}>
        <LayerSlider value={layer} onChange={handleLayerChange} />

        {/* edit text button — only on visual layer with generated content */}
        {layer === 0 && generatedHtml && !isGenerating && (
          <button
            onClick={editMode ? exitEdit : () => { setEditMode(true); setTimeout(enableEdit, 50) }}
            style={{
              padding: '3px 10px', fontSize: 10, fontWeight: 600,
              letterSpacing: '0.05em', fontFamily: 'inherit',
              border: editMode ? `1px solid ${S.borderStrong}` : `1px dashed ${S.border}`,
              borderRadius: 2,
              background: editMode ? S.fillActive : 'transparent',
              color: editMode ? S.fillActiveText : S.textMid,
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            {editMode ? '完成编辑' : '编辑文字'}
          </button>
        )}

        <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: editMode ? S.accent : S.textDim }}>
          {editMode ? '编辑模式' : layerLabel}
        </span>
      </div>

      {/* row 2: canvas preset bar */}
      <CanvasPresetBar
        active={preset.key}
        onChange={p => setPreset(p)}
        zoom={zoom}
        onZoomIn={() => setZoom(z => Math.min(+(z + 0.1).toFixed(1), 3))}
        onZoomOut={() => setZoom(z => Math.max(+(z - 0.1).toFixed(1), 0.2))}
        onZoomReset={() => setZoom(1)}
      />

      {/* row 3: version history bar */}
      <VersionBar />

      {/* canvas area */}
      <div style={{
        flex: 1, overflow: 'auto',
        background: 'oklch(0.88 0.004 260)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 32,
      }}>
        {/* canvas sheet */}
        <div style={{
          width: preset.w, height: preset.h, flexShrink: 0,
          transform: `scale(${zoom})`, transformOrigin: 'top center',
          boxShadow: editMode
            ? `0 0 0 2px oklch(0.52 0.18 55), 0 2px 24px oklch(0.12 0.005 260 / 0.14)`
            : '0 2px 24px oklch(0.12 0.005 260 / 0.14)',
          background: 'oklch(0.99 0.001 260)',
          position: 'relative',
          transition: 'box-shadow 0.2s',
        }}>

          {/* Visual layer */}
          <div style={{
            position: 'absolute', inset: 0,
            opacity: layer === 0 ? 1 : 0.07,
            filter: layer === 0 ? 'none' : 'blur(1.5px)',
            transition: TRANSITION,
            pointerEvents: layer === 0 ? 'auto' : 'none',
          }}>
            {isGenerating && (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `1px solid ${S.border}`, borderTopColor: S.borderStrong, animation: 'spin 0.8s linear infinite' }} />
                <span style={{ fontSize: 11, color: S.textDim, letterSpacing: '0.04em' }}>正在生成…</span>
              </div>
            )}
            {!isGenerating && !generatedHtml && (
              <div style={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ fontSize: 28, color: S.border, fontWeight: 300 }}>✦</div>
                <p style={{ fontSize: 13, color: S.textMid, fontWeight: 500 }}>在右侧对话框中描述你的设计任务</p>
                <p style={{ fontSize: 11, color: S.textDim }}>AI 将生成页面并自动提取元设计空间</p>
              </div>
            )}
            {!isGenerating && generatedHtml && (
              <iframe
                ref={iframeRef}
                key={editMode ? 'edit' : 'view'}
                srcDoc={generatedHtml}
                sandbox={editMode ? 'allow-scripts allow-same-origin' : 'allow-scripts'}
                onLoad={handleIframeLoad}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title="生成预览"
              />
            )}
          </div>

          {/* Structure overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: layer === 1 ? 1 : 0, transition: TRANSITION, pointerEvents: layer === 1 ? 'auto' : 'none' }}>
            {generatedHtml && <StructureOverlay modules={metaSpace.modules} />}
          </div>

          {/* Content overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: layer === 2 ? 1 : 0, transition: TRANSITION, pointerEvents: layer === 2 ? 'auto' : 'none' }}>
            {generatedHtml && <ContentOverlay html={generatedHtml} />}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
