import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Clock, BookOpen, User, Trash2 } from 'lucide-react'
import Button from '../components/Button'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIMES = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
const COLORS = ['#5b52f0', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#ef4444', '#84cc16']

const INITIAL_SCHEDULE = {
  Monday:    [{ id:1, time: '9:00 AM',  subject: 'React',   teacher: 'Dr. Sarah Chen', color: '#5b52f0', duration: '1 hr' }],
  Tuesday:   [{ id:2, time: '10:00 AM', subject: 'CSS',     teacher: 'Prof. Alex Kim',  color: '#10b981', duration: '1 hr' }],
  Wednesday: [{ id:3, time: '9:00 AM',  subject: 'Backend', teacher: 'Dr. Sarah Chen', color: '#f59e0b', duration: '1 hr' }],
  Thursday:  [{ id:4, time: '11:00 AM', subject: 'SQL',     teacher: 'Prof. James Liu', color: '#ec4899', duration: '1 hr' }],
  Friday:    [{ id:5, time: '10:00 AM', subject: 'DevOps',  teacher: 'Prof. Alex Kim',  color: '#06b6d4', duration: '1 hr' }],
  Saturday:  [],
}

export default function TimetablePage({ role }) {
  const [schedule,  setSchedule]  = useState(INITIAL_SCHEDULE)
  const [showForm,  setShowForm]  = useState(false)
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [form, setForm] = useState({
    day: 'Monday', time: '9:00 AM',
    subject: '', teacher: '',
    duration: '1 hr', color: '#5b52f0',
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleAdd = () => {
    if (!form.subject.trim()) return
    const newClass = {
      id:       Date.now(),
      time:     form.time,
      subject:  form.subject,
      teacher:  form.teacher,
      color:    form.color,
      duration: form.duration,
    }
    setSchedule(p => ({
      ...p,
      [form.day]: [...(p[form.day] || []), newClass].sort((a, b) => {
        return TIMES.indexOf(a.time) - TIMES.indexOf(b.time)
      })
    }))
    setForm({ day: 'Monday', time: '9:00 AM', subject: '', teacher: '', duration: '1 hr', color: '#5b52f0' })
    setShowForm(false)
  }

  const handleDelete = (day, id) => {
    setSchedule(p => ({
      ...p,
      [day]: p[day].filter(c => c.id !== id)
    }))
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}
      >
        <div>
          <h1 className="font-display font-bold" style={{ fontSize: '28px', marginBottom: '4px' }}>
            Timetable
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>
            Weekly class schedule
          </p>
        </div>
        {role === 'teacher' && (
          <Button onClick={() => setShowForm(p => !p)}>
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Class</>}
          </Button>
        )}
      </motion.div>

      {/* Add class form */}
      <AnimatePresence>
        {showForm && role === 'teacher' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden', marginBottom: '24px' }}
          >
            <div className="glass" style={{ borderRadius: '16px', padding: '24px', border: '1px solid rgba(91,82,240,0.2)' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '16px' }}>Add New Class</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>Day</label>
                  <select className="input-field" value={form.day} onChange={e => set('day', e.target.value)}>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>Time</label>
                  <select className="input-field" value={form.time} onChange={e => set('time', e.target.value)}>
                    {TIMES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>Subject *</label>
                  <input className="input-field" placeholder="e.g. React" value={form.subject} onChange={e => set('subject', e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>Teacher</label>
                  <input className="input-field" placeholder="Teacher name" value={form.teacher} onChange={e => set('teacher', e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>Duration</label>
                  <select className="input-field" value={form.duration} onChange={e => set('duration', e.target.value)}>
                    {['30 min', '1 hr', '1.5 hr', '2 hr'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>Color</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => set('color', c)}
                        style={{
                          width: 28, height: 28,
                          borderRadius: '8px',
                          background: c,
                          border: form.color === c ? '2px solid #fff' : '2px solid transparent',
                          cursor: 'pointer',
                          transition: 'transform 0.15s',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <Button style={{ marginTop: '16px' }} onClick={handleAdd}>
                <Plus size={14} /> Add Class
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: `1px solid ${selectedDay === day ? '#5b52f0' : 'rgba(255,255,255,0.1)'}`,
              background: selectedDay === day ? 'rgba(91,82,240,0.15)' : 'transparent',
              color: selectedDay === day ? '#a5b4fc' : day === today ? '#6ee7b7' : '#5a6280',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            {day}
            {day === today && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 8, height: 8,
                borderRadius: '50%',
                background: '#10b981',
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Schedule for selected day */}
      <motion.div
        key={selectedDay}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {selectedDay === today && (
          <div style={{
            padding: '10px 16px',
            borderRadius: '10px',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#6ee7b7',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
            Today is {selectedDay}
          </div>
        )}

        {schedule[selectedDay]?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-3)', fontSize: '14px' }}>
            No classes scheduled for {selectedDay}
            {role === 'teacher' && (
              <p style={{ marginTop: '8px', fontSize: '13px' }}>
                Click "Add Class" to add one!
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {schedule[selectedDay]?.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass"
                style={{
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  borderLeft: `4px solid ${cls.color}`,
                }}
              >
                {/* Color dot */}
                <div style={{
                  width: 44, height: 44,
                  borderRadius: '12px',
                  background: `${cls.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <BookOpen size={20} style={{ color: cls.color }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                    {cls.subject}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-3)' }}>
                      <Clock size={12} /> {cls.time} · {cls.duration}
                    </span>
                    {cls.teacher && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-3)' }}>
                        <User size={12} /> {cls.teacher}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button — teacher only */}
                {role === 'teacher' && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(selectedDay, cls.id)}
                    style={{
                      width: 32, height: 32,
                      borderRadius: '10px',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#f87171',
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}