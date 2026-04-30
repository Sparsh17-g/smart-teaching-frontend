import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Save, CheckCircle } from 'lucide-react'
import Button from '../components/Button'
import {
  LayoutDashboard, PlayCircle, Bell, Upload,
  GraduationCap, LogOut, ChevronLeft, Sparkles, User,
} from 'lucide-react'

export default function ProfilePage({ user, role }) {
  const [name,    setName]    = useState(user?.name || '')
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    // Save to localStorage
    const savedUser = JSON.parse(localStorage.getItem('stp_user') || '{}')
    savedUser.name = name
    localStorage.setItem('stp_user', JSON.stringify(savedUser))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const initial = (name || 'U').charAt(0).toUpperCase()

  return (
    <div style={{ maxWidth: '600px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '28px' }}
      >
        <h1 className="font-display font-bold" style={{ fontSize: '28px', marginBottom: '4px' }}>
          Profile
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>
          Manage your account details
        </p>
      </motion.div>

      {/* Avatar section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
        style={{ marginBottom: '16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #5b52f0, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 700, color: '#fff',
            boxShadow: '0 8px 24px rgba(91,82,240,0.4)',
            flexShrink: 0,
          }}>
            {initial}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
              {name || 'User'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '8px' }}>
              {user?.email}
            </p>
            <span className={`tag ${role === 'teacher' ? 'tag-purple' : 'tag-green'} capitalize`}>
              {role}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Edit details */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
        style={{ marginBottom: '16px' }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>
          Account Details
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--text-3)', marginBottom: '8px',
            }}>
              <User size={12} /> Display Name
            </label>
            <input
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* Email — readonly */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--text-3)', marginBottom: '8px',
            }}>
              <Mail size={12} /> Email
            </label>
            <input
              className="input-field"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.5 }}
            />
          </div>

          {/* Role — readonly */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--text-3)', marginBottom: '8px',
            }}>
              <Shield size={12} /> Role
            </label>
            <input
              className="input-field capitalize"
              value={role || ''}
              disabled
              style={{ opacity: 0.5 }}
            />
          </div>

          {/* Save button */}
          {saved ? (
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              padding: '12px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#059669,#10b981)',
              color: '#fff', fontWeight: 600, fontSize: '14px',
            }}>
              <CheckCircle size={16} /> Saved successfully!
            </div>
          ) : (
            <Button loading={loading} onClick={handleSave}>
              <Save size={15} /> Save Changes
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
          Account Info
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Role',     value: role || 'N/A' },
            { label: 'Status',   value: 'Active ✅' },
            { label: 'Platform', value: 'Smart Teaching' },
            { label: 'Access',   value: role === 'teacher' ? 'Full Access' : 'View Only' },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </p>
              <p style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}