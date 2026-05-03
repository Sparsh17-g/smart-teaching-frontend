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
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(91,82,240,0.15) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.10) 0%, transparent 55%),
          #04040f
        `,
      }}
    >
      <div style={{ width: '100%' }}>{children}</div>
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

export default function LoginPage({ onLogin, onGoSignup, onGuestLogin }) {
  const [email,      setEmail]      = useState('')
  const [password,   setPass]       = useState('')
  const [showPass,   setShowP]      = useState(false)
  const [errors,     setErrors]     = useState({})
  const [step,       setStep]       = useState('form') // 'form' | 'role'
  const [selected,   setSelected]   = useState('')
  const [loading,    setLoading]    = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isGuest,    setIsGuest]    = useState(false)

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
    setSelected('')
    setLoginError('')
    setStep('role')
  }

  const handleGuestClick = () => {
    setIsGuest(true)
    setSelected('')
    setLoginError('')
    setStep('role')
  }

  const handleEnterPlatform = async () => {
    if (!selected) return
    setLoading(true)
    setLoginError('')

    try {
      if (isGuest) {
        onGuestLogin(selected)
      } else {
        const ok = await onLogin(email, password, selected)
        if (!ok) {
          setLoginError('Invalid email or password for this role!')
          setLoading(false)
        }
      }
    } catch (err) {
      setLoginError('Something went wrong!')
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #5b52f0, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(91,82,240,0.38)',
          }}>
            <GraduationCap size={28} color="#fff" />
          </div>
          <h1 style={{
            fontSize: '28px', fontWeight: 800,
            fontFamily: 'Outfit, sans-serif',
            background: 'linear-gradient(135deg, #a5b4fc, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px',
          }}>
            Smart Teaching
          </h1>
          <p style={{ fontSize: '14px', color: '#5a6280' }}>
            Sign in to continue learning
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.038)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          backdropFilter: 'blur(16px)',
        }}>

          <AnimatePresence mode="wait">

            {/* Step 1 — Login form */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Email */}
                  <div>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '11px', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      color: '#5a6280', marginBottom: '8px',
                    }}>
                      <Mail size={12} /> Email
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                        setErrors(p => ({ ...p, email: '' }))
                      }}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                    {errors.email && (
                      <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '11px', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      color: '#5a6280', marginBottom: '8px',
                    }}>
                      <Lock size={12} /> Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="input-field"
                        style={{ paddingRight: '44px' }}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => {
                          setPass(e.target.value)
                          setErrors(p => ({ ...p, password: '' }))
                        }}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowP(p => !p)}
                        style={{
                          position: 'absolute', right: '12px',
                          top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none',
                          cursor: 'pointer', color: '#5a6280',
                        }}
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Sign in button */}
                  <Button
                    className="w-full"
                    style={{ padding: '13px', fontSize: '15px', marginTop: '4px' }}
                    onClick={handleSubmit}
                  >
                    Sign In →
                  </Button>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                    <span style={{ fontSize: '12px', color: '#5a6280' }}>OR</span>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                  </div>

                  {/* Guest button */}
                  <Button
                    variant="ghost"
                    className="w-full"
                    style={{ padding: '13px' }}
                    onClick={handleGuestClick}
                  >
                    Continue as Guest
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Role selection */}
            {step === 'role' && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Back button */}
                <button
                  onClick={() => { setStep('form'); setLoginError('') }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '13px', color: '#5a6280',
                    background: 'none', border: 'none',
                    cursor: 'pointer', marginBottom: '20px',
                  }}
                >
                  ← Back
                </button>

                <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '6px' }}>
                  {isGuest ? 'Continue as Guest' : 'Select your role'}
                </h2>
                <p style={{ fontSize: '13px', color: '#5a6280', marginBottom: '20px' }}>
                  Choose how you want to access the platform
                </p>

                {/* Error */}
                {loginError && (
                  <div style={{
                    padding: '10px 14px', borderRadius: '10px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171', fontSize: '13px',
                    marginBottom: '16px',
                  }}>
                    {loginError}
                  </div>
                )}

                {/* Role cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {ROLES.map(({ id, icon: Icon, title, description, accent }) => {
                    const active = selected === id
                    return (
                      <motion.button
                        key={id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => { setSelected(id); setLoginError('') }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '14px',
                          padding: '16px', borderRadius: '14px', textAlign: 'left',
                          border: `2px solid ${active ? accent : 'rgba(255,255,255,0.08)'}`,
                          background: active ? `${accent}18` : 'rgba(255,255,255,0.03)',
                          cursor: 'pointer', transition: 'all 0.2s ease',
                          width: '100%',
                        }}
                      >
                        <div style={{
                          width: 44, height: 44, borderRadius: '12px',
                          background: active ? accent : 'rgba(255,255,255,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, transition: 'all 0.2s ease',
                        }}>
                          <Icon size={20} color={active ? '#fff' : '#718096'} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0f2ff', marginBottom: '2px' }}>
                            {title}
                          </p>
                          <p style={{ fontSize: '12px', color: '#5a6280' }}>
                            {description}
                          </p>
                        </div>
                        {active && <CheckCircle size={18} color={accent} style={{ flexShrink: 0 }} />}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Enter button */}
                <Button
                  className="w-full"
                  style={{ padding: '13px', fontSize: '15px' }}
                  disabled={!selected}
                  loading={loading}
                  onClick={handleEnterPlatform}
                >
                  Enter Platform →
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Signup link */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#5a6280' }}>
          No account?{' '}
          <button
            onClick={onGoSignup}
            style={{
              color: '#a5b4fc', fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            Create one →
          </button>
        </p>
      </div>
    </AuthShell>
  )
}