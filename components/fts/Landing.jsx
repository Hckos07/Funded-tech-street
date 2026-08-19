'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Menu, X, ArrowRight, Check, ShieldCheck, Target, TrendingUp, Wallet,
  Zap, Clock, Globe, Users, LineChart as LineIcon, BarChart3, Layers,
  ChevronDown, Twitter, Linkedin, Youtube, Instagram, CircleDollarSign, Trophy,
} from 'lucide-react'
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid,
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { Logo, CountUp, Reveal, ThemeToggle } from './ui'
import { fmtMoney } from '@/lib/fts-api'

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Challenges', href: '#challenges' },
  { label: 'How It Works', href: '#how' },
  { label: 'Trading Rules', href: '#rules' },
  { label: 'FAQ', href: '#faq' },
]

const heroEquity = Array.from({ length: 30 }).map((_, i) => ({
  x: i,
  v: 100000 + i * 180 + Math.sin(i / 2) * 700 + (i > 20 ? (i - 20) * 260 : 0),
}))

const perfMonthly = [
  { m: 'Jan', p: 2400 }, { m: 'Feb', p: 1398 }, { m: 'Mar', p: 3800 },
  { m: 'Apr', p: 3908 }, { m: 'May', p: 4800 }, { m: 'Jun', p: 4280 },
]
const perfEquity = Array.from({ length: 24 }).map((_, i) => ({
  m: i, v: 100000 + i * 900 + Math.sin(i / 3) * 1600,
}))

// ------------------------------------------------------------------ NAVBAR
function Navbar({ onLogin, onGetFunded }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', on)
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass soft-shadow' : 'bg-transparent'}`}>
      <div className="container flex items-center justify-between h-16">
        <a href="#home"><Logo /></a>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" className="text-slate-700 hover:text-blue-600" onClick={onLogin}>Login</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25" onClick={onGetFunded}>
            Get Funded <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden glass border-t px-4 py-4 space-y-1">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50">{n.label}</a>
          ))}
          <div className="flex gap-2 pt-2">
            <ThemeToggle className="border" />
            <Button variant="outline" className="flex-1" onClick={onLogin}>Login</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={onGetFunded}>Get Funded</Button>
          </div>
        </div>
      )}
    </header>
  )
}

// ------------------------------------------------------------------ HERO
function Hero({ onGetFunded }) {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 grid-bg">
      {/* soft blue glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="container relative grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75" /><span className="rounded-full h-2 w-2 bg-blue-500" /></span>
            One-step evaluation · Up to 80% profit split
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
            Trade Bigger. <br />Build Your Edge. <br /><span className="gradient-text">Get Funded.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-lg text-slate-600 max-w-lg">
            Trade with confidence through FundedTechStreet's modern funded trading programs built for serious traders. Prove your skill, get funded up to $200K.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-7 text-base shadow-xl shadow-blue-500/30" onClick={onGetFunded}>
              Get Funded <ArrowRight className="ml-1.5 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-7 text-base border-slate-300" asChild>
              <a href="#challenges">Explore Challenges</a>
            </Button>
          </motion.div>
          <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-blue-500" /> Secure payouts</div>
            <div className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-blue-500" /> Instant funding</div>
            <div className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-blue-500" /> 92+ countries</div>
          </div>
        </div>

        {/* 3D-ish floating dashboard preview */}
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="relative" style={{ perspective: '1200px' }}>
          <div className="relative animate-float-slow" style={{ transform: 'rotateY(-10deg) rotateX(6deg)' }}>
            <div className="rounded-3xl border border-white/70 glass soft-shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-slate-500">Account Equity</div>
                  <div className="text-2xl font-bold text-slate-900">{fmtMoney(103910, 0)}</div>
                </div>
                <div className="rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold px-3 py-1 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> +4.28%
                </div>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={heroEquity} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2.5} fill="url(#heroGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[['Win Rate', '68.4%'], ['Profit', '+$4,280'], ['Drawdown', '1.09%']].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-white/70 border border-white p-2.5 text-center">
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">{k}</div>
                    <div className="text-sm font-bold text-slate-800">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* floating pills */}
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-6 top-28 rounded-2xl glass soft-shadow px-4 py-3 hidden sm:flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center"><Target className="h-4 w-4 text-blue-600" /></div>
              <div><div className="text-[10px] text-slate-400">Target hit</div><div className="text-sm font-bold text-slate-800">42.8%</div></div>
            </motion.div>
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity }}
              className="absolute -right-4 bottom-8 rounded-2xl glass soft-shadow px-4 py-3 hidden sm:flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center"><Wallet className="h-4 w-4 text-emerald-600" /></div>
              <div><div className="text-[10px] text-slate-400">Paid out</div><div className="text-sm font-bold text-slate-800">$1,840</div></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ STATS
