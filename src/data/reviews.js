// Homepage testimonial entries.
//
// The first three entries reproduce content already published on the site.
// They are unverified client quotes — no independent verification has been
// performed — so preserve their wording and do not add verification claims.
//
// The remaining entries are explicitly marked `sample: true` and exist only
// to demonstrate the six-card layout. They use placeholder names and a
// "Sample Review" label rather than "Client Review" so they read clearly as
// demo content. Replace them with real, approved testimonials before
// publication; do not attach a real company name or logo to them.
//
// `logo`: optional. Set this to an imported SVG asset (from
// src/assets/svg/) only once a specific review has been confirmed to belong
// to that company — the component falls back to a neutral icon otherwise.
// As of this writing, none of the three real reviews above states or
// implies a company name, and none of the assets in src/assets/svg/ could
// be confidently matched to any of them, so every entry intentionally
// leaves `logo` unset.
export const reviews = [
  {
    quote:
      'Our experience with Incaendo was seamless from the initial discussions through development and deployment. They understood our requirements well, communicated clearly, and delivered a reliable digital solution.',
    name: 'Mr. Roy',
    role: 'Client Review',
    logo: null,
  },
  {
    quote:
      'What impressed us most was the team’s ability to simplify complex requirements and turn them into practical solutions. Their collaborative approach and continued support made the entire engagement efficient and productive.',
    name: 'Dr. Abhisekh',
    role: 'Client Review',
    logo: null,
  },
  {
    quote:
      'Incaendo brought a strong combination of technical expertise and business understanding to our project. The team was responsive, transparent, and focused on delivering a solution that could scale with our requirements.',
    name: 'Mayur',
    role: 'Client Review',
    logo: null,
  },
  {
    quote:
      'From the first conversation, the team took time to understand our goals before proposing an approach. That upfront clarity made the rest of the engagement straightforward.',
    name: 'Sample Reviewer',
    role: 'Sample Review',
    sample: true,
    logo: null,
  },
  {
    quote:
      'Our requirements changed more than once along the way, and the team adapted without losing momentum or missing the details that mattered to us.',
    name: 'Demo Client',
    role: 'Sample Review',
    sample: true,
    logo: null,
  },
  {
    quote:
      'What stood out was the steady communication throughout. We always knew where things stood and never had to chase an update.',
    name: 'Placeholder Client',
    role: 'Sample Review',
    sample: true,
    logo: null,
  },
]
