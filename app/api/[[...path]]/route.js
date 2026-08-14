import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

// ---------------------------------------------------------------------------
// FundedTechStreet — Backend API (Node.js / Next.js Route Handlers)
// Clean modular structure: db -> helpers -> services -> router
// NO PYTHON. Pure JavaScript/Node. MongoDB persistence via native driver.
// ---------------------------------------------------------------------------

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME && process.env.DB_NAME !== 'your_database_name'
  ? process.env.DB_NAME
  : 'fundedtechstreet'
const JWT_SECRET = process.env.JWT_SECRET || 'fts-demo-secret-key-change-in-prod'

// -------------------------- DB connection (singleton) ----------------------
let cached = global._ftsMongo
if (!cached) cached = global._ftsMongo = { client: null, db: null, seeded: false }

async function getDb() {
  if (cached.db) return cached.db
  if (!cached.client) {
    cached.client = new MongoClient(MONGO_URL)
    await cached.client.connect()
  }
  cached.db = cached.client.db(DB_NAME)
  return cached.db
}

// -------------------------- security helpers -------------------------------
function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex')
  return `${salt}:${hash}`
}
function verifyPassword(pw, stored) {
  try {
    const [salt, hash] = stored.split(':')
    const h = crypto.scryptSync(pw, salt, 64).toString('hex')
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(h, 'hex'))
  } catch { return false }
}
function signToken(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 864e5 })).toString('base64url')
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(body).digest('base64url')
  return `${body}.${sig}`
}
function verifyToken(token) {
  try {
    const [body, sig] = token.split('.')
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(body).digest('base64url')
    if (expected !== sig) return null
    const data = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (data.exp < Date.now()) return null
    return data
  } catch { return null }
}

// -------------------------- response helpers -------------------------------
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
function json(data, status = 200) { return NextResponse.json(data, { status, headers: CORS }) }
function err(message, status = 400) { return NextResponse.json({ error: message }, { status, headers: CORS }) }

function strip(doc) {
  if (!doc) return doc
  const { _id, passwordHash, ...rest } = doc
  return rest
}

async function getAuth(request) {
  const h = request.headers.get('authorization') || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) return null
  const data = verifyToken(token)
  if (!data) return null
  const db = await getDb()
  const user = await db.collection('users').findOne({ id: data.id })
  return user || null
}

// -------------------------- random helpers (demo data) ---------------------
function rnd(min, max) { return Math.random() * (max - min) + min }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function round(n, d = 2) { const f = 10 ** d; return Math.round(n * f) / f }

// ---------------------------------------------------------------------------
// SEEDING
// ---------------------------------------------------------------------------
const SYMBOLS = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'GBPJPY', 'AUDUSD', 'US30', 'NAS100', 'BTCUSD', 'USDCAD']

