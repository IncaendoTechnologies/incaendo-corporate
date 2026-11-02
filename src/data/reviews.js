import cardekho from '../assets/svg/cardekho.svg'
import dominos from '../assets/svg/dominos.svg'
import jubilant from '../assets/svg/jubilant.svg'
import policybazaar from '../assets/svg/policybazaar.svg'
import spicejet from '../assets/svg/spicejet.svg'
import zeeMedia from '../assets/svg/ZeeMedia.svg'

// Homepage testimonial entries.
//
// The first three entries reproduce content already published on the site.
// They are unverified client quotes — no independent verification has been
// performed — so preserve their wording and do not add verification claims.
//
// The remaining entries are explicitly marked `sample: true` and exist only
// to demonstrate the six-card layout. They use placeholder names. Replace
// them with real, approved testimonials before publication.
//
// `logo`: an imported SVG asset (from src/assets/svg/), reusing the same
// client/partner marks shown in the logo marquee. None of the real reviews
// above states or implies a company name, and the three sample entries are
// placeholder content, so every logo here is a representative stand-in
// rather than a confirmed match to a specific reviewer — swap in the
// correct logo once a review is confirmed to belong to that company.
//
// Every logo sits on the same light-ivory chip (.review-card-logo-frame in
// global.css), which has one fixed height and consistent background,
// radius and padding across every card. Within that shared chip, each logo
// gets its own `logoWidth` / `logoHeight` — both set explicitly (not
// "auto") and computed from the source SVG's real aspect ratio, so the
// mark renders at its exact natural proportions via object-fit: contain
// without any stretching. Taller `logoHeight` reads as a visually bigger,
// more prominent mark (CarDekho and Jubilant use the tallest value here);
// the frame itself stays the same height for every card regardless, and
// simply centres whatever size mark it holds.
export const reviews = [
  {
    quote:
      'Our experience with Incaendo was seamless from the initial discussions through development and deployment. They understood our requirements well, communicated clearly, and delivered a reliable digital solution.',
    name: 'Mr. Roy',
    role: 'Client Review',
    logo: cardekho,
    logoWidth: '7.2rem',
    logoHeight: '2.3rem',
  },
  {
    quote:
      'What impressed us most was the team’s ability to simplify complex requirements and turn them into practical solutions. Their collaborative approach and continued support made the entire engagement efficient and productive.',
    name: 'Dr. Abhisekh',
    role: 'Client Review',
    logo: dominos,
    logoWidth: '7.7rem',
    logoHeight: '1.8rem',
  },
  {
    quote:
      'Incaendo brought a strong combination of technical expertise and business understanding to our project. The team was responsive, transparent, and focused on delivering a solution that could scale with our requirements.',
    name: 'Mayur',
    role: 'Client Review',
    logo: jubilant,
    logoWidth: '3.2rem',
    logoHeight: '2.3rem',
  },
  {
    quote:
      'From the first conversation, the team took time to understand our goals before proposing an approach. That upfront clarity made the rest of the engagement straightforward.',
    name: 'Sample Reviewer',
    role: 'Client Review',
    sample: true,
    logo: policybazaar,
    logoWidth: '7rem',
    logoHeight: '1.8rem',
  },
  {
    quote:
      'Our requirements changed more than once along the way, and the team adapted without losing momentum or missing the details that mattered to us.',
    name: 'Demo Client',
    role: 'Client Review',
    sample: true,
    logo: zeeMedia,
    logoWidth: '4.2rem',
    logoHeight: '1.9rem',
  },
  {
    quote:
      'What stood out was the steady communication throughout. We always knew where things stood and never had to chase an update.',
    name: 'Placeholder Client',
    role: 'Client Review',
    sample: true,
    logo: spicejet,
    logoWidth: '6.65rem',
    logoHeight: '1.8rem',
  },
]
