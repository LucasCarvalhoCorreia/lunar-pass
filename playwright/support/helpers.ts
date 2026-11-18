export function formatDate(dateStr: string): string {
  const months = [
    'jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.',
    'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.',
  ]

  const [year, month, day] = dateStr.split('-').map(Number)

  if (!year || !month || !day) {
    throw new Error(`Invalid date format: "${dateStr}". Expected AAAA-MM-DD.`)
  }

  const monthName = months[month - 1]

  return `${day} de ${monthName} de ${year}`
}


export function birthDateForAge(age: number): string {
  const today = new Date();
  const birthDate = new Date(today);

  birthDate.setFullYear(today.getFullYear() - age);

  return birthDate.toISOString().split('T')[0];
}