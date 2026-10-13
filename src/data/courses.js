// Nationally recognised qualifications and units Poonam can help with.
//
// All descriptions are original. Durations, placement hours and entry
// requirements are typical figures only: the delivering RTO sets the real
// ones, so anything marked `confirm` shows a "To confirm" marker in draft mode.
// Before launch, check every code is current on training.gov.au and is on the
// partner RTO's scope of registration, then set `rto` to a partnerRtos id.

export const sectors = [
  {
    id: 'care',
    image: { file: 'areas/care', source: 'Unsplash', alt: 'A support worker helping two older people with an activity', credit: 'Age Cymru', url: 'https://unsplash.com/photos/caregiver-assisting-elderly-couple-with-coloring-bSXk1lOp8T0' },
    name: 'Community & care',
    short: 'Care',
    blurb: 'Aged care, disability support, community services and counselling.',
    icon: 'heart',
  },
  {
    id: 'education',
    image: { file: 'areas/education', source: 'Pexels', alt: 'An educator doing sensory play with two young children', credit: 'Vlada Karpovich', url: 'https://www.pexels.com/photo/7356477/' },
    name: 'Early childhood & education',
    short: 'Education',
    blurb: 'Childcare, school support and outside-school-hours care.',
    icon: 'blocks',
  },
  {
    id: 'training',
    image: { file: 'areas/training', source: 'Unsplash', alt: 'A trainer leading a session at a whiteboard', credit: 'Vitaly Gariev', url: 'https://unsplash.com/photos/team-collaborating-around-a-whiteboard-in-a-modern-office-K0aM-ztA76Q' },
    name: 'Training & assessment',
    short: 'Training',
    blurb: 'Become a qualified trainer and assessor in your industry.',
    icon: 'presenter',
  },
  {
    id: 'business',
    image: { file: 'areas/business', source: 'Pexels', alt: 'A team leader presenting to colleagues at a whiteboard', credit: 'cottonbro studio', url: 'https://www.pexels.com/photo/6814345/' },
    name: 'Leadership & safety',
    short: 'Leadership',
    blurb: 'Lead teams and manage health and safety at work.',
    icon: 'compass',
  },
  {
    id: 'construction',
    image: { file: 'areas/construction', source: 'Unsplash', alt: 'Two people in hard hats reviewing a building site', credit: 'Mark Potterton', url: 'https://unsplash.com/photos/sNVkn3507Oo' },
    name: 'Building & construction',
    short: 'Building',
    blurb: 'Step up to site, project and building management roles.',
    icon: 'crane',
  },
  {
    id: 'firstaid',
    image: { file: 'areas/firstaid', source: 'Unsplash', alt: 'Hands practising CPR on a training manikin', credit: 'Frederick Shaw', url: 'https://unsplash.com/photos/person-practicing-cpr-on-a-training-dummy-E2JjBMyxBVw' },
    name: 'First aid & CPR',
    short: 'First aid',
    blurb: 'Short, practical certificates many jobs ask for.',
    icon: 'cross',
  },
];

export const levels = [
  { id: 'unit', name: 'Single unit', order: 0 },
  { id: 'cert3', name: 'Certificate III', order: 1 },
  { id: 'cert4', name: 'Certificate IV', order: 2 },
  { id: 'diploma', name: 'Diploma', order: 3 },
  { id: 'adv-diploma', name: 'Advanced Diploma', order: 4 },
];

// Pathway labels used on cards and the compare table.
export const pathways = {
  rpl: 'Recognition of prior learning (RPL)',
  online: 'Full course, studied online',
  practical: 'Online learning + short practical session',
};

const QUAL_ENTRY = [
  'A Unique Student Identifier (USI) – free to create at usi.gov.au',
  'Language, literacy and numeracy skills suited to the course (usually a short check)',
  'Access to a computer or tablet and reliable internet',
];

