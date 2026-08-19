import LegalPage from '@/components/fts/LegalPage'

const sections = [
  {
    content: [
      '1. The data controller of your personal data is FX-EDGE V Ltd based in 1276, Govant Building, Kumul Highway, Port Vila, Vanuatu, company no. 700604 (hereinafter the “Data Controller”).',
    ],
  },
  {
    content: [
      '2. The data controller has appointed a Data Protection Officer. You can contact the Data Protection Officer by e-mail: kteofilski@fx-edge.com.',
    ],
  },
  {
    content: [
      '3. Your personal data will be processed for the purpose of concluding and performing the agreement executed with the Data Controller as well as fulfilling the Data Controller\'s obligations resulting from the status of an entity conducting virtual currency exchange and deposit services, in particular obligations arising from the counteracting money laundering and terrorism financing applicable law. Your personal data will also be processed in order to implement the legitimate interests of the Data Controller, such as making necessary settlements and pursuing claims arising from the executed agreement, security, counteracting fraud and direct marketing of the Data Controller.',
    ],
  },
  {
    content: [
      '4. Data processing for purposes other than the above may take place: (i) based on obtaining additional consent, (ii) based on applicable law, or (iii) when it is consistent with the purpose for which the personal data were originally collected.',
    ],
  },
  {
    content: [
      '5. The legal basis for the processing of your personal data is: a) to the extent that data processing is necessary to perform the agreement and to take actions before its conclusion; b) to the extent that data processing is necessary for the Data Controller to fulfill its legal obligations as an entity conducting virtual currency exchange and deposit services, in particular informing financial supervision authorities and financial information authorities about the services provided and transactions performed, verification and identification the Client\'s identity and ongoing monitoring of economic relations; c) to the extent that data processing is necessary to achieve the purposes arising from the legitimate interests of the Data Controller, such as making necessary settlements and pursuing claims arising from the concluded agreement, security, counteracting fraud or direct marketing of the Data Controller.',
    ],
  },
  {
    content: [
      '6. You have the right to access your personal data, the right to rectify and delete it, as well as the right to limit data processing. To the extent that processing is necessary to perform the agreement to which you are a party or to take action at your request before concluding it, you also have the right data transfer. If you believe that your data is processed contrary to legal requirements, you may lodge a complaint with the competent supervisory authority.',
    ],
  },
  {
    content: [
      '7. Providing personal data is voluntary, but necessary to conclude the agreement and use the Data Controller services. Failure to provide the personal data will result in refusal to conclude the agreement.',
    ],
  },
  {
    content: [
      '8. Your personal data may be transferred to the following categories of recipients: banks, payment institutions, virtual asset service providers, companies from the capital group to which the Data Controller belongs, prop brands (entities under whose brand you use the services), postal operators, supervisory authorities, financial information authorities, suppliers of tools and platform software used to handle transactions and financial operations performed in the course of the implementation of the agreement, as well as to send commercial information by electronic means of communication, legal advisors and entities providing servers and storing data. In the event of termination of the cooperation between the Data Controller and the prop brand under whose brand you use the services, your personal data may be transferred to that prop brand, which will act as an independent data controller of your personal data, in order to ensure the continuity of the services provided to you. You will be informed of any such transfer in advance.',
    ],
  },
  {
    content: [
      '9. In the case of transferring personal data to third countries, the Data Controller transfers them using mechanisms in accordance with applicable law.',
    ],
  },
  {
    content: [
      '10. Your personal data will be stored for the duration of the agreement, as well as after its termination, for a period of 5 years, counting from the first day of the year following the year in which the economic relationship with the client ended or until the limitation period for claims arising from legal provisions expires. Data included in the results of assessments of economic relations will be processed for a period of 5 years, counting from the first day of the year following the year in which they were passed. The above data storage periods may be extended if required by the relevant supervisory authority. To the extent that data processing is based on the legitimate interest of the Data Controller, the personal data will be processed for the time necessary for its implementation (in particular until the limitation period for claims under applicable law), but no longer than until the objection is deemed justified by your particular situation, and if the legally justified interest is the Data Controller\'s direct marketing - until you express your objection.',
    ],
  },
  {
    content: [
      '11. To the extent that personal data is processed for the Data Controller\'s direct marketing purposes, you have the right to object to data processing, which does not require justification. If the processing is based on other legitimate interests of the Data Controller, exercising your right to object requires justification by your special situation.',
    ],
  },
  {
    content: [
      '12. You will not be subject to a decision that is based solely on automated processing, including profiling, and produces legal effects concerning you or similarly significantly affects you.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy for Clients"
      lastUpdated="August 20, 2026"
      summary="This Privacy Policy for Clients explains how personal data is collected, used, protected, and shared by FX-EDGE V Ltd in connection with the client relationship and regulated services."
      sections={sections}
    />
  )
}

