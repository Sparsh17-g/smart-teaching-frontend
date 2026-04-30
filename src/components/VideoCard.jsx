import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Eye, Clock, Heart, BookmarkPlus, Trash2 } from 'lucide-react'

export default function VideoCard({ video, onClick, index = 0, role, onDelete }) {
  const [liked,    setLiked]    = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [imgError, setImgError] = useState(false)
  const [hovered,  setHovered]  = useState(false)

  const FALLBACK_COLORS = [
    ['#1e1b4b', '#4338ca'],
    ['#0f2027', '#203a43'],
    ['#1a0533', '#4c1d95'],
    ['#0c1a1a', '#064e3b'],
    ['#1c0a00', '#7c2d12'],
  ]
  const [c1, c2] = FALLBACK_COLORS[video.id % FALLBACK_COLORS.length] || FALLBACK_COLORS[0]

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this video?')) return
    await onDelete(video._id || video.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.055 }}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.038)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(91,82,240,0.22)' : 'none',
        borderColor: hovered ? 'rgba(91,82,240,0.25)' : 'rgba(255,255,255,0.07)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: '156px', overflow: 'hidden' }}>
        {imgError ? (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${c1}, ${c2})` }} />
        ) : (
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
            onError={() => setImgError(true)}
          />
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(4,4,15,0.7) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        {/* Play overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(4,4,15,0.45)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.div
            whileHover={{ scale: 1.12 }}
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <Play size={19} style={{ color: '#1a1a40', marginLeft: 3 }} />
          </motion.div>
        </div>

        {/* Action buttons */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          display: 'flex', gap: 6,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.22s ease',
        }}>
          {[
            { icon: Heart,        active: liked, onClick: (e) => { e.stopPropagation(); setLiked(p => !p) }, color: '#f472b6' },
            { icon: BookmarkPlus, active: saved, onClick: (e) => { e.stopPropagation(); setSaved(p => !p) }, color: '#a5b4fc' },
          ].map(({ icon: Icon, active, onClick: btnClick, color }, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={btnClick}
              style={{
                width: 28, height: 28, borderRadius: '8px',
                background: active ? `${color}22` : 'rgba(8,8,24,0.75)',
                border: `1px solid ${active ? color + '44' : 'rgba(255,255,255,0.15)'}`,
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <Icon size={13} style={{ color: active ? color : '#a8b0cc', fill: active ? color : 'none' }} />
            </motion.button>
          ))}

          {/* Delete button — teacher only */}
          {role === 'teacher' && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleDelete}
              style={{
                width: 28, height: 28, borderRadius: '8px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={13} style={{ color: '#f87171' }} />
            </motion.button>
          )}
        </div>

        {/* Duration */}
        <div style={{
          position: 'absolute', bottom: 8, right: 8,
          background: 'rgba(4,4,15,0.82)',
          backdropFilter: 'blur(8px)',
          padding: '3px 8px', borderRadius: '6px',
          fontSize: '11px', fontWeight: 600, color: '#a8b0cc',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <Clock size={9} /> {video.duration}
        </div>

        {/* Subject badge */}
        <span className="tag tag-purple" style={{
          position: 'absolute', top: 8, left: 8,
          fontSize: '10px', backdropFilter: 'blur(8px)',
        }}>
          {video.subject}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 15px' }}>
        <h3 style={{
          fontSize: '13.5px', fontWeight: 600,
          lineHeight: 1.45, marginBottom: '10px',
          color: '#e8ecff',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
        }}>
          {video.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'linear-gradient(135deg, #5b52f0, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {video.instructor?.charAt(0) || 'T'}
            </div>
            <span style={{ fontSize: '12px', color: '#5a6280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {video.instructor}
            </span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', color: '#5a6280', flexShrink: 0 }}>
            <Eye size={11} /> {video.views}
          </span>
        </div>
      </div>
    </motion.div>
  )
}