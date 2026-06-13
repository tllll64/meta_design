import { useState, useRef, useEffect } from 'react'
import { Send, Check, ArrowRight } from 'lucide-react'
import { useWorkspaceStore, type ChatMessage } from '@/lib/workspaceStore'

const S = {
  bg: 'oklch(0.99 0.001 260)',
  border: 'oklch(0.82 0.004 260)',
  borderStrong: 'oklch(0.12 0.005 260)',
  text: 'oklch(0.12 0.005 260)',
  textMid: 'oklch(0.38 0.005 260)',
  textDim: 'oklch(0.58 0.004 260)',
  surface: 'oklch(0.965 0.002 260)',
  accent: 'oklch(0.52 0.18 55)',
  accentBg: 'oklch(0.97 0.04 55)',
  accentText: 'oklch(0.38 0.14 55)',
  userBg: 'oklch(0.14 0.005 260)',
  userText: 'oklch(0.96 0.002 260)',
}

const PRINCIPLE_TRIGGER_WORDS = ['始终', '一定要', '不能', '不可以', '每次都', '必须', '绝对不', '永远']
const GENERATE_TRIGGER_WORDS = ['开始生成', '生成画布', '可以生成了', '帮我生成', '生成一下']

function detectPrinciple(text: string): string | null {
  const hit = PRINCIPLE_TRIGGER_WORDS.some(w => text.includes(w))
  if (!hit) return null
  const sentences = text.split(/[。！？\n]/).filter(s => s.trim())
  const match = sentences.find(s => PRINCIPLE_TRIGGER_WORDS.some(w => s.includes(w)))
  return match?.trim() || text.trim()
}

function detectGenerateTrigger(text: string): boolean {
  return GENERATE_TRIGGER_WORDS.some(w => text.includes(w))
}

// ─── Principle Card ───────────────────────────────────────────────────────────

function PrincipleCard({ content, onSave, onDismiss }: { content: string; onSave: () => void; onDismiss: () => void }) {
  return (
    <div style={{ margin: '6px 0', padding: '10px 12px', border: `1px solid ${S.accent}`, borderRadius: 3, background: S.accentBg }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.accentText, marginBottom: 6 }}>
        检测到设计原则
      </div>
      <p style={{ fontSize: 12, lineHeight: 1.55, color: S.text, marginBottom: 10 }}>「{content}」</p>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onSave} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', background: S.borderStrong, color: S.userText, border: 'none', borderRadius: 2 }}>
          <Check size={9} />保存到原则面板
        </button>
        <button onClick={onDismiss} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textMid, border: `1px solid ${S.border}`, borderRadius: 2 }}>
          忽略
        </button>
      </div>
    </div>
  )
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const { addPrinciple, updateMessage } = useWorkspaceStore()
  const [principleState, setPrincipleState] = useState<'pending' | 'saved' | 'dismissed'>(
    msg.principleExtracted ? 'pending' : 'dismissed'
  )

  if (msg.isSystemAction) {
    return (
      <div style={{ margin: '4px 0', padding: '8px 10px', background: S.surface, border: `1px solid ${S.border}`, borderRadius: 2 }}>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10, lineHeight: 1.6, color: S.textDim, fontFamily: 'inherit' }}>
          {msg.content}
        </pre>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 8 }}>
      {msg.role === 'user' ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ maxWidth: '82%', padding: '8px 12px', fontSize: 12, lineHeight: 1.6, background: S.userBg, color: S.userText, borderRadius: 3 }}>
            {msg.content}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '92%', padding: '8px 12px', fontSize: 12, lineHeight: 1.6, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 3, color: msg.content ? S.text : S.textDim, fontStyle: msg.content ? 'normal' : 'italic' }}>
          {msg.content || '…'}
        </div>
      )}

      {msg.principleExtracted && principleState === 'pending' && (
        <PrincipleCard
          content={msg.principleExtracted}
          onSave={() => {
            addPrinciple(msg.principleExtracted!, 'extracted')
            updateMessage(msg.id, { principleExtracted: null })
            setPrincipleState('saved')
          }}
          onDismiss={() => {
            updateMessage(msg.id, { principleExtracted: null })
            setPrincipleState('dismissed')
          }}
        />
      )}
      {principleState === 'saved' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 10, color: S.accentText }}>
          <Check size={9} />已保存到原则面板
        </div>
      )}
    </div>
  )
}

// ─── Generate Button ──────────────────────────────────────────────────────────

