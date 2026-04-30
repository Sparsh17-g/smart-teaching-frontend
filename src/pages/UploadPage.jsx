import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, Link, FileVideo, Tag, AlignLeft, X } from 'lucide-react'
import Button from '../components/Button'
import { SUBJECTS } from '../data/dummyData'
import { addVideo, uploadVideoFile } from '../services/api'

export default function UploadPage({ onAddVideo, setActiveNav }) {
  const [dragging,  setDragging]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [errors,    setErrors]    = useState({})
  const [videoFile, setVideoFile] = useState(null)
  const [progress,  setProgress]  = useState(0)
  const [form, setForm] = useState({
    title: '', url: '', subject: '', description: '',
  })

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.url.trim() && !videoFile) e.url = 'Video URL or file is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      setErrors(p => ({ ...p, url: '' }))
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setErrors(p => ({ ...p, url: '' }))
    }
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    setProgress(0)

    try {
      let result

      if (videoFile) {
        // Upload file to Cloudinary
        const formData = new FormData()
        formData.append('video',       videoFile)
        formData.append('title',       form.title)
        formData.append('subject',     form.subject || 'General')
        formData.append('description', form.description || '')
        formData.append('instructor',  'Dr. Sarah Chen')

        // Show fake progress
        const interval = setInterval(() => {
          setProgress(p => {
            if (p >= 85) {
              clearInterval(interval)
              return 85
            }
            return p + 5
          })
        }, 400)

        result = await uploadVideoFile(formData)
        clearInterval(interval)
        setProgress(100)

      } else {
        // Save URL only
        result = await addVideo({
          title:       form.title,
          url:         form.url,
          subject:     form.subject || 'General',
          description: form.description || '',
          instructor:  'Dr. Sarah Chen',
          thumbnail:   `https://picsum.photos/seed/${Date.now()}/400/225`,
          duration:    '--:--',
          views:       0,
        })
      }

      console.log('Upload result:', result)

      if (result) {
        onAddVideo(result)
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setForm({ title: '', url: '', subject: '', description: '' })
          setVideoFile(null)
          setProgress(0)
          setActiveNav('videos')
        }, 1500)
      } else {
        alert('Something went wrong! Please try again.')
      }

    } catch (err) {
      console.log('Upload error:', err)
      alert('Upload failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '28px' }}
      >
        <h1
          className="font-display font-bold"
          style={{ fontSize: '28px', marginBottom: '4px' }}
        >
          Upload Content
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>
          Add new video lectures to the platform
        </p>
      </motion.div>

      {/* Drag Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
        style={{
          borderRadius: '18px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '24px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: `2px dashed ${
            dragging ? '#5b52f0' :
            videoFile ? '#10b981' :
            'rgba(255,255,255,0.1)'
          }`,
          background: dragging
            ? 'rgba(91,82,240,0.08)'
            : videoFile
              ? 'rgba(16,185,129,0.06)'
              : 'rgba(255,255,255,0.02)',
        }}
      >
        <input
          id="fileInput"
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />

        {videoFile ? (
          <div>
            <div style={{
              width: 56, height: 56,
              borderRadius: '16px',
              background: 'rgba(16,185,129,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <FileVideo size={24} color="#10b981" />
            </div>
            <p style={{ color: '#10b981', fontWeight: 600, marginBottom: '6px' }}>
              ✅ File Ready!
            </p>
            <p style={{ color: 'var(--text-3)', fontSize: '13px', marginBottom: '12px' }}>
              {videoFile.name} — {(videoFile.size / 1024 / 1024).toFixed(1)} MB
            </p>
            <button
              onClick={e => { e.stopPropagation(); setVideoFile(null) }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', color: '#f87171',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '999px', padding: '4px 12px',
                cursor: 'pointer',
              }}
            >
              <X size={12} /> Remove
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              width: 56, height: 56,
              borderRadius: '16px',
              background: dragging
                ? 'linear-gradient(135deg,#5b52f0,#7c3aed)'
                : 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              transition: 'all 0.3s ease',
            }}>
              <FileVideo size={24} color={dragging ? '#fff' : '#5a6280'} />
            </div>
            <p style={{ fontWeight: 600, color: 'var(--text-2)', marginBottom: '6px' }}>
              {dragging ? 'Drop it here!' : 'Drag & drop a video'}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '4px' }}>
              or <span style={{ color: '#a5b4fc' }}>click to browse</span>
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>
              MP4, MOV, AVI, MKV supported
            </p>
          </div>
        )}
      </motion.div>

      {/* OR divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)' }} />
        <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>OR paste a URL</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)' }} />
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass"
        style={{ borderRadius: '18px', padding: '24px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Title */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--text-3)', marginBottom: '8px',
            }}>
              <FileVideo size={12} /> Title *
            </label>
            <input
              className="input-field"
              placeholder="e.g. Introduction to React Hooks"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
            {errors.title && (
              <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>
                {errors.title}
              </p>
            )}
          </div>

          {/* URL */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--text-3)', marginBottom: '8px',
            }}>
              <Link size={12} /> Video URL
            </label>
            <input
              className="input-field"
              placeholder="https://youtube.com/watch?v=..."
              value={form.url}
              onChange={e => set('url', e.target.value)}
              disabled={!!videoFile}
              style={{ opacity: videoFile ? 0.4 : 1 }}
            />
            {errors.url && (
              <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>
                {errors.url}
              </p>
            )}
            {videoFile && (
              <p style={{ color: '#10b981', fontSize: '12px', marginTop: '4px' }}>
                ✅ Using uploaded file instead of URL
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--text-3)', marginBottom: '8px',
            }}>
              <Tag size={12} /> Subject
            </label>
            <select
              className="input-field"
              value={form.subject}
              onChange={e => set('subject', e.target.value)}
            >
              <option value="">Select subject...</option>
              {SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--text-3)', marginBottom: '8px',
            }}>
              <AlignLeft size={12} /> Description
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Brief description..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Progress bar */}
          {loading && (
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '6px',
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
                  {videoFile ? 'Uploading to cloud...' : 'Publishing...'}
                </span>
                <span style={{ fontSize: '12px', color: '#a5b4fc' }}>
                  {progress}%
                </span>
              </div>
              <div style={{
                height: '4px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #5b52f0, #7c3aed)',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  padding: '13px', borderRadius: '12px',
                  background: 'linear-gradient(135deg,#059669,#10b981)',
                  color: '#fff', fontWeight: 600, fontSize: '14px',
                }}
              >
                <CheckCircle size={16} /> Published Successfully!
              </motion.div>
            ) : (
              <Button
                className="w-full"
                style={{ padding: '13px', fontSize: '15px' }}
                loading={loading}
                onClick={handleSubmit}
              >
                <Upload size={15} />
                {loading
                  ? videoFile ? 'Uploading...' : 'Publishing...'
                  : 'Publish Video'
                }
              </Button>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  )
}