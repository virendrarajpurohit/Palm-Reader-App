const openings = [
  'Your palm shows a rare balance between practical discipline and intuitive decision-making.',
  'The dominant lines suggest that your next chapter rewards patience, clarity, and confident action.',
  'Your hand pattern points to someone who absorbs stress silently but still protects others with loyalty.',
  'The mount structure indicates ambition that grows stronger when you stop waiting for perfect timing.',
];

const money = [
  'Money improves through skill-based income, careful savings, and one smart opportunity connected to communication or technology.',
  'Financial growth appears gradual but stable; avoid emotional spending and say yes to work that compounds your reputation.',
  'A delayed money matter can move in your favour when you document everything and negotiate calmly.',
];

const love = [
  'In love and marriage, your lines show deep attachment but a need to express expectations before silence becomes distance.',
  'Romance improves when you choose consistency over dramatic promises; a sincere conversation can reset the bond.',
  'For relationships, the reading favours a loyal partner and warns against testing people instead of trusting clear actions.',
];

const career = [
  'Career success comes from visibility: publish your work, ask for responsibility, and do not hide behind perfection.',
  'Job energy is strong for learning a modern tool, changing teams, or starting a side project that proves your value.',
  'Your success line favours leadership after a short phase of pressure, especially if you keep mentors close.',
];

const wellness = [
  'Stress reduces when you protect sleep, hydrate well, and avoid carrying everyone’s emotional burden alone.',
  'The palm suggests high mental activity; grounding routines and short walks will help you make sharper choices.',
  'Energy looks better after decluttering your schedule and limiting late-night scrolling.',
];

const pick = (list, seed) => list[Math.abs(seed) % list.length];
const hash = (input) => [...input].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 7);

export const generatePalmReading = ({ name = 'Friend', birthDate = '', imageSignature = '' }) => {
  const seed = hash(`${name}${birthDate}${imageSignature}${Date.now()}`);
  return [
    `${pick(openings, seed)} ${name.trim() ? `${name.trim()}, this` : 'This'} reading is for entertainment and self-reflection, not a guarantee of future events.`,
    pick(money, seed + 1),
    pick(love, seed + 2),
    pick(career, seed + 3),
    pick(wellness, seed + 4),
    'A lucky window appears when you combine spiritual discipline with one measurable daily action for 21 days.',
    'A person who seems strict may become useful for guidance, referrals, or career direction.',
    'The strongest sign is resilience: you recover faster than you realise, and this year rewards decisive movement.',
    'Advanced insight: your fate line suggests two income paths can coexist if you separate risky ideas from stable cash flow.',
    'Detailed Vedic alignment favours Thursday planning, yellow or gold accents, and gratitude before important calls.',
    'For deeper kundli-style guidance, share your phone and email so a trained astrologer can follow up with personalised details.',
  ];
};
