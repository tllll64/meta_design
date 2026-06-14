import { useState, useRef, useCallback, useEffect } from 'react'
import { useWorkspaceStore } from '@/lib/workspaceStore'
import VersionBar from './VersionBar'

const S = {
  bg: 'oklch(0.985 0.002 260)',
  border: 'oklch(0.82 0.004 260)',
  borderStrong: 'oklch(0.12 0.005 260)',
  text: 'oklch(0.12 0.005 260)',
  textMid: 'oklch(0.38 0.005 260)',
  textDim: 'oklch(0.58 0.004 260)',
  surface: 'oklch(0.965 0.002 260)',
  accent: 'oklch(0.52 0.18 55)',
  fillActive: 'oklch(0.14 0.005 260)',
  fillActiveText: 'oklch(0.97 0.002 260)',
}

// ─── Live DOM Measurement ─────────────────────────────────────────────────────

interface LiveBlock { label: string; x: number; y: number; w: number; h: number }
interface LiveText { text: string; fontSize: number; fontWeight: string; x: number; y: number }
interface LiveDomData { blocks: LiveBlock[]; texts: LiveText[] }

// Injected into iframe srcDoc; fires on load and postMessages block + text data to parent
const MEASURE_SCRIPT = `<script>
(function(){
  function run(){
    var dw=document.body.scrollWidth;
    var dh=document.body.scrollHeight;
    var pageArea=dw*dh;
    var blocks=[],seen=new Set();
    var cands=Array.from(document.querySelectorAll('header,footer,nav,main,section,article,aside'));
    Array.from(document.body.children).forEach(function(el){
      var r=el.getBoundingClientRect();
      if(r.width>dw*0.4&&r.height>60){
        cands.push(el);
        Array.from(el.children).forEach(function(c){
          var cr=c.getBoundingClientRect();
          if(cr.width>dw*0.4&&cr.height>50)cands.push(c);
        });
      }
    });
    cands.forEach(function(el){
      if(seen.has(el))return;seen.add(el);
      var r=el.getBoundingClientRect();
      if(r.width<80||r.height<40)return;
      // skip elements that start outside the left/right canvas edge
      if(r.left<-4||r.right>dw+4)return;
      // skip pure background containers (>85% page area and no direct text)
      if(r.width*r.height>pageArea*0.85)return;
      var cs=window.getComputedStyle(el);
      if(cs.display==='none'||cs.visibility==='hidden')return;
      // skip decorative elements: no text content, has gradient/image background
      var txt=(el.textContent||'').replace(/\\s+/g,'').length;
      if(txt<3){
        var bg=cs.background+cs.backgroundImage;
        if(bg.indexOf('gradient')>=0||bg.indexOf('url(')>=0)return;
      }
      var contained=blocks.some(function(b){return b.x<=r.left&&b.y<=r.top&&b.x+b.w>=r.right&&b.y+b.h>=r.bottom;});
      if(contained)return;
      var label=el.tagName.toLowerCase();
      var cls=Array.from(el.classList).find(function(c){return c.length>2&&c.length<30&&!/^[0-9]/.test(c);});
      if(el.id)label=el.id;else if(cls)label=cls;
      blocks.push({label:String(label).slice(0,30),x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height)});
    });
    var texts=[],tSeen=new Set();
    var walker=document.createTreeWalker(document.body,4);
    var node;
    while((node=walker.nextNode())){
      var t=node.textContent.replace(/\\s+/g,' ').trim();
      if(!t||t.length<2)continue;
      var p=node.parentElement;
      if(!p)continue;
      var ptag=p.tagName.toLowerCase();
      if(['script','style','noscript','svg','path'].indexOf(ptag)>=0)continue;
      var pr=p.getBoundingClientRect();
      if(pr.width<1||pr.height<1)continue;
      var pcs=window.getComputedStyle(p);
      if(pcs.display==='none'||pcs.visibility==='hidden')continue;
      var key=t+'@'+Math.round(pr.left)+','+Math.round(pr.top);
      if(tSeen.has(key))continue;tSeen.add(key);
      texts.push({text:t.length>150?t.slice(0,150)+'...':t,fontSize:Math.round(parseFloat(pcs.fontSize)||14),fontWeight:pcs.fontWeight,x:Math.round(pr.left),y:Math.round(pr.top)});
    }
    texts.sort(function(a,b){return a.y-b.y||a.x-b.x;});
    window.parent.postMessage({type:'META_MEASURE',blocks:blocks,texts:texts},'*');
  }
  if(document.readyState==='complete')run();else window.addEventListener('load',run);
})();
</script>`

