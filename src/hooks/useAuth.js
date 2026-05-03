import { useState, useCallback } from 'react'

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

// Global state outside React to persist across renders
let globalUser = null
let globalRole = null

export function useAuth() {
  const [user,    setUser]    = useState(globalUser)
  const [role,    setRole]    = useState(globalRole)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const login = useCallback(async (email, password, selectedRole) => {
    setLoading(true)
    setError(null)
    await new Promise(resolve => setTimeout(resolve, 600))
    try {
      const creds = CREDENTIALS[selectedRole]
      if (!creds) {
        setError('Invalid role!')
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
      globalUser = u
      globalRole = selectedRole
      setUser(u)
      setRole(selectedRole)
      setLoading(false)
      return true
    } catch (err) {
      setError('Something went wrong!')
      setLoading(false)
      return false
    }
  }, [])

  const signup = useCallback(async (name, email, password, selectedRole) => {
    setLoading(true)
    setError(null)
    await new Promise(resolve => setTimeout(resolve, 600))
    try {
      const creds = CREDENTIALS[selectedRole]
      if (!creds) {
        setError('Invalid role!')
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
      globalUser = u
      globalRole = selectedRole
      setUser(u)
      setRole(selectedRole)
      setLoading(false)
      return true
    } catch (err) {
      setError('Something went wrong!')
      setLoading(false)
      return false
    }
  }, [])

  const loginAsGuest = useCallback((selectedRole) => {
    const u = {
      id:    0,
      name:  'Guest User',
      email: 'guest@edu.in',
      role:  selectedRole,
    }
    globalUser = u
    globalRole = selectedRole
    setUser(u)
    setRole(selectedRole)
  }, [])

  const logout = useCallback(() => {
    globalUser = null
    globalRole = null
    setUser(null)
    setRole(null)
    setError(null)
  }, [])

  return { user, role, loading, error, login, signup, loginAsGuest, logout }
}