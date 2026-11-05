import { useMemo } from 'react'
import { useBreakpointValue } from '@chakra-ui/react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'
import { formatPercent } from '../../helpers/format'
import { FAIXAS_ETARIAS, cor } from '../../helpers/labels'
import { distribuicaoPorFaixa } from '../../helpers/series'
import type { Resumo } from '../../types/srag'
import { ChartCard } from './chart-card'
import { CaixaTooltip, Legenda, cursorFaixa, eixo, grade } from './chart-parts'

interface AgeChartProps {
  pandemia?: Resumo
  recente?: Resumo
  rotuloPandemia: string
  rotuloRecente: string
  carregando?: boolean
  erro?: unknown
}

export function AgeChart({
  pandemia,
  recente,
  rotuloPandemia,
  rotuloRecente,
  carregando,
  erro,
}: AgeChartProps) {
  const horizontal = useBreakpointValue({ base: true, md: false }) ?? false
  const dados = useMemo(() => {
    if (!pandemia || !recente) return []
    const a = distribuicaoPorFaixa(pandemia)
    const b = distribuicaoPorFaixa(recente)
    return FAIXAS_ETARIAS.map((f) => ({
      rotulo: f.rotulo,
      pandemia: a[f.chave],
      recente: b[f.chave],
    }))
  }, [pandemia, recente])

  const subtitulo = useMemo(() => {
    if (!pandemia || !recente) return undefined
    const a = distribuicaoPorFaixa(pandemia)
    const b = distribuicaoPorFaixa(recente)
    const idososA = a['60_69'] + a['70_79'] + a['80_mais']
    const idososB = b['60_69'] + b['70_79'] + b['80_mais']
    const criancasA = a.menor_1 + a['1_4']
    const criancasB = b.menor_1 + b['1_4']
    return `Na pandemia, ${formatPercent(
      idososA,
    )} dos casos eram de pessoas com 60 anos ou mais e ${formatPercent(
      criancasA,
    )} de crianças de até 4 anos. De ${rotuloRecente.replace(
      '–',
      ' a ',
    )}, as crianças de até 4 anos passaram a ${formatPercent(
      criancasB,
    )} dos casos, e os idosos caíram para ${formatPercent(idososB)}.`
  }, [pandemia, recente, rotuloRecente])

  function TooltipIdade({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) {
    const linha = payload?.[0]?.payload as
      | { pandemia: number; recente: number }
      | undefined
    if (!active || !linha) return null
    return (
      <CaixaTooltip
        titulo={
          label === '< 1'
            ? 'Menos de 1 ano'
            : label === '80+'
            ? '80 anos ou mais'
            : `${label} anos`
        }
        linhas={[
          {
            rotulo: rotuloPandemia,
            valor: formatPercent(linha.pandemia, 1),
            cor: cor('viz.1'),
          },
          {
            rotulo: rotuloRecente,
            valor: formatPercent(linha.recente, 1),
            cor: cor('viz.2'),
          },
        ]}
        nota='Percentual dos casos de cada período.'
      />
    )
  }

  return (
    <ChartCard
      titulo='Na pandemia, os idosos. Hoje, as crianças pequenas.'
      subtitulo={subtitulo}
      carregando={carregando}
      erro={erro}
      altura={{ base: 420, md: 340 }}
      legenda={
        <Legenda
          itens={[
            { rotulo: `Pandemia (${rotuloPandemia})`, cor: cor('viz.1') },
            { rotulo: `Pós-pandemia (${rotuloRecente})`, cor: cor('viz.2') },
          ]}
        />
      }
      tabela={{
        colunas: ['Idade', rotuloPandemia, rotuloRecente],
        linhas: dados.map((d) => [
          d.rotulo,
          formatPercent(d.pandemia, 1),
          formatPercent(d.recente, 1),
        ]),
      }}
      rodape='Faixa etária em anos. Cada barra é o percentual dos casos daquele período.'
    >
      <ResponsiveContainer width='100%' height='100%'>
        {horizontal ? (
          <BarChart
            data={dados}
            layout='vertical'
            margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
            barGap={2}
          >
            <CartesianGrid {...grade} vertical horizontal={false} />
            <XAxis
              type='number'
              {...eixo}
              tickFormatter={(v: number) => formatPercent(v)}
            />
            <YAxis
              type='category'
              dataKey='rotulo'
              {...eixo}
              axisLine={false}
              interval={0}
              width={44}
            />
            <Tooltip content={<TooltipIdade />} cursor={cursorFaixa} />
            <Bar
              dataKey='pandemia'
              fill={cor('viz.1')}
              radius={[0, 4, 4, 0]}
              maxBarSize={10}
              isAnimationActive={false}
            />
            <Bar
              dataKey='recente'
              fill={cor('viz.2')}
              radius={[0, 4, 4, 0]}
              maxBarSize={10}
              isAnimationActive={false}
            />
          </BarChart>
        ) : (
          <BarChart
            data={dados}
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
            barGap={2}
          >
            <CartesianGrid {...grade} />
            <XAxis dataKey='rotulo' {...eixo} interval={0} />
            <YAxis
              {...eixo}
              axisLine={false}
              tickFormatter={(v: number) => formatPercent(v)}
              width={48}
            />
            <Tooltip content={<TooltipIdade />} cursor={cursorFaixa} />
            <Bar
              dataKey='pandemia'
              fill={cor('viz.1')}
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
              isAnimationActive={false}
            />
            <Bar
              dataKey='recente'
              fill={cor('viz.2')}
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
              isAnimationActive={false}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </ChartCard>
  )
}