function makeChallenges() {
  const sizes = [10000, 25000, 50000, 100000, 200000]
  const prices = { 10000: 59, 25000: 149, 50000: 289, 100000: 499, 200000: 999 }
  return sizes.map((size) => ({
    id: uuidv4(),
    name: `$${(size / 1000)}K Challenge`,
    slug: `${size / 1000}k-challenge`,
    description: `Trade a ${size.toLocaleString()} USD funded account. Prove your edge, hit the profit target within the rules, and get funded with an 80% profit split.`,
    accountSize: size,
    price: prices[size],
    profitTarget: 8,
    dailyLossLimit: 5,
    maximumLoss: 10,
    leverage: 100,
    minimumTradingDays: 5,
    profitSplit: 80,
    refundPolicy: 'Full refund of the challenge fee with your first payout.',
    features: [
      'One-step evaluation',
      'No time limit',
      '80% profit split',
      'Weekend holding allowed',
      'Expert Advisors allowed',
      'Bi-weekly payouts',
    ],
    recommended: size === 100000,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}

function makeTrades(accountId, userId, count) {
  const trades = []
  let day = 12
  for (let i = 0; i < count; i++) {
    const symbol = pick(SYMBOLS)
    const side = pick(['BUY', 'SELL'])
    const isJpy = symbol.includes('JPY')
    const isGold = symbol === 'XAUUSD'
    const isIndex = ['US30', 'NAS100'].includes(symbol)
    const isBtc = symbol === 'BTCUSD'
    let entry
    if (isJpy) entry = round(rnd(140, 160), 3)
    else if (isGold) entry = round(rnd(1900, 2400), 2)
    else if (isIndex) entry = round(rnd(15000, 40000), 2)
    else if (isBtc) entry = round(rnd(40000, 70000), 2)
    else entry = round(rnd(1.05, 1.35), 5)
    const win = Math.random() < 0.684
    const magnitude = rnd(0.0005, 0.004) * entry
    const move = (side === 'BUY' ? 1 : -1) * (win ? magnitude : -magnitude)
    const exit = round(entry + move, isJpy ? 3 : (isGold || isIndex || isBtc) ? 2 : 5)
    const volume = round(pick([0.2, 0.5, 1, 1.5, 2, 0.3, 0.75]), 2)
    const profit = round((win ? 1 : -1) * rnd(80, 640) * volume, 2)
    const opened = new Date(Date.now() - (day * 24 + Math.floor(rnd(0, 20))) * 3600 * 1000)
    const closed = new Date(opened.getTime() + rnd(0.5, 8) * 3600 * 1000)
    if (i % 3 === 0 && day > 1) day -= 1
    trades.push({
      id: uuidv4(), accountId, userId, symbol, side, volume,
      entryPrice: entry, exitPrice: exit,
      stopLoss: round(entry - (side === 'BUY' ? magnitude * 1.5 : -magnitude * 1.5), 5),
      takeProfit: round(entry + (side === 'BUY' ? magnitude * 2 : -magnitude * 2), 5),
      profit, commission: round(-rnd(1, 6) * volume, 2), swap: round(rnd(-3, 1), 2),
      status: 'CLOSED', openedAt: opened, closedAt: closed, createdAt: opened,
    })
  }
  for (let i = 0; i < 2; i++) {
    const symbol = pick(SYMBOLS)
    trades.push({
      id: uuidv4(), accountId, userId, symbol, side: pick(['BUY', 'SELL']),
      volume: 0.5, entryPrice: round(rnd(1.05, 1.35), 5), exitPrice: null,
      stopLoss: null, takeProfit: null, profit: round(rnd(-120, 220), 2),
      commission: -2.5, swap: 0, status: 'OPEN',
      openedAt: new Date(Date.now() - rnd(1, 12) * 3600 * 1000), closedAt: null, createdAt: new Date(),
    })
  }
  return trades.sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt))
}

function makeEquity(accountId, initial, final, points) {
  const out = []
  let equity = initial
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1)
    const target = initial + (final - initial) * t
    equity = round(target + rnd(-600, 600) * (1 - t * 0.5), 2)
    const date = new Date(Date.now() - (points - 1 - i) * 24 * 3600 * 1000)
    out.push({ id: uuidv4(), accountId, date, equity, balance: round(equity + rnd(-200, 300), 2) })
  }
  out[out.length - 1].equity = final
  out[out.length - 1].balance = final + 370
  return out
}

