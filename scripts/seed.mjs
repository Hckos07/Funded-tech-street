#!/usr/bin/env node
/**
 * FundedTechStreet — database seeder.
 *
 * The app auto-seeds an empty database on the first API request, but this
 * script lets you seed (or fully reset) on demand.
 *
 * Prerequisite: the dev server must be running (yarn dev) so the API is reachable.
 *
 * Usage:
 *   yarn seed            # seed if empty (keeps existing data)
 *   yarn seed --force    # wipe demo data and regenerate fresh demo accounts
 */

const base = process.env.SEED_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const force = process.argv.includes('--force') || process.argv.includes('-f')
const url = `${base.replace(/\/$/, '')}/api/seed${force ? '?force=1' : ''}`

async function main() {
  console.log(`\n→ Seeding via ${url}\n`)
  try {
    const res = await fetch(url, { method: 'POST' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    console.log('✓', data.message)
    console.log('  Counts:', JSON.stringify(data.counts))
    console.log('\n  Demo credentials:')
    console.log('   Trader:', data.demoCredentials.trader.email, '/', data.demoCredentials.trader.password)
    console.log('   Admin :', data.demoCredentials.admin.email, '/', data.demoCredentials.admin.password)
    console.log('\nDone. You can now log in.\n')
  } catch (e) {
    console.error('✗ Seeding failed:', e.message)
    console.error('  Make sure the dev server is running first:  yarn dev')
    console.error(`  Or set SEED_BASE_URL to your app URL. Current: ${base}\n`)
    process.exit(1)
  }
}
main()