export const courses = [
  // ── Community & care ────────────────────────────────────────────────────
  {
    code: 'CHC33021',
    short: 'Individual Support',
    keywords: 'aged care, aged-care, nursing home, residential care, home care, personal care, personal care assistant, pca, carer, caregiver, care worker, support worker, disability, ndis, community care, cert 3, cert iii, certificate 3, assistant in nursing, ain, elderly',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'chc33021-certificate-iii-individual-support',
    title: 'Certificate III in Individual Support',
    sector: 'care',
    level: 'cert3',
    popular: true,
    summary:
      'The starting qualification for hands-on support work in aged care, disability and home care.',
    intro:
      'This certificate teaches you how to support people with everyday living, personal care and wellbeing, safely and respectfully. It is the qualification most aged care and disability employers look for when hiring support workers.',
    suits: [
      'People starting a career in aged care, disability or home care',
      'Support workers who have the experience but not the certificate',
      'Carers who want their skills formally recognised',
    ],
    roles: [
      'Personal care worker',
      'Aged care worker',
      'Disability support worker',
      'Home and community care worker',
      'Respite care worker',
    ],
    topics: [
      'Person-centred support and individual rights',
      'Personal care, mobility and daily living support',
      'Recognising and responding to health changes',
      'Safe work practices and infection control',
      'Communication, culture and inclusion',
      'Specialist electives such as dementia, disability or palliative care',
    ],
    duration: { study: '6–12 months', rpl: 'Often 4–12 weeks' },
    placement: { required: true, detail: 'At least 120 hours in an approved workplace' },
    entry: [...QUAL_ENTRY, 'A National Police Check (and NDIS Worker Screening for disability work)'],
    pathways: ['rpl', 'online'],
    next: ['CHC43121', 'CHC43015', 'CHC52025'],
    confirm: ['duration', 'placement', 'entry'],
  },
  {
    code: 'CHC43121',
    short: 'Disability Support',
    keywords: 'disability, ndis, support worker, disability support worker, senior support worker, team leader, behaviour support, community access, cert 4, cert iv, certificate 4, carer',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'chc43121-certificate-iv-disability-support',
    title: 'Certificate IV in Disability Support',
    sector: 'care',
    level: 'cert4',
    popular: true,
    summary:
      'For experienced disability workers ready to take on more responsibility and lead day-to-day support.',
    intro:
      'This qualification builds on frontline experience. You learn to plan and coordinate supports, promote independence and choice, and guide other workers – the skills behind team leader and senior support roles in the NDIS sector.',
    suits: [
      'Disability support workers moving into senior or coordination roles',
      'NDIS workers who want a formal qualification for their experience',
      'Certificate III graduates ready for the next step',
    ],
    roles: [
      'Senior disability support worker',
      'Team leader – disability services',
      'Support coordinator (entry level)',
      'Community access worker',
      'Behaviour support assistant',
    ],
    topics: [
      'Person-centred and strengths-based practice',
      'Supporting independence, choice and community participation',
      'Working within the NDIS framework',
      'Responding to behaviours of concern',
      'Facilitating support plans and reviewing outcomes',
      'Supporting and mentoring other workers',
    ],
    duration: { study: '6–12 months', rpl: 'Often 4–12 weeks' },
    placement: { required: true, detail: 'Required – hours set by the qualification' },
    entry: [...QUAL_ENTRY, 'NDIS Worker Screening Check and a National Police Check'],
    pathways: ['rpl', 'online'],
    next: ['CHC52025', 'CHC62015'],
    confirm: ['duration', 'placement', 'entry'],
  },
  {
    code: 'CHC43015',
    short: 'Ageing Support',
    keywords: 'aged care, aged-care, nursing home, residential care, senior carer, care coordinator, team leader, dementia, palliative, lifestyle coordinator, cert 4, cert iv, certificate 4, elderly',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'chc43015-certificate-iv-ageing-support',
    title: 'Certificate IV in Ageing Support',
    sector: 'care',
    level: 'cert4',
    summary:
      'For aged care workers stepping up to senior carer, team leader or care coordination roles.',
    intro:
      'This certificate deepens your aged care skills and adds responsibility for planning, coordinating and reviewing care. It suits people who already work in residential or home aged care and want to lead others.',
    suits: [
      'Aged care workers moving into senior or leadership roles',
      'Experienced carers without a Certificate IV',
      'Certificate III graduates who want to specialise in aged care',
    ],
    roles: [
      'Senior personal care worker',
      'Care team leader',
      'Care coordinator',
      'Lifestyle and activities coordinator',
    ],
    topics: [
      'Planning and coordinating person-centred care',
      'Supporting people living with dementia',
      'Palliative and end-of-life support',
      'Recognising health changes and escalating concerns',
      'Leading and supervising care workers',
      'Legal and ethical responsibilities',
    ],
    duration: { study: '6–12 months', rpl: 'Often 4–12 weeks' },
    placement: { required: true, detail: 'Required – hours set by the qualification' },
    entry: [...QUAL_ENTRY, 'A National Police Check'],
    pathways: ['rpl', 'online'],
    next: ['CHC52025', 'CHC62015'],
    confirm: ['duration', 'placement', 'entry'],
  },
  {
    code: 'CHC52025',
    short: 'Community Services',
    keywords: 'community services, community work, case manager, case management, social work, social worker, youth worker, family support, housing, welfare, coordinator, diploma',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'chc52025-diploma-of-community-services',
    title: 'Diploma of Community Services',
    sector: 'care',
    level: 'diploma',
    popular: true,
    summary:
      'A broad leadership qualification for case management and program roles across the community sector.',
    intro:
      'The diploma prepares you to manage cases, run programs and supervise staff in community organisations – from housing and family services to disability and youth work. It is a common requirement for coordinator and case manager positions.',
    suits: [
      'Experienced community, disability or aged care workers',
      'Case workers who want a formal leadership qualification',
      'Certificate IV graduates aiming for coordinator roles',
    ],
    roles: [
      'Case manager',
      'Community services coordinator',
      'Program or project officer',
      'Family support worker',
      'Team leader – community services',
    ],
    topics: [
      'Case management and complex needs',
      'Advocacy and client rights',
      'Program planning and evaluation',
      'Supervising and supporting staff',
      'Working with diverse communities',
      'Ethical and legal practice',
    ],
    duration: { study: '12–18 months', rpl: 'Often 6–12 weeks' },
    placement: { required: true, detail: 'Required – hours set by the qualification' },
    entry: [...QUAL_ENTRY, 'A National Police Check and Working with Children Check (if working with young people)'],
    pathways: ['rpl', 'online'],
    next: ['CHC62015'],
    confirm: ['duration', 'placement', 'entry'],
  },
  {
    code: 'CHC62015',
    short: 'Community Sector Management',
    keywords: 'manager, management, service manager, not-for-profit, nfp, ngo, community sector, operations manager, advanced diploma, leadership',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'chc62015-advanced-diploma-community-sector-management',
    title: 'Advanced Diploma of Community Sector Management',
    sector: 'care',
    level: 'adv-diploma',
    summary:
      'For managers who lead services, teams and budgets in not-for-profit and community organisations.',
    intro:
      'This is a senior management qualification for the community sector. It covers strategy, governance, finance, people leadership and service quality – the work of running a program or organisation rather than delivering it.',
    suits: [
      'Service and program managers',
      'Team leaders moving into senior management',
      'Owners of community, disability or care businesses',
    ],
    roles: [
      'Service manager',
      'Operations or program manager',
      'Community organisation manager',
      'Practice manager',
    ],
    topics: [
      'Strategic and business planning',
      'Governance, risk and compliance',
      'Financial management',
      'Leading teams and managing performance',
      'Service quality and continuous improvement',
      'Stakeholder and community engagement',
    ],
    duration: { study: '12–18 months', rpl: 'Often 6–12 weeks' },
    placement: { required: false, detail: 'Usually workplace-based assessment rather than a set placement' },
    entry: [...QUAL_ENTRY, 'Experience in a leadership or management role is strongly recommended'],
    pathways: ['rpl', 'online'],
    next: [],
    confirm: ['code', 'duration', 'placement', 'entry'],
  },
  {
    code: 'CHC51015',
    short: 'Counselling',
    keywords: 'counselling, counseling, counsellor, counselor, mental health, wellbeing, therapy, family support, youth worker, diploma',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'chc51015-diploma-of-counselling',
    title: 'Diploma of Counselling',
    sector: 'care',
    level: 'diploma',
    summary:
      'Practical counselling skills for supporting people through personal, family and life challenges.',
    intro:
      'The diploma trains you to work with clients using structured counselling approaches, from building rapport to supporting change. Graduates work in community, youth, family and wellbeing services.',
    suits: [
      'Community workers who already support people one-on-one',
      'People moving into counselling or wellbeing roles',
      'Experienced helpers who want a recognised qualification',
    ],
    roles: [
      'Counsellor (community or private setting)',
      'Family support worker',
      'Youth worker',
      'Wellbeing or intake officer',
    ],
    topics: [
      'Counselling frameworks and therapeutic approaches',
      'Establishing and maintaining client relationships',
      'Working with clients with complex or co-existing needs',
      'Loss, grief and trauma-informed practice',
      'Case notes, ethics and professional boundaries',
      'Self-care and reflective practice',
    ],
    duration: { study: '12–18 months', rpl: 'Often 6–12 weeks' },
    placement: { required: true, detail: 'Supervised counselling practice required' },
    entry: [...QUAL_ENTRY, 'A National Police Check and Working with Children Check may be required'],
    pathways: ['rpl', 'online'],
    next: ['CHC62015'],
    confirm: ['code', 'duration', 'placement', 'entry'],
  },

  // ── Early childhood & education ─────────────────────────────────────────
  {
    code: 'CHC30125',
    short: 'Early Childhood Education and Care',
    keywords: 'childcare, child care, daycare, day care, early childhood, early learning, ecec, kindy, kindergarten, preschool, pre-school, nursery, educator, family day care, cert 3, cert iii, certificate 3, babies, toddlers',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'chc30125-certificate-iii-early-childhood-education-care',
    title: 'Certificate III in Early Childhood Education and Care',
    sector: 'education',
    level: 'cert3',
    popular: true,
    summary:
      'The entry qualification for working as an educator in childcare, kindergarten and family day care.',
    intro:
      'This certificate covers how young children learn, play and stay safe, and how educators support them under the national early childhood frameworks. It meets the minimum qualification requirement for many educator roles.',
    suits: [
      'People starting a career in childcare',
      'Parents and carers moving into early learning work',
      'Educators already working towards a qualification',
    ],
    roles: [
      'Early childhood educator',
      'Childcare assistant',
      'Family day care educator',
      'Outside school hours care assistant',
    ],
    topics: [
      'Child development and play-based learning',
      'The Early Years Learning Framework',
      'Health, safety and wellbeing of children',
      'Child protection and safe environments',
      'Building relationships with children and families',
      'Inclusion and cultural safety',
    ],
    duration: { study: '6–12 months', rpl: 'Often 4–12 weeks' },
    placement: { required: true, detail: 'At least 160 hours in a regulated children’s service' },
    entry: [...QUAL_ENTRY, 'A valid Working with Children Check'],
    pathways: ['rpl', 'online'],
    next: ['CHC50125', 'CHC50225'],
    confirm: ['duration', 'placement', 'entry'],
  },
  {
    code: 'CHC40225',
    short: 'School Based Education Support',
    keywords: 'teacher aide, teachers aide, teacher assistant, education support, integration aide, learning support, school support officer, classroom assistant, school, cert 4, cert iv, certificate 4',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'chc40225-certificate-iv-school-based-education-support',
    title: 'Certificate IV in School Based Education Support',
    sector: 'education',
    level: 'cert4',
    summary:
      'For education support staff helping students learn in primary and secondary classrooms.',
    intro:
      'This qualification prepares you to support teachers and students with literacy, numeracy, behaviour and inclusion. It suits teacher aides, learning support officers and integration aides.',
    suits: [
      'Teacher aides and learning support officers',
      'Parents and volunteers who already help in schools',
      'People moving from childcare into school settings',
    ],
    roles: [
      'Education support officer',
      'Teacher aide or assistant',
      'Integration or inclusion aide',
      'Learning support officer',
    ],
    topics: [
      'Supporting literacy and numeracy learning',
      'Supporting students with additional needs',
      'Positive behaviour support in the classroom',
      'Working under the direction of teachers',
      'Child protection and student wellbeing',
      'Using digital learning tools',
    ],
    duration: { study: '6–12 months', rpl: 'Often 4–12 weeks' },
    placement: { required: true, detail: 'At least 100 hours in a school setting' },
    entry: [...QUAL_ENTRY, 'A valid Working with Children Check'],
    pathways: ['rpl', 'online'],
    next: ['CHC50225'],
    confirm: ['duration', 'placement', 'entry'],
  },
  {
    code: 'CHC50125',
    short: 'Early Childhood Education and Care (Diploma)',
    keywords: 'childcare, child care, daycare, day care, early childhood, early learning, ecec, kindy, kindergarten, preschool, room leader, educational leader, centre director, center director, childcare diploma, diploma',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'chc50125-diploma-early-childhood-education-care',
    title: 'Diploma of Early Childhood Education and Care',
    sector: 'education',
    level: 'diploma',
    popular: true,
    summary:
      'The qualification for room leaders, educational leaders and centre management in early learning.',
    intro:
      'The diploma builds on educator skills with curriculum planning, leadership and compliance. Diploma-qualified educators often lead rooms, mentor staff and can work towards centre director roles.',
    suits: [
      'Certificate III educators ready to lead a room',
      'Experienced educators who want their skills recognised',
      'People aiming for educational leader or director roles',
    ],
    roles: [
      'Diploma-qualified educator',
      'Room leader',
      'Educational leader',
      'Assistant director or centre director',
    ],
    topics: [
      'Designing and evaluating curriculum',
      'Leading a team of educators',
      'Meeting the National Quality Standard',
      'Supporting children with additional needs',
      'Partnerships with families and community',
      'Sustainable practice and wellbeing',
    ],
    duration: { study: '12–18 months', rpl: 'Often 6–12 weeks' },
    placement: { required: true, detail: 'Required – hours set by the qualification' },
    entry: [...QUAL_ENTRY, 'A valid Working with Children Check'],
    pathways: ['rpl', 'online'],
    next: [],
    confirm: ['duration', 'placement', 'entry'],
  },
  {
    code: 'CHC50225',
    short: 'School Age Education and Care',
    keywords: 'oshc, outside school hours care, after school care, before school care, vacation care, holiday program, school age care, childcare, child care, coordinator, diploma',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'chc50225-diploma-school-age-education-care',
    title: 'Diploma of School Age Education and Care',
    sector: 'education',
    level: 'diploma',
    summary:
      'For coordinators and leaders in outside school hours care (OSHC) and vacation care programs.',
    intro:
      'This diploma focuses on school-age children aged roughly 5–12 in before and after school care and holiday programs. You learn to plan programs, lead staff and run a compliant, engaging service.',
    suits: [
      'OSHC educators moving into coordinator roles',
      'Experienced vacation care staff',
      'Education support workers who want to lead programs',
    ],
    roles: [
      'OSHC coordinator',
      'Assistant coordinator',
      'Vacation care coordinator',
      'School-age care educator',
    ],
    topics: [
      'Planning programs for school-age children',
      'Leading and supervising educators',
      'The My Time, Our Place framework',
      'Child safety, health and wellbeing',
      'Working with families and schools',
      'Service compliance and quality',
    ],
    duration: { study: '12–18 months', rpl: 'Often 6–12 weeks' },
    placement: { required: true, detail: 'Required – hours set by the qualification' },
    entry: [...QUAL_ENTRY, 'A valid Working with Children Check'],
    pathways: ['rpl', 'online'],
    next: [],
    confirm: ['duration', 'placement', 'entry'],
  },

  // ── Training & assessment ───────────────────────────────────────────────
  {
    code: 'TAE40122',
    short: 'Training and Assessment',
    keywords: 'tae, trainer, assessor, trainer and assessor, teaching adults, teach, workplace trainer, vet, rto trainer, learning and development, l&d, cert 4, cert iv, certificate 4',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'tae40122-certificate-iv-training-assessment',
    title: 'Certificate IV in Training and Assessment',
    sector: 'training',
    level: 'cert4',
    popular: true,
    summary:
      'The qualification you need to train and assess others in the vocational education sector.',
    intro:
      'Often called the “TAE”, this certificate qualifies you to design, deliver and assess nationally recognised training. It is the standard requirement for trainers and assessors at RTOs and is valued by employers running workplace training.',
    suits: [
      'Experienced tradespeople and professionals who want to teach their skill',
      'Workplace trainers who need a formal qualification',
      'People who already train others informally',
    ],
    roles: [
      'Trainer and assessor (VET)',
      'Workplace trainer',
      'Learning and development officer',
      'Compliance or induction trainer',
    ],
    topics: [
      'Planning and delivering training sessions',
      'Designing and developing assessment tools',
      'Assessing competence and recording results',
      'Supporting learners’ language, literacy and numeracy',
      'Working within the VET system',
      'Making the most of digital and online delivery',
    ],
    duration: { study: '6–12 months', rpl: 'Often 4–12 weeks' },
    placement: { required: false, detail: 'No set placement, but you must deliver and assess real training sessions' },
    entry: [...QUAL_ENTRY, 'Vocational competence in the area you intend to train in', 'Usually 18 years or older'],
    pathways: ['rpl', 'online'],
    next: [],
    confirm: ['duration', 'entry'],
  },

  // ── Leadership & safety ─────────────────────────────────────────────────
  {
    code: 'BSB41419',
    short: 'Work Health and Safety',
    keywords: 'whs, ohs, oh&s, ohs officer, safety officer, health and safety, workplace safety, safety, hsr, health and safety representative, cert 4, cert iv, certificate 4',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'bsb41419-certificate-iv-work-health-safety',
    title: 'Certificate IV in Work Health and Safety',
    sector: 'business',
    level: 'cert4',
    summary:
      'For people who coordinate safety at work – from identifying hazards to running consultation and incident responses.',
    intro:
      'This certificate covers the practical side of workplace health and safety: managing risks, consulting with workers, responding to incidents and meeting legal duties. It suits WHS officers and supervisors in any industry.',
    suits: [
      'Supervisors and team leaders with safety responsibilities',
      'Health and safety representatives',
      'People moving into WHS officer roles',
    ],
    roles: [
      'WHS officer or coordinator',
      'Safety advisor',
      'Site or operations supervisor',
      'Health and safety representative',
    ],
    topics: [
      'WHS law and duties of care',
      'Identifying hazards and controlling risks',
      'Consultation and participation processes',
      'Incident response and investigation',
      'Monitoring safety systems',
      'Contributing to emergency preparedness',
    ],
    duration: { study: '6–12 months', rpl: 'Often 4–10 weeks' },
    placement: { required: false, detail: 'No placement – assessed through workplace tasks and projects' },
    entry: [...QUAL_ENTRY],
    pathways: ['rpl', 'online'],
    next: ['BSB50420'],
    confirm: ['code', 'duration', 'entry'],
  },
  {
    code: 'BSB50420',
    short: 'Leadership and Management',
    keywords: 'leadership, management, manager, team leader, supervisor, frontline manager, people management, business, diploma',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'bsb50420-diploma-leadership-management',
    title: 'Diploma of Leadership and Management',
    sector: 'business',
    level: 'diploma',
    summary:
      'Practical management skills for leading people, projects and performance in any industry.',
    intro:
      'This diploma suits new and experienced managers. It covers leading teams, managing performance, planning operations and building a positive workplace – useful in care, education, trades and business alike.',
    suits: [
      'Team leaders and supervisors in any sector',
      'Managers without a formal qualification',
      'Business owners who lead a team',
    ],
    roles: [
      'Team leader or supervisor',
      'Operations manager',
      'Department or program manager',
      'Small business manager',
    ],
    topics: [
      'Leading and developing teams',
      'Managing performance and wellbeing',
      'Operational planning and budgets',
      'Communication and workplace relationships',
      'Managing risk and continuous improvement',
      'Emotional intelligence in leadership',
    ],
    duration: { study: '12–18 months', rpl: 'Often 6–12 weeks' },
    placement: { required: false, detail: 'No placement – assessed through workplace projects' },
    entry: [...QUAL_ENTRY],
    pathways: ['rpl', 'online'],
    next: [],
    confirm: ['duration', 'entry'],
  },

  // ── Building & construction ─────────────────────────────────────────────
  {
    code: 'CPC50220',
    short: 'Building and Construction',
    keywords: 'builder, building, construction, builders licence, builders license, building licence, site supervisor, site manager, project manager, estimator, carpenter, trades, diploma',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'cpc50220-diploma-building-construction',
    title: 'Diploma of Building and Construction (Building)',
    sector: 'construction',
    level: 'diploma',
    summary:
      'For experienced builders and site supervisors moving into building and project management.',
    intro:
      'This diploma covers the management side of building: contracts, codes and standards, estimating, scheduling and site supervision. It is commonly used as part of a pathway towards builder registration or licensing, which is regulated by each state.',
    suits: [
      'Carpenters and tradespeople moving into supervision',
      'Site supervisors and leading hands',
      'People working towards builder registration',
    ],
    roles: [
      'Site supervisor or site manager',
      'Project manager (building)',
      'Estimator',
      'Building contractor',
    ],
    topics: [
      'Building codes and standards',
      'Contracts and project administration',
      'Estimating, costing and tendering',
      'Planning and scheduling building projects',
      'Managing WHS on building sites',
      'Structural principles for low-rise buildings',
    ],
    duration: { study: '12–18 months', rpl: 'Often 6–12 weeks' },
    placement: { required: false, detail: 'No placement – relevant industry experience is strongly recommended' },
    entry: [...QUAL_ENTRY, 'Building industry experience is usually expected', 'Licensing rules differ by state – check with your state regulator'],
    pathways: ['rpl', 'online'],
    next: [],
    confirm: ['duration', 'entry'],
  },

  // ── First aid & CPR ─────────────────────────────────────────────────────
  {
    code: 'HLTAID009',
    short: 'CPR',
    keywords: 'cpr, resuscitation, defibrillator, defib, aed, cpr refresher, cpr certificate, first aid',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'hltaid009-provide-cpr',
    title: 'Provide Cardiopulmonary Resuscitation (CPR)',
    sector: 'firstaid',
    level: 'unit',
    unit: true,
    summary: 'A short course in CPR and using a defibrillator. Usually refreshed every 12 months.',
    intro:
      'This nationally recognised unit teaches you to recognise an unresponsive casualty, perform CPR on adults, children and infants, and use an automated external defibrillator (AED). Many workplaces ask staff to renew it each year.',
    suits: [
      'Care, education and fitness workers who need a current CPR certificate',
      'Anyone renewing their yearly CPR',
      'Parents and community volunteers',
    ],
    roles: ['Required or recommended for most care, childcare, school and community roles'],
    topics: [
      'Checking for danger and response (DRSABCD)',
      'CPR on adults, children and infants',
      'Using an AED safely',
      'Managing the casualty until help arrives',
      'Reporting the incident',
    ],
    duration: { study: 'Online learning plus a short in-person assessment' },
    placement: { required: false, detail: 'A practical assessment, including CPR on a manikin on the floor, is required' },
    entry: ['A Unique Student Identifier (USI)', 'Ability to kneel on the floor and perform two minutes of uninterrupted CPR'],
    pathways: ['practical'],
    next: ['HLTAID011'],
    confirm: ['duration', 'entry'],
  },
  {
    code: 'HLTAID011',
    short: 'First Aid',
    keywords: 'first aid, first-aid, first aid certificate, provide first aid, workplace first aid, cpr',
    fees: null, // CONFIRM: add the verified fee, e.g. 'From $1,200 (RPL)'
    slug: 'hltaid011-provide-first-aid',
    title: 'Provide First Aid',
    sector: 'firstaid',
    level: 'unit',
    unit: true,
    popular: true,
    summary: 'The standard workplace first aid certificate, including CPR. Usually renewed every three years.',
    intro:
      'This is the first aid course most employers mean when they ask for a “first aid certificate”. It covers CPR plus how to manage common injuries and illnesses until medical help arrives.',
    suits: [
      'Workers who need a first aid certificate for their job',
      'Childcare and care workers (check if your role needs a specialist unit)',
      'Anyone who wants to be ready in an emergency',
    ],
    roles: ['Required for workplace first aiders and many care, education and trade roles'],
    topics: [
      'CPR and using an AED',
      'Bleeding, burns, fractures and wounds',
      'Asthma, anaphylaxis and allergic reactions',
      'Choking, seizures and medical emergencies',
      'Communicating in an emergency and reporting',
    ],
    duration: { study: 'Online learning plus a short in-person assessment' },
    placement: { required: false, detail: 'A practical assessment, including CPR on a manikin on the floor, is required' },
    entry: ['A Unique Student Identifier (USI)', 'Ability to kneel on the floor and perform two minutes of uninterrupted CPR'],
    pathways: ['practical'],
    next: [],
    confirm: ['duration', 'entry'],
  },
];

