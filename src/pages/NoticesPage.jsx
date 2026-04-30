import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Send, X } from 'lucide-react'
import NoticeCard from '../components/NoticeCard'
import { NoticeCardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import { SUBJECTS } from '../data/dummyData'

const PRIORITIES = ['low', 'medium', 'high']

export default function NoticesPage({ notices, role, onAddNotice, onDeleteNotice }) {
  const [showForm,   setShowForm]  = useState(false)
  const [loading,    setLoading]   = useState(true)
  const [submitting, setSub]       = useState(false)
  const [localNotices, setLocalNotices] = useState(notices)
  const [form, setForm] = useState({
    title: '', content: '', priority: 'medium', subject: ''
  })

  useEffect(() => {
    setLocalNotices(notices)
  }, [notices])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert('Please fill in title and content!')
      return
    }
    setSub(true)
    try {
      await onAddNotice({ ...form })
      setForm({ title: '', content: '', priority: 'medium', subject: '' })
      setShowForm(false)
    } catch (err) {
      console.log('Error adding notice', err)
    } finally {
      setSub(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await onDeleteNotice(id)
      setLocalNotices(p => p.filter(n => (n._id || n.id) !== id))
    } catch (err) {
      console.log('Error deleting notice', err)
    }
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-between items-start gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">
            Notice Board
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            {localNotices.length} active notices
          </p>
        </div>

        {role === 'teacher' && (
          <Button onClick={() => setShowForm(p => !p)}>
            {showForm
              ? <><X size={15} /> Cancel</>
              : <><Plus size={15} /> Add Notice</>
            }
          </Button>
        )}
      </motion.div>

      {/* Add notice form */}
      <AnimatePresence>
        {showForm && role === 'teacher' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <div
              className="glass rounded-2xl p-6"
              style={{ border: '1px solid rgba(91,82,240,0.2)' }}
            >
              <h3 className="font-semibold text-sm mb-4">New Notice</h3>
              <div className="space-y-3">
                <input
                  className="input-field"
                  placeholder="Notice title *"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                />
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Notice content *"
                  value={form.content}
                  onChange={e => set('content', e.target.value)}
                  style={{ resize: 'vertical' }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>
                      Priority
                    </label>
                    <select
                      className="input-field"
                      value={form.priority}
                      onChange={e => set('priority', e.target.value)}
                    >
                      {PRIORITIES.map(p => (
                        <option key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>
                      Subject
                    </label>
                    <select
                      className="input-field"
                      value={form.subject}
                      onChange={e => set('subject', e.target.value)}
                    >
                      <option value="">General</option>
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      <option value="Special Event">Special Event</option>
                      <option value="All Subjects">All Subjects</option>
                    </select>
                  </div>
                </div>
                <Button loading={submitting} onClick={handleSubmit}>
                  <Send size={14} /> Publish Notice
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notices list */}
      {loading ? (
        <div className="space-y-4">
          {Array(4).fill(null).map((_, i) => <NoticeCardSkeleton key={i} />)}
        </div>
      ) : localNotices.length === 0 ? (
        <EmptyState
          icon="Bell"
          title="No Notices Yet"
          description="New notices from teachers will appear here."
        />
      ) : (
        <div className="space-y-4">
          {localNotices.map((n, i) => (
            <NoticeCard
              key={n._id || n.id || i}
              notice={n}
              index={i}
              role={role}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}