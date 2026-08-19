import LegalPage from '@/components/fts/LegalPage'

const sections = [
  {
    heading: '1. Who We Are',
    content: [
      'FX-EDGE operates the Program as a provider of simulated trading services and performance-based reward programs. FX-EDGE is not acting as a broker, investment firm, asset manager, financial institution or deposit-taking entity as part of these Program.',
      'The trading platform used within the Program is Match-Trader, which is provided by Match-Trade Technologies LLC a company limited by shares and incorporated in the United States, acting solely as an independent third-party technology provider.',
    ],
  },
  {
    heading: '2. Definitions',
    content: ['Unless the context requires otherwise, the following definitions apply:'],
    table: [
      { term: 'Account', definition: 'means a simulated trading account provided to the User within the Program;' },
      { term: 'AML', definition: 'means anti-money laundering and combating the financing of terrorism;' },
      { term: 'Capital', definition: 'means the notional value of simulated funds assigned to an Account for the purposes of simulated trading only;' },
      { term: 'Challenge', definition: 'means an evaluation stage of the Program during which the User performs simulated trading in order to qualify for the Funded Phase;' },
      { term: 'Cryptocurrency,\nCrypto', definition: 'means cryptographically secured digital representations of value, including cryptocurrencies and other digital assets, which do not constitute legal tender, are not issued or guaranteed by any central bank or public authority, and are transferred using distributed ledger technology or similar technology.;' },
      { term: 'Fiat', definition: 'means government-issued legal tender designated as official currency by a sovereign authority, having legal tender status in its jurisdiction of issuance, and not being a digital asset, cryptocurrency, or virtual asset;' },
      { term: 'Funded Phase', definition: 'means a stage of the Program during which the User is granted access to a simulated Account under predefined parameters, which may entitle the User to a Reward, but which does not involve the provision of any real capital, client funds or live trading account;' },
      { term: 'Forbidden\nTrading\nPractices', definition: 'means Practices described in Clause 7.5;' },
      { term: 'KYC', definition: 'means know-you-customer;' },
      { term: 'Program', definition: 'means the FX-EDGE Funded Accounts Program;' },
      { term: 'Reward', definition: 'means a discretionary, performance-based monetary reward payable by FX-EDGE subject to fulfilment of the conditions set out in these Terms based on each Challenge conditions;' },
      { term: 'Reference\nPeriod', definition: 'means a recurring accounting period applicable to the Funded phase of the Program, commencing on the date specified by FX-EDGE for the relevant Account and ending on the date determined in accordance with the Program parameters, during which the User’s simulated trading performance is assessed for the purposes of calculating Profit and determining eligibility for any Reward. Unless otherwise specified on the Website or within the Program or based on a Challenge, a Reference Period shall have a duration of one (1) calendar month;' },
      { term: 'Restricted\nJurisdiction', definition: 'means any jurisdiction where participation in the Program would be unlawful or would expose FX-EDGE to regulatory or legal risk;' },
      { term: 'Simulated\nTrading', definition: 'means trading activity performed exclusively in a simulated environment without access to real financial markets;' },
      { term: 'Website', definition: 'means any website, web portal, domain, subdomain or online interface operated or controlled by FX-EDGE V Ltd, whether directly or through authorised white-label partners, including any successor website, mobile application, trading interface or online platform, through which the Program, related services, information, rules, parameters, fees, disclosures, Restricted Jurisdictions lists, or any other materials relating to the Program are made available to Users from time to time.' },
    ],
  },
  {
    heading: '2. White-Label and Prop Brand Disclaimer',
    content: [
      '2.1. Where the Services are accessed through a third-party brand, trade name or white-label interface (each a “Prop Brand”), such Prop Brand acts solely as an independent branding and marketing partner providing a front-end interface. Prop Brands do not provide the Services, are not parties to these Terms, and have no authority to determine, modify or control the structure, rules, risk parameters, monitoring, payouts, account operations or complaints handling relating to the Services.',
      '2.2. The Company remains solely responsible for the provision and operation of the Services and for its contractual relationship with the Trader. Nothing herein shall be construed as creating any agency, partnership, employment or representative relationship between the Company and any Prop Brand, or between the Trader and any Prop Brand.',
    ],
  },
  {
    heading: '3. Amendments to the Terms',
    content: [
      '3.1. The Company reserves the right, at its sole discretion, to modify, update, replace or amend these Terms at any time. Updated Terms will become effective upon publication on this website with a revised effective date.',
      '3.2. Your continued use of the Services after any amendment constitutes acceptance of the updated Terms.',
    ],
  },
  {
    heading: '4. Trader Representations',
    content: [
      '4.1. By using the Services, you represent and warrant that:',
      '4.2. You are at least eighteen (18) years of age (or you meet other higher age requirements if applicable in your case) and have full legal capacity to enter into this agreement.',
      '4.3. You are acting on your own behalf or, if acting on behalf of a legal entity, you are duly authorised to bind such entity.',
      '4.4. Your use of the Services complies with all applicable laws, regulations and restrictions in your jurisdiction of residence.',
      '4.5. You are not subject to any legal or contractual restriction that would prohibit your participation in the Services.',
      '4.6. You acknowledge that the Services are accessed solely at your own initiative and request and not as a result of any active marketing, solicitation or targeting by the Company in your jurisdiction.',
    ],
  },
  {
    heading: '5. Reverse Solicitation and Geographic Restrictions',
    content: [
      '5.1. The Services are made available on a cross-border, reverse-solicitation basis only.',
      '5.2. The Company does not actively market, promote or target the Services to users in jurisdictions where such services would be unlawful or require regulatory authorisation.',
      '5.3. You are solely responsible for determining whether access to and use of the Services is lawful in your jurisdiction. The Company makes no representations regarding the availability or legality of the Services in any particular country.',
      '5.4. You acknowledge that you have not relied on any representations, statements, marketing materials or promotional content other than those expressly set out in these Terms when deciding to use the Services.',
    ],
  },
  {
    heading: '6. Limited Licence',
    content: [
      '6.1. Subject to compliance with these Terms, the Company grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable licence to access and use the Services for their intended purposes.',
      '6.2. You acquire no ownership rights in any intellectual property, software, data, content or systems used in connection with the Services.',
      '6.3. The Company reserves all rights not expressly granted under these Terms.',
    ],
  },
  {
    heading: '7. Prohibited Uses',
    content: [
      '7.1. You must not use the Services in any manner that violates applicable law, infringes third-party rights or disrupts the integrity, security or operation of the Services or related systems.',
      '7.2. You must not attempt to access, interfere with or misuse the Services through unauthorised means, including scraping, crawling, reverse engineering, circumvention of technical safeguards or similar activities.',
    ],
  },
  {
    heading: '8. Forbidden Trading',
    content: [
      '8.1. You are also prohibited from using any trading strategy that is expressly prohibited by the Company and/or Prop Brands. Such prohibited trading (“Forbidden Trading”) shall include, but not be limited to:',
      'a) exploiting pricing errors, data inaccuracies, non-public or insider information, system malfunctions, latency issues or delays in price updates, whether knowingly or unknowingly;',
      'b) executing trades based on external, delayed, non-standard or third-party data feeds, signals or strategies that differ from, are unavailable within, or are not intended to be used in connection with the Services;',
      'c) engaging in manipulative, deceptive or coordinated trading behaviour, whether alone or in cooperation with others, including between related Accounts, Accounts held under different legal entities, or through the simultaneous opening of opposing, offsetting or hedged positions, including any form of account arbitrage involving other accounts operated by the Company or any third-party firm;',
      'd) news trading related to macroeconomic data releases, central bank announcement geopolitical events and other similar ones that may affect unusual market conditions;',
      'e) executing trades in breach of the terms and conditions applicable to the agreement, the trading platform, liquidity provider or any related technical or execution systems used within the Services, or in any manner that jeopardises them may result in the cancellation, reversal or invalidation of trades at any time at the sole discretion of the Company;',
      'f) front-running of trades placed elsewhere, including trades executed with other brokers, venues or trading accounts;',
      'g) using software, scripts, algorithms, artificial intelligence tools, ultra-high-frequency techniques, automated trading systems, mass-order strategies, third-party, off-the-shelf or commercially marketed strategies (including those advertised as designed to pass assessment or challenge accounts), where such use is intended to manipulate, abuse, circumvent rules or obtain an unfair advantage from the Services or its systems;',
      'h) employing materially different trading strategies, risk profiles or execution behaviour between an assessment or challenge phase and a funded or simulated funded account, as determined by the Company in its sole and absolute discretion;',
      'i) engaging in trading behaviour that materially deviates from how trading is ordinarily conducted in the relevant financial markets, including holding or opening positions in a manner designed to exploit market close-to-open gaps, earnings announcements or similar events (such as holding single-share equity CFD positions into an earnings release), or otherwise giving rise to reasonable concerns that the Company any broker or any third party may suffer financial, operational, regulatory or reputational harm.',
      'Any detection of Forbidden Trading may result in immediate termination of participation in the Services, disqualification and forfeiture of any fees paid at any time at the sole discretion of the Company.',
      'The Company reserves the right to review, amend, cancel or reverse any transaction where execution was affected by Forbidden Trading.',
      'Such determination shall be final and binding on the Trader.',
    ],
  },
  {
    heading: '9. Education and Information Disclaimer',
    content: [
      '9.1. The Services are not educational programs and do not constitute training, coaching or instruction in trading or investing.',
      '9.2. Any information, data or content made available is provided for general informational purposes only and does not constitute financial, investment, legal or tax advice.',
      '9.3. Past performance is not indicative of future results.',
    ],
  },
  {
    heading: '10. Account Registration',
    content: [
      '10.1. To access the Services, you must create a personal account. You are responsible for maintaining the confidentiality of your login credentials.',
      '10.2. Accounts are personal and may not be shared, transferred or used by third parties.',
      '10.3. Unless expressly approved in advance in writing by FX-EDGE in exceptional cases, each User is permitted to maintain only one Account under each Prop Brand. The creation, use or operation of multiple Accounts by the same User is prohibited. Where an additional account is identified, FX-EDGE reserves the right to suspend, block or permanently restrict access to any such additional account.',
      '10.4. The Company will make the guidelines applicable to the Services available on its website and/or by email. Such guidelines, as amended from time to time at the Company’s discretion, form an integral part of these Terms.',
      '10.5. The Company makes no representations, warranties or guarantees, express or implied, regarding future employment, access to funded programs, monetary payments or any other form of compensation or reward arising from your participation in the Services or your performance as a trader.',
    ],
  },
  {
    heading: '11. Fees, Payments',
    content: [
      '11.1. Participation in certain Services, including assessment or challenge programs, requires the payment of a one-time fee. The applicable fees, payment methods and any applicable taxes will be displayed on the website prior to purchase.',
      '11.2. Fees are payable to the Company or to authorised third-party payment service providers acting on the Company’s behalf, including payment processors or merchants of record. The Company does not provide payment services and does not store payment card or wallet credentials.',
      '11.3. By submitting a payment, you authorise the Company and/or its authorised payment service providers to charge the applicable fees using your selected payment method. All payments are subject to the terms and conditions of the relevant payment service provider.',
      '11.4. The Company shall not be responsible for any delays, failures or errors in payment processing attributable to third-party payment service providers.',
    ],
  },
  {
    heading: '12. Refunds and Chargebacks',
    content: [
      '12.1. Fees paid for participation in the Services are non-refundable once access to the relevant challenge or assessment has been granted.',
      '12.2. The Company may, acting reasonably and at its sole discretion, issue a refund in exceptional circumstances, including in the event of a technical error or material failure to provide access to the purchased Service.',
      '12.3. You agree not to initiate chargebacks or payment disputes without first contacting the Company and allowing a reasonable opportunity to investigate and resolve the issue. Improper, abusive or fraudulent chargebacks may result in suspension or permanent termination of your access to the Services.',
      '12.4. Any refund issued shall be limited to the amount actually paid for the relevant Service and shall not include compensation for losses, missed opportunities, consequential damages or any past payments related to other challenges.',
    ],
  },
  {
    heading: '13. Funded Accounts and Additional Terms',
    content: [
      'For the avoidance of doubt, these Terms govern access to the website, user accounts and participation in assessment or challenge programs operated by the Company in affiliation with the Prop Brand. Participation in any funded or simulated funded account is subject to separate terms and conditions (the “Funded Account Terms”). In the event of any inconsistency or conflict, the Funded Account Terms shall prevail solely with respect to funded or simulated funded accounts, while these Terms shall continue to apply to all other aspects of the relationship.',
    ],
  },
  {
    heading: '14. Intellectual Property',
    content: [
      '14.1. All content, software, systems, trademarks and materials made available through the Services are owned by or licensed to the Company or its licensors.',
      '14.2. No rights are granted to reproduce, distribute, modify or exploit such materials beyond personal, non-commercial use as permitted by these Terms.',
    ],
  },
  {
    heading: '15. Termination',
    content: [
      '15.1. These Terms remain in effect from the moment you first access the Services until terminated.',
      '15.2. The Company may suspend or terminate access to the Services at any time, with or without notice, in its sole discretion.',
      '15.3. Termination does not affect provisions intended to survive, including disclaimers, limitation of liability and indemnities.',
      '15.4. If there is no activity (defined as the absence of any trades) on your Account for a continuous period of 30 calendar days, your Account will be automatically closed and your Service will be terminated. You will not be entitled to a refund of fees paid in connection with the challenge.',
    ],
  },
  {
    heading: '16. Disclaimer of Warranties',
    content: [
      '16.1. The Services are provided on an “as is” and “as available” basis.',
      '16.2. To the maximum extent permitted by law, the Company disclaims all warranties, whether express, implied or statutory, including warranties of merchantability, fitness for a particular purpose, accuracy, reliability and non-infringement.',
    ],
  },
  {
    heading: '17. Risk Disclosure Statement',
    content: [
      '17.1. Participation in the Services involves a high degree of risk and may not be suitable for all individuals. You should carefully consider your objectives, experience and risk tolerance and should not use funds that you cannot afford to lose.',
      '17.2. The Services do not involve the investment of your own capital. However, the trading strategies and methodologies assessed through the Services are inherently speculative and may involve significant financial risk in real market conditions.',
      '17.3. Trading in leveraged and over-the-counter instruments is subject to market volatility, liquidity risk and execution risk. Leverage may amplify both gains and losses, and adverse market movements can occur rapidly and without warning.',
      '17.4. The use of electronic and internet-based systems involves operational and technological risks, including delays, disruptions or failures of hardware, software or connectivity. The Company does not guarantee uninterrupted or error-free operation of the Services.',
      '17.5. No representation or guarantee is made regarding performance, profitability or results, and past or simulated performance is not indicative of future outcomes. Participation in the Services is undertaken entirely at your own risk.',
    ],
  },
  {
    heading: '18. Limitation of Liability',
    content: [
      '18.1. To the maximum extent permitted by law, the Company shall not be liable for any indirect, incidental, consequential, special or punitive damages.',
      '18.2. The Company’s aggregate liability shall not exceed the total fees paid by you for the relevant Services during last 3 months or USD 1,000, whichever is lower.',
      '18.3. If the Services are not provided or does not correspond to what has been agreed under these Terms, you may submit a complaint by sending an email to akhandsinghfifa15@gmail.com. FX-EDGE shall acknowledge receipt of the complaint and use reasonable efforts to resolve it as promptly as possible, and in any event no later than within thirty (30) calendar days from the date of receipt. You should be informed of the outcome of the complaint handling process by email.',
    ],
  },
  {
    heading: '19. Indemnification',
    content: [
      '19.1. You agree to indemnify, defend and hold harmless the Company, its directors, officers, shareholders, employees, contractors, subsidiaries, affiliates, white label partners, service providers and representatives (each an “Indemnified Party”) from and against any and all claims, demands, actions, proceedings, losses, damages, liabilities, fines, penalties, costs and expenses (including reasonable legal and professional fees) arising out of or in connection with:',
      'a) your access to or use of the Services or website, including any trading activity conducted in connection with the Services;',
      'b) your breach of, or failure to comply with, any provision of these Terms, any program rules, guidelines or policies incorporated by reference, or any representations or warranties made by you under these Terms;',
      'c) your violation of any applicable law, regulation, rule, ordinance, directive or treaty, whether local, national or international, including but not limited to laws relating to financial services, consumer protection, sanctions, anti-money laundering, market conduct or data protection;',
      'd) any allegation that content, data, actions or conduct attributable to you infringes, misappropriates or otherwise violates the intellectual property rights, privacy rights, confidentiality obligations or other proprietary or personal rights of any third party;',
      'e) any misuse of the Services, circumvention of program rules, engagement in Forbidden Trading, abusive trading behaviour, manipulation, or attempts to exploit technical, pricing or system features of the Services;',
      'f) any improper, abusive or fraudulent payment activity initiated by you, including chargebacks, payment disputes, false claims of unauthorised transactions or misuse of payment instruments.',
      '19.2. Your obligation to indemnify includes the duty to reimburse the Company for any amounts paid in settlement of claims, judgments, awards or penalties, provided that such settlement was entered into in good faith and relates to a matter subject to indemnification under these Terms.',
      '19.3. You acknowledge and agree that your obligation to defend and indemnify does not grant you the right to control, direct or interfere with the defence of any claim brought against an Indemnified Party. The Company reserves the exclusive right, at its own discretion, to assume control of the defence, appoint legal counsel of its choosing, and decide whether to contest, settle or otherwise dispose of any such claim.',
      '19.4. The Company may, but is not obliged to, notify you of any claim subject to indemnification. Failure to provide prompt notice shall not relieve you of your indemnification obligations, except to the extent that you are materially prejudiced by such failure.',
      '19.5. Your indemnification obligations under this section shall survive the termination or expiry of these Terms and your access to or use of the Services.',
      '19.6. For the avoidance of doubt, nothing in this section creates any contractual relationship between the Trader and any Prop Brand.',
    ],
  },
  {
    heading: '20. Governing Law and Jurisdiction',
    content: [
      'These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of laws principles. Any dispute, claim or proceeding arising out of or in connection with these Terms, including any question regarding its existence, validity or termination, shall be subject to the exclusive jurisdiction of the courts of England and Wales.',
    ],
  },
  {
    heading: '21. Force Majeure',
    content: [
      '21.1. The Company shall not be liable for any delay in performance, failure to perform, or interruption of the Services, nor for any claims, losses, damages, liabilities, costs or expenses (including reasonable legal fees) incurred by the Trader, to the extent such delay, failure or interruption results from events or circumstances beyond the Company’s reasonable control.',
      '21.2. Such events shall include, without limitation, acts of God, natural disasters, pandemics, epidemics, fire, flood, earthquake, explosion, war (declared or undeclared), armed conflict, civil unrest, terrorism, riots, insurrection, international intervention, strikes or labour disputes, governmental or regulatory actions or omissions (including exchange controls, sanctions, embargoes, nationalisations, expropriations, confiscations or devaluations), changes in law or regulatory interpretation, market disruptions or extreme market conditions, failures or delays in utilities, power supply, telecommunications, internet connectivity or data transmission, and any failure, malfunction or unavailability of hardware, software, systems or infrastructure operated by the Company, the Trader, brokers, liquidity providers or any third-party service providers.',
      '21.3. The Company shall also not be liable for any inability to communicate with the Trader or any third party, or for any degradation of service quality, latency, delay, suspension or disruption arising from the occurrence of a Force Majeure event.',
      '21.4. During the continuation of a Force Majeure event, the Company shall be entitled, acting reasonably, to suspend, limit or modify the Services without liability. The Company shall use reasonable efforts to resume normal performance of the Services as soon as practicable following the cessation of the Force Majeure event.',
      '21.5. Nothing in this section shall exclude or limit any liability which cannot be excluded or limited under applicable law.',
    ],
  },
  {
    heading: '22. Miscellaneous',
    content: [
      '22.1. If any provision of these Terms is held invalid or unenforceable, the remaining provisions shall remain in full force and effect.',
      '22.2. Failure to enforce any provision shall not constitute a waiver.',
      '22.3. In the event of termination of the agreement between the Company and Prop Brand, your Trader Account, these Terms and the related contractual relationship may be transferred (assigned) by the Company to that Prop Brand (or an entity designated by it). In such a case, the existing commercial terms and conditions applicable to you shall be maintained and you will be notified of the transfer; if you do not accept the transfer, you may terminate these Terms. You hereby consent to such transfer, including the related transfer of your personal data to the Prop Brand acting as an independent data controller, as further described in the applicable privacy policy. Where such transfer does not take place, the Company is entitled to transfer Trader Account previously operating under a given Prop Brand to another prop brand while maintaining the existing commercial terms and conditions or to purchase the challenge from another prop brand on preferential terms, which depends on the sole decision of the Company, depending on the possibility of implementing the above.',
      '22.4. These Terms constitute the entire agreement between you and the Company with respect to the Services.',
      '22.5. These Terms shall be interpreted in a commercially reasonable manner and shall not be construed against the Company solely on the basis that it drafted them.',
    ],
  },
]

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="TERMS AND CONDITIONS"
      subtitle="FUNDED ACCOUNTS PROGRAM"
      lastUpdated="August 10, 2026"
      summary="Operated by FX-EDGE V LTD, a company organized and existing under the laws of Vanuatu, with its registered office at 1276, Govant Building, Kumul Highway, Port Vila, Vanuatu, registered under number 700604 (the “Company”, “we”, “us” or “our”).\n\nThese Terms and Conditions (the “Terms”) govern your (“you” or the “Trader”) access to and use of the Company’s platform, services, proprietary evaluation, assessment, challenge and simulated trading programs and related content operated and offered by FX-EDGE in affiliation with Akhand Pratap Singh (the “Services”), including such Services made available through third-party brand or white-label front-end interface.\n\nBy accessing the website, registering an account, purchasing a challenge or otherwise using the Services, you confirm that you have read, understood and agree to be legally bound by these Terms. If you do not agree, you must not use the Services.\n\nThese Terms constitute a legally binding agreement between you and the Company."
      sections={sections}
    />
  )
}
