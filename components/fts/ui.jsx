'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp } from 'lucide-react'
import { Moon, Sun } from 'lucide-react'

// ---------- Theme toggle ----------
export function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(false)
  useEffect(() => { setDark(document.documentElement.classList.contains('dark')) }, [])
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    try { localStorage.setItem('fts_theme', isDark ? 'dark' : 'light') } catch {}
    setDark(isDark)
  }
  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className={`h-9 w-9 rounded-lg flex items-center justify-center text-slate-600 hover:bg-muted transition-colors ${className}`}>
      {dark ? <Sun className="h-4.5 w-4.5 h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

// ---------- Logo ----------
export function Logo({ className = '', dark = false }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <TrendingUp className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <span className={`text-lg font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
        Funded<span className="text-blue-600">Tech</span>Street
      </span>
    </div>
  )
}

// ---------- Animated counter ----------
export function CountUp({ value, prefix = '', suffix = '', decimals = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, Number(value) || 0, {
      duration: 1.4, ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, value])
  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  )
}

// ---------- Status badge ----------
const STATUS_STYLES = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  FUNDED: 'bg-blue-100 text-blue-700 border-blue-200',
  PASSED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  PROCESSING: 'bg-amber-100 text-amber-700 border-amber-200',
  REQUESTED: 'bg-sky-100 text-sky-700 border-sky-200',
  APPROVED: 'bg-blue-100 text-blue-700 border-blue-200',
  PAID: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  VERIFIED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  INACTIVE: 'bg-slate-100 text-slate-600 border-slate-200',
  SUSPENDED: 'bg-rose-100 text-rose-700 border-rose-200',
  BREACHED: 'bg-rose-100 text-rose-700 border-rose-200',
  REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
  CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
  OPEN: 'bg-sky-100 text-sky-700 border-sky-200',
  BUY: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  SELL: 'bg-rose-100 text-rose-700 border-rose-200',
  NOT_STARTED: 'bg-slate-100 text-slate-600 border-slate-200',
}
export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 border-slate-200'
  return <Badge variant="outline" className={`font-semibold rounded-full ${style}`}>{String(status || '').replace(/_/g, ' ')}</Badge>
}

// ---------- Empty state ----------
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        {Icon && <Icon className="h-8 w-8 text-blue-500" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
    </div>
  )
}

// ---------- Loading skeletons ----------
export function CardsSkeleton({ n = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card p-5">
          <Skeleton className="h-4 w-20 mb-3" />
          <Skeleton className="h-8 w-28" />
        </div>
      ))}
    </div>
  )
}
export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
    </div>
  )
}

// ---------- Reveal wrapper ----------
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
