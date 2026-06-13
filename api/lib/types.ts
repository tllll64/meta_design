export interface TaskContext {
  goal: string
  audience: string
  channel: string
  constraints: string
}

export interface VisualStyle {
  keywords: string[]
  referenceImages: string[]
  colorDirection: string
}

export interface DesignPrinciple {
  id: string
  content: string
  source: 'manual' | 'extracted'
  createdAt: number
}

export interface ContentObject {
  id: string
  type: 'text' | 'image' | 'chart' | 'data' | 'cta' | 'card' | 'icon' | 'logo'
  semantics: 'headline' | 'subheadline' | 'conclusion' | 'support' | 'source' | 'brand' | 'decoration'
  importance: 'highest' | 'high' | 'medium' | 'low'
  editPermission: 'free' | 'confirm' | 'locked'
  rect: { x: number; y: number; width: number; height: number }
  moduleId: string
}

export interface SkeletonModule {
  id: string
  label: string
  order: number
  rect: { x: number; y: number; width: number; height: number }
  locked: boolean
  objects: ContentObject[]
}

export interface MetaDesignSpace {
  task: TaskContext
  style: VisualStyle
  principles: DesignPrinciple[]
  modules: SkeletonModule[]
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}