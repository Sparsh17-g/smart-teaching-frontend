import { motion } from 'framer-motion'
import { PlayCircle, Bell, Users, BookOpen } from 'lucide-react'
import { StatCardSkeleton } from '../components/Skeleton'

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function HomePage({ role, user, videos, notices, onVideoClick, setActiveNav, loading }) {
  const stats = [
    { label: 'Total Videos',    value: videos.length, icon: PlayCircle, color: '#4f46e5' },
    { label: 'Active Notices',  value: notices.length, icon: Bell,       color: '#10b981' },
    { label: 'Students',        value: 142,            icon: Users,      color: '#f59e0b' },
    { label: 'Subjects',        value: 8,              icon: BookOpen,   color: '#ec4899' },
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
        className="mb-7"
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">
          {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-slate-500 text-sm">
          Here's what's happening on your platform today.
        </p>
      </motion.div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7">
          {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7"
        >
          {stats.map(s => (
            <motion.div key={s.label} variants={item} className="glass rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {s.label}
                </span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}22` }}
                >
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-100">{s.value}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Recent videos + latest notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recent Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm">Recent Videos</h3>
            <button
              onClick={() => setActiveNav('videos')}
              className="text-xs text-brand-400 hover:text-brand-200 transition-colors"
            >
              View all →
            </button>
          </div>

          <div className="space-y-2">
            {videos.slice(0, 4).map(v => (
              <div
                key={v.id}
                onClick={() => onVideoClick(v)}
                className="flex gap-3 p-2 rounded-xl cursor-pointer
                           hover:bg-white/[0.04] transition-colors duration-150"
              >
                <img
                  src={v.thumbnail}
                  alt=""
                  className="w-16 h-10 rounded-lg object-cover shrink-0"
                  onError={e => { e.target.style.background = '#1a1a3e'; e.target.removeAttribute('src') }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">{v.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{v.duration} · {v.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Latest Notices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm">Latest Notices</h3>
            <button
              onClick={() => setActiveNav('notices')}
              className="text-xs text-brand-400 hover:text-brand-200 transition-colors"
            >
              View all →
            </button>
          </div>

          <div className="space-y-2">
            {notices.slice(0, 4).map(n => (
              <div
                key={n.id}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="flex justify-between gap-2 mb-1">
                  <p className="text-xs font-medium text-slate-200 truncate flex-1">{n.title}</p>
                  <span
                    className={`tag shrink-0 ${
                      n.priority === 'high' ? 'tag-amber' :
                      n.priority === 'medium' ? 'tag-purple' : 'tag-green'
                    }`}
                  >
                    {n.priority}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{n.date}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
