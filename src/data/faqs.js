// Frequently asked questions, grouped by topic. Answers are plain-language
// general information. Items with `confirm: true` describe how Poonam works or
// what she charges, so she must check them before launch.

export const faqGroups = [
  {
    id: 'start',
    name: 'Getting started',
    items: [
      {
        q: 'I’m not sure which course is right for me. Where do I start?',
        a: 'Start with a free chat or the online eligibility check. Tell Poonam about your work so far and where you want to go, and she will suggest a course and the most sensible way to get it – or tell you honestly if now isn’t the right time.',
      },
      {
        q: 'Does the eligibility check cost anything or lock me in?',
        a: 'No. The eligibility check is free and there is no obligation to enrol. You won’t be asked for payment details to have a conversation.',
        confirm: true,
      },
      {
        q: 'Who actually delivers the course and issues my certificate?',
        a: 'Nationally recognised qualifications can only be issued by a Registered Training Organisation (RTO). Pathwise Courses is an advisory service, not an RTO: Poonam helps you choose and prepare, and a partner RTO enrols, trains, assesses and issues your qualification. You will always be told which RTO before you enrol.',
        confirm: true,
      },
      {
        q: 'Can I study from anywhere in Australia?',
        a: 'Most theory can be completed online from anywhere. Some courses need a work placement or an in-person practical assessment, which is arranged in your area where possible.',
        confirm: true,
      },
    ],
  },
  {
    id: 'rpl',
    name: 'Recognition of prior learning (RPL)',
    items: [
      {
        q: 'What is recognition of prior learning?',
        a: 'RPL is a formal assessment of the skills you already have. If your work history, training and life experience show you can already do what a qualification requires, an assessor can recognise that – so you only study the parts you are missing.',
      },
      {
        q: 'Is RPL a shortcut or a “bought” certificate?',
        a: 'No. You still have to prove competence with real evidence, and an assessor will usually talk with you and may ask you to demonstrate tasks. If there are gaps, you complete extra training or assessment. The qualification you receive is the same one people get through full study.',
      },
      {
        q: 'What evidence will I need?',
        a: 'Typically a resume, position descriptions, references from supervisors, and examples of your work such as reports or (de-identified) care plans, plus any certificates you already hold. The RPL page has a full checklist.',
      },
      {
        q: 'How long does RPL take?',
        a: 'It depends mostly on how quickly you can gather your evidence. Many people finish in roughly 4–12 weeks, compared with 6–18 months of full study. The RTO confirms the timeframe once they have seen your evidence.',
        confirm: true,
      },
    ],
  },
  {
    id: 'study',
    name: 'Studying online',
    items: [
      {
        q: 'How does online study work?',
        a: 'You work through learning materials and assessments on the RTO’s online learning platform at your own pace, with trainer support by phone, email or video. Courses with a work placement include supervised hours in a real workplace.',
      },
      {
        q: 'Do I need to do a work placement?',
        a: 'Many care and education qualifications include mandatory placement hours – for example, the Certificate III in Individual Support requires at least 120 hours. If you already work in the industry, your current job may count. Each course page shows what to expect.',
      },
      {
        q: 'How many hours a week should I plan for?',
        a: 'Most people studying alongside work plan for around 8–15 hours a week. Poonam can help you choose a realistic pace before you commit.',
        confirm: true,
      },
    ],
  },
  {
    id: 'costs',
    name: 'Costs & payments',
    items: [
      {
        q: 'How much do courses cost?',
        a: 'Fees depend on the course, the RTO and whether you study the full course or use RPL. Poonam will give you the full cost in writing – including any extra fees – before you decide.',
        confirm: true,
      },
      {
        q: 'Can I pay in instalments?',
        a: 'Payment options vary by course and provider. Ask Poonam what is available for the course you are interested in.',
        confirm: true,
      },
      {
        q: 'Is government funding available?',
        a: 'Some states subsidise certain courses for eligible students, but rules change often and depend on where you live and your previous study. Poonam can point you to the right information; funding is never guaranteed.',
        confirm: true,
      },
    ],
  },
  {
    id: 'recognition',
    name: 'Certificates & recognition',
    items: [
      {
        q: 'Are the qualifications nationally recognised?',
        a: 'Yes – the qualifications listed on this site are from Australia’s national training system. When issued by an RTO that is registered to deliver them, they are recognised by employers across Australia.',
      },
      {
        q: 'Can I check a qualification and RTO myself?',
        a: 'Yes, and we encourage it. Search the course code or the RTO’s name on training.gov.au, the national register, to see that the course is current and the RTO is registered to deliver it.',
      },
      {
        q: 'Are short courses nationally recognised?',
        a: 'No. Short courses are professional development (CPD) refreshers that give you a certificate of completion. They are great for building skills and meeting workplace training requirements, but they are not qualifications.',
      },
    ],
  },
];
