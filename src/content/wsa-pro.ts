// content/wsa-pro.ts
// Website Development and Service Agreement for the ALTAVENTURES ₱2,099
// Website Plan: full text as supplied by the client, plus the coordinate map
// used to overlay signed values onto the generated PDF. Keep this in sync
// with public/documents/pro-website-service-agreement.pdf.
//
// The PDF itself is generated from this exact content by
// scripts/generate-wsa-pro-pdf.ts. If this content changes again, re-run
// that script (it also prints the field coordinates below) rather than
// hand-editing the PDF.
//
// Unlike the Free Website Service Agreement (content/wsa.ts), this document
// contains real, fixed prices (₱599 initial development, ₱1,500 domain and
// hosting, ₱2,099 total first year, ₱1,500/year renewal) baked directly into
// its own Section 7 and Section 8. Those figures are reproduced here exactly
// as supplied and must not be genericized away.

import { WSA_ALTA_SIGNER, type WsaBlock, type WsaSection } from "./wsa";

export type { WsaBlock, WsaSection };

const p = (text: string): WsaBlock => ({ kind: "p", text });
const sh = (text: string): WsaBlock => ({ kind: "sh", text });
const ul = (items: string[]): WsaBlock => ({ kind: "ul", items });
const table = (headers: string[], rows: string[][]): WsaBlock => ({ kind: "table", headers, rows });

