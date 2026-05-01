import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, User, Clock, Eye, Calendar,
  Bookmark, Share2, ThumbsUp, Send, Trash2,
  MessageCircle,
} from 'lucide-react'
import Button from '../components/Button'
import { fetchComments, addComment, deleteComment, likeComment } from '../services/api'

function getYouTubeId(url) {
  if (!url) return null
  const patterns = [
    /youtube\.com\/watch\?v=([^&?]+)/,
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1].split('?')[0].split('&')[0]
  }
  return null
}

export default function VideoPlayerPage({ video, onBack, role, onDelete, user }) {
  const [liked,    setLiked]    = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(true)

  const youtubeId = getYouTubeId(video.url)

  // Load comments
  useEffect(() => {
    const load = async () => {
      if (video._id) {
        const data = await fetchComments(video._id)
        setComments(data)
      }
      setCommentsLoading(false)
    }
    load()
  }, [video._id])

  // Increment view count
  useEffect(() => {
    const updateViews = async () => {
      try {
        await fetch(`https://smart-teaching-uk9o.onrender.com/api/videos/${video._id}/view`, {
          method: 'PUT'
        })
      } catch (err) {
        console.log('View count error', err)
      }
    }
    if (video._id) updateViews()
  }, [video._id])

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      const comment = await addComment({
        videoId: video._id,
        name:    user?.name || 'Anonymous',
        role:    role || 'student',
        content: newComment.trim(),
      })
      if (comment) {
        setComments(p => [comment, ...p])
        setNewComment('')
      }
    } catch (err) {
      console.log('Error adding comment', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (id) => {
    await deleteComment(id)
    setComments(p => p.filter(c => c._id !== id))
  }

  const handleLikeComment = async (id) => {
    const updated = await likeComment(id)
    if (updated) {
      setComments(p => p.map(c => c._id === id ? updated : c))
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this video?')) return
    await onDelete(video._id || video.id)
    onBack()
  }

  const meta = [
    { icon: User,     value: video.instructor || 'Unknown' },
    { icon: Clock,    value: video.duration || '--:--' },
    { icon: Eye,      value: `${video.views || 0} views` },
    { icon: Calendar, value: video.date || 'Recently added' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ minHeight: '100vh', background: '#04040f', padding: '24px' }}
    >
      {/* Back button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={15} /> Back to Videos
        </Button>
        {role === 'teacher' && (
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 size={14} /> Delete Video
          </Button>
        )}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '20px',
            aspectRatio: '16/9',
            background: '#0c0c22',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {youtubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block' }}
            />
          ) : video.url ? (
            <video
              controls
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              src={video.url}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</span>
              <p style={{ color: 'var(--text-3)' }}>No video URL provided</p>
            </div>
          )}
        </motion.div>

        {/* Video Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass"
          style={{ borderRadius: '16px', padding: '24px', marginBottom: '20px' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <span className="tag tag-purple" style={{ marginBottom: '10px', display: 'inline-block' }}>
                {video.subject}
              </span>
              <h1 style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.3, fontFamily: 'Outfit, sans-serif' }}>
                {video.title}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button variant="ghost" style={{ fontSize: '12px', padding: '8px 14px' }} onClick={() => setLiked(p => !p)}>
                <ThumbsUp size={14} style={{ fill: liked ? '#a5b4fc' : 'none' }} />
                {liked ? 'Liked' : 'Like'}
              </Button>
              <Button variant="ghost" style={{ fontSize: '12px', padding: '8px 14px' }} onClick={() => setSaved(p => !p)}>
                <Bookmark size={14} style={{ fill: saved ? '#a5b4fc' : 'none' }} />
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="ghost" style={{ fontSize: '12px', padding: '8px 14px' }} onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!') }}>
                <Share2 size={14} /> Share
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            {meta.map(({ icon: Icon, value }) => (
              <span key={value} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-3)' }}>
                <Icon size={13} /> {value}
              </span>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '16px 0' }} />

          <p style={{ fontSize: '14px', color: '#a8b0cc', lineHeight: 1.7 }}>
            {video.description || 'This comprehensive lecture covers all fundamental concepts and advanced techniques.'}
          </p>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass"
          style={{ borderRadius: '16px', padding: '24px' }}
        >
          {/* Comments header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <MessageCircle size={18} style={{ color: '#a5b4fc' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
              Comments ({comments.length})
            </h3>
          </div>

          {/* Add comment */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #5b52f0, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 700, color: '#fff',
                flexShrink: 0,
              }}>
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  style={{ resize: 'none', marginBottom: '8px' }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleAddComment()
                    }
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  {newComment && (
                    <Button variant="ghost" style={{ fontSize: '12px', padding: '7px 14px' }} onClick={() => setNewComment('')}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    style={{ fontSize: '12px', padding: '7px 14px' }}
                    loading={submitting}
                    disabled={!newComment.trim()}
                    onClick={handleAddComment}
                  >
                    <Send size={13} /> Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments list */}
          {commentsLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)' }}>
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)', fontSize: '14px' }}>
              No comments yet. Be the first to comment! 💬
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AnimatePresence>
                {comments.map((c, i) => (
                  <motion.div
                    key={c._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', gap: '12px' }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 36, height: 36,
                      borderRadius: '50%',
                      background: c.role === 'teacher'
                        ? 'linear-gradient(135deg, #5b52f0, #7c3aed)'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700, color: '#fff',
                      flexShrink: 0,
                    }}>
                      {(c.name || 'U').charAt(0).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>
                          {c.name}
                        </span>
                        <span className={`tag ${c.role === 'teacher' ? 'tag-purple' : 'tag-green'} capitalize`} style={{ fontSize: '10px' }}>
                          {c.role}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#a8b0cc', lineHeight: 1.6, marginBottom: '8px' }}>
                        {c.content}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => handleLikeComment(c._id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '12px', color: 'var(--text-3)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                        >
                          <ThumbsUp size={12} /> {c.likes || 0}
                        </button>
                        {role === 'teacher' && (
                          <button
                            onClick={() => handleDeleteComment(c._id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '4px',
                              fontSize: '12px', color: 'var(--text-3)',
                              background: 'none', border: 'none', cursor: 'pointer',
                              transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}