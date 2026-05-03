import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react'

export default function Navbar({ user, role, onToggleSidebar, onLogout, notices = [], videos = [] }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const initial = (user?.name || 'U').charAt(0).toUpperCase()

  return (
    <header style={{
      height: '62px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '12px',
      background: 'rgba(8,8,24,0.95)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
    }}>

      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        style={{
          padding: '8px', borderRadius: '10px',
          background: 'none', border: 'none',
          color: '#5a6280', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color 0.15s, background 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#a8b0cc'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#5a6280'; e.currentTarget.style.background = 'transparent' }}
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
        <Search size={14} style={{
          position: 'absolute', left: '12px',
          top: '50%', transform: 'translateY(-50%)',
          color: '#5a6280', pointerEvents: 'none',
        }} />
        <input
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f0f2ff',
            borderRadius: '10px',
            padding: '8px 12px 8px 36px',
            fontSize: '13px',
            outline: 'none',
          }}
          placeholder="Search videos, notices…"
        />
      </div>

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Role badge */}
        <span style={{
          padding: '3px 10px',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          background: role === 'teacher' ? 'rgba(91,82,240,0.18)' : 'rgba(16,185,129,0.14)',
          color: role === 'teacher' ? '#a5b4fc' : '#6ee7b7',
          border: role === 'teacher' ? '1px solid rgba(91,82,240,0.3)' : '1px solid rgba(16,185,129,0.25)',
        }}>
          {role}
        </span>

        {/* Notification bell */}
        <button style={{
          padding: '8px', borderRadius: '10px',
          background: 'none', border: 'none',
          color: '#5a6280', cursor: 'pointer',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color 0.15s, background 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#a8b0cc'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#5a6280'; e.currentTarget.style.background = 'transparent' }}
        >
          🔔
          {notices.length > 0 && (
            <span style={{
              position: 'absolute', top: '4px', right: '4px',
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#ec4899',
            }} />
          )}
        </button>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 10px', borderRadius: '10px',
              background: 'none', border: '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = 'transparent' }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #5b52f0, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#fff',
              flexShrink: 0,
            }}>
              {initial}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#f0f2ff' }}>
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={13} style={{ color: '#5a6280' }} />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {profileOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                  onClick={() => setProfileOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', right: 0, top: '48px',
                    width: '200px', borderRadius: '14px',
                    background: 'rgba(10,10,30,0.98)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 50, overflow: 'hidden',
                  }}
                >
                  {/* User info */}
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2ff', marginBottom: '2px' }}>
                      {user?.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#5a6280' }}>
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: '6px' }}>
                    {[
                      { icon: User,     label: 'Profile'  },
                      { icon: Settings, label: 'Settings' },
                    ].map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        onClick={() => setProfileOpen(false)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '9px 12px', borderRadius: '8px',
                          fontSize: '13px', color: '#a8b0cc',
                          background: 'none', border: 'none', cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#f0f2ff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#a8b0cc'; e.currentTarget.style.background = 'transparent' }}
                      >
                        <Icon size={14} /> {label}
                      </button>
                    ))}
                  </div>

                  <div style={{ padding: '6px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <button
                      onClick={() => { setProfileOpen(false); onLogout() }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 12px', borderRadius: '8px',
                        fontSize: '13px', color: '#f87171',
                        background: 'none', border: 'none', cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}