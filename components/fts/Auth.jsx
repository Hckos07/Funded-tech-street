'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, User, Globe, Phone, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from './ui'
import { api, setToken, fmtMoney } from '@/lib/fts-api'

function AuthShell({ children, title, subtitle, onHome }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-sky-500 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <button onClick={onHome} className="relative"><Logo dark /></button>
        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight">Trade bigger.<br />Build your edge.<br />Get funded.</h2>
          <p className="mt-4 text-blue-50 max-w-md">Join thousands of traders on FundedTechStreet. Prove your skill and trade a funded account up to $200K.</p>
          <div className="mt-8 space-y-3">
            {['One-step evaluation', 'Up to 80% profit split', 'Payouts every two weeks'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-white"><CheckCircle2 className="h-5 w-5 text-blue-100" /> {f}</div>
            ))}
          </div>
        </div>
        <p className="relative text-sm text-blue-100">© {new Date().getFullYear()} FundedTechStreet · Demo environment</p>
      </div>
      {/* right form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <button onClick={onHome} className="lg:hidden mb-6"><Logo /></button>
          <button onClick={onHome} className="hidden lg:flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-1">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input className="pl-10 h-11" {...props} />
    </div>
  )
}

export function AuthView({ mode: initialMode, onHome, onSuccess }) {
  const [mode, setMode] = useState(initialMode || 'login') // login | register | forgot
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', country: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const { token, user } = await api('/auth/login', { method: 'POST', auth: false, body: { email: form.email, password: form.password } })
        setToken(token); toast.success(`Welcome back, ${user.name.split(' ')[0]}!`); onSuccess(user)
      } else if (mode === 'register') {
        const { token, user } = await api('/auth/register', { method: 'POST', auth: false, body: form })
        setToken(token); toast.success('Account created!'); onSuccess(user)
      } else {
        await api('/auth/forgot-password', { method: 'POST', auth: false, body: { email: form.email } })
        toast.success('If an account exists, a reset link has been sent.'); setMode('login')
      }
    } catch (err) { toast.error(err.message) } finally { setLoading(false) }
  }

  const fillDemo = (type) => {
    setMode('login')
    if (type === 'trader') setForm({ ...form, email: 'demo@fundedtechstreet.com', password: 'Demo@12345' })
    else setForm({ ...form, email: 'admin@fundedtechstreet.com', password: 'Admin@12345' })
  }

  const titles = {
    login: ['Welcome back', 'Sign in to your FundedTechStreet account'],
    register: ['Create your account', 'Start your funded trading journey today'],
    forgot: ['Reset password', "Enter your email and we'll send a reset link"],
  }

  return (
    <AuthShell title={titles[mode][0]} subtitle={titles[mode][1]} onHome={onHome}>
      <form onSubmit={submit} className="space-y-4">
        {mode === 'register' && (
          <div className="space-y-1.5"><Label>Full name</Label><Field icon={User} placeholder="Jordan Blake" value={form.name} onChange={set('name')} required /></div>
        )}
        <div className="space-y-1.5"><Label>Email</Label><Field icon={Mail} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required /></div>
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Phone</Label><Field icon={Phone} placeholder="+1 555 0100" value={form.phone} onChange={set('phone')} /></div>
            <div className="space-y-1.5"><Label>Country</Label><Field icon={Globe} placeholder="United States" value={form.country} onChange={set('country')} /></div>
          </div>
        )}
        {mode !== 'forgot' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Password</Label>
              {mode === 'login' && <button type="button" onClick={() => setMode('forgot')} className="text-xs text-blue-600 hover:underline">Forgot?</button>}
            </div>
            <Field icon={Lock} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
        )}
        <Button type="submit" disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset link'} <ArrowRight className="ml-1 h-4 w-4" /></>}
        </Button>
      </form>

      {mode === 'login' && (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
          <p className="text-xs font-semibold text-slate-600 mb-2">Demo accounts (one-tap fill):</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-white" onClick={() => fillDemo('trader')}>Trader</Button>
            <Button variant="outline" size="sm" className="flex-1 bg-white" onClick={() => fillDemo('admin')}>Admin</Button>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>New to FundedTechStreet? <button onClick={() => setMode('register')} className="text-blue-600 font-semibold hover:underline">Create an account</button></>
        ) : (
          <>Already have an account? <button onClick={() => setMode('login')} className="text-blue-600 font-semibold hover:underline">Sign in</button></>
        )}
      </p>
    </AuthShell>
  )
}

// ------------------------------------------------------------- CHECKOUT
export function CheckoutView({ challenge, onHome, onDone, onNeedAuth }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [card, setCard] = useState({ number: '4242 4242 4242 4242', exp: '12/28', cvc: '123' })
  const target = challenge.accountSize * challenge.profitTarget / 100

  const pay = async () => {
    setLoading(true)
    try {
      const { account } = await api('/checkout', { method: 'POST', body: { challengeId: challenge.id, paymentMethod: 'Card •••• ' + card.number.slice(-4) } })
      setDone(true)
      setTimeout(() => onDone(account), 1600)
    } catch (err) {
      if (String(err.message).includes('Unauthorized')) { toast.error('Please sign in to continue'); onNeedAuth() }
      else toast.error(err.message)
    } finally { setLoading(false) }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Payment successful!</h1>
          <p className="text-slate-500 mt-2">Your {challenge.name} account has been created. Redirecting to your dashboard…</p>
          <Loader2 className="h-5 w-5 animate-spin text-blue-500 mx-auto mt-5" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-background">
      <div className="container max-w-4xl py-10">
        <button onClick={onHome} className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="mb-8"><Logo /></div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* summary */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order summary</h1>
            <div className="mt-5 rounded-2xl border bg-card p-6 soft-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{challenge.name}</div>
                  <div className="text-sm text-slate-500">{fmtMoney(challenge.accountSize, 0)} funded account</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{fmtMoney(challenge.price, 0)}</div>
              </div>
              <div className="mt-5 space-y-2.5 text-sm border-t pt-5">
                {[
                  ['Profit target', fmtMoney(target, 0)],
                  ['Profit split', `${challenge.profitSplit}%`],
                  ['Leverage', `1:${challenge.leverage}`],
                  ['Min. trading days', challenge.minimumTradingDays],
                  ['Refund policy', 'Fee refunded on first payout'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-semibold text-slate-800">{v}</span></div>
                ))}
              </div>
              <div className="mt-5 border-t pt-4 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Total due today</span>
                <span className="text-xl font-bold text-slate-900">{fmtMoney(challenge.price, 0)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500"><ShieldCheck className="h-4 w-4 text-blue-500" /> Simulated secure checkout — no real charge.</div>
          </div>
          {/* payment */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Payment</h2>
            <div className="mt-5 rounded-2xl border bg-card p-6 space-y-4">
              <div className="space-y-1.5"><Label>Card number</Label>
                <div className="relative"><CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input className="pl-10 h-11" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Expiry</Label><Input className="h-11" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>CVC</Label><Input className="h-11" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} /></div>
              </div>
              <Button onClick={pay} disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Pay {fmtMoney(challenge.price, 0)}</>}
              </Button>
              <p className="text-xs text-center text-slate-400">By continuing you agree to the FundedTechStreet demo terms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
