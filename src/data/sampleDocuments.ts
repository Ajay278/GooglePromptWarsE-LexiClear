import { SampleDocument } from '../types/legal';

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'saas-agreement',
    title: 'CloudCorp Enterprise SaaS Agreement (Vendor Standard)',
    category: 'Commercial SaaS',
    badge: 'High Risk Terms',
    summary: 'Standard vendor-drafted Master Subscription Agreement with one-sided indemnity, 24-month auto-renewal, and unilateral fee adjustments.',
    content: `MASTER SOFTWARE-AS-A-SERVICE (SaaS) AGREEMENT

This Master Software-as-a-Service Agreement ("Agreement") is entered into as of October 1, 2026 ("Effective Date"), by and between CloudCorp Solutions Inc., a Delaware corporation ("Vendor"), and Customer ("Client").

1. SUBSCRIPTION SERVICES & LICENSE GRANT
Subject to the terms hereof, Vendor grants to Client a non-exclusive, non-transferable right to access and use the CloudCorp Platform solely for Client's internal business operations. Vendor reserves all rights not expressly granted. Vendor may update or discontinue features of the Platform at any time without prior written notice to Client.

2. FEES, BILLING & UNILATERAL PRICE ADJUSTMENTS
Client shall pay all fees set forth in the Order Form. All payment obligations are non-cancelable and fees paid are non-refundable. Vendor reserves the unilateral right to increase subscription fees by up to 25% annually upon fifteen (15) calendar days' written notice to Client prior to any Renewal Term. Continued use of the Service following such notice constitutes Client's irrevocable acceptance.

3. TERM AND AUTOMATIC RENEWAL
The initial term shall be thirty-six (36) months from the Effective Date ("Initial Term"). Following the Initial Term, this Agreement shall automatically renew for successive terms of twenty-four (24) months each (each a "Renewal Term"), unless Client provides written notice of non-renewal via certified mail at least one hundred and twenty (120) days prior to the expiration of the then-current term. Notice by email is expressly deemed invalid.

4. TERMINATION FOR CONVENIENCE & CURE PERIOD
Vendor may terminate this Agreement at any time for convenience upon thirty (30) days' prior written notice. Client may NOT terminate this Agreement for convenience under any circumstances. In the event of an alleged breach by Vendor, Client must provide ninety (90) days' notice and an opportunity to cure.

5. INTELLECTUAL PROPERTY & AI TRAINING DATA RIGHTS
Vendor owns all right, title, and interest in and to the Platform, including all algorithms, improvements, and derivatives. Client hereby grants to Vendor an irrevocable, perpetual, royalty-free, worldwide license to ingest, process, and use all Client Data, confidential information, and uploaded content to train, refine, and improve Vendor's machine learning models and artificial intelligence products.

6. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW:
(a) IN NO EVENT SHALL VENDOR'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER IN CONTRACT, TORT, OR OTHERWISE, EXCEED THE LESSER OF ONE HUNDRED DOLLARS ($100.00) OR THE TOTAL FEES PAID BY CLIENT IN THE ONE (1) MONTH PRECEDING THE CLAIM.
(b) VENDOR DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
(c) CLIENT'S LIABILITY TO VENDOR UNDER THIS AGREEMENT IS UNCAPPED AND NOT SUBJECT TO ANY LIMITATION WHATSOEVER.

7. INDEMNIFICATION
Client shall defend, indemnify, and hold harmless Vendor, its affiliates, directors, officers, and employees from and against any and all claims, damages, liabilities, losses, and legal costs (including full attorney fees) arising from: (a) Client's use of the Platform; (b) any breach of this Agreement by Client; or (c) any claim that Client Data infringes third-party rights. Vendor provides zero indemnity to Client regarding intellectual property infringement.

8. GOVERNING LAW & MANDATORY BINDING ARBITRATION
This Agreement is governed by the laws of the State of Delaware without regard to conflict of laws. All disputes must be resolved solely through individual binding arbitration in Wilmington, Delaware. CLIENT EXPRESSLY WAIVES ALL RIGHTS TO A TRIAL BY JURY AND WAIVES ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.`,
    comparisonDoc: {
      title: 'CloudCorp SaaS Agreement (Client-Negotiated Redline Proposal)',
      summary: 'Balanced redline incorporating mutual indemnity, 12-month liability cap, 30-day non-renewal notice, and explicit prohibition on AI training.',
      content: `MASTER SOFTWARE-AS-A-SERVICE (SaaS) AGREEMENT (BALANCED REDLINE)

This Master Software-as-a-Service Agreement ("Agreement") is entered into as of October 1, 2026 ("Effective Date"), by and between CloudCorp Solutions Inc., a Delaware corporation ("Vendor"), and Customer ("Client").

1. SUBSCRIPTION SERVICES & SERVICE LEVELS
Vendor grants Client a non-exclusive right to access the CloudCorp Platform. Vendor shall maintain 99.9% uptime pursuant to the Service Level Agreement (SLA) attached as Exhibit A. Vendor shall not materially degrade core features during the Term.

2. FEES & PRICE ADJUSTMENTS
Subscription fees are fixed for the Initial Term. Any price adjustment upon renewal shall not exceed the Consumer Price Index (CPI) or 3% annually, whichever is lower, and requires at least sixty (60) days' advance written notice.

3. TERM AND RENEWAL
The initial term shall be twelve (12) months ("Initial Term"). Following the Initial Term, this Agreement shall renew on a month-to-month basis (or 12-month terms upon mutual written agreement), unless either party provides written notice of non-renewal at least thirty (30) days prior to the expiration of the term. Notice via email to designated billing contacts is valid.

4. TERMINATION FOR CAUSE & CONVENIENCE
Either party may terminate this Agreement immediately if the other party materially breaches and fails to cure within thirty (30) days of written notice. Either party may terminate for convenience upon sixty (60) days' written notice, with pro-rata refund of prepaid unearned fees to Client.

5. INTELLECTUAL PROPERTY & DATA PRIVACY
Client retains sole and exclusive ownership of all Client Data. Vendor shall NOT use Client Data, confidential files, or customer inputs to train, validate, or fine-tune any machine learning or artificial intelligence models without Client's express prior written consent.

6. MUTUAL LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW, EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT SHALL BE MUTUALLY CAPPED AT THE TOTAL FEES PAID OR PAYABLE BY CLIENT UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS PRECEDING THE INCIDENT. NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.

7. MUTUAL INDEMNIFICATION
(a) Vendor shall defend and indemnify Client against any third-party claim alleging that the Platform infringes any patent, copyright, or trademark.
(b) Client shall defend and indemnify Vendor against third-party claims arising from Client's unlawful use of Client Data.

8. GOVERNING LAW & VENUE
This Agreement is governed by the laws of Client's principal place of business. In the event of dispute, the prevailing party in any action or proceeding shall be entitled to recover reasonable attorney fees and costs.`
    }
  },
  {
    id: 'contractor-agreement',
    title: 'Independent Contractor Services Agreement (Agency Draft)',
    category: 'Consulting & Freelance',
    badge: 'Restrictive Covenants',
    summary: 'Consulting agreement with aggressive 2-year worldwide non-compete, net-90 payment terms, and total invention assignment covering off-duty creations.',
    content: `INDEPENDENT CONTRACTOR CONSULTING AGREEMENT

This Agreement is made between Apex Global Enterprises LLC ("Company") and Jane Doe ("Contractor").

1. SERVICES AND DELIVERABLES
Contractor agrees to perform software development services as specified in Statements of Work. Contractor shall devote whatever hours are necessary to meet Company deadlines without additional compensation.

2. COMPENSATION & EXTENDED PAYMENT TERMS
Company agrees to pay Contractor an hourly rate of $85.00. Invoices shall be submitted monthly and paid Net-90 calendar days following formal written sign-off and approval of deliverables by Company. Company reserves the right to withhold up to 25% of any invoice as a retainage reserve until 6 months after project completion.

3. BROAD INTELLECTUAL PROPERTY & INVENTIONS ASSIGNMENT
Contractor agrees that all ideas, inventions, computer software, works of authorship, and patents conceived, developed, or reduced to practice by Contractor—whether during normal business hours or on Contractor's personal time, and whether or not using Company equipment—during the entire term of this Agreement shall be the sole and exclusive property of Company ("Company Inventions"). Contractor waives all moral rights.

4. RESTRICTIVE COVENANTS & NON-COMPETITION
During the term of this Agreement and for a period of twenty-four (24) months following termination for any reason, Contractor shall NOT directly or indirectly, anywhere in the world, engage in, consult for, work with, or invest in any business, client, or enterprise that competes with Company or any of Company's existing or prospective clients.

5. NON-SOLICITATION
For thirty-six (36) months post-termination, Contractor shall not solicit, contact, or entice away any employee, client, vendor, or affiliate of Company.

6. TERMINATION
Company may terminate this Agreement immediately at any time with or without cause. Contractor may terminate only upon sixty (60) days' advance written notice. Upon termination, Company owes no further payment for work in progress not formally approved.

7. INDEMNITY
Contractor shall defend, indemnify, and hold Company harmless against any losses, tax liabilities, worker misclassification claims, or damages arising out of Contractor's performance. Contractor carries sole responsibility for all federal, state, and local taxes.`,
    comparisonDoc: {
      title: 'Independent Contractor Agreement (Freelancer Protected Version)',
      summary: 'Contractor-friendly terms with net-15 payment, assignment limited to paid project work, no non-compete clause, and fair termination.',
      content: `INDEPENDENT CONTRACTOR CONSULTING AGREEMENT (BALANCED)

This Agreement is made between Apex Global Enterprises LLC ("Company") and Jane Doe ("Contractor").

1. SERVICES AND SCHEDULE
Contractor will provide software consulting services as described in agreed Statements of Work. Contractor maintains full discretion over the manner, means, and timing of performing services.

2. COMPENSATION & NET-15 PAYMENT
Company shall pay Contractor $95.00/hour. Invoices are submitted bi-weekly and payable Net-15 days from submission date. Late payments incur a statutory interest charge of 1.5% per month. No retainage withholding shall apply.

3. SCOPE-SPECIFIC INTELLECTUAL PROPERTY ASSIGNMENT
Conditioned upon full and final payment of all corresponding fees, Contractor assigns to Company all right, title, and interest in deliverables specifically created for Company under an executed SOW. Contractor retains all rights, title, and ownership in Contractor's pre-existing IP, open source tools, frameworks, and background utilities.

4. NO UNREASONABLE RESTRAINT OF TRADE (NO NON-COMPETE)
Company acknowledges that Contractor is an independent business providing services to multiple clients. There shall be NO non-competition restriction. Contractor remains free to provide services to any other entity, provided Contractor does not disclose Company's verified confidential information.

5. NON-SOLICITATION OF DIRECT EMPLOYEES
For twelve (12) months following termination, Contractor will not intentionally solicit Company's full-time employees with whom Contractor directly worked. General job postings are exempt.

6. MUTUAL TERMINATION
Either party may terminate this Agreement or any SOW upon fourteen (14) days' written notice. Company shall compensate Contractor for all hours worked and expenses incurred up to the effective termination date.`
    }
  },
  {
    id: 'residential-lease',
    title: 'Standard Residential Apartment Lease Agreement',
    category: 'Tenancy & Housing',
    badge: 'Tenant Traps',
    summary: 'Residential lease with complete security deposit forfeiture clauses, tenant responsibility for major appliance/HVAC repairs, and automatic rent escalators.',
    content: `RESIDENTIAL APARTMENT LEASE AGREEMENT

This Agreement is made on July 1, 2026, between Oakwood Property Management ("Landlord") and John Smith ("Tenant") for Unit 4B at 120 Elm Street.

1. LEASE TERM & AUTOMATIC RENEWAL
The initial term begins August 1, 2026, and ends July 31, 2027. Unless Tenant provides written notice of intent to vacate at least ninety (90) days prior to expiration, this Lease automatically converts into a full 1-year renewal term with a mandatory 12% rent increase.

2. RENT AND LATE CHARGES
Monthly rent is $2,400.00 due on the first day of each calendar month. If rent is not received by 11:59 PM on the 2nd day of the month, Tenant shall pay a late fee of $150.00 plus $25.00 per day for each subsequent day late.

3. SECURITY DEPOSIT AND FORFEITURE
Tenant shall deposit $4,800.00 (two months' rent) as a security deposit. IF TENANT VACATES OR TERMINATES PRIOR TO THE FULL COMPLETION OF THE LEASE TERM, THE ENTIRE SECURITY DEPOSIT SHALL BE AUTOMATICALLY FORFEITED AS LIQUIDATED DAMAGES, REGARDLESS OF WHETHER LANDLORD RE-RENTS THE PREMISES. Landlord may take up to sixty (60) days post-move-out to itemize any remaining deductions.

4. MAINTENANCE, REPAIRS & HVAC SYSTEMS
Tenant agrees to maintain the premises in clean condition. Tenant is solely responsible for all maintenance, repairs, and service calls costing under $500.00. Furthermore, Tenant shall be responsible for routine servicing, filter replacement, and any compressor repairs for the central heating and air conditioning (HVAC) system regardless of cost.

5. LANDLORD ENTRY AND INSPECTIONS
Landlord and its agents may enter the apartment at any time without advance notice for inspection, maintenance, showing to prospective buyers or tenants, or any administrative purpose.

6. PROHIBITED ITEMS & STRICT RULES
No pets, musical instruments, overnight guests staying more than two (2) consecutive nights, or personal decorations hung with nails are permitted. Any violation constitutes a material breach punishable by immediate 3-day eviction notice and a $300.00 penalty per occurrence.`
  },
  {
    id: 'mutual-nda',
    title: 'Unilateral Technology Vendor Non-Disclosure Agreement',
    category: 'Confidentiality',
    badge: 'One-Sided Disclosures',
    summary: 'One-sided NDA where only the receiving party has strict confidentiality obligations with indefinite duration and unilateral attorney fee recovery.',
    content: `CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into by AlphaTech Systems Inc. ("Disclosing Party") and Prospective Partner LLC ("Receiving Party").

1. PURPOSE
The parties wish to explore a potential business collaboration relating to enterprise automation software ("Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public, proprietary information disclosed exclusively by Disclosing Party to Receiving Party, whether orally, in writing, or by inspection. Any information disclosed by Receiving Party shall NOT be treated as confidential under this Agreement.

3. OBLIGATIONS OF RECEIVING PARTY
Receiving Party agrees to: (a) hold Disclosing Party's Confidential Information in strict confidence; (b) restrict disclosure strictly to employees with a direct need-to-know; and (c) not reverse engineer, decompile, or copy any materials.

4. DURATION OF OBLIGATION
Receiving Party's obligations under this Agreement shall survive the termination of discussions and continue IN PERPETUITY (or for the maximum duration allowed by applicable law) with respect to all trade secrets and business strategies.

5. REMEDIES & UNILATERAL LEGAL FEES
Receiving Party acknowledges that any breach will cause irreparable harm. In any legal dispute arising from this Agreement, Disclosing Party shall be entitled to seek immediate injunctive relief, and Disclosing Party shall be entitled to recover all of its attorney fees and court costs from Receiving Party. Receiving Party shall not be entitled to recover attorney fees under any circumstance.`
  }
];
