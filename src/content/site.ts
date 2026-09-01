// content/site.ts
// SINGLE SOURCE OF TRUTH: all copy, projects, contact config for the Altaventures site.
// No component should hard-code copy. Edit this file to change what the site says.

export const BRAND = {
  name: "Altaventures",
  legalName: "Altaventures Business Development Services",
  tagline: "We build the engine. You drive the business.",
  logo: "/images/brand/altaventures-logo.png",
} as const;

export const CONTACT = {
  whatsapp: {
    number: "639212836683",
    supportsPrefill: true,
    prefill:
      "Hi Altaventures! I'd like to discuss a website or digital solution for my business.",
  },
  viber: {
    number: "+639212836683",
    supportsPrefill: false,
  },
  messenger: {
    handle: "vanamaranto.moto",
    supportsPrefill: false,
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
] as const;

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const HERO = {
  eyebrow: BRAND.tagline,
  headline: "Build a Better Digital Business.",
  sub: "Altaventures builds professional websites, digital tools, and business systems designed around the way your business actually works.",
  line: "For Philippine businesses ready to build, improve, or digitalize their business online.",
  primaryCta: "Let's Talk About Your Business",
  secondaryCta: "See What We've Built",
  trustLine: "Built for real businesses. Designed around real business needs.",
  backgroundImageDesktop: "/images/hero/hero-bg-wide.jpg",
  backgroundImageMobile: "/images/hero/hero-bg-mobile.jpg",
  backgroundAlt: "Business owner working on a laptop in a modern office, warm evening light",
} as const;

// ---------------------------------------------------------------------------
// Credibility strip
// ---------------------------------------------------------------------------

export const CREDIBILITY_STRIP = {
  headline: "Not Just Websites. Real Business Systems.",
  sub: "Every project below is a live, working system built for a real Philippine business, not a template or a mockup.",
  cta: "Explore Our Work",
  // Shows range: two systems, one commerce, one site. Data itself lives in
  // content/portfolio.ts, the canonical source shared with /limitedoffer.
  featuredIds: ["altamotors", "aurielle", "leanandfit", "vocalyze"],
} as const;

// ---------------------------------------------------------------------------
// Problem section
// ---------------------------------------------------------------------------

export const PROBLEMS = {
  headline: "Does Your Business Need More Than a Facebook Page?",
  cta: "Tell Us What's Holding Your Business Back",
  items: [
    {
      title: "You're Losing Customers to a Weak First Impression",
      copy: "A Facebook page can't show up in Google search, load fast on mobile, or make your business look as established as it actually is. Customers judge credibility in seconds.",
    },
    {
      title: "You're Managing Bookings, Orders, or Payments by Hand",
      copy: "Messenger threads, spreadsheets, and sticky notes don't scale. Every manual step is a chance for something to be missed, double-booked, or lost.",
    },
    {
      title: "Your Systems Don't Talk to Each Other",
      copy: "Sales in one place, records in another, follow-ups nowhere. Without a connected system, growth just means more chaos, not more revenue.",
    },
    {
      title: "You Don't Have Time to Manage Any of This Yourself",
      copy: "You're running the business, not building software. You need a system that works quietly in the background, not another project on your plate.",
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const SERVICES = {
  headline: "Digital Solutions Built Around Your Business",
  items: [
      {
      id: "websites",
      name: "Business Websites",
      outcome: "A Website That Works as Hard as You Do",
      capabilities: [
        "Professional, mobile-first design",
        "Built to convert visitors into conversations",
        "Fast-loading, search-friendly pages",
        "Easy to update as your business grows",
      ],
      cta: "I Need a Website",
      referenceIds: [],
    },
    {
      id: "booking",
      name: "Booking & Scheduling",
      outcome: "Stop Managing Bookings by Hand",
      capabilities: [
        "Online booking and calendar management",
        "Automated confirmations and reminders",
        "Staff and resource scheduling",
        "Built around how your business actually operates",
      ],
      cta: "I Need a Booking System",
      referenceIds: ["setmona"],
    },
    {
      id: "management",
      name: "Business Management Systems",
      outcome: "Run Your Operations From One Place",
      capabilities: [
        "Loan, billing, and collections tracking",
        "Financing and sales record management",
        "Custom dashboards for owners and staff",
        "Built to match your existing workflow, not replace it",
      ],
      cta: "I Need a Management System",
      referenceIds: ["altamotors", "kolekta"],
    },
    {
      id: "ecommerce",
      name: "E-commerce",
      outcome: "Sell Online Without the Guesswork",
      capabilities: [
        "Product catalogs and online ordering",
        "Payment and inventory-aware workflows",
        "Mobile-first shopping experience",
        "Designed to grow with your catalog",
      ],
      cta: "I Need to Sell Online",
      referenceIds: [],
    },
    {
      id: "digitalization",
      name: "Business Digitalization",
      outcome: "Move Your Business Online, Properly",
      capabilities: [
        "Digitizing manual, paper-based processes",
        "Centralizing scattered records and tools",
        "Systems that fit your business, not the other way around",
        "A clear, guided path from where you are to where you want to be",
      ],
      cta: "I Need to Digitalize My Business",
      referenceIds: [],
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Projects, used by SelectedWork + CaseStudyModal. Card-level data (name,
// category, tags, description, url) is canonical in content/portfolio.ts,
// shared with /limitedoffer. This file only adds the narrative detail
// CaseStudyModal shows for the two in-house engines (Setmona, Kolekta),
// which have no public URL to send visitors to instead.
// ---------------------------------------------------------------------------

export const CASE_STUDY_DETAILS: Record<
  string,
  {
    overview: string;
    whatWeBuilt: string[];
    projectType: string;
    businessValue: string;
    cta: string;
  }
> = {
  setmona: {
    overview:
      "Setmona is a booking and scheduling system built for service-based businesses that were previously coordinating appointments manually. Altaventures designed and built the platform end-to-end, from customer-facing booking to the back-end schedule management staff rely on day to day.",
    whatWeBuilt: [
      "Customer-facing online booking flow",
      "Real-time calendar and availability management",
      "Automated booking confirmations and reminders and SMS",
      "CRM, forms, and reporting for staff",
    ],
    projectType: "Web application",
    businessValue:
      "Replaced manual back-and-forth scheduling with a self-serve booking flow, reducing missed bookings and freeing up staff time.",
    cta: "I Need a Booking System Like This",
  },
  kolekta: {
    overview:
      "Kolekta was built for lending operations that needed a reliable way to track borrower accounts, payment schedules, and collections. This work was previously spread across spreadsheets and manual records.",
    whatWeBuilt: [
      "Invoice generation and manual recurring billing",
      "Automated email and SMS",
      "Tax and fee calculation",
      "Customer portal and payment plans",
    ],
    projectType: "Business management system",
    businessValue:
      "Centralized loan and billing records into one system, making it easier to track what's owed, what's paid, and what needs follow-up.",
    cta: "I Need a Management System Like This",
  },
};

export const SELECTED_WORK = {
  headline: "We've Built It. Now Let's Build Yours.",
  viewWebsiteLabel: "View Website",
  viewDetailsLabel: "View Details",
  studioLine: "Currently in the studio:",
} as const;

// ---------------------------------------------------------------------------
// Portfolio conversion
// ---------------------------------------------------------------------------

export const PORTFOLIO_CONVERSION = {
  headline: "What Could We Build for Your Business?",
  sub: "Every system on this page started as a conversation about a real business problem. Yours could be next.",
  cta: "Let's Talk About Your Business",
} as const;

// ---------------------------------------------------------------------------
// Why Altaventures
// ---------------------------------------------------------------------------

export const WHY_ALTAVENTURES = {
  headline: "Built Around Your Business.",
  points: [
    {
      title: "Business First",
      copy: "We start with how your business actually operates, not with a template. The system fits the business, not the other way around.",
    },
    {
      title: "More Than Websites",
      copy: "Websites, booking systems, management tools, e-commerce: we build the parts of your business that need to run online, together.",
    },
    {
      title: "Designed to Grow",
      copy: "What we build today is built to be extended tomorrow. You won't need to start over as your business scales.",
    },
    {
      title: "Practical",
      copy: "No unnecessary complexity, no features you'll never use. Just the systems your business needs to run better.",
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Complimentary offer
// ---------------------------------------------------------------------------

export const COMPLIMENTARY_OFFER = {
  headline: "Need a Website? Let Us Build It.",
  offerLine: "We'll build your flagship website free: you only pay for the domain.",
  support:
    "Tell us about your business. If you're a good fit, we'll discuss how we can build and launch a professional website around your business.",
  cta: "See If We're a Good Fit",
} as const;

// ---------------------------------------------------------------------------
// How it works
// ---------------------------------------------------------------------------

export const HOW_IT_WORKS = {
  headline: "From Idea to Launch.",
  cta: "Start a Conversation",
  steps: [
    {
      number: 1,
      title: "Talk",
      copy: "Start a conversation on Messenger, Viber, or WhatsApp and tell us about your business.",
    },
    {
      number: 2,
      title: "Understand",
      copy: "We ask questions about how your business actually runs, not just what you think you want built.",
    },
    {
      number: 3,
      title: "Recommend",
      copy: "We recommend the right solution for your business and budget, not the most expensive one.",
    },
    {
      number: 4,
      title: "Build",
      copy: "We design and build your website or system, keeping you in the loop the whole way.",
    },
    {
      number: 5,
      title: "Launch",
      copy: "We launch your site or system and make sure it's working the way your business needs it to.",
    },
    {
      number: 6,
      title: "Grow",
      copy: "We're available as your business grows and your needs change. This isn't a one-and-done handoff.",
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Industries
// ---------------------------------------------------------------------------

export const INDUSTRIES = {
  headline: "Built for Businesses Like Yours.",
  line: "Don't see your industry? That's okay. Tell us what your business needs.",
  cta: "Tell Us About Your Business",
  items: [
    "Automotive & Motorcycle Dealers",
    "Lending & Financing",
    "Salons & Spas",
    "Clinics & Wellness",
    "Home & Trade Services",
    "Retail & E-commerce",
    "Entertainment & Events",
    "Professional Services",
  ],
} as const;

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export const FAQ = {
  headline: "Frequently Asked Questions",
  items: [
    {
      q: "What exactly does Altaventures build?",
      a: "Websites, booking and scheduling systems, business management tools, e-commerce, and general business digitalization: whatever your business needs to run better online.",
    },
    {
      q: "Is the free website offer really free?",
      a: "Yes. We'll build your flagship website at no development cost: you only pay for the domain. We'll discuss the details once we understand your business and confirm it's a good fit.",
    },
    {
      q: "How long does a project take?",
      a: "It depends on the scope: a business website typically moves faster than a full management system. We'll give you a realistic timeline once we understand what you need.",
    },
    {
      q: "Do I need to know what I want built before I talk to you?",
      a: "No. Most clients start with a problem, not a spec. Tell us what's not working and we'll help figure out what to build.",
    },
    {
      q: "Can you work with my existing systems or processes?",
      a: "Often, yes. We design around how your business actually operates rather than asking you to change everything to fit our tools.",
    },
    {
      q: "How do I get started?",
      a: "Start a conversation on Messenger, Viber, or WhatsApp. Tell us a little about your business and we'll take it from there.",
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Final CTA
// ---------------------------------------------------------------------------

export const FINAL_CTA = {
  headline: "Ready to Build Something Better?",
  sub: "Your business deserves more than a Facebook page. Let's talk about what you actually need.",
  cta: "Let's Talk About Your Business",
  channelsLine: "Messenger | Viber | WhatsApp",
} as const;

// ---------------------------------------------------------------------------
// About, TODO(about): open item #1, placeholder pending real copy
// ---------------------------------------------------------------------------

export const ABOUT = {
  headline: "About Altaventures",
  body: [
    "Altaventures was born from our founder's experience building his first business and discovering how difficult it was to access affordable digital tools and meaningful support.",
    "The tools that could help were often expensive, complicated, or offered little support for businesses ready to grow. Free options existed, but they rarely went beyond the basics.",
    "That's why we built Altaventures.",
    "We help businesses take advantage of technology, build their digital presence, and develop practical business systems without adding unnecessary overhead or complexity.",
    "We build the engine. You drive the business. Together, we grow.",
  ],
} as const;

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

export const FOOTER = {
  tagline: BRAND.tagline,
  legalName: BRAND.legalName,
  supportingStatement:
    "Websites, booking systems, business management tools, and digitalization for Philippine businesses.",
  linkGroups: {
    site: [
      { label: "Services", href: "#services" },
      { label: "Work", href: "#work" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "About", href: "#about" },
    ],
  },
  legalLinks: [
    { label: "Privacy Policy", id: "privacy" as const },
    { label: "Terms of Service", id: "terms" as const },
  ],
} as const;

// ---------------------------------------------------------------------------
// Legal (open item #6, RESOLVED): real Privacy Policy + Terms of Service
// supplied by client. Structured as sections of blocks (paragraph /
// subheading / list) so LegalModal can render real document structure
// instead of flattening everything to plain paragraphs.
// ---------------------------------------------------------------------------

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "sh"; text: string }
  | { kind: "ul"; items: string[] };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

const p = (text: string): LegalBlock => ({ kind: "p", text });
const sh = (text: string): LegalBlock => ({ kind: "sh", text });
const ul = (items: string[]): LegalBlock => ({ kind: "ul", items });

export const LEGAL: {
  privacy: {
    title: string;
    effectiveDate: string;
    lastUpdated: string;
    intro: LegalBlock[];
    sections: LegalSection[];
  };
  terms: {
    title: string;
    effectiveDate: string;
    lastUpdated: string;
    intro: LegalBlock[];
    sections: LegalSection[];
  };
} = {
  privacy: {
    title: "Privacy Policy",
    effectiveDate: "July 10, 2026",
    lastUpdated: "July 10, 2026",
    intro: [
      p(
        'Altaventures Business Development Services, operating under the brand name Altaventures ("Altaventures," "we," "us," or "our"), respects your privacy and is committed to protecting the personal information you provide to us.',
      ),
      p(
        "This Privacy Policy explains how we collect, use, disclose, retain, and protect personal information when you visit or interact with the Altaventures website.",
      ),
      p(
        "This Privacy Policy is intended to comply with the applicable requirements of the Data Privacy Act of 2012 (Republic Act No. 10173) and its implementing rules and regulations. The Data Privacy Act requires personal information processing to observe the principles of transparency, legitimate purpose, and proportionality.",
      ),
      p(
        "By using our website or voluntarily providing your personal information to us, you acknowledge this Privacy Policy.",
      ),
    ],
    sections: [
      {
        heading: "1. Who We Are",
        blocks: [
          p(
            "Personal Information Controller: Altaventures Business Development Services, operating as Altaventures, Philippines.",
          ),
          p("For privacy-related concerns, requests, or questions, you may contact us through:"),
          p("Privacy Contact: altasmeworks@gmail.com"),
          p(
            "You may also contact us through the Messenger, Viber, or WhatsApp channels provided on our website.",
          ),
        ],
      },
      {
        heading: "2. What Personal Information We Collect",
        blocks: [
          p(
            "We only collect personal information that is reasonably necessary for the purposes described in this Privacy Policy.",
          ),
          p("Depending on how you interact with us, we may collect the following:"),
          sh("Information You Voluntarily Provide"),
          p("This may include:"),
          ul([
            "Full name",
            "Business name",
            "Job title or position",
            "Email address",
            "Mobile or telephone number",
            "Business location",
            "Social media profile or business page",
            "Website address",
            "Business information",
            "Industry",
            "Products or services offered",
            "Project requirements",
            "Information about your current digital presence",
            "Information you provide when asking about our services",
            "Other information you voluntarily provide during a business inquiry",
          ]),
          sh("Communication Information"),
          p(
            "If you contact us through Messenger, Viber, WhatsApp, email, or another communication channel, we may process information contained in those communications.",
          ),
          p("This may include:"),
          ul([
            "Your name or account name",
            "Contact details",
            "Messages",
            "Attachments",
            "Business information",
            "Project requirements",
            "Other information you voluntarily provide",
          ]),
          p(
            "Please avoid sending passwords, payment credentials, highly sensitive personal information, or other information that is not necessary for your inquiry through general messaging channels.",
          ),
        ],
      },
      {
        heading: "3. Information Collected Automatically",
        blocks: [
          p(
            "When you visit our website, certain technical information may be collected automatically by our website, hosting provider, analytics services, security tools, or other technologies.",
          ),
          p("Depending on the technologies implemented on the website, this may include:"),
          ul([
            "IP address",
            "Browser type",
            "Operating system",
            "Device type",
            "Approximate location",
            "Pages visited",
            "Date and time of visit",
            "Referring website or platform",
            "Links or buttons clicked",
            "Website interaction data",
            "Device and connection information",
            "Other technical information necessary for website operation, security, analytics, and performance",
          ]),
          p(
            "This information may be collected through cookies, analytics technologies, server logs, pixels, or similar technologies.",
          ),
          p(
            "The exact information collected may vary depending on the website technology and third-party services in use.",
          ),
        ],
      },
      {
        heading: "4. How We Collect Information",
        blocks: [
          p("We may collect personal information when you:"),
          ul([
            "Visit our website",
            "Contact us through Messenger",
            "Contact us through Viber",
            "Contact us through WhatsApp",
            "Contact us through email",
            "Submit information through a website form",
            "Request information about our services",
            "Apply for a complimentary website opportunity",
            "Discuss a potential project with us",
            "Communicate with us regarding an existing project",
            "Voluntarily provide information through another legitimate communication channel",
          ]),
          p(
            "We may also receive limited information from third-party platforms when you interact with Altaventures through those platforms, subject to the platform's own privacy policies and your settings.",
          ),
        ],
      },
      {
        heading: "5. Why We Collect Your Information",
        blocks: [
          p("We may process your personal information for legitimate and specified purposes, including:"),
          sh("Responding to inquiries"),
          p("To respond to questions, messages, project requests, and service inquiries."),
          sh("Understanding your business"),
          p(
            "To understand your business, industry, goals, requirements, and current digital processes so that we can determine whether our services are appropriate.",
          ),
          sh("Evaluating potential projects"),
          p("To assess project requirements, suitability, scope, and feasibility."),
          sh("Providing proposals"),
          p("To prepare recommendations, quotations, proposals, project plans, or other information requested by you."),
          sh("Communicating with you"),
          p("To communicate regarding an inquiry, project, request, or other legitimate business interaction."),
          sh("Providing services"),
          p("If you become a client, we may process relevant information necessary to perform the services agreed upon with you."),
          sh("Improving our website"),
          p("To understand how visitors use our website and improve its content, functionality, usability, and performance."),
          sh("Security"),
          p("To detect, prevent, investigate, and respond to fraud, abuse, unauthorized access, security incidents, and other threats."),
          sh("Legal and regulatory compliance"),
          p("To comply with applicable legal obligations, lawful requests, and regulatory requirements."),
        ],
      },
      {
        heading: "6. Legal Basis for Processing",
        blocks: [
          p(
            "Depending on the circumstances, Altaventures may process personal information based on one or more lawful bases recognized under applicable Philippine data privacy law.",
          ),
          p("These may include:"),
          sh("Consent"),
          p("Where you voluntarily provide consent for a specific processing activity."),
          sh("Contract or steps prior to entering into a contract"),
          p(
            "Where processing is necessary to provide a service, prepare for a potential engagement, respond to your request, or take steps at your request before entering into an agreement.",
          ),
          sh("Legal obligation"),
          p("Where processing is necessary to comply with a legal or regulatory obligation."),
          sh("Legitimate interests"),
          p("Where processing is necessary for legitimate business purposes and does not override your fundamental rights and freedoms."),
          sh("Other lawful bases"),
          p("Where another lawful basis recognized under the Data Privacy Act and its implementing rules applies."),
          p(
            "The Data Privacy Act recognizes several lawful bases for processing personal information, including consent, contractual necessity, legal obligations, and legitimate interests in applicable circumstances.",
          ),
        ],
      },
      {
        heading: "7. Direct Marketing",
        blocks: [
          p("Altaventures may use contact information for legitimate business communications where permitted by applicable law."),
          p("For example, we may send information relating to:"),
          ul([
            "Services you have asked about",
            "Project-related communications",
            "Relevant service updates",
            "Business announcements",
            "Promotional information",
          ]),
          p(
            "Where processing for direct marketing relies on consent, you may withdraw that consent or object to the processing as provided by applicable law.",
          ),
          p(
            "You may contact us using the privacy contact details provided in this Privacy Policy to request that we stop sending direct marketing communications.",
          ),
          p(
            "The National Privacy Commission recognizes the right of data subjects to object to processing for direct marketing in applicable circumstances.",
          ),
        ],
      },
      {
        heading: "8. Cookies and Similar Technologies",
        blocks: [
          p("Our website may use cookies and similar technologies."),
          p("Cookies are small data files stored on your device that may help us:"),
          ul([
            "Keep the website functioning",
            "Remember certain preferences",
            "Understand website traffic",
            "Measure website performance",
            "Improve user experience",
            "Detect security issues",
            "Understand which pages and features are useful",
            "Measure the effectiveness of our marketing",
          ]),
          p(
            "Depending on the services implemented on the website, cookies or similar technologies may be provided by Altaventures or third-party service providers.",
          ),
          p("You may be able to control or disable certain cookies through your browser settings."),
          p("However, disabling certain cookies may affect website functionality."),
          p("Where required by applicable law, we will provide appropriate notice or obtain consent for applicable cookie-based processing."),
        ],
      },
      {
        heading: "9. Analytics",
        blocks: [
          p("We may use analytics services to understand how visitors interact with our website."),
          p("Analytics information may include:"),
          ul([
            "Pages visited",
            "Traffic sources",
            "Device type",
            "Browser information",
            "Approximate geographic information",
            "Session information",
            "Website interactions",
            "Conversion events",
          ]),
          p("Analytics are used to:"),
          ul([
            "Improve the website",
            "Understand visitor behavior",
            "Measure marketing performance",
            "Improve our services",
            "Identify technical issues",
            "Understand which content is useful to visitors",
          ]),
          p("Where third-party analytics services are used, their processing may also be governed by their respective privacy policies and terms."),
        ],
      },
      {
        heading: "10. Marketing and Conversion Tracking",
        blocks: [
          p(
            "We may use marketing and conversion-tracking technologies to understand how visitors arrive at our website and whether they interact with important features.",
          ),
          p("Depending on the tools implemented, these may include technologies provided by:"),
          ul(["Meta", "Google", "Other advertising or analytics providers"]),
          p("These technologies may help us measure actions such as:"),
          ul([
            "Website visits",
            "CTA clicks",
            "Messenger clicks",
            "Viber clicks",
            "WhatsApp clicks",
            "Project page views",
            "Service interactions",
            "Other conversion events",
          ]),
          p("We will implement such technologies in accordance with applicable privacy requirements and the relevant provider's policies."),
        ],
      },
      {
        heading: "11. Third-Party Communication Platforms",
        blocks: [
          p("Our website may allow you to contact Altaventures through:"),
          ul(["Messenger", "Viber", "WhatsApp"]),
          p("These services are operated by third parties."),
          p(
            "When you choose to contact us through one of these platforms, information you provide may be processed by both Altaventures and the relevant platform.",
          ),
          p(
            "Altaventures does not control the privacy practices, security measures, data retention, or processing practices of these third-party platforms.",
          ),
          p("Your use of these platforms is also subject to their respective terms and privacy policies."),
          p("You should review the applicable third-party privacy policies before using those services."),
        ],
      },
      {
        heading: "12. Who May Receive Your Information",
        blocks: [
          p("We do not sell your personal information."),
          p("We may disclose or provide access to personal information to appropriate recipients where necessary for legitimate purposes, including:"),
          sh("Service providers"),
          p("Third-party providers that help us operate our website or business, such as:"),
          ul([
            "Website hosting providers",
            "Cloud storage providers",
            "Analytics providers",
            "Communication providers",
            "Email providers",
            "Security providers",
            "Software providers",
            "Technical service providers",
          ]),
          sh("Professional advisers"),
          p("Where reasonably necessary, information may be disclosed to professional advisers such as legal, accounting, compliance, or similar advisers."),
          sh("Government or regulatory authorities"),
          p("Where disclosure is required or permitted by applicable law, regulation, lawful order, or government authority."),
          sh("Business transactions"),
          p(
            "Where reasonably necessary in connection with a merger, acquisition, restructuring, sale, transfer, or similar business transaction, subject to applicable privacy requirements.",
          ),
          p(
            "Third parties receiving personal information will only receive information reasonably necessary for the relevant purpose, subject to applicable legal requirements and appropriate safeguards.",
          ),
        ],
      },
      {
        heading: "13. International Data Transfers",
        blocks: [
          p("Some third-party service providers used by Altaventures may store or process information outside the Philippines."),
          p(
            "Where applicable, we will take reasonable measures to ensure that personal information is processed with appropriate safeguards and in accordance with applicable privacy laws.",
          ),
          p("The location of data processing may change as our technology providers and systems evolve."),
        ],
      },
      {
        heading: "14. Data Security",
        blocks: [
          p(
            "Altaventures takes reasonable organizational, physical, and technical measures to protect personal information against unauthorized access, disclosure, alteration, loss, misuse, or destruction.",
          ),
          p("Security measures may include:"),
          ul([
            "Access controls",
            "Authentication controls",
            "Secure hosting",
            "Encryption where appropriate",
            "Backups",
            "Security monitoring",
            "Software updates",
            "Limited access to personal information",
            "Appropriate internal procedures",
          ]),
          p("However, no internet-based service or storage system can guarantee absolute security."),
          p("We therefore cannot guarantee that information transmitted through the internet will always be completely secure."),
          p(
            "The Data Privacy Act and its implementing rules require appropriate safeguards while recognizing the need for reasonable and appropriate organizational, physical, and technical measures.",
          ),
        ],
      },
      {
        heading: "15. Data Retention",
        blocks: [
          p(
            "We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, unless a longer retention period is required or permitted by law.",
          ),
          p("Retention periods may depend on:"),
          ul([
            "The nature of the information",
            "The purpose for which it was collected",
            "Whether you become a client",
            "Whether there is an ongoing business relationship",
            "Legal or regulatory requirements",
            "Accounting and recordkeeping requirements",
            "Dispute resolution requirements",
            "Security and fraud-prevention requirements",
          ]),
          p(
            "When personal information is no longer reasonably required, we will take reasonable steps to securely delete, destroy, anonymize, or otherwise dispose of it, subject to applicable legal and operational requirements.",
          ),
        ],
      },
      {
        heading: "16. Data Subject Rights",
        blocks: [
          p("Under applicable Philippine data privacy law, you may have rights relating to your personal information."),
          p("These may include:"),
          sh("Right to be informed"),
          p("You have the right to know whether your personal information is being processed and to receive appropriate information about that processing."),
          sh("Right to access"),
          p("You may request access to personal information we process about you, subject to applicable limitations."),
          sh("Right to correction or rectification"),
          p("You may request correction of inaccurate or incomplete personal information."),
          sh("Right to object"),
          p("You may object to certain processing activities where the right applies."),
          sh("Right to erasure or blocking"),
          p("You may request the deletion, destruction, or blocking of personal information where legally applicable."),
          sh("Right to data portability"),
          p("Where applicable, you may have the right to obtain and electronically move certain personal information."),
          sh("Right to file a complaint"),
          p("You may have the right to file a complaint with the National Privacy Commission if you believe your privacy rights have been violated."),
          sh("Right to damages"),
          p("You may have the right to seek compensation where provided by applicable law."),
          p("The National Privacy Commission identifies these among the rights available to data subjects under the Data Privacy Act."),
        ],
      },
      {
        heading: "17. Withdrawing Consent",
        blocks: [
          p("Where processing is based on your consent, you may withdraw your consent at any time, subject to applicable law."),
          p("Withdrawal of consent does not affect the lawfulness of processing that occurred before withdrawal."),
          p("In some circumstances, we may continue processing information where another lawful basis applies, such as contractual necessity or a legal obligation."),
        ],
      },
      {
        heading: "18. How to Exercise Your Rights",
        blocks: [
          p(
            "To request access, correction, deletion, objection, portability, withdrawal of consent, or other privacy-related assistance, contact us using:",
          ),
          p("Privacy Contact: altasmeworks@gmail.com"),
          p("Please provide enough information for us to:"),
          ul(["Identify you", "Understand your request", "Locate the relevant information", "Respond appropriately"]),
          p("We may request reasonable information necessary to verify your identity before processing certain requests."),
          p("This is intended to prevent unauthorized individuals from gaining access to or modifying personal information."),
        ],
      },
      {
        heading: "19. Response to Privacy Requests",
        blocks: [
          p("We will review privacy requests and respond within the period required by applicable law and regulations."),
          p("Certain requests may be subject to lawful limitations or exceptions."),
          p(
            "For example, we may be unable to immediately delete information where retention is necessary to comply with a legal obligation, establish or defend a legal claim, prevent fraud, or fulfill another lawful purpose.",
          ),
          p("Where we cannot fully comply with a request, we will explain the applicable reason where legally permitted."),
        ],
      },
      {
        heading: "20. Children's Privacy",
        blocks: [
          p("Our website is intended primarily for businesses and business decision-makers."),
          p("We do not knowingly seek to collect personal information from children for purposes unrelated to legitimate business activities."),
          p(
            "If you believe a child has provided personal information to us without appropriate authorization, please contact us so that we can review the matter and take appropriate action where required.",
          ),
        ],
      },
      {
        heading: "21. Third-Party Websites",
        blocks: [
          p("Our website may contain links to third-party websites, social media platforms, communication platforms, or other services."),
          p("We are not responsible for the privacy practices, security, content, or policies of those third parties."),
          p("We encourage you to review the privacy policies of third-party services before providing personal information through them."),
        ],
      },
      {
        heading: "22. Portfolio and Client Information",
        blocks: [
          p("Our website may display information about projects developed by Altaventures."),
          p(
            "Where portfolio materials contain information belonging to clients or third parties, Altaventures will handle such information in accordance with applicable agreements and permissions.",
          ),
          p("We do not intentionally publish confidential client information through our portfolio."),
          p("If you believe that information displayed on our website improperly contains personal or confidential information, please contact us immediately."),
        ],
      },
      {
        heading: "23. Business Inquiries and Project Information",
        blocks: [
          p("Information provided to us during a project inquiry may be used to:"),
          ul([
            "Understand the business",
            "Assess requirements",
            "Prepare recommendations",
            "Prepare proposals",
            "Estimate project scope",
            "Determine project suitability",
            "Communicate with the prospective client",
            "Develop or deliver agreed services",
          ]),
          p("Information provided for a potential project does not automatically create a client relationship."),
          p("Specific project information may be subject to additional contractual confidentiality and data-processing arrangements where applicable."),
        ],
      },
      {
        heading: "24. No Sale of Personal Information",
        blocks: [
          p("Altaventures does not sell personal information to third parties."),
          p("We may use third-party service providers to operate our website, communications, analytics, security, and business systems."),
          p("Such providers may process information on our behalf or independently in accordance with their respective services and applicable terms."),
        ],
      },
      {
        heading: "25. Privacy and Security Incidents",
        blocks: [
          p(
            "If we become aware of a personal data breach or security incident affecting personal information, we will assess and respond to the incident in accordance with applicable law and regulatory requirements.",
          ),
          p(
            "Where notification is legally required, we will provide the required notification to affected data subjects and/or the National Privacy Commission within the applicable requirements.",
          ),
          p(
            "The National Privacy Commission has emphasized that unauthorized access, use, disclosure, or dissemination of personal data may result in liability under the Data Privacy Act and other applicable laws.",
          ),
        ],
      },
      {
        heading: "26. Changes to This Privacy Policy",
        blocks: [
          p("We may update this Privacy Policy from time to time to reflect:"),
          ul([
            "Changes to our services",
            "Changes to our website",
            "Changes to technology",
            "Changes to third-party providers",
            "Changes to applicable laws",
            "Changes to our data-processing practices",
            "Other operational requirements",
          ]),
          p('When we make material changes, we will update the "Last Updated" date and provide additional notice where required by applicable law.'),
          p("We encourage you to review this Privacy Policy periodically."),
        ],
      },
      {
        heading: "27. Contact Us",
        blocks: [
          p(
            "If you have questions, concerns, requests, or complaints regarding this Privacy Policy or the way Altaventures processes personal information, please contact us:",
          ),
          p("Altaventures Business Development Services, Philippines."),
          p("Privacy Contact: altasmeworks@gmail.com"),
          p("You may also contact us through the Messenger, Viber, or WhatsApp channels available on our website."),
        ],
      },
      {
        heading: "28. National Privacy Commission",
        blocks: [
          p(
            "If you believe that your data privacy rights have been violated and the matter cannot be resolved directly with Altaventures, you may have the right to lodge a complaint with the National Privacy Commission of the Philippines, subject to applicable procedures and requirements.",
          ),
          p("Official National Privacy Commission information is available through its website."),
        ],
      },
      {
        heading: "29. Effective Date",
        blocks: [
          p(
            "This Privacy Policy applies to personal information processed through the Altaventures website and related website interactions from the effective date onward.",
          ),
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    effectiveDate: "July 10, 2026",
    lastUpdated: "July 10, 2026",
    intro: [
      p(
        'Welcome to the website of Altaventures Business Development Services, operating under the brand name Altaventures ("Altaventures," "we," "us," or "our").',
      ),
      p(
        'These Terms of Service ("Terms") govern your access to and use of the Altaventures website, including its content, project portfolio, service information, contact features, complimentary website offer, and other features made available through the website.',
      ),
      p("By accessing or using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms."),
      p("If you do not agree with these Terms, please do not use the website."),
    ],
    sections: [
      {
        heading: "1. About Altaventures",
        blocks: [
          p("Altaventures Business Development Services provides business development and digital solutions to businesses, including but not limited to:"),
          ul([
            "Business website development",
            "E-commerce solutions",
            "Booking and scheduling systems",
            "Business management systems",
            "Customer relationship management systems",
            "Digital business tools",
            "Customer portals",
            "Digital forms and workflows",
            "Business digitalization",
            "Custom software and digital solutions",
            "Third-party integrations",
            "Other digital solutions based on individual business requirements",
          ]),
          p("The services displayed on this website are provided for general information and do not constitute a binding offer to provide any particular service."),
          p(
            "Specific services, features, pricing, timelines, deliverables, ownership arrangements, and other project terms will be determined separately between Altaventures and the client.",
          ),
        ],
      },
      {
        heading: "2. Use of This Website",
        blocks: [
          p("You may use this website for lawful purposes and in accordance with these Terms."),
          p("You agree not to:"),
          ul([
            "Use the website for any unlawful or fraudulent purpose",
            "Attempt to gain unauthorized access to the website or its systems",
            "Interfere with or disrupt website operations",
            "Introduce malicious code, malware, viruses, or other harmful material",
            "Scrape, copy, reproduce, or systematically extract website content without authorization",
            "Misrepresent your identity or affiliation with another person or organization",
            "Use information obtained from the website to impersonate Altaventures",
            "Attempt to circumvent security or access controls",
            "Use the website in a manner that may damage, disable, overburden, or impair its operation",
            "Use the website or its content in violation of applicable Philippine laws or regulations",
          ]),
          p("We reserve the right to restrict or terminate access to the website where we reasonably believe these Terms have been violated."),
        ],
      },
      {
        heading: "3. Website Content",
        blocks: [
          p("The content published on this website may include:"),
          ul([
            "Text",
            "Images",
            "Graphics",
            "Videos",
            "Project screenshots",
            "Case studies",
            "Service descriptions",
            "Logos",
            "Illustrations",
            "Software interface previews",
            "Other materials",
          ]),
          p("We make reasonable efforts to keep website information accurate and current."),
          p("However, information on the website may change without prior notice."),
          p("We do not guarantee that:"),
          ul([
            "All information is complete",
            "All information is current at all times",
            "All information is error-free",
            "Every feature described will be available for every project",
            "Every service shown will be available at all times",
            "Project examples represent the exact scope or functionality that will be provided to another client",
          ]),
          p("Specific project requirements will always be determined during the project discussion and formal engagement process."),
        ],
      },
      {
        heading: "4. Project Portfolio",
        blocks: [
          p("The website may display projects previously developed by Altaventures, including:"),
          ul(["Setmona", "Altamotors", "Kolekta", "Vocalyze"]),
          p("These projects are presented to demonstrate Altaventures' capabilities and experience."),
          p(
            "Project descriptions, screenshots, features, and other information may represent completed work, current functionality, planned functionality, or future development depending on the project.",
          ),
          p("A portfolio project does not guarantee that:"),
          ul([
            "The same system will be suitable for your business",
            "The same features will be included in your project",
            "The same technology will be used",
            "Your project will have the same functionality",
            "Your project will have the same cost or development timeline",
          ]),
          p("Each project is assessed based on the client's individual requirements."),
        ],
      },
      {
        heading: "5. Complimentary Website Offer",
        blocks: [
          p("Altaventures may periodically offer selected businesses a complimentary website build and launch or similar promotional offer."),
          p("The offer is subject to qualification, availability, project suitability, capacity, and other conditions determined by Altaventures."),
          sh("Important conditions"),
          p("The complimentary offer:"),
          ul([
            "Is not automatically available to every applicant",
            "Does not guarantee acceptance",
            "Does not guarantee a particular design, functionality, technology, or scope",
            "May be subject to reasonable project limitations",
            "May require the client to provide content, images, branding materials, business information, approvals, and other necessary materials",
            "May be subject to a separate project agreement",
            "Does not necessarily include third-party fees, paid software, premium services, domain registration, hosting, payment processing fees, messaging fees, or other external costs unless expressly agreed",
            "May be withdrawn, modified, suspended, or discontinued at any time",
          ]),
          p("Altaventures reserves the right to determine whether a business is suitable for the complimentary website offer."),
        ],
      },
      {
        heading: "6. No Guarantee of Acceptance",
        blocks: [
          p("Submitting an inquiry, contacting Altaventures, or expressing interest in the complimentary website offer does not create a client relationship."),
          p("Altaventures may decline a project or offer at its discretion, including where:"),
          ul([
            "The project is outside our current capabilities",
            "The project is not commercially or operationally suitable",
            "The required scope is substantially beyond the offer",
            "The project cannot reasonably be completed within available capacity",
            "Required information or materials are not provided",
            "The project presents legal, technical, security, ethical, or operational concerns",
            "The project does not align with our current business focus",
          ]),
        ],
      },
      {
        heading: "7. Communication Through Messenger, Viber, and WhatsApp",
        blocks: [
          p(
            "The website may provide links or buttons allowing visitors to contact Altaventures through third-party communication platforms, including Messenger, Viber, and WhatsApp.",
          ),
          p("These platforms are operated by independent third parties."),
          p("Your use of those platforms is subject to their respective terms, privacy policies, security practices, and other applicable conditions."),
          p("Altaventures does not control:"),
          ul([
            "The availability of these platforms",
            "Their functionality",
            "Their security infrastructure",
            "Their privacy practices",
            "Their data retention practices",
            "Their service interruptions",
          ]),
          p("Information voluntarily provided through these platforms may be processed for purposes such as:"),
          ul([
            "Responding to your inquiry",
            "Understanding your business requirements",
            "Evaluating project suitability",
            "Preparing a proposal",
            "Communicating regarding a potential or existing project",
          ]),
          p("For information about how Altaventures processes personal information, please refer to our Privacy Policy."),
        ],
      },
      {
        heading: "8. Personal Information",
        blocks: [
          p("When you contact Altaventures or interact with certain features of the website, you may voluntarily provide personal information such as:"),
          ul([
            "Name",
            "Business name",
            "Contact information",
            "Email address",
            "Social media information",
            "Business information",
            "Project requirements",
            "Other information necessary to respond to your inquiry",
          ]),
          p(
            "Altaventures processes personal information in accordance with applicable Philippine data protection laws, including the Data Privacy Act of 2012 (Republic Act No. 10173) and applicable rules and regulations.",
          ),
          p("Personal information will be processed only for legitimate and specified purposes and in accordance with applicable privacy principles."),
          p("For more information, please refer to the Altaventures Privacy Policy."),
        ],
      },
      {
        heading: "9. Intellectual Property",
        blocks: [
          p("Unless otherwise stated, the website and its contents are owned by or licensed to Altaventures and are protected by applicable intellectual property laws."),
          p("This includes, where applicable:"),
          ul([
            "Website design",
            "Branding",
            "Logos",
            "Text",
            "Graphics",
            "Original illustrations",
            "Images",
            "Website layouts",
            "Original code",
            "Software interfaces",
            "Other original materials",
          ]),
          p("You may view the website and its content for personal or legitimate business evaluation purposes."),
          p(
            "You may not reproduce, modify, distribute, publicly display, sell, license, publish, or commercially exploit Altaventures' proprietary website content without prior written permission.",
          ),
        ],
      },
      {
        heading: "10. Client and Third-Party Materials",
        blocks: [
          p("Portfolio projects may contain materials owned by Altaventures' clients or third parties."),
          p("These may include:"),
          ul(["Client logos", "Brand assets", "Product images", "Business photographs", "Trademarks", "Third-party software interfaces", "Third-party content"]),
          p("The display of these materials on the website does not grant you ownership or permission to use them."),
          p("All third-party rights remain with their respective owners."),
        ],
      },
      {
        heading: "11. Trademarks and Branding",
        blocks: [
          p("Altaventures and related branding, names, logos, designs, and marks may be protected by applicable intellectual property laws."),
          p("You may not use Altaventures' name, logo, branding, or other identifying materials in a manner that:"),
          ul([
            "Suggests endorsement",
            "Suggests sponsorship",
            "Suggests an official partnership",
            "Creates confusion regarding affiliation",
            "Misrepresents your relationship with Altaventures",
          ]),
          p("Any such use requires prior written authorization from Altaventures."),
        ],
      },
      {
        heading: "12. Third-Party Services and Links",
        blocks: [
          p("The website may contain links to or integrations with third-party websites, applications, platforms, or services."),
          p("These may include, depending on implementation:"),
          ul(["Messenger", "Viber", "WhatsApp", "Facebook", "Instagram", "Google services", "Analytics services", "Other third-party platforms"]),
          p("These third-party services are not controlled by Altaventures."),
          p("We are not responsible for:"),
          ul(["Their availability", "Their content", "Their security", "Their privacy practices", "Their policies", "Their terms", "Their performance", "Their actions or omissions"]),
          p("Your use of third-party services is subject to the terms and policies of the applicable third-party provider."),
        ],
      },
      {
        heading: "13. Website Availability",
        blocks: [
          p("We aim to keep the website available and operational."),
          p("However, we do not guarantee uninterrupted or error-free access."),
          p("The website may become temporarily unavailable due to:"),
          ul([
            "Maintenance",
            "Updates",
            "Hosting issues",
            "Network problems",
            "Security incidents",
            "Technical failures",
            "Third-party service interruptions",
            "Circumstances beyond our reasonable control",
          ]),
          p("We may modify, suspend, or discontinue any portion of the website at any time."),
        ],
      },
      {
        heading: "14. Security",
        blocks: [
          p("We take reasonable measures to maintain the security and integrity of the website."),
          p("However, no internet-based system can be guaranteed to be completely secure."),
          p("You acknowledge that:"),
          ul([
            "Internet transmission involves inherent risks",
            "Third-party platforms may experience security incidents",
            "No website can guarantee absolute protection from unauthorized access",
            "You should exercise reasonable care when transmitting sensitive information online",
          ]),
          p(
            "You should not submit passwords, payment card information, highly sensitive personal information, or other confidential information through a general website inquiry unless specifically requested through an appropriate secure process.",
          ),
        ],
      },
      {
        heading: "15. Business Information and General Information",
        blocks: [
          p("Information provided through this website is intended for general business and informational purposes."),
          p("Altaventures does not provide:"),
          ul([
            "Legal advice",
            "Tax advice",
            "Accounting advice",
            "Financial advice",
            "Investment advice",
            "Regulatory advice",
            "Professional advice outside the scope of the services expressly agreed with a client",
          ]),
          p("You should obtain appropriate professional advice where necessary."),
        ],
      },
      {
        heading: "16. No Guarantee of Business Results",
        blocks: [
          p("Altaventures may design websites and digital systems intended to improve business visibility, customer experience, operations, or lead generation."),
          p("However, we do not guarantee:"),
          ul([
            "A specific number of customers",
            "A specific number of leads",
            "A specific sales volume",
            "Search engine rankings",
            "Advertising performance",
            "Conversion rates",
            "Revenue increases",
            "Profit increases",
            "Business growth",
            "Specific return on investment",
          ]),
          p(
            "Business results depend on many factors outside Altaventures' control, including market conditions, pricing, competition, advertising, business operations, customer behavior, and the client's own execution.",
          ),
        ],
      },
      {
        heading: "17. Website Services Are Subject to Separate Agreements",
        blocks: [
          p("Information on this website does not replace a formal project agreement."),
          p(
            "If you engage Altaventures for a website, software system, digital solution, or other paid or complimentary project, the specific scope and commercial terms will be established through a separate agreement, proposal, statement of work, or other written arrangement.",
          ),
          p("The applicable project agreement will govern matters such as:"),
          ul([
            "Scope",
            "Deliverables",
            "Timelines",
            "Client responsibilities",
            "Payment",
            "Revisions",
            "Ownership",
            "Licensing",
            "Third-party costs",
            "Hosting",
            "Maintenance",
            "Support",
            "Termination",
            "Other project-specific terms",
          ]),
          p(
            "Where there is a conflict between these website Terms and a specific written project agreement, the project agreement will govern the specific project relationship to the extent of the conflict.",
          ),
        ],
      },
      {
        heading: "18. No Automatic Client Relationship",
        blocks: [
          p(
            "Using this website, submitting an inquiry, communicating through Messenger, Viber, WhatsApp, or another contact method does not automatically establish a contractual client relationship.",
          ),
          p("A client relationship exists only when the parties have agreed to the applicable project or service terms."),
        ],
      },
      {
        heading: "19. User-Submitted Information",
        blocks: [
          p("When you voluntarily submit information to Altaventures, you represent that:"),
          ul([
            "The information you provide is accurate to the best of your knowledge",
            "You have the authority to provide information submitted on behalf of a business or organization",
            "Your submission does not knowingly violate another person's rights",
            "Your submission does not contain unlawful or malicious material",
          ]),
          p("You remain responsible for the information and materials you provide."),
        ],
      },
      {
        heading: "20. Confidential Information",
        blocks: [
          p(
            "Do not submit confidential trade secrets, proprietary business information, credentials, passwords, financial information, or other sensitive information through general website forms or public communication channels unless Altaventures specifically requests such information through an appropriate process.",
          ),
          p(
            "A general inquiry or website interaction does not automatically create a confidentiality obligation concerning information voluntarily disclosed through an unsecured or inappropriate channel.",
          ),
          p("Confidentiality obligations for an actual project will be governed by the applicable project agreement or separate confidentiality agreement, where applicable."),
        ],
      },
      {
        heading: "21. User Feedback and Communication",
        blocks: [
          p(
            "If you voluntarily provide suggestions, feedback, ideas, or recommendations regarding the website or Altaventures' services, Altaventures may use such feedback to improve its services and website, unless otherwise agreed.",
          ),
          p("This does not transfer ownership of your unrelated intellectual property to Altaventures."),
        ],
      },
      {
        heading: "22. Limitation of Liability",
        blocks: [
          p(
            "To the fullest extent permitted by applicable law, Altaventures shall not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from or relating to your use of the website.",
          ),
          p("This may include, where legally permitted:"),
          ul([
            "Loss of profits",
            "Loss of business opportunities",
            "Loss of data",
            "Business interruption",
            "Loss of goodwill",
            "Loss arising from third-party platforms",
            "Loss resulting from website downtime",
            "Loss resulting from reliance on general website information",
          ]),
          p("Nothing in these Terms is intended to exclude or limit liability that cannot legally be excluded or limited under applicable Philippine law."),
        ],
      },
      {
        heading: "23. Indemnification",
        blocks: [
          p(
            "To the extent permitted by applicable law, you agree to indemnify and hold harmless Altaventures, its owners, personnel, contractors, and representatives from claims, liabilities, damages, losses, and reasonable expenses arising from:",
          ),
          ul([
            "Your unlawful use of the website",
            "Your violation of these Terms",
            "Your violation of another person's rights",
            "Your unauthorized use of website content",
            "Your misuse of third-party services accessed through the website",
            "Information or materials you knowingly submit unlawfully",
          ]),
          p("This provision does not require you to indemnify Altaventures for liabilities caused by Altaventures' own unlawful conduct."),
        ],
      },
      {
        heading: "24. Changes to the Website",
        blocks: [
          p("Altaventures may modify, update, replace, or remove website content, features, services, portfolio projects, offers, or other materials at any time."),
          p("We may also introduce new features or discontinue existing features."),
          p("Changes may be made without prior notice where reasonably necessary."),
        ],
      },
      {
        heading: "25. Changes to These Terms",
        blocks: [
          p("Altaventures may update these Terms from time to time."),
          p('When changes are made, the updated version will be posted on this page with a revised "Last Updated" date.'),
          p("Your continued use of the website after the updated Terms become effective constitutes acceptance of the revised Terms, to the extent permitted by applicable law."),
          p("If a material change requires additional notice or consent under applicable law, Altaventures will provide such notice or obtain such consent as required."),
        ],
      },
      {
        heading: "26. Severability",
        blocks: [
          p(
            "If any provision of these Terms is found to be invalid, unlawful, or unenforceable, that provision shall be interpreted or modified to the minimum extent necessary to make it enforceable, where legally permitted.",
          ),
          p("The remaining provisions shall continue in full force and effect."),
        ],
      },
      {
        heading: "27. Waiver",
        blocks: [
          p("Failure by Altaventures to enforce any provision of these Terms does not constitute a waiver of its right to enforce that provision in the future."),
        ],
      },
      {
        heading: "28. Governing Law",
        blocks: [
          p("These Terms shall be governed by and interpreted in accordance with the laws of the Republic of the Philippines, without prejudice to applicable mandatory legal protections."),
          p(
            "Any dispute arising from or relating to these Terms shall be subject to the jurisdiction of the appropriate courts of the Philippines, subject to applicable law and rules on jurisdiction and venue.",
          ),
        ],
      },
      {
        heading: "29. Entire Agreement",
        blocks: [
          p(
            "These Terms, together with the Altaventures Privacy Policy and any applicable project-specific agreement, constitute the applicable terms governing your use of the website and your relationship with Altaventures in connection with website interactions.",
          ),
          p("For actual client projects, the applicable project agreement will contain the specific commercial and project terms."),
        ],
      },
      {
        heading: "30. Contact",
        blocks: [
          p("If you have questions regarding these Terms or would like to discuss a project with Altaventures, you may contact us through the communication channels made available on our website."),
          p("Altaventures Business Development Services, Philippines."),
          p("Messenger, Viber, and WhatsApp are available through the website."),
        ],
      },
      {
        heading: "31. Acceptance",
        blocks: [
          p("By accessing or using the Altaventures website, you acknowledge that you have read and understood these Terms of Service and agree to comply with them."),
        ],
      },
    ],
  },
} as const;
