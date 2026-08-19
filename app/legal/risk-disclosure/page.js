import LegalPage from '@/components/fts/LegalPage'

const sections = [
  {
    heading: '1. Important notice',
    content: [
      'Trading in financial markets involves significant risk and may result in losses that exceed initial deposits or challenge fees. All participation in trading activities carries inherent risk and should be undertaken with caution and appropriate financial capacity.',
      'FundedTechStreet does not guarantee profits, account success, or future performance outcomes. Past results do not indicate future results.',
    ],
  },
  {
    heading: '2. Market volatility',
    content: [
      'Financial markets can experience rapid price movements, slippage, gaps, and periods of illiquidity. These factors may affect execution quality, risk exposure, and overall outcomes.',
      'Users should be prepared for both positive and negative scenarios and should only trade with amounts they can afford to lose.',
    ],
  },
  {
    heading: '3. Platform and challenge context',
    content: [
      'The website and challenge environment are designed for educational and simulated trading-related use and should not be treated as financial advice or a guaranteed pathway to income.',
      'Participation in evaluations or challenge programs does not create an entitlement to funding, payout, or any guaranteed return on investment.',
    ],
  },
  {
    heading: '4. User responsibility',
    content: [
      'Users are responsible for evaluating the suitability of any trading strategy, account size, leverage, and risk profile before entering or continuing a challenge or trade plan.',
      'Independent research, prudent risk management, and sound judgment are essential when operating in financial markets.',
    ],
  },
  {
    heading: '5. No financial advice',
    content: [
      'Any content, educational material, or guidance provided on the platform is for general informational purposes only and does not constitute personalized financial, legal, or tax advice.',
      'Users should consult qualified professionals before making decisions that could materially affect their financial position.',
    ],
  },
]

export default function RiskDisclosurePage() {
  return (
    <LegalPage
      title="Risk Disclosure"
      lastUpdated="August 19, 2026"
      summary="This Risk Disclosure explains the major risks associated with financial markets, proprietary trading challenges, and platform participation."
      sections={sections}
    />
  )
}
