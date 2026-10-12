import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './lib/SettingsContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Objectives from './pages/Objectives'
import Members from './pages/Members'
import Programs from './pages/Programs'
import Gallery from './pages/Gallery'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'

const AdminApp = lazy(() => import('./pages/admin/AdminApp'))

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense
                fallback={<div className="grid min-h-screen place-items-center bg-paper">…</div>}
              >
                <AdminApp />
              </Suspense>
            }
          />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/objectives" element={<Objectives />} />
            <Route path="/members" element={<Members />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </SettingsProvider>
    </BrowserRouter>
  )
}
