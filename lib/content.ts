/**
 * Editable site copy. Items marked PLACEHOLDER must be replaced with real
 * information before launch.
 */

export type Discipline = "HR Consulting" | "Financial Advisory";

export type Service = {
  slug: string;
  name: string;
  discipline: Discipline;
  description: string;
  /** DRAFT COPY: review with ClassOne before launch. */
  overview: string;
  includes: string[];
  outcomes: string[];
};

export const hrServices: Service[] = [
  {
    slug: "recruitment-talent-acquisition",
    name: "Recruitment & Talent Acquisition",
    discipline: "HR Consulting",
    description: "End-to-end hiring, from role definition to offer, for the people who move your business.",
    overview:
      "We run the full hiring cycle for you: defining the role, sourcing through our network and job platforms, screening, coordinating interviews and closing the offer. You meet only candidates who fit the role, the team and the budget.",
    includes: [
      "Role definition, job descriptions and salary benchmarking",
      "Sourcing, screening and shortlisting",
      "Interview coordination and candidate communication",
      "Offer negotiation, onboarding handover and replacement guarantee",
    ],
    outcomes: ["Shorter time-to-hire", "Better-fit hires who stay", "A repeatable hiring process"],
  },
  {
    slug: "candidate-assessment",
    name: "Candidate Assessment",
    discipline: "HR Consulting",
    description: "Structured interviews and skills testing that separate potential from polish.",
    overview:
      "We design assessments around what the role actually needs: structured interviews, practical skills tests, aptitude and behavioural evaluations. Every candidate is scored against the same criteria, so decisions are fair and defensible.",
    includes: [
      "Competency frameworks for each role",
      "Structured interview guides and scorecards",
      "Technical, aptitude and behavioural testing",
      "Background and reference verification",
    ],
    outcomes: ["Consistent, bias-aware hiring decisions", "Fewer mis-hires", "Clear evidence behind every offer"],
  },
  {
    slug: "learning-development",
    name: "Learning & Development",
    discipline: "HR Consulting",
    description: "Training programmes that build capability where your teams need it most.",
    overview:
      "We identify the skills gaps that hold your teams back and build training around them: leadership development for managers, functional upskilling, and onboarding programmes that get new joiners productive faster.",
    includes: [
      "Training needs analysis",
      "Leadership and manager development programmes",
      "Functional and soft-skills workshops",
      "Onboarding programme design and impact measurement",
    ],
    outcomes: ["Stronger first-line managers", "Faster ramp-up for new hires", "Measurable skills growth"],
  },
  {
    slug: "employee-engagement",
    name: "Employee Engagement",
    discipline: "HR Consulting",
    description: "Culture, feedback and retention frameworks that keep good people committed.",
    overview:
      "We measure how your people really feel, find the drivers behind attrition, and put practical programmes in place: recognition, feedback loops, HR policies and the everyday rituals that make a workplace worth staying in.",
    includes: [
      "Engagement surveys and exit-interview analysis",
      "HR policy and employee handbook design",
      "Recognition and rewards programmes",
      "Manager feedback and grievance frameworks",
    ],
    outcomes: ["Lower attrition", "Higher engagement scores", "A culture people recommend"],
  },
];

