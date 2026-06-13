import { create } from 'zustand'

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
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  isSystemAction?: boolean
  principleExtracted?: string | null
}

export interface DesignVersion {
  id: string
  html: string
  createdAt: number
  label: string
  taskGoal: string
}

interface WorkspaceState {
  metaSpace: MetaDesignSpace
  generatedHtml: string | null
  versions: DesignVersion[]
  activeVersionId: string | null
  skeletonOpacity: number
  selectedObjectId: string | null
  selectedModuleId: string | null
  messages: ChatMessage[]
  isGenerating: boolean
  streamingContent: string
  newPrincipleId: string | null
  chatPhase: 'gathering' | 'editing'

  updateTask: (patch: Partial<TaskContext>) => void
  updateStyle: (patch: Partial<VisualStyle>) => void
  addPrinciple: (content: string, source: 'manual' | 'extracted') => string
  removePrinciple: (id: string) => void
  updateModule: (id: string, patch: Partial<SkeletonModule>) => void
  moveModule: (id: string, newOrder: number) => void
  updateObject: (moduleId: string, objId: string, patch: Partial<ContentObject>) => void
  setSelectedObject: (id: string | null) => void
  setSelectedModule: (id: string | null) => void
  appendMessage: (msg: Omit<ChatMessage, 'id'>) => string
  updateMessage: (id: string, patch: Partial<ChatMessage>) => void
  setGeneratedHtml: (html: string) => void
  setSkeletonFromExtraction: (modules: SkeletonModule[]) => void
  setSkeletonOpacity: (v: number) => void
  setIsGenerating: (v: boolean) => void
  setStreamingContent: (v: string) => void
  clearNewPrincipleId: () => void
  applyExtractedMeta: (extracted: Partial<MetaDesignSpace>) => void
  setChatPhase: (phase: 'gathering' | 'editing') => void
  restoreVersion: (id: string) => void
  updateHtmlContent: (html: string) => void
}

const defaultMeta: MetaDesignSpace = {
  task: { goal: '', audience: '', channel: '', constraints: '' },
  style: { keywords: [], referenceImages: [], colorDirection: '' },
  principles: [],
  modules: [],
}

let _msgId = 0
const nextId = () => `msg-${++_msgId}`

let _principleId = 0
const nextPrincipleId = () => `principle-${++_principleId}`

let _versionId = 0
const nextVersionId = () => `v${++_versionId}`

const LS_KEY = 'meta_design_versions'

function loadVersionsFromStorage(): DesignVersion[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? (JSON.parse(raw) as DesignVersion[]) : []
  } catch { return [] }
}

function saveVersionsToStorage(versions: DesignVersion[]) {
  try {
    // keep max 20 versions, drop oldest
    const trimmed = versions.slice(-20)
    localStorage.setItem(LS_KEY, JSON.stringify(trimmed))
  } catch { /* storage full – skip */ }
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  metaSpace: defaultMeta,
  generatedHtml: null,
  versions: loadVersionsFromStorage(),
  activeVersionId: null,
  skeletonOpacity: 0,
  selectedObjectId: null,
  selectedModuleId: null,
  messages: [],
  isGenerating: false,
  streamingContent: '',
  newPrincipleId: null,
  chatPhase: 'gathering',

  updateTask: (patch) =>
    set(s => ({ metaSpace: { ...s.metaSpace, task: { ...s.metaSpace.task, ...patch } } })),

  updateStyle: (patch) =>
    set(s => ({
      metaSpace: {
        ...s.metaSpace,
        style: {
          ...s.metaSpace.style,
          ...patch,
          keywords: patch.keywords !== undefined ? patch.keywords : s.metaSpace.style.keywords,
        },
      },
    })),

  addPrinciple: (content, source) => {
    const id = nextPrincipleId()
    set(s => ({
      metaSpace: {
        ...s.metaSpace,
        principles: [
          { id, content, source, createdAt: Date.now() },
          ...s.metaSpace.principles,
        ],
      },
      newPrincipleId: id,
    }))
    return id
  },

  removePrinciple: (id) =>
    set(s => ({
      metaSpace: {
        ...s.metaSpace,
        principles: s.metaSpace.principles.filter(p => p.id !== id),
      },
    })),

  updateModule: (id, patch) =>
    set(s => ({
      metaSpace: {
        ...s.metaSpace,
        modules: s.metaSpace.modules.map(m => (m.id === id ? { ...m, ...patch } : m)),
      },
    })),

  moveModule: (id, newOrder) => {
    const modules = [...get().metaSpace.modules].sort((a, b) => a.order - b.order)
    const idx = modules.findIndex(m => m.id === id)
    if (idx === -1) return
    const [moved] = modules.splice(idx, 1)
    modules.splice(newOrder, 0, moved)
    const reordered = modules.map((m, i) => ({ ...m, order: i }))
    set(s => ({ metaSpace: { ...s.metaSpace, modules: reordered } }))
  },

  updateObject: (moduleId, objId, patch) =>
    set(s => ({
      metaSpace: {
        ...s.metaSpace,
        modules: s.metaSpace.modules.map(m =>
          m.id === moduleId
            ? { ...m, objects: m.objects.map(o => (o.id === objId ? { ...o, ...patch } : o)) }
            : m
        ),
      },
    })),

  setSelectedObject: (id) => set({ selectedObjectId: id }),
  setSelectedModule: (id) => set({ selectedModuleId: id }),

  appendMessage: (msg) => {
    const id = nextId()
    set(s => ({ messages: [...s.messages, { ...msg, id }] }))
    return id
  },

  updateMessage: (id, patch) =>
    set(s => ({ messages: s.messages.map(m => (m.id === id ? { ...m, ...patch } : m)) })),

  setGeneratedHtml: (html) => {
    const state = get()
    const versionNumber = state.versions.length + 1
    const newVersion: DesignVersion = {
      id: nextVersionId(),
      html,
      createdAt: Date.now(),
      label: `v${versionNumber}`,
      taskGoal: state.metaSpace.task.goal || '无标题',
    }
    const updated = [...state.versions, newVersion]
    saveVersionsToStorage(updated)
    set({ generatedHtml: html, versions: updated, activeVersionId: newVersion.id })
  },

  restoreVersion: (id) => {
    const version = get().versions.find(v => v.id === id)
    if (version) set({ generatedHtml: version.html, activeVersionId: id })
  },

  updateHtmlContent: (html) => set({ generatedHtml: html }),

  setSkeletonFromExtraction: (modules) =>
    set(s => ({ metaSpace: { ...s.metaSpace, modules } })),

  setSkeletonOpacity: (v) => set({ skeletonOpacity: v }),
  setIsGenerating: (v) => set({ isGenerating: v }),
  setStreamingContent: (v) => set({ streamingContent: v }),
  clearNewPrincipleId: () => set({ newPrincipleId: null }),

  setChatPhase: (phase) => set({ chatPhase: phase }),

  applyExtractedMeta: (extracted) =>
    set(s => ({
      metaSpace: {
        task: extracted.task
          ? { ...s.metaSpace.task, ...extracted.task }
          : s.metaSpace.task,
        style: extracted.style
          ? { ...s.metaSpace.style, ...extracted.style }
          : s.metaSpace.style,
        principles: s.metaSpace.principles,
        modules: extracted.modules || s.metaSpace.modules,
      },
    })),
}))