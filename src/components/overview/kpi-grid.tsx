import { ReactNode } from 'react'
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from '@chakra-ui/icons'
import { Box, HStack, SimpleGrid, Skeleton, Text } from '@chakra-ui/react'
import {
  formatNumber,
  formatPercent,
  formatVariacao,
  fracao,
} from '../../helpers/format'
import type { ComparativoAno, Resumo } from '../../types/srag'

interface StatTileProps {
  rotulo: string
  valor?: number
  rodape?: ReactNode
  carregando?: boolean
}

function StatTile({ rotulo, valor, rodape, carregando }: StatTileProps) {
  return (
    <Box
      bg='surface'
      borderWidth='1px'
      borderColor='line.border'
      borderRadius='xl'
      p={5}
    >
      <Text fontSize='sm' color='ink.secondary'>
        {rotulo}
      </Text>
      {carregando || valor === undefined ? (
        <>
          <Skeleton h='2.25rem' w='60%' mt={2} />
          <Skeleton h='1rem' w='80%' mt={3} />
        </>
      ) : (
        <>
          <Text fontSize='3xl' fontWeight='600' lineHeight='1.2' mt={1}>
            {formatNumber(valor)}
          </Text>
          {rodape && (
            <Box mt={2} fontSize='xs' color='ink.secondary'>
              {rodape}
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

function Variacao({ linha }: { linha: ComparativoAno }) {
  const comparacao = linha.comparacaoAnoAnterior
  if (!comparacao || comparacao.variacaoPercentual === null) return null
  const v = comparacao.variacaoPercentual
  const referencia =
    comparacao.criterio === 'mesmo_periodo'
      ? `vs. as mesmas ${comparacao.semanas} semanas de ${linha.ano - 1}`
      : `vs. ${linha.ano - 1}`
  const Icone = v > 0 ? ArrowUpIcon : v < 0 ? ArrowDownIcon : MinusIcon
  const corTexto =
    v > 0 ? 'status.critical' : v < 0 ? 'status.good' : 'ink.secondary'

  return (
    <HStack spacing={1} align='center'>
      <Icone boxSize={3} color={corTexto} aria-hidden />
      <Text as='span' fontWeight='600' color={corTexto}>
        {formatVariacao(v)}
      </Text>
      <Text as='span'>
        {referencia} ({formatNumber(comparacao.casosAnoAnterior)})
      </Text>
    </HStack>
  )
}

interface KpiGridProps {
  resumo?: Resumo
  linhaAno?: ComparativoAno
  carregando?: boolean
}

export function KpiGrid({ resumo, linhaAno, carregando }: KpiGridProps) {
  const total = resumo?.totalCasos ?? 0
  const semClassificacao = resumo?.porClassificacao.em_investigacao ?? 0

  return (
    <SimpleGrid
      as='section'
      aria-label='Indicadores do período'
      columns={{ base: 1, sm: 2, xl: 4 }}
      spacing={4}
    >
      <StatTile
        rotulo='Casos de SRAG'
        valor={resumo?.totalCasos}
        carregando={carregando}
        rodape={
          linhaAno ? (
            <Variacao linha={linhaAno} />
          ) : (
            `${formatNumber(resumo?.hospitalizados ?? 0)} hospitalizados`
          )
        }
      />
      <StatTile
        rotulo='Internados em UTI'
        valor={resumo?.internadosUti}
        carregando={carregando}
        rodape={`${formatPercent(
          fracao(resumo?.internadosUti ?? 0, total),
        )} dos casos`}
      />
      <StatTile
        rotulo='Óbitos por SRAG'
        valor={resumo?.obitosSrag}
        carregando={carregando}
        rodape={`${formatPercent(
          fracao(resumo?.obitosSrag ?? 0, total),
          1,
        )} dos casos · ${formatNumber(
          resumo?.obitosOutrasCausas ?? 0,
        )} por outras causas`}
      />
      <StatTile
        rotulo='Aguardando desfecho'
        valor={resumo?.casosEmAberto}
        carregando={carregando}
        rodape={`${formatNumber(
          semClassificacao,
        )} ainda sem classificação final`}
      />
    </SimpleGrid>
  )
}