export const financeServices: Service[] = [
  {
    slug: "payroll-compensation",
    name: "Payroll & Compensation",
    discipline: "Financial Advisory",
    description: "Accurate, on-time payroll and pay structures that are fair and competitive.",
    overview:
      "We run payroll accurately and on time, with every statutory deduction handled, and design pay structures that are competitive, tax-efficient and fair, so your people are paid correctly and your costs are predictable.",
    includes: [
      "Monthly payroll processing and payslips",
      "PF, ESI, PT and TDS calculation and filing",
      "Salary structuring and compensation benchmarking",
      "Full and final settlements",
    ],
    outcomes: ["Zero-error, on-time payroll", "Statutory filings never missed", "Pay structures that retain talent"],
  },
  {
    slug: "financial-growth-planning",
    name: "Financial Growth & Planning",
    discipline: "Financial Advisory",
    description: "Budgets, forecasts and growth plans grounded in your real numbers.",
    overview:
      "We turn your accounts into a plan: budgets, cash-flow forecasts and growth scenarios that show what you can afford, when to hire, and where the next stage of growth will come from.",
    includes: [
      "Annual budgeting and rolling forecasts",
      "Cash-flow planning and working-capital review",
      "Growth scenarios and investment readiness",
      "Monthly management reporting",
    ],
    outcomes: ["Decisions made on real numbers", "Healthy, predictable cash flow", "A funded growth roadmap"],
  },
  {
    slug: "compliance-risk-management",
    name: "Compliance & Risk Management",
    discipline: "Financial Advisory",
    description: "Statutory compliance, audits and controls handled before they become problems.",
    overview:
      "We keep your business on the right side of labour, tax and corporate regulations with a compliance calendar, regular audits and internal controls, and we fix gaps before they turn into penalties.",
    includes: [
      "Labour-law and statutory compliance audits",
      "Compliance calendar and filing management",
      "Internal controls and process review",
      "Risk assessment and remediation plans",
    ],
    outcomes: ["No surprise penalties", "Audit-ready records", "Clear ownership of every obligation"],
  },
  {
    slug: "performance-financial-strategy",
    name: "Performance & Financial Strategy",
    discipline: "Financial Advisory",
    description: "KPIs and financial strategy that link people performance to business results.",
    overview:
      "We connect how your people perform with how your business performs: KPI frameworks, appraisal systems and incentive plans tied to financial targets, so everyone is pulling toward the same numbers.",
    includes: [
      "KPI and OKR framework design",
      "Performance appraisal systems",
      "Incentive and variable-pay plans",
      "Cost and profitability analysis",
    ],
    outcomes: ["Goals everyone understands", "Pay linked to performance", "Better margins"],
  },
];

export const allServices = [...hrServices, ...financeServices];

export function getService(slug: string) {
  return allServices.find((s) => s.slug === slug);
}

export function serviceNumber(service: Service) {
  return String(allServices.indexOf(service) + 1).padStart(2, "0");
}

export const whyPoints = [
  {
    icon: "partner",
    title: "One partner for HR and finance",
    text: "People and money decisions made together, by one team that sees the whole picture.",
  },
  {
    icon: "shield",
    title: "Compliance first",
    text: "Every engagement starts from statutory and regulatory requirements, not as an afterthought.",
  },
  {
    icon: "chart",
    title: "Data-driven decisions",
    text: "Recommendations backed by your numbers, benchmarks and measurable outcomes.",
  },
  {
    icon: "person",
    title: "A dedicated consultant",
    text: "One named consultant who knows your business and stays accountable from start to finish.",
  },
] as const;

/**
 * PLACEHOLDER NUMBERS: replace with real, verifiable figures before launch.
 */
export const stats = [
  { value: 150, suffix: "+", label: "Clients served" }, // PLACEHOLDER
  { value: 1200, suffix: "+", label: "Placements made" }, // PLACEHOLDER
  { value: 10, suffix: "+", label: "Years of experience" }, // PLACEHOLDER
  { value: 12, suffix: "", label: "Industries served" }, // PLACEHOLDER
];

export const processSteps = [
  { title: "Discovery", text: "We learn your business, goals and constraints." },
  { title: "Assessment", text: "We audit your people, payroll and financial position." },
  { title: "Strategy", text: "We design a clear, prioritised plan of action." },
  { title: "Implementation", text: "We execute alongside your team, on schedule." },
  { title: "Review", text: "We measure results and refine continuously." },
];

/** PLACEHOLDER: edit freely. */
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
      "PLACEHOLDER: ClassOne rebuilt our hiring process and payroll in one quarter. For the first time HR and finance were working from the same plan.",
    name: "Client Name",
    role: "Founder, Company Name",
  },
  {
    quote:
      "PLACEHOLDER: Their compliance review caught issues we didn't know we had, and they fixed them without slowing the business down.",
    name: "Client Name",
    role: "Director of Operations, Company Name",
  },
  {
    quote:
      "PLACEHOLDER: Having one dedicated consultant made all the difference. Clear advice, quick answers and real accountability.",
    name: "Client Name",
    role: "CEO, Company Name",
  },
];
