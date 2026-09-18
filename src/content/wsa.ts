// content/wsa.ts
// Free Website Service Agreement (v4.1): full text as supplied by the client,
// plus the coordinate map used to overlay signed values onto the generated
// PDF. Keep this in sync with public/documents/free-website-service-agreement.pdf.
//
// The PDF itself is generated from this exact content by
// scripts/generate-wsa-pdf.ts. If this content changes again, re-run that
// script (it also prints the field coordinates below) rather than hand-editing
// the PDF.

export type WsaBlock =
  | { kind: "p"; text: string }
  | { kind: "sh"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "table"; headers: string[]; rows: string[][] };

export type WsaSection = { heading: string; blocks: WsaBlock[] };

const p = (text: string): WsaBlock => ({ kind: "p", text });
const sh = (text: string): WsaBlock => ({ kind: "sh", text });
const ul = (items: string[]): WsaBlock => ({ kind: "ul", items });

export const WSA_DOCUMENT: {
  title: string;
  version: string;
  entity: string;
  intro: WsaBlock[];
  sections: WsaSection[];
} = {
  title: "Free Website Service Agreement",
  version: "4.1",
  entity: "Altaventures Business Development Services",
  intro: [
    p(
      'This Free Website Service Agreement ("Agreement") is entered into between Altaventures Business Development Services, a DTI and BIR Registered business, with business address at Blk 43 Lt 32 Ph 2, Santa Barbara Villas 2, Brgy. Silangan, San Mateo, Rizal ("Altaventures," "we," "us," or "our"), and the Client identified below ("Client," "you," or "your").'
    ),
    p('Altaventures and the Client are collectively referred to as the "Parties."'),
  ],
  sections: [
    {
      heading: "1. Client Information",
      blocks: [
        ul([
          "Business Name",
          "Owner / Authorized Representative",
          "Position / Capacity",
          "Business Address",
          "Email",
          "Contact Number",
          "Website / Domain",
        ]),
      ],
    },
    {
      heading: "2. Purpose of the Agreement",
      blocks: [
        p("Altaventures is providing the Client with a professional website under its Free Website Service."),
        p(
          "The Client will not be charged a recurring monthly or annual website service fee for the services specifically included under this Agreement."
        ),
        p(
          "The purpose of the Free Website Service is to provide the Client with a professional online presence while allowing the Client to explore additional website and digital business services offered by Altaventures."
        ),
        p(
          '"Free" applies only to the services expressly included in this Agreement. It does not mean that all future website changes, maintenance, development, third-party services, or additional functionality will be provided free of charge.'
        ),
        p("Services not expressly included in this Agreement may be subject to separate fees."),
      ],
    },
    {
      heading: "3. What Is Included",
      blocks: [
        p("The Free Website Service includes:"),
        ul([
          "Professional website",
          "Website hosting",
          "SSL",
          "Initial website setup and deployment",
          "The website, pages, sections, content, design, and functionality delivered to the Client as of the date of this Agreement",
          "Fourteen (14) calendar day revision period",
          "Ninety (90) calendar day bug warranty for genuine bugs in the delivered website",
        ]),
        p("The Free Website Service does not include an ongoing monthly or annual website service fee."),
      ],
    },
    {
      heading: "4. What Is Not Included",
      blocks: [
        p("Unless specifically agreed in writing, the Free Website Service does not include:"),
        ul([
          "Custom domain registration or renewal",
          "Client Admin Panel",
          "Product and price management",
          "Order management",
          "Database functionality",
          "Business Email",
          "Ongoing website maintenance",
          "Ongoing website updates",
          "SEO, GEO, or AEO services",
          "New features or systems",
          "Booking or appointment systems",
          "Payment integrations",
          "CRM integrations",
          "Major redesigns",
          "Major restructuring",
          "Additional development outside the delivered website",
          "Full-scale website transfer",
          "Other services not expressly included in this Agreement",
        ]),
        p("Additional services may be purchased separately through PAYG services, a project quotation, a paid Digital Growth Plan, or another agreement."),
      ],
    },
    {
      heading: "5. Initial Website Scope",
      blocks: [
        p(
          "For purposes of this Agreement, the Initial Website Scope consists of the website, pages, sections, content, design, functionality, and other deliverables that have been completed and delivered to the Client as of the date this Agreement is signed."
        ),
        p(
          "By signing this Agreement, the Client acknowledges that it has received and reviewed the website being provided under the Free Website Service and accepts the delivered website as the Initial Website Scope, subject to the fourteen (14) calendar day revision period and ninety (90) calendar day bug warranty provided under this Agreement."
        ),
        p("The website delivered at the time of signing establishes the baseline for determining what constitutes:"),
        ul(["An included revision", "A covered bug", "A new request", "Additional development"]),
        p(
          "Any request that introduces functionality, pages, sections, systems, integrations, design concepts, or other work that was not part of the website delivered at the time of signing may be treated as an additional service."
        ),
      ],
    },
    {
      heading: "6. Client Responsibilities",
      blocks: [
        p("The Client is responsible for providing accurate and usable information and materials required for the website."),
        p("This may include:"),
        ul([
          "Business information",
          "Logo and branding",
          "Photos and videos",
          "Product or service information",
          "Prices",
          "Contact information",
          "Business hours",
          "Social media links",
          "Policies",
          "Other content required for the website",
        ]),
        p("The Client represents that it has the right to use any materials provided to Altaventures."),
        p("The Client remains responsible for the accuracy and legality of its content, products, services, claims, pricing, policies, and business information."),
      ],
    },
    {
      heading: "7. Website Review and Acceptance",
      blocks: [
        p("The Client acknowledges that the website covered by this Agreement has been delivered for review and acceptance."),
        p("By signing this Agreement, the Client confirms that it has had the opportunity to review the delivered website."),
        p("The Client should check the website for accuracy, including:"),
        ul([
          "Business information",
          "Contact details",
          "Products and services",
          "Prices",
          "Images",
          "Links",
          "Business hours",
          "Other customer-facing information",
        ]),
        p(
          "The Client's signature or electronic acceptance of this Agreement constitutes acknowledgment and acceptance of the delivered website as the Initial Website Scope, subject to the revision period and bug warranty provided in this Agreement."
        ),
      ],
    },
    {
      heading: "8. 14-Day Revision Period",
      blocks: [
        p(
          "The Client receives fourteen (14) calendar days from the date the website is delivered to request reasonable revisions and changes to the Initial Website Scope."
        ),
        p(
          "The revision period covers reasonable changes to the website as delivered, provided that the requested changes remain within the existing scope and functionality of the delivered website."
        ),
        p("Examples include:"),
        ul([
          "Text corrections",
          "Photo replacements",
          "Minor content changes",
          "Corrections to business information",
          "Adjustments to existing sections",
          "Minor design adjustments",
          "Minor layout adjustments",
        ]),
        p("The Client should submit revision requests within the fourteen (14) calendar day period."),
        p("Where practical, the Client should consolidate its requested revisions into a clear list."),
      ],
    },
    {
      heading: "9. Limitations of the Revision Period",
      blocks: [
        p("The fourteen (14) day revision period does not provide unlimited free development."),
        p("The revision period is intended for reasonable changes to the delivered website within its existing scope."),
        p("The following may be considered additional services:"),
        ul([
          "New pages",
          "New sections",
          "New functionality",
          "New systems",
          "New integrations",
          "Booking systems",
          "Appointment systems",
          "Ordering systems",
          "Payment integrations",
          "CRM integrations",
          "Major redesigns",
          "Major restructuring",
          "Significant changes to the original design direction",
          "Substantial changes to the delivered website",
          "Other work requiring additional development",
        ]),
        p("Such requests may be subject to PAYG pricing, a separate project quotation, a paid plan, or another agreement."),
      ],
    },
    {
      heading: "10. Expiration of the Revision Period",
      blocks: [
        p("The fourteen (14) calendar day revision period expires automatically at the end of the applicable period."),
        p("After the revision period expires, the website will be considered finalized for purposes of the Free Website Service."),
        p("Requests submitted after the revision period may be subject to applicable PAYG rates or a separate quotation."),
        p("The expiration of the revision period does not affect the ninety (90) calendar day bug warranty."),
      ],
    },
    {
      heading: "11. 90-Day Bug Warranty",
      blocks: [
        p("The Free Website Service includes a ninety (90) calendar day warranty for genuine bugs in the delivered website."),
        p("The warranty begins on the date the website is delivered to the Client."),
        p(
          "During the ninety (90) calendar day warranty period, Altaventures will correct genuine technical bugs in the website delivered under this Agreement at no additional service charge."
        ),
        p("A covered bug is a technical defect where:"),
        ul([
          "The affected functionality exists in the website delivered to the Client;",
          "The functionality was intended to operate as delivered;",
          "It does not operate substantially as intended; and",
          "The issue is attributable to the website implementation by Altaventures.",
        ]),
        p("Where an issue qualifies as a covered bug, Altaventures will use reasonable efforts to correct it."),
      ],
    },
    {
      heading: "12. What the Bug Warranty Does Not Cover",
      blocks: [
        p("The ninety (90) day bug warranty does not cover:"),
        ul([
          "New features",
          "New functionality",
          "New pages",
          "New sections",
          "Design changes",
          "Content changes",
          "Client-requested changes",
          "Changes made by the Client",
          "Changes made by another developer",
          "Unauthorized modifications",
          "Incorrect Client information",
          "Client-provided content",
          "Third-party service issues",
          "Hosting provider issues outside Altaventures' reasonable control",
          "Domain provider issues",
          "Third-party plugins or software",
          "External API changes",
          "Issues caused by misuse",
          "Issues caused by compromised credentials",
          "Issues caused by changes to third-party infrastructure",
          "Other circumstances outside Altaventures' reasonable control",
        ]),
        p("Altaventures may nevertheless review such issues and offer a separately priced solution where appropriate."),
      ],
    },
    {
      heading: "13. Revision vs. Bug",
      blocks: [
        p("For clarity, a revision and a bug are different."),
        sh("Revision"),
        p("A revision is a change the Client wants made to the website."),
        p("Example: \"Please change the button text from 'Contact Us' to 'Book Now.'\" This is a revision."),
        sh("Bug"),
        p("A bug is a technical problem where something that was supposed to work does not work."),
        p('Example: "The Contact Us button was supposed to open the contact form, but clicking it does nothing." This may be a bug.'),
        p(
          "Altaventures will reasonably determine whether a request is a revision, bug, new functionality, or additional project based on the Initial Website Scope and the nature of the requested work."
        ),
      ],
    },
    {
      heading: "14. Warranty Does Not Mean Unlimited Maintenance",
      blocks: [
        p("The ninety (90) day warranty does not provide unlimited free website maintenance or development."),
        p("The warranty is limited to genuine bugs in the delivered website."),
        p("It does not include:"),
        ul([
          "Content updates",
          "Design changes",
          "New functionality",
          "New pages",
          "New sections",
          "SEO",
          "GEO",
          "AEO",
          "Performance optimization",
          "System improvements",
          "New integrations",
          "Ongoing maintenance",
          "Other development work",
        ]),
        p(
          "After the warranty period expires, technical issues may be handled through an applicable PAYG service, paid Digital Growth Plan, project quotation, or separate service agreement."
        ),
      ],
    },
    {
      heading: "15. Reporting a Bug",
      blocks: [
        p("The Client should report suspected bugs through an approved Altaventures communication channel."),
        p("The Client should provide sufficient information for Altaventures to investigate the issue."),
        p("This may include:"),
        ul([
          "Description of the issue",
          "Page or feature affected",
          "Steps to reproduce the issue",
          "Screenshots",
          "Screen recordings",
          "Relevant device or browser information",
          "Other information reasonably required for investigation",
        ]),
        p("Altaventures may request additional information before determining whether the issue qualifies under the warranty."),
      ],
    },
    {
      heading: "16. Warranty Remedy",
      blocks: [
        p("Where Altaventures determines that an issue qualifies as a covered bug, Altaventures will use reasonable efforts to correct the affected functionality."),
        p("The warranty remedy is limited to correcting the covered website defect."),
        p("The warranty does not entitle the Client to:"),
        ul([
          "A refund",
          "New features",
          "Additional free pages",
          "A redesign",
          "New functionality",
          "Compensation for lost sales",
          "Compensation for lost revenue",
          "Compensation for business interruption",
          "Other unrelated services",
        ]),
      ],
    },
    {
      heading: "17. Services After the Revision and Warranty Period",
      blocks: [
        p(
          "Once the fourteen (14) day revision period and ninety (90) day bug warranty have expired, the Free Website Service does not include ongoing free maintenance or development."
        ),
        p("Future requests may be handled through:"),
        ul(["PAYG services", "A website project", "A paid Digital Growth Plan", "A separate service agreement", "Another mutually agreed arrangement"]),
        p("The expiration of these periods does not automatically terminate the Client's right to use the website while the Free Website Service remains active."),
      ],
    },
    {
      heading: "18. Current Pay-As-You-Go Services",
      blocks: [
        p("The current standard PAYG services are:"),
        ul([
          "Domain Transfer Out",
          "Small Website Change",
          "Website Update / Section",
          "Website Project",
          "Full-Scale Transfer Out",
          "Major Project (subject to quotation)",
          "Altaventures Hosted Business Email",
        ]),
        p("PAYG services are priced at Altaventures' then-current published rates, which are subject to change without prior notice."),
        p("The price applicable to an approved service will be the applicable published rate at the time of purchase or the price stated in an accepted quotation."),
      ],
    },
    {
      heading: "19. Domain, Hosting and SSL",
      blocks: [
        sh("Custom Domain"),
        p("A custom domain is not included in the Free Website Service."),
        p("The Client is responsible for domain registration, renewal, and registrar fees."),
        p("Altaventures may assist with connecting the Client's domain to the website where technically possible."),
        sh("Hosting"),
        p("Website hosting is included in the Free Website Service while the service remains active."),
        sh("SSL"),
        p("SSL is included in the Free Website Service where supported by the applicable hosting infrastructure."),
        p("Altaventures does not guarantee uninterrupted website availability."),
      ],
    },
    {
      heading: "20. Third-Party Services",
      blocks: [
        p("Altaventures may use third-party providers for hosting, security, infrastructure, APIs, or other technical services."),
        p("Third-party providers may experience:"),
        ul(["Outages", "Service interruptions", "Pricing changes", "Policy changes", "Technical changes", "Service limitations", "Service discontinuation"]),
        p(
          "Altaventures will use reasonable efforts to maintain the website but is not responsible for service failures caused solely by third parties or circumstances outside its reasonable control."
        ),
      ],
    },
    {
      heading: "21. Future Paid Plans and Additional Services",
      blocks: [
        p("The Client may choose to upgrade to an applicable paid Digital Growth Plan or purchase additional services from Altaventures."),
        p("Current paid Digital Growth Plans include:"),
        ul(["Essential", "Business", "Growth"]),
        p(
          "Digital Growth Plans are generally annual service plans, priced at Altaventures' then-current published rates at the time of upgrade."
        ),
        p("Paid plans may provide additional services such as:"),
        ul([
          "Client Admin Panel",
          "Product and price management",
          "Order management",
          "Database",
          "Business Email and Notifications",
          "Technical maintenance",
          "Bug fixes",
          "Done-for-You Website Updates",
          "SEO",
          "GEO",
          "AEO",
          "Priority support",
          "Other plan-specific services",
        ]),
        p("The exact services and terms applicable to a paid plan will be established in the applicable paid Service Agreement."),
      ],
    },
    {
      heading: "22. Pricing Changes and Price Lock",
      blocks: [
        p("Altaventures' published pricing for its services is subject to change without prior notice."),
        p("The Client understands that the Free Website Service does not guarantee access to future paid services at today's pricing."),
        p("If the Client later subscribes to a paid Digital Growth Plan, the pricing applicable to that paid plan will be governed by the applicable paid Service Agreement."),
        p(
          "For a paid plan, the selected plan price will be locked for the Client's current Service Term and may change upon the next renewal in accordance with the applicable paid Service Agreement."
        ),
      ],
    },
    {
      heading: "23. Future Paid Plan or Partnership Arrangement",
      blocks: [
        p("If the Client wishes to:"),
        ul([
          "Upgrade to a paid plan;",
          "Purchase recurring services;",
          "Engage Altaventures for a separate website project;",
          "Purchase substantial additional services;",
          "Enter into an alternative commercial arrangement; or",
          "Enter into an alternative partnership arrangement,",
        ]),
        p("the Parties may enter into a separate written agreement."),
        p("The separate agreement will govern the services or relationship specifically covered by it."),
        p(
          "The separate agreement will supersede this Agreement to the extent of any conflict concerning the services, pricing, rights, obligations, or relationship covered by the separate agreement."
        ),
        p("Any provisions of this Agreement that are not addressed or superseded will remain effective."),
        p("Alternative arrangements may include:"),
        ul([
          "Referral partnerships",
          "Revenue-sharing arrangements",
          "Strategic partnerships",
          "Marketing partnerships",
          "Technology partnerships",
          "Custom business development arrangements",
          "Other mutually agreed arrangements",
        ]),
      ],
    },
    {
      heading: "24. Portfolio and Marketing Rights",
      blocks: [
        p(
          "The Client agrees that Altaventures may display and reference the website built for the Client as part of its portfolio, marketing, promotional, sales, presentation, and business development materials."
        ),
        p("This may include:"),
        ul([
          "Website screenshots",
          "Website previews",
          "Website recordings",
          "Website links",
          "Before-and-after comparisons",
          "Client business name",
          "Publicly displayed logo or branding",
          "General descriptions of the website project",
          "Social media posts",
          "Proposals",
          "Presentations",
          "Advertisements",
          "Altaventures' website and portfolio",
        ]),
        p("The purpose of this permission is to allow Altaventures to demonstrate its previous work and capabilities."),
        p("Altaventures will not state or imply that the Client endorses Altaventures unless separately authorized."),
        p("This portfolio permission continues after termination of this Agreement unless otherwise agreed in writing."),
      ],
    },
    {
      heading: "25. Intellectual Property",
      blocks: [
        p("The Client retains ownership of Client-owned materials provided to Altaventures, including its:"),
        ul(["Business name", "Logo", "Trademarks", "Photographs", "Written content", "Product information", "Other Client-owned materials"]),
        p("Altaventures retains ownership of its pre-existing and reusable:"),
        ul(["Frameworks", "Templates", "Components", "Development methods", "Internal tools", "General-purpose code", "Technical processes", "Know-how"]),
        p("The Client receives the rights reasonably necessary to use the completed website for its business, subject to this Agreement and applicable third-party licenses."),
      ],
    },
    {
      heading: "26. Client Business Responsibilities",
      blocks: [
        p("The Client remains solely responsible for its:"),
        ul([
          "Products",
          "Services",
          "Prices",
          "Inventory",
          "Orders",
          "Fulfillment",
          "Shipping",
          "Refunds",
          "Returns",
          "Customer service",
          "Advertising",
          "Marketing claims",
          "Business policies",
          "Licenses",
          "Permits",
          "Taxes",
          "Regulatory compliance",
        ]),
        p("Altaventures provides website and digital services and does not become the Client's seller, merchant, manufacturer, or service provider."),
      ],
    },
    {
      heading: "27. Data Privacy and Security",
      blocks: [
        p("The Parties agree to comply with applicable Philippine data protection requirements."),
        p("The Client is responsible for determining what personal information it collects through its business and website and how that information is used."),
        p("The Client is also responsible for maintaining the confidentiality of any credentials provided to it."),
        p("The Client must promptly notify Altaventures if it suspects that website or account credentials have been compromised."),
        p("Altaventures may take reasonable security measures, including temporary suspension of affected services, where necessary to protect the Client, website, infrastructure, or other users."),
      ],
    },
    {
      heading: "28. Prohibited Use",
      blocks: [
        p("The website and Services may not be used for:"),
        ul([
          "Fraud",
          "Phishing",
          "Malware",
          "Illegal transactions",
          "Copyright infringement",
          "Trademark infringement",
          "Spam",
          "Harassment",
          "Impersonation",
          "Illegal products or services",
          "Malicious activity",
          "Activities violating applicable law",
          "Activities violating third-party provider policies",
        ]),
      ],
    },
    {
      heading: "29. Suspension and Termination",
      blocks: [
        p("Altaventures may suspend or terminate the Free Website Service where reasonably necessary due to:"),
        ul([
          "Material breach of this Agreement",
          "Illegal activity",
          "Fraud",
          "Security threats",
          "Malware",
          "Phishing",
          "Abuse",
          "Spam",
          "Intellectual property violations",
          "Threats to infrastructure",
          "Government or court requirements",
          "Discontinuation of necessary third-party services",
          "Discontinuation of the Free Website Service",
          "Extended inactivity",
          "Other legitimate operational reasons",
        ]),
        p("Where reasonably practicable, Altaventures will provide notice before termination."),
        p("The Client may also request termination of the Free Website Service."),
        p("Upon termination, hosting may be discontinued and the website may be removed from Altaventures' infrastructure."),
        p("The Client may request a domain transfer or full website transfer subject to the applicable transfer terms and fees."),
      ],
    },
    {
      heading: "30. Website Transfer",
      blocks: [
        sh("Domain Transfer"),
        p("Standard domain transfer assistance is Free."),
        p("The Client remains responsible for any fees charged by the destination registrar."),
        sh("Full Website Transfer"),
        p("A full-scale website transfer is priced at Altaventures' then-current published rate, depending on the scope and complexity."),
        p("A full transfer may include source code, repositories, databases, website assets, and other transferable materials."),
        p("The Client may be required to provide destination hosting, accounts, or infrastructure."),
      ],
    },
    {
      heading: "31. No Guarantee of Business Results",
      blocks: [
        p("Altaventures does not guarantee:"),
        ul(["Sales", "Revenue", "Leads", "Website traffic", "Search rankings", "Conversion rates", "Customer volume", "Orders", "Profit", "Business growth"]),
        p("The website is provided as a digital business tool."),
        p("The Client remains responsible for its marketing, sales, customer service, products, services, and business operations."),
      ],
    },
    {
      heading: "32. Liability",
      blocks: [
        p("Each Party remains responsible for its obligations under this Agreement to the extent required by law."),
        p(
          "To the extent permitted by applicable law, Altaventures will not be responsible for indirect or consequential losses, lost profits, lost revenue, lost business opportunities, or losses caused by:"
        ),
        ul([
          "Incorrect Client information",
          "Client instructions",
          "Client misuse",
          "Unauthorized modifications",
          "Third-party failures",
          "Third-party services",
          "Circumstances outside Altaventures' reasonable control",
        ]),
        p("Nothing in this Agreement excludes liability that cannot legally be excluded."),
        p("Because the Free Website Service has no recurring service fee, the Parties acknowledge that the amount paid specifically for the Free Website Service may be ₱0."),
      ],
    },
    {
      heading: "33. Confidentiality",
      blocks: [
        p("Each Party agrees to take reasonable steps to protect confidential information received from the other Party."),
        p("This may include:"),
        ul(["Business information", "Customer information", "Credentials", "Internal documents", "Technical information", "Non-public operational information"]),
        p("This obligation does not apply to information that is publicly available, independently developed, lawfully obtained from another source, or required to be disclosed by law."),
      ],
    },
    {
      heading: "34. Force Majeure",
      blocks: [
        p("Neither Party will be responsible for failure or delay caused by circumstances beyond its reasonable control."),
        p("This may include:"),
        ul([
          "Natural disasters",
          "War",
          "Government action",
          "Major internet failures",
          "Major hosting outages",
          "Cyberattacks",
          "Power failures",
          "Telecommunications failures",
          "Regulatory changes",
          "Third-party service discontinuation",
          "Other comparable events",
        ]),
      ],
    },
    {
      heading: "35. Governing Law and Disputes",
      blocks: [
        p("This Agreement is governed by the laws of the Republic of the Philippines."),
        p("If a dispute arises, the Parties will first attempt to resolve the matter through good-faith communication."),
        p("If the dispute cannot be resolved, the Parties may pursue appropriate remedies under Philippine law."),
      ],
    },
    {
      heading: "36. General Terms",
      blocks: [
        p("If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions will continue to apply to the extent permitted by law."),
        p("Electronic signatures, electronic approvals, and other reliable forms of electronic acceptance may be used to accept this Agreement."),
        p("This Agreement, together with any expressly incorporated website scope or approved documentation, constitutes the agreement between the Parties regarding the Free Website Service."),
      ],
    },
    {
      heading: "37. Client Acknowledgment",
      blocks: [
        p("By accepting this Agreement, the Client confirms that it:"),
        ul([
          "Has read and understood this Agreement.",
          "Understands what is included in the Free Website Service.",
          "Understands what is not included.",
          "Understands that the website is provided without a recurring website service fee.",
          "Understands that additional services may require payment.",
          "Understands that the website delivered at the time of signing constitutes the Initial Website Scope.",
          "Understands that the fourteen (14) day revision period begins on the date the website is delivered.",
          "Understands that the ninety (90) day bug warranty begins on the date the website is delivered.",
          "Understands that the revision period covers reasonable changes within the delivered website's existing scope.",
          "Understands that the bug warranty covers genuine technical defects in the delivered website.",
          "Understands that the bug warranty does not constitute unlimited free maintenance.",
          "Understands that new features, new functionality, major changes, and additional development may require payment.",
          "Understands that Altaventures' published pricing is subject to change without prior notice.",
          "Understands that future paid plans are subject to their applicable pricing and agreements.",
          "Understands that the Client's price for a future paid plan will be governed by the applicable paid Service Agreement.",
          "Understands that a separate agreement will govern any future paid plan or alternative partnership arrangement.",
          "Agrees that such separate agreement will supersede this Agreement to the extent of any conflict concerning the services or relationship covered by that agreement.",
          "Understands that Altaventures may use the completed website in its portfolio and marketing materials.",
          "Authorizes Altaventures to use reasonable screenshots, website previews, links, business name, and publicly displayed branding for portfolio and promotional purposes.",
          "Understands that the Client remains responsible for its business, content, products, services, customers, transactions, and legal obligations.",
          "Understands that Altaventures does not guarantee business results.",
          "Confirms that the person accepting this Agreement is authorized to bind the Client.",
          "Agrees to be bound by this Agreement.",
        ]),
      ],
    },
    {
      heading: "38. Electronic Acceptance",
      blocks: [
        p(
          "By signing, electronically signing, checking an acceptance box, or otherwise expressly accepting this Agreement, the Client confirms that it has read, understood, and agreed to the terms of this Agreement."
        ),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Signable-field coordinates (PDF points, bottom-left origin, 0-indexed
// page numbers), on the generated PDF
// (public/documents/free-website-service-agreement.pdf). Regenerated by
// scripts/generate-wsa-pdf.ts whenever the document changes; do not
// hand-edit unless you know the exact layout changed by that amount.
// ---------------------------------------------------------------------------
export const WSA_PDF_FIELD_COORDS = {
  // "1. Client Information" block, near the top of the document.
  clientInfo: {
    businessName: { page: 0, x: 72, y: 521.1992840095465, w: 76.44 },
    ownerRep: { page: 0, x: 72, y: 504.19928400954655, w: 165.7425 },
    email: { page: 0, x: 72, y: 453.19928400954655, w: 29.169 },
    phone: { page: 0, x: 72, y: 436.19928400954655, w: 79.674 },
  },
  // Signature/execution block at the end of the document. Client and
  // Altaventures sub-blocks are kept from splitting across a page break by
  // the generator, but can still land on different pages from each other.
  signing: {
    clientName: { page: 15, x: 72, y: 272.19928400954655, w: 30.922500000000003 },
    clientDate: { page: 15, x: 72, y: 221.19928400954655, w: 25.095000000000002 },
    altaDate: { page: 15, x: 72, y: 127.19928400954655, w: 25.095000000000002 },
  },
} as const;

export const WSA_SIGNATURE_BOX = {
  page: 15,
  x: 131.859,
  y: 249.19928400954655,
  width: 150,
  height: 32,
} as const;

export const WSA_ALTA_SIGNER = "Van Amaranto";
