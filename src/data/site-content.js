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
  { href: '/ai-technology', label: 'AI Technology' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/teams', label: 'Our team' },
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
      'Apply AI and workflow automation to reduce repetitive work and make useful information easier to act on.',
    points: ['Workflow automation', 'AI assistants & integrations'],
    href: '/ai-technology',
    icon: BrainCircuit,
  },
  {
    number: '02',
    id: 'custom-software-development',
    title: 'Custom Software Development',
    description:
      'Build purpose-fit systems for business processes that off-the-shelf tools cannot support.',
    points: ['Product engineering', 'APIs & integrations'],
    href: '/services#custom-software-development',
    icon: Code2,
  },
  {
    number: '03',
    id: 'web-application-development',
    title: 'Web Application Development',
    description:
      'Create secure, responsive web applications for customers, staff, and business partners.',
    points: ['Web platforms & portals', 'Responsive product interfaces'],
    href: '/services#web-application-development',
    icon: Globe,
  },
  {
    number: '04',
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    description:
      'Bring essential digital experiences to mobile with fast, intuitive apps for iOS and Android.',
    points: ['iOS & Android apps', 'Cross-platform experiences'],
    href: '/services#mobile-app-development',
    icon: Smartphone,
  },
  {
    number: '05',
    id: 'enterprise-solutions',
    title: 'Enterprise Solutions',
    description:
      'Connect teams and operations with scalable platforms designed for complex business environments.',
    points: ['Enterprise integrations', 'Modernization & workflows'],
    href: '/services#enterprise-solutions',
    icon: Building2,
  },
  {
    number: '06',
    id: 'cloud-data',
    title: 'Cloud & Data',
    description:
      'Build a reliable cloud foundation and turn well-governed data into clearer operational insight.',
    points: ['Cloud architecture', 'Data pipelines & analytics'],
    href: '/services#cloud-data',
    icon: Cloud,
  },
]

export const faqs = [
  {
    question: 'What does Incaendo do?',
    answer:
      'Incaendo is a software development and technology company. The specific service portfolio and engagement details are being confirmed for publication.',
  },
  {
    question: 'How long has Incaendo worked in technology?',
    answer:
      'Incaendo brings 15 years of industry experience, as provided in the company brief.',
  },
  {
    question: 'How can I discuss a project?',
    answer:
      'Use the contact page to prepare an enquiry. Message delivery will be enabled once the company provides its contact endpoint.',
  },
]

export const pages = {
  home: {
    title: 'Incaendo | Software Engineering for What Comes Next',
    description:
      'Incaendo is a software development and technology company with 15 years of industry experience.',
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
      'Explore sample editorial drafts on artificial intelligence, software engineering, web development, cloud, data and digital transformation.',
  },
  contact: {
    title: 'Discuss a Project | Contact Incaendo',
    description:
      'Prepare a business enquiry for Incaendo. Contact form delivery is awaiting a verified endpoint.',
  },
  careers: {
    title: 'Careers & Opportunities | Incaendo',
    description:
      'Learn about opportunities at Incaendo. Current openings are being confirmed.',
  },
  privacy: {
    title: 'Privacy Notice | Incaendo',
    description:
      'Privacy information for the Incaendo website. The company-specific notice is awaiting review.',
  },
}
