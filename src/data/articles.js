export const insightCategories = [
  'AI & Machine Learning',
  'Software Engineering',
  'Web Development',
  'Cloud & DevOps',
  'Data & Analytics',
  'Industry Perspectives',
]

// These are sample editorial drafts for layout and routing development.
// Publication dates and authors stay unset until approved content is supplied.
// Keep the list newest first; an optional ISO `publishedAt` date takes
// precedence once dates are approved.
export const articles = [
  {
    slug: 'from-ai-experiments-to-production',
    category: 'AI & Machine Learning',
    feature: 'hero',
    variant: 'neural',
    title:
      'From AI experiments to production: building systems that deliver value',
    excerpt:
      'A practical path from an impressive prototype to a dependable part of everyday work—starting with the task, the data and the people who will use it.',
    tags: ['generative AI', 'production systems', 'evaluation'],
    readMinutes: 8,
    sections: [
      {
        heading: 'Start with a task worth improving',
        paragraphs: [
          'A useful AI initiative starts with a specific job to be done. Teams can describe the current workflow, where time is lost, which decisions need support, and what a better result would look like. That gives an experiment a purpose beyond demonstrating a model.',
          'A narrow, well-understood task is also easier to evaluate. Define a representative set of inputs and expected outcomes before building the interface around the model.',
        ],
      },
      {
        heading: 'Treat context and permissions as product decisions',
        paragraphs: [
          'Production applications need a deliberate approach to the information an AI feature can use. Identify approved sources, preserve existing access rules, and make the origin of relevant context understandable to the people reviewing a result.',
          'The integration should fit the systems and responsibilities already in place. A model call is one part of a workflow that may also include retrieval, validation, a human decision, and a record of what happened.',
        ],
      },
      {
        heading: 'Evaluate the whole workflow',
        paragraphs: [
          'Model quality is only one measure. Teams can also examine whether the feature saves steps, whether users can correct it, how it behaves when information is missing, and what it costs to operate. Testing should include ordinary cases and the awkward edge cases that surface in real work.',
          'A production plan includes monitoring, ownership, and a way to improve the experience as requirements change. The result is not a one-time launch; it is an application that can be understood and maintained.',
        ],
        list: [
          'Choose a repeatable task and define a baseline.',
          'Limit the feature to appropriate, permissioned context.',
          'Keep validation and human review in the workflow where needed.',
          'Monitor quality, usage, cost, and failure cases after release.',
        ],
      },
    ],
  },
  {
    slug: 'practical-ai-integration-existing-applications',
    category: 'AI & Machine Learning',
    feature: 'featured',
    variant: 'workflow',
    title: 'Practical AI integration for existing business applications',
    excerpt:
      'Add an AI capability to a product people already use by respecting its data, permissions, interaction patterns and operational limits.',
    tags: ['AI integration', 'business applications', 'product design'],
    readMinutes: 6,
    sections: [
      {
        heading: 'Find the right seam in the product',
        paragraphs: [
          'AI can help summarize a record, find relevant material, or prepare a first draft. The opportunity is strongest when it fits a real step in the existing user journey instead of asking people to move to a separate destination.',
          'Map the current workflow before choosing a model. That reveals who starts the task, what information is available, and where a person needs to check or approve the result.',
        ],
      },
      {
        heading: 'Keep existing rules in control',
        paragraphs: [
          'An AI feature should inherit the application’s authorization boundaries. Retrieval and tool calls need the same careful scoping as the rest of the product, and user-facing responses should not imply certainty when the underlying information is incomplete.',
          'A small release behind a controlled audience can help a team learn how people use the feature before widening access. Feedback should be connected to a clear process for correcting prompts, source material, or interaction design.',
        ],
      },
      {
        heading: 'Plan for useful failure states',
        paragraphs: [
          'The interface needs to explain when no suitable answer is available and offer a route back to the normal workflow. Fallbacks, review actions, and concise source references often matter as much as the generated response.',
        ],
      },
    ],
  },
  {
    slug: 'designing-maintainable-apis-growing-products',
    category: 'Software Engineering',
    feature: 'featured',
    variant: 'api',
    title: 'Designing maintainable APIs for growing products',
    excerpt:
      'Clear contracts, predictable errors and thoughtful change management help an API remain understandable as products and integrations evolve.',
    tags: ['API design', 'software architecture', 'integration'],
    readMinutes: 7,
    sections: [
      {
        heading: 'Make the contract easy to understand',
        paragraphs: [
          'A stable API begins with the language of the problem it serves. Resource names, request shapes and response fields should help a consumer understand what the system accepts and returns without relying on hidden implementation details.',
          'Consistency is valuable, but it should be deliberate. Shared conventions for pagination, validation and error responses reduce the amount of special handling clients need to learn.',
        ],
      },
      {
        heading: 'Treat errors as part of the interface',
        paragraphs: [
          'A useful error explains what went wrong and, when possible, how the caller can correct it. Avoid exposing implementation traces or sensitive details; provide a stable code and enough context for a client to respond appropriately.',
        ],
        code: 'HTTP 422\n{ "code": "invalid_state", "message": "The request cannot be applied in the current state." }',
      },
      {
        heading: 'Change without surprising consumers',
        paragraphs: [
          'Compatibility is a product responsibility. Additive changes, documented deprecations, contract tests and versioning decisions can help teams coordinate updates across clients and services.',
          'The right approach depends on who owns each integration and how changes are released. Keep the migration path visible and give consumers time to adopt it.',
        ],
      },
    ],
  },
  {
    slug: 'improving-web-application-performance',
    category: 'Web Development',
    feature: null,
    variant: 'web',
    title: 'Improving web application performance without guesswork',
    excerpt:
      'A measurement-led checklist for finding the slow part of a web experience and improving it without trading away accessibility or clarity.',
    tags: ['web performance', 'frontend', 'user experience'],
    readMinutes: 5,
    sections: [
      {
        heading: 'Measure the experience people receive',
        paragraphs: [
          'Performance work is more useful when it starts with observed behavior. Identify the pages and interactions that matter, collect measurements under representative conditions, and distinguish the initial load from work that happens later.',
          'A large image, a long JavaScript task and a slow server response can all feel like “the page is slow,” but each calls for a different investigation.',
        ],
      },
      {
        heading: 'Prioritize by impact and cause',
        paragraphs: [
          'Review the network waterfall, image dimensions, script bundles and rendering path. Improve the largest contributors first, then measure again to see whether the change helped the experience rather than only a synthetic score.',
        ],
        list: [
          'Serve images at the size and format the layout needs.',
          'Defer code that is not required for the first interaction.',
          'Reduce avoidable requests and expensive client-side work.',
          'Check keyboard, screen-reader and low-bandwidth behavior after changes.',
        ],
      },
      {
        heading: 'Keep performance visible',
        paragraphs: [
          'A short review in the development cycle can catch regressions early. Agree on the pages to watch, capture before-and-after results, and give the team a clear way to revisit a change if it harms usability.',
        ],
      },
    ],
  },
  {
    slug: 'cicd-practices-reliable-delivery',
    category: 'Cloud & DevOps',
    feature: null,
    variant: 'pipeline',
    title: 'CI/CD practices for more reliable software delivery',
    excerpt:
      'A delivery pipeline should make changes easier to validate and release—not add ceremony that teams work around.',
    tags: ['CI/CD', 'release process', 'software quality'],
    readMinutes: 6,
    sections: [
      {
        heading: 'Automate repeatable checks',
        paragraphs: [
          'A useful pipeline runs a predictable set of checks whenever code changes. Formatting, static analysis, unit tests and build validation can provide quick feedback before a change moves toward broader testing.',
          'Choose checks that catch meaningful problems and keep their output understandable. Slow or flaky steps can undermine confidence and invite teams to ignore the results.',
        ],
      },
      {
        heading: 'Make release steps observable',
        paragraphs: [
          'Build artifacts once and promote the same artifact through environments where possible. Keep deployment status and the change being released visible, and define what a safe rollback or pause looks like for the application.',
        ],
      },
      {
        heading: 'Fit the pipeline to the service',
        paragraphs: [
          'There is no single pipeline that suits every product. Data migrations, external dependencies, customer impact and the team’s support model all affect what release controls are appropriate.',
        ],
      },
    ],
  },
  {
    slug: 'making-cloud-infrastructure-observable',
    category: 'Cloud & DevOps',
    feature: null,
    variant: 'cloud',
    title: 'Making cloud infrastructure more observable',
    excerpt:
      'Logs, metrics and traces answer different questions. A shared view of all three helps teams understand behavior across connected services.',
    tags: ['cloud', 'observability', 'operations'],
    readMinutes: 6,
    sections: [
      {
        heading: 'Instrument around questions',
        paragraphs: [
          'Start with the questions an operator needs to answer: Is the service available? Which requests are failing? Where is time being spent? Instrumentation is most valuable when it helps people move from a symptom toward a cause.',
          'Metrics show trends, logs provide event details, and traces connect work across service boundaries. Together, they can reveal behavior that is difficult to understand from one signal alone.',
        ],
      },
      {
        heading: 'Keep telemetry useful and responsible',
        paragraphs: [
          'Consistent service names, request identifiers and structured fields make it easier to follow a transaction. Avoid adding personal or sensitive data to telemetry unless there is a justified, controlled need.',
        ],
      },
      {
        heading: 'Turn signals into operational action',
        paragraphs: [
          'Dashboards should answer a specific operational question, and alerts should point to action. Review noisy signals, document ownership, and use incidents to improve the instrumentation as the system changes.',
        ],
      },
    ],
  },
  {
    slug: 'data-quality-foundation-business-analytics',
    category: 'Data & Analytics',
    feature: null,
    variant: 'data',
    title: 'Data quality: the foundation for useful business analytics',
    excerpt:
      'Clear definitions and visible data checks give teams a stronger basis for interpreting reports and making decisions.',
    tags: ['data quality', 'analytics', 'business intelligence'],
    readMinutes: 5,
    sections: [
      {
        heading: 'Agree on what a measure means',
        paragraphs: [
          'Two reports can disagree because they use different definitions, not because one calculation is broken. Record the meaning, source and owner of important measures so users can understand what a chart represents.',
        ],
      },
      {
        heading: 'Check data where it enters the flow',
        paragraphs: [
          'Validation near the point of capture can prevent incomplete or inconsistent records from spreading. Downstream checks still matter: they help reveal unexpected values, missing periods and changes in upstream systems.',
        ],
        list: [
          'Document source systems and field definitions.',
          'Validate required fields and acceptable ranges.',
          'Monitor freshness and unexpected volume changes.',
          'Provide a clear route for investigating a discrepancy.',
        ],
      },
      {
        heading: 'Make limitations easy to see',
        paragraphs: [
          'Reports should explain their update cadence and known gaps. When people understand how a number was prepared, they can use it with better judgment and ask more focused questions.',
        ],
      },
    ],
  },
  {
    slug: 'accessible-responsive-interfaces-that-scale',
    category: 'Web Development',
    feature: null,
    variant: 'accessibility',
    title: 'Building accessible, responsive interfaces that scale',
    excerpt:
      'Accessible foundations and reusable interface patterns help products remain clear across devices, input methods and evolving requirements.',
    tags: ['accessibility', 'responsive design', 'design systems'],
    readMinutes: 7,
    sections: [
      {
        heading: 'Design for different ways of using a product',
        paragraphs: [
          'People navigate with touch, keyboard, voice and assistive technology. Semantic elements, meaningful focus order, visible focus styling and clear labels make the same interface easier to use across these methods.',
        ],
      },
      {
        heading: 'Build responsive behavior into components',
        paragraphs: [
          'A component should adapt to the space it receives instead of assuming one screen size. Flexible text, sensible wrapping, and layouts that simplify at smaller widths reduce the chance of clipped content or controls.',
        ],
      },
      {
        heading: 'Treat accessibility as ongoing quality',
        paragraphs: [
          'Automated tools can find some issues, but they cannot replace keyboard checks, screen-reader review and testing with real content. Include these checks in design review and implementation so they inform decisions early.',
        ],
      },
    ],
  },
  {
    slug: 'moving-machine-learning-models-into-production',
    category: 'AI & Machine Learning',
    feature: null,
    variant: 'model',
    title: 'Moving machine learning models into production',
    excerpt:
      'Serving a model is only one part of a production system. Data changes, evaluation, monitoring and ownership all need a place in the plan.',
    tags: ['machine learning', 'model operations', 'monitoring'],
    readMinutes: 8,
    sections: [
      {
        heading: 'Connect the model to a maintained workflow',
        paragraphs: [
          'A model becomes part of a product through data preparation, inference, application logic and user interaction. Each boundary needs clear inputs, outputs, error handling and ownership.',
          'The serving pattern should match the task. Some applications need a synchronous response; others can prepare results asynchronously and let a person review them later.',
        ],
      },
      {
        heading: 'Watch for changes in data and behavior',
        paragraphs: [
          'Production inputs may differ from the examples used during development. Monitor useful signals while respecting privacy requirements, and define how the team will investigate a change in output quality or operating cost.',
        ],
      },
      {
        heading: 'Plan model updates deliberately',
        paragraphs: [
          'Version the model, its dependencies and the data preparation steps needed to reproduce a release. A staged rollout and a clear fallback make updates easier to evaluate without assuming that a newer model will always be better.',
        ],
      },
    ],
  },
  {
    slug: 'technology-decisions-digital-change',
    category: 'Industry Perspectives',
    feature: null,
    variant: 'perspectives',
    title: 'Technology decisions that make digital change more practical',
    excerpt:
      'Digital transformation is easier to navigate when teams connect business priorities to specific workflows, systems and measures of progress.',
    tags: ['digital transformation', 'business technology', 'planning'],
    readMinutes: 5,
    sections: [
      {
        heading: 'Begin with the work people need to do',
        paragraphs: [
          'A broad ambition becomes actionable when it is connected to a user, a workflow and a current limitation. That context helps teams decide whether a process should be improved, integrated, automated or left alone.',
        ],
      },
      {
        heading: 'Make constraints part of the conversation',
        paragraphs: [
          'Existing systems, data ownership, operating capacity and change readiness shape a practical plan. Making these constraints visible early helps teams compare options and avoid designing around assumptions.',
        ],
      },
      {
        heading: 'Break progress into decisions',
        paragraphs: [
          'A sequence of reviewable steps can help stakeholders learn before committing to a larger change. Define what each step needs to prove, who will review it and what new information could alter the next decision.',
        ],
      },
    ],
  },
]

export const heroArticle = articles.find(
  (article) => article.feature === 'hero',
)
export const featuredArticles = articles.filter(
  (article) => article.feature === 'featured',
)
export const latestArticles = articles.filter((article) => !article.feature)
export const latestArticle = articles.reduce((latest, article) =>
  article.publishedAt &&
  (!latest.publishedAt || article.publishedAt > latest.publishedAt)
    ? article
    : latest,
)
