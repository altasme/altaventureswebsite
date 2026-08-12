// content/wsa.ts
// Free Website Service Agreement: full text as supplied by the client, plus
// the coordinate map used to overlay signed values onto the source PDF.
// Keep this in sync with public/documents/free-website-service-agreement.pdf.

import type { LegalBlock, LegalSection } from "./site";

const p = (text: string): LegalBlock => ({ kind: "p", text });
const ul = (items: string[]): LegalBlock => ({ kind: "ul", items });

export const WSA_DOCUMENT: {
  title: string;
  intro: LegalBlock[];
  sections: LegalSection[];
} = {
  title: "Free Website Service Agreement",
  intro: [
    p(
      'This Free Website Service Agreement ("Agreement") is entered into between ALTAVENTURES ("ALTAVENTURES") and the business or individual identified in the applicable client information or acceptance record ("Client").'
    ),
    p(
      "By accepting the Free Website Service, providing the required information and materials, approving the website for publication, or otherwise proceeding with the service, the Client agrees to the terms of this Agreement."
    ),
  ],
  sections: [
    {
      heading: "1. Free Website Service",
      blocks: [
        p("ALTAVENTURES provides the Client with a professional Phase 1 website at no website service fee."),
        p(
          "The purpose of the Free Website Service is to provide the Client with a professional online presence that allows customers to learn about the business and contact the Client."
        ),
        p("The Free Website Service may include:"),
        ul([
          "Professional website design",
          "Mobile-responsive website",
          "Business information",
          "Services or product presentation",
          "Client-provided images and content",
          "Contact information",
          "Call-to-action elements",
          "Hosting and SSL",
          "Basic website infrastructure required to operate the website",
        ]),
        p("The Free Website Service is primarily intended to function as an informational and lead-generation website."),
      ],
    },
    {
      heading: "2. Phase 1 Service Limitations",
      blocks: [
        p("The Free Website Service is a Phase 1 website and does not automatically include Phase 2 functionality."),
        p("The following are not included unless separately agreed:"),
        ul([
          "Client Admin Panel",
          "Product and price management",
          "Order management",
          "Database-driven business systems",
          "Online payment processing",
          "Booking systems",
          "Appointment systems",
          "Customer relationship management systems",
          "Business email",
          "Transactional email systems",
          "Advanced integrations",
          "Custom software development",
          "Advanced automation",
          "Ongoing website update requests",
          "Advanced SEO, GEO or AEO services",
          "Major redesigns",
          "Major restructuring",
          "Additional business systems",
        ]),
        p("These services may become available through a paid ALTAVENTURES service plan, Pay-As-You-Go services, or another agreed arrangement."),
      ],
    },
    {
      heading: "3. Client May Upgrade at Any Time",
      blocks: [
        p("The Client may upgrade from the Free Website Service to an applicable ALTAVENTURES paid service plan at any time."),
        p(
          "An upgrade may provide access to additional website functionality, business systems, ongoing development, website updates, maintenance, email services and other features depending on the selected plan."
        ),
        p("Once a paid service plan is accepted, the applicable paid service agreement and plan terms will govern the paid services."),
        p("The Client is not required to remain on the Free Website Service if it wishes to access additional functionality."),
      ],
    },
    {
      heading: "4. Domain Registration and Ownership",
      blocks: [
        p("The Client's custom domain is separate from the website service itself."),
        p("The Client owns the domain registration rights, subject to the applicable registrar and domain registry rules."),
        p("ALTAVENTURES may purchase, register, configure, renew, manage or administer the domain on behalf of the Client."),
        p("The domain registration cost shall be paid by:"),
        ul([
          "the Client directly; or",
          "ALTAVENTURES on behalf of the Client where ALTAVENTURES agrees to advance or cover the applicable registration cost.",
        ]),
        p(
          "Where ALTAVENTURES pays a domain registration or renewal cost on behalf of the Client, such payment does not transfer ownership of the domain to ALTAVENTURES."
        ),
        p("The domain remains the Client's domain, subject to the Client's payment obligations and the applicable registrar's terms."),
      ],
    },
    {
      heading: "5. Domain Selection Is Final",
      blocks: [
        p("The Client is responsible for carefully reviewing and approving the domain name before registration."),
        p("Once the domain has been purchased and registered, the selected domain name cannot simply be changed, exchanged or replaced under the Free Website Service."),
        p("If the Client later wishes to use a different domain name, the Client may purchase and maintain a new domain at its own expense."),
        p("Any additional configuration, migration or website changes required because of a new domain may be treated as a separate paid service."),
        p(
          "ALTAVENTURES is not responsible for the Client's choice of domain name, including potential trademark conflicts, similarity to another business, spelling preferences, branding decisions or future commercial suitability."
        ),
        p("The Client is responsible for ensuring that its chosen domain does not infringe third-party rights."),
      ],
    },
    {
      heading: "6. Domain Management and Transfer Restrictions",
      blocks: [
        p(
          "Where ALTAVENTURES purchases or manages the domain on behalf of the Client, ALTAVENTURES may retain administrative control of the applicable registrar account or domain-management layer for purposes of registration, renewal, DNS configuration, security and website operation."
        ),
        p("The Client remains the domain owner."),
        p("Following initial registration, registrar transfer, material registration changes, or other applicable domain events, the domain may be subject to a transfer restriction or lockout period."),
        p(
          "Where applicable to the domain and registrar arrangement, the Client acknowledges that a transfer lockout period of up to seventy (70) days may apply from the date the domain is registered, transferred, or otherwise placed under ALTAVENTURES' domain management."
        ),
        p("The actual transfer eligibility period may depend on the domain extension, registrar, registry, applicable policies and technical circumstances."),
        p("The Client acknowledges that domain transfer restrictions may exist independently of ALTAVENTURES and may be imposed by the registrar or registry."),
        p(
          "For certain generic top-level domains, ICANN policies provide for 60-day transfer restrictions in specified circumstances, including certain new registrations, registrar transfers and changes of registrant information."
        ),
        p("ALTAVENTURES does not guarantee that a domain can be transferred immediately upon request."),
      ],
    },
    {
      heading: "7. Domain Renewal",
      blocks: [
        p("The Client is responsible for ensuring that the domain remains renewed and active."),
        p("Where ALTAVENTURES manages the renewal, the Client must provide payment or reimbursement as applicable before the renewal deadline."),
        p("ALTAVENTURES is not responsible for domain expiration caused by the Client's failure to provide required payment, authorization or information."),
        p("Domain expiration may result in the website becoming unavailable."),
      ],
    },
    {
      heading: "8. Service Term",
      blocks: [
        p(
          "The Free Website Service Agreement remains active for as long as the applicable Client domain remains active and the website service remains supported by ALTAVENTURES, unless this Agreement is otherwise terminated or suspended under its terms."
        ),
        p("The Free Website Service does not create a perpetual guarantee of hosting, infrastructure or technical availability."),
        p(
          "ALTAVENTURES may modify, suspend or discontinue the Free Website Service where reasonably necessary due to technical, operational, security, legal, infrastructure or business considerations."
        ),
      ],
    },
    {
      heading: "9. Website Ownership",
      blocks: [
        p("The Client retains ownership of:"),
        ul([
          "Its business name",
          "Trademarks and logos supplied by the Client",
          "Original photographs supplied by the Client",
          "Original written content supplied by the Client",
          "Business information supplied by the Client",
          "The Client's domain",
        ]),
        p("However, ALTAVENTURES retains ownership of the website technology and materials created, developed, configured or supplied by ALTAVENTURES, including, without limitation:"),
        ul([
          "Source code",
          "Website code",
          "Frameworks",
          "Components",
          "Templates",
          "Design systems",
          "Development systems",
          "Website architecture",
          "Database structure",
          "Database schema",
          "Proprietary database systems",
          "Backend systems",
          "Admin systems",
          "APIs",
          "Integrations",
          "Automation systems",
          "Deployment configurations",
          "Infrastructure configurations",
          "Internal tools",
          "Reusable components",
          "Development methodologies",
          "Proprietary libraries",
          "Technical documentation",
          "Other proprietary technology developed or used by ALTAVENTURES",
        ]),
        p("The Client receives the right to use the completed website as part of the applicable service while the service remains active."),
        p("The Free Website Service does not constitute a sale or transfer of ALTAVENTURES' source code, repositories, database structure, proprietary technology, infrastructure or development systems."),
      ],
    },
    {
      heading: "10. Client Data and Business Information",
      blocks: [
        p(
          "Although ALTAVENTURES owns the underlying database structure, software and technical infrastructure used to operate the website, the Client retains its rights in its own business information and other Client-provided materials, subject to applicable law."
        ),
        p("Personal information belonging to customers or other individuals is not treated as property owned by ALTAVENTURES."),
        p("The parties will handle personal information in accordance with applicable Philippine data privacy laws and regulations."),
        p("ALTAVENTURES' ownership of the technical database infrastructure does not give ALTAVENTURES unrestricted rights to use personal information for unrelated purposes."),
      ],
    },
    {
      heading: "11. Website Content",
      blocks: [
        p("The Client is responsible for providing accurate, lawful and up-to-date:"),
        ul([
          "Business information",
          "Product information",
          "Service information",
          "Pricing",
          "Contact information",
          "Promotional claims",
          "Images",
          "Logos",
          "Written content",
        ]),
        p("The Client represents that it has the necessary rights and permissions to provide materials supplied to ALTAVENTURES."),
        p("ALTAVENTURES may rely on Client-provided information when building and maintaining the website."),
        p("The Client remains responsible for the accuracy and legality of information it provides."),
      ],
    },
    {
      heading: "12. Client Business Responsibility",
      blocks: [
        p("ALTAVENTURES provides digital infrastructure and website development services."),
        p("ALTAVENTURES does not operate the Client's underlying business."),
        p("The Client remains responsible for:"),
        ul([
          "Its products and services",
          "Pricing",
          "Customer transactions",
          "Orders",
          "Payments",
          "Fulfillment",
          "Refunds",
          "Cancellations",
          "Warranties",
          "Guarantees",
          "Customer communications",
          "Business permits",
          "Licenses",
          "Regulatory compliance",
          "Advertising claims",
          "Product claims",
          "Consumer obligations",
        ]),
        p("Where the website is used for online transactions, the Client remains responsible for applicable legal obligations relating to its business and transactions."),
      ],
    },
    {
      heading: "13. Website Approval",
      blocks: [
        p("ALTAVENTURES may provide the Client with an opportunity to review the website before publication."),
        p("Once the Client approves the website for publication, the website will be considered accepted."),
        p("Changes requested after approval that introduce new content, functionality, redesign work, restructuring or additional development may be treated as additional paid work."),
      ],
    },
    {
      heading: "14. Additional Work",
      blocks: [
        p("The Free Website Service does not include unlimited revisions or development."),
        p("Additional work may be requested through:"),
        ul([
          "ALTAVENTURES Pay-As-You-Go services",
          "ALTAVENTURES Digital Growth Plans",
          "A separately quoted website project",
          "An Alternative Partnership Arrangement",
        ]),
        p("ALTAVENTURES will determine whether a request falls within the original agreed scope or constitutes additional work."),
        p("ALTAVENTURES will provide applicable pricing before chargeable work is performed."),
      ],
    },
    {
      heading: "15. Business System Development",
      blocks: [
        p("Phase 2 functionality may include business systems such as:"),
        ul([
          "Booking",
          "Appointment management",
          "Sales systems",
          "Ordering systems",
          "Customer management",
          "Automated notifications",
          "Payment integrations",
          "Other business workflows",
        ]),
        p("Such functionality is not included in the Free Website Service unless expressly stated in writing."),
        p("The Client may request these capabilities through an applicable paid service or separately quoted project."),
      ],
    },
    {
      heading: "16. Third-Party Services",
      blocks: [
        p(
          "The website may depend on third-party services, including hosting infrastructure, domain registrars, APIs, software services, email providers, payment providers and other external systems."
        ),
        p("ALTAVENTURES does not control third-party services and cannot guarantee their continuous availability, pricing, policies or functionality."),
        p("Third-party services that require separate fees may be charged to the Client where applicable."),
      ],
    },
    {
      heading: "17. Service Continuity Protection",
      blocks: [
        p("If the applicable service is suspended or terminated, ALTAVENTURES may disable dynamic features, infrastructure or functionality provided as part of the managed service."),
        p("The website may become unavailable or revert to an available static version where technically applicable, subject to the applicable agreement."),
        p("The Client acknowledges that the website is provided as a managed service and that continued access to ALTAVENTURES infrastructure is dependent upon the applicable service remaining active."),
      ],
    },
    {
      heading: "18. Security and Misuse",
      blocks: [
        p("The Client must not use the website or related services for:"),
        ul([
          "Illegal activities",
          "Fraud",
          "Phishing",
          "Malware",
          "Unauthorized access",
          "Spam",
          "Abuse of infrastructure",
          "Intellectual property infringement",
          "Deceptive activity",
          "Other activity that creates a material legal, security or operational risk",
        ]),
        p("ALTAVENTURES may suspend or restrict services where reasonably necessary to protect its infrastructure, the Client, other users or third parties."),
      ],
    },
    {
      heading: "19. Data Privacy",
      blocks: [
        p("The parties shall comply with applicable Philippine data privacy laws, including Republic Act No. 10173, the Data Privacy Act of 2012."),
        p("ALTAVENTURES will implement reasonable measures appropriate to the services it provides."),
        p("The Client remains responsible for determining the lawful purposes for which customer information is collected and used in connection with its business."),
        p("Where additional data-processing documentation is required, the parties may enter into a separate Data Processing Agreement."),
      ],
    },
    {
      heading: "20. No Guarantee of Business Results",
      blocks: [
        p("ALTAVENTURES does not guarantee:"),
        ul([
          "Website traffic",
          "Leads",
          "Sales",
          "Bookings",
          "Revenue",
          "Search rankings",
          "Customer inquiries",
          "Business growth",
          "Advertising results",
          "Conversion rates",
        ]),
        p("The website is a business tool and its results depend on factors outside ALTAVENTURES' reasonable control."),
      ],
    },
    {
      heading: "21. Intellectual Property",
      blocks: [
        p("The Client must not represent ALTAVENTURES' proprietary technology as its own technology."),
        p(
          "The Client may not copy, reproduce, resell, distribute, reverse engineer, extract or commercially reuse ALTAVENTURES' proprietary website systems, source code, database structure, frameworks or internal technology without ALTAVENTURES' written authorization."
        ),
        p("This restriction does not prevent the Client from using its own business content, trademarks, domain or other materials that it independently owns."),
      ],
    },
    {
      heading: "22. Website Transfer",
      blocks: [
        p("The Free Website Service does not automatically include transfer of the website to another provider."),
        p("A transfer-out request may require a separate service fee and technical assessment."),
        p("Any transfer involving source code, repositories, databases, infrastructure configurations or proprietary systems shall be subject to a separate agreement."),
        p("ALTAVENTURES may determine what materials can technically and legally be transferred."),
      ],
    },
    {
      heading: "23. Limitation of Liability",
      blocks: [
        p(
          "To the maximum extent permitted by law, ALTAVENTURES will not be liable for indirect, incidental, consequential, special or speculative losses arising from the use, interruption or unavailability of the Free Website Service."
        ),
        p("This may include loss of:"),
        ul(["Revenue", "Profits", "Customers", "Business opportunities", "Goodwill", "Data", "Anticipated savings"]),
        p("Nothing in this Agreement excludes or limits liability that cannot legally be excluded or limited."),
      ],
    },
    {
      heading: "24. Client Indemnification",
      blocks: [
        p(
          "To the maximum extent permitted by applicable law, the Client agrees to protect and indemnify ALTAVENTURES against third-party claims, losses, liabilities, damages and reasonable expenses arising from:"
        ),
        ul([
          "Client-provided content",
          "Client products or services",
          "Client business operations",
          "Client transactions",
          "Client's violation of applicable laws",
          "Client's unauthorized use of third-party materials",
          "Claims relating to information supplied or approved by the Client",
        ]),
        p("This clause does not apply to the extent a claim is directly caused by ALTAVENTURES' proven willful misconduct or liability that cannot legally be transferred to the Client."),
      ],
    },
    {
      heading: "25. Termination",
      blocks: [
        p("Either party may request termination of the Free Website Service."),
        p(
          "ALTAVENTURES may suspend or terminate the service where the Client materially violates this Agreement or where continued service creates a significant legal, security, technical or operational risk."
        ),
        p("Upon termination, ALTAVENTURES may discontinue the website service and associated infrastructure."),
        p("The Client's domain ownership is separate from the website service and remains subject to the applicable domain registrar and registry rules."),
      ],
    },
    {
      heading: "26. Effect of Termination on Domain",
      blocks: [
        p("Termination of the website service does not automatically transfer ownership of the Client's domain to ALTAVENTURES."),
        p("The domain remains the Client's property, subject to applicable registrar requirements and any unpaid domain-related amounts."),
        p("If the Client requests transfer or migration of the domain, the transfer will be subject to applicable registrar and registry policies, including any active transfer lock or waiting period."),
      ],
    },
    {
      heading: "27. Agreement Changes",
      blocks: [
        p("ALTAVENTURES may update its standard service terms for future clients or future service periods."),
        p("Any material amendment to the Client's existing Agreement that materially changes the Client's obligations will be communicated through an appropriate notice or updated agreement where required."),
        p("Specific written terms agreed with the Client will prevail over general promotional materials."),
      ],
    },
    {
      heading: "28. Governing Law",
      blocks: [
        p("This Agreement shall be governed by the laws of the Republic of the Philippines."),
        p("The parties will first attempt to resolve disputes through good-faith discussion before pursuing available legal remedies, subject to applicable law."),
        p("Nothing in this Agreement prevents either party from exercising rights or remedies that cannot legally be waived."),
      ],
    },
    {
      heading: "29. Entire Agreement",
      blocks: [
        p(
          "This Agreement, together with any written scope, quotation, order form, plan terms or other documents expressly incorporated into it, constitutes the agreement between ALTAVENTURES and the Client concerning the Free Website Service."
        ),
        p("Any additional service or feature not expressly included in the agreed scope will require separate approval."),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Signature-page field coordinates (PDF points, bottom-left origin), taken
// directly from the text layout of the last page of
// public/documents/free-website-service-agreement.pdf. Keep in sync if the
// source PDF is ever replaced.
// ---------------------------------------------------------------------------
export const WSA_PDF_FIELD_COORDS = {
  businessName: { x: 72.02, y: 532.87, w: 124.34 },
  clientRep: { x: 72.02, y: 507.91, w: 139.33 },
  email: { x: 72.02, y: 482.95, w: 32.7 },
  phone: { x: 72.02, y: 457.99, w: 90.18 },
  clientInfoDate: { x: 72.02, y: 433.03, w: 28.14 },
  acceptName: { x: 72.02, y: 299.21, w: 34.82 },
  acceptDate: { x: 72.02, y: 249.29, w: 28.14 },
  altaDate: { x: 72.02, y: 149.42, w: 28.14 },
} as const;

export const WSA_SIGNATURE_BOX = { x: 134.48, y: 270, width: 150, height: 26 } as const;

export const WSA_ALTA_SIGNER = "Van Amaranto";
