import { useMemo } from 'react'
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
import { formatNumber, formatPercent, fracao } from '../../helpers/format'
import { CLASSIFICACOES, cor } from '../../helpers/labels'
import type { ComparativoAno } from '../../types/srag'
import { ChartCard } from './chart-card'
import { CaixaTooltip, Legenda, cursorFaixa, eixo, grade } from './chart-parts'

interface AnnualChartProps {
  anos?: ComparativoAno[]
  anoSelecionado?: number | null
  carregando?: boolean
  erro?: unknown
}

interface TickProps {
  x: number
  y: number
  payload: { value: string }
}

function rotuloAno(linha: ComparativoAno) {
  return linha.parcial ? `${linha.ano}*` : String(linha.ano)
}

function TooltipAnual({ active, payload }: TooltipProps<number, string>) {
  const linha = payload?.[0]?.payload as
    | (ComparativoAno & { rotulo: string })
    | undefined
  if (!active || !linha) return null
  return (
    <CaixaTooltip
      titulo={`${linha.ano}${
        linha.parcial ? ` (até a SE ${linha.semanasNoPeriodo})` : ''
      } · ${formatNumber(linha.totalCasos)} casos`}
      linhas={CLASSIFICACOES.filter(
        (c) => linha.porClassificacao[c.chave] > 0,
      ).map((c) => ({
        rotulo: c.rotulo,
        valor: `${formatNumber(
          linha.porClassificacao[c.chave],
        )} (${formatPercent(
          fracao(linha.porClassificacao[c.chave], linha.totalCasos),
        )})`,
        cor: c.cor,
      }))}
      nota={`${formatNumber(linha.obitosSrag)} óbitos por SRAG · ${formatNumber(
        linha.internadosUti,
      )} em UTI`}
    />
  )
}

export function AnnualChart({
  anos,
  anoSelecionado,
  carregando,
  erro,
}: AnnualChartProps) {
  const dados = useMemo(
    () =>
      (anos ?? []).map((linha) => ({
        ...linha,
        rotulo: rotuloAno(linha),
        ...Object.fromEntries(
          CLASSIFICACOES.map((c) => [c.chave, linha.porClassificacao[c.chave]]),
        ),
      })),
    [anos],
  )
  const parcial = anos?.find((a) => a.parcial)

  return (
    <ChartCard
      titulo='Casos por ano e o que os causou'
      subtitulo='Classificação final de cada caso. A covid-19 dominou 2020 e 2021 e hoje quase desapareceu dos registros de SRAG.'
      carregando={carregando}
      erro={erro}
      legenda={
        <Legenda
          itens={CLASSIFICACOES.map((c) => ({ rotulo: c.rotulo, cor: c.cor }))}
        />
      }
      tabela={{
        colunas: [
          'Ano',
          'Casos',
          ...CLASSIFICACOES.map((c) => c.rotulo),
          'UTI',
          'Óbitos',
        ],
        linhas: (anos ?? []).map((a) => [
          rotuloAno(a),
          a.totalCasos,
          ...CLASSIFICACOES.map((c) => a.porClassificacao[c.chave]),
          a.internadosUti,
          a.obitosSrag,
        ]),
      }}
      rodape={
        parcial
          ? `* ${parcial.ano} até a semana epidemiológica ${parcial.semanasNoPeriodo}.`
          : undefined
      }
    >
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={dados}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid {...grade} />
          <XAxis
            dataKey='rotulo'
            {...eixo}
            tick={({ x, y, payload }: TickProps) => {
              const ativo =
                payload.value.replace('*', '') === String(anoSelecionado)
              return (
                <text
                  x={x}
                  y={y + 14}
                  textAnchor='middle'
                  fontSize={12}
                  fontWeight={ativo ? 700 : 400}
                  fill={cor(ativo ? 'ink.primary' : 'ink.muted')}
                >
                  {payload.value}
                </text>
              )
            }}
          />
          <YAxis {...eixo} axisLine={false} allowDecimals={false} width={48} />
          <Tooltip content={<TooltipAnual />} cursor={cursorFaixa} />
          {CLASSIFICACOES.map((c) => (
            <Bar
              key={c.chave}
              dataKey={c.chave}
              name={c.rotulo}
              stackId='classificacao'
              fill={c.cor}
              stroke={cor('surface')}
              strokeWidth={1}
              maxBarSize={40}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
