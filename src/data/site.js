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

  // Poonam's photos, edited from the picture she supplied (background replaced,
  // colour and light balanced; her face is unchanged). Each path is a base
  // name: the site adds the size, e.g. portrait-480.webp and portrait-800.webp.
  // Set to null to fall back to a designed placeholder with her initial.
  advisorPhoto: {
    portrait: 'assets/img/poonam/portrait', // 4:5, -480 / -800
    cutout: 'assets/img/poonam/cutout', // transparent background, 4:5, -520 / -900
    avatar: 'assets/img/poonam/avatar', // square, -96 / -192
  },

  // How quickly Poonam replies to enquiries, e.g. 'within one business day'.
  // Only shown once she confirms she can meet it.
  responseTime: null,

  // Approved testimonials only, with the person's permission, e.g.
  // { quote: '…', name: 'Priya', detail: 'Certificate III in Individual Support, 2026',
  //   from: 'Aged care worker, no certificate', to: 'Certificate III through RPL' } – from/to optional
  // While this list is empty, preview builds (draft: true) show clearly labelled
  // SAMPLE reviews so the layout can be judged; they never appear once draft is
  // false. With no real testimonials at launch, the section is hidden.
  testimonials: [],
  sampleTestimonials: [
    { quote: 'I’d worked in aged care for years without the certificate. Poonam explained RPL in plain English and helped me put my evidence together.', name: 'Priya S.', detail: 'Certificate III in Individual Support', from: 'Aged care worker, no certificate', to: 'Certificate III through RPL' },
    { quote: 'I couldn’t decide between studying online and RPL for the TAE. One conversation and I knew which suited my situation.', name: 'Daniel M.', detail: 'Certificate IV in Training and Assessment', from: 'Workplace trainer without the TAE', to: 'Qualified trainer and assessor' },
    { quote: 'She was upfront that the diploma fitted my goals better than the course I’d been looking at, and walked me through what that meant.', name: 'Mei L.', detail: 'Diploma of Early Childhood Education and Care', from: 'Certificate III educator', to: 'Diploma, ready to lead a room' },
    { quote: 'I wanted to work in schools but didn’t know where to start. Poonam explained the course, the placement and the likely cost before I committed to anything.', name: 'Sam R.', detail: 'Certificate IV in School Based Education Support', from: 'Parent volunteer at a primary school', to: 'Studying to become a teacher aide' },
  ],

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
