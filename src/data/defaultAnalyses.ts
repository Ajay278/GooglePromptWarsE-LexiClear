import { DocumentAnalysisResult } from '../types/legal';

export const DEFAULT_ANALYSES: Record<string, DocumentAnalysisResult> = {
  'saas-agreement': {
    documentTitle: 'CloudCorp Enterprise SaaS Agreement (Vendor Standard)',
    documentType: 'Master Software-as-a-Service (SaaS) Agreement',
    governingLaw: 'Delaware, USA (Sole Binding Arbitration in Wilmington)',
    parties: [
      {
        name: 'CloudCorp Solutions Inc. ("Vendor")',
        role: 'SaaS Platform Provider',
        leverageSummary: 'Dominant contractual leverage. Enforces unilateral fee increases, complete IP ownership over user data for AI training, and virtually zero liability.'
      },
      {
        name: 'Customer ("Client")',
        role: 'Enterprise Subscriber / Licensee',
        leverageSummary: 'Severely disadvantaged position. Bound to uncapped indemnity, unilateral renewal traps, and complete disclaimer of vendor warranties.'
      }
    ],
    executiveSummary: [
      'Uncapped 25% annual price escalation permitted with merely 15 days notice prior to renewal terms.',
      'Perpetual automatic renewal lock-in for 24-month blocks requiring certified postal mail notice 120 days in advance (email notice is voided).',
      'Aggressive unilateral AI data harvest clause granting Vendor perpetual royalty-free rights to train internal AI models on all client confidential inputs.',
      'Asymmetric liability disparity: Vendor aggregate liability is capped at the lesser of $100 or 1 month of fees, while Client liability remains completely uncapped.',
      'Mandatory individual arbitration in Delaware with explicit class action and jury trial waivers.'
    ],
    overallRiskScore: 88,
    overallRiskLabel: 'Critical Risk - Review Urgently',
    keyDeadlines: [
      {
        id: 'dl-1',
        title: 'Non-Renewal Notice Deadline',
        dueOrPeriod: 'At least 120 days prior to term expiration via certified mail only',
        responsibleParty: 'Client',
        consequenceOfBreach: 'Automatic binding renewal for an additional 24-month commitment term.',
        citation: 'Section 3: "...unless Client provides written notice of non-renewal via certified mail at least one hundred and twenty (120) days prior to the expiration of the then-current term. Notice by email is expressly deemed invalid."'
      },
      {
        id: 'dl-2',
        title: 'Price Increase Protest Window',
        dueOrPeriod: '15 calendar days from Vendor notice',
        responsibleParty: 'Client',
        consequenceOfBreach: 'Continued access constitutes irrevocable acceptance of up to a 25% fee hike.',
        citation: 'Section 2: "...increase subscription fees by up to 25% annually upon fifteen (15) calendar days\' written notice... Continued use constitutes irrevocable acceptance."'
      },
      {
        id: 'dl-3',
        title: 'Vendor Breach Cure Window',
        dueOrPeriod: '90 days opportunity to cure',
        responsibleParty: 'Client must afford Vendor 90 days',
        consequenceOfBreach: 'Client cannot terminate or pursue damages until 90 days have elapsed.',
        citation: 'Section 4: "In the event of an alleged breach by Vendor, Client must provide ninety (90) days\' notice and an opportunity to cure."'
      }
    ],
    criticalRisks: [
      {
        id: 'rk-1',
        title: 'Unilateral AI Model Training on Proprietary Data',
        severity: 'critical',
        plainEnglishExplanation: 'The vendor takes full permission to feed all your confidential files, customer records, and trade secrets into their artificial intelligence algorithms without paying you or allowing you to revoke access.',
        exactDocumentQuote: 'Client hereby grants to Vendor an irrevocable, perpetual, royalty-free, worldwide license to ingest, process, and use all Client Data, confidential information, and uploaded content to train, refine, and improve Vendor\'s machine learning models and artificial intelligence products.',
        clauseLocation: 'Section 5 (Intellectual Property & AI Training Data Rights)',
        whyItMatters: 'Could inadvertently breach GDPR, HIPAA, or NDAs you signed with your own clients, resulting in massive third-party litigation.',
        suggestedActionOrRedline: 'Strike the clause entirely or insert: "Vendor shall NOT ingest, process, or use any Client Data or Confidential Information to train, tune, or improve machine learning or AI models without prior express written consent."'
      },
      {
        id: 'rk-2',
        title: 'Draconian Asymmetric Liability Cap ($100 limit vs Uncapped)',
        severity: 'critical',
        plainEnglishExplanation: 'If the vendor loses all your data or leaks trade secrets, the maximum compensation you can ever recover is $100. Conversely, if you breach any term, your financial liability to them is infinite.',
        exactDocumentQuote: 'IN NO EVENT SHALL VENDOR\'S AGGREGATE LIABILITY... EXCEED THE LESSER OF ONE HUNDRED DOLLARS ($100.00)... CLIENT\'S LIABILITY TO VENDOR UNDER THIS AGREEMENT IS UNCAPPED AND NOT SUBJECT TO ANY LIMITATION WHATSOEVER.',
        clauseLocation: 'Section 6 (Limitation of Liability)',
        whyItMatters: 'Completely deprives you of remedy even in events of catastrophic vendor negligence or data loss.',
        suggestedActionOrRedline: 'Make liability mutual and cap both parties at total fees paid in the preceding 12 months, with carve-outs for confidentiality and gross negligence.'
      },
      {
        id: 'rk-3',
        title: 'Unilateral Price Hike of up to 25% with 15 Days Notice',
        severity: 'high',
        plainEnglishExplanation: 'Vendor can increase your price by 25% year-over-year and gives you only 15 days notice—which occurs after your 120-day cancellation deadline has already passed, trapping you into paying the higher rate.',
        exactDocumentQuote: 'Vendor reserves the unilateral right to increase subscription fees by up to 25% annually upon fifteen (15) calendar days\' written notice to Client prior to any Renewal Term.',
        clauseLocation: 'Section 2 (Fees, Billing & Unilateral Price Adjustments)',
        whyItMatters: 'Budget volatility and unfair lock-in trap: you cannot cancel in time to escape the price increase.',
        suggestedActionOrRedline: 'Cap price increases at CPI or 3% maximum, and require at least 60 days advance notice before the non-renewal cutoff window.'
      }
    ],
    clauses: [
      {
        id: 'cl-1',
        title: 'Subscription Services & Unilateral Feature Discontinuation',
        category: 'Operational & General',
        plainEnglish: 'Vendor gives you access to their cloud software, but reserves the right to remove features or shut down capabilities anytime without notifying you.',
        originalExcerpt: 'Vendor may update or discontinue features of the Platform at any time without prior written notice to Client.',
        whoBenefits: 'Heavily One-Sided',
        riskLevel: 'medium',
        potentialTraps: 'The vendor could remove essential functionality your business relies on without reducing the price or granting a refund.',
        counterProposal: 'Vendor shall not materially degrade or eliminate core platform functionality during the active subscription term.'
      },
      {
        id: 'cl-2',
        title: 'Automatic 24-Month Renewal & Certified Mail Trap',
        category: 'Termination & Cancellation',
        plainEnglish: 'The contract locks you into successive 2-year commitments automatically. To prevent renewal, you must mail physical certified post 120 days in advance; emailing your account rep is legally invalid.',
        originalExcerpt: 'Following the Initial Term, this Agreement shall automatically renew for successive terms of twenty-four (24) months each... unless Client provides written notice of non-renewal via certified mail at least one hundred and twenty (120) days prior... Notice by email is expressly deemed invalid.',
        whoBenefits: 'Heavily One-Sided',
        riskLevel: 'critical',
        potentialTraps: 'Companies frequently miss certified mail deadlines, triggering an unavoidable 24-month unbudgeted bill.',
        counterProposal: 'Convert renewal to month-to-month or 12-month periods, with 30-day notice permitted via standard electronic mail.'
      },
      {
        id: 'cl-3',
        title: 'AI Training Rights on Client Proprietary Content',
        category: 'Intellectual Property',
        plainEnglish: 'You give the software company a permanent free license to feed all your uploaded business data into their artificial intelligence models.',
        originalExcerpt: 'Client hereby grants to Vendor an irrevocable, perpetual, royalty-free, worldwide license to ingest, process, and use all Client Data... to train, refine, and improve Vendor\'s machine learning models and artificial intelligence products.',
        whoBenefits: 'Heavily One-Sided',
        riskLevel: 'critical',
        potentialTraps: 'Your competitive advantages and client secrets become part of an AI weights distribution owned by the vendor.',
        counterProposal: 'Client retains sole ownership of data. Vendor agrees never to train AI/ML models on customer content.'
      },
      {
        id: 'cl-4',
        title: 'Asymmetric Indemnification Obligations',
        category: 'Liability & Indemnity',
        plainEnglish: 'You agree to hire lawyers and pay for all damages if anyone sues the vendor over your account. However, the vendor does not protect you if third parties sue you for IP infringement caused by their software.',
        originalExcerpt: 'Client shall defend, indemnify, and hold harmless Vendor... from and against any and all claims, damages, liabilities... Vendor provides zero indemnity to Client regarding intellectual property infringement.',
        whoBenefits: 'Heavily One-Sided',
        riskLevel: 'high',
        potentialTraps: 'Leaves the client completely exposed if the vendor\'s software infringes a patent or copyright.',
        counterProposal: 'Require mutual indemnification where Vendor defends Client against all third-party IP infringement claims.'
      }
    ],
    inconsistenciesOrAmbiguities: [
      {
        issue: 'Notice Window Timing Paradox',
        explanation: 'Section 2 permits price increases with 15 days notice prior to renewal, but Section 3 requires non-renewal cancellation 120 days prior. By the time the client learns of the price hike, the cancellation window is already closed.',
        recommendation: 'Align price notice to at least 150 days prior to term end, or grant an express 30-day right to terminate upon any price increase.'
      }
    ],
    actionableChecklist: [
      {
        id: 'chk-1',
        step: 'Set 120-Day Non-Renewal Calendar Alert',
        category: 'Must Do',
        details: 'Calculate 120 days prior to the 36-month anniversary and set recurring calendar reminders for certified postal mail dispatch.'
      },
      {
        id: 'chk-2',
        step: 'Strike Section 5 AI Ingestion License',
        category: 'Should Negotiate',
        details: 'Require written amendment disclaiming any use of client data for generative AI or foundation model training.'
      },
      {
        id: 'chk-3',
        step: 'Equalize Liability and Indemnity Caps',
        category: 'Should Negotiate',
        details: 'Propose a mutual 12-month trailing fee cap and eliminate the one-sided $100 vendor ceiling.'
      }
    ],
    consultationQuestions: [
      'Can the 15-day price increase and 120-day certified mail renewal clause be challenged as an unconscionable contract of adhesion under Delaware law?',
      'How does the AI training grant interact with our confidentiality agreements with our downstream enterprise customers?',
      'What standard redline language do you recommend to restore mutual indemnification for SaaS copyright infringement?'
    ]
  },
  'consulting-agreement': {
    documentTitle: 'Apex Global Enterprises Independent Contractor Agreement',
    documentType: 'Independent Contractor Consulting Agreement',
    governingLaw: 'California, USA',
    parties: [
      {
        name: 'Apex Global Enterprises LLC ("Company")',
        role: 'Hiring Entity',
        leverageSummary: 'Enforces extreme restrictive covenants: 24-month non-compete, perpetual broad IP assignment, and 20% invoice retainage.'
      },
      {
        name: 'Jane Doe ("Contractor")',
        role: 'Independent Specialist / Consultant',
        leverageSummary: 'Subject to potential livelihood suppression via non-compete and delayed payment terms.'
      }
    ],
    executiveSummary: [
      '24-month worldwide post-termination non-compete severely restricts contractor from providing services to any competing technology entity.',
      'Unreasonable 20% retainage withholding on all earnings with 90-day post-project payment delay.',
      'Overbroad IP assignment claims ownership over contractor inventions created during off-hours with personal equipment.',
      'Unilateral termination rights allowing Company to terminate immediately while Contractor must provide 30 days notice.',
      'One-sided indemnity forcing contractor to defend Company against worker misclassification audits.'
    ],
    overallRiskScore: 79,
    overallRiskLabel: 'High Risk',
    keyDeadlines: [
      {
        id: 'dl-con-1',
        title: 'Retainage Withholding Disbursement',
        dueOrPeriod: '90 days following final completion and formal Company sign-off',
        responsibleParty: 'Company',
        consequenceOfBreach: 'Contractor forced to finance client for 3 months post-completion.',
        citation: 'Section 2: "Company may withhold twenty percent (20%) of each invoice... payable within ninety (90) days following final completion..."'
      },
      {
        id: 'dl-con-2',
        title: 'Contractor Termination Notice Window',
        dueOrPeriod: '30 days written notice required',
        responsibleParty: 'Contractor',
        consequenceOfBreach: 'Company can terminate immediately with zero notice, creating asymmetric risk.',
        citation: 'Section 6: "Company may terminate this Agreement immediately... Contractor may terminate only upon thirty (30) days\' written notice."'
      }
    ],
    criticalRisks: [
      {
        id: 'rk-con-1',
        title: 'Worldwide 24-Month Non-Competition Clause',
        severity: 'critical',
        plainEnglishExplanation: 'You are barred from working with, advising, or freelancing for any company in the same industry worldwide for 2 full years after your contract ends.',
        exactDocumentQuote: 'Contractor shall not, during the term and for twenty-four (24) months thereafter, directly or indirectly provide consulting services, develop software, or engage with any business that competes with Company worldwide.',
        clauseLocation: 'Section 4 (Restrictive Covenants & Non-Compete)',
        whyItMatters: 'Under California law (Cal. Bus. & Prof. Code § 16600) and FTC guidance, non-competes on independent contractors are generally void, yet this clause creates severe chilling effect.',
        suggestedActionOrRedline: 'Strike Section 4 completely. Replace with standard non-disclosure of verified trade secrets.'
      },
      {
        id: 'rk-con-2',
        title: 'Overbroad Assignment of Independent Pre-Existing IP',
        severity: 'high',
        plainEnglishExplanation: 'The agreement attempts to seize everything you build while under contract, even code written on your own laptop during evenings or weekends.',
        exactDocumentQuote: 'Contractor hereby assigns to Company all right, title, and interest in and to all inventions, software, and concepts conceived or reduced to practice during the term of this Agreement, whether or not created during working hours or using Company resources.',
        clauseLocation: 'Section 3 (Intellectual Property & Work-for-Hire)',
        whyItMatters: 'Threatens ownership of your open-source tools, pre-existing libraries, and personal software projects.',
        suggestedActionOrRedline: 'Limit assignment exclusively to deliverables specifically commissioned and paid for under an executed SOW.'
      }
    ],
    clauses: [
      {
        id: 'cl-con-1',
        title: 'Worldwide Non-Compete Restraint',
        category: 'Confidentiality & Restrictive Covenants',
        plainEnglish: 'Bars you from freelancing or working for any industry competitor anywhere on earth for 24 months.',
        originalExcerpt: 'Contractor shall not... for twenty-four (24) months thereafter... engage with any business that competes with Company worldwide.',
        whoBenefits: 'Heavily One-Sided',
        riskLevel: 'critical',
        potentialTraps: 'Blocks your livelihood in your primary domain of expertise.',
        counterProposal: 'Strike non-compete entirely. Rely on narrow non-solicitation of clients.'
      },
      {
        id: 'cl-con-2',
        title: '20% Invoice Retainage & 90-Day Payment Lag',
        category: 'Financial & Payment',
        plainEnglish: 'Company holds back 20% of every paycheck and keeps it until 90 days after the entire project wraps up.',
        originalExcerpt: 'Company may withhold twenty percent (20%) of each invoice as a quality retainage, payable within ninety (90) days following final completion...',
        whoBenefits: 'Heavily One-Sided',
        riskLevel: 'high',
        potentialTraps: 'Significant cash-flow disruption; clients often invent defects to avoid paying the final 20%.',
        counterProposal: 'Net-15 day invoicing with zero retainage withholding.'
      }
    ],
    inconsistenciesOrAmbiguities: [
      {
        issue: 'Worker Classification Ambiguity',
        explanation: 'Section 1 designates Contractor as an independent contractor, but Section 7 demands Contractor indemnify Company against employee misclassification claims while Section 4 imposes employee-like controls.',
        recommendation: 'Ensure terms comply with California AB5 / Borello standards without restrictive non-competes.'
      }
    ],
    actionableChecklist: [
      {
        id: 'chk-con-1',
        step: 'Strike Section 4 Non-Compete Clause',
        category: 'Must Do',
        details: 'Point out void status under Cal. Bus. & Prof. Code § 16600 and request complete removal.'
      },
      {
        id: 'chk-con-2',
        step: 'Negotiate Net-15 or Net-30 Payment',
        category: 'Should Negotiate',
        details: 'Refuse the 20% retainage fee holdback; substitute standard milestone acceptance criteria.'
      }
    ],
    consultationQuestions: [
      'Is the 24-month worldwide non-compete enforceable against a remote contractor under current state and federal regulations?',
      'Does the broad IP assignment jeopardize my pre-existing open-source codebases?'
    ]
  },
  'residential-lease': {
    documentTitle: 'Standard Residential Apartment Lease Agreement',
    documentType: 'Residential Apartment Tenancy Lease',
    governingLaw: 'Local State Tenancy Law',
    parties: [
      {
        name: 'Oakwood Property Management ("Landlord")',
        role: 'Property Owner / Leasing Agent',
        leverageSummary: 'Maintains automatic forfeiture rights, unrestricted entry permissions, and passes structural repair liabilities to tenant.'
      },
      {
        name: 'John Smith ("Tenant")',
        role: 'Apartment Lessee',
        leverageSummary: 'Exposed to automatic 12% rent increases, strict visitor bans, and HVAC repair obligations.'
      }
    ],
    executiveSummary: [
      'Automatic renewal converts into a mandatory 1-year term with a 12% rent hike unless tenant provides 90 days advance written notice.',
      'Unlawful liquidated damages clause: early move-out results in full forfeiture of the $4,800 security deposit even if the unit is immediately re-rented.',
      'Tenant is burdened with all maintenance under $500 as well as all HVAC compressor and central air repair expenses.',
      'Unrestricted landlord entry clause allows property management to enter at any time without advance notice.',
      'Draconian guest rules: overnight guests staying more than two consecutive nights trigger immediate 3-day eviction notice and $300 fines.'
    ],
    overallRiskScore: 84,
    overallRiskLabel: 'Critical Risk - Review Urgently',
    keyDeadlines: [
      {
        id: 'dl-res-1',
        title: 'Non-Renewal Move-Out Notice',
        dueOrPeriod: 'At least 90 days prior to lease end (by May 2, 2027)',
        responsibleParty: 'Tenant',
        consequenceOfBreach: 'Automatic renewal for 1 full year with mandatory 12% rent hike.',
        citation: 'Section 1: "Unless Tenant provides written notice of intent to vacate at least ninety (90) days prior to expiration, this Lease automatically converts into a full 1-year renewal term with a mandatory 12% rent increase."'
      },
      {
        id: 'dl-res-2',
        title: 'Rent Late Fee Grace Period Cutoff',
        dueOrPeriod: '11:59 PM on the 2nd day of each month',
        responsibleParty: 'Tenant',
        consequenceOfBreach: '$150 immediate late fee plus $25 per day penalty.',
        citation: 'Section 2: "If rent is not received by 11:59 PM on the 2nd day of the month, Tenant shall pay a late fee of $150.00 plus $25.00 per day..."'
      }
    ],
    criticalRisks: [
      {
        id: 'rk-res-1',
        title: 'Total Security Deposit Forfeiture as Unlawful Liquidated Damages',
        severity: 'critical',
        plainEnglishExplanation: 'If you need to move out early for any reason, the landlord steals your entire $4,800 deposit even if they find a new tenant the next day.',
        exactDocumentQuote: 'IF TENANT VACATES OR TERMINATES PRIOR TO THE FULL COMPLETION OF THE LEASE TERM, THE ENTIRE SECURITY DEPOSIT SHALL BE AUTOMATICALLY FORFEITED AS LIQUIDATED DAMAGES, REGARDLESS OF WHETHER LANDLORD RE-RENTS THE PREMISES.',
        clauseLocation: 'Section 3 (Security Deposit and Forfeiture)',
        whyItMatters: 'In almost every jurisdiction, landlords have a statutory duty to mitigate damages, making blanket deposit forfeiture illegal.',
        suggestedActionOrRedline: 'Replace with: "Security deposit shall be returned pursuant to statutory timeline less verified, documented damages beyond normal wear and tear."'
      },
      {
        id: 'rk-res-2',
        title: 'Tenant Obligated for Major HVAC & Central Air Repairs',
        severity: 'high',
        plainEnglishExplanation: 'You are forced to pay for compressor replacements and major heating/AC repairs, which are capital improvements legally belonging to the landlord.',
        exactDocumentQuote: 'Tenant shall be responsible for routine servicing, filter replacement, and any compressor repairs for the central heating and air conditioning (HVAC) system regardless of cost.',
        clauseLocation: 'Section 4 (Maintenance, Repairs & HVAC Systems)',
        whyItMatters: 'An HVAC compressor failure can cost $3,000 to $7,000, passing landlord capital expenses to the renter.',
        suggestedActionOrRedline: 'Limit tenant responsibility strictly to changing air filters; landlord must bear all mechanical and structural maintenance.'
      }
    ],
    clauses: [
      {
        id: 'cl-res-1',
        title: 'Unrestricted Landlord Entry Without Notice',
        category: 'Operational & General',
        plainEnglish: 'The landlord claims the right to enter your home at any hour without knocking or providing 24 hours notice.',
        originalExcerpt: 'Landlord and its agents may enter the apartment at any time without advance notice for inspection, maintenance...',
        whoBenefits: 'Heavily One-Sided',
        riskLevel: 'high',
        potentialTraps: 'Violates your common law and statutory covenant of quiet enjoyment.',
        counterProposal: 'Require at least 24 hours advance written notice for non-emergency inspections.'
      }
    ],
    inconsistenciesOrAmbiguities: [
      {
        issue: 'Statutory Habitability Conflict',
        explanation: 'Passing heating and cooling capital repairs to tenants conflicts with implied warranty of habitability laws in most US states.',
        recommendation: 'Check local municipal residential tenancy codes.'
      }
    ],
    actionableChecklist: [
      {
        id: 'chk-res-1',
        step: 'Strike HVAC Compressor Repair Clause',
        category: 'Must Do',
        details: 'Ensure landlord retains full legal responsibility for major building systems.'
      },
      {
        id: 'chk-res-2',
        step: 'Add 24-Hour Entry Notice Requirement',
        category: 'Must Do',
        details: 'Require written notice prior to any non-emergency entry.'
      }
    ],
    consultationQuestions: [
      'Is the automatic $4,800 security deposit forfeiture clause enforceable in our jurisdiction?',
      'Does local rent stabilization cap the automatic 12% renewal escalator?'
    ]
  },
  'mutual-nda': {
    documentTitle: 'Unilateral Technology Vendor Non-Disclosure Agreement',
    documentType: 'Non-Disclosure Agreement (Unilateral)',
    governingLaw: 'Applicable State Law',
    parties: [
      {
        name: 'AlphaTech Systems Inc. ("Disclosing Party")',
        role: 'Disclosing Party',
        leverageSummary: 'Secures perpetual protection for its information while assuming zero reciprocal confidentiality obligations.'
      },
      {
        name: 'Prospective Partner LLC ("Receiving Party")',
        role: 'Receiving Party',
        leverageSummary: 'Bound to perpetual secrecy with unilateral attorney fees liability if accused of breach.'
      }
    ],
    executiveSummary: [
      'Deceptively labeled as mutual collaboration, but only Disclosing Party receives confidentiality protection; Receiving Party disclosures are unprotected.',
      'Perpetual duration of obligation creates infinite liability risk rather than standard 2-to-3-year confidentiality sunset.',
      'One-sided attorney fee recovery allows Disclosing Party to recoup legal fees, while denying reciprocal rights to Receiving Party.'
    ],
    overallRiskScore: 71,
    overallRiskLabel: 'High Risk',
    keyDeadlines: [
      {
        id: 'dl-nda-1',
        title: 'Confidentiality Term Expiration',
        dueOrPeriod: 'Perpetual / Indefinite duration',
        responsibleParty: 'Receiving Party',
        consequenceOfBreach: 'Never expires, binding company indefinitely.',
        citation: 'Section 4: "Receiving Party\'s obligations... shall survive... and continue IN PERPETUITY..."'
      }
    ],
    criticalRisks: [
      {
        id: 'rk-nda-1',
        title: 'Asymmetric Non-Mutual Confidentiality Protection',
        severity: 'high',
        plainEnglishExplanation: 'Any trade secrets you share with them are explicitly NOT confidential and can be freely copied or shared, but anything they share with you must be locked down forever.',
        exactDocumentQuote: 'Any information disclosed by Receiving Party shall NOT be treated as confidential under this Agreement.',
        clauseLocation: 'Section 2 (Confidential Information)',
        whyItMatters: 'If you discuss your product roadmap or pricing, they can legally give it to competitors.',
        suggestedActionOrRedline: 'Convert the entire agreement into a truly mutual bilateral NDA.'
      }
    ],
    clauses: [
      {
        id: 'cl-nda-1',
        title: 'Perpetual Confidentiality Duration',
        category: 'Confidentiality & Restrictive Covenants',
        plainEnglish: 'You can never dispose of their materials or discuss this information for the rest of your company\'s existence.',
        originalExcerpt: '...shall survive the termination of discussions and continue IN PERPETUITY...',
        whoBenefits: 'Heavily One-Sided',
        riskLevel: 'medium',
        potentialTraps: 'Perpetual NDAs create tracking compliance nightmares.',
        counterProposal: 'Limit term to 2 or 3 years from disclosure date.'
      }
    ],
    inconsistenciesOrAmbiguities: [
      {
        issue: 'Preamble vs Operational Clauses Conflict',
        explanation: 'Preamble indicates mutual exploration, but Section 2 explicitly strips receiving party of protection.',
        recommendation: 'Adopt standard NVCA or ABA mutual confidentiality model.'
      }
    ],
    actionableChecklist: [
      {
        id: 'chk-nda-1',
        step: 'Demand Reciprocal Mutual Protection',
        category: 'Must Do',
        details: 'Replace with bilateral definitions of Confidential Information.'
      }
    ],
    consultationQuestions: [
      'Should we sign their unilateral NDA or insist on our standard mutual template?'
    ]
  }
};

// Alias contractor-agreement to consulting-agreement for seamless lookup
DEFAULT_ANALYSES['contractor-agreement'] = DEFAULT_ANALYSES['consulting-agreement'];

