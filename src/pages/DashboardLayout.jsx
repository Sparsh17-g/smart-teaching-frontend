import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Navbar  from '../components/Navbar'
import HomePage        from './HomePage'
import VideosPage      from './VideosPage'
import VideoPlayerPage from './VideoPlayerPage'
import NoticesPage     from './NoticesPage'
import UploadPage      from './UploadPage'
import * as api from '../services/api'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function DashboardLayout({ user, role, onLogout }) {
  const [activeNav,     setActiveNav]     = useState('home')
  const [sidebarOpen,   setSidebarOpen]   = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videos,        setVideos]        = useState([])
  const [notices,       setNotices]       = useState([])
  const [dataLoading,   setDataLoading]   = useState(true)

  // Load data from backend
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

  // Load on mount and every time user changes
  useEffect(() => {
    loadData()
  }, [user, loadData])

  // Reload data when switching pages
  useEffect(() => {
    if (activeNav === 'videos' || activeNav === 'notices' || activeNav === 'home') {
      loadData()
    }
  }, [activeNav, loadData])

  const handleAddVideo = (data) => {
    if (data) {
      setVideos(p => [data, ...p])
    }
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
      default:
        return null
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#04040f' }}>
      <Sidebar
        role={role}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(p => !p)}
        onLogout={onLogout}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar
          user={user}
          role={role}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          onLogout={onLogout}
        />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}