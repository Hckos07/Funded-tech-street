'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Layers, Wallet, ListOrdered, Receipt, TrendingUp,
  BadgeCheck, ScrollText, Bell, LogOut, Menu, Shield, Search, Loader2, Plus,
  DollarSign, UserCheck, Activity, AlertTriangle, ArrowLeft, Home, Pencil,
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Logo, StatusBadge, EmptyState, CountUp, CardsSkeleton, TableSkeleton } from './ui'
import { api, fmtMoney, fmtMoneySigned, fmtPct, fmtDate, fmtDateTime, fmtNum } from '@/lib/fts-api'

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'challenges', label: 'Challenges', icon: Layers },
  { id: 'accounts', label: 'Accounts', icon: Wallet },
  { id: 'trades', label: 'Trades', icon: ListOrdered },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'payouts', label: 'Payouts', icon: TrendingUp },
  { id: 'kyc', label: 'KYC', icon: BadgeCheck },
  { id: 'audit', label: 'Audit Logs', icon: ScrollText },
]

function Stat({ label, value, icon: Icon, tone = 'blue', prefix, suffix, decimals }) {
  const tones = { blue: 'bg-blue-50 text-blue-600', green: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', rose: 'bg-rose-50 text-rose-600' }
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span><div className={`h-9 w-9 rounded-xl flex items-center justify-center ${tones[tone]}`}><Icon className="h-5 w-5" /></div></div>
      <div className="mt-3 text-2xl font-bold text-slate-900"><CountUp value={value} prefix={prefix || ''} suffix={suffix || ''} decimals={decimals || 0} /></div>
    </div>
  )
}

// ---------------------------------------------------------------- OVERVIEW
function AdminOverview() {
  const [data, setData] = useState(null)
  useEffect(() => { api('/admin/stats').then(setData).catch(() => {}) }, [])
  if (!data) return <div className="space-y-6"><CardsSkeleton n={6} /><TableSkeleton /></div>
  const s = data.stats
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="Total Users" value={s.totalUsers} icon={Users} tone="blue" />
        <Stat label="Active Traders" value={s.activeTraders} icon={UserCheck} tone="green" />
        <Stat label="Active Accounts" value={s.activeAccounts} icon={Activity} tone="blue" />
        <Stat label="Total Revenue" value={s.totalRevenue} icon={DollarSign} tone="green" prefix="$" />
        <Stat label="Pending Payouts" value={s.pendingPayouts} icon={TrendingUp} tone="amber" prefix="$" />
        <Stat label="Breached Accounts" value={s.breachedAccounts} icon={AlertTriangle} tone="rose" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Revenue (last 6 months)</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.revenue}>
              <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis hide /><Tooltip formatter={(v) => fmtMoney(v, 0)} />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer></div>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">New Signups</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.signups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#eff6ff' }} /><Bar dataKey="users" radius={[6, 6, 0, 0]} fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer></div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- USERS