// Course card photos (4:3, saved at 480 and 800px wide in assets/img/).
// Pexels photos are used under the Pexels License; where an area photo
// (Unsplash) suits the course it is reused. Credits are listed in CREDITS.md.
const pexels = (file, id, alt, credit) => ({ file: `courses/${file}`, alt, credit, source: 'Pexels', url: `https://www.pexels.com/photo/${id}/` });
const area = (id) => sectors.find((s) => s.id === id).image;
const PHOTOS = {
  CHC33021: pexels('chc33021', 18429308, 'A care worker chatting with older people around a table', 'Jsme MILA'),
  CHC43121: pexels('chc43121', 8127496, 'A support worker kneeling beside a woman to help her', 'Ivan S'),
  CHC43015: area('care'),
  CHC52025: pexels('chc52025', 9870141, 'A community worker meeting with a couple at a kitchen table', 'Ron Lach'),
  CHC62015: pexels('chc62015', 7640816, 'A manager with a clipboard checking in with her team', 'Yan Krukau'),
  CHC51015: pexels('chc51015', 3958423, 'A counsellor listening to a client in a calm room', 'Polina Zimmerman'),
  CHC30125: pexels('chc30125', 8613089, 'An educator reading a story to a group of young children', 'Yan Krukau'),
  CHC40225: pexels('chc40225', 5905486, 'An education support worker helping a pupil with his work', 'Katerina Holmes'),
  CHC50125: pexels('chc50125', 8535169, 'An early childhood educator sharing a book with children', 'Ksenia Chernaya'),
  CHC50225: pexels('chc50225', 8612993, 'An educator painting with school-age children', 'Yan Krukau'),
  TAE40122: area('training'),
  BSB41419: pexels('bsb41419', 8293666, 'A safety officer in a hard hat and hi-vis vest holding a clipboard', 'RDNE Stock project'),
  BSB50420: area('business'),
  CPC50220: area('construction'),
  HLTAID009: area('firstaid'),
  HLTAID011: pexels('hltaid011', 6519905, 'A first aider bandaging someone’s hand', 'RDNE Stock project'),
};
for (const c of courses) c.image = PHOTOS[c.code];

export const courseByCode = Object.fromEntries(courses.map((c) => [c.code, c]));
export const sectorById = Object.fromEntries(sectors.map((s) => [s.id, s]));
export const levelById = Object.fromEntries(levels.map((l) => [l.id, l]));
