export function formatDate(data: string): string {
  const meses = [
    'jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.',
    'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'
  ]

  const [ano, mes, dia] = data.split('-').map(Number)
  
  return `${dia} de ${meses[mes - 1]} de ${ano}`
}