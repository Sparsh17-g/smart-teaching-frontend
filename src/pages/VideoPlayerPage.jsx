import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, User, Clock, Eye,
  Calendar, Bookmark, Share2, ThumbsUp,
} from 'lucide-react'
import Button from '../components/Button'

// Extract YouTube video ID from URL
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

export default function VideoPlayerPage({ video, onBack, role, onDelete }) {
  const [liked,  setLiked]  = useState(false)
  const [saved,  setSaved]  = useState(false)

  // Increment view count when video opens
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

  const youtubeId = getYouTubeId(video.url)

  const accentColors = ['#4f46e5', '#7c3aed', '#ec4899', '#10b981', '#f59e0b']
  const accent = accentColors[video.id % accentColors.length] || accentColors[0]

  const meta = [
    { icon: User,     value: video.instructor || 'Unknown' },
    { icon: Clock,    value: video.duration || '--:--' },
    { icon: Eye,      value: `${video.views || 0} views` },
    { icon: Calendar, value: video.date || 'Recently added' },
  ]

  const handleDelete = async () => {
    if (!window.confirm('Delete this video?')) return
    await onDelete(video._id || video.id)
    onBack()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', background: '#04040f', padding: '24px' }}
    >
      {/* Back button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={15} /> Back to Videos
        </Button>
        {role === 'teacher' && (
          <Button variant="danger" onClick={handleDelete}>
            Delete Video
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
            /* YouTube embed player */
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block' }}
            />
          ) : video.url ? (
            /* Regular video player */
            <video
              controls
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              src={video.url}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            /* No video URL */
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${accent}22, #1a1a3e99)`,
            }}>
              <div style={{
                width: 72, height: 72,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <span style={{ fontSize: '32px' }}>🎬</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                No video URL provided
              </p>
            </div>
          )}
        </motion.div>

        {/* Video Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass"
          style={{ borderRadius: '16px', padding: '24px' }}
        >
          {/* Title row */}
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px', marginBottom: '16px',
          }}>
            <div style={{ flex: 1 }}>
              <span className="tag tag-purple" style={{ marginBottom: '10px', display: 'inline-block' }}>
                {video.subject}
              </span>
              <h1 style={{
                fontSize: '22px', fontWeight: 700,
                lineHeight: 1.3, fontFamily: 'Outfit, sans-serif',
              }}>
                {video.title}
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button
                variant="ghost"
                style={{ fontSize: '12px', padding: '8px 14px' }}
                onClick={() => setLiked(p => !p)}
              >
                <ThumbsUp size={14} style={{ fill: liked ? '#a5b4fc' : 'none', color: liked ? '#a5b4fc' : '' }} />
                {liked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="ghost"
                style={{ fontSize: '12px', padding: '8px 14px' }}
                onClick={() => setSaved(p => !p)}
              >
                <Bookmark size={14} style={{ fill: saved ? '#a5b4fc' : 'none', color: saved ? '#a5b4fc' : '' }} />
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="ghost"
                style={{ fontSize: '12px', padding: '8px 14px' }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied!')
                }}
              >
                <Share2 size={14} /> Share
              </Button>
            </div>
          </div>

          {/* Meta info */}
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            gap: '16px', marginBottom: '16px',
          }}>
            {meta.map(({ icon: Icon, value }) => (
              <span
                key={value}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: '6px', fontSize: '13px', color: '#5a6280',
                }}
              >
                <Icon size={13} /> {value}
              </span>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '16px 0' }} />

          <p style={{ fontSize: '14px', color: '#a8b0cc', lineHeight: 1.7 }}>
            {video.description || 'This comprehensive lecture covers all fundamental concepts and advanced techniques. By the end of this session, you will have a solid understanding of the topic.'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}