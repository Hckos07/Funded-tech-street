import LegalPage from '@/components/fts/LegalPage'

const sections = [
  {
    content: [
      'funded-prime.com is a commercial website and brand operated by FX-EDGE V Ltd. All information made available on this website is provided for general information only and does not constitute investment advice, trading advice, business advice, an offer, solicitation or recommendation to engage in any transaction involving financial instruments. Any references to trading, markets or instruments are used solely to describe simulated trading environments and proprietary evaluation methodologies.',
    ],
  },
  {
    heading: 'No Investment Services Disclaimer',
    content: [
      'FX-EDGE V Ltd within this service option does not provide investment services, brokerage services, portfolio management, execution of client orders on behalf of third parties, custody of funds or assets, or investment advice. The services offered by FX-EDGE V Ltd are limited to the provision of operating and governing the white-label framework, onboarding and approving Prop Brands and End Users, defining commercial, operational and compliance requirements applicable to Prop Brands, approving challenge structures, promotions and discount mechanisms, payouts, complaints handling, ensuring that Prop Brands comply with applicable legal and regulatory requirements (“Services”).',
    ],
  },
  {
    heading: 'Risk Disclosure',
    content: [
      'Trading strategies and methodologies assessed during the challenge and the funded phase (“Program”) involve a high degree of risk and may not be suitable for all individuals. Both stages of the Program are conducted exclusively within a simulated trading environment and do not involve the provision of any real capital, client funds or live trading accounts. Notwithstanding the simulated nature of the Program, trading in real market conditions involves substantial risk. Past or simulated performance is not indicative of future results.',
    ],
  },
  {
    heading: 'White Label and Partner Brands',
    content: [
      'FX-EDGE V Ltd provides Services to independent third-party brands operating the Program under white-label agreement. Such third-party brands are solely responsible for their own activities and are independent third parties. FX-EDGE V Ltd does not act as an agent, broker or counterparty to end users during the challenge or assessment phase.',
    ],
  },
  {
    heading: 'Jurisdictional Restrictions',
    content: [
      'The information and solutions described on this website are not directed at, and are not intended for use by, any person or entity in any jurisdiction where such distribution or use would be contrary to applicable laws or regulations. The information on this website and our services are not directed at citizens and/or residents of Afghanistan, Belarus, Crimea / Donetsk / Luhansk / Kherson / Zaporizhzhia / Sevastopol region, Cuba, Democratic Republic of Korea, Gaza, Iran, Libya, Myanmar, Russian Federation, South Sudan, North Korea, Syria and Venezuela or any other jurisdiction where prop trading is restricted or prohibited by local laws or regulations.',
    ],
  },
]

export default function FundedPrimeDisclaimerPage() {
  return (
    <LegalPage
      title="FUNDED-PRIME DISCLAIMER"
      lastUpdated="August 20, 2026"
      sections={sections}
    />
  )
}