async function ensureSeed(db) {
  if (cached.seeded) return
  const count = await db.collection('users').countDocuments()
  if (count > 0) { cached.seeded = true; return }

  const now = new Date()
  const adminId = uuidv4()
  const traderId = uuidv4()
  const admin = {
    id: adminId, name: 'Alex Morgan', email: 'admin@fundedtechstreet.com',
    phone: '+1 202 555 0110', passwordHash: hashPassword('Admin@12345'),
    role: 'ADMIN', status: 'ACTIVE', avatar: '', country: 'United States',
    createdAt: now, updatedAt: now,
  }
  const trader = {
    id: traderId, name: 'Jordan Blake', email: 'demo@fundedtechstreet.com',
    phone: '+44 20 7946 0958', passwordHash: hashPassword('Demo@12345'),
    role: 'TRADER', status: 'ACTIVE', avatar: '', country: 'United Kingdom',
    isDemo: true, createdAt: now, updatedAt: now,
  }
  const extraUsers = ['Maya Chen|Singapore', 'Diego Santos|Brazil', 'Priya Patel|India', 'Liam OConnor|Ireland', 'Sofia Rossi|Italy']
    .map((s) => {
      const [name, country] = s.split('|')
      return {
        id: uuidv4(), name, email: name.toLowerCase().replace(/[^a-z]/g, '.') + '@example.com',
        phone: '+1 555 0' + Math.floor(rnd(100000, 999999)), passwordHash: hashPassword('User@12345'),
        role: 'TRADER', status: pick(['ACTIVE', 'ACTIVE', 'INACTIVE', 'SUSPENDED']), avatar: '',
        country, createdAt: new Date(now - rnd(1, 200) * 864e5), updatedAt: now,
      }
    })
  await db.collection('users').insertMany([admin, trader, ...extraUsers])

  const challenges = makeChallenges()
  await db.collection('challenges').insertMany(challenges)
  const c100 = challenges.find((c) => c.accountSize === 100000)

  const accountId = uuidv4()
  const account = {
    id: accountId, userId: traderId, challengeId: c100.id,
    accountNumber: 'FTS-100248', accountType: 'Evaluation', status: 'ACTIVE',
    initialBalance: 100000, currentBalance: 104280, currentEquity: 103910,
    profit: 4280, profitPercentage: 4.28,
    profitTarget: 10000, profitTargetProgress: 42.8,
    dailyLossLimit: 3000, dailyLoss: 820,
    maximumLoss: 6000, currentDrawdown: 1090, drawdownPercentage: 1.09,
    winRate: 68.4, tradingDays: 7, minimumTradingDays: 5,
    leverage: 100, profitSplit: 80,
    challengeName: c100.name, accountSize: 100000,
    createdAt: new Date(now - 12 * 864e5), updatedAt: now,
  }
  await db.collection('accounts').insertOne(account)

  const trades = makeTrades(accountId, traderId, 32)
  await db.collection('trades').insertMany(trades)
  const equity = makeEquity(accountId, 100000, 103910, 92)
  await db.collection('equity_points').insertMany(equity)

  const transactions = [
    { id: uuidv4(), userId: traderId, accountId, type: 'CHALLENGE_PURCHASE', amount: 499, currency: 'USD', status: 'COMPLETED', paymentMethod: 'Card •••• 4242', reference: 'TXN-' + uuidv4().slice(0, 8).toUpperCase(), description: '$100K Challenge purchase', createdAt: new Date(now - 12 * 864e5), updatedAt: now },
    { id: uuidv4(), userId: traderId, accountId, type: 'PAYOUT', amount: 1840, currency: 'USD', status: 'COMPLETED', paymentMethod: 'Bank Transfer', reference: 'TXN-' + uuidv4().slice(0, 8).toUpperCase(), description: 'Profit payout', createdAt: new Date(now - 5 * 864e5), updatedAt: now },
    { id: uuidv4(), userId: traderId, accountId, type: 'REFUND', amount: 499, currency: 'USD', status: 'COMPLETED', paymentMethod: 'Card •••• 4242', reference: 'TXN-' + uuidv4().slice(0, 8).toUpperCase(), description: 'Challenge fee refund with first payout', createdAt: new Date(now - 5 * 864e5), updatedAt: now },
    { id: uuidv4(), userId: traderId, accountId, type: 'PAYOUT_FEE', amount: 20, currency: 'USD', status: 'COMPLETED', paymentMethod: 'Bank Transfer', reference: 'TXN-' + uuidv4().slice(0, 8).toUpperCase(), description: 'Payout processing fee', createdAt: new Date(now - 5 * 864e5), updatedAt: now },
  ]
  await db.collection('transactions').insertMany(transactions)

  const payouts = [
    { id: uuidv4(), userId: traderId, accountId, amount: 1840, profitAmount: 2300, profitSplit: 80, status: 'PAID', paymentMethod: 'Bank Transfer', requestedAt: new Date(now - 7 * 864e5), processedAt: new Date(now - 5 * 864e5), createdAt: new Date(now - 7 * 864e5), updatedAt: now },
    { id: uuidv4(), userId: traderId, accountId, amount: 960, profitAmount: 1200, profitSplit: 80, status: 'PROCESSING', paymentMethod: 'Crypto (USDT)', requestedAt: new Date(now - 1 * 864e5), processedAt: null, createdAt: new Date(now - 1 * 864e5), updatedAt: now },
  ]
  await db.collection('payouts').insertMany(payouts)

  const notifs = [
    { id: uuidv4(), userId: traderId, title: 'Milestone achieved', message: 'Your account reached 4% profit. Keep it up!', type: 'SUCCESS', read: false, createdAt: new Date(now - 2 * 3600 * 1000) },
    { id: uuidv4(), userId: traderId, title: 'Daily loss warning', message: 'Daily loss limit is approaching (27% used).', type: 'WARNING', read: false, createdAt: new Date(now - 8 * 3600 * 1000) },
    { id: uuidv4(), userId: traderId, title: 'Payout submitted', message: 'Your payout request of $960 has been submitted.', type: 'INFO', read: true, createdAt: new Date(now - 1 * 864e5) },
    { id: uuidv4(), userId: traderId, title: 'Challenge milestone', message: 'You have completed 7 of 5 minimum trading days.', type: 'SUCCESS', read: true, createdAt: new Date(now - 3 * 864e5) },
  ]
  await db.collection('notifications').insertMany(notifs)

  await db.collection('kyc').insertOne({
    id: uuidv4(), userId: traderId, status: 'VERIFIED', documentType: 'Passport',
    documentStatus: 'APPROVED', submittedAt: new Date(now - 11 * 864e5), reviewedAt: new Date(now - 10 * 864e5),
    notes: 'Identity verified successfully.',
  })

  const logs = [
    { id: uuidv4(), userId: traderId, adminId, action: 'ACCOUNT_ACTIVATED', entity: 'account', entityId: accountId, metadata: { accountNumber: 'FTS-100248' }, ipAddress: '81.2.69.142', createdAt: new Date(now - 12 * 864e5) },
    { id: uuidv4(), userId: traderId, adminId, action: 'PAYOUT_APPROVED', entity: 'payout', entityId: payouts[0].id, metadata: { amount: 1840 }, ipAddress: '81.2.69.142', createdAt: new Date(now - 5 * 864e5) },
    { id: uuidv4(), userId: null, adminId, action: 'CHALLENGE_UPDATED', entity: 'challenge', entityId: c100.id, metadata: { field: 'price' }, ipAddress: '81.2.69.142', createdAt: new Date(now - 3 * 864e5) },
  ]
  await db.collection('audit_logs').insertMany(logs)

  cached.seeded = true
}

