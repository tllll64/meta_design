import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LeftPanel from '../components/LeftPanel'
import PreviewArea from '../components/PreviewArea'
import ChatbotPanel from '../components/ChatbotPanel'
import { useWorkspaceStore } from '@/lib/workspaceStore'
import { useProjectsStore } from '@/lib/projectsStore'

export default function Workspace() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { projects } = useProjectsStore()
  const {
    isGenerating, generatedHtml, metaSpace,
    appendMessage, setIsGenerating, setGeneratedHtml, applyExtractedMeta, updateMessage,
    loadForProject, resetWorkspace,
  } = useWorkspaceStore()

  const project = projects.find(p => p.id === projectId)

  useEffect(() => {
    if (!projectId) { navigate('/'); return }
    loadForProject(projectId)
    return () => { resetWorkspace() }
  }, [projectId])

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

  if (!project) {
    return (
      <div style={{
        display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Hanken Grotesk", -apple-system, sans-serif',
        flexDirection: 'column', gap: 12, color: 'oklch(0.58 0.004 260)',
      }}>
        <div style={{ fontSize: 28, color: 'oklch(0.82 0.004 260)', fontWeight: 300 }}>✦</div>
        <p style={{ fontSize: 13, margin: 0 }}>项目不存在</p>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '6px 14px', fontSize: 11, cursor: 'pointer', border: '1px solid oklch(0.82 0.004 260)', borderRadius: 3, background: 'transparent', color: 'oklch(0.38 0.005 260)', fontFamily: 'inherit' }}
        >
          返回工作台
        </button>
      </div>
    )
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            style={{ fontSize: 10, color: 'oklch(0.58 0.004 260)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', padding: 0, fontFamily: 'inherit' }}
          >
            ← 工作台
          </button>
          <span style={{ color: 'oklch(0.82 0.004 260)', fontSize: 10 }}>/</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: 'oklch(0.12 0.005 260)' }}>
            {project.name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {generatedHtml && (
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              style={{
                fontSize: 11, fontWeight: 500, letterSpacing: '0.02em',
                padding: '4px 10px', border: '1px solid oklch(0.82 0.004 260)',
                borderRadius: 3, background: 'transparent',
                color: isGenerating ? 'oklch(0.62 0.004 260)' : 'oklch(0.12 0.005 260)',
                cursor: isGenerating ? 'not-allowed' : 'pointer', transition: 'background 0.12s',
                fontFamily: 'inherit',
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
        <div style={{ width: 268, flexShrink: 0, borderRight: '1px solid oklch(0.82 0.004 260)', overflow: 'hidden' }}>
          <LeftPanel />
        </div>
        <div className="flex-1 overflow-hidden">
          <PreviewArea />
        </div>
        <div style={{ width: 348, flexShrink: 0, borderLeft: '1px solid oklch(0.82 0.004 260)', overflow: 'hidden' }}>
          <ChatbotPanel />
        </div>
      </div>
    </div>
  )
}
