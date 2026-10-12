// Site-wide settings. Everything Poonam needs to confirm before launch lives
// here or is marked `confirm: true` in the other data files.
//
// A value of `null` means "not supplied yet". Pages render a clearly labelled
// placeholder instead of a fake number or address, and contact links that
// would go nowhere are left out.

export const site = {
  name: 'Pathwise Courses',
  shortName: 'Pathwise',
  advisor: 'Poonam',
  tagline: 'Course guidance with Poonam',

  // Production URL, used for canonical links and the sitemap. No trailing slash.
  url: 'https://pathwisecourses.com.au', // CONFIRM: domain not yet registered

  contact: {
    phone: null, // e.g. '0400 123 456'
    whatsapp: null, // international format, digits only, e.g. '61400123456'
    email: null, // e.g. 'hello@pathwisecourses.com.au'
    serviceArea: null, // e.g. 'Based in Melbourne, helping students Australia-wide'
    hours: null, // e.g. 'Mon–Fri 9am–6pm, Sat 10am–2pm (AEST)'
  },

  // Poonam's portrait, e.g. 'assets/img/poonam.jpg' (a square or 4:5 photo,
  // at least 800px wide). Until one is supplied the site shows a designed
  // placeholder composition instead – never a stand-in face.
  advisorPhoto: null,

  // How quickly Poonam replies to enquiries, e.g. 'within one business day'.
  // Only shown once she confirms she can meet it.
  responseTime: null,

  // Approved testimonials only, with the person's permission, e.g.
  // { quote: '…', name: 'Priya', detail: 'Certificate III in Individual Support, 2026' }
  // The testimonials section stays hidden while this list is empty.
  testimonials: [],

  business: {
    legalName: null, // e.g. 'Pathwise Courses Pty Ltd'
    abn: null,
  },

  // Partner Registered Training Organisations. ASQA expects anyone marketing
  // nationally recognised training on an RTO's behalf to name that RTO and its
  // code. Add each partner here, then set `rto` on each course in courses.js.
  partnerRtos: [
    // { id: 'example', name: 'Example Training Pty Ltd', code: '12345' },
  ],

  forms: {
    // Where enquiry and eligibility forms are sent. Any endpoint that accepts a
    // JSON POST and returns 2xx on success works (Formspree, Web3Forms, Basin,
    // a Netlify/Vercel function...). Leave empty until one is set up: the forms
    // then say plainly that nothing was sent, instead of faking a success.
    endpoint: '',
  },

  // While true, pages show a slim "preview" banner and amber "To confirm"
  // markers beside unconfirmed details. Set to false for launch.
  draft: true,
};