// ---------------------------------------------------------------------------
// ROUTER
// ---------------------------------------------------------------------------
async function handle(method, request, params) {
  try {
    const db = await getDb()
    await ensureSeed(db)
    const path = (params?.path || [])
    const p = path.join('/')
    let body = {}
    if (['POST', 'PATCH', 'PUT'].includes(method)) {
      try { body = await request.json() } catch { body = {} }
    }
    const url = new URL(request.url)
    const q = Object.fromEntries(url.searchParams)

    if (p === '' || p === 'health') return json({ ok: true, service: 'FundedTechStreet API', db: DB_NAME })

    // ---- AUTH ----
    if (p === 'auth/register' && method === 'POST') return authRegister(db, body)
    if (p === 'auth/login' && method === 'POST') return authLogin(db, body)
    if (p === 'auth/logout' && method === 'POST') return json({ ok: true })
    if (p === 'auth/me' && method === 'GET') {
      const u = await getAuth(request); if (!u) return err('Unauthorized', 401)
      return json({ user: strip(u) })
    }
    if (p === 'auth/forgot-password' && method === 'POST') {
      return json({ ok: true, message: 'If an account exists, a reset link has been sent (demo).' })
    }

    // ---- PUBLIC challenges ----
    if (p === 'challenges' && method === 'GET') {
      const list = await db.collection('challenges').find({ status: 'ACTIVE' }).sort({ accountSize: 1 }).toArray()
      return json({ challenges: list.map(strip) })
    }
    if (path[0] === 'challenges' && path[1] && method === 'GET') {
      const c = await db.collection('challenges').findOne({ $or: [{ id: path[1] }, { slug: path[1] }] })
      if (!c) return err('Not found', 404)
      return json({ challenge: strip(c) })
    }

    if (p === 'stats/public' && method === 'GET') {
      return json({ stats: { capitalAllocated: '$25M+', activeTraders: '15K+', countries: '92+', support: '24/7' } })
    }

    // ===== authenticated =====
    const user = await getAuth(request)
    const requireAuth = () => { if (!user) throw { status: 401, message: 'Unauthorized' } }
    const requireAdmin = () => { if (!user || user.role !== 'ADMIN') throw { status: 403, message: 'Forbidden' } }

    if (p === 'accounts' && method === 'GET') {
      requireAuth()
      const list = await db.collection('accounts').find({ userId: user.id }).sort({ createdAt: -1 }).toArray()
      return json({ accounts: list.map(strip) })
    }
    if (path[0] === 'accounts' && path[1] && !path[2] && method === 'GET') {
      requireAuth()
      const a = await db.collection('accounts').findOne({ id: path[1] })
      if (!a || (a.userId !== user.id && user.role !== 'ADMIN')) return err('Not found', 404)
      return json({ account: strip(a) })
    }
    if (path[0] === 'accounts' && path[2] === 'performance' && method === 'GET') {
      requireAuth()
      return accountPerformance(db, path[1], q)
    }
    if (path[0] === 'accounts' && path[2] === 'trades' && method === 'GET') {
      requireAuth()
      const list = await db.collection('trades').find({ accountId: path[1] }).sort({ openedAt: -1 }).toArray()
      return json({ trades: list.map(strip) })
    }

    if (p === 'trades' && method === 'GET') {
      requireAuth()
      const filter = { userId: user.id }
      if (q.symbol) filter.symbol = q.symbol
      if (q.side) filter.side = q.side
      if (q.status) filter.status = q.status
      if (q.accountId) filter.accountId = q.accountId
      const all = await db.collection('trades').find(filter).sort({ openedAt: -1 }).toArray()
      const page = parseInt(q.page || '1'), limit = parseInt(q.limit || '10')
      const total = all.length
      const items = all.slice((page - 1) * limit, page * limit)
      return json({ trades: items.map(strip), total, page, limit, pages: Math.ceil(total / limit) })
    }

    if (p === 'payouts' && method === 'GET') {
      requireAuth()
      const list = await db.collection('payouts').find({ userId: user.id }).sort({ createdAt: -1 }).toArray()
      const summary = {
        available: 2136,
        total: list.filter(x => x.status === 'PAID').reduce((s, x) => s + x.amount, 0),
        pending: list.filter(x => ['REQUESTED', 'PROCESSING', 'APPROVED'].includes(x.status)).reduce((s, x) => s + x.amount, 0),
        paid: list.filter(x => x.status === 'PAID').reduce((s, x) => s + x.amount, 0),
      }
      return json({ payouts: list.map(strip), summary })
    }
    if (p === 'payouts' && method === 'POST') {
      requireAuth()
      const acc = await db.collection('accounts').findOne({ userId: user.id })
      const payout = {
        id: uuidv4(), userId: user.id, accountId: body.accountId || acc?.id,
        amount: Number(body.amount) || 0, profitAmount: round((Number(body.amount) || 0) / 0.8, 2),
        profitSplit: 80, status: 'REQUESTED', paymentMethod: body.paymentMethod || 'Bank Transfer',
        accountDetails: body.accountDetails || '', requestedAt: new Date(), processedAt: null,
        createdAt: new Date(), updatedAt: new Date(),
      }
      await db.collection('payouts').insertOne(payout)
      await db.collection('notifications').insertOne({
        id: uuidv4(), userId: user.id, title: 'Payout submitted',
        message: `Your payout request of $${payout.amount} has been submitted.`, type: 'INFO', read: false, createdAt: new Date(),
      })
      return json({ payout: strip(payout) }, 201)
    }

    if (p === 'transactions' && method === 'GET') {
      requireAuth()
      const list = await db.collection('transactions').find({ userId: user.id }).sort({ createdAt: -1 }).toArray()
      return json({ transactions: list.map(strip) })
    }

    if (p === 'notifications' && method === 'GET') {
      requireAuth()
      const list = await db.collection('notifications').find({ userId: user.id }).sort({ createdAt: -1 }).toArray()
      return json({ notifications: list.map(strip), unread: list.filter(n => !n.read).length })
    }
    if (path[0] === 'notifications' && path[2] === 'read' && method === 'PATCH') {
      requireAuth()
      await db.collection('notifications').updateOne({ id: path[1], userId: user.id }, { $set: { read: true } })
      return json({ ok: true })
    }
    if (p === 'notifications/read-all' && method === 'PATCH') {
      requireAuth()
      await db.collection('notifications').updateMany({ userId: user.id }, { $set: { read: true } })
      return json({ ok: true })
    }

    if (p === 'profile' && method === 'GET') { requireAuth(); return json({ profile: strip(user) }) }
    if (p === 'profile' && method === 'PATCH') {
      requireAuth()
      const upd = {}
      for (const k of ['name', 'phone', 'country', 'avatar']) if (body[k] !== undefined) upd[k] = body[k]
      upd.updatedAt = new Date()
      await db.collection('users').updateOne({ id: user.id }, { $set: upd })
      const fresh = await db.collection('users').findOne({ id: user.id })
      return json({ profile: strip(fresh) })
    }

    if (p === 'kyc' && method === 'GET') {
      requireAuth()
      const k = await db.collection('kyc').findOne({ userId: user.id })
      return json({ kyc: k ? strip(k) : { status: 'NOT_STARTED' } })
    }
    if (p === 'kyc' && method === 'POST') {
      requireAuth()
      const doc = {
        id: uuidv4(), userId: user.id, status: 'VERIFIED', documentType: body.documentType || 'Passport',
        documentStatus: 'APPROVED', submittedAt: new Date(), reviewedAt: new Date(), notes: 'Auto-verified (demo).',
      }
      await db.collection('kyc').replaceOne({ userId: user.id }, doc, { upsert: true })
      return json({ kyc: strip(doc) })
    }

    if (p === 'checkout' && method === 'POST') {
      requireAuth()
      return checkout(db, user, body)
    }

    // =====================  ADMIN  =====================
    if (p === 'admin/stats' && method === 'GET') { requireAdmin(); return adminStats(db) }
    if (p === 'admin/users' && method === 'GET') {
      requireAdmin()
      const filter = {}
      if (q.status) filter.status = q.status
      if (q.role) filter.role = q.role
      if (q.search) filter.$or = [{ name: { $regex: q.search, $options: 'i' } }, { email: { $regex: q.search, $options: 'i' } }]
      const list = await db.collection('users').find(filter).sort({ createdAt: -1 }).toArray()
      return json({ users: list.map(strip) })
    }
    if (path[0] === 'admin' && path[1] === 'users' && path[2] && !path[3] && method === 'GET') {
      requireAdmin()
      const u = await db.collection('users').findOne({ id: path[2] })
      if (!u) return err('Not found', 404)
      const accounts = await db.collection('accounts').find({ userId: u.id }).toArray()
      const trades = await db.collection('trades').find({ userId: u.id }).sort({ openedAt: -1 }).limit(20).toArray()
      return json({ user: strip(u), accounts: accounts.map(strip), trades: trades.map(strip) })
    }
    if (path[0] === 'admin' && path[1] === 'users' && path[3] === 'status' && method === 'PATCH') {
      requireAdmin()
      await db.collection('users').updateOne({ id: path[2] }, { $set: { status: body.status, updatedAt: new Date() } })
      await audit(db, user.id, path[2], 'USER_STATUS_CHANGED', 'user', path[2], { status: body.status })
      return json({ ok: true })
    }
    if (p === 'admin/accounts' && method === 'GET') {
      requireAdmin()
      const filter = {}
      if (q.status) filter.status = q.status
      if (q.search) filter.accountNumber = { $regex: q.search, $options: 'i' }
      const list = await db.collection('accounts').find(filter).sort({ createdAt: -1 }).toArray()
      const users = await db.collection('users').find({}).toArray()
      const map = Object.fromEntries(users.map(u => [u.id, u.name]))
      return json({ accounts: list.map(a => ({ ...strip(a), ownerName: map[a.userId] || 'Unknown' })) })
    }
    if (path[0] === 'admin' && path[1] === 'accounts' && path[3] === 'status' && method === 'PATCH') {
      requireAdmin()
      await db.collection('accounts').updateOne({ id: path[2] }, { $set: { status: body.status, updatedAt: new Date() } })
      await audit(db, null, path[2], 'ACCOUNT_STATUS_CHANGED', 'account', path[2], { status: body.status })
      return json({ ok: true })
    }
    if (p === 'admin/challenges' && method === 'GET') {
      requireAdmin()
      const list = await db.collection('challenges').find({}).sort({ accountSize: 1 }).toArray()
      return json({ challenges: list.map(strip) })
    }
    if (p === 'admin/challenges' && method === 'POST') {
      requireAdmin()
      const c = {
        id: uuidv4(), name: body.name, slug: (body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: body.description || '', accountSize: Number(body.accountSize) || 0, price: Number(body.price) || 0,
        profitTarget: Number(body.profitTarget) || 8, dailyLossLimit: Number(body.dailyLossLimit) || 5,
        maximumLoss: Number(body.maximumLoss) || 10, leverage: Number(body.leverage) || 100,
        minimumTradingDays: Number(body.minimumTradingDays) || 5, profitSplit: Number(body.profitSplit) || 80,
        refundPolicy: body.refundPolicy || '', features: body.features || [], recommended: !!body.recommended,
        status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(),
      }
      await db.collection('challenges').insertOne(c)
      await audit(db, null, null, 'CHALLENGE_CREATED', 'challenge', c.id, { name: c.name })
      return json({ challenge: strip(c) }, 201)
    }
    if (path[0] === 'admin' && path[1] === 'challenges' && path[2] && method === 'PATCH') {
      requireAdmin()
      const upd = {}
      for (const k of ['name', 'description', 'accountSize', 'price', 'profitTarget', 'dailyLossLimit', 'maximumLoss', 'leverage', 'minimumTradingDays', 'profitSplit', 'status', 'recommended', 'features', 'refundPolicy']) {
        if (body[k] !== undefined) upd[k] = body[k]
      }
      upd.updatedAt = new Date()
      await db.collection('challenges').updateOne({ id: path[2] }, { $set: upd })
      await audit(db, null, null, 'CHALLENGE_UPDATED', 'challenge', path[2], upd)
      const c = await db.collection('challenges').findOne({ id: path[2] })
      return json({ challenge: strip(c) })
    }
    if (path[0] === 'admin' && path[1] === 'challenges' && path[2] && method === 'DELETE') {
      requireAdmin()
      await db.collection('challenges').updateOne({ id: path[2] }, { $set: { status: 'DISABLED', updatedAt: new Date() } })
      await audit(db, null, null, 'CHALLENGE_DISABLED', 'challenge', path[2], {})
      return json({ ok: true })
    }
    if (p === 'admin/trades' && method === 'GET') {
      requireAdmin()
      const list = await db.collection('trades').find({}).sort({ openedAt: -1 }).limit(100).toArray()
      return json({ trades: list.map(strip) })
    }
    if (p === 'admin/transactions' && method === 'GET') {
      requireAdmin()
      const list = await db.collection('transactions').find({}).sort({ createdAt: -1 }).toArray()
      return json({ transactions: list.map(strip) })
    }
    if (p === 'admin/payouts' && method === 'GET') {
      requireAdmin()
      const filter = {}
      if (q.status) filter.status = q.status
      const list = await db.collection('payouts').find(filter).sort({ createdAt: -1 }).toArray()
      const users = await db.collection('users').find({}).toArray()
      const map = Object.fromEntries(users.map(u => [u.id, u.name]))
      return json({ payouts: list.map(x => ({ ...strip(x), ownerName: map[x.userId] || 'Unknown' })) })
    }
    if (path[0] === 'admin' && path[1] === 'payouts' && path[3] === 'status' && method === 'PATCH') {
      requireAdmin()
      const upd = { status: body.status, updatedAt: new Date() }
      if (body.status === 'PAID') upd.processedAt = new Date()
      await db.collection('payouts').updateOne({ id: path[2] }, { $set: upd })
      await audit(db, null, null, 'PAYOUT_STATUS_CHANGED', 'payout', path[2], { status: body.status })
      return json({ ok: true })
    }
    if (p === 'admin/kyc' && method === 'GET') {
      requireAdmin()
      const list = await db.collection('kyc').find({}).toArray()
      const users = await db.collection('users').find({}).toArray()
      const map = Object.fromEntries(users.map(u => [u.id, u.name]))
      return json({ kyc: list.map(x => ({ ...strip(x), ownerName: map[x.userId] || 'Unknown' })) })
    }
    if (p === 'admin/audit-logs' && method === 'GET') {
      requireAdmin()
      const list = await db.collection('audit_logs').find({}).sort({ createdAt: -1 }).limit(100).toArray()
      return json({ logs: list.map(strip) })
    }
    if (p === 'admin/notifications' && method === 'GET') {
      requireAdmin()
      const list = await db.collection('notifications').find({}).sort({ createdAt: -1 }).limit(50).toArray()
      return json({ notifications: list.map(strip) })
    }

    return err('Route not found: ' + p, 404)
  } catch (e) {
    if (e && e.status) return err(e.message, e.status)
    console.error('API error:', e)
    return err('Internal server error: ' + (e?.message || 'unknown'), 500)
  }
}

// -------------------------- service functions ------------------------------
async function authRegister(db, body) {
  const { name, email, password, phone, country } = body
  if (!name || !email || !password) return err('Name, email and password are required')
  const existing = await db.collection('users').findOne({ email: email.toLowerCase() })
  if (existing) return err('An account with this email already exists', 409)
  const user = {
    id: uuidv4(), name, email: email.toLowerCase(), phone: phone || '',
    passwordHash: hashPassword(password), role: 'TRADER', status: 'ACTIVE',
    avatar: '', country: country || '', createdAt: new Date(), updatedAt: new Date(),
  }
  await db.collection('users').insertOne(user)
  await db.collection('notifications').insertOne({
    id: uuidv4(), userId: user.id, title: 'Welcome to FundedTechStreet',
    message: 'Your account is ready. Choose a challenge to get funded.', type: 'SUCCESS', read: false, createdAt: new Date(),
  })
  const token = signToken({ id: user.id, role: user.role })
  return json({ token, user: strip(user) }, 201)
}

async function authLogin(db, body) {
  const { email, password } = body
  if (!email || !password) return err('Email and password are required')
  const user = await db.collection('users').findOne({ email: (email || '').toLowerCase() })
  if (!user || !verifyPassword(password, user.passwordHash)) return err('Invalid email or password', 401)
  if (user.status === 'SUSPENDED') return err('Your account has been suspended', 403)
  const token = signToken({ id: user.id, role: user.role })
  return json({ token, user: strip(user) })
}

async function accountPerformance(db, accountId, q) {
  const account = await db.collection('accounts').findOne({ id: accountId })
  if (!account) return err('Account not found', 404)
  let equity = await db.collection('equity_points').find({ accountId }).sort({ date: 1 }).toArray()
  const range = q.range || 'ALL'
  const days = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, 'ALL': 9999 }[range] || 9999
  if (days < 9999) equity = equity.slice(-days)
  const trades = await db.collection('trades').find({ accountId, status: 'CLOSED' }).toArray()
  const wins = trades.filter(t => t.profit > 0)
  const losses = trades.filter(t => t.profit <= 0)
  const grossWin = wins.reduce((s, t) => s + t.profit, 0)
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.profit, 0))
  const perf = {
    totalProfit: round(trades.reduce((s, t) => s + t.profit, 0), 2),
    winRate: trades.length ? round((wins.length / trades.length) * 100, 1) : 0,
    lossRate: trades.length ? round((losses.length / trades.length) * 100, 1) : 0,
    profitFactor: grossLoss ? round(grossWin / grossLoss, 2) : grossWin,
    averageWin: wins.length ? round(grossWin / wins.length, 2) : 0,
    averageLoss: losses.length ? round(grossLoss / losses.length, 2) : 0,
    largestWin: wins.length ? round(Math.max(...wins.map(t => t.profit)), 2) : 0,
    largestLoss: losses.length ? round(Math.min(...losses.map(t => t.profit)), 2) : 0,
    maxDrawdown: account.drawdownPercentage,
    totalTrades: trades.length,
  }
  const monthly = {}
  for (const t of trades) {
    const m = new Date(t.closedAt || t.openedAt).toLocaleString('en', { month: 'short' })
    monthly[m] = (monthly[m] || 0) + t.profit
  }
  const monthlyArr = Object.entries(monthly).map(([month, profit]) => ({ month, profit: round(profit, 2) }))
  const daily = {}
  for (const t of trades) {
    const d = new Date(t.closedAt || t.openedAt).toISOString().slice(5, 10)
    daily[d] = (daily[d] || 0) + t.profit
  }
  const dailyArr = Object.entries(daily).map(([date, pnl]) => ({ date, pnl: round(pnl, 2) })).slice(-14)
  return json({
    equity: equity.map(e => ({ date: new Date(e.date).toISOString().slice(0, 10), equity: e.equity, balance: e.balance })),
    performance: perf, monthly: monthlyArr, daily: dailyArr,
  })
}

