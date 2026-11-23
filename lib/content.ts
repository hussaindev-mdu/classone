/**
 * Editable site copy, taken from the ClassOne Consulting company profile.
 * Items marked PLACEHOLDER must be replaced with real information before launch.
 */

export type Service = {
  slug: string;
  name: string;
  /** One-line summary used in lists and cards. */
  description: string;
  /** Full description from the company profile. */
  overview: string;
  includes: string[];
  /** DRAFT COPY: short outcome statements, review with ClassOne before launch. */
  outcomes: string[];
};

export const intro = {
  label: "Company profile",
  headline: "People-centred HR consulting.",
  subline: "Practical HR partnership for stronger, more capable workplaces.",
  experience:
    "A founder-led HR consulting practice shaped by more than 14 years of experience across India and the UAE.",
};

export const aboutParagraphs = [
  "ClassOne Consulting (OPC) Private Limited is an HR consulting firm founded to help organizations build clear, consistent and people-centred HR practices. The firm brings experienced HR leadership closer to growing businesses through practical advice, structured processes and hands-on support.",
  "Its approach connects people practices with business priorities: attract the right talent, support managers, strengthen employee experience and make HR operations more dependable. Engagements can be shaped around a defined project or ongoing advisory support.",
];

export const vision =
  "To be a trusted HR partner that helps organizations create fair, capable and high-performing workplaces where people and businesses can grow together.";

export const mission =
  "To make effective HR practices accessible and practical for organizations through thoughtful advice, reliable execution and a deep respect for people, performance and local context.";

export const servicesIntro =
  "ClassOne can support clients across the HR lifecycle. The scope is agreed to fit each organization’s size, sector, priorities and applicable local requirements.";

export const services: Service[] = [
  {
    slug: "talent-acquisition-workforce-planning",
    name: "Talent Acquisition & Workforce Planning",
    description: "Recruitment process design, selection guidance and workforce planning.",
    overview:
      "Recruitment process design, role and job description support, interview structure, selection guidance, workforce planning and succession discussions.",
    includes: [
      "Recruitment process design",
      "Role and job description support",
      "Interview structure and selection guidance",
      "Workforce planning and succession discussions",
    ],
    outcomes: ["A clear, repeatable hiring process", "Well-defined roles", "A plan for future workforce needs"],
  },
  {
    slug: "hr-policies-governance-compliance",
    name: "HR Policies, Governance & Compliance Support",
    description: "Policies, documentation reviews, audit readiness and compliance coordination.",
    overview:
      "Policy and procedure development, HR documentation reviews, audit readiness, governance practices and practical compliance coordination. Advice is scoped to the applicable jurisdiction and professional remit.",
    includes: [
      "Policy and procedure development",
      "HR documentation reviews",
      "Audit readiness and governance practices",
      "Practical compliance coordination",
    ],
    outcomes: ["Clear, consistent policies", "Audit-ready HR documentation", "Dependable governance practices"],
  },
  {
    slug: "performance-employee-relations",
    name: "Performance & Employee Relations",
    description: "Performance frameworks, manager guidance, engagement and fair processes.",
    overview:
      "Performance management frameworks, manager guidance, employee engagement, grievance processes, disciplinary process support and workplace investigations.",
    includes: [
      "Performance management frameworks",
      "Manager guidance and employee engagement",
      "Grievance and disciplinary process support",
      "Workplace investigations",
    ],
    outcomes: ["Fair, well-run performance cycles", "Confident managers", "Stronger employee experience"],
  },
  {
    slug: "learning-organizational-development",
    name: "Learning & Organizational Development",
    description: "Training plans, employee development, org design and change support.",
    overview:
      "Learning needs assessment, training plans, employee development, organizational design support, change initiatives and manager capability building.",
    includes: [
      "Learning needs assessment and training plans",
      "Employee development",
      "Organizational design support and change initiatives",
      "Manager capability building",
    ],
    outcomes: ["Training aimed at real needs", "More capable managers", "Structures that support growth"],
  },
  {
    slug: "compensation-benefits-payroll",
    name: "Compensation, Benefits & Payroll Coordination",
    description: "Pay and benefits review, benchmarking and payroll controls.",
    overview:
      "Pay and benefits process review, compensation benchmarking coordination, payroll controls and support for accurate, timely HR administration.",
    includes: [
      "Pay and benefits process review",
      "Compensation benchmarking coordination",
      "Payroll controls",
      "Support for accurate, timely HR administration",
    ],
    outcomes: ["Accurate, timely HR administration", "Stronger payroll controls", "Informed pay decisions"],
  },
  {
    slug: "hr-operations-systems-analytics",
    name: "HR Operations, Systems & Analytics",
    description: "Process improvement, HRIS/ERP support, HR metrics and budgeting.",
    overview:
      "HR process improvement, HRIS/ERP implementation support, HR metrics and MIS reporting, HR budgeting and operational administration.",
    includes: [
      "HR process improvement",
      "HRIS/ERP implementation support",
      "HR metrics and MIS reporting",
      "HR budgeting and operational administration",
    ],
    outcomes: ["More dependable HR operations", "Useful HR reporting", "Systems your team can run"],
  },
];

