import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Clock, Tag, ChevronDown, ChevronUp, AlertTriangle, Info, CheckCircle2, Trash2 } from 'lucide-react'

const PRIORITY_CONFIG = {
  high:   { cls: 'tag-amber',  icon: AlertTriangle, glow: 'rgba(245,158,11,0.12)' },
  medium: { cls: 'tag-purple', icon: Info,           glow: 'rgba(91,82,240,0.1)'  },
  low:    { cls: 'tag-green',  icon: CheckCircle2,   glow: 'rgba(16,185,129,0.08)'},
}

export default function NoticeCard({ notice, index = 0, role, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const cfg = PRIORITY_CONFIG[notice.priority] || PRIORITY_CONFIG.medium
  const PriorityIcon = cfg.icon

  const handleDelete = async () => {
    if (!window.confirm('Delete this notice?')) return
    setDeleting(true)
    await onDelete(notice._id || notice.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -14, y: 6 }}
      animate={{ opacity: deleting ? 0 : 1, x: 0, y: 0, height: deleting ? 0 : 'auto' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.038)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Priority accent line */}
      <div style={{
        height: '2px',
        background: notice.priority === 'high'
          ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
          : notice.priority === 'medium'
            ? 'linear-gradient(90deg, #5b52f0, #7c3aed)'
            : 'linear-gradient(90deg, #10b981, #06b6d4)',
        opacity: 0.7,
      }} />

      <div style={{ padding: '18px 20px' }}>
        {/* Header */}
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div style={{
              width: 32, height: 32,
              borderRadius: '10px',
              background: cfg.glow,
              border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <PriorityIcon size={15} style={{
                color: notice.priority === 'high' ? '#fcd34d' :
                       notice.priority === 'medium' ? '#a5b4fc' : '#6ee7b7'
              }} />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f0f2ff' }}>
              {notice.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`tag ${cfg.cls} capitalize`}>{notice.priority}</span>
            {notice.subject && (
              <span style={{
                fontSize: '11px', color: '#5a6280',
                padding: '3px 9px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '999px',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <Tag size={9} /> {notice.subject}
              </span>
            )}
            {/* Delete button — teacher only */}
            {role === 'teacher' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                style={{
                  width: 28, height: 28,
                  borderRadius: '8px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#f87171',
                }}
              >
                <Trash2 size={13} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Content */}
        <p style={{
          fontSize: '13px', color: '#a8b0cc',
          lineHeight: 1.65, marginBottom: '14px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: expanded ? 'unset' : 2,
        }}>
          {notice.content}
        </p>

        {/* Footer */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#5a6280' }}>
              <User size={12} /> {notice.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#5a6280' }}>
              <Clock size={12} /> {notice.date || new Date(notice.createdAt).toLocaleDateString()}
            </span>
          </div>

          {notice.content?.length > 80 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setExpanded(p => !p)}
              style={{
                fontSize: '11px', color: '#a5b4fc',
                fontWeight: 600, background: 'none',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              {expanded ? <><ChevronUp size={13} /> Less</> : <><ChevronDown size={13} /> Read more</>}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}