function GenerateButton({ onClick, ready, isGenerating }: { onClick: () => void; ready: boolean; isGenerating: boolean }) {
  const [hovered, setHovered] = useState(false)
  const active = ready && !isGenerating
  return (
    <div style={{ padding: '8px 12px 0', borderTop: `1px solid ${S.border}` }}>
      <button
        onClick={active ? onClick : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '8px 12px',
          fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
          border: `1px solid ${active ? S.borderStrong : S.border}`,
          borderRadius: 3,
          background: active && hovered ? S.borderStrong : active ? S.surface : S.surface,
          color: active && hovered ? S.userText : active ? S.text : S.textDim,
          cursor: active ? 'pointer' : 'not-allowed',
          transition: 'background 0.12s, color 0.12s, border-color 0.12s',
        }}
      >
        <span>{isGenerating ? '正在生成…' : ready ? '开始生成' : '请先描述任务目标'}</span>
        {active && <ArrowRight size={13} />}
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatbotPanel() {
  const {
    messages, appendMessage, updateMessage, metaSpace,
    setIsGenerating, setGeneratedHtml, applyExtractedMeta,
    isGenerating, setStreamingContent,
    chatPhase, setChatPhase,
  } = useWorkspaceStore()

  const [input, setInput] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const greetedRef = useRef(false)

  // insert opening greeting once on mount
  useEffect(() => {
    if (greetedRef.current || messages.length > 0) return
    greetedRef.current = true
    appendMessage({
      role: 'assistant',
      content: '你好！请描述这次的信息设计任务——目标受众是谁，在哪个渠道发布，想传递什么核心信息？\n\n你也可以先在左侧面板填写任务目标，准备好后点击「开始生成」。',
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // generate is ready if task.goal is filled OR ≥3 user messages in gathering phase
  const userMsgCount = messages.filter(m => m.role === 'user').length
  const generateReady = metaSpace.task.goal.trim().length > 0 || userMsgCount >= 3

  const handleGenerate = async () => {
    setIsGenerating(true)
    setChatPhase('editing')
    const prompt = metaSpace.task.goal.trim() ||
      messages.filter(m => m.role === 'user').map(m => m.content).join('\n')
    const assistantId = appendMessage({ role: 'assistant', content: '' })

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, metaSpace }),
      })
      const json = await res.json()
      if (json.success) {
        const { html, extractedMeta } = json.data
        setGeneratedHtml(html)
        updateMessage(assistantId, { content: '已生成页面，元设计空间已提取并填入左侧面板。如需调整，继续描述修改意图即可。' })
        if (extractedMeta) applyExtractedMeta(extractedMeta)
      } else {
        updateMessage(assistantId, { content: `生成失败：${json.error?.message || '未知错误'}` })
        setChatPhase('gathering')
      }
    } catch {
      updateMessage(assistantId, { content: '生成请求失败，请检查 API 配置。' })
      setChatPhase('gathering')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleChat = async (userText: string) => {
    const assistantId = appendMessage({ role: 'assistant', content: '' })
    setStreamingContent('')
    try {
      const chatMessages = messages
        .filter(m => !m.isSystemAction)
        .map(m => ({ role: m.role, content: m.content }))
      chatMessages.push({ role: 'user', content: userText })

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMessages, metaSpace, phase: chatPhase }),
      })

      if (!res.body) throw new Error('No stream body')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        for (const line of text.split('\n').filter(l => l.startsWith('data: '))) {
          const data = line.replace('data: ', '')
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.content) {
              accumulated += parsed.content
              updateMessage(assistantId, { content: accumulated })
              setStreamingContent(accumulated)
            }
          } catch { /* ignore */ }
        }
      }
      updateMessage(assistantId, { content: accumulated })
      setStreamingContent('')
    } catch {
      updateMessage(assistantId, { content: '对话请求失败。' })
      setStreamingContent('')
    }
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isGenerating) return
    setInput('')

    const principle = detectPrinciple(text)
    appendMessage({ role: 'user', content: text, principleExtracted: principle })

    // auto-trigger generation if user says the magic words
    if (chatPhase === 'gathering' && detectGenerateTrigger(text)) {
      await handleGenerate()
      return
    }

    // gathering phase → chat only (no generation)
    // editing phase → chat only
    await handleChat(text)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: S.bg }}>
      {/* header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${S.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.textDim }}>
            AI 协作
          </div>
          <div style={{
            fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '2px 6px', borderRadius: 2,
            border: `1px solid ${chatPhase === 'gathering' ? S.accent : S.border}`,
            color: chatPhase === 'gathering' ? S.accent : S.textDim,
            background: chatPhase === 'gathering' ? S.accentBg : 'transparent',
          }}>
            {chatPhase === 'gathering' ? '上下文收集' : '编辑模式'}
          </div>
        </div>
      </div>

      {/* messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* generate button — only in gathering phase */}
      {chatPhase === 'gathering' && (
        <GenerateButton
          onClick={handleGenerate}
          ready={generateReady}
          isGenerating={isGenerating}
        />
      )}

      {/* input */}
      <div style={{ padding: chatPhase === 'gathering' ? '8px 12px 10px' : '10px 12px', borderTop: chatPhase === 'gathering' ? 'none' : `1px solid ${S.border}`, flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          border: `1px solid ${inputFocused ? S.borderStrong : S.border}`,
          borderRadius: 3, padding: '8px 10px',
          background: inputFocused ? S.bg : S.surface,
          transition: 'border-color 0.12s, background 0.12s',
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder={chatPhase === 'gathering' ? '描述你的任务、受众、风格偏好…' : '描述修改要求…'}
            rows={2}
            disabled={isGenerating}
            style={{ flex: 1, resize: 'none', background: 'transparent', border: 'none', outline: 'none', fontSize: 12, fontFamily: 'inherit', lineHeight: 1.55, color: S.text, opacity: isGenerating ? 0.5 : 1 }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, flexShrink: 0,
              border: 'none', borderRadius: 2,
              cursor: input.trim() && !isGenerating ? 'pointer' : 'not-allowed',
              background: input.trim() && !isGenerating ? S.borderStrong : S.border,
              color: input.trim() && !isGenerating ? S.userText : S.textDim,
              transition: 'background 0.12s',
            }}
          >
            <Send size={12} />
          </button>
        </div>
        <div style={{ marginTop: 5, textAlign: 'center', fontSize: 9, color: S.textDim, letterSpacing: '0.04em' }}>
          Enter 换行 · 点击发送按钮发送
        </div>
      </div>
    </div>
  )
}