function Stats({ stats }) {
  const items = [
    { icon: CircleDollarSign, label: 'Capital Allocated', value: 25, prefix: '$', suffix: 'M+' },
    { icon: Users, label: 'Active Traders', value: 15, suffix: 'K+' },
    { icon: Globe, label: 'Countries', value: 92, suffix: '+' },
    { icon: Clock, label: 'Trader Support', value: 24, suffix: '/7' },
  ]
  return (
    <section className="py-16 border-y bg-white">
      <div className="container grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((it, i) => (
          <Reveal key={it.label} delay={i * 0.08} className="text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <it.icon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-slate-900">
              <CountUp value={it.value} prefix={it.prefix || ''} suffix={it.suffix || ''} />
            </div>
            <div className="text-sm text-slate-500 mt-1">{it.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ CHALLENGES
function Challenges({ challenges, onSelect }) {
  return (
    <section id="challenges" className="py-24">
      <div className="container">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Funding Programs</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">Choose Your Challenge</h2>
          <p className="text-slate-600 mt-3">One-step evaluation. No time limit. Keep up to 80% of your profits. Pick the account size that matches your ambition.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {challenges.map((c, i) => {
            const target = c.accountSize * c.profitTarget / 100
            const daily = c.accountSize * c.dailyLossLimit / 100
            const max = c.accountSize * c.maximumLoss / 100
            const rows = [
              ['Profit Target', fmtMoney(target, 0)],
              ['Daily Loss', fmtMoney(daily, 0)],
              ['Max Loss', fmtMoney(max, 0)],
              ['Leverage', `1:${c.leverage}`],
              ['Profit Split', `${c.profitSplit}%`],
              ['Min. Trading Days', c.minimumTradingDays],
            ]
            return (
              <Reveal key={c.id} delay={i * 0.06} className="h-full">
                <div className={`relative h-full rounded-3xl border p-7 hover-lift bg-card ${c.recommended ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xl shadow-blue-500/10' : 'border-slate-200'}`}>
                  {c.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 text-white text-xs font-semibold px-3 py-1 shadow-lg">Most Popular</div>
                  )}
                  <div className="text-sm font-medium text-slate-500">{c.name}</div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">{fmtMoney(c.accountSize, 0)}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-blue-600">{fmtMoney(c.price, 0)}</span>
                    <span className="text-sm text-slate-400">one-time fee</span>
                  </div>
                  <div className="mt-6 space-y-3">
                    {rows.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">{k}</span>
                        <span className="font-semibold text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`mt-7 w-full h-11 ${c.recommended ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                    onClick={() => onSelect(c)}>
                    Start Challenge <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ HOW IT WORKS
function HowItWorks() {
  const steps = [
    { n: '01', t: 'Choose Your Challenge', d: 'Select the account size that fits your strategy — from $10K to $200K.', icon: Layers },
    { n: '02', t: 'Trade Your Strategy', d: 'Trade forex, indices, metals & crypto on your terms with 1:100 leverage.', icon: LineIcon },
    { n: '03', t: 'Hit Your Targets', d: 'Reach the profit target while respecting the daily and maximum loss rules.', icon: Target },
    { n: '04', t: 'Get Funded', d: 'Pass the evaluation, get funded, and withdraw up to 80% of your profits.', icon: Trophy },
  ]
  return (
    <section id="how" className="py-24 bg-gradient-to-b from-white to-blue-50/40">
      <div className="container">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">How It Works</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">Get Funded in 4 Simple Steps</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative h-full rounded-3xl bg-card border border-slate-200 p-7 hover-lift">
                <div className="text-5xl font-bold text-blue-100">{s.n}</div>
                <div className="-mt-6 mb-4 h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{s.t}</h3>
                <p className="text-sm text-slate-500 mt-2">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ TRADING RULES
function TradingRules() {
  const rules = [
    { icon: Target, t: 'Profit Target', v: '8%', d: 'Reach an 8% return to pass your evaluation.' },
    { icon: ShieldCheck, t: 'Daily Loss Limit', v: '5%', d: 'Do not exceed 5% loss in a single trading day.' },
    { icon: BarChart3, t: 'Maximum Drawdown', v: '10%', d: 'Overall account drawdown must stay under 10%.' },
    { icon: Clock, t: 'Minimum Trading Days', v: '5', d: 'Trade on at least 5 separate days.' },
    { icon: Zap, t: 'Leverage', v: '1:100', d: 'Trade with up to 1:100 leverage across assets.' },
    { icon: Wallet, t: 'Profit Split', v: '80%', d: 'Keep up to 80% of the profits you generate.' },
  ]
  return (
    <section id="rules" className="py-24">
      <div className="container">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Trading Rules</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">Clear, Fair & Transparent</h2>
          <p className="text-slate-600 mt-3">Simple rules designed to reward disciplined, consistent traders.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((r, i) => (
            <Reveal key={r.t} delay={i * 0.05}>
              <div className="rounded-2xl border border-slate-200 bg-card p-6 hover-lift h-full">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center"><r.icon className="h-5 w-5 text-blue-600" /></div>
                  <span className="text-2xl font-bold text-blue-600">{r.v}</span>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{r.t}</h3>
                <p className="text-sm text-slate-500 mt-1">{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800"><b>Restricted strategies:</b> High-frequency tick scalping, latency arbitrage, and grid/martingale abuse are not permitted. Trade responsibly — this is a demo evaluation environment.</p>
        </Reveal>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ PERFORMANCE
function Performance() {
  const kpis = [['Avg. Win Rate', '68.4%'], ['Avg. Trade', '+$312'], ['Max Drawdown', '4.2%'], ['Profit Factor', '1.9x']]
  return (
    <section className="py-24 bg-gradient-to-b from-blue-50/40 to-white">
      <div className="container">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Performance</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">Real Traders. Real Results.</h2>
          <p className="text-slate-600 mt-3">A snapshot of simulated funded-trader performance on the FundedTechStreet platform.</p>
        </Reveal>
        <div className="grid lg:grid-cols-3 gap-6">
          <Reveal className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-card p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Aggregate Equity Curve</h3>
                <span className="text-sm text-emerald-600 font-semibold">+21.6% avg return</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={perfEquity}>
                    <defs>
                      <linearGradient id="pG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                    <XAxis dataKey="m" hide />
                    <YAxis hide domain={['dataMin - 2000', 'dataMax + 2000']} />
                    <Tooltip formatter={(v) => fmtMoney(v, 0)} labelFormatter={() => ''} />
                    <Area type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2.5} fill="url(#pG)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-slate-200 bg-card p-6 h-full">
              <h3 className="font-semibold text-slate-900 mb-4">Monthly P&L</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={perfMonthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                    <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip formatter={(v) => fmtMoney(v, 0)} cursor={{ fill: '#eff6ff' }} />
                    <Bar dataKey="p" radius={[6, 6, 0, 0]} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                {kpis.map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-blue-50/60 p-3 text-center">
                    <div className="text-lg font-bold text-slate-900">{v}</div>
                    <div className="text-[11px] text-slate-500">{k}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ FAQ
function FAQ() {
  const qs = [
    ['What is FundedTechStreet?', 'FundedTechStreet is a modern funded trading platform. We evaluate your trading skill through a one-step challenge and provide you with a funded account so you can trade our capital and keep a share of the profits.'],
    ['How does the challenge work?', 'Purchase a challenge, trade to reach the profit target (8%) while staying within the daily loss (5%) and maximum drawdown (10%) limits, and trade for at least 5 days. Pass and you get funded.'],
    ['What happens after I pass?', 'Once you pass, your account is upgraded to a funded account. You continue trading under the same rules and can request payouts of up to 80% of your profits.'],
    ['How are payouts handled?', 'Payouts are processed bi-weekly via bank transfer or crypto. You keep up to 80% of the profit you generate. In this demo, payouts are simulated.'],
    ['What are the trading rules?', 'Key rules: 8% profit target, 5% daily loss limit, 10% maximum drawdown, and a 5-day minimum trading period. Certain high-risk strategies are restricted.'],
    ['What is the maximum drawdown?', 'The overall maximum drawdown is 10% of the initial account balance. Breaching this limit results in the account being marked as breached.'],
    ['How long does evaluation take?', 'There is no time limit. Trade at your own pace — you only need to satisfy the minimum of 5 trading days and reach the profit target.'],
    ['What happens if an account is breached?', 'If you exceed the daily loss or maximum drawdown limits, the account is breached and trading is disabled. You can start a new challenge at any time.'],
  ]
  return (
    <section id="faq" className="py-24">
      <div className="container max-w-3xl">
        <Reveal className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">FAQ</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">Frequently Asked Questions</h2>
        </Reveal>
        <Reveal>
          <Accordion type="single" collapsible className="space-y-3">
            {qs.map(([q, a], i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-slate-200 bg-card px-5">
                <AccordionTrigger className="text-left font-semibold text-slate-800 hover:no-underline">{q}</AccordionTrigger>
                <AccordionContent className="text-slate-600">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ CTA + FOOTER
function CTA({ onGetFunded }) {
  return (
    <section className="py-16">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-sky-500 p-12 text-center soft-shadow">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to trade bigger?</h2>
              <p className="mt-3 text-blue-50 max-w-xl mx-auto">Join thousands of funded traders building their edge with FundedTechStreet. Start your evaluation today.</p>
              <Button size="lg" className="mt-7 h-12 px-8 bg-white text-blue-700 hover:bg-blue-50 text-base font-semibold" onClick={onGetFunded}>
                Get Funded Now <ArrowRight className="ml-1.5 h-5 w-5" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  const cols = [
    {
      title: 'Platform',
      links: [
        { label: 'Challenges', href: '#' },
        { label: 'How It Works', href: '#' },
        { label: 'Rules', href: '#' },
        { label: 'FAQ', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Support', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms', href: '/legal/terms-of-service' },
        { label: 'Privacy', href: '/legal/privacy-policy' },
        { label: 'Risk Disclosure', href: '/legal/risk-disclosure' },
        { label: 'All policies', href: '/legal' },
      ],
    },
  ]
  return (
    <footer className="border-t bg-white pt-14 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-slate-500 max-w-xs">Modern funded trading programs built for serious traders. Trade bigger, build your edge, get funded.</p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Linkedin, Youtube, Instagram].map((I, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-lg bg-slate-100 hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <I className="h-4 w-4 text-slate-600" />
                </a>
              ))}
            </div>
          </div>
          {cols.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-slate-900">{title}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={`${title}-${link.label}`}>
                    <a href={link.href || '#'} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} FundedTechStreet. All rights reserved. Demo environment.</p>
          <p>Trading involves risk. This is a demonstration platform.</p>
        </div>
      </div>
    </footer>
  )
}

// ------------------------------------------------------------------ EXPORT
export default function Landing({ challenges, onLogin, onGetFunded, onSelectChallenge }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onLogin={onLogin} onGetFunded={onGetFunded} />
      <Hero onGetFunded={onGetFunded} />
      <Stats />
      <Challenges challenges={challenges} onSelect={onSelectChallenge} />
      <HowItWorks />
      <TradingRules />
      <Performance />
      <FAQ />
      <CTA onGetFunded={onGetFunded} />
      <Footer />
    </div>
  )
}
