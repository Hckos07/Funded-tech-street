import Link from 'next/link'
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react'
import { Logo } from '@/components/fts/ui'

const legalLinks = [
  { label: 'Privacy Policy', href: '/legal/privacy-policy' },
  { label: 'Website Privacy Policy', href: '/legal/website-privacy-policy' },
  { label: 'FUNDED-PRIME DISCLAIMER', href: '/legal/funded-prime-disclaimer' },
  { label: 'Terms of Service', href: '/legal/terms-of-service' },
  { label: 'T&Cs for the Prop Brand website', href: '/legal/prop-brand-terms' },
  { label: 'Restricted jurisdictions', href: '/legal/restricted-jurisdictions' },
]

export default function LegalPage({
  title,
  subtitle,
  lastUpdated,
  summary,
  sections,
}) {
  return (
    <div className="min-h-screen bg-[#061b2d] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-700/80 bg-[#071b2e]/90 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <Logo />
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/legal" className="hidden sm:inline-flex items-center text-sm font-medium text-slate-300 hover:text-white">
              All policies
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-10 md:py-14">
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-300">
          <FileText className="h-4 w-4" />
          <span>Legal documents</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-slate-700 bg-[#0b2440] p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Policies
            </div>

            <nav className="mt-5 space-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl border border-transparent px-3 py-2 text-sm text-slate-300 transition-colors hover:border-blue-500/40 hover:bg-[#102d4b] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>

          <article className="rounded-3xl border border-slate-700 bg-[#0b2440] p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-slate-700 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">FundedTechStreet</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">{subtitle}</p>
              )}
              <p className="mt-3 text-sm text-slate-300">Last updated: {lastUpdated}</p>
              {summary && <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{summary}</p>}
            </div>

            <div className="space-y-8 text-slate-200">
              {sections.map((section, index) => (
                <section key={section.heading || index}>
                  <h2 className="mb-3 text-xl font-semibold text-white">{section.heading}</h2>
                  {section.content && Array.isArray(section.content) ? (
                    <div className="space-y-3 text-base leading-7 text-slate-200">
                      {section.content.map((paragraph, paragraphIndex) => (
                        <p key={`${section.heading}-${paragraphIndex}`}>{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base leading-7 text-slate-200">{section.content}</p>
                  )}

                  {section.list && (
                    <ul className="mt-3 space-y-2 pl-5 text-base leading-7 text-slate-200 list-disc">
                      {section.list.map((item, itemIndex) => (
                        <li key={`${section.heading}-item-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.table && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-sky-400/60 bg-[#081d32]">
                      <div className="divide-y divide-sky-400/40">
                        {section.table.map((row, rowIndex) => (
                          <div
                            key={`${section.heading}-row-${rowIndex}`}
                            className="grid border-b border-sky-400/40 last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)]"
                          >
                            <div className="border-r border-sky-400/40 bg-[#dfeaf3] px-4 py-3 text-[13px] font-bold leading-6 text-[#0b1d2d] md:text-[15px]">
                              <span className="whitespace-pre-line">{row.term}</span>
                            </div>
                            <div className="bg-[#0b2440] px-4 py-3 text-[13px] leading-6 text-slate-200 md:text-[15px]">
                              <span className="whitespace-pre-line">{row.definition}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
