// कार्यक्रम / आयोजन की स्थिति — Program (event) status options
export type ProgramStatus = 'upcoming' | 'completed'

export const programStatuses: { key: ProgramStatus; hi: string; en: string }[] = [
  { key: 'upcoming', hi: 'आगामी', en: 'Upcoming' },
  { key: 'completed', hi: 'सम्पन्न', en: 'Completed' },
]
