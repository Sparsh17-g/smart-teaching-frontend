import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import VideoCard from '../components/VideoCard'
import { VideoCardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import { SUBJECTS } from '../data/dummyData'

const FILTERS = ['All', ...SUBJECTS]

export default function VideosPage({ videos, onVideoClick, role, onDelete }) {
  const [filter,  setFilter]  = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const filtered = filter === 'All'
    ? videos
    : videos.filter(v => v.subject === filter)

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 className="font-display font-bold" style={{ fontSize: '28px', marginBottom: '4px' }}>
          Video Library
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>
          {videos.length} lectures available
        </p>
      </motion.div>

      {/* Filter pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}
      >
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: `1px solid ${filter === f ? '#5b52f0' : 'rgba(255,255,255,0.1)'}`,
              background: filter === f ? 'rgba(91,82,240,0.15)' : 'transparent',
              color: filter === f ? '#a5b4fc' : '#5a6280',
              transition: 'all 0.2s ease',
            }}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
          {Array(8).fill(null).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="PlayCircle"
          title="No Videos Found"
          description="No videos match the selected subject filter."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
          {filtered.map((v, i) => (
            <VideoCard
              key={v._id || v.id || i}
              video={v}
              index={i}
              role={role}
              onDelete={onDelete}
              onClick={() => onVideoClick(v)}
            />
          ))}
        </div>
      )}
    </div>
  )
}