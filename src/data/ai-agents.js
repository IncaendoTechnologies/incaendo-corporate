import customerSupport from '../assets/ai-agents/customer-support.svg'
import knowledgeResearch from '../assets/ai-agents/knowledge-research.svg'
import salesQualification from '../assets/ai-agents/sales-qualification.svg'
import documentIntelligence from '../assets/ai-agents/document-intelligence.svg'
import workflowAutomation from '../assets/ai-agents/workflow-automation.svg'
import dataReporting from '../assets/ai-agents/data-reporting.svg'
import marketingContent from '../assets/ai-agents/marketing-content.svg'
import recruitmentAssistant from '../assets/ai-agents/recruitment-assistant.svg'
import personalizedRecommendation from '../assets/ai-agents/personalized-recommendation.svg'
import conversationalProduct from '../assets/ai-agents/conversational-product.svg'

// Supporting claim for the AI agents section. It is only shown once
// `confirmed` is set to true after the figure has been approved.
export const agentWorkflowClaim = {
  text: 'Incaendo has worked on 100+ AI agent workflows.',
  confirmed: false,
}

// Representative agent concepts: illustrative capabilities that can be
// integrated into relevant products, not named deployments. `related` links
// a concept to a documented project only where the project material supports
// it (see src/data/projects.js).
export const aiAgents = [
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    capability: 'Customer experience',
    description:
      'Understands customer questions, retrieves relevant information, and helps resolve routine support requests, handing anything unusual to a person.',
    context: 'Help centres, support inboxes, and customer portals.',
    image: customerSupport,
    alt: 'A support inbox where an agent drafts a reply to a damaged-order question, citing the returns policy and suggesting a next step.',
  },
  {
    id: 'knowledge-research',
    name: 'Knowledge & Research Agent',
    capability: 'Research',
    description:
      'Searches approved documents and knowledge sources to produce concise answers that link back to the passages they came from.',
    context: 'Intranets, policy libraries, and internal knowledge bases.',
    image: knowledgeResearch,
    alt: 'A knowledge search answering a question about contract approvals, with numbered citations to three source documents.',
  },
  {
    id: 'sales-qualification',
    name: 'Sales Qualification Agent',
    capability: 'Sales',
    description:
      'Organizes incoming leads, summarizes what each prospect needs, and helps sales teams decide which follow-ups to prioritize.',
    context: 'CRM pipelines and website enquiry forms.',
    image: salesQualification,
    alt: 'A list of incoming enquiries with priority labels beside a lead summary of requirements and a follow-up button.',
  },
  {
    id: 'document-intelligence',
    name: 'Document Intelligence Agent',
    capability: 'Operations',
    description:
      'Extracts key details from business documents, checks them against expected formats, and routes uncertain values for review.',
    context: 'Invoice, claims, and onboarding review workflows.',
    image: documentIntelligence,
    alt: 'An invoice with highlighted fields beside an extraction panel showing confidence for each value and one field flagged for review.',
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation Agent',
    capability: 'Operations',
    description:
      'Coordinates routine multi-step tasks across connected business systems, pausing for approval wherever a person should decide.',
    context: 'Approval flows connecting ERP, CRM, and ticketing systems.',
    image: workflowAutomation,
    alt: 'A purchase-request workflow of connected steps, including a manager approval, with a run log of completed actions.',
  },
  {
    id: 'data-reporting',
    name: 'Data & Reporting Agent',
    capability: 'Decision support',
    description:
      'Summarizes business data, highlights patterns worth a closer look, and helps teams understand what their operational reports are saying.',
    context: 'Operational dashboards and recurring management reports.',
    image: dataReporting,
    alt: 'An operations dashboard with a weekly chart and an insight panel noting a regional trend worth checking.',
  },
  {
    id: 'marketing-content',
    name: 'Marketing Content Agent',
    capability: 'Marketing',
    description:
      'Helps create and adapt content from approved source material, keeping each version within the brand’s guidelines.',
    context: 'Campaign planning and content management systems.',
    image: marketingContent,
    alt: 'A campaign draft beside brand guidelines and versions of the content adapted for email, social, and web.',
  },
  {
    id: 'recruitment-assistant',
    name: 'Recruitment Assistant Agent',
    capability: 'People & hiring',
    description:
      'Analyzes job descriptions, organizes candidate information against clear criteria, and keeps structured hiring workflows moving.',
    context: 'Applicant tracking and structured hiring processes.',
    image: recruitmentAssistant,
    alt: 'A job description with highlighted requirements beside candidate cards showing structured requirement matches.',
  },
  {
    id: 'personalized-recommendation',
    name: 'Personalized Recommendation Agent',
    capability: 'Personalization',
    description:
      'Uses stated preferences and available application data to suggest useful next actions or content, and explains why each was suggested.',
    context: 'Consumer apps, learning platforms, and wellbeing products.',
    related: {
      project: 'Tomo',
      note: 'Tomo, an iOS habit app in our projects, is documented as offering personalized habit suggestions through a conversational experience.',
    },
    image: personalizedRecommendation,
    alt: 'A mobile app showing suggested activities based on saved preferences, with a panel explaining why a suggestion was made.',
  },
  {
    id: 'conversational-product',
    name: 'Conversational Product Agent',
    capability: 'Product experience',
    description:
      'Powers natural-language interactions inside web and mobile applications, helping people find features and complete tasks.',
    context: 'In-app assistants for web and mobile products.',
    related: {
      project: 'Spritz',
      note: 'Spritz, an AI platform concept in our projects, describes configurable agents used through a shared, task-oriented interface.',
    },
    image: conversationalProduct,
    alt: 'An in-app assistant helping a customer change a delivery address by asking which order to update.',
  },
]
