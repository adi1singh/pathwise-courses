// Short, non-accredited professional development (CPD) courses.
//
// These are skill refreshers, not nationally recognised qualifications.
// CONFIRM before launch: which of these Poonam actually offers, who delivers
// them, the price of each, and the exact durations. Until then every card
// says "Price on enquiry" and the format is described as approximate.

export const shortCategories = [
  { id: 'clinical', name: 'Clinical & complex care', short: 'Clinical care' },
  { id: 'ndis', name: 'NDIS & supported living', short: 'NDIS' },
  { id: 'mental', name: 'Mental health & wellbeing', short: 'Mental health' },
  { id: 'safety', name: 'Safety & compliance', short: 'Safety' },
  { id: 'workplace', name: 'Workplace skills', short: 'Workplace' },
];

export const formats = {
  quick: { name: 'Quick refresher', time: 'About 1 hour' },
  indepth: { name: 'In-depth', time: 'About 20 hours' },
};

export const shortCourses = [
  // Clinical & complex care
  { id: 'medication', title: 'Medication support for disability workers', category: 'clinical', format: 'indepth', summary: 'Safe medication assistance, the “rights” of medication, recording and what to do when something goes wrong.' },
  { id: 'epilepsy', title: 'Epilepsy and seizure support', category: 'clinical', format: 'indepth', summary: 'Recognise seizure types, follow a seizure management plan and respond safely, including emergency medication awareness.' },
  { id: 'diabetes', title: 'Diabetes support', category: 'clinical', format: 'quick', summary: 'Understand diabetes, spot high and low blood sugar, and support people with diet, monitoring and routines.' },
  { id: 'mealtime', title: 'Mealtime and swallowing support', category: 'clinical', format: 'quick', summary: 'Support safe eating and drinking, follow mealtime plans and recognise signs of choking risk.' },
  { id: 'peg', title: 'Enteral feeding (PEG) support', category: 'clinical', format: 'indepth', summary: 'Hygiene, positioning and care routines for people who receive nutrition through a feeding tube.' },
  { id: 'catheter', title: 'Catheter and stoma care', category: 'clinical', format: 'quick', summary: 'Dignified, hygienic support for people with catheters or stomas, and when to escalate concerns.' },
  { id: 'palliative', title: 'Palliative and end-of-life care', category: 'clinical', format: 'quick', summary: 'Compassionate support for people at the end of life and their families, including comfort care.' },

  // NDIS & supported living
  { id: 'pbs', title: 'Positive behaviour support', category: 'ndis', format: 'quick', summary: 'Understand why behaviours happen and use proactive, respectful strategies that follow a behaviour support plan.' },
  { id: 'restrictive', title: 'Behaviour support and restrictive practices', category: 'ndis', format: 'indepth', summary: 'What counts as a restrictive practice, the rules around them and how to reduce their use.' },
  { id: 'active-support', title: 'Person-centred active support', category: 'ndis', format: 'quick', summary: 'Help people take part in everyday activities at home and in the community, at their own pace.' },
  { id: 'choice', title: 'Supporting choice and decision-making', category: 'ndis', format: 'quick', summary: 'Practical ways to support people to make their own decisions and have them respected.' },
  { id: 'safeguarding', title: 'Safeguarding in shared living', category: 'ndis', format: 'quick', summary: 'Recognise abuse, neglect and exploitation in shared homes, and know how to report it.' },
  { id: 'deescalation', title: 'De-escalation skills for support workers', category: 'ndis', format: 'quick', summary: 'Calm, safe responses when a situation becomes tense, for you and the people you support.' },

  // Mental health & wellbeing
  { id: 'mental-health', title: 'Introduction to mental health', category: 'mental', format: 'indepth', summary: 'Common mental health conditions, reducing stigma and supporting recovery in everyday work.' },
  { id: 'autism', title: 'Autism awareness and understanding', category: 'mental', format: 'indepth', summary: 'Understand autism from a strengths-based view and adapt communication and environments.' },
  { id: 'dementia', title: 'Supporting people living with dementia', category: 'mental', format: 'indepth', summary: 'How dementia affects people, communication tips and responding to changed behaviours with care.' },
  { id: 'trauma', title: 'Trauma-informed care', category: 'mental', format: 'quick', summary: 'How trauma affects people and how to offer support that feels safe, consistent and empowering.' },
  { id: 'suicide', title: 'Suicide prevention awareness', category: 'mental', format: 'quick', summary: 'Recognise warning signs, ask directly and connect people with the right help.' },

  // Safety & compliance
  { id: 'infection', title: 'Infection prevention and control', category: 'safety', format: 'indepth', summary: 'Hand hygiene, PPE, cleaning and the standard precautions every care worker needs.' },
  { id: 'manual-handling', title: 'Manual handling', category: 'safety', format: 'quick', summary: 'Safe lifting, moving and transfers to protect both you and the people you support.' },
  { id: 'incidents', title: 'Incident management and reporting', category: 'safety', format: 'quick', summary: 'What counts as an incident, what to record and how to report it clearly and on time.' },
  { id: 'whs-care', title: 'Work health and safety in care services', category: 'safety', format: 'quick', summary: 'Your WHS rights and responsibilities, and how to spot and report hazards in care settings.' },
  { id: 'emergency', title: 'Emergency and disaster planning', category: 'safety', format: 'quick', summary: 'Prepare for fires, floods and outages so the people you support stay safe.' },

  // Workplace skills
  { id: 'ai', title: 'Using AI tools at work', category: 'workplace', format: 'indepth', summary: 'Practical, responsible ways to use AI tools for everyday tasks, with privacy and accuracy in mind.' },
];
