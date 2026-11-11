import {
  BrainCircuit,
  Building2,
  Cloud,
  Code2,
  Compass,
  Globe,
  Smartphone,
} from 'lucide-react'

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/ai-technology', label: 'AI' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/teams', label: 'Teams' },
  { href: '/insights', label: 'Insights' },
]

export const services = [
  {
    number: '01',
    title: 'Software development',
    description:
      'Thoughtful software engineering shaped around the needs, constraints, and ambitions of your business.',
    href: '/services#software-development',
    icon: Code2,
    detail: 'Service scope to confirm',
  },
  {
    number: '02',
    title: 'AI technology',
    description:
      'A considered path from an emerging idea to a useful, responsible application of artificial intelligence.',
    href: '/ai-technology',
    icon: BrainCircuit,
    detail: 'Current capabilities to confirm',
  },
  {
    number: '03',
    title: 'Technology direction',
    description:
      'Clear technical decisions that help teams make progress with confidence and build for what comes next.',
    href: '/services#technology-direction',
    icon: Compass,
    detail: 'Engagement model to confirm',
  },
]

export const homepageServices = [
  {
    number: '01',
    id: 'ai-automation',
    title: 'AI & Automation',
    description:
      "Use AI to handle repetitive tasks, save your team's time, and make everyday business work easier.",
    points: [
      'Automate repetitive office tasks',
      'Get quick answers from your business data',
      'Reduce manual data entry and errors',
      'Let AI assist your team with everyday work',
    ],
    href: '/ai-technology',
    icon: BrainCircuit,
  },
  {
    number: '02',
    id: 'custom-software-development',
    title: 'Custom Software Development',
    description:
      'Build purpose-fit systems for business processes that off-the-shelf tools cannot support.',
    points: [
      'Product engineering',
      'APIs & integrations',
      'Scalable architecture design',
      'Quality assurance & testing',
    ],
    href: '/services#custom-software-development',
    icon: Code2,
  },
  {
    number: '03',
    id: 'web-application-development',
    title: 'Web Application Development',
    description:
      'Create secure, responsive web applications for customers, staff, and business partners.',
    points: [
      'Web platforms & portals',
      'Responsive product interfaces',
      'Progressive web apps',
      'Performance optimization',
    ],
    href: '/services#web-application-development',
    icon: Globe,
  },
  {
    number: '04',
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    description:
      'Bring essential digital experiences to mobile with fast, intuitive apps for iOS and Android.',
    points: [
      'iOS & Android apps',
      'Cross-platform experiences',
      'App store deployment',
      'Push notifications & analytics',
    ],
    href: '/services#mobile-app-development',
    icon: Smartphone,
  },
  {
    number: '05',
    id: 'enterprise-solutions',
    title: 'Enterprise Solutions',
    description:
      'Connect teams and operations with scalable platforms designed for complex business environments.',
    points: [
      'Enterprise integrations',
      'Modernization & workflows',
      'HRM & CRM systems',
      'Role-based access control',
    ],
    href: '/services#enterprise-solutions',
    icon: Building2,
  },
  {
    number: '06',
    id: 'cloud-data',
    title: 'Cloud & Data',
    description:
      'Build a reliable cloud foundation and turn well-governed data into clearer operational insight.',
    points: [
      'Cloud architecture',
      'Data pipelines & analytics',
      'Cloud migration & DevOps',
      'Data governance & security',
    ],
    href: '/services#cloud-data',
    icon: Cloud,
  },
]

export const faqs = [
  {
    question: 'What services does your company offer?',
    answer:
      'We specialize in mobile app development, web application development, UI/UX design, cross-platform development, and app maintenance & support.',
  },
  {
    question: 'Do you develop both Android and iOS applications?',
    answer:
      'Yes, we develop native and cross-platform applications for both Android and iOS using the latest technologies.',
  },
  {
    question: 'What technologies do you use for app development?',
    answer:
      'We use technologies like Flutter, React Native, Swift, Kotlin, Node.js, React.js, and more, depending on the project requirements.',
  },
  {
    question:
      'Can you build custom applications tailored to our business needs?',
    answer:
      'Absolutely! We provide fully customized app solutions that align with your business goals and user expectations.',
  },
  {
    question: 'Do you offer app maintenance and post-launch support?',
    answer:
      'Yes, we provide ongoing app maintenance, updates, bug fixes, and feature enhancements to ensure smooth performance.',
  },
  {
    question: 'How much does app development cost?',
    answer:
      'The cost varies based on factors like app complexity, features, design, and platform. Contact us for a customized quote.',
  },
  {
    question: 'Do you provide UI/UX design services?',
    answer:
      'Yes, our expert designers create intuitive, user-friendly, and visually appealing interfaces to enhance user experience.',
  },
  {
    question: 'How do you ensure the security of our application?',
    answer:
      'We follow industry best practices, including data encryption, secure authentication, and regular security audits, to protect your app and user data.',
  },
]

export const pages = {
  home: {
    title: 'Incaendo | Custom Software, AI & App Development Company',
    description:
      'Incaendo is a Noida-based software development company with 15 years of experience building custom software, web and mobile apps, AI solutions and cloud platforms.',
  },
  ai: {
    title: 'AI Technology & Innovation | Incaendo',
    description:
      'Explore a thoughtful, business-first approach to AI technology and innovation with Incaendo.',
  },
  services: {
    title: 'Software, AI & Technology Services | Incaendo',
    description:
      'Explore Incaendo’s AI, software, web, mobile, enterprise, and cloud technology services, and how they can address practical business needs.',
  },
  teams: {
    title: 'Our Team & Expertise | Incaendo',
    description:
      'Meet the people behind Incaendo across leadership, software engineering, architecture, quality assurance, finance and HR.',
  },
  projects: {
    title: 'Projects & Digital Portfolio | Incaendo Technologies',
    description:
      'Explore a selection of Incaendo project work across digital products, media, commerce, financial platforms, operations, and learning.',
  },
  insights: {
    title: 'Technology Insights & Engineering Ideas | Incaendo',
    description:
      'Articles and case studies from Incaendo on choosing a software partner, custom software, tech stacks, AI, web development, cloud and data.',
  },
  contact: {
    title: 'Discuss a Project | Contact Incaendo',
    description:
      'Tell us about your software, web, mobile or AI project. Send an enquiry to the Incaendo team in Noida or email info@incaendo.com.',
  },
  careers: {
    title: 'Careers & Opportunities | Incaendo',
    description:
      'Careers at Incaendo, a software development company in Noida. No openings are listed right now; roles will be published here when ready.',
  },
  faq: {
    title: 'Frequently Asked Questions | Incaendo',
    description:
      'Frequently asked questions about Incaendo mobile app development, web applications, UI/UX design, and technology solutions.',
  },
  privacy: {
    title: 'Privacy Policy | Incaendo',
    description:
      "Read Incaendo's Privacy Policy to understand how we collect, use, protect, and manage your personal information while you use our website and services.",
  },
  terms: {
    title: 'Terms & Conditions | Incaendo',
    description:
      "Read Incaendo's Terms & Conditions governing access to and use of our website, products, and technology services.",
  },
}
