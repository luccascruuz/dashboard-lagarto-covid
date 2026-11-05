export function formatNumber(valor: number, casasDecimais = 0) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }).format(valor)
}

export function formatPercent(fracao: number, casasDecimais = 0) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }).format(fracao)
}

export function formatVariacao(percentual: number) {
  const sinal = percentual > 0 ? '+' : percentual < 0 ? '−' : ''
  return `${sinal}${formatNumber(
    Math.abs(percentual),
    Math.abs(percentual) < 10 ? 1 : 0,
  )}%`
}

export function formatDate(iso: string) {
  const [ano, mes, dia] = iso.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(iso))
}

export function fracao(parte: number, total: number) {
  return total > 0 ? parte / total : 0
}
