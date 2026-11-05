import type { GetStaticProps } from 'next'
import { unstable_serialize as serializarChave } from 'swr'
import {
  ANOS_PANDEMIA,
  Dashboard,
  anosPosPandemia,
} from '../components/dashboard'
import { buscarSerieHistorica, chaveSerieHistorica } from '../hooks/use-srag'
import { fetcher, rotas } from '../services/api'
import type { ComparativoAno, Envelope } from '../types/srag'

const REVALIDAR_SEGUNDOS = 60 * 60

interface HomeProps {
  fallback: Record<string, unknown>
}

export default function Home() {
  return <Dashboard />
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const fallback: Record<string, unknown> = {}

  try {
    const anos = await fetcher<Envelope<ComparativoAno[]>>(rotas.anos)
    fallback[rotas.anos] = anos

    const lista = anos.dados.map((a) => a.ano).sort((a, b) => a - b)
    const ultimo = lista[lista.length - 1]
    const recentes = anosPosPandemia(lista)

    const pedidos: [string, () => Promise<unknown>][] = [
      [rotas.fonte, () => fetcher(rotas.fonte)],
      [rotas.resumo([ultimo]), () => fetcher(rotas.resumo([ultimo]))],
      [rotas.resumo(ANOS_PANDEMIA), () => fetcher(rotas.resumo(ANOS_PANDEMIA))],
      [rotas.resumo(recentes), () => fetcher(rotas.resumo(recentes))],
      [
        serializarChave(chaveSerieHistorica(lista)),
        () => buscarSerieHistorica(lista),
      ],
    ]

    const resultados = await Promise.allSettled(
      pedidos.map(([, buscar]) => buscar()),
    )
    resultados.forEach((resultado, i) => {
      if (resultado.status === 'fulfilled')
        fallback[pedidos[i][0]] = resultado.value
    })

    const historico = fallback[serializarChave(chaveSerieHistorica(lista))] as
      | Awaited<ReturnType<typeof buscarSerieHistorica>>
      | undefined
    historico?.forEach((serie) => {
      fallback[rotas.semanas(serie.dados.ano)] = serie
    })
  } catch (erro) {
    console.error('Falha ao pré-carregar os dados da API SRAG', erro)
  }

  return { props: { fallback }, revalidate: REVALIDAR_SEGUNDOS }
}
