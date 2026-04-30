# 🎓 Smart Teaching Platform

A premium, fully responsive **ed-tech web application** built with React, Tailwind CSS, and Framer Motion. Inspired by the design quality of Notion, Stripe Dashboard, and modern SaaS products.

---

## ✨ Features

### Authentication
- **Login** with email & password + animated role modal
- **Signup** (2-step: account details → role selection)
- **Guest access** (no credentials needed)
- Role-based UI: **Teacher** vs **Student**

### Dashboard
- Collapsible **sidebar** with smooth spring animation
- **Top navbar** with profile dropdown, notifications badge
- Animated **page transitions** (Framer Motion)

### Home
- Stats cards (videos, notices, students, subjects)
- Recent videos quick-access list
- Latest notices widget

### Video Library
- Grid layout with **subject filter pills**
- Skeleton loaders on initial fetch
- **VideoCard** with hover play overlay + scale animation
- Full **Video Player** page

### Notice Board
- Card-based notices with **priority badges** (high / medium / low)
- **Teacher-only** "Add Notice" form with animated show/hide
- Empty state when no notices exist

### Upload (Teacher only)
- **Drag & drop** zone (visual)
- Form with title, URL, subject, description
- Animated success state → redirects to Videos

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx       # Primary / ghost / danger button
│   ├── Navbar.jsx       # Top navigation bar
│   ├── Sidebar.jsx      # Collapsible sidebar (desktop + mobile drawer)
│   ├── VideoCard.jsx    # Video thumbnail card
│   ├── NoticeCard.jsx   # Notice card with priority tag
│   ├── Skeleton.jsx     # Loading skeleton variants
│   └── EmptyState.jsx   # Empty state placeholder
│
├── pages/               # Full page components
│   ├── LoginPage.jsx    # Login + role modal
│   ├── SignupPage.jsx   # 2-step signup
│   ├── DashboardLayout.jsx  # Sidebar + Navbar shell
│   ├── HomePage.jsx     # Stats + recent content
│   ├── VideosPage.jsx   # Filtered video grid
│   ├── VideoPlayerPage.jsx  # Video detail / player
│   ├── NoticesPage.jsx  # Notice board
│   └── UploadPage.jsx   # Content upload (teacher)
│
├── hooks/
│   └── useAuth.js       # Auth state management
│
├── services/
│   └── api.js           # Simulated API with setTimeout delays
│
├── data/
│   └── dummyData.js     # Static JSON data
│
├── App.jsx              # Root with screen routing
├── main.jsx             # React entry point
└── index.css            # Tailwind + global styles
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#060612` |
| Surface | `#0a0a1e` / `#0d0d28` |
| Brand | `#4f46e5` → `#7c3aed` |
| Text primary | `#e2e8f0` |
| Text muted | `#718096` |
| Border | `rgba(255,255,255,0.08)` |

### CSS utility classes (in `index.css`)
- `.glass` — glassmorphism card surface
- `.glass-hover` — hover lift + glow effect
- `.input-field` — styled form input
- `.btn-primary` — gradient CTA button
- `.btn-ghost` — outlined secondary button
- `.gradient-text` — purple → pink gradient text
- `.tag`, `.tag-purple`, `.tag-green`, `.tag-amber` — badge chips
- `.skeleton` — animated shimmer loader
- `.nav-item` — sidebar nav link

---

## 🛠 Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI framework |
| Framer Motion | 11 | Page transitions, hover animations |
| Tailwind CSS | 3 | Utility-first styling |
| Lucide React | 0.383 | Icon system |
| Vite | 5 | Build tool & dev server |

---

## 🔐 Test Credentials

Any email/password combination works (simulated auth).

| Role | How to Access |
|------|--------------|
| Teacher | Login or Guest → select **Teacher** |
| Student | Login or Guest → select **Student** |

---

## 📱 Responsive Breakpoints

- **Mobile** `< 640px` — stacked layout, drawer sidebar
- **Tablet** `640–1024px` — 2-col grids, sidebar hidden by default
- **Desktop** `> 1024px` — full sidebar, 3–4 col video grid

---

## 🧩 Extending the Project

### Add a real backend
Replace functions in `src/services/api.js` with actual `fetch()` / `axios` calls.

### Add React Router
```bash
npm install react-router-dom
```
Replace the `screen` state in `App.jsx` with `<BrowserRouter>` routes.

### Add state management
```bash
npm install zustand   # or redux-toolkit
```
Move `videos` / `notices` state out of `DashboardLayout` into a global store.

---

## 📄 License

MIT — free to use, modify, and distribute.
