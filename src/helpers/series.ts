import { JANELA_MEDIA_MOVEL } from '../services/api'
import type {
  ComparativoAno,
  FaixaEtaria,
  PontoSemanal,
  Resumo,
  SerieSemanal,
} from '../types/srag'
import { fracao } from './format'
import { FAIXAS_ETARIAS } from './labels'

export const SEMANAS_INCOMPLETAS = 4

export function mediaMovel(
  valores: number[],
  janela = JANELA_MEDIA_MOVEL,
): (number | null)[] {
  return valores.map((_, i) => {
    if (i + 1 < janela) return null
    const soma = valores
      .slice(i + 1 - janela, i + 1)
      .reduce((total, v) => total + v, 0)
    return Math.round((soma / janela) * 100) / 100
  })
}

export interface PontoHistorico {
  chave: string
  ano: number
  semana: number
  inicio: string
  fim: string
  casos: number
  obitos: number
  mediaCasos: number | null
  mediaObitos: number | null
}

export function montarLinhaDoTempo(series: SerieSemanal[]): PontoHistorico[] {
  const pontos = [...series]
    .sort((a, b) => a.ano - b.ano)
    .flatMap((serie) => serie.semanas.map((p) => ({ ano: serie.ano, ...p })))

  const mediasCasos = mediaMovel(pontos.map((p) => p.casos))
  const mediasObitos = mediaMovel(pontos.map((p) => p.obitosSrag))

  return pontos.map((p, i) => ({
    chave: `${p.ano}-${p.semana}`,
    ano: p.ano,
    semana: p.semana,
    inicio: p.inicio,
    fim: p.fim,
    casos: p.casos,
    obitos: p.obitosSrag,
    mediaCasos: mediasCasos[i],
    mediaObitos: mediasObitos[i],
  }))
}

export function pontoNaData(pontos: PontoHistorico[], data: string) {
  return pontos.find((p) => p.inicio <= data && data <= p.fim)
}

export function semanaDePico(pontos: PontoHistorico[]) {
  return pontos.reduce<PontoHistorico | undefined>(
    (maior, p) => (!maior || p.casos > maior.casos ? p : maior),
    undefined,
  )
}

export interface PontoComparado extends PontoSemanal {
  rotulo: string
  mediaAnterior: number | null
}

export function compararComAnoAnterior(
  atual: PontoSemanal[],
  anterior: PontoSemanal[] = [],
): PontoComparado[] {
  return atual.map((p) => ({
    ...p,
    rotulo: `SE ${p.semana}`,
    mediaAnterior:
      anterior.find((a) => a.semana === p.semana)?.mediaMovel ?? null,
  }))
}

interface Destaque {
  pico: ComparativoAno
  atual: ComparativoAno
  vezesMenos: number | null
  partePicoCovid: number
  parteAtualCovid: number
}

export function calcularDestaque(anos: ComparativoAno[]): Destaque | null {
  if (anos.length < 2) return null
  const ordenados = [...anos].sort((a, b) => a.ano - b.ano)
  const atual = ordenados[ordenados.length - 1]
  const pico = ordenados.reduce((maior, a) =>
    a.mediaSemanal > maior.mediaSemanal ? a : maior,
  )
  if (pico.ano === atual.ano) return null

  return {
    pico,
    atual,
    vezesMenos:
      atual.mediaSemanal > 0 ? pico.mediaSemanal / atual.mediaSemanal : null,
    partePicoCovid: fracao(pico.porClassificacao.covid19, pico.totalCasos),
    parteAtualCovid: fracao(atual.porClassificacao.covid19, atual.totalCasos),
  }
}

export function distribuicaoPorFaixa(
  resumo: Resumo,
): Record<FaixaEtaria, number> {
  const total = FAIXAS_ETARIAS.reduce(
    (s, f) => s + resumo.porFaixaEtaria[f.chave],
    0,
  )
  return Object.fromEntries(
    FAIXAS_ETARIAS.map((f) => [
      f.chave,
      fracao(resumo.porFaixaEtaria[f.chave], total),
    ]),
  ) as Record<FaixaEtaria, number>
}

export function casosComAgenteIdentificado(resumo: Resumo) {
  const {
    covid19,
    influenza,
    outro_virus: outroVirus,
    outro_agente: outroAgente,
  } = resumo.porClassificacao
  return covid19 + influenza + outroVirus + outroAgente
}
