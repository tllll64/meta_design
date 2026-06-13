import { useState } from 'react'
import { Plus, Upload, X } from 'lucide-react'
import { useWorkspaceStore } from '@/lib/workspaceStore'

const S = {
  bg: 'oklch(0.99 0.001 260)',
  border: 'oklch(0.82 0.004 260)',
  borderFocus: 'oklch(0.12 0.005 260)',
  text: 'oklch(0.12 0.005 260)',
  textMid: 'oklch(0.38 0.005 260)',
  textDim: 'oklch(0.58 0.004 260)',
  surface: 'oklch(0.965 0.002 260)',
  accent: 'oklch(0.52 0.18 55)',
}

// ─── Preset data ──────────────────────────────────────────────────────────────

const STYLE_PRESETS = [
  {
    id: 'minimal',
    label: '极简线条',
    desc: '留白充足 · 单色 · 无装饰',
    keywords: ['极简', '留白', '单色', '无装饰边框'],
    colorDirection: '白底黑字，高对比，克制用色',
  },
  {
    id: 'data',
    label: '数据可视化',
    desc: '图表主导 · 信息密度高 · 数字突出',
    keywords: ['数据图表', '信息密度', '数字强调', '网格结构'],
    colorDirection: '深底浅字，蓝绿色数据色，强对比',
  },
  {
    id: 'campaign',
    label: '活动营销',
    desc: '高饱和 · 动感 · 视觉冲击',
    keywords: ['高饱和', '大标题', '色块分区', '行动引导'],
    colorDirection: '撞色，主色饱和度高，CTA 对比强',
  },
  {
    id: 'editorial',
    label: '编辑排版',
    desc: '杂志感 · 文字主导 · 层次清晰',
    keywords: ['杂志风格', '文字排版', '层次清晰', '引言突出'],
    colorDirection: '暖白底，深棕文字，少量强调色',
  },
]

const LAYOUT_TEMPLATES = [
  {
    id: 'poster-3',
    label: '三段式海报',
    desc: '标题区 + 核心信息区 + 行动引导',
    prompt: '请使用三段式海报结构：顶部大标题区（占30%），中部核心信息/数据区（占50%），底部行动引导/联系信息区（占20%）。',
  },
  {
    id: 'data-report',
    label: '数据报告页',
    desc: '指标卡 + 图表区 + 说明文字',
    prompt: '请使用数据报告页结构：顶部标题和关键指标卡，中部主图表区，底部说明文字和来源标注。',
  },
  {
    id: 'ppt-single',
    label: 'PPT 单页',
    desc: '标题 + 要点列表 + 视觉支撑',
    prompt: '请使用 PPT 单页结构：左侧标题和要点列表（4-6条），右侧配合视觉元素或图表支撑。横版 16:9 比例。',
  },
  {
    id: 'social-card',
    label: '社媒封面卡',
    desc: '主图 + 标题 + 品牌标识',
    prompt: '请使用社媒封面结构：背景图/色块铺满，中央大标题和副标题叠加，底部品牌标识。竖版 3:4 比例。',
  },
]

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ borderBottom: `1px solid ${S.border}` }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', fontSize: 10, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase' as const,
          color: S.textDim, background: 'none', border: 'none', cursor: 'pointer',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = S.text)}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = S.textDim)}
      >
        {title}
        <span style={{ fontSize: 10, color: S.textDim }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
    </div>
  )
}

// ─── Style Presets ────────────────────────────────────────────────────────────

