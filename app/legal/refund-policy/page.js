import LegalPage from '@/components/fts/LegalPage'

const sections = [
  {
    heading: '1. Overview',
    content: [
      'This Refund Policy explains the conditions under which challenge fees or payments may be refunded or credited. It applies to services purchased through FundedTechStreet and should be read in conjunction with our Terms of Service.',
      'Refund eligibility may vary depending on the specific program, payment method, and account status at the time a request is made.',
    ],
  },
  {
    heading: '2. General policy',
    content: [
      'Fees are typically considered non-refundable once access has been granted and the challenge has begun, unless otherwise stated in a specific program offer or a formal exception is approved by the platform team.',
      'In circumstances involving technical errors, duplicate charges, or unauthorized transactions, users may request a review and potential resolution through the official support channels.',
    ],
  },
  {
    heading: '3. Review process',
    content: [
      'All refund requests must be submitted with supporting information, including account details, payment reference information, and a clear explanation of the issue.',
      'FundedTechStreet reviews refund requests on a case-by-case basis and may request additional verification before finalizing a result.',
    ],
  },
  {
    heading: '4. Discretionary decisions',
    content: [
      'The company may decline refund requests where requirements are not met, the service has already been consumed, or the user has materially violated the platform rules.',
      'Approved refunds, if any, will generally be processed back to the original payment method and may take additional time depending on the payment provider.',
    ],
  },
  {
    heading: '5. Changes to policy',
    content: [
      'This policy may be updated over time to reflect commercial, regulatory, or operational requirements. Users should review the current version before making a purchase or submitting a refund request.',
    ],
  },
]

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      lastUpdated="August 19, 2026"
      summary="The Refund Policy outlines how challenge fees and related payments are reviewed, handled, and potentially refunded under specific circumstances."
      sections={sections}
    />
  )
}
