import useSWR from 'swr'
import { buscarSaude, fetcher, rotas } from '../services/api'
import type {
  ComparativoAno,
  Envelope,
  Fonte,
  Resumo,
  SerieSemanal,
} from '../types/srag'

export function chaveSerieHistorica(anos: number[]) {
  return ['serie-historica', ...anos]
}

export function buscarSerieHistorica(anos: number[]) {
  return Promise.all(
    anos.map((ano) => fetcher<Envelope<SerieSemanal>>(rotas.semanas(ano))),
  )
}

export function useAnos() {
  return useSWR<Envelope<ComparativoAno[]>>(rotas.anos, fetcher)
}

export function useResumo(anos?: number[] | null) {
  return useSWR<Envelope<Resumo>>(
    anos === null ? null : rotas.resumo(anos),
    fetcher,
  )
}

export function useSemanas(ano?: number | null) {
  return useSWR<Envelope<SerieSemanal>>(
    ano ? rotas.semanas(ano) : null,
    fetcher,
  )
}

export function useSerieHistorica(anos?: number[]) {
  return useSWR(
    anos && anos.length > 0 ? chaveSerieHistorica(anos) : null,
    () => buscarSerieHistorica(anos ?? []),
  )
}

export function useFonte() {
  return useSWR<Envelope<Fonte>>(rotas.fonte, fetcher)
}

export function useSaude() {
  return useSWR(rotas.saude, buscarSaude, { refreshInterval: 5 * 60 * 1000 })
}
