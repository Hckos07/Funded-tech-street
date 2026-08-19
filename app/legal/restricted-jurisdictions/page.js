import LegalPage from '@/components/fts/LegalPage'

const sections = [
  {
    heading: 'Restricted jurisdictions (territories)',
    content:
      'FX-EDGE V Ltd does not provide services to citizens and/or residents of the following:',
    list: [
      'Afghanistan',
      'Belarus',
      'Crimea / Donetsk / Luhansk / Kherson / Zaporizhzhia / Sevastopol region',
      'Cuba',
      'Democratic Republic of Korea',
      'Gaza',
      'Iran',
      'Libya',
      'Myanmar',
      'Russian Federation',
      'South Sudan',
      'North Korea',
      'Syria',
      'Venezuela',
    ],
  },
]

export default function RestrictedJurisdictionsPage() {
  return (
    <LegalPage
      title="Restricted jurisdictions (territories)"
      lastUpdated="August 20, 2026"
      summary="This notice sets out the territories where FX-EDGE V Ltd does not offer its services or accept clients."
      sections={sections}
    />
  )
}
