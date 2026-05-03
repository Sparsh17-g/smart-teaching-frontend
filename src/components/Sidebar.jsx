import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, PlayCircle, Bell, Upload,
  GraduationCap, LogOut, ChevronLeft, User, Calendar, X,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home',      icon: LayoutDashboard, label: 'Home',         color: '#a5b4fc' },
  { id: 'videos',    icon: PlayCircle,      label: 'Videos',       color: '#6ee7b7' },
  { id: 'notices',   icon: Bell,            label: 'Notice Board', color: '#fcd34d' },
  { id: 'timetable', icon: Calendar,        label: 'Timetable',    color: '#f9a8d4' },
  { id: 'profile',   icon: User,            label: 'Profile',      color: '#fb923c' },
]

const TEACHER_ONLY = [
  { id: 'upload', icon: Upload, label: 'Upload', color: '#86efac' },
]

export default function Sidebar({ role, activeNav, setActiveNav, isOpen, onToggle, onLogout }) {
  const items = role === 'teacher' ? [...NAV_ITEMS, ...TEACHER_ONLY] : NAV_ITEMS

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isOpen ? 240 : 72 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          background: 'rgba(6,6,20,0.98)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
          zIndex: 40,
        }}
      >
        <SidebarInner
          items={items}
          isOpen={isOpen}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onToggle={onToggle}
          onLogout={onLogout}
        />
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.6)',
                zIndex: 40,
                display: 'none',
              }}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', left: 0, top: 0,
                height: '100%', width: '240px',
                display: 'flex', flexDirection: 'column',
                background: 'rgba(6,6,20,0.98)',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                zIndex: 50,
              }}
            >
              <SidebarInner
                items={items}
                isOpen
                activeNav={activeNav}
                setActiveNav={(id) => { setActiveNav(id); onToggle() }}
                onToggle={onToggle}
                onLogout={onLogout}
                mobile
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function SidebarInner({ items, isOpen, activeNav, setActiveNav, onToggle, onLogout, mobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, #5b52f0, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(91,82,240,0.4)',
        }}>
          <GraduationCap size={18} color="#fff" />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 700, fontSize: '15px',
                background: 'linear-gradient(135deg, #a5b4fc, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap', flex: 1,
              }}
            >
              Smart Teaching
            </motion.span>
          )}
        </AnimatePresence>

        {!mobile && isOpen && (
          <button
            onClick={onToggle}
            style={{
              padding: '6px', borderRadius: '8px',
              background: 'none', border: 'none',
              color: '#5a6280', cursor: 'pointer',
              flexShrink: 0,
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#a8b0cc'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5a6280'; e.currentTarget.style.background = 'transparent' }}
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {!mobile && !isOpen && (
          <button
            onClick={onToggle}
            style={{
              padding: '6px', borderRadius: '8px',
              background: 'none', border: 'none',
              color: '#5a6280', cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            <motion.div animate={{ rotate: 180 }}>
              <ChevronLeft size={16} />
            </motion.div>
          </button>
        )}

        {mobile && (
          <button
            onClick={onToggle}
            style={{
              padding: '6px', borderRadius: '8px',
              background: 'none', border: 'none',
              color: '#5a6280', cursor: 'pointer', marginLeft: 'auto',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map(({ id, icon: Icon, label, color }) => {
          const active = activeNav === id
          return (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isOpen ? '11px' : '0',
                justifyContent: isOpen ? 'flex-start' : 'center',
                padding: '9px 12px',
                borderRadius: '10px',
                border: active ? '1px solid rgba(91,82,240,0.25)' : '1px solid transparent',
                background: active ? 'rgba(91,82,240,0.15)' : 'transparent',
                color: active ? color : '#5a6280',
                cursor: 'pointer',
                width: '100%',
                fontSize: '13.5px',
                fontWeight: 500,
                transition: 'all 0.18s ease',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(91,82,240,0.08)'
                  e.currentTarget.style.color = '#a8b0cc'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#5a6280'
                }
              }}
            >
              {/* Active indicator */}
              {active && (
                <div style={{
                  position: 'absolute', left: 0,
                  top: '20%', height: '60%', width: '3px',
                  borderRadius: '0 3px 3px 0',
                  background: 'linear-gradient(to bottom, #5b52f0, #7c3aed)',
                }} />
              )}

              <div style={{
                width: 26, height: 26, borderRadius: '8px', flexShrink: 0,
                background: active ? `${color}22` : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
                <Icon size={16} style={{ color: active ? color : '#5a6280', transition: 'color 0.2s' }} />
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.18 }}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isOpen ? '11px' : '0',
            justifyContent: isOpen ? 'flex-start' : 'center',
            padding: '9px 12px',
            borderRadius: '10px',
            border: '1px solid transparent',
            background: 'transparent',
            color: '#5a6280',
            cursor: 'pointer',
            width: '100%',
            fontSize: '13.5px',
            fontWeight: 500,
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fca5a5'
            e.currentTarget.style.background = 'rgba(239,68,68,0.07)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#5a6280'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                style={{ whiteSpace: 'nowrap' }}
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}