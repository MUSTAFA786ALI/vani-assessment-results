
export type AssessmentType = 'Recorded' | 'Text';
export type AssessmentStatus = 'Completed' | 'Pending' | 'Upcoming';

export type Assessment = {
  id: string;
  question: string;
  type: AssessmentType;
  status: AssessmentStatus;
  score?: number;
  feedback?: string;
  date: string;
};

export const GOOD_SCORE_THRESHOLD = 70;

export const assessments: Assessment[] = [
  {
    id: '1',
    question: 'Tell me about yourself',
    type: 'Recorded',
    status: 'Completed',
    score: 82,
    feedback: 'Clear and well structured. Add a specific achievement to make your introduction more memorable.',
    date: '2026-10-12',
  },
  {
    id: '2',
    question: 'Describe a challenging situation',
    type: 'Recorded',
    status: 'Completed',
    score: 65,
    feedback: 'Explain the actions you personally took and the outcome to strengthen your response.',
    date: '2026-10-11',
  },
  {
    id: '3',
    question: 'Write a professional email to your manager',
    type: 'Text',
    status: 'Completed',
    score: 78,
    feedback: 'Your message is professional. Make the requested action more explicit.',
    date: '2026-10-10',
  },
  {
    id: '4',
    question: 'Explain your current project',
    type: 'Recorded',
    status: 'Pending',
    date: '2026-10-13',
  },
  {
    id: '5',
    question: 'How do you handle constructive criticism?',
    type: 'Recorded',
    status: 'Completed',
    score: 88,
    feedback: 'A confident response. Include a real example of feedback you applied.',
    date: '2026-10-09',
  },
  {
    id: '6',
    question: 'Write a project status update',
    type: 'Text',
    status: 'Completed',
    score: 73,
    feedback: 'Good structure. Summarize blockers and next steps more clearly.',
    date: '2026-10-08',
  },
  {
    id: '7',
    question: 'Describe a time you worked in a team',
    type: 'Recorded',
    status: 'Pending',
    date: '2026-10-13',
  },
  {
    id: '8',
    question: 'How would you resolve a workplace disagreement?',
    type: 'Recorded',
    status: 'Completed',
    score: 61,
    feedback: 'Show how you listen to other perspectives and work toward a shared solution.',
    date: '2026-10-07',
  },
  {
    id: '9',
    question: 'Write a meeting follow-up email',
    type: 'Text',
    status: 'Completed',
    score: 91,
    feedback: 'Excellent clarity and tone. Keep the action items and owners explicit.',
    date: '2026-10-06',
  },
  {
    id: '10',
    question: 'Explain a technical concept to a non-technical person',
    type: 'Recorded',
    status: 'Completed',
    score: 76,
    feedback: 'A good explanation. Use a simpler analogy to make the concept even easier to understand.',
    date: '2026-10-05',
  },
  {
    id: '11',
    question: 'Deliver a short project presentation',
    type: 'Recorded',
    status: 'Upcoming',
    date: '2026-10-16',
  },
  {
    id: '12',
    question: 'Write a polite follow-up to a client',
    type: 'Text',
    status: 'Upcoming',
    date: '2026-10-17',
  },
  {
    id: '13',
    question: 'Describe how you prioritize competing deadlines',
    type: 'Recorded',
    status: 'Completed',
    score: 68,
    feedback: 'Explain your prioritization criteria and how you communicate changing deadlines.',
    date: '2026-10-04',
  },
  {
    id: '14',
    question: 'Write a clear request for project resources',
    type: 'Text',
    status: 'Upcoming',
    date: '2026-10-18',
  },
  {
    id: '15',
    question: 'Give feedback to a teammate respectfully',
    type: 'Recorded',
    status: 'Pending',
    date: '2026-10-13',
  },
];