async function checkout(db, user, body) {
  const challenge = await db.collection('challenges').findOne({ id: body.challengeId })
  if (!challenge) return err('Challenge not found', 404)
  const now = new Date()
  const accountId = uuidv4()
  const size = challenge.accountSize
  const account = {
    id: accountId, userId: user.id, challengeId: challenge.id,
    accountNumber: 'FTS-' + Math.floor(rnd(100000, 999999)), accountType: 'Evaluation', status: 'ACTIVE',
    initialBalance: size, currentBalance: size, currentEquity: size,
    profit: 0, profitPercentage: 0,
    profitTarget: round(size * challenge.profitTarget / 100), profitTargetProgress: 0,
    dailyLossLimit: round(size * challenge.dailyLossLimit / 100), dailyLoss: 0,
    maximumLoss: round(size * challenge.maximumLoss / 100), currentDrawdown: 0, drawdownPercentage: 0,
    winRate: 0, tradingDays: 0, minimumTradingDays: challenge.minimumTradingDays,
    leverage: challenge.leverage, profitSplit: challenge.profitSplit,
    challengeName: challenge.name, accountSize: size, createdAt: now, updatedAt: now,
  }
  await db.collection('accounts').insertOne(account)
  const txn = {
    id: uuidv4(), userId: user.id, accountId, type: 'CHALLENGE_PURCHASE', amount: challenge.price,
    currency: 'USD', status: 'COMPLETED', paymentMethod: body.paymentMethod || 'Card •••• 4242',
    reference: 'TXN-' + uuidv4().slice(0, 8).toUpperCase(), description: `${challenge.name} purchase`, createdAt: now, updatedAt: now,
  }
  await db.collection('transactions').insertOne(txn)
  await db.collection('equity_points').insertOne({ id: uuidv4(), accountId, date: now, equity: size, balance: size })
  await db.collection('notifications').insertOne({
    id: uuidv4(), userId: user.id, title: 'Challenge activated',
    message: `Your ${challenge.name} account ${account.accountNumber} is now active. Good luck!`, type: 'SUCCESS', read: false, createdAt: now,
  })
  return json({ account: strip(account), transaction: strip(txn) }, 201)
}

