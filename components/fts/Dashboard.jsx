'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Wallet, LineChart as LineIcon, ListOrdered, TrendingUp, Receipt,
  BadgeCheck, Bell, User, LifeBuoy, LogOut, Menu, ChevronDown, Plus, Search,
  ArrowUpRight, ArrowDownRight, Target, ShieldAlert, CalendarDays, Loader2, Shield,
  DollarSign, Percent, Activity, Trophy, Home, Check,
} from 'lucide-react'
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from 'recharts'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Logo, StatusBadge, EmptyState, CountUp, CardsSkeleton, TableSkeleton, ThemeToggle } from './ui'
import { api, setToken, fmtMoney, fmtMoneySigned, fmtPct, fmtDate, fmtDateTime, fmtNum } from '@/lib/fts-api'

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'accounts', label: 'My Accounts', icon: Wallet },
  { id: 'performance', label: 'Performance', icon: LineIcon },
  { id: 'trades', label: 'Trades', icon: ListOrdered },
  { id: 'payouts', label: 'Payouts', icon: TrendingUp },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'kyc', label: 'KYC', icon: BadgeCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'support', label: 'Support', icon: LifeBuoy },
]

function MetricCard({ label, value, sub, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600', green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600', slate: 'bg-slate-100 text-slate-600',
  }
  return (
    <div className="rounded-2xl border bg-card p-5 hover-lift">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${tones[tone]}`}><Icon className="h-4.5 w-4.5 h-5 w-5" /></div>
      </div>
      <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-xs mt-1 text-slate-400">{sub}</div>}
    </div>
  )
}

function ProgressRow({ label, current, max, color = 'blue', invert }) {
  const pct = Math.min(100, (current / max) * 100)
  const colors = { blue: 'bg-blue-500', amber: 'bg-amber-500', rose: 'bg-rose-500', emerald: 'bg-emerald-500' }
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{fmtMoney(current, 0)} / {fmtMoney(max, 0)}</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} className={`h-full rounded-full ${colors[color]}`} />
      </div>
      <div className="text-xs text-slate-400 mt-1">{pct.toFixed(1)}%</div>
    </div>
  )
}

// ---------------------------------------------------------------- OVERVIEW
function Overview({ account }) {
  const [perf, setPerf] = useState(null)
  const [trades, setTrades] = useState(null)
  const [range, setRange] = useState('ALL')
  useEffect(() => {
    if (!account) return
    setPerf(null)
    api(`/accounts/${account.id}/performance?range=${range}`).then(setPerf).catch(() => {})
  }, [account, range])
  useEffect(() => {
    if (!account) return
    api(`/trades?accountId=${account.id}&limit=6`).then((d) => setTrades(d.trades)).catch(() => {})
  }, [account])

  if (!account) return <EmptyState icon={Wallet} title="No account selected" description="Purchase a challenge to get started." />

  const metrics = [
    { label: 'Balance', value: fmtMoney(account.currentBalance), icon: DollarSign, tone: 'blue' },
    { label: 'Equity', value: fmtMoney(account.currentEquity), icon: Activity, tone: 'blue' },
    { label: 'Total Profit', value: fmtMoneySigned(account.profit), icon: TrendingUp, tone: account.profit >= 0 ? 'green' : 'amber', sub: fmtPct(account.profitPercentage) },
    { label: 'Profit %', value: fmtPct(account.profitPercentage), icon: Percent, tone: 'green' },
    { label: 'Drawdown', value: fmtPct(account.drawdownPercentage), icon: ShieldAlert, tone: 'amber' },
    { label: 'Win Rate', value: fmtPct(account.winRate, 1), icon: Trophy, tone: 'blue' },
  ]
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* equity chart */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div><h3 className="font-semibold text-slate-900">Account Equity</h3><p className="text-sm text-slate-500">{account.accountNumber} · {account.challengeName}</p></div>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {['1D', '1W', '1M', '3M', 'ALL'].map((r) => (
                <button key={r} onClick={() => setRange(r)} className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${range === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{r}</button>
              ))}
            </div>
          </div>
          <div className="h-72">
            {!perf ? <div className="h-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-400" /></div> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={perf.equity}>
                  <defs><linearGradient id="eq" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} minTickGap={40} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['dataMin - 500', 'dataMax + 500']} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={44} />
                  <Tooltip formatter={(v) => fmtMoney(v)} />
                  <Area type="monotone" dataKey="equity" stroke="#2563eb" strokeWidth={2.5} fill="url(#eq)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* challenge progress */}
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-slate-900 mb-1">Challenge Progress</h3>
          <p className="text-sm text-slate-500 mb-5">Evaluation targets & risk limits</p>
          <div className="space-y-5">
            <ProgressRow label="Profit Target" current={account.profit} max={account.profitTarget} color="emerald" />
            <ProgressRow label="Daily Loss" current={account.dailyLoss} max={account.dailyLossLimit} color="amber" />
            <ProgressRow label="Maximum Drawdown" current={account.currentDrawdown} max={account.maximumLoss} color="rose" />
            <div>
              <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-600">Trading Days</span><span className="font-semibold text-slate-800">{account.tradingDays} / {account.minimumTradingDays}</span></div>
              <div className="flex gap-1">
                {Array.from({ length: Math.max(account.minimumTradingDays, account.tradingDays) }).map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full ${i < account.tradingDays ? 'bg-blue-500' : 'bg-slate-100'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* recent trades */}
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Trades</h3>
        {!trades ? <TableSkeleton rows={5} /> : trades.length === 0 ? <EmptyState icon={ListOrdered} title="No trades found" description="Your trading history will appear here." /> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                {['Symbol', 'Side', 'Volume', 'Entry', 'Exit', 'P/L', 'Status', 'Date'].map((h) => <TableHead key={h}>{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {trades.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-semibold">{t.symbol}</TableCell>
                    <TableCell><StatusBadge status={t.side} /></TableCell>
                    <TableCell>{t.volume}</TableCell>
                    <TableCell>{t.entryPrice}</TableCell>
                    <TableCell>{t.exitPrice ?? '—'}</TableCell>
                    <TableCell className={t.profit >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>{fmtMoneySigned(t.profit)}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-slate-500 whitespace-nowrap">{fmtDate(t.openedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- ACCOUNTS
function Accounts({ accounts, selected, onSelect }) {
  if (!accounts) return <CardsSkeleton />
  if (accounts.length === 0) return <EmptyState icon={Wallet} title="No accounts yet" description="Purchase a challenge to create your first trading account." />
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {accounts.map((a) => (
        <div key={a.id} className={`rounded-2xl border p-6 hover-lift bg-card ${selected?.id === a.id ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
          <div className="flex items-center justify-between">
            <div><div className="font-bold text-slate-900">{a.accountNumber}</div><div className="text-sm text-slate-500">{a.challengeName} · {a.accountType}</div></div>
            <StatusBadge status={a.status} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-5">
            {[['Balance', fmtMoney(a.currentBalance)], ['Equity', fmtMoney(a.currentEquity)], ['Profit', fmtMoneySigned(a.profit)], ['Drawdown', fmtPct(a.drawdownPercentage)]].map(([k, v]) => (
              <div key={k}><div className="text-xs text-slate-400">{k}</div><div className="font-semibold text-slate-800">{v}</div></div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {fmtDate(a.createdAt)}</span>
            <Button size="sm" variant={selected?.id === a.id ? 'secondary' : 'default'} className={selected?.id === a.id ? '' : 'bg-blue-600 hover:bg-blue-700'} onClick={() => onSelect(a)}>
              {selected?.id === a.id ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------- PERFORMANCE
function PerformancePage({ account }) {
  const [perf, setPerf] = useState(null)
  useEffect(() => { if (account) api(`/accounts/${account.id}/performance?range=ALL`).then(setPerf).catch(() => {}) }, [account])
  if (!account) return <EmptyState icon={LineIcon} title="No account selected" />
  if (!perf) return <div className="space-y-6"><CardsSkeleton n={4} /><TableSkeleton /></div>
  const p = perf.performance
  const kpis = [
    ['Total Profit', fmtMoneySigned(p.totalProfit), 'green'], ['Win Rate', fmtPct(p.winRate, 1), 'blue'],
    ['Loss Rate', fmtPct(p.lossRate, 1), 'amber'], ['Profit Factor', `${p.profitFactor}x`, 'blue'],
    ['Average Win', fmtMoney(p.averageWin), 'green'], ['Average Loss', fmtMoney(p.averageLoss), 'amber'],
    ['Largest Win', fmtMoney(p.largestWin), 'green'], ['Largest Loss', fmtMoney(p.largestLoss), 'amber'],
    ['Max Drawdown', fmtPct(p.maxDrawdown), 'amber'], ['Total Trades', fmtNum(p.totalTrades), 'slate'],
  ]
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map(([k, v, tone]) => (
          <div key={k} className="rounded-2xl border bg-card p-4">
            <div className="text-xs text-slate-400">{k}</div>
            <div className={`text-xl font-bold mt-1 ${tone === 'green' ? 'text-emerald-600' : tone === 'amber' ? 'text-amber-600' : 'text-slate-900'}`}>{v}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Equity Curve</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%">
            <AreaChart data={perf.equity}>
              <defs><linearGradient id="pp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="date" hide /><YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
              <Tooltip formatter={(v) => fmtMoney(v)} />
              <Area type="monotone" dataKey="equity" stroke="#2563eb" strokeWidth={2.5} fill="url(#pp)" />
            </AreaChart>
          </ResponsiveContainer></div>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Monthly P&L</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={perf.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v) => fmtMoney(v)} cursor={{ fill: '#eff6ff' }} />
              <Bar dataKey="profit" radius={[6, 6, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer></div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- TRADES
function TradesPage({ account }) {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ symbol: '', side: 'all', status: 'all', search: '' })
  const load = useCallback(() => {
    if (!account) return
    const qs = new URLSearchParams({ accountId: account.id, page: String(page), limit: '10' })
    if (filters.side !== 'all') qs.set('side', filters.side)
    if (filters.status !== 'all') qs.set('status', filters.status)
    if (filters.symbol) qs.set('symbol', filters.symbol)
    setData(null)
    api(`/trades?${qs.toString()}`).then(setData).catch(() => {})
  }, [account, page, filters])
  useEffect(() => { load() }, [load])

  if (!account) return <EmptyState icon={ListOrdered} title="No account selected" />
  const rows = (data?.trades || []).filter((t) => !filters.search || t.symbol.toLowerCase().includes(filters.search.toLowerCase()))
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input className="pl-9 h-10" placeholder="Search symbol…" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></div>
        <Select value={filters.side} onValueChange={(v) => { setPage(1); setFilters({ ...filters, side: v }) }}>
          <SelectTrigger className="w-32 h-10"><SelectValue placeholder="Side" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Sides</SelectItem><SelectItem value="BUY">Buy</SelectItem><SelectItem value="SELL">Sell</SelectItem></SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(v) => { setPage(1); setFilters({ ...filters, status: v }) }}>
          <SelectTrigger className="w-36 h-10"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="OPEN">Open</SelectItem><SelectItem value="CLOSED">Closed</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="rounded-2xl border bg-card p-4">
        {!data ? <TableSkeleton /> : rows.length === 0 ? <EmptyState icon={ListOrdered} title="No trades found" description="Try adjusting your filters." /> : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>{['Symbol', 'Side', 'Volume', 'Entry', 'Exit', 'SL', 'TP', 'P/L', 'Status', 'Date'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
                <TableBody>
                  {rows.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-semibold">{t.symbol}</TableCell>
                      <TableCell><StatusBadge status={t.side} /></TableCell>
                      <TableCell>{t.volume}</TableCell>
                      <TableCell>{t.entryPrice}</TableCell>
                      <TableCell>{t.exitPrice ?? '—'}</TableCell>
                      <TableCell className="text-slate-400">{t.stopLoss ?? '—'}</TableCell>
                      <TableCell className="text-slate-400">{t.takeProfit ?? '—'}</TableCell>
                      <TableCell className={t.profit >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>{fmtMoneySigned(t.profit)}</TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                      <TableCell className="text-slate-500 whitespace-nowrap">{fmtDate(t.openedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-slate-500">Page {data.page} of {data.pages} · {data.total} trades</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- PAYOUTS
function PayoutsPage({ account }) {
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ amount: '', paymentMethod: 'Bank Transfer', accountDetails: '' })
  const [busy, setBusy] = useState(false)
  const load = () => api('/payouts').then(setData).catch(() => {})
  useEffect(() => { load() }, [])
  const submit = async () => {
    setBusy(true)
    try {
      await api('/payouts', { method: 'POST', body: { ...form, amount: Number(form.amount), accountId: account?.id } })
      toast.success('Payout request submitted'); setOpen(false); setForm({ amount: '', paymentMethod: 'Bank Transfer', accountDetails: '' }); load()
    } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  if (!data) return <div className="space-y-6"><CardsSkeleton /><TableSkeleton /></div>
  const s = data.summary
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Available" value={fmtMoney(s.available)} icon={Wallet} tone="green" />
        <MetricCard label="Total Paid" value={fmtMoney(s.paid)} icon={Check} tone="blue" />
        <MetricCard label="Pending" value={fmtMoney(s.pending)} icon={Loader2} tone="amber" />
        <div className="rounded-2xl border bg-gradient-to-br from-blue-600 to-sky-500 p-5 text-white flex flex-col justify-between">
          <div className="text-sm text-blue-50">Request a payout</div>
          <Button className="mt-3 bg-white text-blue-700 hover:bg-blue-50" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> New Payout</Button>
        </div>
      </div>
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Payout History</h3>
        {data.payouts.length === 0 ? <EmptyState icon={TrendingUp} title="No payouts yet" description="Request your first payout when you're profitable." /> : (
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow>{['Amount', 'Profit', 'Split', 'Method', 'Status', 'Requested', 'Processed'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {data.payouts.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell className="font-semibold text-emerald-600">{fmtMoney(pay.amount)}</TableCell>
                  <TableCell>{fmtMoney(pay.profitAmount)}</TableCell>
                  <TableCell>{pay.profitSplit}%</TableCell>
                  <TableCell>{pay.paymentMethod}</TableCell>
                  <TableCell><StatusBadge status={pay.status} /></TableCell>
                  <TableCell className="text-slate-500">{fmtDate(pay.requestedAt)}</TableCell>
                  <TableCell className="text-slate-500">{fmtDate(pay.processedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request Payout</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Amount (USD)</Label><Input type="number" placeholder="1000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Payment Method</Label>
              <Select value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="Crypto (USDT)">Crypto (USDT)</SelectItem><SelectItem value="PayPal">PayPal</SelectItem></SelectContent>
              </Select></div>
            <div className="space-y-1.5"><Label>Account Details</Label><Input placeholder="IBAN / wallet address" value={form.accountDetails} onChange={(e) => setForm({ ...form, accountDetails: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" disabled={busy || !form.amount} onClick={submit}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Request'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---------------------------------------------------------------- TRANSACTIONS
function TransactionsPage() {
  const [data, setData] = useState(null)
  useEffect(() => { api('/transactions').then((d) => setData(d.transactions)).catch(() => {}) }, [])
  if (!data) return <TableSkeleton rows={6} />
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="font-semibold text-slate-900 mb-4">Transaction History</h3>
      {data.length === 0 ? <EmptyState icon={Receipt} title="No transactions" /> : (
        <div className="overflow-x-auto"><Table>
          <TableHeader><TableRow>{['Reference', 'Type', 'Description', 'Method', 'Amount', 'Status', 'Date'].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
          <TableBody>
            {data.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs">{t.reference}</TableCell>
                <TableCell><StatusBadge status={t.type} /></TableCell>
                <TableCell className="text-slate-600">{t.description}</TableCell>
                <TableCell className="text-slate-500">{t.paymentMethod}</TableCell>
                <TableCell className="font-semibold">{fmtMoney(t.amount)}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell className="text-slate-500 whitespace-nowrap">{fmtDate(t.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- KYC
function KycPage() {
  const [kyc, setKyc] = useState(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => { api('/kyc').then((d) => setKyc(d.kyc)).catch(() => {}) }, [])
  const verify = async () => { setBusy(true); try { const d = await api('/kyc', { method: 'POST', body: { documentType: 'Passport' } }); setKyc(d.kyc); toast.success('KYC verified (demo)') } catch (e) { toast.error(e.message) } finally { setBusy(false) } }
  if (!kyc) return <CardsSkeleton n={2} />
  const verified = kyc.status === 'VERIFIED'
  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border bg-card p-8 text-center">
        <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center ${verified ? 'bg-emerald-100' : 'bg-amber-100'}`}>
          {verified ? <BadgeCheck className="h-8 w-8 text-emerald-600" /> : <Shield className="h-8 w-8 text-amber-600" />}
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">Identity Verification</h3>
        <div className="mt-2 flex justify-center"><StatusBadge status={kyc.status} /></div>
        {verified ? (
          <div className="mt-4 text-sm text-slate-500 space-y-1">
            <p>Document: {kyc.documentType}</p><p>Verified on {fmtDate(kyc.reviewedAt)}</p>
            <p className="text-slate-400">{kyc.notes}</p>
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm text-slate-500">Complete a quick simulated verification to unlock payouts.</p>
            <Button className="mt-5 bg-blue-600 hover:bg-blue-700" disabled={busy} onClick={verify}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start Verification'}</Button>
          </>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- NOTIFICATIONS
function NotificationsPage() {
  const [data, setData] = useState(null)
  const load = () => api('/notifications').then((d) => setData(d.notifications)).catch(() => {})
  useEffect(() => { load() }, [])
  const readAll = async () => { await api('/notifications/read-all', { method: 'PATCH' }); load() }
  const readOne = async (id) => { await api(`/notifications/${id}/read`, { method: 'PATCH' }); load() }
  if (!data) return <TableSkeleton rows={5} />
  const tone = { SUCCESS: 'bg-emerald-100 text-emerald-600', WARNING: 'bg-amber-100 text-amber-600', INFO: 'bg-blue-100 text-blue-600' }
  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex justify-end"><Button variant="outline" size="sm" onClick={readAll}>Mark all as read</Button></div>
      {data.length === 0 ? <EmptyState icon={Bell} title="No notifications" /> : data.map((n) => (
        <div key={n.id} className={`rounded-2xl border p-4 flex items-start gap-4 ${n.read ? 'bg-card' : 'bg-blue-50/50 border-blue-200'}`}>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${tone[n.type] || tone.INFO}`}><Bell className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="flex items-center justify-between"><h4 className="font-semibold text-slate-900">{n.title}</h4>{!n.read && <button onClick={() => readOne(n.id)} className="text-xs text-blue-600 hover:underline">Mark read</button>}</div>
            <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
            <p className="text-xs text-slate-400 mt-1">{fmtDateTime(n.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------- PROFILE
function ProfilePage({ user, onUpdate }) {
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', country: user.country || '' })
  const [busy, setBusy] = useState(false)
  const save = async () => { setBusy(true); try { const d = await api('/profile', { method: 'PATCH', body: form }); onUpdate(d.profile); toast.success('Profile updated') } catch (e) { toast.error(e.message) } finally { setBusy(false) } }
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="rounded-2xl border bg-card p-6 text-center">
        <Avatar className="h-24 w-24 mx-auto"><AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">{user.name.split(' ').map((s) => s[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
        <h3 className="mt-4 font-bold text-slate-900">{user.name}</h3>
        <p className="text-sm text-slate-500">{user.email}</p>
        <div className="mt-4 pt-4 border-t space-y-2 text-sm text-left">
          <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="font-medium">{user.role}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Member since</span><span className="font-medium">{fmtDate(user.createdAt)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Status</span><StatusBadge status={user.status} /></div>
        </div>
      </div>
      <div className="md:col-span-2 rounded-2xl border bg-card p-6">
        <h3 className="font-semibold text-slate-900 mb-5">Edit Profile</h3>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Full name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Email</Label><Input value={user.email} disabled /></div>
          <Button className="bg-blue-600 hover:bg-blue-700" disabled={busy} onClick={save}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}</Button>
        </div>
      </div>
    </div>
  )
}

function SupportPage() {
  return (
    <div className="max-w-2xl rounded-2xl border bg-card p-8 text-center">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center"><LifeBuoy className="h-8 w-8 text-blue-600" /></div>
      <h3 className="mt-4 text-xl font-bold text-slate-900">24/7 Trader Support</h3>
      <p className="mt-2 text-slate-500">Our team is here around the clock. Reach out anytime — this is a demo environment.</p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast.success('Live chat opened (demo)')}>Start Live Chat</Button>
        <Button variant="outline" onClick={() => toast.success('support@fundedtechstreet.com')}>Email Support</Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- LAYOUT
export default function Dashboard({ user: initialUser, onLogout, onHome, onGetChallenge }) {
  const [user, setUser] = useState(initialUser)
  const [view, setView] = useState('overview')
  const [accounts, setAccounts] = useState(null)
  const [selected, setSelected] = useState(null)
  const [notifs, setNotifs] = useState({ notifications: [], unread: 0 })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    api('/accounts').then((d) => { setAccounts(d.accounts); setSelected(d.accounts[0] || null) }).catch(() => setAccounts([]))
    api('/notifications').then(setNotifs).catch(() => {})
  }, [])

  const title = NAV.find((n) => n.id === view)?.label || 'Overview'

  const SidebarInner = () => (
    <div className="flex flex-col h-full">
      <div className="p-5"><button onClick={onHome}><Logo /></button></div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV.map((n) => (
          <button key={n.id} onClick={() => { setView(n.id); setMobileOpen(false) }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${view === n.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-600 hover:bg-blue-50'}`}>
            <n.icon className="h-4.5 w-4.5 h-5 w-5" /> {n.label}
            {n.id === 'notifications' && notifs.unread > 0 && <span className="ml-auto bg-rose-500 text-white text-[10px] rounded-full h-5 min-w-5 px-1 flex items-center justify-center">{notifs.unread}</span>}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t">
        {user.role === 'ADMIN' && <Button variant="outline" className="w-full mb-2" onClick={() => (window.location.href = '/?admin=1')}><Shield className="h-4 w-4 mr-1" /> Admin Panel</Button>}
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition"><LogOut className="h-5 w-5" /> Log out</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r bg-white flex-col z-40">{SidebarInner()}</aside>

      <div className="lg:pl-64">
        {/* topbar */}
        <header className="sticky top-0 z-30 h-16 border-b bg-white/80 backdrop-blur flex items-center gap-3 px-4 lg:px-8">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button></SheetTrigger>
            <SheetContent side="left" className="p-0 w-72"><SheetTitle className="sr-only">Navigation</SheetTitle>{SidebarInner()}</SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {/* account selector */}
            {accounts && accounts.length > 0 && (
              <Select value={selected?.id} onValueChange={(id) => setSelected(accounts.find((a) => a.id === id))}>
                <SelectTrigger className="w-44 h-9 hidden sm:flex"><SelectValue /></SelectTrigger>
                <SelectContent>{accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.accountNumber} · {fmtMoney(a.accountSize, 0)}</SelectItem>)}</SelectContent>
              </Select>
            )}
            {/* notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative"><Bell className="h-5 w-5" />{notifs.unread > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel><DropdownMenuSeparator />
                {notifs.notifications.slice(0, 5).map((n) => (
                  <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2" onClick={() => setView('notifications')}>
                    <span className="font-medium text-sm">{n.title}</span><span className="text-xs text-slate-500 line-clamp-1">{n.message}</span>
                  </DropdownMenuItem>
                ))}
                {notifs.notifications.length === 0 && <div className="px-2 py-4 text-center text-sm text-slate-400">No notifications</div>}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-slate-100 transition">
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">{user.name.split(' ').map((s) => s[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                  <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel><div className="font-semibold">{user.name}</div><div className="text-xs text-slate-500 font-normal">{user.email}</div></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setView('profile')}><User className="h-4 w-4 mr-2" /> Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={onHome}><Home className="h-4 w-4 mr-2" /> Home</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-rose-600"><LogOut className="h-4 w-4 mr-2" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {view === 'overview' && <Overview account={selected} />}
            {view === 'accounts' && <div className="space-y-5"><div className="flex justify-between items-center"><p className="text-slate-500">All trading accounts linked to your profile.</p><Button className="bg-blue-600 hover:bg-blue-700" onClick={onGetChallenge}><Plus className="h-4 w-4 mr-1" /> New Challenge</Button></div><Accounts accounts={accounts} selected={selected} onSelect={setSelected} /></div>}
            {view === 'performance' && <PerformancePage account={selected} />}
            {view === 'trades' && <TradesPage account={selected} />}
            {view === 'payouts' && <PayoutsPage account={selected} />}
            {view === 'transactions' && <TransactionsPage />}
            {view === 'kyc' && <KycPage />}
            {view === 'notifications' && <NotificationsPage />}
            {view === 'profile' && <ProfilePage user={user} onUpdate={setUser} />}
            {view === 'support' && <SupportPage />}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
