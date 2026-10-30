import tomoImage from '../assets/projects/tomo.png'
import zeeMediaImage from '../assets/projects/zee-media.png'
import activateStudioImage from '../assets/projects/activate-studio.png'
import dominosImage from '../assets/projects/dominos.png'
import jubilantFoodworksImage from '../assets/projects/jubilant-foodworks.png'
import creditConveyImage from '../assets/projects/credit-convey.png'
import goodMorningItaliaImage from '../assets/projects/good-morning-italia.png'
import spritzImage from '../assets/projects/spritz.png'
import theSeamImage from '../assets/projects/the-seam.png'
import spiceExpressImage from '../assets/projects/spice-express.png'
import policyBazaarImage from '../assets/projects/policy-bazaar.png'
import fliplearnImage from '../assets/projects/fliplearn.png'

export const projects = [
  {
    name: 'Tomo',
    // Suggested industry labels shown as chips; editorial, not official.
    industries: ['Digital Health', 'AI', 'Mobile Apps'],
    category: 'Digital products',
    industry: 'Digital health & wellbeing',
    image: tomoImage,
    alt: 'Tomo mobile app screens for habit tracking and wellbeing check-ins',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      'Introducing TOMO, the innovative iOS app designed to support individuals struggling with depression by assisting them in managing their daily habits for better mental health. With its user-friendly conversational interface, TOMO provides personalized habit suggestions and tracks progress, acting as a personal smart agent for users. This revolutionary app is now available on the UK App Store, aiming to make a positive impact on the lives of those in need.',
    overview:
      'An iOS app that helps people build healthier daily habits in support of their mental wellbeing. Its conversational interface acts as a personal smart agent, offering personalized habit suggestions and tracking progress over time. The app is available on the UK App Store.',
    documentedScope:
      'iOS app, conversational personal-agent experience, habit suggestions, and activity tracking.',
    sections: [
      {
        title: 'Product approach',
        text: 'The published project description centers the experience on everyday habits. People can interact conversationally, receive personalized suggestions, and review progress over time.',
      },
      {
        title: 'Technical implementation',
        text: 'The available material confirms an iOS app and a conversational agent experience. It does not identify the model, application architecture, backend, data storage, or integrations.',
      },
      {
        title: 'Solution & outcome',
        text: 'The result described is a mobile habit-support product, listed as available through the UK App Store. No measured health or engagement outcomes are published in the available project material.',
      },
    ],
    confirm:
      'Confirm the iOS framework, agent/model design, data retention and consent approach, and the product’s wellbeing safeguards before adding deeper implementation claims.',
  },
  {
    name: 'Zee Media',
    industries: ['Media & Publishing', 'Broadcasting', 'Digital Platforms'],
    category: 'Media & publishing',
    industry: 'News & entertainment',
    image: zeeMediaImage,
    alt: 'Zee Media news and entertainment digital experience screens',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      'Zee Media Corporation Limited, headquartered in Mumbai, India, is a prominent news broadcasting company. Specializing in the transmission of news, current affairs, and regional entertainment through satellite television channels, Zee Media has established itself as a key player in the industry. With a focus on providing up-to-date and reliable information, the company serves as a trusted source for viewers across the nation.',
    overview:
      'A portfolio entry associated with Zee Media, a broadcaster whose published business context includes news, current affairs, and regional entertainment.',
    documentedScope:
      'The supplied portfolio capture shows a Zee Media digital interface; the available summary does not describe Incaendo’s engagement scope.',
    sections: [
      {
        title: 'Project context',
        text: 'The source material identifies Zee Media’s news and entertainment focus and includes a digital product screen. It does not say which product or channel the screen represents.',
      },
      {
        title: 'Technical implementation',
        text: 'No implementation details are documented in the available project summary. The screenshot alone is not sufficient evidence for a framework, content system, API, or delivery architecture.',
      },
    ],
    confirm:
      'Confirm the specific Zee Media product shown, Incaendo’s role, supported channels, editorial workflows, integrations, and technical architecture.',
  },
  {
    name: 'Activate Studio',
    industries: ['Startups', 'Digital Products', 'Social Platforms'],
    category: 'Digital products',
    industry: 'Startup & social products',
    image: activateStudioImage,
    alt: 'Activate Studio startup product and curated social content platform',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      'At Activate Studio, we offer hands-on support to startup founders with digital products. We help them refine their business strategies, clarify their value proposition, design their products, and raise the necessary capital for a successful launch.Framework is developed and used to develop dynamic social media website having custom requirement around curated content. Framework comprises of separate component taking to each other by means of REST based API.',
    overview:
      'Product work connected with startup-founder support and a separate curated-content social platform described in the project material.',
    documentedScope:
      'The source describes product strategy and design support, plus a social platform framework with components connected through REST APIs.',
    sections: [
      {
        title: 'The challenge',
        text: 'The social platform was described as having custom requirements around curated content, so its framework needed to support a tailored content experience.',
      },
      {
        title: 'Our approach',
        text: 'The published description refers to distinct components communicating with one another rather than a single tightly coupled block.',
      },
      {
        title: 'Technical implementation',
        text: 'REST APIs are the documented connection between the framework’s components. The source does not identify programming languages, hosting, persistence, or API security details.',
      },
      {
        title: 'Solution',
        text: 'The documented output is a framework used to build a dynamic social website with custom curated-content requirements.',
      },
    ],
    confirm:
      'Confirm the framework’s component boundaries, API contracts, data model, content moderation, hosting, and the exact relationship between the studio support and social-platform work.',
  },
  {
    name: "Domino's",
    industries: ['Food & Beverage', 'E-commerce', 'Enterprise Platforms'],
    category: 'Food & commerce',
    industry: 'Food service & digital commerce',
    image: dominosImage,
    alt: "Domino's ordering portal and digital menu screens",
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      "Developed a highly scalable and secure portal for Domino's Pizza in the Asia/Pacific region. This portal is hosted on three different data centers and can handle a high volume of transactions, with a successful track record of processing 50,000 transactions in a single day. The portal also has extensive support for REST API, allowing food aggregators to easily access and utilize its key features.",
    overview:
      'A scalable, secure ordering portal for Domino’s Pizza in the Asia-Pacific region, hosted across three data centers. Built for high transaction volumes, it has processed 50,000 transactions in a single day, and its REST APIs give food aggregators access to key ordering features.',
    documentedScope:
      'Portal deployment across three data centres, REST API support for aggregators, and a published reference of 50,000 transactions in one day.',
    sections: [
      {
        title: 'The challenge',
        text: 'The portal needed to support high transaction volumes while making core ordering capabilities available to external food aggregators.',
      },
      {
        title: 'Our approach',
        text: 'The project description documents a multi-data-centre deployment and REST APIs through which aggregators could access portal capabilities.',
      },
      {
        title: 'Technical implementation',
        text: 'Three data centres and REST API integration are the specific implementation details published. The source describes the portal as secure but does not document the security controls or the wider system architecture.',
      },
      {
        title: 'Solution & outcome',
        text: 'The portal provided ordering functionality for the region and an integration surface for food aggregators. The company-published project summary cites 50,000 transactions in a single day; it does not specify the date or measurement method.',
      },
    ],
    confirm:
      'Confirm the deployment topology, API contracts, security controls, monitoring, and the date and measurement basis for the published transaction figure.',
  },
  {
    name: 'Jubilant FoodWorks',
    industries: [
      'Food & Beverage',
      'Restaurant Technology',
      'Digital Platforms',
    ],
    category: 'Food & commerce',
    industry: 'Food service',
    image: jubilantFoodworksImage,
    alt: 'Jubilant FoodWorks corporate website and brand portfolio',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      "Designed a user-friendly and visually appealing website for Jubilant FOOD WORK Limited, a renowned part of the Jubilant Bhartia Group. This company is a major player in the food service industry, operating over 1200 outlets for Domino's Pizza, Dunkin' Donuts, and Hong's Kitchen. With a dedicated team of 30,000 brand ambassadors, their commitment is to provide exceptional value to their customers. The website showcases their extensive range of offerings and highlights their dedication to quality and customer satisfaction.",
    overview:
      'A corporate website for Jubilant FoodWorks, presenting the company and its food-service portfolio.',
    documentedScope:
      'Website design and presentation of the company’s offerings and brands.',
    sections: [
      {
        title: 'The brief',
        text: 'The published project description focuses on presenting Jubilant FoodWorks’ range of offerings and its customer-facing brands in a clear, approachable way.',
      },
      {
        title: 'Our approach',
        text: 'The source confirms website design work, with content organized around the company, its brands, and its business presence.',
      },
      {
        title: 'Technical implementation',
        text: 'The available material does not identify the site’s frontend or backend stack, content-management system, integrations, hosting, or accessibility implementation.',
      },
      {
        title: 'Solution',
        text: 'The documented deliverable is a corporate web experience for the food-service business and its portfolio.',
      },
    ],
    confirm:
      'Confirm Incaendo’s precise delivery scope, the publishing platform, content workflows, integrations, and any verified accessibility or performance work.',
  },
  {
    name: 'Credit Convey',
    industries: ['Fintech', 'Personal Finance', 'Financial Wellness'],
    category: 'Financial platforms',
    industry: 'Consumer finance',
    image: creditConveyImage,
    alt: 'Credit Convey financial wellbeing platform screens',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      "Credit Convey is a platform that focuses on improving clients' financial well-being through a combination of education, motivation, and advanced technologies. They offer unlimited interest-free cash advances to help bridge any financial gaps. By utilizing Credit Convey, individuals can gain the knowledge and support needed to better manage their finances and ultimately achieve greater financial stability.",
    overview:
      'A financial wellbeing platform that combines education, motivation, and technology to help people manage their money with more confidence. Alongside its learning resources, it offers interest-free cash advances that help bridge short-term financial gaps.',
    documentedScope:
      'The published project description identifies financial-wellbeing content and cash-advance functionality.',
    sections: [
      {
        title: 'Business context',
        text: 'The product is framed around helping people make sense of their financial situation while offering a way to bridge a gap through a cash advance.',
      },
      {
        title: 'Product approach',
        text: 'The source describes a combination of educational and motivational material with financial tools, rather than a cash-advance feature in isolation.',
      },
      {
        title: 'Technical implementation',
        text: 'The material does not specify eligibility logic, identity checks, lending or payment partners, data controls, or the software architecture.',
      },
    ],
    confirm:
      'Confirm Incaendo’s implementation scope and the eligibility, identity, disbursement, privacy, and financial-partner workflows before describing them technically.',
  },
  {
    name: 'Good Morning Italia',
    industries: ['Media & Publishing', 'News Platforms', 'Digital Content'],
    category: 'Media & publishing',
    industry: 'News & publishing',
    image: goodMorningItaliaImage,
    alt: 'Good Morning Italia news website and mobile reading experience',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      'Good Morning Italia is a comprehensive platform that focuses on producing and sharing high-quality news content through various mediums. It has gained popularity among individuals and businesses alike due to its intelligent approach to news delivery. With a wide array of information available on the web, app, and email, it has become the go-to platform for users seeking reliable and insightful news. Whether you are an individual or a company, Good Morning Italia offers a dynamic and engaging experience for staying informed.',
    overview:
      'A news platform that produces and shares high-quality news content across the web, a mobile app, and email. It gives individual readers and businesses a reliable, consistent way to stay informed through the channel they prefer.',
    documentedScope:
      'The available project description confirms the three publishing channels, but not the underlying publishing systems.',
    sections: [
      {
        title: 'The product',
        text: 'Good Morning Italia’s service brings news content to readers across a website, a mobile application, and email.',
      },
      {
        title: 'Our approach',
        text: 'The evidenced product scope is multi-channel publishing. The source does not describe how editorial content moves between those channels or how publishing teams manage it.',
      },
      {
        title: 'Technical implementation',
        text: 'Web, app, and email are the documented delivery surfaces. The content-management, notification, email, analytics, and synchronization technologies are not identified.',
      },
    ],
    confirm:
      'Confirm the editorial workflow, content-management system, email delivery service, mobile platform details, and any channel synchronization or analytics integrations.',
  },
  {
    name: 'Spritz',
    industries: ['AI', 'AI Agents', 'Workflow Automation'],
    category: 'AI & automation',
    industry: 'AI software',
    image: spritzImage,
    alt: 'Spritz workspace for selecting and managing AI agents',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      'Spritz is a cutting-edge platform that uses AI technology to facilitate smooth communication with various AI agents. It allows users to easily configure and choose AI agents based on specific tasks they need assistance with. The platform streamlines interaction, making it more accessible and user-friendly for individuals and businesses alike.',
    overview:
      'An AI platform that brings different AI agents together in one place. Users can configure and choose the agent best suited to each task, making AI assistance simpler and more accessible for individuals and businesses.',
    documentedScope:
      'Agent discovery and selection, configuration, and task-oriented interaction are the capabilities described in the source.',
    sections: [
      {
        title: 'The challenge',
        text: 'The product context is helping people choose an AI agent suited to the task they want to complete.',
      },
      {
        title: 'Our approach',
        text: 'The available description emphasizes configurable agents and a common way to interact with them, keeping task choice visible to the user.',
      },
      {
        title: 'Technical implementation',
        text: 'The project material confirms an AI-agent interface but does not identify model providers, orchestration, tool permissions, retrieval, evaluation, or data-handling controls.',
      },
    ],
    confirm:
      'Confirm agent/model integrations, tool authorization, context handling, evaluation, human review, and data-retention controls before publishing deeper AI architecture details.',
  },
  {
    name: 'The Seam',
    industries: ['Fashion', 'Circular Economy', 'Repair Services'],
    category: 'Operations',
    industry: 'Apparel care & repair',
    image: theSeamImage,
    alt: 'The Seam garment care and repair service website',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      'Seam is a reliable and established brand that has earned the trust of major international companies. By partnering with The Seam, businesses can effortlessly provide garment care and repair services on a large scale. This helps in minimizing returns, prolonging the lifecycle of garments, and ensuring that your business model remains relevant and adaptable in the future.',
    overview:
      'A garment-care and repair service that connects brands and their customers with specialist repair providers.',
    documentedScope:
      'The source describes the service model and includes a portfolio image, but does not document Incaendo’s delivery scope.',
    sections: [
      {
        title: 'Business context',
        text: 'The Seam’s service proposition is to make garment care and repair available to brands at a larger scale, extending the useful life of clothing.',
      },
      {
        title: 'Project evidence',
        text: 'A website capture is available in the project material. It does not establish which product workflows, operational tools, or platform components were delivered by Incaendo.',
      },
      {
        title: 'Technical implementation',
        text: 'No architecture, provider-network workflow, inventory model, booking integration, or implementation detail is documented in the available source.',
      },
    ],
    confirm:
      'Confirm Incaendo’s role, the customer and provider journeys, service-area or capacity workflows, partner integrations, and platform architecture.',
  },
  {
    name: 'Spice Express',
    industries: ['Logistics', 'Aviation', 'Cargo Services'],
    category: 'Operations',
    industry: 'Air cargo & logistics',
    image: spiceExpressImage,
    alt: 'Spice Express cargo booking and logistics website',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      'Spice Express, the Cargo Division of SpiceJet, offers a seamless and customer-centric cargo delivery service. Backed by extensive experience in the airline industry, we prioritize customer satisfaction and aim to surpass expectations. Our professional approach ensures a hassle-free experience for our clients, making us the preferred choice for cargo transportation. Trust Spice Express for reliable and efficient cargo delivery.',
    overview:
      'A digital portfolio entry for Spice Express, the cargo division of SpiceJet, serving freight and logistics customers.',
    documentedScope:
      'The project material identifies the cargo business and includes a website capture, but does not define Incaendo’s implementation scope.',
    sections: [
      {
        title: 'Business context',
        text: 'The source positions Spice Express as an air-cargo service. The supplied screen shows a customer-facing digital experience for the business.',
      },
      {
        title: 'Project evidence',
        text: 'The available material does not describe specific cargo booking, tracking, or operations workflows delivered as part of this project.',
      },
      {
        title: 'Technical implementation',
        text: 'No details are provided about shipment systems, airline integrations, pricing, tracking, or the application stack.',
      },
    ],
    confirm:
      'Confirm the product scope, freight booking and tracking functions, airline or logistics integrations, and any operational system connections.',
  },
  {
    name: 'Policy Bazaar',
    industries: ['Insurtech', 'Insurance', 'Financial Platforms'],
    category: 'Financial platforms',
    industry: 'Insurance & financial services',
    image: policyBazaarImage,
    alt: 'Policy Bazaar insurance comparison and product selection screens',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      'PolicyBazaar.com is a popular online insurance comparison platform in India. Incaendo has created a comprehensive platform for PolicyBazaar, enabling customers to easily purchase and compare various insurance plans on their website. With this platform, PolicyBazaar attracts a significant number of unique visitors, totaling 20 million annually.',
    overview:
      'An online insurance platform that lets customers compare plans and complete purchases across insurance categories.',
    documentedScope:
      'The source states that Incaendo created a platform for insurance-plan comparison and purchase.',
    sections: [
      {
        title: 'The challenge',
        text: 'Customers need to review different insurance options and make a purchase through an online journey.',
      },
      {
        title: 'Our approach',
        text: 'The published scope combines plan discovery, comparison, and purchase in a single digital platform.',
      },
      {
        title: 'Technical implementation',
        text: 'The source describes the product capabilities but does not identify insurer integrations, plan-data pipelines, eligibility rules, payment flows, or security architecture.',
      },
      {
        title: 'Solution',
        text: 'The delivered platform supports online insurance comparison and purchase. No project-attributable performance or business outcome is included here.',
      },
    ],
    confirm:
      'Confirm data-provider and insurer integrations, plan-update workflows, identity and payment controls, security measures, and any attributable performance results.',
  },
  {
    name: 'Fliplearn',
    industries: ['EdTech', 'Online Learning', 'Education Platforms'],
    category: 'Learning',
    industry: 'Education technology',
    image: fliplearnImage,
    alt: 'Fliplearn online learning platform and mobile learning experience',
    // Full description from incaendo.com/projects, shown on the Projects page.
    description:
      'In partnership with Incaendo, Fliplearn Education Pvt. Ltd. has developed an online platform that revolutionizes education in the 21st century. By identifying and addressing existing and future barriers to education, Fliplearn and Incaendo have created a highly customized marketplace for online and mobile applications. This platform aims to provide innovative solutions to improve access to education, making it more personalized and effective for students.',
    overview:
      'An online learning platform and marketplace that brings educational content and interactive learning applications together across web and mobile. It helps learners explore learning resources and access their educational experience through a unified platform.',
    documentedScope:
      'The source describes a customized marketplace spanning online and mobile applications, developed in partnership with Incaendo.',
    sections: [
      {
        title: 'The challenge',
        text: 'The project was framed around access to education and the need to address existing and emerging barriers for learners.',
      },
      {
        title: 'Our approach',
        text: 'The documented product direction was a tailored learning marketplace that brings educational applications and content together across web and mobile.',
      },
      {
        title: 'Technical implementation',
        text: 'Web and mobile application coverage is documented. The source does not specify native or cross-platform implementation, learner roles, content management, progress tracking, or integrations.',
      },
      {
        title: 'Solution',
        text: 'The platform was intended to improve access through a more personalized learning experience; the available material provides no measured learning or adoption outcomes.',
      },
    ],
    confirm:
      'Confirm learner and educator workflows, mobile implementation approach, content and assessment systems, integrations, and any evidence of learning outcomes.',
  },
]

export const projectCategories = [
  'All projects',
  'Digital products',
  'Media & publishing',
  'Food & commerce',
  'Financial platforms',
  'AI & automation',
  'Operations',
  'Learning',
]
