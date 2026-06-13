import { useState, useRef, useEffect } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { useWorkspaceStore, type SkeletonModule, type ContentObject } from '@/lib/workspaceStore'

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
  accentBg: 'oklch(0.97 0.04 55)',
  fillActive: 'oklch(0.14 0.005 260)',
  fillActiveText: 'oklch(0.97 0.002 260)',
}

type LayerMode = 'content' | 'structure' | 'visual'

const LAYER_OPTIONS: { key: LayerMode; label: string; sub: string }[] = [
  { key: 'content', label: '内容层', sub: '信息层级' },
  { key: 'structure', label: '结构层', sub: '模块骨架' },
  { key: 'visual', label: '视觉层', sub: 'HTML 渲染' },
]

const SEMANTICS_LABEL: Record<ContentObject['semantics'], string> = {
  headline: '主标题',
  subheadline: '副标题',
  conclusion: '核心结论',
  support: '支撑信息',
  source: '来源',
  brand: '品牌',
  decoration: '装饰',
}

const IMPORTANCE_LABEL: Record<ContentObject['importance'], string> = {
  highest: '最高',
  high: '高',
  medium: '中',
  low: '低',
}

const IMPORTANCE_ORDER: ContentObject['importance'][] = ['highest', 'high', 'medium', 'low']

const IMPORTANCE_DOT: Record<ContentObject['importance'], string> = {
  highest: 'oklch(0.52 0.18 25)',
  high: 'oklch(0.58 0.16 55)',
  medium: 'oklch(0.52 0.08 240)',
  low: 'oklch(0.72 0.004 260)',
}

// ─── Layer Switcher ─────────────────────────────────────────────────────────

