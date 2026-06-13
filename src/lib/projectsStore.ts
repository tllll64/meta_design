import { create } from 'zustand'

export interface Project {
  id: string
  name: string
  description: string
  createdAt: number
  updatedAt: number
  thumbnail: string | null  // first generatedHtml version snapshot (base64 or null)
}

interface ProjectsState {
  projects: Project[]
  createProject: (name: string, description?: string) => string
  updateProject: (id: string, patch: Partial<Pick<Project, 'name' | 'description' | 'thumbnail' | 'updatedAt'>>) => void
  deleteProject: (id: string) => void
}

const LS_PROJECTS = 'meta_design_projects'

function load(): Project[] {
  try {
    const raw = localStorage.getItem(LS_PROJECTS)
    return raw ? (JSON.parse(raw) as Project[]) : []
  } catch { return [] }
}

function save(projects: Project[]) {
  try { localStorage.setItem(LS_PROJECTS, JSON.stringify(projects)) } catch { }
}

let _pid = 0
const nextId = () => `proj-${Date.now()}-${++_pid}`

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: load(),

  createProject: (name, description = '') => {
    const id = nextId()
    const now = Date.now()
    const project: Project = { id, name, description, createdAt: now, updatedAt: now, thumbnail: null }
    const updated = [project, ...get().projects]
    save(updated)
    set({ projects: updated })
    return id
  },

  updateProject: (id, patch) => {
    const updated = get().projects.map(p => p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p)
    save(updated)
    set({ projects: updated })
  },

  deleteProject: (id) => {
    // also clear project-specific workspace data
    try {
      localStorage.removeItem(`meta_design_versions_${id}`)
      localStorage.removeItem(`meta_design_workspace_${id}`)
    } catch { }
    const updated = get().projects.filter(p => p.id !== id)
    save(updated)
    set({ projects: updated })
  },
}))
