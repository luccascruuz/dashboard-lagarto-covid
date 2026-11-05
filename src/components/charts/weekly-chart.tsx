import { useMemo } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
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
  SEMANAS_INCOMPLETAS,
  compararComAnoAnterior,
  type PontoComparado,
} from '../../helpers/series'
import type { SerieSemanal } from '../../types/srag'
import { ChartCard } from './chart-card'
import { CaixaTooltip, Legenda, cursorFaixa, eixo, grade } from './chart-parts'

interface WeeklyChartProps {
  serie?: SerieSemanal
  serieAnterior?: SerieSemanal
  parcial: boolean
  carregando?: boolean
  erro?: unknown
}

export function WeeklyChart({
  serie,
  serieAnterior,
  parcial,
  carregando,
  erro,
}: WeeklyChartProps) {
  const ano = serie?.ano
  const anoAnterior = serieAnterior?.ano
  const pontos = useMemo(
    () =>
      serie
        ? compararComAnoAnterior(serie.semanas, serieAnterior?.semanas)
        : [],
    [serie, serieAnterior],
  )
  const incompletas =
    parcial && pontos.length > SEMANAS_INCOMPLETAS
      ? pontos.slice(-SEMANAS_INCOMPLETAS)
      : []
  const semanaIncompleta = (semana: number) =>
    incompletas.some((p) => p.semana === semana)

  function TooltipSemanal({ active, payload }: TooltipProps<number, string>) {
    const ponto = payload?.[0]?.payload as PontoComparado | undefined
    if (!active || !ponto) return null
    return (
      <CaixaTooltip
        titulo={`SE ${ponto.semana} · ${formatDate(
          ponto.inicio,
        )} a ${formatDate(ponto.fim)}`}
        linhas={[
          {
            rotulo: 'Casos',
            valor: formatNumber(ponto.casos),
            cor: cor('viz.soft'),
          },
          {
            rotulo: 'Internados em UTI',
            valor: formatNumber(ponto.internadosUti),
          },
          { rotulo: 'Óbitos por SRAG', valor: formatNumber(ponto.obitosSrag) },
          {
            rotulo: `Média móvel ${ano}`,
            valor:
              ponto.mediaMovel === null
                ? '—'
                : formatNumber(ponto.mediaMovel, 1),
            cor: cor('viz.1'),
            forma: 'linha',
          },
          ...(anoAnterior
            ? [
                {
                  rotulo: `Média móvel ${anoAnterior}`,
                  valor:
                    ponto.mediaAnterior === null
                      ? '—'
                      : formatNumber(ponto.mediaAnterior, 1),
                  cor: cor('viz.2'),
                  forma: 'linha' as const,
                },
              ]
            : []),
        ]}
        nota={
          semanaIncompleta(ponto.semana)
            ? 'Semana recente: ainda vai receber notificações atrasadas.'
            : undefined
        }
      />
    )
  }

  return (
    <ChartCard
      titulo={
        ano
          ? `Casos por semana epidemiológica em ${ano}`
          : 'Casos por semana epidemiológica'
      }
      subtitulo={
        anoAnterior
          ? `Pela data de início dos sintomas, com a média móvel de 4 semanas comparada à de ${anoAnterior}.`
          : 'Pela data de início dos sintomas, com média móvel de 4 semanas.'
      }
      carregando={carregando}
      erro={erro}
      legenda={
        <Legenda
          itens={[
            { rotulo: 'Casos na semana', cor: cor('viz.soft') },
            {
              rotulo: `Média móvel ${ano ?? ''}`.trim(),
              cor: cor('viz.1'),
              forma: 'linha',
            },
            ...(anoAnterior
              ? [
                  {
                    rotulo: `Média móvel ${anoAnterior}`,
                    cor: cor('viz.2'),
                    forma: 'linha' as const,
                  },
                ]
              : []),
          ]}
        />
      }
      tabela={{
        colunas: ['Semana', 'Início', 'Casos', 'UTI', 'Óbitos', 'Média móvel'],
        linhas: pontos.map((p) => [
          `SE ${p.semana}`,
          formatDate(p.inicio),
          p.casos,
          p.internadosUti,
          p.obitosSrag,
          p.mediaMovel === null ? '—' : formatNumber(p.mediaMovel, 1),
        ]),
      }}
      rodape={
        incompletas.length > 0
          ? `As ${SEMANAS_INCOMPLETAS} últimas semanas (área sombreada) ainda estão incompletas por causa do atraso entre os sintomas, a notificação e a publicação dos dados.`
          : undefined
      }
    >
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart
          data={pontos}
          margin={{ top: 20, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid {...grade} />
          {incompletas.length > 0 && (
            <ReferenceArea
              x1={incompletas[0].rotulo}
              x2={incompletas[incompletas.length - 1].rotulo}
              fill={cor('viz.shade')}
              fillOpacity={1}
              ifOverflow='visible'
            >
              <Label
                value='incompleto'
                position='insideTopRight'
                offset={-16}
                fill={cor('ink.muted')}
                fontSize={11}
              />
            </ReferenceArea>
          )}
          <XAxis
            dataKey='rotulo'
            {...eixo}
            interval='preserveStartEnd'
            minTickGap={16}
          />
          <YAxis {...eixo} axisLine={false} allowDecimals={false} width={48} />
          <Tooltip content={<TooltipSemanal />} cursor={cursorFaixa} />
          <Bar
            dataKey='casos'
            name='Casos'
            fill={cor('viz.soft')}
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
            isAnimationActive={false}
          />
          {anoAnterior && (
            <Line
              type='monotone'
              dataKey='mediaAnterior'
              stroke={cor('viz.2')}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: cor('surface'), strokeWidth: 2 }}
              isAnimationActive={false}
              connectNulls
            />
          )}
          <Line
            type='monotone'
            dataKey='mediaMovel'
            stroke={cor('viz.1')}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: cor('surface'), strokeWidth: 2 }}
            isAnimationActive={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