async function adminStats(db) {
  const users = await db.collection('users').find({}).toArray()
  const accounts = await db.collection('accounts').find({}).toArray()
  const payouts = await db.collection('payouts').find({}).toArray()
  const txns = await db.collection('transactions').find({ type: 'CHALLENGE_PURCHASE' }).toArray()
  const stats = {
    totalUsers: users.length,
    activeTraders: users.filter(u => u.role === 'TRADER' && u.status === 'ACTIVE').length,
    activeAccounts: accounts.filter(a => a.status === 'ACTIVE' || a.status === 'FUNDED').length,
    totalRevenue: round(txns.reduce((s, t) => s + t.amount, 0), 2),
    pendingPayouts: payouts.filter(p => ['REQUESTED', 'PROCESSING', 'APPROVED'].includes(p.status)).reduce((s, p) => s + p.amount, 0),
    breachedAccounts: accounts.filter(a => a.status === 'BREACHED').length,
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const revenue = months.map((m, i) => ({ month: m, revenue: Math.round(rnd(8000, 22000) + i * 1500) }))
  const signups = months.map((m) => ({ month: m, users: Math.floor(rnd(20, 120)) }))
  return json({ stats, revenue, signups })
}

async function audit(db, userId, targetUserId, action, entity, entityId, metadata) {
  await db.collection('audit_logs').insertOne({
    id: uuidv4(), userId: targetUserId || null, adminId: userId || null, action, entity, entityId,
    metadata: metadata || {}, ipAddress: '127.0.0.1', createdAt: new Date(),
  })
}

// -------------------------- HTTP method exports ----------------------------
export async function GET(request, ctx) { return handle('GET', request, await ctx.params) }
export async function POST(request, ctx) { return handle('POST', request, await ctx.params) }
export async function PATCH(request, ctx) { return handle('PATCH', request, await ctx.params) }
export async function PUT(request, ctx) { return handle('PUT', request, await ctx.params) }
export async function DELETE(request, ctx) { return handle('DELETE', request, await ctx.params) }
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }) }
