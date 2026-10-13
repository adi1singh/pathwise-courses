// Routes shown on the home page Pathway Map. Each route is a set of steps from
// entry level upwards; a step can offer two alternative courses. Adjust these
// if Poonam would steer people differently.
export const routes = [
  { id: 'care', color: 'care', img: 'areas/care', label: 'Aged care & disability', icon: 'heart', steps: [['CHC33021'], ['CHC43121', 'CHC43015'], ['CHC52025'], ['CHC62015']] },
  { id: 'early', color: 'education', img: 'courses/chc30125', label: 'Early childhood', icon: 'blocks', steps: [['CHC30125'], ['CHC50125']] },
  { id: 'school', color: 'education', img: 'courses/chc40225', label: 'Schools & OSHC', icon: 'book', steps: [['CHC40225'], ['CHC50225']] },
  { id: 'community', color: 'care', img: 'courses/chc52025', label: 'Community & counselling', icon: 'users', steps: [['CHC33021'], ['CHC52025', 'CHC51015'], ['CHC62015']] },
  { id: 'lead', color: 'business', img: 'areas/training', label: 'Training & leadership', icon: 'compass', steps: [['TAE40122', 'BSB41419'], ['BSB50420']] },
];

export const experience = [
  { id: 'new', label: 'I’m new to this work' },
  { id: 'some', label: 'Under 2 years’ experience' },
  { id: 'exp', label: '2+ years in the field' },
  { id: 'qual', label: 'I hold the first qualification' },
];
