const BASE = 'https://smart-teaching-uk9o.onrender.com/api'

// ── Videos ──────────────────────────────
export async function fetchVideos() {
  try {
    const res = await fetch(`${BASE}/videos`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.log('Error fetching videos', err)
    return []
  }
}

export async function addVideo(videoData) {
  try {
    const res = await fetch(`${BASE}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoData)
    })
    return await res.json()
  } catch (err) {
    console.log('Error adding video', err)
  }
}

export async function uploadVideoFile(formData) {
  try {
    const res = await fetch(`${BASE}/videos/upload`, {
      method: 'POST',
      body: formData
    })
    return await res.json()
  } catch (err) {
    console.log('Error uploading video', err)
  }
}

export async function deleteVideo(id) {
  try {
    const res = await fetch(`${BASE}/videos/${id}`, {
      method: 'DELETE'
    })
    return await res.json()
  } catch (err) {
    console.log('Error deleting video', err)
  }
}

// ── Notices ─────────────────────────────
export async function fetchNotices() {
  try {
    const res = await fetch(`${BASE}/notices`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.log('Error fetching notices', err)
    return []
  }
}

export async function addNotice(noticeData) {
  try {
    const res = await fetch(`${BASE}/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noticeData)
    })
    return await res.json()
  } catch (err) {
    console.log('Error adding notice', err)
  }
}

export async function deleteNotice(id) {
  try {
    const res = await fetch(`${BASE}/notices/${id}`, {
      method: 'DELETE'
    })
    return await res.json()
  } catch (err) {
    console.log('Error deleting notice', err)
  }
}

// ── Auth ─────────────────────────────────
export async function login(email, password) {
  try {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data.user
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function signup(name, email, password) {
  try {
    const res = await fetch(`${BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data.user
  } catch (err) {
    throw new Error(err.message)
  }
}
// ── Comments ─────────────────────────────
export async function fetchComments(videoId) {
  try {
    const res = await fetch(`${BASE}/comments/${videoId}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.log('Error fetching comments', err)
    return []
  }
}

export async function addComment(commentData) {
  try {
    const res = await fetch(`${BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    })
    return await res.json()
  } catch (err) {
    console.log('Error adding comment', err)
  }
}

export async function deleteComment(id) {
  try {
    const res = await fetch(`${BASE}/comments/${id}`, {
      method: 'DELETE'
    })
    return await res.json()
  } catch (err) {
    console.log('Error deleting comment', err)
  }
}

export async function likeComment(id) {
  try {
    const res = await fetch(`${BASE}/comments/${id}/like`, {
      method: 'PUT'
    })
    return await res.json()
  } catch (err) {
    console.log('Error liking comment', err)
  }
}