// Course finder questions and the rules behind its suggestions.
//
// Suggestions come only from the course data in courses.js (levels, study
// options, typical durations, placement and job titles). They are initial
// guidance: no match scores are shown and eligibility is always confirmed by
// the training provider.

export const interests = [
  { id: 'aged-disability', label: 'Aged care or disability support', hint: 'Personal care, NDIS, home care', phrase: 'aged care and disability support', courses: ['CHC33021', 'CHC43121', 'CHC43015'] },
  { id: 'early-childhood', label: 'Childcare and early learning', hint: 'Long day care, kindy, family day care', phrase: 'childcare and early learning', courses: ['CHC30125', 'CHC50125'] },
  { id: 'school', label: 'Schools and after-school care', hint: 'Teacher aide, OSHC, vacation care', phrase: 'supporting school-age children', courses: ['CHC40225', 'CHC50225'] },
  { id: 'community', label: 'Community services or counselling', hint: 'Case work, family support, counselling', phrase: 'community services and counselling', courses: ['CHC52025', 'CHC51015', 'CHC62015'] },
  { id: 'training', label: 'Training and assessing others', hint: 'Trainer & assessor, workplace trainer', phrase: 'training and assessing others', courses: ['TAE40122'] },
  { id: 'leadership', label: 'Leading teams or workplace safety', hint: 'Team leader, manager, WHS officer', phrase: 'leadership and workplace safety', courses: ['BSB50420', 'BSB41419', 'CHC62015'] },
  { id: 'building', label: 'Building and construction', hint: 'Site supervisor, builder, estimator', phrase: 'building and construction', courses: ['CPC50220'] },
  { id: 'firstaid', label: 'A first aid or CPR certificate', hint: 'For work or for peace of mind', phrase: 'first aid and CPR', courses: ['HLTAID011', 'HLTAID009'] },
  { id: 'unsure', label: 'I’m not sure yet', hint: 'Show me common starting points', phrase: 'exploring your options', courses: ['CHC33021', 'CHC30125', 'CHC40225', 'CHC52025', 'TAE40122', 'BSB50420'] },
];

export const questions = [
  {
    id: 'interest',
    title: 'What kind of work interests you?',
    hint: 'Choose the area that fits best. You can change it later.',
    options: interests.map(({ id, label, hint }) => ({ id, label, hint })),
  },
  {
    id: 'exp',
    title: 'How much experience do you have in this kind of work?',
    hint: 'Paid or unpaid, in Australia or overseas – it all counts.',
    options: [
      { id: 'none', label: 'None yet' },
      { id: '<1', label: 'Less than a year' },
      { id: '1-2', label: '1–2 years' },
      { id: '3-5', label: '3–5 years' },
      { id: '5+', label: 'More than 5 years' },
    ],
  },
  {
    id: 'held',
    title: 'What’s the highest qualification you hold in this area?',
    hint: 'Only count qualifications in the area you chose.',
    skipFor: ['firstaid'],
    options: [
      { id: 'none', label: 'None yet' },
      { id: 'cert3', label: 'Certificate III' },
      { id: 'cert4', label: 'Certificate IV' },
      { id: 'diploma', label: 'Diploma or higher' },
    ],
  },
  {
    id: 'goal',
    title: 'What would you most like to do next?',
    hint: 'This helps Poonam suggest the right level and study pathway.',
    options: [
      { id: 'start', label: 'Start working in this field' },
      { id: 'qualify', label: 'Get qualified for work I already do' },
      { id: 'stepup', label: 'Move into a senior or leadership role' },
      { id: 'skill', label: 'Add a specific skill or refresh my skills' },
    ],
  },
];

// Courses that lead towards senior, coordination or leadership roles
// (based on the job titles listed for each course).
export const stepUpCourses = ['CHC43121', 'CHC43015', 'CHC52025', 'CHC62015', 'CHC50125', 'CHC50225', 'BSB50420', 'BSB41419', 'TAE40122'];
