import Anthropic from '@anthropic-ai/sdk'

export const model = process.env.AI_MODEL || 'claude-sonnet-4-6'

let _client: Anthropic | null = null

export function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.AI_API_KEY
    if (!apiKey) {
      throw new Error('AI_API_KEY is not set. Please configure it in your .env file.')
    }
    _client = new Anthropic({ apiKey })
  }
  return _client
}
