import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import VideoCard from '../components/VideoCard'
import { VideoCardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import { SUBJECTS } from '../data/dummyData'

const FILTERS = ['All', ...SUBJECTS]

export default function VideosPage({ videos, onVideoClick, role, onDelete }) {
  const [filter,  setFilter]  = useState('All')
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const filtered = videos.filter(v => {
    const matchFilter = filter === 'All' || v.subject === filter
    const matchSearch = !search ||
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.subject?.toLowerCase().includes(search.toLowerCase()) ||
      v.instructor?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

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

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{ position: 'relative', marginBottom: '16px' }}
      >
        <Search
          size={15}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-3)',
          }}
        />
        <input
          className="input-field"
          style={{ paddingLeft: '42px', paddingRight: search ? '42px' : '16px' }}
          placeholder="Search by title, subject, instructor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-3)',
            }}
          >
            <X size={15} />
          </button>
        )}
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

      {/* Results count */}
      {search && (
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '16px' }}>
          Found <strong style={{ color: 'var(--text-1)' }}>{filtered.length}</strong> results for "{search}"
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
          {Array(8).fill(null).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="PlayCircle"
          title="No Videos Found"
          description={search ? `No videos match "${search}"` : 'No videos match the selected filter.'}
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