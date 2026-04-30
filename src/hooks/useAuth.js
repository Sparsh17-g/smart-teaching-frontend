import { useState, useCallback, useEffect } from 'react'

// Fixed credentials
const CREDENTIALS = {
  teacher: {
    email:    'teacher@smartteaching.com',
    password: 'Teacher@123',
    name:     'Dr. Sarah Chen',
    role:     'teacher',
  },
  student: {
    email:    'student@smartteaching.com',
    password: 'Student@123',
    name:     'Student',
    role:     'student',
  },
}

export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [role,    setRole]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // Load from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('stp_user')
    const savedRole = localStorage.getItem('stp_role')
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser))
      setRole(savedRole)
    }
  }, [])

  const login = useCallback(async (email, password, selectedRole) => {
    setLoading(true)
    setError(null)

    await new Promise(resolve => setTimeout(resolve, 600))

    try {
      // Check credentials based on role
      const creds = CREDENTIALS[selectedRole]

      if (!creds) {
        setError('Invalid role selected')
        setLoading(false)
        return false
      }

      if (
        email.toLowerCase().trim() !== creds.email ||
        password !== creds.password
      ) {
        setError('Invalid email or password!')
        setLoading(false)
        return false
      }

      const u = {
        id:    selectedRole === 'teacher' ? 1 : 2,
        name:  creds.name,
        email: creds.email,
        role:  selectedRole,
      }

      setUser(u)
      setRole(selectedRole)
      localStorage.setItem('stp_user', JSON.stringify(u))
      localStorage.setItem('stp_role', selectedRole)
      return true

    } catch (err) {
      setError('Something went wrong!')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (name, email, password, selectedRole) => {
    setLoading(true)
    setError(null)

    await new Promise(resolve => setTimeout(resolve, 600))

    try {
      // For now signup uses fixed credentials too
      const creds = CREDENTIALS[selectedRole]

      if (!creds) {
        setError('Invalid role selected')
        setLoading(false)
        return false
      }

      if (
        email.toLowerCase().trim() !== creds.email ||
        password !== creds.password
      ) {
        setError('Invalid email or password!')
        setLoading(false)
        return false
      }

      const u = {
        id:    selectedRole === 'teacher' ? 1 : 2,
        name:  name || creds.name,
        email: creds.email,
        role:  selectedRole,
      }

      setUser(u)
      setRole(selectedRole)
      localStorage.setItem('stp_user', JSON.stringify(u))
      localStorage.setItem('stp_role', selectedRole)
      return true

    } catch (err) {
      setError('Something went wrong!')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const loginAsGuest = useCallback((selectedRole) => {
    const u = {
      id:    0,
      name:  'Guest User',
      email: 'guest@edu.in',
      role:  selectedRole,
    }
    setUser(u)
    setRole(selectedRole)
    localStorage.setItem('stp_user', JSON.stringify(u))
    localStorage.setItem('stp_role', selectedRole)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setRole(null)
    setError(null)
    localStorage.removeItem('stp_user')
    localStorage.removeItem('stp_role')
  }, [])

  return { user, role, loading, error, login, signup, loginAsGuest, logout }
}