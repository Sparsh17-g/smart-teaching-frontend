import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, PlayCircle, Bell, Upload,
  GraduationCap, LogOut, ChevronLeft,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home',    icon: LayoutDashboard, label: 'Home' },
  { id: 'videos',  icon: PlayCircle,      label: 'Videos' },
  { id: 'notices', icon: Bell,            label: 'Notice Board' },
]

const TEACHER_ONLY = [
  { id: 'upload', icon: Upload, label: 'Upload' },
]

export default function Sidebar({ role, activeNav, setActiveNav, isOpen, onToggle, onLogout }) {
  const items = role === 'teacher' ? [...NAV_ITEMS, ...TEACHER_ONLY] : NAV_ITEMS

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <motion.aside
        animate={{ width: isOpen ? 240 : 72 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col shrink-0 sticky top-0 h-screen
                   bg-surface-50/95 border-r border-white/[0.06] overflow-hidden z-40"
      >
        <SidebarContent
          items={items}
          isOpen={isOpen}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onToggle={onToggle}
          onLogout={onLogout}
        />
      </motion.aside>

      {/* ── Mobile drawer ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />

            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-60 flex flex-col
                         bg-surface-50 border-r border-white/[0.06] z-50 md:hidden"
            >
              <SidebarContent
                items={items}
                isOpen={true}
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

function SidebarContent({ items, isOpen, activeNav, setActiveNav, onToggle, onLogout, mobile }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center
                        justify-center shrink-0 shadow-brand">
          <GraduationCap size={18} color="#fff" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="gradient-text font-display font-bold text-base whitespace-nowrap"
            >
              Smart Teaching
            </motion.span>
          )}
        </AnimatePresence>

        {/* Collapse button (desktop only) */}
        {!mobile && (
          <button
            onClick={onToggle}
            className="ml-auto p-1 rounded-lg text-slate-600 hover:text-slate-400
                       hover:bg-white/5 transition-all duration-200"
          >
            <motion.div animate={{ rotate: isOpen ? 0 : 180 }}>
              <ChevronLeft size={16} />
            </motion.div>
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-1">
        {items.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className={`nav-item w-full ${activeNav === id ? 'active' : ''} ${!isOpen ? 'justify-center' : ''}`}
          >
            <Icon size={18} className="shrink-0" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2.5 pb-4 border-t border-white/[0.06] pt-3">
        <button
          onClick={onLogout}
          className={`nav-item w-full hover:text-red-400 hover:bg-red-500/5 ${!isOpen ? 'justify-center' : ''}`}
        >
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  )
}