export const WSA_PRO_DOCUMENT: {
  title: string;
  planLabel: string;
  entity: string;
  providerAddress: string;
  intro: WsaBlock[];
  clientInfoFields: string[];
  sections: WsaSection[];
  projectDetailsFields: string[];
} = {
  title: "Website Development and Service Agreement",
  planLabel: "ALTAVENTURES | ₱2,099 Website Plan",
  entity: "ALTAVENTURES",
  providerAddress: "Blk 43 Lt 32 Ph2, Zephaniah St, Santa Barbara Villas",
  intro: [
    p(
      'This Website Development and Service Agreement ("Agreement") is entered into by and between ALTAVENTURES, the Service Provider, and the Client identified below. Collectively referred to as the "Parties."'
    ),
  ],
  clientInfoFields: ["Full Name / Business Name", "Business Address", "Email Address", "Contact Number"],
  sections: [
    {
      heading: "1. Purpose of the Agreement",
      blocks: [
        p(
          "The Service Provider agrees to design, develop, configure, and launch a professional business website for the Client under the ₱2,099 Website Plan, subject to the terms and conditions of this Agreement."
        ),
        p(
          "The purpose of the website is to help the Client establish an online presence, present business information, showcase products or services, and make it easier for potential customers to contact the business."
        ),
      ],
    },
    {
      heading: "2. Package Inclusions",
      blocks: [
        p("The ₱2,099 Website Plan includes the following:"),
        ul([
          "Professional website design.",
          "Mobile-responsive website layout.",
          "Custom pages and sections appropriate to the agreed website scope.",
          "Products and services showcase.",
          "Business information and contact details.",
          "Social media links or integration through standard links.",
          "One custom domain registration for one year, subject to availability and eligibility.",
          "Managed website hosting for one year.",
          "SSL certificate configuration, where supported by the hosting environment.",
          "Website deployment and launch.",
          "Self-edit website control panel for supported content management.",
          "Standard technical support and basic website maintenance during the covered service period.",
        ]),
        p(
          "The website's structure, pages, features, and content management capabilities will be based on the Client's requirements, the agreed scope, and the capabilities of the selected website platform."
        ),
        sh("2.1 Self-Edit Control Panel"),
        p(
          "The Client will receive access to the website's control panel for supported editing functions, which may include updating product or service information, prices, text, images, and other content made available by the system."
        ),
        p("The following conditions apply:"),
        ul([
          "The control panel only supports the editing functions specifically implemented for the website.",
          "It does not automatically include source-code access, database administration, unrestricted website redesign tools, or the ability to change the website's structure and functionality.",
          "The Client is responsible for keeping login credentials confidential and managing access granted to its staff.",
          "The Service Provider may assist with access recovery and technical issues within the scope of standard support.",
        ]),
        p("Any additional editing capabilities or system functions not included in the agreed scope may be quoted separately."),
      ],
    },
    {
      heading: "3. Project Scope and Exclusions",
      blocks: [
        p("The final website scope will be confirmed during the requirements discussion before development proceeds."),
        p("Unless specifically agreed to in writing, this package does not include:"),
        ul([
          "Full e-commerce checkout or online payment processing.",
          "Automated booking, appointment management, or reservation systems.",
          "Customer accounts, membership portals, or client dashboards.",
          "CRM, inventory management, accounting, payroll, or other business management systems.",
          "Custom databases, complex automations, or third-party API integrations.",
          "Paid plugins, premium software subscriptions, premium stock assets, or other third-party charges.",
          "Professional copywriting, photography, video production, or extensive data entry.",
          "Additional domains, premium domain names, or multiple websites.",
          "Ongoing advertising, SEO campaigns, social media management, or guaranteed search rankings.",
          "Features or services not expressly included in this Agreement.",
        ]),
        p(
          "If a requested feature exceeds the package scope, the Service Provider will explain the additional requirements and provide a separate quotation. No additional chargeable work will proceed without the Client's approval."
        ),
      ],
    },
    {
      heading: "4. Project Timeline",
      blocks: [
        p("The estimated delivery period is three (3) to seven (7) business days, subject to the following conditions:"),
        ul([
          "The Client has completed the requirements questionnaire or provided the necessary project information.",
          "The Client has submitted the required text, images, logo, business details, and other materials.",
          "Payment has been successfully verified.",
          "The agreed project scope is sufficiently clear to begin development.",
        ]),
        p(
          "The delivery period may be extended if the Client delays providing information, requests significant changes, or if circumstances outside the Service Provider's reasonable control affect development or deployment."
        ),
        p("The Service Provider will communicate material delays to the Client when reasonably practicable."),
      ],
    },
    {
      heading: "5. Client Responsibilities",
      blocks: [
        p("The Client agrees to:"),
        ul([
          "Provide accurate business information, contact details, prices, descriptions, and other required content.",
          "Ensure that submitted content, images, logos, and other materials may lawfully be used on the website.",
          "Review the website preview and provide clear, consolidated feedback within a reasonable period.",
          "Check the website's content, pricing, contact information, links, and other business details before approving launch.",
          "Keep control panel credentials secure and notify the Service Provider of suspected unauthorized access.",
          "Maintain accurate domain registration and renewal contact information where applicable.",
          "Ensure that products, services, claims, licenses, permits, and business activities comply with applicable laws and regulations.",
        ]),
        p("The Service Provider is not responsible for errors arising from inaccurate or incomplete information supplied or approved by the Client."),
      ],
    },
    {
      heading: "6. Revisions and Additional Requests",
      blocks: [
        p("The package includes reasonable revisions necessary to align the website with the requirements and scope agreed upon before development."),
        p("The following are generally treated as additional work and may require a separate quotation:"),
        ul([
          "Changing the approved direction or overall design after substantial development.",
          "Adding new pages, major sections, or functionality beyond the agreed scope.",
          "Rebuilding completed portions because of a change in business requirements.",
          "Integrating new third-party services or systems.",
          "Making substantial changes after the Client has approved the final website.",
        ]),
        p("The Service Provider will notify the Client before proceeding with chargeable additional work. The Client's approval of the quotation will be required before such work begins."),
        p("Minor corrections of implementation errors attributable to the Service Provider will be addressed without an additional development fee during the applicable project review period."),
      ],
    },
    {
      heading: "7. Payment Terms",
      blocks: [
        p("The total first-year package price is ₱2,099.00, broken down as follows:"),
        table(
          ["Description", "Amount"],
          [
            ["Initial website development", "₱599.00"],
            ["Custom domain and managed hosting for the first year", "₱1,500.00"],
            ["Total due for the first year", "₱2,099.00"],
          ]
        ),
        p("Development and deployment are subject to successful payment verification."),
        p("Any additional work, premium domain charges, third-party fees, or services outside the agreed package will be quoted separately and require the Client's approval."),
        p("The Client should retain the payment confirmation and the order or transaction reference for future inquiries."),
      ],
    },
    {
      heading: "8. Domain, Hosting, and Renewal",
      blocks: [
        p("The package includes one year of custom domain and managed hosting services beginning from the applicable service activation date."),
        p("After the first year, the renewal price is ₱1,500.00 per year, subject to the continued availability of the package and any changes communicated to the Client before renewal."),
        p("The renewal covers the custom domain and managed hosting services specified in this package. Any additional services or third-party costs not covered by the package will be disclosed separately."),
        p("The following conditions apply:"),
        ul([
          "Domain registration is subject to availability, registrar policies, and applicable registration requirements.",
          "Premium, reserved, restricted, or unusually expensive domain names may require an additional payment.",
          "The Client is responsible for renewing the service on time and providing accurate renewal contact information.",
          "If renewal is not paid by the applicable deadline, the website or domain may be suspended, expire, or become unavailable.",
          "The Service Provider is not responsible for domain loss resulting from the Client's failure to provide required information or complete renewal payments on time.",
          "The Service Provider will provide reasonable notice of upcoming renewal deadlines when contact information and operational circumstances permit.",
        ]),
        p(
          "Where technically and contractually possible, the domain will be registered for the Client's benefit. The Parties will cooperate on domain transfer or account access arrangements, subject to registrar policies, outstanding payments, and applicable third-party terms."
        ),
        p("The ₱1,500 annual renewal does not automatically include new website development, redesigns, new features, or unlimited content editing by the Service Provider."),
      ],
    },
    {
      heading: "9. Shared Infrastructure and Optional Independent Infrastructure",
      blocks: [
        p(
          "The Client acknowledges that the website and its associated services may be hosted and operated using shared infrastructure managed by ALTAVENTURES or its third-party service providers. Shared infrastructure may include hosting resources, server environments, databases, storage, and other technical services used to operate multiple websites or applications."
        ),
        p("The Service Provider will manage the shared infrastructure in a manner intended to support the normal operation of the Client's website within the resources allocated to the selected package."),
        p("Should the Client require greater isolation, dedicated resources, a separate hosting environment, or other infrastructure arrangements, the Client may request an independent infrastructure setup, subject to technical feasibility and availability."),
        p("Independent infrastructure may involve additional setup fees, hosting charges, maintenance costs, third-party service fees, and other recurring expenses. These costs will be communicated to the Client for approval before implementation."),
        p(
          "The Client acknowledges that shared infrastructure and independent infrastructure may differ in cost, configuration, performance characteristics, resource availability, maintenance requirements, and level of isolation. Independent infrastructure does not automatically guarantee uninterrupted service, immunity from security incidents, or any specific level of performance unless expressly agreed upon in writing."
        ),
      ],
    },
    {
      heading: "10. System Design, Resource Allocation, and Scalability",
      blocks: [
        p(
          "The website and any included control panel or related functionality under this package are designed as a lightweight solution intended for the normal requirements of a small business website. The package is not intended to provide unlimited computing resources, storage, traffic capacity, database usage, or application processing."
        ),
        p("The Service Provider may establish reasonable resource allocations and usage limits based on the selected package, hosting environment, technical requirements, and applicable third-party provider policies."),
        p(
          "If the Client's website or system consistently exceeds its allocated resources, generates unusually high traffic or processing demands, or requires infrastructure beyond what the package can reasonably support, the Service Provider may recommend or require an upgrade to a suitable package or infrastructure arrangement."
        ),
        p("Where practicable, the Service Provider will inform the Client of the issue, explain the reason for the proposed upgrade, and provide the applicable pricing or available options before proceeding."),
        p(
          "No additional upgrade fees will be imposed without the Client's approval. If the Client declines a necessary upgrade, the Service Provider may, where reasonably necessary and permitted by applicable law, implement proportionate measures to protect the stability, security, and availability of the shared infrastructure. Such measures may include temporary rate limits, restrictions on resource-intensive functions, or temporary suspension of affected services where less restrictive measures are insufficient."
        ),
        p("The Service Provider will make reasonable efforts to notify the Client before implementing material restrictions, except where immediate action is reasonably necessary to address a security threat, service disruption, or risk to other users of the infrastructure."),
        p("Any upgrade, additional resource allocation, or migration to independent infrastructure will be subject to the applicable quotation, revised service terms where necessary, and the Client's approval."),
      ],
    },
    {
      heading: "11. Upgrades and Additional Services",
      blocks: [
        p(
          "Should the Client wish to upgrade the existing website package or avail of additional services, features, or functionalities outside the scope of this Agreement, the Client may review the available plans, services, and pricing at:"
        ),
        p("https://www.altasme.com/pricing"),
        p("All upgrades and additional services are subject to availability, technical feasibility, and the applicable terms and pricing."),
        p(
          "Any additional fees will be communicated to the Client for approval before work begins. No upgrade or additional service shall be considered included in the original package unless expressly stated in writing and agreed upon by both Parties."
        ),
        p(
          "The Service Provider will not proceed with chargeable upgrades or additional work without the Client's prior approval. Any applicable changes to subscription fees, renewal charges, project timelines, or service terms will be communicated to the Client before the upgrade is confirmed."
        ),
        p("The Client may contact ALTAVENTURES directly for clarification regarding available packages, upgrade options, or custom development requirements."),
      ],
    },
    {
      heading: "12. Website Maintenance and Technical Support",
      blocks: [
        p("Standard technical support and basic maintenance are included during the covered service period."),
        p("Support generally covers issues relating to the website's existing configuration, access to the supported control panel, and reasonable troubleshooting of covered hosting or website problems."),
        p("The following are outside standard support unless separately agreed:"),
        ul([
          "New features or major design changes.",
          "Client-requested content updates performed by the Service Provider.",
          "Problems caused by unauthorized modifications, misuse, or compromised Client credentials.",
          "Failures or policy changes affecting third-party services outside the Service Provider's control.",
          "Recovery from incidents where no usable backup exists.",
          "Emergency work or services requiring additional third-party charges.",
        ]),
        p("Support is provided on a reasonable-efforts basis. The Service Provider does not guarantee uninterrupted availability or a specific response or resolution time unless expressly agreed in writing."),
      ],
    },
    {
      heading: "13. Ownership and Intellectual Property",
      blocks: [
        p("Upon full payment of all applicable fees, the Client may use the completed website for its business, subject to this Agreement and any applicable third-party licenses."),
        p("The Client retains ownership of its original business content, logos, photographs, and other materials that it owns or is authorized to use."),
        p(
          "The Service Provider retains ownership of its pre-existing code, reusable components, templates, development methods, tools, and general know-how. Unless otherwise agreed in writing, the package does not include the transfer of exclusive ownership of the Service Provider's underlying reusable systems or source code."
        ),
        p("Third-party software, fonts, plugins, libraries, and services remain subject to their respective licenses and terms."),
        p("The Client may not claim ownership of materials belonging to third parties or use the website in a way that violates applicable intellectual property rights."),
      ],
    },
    {
      heading: "14. Privacy and Security",
      blocks: [
        p("Each Party agrees to handle personal information in accordance with applicable Philippine data privacy laws and regulations."),
        p("The Client is responsible for ensuring that its website content, collection of customer information, privacy notices, consent mechanisms, and business practices meet its applicable legal obligations."),
        p("The Service Provider will take reasonable steps to protect website access and configure the included hosting and security features appropriately. However, no website or online service can be guaranteed completely secure against all threats."),
        p("The Client must promptly notify the Service Provider if it suspects unauthorized access to its website or control panel."),
        p("Neither Party should share passwords, payment credentials, or other sensitive information through unsecured channels."),
      ],
    },
    {
      heading: "15. Backups and Third-Party Services",
      blocks: [
        p("The availability of backups, restoration points, and recovery options depends on the hosting environment and the services specifically included in the package."),
        p("Unless a separate written backup arrangement is agreed upon, the Service Provider does not guarantee a particular backup frequency, retention period, or recovery time."),
        p(
          "The website may rely on third-party domain registrars, hosting infrastructure, software, or other services. The Service Provider is not responsible for outages, discontinuation, policy changes, or failures caused by those third parties, but will make reasonable efforts to assist with covered technical issues."
        ),
      ],
    },
    {
      heading: "16. Website Review and Acceptance",
      blocks: [
        p("The Service Provider will provide the Client with a website preview or review opportunity before final launch, where applicable to the deployment process."),
        p("The Client should review the website for accuracy, including business details, product and service information, pricing, links, and contact channels."),
        p("The Client's written approval, including approval through email or an agreed messaging channel, will serve as confirmation that the website is ready for launch."),
        p("If the Client identifies an implementation error or a discrepancy from the agreed scope, the Client should describe the issue clearly so it can be assessed and corrected."),
        p("Approval does not waive the Client's rights regarding defects or obligations that cannot lawfully be excluded under applicable law."),
      ],
    },
    {
      heading: "17. Cancellation and Refunds",
      blocks: [
        p("If the Client wishes to cancel the project, the Client should notify the Service Provider in writing."),
        p("The Parties will discuss any amount properly refundable, taking into account work already performed, domain registration, hosting activation, third-party charges, and applicable law."),
        p(
          "Fees for services already performed or third-party expenses already incurred may be non-refundable to the extent permitted by law. Any refund determination must account for applicable consumer protection requirements and the specific circumstances of the cancellation."
        ),
        p("If the Service Provider is unable to deliver the agreed core service and the issue cannot reasonably be resolved, the Parties will discuss an appropriate remedy, including a refund where required by law or otherwise agreed in writing."),
        p("Nothing in this Agreement removes any rights or remedies that cannot lawfully be waived."),
      ],
    },
    {
      heading: "18. Limitation of Responsibility",
      blocks: [
        p("The Service Provider will exercise reasonable care in delivering the agreed website services."),
        p("The Service Provider does not guarantee a specific number of visitors, inquiries, sales, leads, search rankings, revenue, or business results from the website."),
        p(
          "To the extent permitted by law, the Service Provider is not responsible for indirect losses arising from the Client's use of the website, third-party service interruptions, inaccurate information supplied by the Client, or unauthorized access resulting from the Client's failure to secure its credentials."
        ),
        p("Nothing in this section excludes liability that cannot legally be excluded, including applicable statutory rights and remedies."),
      ],
    },
    {
      heading: "19. Suspension or Termination",
      blocks: [
        p("The Service Provider may suspend affected services after providing reasonable notice if:"),
        ul([
          "Required renewal or additional approved charges remain unpaid.",
          "The website is used for unlawful activity or to infringe third-party rights.",
          "The Client's actions create a material security risk to the website or hosting environment.",
          "A hosting provider or domain registrar requires suspension under its applicable policies.",
        ]),
        p("Where reasonably possible, the Service Provider will notify the Client and allow an opportunity to resolve the issue before suspension."),
        p("Termination does not remove outstanding payment obligations or rights and remedies that have already accrued."),
      ],
    },
    {
      heading: "20. Communication and Approvals",
      blocks: [
        p("The Parties may communicate through the email addresses, contact numbers, or messaging channels designated during project onboarding."),
        p("Written approvals and confirmations exchanged through these channels may be relied upon as project records, subject to applicable law."),
        p("The Client should keep copies of important approvals, change requests, payment references, and renewal notices."),
      ],
    },
    {
      heading: "21. Dispute Resolution and Governing Law",
      blocks: [
        p("This Agreement is governed by the laws of the Republic of the Philippines."),
        p("The Parties will first attempt to resolve any disagreement through good-faith discussion. If the dispute cannot be resolved informally, either Party may pursue the remedies available under applicable Philippine law before the appropriate forum."),
        p("Nothing in this section prevents either Party from exercising rights or remedies available under mandatory law."),
      ],
    },
    {
      heading: "22. Entire Agreement and Amendments",
      blocks: [
        p("This Agreement, together with the written project scope and any approved quotations, represents the understanding between the Parties regarding the services covered herein."),
        p("Any material amendment, additional service, or change to the agreed scope must be documented and approved by both Parties in writing."),
        p("If any provision is held unenforceable, the remaining provisions will continue to apply to the extent permitted by law."),
      ],
    },
    {
      heading: "23. Portfolio and Promotional Use",
      blocks: [
        p(
          "The Client acknowledges and agrees that ALTAVENTURES may showcase the completed website or project as part of its professional portfolio and use publicly available, non-confidential portions of the project for marketing and promotional purposes."
        ),
        p("This may include, but is not limited to:"),
        ul([
          "Displaying screenshots, previews, or recordings of the completed website on the ALTAVENTURES website, portfolio, and other promotional materials.",
          "Publishing the completed project or website launch announcement on ALTAVENTURES' social media pages, including Facebook and other applicable platforms.",
          "Identifying the Client's business name, website URL, and publicly displayed business logo for the purpose of presenting the project as part of ALTAVENTURES' previous work.",
          "Sharing publicly available website features, design elements, and project outcomes to demonstrate ALTAVENTURES' services and capabilities.",
        ]),
        p("ALTAVENTURES will not knowingly publish the Client's confidential business information, private customer data, login credentials, or other non-public information as part of its promotional activities."),
        p(
          "The Client may notify ALTAVENTURES in writing of any reasonable confidentiality concerns or request that specific materials be excluded from promotional use. Any such request will be discussed in good faith, taking into account materials already published and any applicable legal obligations."
        ),
        p("This permission does not transfer ownership of the Client's trademarks, business materials, or other intellectual property to ALTAVENTURES. The Client retains all rights it otherwise holds in those materials."),
      ],
    },
    {
      heading: "24. Acknowledgment and Acceptance",
      blocks: [
        p("By signing below, the Parties acknowledge that they have read and understood this Agreement and agree to its terms."),
      ],
    },
  ],
  projectDetailsFields: [
    "Website / Business Name",
    "Agreed Website Scope",
    "Custom Domain Requested",
    "Project Reference Number",
    "Payment Reference Number",
    "Service Activation Date",
    "First-Year Renewal Date",
  ],
};

