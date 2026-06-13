import LeftPanel from '../components/LeftPanel'
import PreviewArea from '../components/PreviewArea'
import ChatbotPanel from '../components/ChatbotPanel'
import { useWorkspaceStore } from '@/lib/workspaceStore'

export default function Workspace() {
  const { isGenerating, generatedHtml, metaSpace, appendMessage, setIsGenerating, setGeneratedHtml, applyExtractedMeta, updateMessage } = useWorkspaceStore()

  const handleRegenerate = async () => {
    if (isGenerating) return
    setIsGenerating(true)
    const assistantId = appendMessage({ role: 'assistant', content: '' })

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '根据当前元设计空间重新生成页面', metaSpace }),
      })
      const json = await res.json()
      if (json.success) {
        const { html, extractedMeta } = json.data
        setGeneratedHtml(html)
        updateMessage(assistantId, { content: '已根据最新元设计配置重新生成页面。' })
        if (extractedMeta) applyExtractedMeta(extractedMeta)
      } else {
        updateMessage(assistantId, { content: `重新生成失败：${json.error?.message}` })
      }
    } catch {
      updateMessage(assistantId, { content: '重新生成请求失败。' })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{ fontFamily: '"Hanken Grotesk", -apple-system, sans-serif', background: 'oklch(0.985 0.002 260)', color: 'oklch(0.12 0.005 260)' }}
    >
      {/* top bar */}
      <div
        className="flex h-10 shrink-0 items-center justify-between px-4"
        style={{ borderBottom: '1px solid oklch(0.82 0.004 260)', background: 'oklch(0.99 0.001 260)' }}
      >
        <div className="flex items-center gap-4">
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'oklch(0.12 0.005 260)' }}>
            Meta Design
          </span>
          <span style={{ fontSize: 10, color: 'oklch(0.52 0.004 260)', letterSpacing: '0.04em' }}>
            中期原型
          </span>
        </div>
        <div className="flex items-center gap-3">
          {generatedHtml && (
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.02em',
                padding: '4px 10px',
                border: '1px solid oklch(0.82 0.004 260)',
                borderRadius: 3,
                background: 'transparent',
                color: isGenerating ? 'oklch(0.62 0.004 260)' : 'oklch(0.12 0.005 260)',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (!isGenerating) (e.target as HTMLElement).style.background = 'oklch(0.94 0.003 260)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent' }}
            >
              {isGenerating ? '生成中…' : '重新生成'}
            </button>
          )}
        </div>
      </div>

      {/* three-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* left — 268px, stark right border */}
        <div style={{ width: 268, flexShrink: 0, borderRight: '1px solid oklch(0.82 0.004 260)', overflow: 'hidden' }}>
          <LeftPanel />
        </div>

        {/* center — fills remaining */}
        <div className="flex-1 overflow-hidden">
          <PreviewArea />
        </div>

        {/* right — 348px, stark left border */}
        <div style={{ width: 348, flexShrink: 0, borderLeft: '1px solid oklch(0.82 0.004 260)', overflow: 'hidden' }}>
          <ChatbotPanel />
        </div>
      </div>
    </div>
  )
}
