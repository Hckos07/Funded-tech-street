import LegalPage from '@/components/fts/LegalPage'

const sections = [
  {
    heading: '1. Purpose',
    content: [
      'This Data Protection & Security Policy supplements our Privacy Policy and explains the practical measures we use to protect personal and account information in the FundedTechStreet environment.',
      'The goal is to maintain system integrity, safeguard sensitive data, and reduce the likelihood of unauthorized access or misuse.',
    ],
  },
  {
    heading: '2. Security measures',
    list: [
      'Encrypted communications for platform access and sensitive transactions where supported by the underlying infrastructure.',
      'Access controls limiting user and internal access based on role, operational need, and accountability.',
      'Monitoring and logging of activity to detect suspicious behavior or operational issues.',
      'Secure hosting and routine review of platform controls, dependencies, and account protections.',
    ],
  },
  {
    heading: '3. User responsibilities',
    content: [
      'Users are expected to use strong credentials, keep their passwords confidential, and avoid sharing account access with others.',
      'If a user suspects unauthorized account access or a data incident, they should notify the support team immediately so the platform can investigate and take corrective action.',
    ],
  },
  {
    heading: '4. Incident handling',
    content: [
      'If a data incident or serious security issue is identified, FundedTechStreet may investigate promptly, contain the issue, and inform affected parties where legally required or operationally necessary.',
      'We may also take temporary steps to restrict or secure accounts while an investigation is underway.',
    ],
  },
  {
    heading: '5. International transfers',
    content: [
      'We may process personal information in jurisdictions outside the user’s country of residence where required to support platform infrastructure, customer support, or service operations.',
      'Where cross-border transfers occur, we seek to apply reasonable safeguards consistent with relevant privacy obligations.',
    ],
  },
]

export default function DataProtectionPolicyPage() {
  return (
    <LegalPage
      title="Data Protection & Security"
      lastUpdated="August 19, 2026"
      summary="This policy outlines the practical safeguards, account controls, and incident procedures used to protect personal and platform data at FundedTechStreet."
      sections={sections}
    />
  )
}
