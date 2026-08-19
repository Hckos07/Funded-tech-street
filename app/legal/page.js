import Link from 'next/link'
import { Logo } from '@/components/fts/ui'

const legalPolicies = [
  {
    title: 'Privacy Policy',
    href: '/legal/privacy-policy',
    summary: 'Client privacy terms covering the regulated data-processing relationship and personal-data rights for users.',
  },
  {
    title: 'Website Privacy Policy',
    href: '/legal/website-privacy-policy',
    summary: 'Website-specific privacy information covering cookies, site analytics, contact handling, and general data protection notices.',
  },
  {
    title: 'FUNDED-PRIME DISCLAIMER',
    href: '/legal/funded-prime-disclaimer',
    summary: 'General website information, service limits, risk disclosure, and jurisdictional restrictions for the FUNDED-PRIME platform.',
  },
  {
    title: 'Terms of Service',
    href: '/legal/terms-of-service',
    summary: 'The legal rules that govern how users access and use the challenge, dashboard, and platform services.',
  },
  {
    title: 'T&Cs for the Prop Brand website',
    href: '/legal/prop-brand-terms',
    summary: 'The prop-brand version of the website terms, including service conditions, usage rules, and legal obligations.',
  },
  {
    title: 'Restricted jurisdictions',
    href: '/legal/restricted-jurisdictions',
    summary: 'The territories where FX-EDGE V Ltd does not provide services or accept clients.',
  },
]

export default function LegalIndexPage() {
  return (
    <div className="min-h-screen bg-[#061b2d] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-700/80 bg-[#071b2e]/95 backdrop-blur-md">
        <div className="container flex items-center justify-between py-5">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-[#0f2036] px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:border-blue-400/60 hover:bg-[#142b46]">
            <span aria-hidden="true">←</span>
            Back home
          </Link>
        </div>
      </header>

      <main className="bg-[#061b2d] bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_30%)]">
        <div className="container py-10 md:py-14">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-400 md:text-base">LEGAL</p>
            <h1 className="mt-5 text-[3rem] font-bold leading-none tracking-[-0.06em] text-white md:text-[4.5rem]">
              Policies & disclosures
            </h1>
            <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300 md:text-[1.9rem] md:leading-[1.5]">
              These documents set out the terms, protections, and disclosures for using FundedTechStreet and participating in the platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {legalPolicies.map((policy) => (
              <Link
                key={policy.href}
                href={policy.href}
                className="group rounded-[1.5rem] border border-slate-700 bg-[#0b2440]/95 p-7 text-left shadow-[0_12px_32px_rgba(2,8,23,0.35)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-400/60 hover:bg-[#102d4b] hover:shadow-[0_18px_44px_rgba(2,8,23,0.42)]"
              >
                <div className="inline-flex rounded-full border border-blue-400/40 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">
                  Policy
                </div>

                <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white md:text-[2.2rem]">
                  {policy.title}
                </h2>

                <p className="mt-4 text-lg leading-8 text-slate-300">
                  {policy.summary}
                </p>

                <div className="mt-8 inline-flex items-center gap-2 text-base font-medium text-blue-400 transition-colors group-hover:text-blue-300">
                  Read policy
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