function LayerSwitcher({ mode, onChange }: { mode: LayerMode; onChange: (m: LayerMode) => void }) {
  return (
    <div style={{
      display: 'inline-flex',
      border: `1px solid ${S.border}`,
      borderRadius: 3,
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {LAYER_OPTIONS.map((opt, i) => {
        const active = mode === opt.key
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px 14px',
              gap: 1,
              fontFamily: 'inherit',
              cursor: 'pointer',
              borderRight: i < LAYER_OPTIONS.length - 1 ? `1px solid ${active ? S.fillActive : S.border}` : 'none',
              background: active ? S.fillActive : 'transparent',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = S.surface }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
              color: active ? S.fillActiveText : S.textMid,
              lineHeight: 1.2,
            }}>{opt.label}</span>
            <span style={{
              fontSize: 9, letterSpacing: '0.04em',
              color: active ? 'oklch(0.72 0.003 260)' : S.textDim,
              lineHeight: 1.2,
            }}>{opt.sub}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Content Layer ───────────────────────────────────────────────────────────

function ContentLayer() {
  const { metaSpace } = useWorkspaceStore()
  const allObjects = metaSpace.modules.flatMap(m => m.objects.map(o => ({ ...o, moduleLabel: m.label })))

  if (allObjects.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ fontSize: 22, color: S.border, fontWeight: 300 }}>✦</div>
        <p style={{ fontSize: 12, color: S.textMid }}>生成内容后，信息层级将在此显示</p>
      </div>
    )
  }

  const grouped = IMPORTANCE_ORDER.map(imp => ({
    importance: imp,
    objects: allObjects.filter(o => o.importance === imp),
  })).filter(g => g.objects.length > 0)

  return (
    <div style={{ padding: 16, overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.textDim }}>
          信息内容层级
        </span>
        <span style={{ fontSize: 9, color: S.textDim }}>{allObjects.length} 个对象</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {grouped.map(({ importance, objects }) => (
          <div key={importance}>
            {/* tier header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
              paddingBottom: 6,
              borderBottom: `1px solid ${S.border}`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: IMPORTANCE_DOT[importance], flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: S.textMid }}>
                {IMPORTANCE_LABEL[importance]}优先级
              </span>
              <span style={{ fontSize: 9, color: S.textDim, marginLeft: 'auto' }}>{objects.length} 个</span>
            </div>

            {/* object rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {objects.map(obj => (
                <div key={obj.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  fontSize: 11,
                  background: S.surface,
                  borderRadius: 2,
                }}>
                  <span style={{ fontWeight: 500, color: S.text }}>
                    {SEMANTICS_LABEL[obj.semantics]}
                  </span>
                  <span style={{ fontSize: 9, color: S.textDim, letterSpacing: '0.03em' }}>
                    {obj.moduleLabel}
                  </span>
                  <span style={{
                    fontSize: 9, padding: '1px 5px',
                    border: `1px solid ${obj.editPermission === 'locked' ? S.accent : S.border}`,
                    borderRadius: 2,
                    color: obj.editPermission === 'locked' ? S.accent : S.textDim,
                    letterSpacing: '0.03em',
                  }}>
                    {obj.editPermission === 'free' ? '可改' : obj.editPermission === 'confirm' ? '需确认' : '锁定'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Structure Layer ─────────────────────────────────────────────────────────

function ObjectParamPanel({ obj, moduleId, onClose }: { obj: ContentObject; moduleId: string; onClose: () => void }) {
  const { updateObject } = useWorkspaceStore()
  return (
    <div style={{
      position: 'absolute', zIndex: 50,
      left: '50%', top: 0,
      transform: 'translate(-50%, calc(-100% - 6px))',
      width: 220,
      background: 'oklch(0.99 0.001 260)',
      border: `1px solid ${S.borderStrong}`,
      borderRadius: 3,
      padding: 12,
      boxShadow: '0 4px 16px oklch(0.12 0.005 260 / 0.12)',
    }}>
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
          <div style={{ fontSize: 9, color: S.textDim, marginBottom: 3, letterSpacing: '0.04em', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
          <select
            value={(obj as any)[key]}
            onChange={e => updateObject(moduleId, obj.id, { [key]: e.target.value } as any)}
            style={{ width: '100%', fontSize: 11, fontFamily: 'inherit', padding: '4px 8px', color: S.text, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 2, outline: 'none' }}
          >
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
    </div>
  )
}

function SkeletonModuleCard({ module: mod }: { module: SkeletonModule }) {
  const { updateModule, appendMessage, setSelectedModule, selectedModuleId } = useWorkspaceStore()
  const [selectedObj, setSelectedObj] = useState<string | null>(null)
  const selectedObjData = mod.objects.find(o => o.id === selectedObj)
  const isSelected = selectedModuleId === mod.id

  const handleToggleLock = () => {
    const locked = !mod.locked
    updateModule(mod.id, { locked })
    appendMessage({ role: 'system', content: `🔧 结构调整\n· 模块「${mod.label}」已${locked ? '锁定' : '解锁'}`, isSystemAction: true })
  }

  return (
    <div
      onClick={() => setSelectedModule(isSelected ? null : mod.id)}
      style={{
        marginBottom: 8,
        border: `1px solid ${isSelected ? S.borderStrong : S.border}`,
        borderRadius: 3,
        background: isSelected ? S.surfaceSelected : S.bg,
        opacity: mod.locked ? 0.65 : 1,
        cursor: 'pointer',
        transition: 'border-color 0.12s, background 0.12s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderBottom: `1px solid ${S.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: S.text }}>{mod.label}</span>
          <span style={{ fontSize: 9, color: S.textDim, letterSpacing: '0.04em' }}>#{mod.order + 1}</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); handleToggleLock() }}
          style={{ display: 'flex', padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: mod.locked ? S.accent : S.textDim }}
        >
          {mod.locked ? <Lock size={10} /> : <Unlock size={10} />}
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '8px 10px' }}>
        {mod.objects.map(obj => (
          <div key={obj.id} style={{ position: 'relative' }}>
            <button
              onClick={e => { e.stopPropagation(); setSelectedObj(selectedObj === obj.id ? null : obj.id) }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 8px', fontSize: 10, fontWeight: 500, fontFamily: 'inherit',
                border: `1px solid ${selectedObj === obj.id ? S.borderStrong : S.border}`,
                borderRadius: 2,
                background: selectedObj === obj.id ? S.surface : 'transparent',
                color: S.textMid, cursor: 'pointer',
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: IMPORTANCE_DOT[obj.importance], flexShrink: 0 }} />
              {SEMANTICS_LABEL[obj.semantics]}
            </button>
            {selectedObj === obj.id && selectedObjData && (
              <ObjectParamPanel obj={selectedObjData} moduleId={mod.id} onClose={() => setSelectedObj(null)} />
            )}
          </div>
        ))}
        {mod.objects.length === 0 && (
          <span style={{ fontSize: 10, color: S.textDim, fontStyle: 'italic' }}>暂无内容对象</span>
        )}
      </div>
    </div>
  )
}

function StructureLayer() {
  const { metaSpace } = useWorkspaceStore()
  const modules = [...metaSpace.modules].sort((a, b) => a.order - b.order)

  if (modules.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ fontSize: 22, color: S.border, fontWeight: 300 }}>✦</div>
        <p style={{ fontSize: 12, color: S.textMid }}>生成内容后，骨架结构将在此显示</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 16, overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.textDim }}>结构模块层</span>
        <span style={{ fontSize: 9, color: S.textDim }}>点击模块选中 · 点击对象编辑 · 锁图标切换锁定</span>
      </div>
      {modules.map(mod => <SkeletonModuleCard key={mod.id} module={mod} />)}
    </div>
  )
}

// ─── Canvas Size Presets ─────────────────────────────────────────────────────

interface CanvasPreset {
  key: string
  label: string
  w: number
  h: number
}

const CANVAS_PRESETS: CanvasPreset[] = [
  { key: 'free',    label: '自由',    w: 0,    h: 0 },
  { key: 'a4',      label: 'A4',      w: 794,  h: 1123 },
  { key: 'poster',  label: '海报',    w: 800,  h: 1200 },
  { key: 'ppt',     label: 'PPT',     w: 960,  h: 540 },
  { key: 'xhs',     label: '小红书',  w: 1080, h: 1440 },
  { key: 'banner',  label: 'Banner',  w: 1200, h: 628 },
  { key: 'story',   label: 'Story',   w: 1080, h: 1920 },
]

function CanvasPresetBar({
  active,
  onChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: {
  active: string
  onChange: (p: CanvasPreset) => void
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '0 12px',
      height: 34,
      borderBottom: `1px solid ${S.border}`,
      background: S.surface,
      gap: 0,
      flexShrink: 0,
    }}>
      {/* presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, overflow: 'hidden' }}>
        {CANVAS_PRESETS.map((p, i) => {
          const isActive = active === p.key
          return (
            <button
              key={p.key}
              onClick={() => onChange(p)}
              style={{
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                fontFamily: 'inherit',
                color: isActive ? S.text : S.textDim,
                background: isActive ? S.bg : 'transparent',
                border: `1px solid ${isActive ? S.border : 'transparent'}`,
                borderRadius: 2,
                cursor: 'pointer',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap' as const,
                transition: 'color 0.1s, background 0.1s',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = S.textMid }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = S.textDim }}
            >
              {p.label}
              {p.key !== 'free' && (
                <span style={{ marginLeft: 4, fontSize: 9, color: S.textDim, fontWeight: 400 }}>
                  {p.w}×{p.h}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* divider */}
      <div style={{ width: 1, height: 16, background: S.border, margin: '0 10px', flexShrink: 0 }} />

      {/* zoom controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        <button onClick={onZoomOut} style={zoomBtnStyle}>−</button>
        <button
          onClick={onZoomReset}
          style={{ ...zoomBtnStyle, minWidth: 42, fontSize: 10, letterSpacing: '0.03em' }}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button onClick={onZoomIn} style={zoomBtnStyle}>+</button>
      </div>
    </div>
  )
}

const zoomBtnStyle: React.CSSProperties = {
  padding: '2px 6px', fontSize: 11, fontFamily: 'inherit',
  color: 'oklch(0.38 0.005 260)',
  background: 'transparent',
  border: `1px solid ${S.border}`,
  borderRadius: 2, cursor: 'pointer',
  lineHeight: 1.4,
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PreviewArea() {
  const { generatedHtml, isGenerating } = useWorkspaceStore()
  const [mode, setMode] = useState<LayerMode>('visual')
  const [preset, setPreset] = useState<CanvasPreset>(CANVAS_PRESETS[0])
  const [zoom, setZoom] = useState(1)

  const handleZoomIn  = () => setZoom(z => Math.min(+(z + 0.1).toFixed(1), 3))
  const handleZoomOut = () => setZoom(z => Math.max(+(z - 0.1).toFixed(1), 0.2))
  const handleZoomReset = () => setZoom(1)

  const isFree = preset.key === 'free'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: S.bg }}>
      {/* row 1: layer switcher */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
        height: 42, flexShrink: 0,
        borderBottom: `1px solid ${S.border}`,
        background: 'oklch(0.99 0.001 260)',
      }}>
        <LayerSwitcher mode={mode} onChange={setMode} />
        <span style={{
          marginLeft: 'auto', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: S.textDim,
        }}>
          {mode === 'content' ? '② 信息内容与层级' : mode === 'structure' ? '③ 结构与模块关系' : '视觉完成态'}
        </span>
      </div>

      {/* row 2: canvas toolbar — only shown in visual mode */}
      {mode === 'visual' && (
        <CanvasPresetBar
          active={preset.key}
          onChange={p => { setPreset(p); if (p.key === 'free') setZoom(1) }}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
        />
      )}

      {/* content area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {mode === 'visual' && (
          // always show canvas container — grey bg when sized, white bg when free
          <div style={{
            width: '100%', height: '100%',
            overflow: 'auto',
            background: isFree ? S.bg : 'oklch(0.88 0.004 260)',
            display: 'flex',
            alignItems: isFree ? 'stretch' : 'flex-start',
            justifyContent: isFree ? 'stretch' : 'center',
            padding: isFree ? 0 : 32,
          }}>
            {/* canvas sheet */}
            <div style={{
              ...(isFree
                ? { flex: 1, position: 'relative' }
                : {
                    width: preset.w,
                    height: preset.h,
                    flexShrink: 0,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    boxShadow: '0 2px 24px oklch(0.12 0.005 260 / 0.14)',
                  }
              ),
              background: 'oklch(0.99 0.001 260)',
              position: 'relative',
            }}>
              {isGenerating && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'oklch(0.99 0.001 260)' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `1px solid ${S.border}`, borderTopColor: S.borderStrong,
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  <span style={{ fontSize: 11, color: S.textDim, letterSpacing: '0.04em' }}>正在生成…</span>
                </div>
              )}
              {!isGenerating && !generatedHtml && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div style={{ fontSize: 28, color: S.border, fontWeight: 300 }}>✦</div>
                  <p style={{ fontSize: 13, color: S.textMid, fontWeight: 500 }}>在右侧对话框中描述你的设计任务</p>
                  <p style={{ fontSize: 11, color: S.textDim }}>AI 将生成页面并自动提取元设计空间</p>
                </div>
              )}
              {!isGenerating && generatedHtml && (
                <iframe
                  srcDoc={generatedHtml}
                  sandbox="allow-scripts"
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  title="生成预览"
                />
              )}
            </div>
          </div>
        )}

        {mode === 'structure' && <StructureLayer />}
        {mode === 'content' && <ContentLayer />}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
