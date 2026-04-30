import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react'

export default function Navbar({ user, role, onToggleSidebar, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const initial = (user?.name || 'U').charAt(0).toUpperCase()

  return (
    <header className="h-[60px] sticky top-0 z-50 flex items-center px-5 gap-4
                       bg-surface-50/90 border-b border-white/[0.06] backdrop-blur-xl">
      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-xl text-slate-500 hover:text-slate-300
                   hover:bg-white/5 transition-all duration-200"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-xs hidden sm:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <input
          className="input-field h-9 pl-9 text-xs"
          placeholder="Search videos, notices…"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Role badge */}
        <span className={`tag ${role === 'teacher' ? 'tag-purple' : 'tag-green'} capitalize hidden sm:inline`}>
          {role}
        </span>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-300
                           hover:bg-white/5 transition-all duration-200">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(p => !p)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl
                       hover:bg-white/5 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center
                            justify-center text-xs font-bold text-white shrink-0">
              {initial}
            </div>
            <span className="text-sm font-semibold text-slate-200 hidden md:block">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={14} className="text-slate-500 hidden md:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 glass rounded-xl overflow-hidden
                           shadow-card z-50 border border-white/10"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>

                {[
                  { icon: User, label: 'Profile' },
                  { icon: Settings, label: 'Settings' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                               text-slate-400 hover:text-slate-200 hover:bg-white/5
                               transition-all duration-150"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}

                <div className="border-t border-white/[0.06]">
                  <button
                    onClick={() => { setProfileOpen(false); onLogout() }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                               text-red-400 hover:text-red-300 hover:bg-red-500/5
                               transition-all duration-150"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
