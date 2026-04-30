import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LoginPage       from './pages/LoginPage'
import SignupPage      from './pages/SignupPage'
import DashboardLayout from './pages/DashboardLayout'
import { useAuth }     from './hooks/useAuth'

const fade = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.32 } },
  exit:    { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
}

export default function App() {
  const [screen, setScreen] = useState('loading')
  const { user, role, loading, login, signup, loginAsGuest, logout } = useAuth()

  // Check if already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('stp_user')
    const savedRole = localStorage.getItem('stp_role')
    if (savedUser && savedRole) {
      setScreen('dashboard')
    } else {
      setScreen('login')
    }
  }, [])

  const handleLogin = async (email, password, selectedRole) => {
    await login(email, password, selectedRole)
    setScreen('dashboard')
  }

  const handleGuestLogin = (selectedRole) => {
    loginAsGuest(selectedRole)
    setScreen('dashboard')
  }

  const handleSignup = async (name, email, password, selectedRole) => {
    await signup(name, email, password, selectedRole)
    setScreen('dashboard')
  }

  const handleLogout = () => {
    logout()
    setScreen('login')
  }

  // Loading screen
  if (screen === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#04040f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #5b52f0, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(91,82,240,0.4)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>
            <span style={{ fontSize: '24px' }}>🎓</span>
          </div>
          <p style={{ color: '#5a6280', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#04040f' }}>
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div key="login" {...fade}>
            <LoginPage
              onLogin={handleLogin}
              onGoSignup={() => setScreen('signup')}
              onGuestLogin={handleGuestLogin}
            />
          </motion.div>
        )}

        {screen === 'signup' && (
          <motion.div key="signup" {...fade}>
            <SignupPage
              onSignup={handleSignup}
              onGoLogin={() => setScreen('login')}
              loading={loading}
            />
          </motion.div>
        )}

        {screen === 'dashboard' && user && (
          <motion.div key="dashboard" {...fade}>
            <DashboardLayout
              user={user}
              role={role}
              onLogout={handleLogout}
            />
          </motion.div>
        )}

        {screen === 'dashboard' && !user && (
          <motion.div key="fallback" {...fade}>
            <LoginPage
              onLogin={handleLogin}
              onGoSignup={() => setScreen('signup')}
              onGuestLogin={handleGuestLogin}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}