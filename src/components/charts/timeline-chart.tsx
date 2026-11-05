import { useMemo } from 'react'
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'
import { formatDate, formatNumber } from '../../helpers/format'
import { cor } from '../../helpers/labels'
import {
  montarLinhaDoTempo,
  pontoNaData,
  semanaDePico,
  type PontoHistorico,
} from '../../helpers/series'
import type { SerieSemanal } from '../../types/srag'
import { ChartCard } from './chart-card'
import { CaixaTooltip, Legenda, cursorLinha, eixo, grade } from './chart-parts'

const INICIO_PANDEMIA = '2020-03-11'
const FIM_EMERGENCIA = '2023-05-05'

interface TimelineChartProps {
  series?: SerieSemanal[]
  carregando?: boolean
  erro?: unknown
}

function TooltipLinhaDoTempo({
  active,
  payload,
}: TooltipProps<number, string>) {
  const ponto = payload?.[0]?.payload as PontoHistorico | undefined
  if (!active || !ponto) return null
  return (
    <CaixaTooltip
      titulo={`SE ${ponto.semana}/${ponto.ano} · ${formatDate(
        ponto.inicio,
      )} a ${formatDate(ponto.fim)}`}
      linhas={[
        { rotulo: 'Casos na semana', valor: formatNumber(ponto.casos) },
        {
          rotulo: 'Média de casos',
          valor:
            ponto.mediaCasos === null ? '—' : formatNumber(ponto.mediaCasos, 1),
          cor: cor('viz.1'),
          forma: 'linha',
        },
        { rotulo: 'Óbitos na semana', valor: formatNumber(ponto.obitos) },
        {
          rotulo: 'Média de óbitos',
          valor:
            ponto.mediaObitos === null
              ? '—'
              : formatNumber(ponto.mediaObitos, 1),
          cor: cor('viz.2'),
          forma: 'linha',
        },
      ]}
    />
  )
}

export function TimelineChart({
  series,
  carregando,
  erro,
}: TimelineChartProps) {
  const pontos = useMemo(
    () => (series ? montarLinhaDoTempo(series) : []),
    [series],
  )
  const pico = useMemo(() => semanaDePico(pontos), [pontos])
  const inicioPandemia = pontoNaData(pontos, INICIO_PANDEMIA)
  const fimEmergencia = pontoNaData(pontos, FIM_EMERGENCIA)
  const marcasAno = pontos.filter((p) => p.semana === 1).map((p) => p.chave)

  return (
    <ChartCard
      titulo='Linha do tempo: as ondas de SRAG desde 2019'
      subtitulo={
        pico
          ? `Média móvel de 4 semanas. A semana com mais casos foi a SE ${
              pico.semana
            }/${pico.ano} (${formatDate(pico.inicio)} a ${formatDate(
              pico.fim,
            )}), com ${formatNumber(pico.casos)} casos.`
          : 'Média móvel de 4 semanas de casos e óbitos por SRAG.'
      }
      carregando={carregando}
      erro={erro}
      altura={{ base: 280, md: 380 }}
      legenda={
        <Legenda
          itens={[
            {
              rotulo: 'Casos por semana (média móvel)',
              cor: cor('viz.1'),
              forma: 'linha',
            },
            {
              rotulo: 'Óbitos por SRAG por semana (média móvel)',
              cor: cor('viz.2'),
              forma: 'linha',
            },
          ]}
        />
      }
      tabela={{
        colunas: ['Semana', 'Início', 'Casos', 'Óbitos', 'Média de casos'],
        linhas: [...pontos]
          .reverse()
          .map((p) => [
            `SE ${p.semana}/${p.ano}`,
            formatDate(p.inicio),
            p.casos,
            p.obitos,
            p.mediaCasos === null ? '—' : formatNumber(p.mediaCasos, 1),
          ]),
      }}
      rodape='Área sombreada: da declaração de pandemia pela OMS (11/03/2020) ao fim da emergência internacional (05/05/2023).'
    >
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={pontos}
          margin={{ top: 24, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid {...grade} />
          {inicioPandemia && fimEmergencia && (
            <ReferenceArea
              x1={inicioPandemia.chave}
              x2={fimEmergencia.chave}
              fill={cor('viz.shade')}
              fillOpacity={1}
              ifOverflow='visible'
            >
              <Label
                value='Pandemia de covid-19'
                position='insideTop'
                offset={-18}
                fill={cor('ink.muted')}
                fontSize={12}
              />
            </ReferenceArea>
          )}
          <XAxis
            dataKey='chave'
            {...eixo}
            ticks={marcasAno}
            tickFormatter={(chave: string) => chave.split('-')[0]}
            interval={0}
            minTickGap={4}
          />
          <YAxis {...eixo} axisLine={false} allowDecimals={false} width={48} />
          <Tooltip content={<TooltipLinhaDoTempo />} cursor={cursorLinha} />
          <Line
            type='monotone'
            dataKey='mediaCasos'
            name='Média de casos'
            stroke={cor('viz.1')}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: cor('surface'), strokeWidth: 2 }}
            isAnimationActive={false}
            connectNulls
          />
          <Line
            type='monotone'
            dataKey='mediaObitos'
            name='Média de óbitos'
            stroke={cor('viz.2')}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: cor('surface'), strokeWidth: 2 }}
            isAnimationActive={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
