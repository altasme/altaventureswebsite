// content/postProjectServiceAgreement.ts
// ALTAVENTURES Post-Project Service Agreement: full text as supplied by the
// operator (ALTAVENTURES_Post_Project_Service_Agreement.docx), reproduced
// verbatim. This is a general, boilerplate post-project service agreement
// referenced from the public proposal-signing flow (ProposalPage.tsx) --
// distinct from a project's own approved proposal, and distinct from any
// per-client signed legal document. It is displayed read-only on its own
// page (PostProjectServiceAgreementPage.tsx); there is no signing step on
// that page itself -- acceptance happens via the checkbox on the proposal
// page that links to it.
//
// Reuses the same WsaBlock/WsaSection shape already established by
// content/wsa.ts / content/wsa-pro.ts, per this project's own convention,
// rather than inventing a fourth document model.

import { type WsaBlock, type WsaSection } from "./wsa";

export type { WsaBlock, WsaSection };

const p = (text: string): WsaBlock => ({ kind: "p", text });
const ul = (items: string[]): WsaBlock => ({ kind: "ul", items });

export const POST_PROJECT_SERVICE_AGREEMENT: {
  title: string;
  subtitle: string;
  entity: string;
  intro: WsaBlock[];
  sections: WsaSection[];
} = {
  title: "Post-Project Service Agreement",
  subtitle: "Website, Web Application, and Digital Systems Services",
  entity: "ALTAVENTURES Business Development Services",
  intro: [
    p(
      'This Service Agreement (the "Agreement") is entered into by ALTAVENTURES Business Development Services ("ALTAVENTURES" or the "Service Provider") and the client identified in the approved project proposal (the "Client"). It is provided for electronic signing after development and project handover and governs the post-project service relationship.'
    ),
  ],
  sections: [
    {
      heading: "I. Agreement Overview and Parties",
      blocks: [
        p(
          "The parties are ALTAVENTURES Business Development Services and the Client identified in the corresponding approved proposal. The proposal identifies the project, deliverables, package, service inclusions, and applicable commercial arrangements. This Agreement sets out the general terms applying after project completion."
        ),
        p(
          "The approved proposal and any written, mutually accepted amendments are incorporated by reference. If a project-specific proposal term expressly conflicts with this Agreement, the proposal controls only for that project and only to the extent of the conflict."
        ),
      ],
    },
    {
      heading: "II. Completed Project Description",
      blocks: [
        p(
          "The covered website, web application, or digital system is the project described in the approved proposal. Its name, primary domain or URL, package, and relevant project details should be recorded in the proposal or handover record. ALTAVENTURES' continuing obligations are limited to services expressly included in the proposal and this Agreement."
        ),
      ],
    },
    {
      heading: "III. Delivered Services and Project Scope",
      blocks: [
        p(
          "The deliverables and features covered are those expressly identified in the approved proposal and confirmed in the handover record. The proposal is the primary reference for project-specific inclusions, support, maintenance, hosting, backups, and renewal arrangements."
        ),
        p(
          "Any feature, integration, content change, redesign, additional page, new workflow, migration, third-party subscription, or other work not expressly included is excluded. Additional work may be assessed and quoted separately and will proceed only after the Client's written approval."
        ),
      ],
    },
    {
      heading: "IV. Client Acceptance and Handover",
      blocks: [
        p(
          "The project is considered complete upon the earliest of: (a) the Client's written or electronic acceptance; (b) ALTAVENTURES' handover of the completed deliverables and applicable administrative credentials; or (c) fourteen (14) calendar days after ALTAVENTURES notifies the Client that the deliverables are ready for review, if the Client has not provided written notice identifying specific issues or requested in-scope revisions."
        ),
        p(
          "The Client must provide clear review comments identifying the affected page, function, or process and describing the issue. Acceptance does not require ALTAVENTURES to perform work outside the approved scope. The Client is responsible for securing credentials after handover and restricting access to authorized persons."
        ),
      ],
    },
    {
      heading: "V. Warranty and Bug Fixing",
      blocks: [
        p(
          "ALTAVENTURES provides a ninety (90) calendar-day bug-fixing warranty beginning on the date of Client acceptance and handover under Section IV. During this period, ALTAVENTURES will use reasonable efforts to correct reproducible defects attributable to its implementation that cause the project to materially fail to operate in accordance with the approved proposal."
        ),
        p("The warranty covers bug fixing only. It excludes:"),
        ul([
          "new features, enhancements, additional pages, or changed business requirements;",
          "design revisions, content changes, or preferences that are not caused by a covered defect;",
          "issues caused by the Client, its users, or another developer modifying the project or configuration;",
          "misuse, unsupported devices or software, compromised credentials, or failure to follow supplied instructions;",
          "outages, changes, discontinuation, or failures of third-party platforms, APIs, hosting providers, registrars, or other services outside ALTAVENTURES' reasonable control; and",
          "issues arising from inaccurate, incomplete, unlawful, or subsequently changed Client-provided content or data.",
        ]),
        p(
          "Requests outside warranty coverage may be separately assessed and quoted. The Client should report suspected defects through the support channel identified in the proposal, with enough detail to reproduce the issue. The warranty is not a promise that the project will be free from every error or interruption."
        ),
      ],
    },
    {
      heading: "VI. Hosting, Domain, and Infrastructure",
      blocks: [
        p(
          "Unless the proposal states otherwise, the Client acknowledges that the website or system may be hosted within ALTAVENTURES' shared infrastructure. ALTAVENTURES will allocate reasonable resources intended to support normal operation, taking account of the selected package and ordinary usage."
        ),
        p(
          "If usage, traffic, storage, processing, security requirements, or other technical demands materially exceed the resources reasonably available, ALTAVENTURES may notify the Client and recommend an upgrade, optimization, or migration. Additional fees or service changes require the Client's approval before implementation, except temporary protective action reasonably necessary to address an immediate security or operational risk."
        ),
        p(
          "Dedicated or independent hosting may be arranged under a separate quotation. The Client is responsible for applicable third-party subscription, usage, licensing, and provider charges, as well as separately quoted ALTAVENTURES setup or maintenance fees."
        ),
        p(
          "Where domain management is included, the domain will be managed by ALTAVENTURES in accordance with the proposal. Registration and renewal arrangements, charges, and responsibilities follow the proposal. The Client must provide accurate registrant/contact information and promptly notify ALTAVENTURES of changes."
        ),
        p(
          "A domain transfer may be requested by the Client. Transfers are subject to registry and registrar rules, verification requirements, outstanding fees, and transfer restrictions. The proposal's stated transfer timing is 70 days from ALTAVENTURES' registration of the domain, subject to those external rules and restrictions. The Client must cooperate with required authorization steps."
        ),
      ],
    },
    {
      heading: "VII. Technical Support and Maintenance",
      blocks: [
        p(
          "Support and maintenance, if included, are limited to the inclusions expressly described in the proposal. The proposal should identify the support channel, coverage, response expectations, and package-specific limitations."
        ),
        p(
          "Unless expressly included, support does not mean unlimited on-demand development, continuous monitoring, guaranteed response or resolution times, content management, redesign, new functionality, third-party account administration, or emergency response outside stated coverage. Additional work may be separately quoted."
        ),
      ],
    },
    {
      heading: "VIII. Client Responsibilities",
      blocks: [
        p("The Client agrees to:"),
        ul([
          "provide accurate, complete, lawful, and up-to-date content, data, instructions, and contact information;",
          "ensure it owns or has permission to use all materials it supplies;",
          "use the website or system lawfully and in accordance with applicable laws, third-party terms, and the agreed purpose;",
          "protect passwords, access tokens, and administrator credentials and promptly report suspected compromise;",
          "make timely decisions, provide approvals, and respond to reasonable service requests;",
          "pay applicable renewal and third-party charges in accordance with the proposal and provider deadlines; and",
          "maintain copies of important business records and data where appropriate, particularly where backups are not included.",
        ]),
        p(
          "The Client is responsible for its business operations, products, services, transactions, customer communications, regulatory compliance, and the accuracy and legality of information published through its website or system."
        ),
      ],
    },
    {
      heading: "IX. Intellectual Property, Privacy, Confidentiality, and Data Security",
      blocks: [
        p(
          "The Client retains ownership of materials it supplies, including its business name, logos, text, photographs, and data, subject to third-party rights. The Client permits ALTAVENTURES to use those materials only as reasonably necessary to provide the agreed services."
        ),
        p(
          "Upon full payment of all amounts due for the relevant project, the Client may use the project-specific deliverables created for it for its business purposes, subject to third-party licenses and applicable platform terms. ALTAVENTURES retains ownership of pre-existing materials, reusable code, templates, libraries, methods, tools, know-how, and general-purpose components. No ownership of third-party software, services, or materials is transferred."
        ),
        p(
          "Each party will use reasonable care to protect confidential information received from the other and use it only for purposes connected with the project or services. Confidential information excludes information publicly available without breach, already lawfully known, independently developed, or lawfully received from another source without confidentiality obligations."
        ),
        p(
          "Both parties will exercise reasonable care and diligence to protect personal data and other information handled in connection with the service. The Client remains responsible for determining the lawful purposes and means of its business data processing, the content it collects, notices and consents it must provide, and access permissions of its personnel. ALTAVENTURES will handle entrusted data as reasonably necessary to provide the agreed services and in accordance with applicable law and any separately agreed data-processing terms. Neither party guarantees that an online system is immune from all incidents."
        ),
      ],
    },
    {
      heading: "X. Backups and Data Recovery",
      blocks: [
        p(
          "Backup services, frequency, retention, and restoration assistance are included only where stated in the proposal. Where backups are not expressly included, the Client is responsible for maintaining appropriate independent copies of important data and content. Included backups are a recovery measure, not a guarantee that every item can always be restored. Restoration beyond included service may be separately quoted."
        ),
      ],
    },
    {
      heading: "XI. Service Term and Renewal",
      blocks: [
        p(
          "The initial service term is one (1) year beginning on the date the Client signs or approves the project proposal, unless the proposal expressly specifies a different commencement date. This Agreement may be electronically signed after project completion and handover; signing records and governs the post-project relationship and does not reset the service commencement date."
        ),
        p(
          "After the initial term, service may be renewed in successive one-year periods under the renewal terms and fees stated in the proposal or a subsequent written renewal notice accepted by the Client. The Client must pay applicable renewal fees by the stated due date to avoid interruption. Changes in renewal pricing or scope must be communicated before taking effect."
        ),
        p(
          "If the Client does not renew or pay required renewal charges, ALTAVENTURES may suspend or discontinue the relevant hosting, domain management, or support after reasonable notice, subject to applicable law and provider/registry requirements. The Client should arrange export or transfer of data and domain management before service expiry."
        ),
      ],
    },
    {
      heading: "XII. Service Limitations and Exclusions",
      blocks: [
        p("Unless expressly stated in the proposal or a written amendment, the following are not included:"),
        ul([
          "new features, functionality, integrations, redesigns, or development after completion;",
          "guarantees of SEO rankings, search visibility, traffic, leads, sales, revenue, or business performance;",
          "third-party subscription fees, transaction fees, licenses, or provider charges;",
          "unlimited revisions, content updates, data entry, or technical support;",
          "independent hosting, infrastructure, or security services beyond the selected package;",
          "legal, tax, accounting, regulatory, or industry-specific compliance advice; and",
          "services or deliverables not expressly identified in the approved proposal or a written amendment.",
        ]),
        p(
          "The project may depend on third-party providers and internet services. ALTAVENTURES is not responsible for interruptions or changes caused by providers outside its reasonable control, but will use reasonable efforts to communicate material service impacts where practicable."
        ),
      ],
    },
    {
      heading: "XIII. Suspension and Termination",
      blocks: [
        p(
          "ALTAVENTURES may suspend affected services where it reasonably determines that the Client's or its users' use involves illegal, fraudulent, unauthorized, abusive, or unethical activity; creates a material security or operational risk; violates this Agreement or applicable third-party terms; or may expose ALTAVENTURES, its infrastructure, or other clients to material harm. Where practicable, ALTAVENTURES will give notice and an opportunity to remedy. Immediate temporary suspension may be used where reasonably necessary to address urgent risk or a legal requirement."
        ),
        p(
          "Either party may terminate the ongoing service relationship for a material breach by the other party if it is not remedied within thirty (30) calendar days after written notice, where capable of remedy. Termination may take effect sooner where required by law or where the breach cannot reasonably be remedied."
        ),
        p(
          "Upon expiry or termination, the Client remains responsible for obligations accrued up to the effective date. The parties will reasonably cooperate on return or export of Client-provided data that remains available, subject to payment of undisputed outstanding amounts, technical feasibility, third-party restrictions, and applicable law. Migration, transfer, or extraction assistance not included in the proposal may be separately quoted. ALTAVENTURES may delete or de-identify remaining Client data after a reasonable period, subject to legal retention duties and any agreed retention period."
        ),
        p(
          "ALTAVENTURES maintains a zero-tolerance approach to activity that materially risks its business, reputation, infrastructure, personnel, or other clients. This principle will be applied consistently with this Agreement and applicable law."
        ),
      ],
    },
    {
      heading: "XIV. Limitation of Liability",
      blocks: [
        p(
          "ALTAVENTURES acts as an independent service provider. Unless expressly agreed in a separate written instrument, ALTAVENTURES is not a shareholder, partner, director, employee, agent, or stakeholder in the Client's organization and does not participate in or control the Client's business decisions or operations."
        ),
        p(
          "To the extent permitted by law, ALTAVENTURES will not be liable for indirect, incidental, special, punitive, or consequential losses, including loss of profit, revenue, anticipated savings, business opportunity, goodwill, or data, arising from use or inability to use the project. This exclusion does not apply where such limitation is prohibited by law."
        ),
        p(
          "To the extent permitted by law, ALTAVENTURES' aggregate liability arising out of or in connection with the services will not exceed the fees actually paid to ALTAVENTURES for the affected service during the twelve (12) months immediately preceding the event giving rise to the claim. This does not exclude or restrict liability that cannot lawfully be excluded or limited, including liability arising from fraud or willful misconduct where applicable."
        ),
        p(
          "The Client is responsible for the legality and accuracy of its business content, products, services, transactions, and instructions, and for claims arising from its own operations or misuse of the project. Nothing makes the Client responsible for ALTAVENTURES' own obligations under applicable law."
        ),
      ],
    },
    {
      heading: "XV. Dispute Resolution and Governing Law",
      blocks: [
        p(
          "The parties will first attempt in good faith to resolve disputes through direct discussion and exchange of relevant information. If unresolved, either party may pursue remedies available under the laws of the Republic of the Philippines. This Agreement is governed by Philippine law, without prejudice to mandatory rules."
        ),
      ],
    },
    {
      heading: "XVI. General Provisions",
      blocks: [
        ul([
          "Entire agreement. This Agreement, the approved proposal, and written amendments or incorporated schedules form the entire agreement concerning post-project services.",
          "Amendments. Any amendment must be recorded in writing and accepted by both parties, including electronically.",
          "No waiver. Failure or delay in enforcing a provision does not waive the right to enforce it later.",
          "Severability. If a provision is invalid or unenforceable, the remaining provisions continue to apply to the extent lawful.",
          "Independent contractor. The parties are independent contracting parties. Nothing creates a partnership, joint venture, employment, fiduciary, or agency relationship.",
          "Assignment. Neither party may assign this Agreement in a manner materially affecting the other without prior written consent, except as part of a lawful business reorganization where the assignee assumes the relevant obligations.",
          "Notices. Notices may be sent to contact details or electronic addresses in the proposal or otherwise confirmed in writing.",
          "Survival. Provisions which by nature should continue after expiry or termination, including accrued obligations, confidentiality, intellectual property, liability, and dispute provisions, will survive.",
        ]),
      ],
    },
    {
      heading: "XVII. Electronic Agreement and Acceptance",
      blocks: [
        p(
          "The parties agree that this Agreement may be presented, accepted, and signed electronically. Each party consents to electronic signatures and records and agrees that an electronic signature or recorded electronic acceptance attributable to that party may evidence its intention to be bound, subject to applicable law. Electronic copies may be retained and treated as original records."
        ),
        p(
          "By electronically signing this Agreement, the Client confirms that it has read and understood the terms, had the opportunity to ask questions or seek independent advice, and agrees to be bound. ALTAVENTURES' authorized representative likewise confirms acceptance on behalf of the Service Provider."
        ),
      ],
    },
  ],
};
