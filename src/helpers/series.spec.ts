import type {
  ComparativoAno,
  PontoSemanal,
  Resumo,
  SerieSemanal,
} from '../types/srag'
import {
  calcularDestaque,
  casosComAgenteIdentificado,
  compararComAnoAnterior,
  distribuicaoPorFaixa,
  mediaMovel,
  montarLinhaDoTempo,
  pontoNaData,
  semanaDePico,
} from './series'

function ponto(
  semana: number,
  casos: number,
  extra: Partial<PontoSemanal> = {},
): PontoSemanal {
  const dia = String(semana).padStart(2, '0')
  return {
    semana,
    inicio: `2020-01-${dia}`,
    fim: `2020-01-${dia}`,
    casos,
    obitosSrag: 0,
    internadosUti: 0,
    mediaMovel: null,
    ...extra,
  }
}

const classificacaoVazia = {
  influenza: 0,
  outro_virus: 0,
  outro_agente: 0,
  nao_especificado: 0,
  covid19: 0,
  em_investigacao: 0,
}

function ano(
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
    porClassificacao: { ...classificacaoVazia },
    agentesIdentificados: {} as ComparativoAno['agentesIdentificados'],
    comparacaoAnoAnterior: null,
    ...valores,
  }
}

describe('mediaMovel', () => {
  it('só começa quando a janela está completa', () => {
    expect(mediaMovel([4, 0, 2, 6, 8], 4)).toEqual([null, null, null, 3, 4])
  })
})

describe('montarLinhaDoTempo', () => {
  it('junta os anos em ordem e calcula a média sem quebrar na virada do ano', () => {
    const series: SerieSemanal[] = [
      { ano: 2021, janelaMediaMovel: 4, semanas: [ponto(1, 8), ponto(2, 4)] },
      {
        ano: 2020,
        janelaMediaMovel: 4,
        semanas: [ponto(1, 0), ponto(2, 4, { obitosSrag: 4 })],
      },
    ]

    const linha = montarLinhaDoTempo(series)

    expect(linha.map((p) => p.chave)).toEqual([
      '2020-1',
      '2020-2',
      '2021-1',
      '2021-2',
    ])
    expect(linha[3].mediaCasos).toBe(4)
    expect(linha[3].mediaObitos).toBe(1)
  })

  it('encontra a semana de pico e a semana que contém uma data', () => {
    const linha = montarLinhaDoTempo([
      {
        ano: 2020,
        janelaMediaMovel: 4,
        semanas: [ponto(1, 2), ponto(5, 9), ponto(9, 3)],
      },
    ])

    expect(semanaDePico(linha)?.chave).toBe('2020-5')
    expect(pontoNaData(linha, '2020-01-09')?.semana).toBe(9)
    expect(pontoNaData(linha, '2021-01-01')).toBeUndefined()
  })
})

describe('compararComAnoAnterior', () => {
  it('alinha a média do ano anterior pela semana epidemiológica', () => {
    const atual = [
      ponto(1, 1, { mediaMovel: 1 }),
      ponto(2, 2, { mediaMovel: 2 }),
    ]
    const anterior = [ponto(2, 5, { mediaMovel: 5 })]

    expect(compararComAnoAnterior(atual, anterior)).toMatchObject([
      { semana: 1, rotulo: 'SE 1', mediaAnterior: null },
      { semana: 2, rotulo: 'SE 2', mediaAnterior: 5 },
    ])
  })
})

describe('calcularDestaque', () => {
  it('compara o ano de maior média semanal com o ano mais recente', () => {
    const destaque = calcularDestaque([
      ano({ ano: 2020, mediaSemanal: 8, totalCasos: 400 }),
      ano({
        ano: 2021,
        mediaSemanal: 9,
        totalCasos: 100,
        porClassificacao: { ...classificacaoVazia, covid19: 80 },
      }),
      ano({ ano: 2026, mediaSemanal: 2, totalCasos: 50, parcial: true }),
    ])

    expect(destaque?.pico.ano).toBe(2021)
    expect(destaque?.atual.ano).toBe(2026)
    expect(destaque?.vezesMenos).toBe(4.5)
    expect(destaque?.partePicoCovid).toBe(0.8)
    expect(destaque?.parteAtualCovid).toBe(0)
  })

  it('não destaca nada quando o ano atual é o pico', () => {
    expect(
      calcularDestaque([
        ano({ ano: 2025, mediaSemanal: 1 }),
        ano({ ano: 2026, mediaSemanal: 3 }),
      ]),
    ).toBeNull()
  })
})

describe('resumo', () => {
  const resumo = {
    totalCasos: 10,
    porClassificacao: {
      ...classificacaoVazia,
      covid19: 2,
      influenza: 1,
      nao_especificado: 7,
    },
    porFaixaEtaria: {
      menor_1: 3,
      '1_4': 1,
      '5_9': 0,
      '10_19': 0,
      '20_29': 0,
      '30_39': 0,
      '40_49': 0,
      '50_59': 0,
      '60_69': 0,
      '70_79': 0,
      '80_mais': 4,
      nao_informada: 2,
    },
  } as unknown as Resumo

  it('ignora a idade não informada ao calcular a distribuição', () => {
    const distribuicao = distribuicaoPorFaixa(resumo)
    expect(distribuicao.menor_1).toBe(0.375)
    expect(distribuicao['80_mais']).toBe(0.5)
  })

  it('conta como identificados só os casos com agente na classificação final', () => {
    expect(casosComAgenteIdentificado(resumo)).toBe(3)
  })
})
