// Countries offered in the contact form's phone field (most likely first,
// the rest A–Z). Dial codes and example numbers come from libphonenumber-js
// at build time, so they always match the validation rules.
import { getCountryCallingCode, getExampleNumber } from 'libphonenumber-js/max'
import examples from 'libphonenumber-js/mobile/examples'

import ae from '../assets/flags/ae.svg'
import au from '../assets/flags/au.svg'
import bd from '../assets/flags/bd.svg'
import bh from '../assets/flags/bh.svg'
import ca from '../assets/flags/ca.svg'
import ch from '../assets/flags/ch.svg'
import de from '../assets/flags/de.svg'
import fr from '../assets/flags/fr.svg'
import gb from '../assets/flags/gb.svg'
import ie from '../assets/flags/ie.svg'
import inFlag from '../assets/flags/in.svg'
import kw from '../assets/flags/kw.svg'
import lk from '../assets/flags/lk.svg'
import my from '../assets/flags/my.svg'
import nl from '../assets/flags/nl.svg'
import np from '../assets/flags/np.svg'
import nz from '../assets/flags/nz.svg'
import om from '../assets/flags/om.svg'
import qa from '../assets/flags/qa.svg'
import sa from '../assets/flags/sa.svg'
import sg from '../assets/flags/sg.svg'
import us from '../assets/flags/us.svg'
import za from '../assets/flags/za.svg'

export const DEFAULT_PHONE_COUNTRY = 'IN'

const countries = [
  { iso: 'IN', name: 'India', flag: inFlag },
  { iso: 'US', name: 'United States', flag: us },
  { iso: 'GB', name: 'United Kingdom', flag: gb },
  { iso: 'AE', name: 'United Arab Emirates', flag: ae },
  { iso: 'CA', name: 'Canada', flag: ca },
  { iso: 'AU', name: 'Australia', flag: au },
  { iso: 'SG', name: 'Singapore', flag: sg },
  { iso: 'SA', name: 'Saudi Arabia', flag: sa },
  { iso: 'BH', name: 'Bahrain', flag: bh },
  { iso: 'BD', name: 'Bangladesh', flag: bd },
  { iso: 'FR', name: 'France', flag: fr },
  { iso: 'DE', name: 'Germany', flag: de },
  { iso: 'IE', name: 'Ireland', flag: ie },
  { iso: 'KW', name: 'Kuwait', flag: kw },
  { iso: 'MY', name: 'Malaysia', flag: my },
  { iso: 'NP', name: 'Nepal', flag: np },
  { iso: 'NL', name: 'Netherlands', flag: nl },
  { iso: 'NZ', name: 'New Zealand', flag: nz },
  { iso: 'OM', name: 'Oman', flag: om },
  { iso: 'QA', name: 'Qatar', flag: qa },
  { iso: 'ZA', name: 'South Africa', flag: za },
  { iso: 'LK', name: 'Sri Lanka', flag: lk },
  { iso: 'CH', name: 'Switzerland', flag: ch },
]

export const phoneCountries = countries.map(({ iso, name, flag }) => {
  const dial = getCountryCallingCode(iso)
  const example = getExampleNumber(iso, examples)
  return {
    iso,
    name,
    dial,
    flag: flag.src,
    // e.g. "81234 56789" for India (international format without the code)
    example: example.formatInternational().replace(`+${dial} `, ''),
  }
})
