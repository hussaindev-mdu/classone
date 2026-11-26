/**
 * Editable site copy, from the ClassOne company profile and the client's
 * service brief (26 Nov 2026). Items marked PLACEHOLDER or DRAFT must be
 * confirmed with ClassOne before launch.
 */

export type Service = {
  slug: string;
  name: string;
  /** One-line summary used in lists and cards (client's first sentence). */
  description: string;
  /** Full description from the client's service brief. */
  overview: string;
  includes: string[];
  /** DRAFT COPY: short outcome statements, review with ClassOne before launch. */
  outcomes: string[];
};

export const intro = {
  label: "Company profile",
  headline: "People-centred HR consulting.",
  positioning: "Your Complete HR Consulting Partner",
  positioningText:
    "We partner with startups, SMEs and established organisations to build structured HR functions, strengthen workforce capabilities and establish compliant, efficient people management practices.",
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
  "Our HR service portfolio covers the complete employee lifecycle, from workforce planning and recruitment to employee separation and statutory compliance.";

export const services: Service[] = [
  {
    slug: "hr-strategic-management",
    name: "HR Strategic Management",
    description: "We develop and implement strategic HR frameworks aligned with your business goals.",
    overview:
      "We develop and implement strategic HR frameworks aligned with your business goals. We provide HR advisory, organisational strategy, workforce optimisation and leadership support.",
    includes: [
      "Strategic HR frameworks aligned with business goals",
      "HR advisory",
      "Organisational strategy and workforce optimisation",
      "Leadership support",
    ],
    outcomes: ["HR aligned with business goals", "An optimised workforce", "Confident, supported leadership"],
  },
  {
    slug: "talent-acquisition-workforce-planning",
    name: "Talent Acquisition & Workforce Planning",
    description: "We manage end-to-end recruitment, talent sourcing, screening, interviewing and onboarding.",
    overview:
      "We manage end-to-end recruitment, talent sourcing, screening, interviewing and onboarding. We help businesses plan manpower requirements and build the right workforce.",
    includes: [
      "End-to-end recruitment and talent sourcing",
      "Screening and interviewing",
      "Onboarding",
      "Manpower planning",
    ],
    outcomes: ["The right people in the right roles", "A smoother hiring process", "A clear manpower plan"],
  },
  {
    slug: "hr-policies-procedures-governance",
    name: "HR Policies, Procedures & Employee Governance",
    description: "We design employee handbooks, HR policies, SOPs and workplace guidelines.",
    overview:
      "We design employee handbooks, HR policies, SOPs and workplace guidelines. We support employment governance, statutory compliance and HR documentation.",
    includes: [
      "Employee handbooks and HR policies",
      "SOPs and workplace guidelines",
      "Employment governance and statutory compliance",
      "HR documentation",
    ],
    outcomes: ["Clear, consistent policies", "Compliant HR practices", "Well-kept HR documentation"],
  },
  {
    slug: "hr-operations",
    name: "HR Operations",
    description: "We manage day-to-day HR activities, employee records, onboarding, transfers and exit formalities.",
    overview:
      "We manage day-to-day HR activities, employee records, onboarding, transfers and exit formalities. We streamline HR workflows to improve operational efficiency and accuracy.",
    includes: [
      "Day-to-day HR activities",
      "Employee records management",
      "Onboarding, transfers and exit formalities",
      "Streamlined HR workflows",
    ],
    outcomes: ["Efficient HR operations", "Accurate employee records", "Less admin for managers"],
  },
  {
    slug: "performance-management-system",
    name: "Performance Management System",
    description: "We design performance appraisal frameworks, KPIs, KRAs and employee evaluation processes.",
    overview:
      "We design performance appraisal frameworks, KPIs, KRAs and employee evaluation processes. We support goal setting, performance reviews, feedback and improvement plans.",
    includes: [
      "Performance appraisal frameworks",
      "KPIs, KRAs and evaluation processes",
      "Goal setting and performance reviews",
      "Feedback and improvement plans",
    ],
    outcomes: ["Clear goals for every role", "Fair, consistent reviews", "Performance that improves"],
  },
  {
    slug: "payroll-processing-coordination",
    name: "Payroll Processing & Coordination",
    description: "We provide monthly payroll processing, salary calculations, payslips and payroll reconciliation.",
    overview:
      "We provide monthly payroll processing, salary calculations, payslips and payroll reconciliation. We coordinate payroll inputs, deductions, reimbursements and statutory payroll requirements.",
    includes: [
      "Monthly payroll processing and salary calculations",
      "Payslips and payroll reconciliation",
      "Payroll inputs, deductions and reimbursements",
      "Statutory payroll requirements",
    ],
    outcomes: ["Accurate, on-time payroll", "Reconciled payroll records", "Statutory requirements met"],
  },
  {
    slug: "compensation-benefits",
    name: "Compensation & Benefits",
    description: "We design salary structures, compensation frameworks, incentive plans and employee benefits.",
    overview:
      "We design salary structures, compensation frameworks, incentive plans and employee benefits. We provide CTC analysis, salary benchmarking and compensation advisory services.",
    includes: [
      "Salary structures and compensation frameworks",
      "Incentive plans and employee benefits",
      "CTC analysis and salary benchmarking",
      "Compensation advisory",
    ],
    outcomes: ["Competitive, fair pay", "Structured incentives", "Informed pay decisions"],
  },
  {
    slug: "learning-organisational-development",
    name: "Learning & Organisational Development",
    description: "We identify organisational skill gaps and develop learning strategies.",
    overview:
      "We identify organisational skill gaps and develop learning strategies. We support leadership development, talent development and organisational effectiveness.",
    includes: [
      "Organisational skill-gap analysis",
      "Learning strategies",
      "Leadership and talent development",
      "Organisational effectiveness",
    ],
    outcomes: ["Skill gaps closed", "Stronger leaders", "A more effective organisation"],
  },
  {
    slug: "training-development",
    name: "Training & Development",
    description: "We coordinate employee training programmes, induction, behavioural and technical training.",
    overview:
      "We coordinate employee training programmes, induction, behavioural and technical training. We support training needs analysis, programme evaluation and employee skill enhancement.",
    includes: [
      "Employee training programmes and induction",
      "Behavioural and technical training",
      "Training needs analysis",
      "Programme evaluation and skill enhancement",
    ],
    outcomes: ["Faster ramp-up for new joiners", "Training that meets real needs", "Measurable skill growth"],
  },
  {
    slug: "employee-engagement-welfare",
    name: "Employee Engagement & Welfare",
    description: "We develop employee engagement initiatives, employee welfare programmes and recognition schemes.",
    overview:
      "We develop employee engagement initiatives, employee welfare programmes and recognition schemes. We support employee satisfaction surveys, retention strategies and workplace well-being initiatives.",
    includes: [
      "Employee engagement initiatives",
      "Employee welfare programmes and recognition schemes",
      "Employee satisfaction surveys",
      "Retention strategies and workplace well-being",
    ],
    outcomes: ["A more engaged workforce", "Better retention", "A healthier workplace"],
  },
  {
    slug: "employee-separation-statutory-settlements",
    name: "Employee Separation & Statutory Settlements",
    // DRAFT COPY: the client's text for this service was cut off ("Read more"). Confirm with ClassOne.
    description: "We manage employee separations, exit formalities and full and final settlements.",
    overview:
      "We manage employee separations, exit formalities and full and final settlements. We support statutory settlement requirements and exit documentation.",
    includes: [
      "Employee separation process",
      "Exit formalities",
      "Full and final settlements",
      "Statutory settlement requirements and exit documentation",
    ],
    outcomes: ["Smooth, respectful exits", "Settlements done right", "Compliant exit records"],
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
  { value: 11, suffix: "", label: "HR services" },
  { value: 2, suffix: "", label: "Countries: India & UAE" },
  { value: 3, suffix: "", label: "Ways to engage" },
];

export const processSteps = [
  { title: "Understand", text: "Listen to the business, its people and the immediate challenge." },
  { title: "Design", text: "Build a clear, proportionate plan with practical ownership." },
  { title: "Implement", text: "Support delivery, review progress and improve the process." },
];

/** Client segments, from the client's service positioning. */
export const industries = ["Startups", "SMEs", "Established organisations"];

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

/** Partnership, as stated by ClassOne (26 Nov 2026). Text only: no partner logo without their permission. */
export const partnership = {
  role: "Authorised Franchise / Recruitment Partner",
  partner: "Hirevoo Recruitment and Marketing Private Limited",
  relatedServiceSlug: "talent-acquisition-workforce-planning",
};
