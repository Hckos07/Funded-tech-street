// FundedTechStreet — client API + formatters (shared)
'use client'

const BASE = '/api'

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('fts_token')
}
export function setToken(t) {
  if (typeof window === 'undefined') return
  if (t) localStorage.setItem('fts_token', t)
  else localStorage.removeItem('fts_token')
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const t = getToken()
  if (auth && t) headers.Authorization = `Bearer ${t}`
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  let data = {}
  try { data = await res.json() } catch { data = {} }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

// ---------- formatters ----------
export const fmtMoney = (n, dp = 2) =>
  '$' + (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })

export const fmtMoneySigned = (n) => {
  const v = Number(n) || 0
  return (v >= 0 ? '+' : '-') + '$' + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const fmtNum = (n) => (Number(n) || 0).toLocaleString('en-US')
export const fmtPct = (n, dp = 2) => `${(Number(n) || 0).toFixed(dp)}%`
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
export const fmtDateTime = (d) => d ? new Date(d).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'
export const compact = (n) => Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(n) || 0)