function buildSrcDoc(html: string): string {
  const idx = html.lastIndexOf('</body>')
  return idx >= 0 ? html.slice(0, idx) + MEASURE_SCRIPT + html.slice(idx) : html + MEASURE_SCRIPT
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
          <span key={i} onClick={() => onChange(i as LayerMode)} style={{
            fontSize: 9, letterSpacing: '0.06em', cursor: 'pointer',
            fontWeight: value === i ? 700 : 400,
            color: value === i ? S.text : S.textDim,
            transition: 'color 0.15s, font-weight 0.15s',
          }}>{label}</span>
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

// ─── Structure Overlay ────────────────────────────────────────────────────────

const MOD_PALETTE = [
  { bg: 'oklch(0.94 0.04 240 / 0.55)', border: 'oklch(0.55 0.16 240)', text: 'oklch(0.40 0.16 240)' },
  { bg: 'oklch(0.94 0.05 150 / 0.55)', border: 'oklch(0.52 0.16 150)', text: 'oklch(0.38 0.16 150)' },
  { bg: 'oklch(0.94 0.04 300 / 0.55)', border: 'oklch(0.52 0.18 300)', text: 'oklch(0.40 0.18 300)' },
  { bg: 'oklch(0.95 0.05 55  / 0.55)', border: 'oklch(0.58 0.18 55)',  text: 'oklch(0.44 0.18 55)'  },
  { bg: 'oklch(0.95 0.04 25  / 0.55)', border: 'oklch(0.55 0.18 25)',  text: 'oklch(0.42 0.18 25)'  },
  { bg: 'oklch(0.93 0.004 260/ 0.55)', border: 'oklch(0.50 0.006 260)', text: 'oklch(0.38 0.006 260)' },
]

function StructureOverlay({ blocks }: { blocks: LiveBlock[] }) {
  if (blocks.length === 0) return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 12, color: S.textDim }}>生成内容后，结构层将在此显示</span>
    </div>
  )

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {blocks.map((block, i) => {
        const pal = MOD_PALETTE[i % MOD_PALETTE.length]
        return (
          <div key={i} style={{
            position: 'absolute',
            left: block.x, top: block.y, width: block.w, height: block.h,
            background: pal.bg,
            border: `1.5px dashed ${pal.border}`,
            borderRadius: 8,
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}>
            {/* floating label pill sitting on the top-left border edge */}
            <div style={{
              position: 'absolute',
              top: -11, left: 12,
              padding: '1px 8px',
              fontSize: 10, fontWeight: 600,
              letterSpacing: '0.03em',
              color: pal.text,
              background: 'oklch(0.99 0.001 260)',
              border: `1.5px dashed ${pal.border}`,
              borderRadius: 20,
              whiteSpace: 'nowrap',
              maxWidth: block.w - 24,
              overflow: 'hidden', textOverflow: 'ellipsis',
              lineHeight: '18px',
            }}>
              {block.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Content Overlay ──────────────────────────────────────────────────────────

function ContentOverlay({ texts }: { texts: LiveText[] }) {
  if (texts.length === 0) return (
    <div style={{ position: 'absolute', inset: 0, background: 'oklch(0.99 0.001 260 / 0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 12, color: S.textDim }}>暂无可提取的文字内容</span>
    </div>
  )

  // Map font sizes to hierarchy levels (largest = 0)
  const sizes = [...new Set(texts.map(t => t.fontSize))].sort((a, b) => b - a)
  const getLevel = (fs: number) => Math.min(sizes.indexOf(fs), 3)

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'oklch(0.99 0.001 260 / 0.95)', overflow: 'auto', padding: '28px 36px' }}>
      {texts.map((item, i) => {
        const level = getLevel(item.fontSize)
        return (
          <div key={i} style={{
            paddingLeft: level * 16,
            marginBottom: level === 0 ? 14 : level === 1 ? 8 : 4,
            fontSize: level === 0 ? 16 : level === 1 ? 13 : level === 2 ? 12 : 11,
            fontWeight: level === 0 ? 700 : level === 1 ? 600 : 400,
            lineHeight: 1.5,
            color: level === 0 ? S.text : level <= 1 ? S.textMid : S.textDim,
          }}>
            {level >= 2 && <span style={{ marginRight: 6, color: S.border, fontWeight: 300 }}>—</span>}
            {item.text}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PreviewArea() {
  const { generatedHtml, isGenerating, updateHtmlContent } = useWorkspaceStore()
  const [layer, setLayer] = useState<LayerMode>(0)
  const [preset, setPreset] = useState<CanvasPreset>(CANVAS_PRESETS[0])
  const [zoom, setZoom] = useState(1)
  const [editMode, setEditMode] = useState(false)
  const [liveData, setLiveData] = useState<LiveDomData | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Receive measured DOM data from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'META_MEASURE') {
        setLiveData({ blocks: e.data.blocks ?? [], texts: e.data.texts ?? [] })
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // Reset live data when HTML changes so stale overlay doesn't linger
  useEffect(() => { setLiveData(null) }, [generatedHtml])

  const TRANSITION = 'opacity 0.38s cubic-bezier(0.4,0,0.2,1), filter 0.38s cubic-bezier(0.4,0,0.2,1)'
  const layerLabel = layer === 0 ? '② 视觉完成态' : layer === 1 ? '③ 结构与模块关系' : '② 信息内容与层级'

  const enableEdit = useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    doc.body.contentEditable = 'true'
    doc.body.style.outline = 'none'
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

  const handleLayerChange = (v: LayerMode) => {
    if (editMode) exitEdit()
    setLayer(v)
  }

  const handleIframeLoad = useCallback(() => {
    if (editMode) enableEdit()
  }, [editMode, enableEdit])

  // In edit mode use plain html (allow-same-origin needed); otherwise inject measure script
  const srcDocForIframe = editMode ? generatedHtml! : (generatedHtml ? buildSrcDoc(generatedHtml) : null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: S.bg }}>
      {/* row 1: controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', height: 50, flexShrink: 0, borderBottom: `1px solid ${S.border}`, background: 'oklch(0.99 0.001 260)' }}>
        <LayerSlider value={layer} onChange={handleLayerChange} />
        {layer === 0 && generatedHtml && !isGenerating && (
          <button
            onClick={editMode ? exitEdit : () => { setEditMode(true); setTimeout(enableEdit, 50) }}
            style={{
              padding: '3px 10px', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'inherit',
              border: editMode ? `1px solid ${S.borderStrong}` : `1px dashed ${S.border}`,
              borderRadius: 2, background: editMode ? S.fillActive : 'transparent',
              color: editMode ? S.fillActiveText : S.textMid, cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            {editMode ? '完成编辑' : '编辑文字'}
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: editMode ? S.accent : S.textDim }}>
          {editMode ? '编辑模式' : layerLabel}
        </span>
      </div>

      {/* row 2: canvas presets */}
      <CanvasPresetBar
        active={preset.key} onChange={p => setPreset(p)} zoom={zoom}
        onZoomIn={() => setZoom(z => Math.min(+(z + 0.1).toFixed(1), 3))}
        onZoomOut={() => setZoom(z => Math.max(+(z - 0.1).toFixed(1), 0.2))}
        onZoomReset={() => setZoom(1)}
      />

      {/* row 3: version bar */}
      <VersionBar />

      {/* canvas area */}
      <div style={{ flex: 1, overflow: 'auto', background: 'oklch(0.88 0.004 260)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 32 }}>
        <div style={{
          width: preset.w, height: preset.h, flexShrink: 0,
          transform: `scale(${zoom})`, transformOrigin: 'top center',
          boxShadow: editMode
            ? `0 0 0 2px oklch(0.52 0.18 55), 0 2px 24px oklch(0.12 0.005 260 / 0.14)`
            : '0 2px 24px oklch(0.12 0.005 260 / 0.14)',
          background: 'oklch(0.99 0.001 260)', position: 'relative', transition: 'box-shadow 0.2s',
        }}>
          {/* Visual layer */}
          <div style={{ position: 'absolute', inset: 0, opacity: layer === 0 ? 1 : 0.07, filter: layer === 0 ? 'none' : 'blur(1.5px)', transition: TRANSITION, pointerEvents: layer === 0 ? 'auto' : 'none' }}>
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
            {!isGenerating && srcDocForIframe && (
              <iframe
                ref={iframeRef}
                key={editMode ? 'edit' : 'view'}
                srcDoc={srcDocForIframe}
                sandbox={editMode ? 'allow-scripts allow-same-origin' : 'allow-scripts'}
                onLoad={handleIframeLoad}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title="生成预览"
              />
            )}
          </div>

          {/* Structure overlay — pixel-accurate absolute blocks from live DOM */}
          <div style={{ position: 'absolute', inset: 0, opacity: layer === 1 ? 1 : 0, transition: TRANSITION, pointerEvents: 'none' }}>
            {generatedHtml && <StructureOverlay blocks={liveData?.blocks ?? []} />}
          </div>

          {/* Content overlay — text extracted from live DOM */}
          <div style={{ position: 'absolute', inset: 0, opacity: layer === 2 ? 1 : 0, transition: TRANSITION, pointerEvents: layer === 2 ? 'auto' : 'none' }}>
            {generatedHtml && <ContentOverlay texts={liveData?.texts ?? []} />}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
