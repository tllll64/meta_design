import { create } from 'zustand'

export interface GlobalPrinciple {
  id: string
  content: string
  scope: string  // e.g. "信息设计通用" / "品牌合规" / "可访问性"
  createdAt: number
}

export interface GlobalStylePreset {
  id: string
  name: string
  description: string
  keywords: string[]
  colorDirection: string
  createdAt: number
}

export interface GlobalLayoutPreset {
  id: string
  name: string
  description: string
  prompt: string  // injected into generate as structure constraint
  createdAt: number
}

export interface GlobalSpec {
  id: string
  name: string
  content: string  // free-text spec / brand doc
  createdAt: number
}

export interface GlobalMetaSpace {
  principles: GlobalPrinciple[]
  stylePresets: GlobalStylePreset[]
  layoutPresets: GlobalLayoutPreset[]
  specs: GlobalSpec[]
}

interface GlobalMetaState extends GlobalMetaSpace {
  addPrinciple: (content: string, scope: string) => void
  removePrinciple: (id: string) => void
  updatePrinciple: (id: string, patch: Partial<Pick<GlobalPrinciple, 'content' | 'scope'>>) => void

  addStylePreset: (name: string, description: string, keywords: string[], colorDirection: string) => void
  removeStylePreset: (id: string) => void

  addLayoutPreset: (name: string, description: string, prompt: string) => void
  removeLayoutPreset: (id: string) => void

  addSpec: (name: string, content: string) => void
  removeSpec: (id: string) => void
  updateSpec: (id: string, patch: Partial<Pick<GlobalSpec, 'name' | 'content'>>) => void
}

const LS_KEY = 'meta_design_global_meta'

function load(): GlobalMetaSpace {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw) as GlobalMetaSpace
  } catch { }
  return { principles: [], stylePresets: [], layoutPresets: [], specs: [] }
}

function save(state: GlobalMetaSpace) {
  try {
    const { principles, stylePresets, layoutPresets, specs } = state
    localStorage.setItem(LS_KEY, JSON.stringify({ principles, stylePresets, layoutPresets, specs }))
  } catch { }
}

let _id = 0
const uid = () => `gm-${Date.now()}-${++_id}`

export const useGlobalMetaStore = create<GlobalMetaState>((set, get) => {
  const persist = (updater: (s: GlobalMetaState) => Partial<GlobalMetaState>) => {
    set(s => {
      const patch = updater(s)
      const next = { ...s, ...patch }
      save(next)
      return patch
    })
  }

  const initial = load()

  return {
    ...initial,

    addPrinciple: (content, scope) =>
      persist(() => ({
        principles: [...get().principles, { id: uid(), content, scope, createdAt: Date.now() }],
      })),

    removePrinciple: (id) =>
      persist(() => ({ principles: get().principles.filter(p => p.id !== id) })),

    updatePrinciple: (id, patch) =>
      persist(() => ({
        principles: get().principles.map(p => p.id === id ? { ...p, ...patch } : p),
      })),

    addStylePreset: (name, description, keywords, colorDirection) =>
      persist(() => ({
        stylePresets: [...get().stylePresets, { id: uid(), name, description, keywords, colorDirection, createdAt: Date.now() }],
      })),

    removeStylePreset: (id) =>
      persist(() => ({ stylePresets: get().stylePresets.filter(p => p.id !== id) })),

    addLayoutPreset: (name, description, prompt) =>
      persist(() => ({
        layoutPresets: [...get().layoutPresets, { id: uid(), name, description, prompt, createdAt: Date.now() }],
      })),

    removeLayoutPreset: (id) =>
      persist(() => ({ layoutPresets: get().layoutPresets.filter(p => p.id !== id) })),

    addSpec: (name, content) =>
      persist(() => ({
        specs: [...get().specs, { id: uid(), name, content, createdAt: Date.now() }],
      })),

    removeSpec: (id) =>
      persist(() => ({ specs: get().specs.filter(s => s.id !== id) })),

    updateSpec: (id, patch) =>
      persist(() => ({
        specs: get().specs.map(s => s.id === id ? { ...s, ...patch } : s),
      })),
  }
})
