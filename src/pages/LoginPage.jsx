import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Mail, Lock, Eye, EyeOff,
  BookOpen, CheckCircle,
} from 'lucide-react'
import Button from '../components/Button'

export function AuthShell({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.10) 0%, transparent 55%),
          #04040f
        `,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative w-full">{children}</div>
    </div>
  )
}

const ROLES = [
  {
    id: 'teacher',
    icon: BookOpen,
    title: 'Teacher',
    description: 'Upload content, post notices',
    accent: '#5b52f0',
  },
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student',
    description: 'Watch lectures, read notices',
    accent: '#10b981',
  },
]

function RoleModal({ email, password, onSelect, onCancel, onLogin, error }) {
  const [selected,  setSelected]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [localError, setLocalError] = useState('')

  const handleEnter = async () => {
    if (!selected) return
    setLoading(true)
    setLocalError('')
    const ok = await onLogin(email, password, selected)
    if (!ok) {
      setLocalError('Invalid email or password for this role!')
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: 'rgba(4,4,15,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{   opacity: 0, y: 28, scale: 0.96 }}
        transition={{ duration: 0.28 }}
        className="glass rounded-2xl p-8 w-full max-w-md"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="text-center mb-6">
          <div
            className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#5b52f0,#7c3aed)' }}
          >
            <GraduationCap size={22} color="#fff" />
          </div>
          <h2 className="font-display text-xl font-bold mb-1">Select Role</h2>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            Choose your role to continue
          </p>
        </div>

        {/* Error message */}
        {localError && (
          <div
            className="mb-4 p-3 rounded-xl text-sm text-center"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
            }}
          >
            {localError}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {ROLES.map(({ id, icon: Icon, title, description, accent }) => {
            const active = selected === id
            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => { setSelected(id); setLocalError('') }}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200"
                style={{
                  border:     `2px solid ${active ? accent : 'rgba(255,255,255,0.08)'}`,
                  background: active ? `${accent}18` : 'rgba(255,255,255,0.03)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: active ? accent : 'rgba(255,255,255,0.06)' }}
                >
                  <Icon size={20} color={active ? '#fff' : '#718096'} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{description}</p>
                </div>
                {active && <CheckCircle size={18} color={accent} />}
              </motion.button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 py-3"
            disabled={!selected}
            loading={loading}
            onClick={handleEnter}
          >
            Enter Platform →
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function LoginPage({ onLogin, onGoSignup, onGuestLogin }) {
  const [email,     setEmail]    = useState('')
  const [password,  setPass]     = useState('')
  const [showPass,  setShowP]    = useState(false)
  const [errors,    setErrors]   = useState({})
  const [showRole,  setShowRole] = useState(false)
  const [isGuest,   setIsGuest]  = useState(false)

  const validate = () => {
    const e = {}
    if (!email.trim())    e.email    = 'Email is required'
    if (!password.trim()) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setIsGuest(false)
    setShowRole(true)
  }

  const handleGuestClick = () => {
    setIsGuest(true)
    setShowRole(true)
  }

  const handleRoleSelect = async (role) => {
    if (isGuest) {
      setShowRole(false)
      onGuestLogin(role)
    }
  }

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] mx-auto"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 260 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg,#5b52f0,#7c3aed)', boxShadow: '0 8px 24px rgba(91,82,240,0.38)' }}
          >
            <GraduationCap size={28} color="#fff" />
          </motion.div>
          <h1 className="gradient-text font-display text-3xl font-bold mb-1">
            Smart Teaching
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            Sign in to continue learning
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-8"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
        >
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>
                <Mail size={13} /> Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              {errors.email && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>
                <Lock size={13} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPass(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowP(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            <Button className="w-full py-3 text-[15px]" onClick={handleSubmit}>
              Sign In →
            </Button>

            <div className="flex items-center gap-3">
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>OR</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
            </div>

            <Button variant="ghost" className="w-full py-3" onClick={handleGuestClick}>
              Continue as Guest
            </Button>
          </div>
        </motion.div>

        <p className="text-center mt-5 text-sm" style={{ color: 'var(--text-3)' }}>
          No account?{' '}
          <button
            onClick={onGoSignup}
            style={{ color: '#a5b4fc', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Create one →
          </button>
        </p>
      </motion.div>

      {/* Role modal */}
      <AnimatePresence>
        {showRole && !isGuest && (
          <RoleModal
            email={email}
            password={password}
            onLogin={onLogin}
            onCancel={() => setShowRole(false)}
          />
        )}
        {showRole && isGuest && (
          <RoleModal
            email=""
            password=""
            onLogin={() => {}}
            onCancel={() => setShowRole(false)}
            onSelect={handleRoleSelect}
          />
        )}
      </AnimatePresence>
    </AuthShell>
  )
}