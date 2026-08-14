'use client'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { api, getToken, setToken } from '@/lib/fts-api'
import Landing from '@/components/fts/Landing'
import { AuthView, CheckoutView } from '@/components/fts/Auth'
import Dashboard from '@/components/fts/Dashboard'
import Admin from '@/components/fts/Admin'
import { Logo } from '@/components/fts/ui'

export default function App() {
  const [route, setRoute] = useState('loading') // loading | landing | login | register | checkout | dashboard | admin
  const [authMode, setAuthMode] = useState('login')
  const [user, setUser] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [pendingChallenge, setPendingChallenge] = useState(null)

  // bootstrap
  useEffect(() => {
    api('/challenges', { auth: false }).then((d) => setChallenges(d.challenges)).catch(() => {})
    const wantsAdmin = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin') === '1'
    const token = getToken()
    if (token) {
      api('/auth/me').then((d) => {
        setUser(d.user)
        setRoute(wantsAdmin && d.user.role === 'ADMIN' ? 'admin' : 'dashboard')
      }).catch(() => { setToken(null); setRoute('landing') })
    } else {
      setRoute('landing')
    }
  }, [])

  const goLanding = () => { setRoute('landing'); if (typeof window !== 'undefined') window.history.replaceState({}, '', '/') }
  const logout = () => { setToken(null); setUser(null); goLanding() }

  const onAuthSuccess = (u) => {
    setUser(u)
    if (pendingChallenge) { setRoute('checkout') }
    else setRoute(u.role === 'ADMIN' ? 'admin' : 'dashboard')
  }

  const onSelectChallenge = (c) => {
    setPendingChallenge(c)
    if (getToken() && user) setRoute('checkout')
    else { setAuthMode('register'); setRoute('login') }
  }

  const onCheckoutDone = () => {
    setPendingChallenge(null)
    setRoute('dashboard')
  }

  if (route === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Logo />
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    )
  }

  if (route === 'landing') {
    return (
      <Landing
        challenges={challenges}
        onLogin={() => { setAuthMode('login'); setRoute('login') }}
        onGetFunded={() => { setAuthMode('register'); setRoute('login') }}
        onSelectChallenge={onSelectChallenge}
      />
    )
  }

  if (route === 'login') {
    return <AuthView mode={authMode} onHome={goLanding} onSuccess={onAuthSuccess} />
  }

  if (route === 'checkout' && pendingChallenge) {
    return (
      <CheckoutView
        challenge={pendingChallenge}
        onHome={goLanding}
        onDone={onCheckoutDone}
        onNeedAuth={() => { setAuthMode('login'); setRoute('login') }}
      />
    )
  }

  if (route === 'admin' && user) {
    return <Admin user={user} onLogout={logout} onHome={goLanding} onDashboard={() => setRoute('dashboard')} />
  }

  if (route === 'dashboard' && user) {
    return (
      <Dashboard
        user={user}
        onLogout={logout}
        onHome={goLanding}
        onGetChallenge={() => setRoute('landing')}
      />
    )
  }

  // fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Logo />
    </div>
  )
}