function AdminUsers() {
  const [users, setUsers] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [detail, setDetail] = useState(null)
  const load = useCallback(() => {
    const qs = new URLSearchParams()
    if (search) qs.set('search', search)
    if (status !== 'all') qs.set('status', status)
    setUsers(null)
    api(`/admin/users?${qs.toString()}`).then((d) => setUsers(d.users)).catch(() => {})
  }, [search, status])
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [load])
  const setUserStatus = async (id, st) => { await api(`/admin/users/${id}/status`, { method: 'PATCH', body: { status: st } }); toast.success('User updated'); load() }
  const openDetail = async (id) => { setDetail({ loading: true }); const d = await api(`/admin/users/${id}`); setDetail(d) }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input className="pl-9 h-10" placeholder="Search name or email…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-40 h-10"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="INACTIVE">Inactive</SelectItem><SelectItem value="SUSPENDED">Suspended</SelectItem></SelectContent></Select>
      </div>
      <div className="rounded-2xl border bg-card p-4">
        {!users ? <TableSkeleton /> : users.length === 0 ? <EmptyState icon={Users} title="No users found" /> : (
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow>{['User', 'Email', 'Role', 'Country', 'Status', 'Joined', 'Actions'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell><div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">{u.name.split(' ').map((s) => s[0]).join('').slice(0, 2)}</AvatarFallback></Avatar><span className="font-medium">{u.name}</span></div></TableCell>
                  <TableCell className="text-slate-500">{u.email}</TableCell>
                  <TableCell><StatusBadge status={u.role === 'ADMIN' ? 'FUNDED' : 'OPEN'} /></TableCell>
                  <TableCell className="text-slate-500">{u.country || '—'}</TableCell>
                  <TableCell><StatusBadge status={u.status} /></TableCell>
                  <TableCell className="text-slate-500 whitespace-nowrap">{fmtDate(u.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => openDetail(u.id)}>View</Button>
                      {u.status !== 'SUSPENDED'
                        ? <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => setUserStatus(u.id, 'SUSPENDED')}>Suspend</Button>
                        : <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => setUserStatus(u.id, 'ACTIVE')}>Activate</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        )}
      </div>
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {detail?.loading ? <div className="py-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-400" /></div> : detail?.user && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14"><AvatarFallback className="bg-blue-100 text-blue-600 font-bold">{detail.user.name.split(' ').map((s) => s[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                <div><div className="font-bold text-slate-900">{detail.user.name}</div><div className="text-sm text-slate-500">{detail.user.email} · {detail.user.country}</div><div className="mt-1"><StatusBadge status={detail.user.status} /></div></div>
              </div>
              <div><h4 className="font-semibold text-sm mb-2">Accounts ({detail.accounts.length})</h4>
                {detail.accounts.length === 0 ? <p className="text-sm text-slate-400">No accounts</p> : detail.accounts.map((a) => (
                  <div key={a.id} className="flex justify-between text-sm py-1.5 border-b last:border-0"><span>{a.accountNumber} · {fmtMoney(a.accountSize, 0)}</span><span className="font-semibold">{fmtMoneySigned(a.profit)}</span></div>
                ))}
              </div>
              <div><h4 className="font-semibold text-sm mb-2">Recent Trades</h4>
                {detail.trades.length === 0 ? <p className="text-sm text-slate-400">No trades</p> : (
                  <div className="max-h-48 overflow-y-auto space-y-1">{detail.trades.slice(0, 10).map((t) => (
                    <div key={t.id} className="flex justify-between text-sm py-1"><span>{t.symbol} · {t.side}</span><span className={t.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{fmtMoneySigned(t.profit)}</span></div>
                  ))}</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---------------------------------------------------------------- CHALLENGES
const emptyChallenge = { name: '', accountSize: 10000, price: 59, profitTarget: 8, dailyLossLimit: 5, maximumLoss: 10, leverage: 100, minimumTradingDays: 5, profitSplit: 80, description: '' }
function AdminChallenges() {
  const [list, setList] = useState(null)
  const [edit, setEdit] = useState(null)
  const [busy, setBusy] = useState(false)
  const load = () => api('/admin/challenges').then((d) => setList(d.challenges)).catch(() => {})
  useEffect(() => { load() }, [])
  const save = async () => {
    setBusy(true)
    try {
      const nums = ['accountSize', 'price', 'profitTarget', 'dailyLossLimit', 'maximumLoss', 'leverage', 'minimumTradingDays', 'profitSplit']
      const body = { ...edit }; nums.forEach((k) => body[k] = Number(body[k]))
      if (edit.id) await api(`/admin/challenges/${edit.id}`, { method: 'PATCH', body })
      else await api('/admin/challenges', { method: 'POST', body })
      toast.success('Challenge saved'); setEdit(null); load()
    } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  const disable = async (id) => { await api(`/admin/challenges/${id}`, { method: 'DELETE' }); toast.success('Challenge disabled'); load() }
  if (!list) return <TableSkeleton rows={5} />
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setEdit({ ...emptyChallenge })}><Plus className="h-4 w-4 mr-1" /> New Challenge</Button></div>
      <div className="rounded-2xl border bg-card p-4 overflow-x-auto"><Table>
        <TableHeader><TableRow>{['Name', 'Size', 'Price', 'Target', 'Daily', 'Max', 'Leverage', 'Split', 'Status', 'Actions'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
        <TableBody>
          {list.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-semibold">{c.name}</TableCell>
              <TableCell>{fmtMoney(c.accountSize, 0)}</TableCell>
              <TableCell>{fmtMoney(c.price, 0)}</TableCell>
              <TableCell>{c.profitTarget}%</TableCell><TableCell>{c.dailyLossLimit}%</TableCell><TableCell>{c.maximumLoss}%</TableCell>
              <TableCell>1:{c.leverage}</TableCell><TableCell>{c.profitSplit}%</TableCell>
              <TableCell><StatusBadge status={c.status} /></TableCell>
              <TableCell><div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                {c.status === 'ACTIVE' && <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => disable(c.id)}>Disable</Button>}
              </div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{edit?.id ? 'Edit' : 'Create'} Challenge</DialogTitle></DialogHeader>
          {edit && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5"><Label>Name</Label><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              {[['accountSize', 'Account Size ($)'], ['price', 'Price ($)'], ['profitTarget', 'Profit Target (%)'], ['dailyLossLimit', 'Daily Loss (%)'], ['maximumLoss', 'Max Loss (%)'], ['leverage', 'Leverage'], ['minimumTradingDays', 'Min Days'], ['profitSplit', 'Profit Split (%)']].map(([k, l]) => (
                <div key={k} className="space-y-1.5"><Label>{l}</Label><Input type="number" value={edit[k]} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} /></div>
              ))}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button className="bg-blue-600 hover:bg-blue-700" disabled={busy} onClick={save}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---------------------------------------------------------------- ACCOUNTS
function AdminAccounts() {
  const [list, setList] = useState(null)
  const [search, setSearch] = useState('')
  const load = useCallback(() => { const qs = new URLSearchParams(); if (search) qs.set('search', search); setList(null); api(`/admin/accounts?${qs}`).then((d) => setList(d.accounts)).catch(() => {}) }, [search])
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [load])
  const setStatus = async (id, st) => { await api(`/admin/accounts/${id}/status`, { method: 'PATCH', body: { status: st } }); toast.success('Account updated'); load() }
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-4"><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input className="pl-9 h-10" placeholder="Search account number…" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
      <div className="rounded-2xl border bg-card p-4">
        {!list ? <TableSkeleton /> : list.length === 0 ? <EmptyState icon={Wallet} title="No accounts found" /> : (
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow>{['Account', 'Owner', 'Size', 'Balance', 'Profit', 'Drawdown', 'Status', 'Actions'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {list.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-sm">{a.accountNumber}</TableCell>
                  <TableCell>{a.ownerName}</TableCell>
                  <TableCell>{fmtMoney(a.accountSize, 0)}</TableCell>
                  <TableCell>{fmtMoney(a.currentBalance)}</TableCell>
                  <TableCell className={a.profit >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>{fmtMoneySigned(a.profit)}</TableCell>
                  <TableCell>{fmtPct(a.drawdownPercentage)}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell>
                    <Select value={a.status} onValueChange={(v) => setStatus(a.id, v)}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{['ACTIVE', 'PASSED', 'FUNDED', 'BREACHED', 'SUSPENDED', 'CLOSED'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- generic tables
function AdminTrades() {
  const [list, setList] = useState(null)
  useEffect(() => { api('/admin/trades').then((d) => setList(d.trades)).catch(() => {}) }, [])
  if (!list) return <TableSkeleton rows={8} />
  return (
    <div className="rounded-2xl border bg-card p-4 overflow-x-auto"><Table>
      <TableHeader><TableRow>{['Symbol', 'Side', 'Volume', 'Entry', 'Exit', 'P/L', 'Status', 'Date'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{list.map((t) => (
        <TableRow key={t.id}>
          <TableCell className="font-semibold">{t.symbol}</TableCell><TableCell><StatusBadge status={t.side} /></TableCell>
          <TableCell>{t.volume}</TableCell><TableCell>{t.entryPrice}</TableCell><TableCell>{t.exitPrice ?? '—'}</TableCell>
          <TableCell className={t.profit >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>{fmtMoneySigned(t.profit)}</TableCell>
          <TableCell><StatusBadge status={t.status} /></TableCell><TableCell className="text-slate-500 whitespace-nowrap">{fmtDate(t.openedAt)}</TableCell>
        </TableRow>
      ))}</TableBody>
    </Table></div>
  )
}

function AdminTransactions() {
  const [list, setList] = useState(null)
  useEffect(() => { api('/admin/transactions').then((d) => setList(d.transactions)).catch(() => {}) }, [])
  if (!list) return <TableSkeleton rows={6} />
  return (
    <div className="rounded-2xl border bg-card p-4 overflow-x-auto"><Table>
      <TableHeader><TableRow>{['Reference', 'Type', 'Description', 'Amount', 'Status', 'Date'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{list.map((t) => (
        <TableRow key={t.id}>
          <TableCell className="font-mono text-xs">{t.reference}</TableCell><TableCell><StatusBadge status={t.type} /></TableCell>
          <TableCell className="text-slate-600">{t.description}</TableCell><TableCell className="font-semibold">{fmtMoney(t.amount)}</TableCell>
          <TableCell><StatusBadge status={t.status} /></TableCell><TableCell className="text-slate-500 whitespace-nowrap">{fmtDate(t.createdAt)}</TableCell>
        </TableRow>
      ))}</TableBody>
    </Table></div>
  )
}

function AdminPayouts() {
  const [list, setList] = useState(null)
  const [status, setStatus] = useState('all')
  const load = useCallback(() => { const qs = new URLSearchParams(); if (status !== 'all') qs.set('status', status); setList(null); api(`/admin/payouts?${qs}`).then((d) => setList(d.payouts)).catch(() => {}) }, [status])
  useEffect(() => { load() }, [load])
  const setPStatus = async (id, st) => { await api(`/admin/payouts/${id}/status`, { method: 'PATCH', body: { status: st } }); toast.success('Payout updated'); load() }
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-4"><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-44 h-10"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">All Statuses</SelectItem>{['REQUESTED', 'PROCESSING', 'APPROVED', 'PAID', 'REJECTED'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
      <div className="rounded-2xl border bg-card p-4">
        {!list ? <TableSkeleton /> : list.length === 0 ? <EmptyState icon={TrendingUp} title="No payouts" /> : (
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow>{['Owner', 'Amount', 'Method', 'Requested', 'Status', 'Change Status'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{list.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.ownerName}</TableCell><TableCell className="font-semibold text-emerald-600">{fmtMoney(p.amount)}</TableCell>
                <TableCell>{p.paymentMethod}</TableCell><TableCell className="text-slate-500">{fmtDate(p.requestedAt)}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell><Select value={p.status} onValueChange={(v) => setPStatus(p.id, v)}><SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{['REQUESTED', 'PROCESSING', 'APPROVED', 'PAID', 'REJECTED'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table></div>
        )}
      </div>
    </div>
  )
}

function AdminKyc() {
  const [list, setList] = useState(null)
  useEffect(() => { api('/admin/kyc').then((d) => setList(d.kyc)).catch(() => {}) }, [])
  if (!list) return <TableSkeleton rows={4} />
  return (
    <div className="rounded-2xl border bg-card p-4 overflow-x-auto"><Table>
      <TableHeader><TableRow>{['Owner', 'Document', 'Status', 'Submitted', 'Reviewed'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{list.length === 0 ? <TableRow><TableCell colSpan={5}><EmptyState icon={BadgeCheck} title="No KYC records" /></TableCell></TableRow> : list.map((k) => (
        <TableRow key={k.id}><TableCell>{k.ownerName}</TableCell><TableCell>{k.documentType}</TableCell><TableCell><StatusBadge status={k.status} /></TableCell>
          <TableCell className="text-slate-500">{fmtDate(k.submittedAt)}</TableCell><TableCell className="text-slate-500">{fmtDate(k.reviewedAt)}</TableCell></TableRow>
      ))}</TableBody>
    </Table></div>
  )
}

function AdminAudit() {
  const [list, setList] = useState(null)
  useEffect(() => { api('/admin/audit-logs').then((d) => setList(d.logs)).catch(() => {}) }, [])
  if (!list) return <TableSkeleton rows={6} />
  return (
    <div className="rounded-2xl border bg-card p-4 overflow-x-auto"><Table>
      <TableHeader><TableRow>{['Action', 'Entity', 'IP Address', 'Metadata', 'Timestamp'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{list.map((l) => (
        <TableRow key={l.id}><TableCell><StatusBadge status={l.action.includes('DELETE') || l.action.includes('DISABLED') ? 'REJECTED' : 'APPROVED'} /> <span className="ml-1 text-xs font-mono">{l.action}</span></TableCell>
          <TableCell>{l.entity}</TableCell><TableCell className="font-mono text-xs">{l.ipAddress}</TableCell>
          <TableCell className="text-xs text-slate-500">{JSON.stringify(l.metadata)}</TableCell><TableCell className="text-slate-500 whitespace-nowrap">{fmtDateTime(l.createdAt)}</TableCell></TableRow>
      ))}</TableBody>
    </Table></div>
  )
}

// ---------------------------------------------------------------- LAYOUT
export default function Admin({ user, onLogout, onHome, onDashboard }) {
  const [view, setView] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const title = NAV.find((n) => n.id === view)?.label

  const SidebarInner = () => (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-5 flex items-center gap-2"><div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center"><Shield className="h-5 w-5 text-white" /></div><div><div className="text-white font-bold text-sm">FundedTechStreet</div><div className="text-blue-300 text-xs">Admin Console</div></div></div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV.map((n) => (
          <button key={n.id} onClick={() => { setView(n.id); setMobileOpen(false) }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${view === n.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <n.icon className="h-5 w-5" /> {n.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button onClick={onDashboard} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800"><Wallet className="h-5 w-5" /> Trader Dashboard</button>
        <button onClick={onHome} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800"><Home className="h-5 w-5" /> Home</button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-slate-800"><LogOut className="h-5 w-5" /> Log out</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/60">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col z-40">{SidebarInner()}</aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 border-b bg-white/80 backdrop-blur flex items-center gap-3 px-4 lg:px-8">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button></SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-0"><SheetTitle className="sr-only">Admin Navigation</SheetTitle>{SidebarInner()}</SheetContent>
          </Sheet>
          <div><h1 className="text-lg font-bold text-slate-900">{title}</h1></div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-slate-500">{user.name}</span>
            <Avatar className="h-8 w-8"><AvatarFallback className="bg-slate-900 text-white text-sm font-semibold">{user.name.split(' ').map((s) => s[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {view === 'overview' && <AdminOverview />}
            {view === 'users' && <AdminUsers />}
            {view === 'challenges' && <AdminChallenges />}
            {view === 'accounts' && <AdminAccounts />}
            {view === 'trades' && <AdminTrades />}
            {view === 'transactions' && <AdminTransactions />}
            {view === 'payouts' && <AdminPayouts />}
            {view === 'kyc' && <AdminKyc />}
            {view === 'audit' && <AdminAudit />}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
