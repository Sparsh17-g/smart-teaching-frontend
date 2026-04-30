import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, BookOpen, CheckCircle,
  ArrowLeft, User, Mail, Lock, Eye, EyeOff,
} from 'lucide-react'
import Button from '../components/Button'
import { AuthShell } from './LoginPage'

/* ─────────────────────────────────────────────────────────────
   Signup Page  (2-step: details → role)
───────────────────────────────────────────────────────────── */
const ROLES = [
  {
    id: 'teacher',
    icon: BookOpen,
    title: 'Teacher',
    description: 'Upload content, post notices, manage students',
    accent: '#4f46e5',
  },
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student',
    description: 'Watch lectures, stay updated with notices',
    accent: '#10b981',
  },
]

export default function SignupPage({ onSignup, onGoLogin, loading }) {
  const [step,     setStep]    = useState(1)
  const [showPass, setShowP]   = useState(false)
  const [errors,   setErrors]  = useState({})
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: '',
  })

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Name is required'
    if (!form.email.trim())    e.email    = 'Email is required'
    if (!form.password.trim()) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleStep1Next = () => {
    if (validateStep1()) setStep(2)
  }

  const handleSubmit = () => {
    if (form.role) onSignup(form.name, form.email, form.password, form.role)
  }

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] mx-auto"
      >
        <motion.div
          className="glass rounded-2xl p-8"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
        >
          {/* Progress header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={step === 1 ? onGoLogin : () => setStep(1)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft size={15} /> {step === 1 ? 'Back to login' : 'Back'}
            </button>

            {/* Step dots */}
            <div className="flex gap-2 items-center">
              {[1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ width: i <= step ? 28 : 8 }}
                  className="h-1 rounded-full transition-all"
                  style={{ background: i <= step ? '#4f46e5' : 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{   opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-display text-2xl font-bold mb-1">Create Account</h2>
                <p className="text-slate-500 text-sm mb-6">Join thousands of learners today</p>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      <User size={13} /> Full Name
                    </label>
                    <input
                      className="input-field"
                      placeholder="Dr. Jane Smith"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleStep1Next()}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      <Mail size={13} /> Email
                    </label>
                    <input
                      className="input-field"
                      type="email"
                      placeholder="you@university.edu"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleStep1Next()}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      <Lock size={13} /> Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="input-field pr-10"
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={e => set('password', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleStep1Next()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowP(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <Button className="w-full py-3 text-[15px] mt-1" onClick={handleStep1Next}>
                    Continue →
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{   opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-display text-2xl font-bold mb-1">I am a…</h2>
                <p className="text-slate-500 text-sm mb-6">Personalise your platform experience</p>

                <div className="space-y-3 mb-6">
                  {ROLES.map(({ id, icon: Icon, title, description, accent }) => {
                    const active = form.role === id
                    return (
                      <motion.button
                        key={id}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => set('role', id)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200"
                        style={{
                          border:     `2px solid ${active ? accent : 'rgba(255,255,255,0.08)'}`,
                          background: active ? `${accent}18` : 'rgba(255,255,255,0.03)',
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                          style={{ background: active ? accent : 'rgba(255,255,255,0.06)' }}
                        >
                          <Icon size={20} color={active ? '#fff' : '#718096'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{description}</p>
                        </div>
                        {active && <CheckCircle size={18} color={accent} className="shrink-0" />}
                      </motion.button>
                    )
                  })}
                </div>

                <Button
                  className="w-full py-3 text-[15px]"
                  disabled={!form.role}
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Get Started →
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center mt-5 text-sm text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onGoLogin}
            className="text-brand-400 font-semibold hover:text-brand-200 transition-colors"
          >
            Sign in →
          </button>
        </p>
      </motion.div>
    </AuthShell>
  )
}
