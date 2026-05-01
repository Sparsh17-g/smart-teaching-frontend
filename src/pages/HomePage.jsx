import { motion } from 'framer-motion'
import { PlayCircle, Bell, Users, BookOpen } from 'lucide-react'
import { StatCardSkeleton } from '../components/Skeleton'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function HomePage({ role, user, videos, notices, onVideoClick, setActiveNav, loading }) {
  const stats = [
    { label: 'Total Videos',   value: videos.length,   icon: PlayCircle, color: '#5b52f0' },
    { label: 'Active Notices', value: notices.length,  icon: Bell,       color: '#10b981' },
    { label: 'Students',       value: 142,             icon: Users,      color: '#f59e0b' },
    { label: 'Subjects',       value: 8,               icon: BookOpen,   color: '#ec4899' },
  ]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '28px' }}
      >
        <h1 className="font-display font-bold" style={{ fontSize: '32px', marginBottom: '4px' }}>
          {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>
          Here's what's happening on your platform today.
        </p>
      </motion.div>

      {/* Stats grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}
        >
          {stats.map(s => (
            <motion.div
              key={s.label}
              variants={item}
              className="glass"
              style={{ borderRadius: '16px', padding: '20px', cursor: 'default' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)' }}>
                  {s.label}
                </span>
                <div style={{ width: 32, height: 32, borderRadius: '10px', background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-1)', fontFamily: 'Outfit, sans-serif' }}>
                {s.value}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Recent videos + latest notices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Recent Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass"
          style={{ borderRadius: '16px', padding: '20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '15px' }}>Recent Videos</h3>
            <button
              onClick={() => setActiveNav('videos')}
              style={{ fontSize: '12px', color: '#a5b4fc', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View all →
            </button>
          </div>

          {videos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)', fontSize: '13px' }}>
              No videos yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {videos.slice(0, 4).map(v => (
                <div
                  key={v._id || v.id}
                  onClick={() => onVideoClick(v)}
                  style={{
                    display: 'flex', gap: '12px', padding: '8px',
                    borderRadius: '10px', cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <img
                    src={v.thumbnail || `https://picsum.photos/seed/${v._id}/400/225`}
                    alt=""
                    style={{ width: 64, height: 40, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                    onError={e => { e.target.style.background = '#1a1a3e'; e.target.removeAttribute('src') }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {v.title}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                      {v.duration} · {v.views} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Latest Notices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass"
          style={{ borderRadius: '16px', padding: '20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '15px' }}>Latest Notices</h3>
            <button
              onClick={() => setActiveNav('notices')}
              style={{ fontSize: '12px', color: '#a5b4fc', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View all →
            </button>
          </div>

          {notices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)', fontSize: '13px' }}>
              No notices yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notices.slice(0, 4).map(n => (
                <div
                  key={n._id || n.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {n.title}
                    </p>
                    <span className={`tag ${n.priority === 'high' ? 'tag-amber' : n.priority === 'medium' ? 'tag-purple' : 'tag-green'}`}>
                      {n.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                    {n.date || new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}