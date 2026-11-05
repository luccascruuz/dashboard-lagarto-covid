import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'
import { Text } from '@chakra-ui/react'
import { formatNumber, formatPercent, fracao } from '../../helpers/format'
import { AGENTES, cor } from '../../helpers/labels'
import { casosComAgenteIdentificado } from '../../helpers/series'
import type { Agente, Resumo } from '../../types/srag'
import { ChartCard } from './chart-card'
import { CaixaTooltip, cursorFaixa, eixo, grade } from './chart-parts'

const MAXIMO_AGENTES = 7

interface AgentsChartProps {
  resumo?: Resumo
  rotuloPeriodo: string
  carregando?: boolean
  erro?: unknown
}

function TooltipAgente({ active, payload }: TooltipProps<number, string>) {
  const linha = payload?.[0]?.payload as
    | { rotulo: string; casos: number }
    | undefined
  if (!active || !linha) return null
  return (
    <CaixaTooltip
      titulo={linha.rotulo}
      linhas={[
        {
          rotulo: 'Detecções',
          valor: formatNumber(linha.casos),
          cor: cor('viz.1'),
        },
      ]}
    />
  )
}

export function AgentsChart({
  resumo,
  rotuloPeriodo,
  carregando,
  erro,
}: AgentsChartProps) {
  const dados = useMemo(() => {
    if (!resumo) return []
    const ordenados = (
      Object.entries(resumo.agentesIdentificados) as [Agente, number][]
    )
      .filter(([, casos]) => casos > 0)
      .sort((a, b) => b[1] - a[1])
    const principais = ordenados
      .slice(0, MAXIMO_AGENTES)
      .map(([agente, casos]) => ({ rotulo: AGENTES[agente], casos }))
    const resto = ordenados
      .slice(MAXIMO_AGENTES)
      .reduce((s, [, casos]) => s + casos, 0)
    return resto > 0
      ? [...principais, { rotulo: 'Outros', casos: resto }]
      : principais
  }, [resumo])

  const identificados = resumo ? casosComAgenteIdentificado(resumo) : 0

  return (
    <ChartCard
      titulo={`Agentes identificados · ${rotuloPeriodo}`}
      subtitulo={
        resumo
          ? `O causador foi identificado em ${formatNumber(
              identificados,
            )} dos ${formatNumber(resumo.totalCasos)} casos (${formatPercent(
              fracao(identificados, resumo.totalCasos),
            )}). Um caso pode ter mais de um vírus.`
          : undefined
      }
      carregando={carregando}
      erro={erro}
      altura={{ base: 260, md: 340 }}
      tabela={{
        colunas: ['Agente', 'Detecções'],
        linhas: dados.map((d) => [d.rotulo, d.casos]),
      }}
    >
      {dados.length === 0 ? (
        <Text fontSize='sm' color='ink.secondary'>
          Nenhum vírus identificado em laboratório neste período.
        </Text>
      ) : (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={dados}
            layout='vertical'
            margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
          >
            <CartesianGrid {...grade} vertical horizontal={false} />
            <XAxis type='number' {...eixo} allowDecimals={false} />
            <YAxis
              type='category'
              dataKey='rotulo'
              {...eixo}
              axisLine={false}
              width={150}
              fontSize={12}
            />
            <Tooltip content={<TooltipAgente />} cursor={cursorFaixa} />
            <Bar
              dataKey='casos'
              fill={cor('viz.1')}
              radius={[0, 4, 4, 0]}
              maxBarSize={20}
              isAnimationActive={false}
            >
              <LabelList
                dataKey='casos'
                position='right'
                fill={cor('ink.secondary')}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
