import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCheck, Video, FileText } from 'lucide-react'
import Notifications from './Notifications'

export default function NotificationBell({ notices, videos }) {
  const [open,     setOpen]     = useState(false)
  const [read,     setRead]     = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Create notifications from notices and videos
    const notifs = [
      ...notices.slice(0, 5).map(n => ({
        id:      n._id || n.id,
        type:    'notice',
        title:   'New Notice Posted',
        message: n.title,
        time:    n.date || new Date(n.createdAt).toLocaleDateString(),
        icon:    FileText,
        color:   '#f59e0b',
      })),
      ...videos.slice(0, 5).map(v => ({
        id:      v._id || v.id,
        type:    'video',
        title:   'New Video Added',
        message: v.title,
        time:    v.date || new Date(v.createdAt).toLocaleDateString(),
        icon:    Video,
        color:   '#5b52f0',
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time))

    setNotifications(notifs)
  }, [notices, videos])

  const unreadCount = notifications.filter(n => !read.includes(n.id)).length

  const markAllRead = () => {
    setRead(notifications.map(n => n.id))
  }

  return (
    <div style={{ position: 'relative' }}>
        
      {/* Bell button */}
      <Notifications notices={[]} videos={[]} />

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 40 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              style={{
                position: 'absolute',
                right: 0, top: '44px',
                width: '340px',
                background: 'rgba(10,10,30,0.97)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(20px)',
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="tag tag-purple" style={{ fontSize: '10px' }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{
                        fontSize: '11px', color: '#a5b4fc',
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}
                    >
                      <CheckCheck size={12} /> Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a6280' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Notifications list */}
              <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)', fontSize: '13px' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif, i) => {
                    const isRead = read.includes(notif.id)
                    const Icon = notif.icon
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setRead(p => [...p, notif.id])}
                        style={{
                          display: 'flex', gap: '12px', alignItems: 'flex-start',
                          padding: '14px 20px',
                          background: isRead ? 'transparent' : 'rgba(91,82,240,0.06)',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = isRead ? 'transparent' : 'rgba(91,82,240,0.06)'}
                      >
                        <div style={{
                          width: 36, height: 36,
                          borderRadius: '10px',
                          background: `${notif.color}22`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Icon size={16} style={{ color: notif.color }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '2px' }}>
                            {notif.title}
                          </p>
                          <p style={{ fontSize: '12px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {notif.message}
                          </p>
                          <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>
                            {notif.time}
                          </p>
                        </div>
                        {!isRead && (
                          <div style={{
                            width: 8, height: 8,
                            borderRadius: '50%',
                            background: '#5b52f0',
                            flexShrink: 0,
                            marginTop: '4px',
                          }} />
                        )}
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}