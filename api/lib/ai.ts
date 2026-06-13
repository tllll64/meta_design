import OpenAI from 'openai'

export const model = process.env.AI_MODEL || 'claude-sonnet-4-6'

let _client: OpenAI | null = null

export function getClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.AI_API_KEY
    if (!apiKey) {
      throw new Error('AI_API_KEY is not set. Please configure it in your .env file.')
    }
    _client = new OpenAI({
      apiKey,
      baseURL: process.env.AI_BASE_URL || undefined,
    })
  }
  return _client
}

export default { getClient, model }