import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectsStore, type Project } from '@/lib/projectsStore'

const S = {
  bg: 'oklch(0.985 0.002 260)',
  bgPage: 'oklch(0.96 0.003 260)',
  border: 'oklch(0.82 0.004 260)',
  borderStrong: 'oklch(0.12 0.005 260)',
  text: 'oklch(0.12 0.005 260)',
  textMid: 'oklch(0.38 0.005 260)',
  textDim: 'oklch(0.58 0.004 260)',
  surface: 'oklch(0.99 0.001 260)',
  accent: 'oklch(0.52 0.18 55)',
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  const mo = (d.getMonth() + 1).toString().padStart(2, '0')
  const dd = d.getDate().toString().padStart(2, '0')
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  return `${d.getFullYear()}.${mo}.${dd}  ${hh}:${mm}`
}

// ─── New Project Dialog ────────────────────────────────────────────────────────

function NewProjectDialog({ onClose }: { onClose: () => void }) {
  const { createProject } = useProjectsStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [nameFocused, setNameFocused] = useState(false)
  const [descFocused, setDescFocused] = useState(false)

  const handleCreate = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = createProject(trimmed, desc.trim())
    navigate(`/project/${id}`)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'oklch(0.12 0.005 260 / 0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: 440, background: S.surface,
        border: `1px solid ${S.borderStrong}`,
        borderRadius: 3, padding: 32,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.01em', color: S.text, marginBottom: 24 }}>
          新建项目
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.textDim, marginBottom: 6 }}>项目名称</div>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') onClose() }}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            placeholder="如：年度报告海报 / 618 活动主视觉"
            style={{
              width: '100%', padding: '8px 12px', fontSize: 13,
              fontFamily: 'inherit', color: S.text,
              background: nameFocused ? S.bg : 'oklch(0.97 0.002 260)',
              border: `1px solid ${nameFocused ? S.borderStrong : S.border}`,
              borderRadius: 3, outline: 'none',
              transition: 'border-color 0.12s, background 0.12s',
              boxSizing: 'border-box' as const,
            }}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.textDim, marginBottom: 6 }}>描述（可选）</div>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            onFocus={() => setDescFocused(true)}
            onBlur={() => setDescFocused(false)}
            placeholder="项目背景、目标受众、交付形式…"
            rows={3}
            style={{
              width: '100%', padding: '8px 12px', fontSize: 12,
              fontFamily: 'inherit', color: S.text, lineHeight: 1.55, resize: 'none',
              background: descFocused ? S.bg : 'oklch(0.97 0.002 260)',
              border: `1px solid ${descFocused ? S.borderStrong : S.border}`,
              borderRadius: 3, outline: 'none',
              transition: 'border-color 0.12s, background 0.12s',
              boxSizing: 'border-box' as const,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '7px 16px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', background: 'none', border: `1px solid ${S.border}`, borderRadius: 3, color: S.textMid }}
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            style={{
              padding: '7px 16px', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              background: name.trim() ? S.borderStrong : S.border,
              color: name.trim() ? 'oklch(0.97 0.002 260)' : S.textDim,
              border: 'none', borderRadius: 3,
              transition: 'background 0.12s',
            }}
          >
            创建并进入
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  const { deleteProject } = useProjectsStore()
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
      style={{
        border: `1px solid ${hovered ? S.borderStrong : S.border}`,
        borderRadius: 3, background: S.surface,
        transition: 'border-color 0.12s',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* thumbnail / placeholder */}
      <div
        onClick={() => navigate(`/project/${project.id}`)}
        style={{
          height: 120, background: S.bg,
          borderBottom: `1px solid ${S.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative',
        }}
      >
        {project.thumbnail ? (
          <iframe
            srcDoc={project.thumbnail}
            sandbox="allow-scripts"
            style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
            title="缩略图"
          />
        ) : (
          <span style={{ fontSize: 10, color: S.textDim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            暂无预览
          </span>
        )}
      </div>

      {/* info */}
      <div style={{ padding: '12px 14px', flex: 1 }} onClick={() => navigate(`/project/${project.id}`)}>
        <div style={{ fontSize: 13, fontWeight: 600, color: S.text, lineHeight: 1.3, marginBottom: 4 }}>
          {project.name}
        </div>
        {project.description && (
          <div style={{ fontSize: 11, color: S.textDim, lineHeight: 1.5, marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
            {project.description}
          </div>
        )}
        <div style={{ fontSize: 9, color: S.textDim, letterSpacing: '0.04em', marginTop: 'auto' }}>
          {formatDate(project.updatedAt)}
        </div>
      </div>

      {/* delete action */}
      {hovered && (
        <div style={{ padding: '0 14px 12px', display: 'flex', justifyContent: 'flex-end' }}>
          {confirmDelete ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: S.textMid }}>确认删除？</span>
              <button
                onClick={e => { e.stopPropagation(); deleteProject(project.id) }}
                style={{ padding: '2px 8px', fontSize: 10, fontFamily: 'inherit', cursor: 'pointer', background: S.borderStrong, color: 'oklch(0.97 0.002 260)', border: 'none', borderRadius: 2 }}
              >
                删除
              </button>
              <button
                onClick={e => { e.stopPropagation(); setConfirmDelete(false) }}
                style={{ padding: '2px 8px', fontSize: 10, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 2 }}
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); setConfirmDelete(true) }}
              style={{ padding: '2px 8px', fontSize: 10, fontFamily: 'inherit', cursor: 'pointer', background: 'none', color: S.textDim, border: `1px solid ${S.border}`, borderRadius: 2 }}
            >
              删除
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function ProjectHub() {
  const { projects } = useProjectsStore()
  const [showNew, setShowNew] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', background: S.bgPage,
      fontFamily: '"Hanken Grotesk", -apple-system, sans-serif',
      color: S.text,
    }}>
      {/* top bar */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', borderBottom: `1px solid ${S.border}`,
        background: S.surface, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.text }}>
            Meta Design
          </span>
          <span style={{ fontSize: 10, color: S.textDim, letterSpacing: '0.04em' }}>工作台</span>
        </div>
        <button
          onClick={() => setShowNew(true)}
          style={{
            padding: '6px 14px', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.04em', fontFamily: 'inherit', cursor: 'pointer',
            background: S.borderStrong, color: 'oklch(0.97 0.002 260)',
            border: 'none', borderRadius: 3, transition: 'background 0.12s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'oklch(0.28 0.005 260)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = S.borderStrong)}
        >
          + 新建项目
        </button>
      </div>

      {/* content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>
        {projects.length === 0 ? (
          /* empty state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 96, gap: 12 }}>
            <div style={{ fontSize: 32, color: S.border, fontWeight: 300 }}>✦</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: S.textMid, margin: 0 }}>还没有项目</p>
            <p style={{ fontSize: 12, color: S.textDim, margin: 0 }}>新建一个项目，开始元设计协作</p>
            <button
              onClick={() => setShowNew(true)}
              style={{
                marginTop: 16, padding: '8px 20px', fontSize: 12, fontWeight: 600,
                fontFamily: 'inherit', cursor: 'pointer',
                border: `1px solid ${S.borderStrong}`, borderRadius: 3,
                background: 'transparent', color: S.text, transition: 'background 0.12s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = S.bg)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              + 新建项目
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.textDim }}>
                所有项目 {projects.length}
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}>
              {projects.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </>
        )}
      </div>

      {showNew && <NewProjectDialog onClose={() => setShowNew(false)} />}
    </div>
  )
}