// ---------------------------------------------------------------------------
// Signable-field coordinates (PDF points, bottom-left origin, 0-indexed page
// numbers), on the generated PDF
// (public/documents/pro-website-service-agreement.pdf). Regenerated by
// scripts/generate-wsa-pro-pdf.ts whenever the document changes; do not
// hand-edit unless you know the exact layout changed by that amount.
// ---------------------------------------------------------------------------
export const WSA_PRO_PDF_FIELD_COORDS = {
  // Preamble "CLIENT" block, near the top of the document.
  clientInfo: {
    businessName: { page: 0, x: 72, y: 511.19928400954655, w: 133.035 },
    email: { page: 0, x: 72, y: 477.19928400954655, w: 70.602 },
    phone: { page: 0, x: 72, y: 460.19928400954655, w: 79.674 },
  },
  // "24. Acknowledgment and Acceptance" execution block. Client and
  // Altaventures sub-blocks are kept from splitting across a page break by
  // the generator, but can still land on different pages from each other.
  signing: {
    clientName: { page: 9, x: 72, y: 471.19928400954655, w: 182.658 },
    clientBusinessName: { page: 9, x: 72, y: 454.19928400954655, w: 137.3505 },
    clientDate: { page: 9, x: 72, y: 395.19928400954655, w: 25.095000000000002 },
    altaDate: { page: 9, x: 72, y: 514.1992840095465, w: 25.095000000000002 },
  },
} as const;

export const WSA_PRO_SIGNATURE_BOX = {
  page: 9,
  x: 131.859,
  y: 423.19928400954655,
  width: 150,
  height: 32,
} as const;

export const WSA_PRO_ALTA_SIGNER = WSA_ALTA_SIGNER;