/** Kept as an alias so existing imports keep working. */
export const allServices = services;

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function serviceNumber(service: Service) {
  return String(services.indexOf(service) + 1).padStart(2, "0");
}

export const engagementOptions = [
  {
    title: "HR diagnostic and roadmap",
    text: "A focused review of current practices with prioritized recommendations.",
  },
  {
    title: "Defined HR project",
    text: "A scoped delivery such as policy refresh, performance cycle setup or recruitment process improvement.",
  },
  {
    title: "Ongoing HR advisory",
    text: "Recurring support for leaders and managers, with agreed availability and priorities.",
  },
];

export const founder = {
  name: "Kumaran Ilangovan",
  role: "Founder & CEO - Principal Consultant",
  bio: [
    "Kumaran is a senior HR professional with more than 14 years of progressive experience in human resources and administration across India and the UAE. He has held HR leadership and business partner roles in multicultural, multinational environments, including group-level responsibility supporting companies in the UAE and India.",
    "His experience spans recruitment, HR strategy, employee relations, performance management, learning and development, compensation and benefits, HR policies, governance, compliance coordination, HR systems, analytics and budgeting. He has partnered with boards, executives, managers and employees to align people practices with operational and business needs.",
  ],
};

export const whyPoints = [
  {
    icon: "person",
    title: "Senior HR perspective",
    text: "Leadership experience across group HR, business partnering and HR operations.",
  },
  {
    icon: "chart",
    title: "Practical implementation",
    text: "Recommendations designed to be usable by managers and HR teams in day-to-day work.",
  },
  {
    icon: "shield",
    title: "Cross-cultural experience",
    text: "First-hand experience supporting people practices in India and the UAE.",
  },
  {
    icon: "partner",
    title: "Joined-up people practices",
    text: "Support that connects recruitment, performance, development, employee relations and HR operations.",
  },
] as const;

/** Figures taken from the company profile. */
export const stats = [
  { value: 14, suffix: "+", label: "Years of HR experience" },
  { value: 6, suffix: "", label: "HR service areas" },
  { value: 2, suffix: "", label: "Countries: India & UAE" },
  { value: 3, suffix: "", label: "Ways to engage" },
];

export const processSteps = [
  { title: "Understand", text: "Listen to the business, its people and the immediate challenge." },
  { title: "Design", text: "Build a clear, proportionate plan with practical ownership." },
  { title: "Implement", text: "Support delivery, review progress and improve the process." },
];

/** PLACEHOLDER: not in the company profile. Edit freely. */
export const industries = [
  "IT & Technology",
  "Manufacturing",
  "Healthcare",
  "Retail",
  "Startups",
  "Finance",
];

/**
 * PLACEHOLDER TESTIMONIALS: these are NOT real client reviews.
 * Replace with genuine, approved client testimonials before launch.
 */
export const testimonials = [
  {
    quote:
      "PLACEHOLDER: ClassOne rebuilt our hiring process and HR policies in one quarter. Our managers finally had a clear, consistent way of working.",
    name: "Client Name",
    role: "Founder, Company Name",
  },
  {
    quote:
      "PLACEHOLDER: Their HR documentation review got us audit-ready without slowing the business down.",
    name: "Client Name",
    role: "Director of Operations, Company Name",
  },
  {
    quote:
      "PLACEHOLDER: Senior HR advice that was practical from day one. Clear answers and real accountability.",
    name: "Client Name",
    role: "CEO, Company Name",
  },
];
