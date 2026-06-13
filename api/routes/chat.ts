import { Router, type Request, type Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { getClient, model } from '../lib/ai.js'
import { AppError } from '../lib/http.js'
import type { ChatMessage, MetaDesignSpace } from '../lib/types.js'

const router = Router()

const GATHERING_SYSTEM = `你是一个信息设计协作助手，正在帮助设计师整理任务背景。
请通过简短对话了解：任务目标、目标受众、发布渠道、视觉风格偏好。
不要生成任何设计内容，只做对话引导。每次回复控制在 2-3 句以内，语气简洁直接。`

function buildSystemPrompt(meta: MetaDesignSpace, phase?: string): string {
  if (phase === 'gathering') return GATHERING_SYSTEM

  const parts = [
    `你是一个信息设计协作助手，帮助设计师完成信息设计任务。你的职责是：
1. 理解设计师的意图并给出具体、可操作的建议
2. 根据元设计空间约束提供修改建议或生成内容
3. 保持回复简洁，聚焦在设计决策上`,
  ]
  if (meta.principles.length > 0) {
    parts.push(`\n当前设计原则：`)
    meta.principles.forEach(p => parts.push(`- ${p.content}`))
  }
  if (meta.task.goal) {
    parts.push(`\n当前任务：${meta.task.goal}，受众：${meta.task.audience || '未指定'}`)
  }
  return parts.join('\n')
}

router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  const { messages, metaSpace, phase } = req.body as { messages: ChatMessage[]; metaSpace: MetaDesignSpace; phase?: string }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new AppError('messages is required', { statusCode: 400, code: 'MISSING_MESSAGES' })
  }

  const meta: MetaDesignSpace = metaSpace || {
    task: { goal: '', audience: '', channel: '', constraints: '' },
    style: { keywords: [], referenceImages: [], colorDirection: '' },
    principles: [],
    modules: [],
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  const client = getClient()

  // Anthropic requires alternating user/assistant, filter out system action messages
  const filtered = messages.filter(m => !m.isSystemAction && (m.role === 'user' || m.role === 'assistant'))
  // ensure starts with user
  const anthropicMessages = filtered
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  if (anthropicMessages.length === 0 || anthropicMessages[0].role !== 'user') {
    res.write(`data: ${JSON.stringify({ error: 'No user message' })}\n\n`)
    res.end()
    return
  }

  try {
    const stream = await client.messages.create({
      model,
      max_tokens: 1024,
      system: buildSystemPrompt(meta, phase),
      messages: anthropicMessages,
      stream: true,
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`)
      }
    }

    res.write(`data: [DONE]\n\n`)
    res.end()
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`)
    res.end()
  }
})

export default router
