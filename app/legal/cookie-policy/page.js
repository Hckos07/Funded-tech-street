import LegalPage from '@/components/fts/LegalPage'

const sections = [
  {
    heading: '1. What are cookies?',
    content: [
      'Cookies are small text files placed on a device when a user visits a website. They help the website remember preferences, improve security, and support essential site functionality.',
      'We may use both session cookies, which expire when the browser is closed, and persistent cookies, which remain on the device for a defined period.',
    ],
  },
  {
    heading: '2. Types of cookies we use',
    list: [
      'Essential cookies: required for security, login, and basic site navigation.',
      'Functional cookies: remember settings such as theme preferences or session choices.',
      'Analytics cookies: help us understand how visitors use the website and improve performance.',
      'Preference cookies: support personalized user experience choices and convenience features.',
    ],
  },
  {
    heading: '3. Why we use cookies',
    content: [
      'Cookies are used to keep the platform secure, reduce repeated sign-in friction, preserve selected settings, and improve website performance and user experience.',
      'Analytics cookies may also help us monitor which areas of the website are most useful, while maintaining a reasonable balance between usability and privacy.',
    ],
  },
  {
    heading: '4. Your choices',
    content: [
      'Users can manage or disable cookies in their browser settings. Please note that disabling some cookies may affect website functionality, including session continuity and login-related features.',
      'You may also choose to reject non-essential cookies through available cookie preference controls, where such controls are present on the site.',
    ],
  },
  {
    heading: '5. Third-party tools',
    content: [
      'We may use trusted third-party services for analytics, hosting, and support operations. These services may place their own cookies in accordance with their own privacy and cookie practices.',
      'We encourage users to review the privacy notices of any third-party tool used on the site where applicable.',
    ],
  },
]

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      lastUpdated="August 19, 2026"
      summary="This Cookie Policy explains how FundedTechStreet uses cookies and similar technologies to support website functionality, security, and user experience."
      sections={sections}
    />
  )
}