function StylePresets() {
  const { metaSpace, updateStyle } = useWorkspaceStore()
  const [applied, setApplied] = useState<string | null>(null)

  const applyPreset = (preset: typeof STYLE_PRESETS[0]) => {
    updateStyle({
      keywords: [...new Set([...metaSpace.style.keywords, ...preset.keywords])],
      colorDirection: metaSpace.style.colorDirection || preset.colorDirection,
    })
    setApplied(preset.id)
    setTimeout(() => setApplied(null), 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {STYLE_PRESETS.map(p => (
        <button
          key={p.id}
          onClick={() => applyPreset(p)}
          style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            padding: '8px 10px', textAlign: 'left',
            border: `1px solid ${applied === p.id ? S.accent : S.border}`,
            borderRadius: 3, background: applied === p.id ? 'oklch(0.97 0.04 55)' : 'transparent',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'border-color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { if (applied !== p.id) (e.currentTarget as HTMLElement).style.background = S.surface }}
          onMouseLeave={e => { if (applied !== p.id) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: S.text, lineHeight: 1.3 }}>{p.label}</div>
            <div style={{ fontSize: 10, color: S.textDim, marginTop: 2, lineHeight: 1.4 }}>{p.desc}</div>
          </div>
          <span style={{ fontSize: 9, color: applied === p.id ? S.accent : S.textDim, flexShrink: 0, marginLeft: 8, marginTop: 2 }}>
            {applied === p.id ? '已注入' : '应用'}
          </span>
        </button>
      ))}
    </div>
  )
}

// ─── Layout Templates ─────────────────────────────────────────────────────────

function LayoutTemplates() {
  const { appendMessage } = useWorkspaceStore()
  const [used, setUsed] = useState<string | null>(null)

  const useTemplate = (tpl: typeof LAYOUT_TEMPLATES[0]) => {
    appendMessage({
      role: 'system',
      content: `📐 版式模板\n· 应用「${tpl.label}」结构\n· ${tpl.prompt}`,
      isSystemAction: true,
    })
    setUsed(tpl.id)
    setTimeout(() => setUsed(null), 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {LAYOUT_TEMPLATES.map(t => (
        <button
          key={t.id}
          onClick={() => useTemplate(t)}
          style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            padding: '8px 10px', textAlign: 'left',
            border: `1px solid ${used === t.id ? S.accent : S.border}`,
            borderRadius: 3, background: used === t.id ? 'oklch(0.97 0.04 55)' : 'transparent',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'border-color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { if (used !== t.id) (e.currentTarget as HTMLElement).style.background = S.surface }}
          onMouseLeave={e => { if (used !== t.id) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: S.text, lineHeight: 1.3 }}>{t.label}</div>
            <div style={{ fontSize: 10, color: S.textDim, marginTop: 2, lineHeight: 1.4 }}>{t.desc}</div>
          </div>
          <span style={{ fontSize: 9, color: used === t.id ? S.accent : S.textDim, flexShrink: 0, marginLeft: 8, marginTop: 2 }}>
            {used === t.id ? '已加入' : '调用'}
          </span>
        </button>
      ))}
    </div>
  )
}

// ─── Reference Images ─────────────────────────────────────────────────────────

function ReferenceImages() {
  const { metaSpace, updateStyle } = useWorkspaceStore()
  const [urlInput, setUrlInput] = useState('')
  const [focused, setFocused] = useState(false)

  const addUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    updateStyle({ referenceImages: [...metaSpace.style.referenceImages, url] })
    setUrlInput('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      updateStyle({ referenceImages: [...metaSpace.style.referenceImages, dataUrl] })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const removeImage = (i: number) => {
    updateStyle({ referenceImages: metaSpace.style.referenceImages.filter((_, j) => j !== i) })
  }

  return (
    <div>
      {metaSpace.style.referenceImages.length === 0 && (
        <div style={{ fontSize: 11, color: S.textDim, marginBottom: 10, lineHeight: 1.5 }}>
          上传或粘贴参考图 URL，生成时将作为风格方向参照
        </div>
      )}

      {/* image thumbnails */}
      {metaSpace.style.referenceImages.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {metaSpace.style.referenceImages.map((img, i) => (
            <div key={i} style={{ position: 'relative', width: 64, height: 64 }}>
              <img
                src={img}
                alt=""
                style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 2, border: `1px solid ${S.border}`, display: 'block' }}
              />
              <button
                onClick={() => removeImage(i)}
                style={{
                  position: 'absolute', top: 2, right: 2,
                  width: 16, height: 16, borderRadius: 1,
                  background: 'oklch(0.14 0.005 260 / 0.8)',
                  border: 'none', cursor: 'pointer', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={9} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* URL input */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addUrl()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="粘贴图片 URL…"
          style={{
            flex: 1, padding: '6px 10px', fontSize: 11, fontFamily: 'inherit',
            color: S.text, background: focused ? S.bg : S.surface,
            border: `1px solid ${focused ? S.borderFocus : S.border}`,
            borderRadius: 3, outline: 'none',
          }}
        />
        <button onClick={addUrl} style={{ padding: '6px 10px', background: 'none', border: `1px solid ${S.border}`, borderRadius: 3, cursor: 'pointer', color: S.textMid }}>
          <Plus size={12} />
        </button>
      </div>

      {/* file upload */}
      <label style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', fontSize: 11, color: S.textMid,
        border: `1px dashed ${S.border}`, borderRadius: 3,
        cursor: 'pointer', transition: 'background 0.1s',
      }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = S.surface)}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        <Upload size={11} />
        本地上传图片
        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
      </label>
    </div>
  )
}

// ─── Design Specs ─────────────────────────────────────────────────────────────

function DesignSpecs() {
  const { appendMessage } = useWorkspaceStore()
  const [spec, setSpec] = useState('')
  const [focused, setFocused] = useState(false)

  const injectSpec = () => {
    const text = spec.trim()
    if (!text) return
    appendMessage({
      role: 'system',
      content: `📋 设计规范注入\n${text}`,
      isSystemAction: true,
    })
  }

  return (
    <div>
      <div style={{ fontSize: 10, color: S.textDim, marginBottom: 6, lineHeight: 1.5 }}>
        输入品牌约束或规范要求，点击注入到对话上下文
      </div>
      <textarea
        value={spec}
        onChange={e => setSpec(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="例：主色为 #1A73E8，字体统一用 Google Sans，图标使用 Material 风格，禁止使用插画…"
        rows={4}
        style={{
          width: '100%', padding: '8px 10px', fontSize: 11,
          fontFamily: 'inherit', lineHeight: 1.55,
          color: S.text, background: focused ? S.bg : S.surface,
          border: `1px solid ${focused ? S.borderFocus : S.border}`,
          borderRadius: 3, outline: 'none', resize: 'vertical' as const,
          transition: 'border-color 0.12s, background 0.12s',
          marginBottom: 8,
          boxSizing: 'border-box' as const,
        }}
      />
      <button
        onClick={injectSpec}
        disabled={!spec.trim()}
        style={{
          padding: '6px 12px', fontSize: 11, fontWeight: 600,
          fontFamily: 'inherit', cursor: spec.trim() ? 'pointer' : 'not-allowed',
          border: `1px solid ${spec.trim() ? S.text : S.border}`,
          borderRadius: 3, background: spec.trim() ? S.text : 'transparent',
          color: spec.trim() ? 'oklch(0.97 0.002 260)' : S.textDim,
          transition: 'all 0.12s',
        }}
      >
        注入规范
      </button>
    </div>
  )
}

// ─── Main AssetsPanel ─────────────────────────────────────────────────────────

export default function AssetsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: S.bg }}>
      <Section title="风格预设">
        <StylePresets />
      </Section>
      <Section title="版式模板">
        <LayoutTemplates />
      </Section>
      <Section title="参考图">
        <ReferenceImages />
      </Section>
      <Section title="设计规范">
        <DesignSpecs />
      </Section>
    </div>
  )
}
