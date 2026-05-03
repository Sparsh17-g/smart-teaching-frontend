import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar       from '../components/Sidebar'
import Navbar        from '../components/Navbar'
import HomePage      from './HomePage'
import VideosPage    from './VideosPage'
import VideoPlayerPage from './VideoPlayerPage'
import NoticesPage   from './NoticesPage'
import UploadPage    from './UploadPage'
import ProfilePage   from './ProfilePage'
import TimetablePage from './TimetablePage'
import * as api from '../services/api'

export default function DashboardLayout({ user, role, onLogout }) {
  const [activeNav,     setActiveNav]     = useState('home')
  const [sidebarOpen,   setSidebarOpen]   = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videos,        setVideos]        = useState([])
  const [notices,       setNotices]       = useState([])
  const [dataLoading,   setDataLoading]   = useState(true)

  const loadData = useCallback(async () => {
    setDataLoading(true)
    try {
      const [vids, nots] = await Promise.all([
        api.fetchVideos(),
        api.fetchNotices(),
      ])
      setVideos(Array.isArray(vids) ? vids : [])
      setNotices(Array.isArray(nots) ? nots : [])
    } catch (err) {
      console.log('Error loading data', err)
      setVideos([])
      setNotices([])
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddVideo = (data) => {
    if (data) setVideos(p => [data, ...p])
  }

  const handleAddNotice = async (data) => {
    try {
      const n = await api.addNotice(data)
      if (n && (n._id || n.id)) {
        setNotices(p => [n, ...p])
      } else {
        setNotices(p => [{
          ...data,
          _id: Date.now().toString(),
          date: 'Just now',
          author: user?.name || 'Teacher',
        }, ...p])
      }
    } catch (err) {
      console.log('Error adding notice', err)
    }
  }

  const handleDeleteNotice = async (id) => {
    try {
      await api.deleteNotice(id)
      setNotices(p => p.filter(n => (n._id || n.id) !== id))
    } catch (err) {
      console.log('Error deleting notice', err)
    }
  }

  const handleDeleteVideo = async (id) => {
    try {
      await api.deleteVideo(id)
      setVideos(p => p.filter(v => (v._id || v.id) !== id))
    } catch (err) {
      console.log('Error deleting video', err)
    }
  }

  if (selectedVideo) {
    return (
      <VideoPlayerPage
        video={selectedVideo}
        onBack={() => setSelectedVideo(null)}
        role={role}
        onDelete={handleDeleteVideo}
        user={user}
      />
    )
  }

  const renderPage = () => {
    switch (activeNav) {
      case 'home':
        return (
          <HomePage
            role={role}
            user={user}
            videos={videos}
            notices={notices}
            onVideoClick={setSelectedVideo}
            setActiveNav={setActiveNav}
            loading={dataLoading}
          />
        )
      case 'videos':
        return (
          <VideosPage
            videos={videos}
            onVideoClick={setSelectedVideo}
            role={role}
            onDelete={handleDeleteVideo}
          />
        )
      case 'notices':
        return (
          <NoticesPage
            notices={notices}
            role={role}
            onAddNotice={handleAddNotice}
            onDeleteNotice={handleDeleteNotice}
          />
        )
      case 'upload':
        return role === 'teacher' ? (
          <UploadPage
            onAddVideo={handleAddVideo}
            setActiveNav={setActiveNav}
          />
        ) : null
      case 'profile':
        return (
          <ProfilePage
            user={user}
            role={role}
          />
        )
      case 'timetable':
        return (
          <TimetablePage
            role={role}
          />
        )
      default:
        return null
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      background: '#04040f',
      color: '#f0f2ff',
    }}>
      {/* Sidebar */}
      <Sidebar
        role={role}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(p => !p)}
        onLogout={onLogout}
      />

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        background: '#04040f',
      }}>
        {/* Navbar */}
        <Navbar
          user={user}
          role={role}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          onLogout={onLogout}
          notices={notices}
          videos={videos}
        />

        {/* Content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px',
          background: '#04040f',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}