import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardLayout from './pages/DashboardLayout'

const CREDENTIALS = {
  teacher: {
    email: 'teacher@smartteaching.com',
    password: 'Teacher@123',
    name: 'Dr. Sarah Chen',
  },
  student: {
    email: 'student@smartteaching.com',
    password: 'Student@123',
    name: 'Student',
  },
}

function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [text, setText] = useState('Initializing...')

  useEffect(() => {
    const steps = [
      { progress: 20, text: 'Loading platform...' },
      { progress: 45, text: 'Connecting database...' },
      { progress: 70, text: 'Fetching content...' },
      { progress: 90, text: 'Almost ready...' },
      { progress: 100, text: 'Welcome!' },
    ]
    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i].progress)
        setText(steps[i].text)
        i++
      } else {
        clearInterval(interval)
      }
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#04040f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
    }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          width: 72, height: 72,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #5b52f0, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px',
          boxShadow: '0 12px 40px rgba(91,82,240,0.5)',
        }}
      >
        🎓
      </motion.div>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '28px', fontWeight: 800,
          fontFamily: 'Outfit, sans-serif',
          background: 'linear-gradient(135deg, #a5b4fc, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '6px',
        }}>
          Smart Teaching
        </h1>
        <p style={{ fontSize: '14px', color: '#5a6280' }}>{text}</p>
      </div>

      <div style={{
        width: '240px', height: '4px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '2px', overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #5b52f0, #7c3aed)',
            borderRadius: '2px',
          }}
        />
      </div>

      <p style={{ fontSize: '12px', color: '#5a6280' }}>{progress}%</p>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('loading')
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('login')
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (email, password, selectedRole) => {
    const creds = CREDENTIALS[selectedRole]
    if (!creds) return false
    if (
      email.toLowerCase().trim() !== creds.email ||
      password !== creds.password
    ) return false

    const u = {
      id: selectedRole === 'teacher' ? 1 : 2,
      name: creds.name,
      email: creds.email,
      role: selectedRole,
    }
    setUser(u)
    setRole(selectedRole)
    setScreen('dashboard')
    return true
  }

  const handleGuestLogin = (selectedRole) => {
    const u = {
      id: 0,
      name: 'Guest User',
      email: 'guest@edu.in',
      role: selectedRole,
    }
    setUser(u)
    setRole(selectedRole)
    setScreen('dashboard')
  }

  const handleSignup = (name, email, password, selectedRole) => {
    const creds = CREDENTIALS[selectedRole]
    if (!creds) return false
    if (
      email.toLowerCase().trim() !== creds.email ||
      password !== creds.password
    ) return false

    const u = {
      id: selectedRole === 'teacher' ? 1 : 2,
      name: name || creds.name,
      email: creds.email,
      role: selectedRole,
    }
    setUser(u)
    setRole(selectedRole)
    setScreen('dashboard')
    return true
  }

  const handleLogout = () => {
    setUser(null)
    setRole(null)
    setScreen('login')
  }

  console.log('Screen:', screen, 'User:', user, 'Role:', role)

  return (
    <div style={{ minHeight: '100vh', background: '#04040f' }}>
      <AnimatePresence mode="wait">
        {screen === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingScreen />
          </motion.div>
        )}

        {screen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginPage
              onLogin={handleLogin}
              onGoSignup={() => setScreen('signup')}
              onGuestLogin={handleGuestLogin}
            />
          </motion.div>
        )}

        {screen === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SignupPage
              onSignup={handleSignup}
              onGoLogin={() => setScreen('login')}
            />
          </motion.div>
        )}

        {screen === 'dashboard' && user && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DashboardLayout
              user={user}
              role={role}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}