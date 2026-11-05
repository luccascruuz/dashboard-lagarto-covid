import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import type { ComparativoAno, Resumo } from '../../types/srag'
import { KpiGrid } from './kpi-grid'
import { PandemicHighlight } from './pandemic-highlight'

const classificacao = {
  influenza: 0,
  outro_virus: 0,
  outro_agente: 0,
  nao_especificado: 0,
  covid19: 0,
  em_investigacao: 0,
}

function linha(
  valores: Partial<ComparativoAno> & { ano: number },
): ComparativoAno {
  return {
    parcial: false,
    semanasNoPeriodo: 52,
    totalCasos: 0,
    mediaSemanal: 0,
    hospitalizados: 0,
    internadosUti: 0,
    obitosSrag: 0,
    casosEmAberto: 0,
    porClassificacao: { ...classificacao },
    agentesIdentificados: {} as ComparativoAno['agentesIdentificados'],
    comparacaoAnoAnterior: null,
    ...valores,
  }
}

const anos = [
  linha({
    ano: 2021,
    totalCasos: 473,
    mediaSemanal: 9.1,
    obitosSrag: 117,
    porClassificacao: { ...classificacao, covid19: 394 },
  }),
  linha({
    ano: 2026,
    parcial: true,
    semanasNoPeriodo: 44,
    totalCasos: 85,
    mediaSemanal: 1.93,
    obitosSrag: 1,
    comparacaoAnoAnterior: {
      criterio: 'mesmo_periodo',
      semanas: 44,
      casosAnoAnterior: 106,
      casosNestePeriodo: 85,
      variacaoPercentual: -19.8,
    },
  }),
]

function renderizar(ui: React.ReactElement) {
  return render(<ChakraProvider>{ui}</ChakraProvider>)
}

describe('PandemicHighlight', () => {
  it('compara o pior ano da pandemia com o ano atual', () => {
    renderizar(<PandemicHighlight anos={anos} />)

    expect(screen.getByText('4,7×')).toBeInTheDocument()
    expect(
      screen.getByText(/menos casos graves por semana em 2026 do que em 2021/),
    ).toBeInTheDocument()
    expect(screen.getByText(/83%/)).toBeInTheDocument()
  })
})

describe('KpiGrid', () => {
  it('mostra a variação contra as mesmas semanas do ano anterior', () => {
    const resumo = {
      totalCasos: 85,
      hospitalizados: 80,
      internadosUti: 17,
      obitosSrag: 1,
      obitosOutrasCausas: 4,
      casosEmAberto: 31,
      porClassificacao: { ...classificacao, em_investigacao: 28 },
    } as Resumo

    renderizar(<KpiGrid resumo={resumo} linhaAno={anos[1]} />)

    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText('−20%')).toBeInTheDocument()
    expect(
      screen.getByText(/vs. as mesmas 44 semanas de 2025/),
    ).toBeInTheDocument()
    expect(screen.getByText('20% dos casos')).toBeInTheDocument()
  })
})
